<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-form v-model="valid" @submit.prevent="$_enter">
        <v-container>
          <v-row>
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email, rules.counterMax]"
              label="E-mail"
              outlined
              :error-messages="emailErrors"
              @change="$_removeErrors"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="password"
              type="password"
              :rules="[rules.required, rules.counter, rules.counterMax]"
              label="Password"
              outlined
              :error-messages="passErrors"
              @change="$_removeErrors"
            ></v-text-field>
          </v-row>
          <br />
          <v-btn 
           type="submit"
           class="btn" 
           :disabled="!valid || btnsLoading"
           :loading="btnsLoading"
           color="success">
            <span>Enter</span>
          </v-btn>
          <br /><br />
          <p>
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </p>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import VueCookies from 'vue-cookies'
import rulesMixin from '../components/mixins/rulesMixin.vue'

export default {
  name: "AppLogin",

  data: () => ({
    valid: true,
    emailErrors: null,
    passErrors: null,
    email: "",
    password: "",
    btnsLoading: false,
    buttons: {
      conferences: true,
    },
  }),
  methods: {
    $_enter() {
      this.btnsLoading = true;
      this.emailErrors = null;
      this.passErrors = null;
      this.axios.get('/sanctum/csrf-cookie').then(() => {
        this.axios
        .post("/login", {
          email: this.email,
          password: this.password,
        },{
          headers: {
            'X-XSRF-TOKEN': VueCookies.get('XSRF-TOKEN'),
          }
        }).then((response) => {
          if (response.data == 1) {
            this.$store.commit('setAuth',true)
            this.$router.go();
          }
        })
        .catch((e) => {
          console.log(e);
          let errors = e.response.data.errors;
          if (typeof errors.email != undefined) {
            this.emailErrors = errors.email;
          }
          if (typeof errors.password != undefined) {
            this.passErrors = errors.password;
          }
        }).finally(() => {
          this.btnsLoading = false;
        });
      });
      
    },
    $_removeErrors() {
      this.emailErrors = null;
      this.passErrors = null;
    },
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
  max-width: 350px;
}
</style>
