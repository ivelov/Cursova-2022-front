import VueCookies from 'vue-cookies';

export default {
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
  isAdmin() {
    return VueCookies.get('isAdmin');
  },
  getMeetingsPageInfo(state) {
    return state.meetingsPageInfo;
  },
  getCurrentPlan(state) {
    return state.currentPlan;
  },
  getAvailableJoins(state) {
    return state.availableJoins;
  },
  getIntent(state) {
    return state.intent;
  },
  isPlanLoading(state) {
    return state.planLoading;
  },
  isErrorFromJoins(state) {
    return state.errorFromJoins;
  },
}