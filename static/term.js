//================== TERM
const DISCONNECTED = 0;
const CONNECTING = 1;
const CONNECTED = 2;

Vue.component('term', {
  props: {
    id: { type: String, default: uuid() },
    header: {type: Boolean, default: true },
    hostId: String,
    command: String,
    autostart: { type: Boolean, default: true} ,
    width: { type: String, default: '650px' },
    height: { type: String, default: '400px' },
    label: String,
    fontSize: { type: Number, default: 16 }
  },
  data: function () {
    return {
      status: DISCONNECTED
    }
  },
  computed: {
    url: function(){
      var url = '/term?hostId='+this.hostId+
                '&startupCommand='+this.command+
                '&autoStart='+this.autostart+
                '&fontSize='+this.fontSize+
                '&busAddress='+this.id;

      console.log("url: " + url)
      return url;
    }
  },
  mounted: function(){
    var self = this;
    console.log("URL: " ,this.url)
    BUS.subscribe(self.id,"status",function(status){
      self.status = status; 
      console.log("Status changed: ",status)
    });
  },
  methods: {
    changeState: function(){
      if (this.status == CONNECTED){
        BUS.publish(this.id,"connect",false)
      } else if (this.status == DISCONNECTED){
        // Ugly hack
        this.$refs.iframe.src = this.url
        //BUS.publish(this.id,"connect",true)
      }
    }
  }, 
  template: `
    <div :style="{width:width,height:height,position: 'relative',backgroundColor:'black' }">
      <div :style="{width:width,backgroundColor:'#2b2727',fontSize:fontSize+'px'}">
        {{ label || hostId }}
        <div v-if="header" @click="changeState" style="display:block;float:right;padding-right: 3px;cursor:pointer;">
          <i  v-if="status == 2" class="fa fa-link"></i>
          <i  v-if="status == 1" class="fa fa-spinner"></i>
          <i  v-if="status == 0" class="fa fa-unlink"></i>
        </div>
      </div>
      <iframe ref="iframe" 
        :src="url" 
        style="max-height:100%; max-width: 100%;width:100%;height:100%" 
        frameborder="0" 
        scrolling="no">
      </iframe>
    </div>`
})
