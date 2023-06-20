import React, {useState, useEffect} from 'react'
import Receives from './index';
import { Container, Row, Col } from 'react-bootstrap';
export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);

  const [take, setTake]=useState(5);
  const skip = (currentPage-1)*take;

  useEffect(() => {
    fetchData(currentPage);
}, [currentPage, take, skip]);

  const handleTakeChange = (event) => {
    const newTake = parseInt(event.target.value);
    setTake(newTake);
    setCurrentPage(1); // reset page to 1 when take changes.
  };

  const fetchData = async (currentPage) => {
    const response = await fetch(`http://localhost:8000/users/test?page=${currentPage}&skip=${skip}&take=${take}`);
    const json = await response.json();
    setTotalPages(json.totalPages);
    if (json.data.length > 0) {
      setData(json.data);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <Container>
      <Row>
        <Col>
            <Receives   
            take={take}
            handlePageChange={handlePageChange}
            handleTakeChange={handleTakeChange}
            page={currentPage}
            data={data}
            totalPages={totalPages}
            currentPage={currentPage}
        />
        </Col>
      </Row>
    </Container>
  )
}
