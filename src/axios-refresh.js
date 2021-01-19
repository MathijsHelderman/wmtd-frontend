import axios2 from "axios";

const instance2 = axios2.create({
  baseURL: "https://wemakethedistrict-dev-as.azurewebsites.net/api/",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default instance2;
