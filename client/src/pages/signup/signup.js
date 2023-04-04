import React,{useState, useContext, useEffect} from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { useRegister } from '../../appAPIs/APIs'
import { AuthContext } from '../../ContextAPI/authContextAPI'
const Signup=()=>{
    const {RegisterUser}= useRegister()
    const [values, setValues]=useState({
        firstName:"",
        lastName:"",
        password:'',
        email:"",
        roleId:''
    })
    const [roles, setRoles]=useState([])

   const role= async()=>{
        const result= await axios.get('http://localhost:8000/roles');
        setRoles(result.data.roles);
   }
   useEffect(()=>{
      role();
   }, [])

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
            const response = await axios.post('http://localhost:8000/users/create', values);
            console.log(response.data); // If there's no error, log the response data
            swal({
                text: response.data,
                title: 'Success',
                icon: 'success',
                timer: 3000,
              });
          } catch (error) {

            console.log(error)
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
      };
      
    return (
        <div className="container">
        <div className="row">
          <div className="col-md-8">
           <div className='card' style={{marginTop:'30px'}}>
           <div className="card-header text-center " style={{fontFamily:'Sans-Serif', textTransform:'uppercase', fontSize:'1.5rem'}}>
           User Signup form
            </div>
             <div className='card-body' style={{backgroundColor:'#F8F8F8'}}>
             <div className='card' >
              <div className='card-body'>
                <form onSubmit={submitForm}  className="userform" style={{marginLeft:"0px",paddingLeft:"0px"}}>
                  <div className='form-group row'>
                      <div className='col'>
                      <div className="input-group mb-3">
                          <div className="input-group-prepend  col-sm-3">
                              <span className="input-group-text">User Name</span>
                          </div>
                          <input id="firstName" name="firstName"  className='form-control' type="text" onChange={handleValueChange}  />
                      </div> 
                      </div>
                  </div>
                  
                  <div className='form-group row'>
                      <div className='col'>
                      <div className="input-group mb-3">
                          <div className="input-group-prepend  col-sm-3">
                              <span className="input-group-text">User Name</span>
                          </div>
                          <input id="lastName" name="lastName"  className='form-control' type="text" onChange={handleValueChange}  />
                      </div> 
                      </div>
                  </div>

                  <div className='form-group row'>
                      <div className='col'>
                      <div className="input-group mb-2">
                          <div className="input-group-prepend  col-sm-3">
                              <span className="input-group-text">User Email: </span>
                          </div>
                          <input id="email" name="email" className='form-control' type="email" onChange={handleValueChange}    />
                      </div> 
                      </div>
                  </div>
                   
                  <div className='form-group row'>
                      <div className='col'>
                      <div className="input-group mb-2">
                          <div className="input-group-prepend  col-sm-3">
                              <span className="input-group-text">Role: </span>
                          </div>
                          <select name='roleId' className='form-control' onChange={handleValueChange}>
                            <option value="">Select User Role</option>
                            {
                              roles?.map(role=>{
                                return (
                                  <option key={role.id} value={role.id}>{role.role}</option>
                                )
                              })
                            }
                          </select>
                      </div> 
                      </div>
                  </div>
               
                
                  <div className='form-group row'>
                      <div className='col'>
                      <div className="input-group mb-3">
                          <div className="input-group-prepend  col-sm-3">
                              <span className="input-group-text">password: </span>
                          </div>
                        <input id="password" name="password" className='form-control' type="password"  onChange={handleValueChange} />
                      </div> 
                      </div>
                     
                  </div>
                   <button className='btn btn-success btn-sm' style={{width:'100px', float:'right', marginLeft:'auto', marginRight:'0px'}}>ADD USER</button>
                </form> 
              </div>
            </div>  
             </div>
           </div>
          </div>
        </div>
      </div>
      );
}


export default Signup