import React from 'react'
import Table from 'react-bootstrap/Table';
export default function PurchasesTable({data}) {
 var id=1;
  return (
    <div>   
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>@PRICE</th>
                <th>Supplier</th>
                <th>Purchased By</th>
                <th>status</th>
            </tr>
            </thead>
            <tbody>
            {data.map((data)=>(
                <tr key={data.id}>
                <td>{id++}</td>
                <td>{data.createdAt}</td>
                <td>{data.product.name}</td>
                <td>{data.quantity}</td>
                <td>{data.price}</td>
                <td>{data.supplier.name}</td>
                <td>{data.user.firstName}</td>
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
    </div>
  )
}
