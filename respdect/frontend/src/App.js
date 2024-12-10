import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import AboutUs from './AboutUs';
import Features from './Features';
import Benefits from './Benefits';
import HowItWorks from './HowItWorks';
import Home from './Home';
import axios from 'axios'; // Import axios for handling the file upload

function App() {
  const [result, setResult] = useState(''); // State to store the prediction result

  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header className="header">
          <div className="logo">Diagno</div>
          <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/features">Features</Link>
            <Link to="/benefits">Benefits</Link>
            <Link to="/about-us">About Us</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Removed X-Ray Image Disease Prediction Heading */}

          {/* Display Prediction Result */}
          {result && (
            <div className="result-section">
              <h2>Prediction Result:</h2>
              <p>{result}</p>
            </div>
          )}

          {/* Existing Routes and Components */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/features" element={<Features />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>Diagnose</p>
          <div className="socials">
            <a href="https://www.fb.com">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#instagram">Instagram</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
