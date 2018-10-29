//================== Browser

Vue.component('codemirror', {
  props: {
    name: String,
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    fontSize: { type: Number, default: 16 },
    mode: { type: String, default: "yaml" },
    theme: { type: String, default: "paraiso-light" },
  },
  data: function () {
    return {
    }
  },
  computed: {
    url: function(){
      console.log("theme: "+this.theme)
      return '/code?width='+this.width+'&height='+this.height+'&mode='+this.mode+"&theme="+this.theme+"&fontSize="+this.fontSize;
    }
  },
  methods: {
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
  <div>
  <iframe ref="iframe" :src="url" :style="{width:width+'px',height:height+'px'}" frameborder="0">
  </iframe>
  </div>
  `
})
