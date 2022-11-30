import Pusher from "pusher-js";
import Echo from "laravel-echo";
import router from '../router';
import VueCookies from 'vue-cookies';
import axios from "axios";

export default {
    //sync
    setConferencesPageInfo(state, conferencesPageInfo) {
        state.conferencesPageInfo = conferencesPageInfo;      
      },
      setLoading(state, loading) {
        state.loading = loading;
      },
      setAuth(state, isAuth) {
        if(isAuth == true){
          VueCookies.set('isAuth', isAuth);
        }else{
          if(VueCookies.get('isAuth')){
            VueCookies.remove('isAuth');
            router.go();
          }else{
            VueCookies.remove('isAuth');
          }
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
        state.canExport = false;
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
        if(state.pusher === undefined){
          axios.get("/getChannelId").then((response) => {
            window.Pusher = require('pusher-js');
            window.Pusher.logToConsole = true;
  
            window.Echo = new Echo({
              broadcaster: 'pusher',
              key: '4906f8eefb961b37dc0e',
              cluster: 'eu',
              encrypted: true,
              host: "127.0.0.1:8000",
            });
            
            state.pusher = new Pusher('4906f8eefb961b37dc0e', {
              cluster: 'eu',
            });
            state.channel = state.pusher.subscribe('export-channel.'+response.data);
            state.channel.bind('ExportEvent', (v)=>{
              var hiddenElement = document.createElement('a');  
              hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(v.resultCSV);
              hiddenElement.target = '_blank';  
                
              hiddenElement.download = v.fileName ? v.fileName : 'export.csv';  
              hiddenElement.click();  
  
              this.commit('setChannelLoading', false);
            });
          });
        }
      },
      setChannelLoading(state, loading){
        state.channelLoading = loading;
      },
      setMeetingsPageInfo(state, pageInfo){
        state.meetingsPageInfo = pageInfo;
      },
      definePerks(state, perks){
        let availablePerks = ['canAdd', 'isAdmin'];
        availablePerks.forEach(perk => {
          if(perks[perk]){
            if(!VueCookies.isKey(perk)){
              VueCookies.set(perk, true);
            }
          }else{
            if(VueCookies.isKey(perk)){
              VueCookies.remove(perk);
            }
          }
        });
      }
}