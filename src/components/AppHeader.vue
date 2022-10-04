<template>
  <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h2>Conferences</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="/login"
        text
        v-if="buttons['login']"
      >
        <span class="mr-2">Log in</span>
      </v-btn>
      <v-btn
        href="/logout"
        text
        v-if="buttons['logout']"
      >
        <span class="mr-2">Log out</span>
      </v-btn>
      <v-btn
        href="/"
        text
        v-if="buttons['back']"
      >
        <span class="mr-2">Back</span>
      </v-btn>
      <v-btn
        href="/"
        text
        v-if="buttons['add']"
      >
        <span class="mr-2">Add conference</span>
      </v-btn>

    </v-app-bar>
</template>

<script>

    export default {
    name: 'AppHeader',
  
    data: function () {
        return {
            
        };
    },

    mounted(){
        this.$store.dispatch('setConferences');
    },

    props:{
        buttons:Object
    },

    computed:{
        conferences(){
        return this.$store.getters.getConferences;
    }
    }
    }
</script>