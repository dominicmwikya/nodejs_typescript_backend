import axiosSetup from "../configsetup/axiosconfig";

class producAPIs {
    createProduct = async (values, userId) => {
     
      try {
        const response = await axiosSetup.post(`/products/${userId}`, values);
        return response.data;
      } catch (error) {
        return error.response.data;
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