<template>
    <v-form method="post">
        <br><br>
    <v-container>
        <v-row>
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" placeholder="Email" name='email'>
            @if($errors->getBag('default')->has('email'))
                <div class="alert alert-danger form-error" role="alert">
                {{$errors->getBag('default')->get('email')[0]}}
                </div>
            @endif
        </v-row>
        <v-row>
            <v-col>
                <label for="password">Password</label>
            </v-col>
            <v-col>
                <input type="password" class="form-control" id="password" placeholder="Password" name="password">
                <div class="alert alert-danger form-error" role="alert">
                
                </div>
            </v-col>
            
           
        </v-row>
        <button type="submit" class="btn btn-success">Enter</button>
    </v-container>
    </v-form>
</template>

<script>

    export default {
    name: "AppLoginAndRegister",

    data: () => ({
        
    }),
    computed: {
        
    },
    mounted() {
        
    },
    methods:{
        
    },
    components: { }
}
  </script>

  <style scoped>
    
  </style>