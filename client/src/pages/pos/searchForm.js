import React from 'react'
import { Form, Button } from 'react-bootstrap'
export default function searchForm({handleSearchFormSubmit, searchTerm, handleSearchInputChange}) {
  return (
    <div> 
         <Form onSubmit={handleSearchFormSubmit}>
            <Form.Group controlId="searchTerm">
              <Form.Control
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
  </div>
  )
}
