import React,{useContext, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../../ContextAPI/authContextAPI';

const Index = () => {
  const {user, handleLogout}=useContext(AuthContext)
	return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="/">myApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"> 
              {user.authState?(
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              
                <Nav><button onClick={handleLogout}>logout</button></Nav>
              </>
              ):(
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
              )}    
          </Nav>
        </Navbar.Collapse>
    </Container>
  </Navbar>
	);
};
export default Index;