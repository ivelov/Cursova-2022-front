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
            <v-text-field
              v-model="title"
              label="Title"
              outlined
              :rules="[rules.required, rules.counterMax]"
            >
            </v-text-field>
          </v-row>
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
                  label="Parent category"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <template>
                <v-treeview
                  @update:active="(v)=>{selectedCategory = v[0]}"
                  activatable
                  return-object
                  :items="categories"
                ></v-treeview>
              </template>
            </v-menu>
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
        </v-container>
      </v-form>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
export default {
  name: "AppCategoryAdd",

  data: () => ({
    valid: false,
    catMenu:false,
    btnsLoading: false,
    buttons: {
      back: true,
    },
    selectedCategory:undefined,
    title:''
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
    this.$store.dispatch("setCategories");
  },
  methods: {
    $_saveCategory() {
      this.btnsLoading = true;
      
      this.axios
        .post("/addCategory", {title: this.title, parentId: this.selectedCategory ? this.selectedCategory.id : null})
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
