import React, { useState, useContext } from 'react';
import { Form, Table, Button, Container, Row, Col } from 'react-bootstrap';
import SearchTableResults from './searchTableResults';
import SearchForm from './searchForm';
import swal from 'sweetalert';
import UIMODAL from '../../components/UIs/Modals/index';
import axios from 'axios';
import { AuthContext } from '../../ContextAPI/authContextAPI';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const styles = { width: '4rem', height: '4rem' };
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    total_items: 0,
  });

  const handleValueChanges = (event) => {
    const { name, value } = event.target;
    setValues((preValues) => ({ ...preValues, [name]: value }));

    if (name === 'amount') {
      setAmount(Number(value));
      const balanceValue = calculateTotalCost() - Number(value);
      setBalance(balanceValue);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleQuantityChange = (e, p_id) => {
    const qty = Number(e.target.value);
    setSelectedProducts((currentproducts) =>
      currentproducts.map((product) => {
        const updatedpurhaselist = product.purchases.map((purchase) => {
          if (purchase.id === p_id) {
            return {
              ...purchase,
              purchase_Qty: qty,
            };
          }
          return purchase;
        });
        return {
          ...product,
          purchases: updatedpurhaselist,
        };
      })
    );
    setValues((prev) => ({
      ...prev,
      total: calculateTotalSubtotal(),
    }));
  };

  const handlePriceChange = (e, purchase_id) => {
    const updatedPrice = e.target.value;
    setSelectedProducts((previousProducts) =>
      previousProducts.map((products) => {
        const newPruchaseList = products.purchases.map((purchase) => {
          if (purchase.id === purchase_id) {
            return {
              ...purchase,
              purchase_Price: updatedPrice,
            };
          }
          return purchase;
        });
        return {
          ...products,
          purchases: newPruchaseList,
        };
      })
    );
  };

  const calculateRowTotal = (purchaseId) => {
    const product = selectedProducts.find((product) =>
      product.purchases.find((purchase) => purchase.id === purchaseId)
    );
    if (product) {
      const purchase = product.purchases.find((purchase) => purchase.id === purchaseId);
      const rowTotal = purchase.purchase_Qty * purchase.purchase_Price;
      return rowTotal;
    }
    return 0;
  };

  const calculateTotalCost = () => {
    let totalCost = 0;
    selectedProducts.forEach((product) => {
      product.purchases.forEach((purchase) => {
        const rowTotal = calculateRowTotal(purchase.id);
        totalCost += rowTotal;
      });
    });
    return totalCost;
  };

  const calculateTotalQuantity = () => {
    return selectedProducts.reduce((inittotal, product) => {
      const productTotalQuantity = product.purchases.reduce(
        (initial, purchase) => initial + purchase.purchase_Qty,
        0
      );
      return inittotal + productTotalQuantity;
    }, 0);
  };

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      total: 0,
      totalItems: 0,
      subTotal: 0,
      qty: 0,
      price: 0,
    };
    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const handleRemoveProduct = (purchaseId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        purchases: product.purchases.filter((purchase) => purchase.id !== purchaseId),
      }))
    );
  };

  const calculateTotalSubtotal = () => {
    // Add logic here if needed
  };

  const handleSearchFormSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      setIsSearching(true);
      try {
        const response = await fetch(
          `http://localhost:8000/products/search?searchTerm=${searchTerm}`
        );
        if (response.ok) {
          const result = await response.json();
          setSearchResults(result.data);
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
      total: calculateTotalCost(),
      totalItems: calculateTotalQuantity(),
      amt: amount,
      balance: balance,
      products: selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        purchases: product.purchases.map((purchase) => ({
          quantity: purchase.purchase_Qty,
          price: purchase.purchase_Price,
          subTotal: calculateRowTotal(purchase.id),
          purchaseId: purchase.id,
        })),
      })),
    };
    try {
      const response = await axios.post('http://localhost:8000/sales', formData);
      swal({
        title: 'Good job!',
        text: response.data.message,
        icon: 'success',
        button: 'Confirm',
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
        title: 'Error',
        text: error.response.data.error,
        icon: 'error',
        button: 'OK',
      });
    }
  };

  const openModal = () => {
    if (selectedProducts.length > 0) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!user.authState) {
    navigate('/login');
    return null;
  }

  return (
    <Container>
      <Row style={{ marginBottom: '10px' }}>
        <Col md={5}>
          <SearchForm
            handleSearchFormSubmit={handleSearchFormSubmit}
            handleSearchInputChange={handleSearchInputChange}
            searchTerm={searchTerm}
          />
          {isSearching ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border animate-spin" style={styles}>
                <span>Loading...</span>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <SearchTableResults handleAddProduct={handleAddProduct} searchResults={searchResults} />
          ) : (
            <div className="error-message">No search results found</div>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) =>
                  product.purchases.map((purchase) => (
                    <tr key={`${purchase.id}`}>
                      <td>{purchase.batchcode}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={purchase.purchase_Price}
                          onChange={(event) => handlePriceChange(event, purchase.id)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={purchase.purchase_Qty}
                          onChange={(event) => handleQuantityChange(event, purchase.id)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={calculateRowTotal(purchase.id)}
                          name="total"
                          onChange={handleValueChanges}
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveProduct(purchase.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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
                      value={calculateTotalCost()}
                      name="total"
                      onChange={handleValueChanges}
                      readOnly
                    />
                  </td>
                  <td></td>
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
                    <Button variant="success" className="w-100" onClick={openModal}>
                      Submit Order
                    </Button>
                  </td>
                  <td></td>
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
          <Form onSubmit={handleSubmit}>
            <Row style={{ marginBottom: '5px' }}>
              <Col>
                <Form.Label>SELL DATE</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="date"
                  name="sell_date"
                  onChange={handleValueChanges}
                  placeholder="sell date"
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: '5px' }}>
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
                      <th style={{ width: 'auto' }}>Product</th>
                      <th style={{ width: 'auto' }}>Qty</th>
                      <th style={{ width: 'auto' }}>Price</th>
                      <th style={{ width: 'auto' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product) =>
                      product.purchases.map((purchase) => (
                        <tr key={`${product.id} ${purchase.id}`}>
                          <td>
                            <Form.Control
                              value={product.name}
                              name="name"
                              onChange={handleValueChanges}
                            />
                          </td>
                          <td>
                            <Form.Control
                              value={purchase.purchase_Qty}
                              name="qty"
                              onChange={handleValueChanges}
                            />
                          </td>
                          <td>
                            <Form.Control
                              value={purchase.purchase_Price}
                              name="price"
                              onChange={handleValueChanges}
                            />
                          </td>
                          <td>
                            <Form.Control
                              value={calculateRowTotal(purchase.id)}
                              name="total"
                              onChange={handleValueChanges}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <Form.Label>Total Cost</Form.Label>{' '}
                        <Form.Control defaultValue={calculateTotalCost()} readOnly />
                      </td>
                      <td>
                        <Form.Label>Paid</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Amount"
                          onChange={handleValueChanges}
                        />
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
              <Col style={{ display: 'flex' }}>
                <Button variant="success" type="submit">
                  Place Order
                </Button>
              </Col>
            </Row>
          </Form>
        </UIMODAL>
      )}
    </Container>
  );
};

export default Index;
