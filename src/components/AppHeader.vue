<template>
  <div>
    <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h2>Conferences</h2>
    </div>

    <v-spacer></v-spacer>
    <v-app-bar-nav-icon 
      v-if="$vuetify.breakpoint.name == 'xs' 
        || $vuetify.breakpoint.name == 'sm'" 
      @click="drawer = true"
    >
    </v-app-bar-nav-icon>
    <div v-else>
      <v-btn
      @click="$router.push('/login')"
      text
      v-if="typeof buttons['login'] != undefined ? buttons['login'] : false"
    >
      <span class="mr-2">Log in</span>
    </v-btn>
    <v-btn
      @click="$_logout"
      text
      :disabled="logoutDisable"
      :loading="logoutDisable"
      v-if="typeof buttons['logout'] != undefined ? buttons['logout'] : false"
    >
      <span class="mr-2">Log out</span>
    </v-btn>
    <v-btn
      @click="$_back"
      text
      v-if="typeof buttons['back'] != undefined ? buttons['back'] : false"
    >
      <span class="mr-2">Back</span>
    </v-btn>
    <v-btn
      @click="$_gotoAdd"
      text
      v-if="typeof buttons['add'] != undefined ? buttons['add'] : false"
    >
      <span class="mr-2">Add conference</span>
    </v-btn>

    <v-btn
      @click="$router.push('/')"
      text
      v-if="typeof buttons['view'] != undefined ? buttons['view'] : false"
    >
      <span class="mr-2">View conferences</span>
    </v-btn>
    </div>
    
  </v-app-bar>
  <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      color="primary"
    >
    <v-btn
      @click="$router.push('/login')"
      outlined
      v-if="typeof buttons['login'] != undefined ? buttons['login'] : false"
    >
      <span class="mr-2">Log in</span>
    </v-btn>
    <v-btn
      @click="$_logout"
      :disabled="logoutDisable"
      :loading="logoutDisable"
      outlined
      v-if="typeof buttons['logout'] != undefined ? buttons['logout'] : false"
    >
      <span class="mr-2">Log out</span>
    </v-btn>
    <v-btn
      @click="$_back"
      outlined
      v-if="typeof buttons['back'] != undefined ? buttons['back'] : false"
    >
      <span class="mr-2">Back</span>
    </v-btn>
    <v-btn
      @click="$_gotoAdd"
      outlined
      v-if="typeof buttons['add'] != undefined ? buttons['add'] : false"
    >
      <span class="mr-2">Add conference</span>
    </v-btn>

    <v-btn
      @click="$router.push('/')"
      outlined
      v-if="typeof buttons['view'] != undefined ? buttons['view'] : false"
    >
      <span class="mr-2">View conferences</span>
    </v-btn>
    </v-navigation-drawer>
  </div>
  
</template>

<script>
export default {
  name: "AppHeader",

  data: function () {
    return {
      logoutDisable: false,
      drawer:false,
    };
  },

  props: {
    buttons: Object,
  },

  methods: {
    $_logout() {
      this.logoutDisable = true;
      this.axios
        .post("/logout")
        .then(() => {
          this.$store.commit('clearAuthData');
          this.$router.go();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    $_back() {
      this.$store.commit("setLoading", true);
      this.$router.push("/");
    },
    $_gotoAdd() {
      this.$store.commit("clearCurrentConferenceData");
      this.$router.push("/add");
    },
  },
};
</script>

<style scoped>
  .v-navigation-drawer{
    position: fixed;
    padding: 10% 10px;
    max-width: 230px;
    width: 230px;
  }
  .v-navigation-drawer .v-btn{
    
    width: 180px;
    margin: 0 15px 20px 15px;
  }
</style>