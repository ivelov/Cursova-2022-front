<template>
  <div>
    <AppHeader :buttons="buttons"></AppHeader>

    <v-main>
      <br /><br />
      <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
      <v-container>
        <h2>Select category</h2>
        <br>
        <br /><br />
        <v-card class="white">
          <v-treeview
          @update:active="$_onCategoryClick"
          activatable
          return-object
          :items="categories"
        ></v-treeview>
        </v-card>
        <br /><br />
        <v-btn
          class="btn"
          color="success"
          @click="$router.push('/addCategory')"
        >
          <span>Add new</span>
        </v-btn>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
export default {
  name: "AppCategories",

  data: () => ({
    buttons: {
      back: true,
    },
  }),
  computed: {
    loading() {
      return this.$store.getters.isLoading;
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
    $_onCategoryClick(val) {
      this.$router.push('/editCategory/'+val[0].id)
    },
  },
  components: { AppHeader },
};
</script>

<style scoped>


</style>
