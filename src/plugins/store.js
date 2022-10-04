import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        currentConference: 'Conf'
    },
    mutations:{
        //sync
    },
    actions:{
        //async
    },
    getters:{
        getCurConf(state){
            return state.currentConference;
        }
    }

})