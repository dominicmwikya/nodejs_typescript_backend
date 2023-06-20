import React, { useEffect, useState } from 'react'
import { Container,Row,Col, Pagination, Card, Table, Form, Button } from 'react-bootstrap';
export const PurchaseList=() =>{
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [take, setTake]=useState(5);
  const skip = (currentPage-1)*take;
  const[data, setData]=useState([]);
  const takeOptions = [2, 5, 10, 25, 50, 100, 200];
 
   useEffect(() => {
    fetchData(currentPage);
     }, [currentPage, take, skip]);

    const fetchData = async (currentPage) => {
      const response =  await fetch(`http://localhost:8000/sales?page=${currentPage}&skip=${skip}&take=${take}`);
      const json = await response.json();
      setTotalPages(json.totalPages);
      if (json.data.length > 0) {
        setData(json.data);
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
               <Form.Control type="text"  />
             </Form.Group>
           </Form>
         </Col>
         <Col>
           <Button variant="primary" >Search</Button>
         </Col>
         </Row>
         {/* <Purchaseform /> */}
         <Row>
           <Col>
             <Card>
               <Card.Body>
               <Table striped bordered hover responsive>
                   <thead>
                     <tr>
                       <th>#purchaseId</th>
                       <th>customer</th>
                       <th>Date</th>
                       <th>Product</th>
                       <th>Quantity</th>
                       <th>price</th>
                       <th>subtotal</th>
                       <th>status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {data.map((data) => (
                       <tr key={data.id}>
                         <td>{data.id}</td>
                         <d>{data.customer_name}</d>
                         <td>{data.sell_date}</td>
                         <td>{data.products.name}</td>
                         <td>{data.quantity}</td>
                         <td>{data.price}</td>
                         <td>{data.subTotal}</td>
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
             <div style={{overflowX:'auto'}}>
             <Pagination>
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                 <Pagination.Item>
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