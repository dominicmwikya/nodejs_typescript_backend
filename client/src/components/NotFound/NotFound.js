import React from 'react'
import {useNavigate}  from 'react-router-dom'
export default function Index(){
  const navigate=useNavigate()
  return (
    <div className='row'>
       <div className='col-md-6 offset-2'>
       <h1> Page Not Found  <button className='btn btn-sm btn-primary' onClick={()=>navigate(-1)}  >Go back</button></h1>
       </div>
    </div>
  )
}


