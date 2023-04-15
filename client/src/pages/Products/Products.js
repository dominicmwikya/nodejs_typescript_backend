import React, { useCallback, useContext, useEffect, useState } from 'react';
import Modal from '../../components/UIs/Modals/index';
import swal from 'sweetalert';
import { AuthContext } from '../../ContextAPI/authContextAPI';
import TableUI from '../../components/UIs/Tables/TableUis';
import { useAddProductAPI, useDeleteProductAPI, useFetchProductAPI, useGetProductEdit,useProductUpdate } from '../../appAPIs/productAPIs';
import { ProductForm } from './product_form';
import { EditProductForm } from './edit_product_form';

export default function Item() {
  const [show, setShow] = useState(false);
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const[editshow, setEditShow]=useState(false);
  const showEditModal= ()=>setEditShow(true);
  const closeEditModal=()=>setEditShow(false);
  
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);
  const [userId, setUserId] = useState('');
  const [values, setValues] = useState({
    name: '',
    category: '',
    min_qty: '',
    unit: '',
    description: ''
  });
  const [editValues, setEditValues]=useState({
    name: '',
    category: '',
    min_qty: '',
    unit: '',
    description: ''
  })
  const { addProduct } = useAddProductAPI();
  const { fetchProduct } = useFetchProductAPI();
  const { deleteProduct } = useDeleteProductAPI();
  const{fetchEditProduct}=useGetProductEdit();
  const{updateProductDetails}=useProductUpdate();
  const fetchItems = useCallback(async () => {
    const records = await fetchProduct();
    setItems(records.data.products);
  },[])

  useEffect(() => {
    setUserId(user.id);
    fetchItems();
  }, [fetchItems, user.id]);

  const handleEdit =async (id) => {
    try {
      const editResult= await fetchEditProduct(id);
      setEditValues(editResult.data.producteditResult[0]);
      showEditModal();
    } catch (error) {
       console.log(error)
    }
  };

  // console.log(editValues)
  const handleDelete = async (id) => {
    try {
      const confirm = await swal({
        title: 'Are you sure?',
        text: 'This operation is irreversible!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (confirm) {
        const response = await deleteProduct(id);
        swal({
          text: response.message,
          title: 'SUCCESS!',
          icon: 'success',
          timer: 3000,
        });
        fetchItems();
      } else {
        swal({
          text: 'Item Not deleted!',
          title: 'Canceled!',
          icon: 'success',
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      swal({
        text: error,
        title: 'Warning!',
        icon: 'warning',
        timer: 3500,
      });
    }
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleEditChange=e=>{
    const { name, value } = e.target;
    setEditValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }

  const updateProduct=async(e)=>{
    e.preventDefault();
    try {
      const updateResult= await updateProductDetails(editValues.id, editValues);
      if(updateResult.data.data.error){
        swal({
          text:updateResult.data.data.error,
          title:'ERROR!',
          timer:3500,
          icon:'warning'
        });
      }
      
      else{
        swal({
          text:updateResult.data.data.message,
          title:'Update Successfull',
          timer:3500,
          icon:'success'
        });
        fetchItems();
        closeEditModal();
      }   
    } catch (error) {
        console.log(error);
    }
  }

  const createItem = async () => {
    const response = await addProduct(values, userId);

    if (response.result && response.result.data) {
      swal({
        text: response.result.data,
        title: 'Warning!',
        icon: 'warning',
        timer: 3500,
      });
    }
    
    if (response.response && response.response.data && response.response.data.error) {
      swal({
        text: response.response.data.error,
        title: 'Warning!',
        icon: 'warning',
        timer: 3500,
      });
    } else {
      setValues({
        name: '',
        category: '',
        min_qty: '',
        unit: '',
        description: ''
      });
      swal({
        text: response.data.message,
        title: 'Success',
        icon: 'success',
        timer: 4000,
      });
      closeModal()
      fetchItems();
    }
  };
    
  const handleSubmit = (ev) => {
    ev.preventDefault();
    createItem();
  }

  return (
    <div>
      <TableUI
        data={items}
        _edit={handleEdit}
        _delete={handleDelete}
        showModal={showModal}
        showEditModal={showEditModal}
        className='table table-striped table-bordered hover' 
      />
      <Modal
        show={show}
        onClose={closeModal}
        header="Add Item Modal"
        footer="item modal"
      >
        <ProductForm
          handleValueChange={handleValueChange}
          values={values}
          handleSubmit={handleSubmit}
        />
      </Modal> 
      <Modal  
          show={editshow}
          onClose={closeEditModal}
        >
          <EditProductForm
             editValues={editValues}
             updateProduct={updateProduct}
             handleValueChange={handleEditChange}
          />
      </Modal>
    </div>       
  ); 
  
}

