import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

export default function AddPurchasesForm({ formData, handleSubmit, handleInputChange, products, removeRow, addRow }) {
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {formData.map((item, index) => (
          <div key={index} className="d-flex align-items-center mb-3">
            <Form.Select
              className="me-3"
              name="productId"
              value={item.productId}
              onChange={(event) => handleInputChange(index, event)}
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </Form.Select>
            <Form.Select
              className="me-3"
              name="supplierId"
              value={item.supplierId}
              onChange={(event) => handleInputChange(index, event)}
            >
              <option value="">Select Supplier</option>
              <option value="1">Supplier 1</option>
              <option value="2">Supplier 2</option>
            </Form.Select>
            <Form.Control
              type="number"
              className="me-3"
              name="quantity"
              value={item.quantity}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Quantity"
            />
            <Form.Control
              type="number"
              className="me-3"
              name="price"
              value={item.price}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Purchase Price"
            />
            <Form.Control
              type="number"
              className="me-3"
              name="sprice"
              value={item.sprice}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Sale Price"
            />
            {index !== 0 && (
              <Button
                type="button"
                variant="danger"
                className="me-3"
                onClick={() => removeRow(index)}
              >
                -
              </Button>
            )}
            {index === formData.length - 1 && (
              <Button type="button" variant="success" onClick={addRow}>
                +
              </Button>
            )}
          </div>
        ))}
        <div className="d-flex justify-content-end">
          <Button type="submit" variant="secondary">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
}
