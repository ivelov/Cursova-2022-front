<template>
  <div>
    <AppHeader :key="headerRefreshKey" :buttons="buttons"></AppHeader>
    <br /><br />
    <v-main>
      <v-navigation-drawer
        class="filter-drawer"
        v-model="filterMenu"
        absolute
        :temporary="false"
      >
        <v-btn class="filter-close-btn" text @click="filterMenu = !filterMenu">
          <span>&lt;</span>
        </v-btn>
        <v-btn
          color="primary"
          @click="
            $store.commit('clearFilters');
            $_reloadReports();
          "
        >
          Reset Filters
        </v-btn>
        <br /><br />
        <v-divider></v-divider>
        <v-list>
          <v-list-item> Start time </v-list-item>
          <v-list-item>
            <v-menu
              ref="startTimeMenu"
              v-model="startTimeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.startTime"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="filters.startTime"
                format="24hr"
                min="7:00"
                max="20:55"
                @click:minute="$refs.startTimeMenu.save(filters.startTime)"
                @change="$_reloadReports"
              ></v-time-picker>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item> End time </v-list-item>
          <v-list-item>
            <v-menu
              ref="endTimeMenu"
              v-model="endTimeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.endTime"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="filters.endTime"
                format="24hr"
                min="7:05"
                max="21:00"
                @click:minute="$refs.startTimeMenu.save(filters.endTime)"
                @change="$_reloadReports"
              ></v-time-picker>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item> Report duration </v-list-item>
          <v-list-item>
            <v-slider
              v-model="filters.duration"
              thumb-label
              min="-1"
              max="60"
              @change="$_reloadReports"
            ></v-slider>
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
              @change="$_reloadReports"
            ></v-autocomplete>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-container v-if="$store.getters.isAuth">
        <v-btn @click="filterMenu = !filterMenu"><v-icon>mdi-filter-outline</v-icon> Filters </v-btn>
        <br /><br />
      </v-container>

      <v-container v-if="loading">
        <v-row>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              width="300"
              type="card, actions"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              width="300"
              type="card, actions"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              width="300"
              type="card, actions"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row>
          <v-col
            class="report"
            v-for="(report, index) in pageInfo.reports"
            :key="report.id"
            cols="12"
            sm="4"
          >
            <v-card class="report-card" elevation="2">
              <v-card-title
                ><a @click="$router.push('/report/' + report.id)">{{
                  report.title
                }}</a></v-card-title
              >
              <v-card-text>
                <p>Conference: {{ report.conferenceTitle }}</p>
                <p>Time: {{ report.startTime }}-{{ report.endTime }}</p>
                <p
                  class="report-space"
                  v-if="!readMore[index] && report.description"
                >
                  {{ report.description.slice(0, 100) }}
                  <span
                    v-if="!readMore[index] && report.description.length > 100"
                    @click="$_readMore(index)"
                  >
                    ..read more
                  </span>
                </p>
                <p class="report-space" v-else-if="!report.description"></p>
                <p class="report-space" v-if="readMore[index]">
                  {{ report.description }}
                  <span @click="$_readMore(index)"> ..hide </span>
                </p>
                <p>Comments: {{ report.commentsCount }}</p>
              </v-card-text>
              <v-card-actions>
                <v-row class="actions-row">
                  <v-btn
                    text
                    @click="
                      $store.commit('clearCommentsInfo');
                      $router.push('/report/' + report.id);
                    "
                  >
                    Details
                  </v-btn>
                  <v-btn
                    text
                    @click="$_favoriteToggle(report)"
                    :loading="report.favLoading"
                    :disabled="report.favLoading"
                  >
                    <span
                      :class="{
                        'gray-fav': !report.favorite,
                        'red-fav': report.favorite,
                      }"
                      >❤</span
                    >
                  </v-btn>
                </v-row>
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
import AppHeader from "./subComponents/AppHeader.vue";

export default {
  name: "AppReports",
  data: () => ({
    buttons: { conferences: true },
    curPage: 1,
    btnsLoading: false,
    readMore: [],
    catMenu: false,
    headerRefreshKey: 0,
    filterMenu: false,
    endTimeMenu: false,
    startTimeMenu: false,
    queueFull:false,
  }),
  computed: {
    pageInfo() {
      return this.$store.getters.getReportsPageInfo;
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
    categoriesList() {
      return this.$store.getters.getCategoriesList;
    },
    filters() {
      return this.$store.getters.getFilters;
    },
  },
  mounted() {
    this.$store.dispatch("setAuth");
    this.$store.dispatch("setPerks");
    if (this.$route.params.favPage) {
      this.curPage = this.$route.params.favPage;
      this.$store.dispatch("setReports", {
        page: this.curPage,
        favorites: true,
      });
    } else {
      this.curPage = this.$route.params.page;
      this.$store.dispatch("setReports", { page: this.curPage });
    }
    this.$store.dispatch("setCategoriesList");

    for (let i = 0; i < 15; i++) {
      this.readMore.push(false);
    }
  },
  methods: {
    $_nextPage() {
      this.curPage = parseInt(this.curPage) + 1;
      this.$store.dispatch("setReports", {
        page: this.curPage,
        favorites: this.$route.params.favPage ? true : false,
      });
      this.$router.push(
        this.$route.params.favPage
          ? "/account/favorites/reports/" + this.curPage
          : "/reports/" + this.curPage
      );
      for (let i = 0; i < 15; i++) {
        this.readMore.push(false);
      }
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setReports", {
        page: this.curPage,
        favorites: this.$route.params.favPage ? true : false,
      });
      this.$router.push(
        this.$route.params.favPage
          ? "/account/favorites/reports/" + this.curPage
          : "/reports/" + this.curPage
      );
      for (let i = 0; i < 15; i++) {
        this.readMore.push(false);
      }
    },
    $_readMore(index) {
      this.$set(this.readMore, index, !this.readMore[index]);
    },
    $_favoriteToggle(report) {
      report.favLoading = true;
      if (report.favorite) {
        this.axios.post("/report/" + report.id + "/unfavorite").then(() => {
          report.favorite = false;
          report.favLoading = false;
          this.headerRefreshKey += 1;
          if (this.$route.params.favPage) {
            this.$store.dispatch("setFavoriteReports", { page: this.curPage });
          }
        });
      } else {
        this.axios.post("/report/" + report.id + "/favorite").then(() => {
          report.favorite = true;
          report.favLoading = false;
          this.headerRefreshKey += 1;
        });
      }
    },
    $_reloadReports(fromOutside = true) {
      if(!this.loading){
        this.queueFull = false;
        this.$store.dispatch("setReports", {
          page: this.curPage,
          favorites: this.$route.params.favPage ? true : false,
        });
      }else{
        if(!fromOutside){
          setTimeout(() => {
              this.$_reloadReports(false);
            }, 100);
        }else{
          if(!this.queueFull){
            this.queueFull = true;
            this.$_reloadReports(false);
          }
        }
      }
    },
  },
  components: { AppHeader },
};
</script>

<style scoped>
.report-card {
  min-height: 276px;
}
.report-space {
  min-height: 66px;
}
.category-field {
  max-width: 300px;
}

.actions-row {
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 15px 5px;
}
.red-fav,
.gray-fav {
  font-size: 20px;
}
.red-fav {
  color: red;
}
.gray-fav {
  color: gray;
}

.filter-drawer {
  min-height: 500px;
}

.v-navigation-drawer {
  position: fixed;
  padding: 80px 10px 5px 10px;
  max-width: 250px;
  width: 250px;
}
</style>
