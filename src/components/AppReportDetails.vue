<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-form>
        <v-container>
          <v-row>
            <v-text-field
              v-model="currentReportData.report.title"
              label="Title"
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
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
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
  },
  mounted() {
    this.$store.dispatch("setCurrentReportData", {id: this.$route.params.repId});
  },
  methods: {
    $_cancelPart(){
      this.loading = true;
      this.axios.post("/reports/delete/" + this.currentReportData.report.id).then(() => {
        this.$router.push('/reports/1');
      });
    }
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
