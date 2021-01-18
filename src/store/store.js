import Vue from "vue";
import Vuex from "vuex";
import axios from "@/axios-auth";
import VueJwtDecode from "vue-jwt-decode";
import router from "@/router";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    error: null
  },
  getters: {
    getError(state) {
      return state.error;
    },
    isAuthenticated() {
      let access_token = localStorage.getItem("access_token");
      return access_token != "null" && access_token != null;
    },
    getEmail() {
      return localStorage.getItem("email");
    },
    getName() {
      let firstname = localStorage.getItem("firstname");
      let lastname = localStorage.getItem("lastname");
      return firstname + " " + lastname;
    }
  },
  mutations: {
    stateError(state, error) {
      state.error = error;
    },
    logout(state) {
      state.error = null;
      localStorage.setItem("access_token", null);
      localStorage.setItem("refresh_token", null);
    }
  },
  actions: {
    login({ commit }, authData) {
      axios
        .post("/Login", {
          email: authData.email,
          password: authData.password
        })
        .then(async res => {
          if (res.data.httpStatusCode != 200) {
            throw new Error("Not able to login.");
          } else {
            let access_token = res.data.data[0].accessToken;
            let refresh_token = res.data.data[0].refreshToken;

            let decoded_token = VueJwtDecode.decode(access_token);
            let role =
              decoded_token[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ];

            // console.log("Role: " + role);

            if (role != "Admin") {
              return Promise.reject("Cannot login");
            }

            let accountData = res.data.data[0].accountResponse;
            // console.log(
            //   "Accountdata: " + JSON.stringify(accountData, null, "\t")
            // );
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("email", accountData.email);
            localStorage.setItem("firstname", accountData.firstname);
            localStorage.setItem("lastname", accountData.lastname);
            router.go();
          }
        })
        .catch(async () => {
          commit("stateError", "Unknown credentials.");
          // await Vue.nextTick();
          // commit("logout"); // the previous commit will not trigger if I uncomment this line.... WHY?
        });
    },
    logout({ commit }) {
      commit("logout");

      router.go();
    }
  }
});
