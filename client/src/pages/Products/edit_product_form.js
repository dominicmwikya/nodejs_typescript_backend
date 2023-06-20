import React from 'react';
import {Form, Col, Button} from 'react-bootstrap';
export const EditProductForm=({updateProduct, handleValueChange, editValues}) =>{
  return (
    <Form className='form-inline' onSubmit={updateProduct} >
        <Form.Group className='mb-3 row'>
            <Col sm={4}>
                <Form.Label> Product</Form.Label>
            </Col>
            <Col>
            <Form.Control  
                 type="text" 
                 name="name" 
                 placeholder="item name" 
                  onChange={handleValueChange}
                  value={editValues.name}
             />
            </Col>
        </Form.Group>
        <Form.Group className='mb-3 row'>
            <Col sm={4}>
               <Form.Label>category</Form.Label>
            </Col>
             <Col>
               <Form.Select 
                        name='category'
                        onChange={handleValueChange} 
                        value={editValues.category}>
                        <option> Please select category</option>
                        <option value='charger'>charger</option>
                        <option value='phone'>phone</option>
                        <option value='laptop'>laptop</option>
               </Form.Select>
            </Col>
        </Form.Group>
        
        <Form.Group className='mb-3 row'>
            <Col sm={4}>
                <Form.Label>min Qty</Form.Label>
            </Col>
            <Col>
            <Form.Control 
                type="number" 
                name="min_qty" 
                placeholder="min item qty" 
                onChange={handleValueChange}
                value={editValues.min_qty}
             />
            </Col>
        </Form.Group>

        <Form.Group className='mb-3 row'>
             <Button type='submit' variant='success'
                style={{textShadow:"none", 
                height:'40px',
                width:"150px",
            }} >Update Product</Button>
        </Form.Group>  
    </Form>
  )
}
