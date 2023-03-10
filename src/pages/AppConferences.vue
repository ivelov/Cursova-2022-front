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
          class="mb-4"
          v-if="isAdmin"
          @click="$_exportConferences" 
          :disabled="channelLoading"
          :loading="channelLoading"
          color="primary"
        >
          <span>Export Conferences</span>
        </v-btn>
        <v-btn class="filter-close-btn" text @click="filterMenu = !filterMenu">
          <span>&lt;</span>
        </v-btn>
        <v-btn
          color="primary"
          @click="
            $store.commit('clearFilters');
            $_reloadConferences();
          "
        >
          Reset Filters
        </v-btn>
        <br /><br />
        <v-divider></v-divider>
        <v-list>
          <v-list-item> Reports count </v-list-item>
          <v-list-item>
            <v-slider
              v-model="filters.reportsCount"
              thumb-label
              min="-1"
              max="100"
              @change="$_reloadConferences"
            ></v-slider>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item> Start date </v-list-item>
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
                @change="$_reloadConferences"
              ></v-date-picker>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item> End date </v-list-item>
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
                @change="$_reloadConferences"
              ></v-date-picker>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item> Categories </v-list-item>
          <v-list-item>
            <v-autocomplete
              v-model="filters.categories"
              :items="categoriesList"
              item-text="state"
              item-value="value"
              clearable
              multiple
              outlined
              @change="$_reloadConferences"
            ></v-autocomplete>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-container v-if="$store.getters.isAuth">
        <v-btn @click="filterMenu = !filterMenu"><v-icon>mdi-filter-outline</v-icon> Filters </v-btn>
        <br /><br />
      </v-container>

      <v-container v-if="(loading != 0)">
        <v-skeleton-loader
          class="mx-auto skeleton"
          type="table-thead, table-tbody"
        ></v-skeleton-loader>
      </v-container>
      <v-container v-else-if="pageInfo.conferences? Object.keys(pageInfo.conferences).length == 0 : false" class="text-center">
        No results
      </v-container>
      <v-container class="container-conferences" v-else>

        <v-row class="conf-row">
          <v-col>???</v-col>
          <v-col>Title</v-col>
          <v-col>Date</v-col>
          <v-col></v-col>
          <v-col></v-col>
        </v-row>
        <v-row
          class="conf-row"
          v-for="(conference, index) in pageInfo.conferences"
          :key="conference.id"
        >
          <v-col>{{ index + 1 + (curPage - 1) * 15 }}</v-col>
          <v-col>{{ conference.title }}</v-col>
          <v-col>{{ conference.date }}</v-col>
          <v-col>
            <v-row class="share-row" v-if="conference.participant">
              <v-btn
                class="conf-btn"
                :disabled="btnsLoading"
                :loading="btnsLoading"
                @click="$_cancelJoin(conference.id)"
                color="primary"
              >
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
              :disabled="btnsLoading"
              :loading="btnsLoading"
              @click="$_deleteConf(conference.id)"
              color="error"
              v-else-if="conference.canEdit"
            >
              <span>Delete</span>
            </v-btn>
            <v-btn
              class="conf-btn"
              :disabled="(btnsLoading || planLoading)"
              :loading="(btnsLoading || planLoading)"
              @click="$_joinConf(conference.id)"
              color="primary"
              v-if="!conference.participant"
            >
              <span>Join</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="conf-btn"
              @click="$_details(conference.id)"
              color="primary"
            >
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
import AppHeader from "../components/AppHeader.vue";

export default {
  name: "AppConferences",
  data: () => ({
    buttons:{
      reports:true,
      addConference: false,
    },
    curPage: 1,
    btnsLoading: false,
    catMenu: false,
    selectedCategory: undefined,
    filterMenu: false,
    startDateMenu: false,
    endDateMenu: false,
    queueFull:false,
    loading: 4,
  }),
  computed: {
    pageInfo() {
      return this.$store.getters.getConferencesPageInfo;
    },
    nextBtnDisabled() {
      return this.curPage >= this.pageInfo.maxPage;
    },
    prevBtnDisabled() {
      return this.curPage <= 1;
    },
    categoriesList() {
      return this.$store.getters.getCategoriesList;
    },
    filters() {
      return this.$store.getters.getFilters;
    },
    channelLoading() {
      return this.$store.getters.getChannelLoading;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    planLoading(){
      return this.$store.getters.isPlanLoading;
    },
    availableJoins:{
      get(){
        return this.$store.getters.getAvailableJoins;
      },
      set(newValue){
        return this.$store.commit('setAvailableJoins', newValue);
      }
    },
    currentPlan() {
      return this.$store.state.currentPlan;
    },
  },
  mounted() {
    this.$store.dispatch("setAuth").finally(()=>{
      this.loading--;
    });
    this.$store.dispatch("definePerks").then(()=>{
      this.buttons.addConference = this.$store.getters.canAdd;
    }).finally(()=>{
      this.loading--;
    });

    this.curPage = this.$route.params.page;
    this.$store.dispatch("setConferences", {
      page: this.curPage,
    }).finally(()=>{
      this.loading--;
    });
    this.$store.dispatch("setCategoriesList").finally(()=>{
      this.loading--;
    });
  },
  methods: {
    $_joinConf(id) {
      if (!this.$store.getters.isAuth) {
        this.$router.push("/login");
      } else {
        if(this.availableJoins < 1 && this.currentPlan != 'platinum' && !this.isAdmin){
          this.$store.commit('setErrorFromJoins', true);
          this.$router.push('/tariffs');
          return;
        }

        if(this.pageInfo.isListener){
          this.btnsLoading = true;
          
          this.axios.post("/conference/"+id+'/join').then(() => {
            console.log(this.availableJoins);
            this.availableJoins = this.availableJoins - 1;
            console.log(this.availableJoins);
            this.$_reloadConferences();
          }).finally(() => {
            this.btnsLoading = false;
          });
        }else{
          this.$router.push("/addReport/" + id);
        }
      }
    },
    $_deleteConf(id) {
      this.loading++;
      this.axios.post("/conferences/delete/" + id).then(() => {
        this.$store.dispatch("setConferences", { page: this.curPage });
      }).finally(()=>{
        this.loading--;
      });
    },
    $_cancelJoin(id) {
      this.loading++;
      if(this.pageInfo.isListener){
        this.axios.post("/conference/" + id + '/cancelJoin').then(() => {
          this.availableJoins = this.availableJoins + 1;
          this.$store.dispatch("setConferences", { page: this.curPage });
        }).finally(()=>{
          this.loading--;
        });
      }else{
        this.axios.post("/reports/delete/" + id).then(() => {
          this.availableJoins = this.availableJoins + 1;
          this.$store.dispatch("setConferences", { page: this.curPage });
        }).finally(()=>{
          this.loading--;
        });
      }
    },
    $_details(id) {
      if (!this.$store.getters.isAuth) {
        this.$router.push("/login");
      } else {
        this.$router.push("/conference/" + id);
      }
    },
    $_nextPage() {
      this.loading++;
      this.curPage = parseInt(this.curPage) + 1;
      this.$store.dispatch("setConferences", { page: this.curPage }).finally(()=>{
        this.loading--;
      });
      this.$router.push("/conferences/" + this.curPage);
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setConferences", { page: this.curPage }).finally(()=>{
        this.loading--;
      });
      this.$router.push("/conferences/" + this.curPage);
    },
    $_reloadConferences(fromOutside = true) {
      if(this.loading == 0){
        this.queueFull = false;
        this.loading++;
        this.$store.dispatch("setConferences", { page: this.curPage }).finally(()=>{
          this.loading--;
        });
      }else{
        if(!fromOutside){
          setTimeout(() => {
              this.$_reloadConferences(false);
            }, 100);
        }else{
          if(!this.queueFull){
            this.queueFull = true;
            this.$_reloadConferences(false);
          }
        }
      }
    },
    $_exportConferences() {
      this.$store.commit('setChannelLoading', true);
      this.$store.commit('initializePusher');
      this.axios.post("/export/conferences");
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

.conf-btn {
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

.filter-close-btn {
  font-size: x-large;
}

.v-navigation-drawer {
  position: fixed;
  padding: 80px 10px 5px 10px;
  max-width: 250px;
  width: 250px;
}

.skeleton{
  min-width: 620px;
}
</style>
