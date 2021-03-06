import axios from "axios";

const instance = axios.create({
  baseURL: "https://wemakethedistrict-dev-as.azurewebsites.net/api/",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default instance;
