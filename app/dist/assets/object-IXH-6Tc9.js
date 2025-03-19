function f(l,u){/*!
Object.assign
*/typeof Object.assign!="function"&&Object.defineProperty(Object,"assign",{value:function(n,r){if(n==null)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(n),t=1;t<arguments.length;t++){var o=arguments[t];if(o!=null)for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i])}return e},writable:!0,configurable:!0});/*!
Object.entries
*/Object.entries||(Object.entries=function(n){for(var r=Object.keys(n),e=r.length,t=Array(e);e--;)t[e]=[r[e],n[r[e]]];return t})}export{f as applyPolyfill};
