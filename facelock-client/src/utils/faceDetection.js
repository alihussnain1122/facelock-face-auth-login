// Face detection utility with proper TensorFlow.js setup
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as faceapi from 'face-api.js/dist/face-api.esm.js';

let isInitialized = false;
let modelsLoaded = false;
let initializationPromise = null;

export const initializeFaceAPI = async () => {
  // If already initialized, return the cached result
  if (isInitialized) return { success: true, modelsLoaded };
  
  // If initialization is in progress, wait for it
  if (initializationPromise) return initializationPromise;

  // Start new initialization
  initializationPromise = performInitialization();
  return initializationPromise;
};

const performInitialization = async () => {
  try {
    console.log('Initializing TensorFlow.js and face-api.js...');
    
    // Ensure TensorFlow.js is ready
    await tf.ready();
    console.log('TensorFlow.js is ready');
    
    // Set backend with better error handling
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('WebGL backend set successfully');
    } catch (webglError) {
      console.warn('WebGL backend failed, falling back to CPU:', webglError);
      try {
        await tf.setBackend('cpu');
        await tf.ready();
        console.log('CPU backend set successfully');
      } catch (cpuError) {
        console.error('Both WebGL and CPU backends failed:', cpuError);
        throw new Error('No suitable TensorFlow.js backend available');
      }
    }

    // Load face-api.js models with individual error handling
    const MODEL_URL = '/models';
    console.log('Loading face detection models...');
    
    const modelLoadingPromises = [
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        .then(() => console.log('TinyFaceDetector loaded'))
        .catch(err => { throw new Error(`Failed to load TinyFaceDetector: ${err.message}`); }),
      
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        .then(() => console.log('FaceLandmark68Net loaded'))
        .catch(err => { throw new Error(`Failed to load FaceLandmark68Net: ${err.message}`); }),
      
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        .then(() => console.log('FaceRecognitionNet loaded'))
        .catch(err => { throw new Error(`Failed to load FaceRecognitionNet: ${err.message}`); })
    ];

    await Promise.all(modelLoadingPromises);

    // Verify models are loaded
    const allLoaded = 
      faceapi.nets.tinyFaceDetector.isLoaded &&
      faceapi.nets.faceLandmark68Net.isLoaded &&
      faceapi.nets.faceRecognitionNet.isLoaded;

    if (!allLoaded) {
      const loadedStatus = {
        tinyFaceDetector: faceapi.nets.tinyFaceDetector.isLoaded,
        faceLandmark68Net: faceapi.nets.faceLandmark68Net.isLoaded,
        faceRecognitionNet: faceapi.nets.faceRecognitionNet.isLoaded
      };
      throw new Error(`Failed to load all required models. Status: ${JSON.stringify(loadedStatus)}`);
    }

    console.log('All models loaded successfully');
    isInitialized = true;
    modelsLoaded = true;
    
    return { success: true, modelsLoaded: true };
  } catch (error) {
    console.error('Failed to initialize face API:', error);
    initializationPromise = null; // Reset so we can try again
    return { success: false, error: error.message };
  }
};

export const detectFaceDescriptor = async (videoElement) => {
  if (!modelsLoaded) {
    throw new Error('Models not loaded. Please initialize face API first.');
  }

  if (!videoElement) {
    throw new Error('Video element is required');
  }

  if (videoElement.readyState !== 4) {
    throw new Error('Video element not ready. Current readyState: ' + videoElement.readyState);
  }

  try {
    console.log('Detecting face...');
    
    // Ensure we're in the right TensorFlow.js context
    const detection = await tf.tidy(() => {
      return faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.3
        }))
        .withFaceLandmarks()
        .withFaceDescriptor();
    });

    if (detection && detection.descriptor) {
      // Convert to plain array to avoid tensor memory issues
      const descriptor = Array.from(detection.descriptor);
      console.log('Face detected successfully, descriptor length:', descriptor.length);
      return descriptor;
    } else {
      throw new Error('No face detected');
    }
  } catch (error) {
    console.error('Face detection error:', error);
    throw error;
  }
};

export const isModelsLoaded = () => modelsLoaded;
