import React, { useEffect, useState,useCallback } from 'react';
import {  useFetchProductAPI} from '../../appAPIs/productAPIs';
import AddpurchasesForm from './AddpurchasesForm';
import {Card, Button}  from 'react-bootstrap'
import axios from 'axios';
import swal from 'sweetalert'
import Modal from '../../components/UIs/Modals/index';
function StockForm(){
  const [formData, setFormData] = useState([{ productId: '', price: '', quantity:'', supplierId: '',sprice:"" }]);
  const[products, setItems]=useState([]);
  const[suppliers, setSupplier]=useState([]);
  const { fetchProduct } = useFetchProductAPI();
  const addRow = () => {
    setFormData([...formData, { productId: '', price: '',quantity:'', supplierId: '',sprice:"" }]);
  };
  const [show, setShow] = useState(false);
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const removeRow = (index) => {
    const formValues = [...formData];
    formValues.splice(index, 1);
    setFormData(formValues);
  };

  const fetchItems = useCallback(async () => {
    const records = await fetchProduct();
    setItems(records.data.products);
  },[])

  const fetchSuppliers=useCallback(async()=>{
    const res= await axios.get('http://localhost:8000/suppliers/get');
    const json = await res.data;
    setSupplier(json);
  });
 
  useEffect(()=>{
    fetchItems();
    fetchSuppliers();
  },[fetchItems])

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const formValues = [...formData];
    formValues[index][name] = value;
    setFormData(formValues);
  };

  const handleSubmit = async(event) => {
     event.preventDefault();
    const result= await axios.post(`http://localhost:8000/purchases/post`, formData);
    if(result.data.message){
       swal({
           title:'Good Job!',
           text:result.data.message,
           timer:3500,
           icon:'success'
       }).then(()=>{
        setFormData([{ productId: '', price: '',quantity:'', supplierId: '',sprice:"" }]);
        closeModal();
       })
    }else{
      swal({
        title:'Error',
        text:result.data.error,
        timer:3500,
        icon:'warning'
    })
    }
  };
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
              products={products} 
              removeRow={removeRow}
              addRow={addRow}
            />
    </Modal>
    </Card.Body>       
  </Card>
  );
}
export default StockForm;
