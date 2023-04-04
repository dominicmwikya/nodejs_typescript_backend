import React,{useContext} from 'react'
import { AuthContext } from '../../ContextAPI/authContextAPI'
export default function Dashboard() {

  const {user}= useContext(AuthContext)
  return (
    <div>Dashboard - User {user.authState ? user.email : 'No Logged User'}</div>
  )
}
