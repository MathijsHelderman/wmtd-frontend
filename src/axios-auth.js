import axios from "axios";
// import VueJwtDecode from "vue-jwt-decode";
// import router from "./router";
// import { store } from "./store/store";

const instance = axios.create({
  baseURL: "https://wemakethedistrict-dev-as.azurewebsites.net/api/",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default instance;
