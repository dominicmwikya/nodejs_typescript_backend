import React, {useState, useContext} from 'react';
import axios from 'axios'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../ContextAPI/authContextAPI';
const Signin=()=>{
  const{user,setUser}=useContext(AuthContext);
  
  const redirectTo= useNavigate()
    const [values, setValues]=useState({
        email:"",
        password:""
    })
    const handleValueChange=(e)=>{
        let name= e.target.name;
        let value= e.target.value;
        const newValues = {
        ...values,
        [name]: value
      }
      setValues(newValues)
    }
    const submitForm = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post('http://localhost:8000/users/login', values);
     localStorage.setItem('token',response.data.result.token.accessToken);
     setUser({...user,authState:true})
     redirectTo('/');
    swal({
      text: response.data.result.message,
      title: 'Success',
      icon: 'success',
      timer: 3000,
    });
   
  } catch (error) {
    if (error.response.data) {
   
      swal({
        text: error.response.data,
        icon: 'warning',
        title: "failed",
        timer: 3500
      })
    }
    if (error.response.data.error) {
      console.log(error.response.data.error)
      swal({
        text: error.response.data.error,
        icon: 'warning',
        title: "failed",
        timer: 3500
      })
    }
  }
}

    return (
        <div className='col-5 mx-auto'>
           <form onSubmit={submitForm}>  
              <h3>User Login</h3>
           
              <div className="mb-3">
                <label>Email address</label>
              <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email" 
                   onChange={handleValueChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password" 
                    onChange={handleValueChange}
                  />
                </div>
                <div className="mb-3">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label className="custom-control-label" htmlFor="customCheck1">
                      Remember me
                    </label>
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
                <p className="forgot-password text-right">
                  Forgot Password
                </p>
          </form>
      </div>
      )
}


export default Signin