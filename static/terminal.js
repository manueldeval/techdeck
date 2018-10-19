//================== TERM
const DISCONNECTED = 0;
const CONNECTING = 1;
const CONNECTED = 2;

Vue.component('terminal', {
  props: {
    id: String,
    name: String,
    command: String,
    autostart: { type: Boolean, default: true} ,
    width: { type: Number, default: 650 },
    height: { type: Number, default: 400 },
    label: String,
  },
  data: function () {
    return {
      state: DISCONNECTED,
      term: null,
      socket: null
    }
  },
  computed: {
    headerLabel: function(){
      if (this.label){
        return this.label
      } else {
        return this.id
      }
    },
    plugClass: function(){
      if (this.state == DISCONNECTED){
        return ['fa','fa-unlink']
      }
      if (this.state == CONNECTING){
        return ['fa','fa-spinner']
      }
      if (this.state == CONNECTED){
        return ['fa','fa-link']
      }
      return []
    }
  },
  methods: {
    disconnect: function(){
      if (this.socket){
        this.socket.disconnect()
      }
    },
    connect: function(){
      var self = this;

      var socket = socket = io.connect({ query: { id:self.id } })
      self.socket = socket;
      self.state = CONNECTING
      socket.on('connect', function() {
        console.log("CONNECTED!")
        var firstDataReceived = true;
        self.term.on('data', function(data) { 
          socket.emit('data', data); 
        })
        socket.on('data', function(data) { 
          self.state = CONNECTED
          self.term.write(data);
          if (firstDataReceived && self.command){
            firstDataReceived = false;
            self.term.emit('data',self.command+"\n")
          } 
        });
        socket.on('disconnect', function() {
          console.log("IO Disconnected! ")
          self.state = DISCONNECTED
        });
      });
    },
    changeState: function(){
      if (this.state == DISCONNECTED){
        this.connect()
      } else {
        this.disconnect()
      }
    }
  },
  mounted: function(){
    Terminal.applyAddon(fit);
    var self = this;
    this.$nextTick(function () {
      terminalContainer = self.$refs.theterm
      console.log("MOUNTED, about to launch terminal",terminalContainer,{ id: self.id })
      self.term = new Terminal({ 
        cursorBlink: true, 
        //cols: 80,
        //rows: 25,
        lineHeight:0,
        fontSize: 14,
        cursorStyle: 'underline',
        fontFamily: 'Ubuntu Mono, courier-new, courier, monospace',
        rendererType: 'dom'
      });
      self.term.open(terminalContainer);
      self.term.fit();
      if (self.autostart){
        self.connect()
      }
    })
    EventBus.$on('term:'+this.name, function(command){
      if (self.state == CONNECTED){
        self.term.emit('data',command+"\n")
      }
    });
  },
  template: `
    <div class="shell-wrap" :style="{width:width+'px',height:(height+20)+'px'}">
      <div class="shell-top-bar" style="text-align: center;">
      <div class="shell-top-title">{{headerLabel}}</div>
        <div class="shell-top-icon">
          <i :class="plugClass" style="fontSize:12px" v-on:click="changeState"></i>
        </div>
      </div>
      <div id="xterm" class="xterm" ref="theterm" :style="{width:width+'px',height:height+'px'}"></div>
    </div>`
})