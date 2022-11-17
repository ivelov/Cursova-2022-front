<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <div v-if="loading">
        <v-skeleton-loader
          class="meeting-container"
          type="table-thead, table-tbody"
        ></v-skeleton-loader>
      </div>
      <v-container v-else-if="pageInfo.meetings? Object.keys(pageInfo.meetings).length == 0 : false" class="text-center">
        No results
      </v-container>
        <v-simple-table class="meeting-container"  v-else>
          <thead>
          <tr>
            <th>№</th>
            <th>uuid</th>
            <th>id</th>
            <th>host_id</th>
            <th>topic/report_title</th>
            <th>type</th>
            <th>start_time</th>
            <th>timezone</th>
            <th>created_at</th>
            <th>join_url</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="meeting-row"
            v-for="(meeting, index) in pageInfo.meetings"
            :key="meeting.id"
          >
            <td>{{index}}</td>
            <td>{{meeting.uuid}}</td>
            <td>{{meeting.id}}</td>
            <td>{{meeting.host_id}}</td>
            <td>{{meeting.topic}}</td>
            <td>{{meeting.type}}</td>
            <td>{{meeting.start_time}}</td>
            <td>{{meeting.timezone}}</td>
            <td>{{meeting.created_at}}</td>
            <td>{{meeting.join_url}}</td>
          </tr>
        </tbody>
        </v-simple-table>
        <p width="100%" class="text-center mt-3">
        Page {{ curPage }} of {{ pageInfo.maxPage }}
        <v-btn @click="$_prevPage" text :disabled="prevBtnDisabled || loading">
          <span>Prev</span>
        </v-btn>
        <v-btn @click="$_nextPage" text :disabled="nextBtnDisabled || loading">
          <span>Next</span>
        </v-btn>
      </p>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
export default {
  name: "AppMeetings",

  data: () => ({
    buttons: {
      back: true,
      categories: true,
    },
    loading:true,
    curPage: 1
  }),
  computed: {
    pageInfo(){
      return this.$store.getters.getMeetingsPageInfo;
    },
    nextBtnDisabled() {
      return this.curPage >= this.pageInfo.maxPage;
    },
    prevBtnDisabled() {
      return this.curPage <= 1;
    },
  },
  mounted() {
    this.loading = true;
    this.curPage = this.$route.params.page;
    this.$store.dispatch("setMeetingsPageInfo", this.curPage).finally(()=>{
      this.loading = false;
    });
  },
  methods: {
    $_nextPage() {
      this.curPage = parseInt(this.curPage) + 1;
      this.loading = true;
      this.$store.dispatch("setMeetingsPageInfo", this.curPage).finally(()=>{
        this.loading = false;
      });
      this.$router.push("/meetings/" + this.curPage);
    },
    $_prevPage() {
      this.curPage = parseInt(this.curPage) - 1;
      this.loading = true;
      this.$store.dispatch("setMeetingsPageInfo", this.curPage).finally(()=>{
        this.loading = false;
      });
      this.$router.push("/meetings/" + this.curPage);
    },
  },
  components: { AppHeader },
};
</script>

<style scoped>

.meeting-container{
  overflow-x: auto;
  width: 100%;
  padding: 0 2% 0 2%;
}

.meeting-row{
  min-width: 620px;
}

</style>
