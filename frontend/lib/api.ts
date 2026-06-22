import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;
