from flask import Flask, request, jsonify, send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
import os
from flask_cors import CORS
import tensorflow as tf

# Initialize Flask app
disease_app = Flask(__name__)
CORS(disease_app)  # Allow cross-origin requests for PWA integration

# Load the trained model
MODEL_FILE = 'crop_disease_model.h5'
if not os.path.exists(MODEL_FILE):
    raise FileNotFoundError(f"Model file '{MODEL_FILE}' not found. Please train the model first using train_model.py")

model = load_model(MODEL_FILE)

# Load class labels from labels.txt
with open('labels.txt', 'r') as f:
    disease_classes = [line.strip() for line in f.readlines()]

# Define treatment recommendations for each disease
treatment_recommendations = {
    "Apple___Apple_scab": "Apply fungicides like captan or myclobutanil. Remove infected leaves.",
    "Apple___Black_rot": "Prune infected branches. Apply copper-based fungicides.",
    "Apple___Cedar_apple_rust": "Remove nearby cedar trees. Use fungicides like myclobutanil.",
    "Apple___healthy": "No action needed. Continue regular monitoring.",
    "Blueberry___healthy": "No action needed. Maintain good soil and watering practices.",
    "Cherry_(including_sour)___Powdery_mildew": "Apply sulfur-based fungicides. Improve air circulation.",
    "Cherry_(including_sour)___healthy": "No action needed. Regular pruning recommended.",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "Use resistant varieties. Apply fungicides like azoxystrobin.",
    "Corn_(maize)___Common_rust_": "Apply fungicides containing triazole. Remove infected leaves.",
    "Corn_(maize)___Northern_Leaf_Blight": "Use crop rotation. Apply fungicides like chlorothalonil.",
    "Corn_(maize)___healthy": "No action needed. Monitor for pests.",
    "Grape___Black_rot": "Prune infected parts. Apply fungicides like mancozeb.",
    "Grape___Esca_(Black_Measles)": "Remove infected vines. No chemical cure available.",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "Apply copper fungicides. Improve drainage.",
    "Grape___healthy": "No action needed. Regular fertilization.",
    "Peach___healthy": "No action needed. Watch for peach leaf curl.",
    "Pepper,_bell___Bacterial_spot": "Use copper sprays. Avoid overhead watering.",
    "Pepper,_bell___healthy": "No action needed. Ensure proper nutrition.",
    "Potato___Early_blight": "Apply fungicides like chlorothalonil. Rotate crops.",
    "Potato___Late_blight": "Use fungicides like mancozeb. Destroy infected plants.",
    "Potato___healthy": "No action needed. Store properly after harvest.",
    "Raspberry___healthy": "No action needed. Prune regularly.",
    "Soybean___healthy": "No action needed. Monitor for aphids.",
    "Squash___Powdery_mildew": "Apply sulfur or potassium bicarbonate. Improve air flow.",
    "Strawberry___Leaf_scorch": "Remove infected leaves. Apply fungicides if severe.",
    "Strawberry___healthy": "No action needed. Mulch to retain moisture.",
    "Tomato___Bacterial_spot": "Use copper fungicides. Stake plants for air circulation.",
    "Tomato___Early_blight": "Apply chlorothalonil. Mulch around plants.",
    "Tomato___Late_blight": "Remove infected plants. Use fungicides like mancozeb.",
    "Tomato___Leaf_Mold": "Increase ventilation. Apply fungicides like chlorothalonil.",
    "Tomato___Septoria_leaf_spot": "Remove lower leaves. Apply copper fungicides.",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Use insecticidal soap. Increase humidity.",
    "Tomato___Target_Spot": "Apply fungicides like azoxystrobin. Avoid wet foliage.",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Control whiteflies. Use resistant varieties.",
    "Tomato___Tomato_mosaic_virus": "Remove infected plants. Disinfect tools.",
    "Tomato___healthy": "No action needed. Regular watering and fertilization."
}

@disease_app.route('/predict', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    img_file = request.files['image']

    # Create temp directory if it doesn't exist
    temp_dir = 'temp_images'
    os.makedirs(temp_dir, exist_ok=True)
    img_path = os.path.join(temp_dir, img_file.filename)

    try:
        # Save the uploaded image
        img_file.save(img_path)

        # Preprocess the image
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)  # Use MobileNetV2 preprocessing

        # Make prediction
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions)
        predicted_disease = disease_classes[predicted_index]
        confidence_score = float(np.max(predictions))

        # Get treatment recommendation
        treatment = treatment_recommendations.get(predicted_disease, "Consult local agricultural extension for specific advice.")

        # Return the result
        return jsonify({
            'disease': predicted_disease,
            'confidence': round(confidence_score * 100, 2),  # Convert to percentage
            'treatment': treatment
        })

    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    finally:
        # Clean up the temporary image file
        if os.path.exists(img_path):
            os.remove(img_path)

@disease_app.route('/')
def index():
    return send_from_directory('.', 'agro.html')

@disease_app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    print("Starting AgroLens Disease Detection API...")
    disease_app.run(host='0.0.0.0', port=5000, debug=True)
