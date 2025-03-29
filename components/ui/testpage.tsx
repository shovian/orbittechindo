'use client'
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';

export default function AuthTestPage() {
  const { login, email: userEmail, accessToken, refreshToken } = useUserStore();
  const [email, setEmail] = useState('user1@example.com');
  const [password, setPassword] = useState('password123');
  const [responseMessage, setResponseMessage] = useState('');

  const handleLogin = async () => {
    try {
      login(email, password);
      setResponseMessage('✅ Logged in successfully!');

      
    } catch (error) {
      setResponseMessage('❌ Login failed: Network error');
    }
    // try {
    //   const res = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await res.json();
    //   if (res.ok) {
    //     const { name, email, phone, accessToken, favItems } = data;
    //     setAccessToken(accessToken);
    //     setUser({ name, email, phone, favItems });


    //   } else {
    //     setResponseMessage(`❌ Login failed: ${data.error}`);
    //   }
    // } catch (error) {
    //   setResponseMessage('❌ Login failed: Network error');
    // }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshed = await refreshToken();

      
      setResponseMessage(refreshed ? '✅ Token refreshed!' : '❌ Refresh failed');
    } catch (error) {
      setResponseMessage('❌ Refresh failed: Network error');
    }
  };

  const handleTestApiRequest = async () => {
    if (!accessToken) {
      setResponseMessage('❌ Please log in first!');
      return;
    }

    try {

      const res = await fetch('/api/user', {
        
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      setResponseMessage(res.ok ? `✅ API Success: ${JSON.stringify(data)}` : `❌ API Failed: ${data.error}`);
    } catch (error) {
      setResponseMessage('❌ API Request failed: Network error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>🛠 Auth Test Page</h2>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ display: 'block', margin: '5px auto', padding: '8px', width: '100%' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ display: 'block', margin: '5px auto', padding: '8px', width: '100%' }}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleLogin} style={{ margin: '5px', padding: '10px' }}>🔑 Log In</button>
        <button onClick={handleRefreshToken} style={{ margin: '5px', padding: '10px' }}>🔄 Refresh Token</button>
        <button onClick={handleTestApiRequest} style={{ margin: '5px', padding: '10px' }}>📡 Test API Request</button>
      </div>

      <p><strong>Access Token:</strong> {accessToken ? userEmail : '❌ Not Set'}</p>
      <p><strong>Response:</strong> {responseMessage}</p>
    </div>
  );
}
