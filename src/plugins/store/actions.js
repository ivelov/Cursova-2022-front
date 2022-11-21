import axios from "axios";
import VueCookies from 'vue-cookies';

export default {
    //async
    async setConferences(state, payload = {page:1}) {
        state.commit("setLoading", true);
        if(!state.getters.isAuth){
          axios.get("/conferences/"+payload.page).then((response) => {
            state.commit("setConferencesPageInfo", response.data);
          }).finally(() => {
            state.commit("setLoading", false);
          });
          return;
        }
        axios.post("/conferences/"+payload.page, state.getters.getFilters).then((response) => {
          state.commit("setConferencesPageInfo", response.data);
        }).finally(() => {
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
      async definePerks(state) {
        return new Promise((resolve, reject) => {
          axios.get("/get-perks").then((response) => {
            state.commit("definePerks", response.data);
            resolve();
          }).catch(()=>{
            state.commit("definePerks", {});
            reject();
          });
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
        }).finally(() => {
          state.commit("setLoading", false);
        });
      },
      async setReportBusyTimes(state, payload) {
        state.commit("setLoading", true);
        await axios.post("/conference/"+payload.id+'/getBusyTimes',
          {repId: payload.edit? state.getters.getCurrentReportData.report.id : false}
        ).then((response) => {
          state.commit("setReportBusyTimes", response.data);
        }).catch((e)=>{
          console.log(e);
          state.commit("setReportError", true);
        }).finally(() => {
          state.commit("setLoading", false);
        });
      },
      async setReports(state, payload = {page: 1, favorites:false}) {
        state.commit("setLoading", true);
        if(!state.getters.isAuth){
          axios.get("/reports/"+payload.page).then((response) => {
            state.commit("setReportsPageInfo", response.data);
          }).finally(() => {
            state.commit("setLoading", false);
          });
          return;
        }
        if(payload.favorites){
          var data = Object.assign({}, state.getters.getFilters);
          data.favorites = true;
          axios.post("/reports/"+payload.page, data).then((response) => {
            state.commit("setReportsPageInfo", response.data);
          }).finally(() => {
            state.commit("setLoading", false);
          });
        }else{
          axios.post("/reports/"+payload.page, state.getters.getFilters).then((response) => {
            state.commit("setReportsPageInfo", response.data);
          }).finally(() => {
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
            if(payload.edit){
              state.dispatch("setReportBusyTimes", {id: state.getters.getCurrentReportData.report.conferenceId, edit: true});
            }
            resolve();
          }).catch((er)=>{
            reject(er);
          }).finally(() => {
            state.commit("setLoading", false);
          });
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
          }).finally(() => {
            state.commit("setLoading", false);
          });
        }else{
          axios.get("/categories").then((response) => {
            state.commit("setCategories", response.data);
          }).finally(() => {
            state.commit("setLoading", false);
          });
        }
        
      },
      async setCategoriesList(state) {
        axios.get("/categoriesList").then((response) => {
          state.commit("setCategoriesList", response.data);
        });
      },
      async setMeetingsPageInfo(state, page = 1) {
        return new Promise((resolve, reject) => {
          axios.get("/meetings/"+page).then((response) => {
            state.commit("setMeetingsPageInfo", response.data);
            resolve();
          }).catch(()=>{reject()});
        });
      },
}