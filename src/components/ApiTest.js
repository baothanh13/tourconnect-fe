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
  };

  // Test Google Maps API
  const testGoogleMaps = () => {
    setLoading(true);
    console.log('🗺️ Testing Google Maps API...');
    
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setTestResults(prev => ({ 
        ...prev, 
        googleMaps: '❌ API Key Missing' 
      }));
      setLoading(false);
      return;
    }

    // Test by loading a simple map
    const testUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    
    window.initMap = () => {
      console.log('✅ Google Maps API loaded successfully!');
      setTestResults(prev => ({ 
        ...prev, 
        googleMaps: '✅ Google Maps API Working' 
      }));
      setLoading(false);
    };

    const script = document.createElement('script');
    script.src = testUrl;
    script.onerror = () => {
      console.log('❌ Google Maps API failed to load');
      setTestResults(prev => ({ 
        ...prev, 
        googleMaps: '❌ Google Maps API Failed - Check API Key' 
      }));
      setLoading(false);
    };
    
    document.head.appendChild(script);
  };

  // Test OpenAI API
  const testOpenAI = async () => {
    setLoading(true);
    console.log('🤖 Testing OpenAI API...');
    
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      setTestResults(prev => ({ 
        ...prev, 
        openai: '❌ API Key Missing' 
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ OpenAI API working! Available models:', data.data?.length || 0);
        setTestResults(prev => ({ 
          ...prev, 
          openai: `✅ OpenAI API Working (${data.data?.length || 0} models available)` 
        }));
      } else if (response.status === 401) {
        console.log('❌ OpenAI API: Invalid API key');
        setTestResults(prev => ({ 
          ...prev, 
          openai: '❌ OpenAI API: Invalid API Key' 
        }));
      } else {
        console.log('❌ OpenAI API failed:', response.status);
        setTestResults(prev => ({ 
          ...prev, 
          openai: `❌ OpenAI API Failed: ${response.status}` 
        }));
      }
    } catch (error) {
      console.log('❌ OpenAI API Error:', error.message);
      setTestResults(prev => ({ 
        ...prev, 
        openai: `❌ Error: ${error.message}` 
      }));
    }
    setLoading(false);
  };

  // Test MoMo Payment Configuration
  const testMoMo = () => {
    console.log('💳 Testing MoMo Configuration...');
    
    const momoConfig = {
      partnerCode: process.env.REACT_APP_MOMO_PARTNER_CODE,
      accessKey: process.env.REACT_APP_MOMO_ACCESS_KEY,
      secretKey: process.env.REACT_APP_MOMO_SECRET_KEY,
      endpoint: process.env.REACT_APP_MOMO_ENDPOINT
    };

    const isConfigured = Object.values(momoConfig).every(value => value);
    
    if (isConfigured) {
      console.log('✅ MoMo configuration complete');
      setTestResults(prev => ({ 
        ...prev, 
        momo: '✅ MoMo Configuration Complete' 
      }));
    } else {
      console.log('❌ MoMo configuration incomplete:', momoConfig);
      setTestResults(prev => ({ 
        ...prev, 
        momo: '❌ MoMo Configuration Incomplete' 
      }));
    }
  };

  // Test API URL Connectivity
  const testApiUrl = async () => {
    setLoading(true);
    console.log('🌐 Testing API URL...');
    
    const apiUrl = process.env.REACT_APP_API_URL;
    
    if (!apiUrl) {
      setTestResults(prev => ({ 
        ...prev, 
        apiConnection: '❌ API URL Not Set' 
      }));
      setLoading(false);
      return;
    }

    try {
      // Try to connect to the API endpoint
      const response = await fetch(apiUrl + '/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ API server is responding');
        setTestResults(prev => ({ 
          ...prev, 
          apiConnection: '✅ API Server Responding' 
        }));
      } else {
        console.log('⚠️ API server responded with:', response.status);
        setTestResults(prev => ({ 
          ...prev, 
          apiConnection: `⚠️ API Server Status: ${response.status}` 
        }));
      }
    } catch (error) {
      console.log('❌ Cannot connect to API server:', error.message);
      setTestResults(prev => ({ 
        ...prev, 
        apiConnection: '❌ API Server Not Available (This is normal for frontend-only deployment)' 
      }));
    }
    setLoading(false);
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #007cba', paddingBottom: '10px' }}>
        🧪 TourConnect API Testing Dashboard
      </h2>
      
      {/* Environment Variables Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>📋 Environment Variables Status</h3>
        {testResults.env && (
          <div>
            {Object.entries(testResults.env).map(([key, value]) => (
              <div key={key} style={resultStyle}>
                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Tests Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>🔌 API Connectivity Tests</h3>
        <div style={{ marginBottom: '15px' }}>
          <button onClick={testGoogleMaps} disabled={loading} style={buttonStyle}>
            Test Google Maps API
          </button>
          <button onClick={testOpenAI} disabled={loading} style={buttonStyle}>
            Test OpenAI API
          </button>
          <button onClick={testMoMo} style={buttonStyle}>
            Test MoMo Config
          </button>
          <button onClick={testApiUrl} disabled={loading} style={buttonStyle}>
            Test API Server
          </button>
        </div>

        {/* Test Results */}
        {testResults.googleMaps && (
          <div style={resultStyle}><strong>Google Maps:</strong> {testResults.googleMaps}</div>
        )}
        {testResults.openai && (
          <div style={resultStyle}><strong>OpenAI:</strong> {testResults.openai}</div>
        )}
        {testResults.momo && (
          <div style={resultStyle}><strong>MoMo:</strong> {testResults.momo}</div>
        )}
        {testResults.apiConnection && (
          <div style={resultStyle}><strong>API Server:</strong> {testResults.apiConnection}</div>
        )}
      </div>

      {/* Current Configuration */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        <h4>⚙️ Current Configuration:</h4>
        <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
{`Environment: ${process.env.NODE_ENV || 'development'}
App Name: ${process.env.REACT_APP_APP_NAME || 'Not Set'}
App Version: ${process.env.REACT_APP_VERSION || 'Not Set'}
Frontend URL: ${process.env.REACT_APP_FRONTEND_URL || 'Not Set'}
API URL: ${process.env.REACT_APP_API_URL || 'Not Set'}
Current URL: ${window.location.href}

API Keys Status:
- Google Maps: ${process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Configured' : 'Missing'}
- OpenAI: ${process.env.REACT_APP_OPENAI_API_KEY ? 'Configured' : 'Missing'}
- MoMo Partner: ${process.env.REACT_APP_MOMO_PARTNER_CODE || 'Not Set'}
- MoMo Endpoint: ${process.env.REACT_APP_MOMO_ENDPOINT || 'Not Set'}`}
        </pre>
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
          borderRadius: '8px'
        }}>
          Testing API... Please wait...
        </div>
      )}
    </div>
  );
};

export default ApiTest;
