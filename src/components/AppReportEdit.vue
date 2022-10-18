<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-text-field
              v-model="currentReportData.report.title"
              :rules="[rules.required, rules.counterMax]"
              min="2"
              label="Title"
              outlined
            ></v-text-field>
          </v-row>
          <v-row>
            <v-textarea
              v-model="currentReportData.report.description"
              outlined
              label="Description"
            ></v-textarea>
          </v-row>
          <v-row>
            <br /><br />
            <v-menu
              ref="timeMenuStart"
              v-model="timeMenuStart"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="currentReportData.report.startTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="currentReportData.report.startTime"
                  label="Start time"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeMenuStart"
                v-model="currentReportData.report.startTime"
                full-width
                format="24hr"
                :allowed-hours="allowedHours"
                :allowed-minutes="allowedMinutes"
                @click:minute="
                  $refs.timeMenu.save(currentReportData.report.startTime)
                "
              ></v-time-picker>
            </v-menu>
          </v-row>
          <v-row>
            <br /><br />
            <v-menu
              ref="timeMenuEnd"
              v-model="timeMenuEnd"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="currentReportData.report.endTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="currentReportData.report.endTime"
                  label="End time"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeMenuEnd"
                v-model="currentReportData.report.endTime"
                full-width
                format="24hr"
                :allowed-hours="allowedHours"
                :allowed-minutes="allowedMinutes"
                @click:minute="
                  $refs.timeMenu.save(currentReportData.report.endTime)
                "
              ></v-time-picker>
            </v-menu>
          </v-row>
          <v-row>
            <v-file-input
              accept=".ppt,.pptx"
              label="Presentation"
              v-model="currentReportData.report.presentation"
              :rules="[rules.size]"
            ></v-file-input>
          </v-row>
          
          <br /><br />
          <v-btn
            class="btn"
            color="success"
            @click="$_saveReport"
            :disabled="!valid || btnsLoading"
            :loading="btnsLoading"
          >
            <span>Save</span>
          </v-btn>
          <v-btn class="btn" color="primary" @click="$router.push('/reports/1')">
            <span>Cancel</span>
          </v-btn>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
export default {
  name: "AppReportsAdd",

  data: () => ({
    valid: false,
    timeMenuStart: false,
    timeMenuEnd: false,
    btnsLoading: false,
    buttons: {
      back: true,
    },
  }),
  computed: {
    rules(){
      return this.$store.getters.getRules;
    },
    loading(){
      return this.$store.getters.isLoading;
    },
    currentReportData(){
      return this.$store.getters.getCurrentReportData;
    },
    calcAllowedHours(){
      var allowedHoursArr = [];
      if(this.currentReportData.busyStartTimes.length == 0)
        return allowedHoursArr;

      for (let i = 7; i < 21; i++) {
        var freeTime = 60;
        for (let j = 0; j < this.currentReportData.busyStartTimes.length; j++) {
          var startHour = parseInt(this.currentReportData.busyStartTimes[j].substring(0,2));
          var endHour = parseInt(this.currentReportData.busyEndTimes[j].substring(0,2));
          var startMinutes = parseInt(this.currentReportData.busyStartTimes[j].substring(2,2));
          var endMinutes = parseInt(this.currentReportData.busyEndTimes[j].substring(2,2));
          if(j == startHour){
            if(j == endHour)
              freeTime -= endMinutes - startMinutes;
            else
              freeTime -= 60 - startMinutes;
          }else if(j == startHour - 1 && j == endHour){
            freeTime -= endMinutes;
          }
          
        }
        if(freeTime >= 5){
          allowedHoursArr.push(i);
        }
      }
      return allowedHoursArr;
    }
  },
  mounted() {
    this.$store.dispatch("setCurrentReportData", this.$route.params.confId);
    this.$store.dispatch("setReportBusyTimes", {id: this.currentReportData.report.conferenceID, edit: true});
  },
  methods: {
    $_saveReport() {
      this.btnsLoading = true;

      this.axios
        .post("/reports/"+this.currentReportData.report+'/save', this.currentReportData.report)
        .then((response) => {
          console.log(response);
          this.btnsLoading = false;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    allowedHours(v){
      return this.calcAllowedHours.includes(v);
    },
    allowedMinutes(v){
      for (let i = 0; i < this.currentReportData.busyStartTimes.length; i++) {
        var startHour = parseInt(this.currentReportData.busyStartTimes[i].substring(0,2));
        var endHour = parseInt(this.currentReportData.busyEndTimes[i].substring(0,2));
        var curHour = parseInt(this.currentReportData.startTime.substring(0,2));
        var startMinutes = parseInt(this.currentReportData.busyStartTimes[i].substring(2,2));
        var endMinutes = parseInt(this.currentReportData.busyEndTimes[i].substring(2,2));
        if(curHour == startHour){
          if(curHour == endHour){
            if(v >= startMinutes && v <= endMinutes){
              return false;
            }
          }else{
            if(v >= startMinutes && v <= 60){
              return false;
            }
          }
        }else if(curHour == startHour - 1 && curHour == endHour){
          if(v <= endMinutes){
            return false;
          }
        }
      }
      return true;
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

.btn {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
