<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-else>
        <v-container>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.id"
              label="Id"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.title"
              label="Title"
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
          <v-btn
            v-if="conferenceData.canUpdate"
            color="warning"
            @click="
              $router.push(
                '/conference/' + conferenceData.conference.id + '/edit'
              )
            "
          >
            <span>Update</span>
          </v-btn>
          <v-row class="share-row" v-else-if="conferenceData.participant">
            <v-btn class="mb-1" @click="cancelJoin" color="primary">
              <span>Cancel join</span>
            </v-btn>
            <ShareNetwork
              network="facebook"
              :url="'http://google.com'"
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
              :url="'http://google.com'"
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
          <v-btn v-else color="primary" @click="joinConf">
            <span>Join</span>
          </v-btn>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
export default {
  name: "AppDetails",

  data: () => ({
    buttons: {
      back: true,
    },
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
  },
  mounted() {
    this.$store.dispatch("setCurrentConferenceData", {
      id: this.$route.params.id,
    });
  },
  methods: {
    cancelJoin() {
      this.axios
        .get("/V1/conferences/cancel/" + this.conferenceData.conference.id)
        .then(() => {
          this.$store.dispatch("setCurrentConferenceData", {
            id: this.$route.params.id,
            hard: true,
          });
        });
    },
    joinConf() {
      this.axios
        .get("/V1/conferences/join/" + this.conferenceData.conference.id)
        .then(() => {
          this.$store.dispatch("setCurrentConferenceData", {
            id: this.$route.params.id,
            hard: true,
          });
        });
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
</style>
