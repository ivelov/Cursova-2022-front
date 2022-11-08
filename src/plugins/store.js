import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueCookies from 'vue-cookies'
import Pusher from "pusher-js";

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
      counter: (value) => (value.length >= 6 || value.length == 0) || "Min 6 characters",
      counterMax: (value) => value.length <= 254 || "Max 255 characters",
      email: (value) => {
        const pattern = new RegExp("\\w@\\w");
        return pattern.test(value) || "Invalid e-mail.";
      },
      size: (value) => {
        if(!value) return true;
        if(typeof(value)=='string') return false;
        if(value.size > 10000000) 
          return "Max 10 MB file"
        return true;
      },
    },
    currentConferenceData: {
      conference: {
        id: null,
        title: "",
        category_id:null,
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
      reports:[],
      maxPage:1,
  },
  commentsInfo:{
    comments:[],
    maxPage:1,
    curPage:0,
    loading:false
  },
  categories:[],
  categoriesList:[],
  filters:{},
  pusher:undefined,
  channel:undefined,
  channelLoading: false,
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
      if(isAuth == true){
        VueCookies.set('isAuth', isAuth);
      }else{
        VueCookies.remove('isAuth');
      }
    },
    setAdd(state, canAdd) {
      if(canAdd == true){
        VueCookies.set('canAdd', canAdd);
      }else{
        VueCookies.remove('canAdd');
      }
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
      VueCookies.remove('isAuth');
      VueCookies.remove('canAdd');
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
      state.currentReportData.confStartTime = busyTimes.confStartTime;
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
    },
    setReportReadMore(state, index){
      state.reportsPageInfo.reports[index].readMore = !state.reportsPageInfo.reports[index].readMore; 
    },
    setCurrentReportData(state, currentReportData) {
      state.currentReportData = currentReportData;
      currentReportData.report.presentation = new File([currentReportData.report.presentation], "presentation");
    },
    setReportConferenceCategory(state, reportConferenceCategory) {
      state.currentReportData.conferenceCategory = reportConferenceCategory;
    },
    setComments(state, commentsInfo) {
      var commentsJson = commentsInfo.comments;
      commentsInfo.comments = [];
      for (let i = 0; i < state.commentsInfo.comments.length; i++) {
        commentsInfo.comments.push(state.commentsInfo.comments[i]);
      }
      for (let i = 0; i < commentsJson.length; i++) {
        commentsInfo.comments.push(commentsJson[i]);
      }
      commentsInfo.curPage = state.commentsInfo.curPage + 1;
      state.commentsInfo = commentsInfo;
      state.commentsInfo.loading = false;
    },
    setCommentsLoading(state, loading) {
      state.commentsInfo.loading = loading;
    },
    clearCurrentReportData(state) {
      state.currentReportData = {
        report:{ id:null,
          conferenceId:null,
          title:'',
          description:'',
          startTime:'',
          endTime:'',
          presentation:null,},
        canUpdate:false,
        busyStartTimes:[],
        busyEndTimes:[],
        confStartTime:'07:00'
      };
    },
    clearCommentsInfo(state){
      state.commentsInfo = {
        comments:[],
        maxPage:1,
        curPage:0,
        loading:false
      }; 
    },
    setCategories(state, categories){
      state.categories = categories;
    },
    setCategoriesList(state, categoriesList){
      state.categoriesList = categoriesList;
    },
    clearFilters(state){
      state.filters = {};
    },
    setFilters(state, filters){
      state.filters = filters;
    },
    initializePusher(state) {
      if(!state.pusher){
        this.pusher = new Pusher('4906f8eefb961b37dc0e', {
          cluster: 'eu'
        });
        this.channel = this.pusher.subscribe('my-channel');
        this.channel.bind('ExportEvent', (v)=>{
          console.log(v);
          this.commit('setChannelLoading', false);
        });
      }
    },
    setChannelLoading(state, loading){
      state.channelLoading = loading;
    },
  },
  actions: {
    //async
    async setConferences(state, payload = {page:1}) {
      state.commit("setLoading", true);
      if(!state.getters.isAuth){
        axios.get("/conferences/"+payload.page).then((response) => {
          state.commit("setConferencesPageInfo", response.data);
          state.commit("setLoading", false);
        });
        return;
      }
      axios.post("/conferences/"+payload.page, state.getters.getFilters).then((response) => {
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
        if(response.status == 200 && response.data == 1){
          state.commit("setAuth", true);
        }else{
          state.commit("setAuth", false);
        }
        
      }).catch(()=>{
        state.commit("setAuth", false);
        state.commit("clearAuthData");
      });
    },
    async setAddPerk(state) {
      axios.get("/canAdd").then((response) => {
        state.commit("setAdd", response.data==1 ? true : false);
      }).catch(()=>{
        state.commit("setAdd", false);
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
      await axios.post("/conference/"+payload.id+'/getBusyTimes',
        {repId: payload.edit? state.getters.getCurrentReportData.report.id : false}
      ).then((response) => {
        state.commit("setReportBusyTimes", response.data);
        state.commit("setLoading", false);
      }).catch((e)=>{
        console.log(e);
        state.commit("setReportError", true);
      });
    },
    async setReports(state, payload = {page: 1, favorites:false}) {
      state.commit("setLoading", true);
      if(!state.getters.isAuth){
        axios.get("/reports/"+payload.page).then((response) => {
          state.commit("setReportsPageInfo", response.data);
          state.commit("setLoading", false);
        });
        return;
      }
      if(payload.favorites){
        var data = Object.assign({}, state.getters.getFilters);
        data.favorites = true;
        axios.post("/reports/"+payload.page, data).then((response) => {
          state.commit("setReportsPageInfo", response.data);
          state.commit("setLoading", false);
        });
      }else{
        axios.post("/reports/"+payload.page, state.getters.getFilters).then((response) => {
          state.commit("setReportsPageInfo", response.data);
          state.commit("setLoading", false);
        });
      }
      
    },
    async setCurrentReportData(state, payload) {
      if (
        payload.id == state.getters.getCurrentReportData.report.id &&
        payload["hard"] == undefined
      ) {
        state.commit("setLoading", false);
        return;
      }
      return new Promise((resolve, reject) => {
        state.commit("setLoading", true);
        axios.get("/report/" + payload.id).then((response) => {
          state.commit("setCurrentReportData", response.data);
          state.commit("setLoading", false);
          if(payload.edit){
            state.dispatch("setReportBusyTimes", {id: state.getters.getCurrentReportData.report.conferenceId, edit: true});
          }
          resolve();
        }).catch((er)=>reject(er));
      });
      
    },
    async setReportConferenceCategory(state, conferenceId) {
      axios.get("/conference/"+conferenceId+'/getCategory').then((response) => {
        state.commit("setReportConferenceCategory", response.data);
        state.dispatch("setCategories", {parentId:response.data, hard:true})
      });
    },
    async setComments(state, payload) {
      if(state.getters.getCommentsInfo.loading) return;
      if(payload.id == null) return;

      state.commit("setCommentsLoading", true);
      
      if(payload.page !== undefined){
        axios.get("/report/" + payload.id+'/comments/'+payload.page).then((response) => {
          if(payload.page == 0){
            state.commit('clearCommentsInfo');
          }
          state.getters.getCommentsInfo.curPage = payload.page;
          state.commit("setComments", response.data);
        });
      }else{
        if(state.getters.getCommentsInfo.curPage >= state.getters.getCommentsInfo.maxPage) return;

        var page = state.getters.getCommentsInfo.curPage + 1; 
        axios.get("/report/" + payload.id+'/comments/'+page).then((response) => {
          state.commit("setComments", response.data);
        });
      }
    },
    async setCategories(state, payload = {parentId: false, hard: false}) {
      if(state.categories && !payload.hard) return;
      if(payload.parentId){
        axios.get("/categories/"+payload.parentId).then((response) => {
          state.commit("setCategories", response.data);
          state.commit("setLoading", false);
        });
      }else{
        axios.get("/categories").then((response) => {
          state.commit("setCategories", response.data);
          state.commit("setLoading", false);
        });
      }
      
    },
    async setCategoriesList(state) {
      axios.get("/categoriesList").then((response) => {
        state.commit("setCategoriesList", response.data);
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
    isAuth() {
      return VueCookies.get('isAuth');
    },
    canAdd(){
      return VueCookies.get('canAdd');
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
    getCommentsInfo(state) {
      return state.commentsInfo;
    },
    getCategories(state) {
      return state.categories;
    },
    getCategoriesList(state) {
      return state.categoriesList;
    },
    getFilters(state) {
      return state.filters;
    },
    getPusher(state) {
      return state.pusher;
    },
    getChannel(state) {
      return state.channel;
    },
    getChannelLoading(state) {
      return state.channelLoading;
    },
  },
});
