<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>
    <br /><br />
    <v-main>
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-container class="container-conferences" v-else>
        <v-card
          elevation="2"
          v-for="report in pageInfo.reports" :key="report.id"
        >
        <v-card-title>{{report.title}}</v-card-title>
        <v-card-text>
          <p>Time: {{report.startTime}}-{{report.endTime}}</p>
          <p v-if="!report.readMore">{{report.description.slice(0,100)}}
            <span 
              v-if="!report.readMore && report.description.length > 100" 
              @click="report.readMore = !report.readMore">
              ..read more
            </span>
          </p>
          <p v-if="report.readMore">{{report.description}}
            <span 
              @click="report.readMore = !report.readMore">
              ..hide
            </span>
          </p> 
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="deep-purple lighten-2"
            text
            @click="$router.push('/report/'+report.id)"
          >
            Details
          </v-btn>
        </v-card-actions>
        </v-card>
        <br />
        <br />
        
      </v-container>
      <p width="100%" class="text-center">
          Page {{ curPage }} of {{ pageInfo.maxPage }}
          <v-btn @click="$_prevPage" text :disabled="prevBtnDisabled">
            <span>Prev</span>
          </v-btn>
          <v-btn @click="$_nextPage" text :disabled="nextBtnDisabled">
            <span>Next</span>
          </v-btn>
        </p>
        <br />
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";

export default {
  name: "AppReports",
  data: () => ({
    curPage: 1,
    btnsLoading: false,
  }),
  computed: {
    pageInfo() {
      return this.$store.getters.getReportsPageInfo;
    },
    buttons() {
      return this.$store.getters.getReportsPageInfo.buttons;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    nextBtnDisabled() {
      return this.curPage >= this.pageInfo.maxPage;
    },
    prevBtnDisabled() {
      return this.curPage <= 1;
    },
  },
  mounted() {

    this.curPage = this.$route.params.page;

    this.$store.dispatch("setReports", this.curPage);
  },
  methods: {
    $_nextPage() {
      this.curPage = parseInt(this.curPage) + 1;
      this.$store.dispatch("setReports", this.curPage);
      this.$router.push("/reports/" + this.curPage);
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setReports", this.curPage);
      this.$router.push("/reports/" + this.curPage);
    },
  },
  components: { AppHeader },
};
</script>

<style scoped>
.container-conferences {
  
  overflow-x: auto;
}

.conf-row {
  min-width: 620px;
  outline: 3px solid #ced4da;
  align-items: center;
}


.row:nth-child(n + 2) {
  margin-top: 16px;
}

.pageBtn {
  margin-left: 5px;
}

.conf-btn{
  margin-top: 2px;
  margin-bottom: 2px;
}

.share-row {
  align-items: center;
}

.share-row {
  align-items: center;
}

.share-network-facebook,
.share-network-twitter,
.share-network-twitter img {
  width: 30px;
  height: 30px;
}

.share-network-facebook {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
