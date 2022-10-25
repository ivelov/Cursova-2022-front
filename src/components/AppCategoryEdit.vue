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
            <br /><br />
            <v-menu
              ref="catMenu"
              v-model="catMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-x
              min-width="200"
              min-height="50"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="selectedCategory ? selectedCategory.name : ''"
                  label="Select category"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  :rules="[rules.required]"
                  :error-messages="errors"
                ></v-text-field>
              </template>
              <template>
                <v-container style="background-color: white;">
                  <v-treeview
                  @update:active="$_onCategoryClick"
                  activatable
                  return-object
                  :items="categories"
                ></v-treeview>
                </v-container>
              </template>
            </v-menu>
          </v-row>
          <v-row>
            <v-text-field
              v-model="title"
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
            @click="$router.push('/')"
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
          <v-btn
            class="btn"
            color="success"
            :disabled="btnsLoading"
            :loading="btnsLoading"
            @click="$router.push('/addCategory')"
          >
            <span>Add new</span>
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
    selectedCategory:undefined,
    title:'',
    errors:null
  }),
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    rules() {
      return this.$store.getters.getRules;
    },
    categories(){
      return this.$store.getters.getCategories;
    },
  },
  mounted() {
    this.$store.commit("setLoading", true);
    this.$store.dispatch("setCategories");
  },
  methods: {
    $_saveCategory() {
      this.btnsLoading = true;
      
      this.axios
        .post("/category/"+this.selectedCategory.id+'/save', {title: this.title})
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
        .post("/category/"+this.selectedCategory.id+'/destroy')
        .then((response) => {
          console.log(response);
          this.$router.go();
          this.btnsLoading = false;
        })
    },
    $_onCategoryClick(val) {
      this.selectedCategory = val[0];
      this.errors=null;
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
