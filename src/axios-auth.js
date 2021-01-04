import axios from "axios";

const instance = axios.create({
  baseURL: "https://wemakethedistrict20201123145110.azurewebsites.net/api/",
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;
