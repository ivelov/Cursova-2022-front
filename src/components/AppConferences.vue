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
                <v-btn
                    @click="cancelJoin(conference.id)"
                    v-if="conference.participant"
                >
                    <span>Cancel join</span>
                </v-btn>
                <v-btn
                    href="/login"
                    v-else-if="conference.canEdit"
                >
                    <span>Delete</span>
                </v-btn>
                <v-btn
                    @click="joinConf(conference.id)"
                    v-else
                >
                    <span>Join</span>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn
                    @click="details(conference.id)"
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

        this.axios.get("/V1/getPageInfo/" + this.pages.current).then((response) => {

            this.pages.max = response.data.maxPage;
            for(let buttonName of response.data.buttons) {
                this.$set(this.buttons, buttonName, true)
            }
            
        });
    },
    methods:{
        joinConf(id){
            if(!this.$store.getters.isAuth){
                this.$router.push('/login');
            }else{
                this.axios.get("/V1/conferences/join/" + id).then(() => {
                    this.$router.go();
                });
            }
            
        },
        cancelJoin(id){
            this.axios.get("/V1/conferences/cancel/" + id).then(() => {
                this.$router.go();
            });
        },
        details(id){
            if(!this.$store.getters.isAuth){
                this.$router.push('/login');
            }else{
                this.$router.push('/conference/'+id);
            }
        },
        nextPage(){
            this.pages.current += 1;
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
    }
    .row:nth-child(n+2) {
        margin-top: 16px;
    }
    .pageBtn{
        margin-left: 5px;
    }
  </style>