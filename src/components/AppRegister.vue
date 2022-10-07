<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />

      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-text-field
              v-model="values.email"
              :rules="[rules.required, rules.email, rules.counterMax]"
              label="E-mail"
              outlined
              :error-messages="errors.email"
              @blur="errors.email = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.password"
              type="password"
              :rules="[rules.required, rules.counter, rules.counterMax]"
              label="Password"
              outlined
              :error-messages="errors.password"
              @blur="errors.password = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.firstname"
              :rules="[rules.required, rules.counterMax]"
              label="Firstname"
              outlined
              :error-messages="errors.firstname"
              @blur="errors.firstname = null"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="values.lastname"
              :rules="[rules.required, rules.counterMax]"
              label="Lastname"
              outlined
              :error-messages="errors.lastname"
              @blur="errors.lastname = null"
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
              @blur="errors.country = null"
            ></v-autocomplete>
          </v-row>
          <v-row>
            <v-autocomplete
              v-model="values.role"
              auto-select-first
              label="Role"
              :rules="[rules.required, rules.counterMax]"
              outlined
              :items="roles"
              item-text="state"
              item-value="value"
              :error-messages="errors.role"
              @blur="errors.role = null"
            ></v-autocomplete>
          </v-row>
          <v-row>
            <MazPhoneNumberInput
              v-model="values.phone"
              default-country-code="UA"
              :only-countries="['UA', 'US', 'RU', 'GB']"
              required
              class="form-input"
              @update="phoneChange"
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
                  @blur="errors.birthdate = null"
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
            @click="register"
            class="btn"
            :disabled="!valid || !phoneValid"
            color="success"
          >
            <span>Register</span>
          </v-btn>
          <br /><br />
          <p>Have an account? <a @click="$router.push('/login')">Login</a></p>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
import { MazPhoneNumberInput } from "maz-ui";
import "maz-ui/lib/css/base.css";
export default {
  name: "AppRegister",

  data: () => ({
    dateMenu: false,
    valid: true,
    phoneValid: false,
    errors: {
      email: null,
      password: null,
      firstname: null,
      lastname: null,
      birthdate: null,
      phone: null,
      country: null,
    },
    values: {
      csrfToken: "",
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
      view: true,
    },
  }),
  computed: {
    countries() {
      return this.$store.getters.getCountries;
    },
    rules() {
      return this.$store.getters.getRules;
    },
  },
  mounted() {
    this.$store.dispatch("setCSRF");
  },
  methods: {
    register() {
      for (let errorKey in this.errors) {
        this.errors[errorKey] = null;
      }

      this.values.csrfToken = this.$store.getters.getCSRF;
      this.axios
        .post("/V1/register", this.values)
        .then((response) => {
          if (response.data == 1) {
            this.$router.push("/");
          }
        })
        .catch((e) => {
          console.log(e);
          let errors = e.response.data.errors;
          if (typeof errors != undefined) {
            for (const key in errors) {
              this.errors[key] = errors[key];
            }
          }
        });
    },
    phoneChange(event) {
      this.phoneValid = event.isValid;
    },
  },
  components: { AppHeader, MazPhoneNumberInput },
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
  position: sticky;
  max-height: 46px;
}
</style>
