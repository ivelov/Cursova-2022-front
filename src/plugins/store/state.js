
export default {
    currentConferenceData: {
        conference: {
          id: null,
          title: "",
          category_id:null,
          country: "",
          date: "",
          time: "",
          latitude: 0,
          longitude: 0,
        },
        participant: false,
        canUpdate: false,
      },
      conferencesPageInfo: {
          maxPage:1,
      },
      loading: true,
      currentReportData:{
        report:{
          id:null,
          conferenceId:null,
          title:'',
          description:'',
          startTime:'',
          endTime:'',
          presentation:null,
          isOnline:false,
        },
        canUpdate:false,
        busyStartTimes:[],
        busyEndTimes:[],
        confStartTime:'07:00'
      },
      reportsPageInfo: {
        reports:[],
        maxPage:1,
      },
      commentsInfo:{
        comments:[],
        maxPage:1,
        curPage:0,
        loading:false
      },
      categories:[],
      categoriesList:[],
      filters:{},
      pusher:undefined,
      channel:undefined,
      channelLoading: false,
      meetingsPageInfo:{
        meetings:{},
        maxPage:1
      },
      currentPlan: 'default',
      intent:undefined,
  };