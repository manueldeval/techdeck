//================== Browser

Vue.component('browser', {
  props: {
    name: String,
    url: { type: String, default: "https://default/" },
    width: { type: Number, default: 650 },
    height: { type: Number, default: 400 }
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
    EventBus.$on('browser:'+this.name, function(url){
      self.actualUrl = url
      self.$refs.iframe.src = url
    });
  },
  template: `
    <div class="shell-wrap" :style="{width:width+'px',height:(height+20)+'px'}">
      <div class="shell-top-bar" style="text-align: center;">
      <div class="shell-top-title">Url:&nbsp</div>
        <input type="text" @change="urlChange" v-model="actualUrl" class="shell-url-input" :style="{width:(width-80)+'px'}"></input>
        <div class="shell-top-icon" v-on:click="home">
          <i class="fa fa-home" style="fontSize:12px"></i>
        </div>
      </div>
      <div style="width:100%;height:100%;position: relative;overflow: hidden;">
        <iframe 
          onload="console.log('Done func');" onerror="console.log('failed function');"
          ref="iframe"
          :style="{width:'100%',height:(height-5)+'px'}"
          frameborder="0"
          title="La page Wikipédia consacrée à Robert Louis Stevenson" 
          :src="url">
        </iframe>
      </div>

    </div>`
})
