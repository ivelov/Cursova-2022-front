<template>
  <v-container>
    <br>
    <h2>Leave comment</h2>  
    <br>
    <v-form class="new-form">
      <div class="editor-div">
        <wysiwyg v-model="commentMessage" />
      </div>
      <br>
      <v-btn 
        color="success"
        @click="$_addComment" 
        :disabled="btnsLoading"
        :loading="btnsLoading"
      >
        <span>Submit</span>
      </v-btn>
    </v-form>
    <br>
    <h2>Comments</h2>
    <br>
    <v-container v-if="loading">
        <v-text-field color="success" loading disabled></v-text-field>
      </v-container>
    <v-container v-else>
      <v-card v-for="(comment, index) in commentsInfo.comments" :key="comment.id">
        <p>
          {{comment.lastname+' '+comment.firstname}} 
          <span class="text--disabled">Created:{{comment.createdAt}} Updated:{{comment.updatedAt}}</span>
          <v-btn
            v-if="comment.canUpdate && !editing[index]"
            class="upd-btn"
            color="success"
            @click="$_changeEdit(index)" 
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Edit</span>
          </v-btn>
          <v-btn 
            v-else-if="comment.canUpdate"
            class="upd-btn"
            color="success"
            @click="$_saveComment(index)" 
            :disabled="btnsLoading"
            :loading="btnsLoading"
          >
            <span>Save</span>
          </v-btn>
        </p>
        <wysiwyg v-if="editing[index]"
        v-model="comment.text" 
      />
        <p v-else v-html="comment.text"></p>
        
      </v-card>
      
    </v-container>
  </v-container>
</template>

<script>

export default {
  name: "AppComments",

  data: function () {
    return {
      btnsLoading: false,
      commentMessage:'',
      editing:[]
    };
  },
  computed:{
    loading(){
      return this.commentsInfo.loading;
    },
    rules(){
      return this.$store.getters.getRules;
    },
    commentsInfo(){
      return this.$store.getters.getCommentsInfo;
    },
    commentsCount(){
      return this.commentsInfo.commentsCount;
    },
    canLoadMore(){
      return this.commentsInfo.maxPage > this.commentsInfo.curPage;
    },
    maxScroll(){
      return document.documentElement.scrollHeight - document.documentElement.clientHeight;
    }
  },
  props: {
    reportId: Number,
  },
  created(){
    this.editing = [];
    if(this.reportId){
      this.$store.dispatch('setComments', {id:this.reportId, page:0});
    }
    window.addEventListener('scroll', this.$_onScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.$_onScroll);
  },
  watch:{
    reportId:function (val){
      this.$store.dispatch('setComments', {id:val, page:0});
    },
    commentsCount:function (val){
      this.editing = [];
      for (let i = 0; i < val; i++) {
        this.editing.push(false);
      }
    }
  },
  methods: {
    $_addComment(){
      this.btnsLoading = true;
      
      this.axios
        .post("/report/"+this.reportId+"/addComment", {text: this.commentMessage, reportId: this.reportId})
        .then(() => {
          this.btnsLoading = false;
          this.$store.dispatch('setComments', {id:this.reportId, page:0});
        })
    },
    $_saveComment(index){
      this.btnsLoading = true;
      
      this.axios
        .post("/report/"+this.reportId+"/updateComment", {
          id: this.commentsInfo.comments[index].id, 
          text: this.commentsInfo.comments[index].text, 
        })
        .then(() => {
          this.btnsLoading = false;
          this.$_changeEdit(index);
        })
    },
    $_changeEdit(index){
      this.$set(this.editing,index,!this.editing[index]);
    },
    $_onScroll(){
      if(this.canLoadMore && window.scrollY >= this.maxScroll - 10){
        this.$store.dispatch('setComments', {id:this.reportId});
      }
        
    }
  },
};
</script>

<style scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
  .editr{
    width: 520px;
  }
  .v-card{
    padding: 5px;
    margin-top: 10px;
  }
  .editor-div{
    overflow: auto;
  }
  .upd-btn{
    margin: 5px;
  }
  .load-more{
    margin: 10px;
  }
</style>