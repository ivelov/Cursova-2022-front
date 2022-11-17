<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-else v-model="valid" @submit.prevent="$_saveConf">
        <v-container>
          <v-row>
            <h3 class="mb-5">Enter conference info:</h3>
          </v-row>
          <v-row>
            <v-text-field
              v-model="conferenceData.conference.title"
              label="Title"
              outlined
              :rules="[rules.required, rules.counterMax]"
            >
            </v-text-field>
          </v-row>
          <v-row>
            <br /><br />
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
                  :value="selectedCategory ? selectedCategory.name : ''"
                  label="Category"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <template>
                <v-treeview
                  @update:active="(v)=>{selectedCategory = v[0]}"
                  activatable
                  return-object
                  :items="categories"
                ></v-treeview>
              </template>
            </v-menu>
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
              @change="$_countryChange"
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
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="conferenceData.conference.date"
                :min="new Date().toISOString().slice(0,10)"
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
                min="07:00"
                max="20:00"
                @click:minute="
                  $refs.timeMenu.save(conferenceData.conference.time)
                "
              ></v-time-picker>
            </v-menu>
          </v-row>
          <v-row>
            <v-text-field
              v-model="latitude"
              label="Latitude"
              outlined
              type="number"
            >
            </v-text-field>
          </v-row>
          <v-row>
            <v-text-field
            v-model="longitude"
              label="Longitude"
              outlined
              type="number"
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
                @dragend="$_markerUpdate"
              />
            </GmapMap>
          </v-row>
          <br /><br />
          <v-btn
            type="submit"
            class="btn"
            color="success"
            :disabled="!valid || btnsLoading"
            :loading="btnsLoading"
          >
            <span>Save</span>
          </v-btn>
          <v-btn
            class="btn"
            color="primary"
            :disabled="btnsLoading"
            :loading="btnsLoading"
            @click="$router.push('/')"
          >
            <span>Cancel</span>
          </v-btn>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import rulesMixin from '../components/mixins/rulesMixin.vue';
import countriesMixin from '../components/mixins/countriesMixin.vue';

export default {
  name: "AppEdit",

  data: () => ({
    valid: false,
    dateMenu: false,
    timeMenu: false,
    catMenu: false,
    btnsLoading: false,
    buttons: {
      back: true,
    },
    countriesLocations: {
      ukr: { lat: 50.464963, lng: 30.533887 },
      ru: { lat: 55.796459, lng: 37.578641 },
      usa: { lat: 38.897029, lng: -77.071906 },
      uk: { lat: 51.504263, lng: -0.13515 },
    },
    selectedCategory:undefined,
    latitude: 0,
    longitude: 0,
  }),
  computed: {
    conferenceData() {
      return this.$store.getters.getCurrentConferenceData;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    categories(){
      return this.$store.getters.getCategories;
    },
  },
  watch:{
    latitude(value){
      if(isNaN(parseFloat(value))){
        this.conferenceData.conference.latitude = 0;
      }else{
        this.conferenceData.conference.latitude = value;
      }
    },
    longitude(value){
      if(isNaN(parseFloat(value))){
        this.conferenceData.conference.longitude = 0;
      }else{
        this.conferenceData.conference.longitude = value;
      }
    },
  },
  mounted() {
    this.$store.dispatch("setCategories");
    this.$store.commit("setLoading", false);
    this.latitude = this.conferenceData.conference.latitude;
    this.longitude = this.conferenceData.conference.longitude;
  },
  methods: {
    $_markerUpdate(event) {
      this.conferenceData.conference.latitude = event.latLng.lat();
      this.conferenceData.conference.longitude = event.latLng.lng();
    },
    $_countryChange(event) {
      this.conferenceData.conference.latitude =
        this.countriesLocations[event].lat;
      this.conferenceData.conference.longitude =
        this.countriesLocations[event].lng;
    },
    $_saveConf() {
      if (
        isNaN(parseFloat(this.conferenceData.conference.longitude)) ||
        isNaN(parseFloat(this.conferenceData.conference.latitude))
      ) {
        alert("Enter valid posisiton");
        return;
      }
      this.btnsLoading = true;
      
      this.conferenceData.conference.categoryId = this.selectedCategory ? this.selectedCategory.id : null;
      let values = this.conferenceData.conference;
      values.id = null;
      this.axios
        .post("/add", values)
        .then((response) => {
          console.log(response);
          this.btnsLoading = false;
          this.$router.push('/conferences/1');
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: { AppHeader },
  mixins:[rulesMixin, countriesMixin],
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
.v-treeview{
  background-color: white;
}
</style>
