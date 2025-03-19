function S(A,j){/*!
whatwg-fetch, 2.0.3
https://github.com/github/fetch
Copyright (c) 2014-2016 GitHub, Inc. - MIT License
*/(function(a){function d(t){if(typeof t!="string"&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function b(t){return typeof t!="string"&&(t=String(t)),t}function p(t){var e={next:function(){var r=t.shift();return{done:r===void 0,value:r}}};return s.iterable&&(e[Symbol.iterator]=function(){return e}),e}function o(t){this.map={},t instanceof o?t.forEach(function(e,r){this.append(r,e)},this):Array.isArray(t)?t.forEach(function(e){this.append(e[0],e[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function c(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function m(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function B(t){var e=new FileReader,r=m(e);return e.readAsArrayBuffer(t),r}function _(t){t=new Uint8Array(t);for(var e=Array(t.length),r=0;r<t.length;r++)e[r]=String.fromCharCode(t[r]);return e.join("")}function w(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function v(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t)if(typeof t=="string")this._bodyText=t;else if(s.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(s.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(s.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(s.arrayBuffer&&s.blob&&U(t))this._bodyArrayBuffer=w(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else if(s.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(t)||O(t)))this._bodyArrayBuffer=w(t);else throw Error("unsupported BodyInit type");else this._bodyText="";this.headers.get("content-type")||(typeof t=="string"?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):s.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},s.blob&&(this.blob=function(){var t=c(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?c(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(B)}),this.text=function(){var t=c(this);if(t)return t;if(this._bodyBlob){t=this._bodyBlob;var e=new FileReader,r=m(e);return e.readAsText(t),r}if(this._bodyArrayBuffer)return Promise.resolve(_(this._bodyArrayBuffer));if(this._bodyFormData)throw Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},s.formData&&(this.formData=function(){return this.text().then(T)}),this.json=function(){return this.text().then(JSON.parse)},this}function h(t,e){e=e||{};var r=e.body;if(t instanceof h){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new o(t.headers)),this.method=t.method,this.mode=t.mode,r||t._bodyInit==null||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);this.credentials=e.credentials||this.credentials||"omit",(e.headers||!this.headers)&&(this.headers=new o(e.headers));var i=e.method||this.method||"GET",f=i.toUpperCase();if(this.method=-1<R.indexOf(f)?f:i,this.mode=e.mode||this.mode||null,this.referrer=null,(this.method==="GET"||this.method==="HEAD")&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function T(t){var e=new FormData;return t.trim().split("&").forEach(function(r){if(r){var i=r.split("=");r=i.shift().replace(/\+/g," "),i=i.join("=").replace(/\+/g," "),e.append(decodeURIComponent(r),decodeURIComponent(i))}}),e}function E(t){var e=new o;return t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(r){var i=r.split(":");(r=i.shift().trim())&&(i=i.join(":").trim(),e.append(r,i))}),e}function u(t,e){e||(e={}),this.type="default",this.status=e.status===void 0?200:e.status,this.ok=200<=this.status&&300>this.status,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new o(e.headers),this.url=e.url||"",this._initBody(t)}if(!a.fetch){var P="Symbol"in a&&"iterator"in Symbol,l;if(l="FileReader"in a&&"Blob"in a)try{new Blob,l=!0}catch{l=!1}var s={searchParams:"URLSearchParams"in a,iterable:P,blob:l,formData:"FormData"in a,arrayBuffer:"ArrayBuffer"in a};if(s.arrayBuffer)var x="[object Int8Array];[object Uint8Array];[object Uint8ClampedArray];[object Int16Array];[object Uint16Array];[object Int32Array];[object Uint32Array];[object Float32Array];[object Float64Array]".split(";"),U=function(t){return t&&DataView.prototype.isPrototypeOf(t)},O=ArrayBuffer.isView||function(t){return t&&-1<x.indexOf(Object.prototype.toString.call(t))};o.prototype.append=function(t,e){t=d(t),e=b(e);var r=this.map[t];this.map[t]=r?r+","+e:e},o.prototype.delete=function(t){delete this.map[d(t)]},o.prototype.get=function(t){return t=d(t),this.has(t)?this.map[t]:null},o.prototype.has=function(t){return this.map.hasOwnProperty(d(t))},o.prototype.set=function(t,e){this.map[d(t)]=b(e)},o.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},o.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),p(t)},o.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),p(t)},o.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),p(t)},s.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var R="DELETE GET HEAD OPTIONS POST PUT".split(" ");h.prototype.clone=function(){return new h(this,{body:this._bodyInit})},v.call(h.prototype),v.call(u.prototype),u.prototype.clone=function(){return new u(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},u.error=function(){var t=new u(null,{status:0,statusText:""});return t.type="error",t};var D=[301,302,303,307,308];u.redirect=function(t,e){if(D.indexOf(e)===-1)throw new RangeError("Invalid status code");return new u(null,{status:e,headers:{location:t}})},a.Headers=o,a.Request=h,a.Response=u,a.fetch=function(t,e){return new Promise(function(r,i){var f=new h(t,e),n=new XMLHttpRequest;n.onload=function(){var y={status:n.status,statusText:n.statusText,headers:E(n.getAllResponseHeaders()||"")};y.url="responseURL"in n?n.responseURL:y.headers.get("X-Request-URL"),r(new u("response"in n?n.response:n.responseText,y))},n.onerror=function(){i(new TypeError("Network request failed"))},n.ontimeout=function(){i(new TypeError("Network request failed"))},n.open(f.method,f.url,!0),f.credentials==="include"?n.withCredentials=!0:f.credentials==="omit"&&(n.withCredentials=!1),"responseType"in n&&s.blob&&(n.responseType="blob"),f.headers.forEach(function(y,I){n.setRequestHeader(I,y)}),n.send(typeof f._bodyInit>"u"?null:f._bodyInit)})},a.fetch.polyfill=!0}})(typeof self<"u"?self:A)}export{S as applyPolyfill};
