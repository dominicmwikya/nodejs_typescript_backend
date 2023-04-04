import axiosSetup from "../configsetup/axiosconfig";

class APIs {
    registerUser = async (values) => {
     
      try {
        const response = await axiosSetup.post('/users/create', values);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    };
  }
  
  export const useRegister = () => {
    const api = new APIs();
    return {
      RegisterUser: api.registerUser.bind(api),
    };
  };
  