<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-form v-model="valid">
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
          <v-btn @click="$_enter" class="btn" 
          :disabled="!valid || btnsLoading"
          :loading="btnsLoading"
          color="success">
            <span>Enter</span>
          </v-btn>
          <br /><br />
          <p>
            Don't have an account?
            <a @click="$router.push('/register')">Register</a>
          </p>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./subComponents/AppHeader.vue";
import VueCookies from 'vue-cookies'
import rulesMixin from './mixins/rulesMixin.vue'

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
          this.btnsLoading = false;
          if (response.data == 1) {
            this.$store.commit('setAuth',true)
            this.$router.go();
          }
        })
        .catch((e) => {
          this.btnsLoading = false;
          console.log(e);
          let errors = e.response.data.errors;
          if (typeof errors.email != undefined) {
            this.emailErrors = errors.email;
          }
          if (typeof errors.password != undefined) {
            this.passErrors = errors.password;
          }
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
