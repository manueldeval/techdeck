//================== Browser

Vue.component('browser', {
  props: {
    id: { type: String, default: uuid() },
    url: { type: String, default: "https://default/" },
    width: { type: String, default: '650px'} ,
    height: { type: String, default: '400px' }
  },
  data: function () {
    return {
      actualUrl: ''
    }
  },
  computed: {
  },
  methods: {
    home: function(){
      this.actualUrl = this.url
      this.$refs.iframe.src = this.url 
    },
    urlChange: function(c){
      this.$refs.iframe.src = c.target.value
    }
  },
  mounted: function(){
    var self = this;
    this.actualUrl = this.url
    BUS.subscribe(this.id,'changeurl', function(url){
      self.actualUrl = url
      self.$refs.iframe.src = url
    });
  },
  template: `
    <div :style="{width:width,height:height,position: 'relative' }"> 
        <iframe ref="iframe" 
          :src="url" 
          style="max-height:100%; max-width: 100%;width:100%;height:100%" 
          frameborder="0" 
          scrolling="yes">
        </iframe>
    </div>`
})
