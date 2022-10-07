import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    countries: [
      { state: "Russia", value: "ru" },
      { state: "Ukraine", value: "ukr" },
      { state: "United States", value: "usa" },
      { state: "United Kingdom", value: "uk" },
    ],
    rules: {
      required: (value) => !!value || "Required.",
      counter: (value) => value.length >= 6 || "Min 6 characters",
      counterMax: (value) => value.length <= 50 || "Max 50 characters",
      email: (value) => {
        const pattern = new RegExp("\\w@\\w");
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
    currentConferenceData: {
      conference: {
        id: null,
        title: "",
        country: "",
        date: "",
        time: "",
        latitude: 0,
        longitude: 0,
      },
      participant: false,
      canUpdate: false,
    },
    conferencesPageInfo: {
        maxPage:1,
        buttons:{}
    },
    loading: true,
    csrf: "",
    isAuth: false,
    canAdd: false,
  },
  mutations: {
    //sync
    setConferencesPageInfo(state, conferencesPageInfo) {
      state.conferencesPageInfo = conferencesPageInfo;
      let buttonsArray = state.conferencesPageInfo.buttons;
      state.conferencesPageInfo.buttons = {};
      for (let buttonName of buttonsArray) {
        state.conferencesPageInfo.buttons[buttonName] = true;
      }
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setCSRF(state, csrf) {
      state.csrf = csrf;
    },
    setAuth(state, isAuth) {
      state.isAuth = isAuth;
    },
    setAdd(state, canAdd) {
        state.canAdd = canAdd;
    },
    setCurrentConferenceData(state, currentConferenceData) {
      state.currentConferenceData = currentConferenceData;
    },
    clearCurrentConferenceData(state) {
      state.currentConferenceData = {
        conference: {
          id: null,
          title: "",
          country: "",
          date: "",
          time: "",
          latitude: 0,
          longitude: 0,
        },
        participant: false,
        canUpdate: false,
      };
    },
    clearAuthData(state){
        state.csrf = "";
        state.canAdd = false;
        state.isAuth = false;
        this.clearCurrentConferenceData();
    }
  },
  actions: {
    //async
    async setConferences(state, page = 1) {
      state.commit("setLoading", true);
      axios.get("/V1/conferences/"+page).then((response) => {
        state.commit("setConferencesPageInfo", response.data);
        state.commit("setLoading", false);
      });
    },
    async setCSRF(state) {
      axios.get("/V1/getCSRF").then((response) => {
        state.commit("setCSRF", response.data);
      });
    },
    async setAuth(state) {
      axios.get("/V1/isAuth").then((response) => {
        state.commit("setAuth", response.data);
      });
    },
    async setAddPerk(state) {
      axios.get("/V1/canAdd").then((response) => {
        state.commit("setAdd", response.data==1 ? true : false);
      });
    },
    /**
     * Set current conference data
     * @param payload Object: id - id of conference, [hard - ignore stored data]
     *
     * @return void
     */
    async setCurrentConferenceData(state, payload) {
      if (
        payload.id == state.getters.getCurrentConferenceData.conference.id &&
        payload["hard"] == undefined
      ) {
        state.commit("setLoading", false);
        return;
      }
      state.commit("setLoading", true);
      axios.get("/V1/conference/" + payload.id).then((response) => {
        state.commit("setCurrentConferenceData", response.data);
        state.commit("setLoading", false);
      });
    },

  },
  getters: {
    getCountries(state) {
      return state.countries;
    },
    getRules(state) {
      return state.rules;
    },
    getConferences(state) {
      return state.conferencesPageInfo.conferences;
    },
    getConferencesPageInfo(state){
        return state.conferencesPageInfo;
    },
    isLoading(state) {
      return state.loading;
    },
    getCSRF(state) {
      return state.csrf;
    },
    isAuth(state) {
      return state.isAuth;
    },
    getCurrentConferenceData(state) {
      return state.currentConferenceData;
    },
  },
});
