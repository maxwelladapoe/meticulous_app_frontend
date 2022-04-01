import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("meticulous_app_max_auth_token") || null,
    isAuthenticated:
      JSON.parse(
        localStorage.getItem("meticulous_app_max_auth_isAuthenticated")
      ) || false,
    userData:
      JSON.parse(localStorage.getItem("meticulous_app_max_auth_userData")) ||
      {},
  }),


  actions: {
    async logout() {
      let response = await api.delete("/users/sign_out");
      this.resetUserInfo();
      return response;
    },

    async login(userCredentials) {
      let response = await api.post("/users/sign_in", userCredentials);

      if (response.data) {
        this.setUserInfo(response);
      } else {
        this.resetUserInfo();
      }

      return response;
    },

    async signup(userCredentials) {
      let response = await api.post("/users", userCredentials);

      if (response.data) {
        this.setUserInfo(response);
      } else {
        this.resetUserInfo();
      }
      return response;
    },

    setUserInfo(response) {
      //pass response
      this.userData = response.data.user;
      this.token = response.headers.authorization;

      this.isAuthenticated = true;
      localStorage.setItem(
        "meticulous_app_max_auth_token",
        response.headers.authorization
      );

      localStorage.setItem(
        "meticulous_app_max_auth_userData",
        JSON.stringify(response.data.user)
      );

      localStorage.setItem(
        "meticulous_app_max_auth_isAuthenticated",
        JSON.stringify(true)
      );
    },

    setUserInfoFromToken(response) {
      //pass response
      this.userData = response.data.user;
      this.isAuthenticated = true;
      this.token = localStorage.getItem("meticulous_app_max_auth_token");
      localStorage.setItem(
        "meticulous_app_max_auth_userData",
        JSON.stringify(response.data.user)
      );
      localStorage.setItem(
        "meticulous_app_max_auth_isAuthenticated",
        JSON.stringify(true)
      );
    },
    resetUserInfo() {
      this.userData = {};
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("meticulous_app_max_auth_token");
      localStorage.removeItem("meticulous_app_max_auth_userData");
      localStorage.removeItem("meticulous_app_max_auth_isAuthenticated");
    },
  },
});
