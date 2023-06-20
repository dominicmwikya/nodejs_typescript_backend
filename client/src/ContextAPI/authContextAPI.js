import React, { createContext, useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
const AuthContext = createContext();

function AuthProvider(props){
    const navigate = useNavigate();
     const [user, setUser]=useState({
        email:'', authState:false, id:''
     });
     const AuthenticateToken = async () => {
        const token = await localStorage.getItem('token');
        try {
            // Verify the access token
            const result = await axios.get('http://localhost:8000/users/protected-route', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              setUser({name:result.data.name, email: result.data.usermail, id: result.data.id, authState: true });
            return user;  
          } catch (error) {
              navigate('/login');
              return error;
          }
      };

    const handleLogout = () => {
        setUser({ email: '', id: '', authState: false });
        localStorage.removeItem('token');
          setUser({email:"",id:"",authState:false})
          navigate('/login');
      };

      const auth = async () => {
        try {
          await AuthenticateToken();
        } catch (error) {
            return error;
        }
      };

     useEffect(() => {
        auth();
      }, []);
      
      return (
        <AuthContext.Provider value={{user, setUser, handleLogout}}>
             {props.children}
        </AuthContext.Provider>
      );
}

export { AuthContext, AuthProvider };