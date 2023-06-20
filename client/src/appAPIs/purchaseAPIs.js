import axiosSetup from "../configsetup/axiosconfig";
class purchasesAPI{
    createPurchase=async()=>{
     try {
        const response= await axiosSetup.post('/purchases/post');
        return response;
     } catch (error) {
        return error;
     }
    }

    fetchPurchases=async()=>{
      try {
        const purchases= await axiosSetup.get('/purchases/get');
        return purchases;
      } catch (error) {
        return error;
      }
    }
}

export const useAddPurchaseAPI=()=>{
    const api= new purchasesAPI();
    return {
        addPurchase:api.createPurchase.bind(api)
    }
}

export const useFetchPurchases=()=>{
    const api= new purchasesAPI();
    return {
        fetchPurchases:api.fetchPurchases.bind(api)
    }
}