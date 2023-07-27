import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, Card, Form, Button } from 'react-bootstrap';
import Purchaseform from './index';
import PurchasesTable from './PurchasesTable';
import { AuthContext } from '../../ContextAPI/authContextAPI';
export const PurchaseList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [take, setTake] = useState(5);
  const skip = (currentPage - 1) * take;
  const [data, setData] = useState([]);
  const takeOptions = [2, 5, 10, 25, 50, 100, 200];
  const {user}= useContext(AuthContext)

  const fetchData = async (currentPage, skip, take) => {
    const token = await localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/purchases/get?page=${currentPage}&skip=${skip}&take=${take}&role=${user.role}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const json = await response.json();
    setTotalPages(json.totalPages);
  
    // Check if 'json.data' is an array before setting 'data'
    if (Array.isArray(json.data)) {
      setData(json.data);
    } else {
      setData([]); // Set empty array if 'json.data' is not an array
    }
  };
  
  
  useEffect(() => {
    fetchData(currentPage, skip, take);
  }, [currentPage, take, skip, user]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTakeChange = (event) => {
    const newTake = parseInt(event.target.value);
    setTake(newTake);
    setCurrentPage(1);
  };

  return (
    <Container>
      <Row>
        <Col md={10}>
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
                      <Form.Control type="text" />
                    </Form.Group>
                  </Form>
                </Col>
                <Col>
                  <Button variant="primary">Search</Button>
                </Col>
              </Row>
              <Purchaseform />
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <PurchasesTable data={data} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div style={{ overflowX: 'auto' }}>
                    <Pagination>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Pagination.Item key={page}>
                          <Button size='sm' key={page} onClick={() => handlePageChange(page)}>
                            <Pagination size='sm'>{page}</Pagination>
                          </Button>
                        </Pagination.Item>
                      ))}
                    </Pagination>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PurchaseList;
