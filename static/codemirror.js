//================== Browser

Vue.component('codemirror', {
  props: {
    name: String,
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 }
  },
  data: function () {
    return {
    }
  },
  computed: {
    url: function(){
      return '/code?width='+this.width+'&height='+this.height;
    }
  },
  methods: {
  },
  mounted: function(){
    var value = this.$slots.default ? this.$slots.default[0].text : '';
    console.log(value)
    var self = this;
    this.$refs.iframe.contentWindow.onload = function(){
      self.$refs.iframe.contentWindow.editor.setValue(value)
    }
    //
  },
  template: `
  <div>
  <iframe ref="iframe" :src="url" :style="{width:width+'px',height:height+'px'}" frameborder="0">
  </iframe>
  </div>
  `
})
