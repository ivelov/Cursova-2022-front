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
    <v-container v-else>
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
                    @click="this.$router.go()"
                    text
                    v-if="conference.participant"
                >
                    <span>Cancel join</span>
                </v-btn>
                <v-btn
                    href="/login"
                    text
                    v-else-if="conference.canEdit"
                >
                    <span>Delete</span>
                </v-btn>
                <v-btn
                    href="/login"
                    
                    v-else
                >
                    <span>Join</span>
                </v-btn>
            </v-col>
            <v-col></v-col>
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
        buttons:{
            add:true,
            login:true,
            logout:false,
            back:false
          }
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
        this.pages.current = this.$route.params.page;

        this.$store.dispatch("setConferences", this.pages.current);

        this.axios.get("/V1/getPageInfo/" + this.pages.current).then((response) => {
            this.pages.max = response.data.maxPage;
        });
    },
    methods:{
        joinConf(){

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