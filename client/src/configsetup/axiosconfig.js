import axios from "axios";

const axiosSetup= axios.create({
    baseURL:'http://localhost:8000'
});

export default axiosSetup;