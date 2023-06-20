import {Container,Card, Row, Col, Table, Form, Button} from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import {useNavigate} from 'react-router-dom'
export default function Receives({ totalPages, data, take, handlePageChange, handleTakeChange }) {
  const NavigateTo= useNavigate()
    const takeOptions = [2, 5, 10, 25, 50, 100, 200];
    const handleSearchChange=(e)=>{
    }

    const createUser=()=>{
      NavigateTo(`/register`)
    }

    const _edit=(id)=>{
               alert(id)
    }
    const _delete=(id)=>{
          alert(id)
    }
    return (
      <Container>
       <Row>
        <Col md={9}>
        <Card>
          <Card.Body>
            <Row className="align-items-center">
            <Col>
              <Form>
                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Label className="me-2">@show Entries:</Form.Label>
                  <Form.Control as="select" value={take.toString()} onChange={handleTakeChange}>
                    {takeOptions.map((option) => (
                      <option key={option} value={option.toString()}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-2">Search:</Form.Label>
                  <Form.Control type="text" onChange={(e) => handleSearchChange(e.target.value)} />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Button variant="primary">Search</Button>
            </Col>
            <Col>
              <Button size='md' onClick={()=>createUser()}>Add User</Button>
            </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                  <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#id</th>
                          <th>name</th>
                          <th>email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((data) => (
                          <tr key={data.id}>
                            <td>{data.id}</td>
                            <td>{data.firstName}</td>
                            <td>{data.email}</td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <i className="fas fa-edit" style={{ color: 'green' }}  onClick={() => _edit(data.id)}/>
                                <i className="fas fa-trash" style={{ color: 'red' }} onClick={() => _delete(data.id)}/>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Pagination>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Pagination.Item>
                        <Button size='sm' key={page} onClick={() => handlePageChange(page)}>
                          <Pagination size='sm'>{page}</Pagination>
                      </Button>
                    </Pagination.Item>
                    ))}
                </Pagination>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        </Col>
       </Row>
      </Container>
    );
  }
  