import Axios from "axios";

const api = new Axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("meticulous_app_max_auth_token");
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status == "401" &&
      error.response.data.error == "Signature has expired"
    ) {
      localStorage.removeItem("meticulous_app_max_auth_token");
      localStorage.removeItem("meticulous_app_max_auth_userData");
      localStorage.removeItem("meticulous_app_max_auth_isAuthenticated");
      //       window.location.href="/login"
    }

    return Promise.reject(error);
  }
);

export default api;
