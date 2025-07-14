import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/verify-email', { token });
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
            status === 'success' ? 'bg-green-600' : status === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}>
            {status === 'verifying' && (
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {status === 'success' && (
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {status === 'verifying' && 'Verifying Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          
          <p className="mt-2 text-gray-600">
            {status === 'verifying' && 'Please wait while we verify your email address...'}
            {status === 'success' && 'Your email has been successfully verified. You can now sign in to your account.'}
            {status === 'error' && 'We could not verify your email address. The link may be invalid or expired.'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className={`p-4 rounded-lg text-center ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : status === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message}
          </div>

          {status === 'success' && (
            <Link
              to="/"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
            >
              Sign In Now
            </Link>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Link
                to="/register"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
              >
                Try Registration Again
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
