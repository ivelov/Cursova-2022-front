<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>
    <br />
      <v-main>
      <v-navigation-drawer  
        class="filter-drawer"
        v-model="filterMenu" 
        absolute
        :temporary="false"
      >
      <v-btn
        text
        @click="filterMenu = !filterMenu"
      >
        <span>&lt;</span>
      </v-btn>
      <v-divider></v-divider>
        <v-list >
          <v-list-item>
            Reports count
          </v-list-item>
          <v-list-item>
            <v-slider
              v-model="filters.reportsCount"
              thumb-label
              min="-1"
              max="100"
            ></v-slider>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item>
            Start date
          </v-list-item>
          <v-list-item>
           <v-menu
              ref="startDateMenu"
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.startDate"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.startDate"
              ></v-date-picker>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item>
            End date
          </v-list-item>
          <v-list-item>
           <v-menu
              ref="endDateMenu"
              v-model="endDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.endDate"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.endDate"
              ></v-date-picker>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item>
            Categories
          </v-list-item>
          <v-list-item>
            <v-autocomplete
              v-model="filters.categories"
              :items="categoriesList"
              item-text="state"
              item-value="value"
              clearable
              multiple
              outlined
            ></v-autocomplete>
          </v-list-item>
          <v-divider></v-divider>
          <br>
          <v-btn
            color="success"
            @click="$_reloadConferences"
          >
            Apply filters
          </v-btn>
        </v-list>
      </v-navigation-drawer>
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
        <v-btn
              @click="filterMenu = !filterMenu"
            >
              Filters
            </v-btn>
        <v-row class="conf-row">
          <v-col>№</v-col>
          <v-col>Title</v-col>
          <v-col>Date</v-col>
          <v-col></v-col>
          <v-col></v-col>
        </v-row>
        <v-row class="conf-row" v-for="(conference, index) in pageInfo.conferences" :key="conference.id">
          <v-col>{{ (index + 1) + (curPage-1) * 15 }}</v-col>
          <v-col>{{ conference.title }}</v-col>
          <v-col>{{ conference.date }}</v-col>
          <v-col>
            <v-row class="share-row" v-if="conference.participant">
              <v-btn class="conf-btn" @click="$_cancelJoin(conference.id)" color="primary">
                <span>Cancel join</span>
              </v-btn>
              <ShareNetwork
                class="conf-btn"
                network="facebook"
                :url="'http://ivelov-vm.groupbwt.com/register'"
                title="Facebook share!"
                :description="
                  'Title:' + conference.title + '\nDate:' + conference.date
                "
              >
                <img src="../assets/facebook.svg" alt="facebook" />
              </ShareNetwork>
              <ShareNetwork
                class="conf-btn"
                network="twitter"
                :url="'http://ivelov-vm.groupbwt.com/register'"
                title="Twitter share!"
                :description="
                  'Title:' + conference.title + '\nDate:' + conference.date
                "
              >
                <img src="../assets/twitter.svg" alt="twitter" />
              </ShareNetwork>
            </v-row>

            <v-btn
              class="conf-btn"
              @click="$_deleteConf(conference.id)"
              color="error"
              v-else-if="conference.canEdit"
            >
              <span>Delete</span>
            </v-btn>
            <v-btn class="conf-btn" @click="$_joinConf(conference.id)" color="primary" v-if="!conference.participant">
              <span>Join</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn class="conf-btn" @click="$_details(conference.id)" color="primary">
              <span>Details</span>
            </v-btn>
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
  name: "AppConferences",
  data: () => ({
    curPage: 1,
    btnsLoading: false,
    catMenu:false,
    selectedCategory:undefined,
    filterMenu:false,
    startDateMenu:false,
    endDateMenu:false,
  }),
  computed: {
    pageInfo() {
      return this.$store.getters.getConferencesPageInfo;
    },
    buttons() {
      return this.$store.getters.getConferencesPageInfo.buttons;
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
    categoriesList(){
      return this.$store.getters.getCategoriesList;
    },
    filters(){
      return this.$store.getters.getFilters;
    }
  },
  mounted() {
    this.$store.dispatch("setAuth");
    this.$store.dispatch("setAddPerk");

    this.curPage = this.$route.params.page;

    this.$store.dispatch("setConferences", {page:this.curPage, category: this.$route.params.category});
    this.$store.dispatch("setCategories");
    this.$store.dispatch("setCategoriesList");
  },
  methods: {
    $_joinConf(id) {
      if (!this.$store.getters.isAuth) {
        this.$store.commit("setLoading", true);
        this.$router.push("/login");
      } else {
        this.$router.push("/addReport/"+id);
      }
    },
    $_deleteConf(id) {
      this.$store.commit("setLoading", true);
      this.axios.post("/conferences/delete/" + id).then(() => {
        this.$store.dispatch("setConferences", {page:this.curPage});
      });
    },
    $_cancelJoin(id) {
      this.$store.commit("setLoading", true);
      this.axios.post("/reports/delete/" + id).then(() => {
        this.$store.dispatch("setConferences", {page:this.curPage});
      });
    },
    $_details(id) {
      if (!this.$store.getters.isAuth) {
        this.$store.commit("setLoading", true);
        this.$router.push("/login");
      } else {
        this.$store.commit("setLoading", true);
        this.$router.push("/conference/" + id);
      }
    },
    $_nextPage() {
      this.curPage = parseInt(this.curPage) + 1;
      this.$store.dispatch("setConferences", {page:this.curPage});
      this.$router.push("/conferences/" + this.curPage);
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setConferences", {page:this.curPage});
      this.$router.push("/conferences/" + this.curPage);
    },
    $_selectCategory(val){
      this.catMenu = false;
      this.$router.push('/conferences/1/'+val[0].id);
      this.$store.dispatch("setConferences", {page:this.curPage, category: this.$route.params.category});
    },
    $_clearCategory(){
      this.$router.push('/conferences/1');
      this.$store.dispatch("setConferences", {page:this.curPage});
    },
    $_reloadConferences(){
      this.$store.dispatch("setConferences", {page:this.curPage});
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
  margin: 2px;
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

.category-field {
  max-width: 300px;
}

.filter-btn{
  position: absolute;
  left: 0;
  top: 50%;
}

.v-navigation-drawer{
    position: fixed;
    padding: 80px 10px 0 10px;
    max-width: 230px;
    width: 230px;
  }


</style>
