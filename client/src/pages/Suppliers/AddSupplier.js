import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import{Container, Row, Col, Form, Button, Card} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
export default function AddSupplier() {
  const NavigateTo=useNavigate()

 const formik = useFormik({
  initialValues: {
    name: '',
    email: '',
    phone: '',
    address:''
  },
  validationSchema: Yup.object({
    name: Yup.string().required(' Name is required'),
    phone:Yup.string().required(),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.string().required('address is required'),
  }),
  onSubmit: async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/suppliers/create', values);
      swal({
        text: 'Supplier data Added Successfully',
        title: 'Success',
        icon: 'success',
        timer: 3000,
      }).then(()=>{
        NavigateTo('/suppliers')
      });
     
    } catch (error) {
      console.log(error);
      if (error.response.data) {
        swal({
          text: error.response.data,
          icon: 'warning',
          title: 'failed',
          timer: 3500,
        });
      }
      if (error.response.data.error) {
        console.log(error.response.data.error);
        swal({
          text: error.response.data.error,
          icon: 'warning',
          title: 'failed',
          timer: 3500,
        });
      }
    }
  },
});

  return (
    <Container>
    <Row>
      <Col md={6}>
        <Card>
          <Card.Header>SUPPLIER REGISTRATION</Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className='mb-3 row'>
                <Form.Label className='col-sm-3'> Name</Form.Label>
                <Col sm={9}>
                  <Form.Control type='text' name='name' onChange={formik.handleChange} value={formik.values.name} />
                  {formik.touched.name && formik.errors.name ? <div className='text-danger'>{formik.errors.name}</div> : null}
                </Col>
              </Form.Group>
            
              <Form.Group className='mb-3 row'>
                <Form.Label className='col-sm-3'>EMAIL</Form.Label>
                <Col sm={9}>
                  <Form.Control type='email' name='email' onChange={formik.handleChange} value={formik.values.email} />
                  {formik.touched.email && formik.errors.email ? <div className='text-danger'>{formik.errors.email}</div> : null}
                </Col>
              </Form.Group>
              
              <Form.Group className='mb-3 row'>
                <Form.Label className='col-sm-3'>Phone</Form.Label>
                <Col sm={9}>
                  <Form.Control type='number' name='phone' onChange={formik.handleChange} value={formik.values.phone} />
                  {formik.touched.phone && formik.errors.phone ? <div className='text-danger'>{formik.errors.phone}</div> : null}
                </Col>
              </Form.Group>

                <Form.Group className='mb-3 row'>
                  <Form.Label className='col-sm-3'>address</Form.Label>
                  <Col sm={3}>
                    <Form.Control as="textarea" rows={3} name='address' type='text' onChange={formik.handleChange}  />
                    {formik.touched.adress && formik.errors.address ? <div className='text-danger'>{formik.errors.address}</div> : null}
                  </Col>
                </Form.Group>

                <Form.Group>
                  <Button variant="primary" type="submit" style={{float:'right'}}>ADD SUPPLIER</Button>
                </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
     </Container>
    );
}
