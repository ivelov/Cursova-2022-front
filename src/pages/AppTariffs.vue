<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>
    <br />
    <v-main>
      <v-dialog v-model="dialog" width="500" eager>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Payment Info
          </v-card-title>

          <v-card-text>
            <v-text-field
              class="mt-5"
              id="card-holder-name"
              v-model="cardHolderName"
              label="Your name"
              outlined
              :rules="[rules.required]"
            >
            </v-text-field>

            <!-- Stripe Elements Placeholder -->
            <div id="card-element" class="outlined mb-5"></div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              id="card-button"
              :data-secret="intent ? intent.client_secret : ''"
              color="primary"
              text
              @click="$_subscribe"
              :loading="paymentLoading != 0"
              :disabled="paymentLoading != 0"
            >
              Subscribe
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container>
        <v-alert v-if="isAdmin" border="left" colored-border color="red">
          Admins can`t subscribe to a plan
        </v-alert>
        <v-row>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan === 'standart' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Standart Plan</h2>
              </v-card-title>
              <v-card-text class="text-h6">
                <p>Joins count: 1</p>
                <p>Price: free</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="currentPlan !== 'standart'"
                  text
                  :loading="paymentLoading != 0"
                  :disabled="paymentLoading != 0"
                  @click="$_subscribeTo('standart')"
                >
                  Subscribe
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan == 'silver' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Silver Plan</h2>
              </v-card-title>
              <v-card-text  class="text-h6">
                <p>Joins count: 5</p>
                <p>Price: 15$</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="currentPlan !== 'silver'"
                  text
                  :loading="paymentLoading != 0"
                  :disabled="paymentLoading != 0"
                  @click="
                    dialog = true;
                    choosenPlan = 'silver';
                  "
                >
                  Upgrade
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan == 'golden' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Golden Plan</h2>
              </v-card-title>
              <v-card-text  class="text-h6">
                <p>Joins count: 50</p>
                <p>Price: 25$</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="currentPlan !== 'golden'"
                  text
                  :loading="paymentLoading != 0"
                  :disabled="paymentLoading != 0"
                  @click="
                    dialog = true;
                    choosenPlan = 'golden';
                  "
                >
                  Upgrade
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan == 'platinum' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Platinum Plan</h2>
              </v-card-title>
              <v-card-text  class="text-h6">
                <p>Joins count: unlimited</p>
                <p>Price: 100$</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="currentPlan !== 'platinum'"
                  text
                  :loading="paymentLoading != 0"
                  :disabled="paymentLoading != 0"
                  @click="
                    dialog = true;
                    choosenPlan = 'platinum';
                  "
                >
                  Upgrade
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="errorsFromJoins" color="red" right>
        You have exceeded the limit of joins
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="errorsFromJoins = false"> Close </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="error" color="red" right>
        Error occured

        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="error = false"> Close </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="success" color="success" right>
        Subscription success

        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="success = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import { loadStripe } from "@stripe/stripe-js";
import rulesMixin from "../components/mixins/rulesMixin.vue";

export default {
  name: "AppTariffs",
  data: () => ({
    buttons: {
      conferences: true,
    },
    dialog: false,
    cardHolderName: "",
    stripe: null,
    elements: null,
    cardElement: null,
    choosenPlan: null,
    error: false,
    success: false,
    paymentMethod: null,
    paymentLoading: 3,
  }),
  computed: {
    currentPlan() {
      return this.$store.state.currentPlan;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    intent() {
      return this.$store.getters.getIntent;
    },
    errorsFromJoins:{
      get(){
        return this.$store.getters.isErrorFromJoins;
      },
      set(newValue){
        return this.$store.commit('setErrorFromJoins', newValue);
      }
    },
  },
  mounted() {
    this.$store.dispatch("setAuth");
    this.$store.dispatch("definePerks").finally(() => {
      this.paymentLoading--;
    });
    this.$store.dispatch("setIntent").finally(() => {
      this.paymentLoading--;
    });

    loadStripe(process.env.VUE_APP_STRIPE_KEY).then((stripe) => {
      this.stripe = stripe;
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create("card");
      this.cardElement.mount("#card-element");
    }).finally(() => {
      this.paymentLoading--;
    });
  },
  methods: {
    async $_subscribe() {
      this.paymentLoading++;
      if (!this.paymentMethod) {
        const cardHolderName = document.getElementById("card-holder-name");
        const cardButton = document.getElementById("card-button");
        const clientSecret = cardButton.dataset.secret;

        const { setupIntent, error } = await this.stripe.confirmCardSetup(
          clientSecret,
          {
            payment_method: {
              card: this.cardElement,
              billing_details: { name: cardHolderName.value },
            },
          }
        );
        if (error) {
          console.error(error);
          this.error = true;
          this.paymentLoading--;
          return;
        } else {
          this.paymentMethod = setupIntent.payment_method;
        }
      }
      this.$_subscribeTo(this.choosenPlan);
      this.paymentLoading--;
    },
    $_subscribeTo(plan) {
      this.paymentLoading++;
      this.axios
        .post("/cashier/subscribe", { payment: this.paymentMethod, plan: plan })
        .then(() => {
          this.success = true;
          this.dialog = false;
          this.$router.go();
        })
        .catch(() => {
          this.error = true;
        })
        .finally(() => {
          this.paymentLoading--;
        });
    },
  },
  components: { AppHeader },
  mixins: [rulesMixin],
};
</script>

<style scoped>
.plan-card{
  height: 232px;
  min-height: 200px;
  min-width: 200px;
}
.plan-card-active {
  border: 1px solid red;
}

.outlined {
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.38);
  border-radius: 4px;
}
#card-element {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 10px;
}
</style>
<style>
#card-element > * {
  width: 100%;
}
</style>
