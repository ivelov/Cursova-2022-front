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
              :loading="paymentLoading"
              :disabled="paymentLoading"
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
              <v-card-text>
                <p>Joins count: 1</p>
                <p>Price: free</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="currentPlan !== 'standart'"
                  text
                  @click="dialog = true"
                >
                  Subscribe
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan == 'standart' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Silver Plan</h2>
              </v-card-title>
              <v-card-text>
                <p>Joins count: 5</p>
                <p>Price: 15$</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="currentPlan !== 'standart'"
                  text
                  @click="dialog = false"
                >
                  Upgrade
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan == 'standart' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Standart Plan</h2>
              </v-card-title>
              <v-card-text>
                <p>Joins count: 1</p>
                <p>Price: free</p>
              </v-card-text>
              <v-card-actions>
                <v-btn text @click="$_subscribe('standart')"> Subscribe </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="plan-card"
              :class="currentPlan == 'standart' ? 'plan-card-active' : ''"
              elevation="2"
            >
              <v-card-title>
                <h2>Standart Plan</h2>
              </v-card-title>
              <v-card-text>
                <p>Joins count: 1</p>
                <p>Price: free</p>
              </v-card-text>
              <v-card-actions>
                <v-btn text @click="$_subscribe('standart')"> Subscribe </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar
        v-model="error"
        color="red"
        right
      >
        Error occured

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="error = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar
        v-model="success"
        color="success"
        right
      >
        Subscription success

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="success = false"
          >
            Close
          </v-btn>
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
    paymentLoading: true,
  }),
  computed: {
    currentPlan() {
      return this.$store.getters.getCurrentPlan;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    intent() {
      return this.$store.getters.getIntent;
    },
  },
  mounted() {
    this.$store.dispatch("setAuth");
    this.$store.dispatch("definePerks").then(() => {
      this.buttons.addConference = this.$store.getters.canAdd;
    });
    this.$store.dispatch("setIntent").then(() => {
      this.paymentLoading = false;
    });

    loadStripe(process.env.VUE_APP_STRIPE_KEY).then((stripe) => {
      this.stripe = stripe;
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create("card");
      this.cardElement.mount("#card-element");
    });
  },
  methods: {
    async $_subscribe() {
      this.paymentLoading = true;
      if(!this.paymentMethod){
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
          this.paymentLoading = false;
          return;
        }else{
          this.paymentMethod = setupIntent.payment_method;
        }
      }

      this.axios.post("/cashier/subscribe",{payment: this.paymentMethod}).then((response) => {
        console.log(response.data);
        this.success = true;
      }).catch(()=>{
        this.error = true;
      }).finally(()=>{
        this.paymentLoading = false;
      });
    },
  },
  components: { AppHeader },
  mixins: [rulesMixin],
};
</script>

<style scoped>
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
