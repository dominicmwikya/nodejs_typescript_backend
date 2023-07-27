import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useFetchProductAPI } from '../../appAPIs/productAPIs';
import {useTESTAPI} from '../../appAPIs/testAPIclass'; // Import the useTESTAPI hook
import AddpurchasesForm from './AddpurchasesForm';
import { Card, Button } from 'react-bootstrap'
import axios from 'axios';
import swal from 'sweetalert'
import Modal from '../../components/UIs/Modals/index';
import { AuthContext } from '../../ContextAPI/authContextAPI';
import { useNavigate } from 'react-router-dom';

function StockForm() {
  const [formData, setFormData] = useState([{ productId: '', price: '', quantity: '', supplierId: '', sprice: "" }]);
  const [suppliers, setSupplier] = useState([]);
  const { fetchProduct } = useFetchProductAPI();
  const {fetchProduct1}= useTESTAPI();

  const { user } = useContext(AuthContext);
  const _navigate = useNavigate();
  const [show, setShow] = useState(false);
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const removeRow = (index) => {
    const formValues = [...formData];
    formValues.splice(index, 1);
    setFormData(formValues);
  };

  const addRow = () => {
    setFormData([...formData, { productId: '', price: '', quantity: '', supplierId: '', sprice: "" }]);
  };
  const [itemState, setItemState] = useState({
    items: [],
    values: {
      name: '',
      category: '',
      min_qty: '',
      unit: '',
      description: ''
    }
  });

  const fetchItems = useCallback(async () => {
    try {
      await fetchProduct1(user.role, setItemState);
    } catch (error) {
      console.log(error);
      // Handle the error case here.
    }
  }, [user.role]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/suppliers/get', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          role: user.role,
        }
      });
      setSupplier(res.data);
    } catch (error) {
      console.log(error);
      // Handle the error case here.
    }
  }, [user.role]);

  useEffect(() => {
    fetchItems();
    fetchSuppliers();
  }, [fetchItems,fetchSuppliers, user])

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const formValues = [...formData];
    formValues[index][name] = value;
    setFormData(formValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const result = await axios.post(
      `http://localhost:8000/purchases/post`,
      formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (result.data.message) {
      swal({
        title: 'Good Job!',
        text: result.data.message,
        timer: 3500,
        icon: 'success'
      }).then(() => {
        setFormData([{ productId: '', price: '', quantity: '', supplierId: '', sprice: "" }]);
        closeModal();
      })
    } else {
      swal({
        title: 'Error',
        text: result.data.error,
        timer: 3500,
        icon: 'warning'
      })
    }
  };

  // Redirect if user is not authenticated
  if (!user.authState) {
    _navigate('/login');
    return null;
  }

  return (
    <Card>
      <Card.Header><Button variant='success' onClick={showModal}>New Purchase</Button></Card.Header>
      <Card.Body>
        <Modal
          show={show}
          onClose={closeModal}
          size="lg">
          <AddpurchasesForm
            formData={formData}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            products={itemState.items}
            removeRow={removeRow}
            addRow={addRow}
          />
        </Modal>
      </Card.Body>
    </Card>
  );
}

export default StockForm;
