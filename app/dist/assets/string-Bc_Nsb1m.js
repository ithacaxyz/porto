function i(n,r){/*!
String.prototype.endsWith
*/String.prototype.endsWith||Object.defineProperty(String.prototype,"endsWith",{writable:!0,configurable:!0,value:function(e,t){return(t===void 0||t>this.length)&&(t=this.length),this.substring(t-e.length,t)===e}});/*!
String.prototype.includes
*/String.prototype.includes||(String.prototype.includes=function(e,t){return typeof t!="number"&&(t=0),t+e.length>this.length?!1:this.indexOf(e,t)!==-1});/*!
String.prototype.startsWith
*/String.prototype.startsWith||Object.defineProperty(String.prototype,"startsWith",{writable:!0,configurable:!0,value:function(e,t){return this.substr(!t||0>t?0:+t,e.length)===e}})}export{i as applyPolyfill};
