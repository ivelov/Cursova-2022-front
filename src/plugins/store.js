import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        currentConference: 'Conf',
        conferences:null,
        loading:true
    },
    mutations:{
        //sync
        setConferences(state, page){
            axios.get('/V1/conferences/'+page).then((response)=>{
                state.conferences = response.data;
                state.loading = false;
              })
        },
        setCurrentConference(state, id){ 
            for(let conference of state.conferences) {
                if(conference.id == id){
                    state.currentConference = conference;
                    break;
                }
            }
        },
        setLoading(state, loading){
            state.loading = loading;
        },
    },
    actions:{
        //async
        async setConferences(state, page = 1){
            state.commit('setLoading', true);
            state.commit('setConferences', page);
        }
    },
    getters:{
        getCurrentConference(state){
            return state.currentConference;
        },
        getConferences(state){
            return state.conferences;
        },
        isLoading(state){
            return state.loading;
        }
    }

})