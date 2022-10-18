<template>
  <div>
    <br>
    <h2>Leave comment</h2>
    <br>
    <v-form v-model="valid">
      <wysiwyg v-model="commentMessage" 
        :rules="[rules.required]"
      />
      <v-btn 
        color="success"
        @click="$_saveComment" 
        :disabled="!valid || btnsLoading"
        :loading="btnsLoading"
      >
        <span>Submit</span>
      </v-btn>
    </v-form>
    <br>
    <h2>Comments</h2>
    <br>
    <v-container>
      <div v-for="comment in comments" :key="comment.id">
        <p>{{comment.username}} <span class="text--disabled">Created:{{comment.created}} Updated:{{comment.updated}}</span></p>
        <wysiwyg 
        :disabled="!comment.isEditing"
        v-model="comment.text" 
        :rules="[rules.required]"
      />
        <p>{{comment.text}}</p>

      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "AppComments",

  data: function () {
    return {
      valid:false,
      btnsLoading: false,
      commentMessage:''
    };
  },
  computed:{
    loading(){
      return this.$store.getters.isLoading;
    },
    rules(){
      return this.$store.getters.getRules;
    },
    comments(){
      return this.$store.getters.getComments;
    },
  },
  props: {
    reportId: Object,
  },

  methods: {
    $_saveComment(){
      this.btnsLoading = true;

      this.axios
        .post("/report/"+this.reportId+"/addComment", this.commentMessage)
        .then(() => {
          this.btnsLoading = false;
        })
        .catch((e) => {
          console.error(e);
        });
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
</style>