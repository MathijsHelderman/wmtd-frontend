import Vue from "vue";
import Vuex from "vuex";
import axios from "@/axios-auth";
import VueJwtDecode from "vue-jwt-decode";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: null,
    username: null
  },
  getters: {
    isAuthenticated(state) {
      // state.token = "sd"; // TODO
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
      // console.log(authData.email + authData.password);
      axios
        .post("/Login", {
          email: authData.email,
          password: authData.password
        })
        .then(res => {
          console.log(res.data[0]);
          // like this
          let token = VueJwtDecode.decode("<your jwt>");
          console.log("Token decoded: " + token);
          // // or like this
          // Vue.use(VueJwtDecode);
          // Vue.jwtDec("<your jwt>");

          // // or in component
          // this.$jwtDec("<your jwt>");

          commit("authUser", res.data);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
          localStorage.token = res.data.token;
          localStorage.userName = res.data.userDetails.userName;
        })
        .catch(error => {
          this.error = error;
          // console.log(this.error);
        });
    },
    logout() {
      this.state.token = null;
      this.state.username = null;
    }
  }
});
