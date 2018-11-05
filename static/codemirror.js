//================== Browser

Vue.component('codemirror', {
  props: {
    id: { type: String, default: uuid() },
    width: { type: String, default: '800px' },
    height: { type: String, default: '600px' },
    fontSize: { type: Number, default: 16 },
    mode: { type: String, default: "yaml" },
    theme: { type: String, default: "paraiso-light" },
    label:  String,
    header: {type: Boolean, default: true },
    hostId: { type: String, default: null },
    fileName: { type: String, default: null }
  },
  data: function () {
    return {
      copying: false
    }
  },
  computed: {
    url: function(){
      var newUrl = '/code?mode='+this.mode+"&theme="+this.theme+"&fontSize="+this.fontSize;
      console.log("newUrl: "+newUrl)
      return newUrl;
    },
    canCopyRemote: function(){
      console.log(this.hostId ,this.fileName,this.hostId && this.fileName)
      return this.hostId && this.fileName
    }
  },
  methods: {
    copy: function(){
      var content = this.$refs.iframe.contentWindow.editor.getValue();
      this.copying = true
      var self = this;
      copyFileToRemote(this.hostId,this.fileName,content,function(){
        console.log("COPY done.");
        self.copying = false
      })
    }
  },
  mounted: function(){
    if (!(this.$slots.default && 
        this.$slots.default[0] && 
        this.$slots.default[0].children && 
        this.$slots.default[0].children[0].text)){
      console.error("The codemirror tag must contain a textarea tag inside it.")
    } else {
      var value = this.$slots.default[0].children[0].text;
      var self = this;
      this.$refs.iframe.contentWindow.onload = function(){
        self.$refs.iframe.contentWindow.editor.setValue(value)
      }
    }
  },
  template: `
  <div :style="{width:width,height:height,position: 'relative' }"> 
    <div v-if="header"  :style="{width:width,backgroundColor:'#2b2727',fontSize:fontSize+'px'}">
      {{ label || mode }}
      <div v-if="canCopyRemote" @click="copy" style="display:block;float:right;padding-right: 3px;cursor:pointer;">
        <i v-if="!copying" class="fa fa-download"></i>
        <i v-if="copying" class="fa fa-spinner"></i>
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

