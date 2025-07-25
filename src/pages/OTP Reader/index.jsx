import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiShield, FiCopy, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [latestOtp, setLatestOtp] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);

  const predefinedEmail = 'gplsonindia@gmail.com';

  useEffect(() => {
    setValidEmail(email === predefinedEmail);
  }, [email]);

  const fetchOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://gmail-test-henna.vercel.app/read-otp');

      // Axios automatically parses JSON and the result is in `response.data`
      const data = response.data;

      if (data.otps && data.otps.length > 0) {
        const lastOtp = data.otps[data.otps.length - 1];
        setLatestOtp(lastOtp);
      } else {
        setError('No OTPs found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleShowOtp = () => {
    if (validEmail) {
      setShowOtpSection(true);
      fetchOTP();
    }
  };

  const copyToClipboard = async () => {
    if (!latestOtp) return;

    try {
      await navigator.clipboard.writeText(latestOtp);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const refreshOTP = () => {
    fetchOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiMail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OTP Reader</h1>
          <p className="text-gray-600">Latest verification code from your Gmail</p>
        </div>

        {/* Email Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <button
              onClick={handleShowOtp}
              disabled={!validEmail}
              className={`w-full py-2 px-4 rounded-lg font-medium ${validEmail ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer ' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Show OTP
            </button>
          </div>
        </div>

        {/* OTP Section - Only shown after valid email */}
        {showOtpSection && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
            {/* Status Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiShield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Latest OTP</span>
              </div>
              <button
                onClick={refreshOTP}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* OTP Display */}
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 font-medium mb-2">Error</div>
                <p className="text-gray-600 text-sm">{error}</p>
                <button
                  onClick={refreshOTP}
                  className="mt-4 px-4 py-2 cursor-pointer  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={latestOtp}
                    readOnly
                    className="w-full px-4 py-3 text-lg font-mono text-center bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent selection:bg-blue-100"
                    placeholder="No OTP available"
                  />
                  {latestOtp && (
                    <button
                      onClick={copyToClipboard}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Copy OTP"
                    >
                      {copied ? (
                        <FiCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <FiCopy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Copy Status Message */}
                {copied && (
                  <div className="flex items-center justify-center space-x-2 text-green-600 text-sm font-medium animate-fade-in">
                    <FiCheck className="w-4 h-4" />
                    <span>Copied to clipboard!</span>
                  </div>
                )}

                {/* Additional Info */}
                {latestOtp && (
                  <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Click the copy icon to copy the OTP to your clipboard
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Automatically fetches the latest OTP from your Gmail
        </div>
      </div>
    </div>
  );
};

export default Login;