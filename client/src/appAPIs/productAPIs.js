import axiosSetup from "../configsetup/axiosconfig";

class producAPIs {
    createProduct = async (values, userId) => {
      try {
        const response = await axiosSetup.post(`/products/${userId}`, values);
        return response.data;
      } catch (error) {
        return error;
      }
    };

    getProducts=async()=>{
        try {
            const products= await axiosSetup.get('/products');
            return products;
        } catch (error) {
            return error;
        }
    }

    deleteProduct=async(id)=>{
      try {
        const response= await axiosSetup.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
    }

    fetchEditProduct=async(id)=>{
      try {
        const product_data= await axiosSetup.get(`/products/${id}`);
        return product_data;
      } catch (error) {
          return error;
      }
    }

    updateProduct=async(id, data)=>{
      try {
        const result= await axiosSetup.put(`/products/${id}`, data);
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
