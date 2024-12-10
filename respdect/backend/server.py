from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
from keras.models import load_model
import os
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model (Ensure the correct path to your model file)
model = None

def load_ml_model():
    global model
    if model is None:
        model_path = (r'C:/Users/Subhan k/OneDrive/Desktop/x ray disease/prasad sahya/mega-project-react/mega-project-react/back-end/covid_detection_resnet50.h5')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at path: {model_path}")
        model = load_model(model_path)
        app.logger.info("Model loaded successfully.")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        app.logger.info("Received request at /predict endpoint.")
        load_ml_model()  # Ensure model is loaded
        app.logger.info("Model is loaded and ready for prediction.")

        # Check if image is in the request
        if 'image' not in request.files:
            app.logger.error("No image file found in the request.")
            return jsonify({'error': 'No image file provided'}), 400
        
        # Get and preprocess the image
        image_file = request.files['image']
        app.logger.info("Image file received successfully.")

        # Convert the image to RGB and resize it to the required dimensions
        image = Image.open(image_file).convert('RGB')
        image = image.resize((224, 224))  # Resize image to match model input size
        app.logger.info("Image resized to 224x224.")

        # Convert image to numpy array and expand dimensions for prediction
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
        image_array = image_array / 255.0  # Normalize the image
        app.logger.info("Image preprocessed successfully for prediction.")

        # Get the prediction
        prediction = model.predict(image_array)
        app.logger.info(f"Prediction made successfully: {prediction}")

        # Process prediction and return the result
        predicted_class = int(np.round(prediction[0][0]))  # Round off to get binary class
        confidence = float(prediction[0][0]) if predicted_class == 1 else float(1 - prediction[0][0])
        
        # Update with actual class names from your model
        class_names = ['COVID', 'Normal']  # Replace with your actual class names
        predicted_class_name = class_names[predicted_class]

        app.logger.info(f"Predicted class: {predicted_class_name} with confidence: {confidence}")

        return jsonify({
            'predicted_class': predicted_class,
            'class_name': predicted_class_name,
            'confidence': confidence
        })

    except FileNotFoundError as e:
        app.logger.error(f"File not found: {str(e)}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({'error': 'An error occurred during prediction'}), 500

if __name__ == '__main__':
    app.run(debug=True)
