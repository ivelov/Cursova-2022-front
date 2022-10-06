import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        countries: [
            { state: "Russia", value: "ru" },
            { state: "Ukraine", value: "ukr" },
            { state: "United States", value: "usa" },
            { state: "United Kingdom", value: "uk" },
        ],
        currentConferenceData:{
            conference:{
                id: null,
                title: "",
                country: "",
                date:"",
                time:"",
                latitude: 0,
                longitude: 0,
            },
            participant:false,
            canUpdate:false
        },
        conferences:null,
        loading:true,
        csrf:'',
        isAuth:false
    },
    mutations:{
        //sync
        setConferences(state, conferences){
            state.conferences = conferences;
        },
        setLoading(state, loading){
            state.loading = loading;
        },
        setCSRF(state, csrf){
            state.csrf = csrf;
        },
        setAuth(state, isAuth){
            state.isAuth = isAuth;
        },
        setCurrentConferenceData(state, currentConferenceData){
            state.currentConferenceData = currentConferenceData;
        },
        clearCurrentConferenceData(state){
            state.currentConferenceData = {
                conference:{
                    id: null,
                    title: "",
                    country: "",
                    date:"",
                    time:"",
                    latitude: 0,
                    longitude: 0,
                },
                participant:false,
                canUpdate:false
            };
        },
    },
    actions:{
        //async
        async setConferences(state, page = 1){
            state.commit('setLoading', true);
            axios.get('/V1/conferences/'+page).then((response)=>{
                state.commit('setConferences', response.data);
                state.commit('setLoading', false);
              })
        },
        async setCSRF(state){
            axios.get('/V1/getCSRF').then((response)=>{
                state.commit('setCSRF', response.data);
              })
        },
        async setAuth(state){
            axios.get('/V1/isAuth').then((response)=>{
                state.commit('setAuth', response.data);
              })
        },
        /**
         * Set current conference data
         * @param payload Object: id - id of conference, [hard - ignore stored data] 
         *
         * @return void
         */
        async setCurrentConferenceData(state, payload){
            if(payload.id == state.getters.getCurrentConferenceData.conference.id 
                && payload['hard'] == undefined){
                state.commit('setLoading', false);
                return;
            }
            state.commit('setLoading', true);
            axios.get('/V1/conference/' + payload.id).then((response)=>{
                state.commit('setCurrentConferenceData',  response.data);
                state.commit('setLoading', false);
              })
        }
    },
    getters:{
        getCountries(state){
            return state.countries;
        },
        getConferences(state){
            return state.conferences;
        },
        isLoading(state){
            return state.loading;
        },
        getCSRF(state){
            return state.csrf;
        },
        isAuth(state){
            return state.isAuth;
        },
        getCurrentConferenceData(state){
            return state.currentConferenceData;
        }
    }

})