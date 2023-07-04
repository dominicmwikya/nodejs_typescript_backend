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
                <th>batchNo</th>
                <th>Quantity</th>
                <th>@PRICE</th>
                <th>soldQty</th>
                <th>Supplier</th>
                <th>Customer</th>
                <th>status</th>
            </tr>
            </thead>
            <tbody>
            {data.map((data)=>(
                <tr key={data.id}>
                <td>{id++}</td>
                <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                <td>{data.product.name}</td>
                <td>{data.batchcode  }</td>
                <td>{data.purchase_Qty}</td>
                <td>{data.purchase_Price}</td>
                <td>{data.soldQty}</td>
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
