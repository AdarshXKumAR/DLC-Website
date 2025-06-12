from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import google.generativeai as genai
import os
import json
import logging
from datetime import datetime
import speech_recognition as sr
import io
from werkzeug.utils import secure_filename
import tempfile
from dotenv import load_dotenv
import PyPDF2
from PIL import Image
import base64

# Load environment variables from .env.local
load_dotenv('.env.local')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY must be set in .env.local file")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model (using Flash as requested)
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize Speech Recognition
recognizer = sr.Recognizer()

# File upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'mp3', 'wav', 'ogg', 'm4a', 'webm'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory storage for feedback (in production, use a database)
feedback_storage = []
chat_history = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath):
    """Extract text from PDF file"""
    try:
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text[:2000]  # Limit to first 2000 characters
    except Exception as e:
        logger.error(f"Error extracting PDF text: {str(e)}")
        return "Could not extract text from PDF"

def process_image_file(filepath):
    """Process image file for Gemini"""
    try:
        with open(filepath, 'rb') as img_file:
            img_data = img_file.read()
            img_base64 = base64.b64encode(img_data).decode('utf-8')
            return {
                "mime_type": f"image/{filepath.split('.')[-1].lower()}",
                "data": img_base64
            }
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return None

def get_digital_literacy_context():
    """Return context-specific information for digital literacy assistance"""
    return """
    You are TechBuddy, a helpful AI assistant specialized in digital literacy for parents and elderly users.
    Your role is to help users learn essential digital skills in a simple, patient, and encouraging manner.
    
    Key areas you help with:
    - WhatsApp: messaging, calls, sharing photos, video calls, group chats
    - Paytm & Digital Payments: account setup, money transfer, bill payments, security
    - Google Maps: navigation, finding places, getting directions, saving locations
    - Email & Gmail: account setup, sending/receiving emails, attachments, organization
    - Social Media Safety: privacy settings, recognizing scams, safe sharing
    - Online Shopping: trusted sites, secure payments, reading reviews, order tracking
    
    Guidelines for responses:
    - Use simple, clear language
    - Break down complex tasks into step-by-step instructions
    - Be patient and encouraging
    - Provide safety tips when relevant
    - Ask follow-up questions to better understand user needs
    - Use examples relevant to Indian context when applicable
    - Support both English and Hindi languages
    - If user sends an image, analyze it and provide relevant guidance
    - If user sends a document, read it and help with digital literacy questions related to it
    
    Always be supportive and remember that learning technology can be intimidating for some users.
    """

@app.route('/')
def home():
    """Serve the main HTML page"""
    return jsonify({"message": "Digital Literacy Hub Backend is running!", "status": "healthy"})

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages with Gemini API"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message']
        session_id = data.get('session_id', 'default')
        language = data.get('language', 'en')
        file_context = data.get('file_context', '')
        
        # Initialize chat history for session if not exists
        if session_id not in chat_history:
            chat_history[session_id] = []
        
        # Add user message to history
        chat_history[session_id].append({"role": "user", "content": user_message})
        
        # Prepare context and conversation history
        context = get_digital_literacy_context()
        
        # Build conversation context
        conversation_context = context + "\n\nConversation History:\n"
        for msg in chat_history[session_id][-10:]:  # Last 10 messages for context
            conversation_context += f"{msg['role'].capitalize()}: {msg['content']}\n"
        
        # Add file context if available
        if file_context:
            conversation_context += f"\nFile Context: {file_context}\n"
        
        # Add language preference
        if language == 'hi':
            conversation_context += "\nPlease respond in Hindi (Devanagari script) when appropriate, but you can use English for technical terms if needed."
        
        conversation_context += f"\nCurrent User Message: {user_message}\n"
        
        # Generate response using Gemini
        response = model.generate_content(conversation_context)
        bot_response = response.text
        
        # Add bot response to history
        chat_history[session_id].append({"role": "assistant", "content": bot_response})
        
        # Keep only last 20 messages to manage memory
        if len(chat_history[session_id]) > 20:
            chat_history[session_id] = chat_history[session_id][-20:]
        
        return jsonify({
            "response": bot_response,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({"error": "Failed to process chat message. Please try again."}), 500

@app.route('/api/voice-to-text', methods=['POST'])
def voice_to_text():
    """Convert uploaded voice file to text"""
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        language = request.form.get('language', 'en-US')
        
        if audio_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save the uploaded file temporarily
        file_extension = audio_file.filename.rsplit('.', 1)[1].lower() if '.' in audio_file.filename else 'wav'
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
            audio_file.save(temp_file.name)
            
            try:
                # Convert speech to text
                with sr.AudioFile(temp_file.name) as source:
                    # Adjust for ambient noise
                    recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    audio_data = recognizer.record(source)
                    
                # Set language for recognition
                if language == 'hi':
                    text = recognizer.recognize_google(audio_data, language='hi-IN')
                else:
                    text = recognizer.recognize_google(audio_data, language='en-US')
                
                # Clean up temporary file
                os.unlink(temp_file.name)
                
                return jsonify({
                    "text": text,
                    "language": language,
                    "timestamp": datetime.now().isoformat()
                })
                
            except sr.UnknownValueError:
                os.unlink(temp_file.name)
                return jsonify({"error": "Could not understand the audio. Please speak clearly and try again."}), 400
            except sr.RequestError as e:
                os.unlink(temp_file.name)
                logger.error(f"Speech recognition service error: {str(e)}")
                return jsonify({"error": "Speech recognition service is currently unavailable."}), 503
            
    except Exception as e:
        logger.error(f"Voice processing error: {str(e)}")
        return jsonify({"error": "Failed to process voice input"}), 500

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    """Handle file uploads for chat context"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        session_id = request.form.get('session_id', 'default')
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_filename = f"{timestamp}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            file.save(filepath)
            
            # Process file based on type
            file_extension = filename.rsplit('.', 1)[1].lower()
            file_info = {
                "filename": filename,
                "filepath": filepath,
                "size": os.path.getsize(filepath),
                "type": file_extension,
                "timestamp": datetime.now().isoformat()
            }
            
            # Process different file types
            content_preview = ""
            
            if file_extension == 'txt':
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content_preview = f.read()[:2000]  # Limit content length
                except Exception as e:
                    logger.error(f"Error reading text file: {str(e)}")
                    content_preview = "Could not read file content"
                    
            elif file_extension == 'pdf':
                content_preview = extract_text_from_pdf(filepath)
                
            elif file_extension in ['png', 'jpg', 'jpeg', 'gif']:
                # For images, we'll process them differently in chat
                content_preview = f"Image file uploaded: {filename}"
                file_info["is_image"] = True
                
            file_info["content_preview"] = content_preview
            
            return jsonify({
                "message": "File uploaded successfully",
                "file_info": file_info,
                "session_id": session_id
            })
        else:
            return jsonify({"error": f"File type not allowed. Supported types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
            
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        return jsonify({"error": "Failed to upload file"}), 500

@app.route('/api/chat-with-image', methods=['POST'])
def chat_with_image():
    """Handle chat messages with image attachments"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message']
        session_id = data.get('session_id', 'default')
        language = data.get('language', 'en')
        image_path = data.get('image_path', '')
        
        # Initialize chat history for session if not exists
        if session_id not in chat_history:
            chat_history[session_id] = []
        
        # Add user message to history
        chat_history[session_id].append({"role": "user", "content": user_message})
        
        # Prepare context
        context = get_digital_literacy_context()
        
        # Build conversation context
        conversation_context = context + "\n\nConversation History:\n"
        for msg in chat_history[session_id][-10:]:
            conversation_context += f"{msg['role'].capitalize()}: {msg['content']}\n"
        
        if language == 'hi':
            conversation_context += "\nPlease respond in Hindi (Devanagari script) when appropriate."
        
        conversation_context += f"\nCurrent User Message: {user_message}\n"
        
        # Prepare content for Gemini
        content_parts = [conversation_context]
        
        # Add image if provided
        if image_path and os.path.exists(image_path):
            try:
                image_data = process_image_file(image_path)
                if image_data:
                    content_parts.append({
                        "mime_type": image_data["mime_type"],
                        "data": base64.b64decode(image_data["data"])
                    })
            except Exception as e:
                logger.error(f"Error processing image for Gemini: {str(e)}")
        
        # Generate response using Gemini
        response = model.generate_content(content_parts)
        bot_response = response.text
        
        # Add bot response to history
        chat_history[session_id].append({"role": "assistant", "content": bot_response})
        
        # Keep only last 20 messages to manage memory
        if len(chat_history[session_id]) > 20:
            chat_history[session_id] = chat_history[session_id][-20:]
        
        return jsonify({
            "response": bot_response,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Chat with image error: {str(e)}")
        return jsonify({"error": "Failed to process chat message with image"}), 500

@app.route('/api/clear-chat', methods=['POST'])
def clear_chat():
    """Clear chat history for a session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id', 'default')
        
        if session_id in chat_history:
            del chat_history[session_id]
        
        return jsonify({
            "message": "Chat history cleared",
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Clear chat error: {str(e)}")
        return jsonify({"error": "Failed to clear chat"}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Handle feedback form submissions"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'category', 'message']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({"error": f"Missing or empty required field: {field}"}), 400
        
        feedback = {
            "id": len(feedback_storage) + 1,
            "name": data['name'].strip(),
            "email": data['email'].strip(),
            "category": data['category'],
            "rating": data.get('rating', 0),
            "message": data['message'].strip(),
            "timestamp": datetime.now().isoformat(),
            "status": "received"
        }
        
        feedback_storage.append(feedback)
        
        logger.info(f"New feedback received from {feedback['name']}: {feedback['category']}")
        
        return jsonify({
            "message": "Feedback submitted successfully! Thank you for helping us improve.",
            "feedback_id": feedback["id"],
            "timestamp": feedback["timestamp"]
        })
        
    except Exception as e:
        logger.error(f"Feedback submission error: {str(e)}")
        return jsonify({"error": "Failed to submit feedback"}), 500

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    """Get all feedback (admin endpoint)"""
    try:
        return jsonify({
            "feedback": feedback_storage,
            "total_count": len(feedback_storage),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Get feedback error: {str(e)}")
        return jsonify({"error": "Failed to retrieve feedback"}), 500

@app.route('/api/tutorials', methods=['GET'])
def get_tutorials():
    """Get available tutorials"""
    tutorials = {
        "whatsapp": {
            "title": "WhatsApp Basics",
            "description": "Learn to send messages, make calls, and share photos on WhatsApp",
            "difficulty": "Beginner",
            "duration": "15 minutes",
            "steps": [
                "Download WhatsApp from Play Store or App Store",
                "Enter your phone number for verification",
                "Set up your profile with name and photo",
                "Add contacts and start chatting",
                "Learn to send photos and voice messages",
                "Make voice and video calls",
                "Create and manage group chats"
            ],
            "tips": [
                "Always verify contacts before sharing personal information",
                "Use strong privacy settings",
                "Be careful about clicking unknown links"
            ]
        },
        "paytm": {
            "title": "Paytm & Digital Payments",
            "description": "Master digital payments and money transfers safely",
            "difficulty": "Intermediate",
            "duration": "20 minutes",
            "steps": [
                "Download Paytm app from official app store",
                "Complete KYC verification with Aadhaar",
                "Link your bank account securely",
                "Learn to scan QR codes for payments",
                "Send money to contacts",
                "Pay utility bills and recharge mobile",
                "Check transaction history and receipts"
            ],
            "tips": [
                "Never share your PIN or OTP with anyone",
                "Always verify merchant details before payment",
                "Keep your app updated for security",
                "Enable app lock for additional security"
            ]
        },
        "maps": {
            "title": "Google Maps Navigation",
            "description": "Find directions, locate places, and navigate with confidence",
            "difficulty": "Beginner",
            "duration": "15 minutes",
            "steps": [
                "Open Google Maps on your phone",
                "Search for your destination",
                "Select the best route option",
                "Start navigation with voice guidance",
                "Save frequently visited places",
                "Share your location with family",
                "Explore nearby restaurants and services"
            ],
            "tips": [
                "Enable location services for accurate navigation",
                "Download offline maps for areas with poor network",
                "Use voice commands while driving for safety"
            ]
        },
        "email": {
            "title": "Email & Gmail",
            "description": "Send and receive emails, manage your inbox effectively",
            "difficulty": "Beginner",
            "duration": "20 minutes",
            "steps": [
                "Create a Gmail account with strong password",
                "Compose and send your first email",
                "Reply to and forward messages",
                "Attach files and photos to emails",
                "Organize emails with labels and folders",
                "Use search to find old emails",
                "Set up email signature"
            ],
            "tips": [
                "Use descriptive subject lines",
                "Be cautious with email attachments from unknown senders",
                "Enable two-factor authentication for security"
            ]
        },
        "social": {
            "title": "Social Media Safety",
            "description": "Stay safe on Facebook, Instagram, and other social platforms",
            "difficulty": "Intermediate",
            "duration": "25 minutes",
            "steps": [
                "Set up strong privacy settings",
                "Control who can see your posts",
                "Recognize and report fake accounts",
                "Avoid sharing personal information publicly",
                "Be careful with friend requests from strangers",
                "Report inappropriate content",
                "Understand data sharing policies"
            ],
            "tips": [
                "Think before you post - it stays online forever",
                "Don't accept friend requests from strangers",
                "Report and block suspicious accounts",
                "Keep personal information private"
            ]
        },
        "shopping": {
            "title": "Online Shopping",
            "description": "Shop safely on Amazon, Flipkart, and other e-commerce sites",
            "difficulty": "Intermediate",
            "duration": "30 minutes",
            "steps": [
                "Choose trusted shopping websites",
                "Create account with secure password",
                "Read product reviews and ratings",
                "Compare prices across different sites",
                "Use secure payment methods",
                "Track your orders",
                "Understand return and refund policies"
            ],
            "tips": [
                "Always shop on secure websites (look for https://)",
                "Read return policy before purchasing",
                "Save receipts and order confirmations",
                "Be wary of deals that seem too good to be true"
            ]
        }
    }
    
    try:
        return jsonify({
            "tutorials": tutorials,
            "total_count": len(tutorials),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Get tutorials error: {str(e)}")
        return jsonify({"error": "Failed to retrieve tutorials"}), 500

@app.route('/api/tutorial/<tutorial_id>', methods=['GET'])
def get_tutorial(tutorial_id):
    """Get specific tutorial details"""
    try:
        tutorials_response = get_tutorials()
        tutorials_data = tutorials_response.get_json()
        
        if tutorial_id in tutorials_data['tutorials']:
            return jsonify({
                "tutorial": tutorials_data['tutorials'][tutorial_id],
                "tutorial_id": tutorial_id,
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({"error": "Tutorial not found"}), 404
            
    except Exception as e:
        logger.error(f"Get tutorial error: {str(e)}")
        return jsonify({"error": "Failed to retrieve tutorial"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB."}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Ensure all required directories exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # Check if API key is properly loaded
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY not found in .env.local file")
        print("Please create a .env.local file with your Gemini API key:")
        print("GEMINI_API_KEY=your_actual_api_key_here")
        exit(1)
    
    print("🚀 Digital Literacy Hub Backend Starting...")
    print("📋 Features enabled:")
    print("   ✓ AI Chat with Gemini Flash")
    print("   ✓ Voice-to-Text conversion")
    print("   ✓ File upload and processing")
    print("   ✓ Image analysis")
    print("   ✓ PDF text extraction")
    print("   ✓ Multilingual support (EN/HI)")
    print("   ✓ Feedback system")
    print("   ✓ Tutorial management")
    print("📁 Upload folder:", UPLOAD_FOLDER)
    print("🔑 API Key loaded successfully")
    
    app.run(debug=True, host='0.0.0.0', port=5000)