import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueCookies from 'vue-cookies'

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
      counterMax: (value) => value.length <= 254 || "Max 255 characters",
      email: (value) => {
        const pattern = new RegExp("\\w@\\w");
        return pattern.test(value) || "Invalid e-mail.";
      },
      size: (value) => {
        if(!value) return true;
        if(value.size > 10000000) 
          return "Max 10 MB file"
        return true;
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
    isAuth: false,
    canAdd: false,
    currentReportData:{
      report:{
        id:null,
        conferenceId:null,
        title:'',
        description:'',
        startTime:'',
        endTime:'',
        presentation:null,
      },
      canUpdate:false,
      busyStartTimes:[],
      busyEndTimes:[],
      confStartTime:'07:00'
    },
    reportsPageInfo: {
      maxPage:1,
      buttons:{'back':true}
  },
  comments:[],
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
        state.canAdd = false;
        state.isAuth = false;
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
    setReportBusyTimes(state, busyTimes) {
      state.currentReportData.busyStartTimes = [];
      state.currentReportData.busyEndTimes = [];
      //console.log(busyTimes);
      for (let i = 0; i < busyTimes.startTimes.length; i++) {
        state.currentReportData.busyStartTimes.push(busyTimes.startTimes[i]);  
        state.currentReportData.busyEndTimes.push(busyTimes.endTimes[i]);  
      }
    },
    setReportError(state, error){
      state.currentReportData.error = error;
    },
    setReportsPageInfo(state, reportsPageInfo) {
      state.reportsPageInfo = reportsPageInfo;
      for (let i = 0; i < reportsPageInfo.reports.length; i++) {
        state.reportsPageInfo.reports[i].readMore = false;
      }
      let buttonsArray = state.reportsPageInfo.buttons;
      state.reportsPageInfo.buttons = {};
      for (let buttonName of buttonsArray) {
        state.reportsPageInfo.buttons[buttonName] = true;
      }
    },
    setCurrentReportData(state, currentReportData) {
      state.currentReportData = currentReportData;
    },
    setComments(state, comments) {
      for (const comment in comments) {
          state.comments.push(comment);
      }
    },
  },
  actions: {
    //async
    async setConferences(state, page = 1) {
      state.commit("setLoading", true);
      axios.get("/conferences/"+page).then((response) => {
        state.commit("setConferencesPageInfo", response.data);
        state.commit("setLoading", false);
      });
    },
    async setAuth(state) {
      axios.get("/isAuth",{},{
        headers: {
          'X-XSRF-TOKEN': VueCookies.get('XSRF-TOKEN'),
        }
      }).then((response) => {
        if(response.status == 200){
          state.commit("setAuth", response.data);
        }else{
          state.commit("setAuth", false);
        }
        
      });
    },
    async setAddPerk(state) {
      axios.get("/canAdd").then((response) => {
        state.commit("setAdd", response.data==1 ? true : false);
      });
    },
    async setCurrentConferenceData(state, payload) {
      if (
        payload.id == state.getters.getCurrentConferenceData.conference.id &&
        payload["hard"] == undefined
      ) {
        state.commit("setLoading", false);
        return;
      }
      state.commit("setLoading", true);
      axios.get("/conference/" + payload.id).then((response) => {
        state.commit("setCurrentConferenceData", response.data);
        state.commit("setLoading", false);
      });
    },
    async setReportBusyTimes(state, payload) {
      state.commit("setLoading", true);
      axios.get("/conference/"+payload.id+'/getBusyTimes',
        {repId: payload.edit? state.currentReportData.report.id : false}
      ).then((response) => {
        state.commit("setReportBusyTimes", response.data);
        state.commit("setLoading", false);
      }).catch((e)=>{
        console.log(e);
        state.commit("setReportError", true);
      });
    },
    async setReports(state, page = 1) {
      state.commit("setLoading", true);
      axios.get("/reports/"+page).then((response) => {
        state.commit("setReportsPageInfo", response.data);
        state.commit("setLoading", false);
      });
    },
    async setCurrentReportData(state, payload) {
      if (
        payload.id == state.getters.currentReportData.id &&
        payload["hard"] == undefined
      ) {
        state.commit("setLoading", false);
        return;
      }
      state.commit("setLoading", true);
      axios.get("/report/" + payload.id).then((response) => {
        state.commit("setCurrentReportData", response.data);
        state.commit("setLoading", false);
      });
    },
    async setComments(state, payload) {
      state.commit("setLoading", true);
      axios.get("/report/" + payload.id+'/comments/'+payload.comment).then((response) => {
        state.commit("setComments", response.data);
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
    isAuth(state) {
      return state.isAuth;
    },
    getCurrentConferenceData(state) {
      return state.currentConferenceData;
    },
    getCurrentReportData(state){
      return state.currentReportData;
    },
    getReportsPageInfo(state) {
      return state.reportsPageInfo;
    },
    getComments(state) {
      return state.comments;
    },
  },
});
