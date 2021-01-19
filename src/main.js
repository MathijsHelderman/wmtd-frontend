import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store/store";
import router from "./router";
import axios from "@/axios-auth";
import axiosRefresh from "@/axios-refresh";
import VueJwtDecode from "vue-jwt-decode";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount("#app");

let isRefreshing = false;
axios.interceptors.request.use(
  async config => {
    // console.log("Intercept success");
    // First check if the request was a login request
    if (config.url.includes("Login")) {
      return config;
    }

    let access_token = localStorage.getItem("access_token");
    if (!access_token) {
      // If there is no access token go to login
      router.push({ name: "Home" });
      return Promise.reject("No access token found.");
    } else if (access_token && validateToken(access_token)) {
      // If the access_token is good, add it to the headers of the request
      config.headers.Authorization = `Bearer ${access_token}`;
      isRefreshing = false;
      // console.log(config);
      return config;
    } else if (!isRefreshing) {
      // If the token is invalid but can be refreshed
      isRefreshing = true;
      let tokens = {
        accessToken: localStorage.getItem("access_token"),
        refreshToken: localStorage.getItem("refresh_token")
      };

      let new_access_token = await getNewAccessToken(tokens);

      console.log("New access token: " + new_access_token);

      localStorage.setItem("access_token", new_access_token);
      config.headers.Authorization = `Bearer ${new_access_token}`;
      return config;
    } else {
      // No refresh of access token possible.
      router.push({ name: "Home" });
      return Promise.reject("No valid token found and refresh not possible.");
    }
  },
  err => {
    console.log("Intercept fail");
    return Promise.reject(err);
  }
);

function validateToken(access_token) {
  try {
    let decoded_token = VueJwtDecode.decode(access_token);
    let exp = decoded_token.exp;
    return Date.now() < exp * 1000;
  } catch (error) {
    return false;
  }
}

async function getNewAccessToken(tokens) {
  console.log("New access token requested");
  return await axiosRefresh
    .post("/refresh-accesstoken", tokens)
    .then(res => {
      let token = res.data.data[0];
      if (token) {
        return token;
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log("Could not refresh token: " + err);
      return null;
    });
}
