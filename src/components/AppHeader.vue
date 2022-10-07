<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h2>Conferences</h2>
    </div>

    <v-spacer></v-spacer>

    <v-btn
      @click="$router.push('/login')"
      text
      v-if="typeof buttons['login'] != undefined ? buttons['login'] : false"
    >
      <span class="mr-2">Log in</span>
    </v-btn>
    <v-btn
      @click="logout"
      text
      :disabled="logoutDisable"
      v-if="typeof buttons['logout'] != undefined ? buttons['logout'] : false"
    >
      <span class="mr-2">Log out</span>
    </v-btn>
    <v-btn
      @click="back"
      text
      v-if="typeof buttons['back'] != undefined ? buttons['back'] : false"
    >
      <span class="mr-2">Back</span>
    </v-btn>
    <v-btn
      @click="gotoAdd"
      text
      v-if="typeof buttons['add'] != undefined ? buttons['add'] : false"
    >
      <span class="mr-2">Add conference</span>
    </v-btn>

    <v-btn
      href="/"
      text
      v-if="typeof buttons['view'] != undefined ? buttons['view'] : false"
    >
      <span class="mr-2">View conferences</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppHeader",

  data: function () {
    return {
      logoutDisable: false,
    };
  },

  props: {
    buttons: Object,
  },

  methods: {
    logout() {
      this.logoutDisable = true;
      this.axios
        .post("/V1/logout")
        .then(() => {
          this.$router.go();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    back() {
      this.$store.commit("setLoading", true);
      this.$router.push("/");
    },
    gotoAdd() {
      this.$store.commit("clearCurrentConferenceData");
      this.$router.push("/add");
    },
  },
};
</script>
