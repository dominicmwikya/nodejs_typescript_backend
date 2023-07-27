import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

function AuthProvider(props) {
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState({
    email: '',
    authState: !!storedToken, // Set to true if there is a stored token, false otherwise
    id: '',
    role: ''
  });

  const authenticateToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Verify the access token
        const result = await axios.get('http://localhost:8000/users/protected-route', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (result.data && result.data.usermail && result.data.id && result.data.role) {
          setUser({
            name: result.data.name,
            email: result.data.usermail,
            role: result.data.role,
            id: result.data.id,
            authState: true
          });
          return user;
        } else {
          // Invalid server response, log out the user
          handleLogout();
          return null;
        }
      } catch (error) {
        console.log(error);
        // If there's an error, token might be invalid or expired, so clear it and log out the user
        handleLogout();
        return null;
      }
    } else {
      // No token found, user is not authenticated
      setUser({
        email: '',
        authState: false,
        id: '',
        role: ''
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      email: '',
      authState: false,
      id: '',
      role: ''
    });
  };

  useEffect(() => {
    authenticateToken();
  }, []);

  // Render the authenticated content
  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
