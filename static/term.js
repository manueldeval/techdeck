//================== TERM
const DISCONNECTED = 0;
const CONNECTING = 1;
const CONNECTED = 2;

Vue.component('term', {
  props: {
    id: { type: String, default: uuid() },
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
  template: `
    <div :style="{width:width,height:height,position: 'relative' }">
      <iframe ref="iframe" 
        :src="url" 
        style="max-height:100%; max-width: 100%;width:100%;height:100%" 
        frameborder="0" 
        scrolling="no">
      </iframe>
    </div>`
})
