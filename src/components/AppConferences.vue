<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>
    <br /><br />
    <v-main>
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-container class="container-conferences" v-else>
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
  },
  mounted() {
    this.$store.dispatch("setAuth");
    this.$store.dispatch("setAddPerk");

    this.curPage = this.$route.params.page;

    this.$store.dispatch("setConferences", this.curPage);
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
        this.$store.dispatch("setConferences", this.curPage);
      });
    },
    $_cancelJoin(id) {
      this.$store.commit("setLoading", true);
      this.axios.post("/reports/delete/" + id).then(() => {
        this.$store.dispatch("setConferences", this.curPage);
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
      this.$store.dispatch("setConferences", this.curPage);
      this.$router.push("/conferences/" + this.curPage);
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.$store.dispatch("setConferences", this.curPage);
      this.$router.push("/conferences/" + this.curPage);
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
</style>
