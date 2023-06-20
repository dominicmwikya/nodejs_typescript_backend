import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function AddPurchasesForm({ formData, handleSubmit, handleInputChange, products, removeRow, addRow }) {
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {formData.map((item, index) => (
          <div key={index} className="mb-3">
            <Row>
              <Col>
                <Form.Select
                  name="productId"
                  value={item.productId}
                  onChange={(event) => handleInputChange(index, event)}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => {
                    return (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    )
                  })}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  name="supplierId"
                  value={item.supplierId}
                  onChange={(event) => handleInputChange(index, event)}
                >
                  <option value="">Select Supplier</option>
                  <option value="1">Supplier 1</option>
                  <option value="2">Supplier 2</option>
                </Form.Select>
              </Col>
              <Col xs={4} md={2}>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(event) => handleInputChange(index, event)}
                  placeholder="Quantity"
                />
              </Col>
              <Col xs={4} md={2}>
                <Form.Control
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={(event) => handleInputChange(index, event)}
                  placeholder="Price"
                />
              </Col>
              <Col>
                <Button type="button" className="btn btn-danger" onClick={() => removeRow(index)}>-</Button>
              </Col>
            </Row>
          </div>
        ))}
        <Button type="button" className="btn btn-success me-3" onClick={addRow}>+ ROW</Button>
        <Button type="submit" className="btn btn-secondary">Submit</Button>
      </Form>
    </div>
  );
}
