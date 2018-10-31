
// Search for parent window (outside)...
if (window.parent != window) {
  if (window.parent.BUS){
    window.BUS = window.parent.BUS;
    console.log("Attached to parent BUS.")
  } else {
    console.log("No parent bus detected.")
  }
} else {
  console.log("New bus created.")
  window.BUS = {
    bus: new Vue(),
    publish: function(address,key,value){
      this.bus.$emit(address+"|"+key,value);
    },
    subscribe: function(address,key,callback){
      this.bus.$on(address+"|"+key,callback);
    },
    unsubscribe: function(address,key,callback){
      this.bus.$off(address+"|"+key,callback);
    } 
  }
}
