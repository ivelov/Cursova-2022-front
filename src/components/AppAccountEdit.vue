<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-model="valid" v-else>
        <v-container>
          <v-row>
            <v-text-field
              v-model="values.email"
              :rules="[rules.required, rules.email, rules.counterMax]"
              label="E-mail"
              outlined
              :error-messages="errors.email"
              @change="errors.email = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.currentPassword"
              type="password"
              :rules="[rules.required, rules.counter, rules.counterMax]"
              label="Current password"
              outlined
              :error-messages="errors.currentPassword"
              @change="errors.currentPassword = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.password"
              type="password"
              :rules="[rules.counter, rules.counterMax]"
              label="New password"
              outlined
              :error-messages="errors.password"
              @change="errors.password = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.firstname"
              :rules="[rules.required, rules.counterMax]"
              label="Firstname"
              outlined
              :error-messages="errors.firstname"
              @change="errors.firstname = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.lastname"
              :rules="[rules.required, rules.counterMax]"
              label="Lastname"
              outlined
              :error-messages="errors.lastname"
              @change="errors.lastname = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-autocomplete
              v-model="values.country"
              auto-select-first
              label="Country"
              outlined
              :rules="[rules.required, rules.counterMax]"
              :items="countries"
              item-text="state"
              item-value="value"
              :error-messages="errors.country"
              @change="errors.country = null"
            ></v-autocomplete>
          </v-row>
          <v-row>
            <MazPhoneNumberInput
              v-model="values.phone"
              default-country-code="UA"
              :only-countries="['UA', 'US', 'RU', 'GB']"
              required
              class="form-input"
              @update="$_phoneChange"
              :error-messages="errors.phone"
              @blur="errors.phone = null"
            />
          </v-row>
          <v-row>
            <br /><br />
            <v-menu
              ref="menu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="values.date"
                  label="Birthday date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required]"
                  outlined
                  :error-messages="errors.birthdate"
                  @change="errors.birthdate = null"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="values.date"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <br />
          <v-btn
            @click="$_save"
            class="btn"
            :disabled="!valid || !phoneValid || btnsLoading"
            :loading="btnsLoading"
            color="success"
          >
            <span>Save</span>
          </v-btn>
          <br /><br />
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./subComponents/AppHeader.vue";
import { MazPhoneNumberInput } from "maz-ui";
import "maz-ui/lib/css/base.css";
import VueCookies from 'vue-cookies'
import countriesMixin from './mixins/countriesMixin.vue'
import rulesMixin from './mixins/rulesMixin.vue'

export default {
  name: "AppAccountEdit",

  data: () => ({
    loading:true,
    dateMenu: false,
    valid: true,
    phoneValid: false,
    btnsLoading: false,
    errors: {
      email: null,
      password: null,
      firstname: null,
      lastname: null,
      birthdate: null,
      phone: null,
      country: null,
      currentPassword:null,
    },
    values: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      birthdate: "",
      phone: "",
      country: "",
      role: "",
    },
    roles: [
      { state: "Listener", value: "listener" },
      { state: "Announcer", value: "announcer" },
    ],
    buttons: {
      back: true,
    },
  }),
  mounted(){
    this.loading = true;
    this.axios.get("/account")
      .then((response) => {
        this.values = response.data;
        this.loading = false;
      });
  },
  methods: {
    $_save() {
      this.btnsLoading = true;
      for (let errorKey in this.errors) {
        this.errors[errorKey] = null;
      }

      this.axios
        .get("/sanctum/csrf-cookie")
        .then(() => {
          this.axios
            .post("/account/save", this.values, {
              headers: {
                "X-XSRF-TOKEN": VueCookies.get("XSRF-TOKEN"),
              },
            })
            .then((response) => {
              this.btnsLoading = false;
              if (response.data == 1) {
                this.$router.push("/");
              }
            })
            .catch((e) => {
              this.btnsLoading = false;
              console.error(e);
              let errors = e.response.data.errors;
              if (typeof errors != undefined) {
                for (const key in errors) {
                  this.errors[key] = errors[key];
                }
              }
            });
        });
    },
    $_phoneChange(event) {
      this.phoneValid = event.isValid;
    },
  },
  components: { AppHeader, MazPhoneNumberInput },
  mixins:[countriesMixin, rulesMixin]
};
</script>

<style scoped>
.v-form {
  width: 90%;
  margin: auto;
}
.row {
  max-width: 350px;
  min-height: 86px;
}
</style>
<style>
.maz-border-radius {
  border-radius: 5px;
}
.maz-border {
  border: 1px solid;
}
.maz-border-color {
  border-color: rgba(0, 0, 0, 0.38);
}
.form-input {
  max-height: 46px;
}
</style>
