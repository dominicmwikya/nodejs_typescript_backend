import React,{useContext} from 'react'
import { AuthContext } from '../../ContextAPI/authContextAPI';
import {Container, Row, Col} from 'react-bootstrap'
export default function Dashboard() {

  const {user}= useContext(AuthContext)
  return (
    <Container>
      <Row>
        <Col>
            <h6> Dashboard <b> Logged User-  {user.authState ? user.id : 'No Logged User'}</b></h6>
        </Col>
      </Row>
    </Container>
  )
}
