import axios from "axios";

const PRODUCT_SERVICE_URL = "http://127.0.0.1:3000/products-queue"; 

export const PullData = async (requestData: Record<string, unknown>) => {
  console.log({requestData});
  
  const response = await axios.post(PRODUCT_SERVICE_URL, requestData)

  console.log({response});
  

  return { data: response.data, status: 200 };

};
