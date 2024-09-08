from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid as UUID
import os
import supabase
from ai_model import CarImageProcessor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
app.config['SECRET_KEY'] = 'secret2024' 

# Supabase client initialization
supabase_url = 'https://cdoyajvdzbogyksjokeg.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb3lhanZkemJvZ3lrc2pva2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2MzgyNzQsImV4cCI6MjA0MTIxNDI3NH0.xJTZvdUUkTqA7QLO-uCd9gpnvUZlL7NN2_GkSgBZijo'
supabase_client = supabase.create_client(supabase_url, supabase_key)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS 

@app.route('/api/signup', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    result = supabase_client.auth.sign_up({
        "email": email,
        "password": password,
        "options": {
            "data": {
                "name": name
            }
        }
    })
    if result.user:
        return jsonify({
            'message': 'User registered successfully',
            'user_id': result.user.id,
            'email': result.user.email
        }), 201
    else:
        print(result.error)
        return jsonify({'error': str(result.error)}), 400
    
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    result = supabase_client.auth.sign_in_with_password({
        "email": email,
        "password": password,
    })

    if result.user:
        user_metadata = result.user.user_metadata
        user_name = user_metadata.get("name") if user_metadata else 'Unknown'
        user_id = result.user.id
        print(f"User {user_name} with ID {user_id} logged in.")

        token = "token" # placeholder for an actual token generation
        
        return jsonify({'user': {'email': email, 'name': user_name, "user_id": user_id}, 'token': token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/recognise', methods=['POST'])
def recognize_car_api():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = UUID.uuid4().hex + '.' + file.filename.rsplit('.', 1)[1].lower()
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        CIP = CarImageProcessor.CarImageProcessor(url="", imagePath=filepath, debug=True)
        results = CIP.recognise_car(CIP.process_image()[0])
        

        # Upload image to Supabase storage if the user is authenticated
        try:
            headers = request.headers.get('Authentication')
            user_id = headers.split(' ')[1] if headers != 'UserID null' else None
            if user_id:
                storage_file_path = f"{user_id}/{filename}"

                # Upload the file to Supabase storage
                with open(filepath, 'rb') as file:
                    result = supabase_client.storage.from_('recognitions').upload(
                        path=storage_file_path,
                        file=file
                    )
                    print("Upload result:", result)
                    supabase_client.table('recognitions').insert({
                        'user_id': user_id,
                        'image_url': f'https://cdoyajvdzbogyksjokeg.supabase.co/storage/v1/object/public/recognitions/{filename}'
                    }).execute()
                
        except Exception as e:
            print(f"Error uploading to Supabase: {e}")
        
        return jsonify({'results': results})
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/dashboarddata', methods=['GET'])
def get_dashboard_data():
    headers = request.headers.get('Authentication')
    user_id = headers.split(' ')[1] if headers != 'UserID null' else None
    if user_id:
        response = supabase_client.table('recognitions').select('*').eq('user_id', user_id).execute()
        return jsonify(response.data), 200
    else:
        return jsonify({'error': 'User not authenticated'}), 401
        

@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)
