<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-model="valid" v-else @submit.prevent="$_saveReport">
        <v-container>
          <v-row>
            <v-breadcrumbs
              :items="currentReportData.breadcrumbs"
              divider="/"
              large
            ></v-breadcrumbs>
          </v-row><br>
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
                :allowed-hours="$_allowedHours"
                :allowed-minutes="$_allowedMinutes"
                :min="currentReportData.confStartTime"
                @click:hour="$_hourClick"
                @click:minute="
                  $refs.timeMenuStart.save(currentReportData.report.startTime);
                  $_startTimeClick();
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
                  :disabled="currentReportData.report.startTime.length == 0"
                  :rules="[rules.required]"
                  @click.once="$_startTimeClick()"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeMenuEnd"
                v-model="currentReportData.report.endTime"
                full-width
                format="24hr"
                :min="minEndTime"
                :max="maxEndTime"
                @click:minute="
                  $refs.timeMenuEnd.save(currentReportData.report.endTime);
                "
              ></v-time-picker>
            </v-menu>
          </v-row>
          <v-row>
            <v-file-input
              accept=".ppt,.pptx"
              label="Presentation"
              outlined
              v-model="currentReportData.report.presentation"
              :rules="[rules.size]"
            ></v-file-input>
          </v-row>
          <v-row>
            <v-checkbox
              v-model="currentReportData.report.isOnline"
              label="Online"
            >
            </v-checkbox>
          </v-row>
          <br />
          <v-alert
            v-if="currentReportData.report.isOnline"
            border="left"
            colored-border
            color="green"
          >
            The link to the zoom meeting will be created 10 minutes before the start
          </v-alert>
          <br />
          <v-btn
            type="submit"
            class="btn"
            color="success"
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
import AppHeader from "../components/AppHeader.vue";
import rulesMixin from '../components/mixins/rulesMixin.vue';

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
    allowedMinutesArr:[],
    hoursBuf:0,
    minEndTime:'',
    maxEndTime:'',
    catMenu:false,
    selectedCategory:undefined
  }),
  computed: {
    loading(){
      return this.$store.getters.isLoading;
    },
    currentReportData(){
      return this.$store.getters.getCurrentReportData;
    },
    calcAllowedHours(){
      if(!this.currentReportData.confStartTime) return undefined;
      var allowedHoursArr = [];

      var confStartHour =  parseInt(this.currentReportData.confStartTime.substring(0,2));
      var confStartMinute =  parseInt(this.currentReportData.confStartTime.substring(3,5));
      for (let i = confStartHour; i < 21; i++) {
        var freeTime = 60;
        if(i == confStartHour){
          freeTime -= confStartMinute;
        }
        for (let j = 0; j < this.currentReportData.busyStartTimes.length; j++) {
          var startHour = parseInt(this.currentReportData.busyStartTimes[j].substring(0,2));
          var endHour = parseInt(this.currentReportData.busyEndTimes[j].substring(0,2));
          var startMinute = parseInt(this.currentReportData.busyStartTimes[j].substring(3,5));
          var endMinute = parseInt(this.currentReportData.busyEndTimes[j].substring(3,5));
          if(i == startHour){
            if(i == endHour)
              freeTime -= endMinute - startMinute;
            else
              freeTime -= 60 - startMinute;
          }else if(i == startHour + 1 && i == endHour){
            freeTime -= endMinute;
          }
        }
        if(freeTime >= 5){
          allowedHoursArr.push(i);
        }
      }
      return allowedHoursArr;
    },
    calcAllowedMinutes(){
      var curHour = this.hoursBuf;
      var allowedMinutesArr = [];
      var isMinuteAllowed;
      for (let minute = 0; minute < 60; minute++) {
        isMinuteAllowed = true;
        for (let i = 0; (i < this.currentReportData.busyStartTimes.length) && isMinuteAllowed; i++) {
          var startHour = parseInt(this.currentReportData.busyStartTimes[i].substring(0,2));
          var endHour = parseInt(this.currentReportData.busyEndTimes[i].substring(0,2));
          var startMinute = parseInt(this.currentReportData.busyStartTimes[i].substring(3,5));
          var endMinute = parseInt(this.currentReportData.busyEndTimes[i].substring(3,5));
          if(curHour == startHour){
            if(curHour == endHour){
              if(minute > startMinute - 5 && minute < endMinute){
                isMinuteAllowed = false;
              }
            }else{
              if(minute > startMinute - 5 && minute <= 60){
                isMinuteAllowed = false;
              }
            }
          }else if(curHour == startHour + 1 && curHour == endHour){
            if(minute < endMinute){
              isMinuteAllowed = false;
            }
          }
        }
        if(isMinuteAllowed)
          allowedMinutesArr.push(minute);
      }
      return allowedMinutesArr;
    },
    categories(){
      return this.$store.getters.getCategories;
    },
  },
  mounted() {
    this.$store.dispatch("setCurrentReportData", {id: this.$route.params.repId, edit:true}).then(()=>{
      this.selectedCategory = {
        name:this.currentReportData.report.categoryTitle, 
        id:this.currentReportData.report.categoryId
      }
      this.$store.dispatch("setReportConferenceCategory", this.currentReportData.report.conferenceId);
    });
    
  },
  methods: {
    $_saveReport() {
      this.btnsLoading = true;
      var report = Object.assign({}, this.currentReportData.report);
      if(this.selectedCategory)
        report.categoryId = this.selectedCategory.id;

      if(report.presentation){
        var reader = new FileReader();
        reader.readAsBinaryString(report.presentation);

        reader.onload = (res) => {
          //var presBuf = report.presentation;
          report.presentation = res.currentTarget.result;

          this.axios
          .post("/report/"+report.id+'/save', report)
          .then((response) => {
            console.log(response);
            //report.presentation = presBuf;
            this.btnsLoading = false;
          })
        }
      }else{
        this.axios
        .post("/report/"+report.id+'/save', report)
        .then((response) => {
          console.log(response);
          this.btnsLoading = false;
        })
      }
      
    },
    $_allowedHours(v){
      return this.calcAllowedHours.includes(v);
    },
    $_allowedMinutes(v){
      return this.calcAllowedMinutes.includes(v);
    },
    $_hourClick(v){
      this.hoursBuf = v;
    },
    $_startTimeClick(){
      this.currentReportData.report.endTime = '';

      var curHour = parseInt(this.currentReportData.report.startTime.substring(0,2));
      var curMinute = parseInt(this.currentReportData.report.startTime.substring(3,5));

      //Setting minimal end time to (startTime + 5 min)
      if(curMinute >= 55){
        this.minEndTime = '' + (curHour+1) + ':' + (curMinute + 5 - 60);
      }else{
        this.minEndTime = '' + curHour + ':' + (curMinute + 5);
      }
      //Maximal maxEndTime is start time + 1 hour
      var maxEndTimeBufHour = curHour+1;
      var maxEndTimeBufMinute = curMinute;

      //Checking if any reports starts soon and setting maxEndTime to report start time
      for (let i = 0; i < this.currentReportData.busyStartTimes.length; i++) {
        var startHour = parseInt(this.currentReportData.busyStartTimes[i].substring(0,2));
        var startMinute = parseInt(this.currentReportData.busyStartTimes[i].substring(3,5));
        
        if((curHour == startHour && curMinute < startMinute) || curHour == startHour - 1){
          if(this.$_timeIsBigger(maxEndTimeBufHour, maxEndTimeBufMinute, startHour, startMinute)){
            maxEndTimeBufHour = startHour;
            maxEndTimeBufMinute = startMinute;
          }
        }
      }
      this.maxEndTime = '' + maxEndTimeBufHour + ':' + maxEndTimeBufMinute;
    },
    /**
     * Determines is time1 is bigger than time2
     *
     * @param int time1Hour
     * @param int time1Minute
     * @param int time2Hour
     * @param int time2Minute
     * 
     * @return bool
     */
    $_timeIsBigger(time1Hour, time1Minute, time2Hour, time2Minute){
      if(time1Hour > time2Hour){
        return true;
      }else if(time1Hour < time2Hour){
        return false;
      }else{
        return time1Minute > time2Minute ? true : false;
      }
    }
  },
  components: { AppHeader },
  mixins:[rulesMixin]
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
