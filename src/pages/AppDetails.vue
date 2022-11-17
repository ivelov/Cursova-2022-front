<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-else>

        <v-menu
          v-if="isAdmin"
          :close-on-content-click="false"
          transition="scroll-y-transition"
          offset-y
          left
          open-on-hover
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn  
              class="float-right"
              v-bind="attrs"
              v-on="on"
            >
              <span>Exports</span>
            </v-btn>
          </template>
          <v-container class="overflow-x-auto" style="background-color:white">
            <v-list>
              <v-list-item class="export-item">
                <v-btn  
                  class="mx-auto"
                  :disabled="channelLoading"
                  :loading="channelLoading"
                  color="primary"
                  @click="$_exportReports"
                >
                  <span>Export presentations</span>
                </v-btn>
              </v-list-item>
              <v-list-item class="export-item">
                <v-btn  
                  class="mt-4 mx-auto"
                  :disabled="channelLoading"
                  :loading="channelLoading"
                  color="primary"
                  @click="$_exportListeners"
                >
                  <span>Export members</span>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-container>
          
        </v-menu>

        <v-container>
          <v-row>
            <v-breadcrumbs
            :items="conferenceData.breadcrumbs"
            divider="/"
            large
          >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              class="breadcrumb"
              @click="
              $_breadcrumbClick(item.categoryId);          
              "
            >
             {{item.text}}
            </v-breadcrumbs-item>
          </template>
          </v-breadcrumbs>
          </v-row>
          <br><br>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.title"
              label="Title"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.categoryTitle"
              label="Category"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-select
              v-model="conferenceData.conference.country"
              label="Country"
              outlined
              disabled
              :items="countries"
              item-text="state"
              item-value="value"
            ></v-select>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.date"
              label="Date"
              disabled
              outlined
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.time"
              label="Time"
              disabled
              outlined
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.latitude"
              label="Latitude"
              outlined
              disabled
            >
            </v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.longitude"
              label="Longitude"
              outlined
              disabled
            >
            </v-text-field>
          </v-row>
          <v-row>
            <GmapMap
              :center="{
                lat: conferenceData.conference.latitude,
                lng: conferenceData.conference.longitude,
              }"
              :zoom="10"
              map-type-id="terrain"
              style="width: 500px; height: 300px"
            >
              <GmapMarker
                :key="1"
                :position="{
                  lat: conferenceData.conference.latitude,
                  lng: conferenceData.conference.longitude,
                }"
                :draggable="false"
              />
            </GmapMap>
          </v-row>
          <br /><br />
          <v-row v-if="conferenceData.canUpdate">
            <v-btn
            class="btn"
            color="warning"
            @click="
              $router.push(
                '/conference/' + conferenceData.conference.id + '/edit'
              )
            "
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Update</span>
          </v-btn>
          <v-btn
            class="btn"
            color="error"
            @click="$_deleteConf"
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Delete</span>
          </v-btn>
          <br><br>
          </v-row>
          
          <v-row class="share-row" v-if="conferenceData.participant">
            
            <v-btn
              class="mb-1"
              :disabled="btnsLoading"
              :loading="btnsLoading"
              @click="$_cancelJoin"
              color="primary"
            >
              <span>Cancel join</span>
            </v-btn>
            <ShareNetwork
              network="facebook"
              :url="'http://ivelov-vm.groupbwt.com/register'"
              title="Facebook share!"
              :description="
                'Title:' +
                conferenceData.conference.title +
                '\nDate:' +
                conferenceData.conference.date
              "
            >
              <img src="../assets/facebook.svg" alt="facebook" />
            </ShareNetwork>
            <ShareNetwork
              network="twitter"
              :url="'http://ivelov-vm.groupbwt.com/register'"
              title="Twitter share!"
              :description="
                'Title:' +
                conferenceData.conference.title +
                '\nDate:' +
                conferenceData.conference.date
              "
            >
              <img src="../assets/twitter.svg" alt="twitter" />
            </ShareNetwork>
          </v-row>
          <v-row v-else>
            <v-btn
            color="primary"
            @click="$_joinConf"
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Join</span>
          </v-btn>
          </v-row>
          <br>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
export default {
  name: "AppDetails",

  data: () => ({
    buttons: {
      back: true,
    },
    btnsLoading: false,
  }),
  computed: {
    conferenceData() {
      return this.$store.getters.getCurrentConferenceData;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    countries() {
      return this.$store.getters.getCountries;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    channelLoading() {
      return this.$store.getters.getChannelLoading;
    },
  },
  mounted() {
    this.$store.dispatch("setCurrentConferenceData", {
      id: this.$route.params.id,
    });
    this.$store.dispatch("definePerks");
  },
  methods: {
    $_cancelJoin() {
      this.btnsLoading = true;
      if(this.conferenceData.isListener){
        this.axios.post("/conference/" + this.$route.params.id + '/cancelJoin').then((response) => {
          if(response.data == 0) console.error('0 participants deleted');
          
          this.$store.dispatch("setCurrentConferenceData", {
              id: this.$route.params.id,
              hard: true,
          });
          this.btnsLoading = false;
        });
      }else{
        this.axios.post("/reports/delete/" + this.$route.params.id).then(() => {
          this.$store.dispatch("setCurrentConferenceData", {
              id: this.$route.params.id,
              hard: true,
          });
          this.btnsLoading = false;
        });
      }
    },
    $_joinConf() {
      if(this.conferenceData.isListener){
        this.btnsLoading = true;
        this.axios.post("/conference/"+this.$route.params.id+'/join').then(() => {
          this.$store.dispatch("setCurrentConferenceData", {
              id: this.$route.params.id,
              hard: true,
          });
          this.btnsLoading = false;
        });
      }else{
        this.$router.push("/addReport/" + this.$route.params.id);
      }
    },
    $_deleteConf() {
      this.btnsLoading = true;
      this.axios
        .post("/conferences/delete/" + this.conferenceData.conference.id)
        .then(() => {
          this.$router.push("/");
        });
    },
    $_breadcrumbClick(categoryId){
      this.$store.commit('setFilters', {categories:[categoryId]});
      this.$router.push('/conferences/1');    
    },
    $_exportReports(){
      this.$store.commit('setChannelLoading', true);
      this.$store.commit('initializePusher');
      this.axios.post("/export/conference/"+this.conferenceData.conference.id+'/reports');   
    },
    $_exportListeners(){
      this.$store.commit('setChannelLoading', true);
      this.$store.commit('initializePusher');
      this.axios.post("/export/conference/"+this.conferenceData.conference.id+'/listeners');  
    },
  },
  components: { AppHeader },
};
</script>

<style scoped>
.v-form {
  width: 90%;
  margin: auto;
}

.v-text-field {
  max-width: 300px;
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

.btn {
  margin-left: 5px;
  margin-bottom: 5px;
}

.v-breadcrumbs{
  padding: 0;
}
.breadcrumb{
  color:blue;
  cursor: pointer;
}

.export-item{
  min-width: 250px;
}
</style>
