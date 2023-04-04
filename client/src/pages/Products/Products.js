import React, { useContext, useEffect, useState } from 'react';

import { ProductForm } from './product_form';
import Modal from '../../components/UI/Modals/index'
import swal from 'sweetalert'
import{useAddProductAPI, useFetchProductAPI} from '../../appAPIs/productAPIs'
import { AuthContext } from '../../ContextAPI/authContextAPI';
export default function Item() {
  const[show, setShow]=useState(false);
  const showModal=()=>setShow(true);
  const closeModal=()=>setShow(false)
  const [items, setItems]=useState([])

  const{addProduct} =useAddProductAPI();
  const{fetchProduct}= useFetchProductAPI()
 const{user}= useContext(AuthContext)
 const[userId, setId]=useState('');
  const [values, setValues]=useState({ name:"", category:"",  min_qty:"",unit:'',description:"" });
  useEffect(()=>{
    setId(user.id);
    
  })

      useEffect(() => {
        const fetchItems = async () => {
          const items= await fetchProduct();
          setItems(items.data);
        };
        fetchItems();
      },[]);
    console.log(items)
      const handleEdit = (id) => {
        alert(id)
        // getUpdateItem(id).then((response)=>{
        //    console.log(response);
        // }).catch(error=>{
        //   console.log(error);
        // })
      };
  
  const handleDelete = async(id) => {
    swal({
      title: "Are you sure?",
      text: "This operation is irreversible!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirm)=>{
      if(confirm){
        // removeItem(id).then(((response)=>{
        //   swal({
        //           text:response.data,
        //           title:'Success',
        //           icon:"success",
        //           timer:3000
        //         });
        // }))
        // .catch((error)=>{
        //   swal({
        //     text:error,
        //     title:'Warning!',
        //     icon:"warning",
        //     timer:3500
        //   })
        // })
      }else{
        swal({
          text:"Item Not deleted!",
          title:'Canceled!',
          icon:"success",
          timer:3000
        });
      }
    })
    
  };

const handleValueChange=(e)=>{
        let name=e.target.name
        let value=e.target.value
        const newValues={
            ...values,
          [name]:value,
        }
        setValues(newValues);
    }
      
  const createItem=async()=>{
    const response= await addProduct(values, userId)

    console.log(response)
    // const response= await addItem(values);
    // if(response.data.error){
    //   swal({
    //     text:response.data.error,
    //     title:'Warning!',
    //     icon:"warning",
    //     timer:3500
    //   })
    // } else{
    //   swal({
    //     text:response.data,
    //     title:'Success',
    //     icon:"success",
    //     timer:3000
    //   });
    //   setValues({
    //   item_name:"", item_category:"",  min_qty:"",item_unit:'',item_description:"", 
    //   });
    //   closeModal();
    // }
  }

  const handleSubmit=(ev)=>{
    ev.preventDefault()
    console.log(values)
    createItem();
  }

  return (
    <div>
      <button className='btn btn-primary ' onClick={showModal}>ADD PRODC</button>
      <Modal  show={show} onClose={closeModal} header="Add Item Modal"  footer="item modal">
            <ProductForm  handleValueChange={handleValueChange} values={values} handleSubmit={handleSubmit} />
      </Modal>
    
    </div>       
        
  );
}

