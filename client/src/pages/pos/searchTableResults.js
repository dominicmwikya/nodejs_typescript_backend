import React from 'react'
import { Table, Button } from 'react-bootstrap'
export default function searchTableResults({isSearching,handleAddProduct, searchResults}) {

  return (
    <div> 
    <Table striped bordered hover>
        <thead style={{ backgroundColor: 'gray' }}>
        <tr>
            <th>Product Name</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {searchResults && !isSearching && searchResults.length > 0 ? (
            searchResults.map((product) => (
                product.purchases.map((purchase, index) => (
                <tr key={`${product.id}-${index}`}>
                    <td>{product.name}</td>
                    <td>{purchase.batchcode}</td>
                    <td>
                    <Button onClick={() => handleAddProduct(product, index)}>+</Button>
                    </td>
                </tr>
                ))
            ))
            ) : (
            <tr>
                <td colSpan={3}>No search results found.</td>
            </tr>
            )}

        </tbody>
    </Table>
  </div>
  )
}
