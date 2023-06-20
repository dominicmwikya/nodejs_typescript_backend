import React, { useState } from 'react';
import { Form, Table, Button, Container, Row, Col } from 'react-bootstrap';
import SearchTableResults from './searchTableResults';
import SearchForm from './searchForm';
import swal from 'sweetalert';
import UIMODAL from '../../components/UIs/Modals/index';
import axios from 'axios';
const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [values, setValues] = useState({
    sell_date: '',
    customer_name: '',
    payment_mode: '',
    total: 0,
    totalItems: 0,
    subTotal: 0,
    id: '',
    qty: 0,
    price: 0,
  });

  const handleValueChanges = (event) => {
    const { name, value } = event.target;
    setValues((preValues)=>({...preValues, [name]:value}));

    if (name === 'amount') {
      setAmount(Number(value));
      const balanceValue = calculateTotalSubtotal() - Number(value);
      setBalance(balanceValue);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    if (selectedProducts.length > 0) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleQuantityChange = (event, productId) => {
    const quantity = Number(event.target.value);
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity, subTotal: product.price * quantity } : product
      )
    );
  };

  const handlePriceChange = (event, productId) => {
    const { value } = event.target;
    let updatedValue = value === "0" ? "" : value; // Check if the value is "0" and update accordingly
  
    updateProductPrice(productId, updatedValue);
  };

  const updateProductPrice = (productId, newPrice) => {
    // Find the product in your data/state using the productId
    const updatedProducts = selectedProducts.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          price: newPrice,
        };
      }
      return product;
    });
  
    // Update the selectedProducts state or data with the updated products
    setSelectedProducts(updatedProducts); // Replace setSelectedProducts with the appropriate function to update your state or data
  };
  
  const calculateSubtotal = (product) => {
    return product.price * product.quantity;
  };


  const handleAddProduct = (product) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 0, subTotal: 0 }]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((product) => product.id !== productId));
  };

  const calculateTotalQuantity = () => {
    return selectedProducts.reduce((total1, product1) => total1 + product1.quantity, 0);
  };

  const calculateTotalSubtotal = () => {
    return selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const handleSearchFormSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:8000/products/search?searchTerm=${searchTerm}`);
        if (response.ok) {
          const result = await response.json();
          if (result.data.length > 0) {
            setSearchResults(result.data);
          } else {
            throw new Error('No matching products found');
          }
        } else {
          throw new Error('Failed to fetch search results');
        }
      } catch (error) {
        swal({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      } finally {
        setIsSearching(false);
      }
    } else {
      swal({
        title: 'Product Name Required',
        text: 'Enter Product Name',
        icon: 'warning',
        dangerMode: true,
      });
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      sell_date: values.sell_date,
      customer_name: values.customer_name,
      payment_mode: values.payment_mode,
      total: calculateTotalSubtotal(),
      totalItems: calculateTotalQuantity(),
      amt: amount,
      balance: balance,
      products: selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        subTotal: product.subTotal,
      })),
    };
  
    try {
      const response = await axios.post('http://localhost:8000/sales', formData);
      swal({
        title: "Good job!",
        text: response.data.message,
        icon: "success",
        button: "Confirm",
      });
  
      setSelectedProducts([]);
      setAmount(0);
      setBalance(0);
      setValues({
        sell_date: '',
        customer_name: '',
        payment_mode: '',
        total: 0,
        totalItems: 0,
        subTotal: 0,
        id: '',
        qty: '',
        price: '',
      });
  
      closeModal();
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.error,
        icon: "error",
        button: "OK",
      });
    }
  };
  
  return (
    <Container>
    <Row style={{ marginBottom: '10px' }}>
      <Col md={5}>
        <SearchForm
          handleSearchFormSubmit={handleSearchFormSubmit}
          handleSearchInputChange={handleSearchInputChange}
          searchTerm={searchTerm}
        />

        {searchResults.length > 0 && (
          <SearchTableResults
            isSearching={false} // Update the value here as per your logic
            handleAddProduct={handleAddProduct}
            searchResults={searchResults}
          />
        )}
      </Col>

      <Col md={7}>
        <Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      value={product.price}
                      onChange={(event) => handlePriceChange(event, product.id)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      value={product.quantity}
                      onChange={(event) => handleQuantityChange(event, product.id)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={calculateSubtotal(product)}
                      name="total"
                      readOnly
                    />
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveProduct(product.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ marginBottom: '10px' }}>
                <td>Total Items</td>
                <td>
                  <Form.Control
                    name="total_items"
                    value={calculateTotalQuantity()}
                    readOnly
                  />
                </td>
                <td>Total Cost</td>
                <td>
                  <Form.Control
                    value={calculateTotalSubtotal()}
                    name="total"
                    onChange={handleValueChanges}
                    readOnly
                  />
                </td>
              </tr>
    
              <tr>
                <td colSpan={2}>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    onClick={() => window.print()}
                  >
                    PRINT
                  </Button>
                </td>
                <td colSpan={2}>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={openModal}
                  >
                    Submit Order
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Form>
      </Col>
    </Row>

    {showModal && (
      <UIMODAL
        show={openModal}
        onClose={closeModal}
        header="ORDER DETAILS"
        style={{ width: '1200px' }}
      >
        <Form onSubmit={handleSubmit} >
          <Row style={{marginBottom:'5px'}}>
            <Col>
            <Form.Label>SELL DATE</Form.Label>
            </Col>
            <Col>
            <Form.Control type="date" name="sell_date" onChange={handleValueChanges} placeholder='sell date'/>
          
            </Col>
            
          </Row>
          <Row  style={{marginBottom:'5px'}}>
          <Col>
            <Form.Label>CUSTOMER NAME </Form.Label>
            </Col>
            <Col>
            <Form.Control
                      value={values.customer_name}
                      name="customer_name"
                      onChange={handleValueChanges}
                    />
            </Col>
          </Row>
          <Row>
            <Col>
            <Table striped responsive className="table table-bordered">
              <thead>
                <tr>
                  <th style={{width:'auto'}}>Product</th>
                  <th style={{width:'auto'}} >Qty</th>
                  <th style={{width:'auto'}}>Price</th>
                  <th style={{width:'auto'}}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Form.Control value={product.name} name="name" onChange={handleValueChanges}   />
                    </td>
                    <td>
                      <Form.Control value={product.quantity} name="qty" onChange={handleValueChanges}  />
                    </td>
                    <td  >
                      <Form.Control value={product.price} name="price" onChange={handleValueChanges}  />
                    </td>
                    <td>
                      <Form.Control value={product.subTotal} name="total" onChange={handleValueChanges} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                <td >
                <Form.Label>Total Cost</Form.Label> <Form.Control defaultValue={calculateTotalSubtotal()} readOnly />
                </td>
                <td>
                  <Form.Label>Paid</Form.Label>
                  <Form.Control name="amount" type="number" placeholder="Amount" onChange={handleValueChanges} />
                </td>
                <td>
                  <Form.Label>Balance</Form.Label>
                  <Form.Control type="number" name="balance" value={balance} readOnly />
                </td>
                <td>
                    <Form.Label>Pay Via</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        name="payment_mode"
                        value={values.payment_mode}
                        onChange={handleValueChanges}
                      >
                        <option>Open this select menu</option>
                        <option value="Mpesa">Mpesa</option>
                        <option value="Cash">Cash</option>
                        <option value="Paybill">Paybill</option>
                      </Form.Select>
                    </td>
                </tr>
              </tfoot>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col style={{display:'flex'}}>
              <Button variant='success'  type='submit'>Place Order</Button>
            </Col>
          </Row>
        </Form>
      </UIMODAL>
    )}
  </Container>
  );
};

export default Index;
