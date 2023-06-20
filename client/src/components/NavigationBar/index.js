import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { AuthContext } from '../../ContextAPI/authContextAPI';

const LinkItem = ({ to, children }) => (
  <Nav.Link as={Link} to={to}>{children}</Nav.Link>
);

const DropdownMenuItem = ({ to, children }) => (
  <NavDropdown.Item as={Link} to={to}>{children}</NavDropdown.Item>
);

const NavScrollExample = () => {
  const { user, handleLogout } = useContext(AuthContext);

  const renderAuthenticatedLinks = () => (
    <>
      <NavDropdown title="Products" id="navbarScrollingDropdown">
        <DropdownMenuItem to="/products">All Products</DropdownMenuItem>
        <DropdownMenuItem to="#action4">Another action</DropdownMenuItem>
        <NavDropdown.Divider />
        <DropdownMenuItem to="#action5">Something else here</DropdownMenuItem>
      </NavDropdown>
      <NavDropdown title="Purchases" id="navbarScrollingDropdown">
        <DropdownMenuItem to="/purchases">All Products</DropdownMenuItem>
        <DropdownMenuItem to="/purchases/add">Another action</DropdownMenuItem>
      </NavDropdown>
      <LinkItem to="/pos">POS</LinkItem>
      <LinkItem to="/sales">Sales</LinkItem>
      <LinkItem to="/users">Users</LinkItem>
      <LinkItem to="/dailysales">Daily Sales</LinkItem>
      <Nav.Link as={Button} onClick={handleLogout} className="btn-danger">Log out</Nav.Link>
    </>
  );

  const renderGuestLinks = () => (
    <LinkItem to="/login">Login</LinkItem>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/dashboard">StockAddress</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            {user.authState ? renderAuthenticatedLinks() : renderGuestLinks()}
          </Nav>
          <Form className="d-flex">
            <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
