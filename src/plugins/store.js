import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        conferences:null,
        loading:true,
        csrf:'',
        isAuth:false
    },
    mutations:{
        //sync
        setConferences(state, page){
            axios.get('/V1/conferences/'+page).then((response)=>{
                state.conferences = response.data;
                state.loading = false;
              })
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
    },
    actions:{
        //async
        async setConferences(state, page = 1){
            state.commit('setLoading', true);
            state.commit('setConferences', page);
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
        }
    },
    getters:{
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
    }

})