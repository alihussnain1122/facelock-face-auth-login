// components/WebcamCapture.js
import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { initializeFaceAPI, detectFaceDescriptor } from '../utils/faceDetection';

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);

  const loadModels = async () => {
    try {
      const result = await initializeFaceAPI();
      if (result.success) {
        setModelsLoaded(true);
        console.log("Face API initialized successfully");
      } else {
        console.error("Failed to initialize face API:", result.error);
        alert("Failed to load face detection models. Please refresh the page.");
      }
    } catch (err) {
      console.error("Error initializing face API:", err);
      alert("Failed to load face detection models. Please refresh the page.");
    }
  };

  const captureFaceDescriptor = async () => {
    if (!modelsLoaded) {
      alert("Please wait until models are loaded.");
      return;
    }

    setCapturing(true);
    try {
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        throw new Error('Webcam not ready');
      }

      console.log('Starting face detection...');
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      const descriptor = await detectFaceDescriptor(video);
      console.log('Face descriptor generated, length:', descriptor.length);
      onCapture(descriptor);
      setFaceCaptured(true);
    } catch (err) {
      console.error("Error capturing face:", err);
      alert(`Error capturing face: ${err.message}. Please try again.`);
    } finally {
      setCapturing(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          videoConstraints={{ width: 320, height: 240, facingMode: 'user' }}
          className="rounded-md border border-gray-300"
        />

        {!modelsLoaded && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white text-sm">Loading models...</p>
          </div>
        )}
      </div>

      <button
        onClick={captureFaceDescriptor}
        disabled={!modelsLoaded || capturing}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
          faceCaptured
            ? 'bg-green-500 text-white'
            : !modelsLoaded || capturing
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {capturing ? 'Capturing...' : faceCaptured ? 'Face Captured!' : 'Capture Face'}
      </button>

      {faceCaptured && (
        <button
          onClick={() => {
            setFaceCaptured(false);
            onCapture(null);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Capture Again
        </button>
      )}
    </div>
  );
};

export default WebcamCapture;
