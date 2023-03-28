import axios from "axios";
const BASE_URL="https://xo-efft.onrender.com";
export default axios.create({
    baseURL:BASE_URL

})