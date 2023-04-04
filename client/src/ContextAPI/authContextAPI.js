import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

function AuthProvider(props){
    const navigate = useNavigate();
     const [user, setUser]=useState({
        email:'', authState:false, id:''
     });
      const [roles, setRoles]=useState([])
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
              return error;
          }
      };

    const handleLogout = () => {
        setUser({ email: '', id: '', authState: false });
        localStorage.removeItem('token');
          setUser({email:"",id:"",authState:false})
          navigate('/login');
      };
    
  

     useEffect(() => {
        const auth = async () => {
          try {
            await AuthenticateToken();
          } catch (error) {
              return error;
          }
        };
        auth();
      }, []);
      
      return (
        <AuthContext.Provider value={{user, setUser, handleLogout}}>
             {props.children}
        </AuthContext.Provider>
      );
}

export { AuthContext, AuthProvider };