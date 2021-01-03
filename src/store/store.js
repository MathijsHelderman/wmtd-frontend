import Vue from "vue";
import Vuex from "vuex";
import axios from "../axios-auth";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: null,
    username: null
  },
  getters: {
    isAuthenticated(state) {
      return state.token != null;
    }
  },
  mutations: {
    authUser(state, userData) {
      state.token = userData.token;
      state.username = userData.userDetails.userName;
    }
  },
  actions: {
    login({ commit }, authData) {
      axios
        .post("/Login", {
          username: authData.username,
          password: authData.password
        })
        .then(res => {
          console.log(res.data);
          commit("authUser", res.data);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
          localStorage.token = res.data.token;
          localStorage.userName = res.data.userDetails.userName;
        })
        .catch(error => (this.error = error));
    }
  }
});
