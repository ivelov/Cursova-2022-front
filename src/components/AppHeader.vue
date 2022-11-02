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

    <v-dialog
      v-if="$store.getters.isAuth"
      v-model="search.dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <div class="search-div">
        <v-text-field
          v-model="search.text"
          outlined
          label="Search"
          clearable
        ></v-text-field>
        <v-card class="search-card">
          <v-row>
            <v-col cols="8">
                <v-text-field v-if="search.loading" color="success" loading disabled></v-text-field>
                <div v-for="(type, index) in search.results" :key="index">
                  <p style="font-size:larger">{{type.name}}</p>
                  <v-list>
                    <v-list-item
                     class="result transition-fast-in-fast-out" 
                     v-for="result in type.content" 
                     :key="result.id"
                     @click="$router.push(result.path)"
                    >
                      <span
                        
                      >{{result.title}}</span>
                    </v-list-item>
                  </v-list>
                </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="4">
              <v-checkbox
                v-model="search.types.conferences"
                label="Conferences"
              ></v-checkbox>
              <v-checkbox
                v-model="search.types.reports"
                label="Reports"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-dialog>
  
    <v-btn
      @click="$router.push('/login')"
      text
      v-if="!$store.getters.isAuth"
    >
      <span class="mr-2">Log in</span>
    </v-btn>

    <v-btn
      @click="$_back"
      text
      v-if="typeof buttons['back'] != undefined ? buttons['back'] : false"
    >
      <span class="mr-2">Back</span>
    </v-btn>

    <v-btn
      @click="$router.push('/categories')"
      text
      v-if="typeof buttons['categories'] != undefined ? buttons['categories'] : false"
    >
      <span class="mr-2">Categories</span>
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
      v-if="typeof buttons['conferences'] != undefined ? buttons['conferences'] : false"
    >
      <span class="mr-2">View conferences</span>
    </v-btn>

    <v-btn
      @click="$router.push('/reports/1')"
      text
      v-if="typeof buttons['reports'] != undefined ? buttons['reports'] : false"
    >
      <span class="mr-2">View reports</span>
    </v-btn>

    <v-menu
      v-if="$store.getters.isAuth"
      open-on-hover
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          text
        >
          Account
          <span 
            v-if="!favLoading" 
            :class="{'gray-fav': favCount==0, 'red-fav':favCount>0}"
          >
            ❤
            <div class="fav-count" v-if="favCount>0">{{favCount}}</div>
          </span>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
        <v-btn
          @click="$router.push('/account/edit')"
          text
          :disabled="logoutDisable"
          :loading="logoutDisable"
        >
          <span>Edit account</span>
        </v-btn>
        </v-list-item>
        <v-list-item>
        <v-btn
          @click="$_logout"
          text
          :disabled="logoutDisable"
          :loading="logoutDisable"
        >
          <span>Log out</span>
        </v-btn>
        </v-list-item>
        <v-list-item v-if="favCount>0">
        <v-btn
          @click="$router.push('/account/favorites/reports/1'); $router.go()"
          text
        >
          <span>View favorites</span>
        </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    </div>
  </v-app-bar>
  <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      color="primary"
    >

    <v-menu
      v-if="$store.getters.isAuth"
      open-on-hover
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          outlined
        >
          Account 
          <span 
            v-if="!favLoading" 
            :class="{'gray-fav': favCount==0, 'red-fav':favCount>0}"
          >
            ❤
            <span class="fav-count" v-if="favCount>0">{{favCount}}</span>
          </span>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
        <v-btn
          @click="$router.push('/account/edit')"
          text
          :disabled="logoutDisable"
          :loading="logoutDisable"
        >
          <span>Edit account</span>
        </v-btn>
        </v-list-item>
        <v-list-item>
        <v-btn
          @click="$_logout"
          text
          :disabled="logoutDisable"
          :loading="logoutDisable"
        >
          <span>Log out</span>
        </v-btn>
        </v-list-item>
        <v-list-item v-if="favCount>0">
        <v-btn
          @click="$router.push('/account/favorites/reports/1')"
          text
        >
          <span>View favorites</span>
        </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      @click="$router.push('/login')"
      outlined
      v-if="!$store.getters.isAuth"
    >
      <span class="mr-2">Log in</span>
    </v-btn>

    <v-btn
      @click="$_back"
      outlined
      v-if="typeof buttons['back'] != undefined ? buttons['back'] : false"
    >
      <span class="mr-2">Back</span>
    </v-btn>

    <v-btn
      @click="$router.push('/categories')"
      outlined
      v-if="typeof buttons['categories'] != undefined ? buttons['categories'] : false"
    >
      <span class="mr-2">Categories</span>
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
      v-if="typeof buttons['conferences'] != undefined ? buttons['conferences'] : false"
    >
      <span class="mr-2">View conferences</span>
    </v-btn>

    <v-btn
      @click="$router.push('/reports/1')"
      outlined
      v-if="typeof buttons['reports'] != undefined ? buttons['reports'] : false"
    >
      <span class="mr-2">View reports</span>
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
      favLoading:true,
      favCount:0,
      search:{
        dialog:false,
        loading:false,
        text:'',
        waiting:false,
        results:[],
        types:{
          conferences:true,
          reports:true,
        },
      },
    };
  },
  computed:{
    searchText(){
      return this.search.text;
    }
  },
  watch:{
    searchText(){
      this.$_search();
    }
  },
  props: {
    buttons: Object,
  },
  mounted(){
    if(this.$store.getters.isAuth){
      this.favLoading = true;
    this.axios
      .get("/account/favorites")
      .then((response) => {
        this.favCount = response.data;
        this.favLoading = false;
      })
    }
  },
  methods: {
    $_logout() {
      this.logoutDisable = true;
      this.axios
        .post("/logout")
        .then(() => {
          this.$store.commit('clearAuthData');
          //this.$store.commit('clearCommentsInfo');
          this.$router.go('/login');
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
    $_search(fromWatch = true){
      if(!this.searchloading){
        this.search.loading = true;
        this.search.waiting = false;
        var loadingCount = 0;
        this.search.results = [];
        if(this.search.types.conferences){
          loadingCount++;
          console.log(loadingCount);
          this.axios.post("/conferencesFind", {searchText:this.search.text}).then((response) => {
            this.search.results.push({
              name: 'Conferences',
              content: response.data,
            });
            console.log(this.search.results);
            loadingCount--;
            if(loadingCount == 0)
              this.search.loading = false;
          });
        }
        if(this.search.types.reports){
          loadingCount++;
          console.log(loadingCount);
          this.axios.post("/reportsFind", {searchText:this.search.text}).then((response) => {
            this.search.results.push({
              name: 'Reports',
              content: response.data,
            });
            loadingCount--;
            if(loadingCount == 0)
              this.search.loading = false;
          });
        }
        
      }else{
        if(fromWatch){
          if(!this.search.waiting){
            this.search.waiting = true;
            console.log('from watch');
            setTimeout(() => {this.$_search(false)}, 100);  
          }
        }else{
          setTimeout(() => {this.$_search(false)}, 100);
        }
      }
    }
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
  .red-fav,.gray-fav{
    position: relative;
    font-size: 20px;
  }
  .red-fav{
    color: red;
  }
  .gray-fav{
    color: gray;
  }
  .fav-count{
    position: absolute;
    display: inline-block;
    background-color: white;
    border: 2px solid white;
    border-radius: 10px;
    color: black;
    font-size: 12px;
    left: 15px;
    top: -3px;
    width: min-content;
    max-width: 27px;
    height: 15px;
  }

  .search-div{
    background-color: white;
    padding: 10px;
  }
  .search-card{
    padding: 10px;
    min-height: 50px;
  }

  .result:hover{
    background-color: lightgray;
  }
</style>