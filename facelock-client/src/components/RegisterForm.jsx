import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WebcamCapture from './WebcamCapture';
import axios from 'axios';

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: basic info, 2: face capture

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBasicInfoSubmit = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setMsg("Please fill in all fields");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setMsg("Password must be at least 6 characters long");
      return;
    }

    setMsg("");
    setStep(2);
  };

  const handleFaceSubmit = async () => {
    if (!faceDescriptor) {
      setMsg("Please capture your face first");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        faceDescriptor
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join FaceLock for secure authentication</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-700">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <button
                onClick={handleBasicInfoSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Continue to Face Setup
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Face Recognition Setup</h3>
                <p className="text-sm text-gray-600 mb-4">Capture your face for secure authentication</p>
              </div>
              
              <div className="flex justify-center">
                <WebcamCapture onCapture={setFaceDescriptor} />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleFaceSubmit}
                  disabled={loading || !faceDescriptor}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          )}

          {msg && (
            <div className={`p-4 rounded-lg text-center ${
              msg.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {msg}
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
