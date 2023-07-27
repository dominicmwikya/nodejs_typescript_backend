import axiosSetup from "../configsetup/axiosconfig";

class producAPIs {
    createProduct = async (values, userId) => {
      try {
        const token =  localStorage.getItem('token');
        
        const response = await axiosSetup.post(`/products/${userId}`, values,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        return error;
      }
    };

    getProducts = async(role, setItemState) => { 
      try {
        const token = localStorage.getItem('token');
        const products = await axiosSetup.get('/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role: role,
          },
        });
    
        if (products && products.data && Array.isArray(products.data.products) && products.data.products.length > 0) {
          setItemState((prevState) => ({
            ...prevState,
            items: products.data.products,
          }));
        } else {
          // Handle the case when the products array is empty or undefined.
          setItemState((prevState) => ({
            ...prevState,
            items: [],
          }));
        }
      } catch (error) {
        console.error(error);
        // Handle the error case here.
      }
    }

    deleteProduct = async(id,role,token) => {
      try {
        // const token = await localStorage.getItem('token');
        const response = await axiosSetup.delete(
          `/products/${id}`,role,
          {
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        return response.data;
    } catch (error) {
        return error;
    }
    }

    fetchEditProduct=async(id)=>{
      try {
        const token = localStorage.getItem('token');

        const product_data= await axiosSetup.get(`/products/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        return product_data;
      } catch (error) {
          return error;
      }
    }

    updateProduct=async(id, data)=>{
      try {
        const token = localStorage.getItem('token');

        const result = await axiosSetup.put(`/products/${id}`, data, {
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        return result;
      } catch (error) {
        return error;
      }
        
    }
  }

  export const useAddProductAPI = () => {
    const api = new producAPIs();
    return {
        addProduct: api.createProduct.bind(api),
    };
    
  };


  export const useFetchProductAPI = () => {
    const api = new producAPIs();
    return {
        fetchProduct: api.getProducts.bind(api),
    };
}

export const useDeleteProductAPI=()=>{
   const api= new producAPIs();
   return {
    deleteProduct:api.deleteProduct.bind(api)
   }
}

export const useGetProductEdit=()=>{
  const api= new producAPIs();
  return {
    fetchEditProduct:api.fetchEditProduct.bind(api)
  }
}

export const useProductUpdate = () => {
  const api = new producAPIs();
  return {
      updateProductDetails: api.updateProduct.bind(api),
  };
  
};
