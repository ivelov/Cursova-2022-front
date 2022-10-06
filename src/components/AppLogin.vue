<template>
    <div>
        <AppHeader
            :buttons="buttons"
        ></AppHeader>
        
        <v-main>
            <br><br>
        <v-form 
        v-model="valid"
        >

        
        <v-container>
            <v-row>
                <v-text-field
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    label="E-mail"
                    outlined
                    :error-messages="emailErrors"
                    @blur="removeErrors"
                ></v-text-field>
            </v-row>
            <v-row>
                <v-text-field
                    v-model="password"
                    type="password"
                    :rules="[rules.required, rules.counter]"
                    label="Password"
                    outlined
                    :error-messages="passErrors"
                    @blur="removeErrors"
                ></v-text-field>
            
            </v-row>
            <br>
            <v-btn
                @click="enter"
                class="btn"
                :disabled="!valid"
                color="success"
            >
                <span>Enter</span>
            </v-btn>
            <br><br>
            <p>Don't have an account? <a @click="$router.push('/register')">Register</a></p>
        </v-container>
        </v-form>
    </v-main>
    </div>
   
</template>

<script>
import AppHeader from './AppHeader.vue';

    export default {
    name: "AppLogin",

    data: () => ({
        valid:true,
        emailErrors:null,
        passErrors:null,
        email:'',
        password:'',
        buttons:{
            view:true
          },
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length >= 6 || 'Min 6 characters',
          email: value => {
            const pattern = new RegExp('\\w@\\w');
            return pattern.test(value) || 'Invalid e-mail.'
          },
        }
    }),
    mounted(){
        this.$store.dispatch('setCSRF');
    },
    methods:{
        enter(){
            this.emailErrors = null;
            this.passErrors = null;
            this.axios.post("/V1/login",{
                csrfToken:this.$store.getters.getCSRF,
                email:this.email,
                password:this.password
            }).then((response) => {
                if(response.data == 1){
                    this.$router.push('/');
                }
            }).catch((e)=>{
                console.log(e);
                let errors = e.response.data.errors;
                if(typeof(errors.email) != undefined){
                    this.emailErrors = errors.email;
                }
                if(typeof(errors.password) != undefined){
                    this.passErrors = errors.password;
                }
            });
        },
        removeErrors(){
            this.emailErrors = null;
            this.passErrors = null;
        }
    },
    components: { AppHeader }
}
  </script>

  <style scoped>
    .v-form{
        width: 90%;
        margin: auto;
    }
    .v-text-field{
        max-width: 350px;
    }
  </style>