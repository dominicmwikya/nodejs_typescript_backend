import React, { useCallback, useContext, useEffect, useState } from 'react';
import Modal from '../../components/UIs/Modals/index';
import swal from 'sweetalert';
import { AuthContext } from '../../ContextAPI/authContextAPI';
import TableUI from '../../components/UIs/Tables/TableUis';
import { useAddProductAPI, useDeleteProductAPI, useFetchProductAPI, useGetProductEdit,useProductUpdate } from '../../appAPIs/productAPIs';
import { ProductForm } from './product_form';
import { EditProductForm } from './edit_product_form';
import { Container,Row,Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Item() {
  const [show, setShow] = useState(false);
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);
  const [editshow, setEditShow] = useState(false);
  const showEditModal = () => setEditShow(true);
  const closeEditModal = () => setEditShow(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [itemState, setItemState] = useState({
    items: [],
    values: {
      name: '',
      category: '',
      min_qty: '',
      unit: '',
      description: ''
    },
    editValues: {
      name: '',
      category: '',
      min_qty: '',
      unit: '',
      description: ''
    }
  });

  const { addProduct } = useAddProductAPI();
  const { fetchProduct } = useFetchProductAPI();
  const { deleteProduct } = useDeleteProductAPI();
  const { fetchEditProduct } = useGetProductEdit();
  const { updateProductDetails } = useProductUpdate();
  
  const fetchItems = useCallback(async () => {
    try {
      await fetchProduct(user.role, setItemState);
    } catch (error) {
      console.log(error);
      // Handle the error case here.
    }
  }, [user.role]);
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems, user]);

  const handleEdit = async (id) => {
    try {
      const editResult= await fetchEditProduct(id);
      setItemState(prevState => ({
        ...prevState,
        editValues: editResult.data.producteditResult[0]
      }));
      showEditModal();
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = async (id, role) => {
    const token= localStorage.getItem('token');
    try {
      const confirm = await swal({
        title: 'Are you sure?',
        text: 'This operation is irreversible!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (confirm) {
        const response = await deleteProduct(id, role, token);
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
    setItemState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        [name]: value
      }
    }));
  };

  const handleEditChange = e => { 
    const { name, value } = e.target;
    setItemState(prevState => ({
      ...prevState,
      editValues: {
        ...prevState.editValues,
        [name]: value
      }
    }));
  }

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const updateResult = await updateProductDetails(itemState.editValues.id, itemState.editValues);
      if (updateResult.data.data.error) {
        swal({
          text: updateResult.data.data.error,
          title: 'ERROR!',
          timer: 3500,
          icon: 'warning'
        });
      } else {
        swal({
          text: updateResult.data.data.message,
          title: 'Update Successfull',
          timer: 3500,
          icon: 'success'
        });
        fetchItems();
        closeEditModal();
      }   
    } catch (error) {
      console.log(error);
    }
  }

  const createItem = async () => {
    const response = await addProduct(itemState.values, user.id);

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
      setItemState(prevState => ({
        ...prevState,
        values: {
          name: '',
          category: '',
          min_qty: '',
          unit: '',
          description: ''
        }
      }));
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

  if (!user.authState) {
    navigate('/login');
    return null;
  }

  return (
    <Container>
      <Row>
         <Col md={2}>
         <i className="fa fa-plus" aria-hidden="true" onClick={showModal} 
                    style={{color:"green", color:'white', backgroundColor:'green',
                    margin: '10px 0px', borderRadius:'5px', padding:'10px 40px'}}>
                 </i>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
            <TableUI
              data={itemState.items}
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
              footer="item modal">
              <ProductForm
                handleValueChange={handleValueChange}
                values={itemState.values}
                handleSubmit={handleSubmit}
                />
            </Modal> 

            <Modal  
                show={editshow}
                onClose={closeEditModal}>
                <EditProductForm
                  editValues={itemState.editValues}
                  updateProduct={updateProduct}
                  handleValueChange={handleEditChange}
                />
            </Modal>
        </Col>
      </Row>
    </Container>       
  ); 
}
