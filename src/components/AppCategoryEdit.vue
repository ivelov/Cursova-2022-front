<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-form v-else v-model="valid">
        <v-container>
          <v-row>
            <p>Conferences in this category:{{categoryInfo.conferencesCount}}</p>
          </v-row>
          <v-row>
            <p>Reports in this category:{{categoryInfo.reportsCount}}</p>
          </v-row>
          <br><br>
          <v-row>
            <v-text-field
              v-model="categoryInfo.category.title"
              label="New title"
              outlined
              :rules="[rules.required, rules.counterMax]"
            >
            </v-text-field>
          </v-row>
          <br /><br />
          <v-btn
            class="btn"
            color="success"
            @click="$_saveCategory"
            :disabled="!valid || btnsLoading"
            :loading="btnsLoading"
          >
            <span>Save</span>
          </v-btn>
          <v-btn
            class="btn"
            color="primary"
            :disabled="btnsLoading"
            :loading="btnsLoading"
            @click="$router.push('/categories')"
          >
            <span>Cancel</span>
          </v-btn>
          <v-btn
            class="btn"
            color="error"
            :disabled="btnsLoading"
            :loading="btnsLoading"
            @click="$_deleteCategory"
          >
            <span>Delete</span>
          </v-btn>
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
export default {
  name: "AppCategoryEdit",

  data: () => ({
    valid: false,
    catMenu:false,
    btnsLoading: false,
    buttons: {
      back: true,
    },
    title:'',
    errors:null,
    categoryInfo:{category:{title:''}}
  }),
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    rules() {
      return this.$store.getters.getRules;
    },
  },
  mounted() {
    this.$store.commit("setLoading", true);
    this.axios
        .get("/category/"+this.$route.params.id)
        .then((response) => {
          this.categoryInfo = response.data;
          this.$store.commit("setLoading", false);
        })
  },
  methods: {
    $_saveCategory() {
      this.btnsLoading = true;
      
      this.axios
        .post("/category/"+this.categoryInfo.category.id+'/save', {title: this.categoryInfo.category.title})
        .then((response) => {
          console.log(response);
          this.$router.go();
          this.btnsLoading = false;
        })
    },
    $_deleteCategory() {
      if(!this.selectedCategory){
        this.errors = 'Required';
        return;
      }
      
      this.btnsLoading = true;
      this.axios
        .post("/category/"+this.categoryInfo.category.id+'/destroy')
        .then((response) => {
          console.log(response);
          this.$router.go();
          this.btnsLoading = false;
        })
    },
  },
  components: { AppHeader },
};
</script>

<style scoped>
.v-form {
  width: 90%;
  margin: auto;
}

.v-text-field {
  max-width: 300px;
}

.btn {
  margin-right: 5px;
  margin-bottom: 5px;
}

</style>
