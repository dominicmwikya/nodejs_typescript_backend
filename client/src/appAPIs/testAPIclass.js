import { useCallback } from 'react';
import axios from 'axios';

class testAPIclass{
     fetchProduct1 = useCallback(async (role, setItemState) => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:8000/products', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              role: role,
            },
          });
    
          if (response.data && response.data.products && response.data.products.length > 0) {
            setItemState((prevState) => ({ ...prevState, items: response.data.products }));
          } else {
            setItemState((prevState) => ({ ...prevState, items: [] }));
          }
        } catch (error) {
          console.error(error);
          // Handle the error case here.
          setItemState((prevState) => ({ ...prevState, items: [] }));
        }
      }, []);
}

export const useTESTAPI = () => {
 
  const api= new testAPIclass();
 return {
    fetchProduct1:api.fetchProduct1.bind(api)
 }
  };
  

