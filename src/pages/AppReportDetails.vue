<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br>
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form  v-else>
        <v-btn  
          v-if="isAdmin"
          class="float-right"
          :disabled="channelLoading"
          :loading="channelLoading"
          color="primary"
          @click="$_exportComments"
        >
          <span>Export comments</span>
        </v-btn>
        <v-container>
          <v-row>
            <v-breadcrumbs
              :items="currentReportData.breadcrumbs"
              divider="/"
              large
            >
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                class="bread-item"
                @click="
                $_breadcrumbClick(item.categoryId);          
                "
              >
              {{item.text}}
              </v-breadcrumbs-item>
            </template>
            </v-breadcrumbs>
          </v-row><br>
          <v-btn
            class="btn"
            color="primary"
            @click="$router.push('/conference/'+currentReportData.report.conferenceId)"
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Go to conference</span>
          </v-btn><br><br>

          <h4>Title:</h4>
          <p class="ml-3 mb-3">{{currentReportData.report.title}}</p>
          
          <div v-if="currentReportData.report.categoryTitle">
            <h4>Category:</h4>
            <p class="ml-3 mb-3">{{currentReportData.report.categoryTitle}}</p>
          </div>
          
          <div class="tight" v-if="currentReportData.report.categoryTitle">
            <h4>Description:</h4>
            <p class="ml-3 mb-3">{{currentReportData.report.description}}</p>
          </div>

          <h4>Start time:</h4>
          <v-time-picker 
            class="mt-2 tight" 
            v-model="currentReportData.report.startTime" 
            readonly
            full-width
            format="24hr"
          ></v-time-picker>

          <h4>End time:</h4>
          <v-time-picker 
            class="mt-2 tight" 
            v-model="currentReportData.report.endTime" 
            readonly
            full-width
            format="24hr"
          ></v-time-picker>

          <div class="tight" v-if="currentReportData.presentationName">
            <h4>Presentation:</h4>
            <a class="ml-3 mb-3 mt-3" @click="$_downloadPresentation">{{currentReportData.presentationName}}</a> 
          </div>
      
          <v-row  v-if="currentReportData.remainingTime" class="mt-5">
            <AppTimer
              :remaining-time-original="currentReportData.remainingTime"
              @end="$_timerEnd()"
            />
          </v-row>
          <v-row  v-if="currentReportData.meetingJoinLink" class="mb-3">
            <v-btn
              color="success"
            >
              <a class="text-white" :href="currentReportData.meetingJoinLink">Join Zoom meeting</a>
            </v-btn>
          </v-row>
          <v-row  v-if="currentReportData.meetingStartLink">
            <v-btn
              color="success"
            >
              <a class="text-white" :href="currentReportData.meetingStartLink">Start Zoom meeting</a>
            </v-btn>
          </v-row>
          <br />
          <v-btn
            v-if="currentReportData.canUpdate"
            class="btn"
            color="success"
            @click="$router.push('/report/'+$route.params.repId+'/edit')"
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Edit</span>
          </v-btn>
          <v-btn
            v-if="currentReportData.canUpdate"
            class="btn"
            color="primary"
            @click="$_cancelPart"
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Cancel participation</span>
          </v-btn>
        </v-container>
      </v-form>
      <AppComments :reportId="currentReportData.report.id"></AppComments>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import AppComments from "../components/AppComments.vue";
import AppTimer from "../components/AppTimer.vue";

export default {
  name: "AppReportsDetails",

  data: () => ({
    btnsLoading: false,
    buttons: {
      back: true,
    },
  }),
  computed: {
    loading(){
      return this.$store.getters.isLoading;
    },
    currentReportData(){
      return this.$store.getters.getCurrentReportData;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    channelLoading() {
      return this.$store.getters.getChannelLoading;
    },
  },
  mounted() {
    this.$store.dispatch("setCurrentReportData", {id: this.$route.params.repId});
    this.$store.dispatch("definePerks");
  },
  methods: {
    $_cancelPart(){
      this.btnsLoading = true;
      this.axios.post("/reports/delete/" + this.currentReportData.report.conferenceId, {reportId: this.$route.params.repId}).then(() => {
        this.$router.push('/reports/1');
      });
    },
    $_breadcrumbClick(categoryId){
      this.$store.commit('setFilters', {categories:[categoryId]});
      this.$router.push('/reports/1');    
    },
    $_exportComments(){
      this.$store.commit('setChannelLoading', true);
      this.$store.commit('initializePusher');
      this.axios.post("/export/report/"+this.$route.params.repId+'/comments');  
    },
    $_timerEnd(){
      this.$set(this.currentReportData, 'remainingTime', false);
      this.$store.dispatch("setCurrentReportData", {id: this.$route.params.repId, hard: true});
    },
    $_downloadPresentation(){
      let presentationName = this.currentReportData.presentationName.slice(this.currentReportData.presentationName.lastIndexOf('/'));
      this.axios.get("/presentations/" + presentationName).then((response) => {
        let hiddenElement = document.createElement('a');  
        let mime = this.currentReportData.presentationName.slice(this.currentReportData.presentationName.lastIndexOf('.') + 1);
        hiddenElement.href = 'data:text/'+mime+';charset=utf-8,' + encodeURI(response);
        hiddenElement.target = '_blank';  
          
        hiddenElement.download = this.currentReportData.presentationName;
        hiddenElement.click();  
      });
    },
  },
  components: { AppHeader, AppComments, AppTimer },
};
</script>

<style scoped>
.v-form {
  width: 90%;
  margin: auto;
}

.v-text-field, .tight {
  max-width: 300px;
}

.btn {
  margin-right: 5px;
  margin-bottom: 5px;
}

.text-white{
  color: white;
}
.bread-item{
  color:blue;
  cursor: pointer;
}
</style>
