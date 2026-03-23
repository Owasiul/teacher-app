import axios from "axios";

const axiosPublic = axios.create({
  // Replace with your deployed Vercel/Render link later
  baseURL: "http://localhost:5000", 
});

export default axiosPublic;