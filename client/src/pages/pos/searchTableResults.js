import React from 'react'
import { Table, Button } from 'react-bootstrap'
export default function searchTableResults({isSearching,handleAddProduct, searchResults}) {
  return (
    <div> 
    <Table striped bordered hover>
        <thead style={{ backgroundColor: 'greenyellow' }}>
        <tr>
            <th>Product Name</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {searchResults && !isSearching && searchResults.length > 0 ? (
            searchResults.map((product) => (
            <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                <Button onClick={() => handleAddProduct(product)}>+</Button>
                </td>
            </tr>
            ))
        ) : (
            <tr>
            <td colSpan={2}>
                {isSearching ? 'Searching...' : 'No products found'}
            </td>
            </tr>
        )}
        </tbody>
    </Table>
  </div>
  )
}
