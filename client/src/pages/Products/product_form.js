import React from 'react';
import {Col, Form,Button} from 'react-bootstrap'
export const ProductForm=({handleSubmit, handleValueChange, values}) =>{
  return (
    <Form className='form-inline' onSubmit={handleSubmit} >
        <Form.Group className='mb-3 row'>
            <Col>
               <Form.Control 
                     type='text' 
                     name='name' 
                     value={values.name} 
                     onChange={handleValueChange}
                     placeholder='NAME'/>
            </Col>
            <Col>
                <Form.Select 
                    name='category' 
                    onChange={handleValueChange}  
                    value={values.category}>
                    <option> Select Category</option>
                        <option value='charger'>charger</option>
                        <option value='phone'>phone</option>
                        <option value='laptop'>laptop</option>
                </Form.Select>
            </Col>
        </Form.Group>
      
      <Form.Group className='mb-3 row'> 
         <Col>
            <Form.Control 
                   type="number" 
                    name="min_qty" 
                    placeholder="ALERT QUANTITY" 
                    onChange={handleValueChange}
                    value={values.min_qty}/>
         </Col>
         <Col>
            <Form.Select name="unit" 
                    onChange={handleValueChange}
                    value={values.unit}
                    >
                <option defaultValue>Select Unit</option>
                <option value="piece">Piece</option>
                <option value="kg">Kg</option>
            </Form.Select>
         </Col>
      </Form.Group>
      
      <Form.Group className='mb-3 row'>
          <Form.Control 
                as="textarea"
                rows={4}  
                name="description" 
                placeholder="DESCRIPTION" 
                onChange={handleValueChange}
                value={values.description} 
            />
      </Form.Group>

      <Form.Group className='row'>
         <Button type='submit'
                 variant='success'
                 style={{textShadow:"none", height:'40px', width:"150px"}}>
                 Add Product
                </Button>
      </Form.Group>     
    </Form>
  )
}
