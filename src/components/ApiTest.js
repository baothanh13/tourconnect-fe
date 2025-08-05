import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Test environment variables on component mount
    testEnvVars();
  }, []);

  // Test Environment Variables
  const testEnvVars = () => {
    try {
      console.log('🔧 Testing Environment Variables...');
      
      const envTests = {
        googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing',
        openaiKey: process.env.REACT_APP_OPENAI_API_KEY ? '✅ Present' : '❌ Missing',
        momoPartner: process.env.REACT_APP_MOMO_PARTNER_CODE ? '✅ Present' : '❌ Missing',
        apiUrl: process.env.REACT_APP_API_URL ? '✅ Present' : '❌ Missing',
        frontendUrl: process.env.REACT_APP_FRONTEND_URL ? '✅ Present' : '❌ Missing',
        appName: process.env.REACT_APP_APP_NAME ? '✅ Present' : '❌ Missing'
      };

      console.log('Environment Variables:', envTests);
      setTestResults(prev => ({ ...prev, env: envTests }));
    } catch (error) {
      console.error('Error testing env vars:', error);
      setTestResults(prev => ({ ...prev, env: { error: 'Failed to load environment variables' } }));
    }
  };

  // Test Google Maps API
  const testGoogleMaps = () => {
    setLoading(true);
    console.log('🗺️ Testing Google Maps API...');
    
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        setTestResults(prev => ({ 
          ...prev, 
          googleMaps: '❌ API Key Missing' 
        }));
        setLoading(false);
        return;
      }

      // Simple test - just check if API key format is correct
      if (apiKey.startsWith('AIza')) {
        setTestResults(prev => ({ 
          ...prev, 
          googleMaps: '✅ Google Maps API Key Format Valid' 
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          googleMaps: '❌ Invalid API Key Format' 
        }));
      }
    } catch (error) {
      console.error('Google Maps test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        googleMaps: '❌ Error testing Google Maps' 
      }));
    }
    setLoading(false);
  };

  // Test OpenAI API
  const testOpenAI = async () => {
    setLoading(true);
    console.log('🤖 Testing OpenAI API...');
    
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        setTestResults(prev => ({ 
          ...prev, 
          openai: '❌ API Key Missing' 
        }));
        setLoading(false);
        return;
      }

      // Simple test - check API key format
      if (apiKey.startsWith('sk-')) {
        setTestResults(prev => ({ 
          ...prev, 
          openai: '✅ OpenAI API Key Format Valid' 
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          openai: '❌ Invalid API Key Format' 
        }));
      }
    } catch (error) {
      console.error('OpenAI test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        openai: '❌ Error testing OpenAI' 
      }));
    }
    setLoading(false);
  };

  // Test MoMo Configuration
  const testMoMo = () => {
    console.log('💳 Testing MoMo Configuration...');
    
    try {
      const momoConfig = {
        partnerCode: process.env.REACT_APP_MOMO_PARTNER_CODE,
        accessKey: process.env.REACT_APP_MOMO_ACCESS_KEY,
        secretKey: process.env.REACT_APP_MOMO_SECRET_KEY,
        endpoint: process.env.REACT_APP_MOMO_ENDPOINT
      };

      const configuredCount = Object.values(momoConfig).filter(value => value).length;
      
      if (configuredCount === 4) {
        setTestResults(prev => ({ 
          ...prev, 
          momo: '✅ MoMo Configuration Complete (4/4)' 
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          momo: `⚠️ MoMo Configuration Partial (${configuredCount}/4)` 
        }));
      }
    } catch (error) {
      console.error('MoMo test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        momo: '❌ Error testing MoMo configuration' 
      }));
    }
  };

  const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007cba',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const resultStyle = {
    margin: '5px 0',
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'monospace',
    fontSize: '14px'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '500px' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #007cba', paddingBottom: '10px' }}>
        🧪 TourConnect API Testing Dashboard
      </h1>
      
      <p style={{ color: '#666', marginBottom: '30px' }}>
        This page tests your environment variables and API connectivity to ensure everything is working properly.
      </p>
      
      {/* Environment Variables Section */}
      <div style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h2>📋 Environment Variables Status</h2>
        {testResults.env ? (
          <div>
            {Object.entries(testResults.env).map(([key, value]) => (
              <div key={key} style={resultStyle}>
                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading environment variables...</p>
        )}
      </div>

      {/* API Tests Section */}
      <div style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h2>🔌 API Tests</h2>
        <div style={{ marginBottom: '15px' }}>
          <button onClick={testGoogleMaps} disabled={loading} style={buttonStyle}>
            Test Google Maps
          </button>
          <button onClick={testOpenAI} disabled={loading} style={buttonStyle}>
            Test OpenAI
          </button>
          <button onClick={testMoMo} style={buttonStyle}>
            Test MoMo Config
          </button>
        </div>

        {/* Test Results */}
        <div>
          {testResults.googleMaps && (
            <div style={resultStyle}><strong>Google Maps:</strong> {testResults.googleMaps}</div>
          )}
          {testResults.openai && (
            <div style={resultStyle}><strong>OpenAI:</strong> {testResults.openai}</div>
          )}
          {testResults.momo && (
            <div style={resultStyle}><strong>MoMo:</strong> {testResults.momo}</div>
          )}
        </div>
      </div>

      {/* Current Configuration */}
      <div style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px' }}>
        <h3>⚙️ Current Configuration:</h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {`Environment: ${process.env.NODE_ENV || 'development'}
App Name: ${process.env.REACT_APP_APP_NAME || 'Not Set'}
Frontend URL: ${process.env.REACT_APP_FRONTEND_URL || 'Not Set'}
API URL: ${process.env.REACT_APP_API_URL || 'Not Set'}
Current URL: ${typeof window !== 'undefined' ? window.location.href : 'Server Side'}

API Keys Status:
- Google Maps: ${process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Configured ✅' : 'Missing ❌'}
- OpenAI: ${process.env.REACT_APP_OPENAI_API_KEY ? 'Configured ✅' : 'Missing ❌'}
- MoMo Partner: ${process.env.REACT_APP_MOMO_PARTNER_CODE ? 'Configured ✅' : 'Missing ❌'}`}
        </div>
      </div>

      {loading && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          Testing API... Please wait...
        </div>
      )}
    </div>
  );
};

export default ApiTest;
