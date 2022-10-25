<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>
    <br /><br />
    <v-main>
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-container class="container-conferences" v-else>
        <v-menu
          ref="catMenu"
          v-model="catMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-x
          min-width="200"
          min-height="50"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="category-field"
              label="Select category"
              :value="pageInfo.categoryName"
              readonly
              clearable
              @click:clear="$_clearCategory"
              v-bind="attrs"
              v-on="on"
              outlined
            ></v-text-field>
          </template>
          <template>
            <v-container style="background-color: white;">
              <v-treeview
              @update:active="$_selectCategory"
              activatable
              return-object
              :items="categories"
            ></v-treeview>
            </v-container>
          </template>
        </v-menu>
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
            <v-card-title><a @click="$router.push('/report/'+report.id)">{{report.title}}</a></v-card-title>
            <v-card-text>
              <p>Conference: {{report.conferenceTitle}}</p>
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
              <p>Comments: {{report.commentsCount}}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                @click="$store.commit('clearCommentsInfo');
                $router.push('/report/'+report.id)"
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
    readMore:[],
    catMenu:false
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
    categories(){
      return this.$store.getters.getCategories;
    },
  },
  mounted() {
    this.curPage = this.$route.params.page;

    this.$store.dispatch("setReports", {page:this.curPage, category: this.$route.params.category});
    this.$store.dispatch("setCategories");

    for (let i = 0; i < 15; i++) {
      this.readMore.push(false);
    }
  },
  methods: {
    $_nextPage() {
      this.curPage = parseInt(this.curPage) + 1;
      this.$store.dispatch("setReports", {page:this.curPage});
      this.$router.push("/reports/" + this.curPage);
      for (let i = 0; i < 15; i++) {
        this.readMore.push(false);
      }
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setReports", {page:this.curPage});
      this.$router.push("/reports/" + this.curPage);
      for (let i = 0; i < 15; i++) {
        this.readMore.push(false);
      }
    },
    $_readMore(index){
      this.$set(this.readMore,index,!this.readMore[index]);
    },
    $_selectCategory(val){
      this.catMenu = false;
      this.$router.push('/reports/1/'+val[0].id);
      this.$store.dispatch("setReports", {page:this.curPage, category: this.$route.params.category});
    },
    $_clearCategory(){
      this.$router.push('/reports/1');
      this.$store.dispatch("setReports", {page:this.curPage});
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

  .category-field {
  max-width: 300px;
}
</style>
