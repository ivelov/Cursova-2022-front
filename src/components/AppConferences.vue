<template>
    <div>
        <AppHeader
        :buttons="buttons"
        ></AppHeader>
    <br><br>
    <v-main>
      
    <v-container v-if="loading">
        <v-text-field
            color="success"
            loading
            disabled
        ></v-text-field>
    </v-container>
    <v-container class="container-conferences" v-else>
        <v-row>
            <v-col>№</v-col>
            <v-col>Title</v-col>
            <v-col>Date</v-col>
            <v-col></v-col>
            <v-col></v-col>
        </v-row>
        <v-row v-for="conference in conferences" :key="conference.id">
            <v-col>{{conference.id}}</v-col>
            <v-col>{{conference.title}}</v-col>
            <v-col>{{conference.date}}</v-col>
            <v-col>
                <v-row 
                class="share-row"
                v-if="conference.participant"
                >
                    <v-btn
                        @click="cancelJoin(conference.id)"
                        color="primary"
                    >
                        <span>Cancel join</span>
                    </v-btn>
                    <ShareNetwork
                        network="facebook"
                        :url="'http://google.com'"
                        title="Facebook share!"
                        :description="'Title:'+conference.title+'\nDate:'+conference.date"
                    >
                        <img src="../assets/facebook.svg" alt="facebook">
                    </ShareNetwork>
                    <ShareNetwork
                        network="twitter"
                        :url="'http://google.com'"
                        title="Twitter share!"
                        :description="'Title:'+conference.title+'\nDate:'+conference.date"
                    >
                        <img src="../assets/twitter.svg" alt="twitter">
                    </ShareNetwork>
                </v-row>
                
                <v-btn
                    @click="deleteConf(conference.id)"
                    color="error"
                    v-else-if="conference.canEdit"
                >
                    <span>Delete</span>
                </v-btn>
                <v-btn
                    @click="joinConf(conference.id)"
                    color="primary"
                    v-else
                >
                    <span>Join</span>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn
                    @click="details(conference.id)"
                    color="primary"
                >
                    <span>Details</span>
                </v-btn>
            </v-col>
        </v-row>
    <br> <br> 
        <p width="100%" class="text-center">Page {{pages.current}} of {{pages.max}}
            <v-btn
                @click="prevPage"
                text
                :disabled="prevBtnDisabled"
            >
                <span>Prev</span>
            </v-btn>
            <v-btn
                @click="nextPage"
                text
                :disabled="nextBtnDisabled"
            >
                <span>Next</span>
            </v-btn>
        </p>
    <br>
    </v-container>

    </v-main>
    </div>
</template>

<script>
import AppHeader from './AppHeader.vue';

    export default {
    name: "AppConferences",
    data: () => ({
        pages: {
            current: 1,
            max: 1,
        },
        buttons:{}
    }),
    computed: {
        conferences() {
            return this.$store.getters.getConferences;
        },
        loading(){
            return this.$store.getters.isLoading;
        },
        nextBtnDisabled(){
            return this.pages.current >= this.pages.max;
        },
        prevBtnDisabled(){
            return this.pages.current <= 1;
        },
    },
    mounted() {
        this.$store.dispatch("setAuth");

        this.pages.current = this.$route.params.page;

        this.$store.dispatch("setConferences", this.pages.current);

        this.axios.get("/V1/getPageInfo").then((response) => {

            this.pages.max = response.data.maxPage;
            for(let buttonName of response.data.buttons) {
                this.$set(this.buttons, buttonName, true)
            }
            
        });


    },
    methods:{
        joinConf(id){
            if(!this.$store.getters.isAuth){
                this.$store.commit('setLoading', true);
                this.$router.push('/login');
            }else{
                this.axios.post("/V1/conferences/join/" + id).then(() => {
                    this.$store.dispatch("setConferences", this.pages.current);
                });
            }
            
        },
        deleteConf(id){
            this.axios.post("/V1/conferences/delete/" + id).then(() => {
                this.$store.dispatch("setConferences", this.pages.current);
            });
        },
        cancelJoin(id){
            this.axios.post("/V1/conferences/cancel/" + id).then(() => {
                this.$store.dispatch("setConferences", this.pages.current);
            });
        },
        details(id){
            if(!this.$store.getters.isAuth){
                this.$store.commit('setLoading', true);
                this.$router.push('/login');
            }else{
                this.$store.commit('setLoading', true);
                this.$router.push('/conference/'+id);
            }
        },
        nextPage(){
            this.pages.current = parseInt(this.pages.current) + 1;
            this.$store.dispatch("setConferences", this.pages.current);
        },
        prevPage(){
            this.pages.current -= 1;
            this.$store.dispatch("setConferences", this.pages.current);
        }
    },
    components: { AppHeader }
}
  </script>

  <style scoped>
    .container-conferences{
        min-width: 500px;
        overflow-x: auto;
    }
    .row{
        outline:3px solid #ced4da;
        align-items: center;
    }
    .row:nth-child(n+2) {
        margin-top: 16px;
    }
    .pageBtn{
        margin-left: 5px;
    }
    .share-row{
        outline:none;
    }
    
    .share-network-facebook, 
    .share-network-twitter, 
    .share-network-twitter img{
        width: 30px;
        height: 30px;
    }

    .share-network-facebook{
        margin-left: 5px;
        margin-right: 5px;
    }
  </style>