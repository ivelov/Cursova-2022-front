<template>
  <p>
    Time to start:
    <span v-if="days > 0">{{days}} Day(s) </span>
    <span v-if="hours > 0">{{hours}} Hour(s) </span>
    <span v-if="minutes > 0">{{minutes}} Minute(s) </span>
    <span>{{seconds}} Second(s) </span>
  </p>
</template>

<script>

export default {
  name: "AppTimer",

  data() {
    return {
      remainingTime:50,
      days:0,
      hours:0,
      minutes:0,
      seconds:50,
      end: false,
    };
  },
  props: {
    remainingTimeOriginal: Number,
  },
  created(){
    this.remainingTime = this.remainingTimeOriginal;
    this.$_timeDown();
  },
  destroyed(){
    this.end = true;
  },
  methods: {
    $_timeDown(){
      if(this.end){
        return;
      }
      this.remainingTime--;
      if(this.remainingTime <= 0){
        this.$emit('end');
        return;
      }
      let timeBuf = this.remainingTime;

      this.days = Math.floor(timeBuf/86400);
      timeBuf -= this.days * 86400;
      
      this.hours = Math.floor(timeBuf/3600);
      timeBuf -= this.hours * 3600;

      this.minutes = Math.floor(timeBuf/60);
      timeBuf -= this.minutes * 60;

      this.seconds =  Math.floor(timeBuf);

      setTimeout(() => {
        this.$_timeDown();
      }, 1000); 
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