// import axios from "axios";

// // Create axios instance with backend base URL
// const api = axios.create({
//   baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
// });
// // Interceptor to automatically attach JWT token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const waitForAuth = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      unsubscribe();
      resolve(user);
    });
  });
const api = axios.create({
  // baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  baseURL: `http://localhost:3000/api`,
});
api.interceptors.request.use(async (config) => {
  let user = getAuth().currentUser;

  if (!user) {
    user = await waitForAuth();
  }

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
