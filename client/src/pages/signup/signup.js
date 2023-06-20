import React,{useState, useEffect} from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { useRegister } from '../../appAPIs/APIs';
import { AuthContext } from '../../ContextAPI/authContextAPI';
import{Container, Row, Col, Form, Button, Card} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Signup=()=>{
    const {RegisterUser}= useRegister()
    const NavigateTo=useNavigate()
    const [roles, setRoles]=useState([])

   const role= async()=>{
        const result= await axios.get('http://localhost:8000/roles');
        setRoles(result.data.roles);
   }
   useEffect(()=>{
      role();
   }, [])

   const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword:'',
      email: '',
      roleId: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      roleId: Yup.string().required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8000/users/create', values);
        swal({
          text: 'User Added Successfully',
          title: 'Success',
          icon: 'success',
          timer: 3000,
        }).then(()=>{
          NavigateTo('/users')
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
            <Card.Header>USER REGISTRATION</Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
              <Form.Group className='mb-3 row'>
                <Form.Label className='col-sm-3'>First Name</Form.Label>
                <Col sm={9}>
                  <Form.Control type='text' name='firstName' onChange={formik.handleChange} value={formik.values.firstName} />
                  {formik.touched.firstName && formik.errors.firstName ? <div className='text-danger'>{formik.errors.firstName}</div> : null}
                </Col>
              </Form.Group>
              <Form.Group className='mb-3 row'>
                <Form.Label className='col-sm-3'>last Name</Form.Label>
                <Col sm={9}>
                  <Form.Control type='text' name='lastName' onChange={formik.handleChange} value={formik.values.lastName} />
                  {formik.touched.lastName && formik.errors.lastName ? <div className='text-danger'>{formik.errors.lastName}</div> : null}
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
                  <Form.Label className='col-sm-3'>ROLE</Form.Label>
                  <Col sm={9}>
                    <Form.Select name='roleId' onChange={formik.handleChange}>
                      <option value=''>Select User Role</option>
                      {roles?.map((role) => {
                        return (
                          <option key={role.id} value={role.id}>
                            {role.role}
                          </option>
                        );
                      })}
                    </Form.Select>
                    {formik.touched.roleId && formik.errors.roleId ? <div className='text-danger'>{formik.errors.roleId}</div> : null}
                  </Col>
                </Form.Group>
                <Form.Group className='mb-3 row'>
                  <Form.Label className='col-sm-3'>Password</Form.Label>
                  <Col sm={3}>
                    <Form.Control name='password' type='password' onChange={formik.handleChange} />
                    {formik.touched.password && formik.errors.password ? <div className='text-danger'>{formik.errors.password}</div> : null}
                  </Col>
                  <Form.Label className='col-sm-3'>Repeat</Form.Label>
                  <Col sm={3}>
                    <Form.Control name='confirmPassword' type='password' onChange={formik.handleChange} />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className='text-danger'>{formik.errors.confirmPassword}</div> : null}
                  </Col>
                </Form.Group>
                <Form.Group>
                  <Button variant="primary" type="submit" style={{float:'right'}}>SUBMIT USER</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
       </Container>
      );
}
export default Signup