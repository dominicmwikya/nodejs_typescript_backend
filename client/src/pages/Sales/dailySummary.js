import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, Card, Table, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../../ContextAPI/authContextAPI';
import { useNavigate } from 'react-router-dom';

export const DailySalesSummary = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dates, setSearchDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [take, setTake] = useState(5);
  const skip = (currentPage - 1) * take;
  const [data, setData] = useState([]);
  const [totalRevenue, setRevenue] = useState(0);
  const takeOptions = [2, 5, 10, 25, 50, 100, 200];
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDateChange = (event) => {
    setSearchDates((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSearch=()=>{
    const fetchData = async (currentPage) => {
      const startDateParam = dates.startDate ? `&startDate=${dates.startDate}` : '';
      const endDateParam = dates.endDate ? `&endDate=${dates.endDate}` : '';
      const response = await fetch(
        `http://localhost:8000/sales/daily?page=${currentPage}&skip=${skip}&take=${take}${startDateParam}${endDateParam}`
      );
      const json = await response.json();
  
      setTotalPages(json.totalPages);
      if (json.data.length > 0) {
        setData(json.data);
        setRevenue(json.totalDailyRevenue);
      }
    };
    fetchData()
  }
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, take, skip]);

  const fetchData = async (currentPage) => {
    const startDateParam = dates.startDate ? `&startDate=${dates.startDate}` : '';
    const endDateParam = dates.endDate ? `&endDate=${dates.endDate}` : '';
    const response = await fetch(
      `http://localhost:8000/sales/daily?page=${currentPage}&skip=${skip}&take=${take}${startDateParam}${endDateParam}`
    );
    const json = await response.json();

    setTotalPages(json.totalPages);
    if (json.data.length > 0) {
      setData(json.data);
      setRevenue(json.totalDailyRevenue);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTakeChange = (event) => {
    const newTake = parseInt(event.target.value);
    setTake(newTake);
    setCurrentPage(1);
  };
 if (!user.authState){
  navigate('/login');

  return null;
 }
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
              <Col md={2}>
                <Form>
                  <Form.Group className=" align-items-center">
                    <Form.Label >@show Entries:</Form.Label>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Filter by Dates:</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={dates.startDate}
                        onChange={handleDateChange}
                      />
                      <span className="mx-2">to</span>
                      <Form.Control
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={dates.endDate}
                        onChange={handleDateChange}
                      />
                      <Button variant="secondary" onClick={handleSearch} className="ms-2">
                        Apply
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
              </Row>
              <Row>
               <h5 style={{textTransform:'uppercase'}}>  Total Sales  <span style={{color:'green', fontSize:'20px'}}> Ksh :{totalRevenue}</span></h5>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>PRODUCT</th>
                            <th>Date</th>
                            <th>Quantity</th>
                            <th>TotalCost@ksh</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((data) => (
                            <tr key={data.id}>
                              <td>{data.productName}</td>
                              <td>{data.saleDay}</td>
                              <td>{data.totalQuantity}</td>
                              <td>{data.totalRevenue}</td>
                              <td>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <i className="fas fa-edit" style={{ color: 'green' }} />
                                  <i className="fas fa-trash" style={{ color: 'red' }} />
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
                  <div style={{ overflowX: 'auto' }}>
                    <Pagination>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Pagination.Item key={page}>
                          <Button size="sm" onClick={() => handlePageChange(page)}>
                            <Pagination size="sm">{page}</Pagination>
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
  );
};

export default DailySalesSummary;
