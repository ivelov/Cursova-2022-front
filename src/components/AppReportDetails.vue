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
          v-if="canExport"
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
                style="color:blue;cursor: pointer;"
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
          <v-row>
            <v-text-field
              v-model="currentReportData.report.title"
              label="Title"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="currentReportData.report.categoryTitle"
              label="Category"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-textarea
              v-model="currentReportData.report.description"
              outlined
              label="Description"
              disabled
            ></v-textarea>
          </v-row>
          <v-row>
            <v-text-field
              v-model="currentReportData.report.startTime"
              label="Start time"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="currentReportData.report.endTime"
              label="End time"
              outlined
              disabled
            ></v-text-field>
          </v-row>
          <v-row>
            <v-file-input
              v-model="currentReportData.report.presentation"
              accept=".ppt,.pptx"
              label="Presentation"
              outlined
              disabled
            ></v-file-input>
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
import AppHeader from "./subComponents/AppHeader.vue";
import AppComments from "./subComponents/AppComments.vue";
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
    canExport() {
      return this.$store.getters.canExport;
    },
    channelLoading() {
      return this.$store.getters.getChannelLoading;
    },
  },
  mounted() {
    this.$store.dispatch("setCurrentReportData", {id: this.$route.params.repId});
    this.$store.dispatch("setPerks");
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
  },
  components: { AppHeader, AppComments },
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
