<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-else v-model="valid">
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
              :rules="[rules.required, rules.counterMax]"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-select
              v-model="conferenceData.conference.country"
              label="Country"
              outlined
              :items="countries"
              item-text="state"
              item-value="value"
              :rules="[rules.required]"
              @change="countryChange"
            ></v-select>
          </v-row>
          <v-row>
            <br /><br />
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="conferenceData.conference.date"
                  label="Date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="conferenceData.conference.date"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <v-row>
            <br /><br />
            <v-menu
              ref="timeMenu"
              v-model="timeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="conferenceData.conference.time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="conferenceData.conference.time"
                  label="Time"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeMenu"
                v-model="conferenceData.conference.time"
                full-width
                format="24hr"
                @click:minute="
                  $refs.timeMenu.save(conferenceData.conference.time)
                "
              ></v-time-picker>
            </v-menu>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.latitude"
              label="Latitude"
              outlined
            >
            </v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.longitude"
              label="Longitude"
              outlined
            >
            </v-text-field>
          </v-row>
          <v-row>
            <GmapMap
              :center="{
                lat: parseFloat(conferenceData.conference.latitude),
                lng: parseFloat(conferenceData.conference.longitude),
              }"
              :zoom="10"
              map-type-id="terrain"
              style="width: 500px; height: 300px"
            >
              <GmapMarker
                v-if="
                  parseFloat(conferenceData.conference.latitude) != 0 ||
                  parseFloat(conferenceData.conference.longitude) != 0
                "
                :key="1"
                :position="{
                  lat: parseFloat(conferenceData.conference.latitude),
                  lng: parseFloat(conferenceData.conference.longitude),
                }"
                :draggable="true"
                @dragend="markerUpdate"
              />
            </GmapMap>
          </v-row>
          <br /><br />
          <v-btn
            class="btn"
            color="success"
            :disabled="!valid || btnsLoading"
            :loading="btnsLoading"
            @click="saveConf"
          >
            <span>Save</span>
          </v-btn>
          <v-btn
            class="btn"
            color="primary"
            @click="$router.push('/conference/' + conferenceData.conference.id)"
          >
            <span>Cancel</span>
          </v-btn>
          <v-btn
            class="btn"
            color="error"
            :loading="btnsLoading"
            @click="deleteConf"
          >
            <span>Delete</span>
          </v-btn>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
export default {
  name: "AppEdit",

  data: () => ({
    valid: false,
    dateMenu: false,
    timeMenu: false,
    btnsLoading: false,
    countriesLocations: {
      ukr: { lat: 50.464963, lng: 30.533887 },
      ru: { lat: 55.796459, lng: 37.578641 },
      usa: { lat: 38.897029, lng: -77.071906 },
      uk: { lat: 51.504263, lng: -0.13515 },
    },
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
    rules(){
      return this.$store.getters.getRules;
    }
  },
  mounted() {
    this.$store.dispatch("setCurrentConferenceData", {
      id: this.$route.params.id,
    });
  },
  methods: {
    markerUpdate(event) {
      this.conferenceData.conference.latitude = event.latLng.lat();
      this.conferenceData.conference.longitude = event.latLng.lng();
    },
    countryChange(event) {
      this.conferenceData.conference.latitude =
        this.countriesLocations[event].lat;
      this.conferenceData.conference.longitude =
        this.countriesLocations[event].lng;
    },
    saveConf() {
      if (
        isNaN(parseFloat(this.conferenceData.conference.longitude)) ||
        isNaN(parseFloat(this.conferenceData.conference.latitude))
      ) {
        alert("Enter valid posisiton");
        return;
      }
      this.btnsLoading = true;

      let id = this.conferenceData.conference.id;
      this.axios
        .post("/V1/conference/" + id + "/save", this.conferenceData.conference)
        .then((response) => {
          console.log(response);
          this.btnsLoading = false;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    deleteConf() {},
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
.btn {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
