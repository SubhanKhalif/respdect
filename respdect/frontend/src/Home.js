import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // State for image preview
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection and image preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPrediction(null);
    setError(null);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  // Handle the image submission for prediction
  const handleDiagnose = async () => {
    if (!selectedFile) {
      setError('Please upload an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setIsLoading(true);
    setError(null);

    try {
      // Send the image file to the Flask backend
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data); // Store prediction results
    } catch (error) {
      console.error('Error during diagnosis:', error);

      // Differentiate between client-side and server-side errors
      if (error.response) {
        setError(`Server Error: ${error.response.data.error || 'Unknown error occurred'}`);
      } else if (error.request) {
        setError('No response received from the server. Please ensure the backend is running.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="card">
        <h2>Covid-19 X-ray Diagnosis</h2>

        {/* File input for selecting image */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="file-input"
        />

        {/* Image preview */}
        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Image Preview" className="preview-img" />
          </div>
        )}

        {/* Diagnose button */}
        <button 
          className="diagnose-button" 
          onClick={handleDiagnose}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'Diagnosing...' : 'Diagnose'}
        </button>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Prediction Result */}
        {prediction && (
          <div className="prediction">
            <h3>Prediction Results:</h3>
            <p>Class: {prediction.class_name}</p>
            <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
