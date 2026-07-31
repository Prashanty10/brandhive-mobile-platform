import axios from "axios";

const api = axios.create({
  baseURL: "http://10.149.202.24:3000/",
  header: {
    "content-Type": "application/json",
  },
});

api.interceptors.request.use = async (config) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  if(accessToken){
    config.headers.Authorization
  }
};

export default api;
