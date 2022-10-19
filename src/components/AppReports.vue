<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>
    <br /><br />
    <v-main>
      <v-container v-if="loading">join
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-container class="container-conferences" v-else>
        <v-row>
          <v-col
            class="report"
            v-for="(report, index) in pageInfo.reports" 
            :key="report.id"
            cols="12"
            sm="4"
          >
            <v-card
              class="report-card"
              elevation="2"
            >
            <v-card-title>{{report.title}}</v-card-title>
            <v-card-text>
              <p>Time: {{report.startTime}}-{{report.endTime}}</p>
              <p class="report-space" v-if="!readMore[index] && report.description">{{report.description.slice(0,100)}}
                <span 
                  v-if="!readMore[index] && report.description.length > 100" 
                  @click="$_readMore(index)">
                  ..read more
                </span>
              </p>
              <p class="report-space" v-else-if="!report.description"></p>
              <p class="report-space" v-if="readMore[index]">{{report.description}}
                <span 
                  @click="$_readMore(index)">
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
          </v-col>
        </v-row>
        
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
    readMore:[]
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

    for (let i = 0; i < 15; i++) {
      this.readMore.push(false);
    }
  },
  methods: {
    $_nextPage() {
      this.curPage = parseInt(this.curPage) + 1;
      this.$store.dispatch("setReports", this.curPage);
      this.$router.push("/reports/" + this.curPage);
      for (let i = 0; i < 15; i++) {
        this.readMore.push(false);
      }
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setReports", this.curPage);
      this.$router.push("/reports/" + this.curPage);
      for (let i = 0; i < 15; i++) {
        this.readMore.push(false);
      }
    },
    $_readMore(index){
      this.$set(this.readMore,index,!this.readMore[index]);
    }
  },
  components: { AppHeader },
};
</script>

<style scoped>
  .report-card{
    min-height: 276px;
  }
  .report-space{
    min-height: 66px;
  }
</style>
