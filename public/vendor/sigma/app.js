var el=Object.create;var yr=Object.defineProperty;var tl=Object.getOwnPropertyDescriptor;var nl=Object.getOwnPropertyNames;var al=Object.getPrototypeOf,rl=Object.prototype.hasOwnProperty;var ua=(n,a)=>()=>(a||n((a={exports:{}}).exports,a),a.exports);var il=(n,a,t,e)=>{if(a&&typeof a=="object"||typeof a=="function")for(let r of nl(a))!rl.call(n,r)&&r!==t&&yr(n,r,{get:()=>a[r],enumerable:!(e=tl(a,r))||e.enumerable});return n};var Re=(n,a,t)=>(t=n!=null?el(al(n)):{},il(a||!n||!n.__esModule?yr(t,"default",{value:n,enumerable:!0}):t,n));var Xe=ua((cf,ma)=>{"use strict";var ot=typeof Reflect=="object"?Reflect:null,wr=ot&&typeof ot.apply=="function"?ot.apply:function(a,t,e){return Function.prototype.apply.call(a,t,e)},pn;ot&&typeof ot.ownKeys=="function"?pn=ot.ownKeys:Object.getOwnPropertySymbols?pn=function(a){return Object.getOwnPropertyNames(a).concat(Object.getOwnPropertySymbols(a))}:pn=function(a){return Object.getOwnPropertyNames(a)};function ml(n){console&&console.warn&&console.warn(n)}var Lr=Number.isNaN||function(a){return a!==a};function J(){J.init.call(this)}ma.exports=J;ma.exports.once=_l;J.EventEmitter=J;J.prototype._events=void 0;J.prototype._eventsCount=0;J.prototype._maxListeners=void 0;var Cr=10;function vn(n){if(typeof n!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n)}Object.defineProperty(J,"defaultMaxListeners",{enumerable:!0,get:function(){return Cr},set:function(n){if(typeof n!="number"||n<0||Lr(n))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+n+".");Cr=n}});J.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};J.prototype.setMaxListeners=function(a){if(typeof a!="number"||a<0||Lr(a))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+a+".");return this._maxListeners=a,this};function Pr(n){return n._maxListeners===void 0?J.defaultMaxListeners:n._maxListeners}J.prototype.getMaxListeners=function(){return Pr(this)};J.prototype.emit=function(a){for(var t=[],e=1;e<arguments.length;e++)t.push(arguments[e]);var r=a==="error",i=this._events;if(i!==void 0)r=r&&i.error===void 0;else if(!r)return!1;if(r){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=i[a];if(l===void 0)return!1;if(typeof l=="function")wr(l,this,t);else for(var u=l.length,d=Gr(l,u),e=0;e<u;++e)wr(d[e],this,t);return!0};function Fr(n,a,t,e){var r,i,o;if(vn(t),i=n._events,i===void 0?(i=n._events=Object.create(null),n._eventsCount=0):(i.newListener!==void 0&&(n.emit("newListener",a,t.listener?t.listener:t),i=n._events),o=i[a]),o===void 0)o=i[a]=t,++n._eventsCount;else if(typeof o=="function"?o=i[a]=e?[t,o]:[o,t]:e?o.unshift(t):o.push(t),r=Pr(n),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(a)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=n,s.type=a,s.count=o.length,ml(s)}return n}J.prototype.addListener=function(a,t){return Fr(this,a,t,!1)};J.prototype.on=J.prototype.addListener;J.prototype.prependListener=function(a,t){return Fr(this,a,t,!0)};function bl(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function kr(n,a,t){var e={fired:!1,wrapFn:void 0,target:n,type:a,listener:t},r=bl.bind(e);return r.listener=t,e.wrapFn=r,r}J.prototype.once=function(a,t){return vn(t),this.on(a,kr(this,a,t)),this};J.prototype.prependOnceListener=function(a,t){return vn(t),this.prependListener(a,kr(this,a,t)),this};J.prototype.removeListener=function(a,t){var e,r,i,o,s;if(vn(t),r=this._events,r===void 0)return this;if(e=r[a],e===void 0)return this;if(e===t||e.listener===t)--this._eventsCount===0?this._events=Object.create(null):(delete r[a],r.removeListener&&this.emit("removeListener",a,e.listener||t));else if(typeof e!="function"){for(i=-1,o=e.length-1;o>=0;o--)if(e[o]===t||e[o].listener===t){s=e[o].listener,i=o;break}if(i<0)return this;i===0?e.shift():yl(e,i),e.length===1&&(r[a]=e[0]),r.removeListener!==void 0&&this.emit("removeListener",a,s||t)}return this};J.prototype.off=J.prototype.removeListener;J.prototype.removeAllListeners=function(a){var t,e,r;if(e=this._events,e===void 0)return this;if(e.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):e[a]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete e[a]),this;if(arguments.length===0){var i=Object.keys(e),o;for(r=0;r<i.length;++r)o=i[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(t=e[a],typeof t=="function")this.removeListener(a,t);else if(t!==void 0)for(r=t.length-1;r>=0;r--)this.removeListener(a,t[r]);return this};function Ir(n,a,t){var e=n._events;if(e===void 0)return[];var r=e[a];return r===void 0?[]:typeof r=="function"?t?[r.listener||r]:[r]:t?xl(r):Gr(r,r.length)}J.prototype.listeners=function(a){return Ir(this,a,!0)};J.prototype.rawListeners=function(a){return Ir(this,a,!1)};J.listenerCount=function(n,a){return typeof n.listenerCount=="function"?n.listenerCount(a):Nr.call(n,a)};J.prototype.listenerCount=Nr;function Nr(n){var a=this._events;if(a!==void 0){var t=a[n];if(typeof t=="function")return 1;if(t!==void 0)return t.length}return 0}J.prototype.eventNames=function(){return this._eventsCount>0?pn(this._events):[]};function Gr(n,a){for(var t=new Array(a),e=0;e<a;++e)t[e]=n[e];return t}function yl(n,a){for(;a+1<n.length;a++)n[a]=n[a+1];n.pop()}function xl(n){for(var a=new Array(n.length),t=0;t<a.length;++t)a[t]=n[t].listener||n[t];return a}function _l(n,a){return new Promise(function(t,e){function r(o){n.removeListener(a,i),e(o)}function i(){typeof n.removeListener=="function"&&n.removeListener("error",r),t([].slice.call(arguments))}zr(n,a,i,{once:!0}),a!=="error"&&Tl(n,r,{once:!0})})}function Tl(n,a,t){typeof n.on=="function"&&zr(n,"error",a,t)}function zr(n,a,t,e){if(typeof n.on=="function")e.once?n.once(a,t):n.on(a,t);else if(typeof n.addEventListener=="function")n.addEventListener(a,function r(i){e.once&&n.removeEventListener(a,r),t(i)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof n)}});var zt=ua((_f,ai)=>{ai.exports=function(a){return a!==null&&typeof a=="object"&&typeof a.addUndirectedEdgeWithKey=="function"&&typeof a.dropNode=="function"&&typeof a.multi=="boolean"}});var Yo=ua(ar=>{var qo=zt();function oc(n,a){if(!qo(n))throw new Error("graphology-metrics/extent: the given graph is not a valid graphology instance.");var t=[].concat(a),e,r,i,o={};for(i=0;i<t.length;i++)r=t[i],o[r]=[1/0,-1/0];return n.forEachNode(function(s,l){for(i=0;i<t.length;i++)r=t[i],e=l[r],e<o[r][0]&&(o[r][0]=e),e>o[r][1]&&(o[r][1]=e)}),typeof a=="string"?o[a]:o}function sc(n,a){if(!qo(n))throw new Error("graphology-metrics/extent: the given graph is not a valid graphology instance.");var t=[].concat(a),e,r,i,o={};for(i=0;i<t.length;i++)r=t[i],o[r]=[1/0,-1/0];return n.forEachEdge(function(s,l){for(i=0;i<t.length;i++)r=t[i],e=l[r],e<o[r][0]&&(o[r][0]=e),e>o[r][1]&&(o[r][1]=e)}),typeof a=="string"?o[a]:o}ar.nodeExtent=oc;ar.edgeExtent=sc});function un(n,a){(a==null||a>n.length)&&(a=n.length);for(var t=0,e=Array(a);t<a;t++)e[t]=n[t];return e}function dn(n,a){if(n){if(typeof n=="string")return un(n,a);var t={}.toString.call(n).slice(8,-1);return t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set"?Array.from(n):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?un(n,a):void 0}}function ol(n){if(Array.isArray(n))return n}function sl(n,a){var t=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(t!=null){var e,r,i,o,s=[],l=!0,u=!1;try{if(i=(t=t.call(n)).next,a===0){if(Object(t)!==t)return;l=!1}else for(;!(l=(e=i.call(t)).done)&&(s.push(e.value),s.length!==a);l=!0);}catch(d){u=!0,r=d}finally{try{if(!l&&t.return!=null&&(o=t.return(),Object(o)!==o))return}finally{if(u)throw r}}return s}}function ll(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Q(n,a){return ol(n)||sl(n,a)||dn(n,a)||ll()}function M(n,a){var t=typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(!t){if(Array.isArray(n)||(t=dn(n))||a&&n&&typeof n.length=="number"){t&&(n=t);var e=0,r=function(){};return{s:r,n:function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,s=!1;return{s:function(){t=t.call(n)},n:function(){var l=t.next();return o=l.done,l},e:function(l){s=!0,i=l},f:function(){try{o||t.return==null||t.return()}finally{if(s)throw i}}}}function ce(){return Float32Array.of(1,0,0,0,1,0,0,0,1)}function Ct(n,a,t){return n[0]=a,n[4]=typeof t=="number"?t:a,n}function da(n,a){var t=Math.sin(a),e=Math.cos(a);return n[0]=e,n[1]=t,n[3]=-t,n[4]=e,n}function ca(n,a,t){return n[6]=a,n[7]=t,n}function Fe(n,a){var t=n[0],e=n[1],r=n[2],i=n[3],o=n[4],s=n[5],l=n[6],u=n[7],d=n[8],c=a[0],f=a[1],h=a[2],p=a[3],b=a[4],v=a[5],g=a[6],m=a[7],y=a[8];return n[0]=c*t+f*i+h*l,n[1]=c*e+f*o+h*u,n[2]=c*r+f*s+h*d,n[3]=p*t+b*i+v*l,n[4]=p*e+b*o+v*u,n[5]=p*r+b*s+v*d,n[6]=g*t+m*i+y*l,n[7]=g*e+m*o+y*u,n[8]=g*r+m*s+y*d,n}function cn(n,a){var t=Math.cos(a),e=Math.sin(a);return{x:t*n.x+e*n.y,y:-e*n.x+t*n.y}}function $e(n,a){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:1,e=n[0],r=n[1],i=n[3],o=n[4],s=n[6],l=n[7],u=a.x,d=a.y;return{x:u*e+d*i+s*t,y:u*r+d*o+l*t}}function xr(n,a){var t=n.height/n.width,e=a.height/a.width;return t<1&&e>1||t>1&&e<1?1:Math.min(Math.max(e,1/e),Math.max(1/t,t))}function ke(n,a,t,e,r){var i=n.angle,o=n.ratio,s=n.x,l=n.y,u=a.width,d=a.height,c=ce(),f=Math.min(u,d)-2*e,h=xr(a,t);return r?(Fe(c,ca(ce(),s,l)),Fe(c,Ct(ce(),o)),Fe(c,da(ce(),i)),Fe(c,Ct(ce(),u/f/2/h,d/f/2/h))):(Fe(c,Ct(ce(),2*(f/u)*h,2*(f/d)*h)),Fe(c,da(ce(),-i)),Fe(c,Ct(ce(),1/o)),Fe(c,ca(ce(),-s,-l))),c}function ha(n,a,t){var e=$e(n,{x:Math.cos(a.angle),y:Math.sin(a.angle)},0),r=e.x,i=e.y;return 1/Math.sqrt(Math.pow(r,2)+Math.pow(i,2))/t.width}function hn(n,a,t,e,r){var i=Math.floor(a/r*e),o=Math.floor(n.drawingBufferHeight/r-t/r*e);return[i,o]}var rt={black:"#000000",silver:"#C0C0C0",gray:"#808080",grey:"#808080",white:"#FFFFFF",maroon:"#800000",red:"#FF0000",purple:"#800080",fuchsia:"#FF00FF",green:"#008000",lime:"#00FF00",olive:"#808000",yellow:"#FFFF00",navy:"#000080",blue:"#0000FF",teal:"#008080",aqua:"#00FFFF",darkblue:"#00008B",mediumblue:"#0000CD",darkgreen:"#006400",darkcyan:"#008B8B",deepskyblue:"#00BFFF",darkturquoise:"#00CED1",mediumspringgreen:"#00FA9A",springgreen:"#00FF7F",cyan:"#00FFFF",midnightblue:"#191970",dodgerblue:"#1E90FF",lightseagreen:"#20B2AA",forestgreen:"#228B22",seagreen:"#2E8B57",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",limegreen:"#32CD32",mediumseagreen:"#3CB371",turquoise:"#40E0D0",royalblue:"#4169E1",steelblue:"#4682B4",darkslateblue:"#483D8B",mediumturquoise:"#48D1CC",indigo:"#4B0082",darkolivegreen:"#556B2F",cadetblue:"#5F9EA0",cornflowerblue:"#6495ED",rebeccapurple:"#663399",mediumaquamarine:"#66CDAA",dimgray:"#696969",dimgrey:"#696969",slateblue:"#6A5ACD",olivedrab:"#6B8E23",slategray:"#708090",slategrey:"#708090",lightslategray:"#778899",lightslategrey:"#778899",mediumslateblue:"#7B68EE",lawngreen:"#7CFC00",chartreuse:"#7FFF00",aquamarine:"#7FFFD4",skyblue:"#87CEEB",lightskyblue:"#87CEFA",blueviolet:"#8A2BE2",darkred:"#8B0000",darkmagenta:"#8B008B",saddlebrown:"#8B4513",darkseagreen:"#8FBC8F",lightgreen:"#90EE90",mediumpurple:"#9370DB",darkviolet:"#9400D3",palegreen:"#98FB98",darkorchid:"#9932CC",yellowgreen:"#9ACD32",sienna:"#A0522D",brown:"#A52A2A",darkgray:"#A9A9A9",darkgrey:"#A9A9A9",lightblue:"#ADD8E6",greenyellow:"#ADFF2F",paleturquoise:"#AFEEEE",lightsteelblue:"#B0C4DE",powderblue:"#B0E0E6",firebrick:"#B22222",darkgoldenrod:"#B8860B",mediumorchid:"#BA55D3",rosybrown:"#BC8F8F",darkkhaki:"#BDB76B",mediumvioletred:"#C71585",indianred:"#CD5C5C",peru:"#CD853F",chocolate:"#D2691E",tan:"#D2B48C",lightgray:"#D3D3D3",lightgrey:"#D3D3D3",thistle:"#D8BFD8",orchid:"#DA70D6",goldenrod:"#DAA520",palevioletred:"#DB7093",crimson:"#DC143C",gainsboro:"#DCDCDC",plum:"#DDA0DD",burlywood:"#DEB887",lightcyan:"#E0FFFF",lavender:"#E6E6FA",darksalmon:"#E9967A",violet:"#EE82EE",palegoldenrod:"#EEE8AA",lightcoral:"#F08080",khaki:"#F0E68C",aliceblue:"#F0F8FF",honeydew:"#F0FFF0",azure:"#F0FFFF",sandybrown:"#F4A460",wheat:"#F5DEB3",beige:"#F5F5DC",whitesmoke:"#F5F5F5",mintcream:"#F5FFFA",ghostwhite:"#F8F8FF",salmon:"#FA8072",antiquewhite:"#FAEBD7",linen:"#FAF0E6",lightgoldenrodyellow:"#FAFAD2",oldlace:"#FDF5E6",magenta:"#FF00FF",deeppink:"#FF1493",orangered:"#FF4500",tomato:"#FF6347",hotpink:"#FF69B4",coral:"#FF7F50",darkorange:"#FF8C00",lightsalmon:"#FFA07A",orange:"#FFA500",lightpink:"#FFB6C1",pink:"#FFC0CB",gold:"#FFD700",peachpuff:"#FFDAB9",navajowhite:"#FFDEAD",moccasin:"#FFE4B5",bisque:"#FFE4C4",mistyrose:"#FFE4E1",blanchedalmond:"#FFEBCD",papayawhip:"#FFEFD5",lavenderblush:"#FFF0F5",seashell:"#FFF5EE",cornsilk:"#FFF8DC",lemonchiffon:"#FFFACD",floralwhite:"#FFFAF0",snow:"#FFFAFA",lightyellow:"#FFFFE0",ivory:"#FFFFF0"},_r=new Int8Array(4),ln=new Int32Array(_r.buffer,0,1),Tr=new Float32Array(_r.buffer,0,1),ul=/^\s*rgba?\s*\(/,dl=/^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;function Lt(n){var a=0,t=0,e=0,r=1,i=n.toLowerCase();if(i==="transparent")return{r:0,g:0,b:0,a:0};if(i in rt)return Lt(rt[i]);if(n[0]==="#")n.length===4?(a=parseInt(n.charAt(1)+n.charAt(1),16),t=parseInt(n.charAt(2)+n.charAt(2),16),e=parseInt(n.charAt(3)+n.charAt(3),16)):(a=parseInt(n.charAt(1)+n.charAt(2),16),t=parseInt(n.charAt(3)+n.charAt(4),16),e=parseInt(n.charAt(5)+n.charAt(6),16)),n.length===9&&(r=parseInt(n.charAt(7)+n.charAt(8),16)/255);else if(ul.test(n)){var o=n.match(dl);o&&(a=+o[1],t=+o[2],e=+o[3],o[4]&&(r=+o[4]))}return{r:a,g:t,b:e,a:r}}function Pt(n){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=Lt(n),e=t.r,r=t.g,i=t.b,o=t.a;return a?[e/255*o,r/255*o,i/255*o,o]:[e/255,r/255,i/255,o]}var it={};for(wt in rt)it[wt]=he(rt[wt]),it[rt[wt]]=it[wt];var wt;function Er(n,a,t,e,r){return ln[0]=e<<24|t<<16|a<<8|n,r&&(ln[0]=ln[0]&4278190079),Tr[0]}function he(n){if(n=n.toLowerCase(),typeof it[n]<"u")return it[n];var a=Lt(n),t=a.r,e=a.g,r=a.b,i=a.a;i=i*255|0;var o=Er(t,e,r,i,!0);return it[n]=o,o}function ve(n,a){Tr[0]=he(n);var t=ln[0];a&&(t=t|16777216);var e=t&255,r=t>>8&255,i=t>>16&255,o=t>>24&255;return[e,r,i,o]}function Ve(n){var a=n>>>8&255,t=n>>>16&255,e=n>>>24&255,r=n&255;return(r<<24|e<<16|t<<8|a)>>>0}function fn(n,a,t,e){return(t<<24|a<<16|n<<8|e)>>>0}function fa(n,a,t,e,r,i){var o=hn(n,t,e,r,i),s=Q(o,2),l=s[0],u=s[1],d=new Uint8Array(4);n.bindFramebuffer(n.FRAMEBUFFER,a),n.readPixels(l,u,1,1,n.RGBA,n.UNSIGNED_BYTE,d);var c=Q(d,4),f=c[0],h=c[1],p=c[2],b=c[3];return[f,h,p,b]}function ga(n){var a=Lt(n),t=a.r,e=a.g,r=a.b,i=a.a,o=(t/255).toFixed(6),s=(e/255).toFixed(6),l=(r/255).toFixed(6),u=i.toFixed(6);return"vec4(".concat(o,", ").concat(s,", ").concat(l,", ").concat(u,")")}function cl(n,a){if(typeof n!="object"||!n)return n;var t;if(typeof Symbol<"u"&&(t=n[Symbol.toPrimitive])!==void 0){var e=t.call(n,a||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(a==="string"?String:Number)(n)}function Ar(n){var a=cl(n,"string");return typeof a=="symbol"?a:a+""}function E(n,a,t){return(a=Ar(a))in n?Object.defineProperty(n,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[a]=t,n}function Sr(n,a){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(n);a&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),t.push.apply(t,e)}return t}function O(n){for(var a=1;a<arguments.length;a++){var t=arguments[a]!=null?arguments[a]:{};a%2?Sr(Object(t),!0).forEach(function(e){E(n,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):Sr(Object(t)).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))})}return n}function Y(n,a){if(!(n instanceof a))throw new TypeError("Cannot call a class as a function")}function Rr(n,a){for(var t=0;t<a.length;t++){var e=a[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,Ar(e.key),e)}}function K(n,a,t){return a&&Rr(n.prototype,a),t&&Rr(n,t),Object.defineProperty(n,"prototype",{writable:!1}),n}function je(n){return je=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(a){return a.__proto__||Object.getPrototypeOf(a)},je(n)}function Dr(){try{var n=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(Dr=function(){return!!n})()}function hl(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function fl(n,a){if(a&&(typeof a=="object"||typeof a=="function"))return a;if(a!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return hl(n)}function ne(n,a,t){return a=je(a),fl(n,Dr()?Reflect.construct(a,t||[],je(n).constructor):a.apply(n,t))}function pa(n,a){return pa=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},pa(n,a)}function ae(n,a){if(typeof a!="function"&&a!==null)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(a&&a.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),Object.defineProperty(n,"prototype",{writable:!1}),a&&pa(n,a)}function gl(n){if(Array.isArray(n))return un(n)}function pl(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function vl(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function $(n){return gl(n)||pl(n)||dn(n)||vl()}function Z(n){"@babel/helpers - typeof";return Z=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(a){return typeof a}:function(a){return a&&typeof Symbol=="function"&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},Z(n)}function Te(n){return Z(n)==="object"&&n!==null&&"attribute"in n}function gn(){var n=`
float sdf_circle(vec2 uv, float size) {
  return length(uv) - size;
}
`;return{name:"circle",glsl:n,uniforms:[]}}function Ft(n){var a,t=WebGL2RenderingContext,e=t.UNSIGNED_BYTE,r=(a=n?.color)!==null&&a!==void 0?a:{attribute:"color"};if(!Te(r)){var i=r,o=`
vec4 layer_fill() {
  return `.concat(ga(i),`;
}
`);return{name:"fill",uniforms:[],attributes:[],glsl:o}}var s=r.attribute,l=`
vec4 layer_fill(vec4 v_fillColor) {
  return v_fillColor;
}
`;return{name:"fill",uniforms:[],attributes:[{name:"fillColor",size:4,type:e,normalized:!0,source:s}],glsl:l}}function va(n,a){if(typeof n=="string"){var t=Pt(n).map(function(u){return u.toFixed(6)}),e=Q(t,4),r=e[0],i=e[1],o=e[2],s=e[3];return{glsl:"vec4(".concat(r,", ").concat(i,", ").concat(o,", ").concat(s,")"),attributes:[],needsNodeColors:!1}}if("node"in n&&n.node)return{glsl:n.node==="source"?"v_sourceColor":"v_targetColor",attributes:[],needsNodeColors:!0};var l=n;return{glsl:"v_".concat(a),attributes:[{name:"a_".concat(a),size:4,type:WebGL2RenderingContext.UNSIGNED_BYTE,normalized:!0,source:l.attribute,defaultValue:l.default}],needsNodeColors:!1}}function Ae(n){var a=n?.color;if(a===void 0){var t=`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return v_color;
}
`;return{name:"plain",glsl:t,uniforms:[],attributes:[]}}var e=va(a,"plainColor"),r=`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return `.concat(e.glsl,`;
}
`);return{name:"plain",glsl:r,uniforms:[],attributes:e.attributes,needsNodeColors:e.needsNodeColors}}function kt(){var n=`
// Position at parameter t \u2208 [0, 1]
vec2 path_straight_position(float t, vec2 source, vec2 target) {
  return mix(source, target, t);
}

// Total length of the path (analytical - more efficient than sampling)
float path_straight_length(vec2 source, vec2 target) {
  return length(target - source);
}
`;return{name:"straight",segments:1,minBodyLengthRatio:0,linearParameterization:!0,glsl:n,uniforms:[],attributes:[]}}function It(n){var a=n??{},t=a.segments,e=t===void 0?32:t,r=`
const float LOOP_PI = 3.141592653589793;

float loopWorldRadius() {
  float nodeWorldRadius = v_sourceNodeSize * u_correctionRatio / u_sizeRatio;
  return max(v_loopRadius * nodeWorldRadius, 0.001);
}

// Cubic B\xE9zier with P0 = P3 = source.
// Control points extend outward orthogonal to the node surface at exit/entry angles.
vec2 path_loop_position(float t, vec2 source, vec2 target) {
  float R = loopWorldRadius();
  float angle = v_loopAngle + (v_loopFixedOrientation > 0.5 ? u_cameraAngle : 0.0);
  float halfSpread = v_loopSpread * 0.5;

  float exitAngle = angle - halfSpread;
  float entryAngle = angle + halfSpread;

  // Control point distance: at t=0.5 the B\xE9zier reaches 0.75 * cpDist * cos(halfSpread)
  // from source. Solve for cpDist so the loop tip reaches exactly R.
  float cpDist = R / (0.75 * cos(halfSpread));

  vec2 cp1 = source + cpDist * vec2(cos(exitAngle), sin(exitAngle));
  vec2 cp2 = source + cpDist * vec2(cos(entryAngle), sin(entryAngle));

  float u = 1.0 - t;
  vec2 d1 = cp1 - source;
  vec2 d2 = cp2 - source;
  return source + 3.0 * t * u * (u * d1 + t * d2);
}

// Approximate arc length via chord sampling
float path_loop_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_loop_position(0.0, source, target);
  const int STEPS = 16;
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) / float(STEPS);
    vec2 cur = path_loop_position(t, source, target);
    len += length(cur - prev);
    prev = cur;
  }
  return len;
}
`;return{name:"loop",segments:e,glsl:r,needsNodeSize:!0,uniforms:[],attributes:[{name:"loopRadius",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopAngle",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopSpread",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopFixedOrientation",size:1,type:WebGL2RenderingContext.FLOAT}],variables:{loopRadius:{type:"number",default:4},loopAngle:{type:"number",default:Math.PI/4},loopSpread:{type:"number",default:80*Math.PI/180},loopFixedOrientation:{type:"number",default:0}},spread:{variable:"loopRadius",compute:function(o){return o+4}}}}var Hr=Re(Xe());function Mr(n){return Z(n)==="object"&&"glsl"in n&&!("attributes"in n)}function Or(n){return Z(n)==="object"&&"glsl"in n&&!("attributes"in n)}var Nt={shapes:[gn()],variables:{},layers:[Ft()],label:{},backdrop:{},labelAttachments:{}},st={paths:[kt(),It()],extremities:[],variables:{},layers:[Ae()],defaultHead:"none",defaultTail:"none",label:{}},mn=["nodes","topNodes"],bn=["edges","topEdges"],yn=[].concat(bn,mn),Br={nodes:Nt,edges:st,depthLayers:$(yn)};var El=function(a){return a},Sl=function(a){return a*a},Rl=function(a){return a*(2-a)},Al=function(a){return(a*=2)<1?.5*a*a:-.5*(--a*(a-2)-1)},Dl=function(a){return a*a*a},wl=function(a){return--a*a*a+1},Cl=function(a){return(a*=2)<1?.5*a*a*a:.5*((a-=2)*a*a+2)},Ll=function(a){return a===0?0:Math.pow(2,10*(a-1))},Pl=function(a){return a===1?1:1-Math.pow(2,-10*a)},Fl=function(a){return a===0?0:a===1?1:a<.5?Math.pow(2,10*(2*a-1))/2:(2-Math.pow(2,-10*(2*a-1)))/2},ba={linear:El,quadraticIn:Sl,quadraticOut:Rl,quadraticInOut:Al,cubicIn:Dl,cubicOut:wl,cubicInOut:Cl,exponentialIn:Ll,exponentialOut:Pl,exponentialInOut:Fl};function xn(n){return n?typeof n=="function"?n:ba[n]:ba.linear}function xa(n){return Z(n)==="object"&&n!==null&&"attribute"in n}function $r(n){return typeof n=="function"}function Vr(n){return Z(n)==="object"&&n!==null&&"when"in n&&typeof n.when=="function"&&"then"in n}function jr(n){return Z(n)==="object"&&n!==null&&"whenState"in n&&"then"in n}function Xr(n){return Z(n)==="object"&&n!==null&&"whenData"in n&&"then"in n}var kl={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,isDragged:!1},Il={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,parallelIndex:0,parallelCount:1},Nl={isIdle:!0,isPanning:!1,isZooming:!1,isDragging:!1,hasHovered:!1,hasHighlighted:!1};function qr(n){return O(O({},kl),n)}function Yr(n){return O(O({},Il),n)}function _a(n){return O(O({},Nl),n)}var Kr={x:{attribute:"x"},y:{attribute:"y"},size:{whenState:"isHovered",then:{attribute:"size",defaultValue:12},else:{attribute:"size",defaultValue:10}},color:{attribute:"color",defaultValue:"#666"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"},labelVisibility:{whenState:"isHovered",then:"visible",else:"auto"},backdropVisibility:{whenState:"isHovered",then:"visible",else:"hidden"},backdropColor:"#ffffff",backdropShadowColor:"rgba(0, 0, 0, 0.5)",backdropShadowBlur:12,backdropPadding:6},Zr={size:{attribute:"size",defaultValue:1},color:{attribute:"color",defaultValue:"#ccc"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"}},Tn={nodes:Kr,edges:Zr},Gt={nodes:O(O({},Kr),{},{depth:{whenState:"isHovered",then:"topNodes",else:"nodes"}}),edges:O(O({},Zr),{},{depth:{whenState:["isHighlighted","isHovered"],then:"topEdges",else:"edges"}})};function Gl(n){return"min"in n||"max"in n||"minValue"in n||"maxValue"in n||"easing"in n}function zl(n){return"dict"in n}function En(n,a){return typeof n=="string"?a[n]===!0:Array.isArray(n)?n.every(function(t){return a[t]===!0}):Z(n)==="object"&&n!==null?Object.entries(n).every(function(t){var e=Q(t,2),r=e[0],i=e[1];return a[r]===i}):!1}function Ml(n,a){var t=a[n.attribute];return t===void 0?n.defaultValue:t}function Ol(n,a,t){var e,r,i,o,s=a[n.attribute];if(s===void 0)return n.defaultValue;var l=Number(s);if(isNaN(l))return n.defaultValue;if(n.min===void 0&&n.max===void 0)return l;var u=(e=n.minValue)!==null&&e!==void 0?e:l,d=(r=n.maxValue)!==null&&r!==void 0?r:l;if(d===u){var c;return(c=n.min)!==null&&c!==void 0?c:l}var f=(l-u)/(d-u);f=Math.max(0,Math.min(1,f));var h=xn(n.easing);f=h(f);var p=(i=n.min)!==null&&i!==void 0?i:0,b=(o=n.max)!==null&&o!==void 0?o:1;return p+f*(b-p)}function Bl(n,a){var t=a[n.attribute];if(t===void 0)return n.defaultValue;var e=String(t);return e in n.dict?n.dict[e]:n.defaultValue}function Ul(n,a,t){return zl(n)?Bl(n,a):Gl(n)?Ol(n,a):Ml(n,a)}function Qr(n,a){return typeof n=="string"?!!a[n]:Array.isArray(n)?n.every(function(t){return!!a[t]}):Z(n)==="object"&&n!==null?Object.entries(n).every(function(t){var e=Q(t,2),r=e[0],i=e[1];return a[r]===i}):!1}function _n(n,a,t,e,r,i){if(n==null)return i;if(Z(n)!=="object"&&typeof n!="function")return n;if(Vr(n)){var o=n.when(a,t,e,r)?n.then:n.else;return o===void 0?i:_n(o,a,t,e,r,i)}if(jr(n)){var s=En(n.whenState,t)?n.then:n.else;return s===void 0?i:_n(s,a,t,e,r,i)}if(Xr(n)){var l=Qr(n.whenData,a)?n.then:n.else;return l===void 0?i:_n(l,a,t,e,r,i)}if($r(n)){var u=n(a,t,e,r);return u??i}if(xa(n)){var d=Ul(n,a);return d??i}return n}function Ee(n){if(n==null)return"static";if(Vr(n))return"graph-state";if(jr(n)){var a=Ee(n.then),t=n.else!==void 0?Ee(n.else):"static";return me("item-state",me(a,t))}if(Xr(n)){var e=Ee(n.then),r=n.else!==void 0?Ee(n.else):"static";return me(e,r)}return $r(n)?"graph-state":(xa(n),"static")}function me(n,a){return n==="graph-state"||a==="graph-state"?"graph-state":n==="item-state"||a==="item-state"?"item-state":"static"}function Ta(n){if(!n)return{dependency:"static",xAttribute:null,yAttribute:null};var a=Array.isArray(n)?n:[n],t="static",e=null,r=null,i=M(a),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;if("matchData"in s&&"cases"in s)for(var l=s.cases,u=0,d=Object.values(l);u<d.length;u++)for(var c=d[u],f=0,h=Object.values(c);f<h.length;f++){var p=h[f];t=me(t,Ee(p))}else if("matchState"in s&&"cases"in s){t=me(t,"item-state");for(var b=s.cases,v=0,g=Object.values(b);v<g.length;v++)for(var m=g[v],y=0,T=Object.values(m);y<T.length;y++){var x=T[y];t=me(t,Ee(x))}}else if("when"in s&&"then"in s)t="graph-state";else if("whenState"in s){t=me(t,"item-state");var _=s.then;if(_&&Z(_)==="object")for(var R=0,S=Object.values(_);R<S.length;R++){var C=S[R];t=me(t,Ee(C))}var D=s.else;if(D&&Z(D)==="object")for(var k=0,A=Object.values(D);k<A.length;k++){var I=A[k];t=me(t,Ee(I))}}else if("whenData"in s){var w=s.then;if(w&&Z(w)==="object")for(var F=0,G=Object.values(w);F<G.length;F++){var N=G[F];t=me(t,Ee(N))}var P=s.else;if(P&&Z(P)==="object")for(var L=0,z=Object.values(P);L<z.length;L++){var H=z[L];t=me(t,Ee(H))}}else for(var W=0,q=Object.entries(s);W<q.length;W++){var j=Q(q[W],2),X=j[0],_e=j[1];if(!Sa.has(X)&&(t=me(t,Ee(_e)),(X==="x"||X==="y")&&xa(_e))){var de=_e.attribute;X==="x"&&!e&&(e=de),X==="y"&&!r&&(r=de)}}}}catch(Pe){i.e(Pe)}finally{i.f()}return{dependency:t,xAttribute:e,yAttribute:r}}var Ie={size:10,color:"#666",opacity:1,shape:"circle",rotationAlignment:"viewport",labelRotationAlignment:"viewport",visibility:"visible",depth:"nodes",zIndex:0,label:"",labelColor:"#000",labelSize:12,labelFont:"sans-serif",labelVisibility:"auto",labelPosition:"right",labelAngle:0,labelDepth:"nodes",backdropVisibility:"hidden",backdropColor:"transparent",backdropShadowColor:"transparent",backdropShadowBlur:0,backdropPadding:0,backdropBorderColor:"transparent",backdropBorderWidth:0,backdropCornerRadius:0,backdropLabelPadding:-1,backdropArea:"both",labelAttachment:null,labelAttachmentPlacement:"below"},Ea={size:1,color:"#ccc",opacity:1,path:"straight",selfLoopPath:"loop",parallelSpread:.25,tail:"none",head:"none",visibility:"visible",depth:"edges",zIndex:0,label:"",labelColor:"#666",labelVisibility:"auto",labelDepth:"edges"},Sa=new Set(["when","whenState","whenData","then","else"]),Ur=Object.keys(Ie),Wl=Object.values(Ie),Wr=Object.keys(Ea),Hl=Object.values(Ea);function lt(n,a,t,e,r,i,o){for(var s in a){var l;if(!Sa.has(s)){var u=(l=n[s])!==null&&l!==void 0?l:o[s];n[s]=_n(a[s],t,e,r,i,u)}}"depth"in a&&!("labelDepth"in a)&&(n.labelDepth=n.depth)}function Jr(n,a,t,e,r,i,o){var s=M(a),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;if("matchData"in u&&"cases"in u){var d,c=String((d=t[u.matchData])!==null&&d!==void 0?d:""),f=u.cases;c in f&&lt(n,f[c],t,e,r,i,o)}else if("matchState"in u&&"cases"in u){var h,p=String((h=e[u.matchState])!==null&&h!==void 0?h:""),b=u.cases;p in b&&lt(n,b[p],t,e,r,i,o)}else if("when"in u&&"then"in u){var v=u.when;if(!v(t,e,r,i))continue;lt(n,u.then,t,e,r,i,o)}else if("whenState"in u&&"then"in u){if(!En(u.whenState,e))continue;lt(n,u.then,t,e,r,i,o)}else if("whenData"in u&&"then"in u){if(!Qr(u.whenData,t))continue;lt(n,u.then,t,e,r,i,o)}else lt(n,u,t,e,r,i,o)}}catch(g){s.e(g)}finally{s.f()}}function Ra(n,a,t,e,r,i){for(var o=i||{},s=o,l=0,u=Ur.length;l<u;l++)s[Ur[l]]=Wl[l];if(s.x=void 0,s.y=void 0,s.labelBackgroundColor=void 0,s.labelBackgroundPadding=void 0,s.labelCursor=void 0,!n){var d,c,f,h,p;return s.x=(d=a.x)!==null&&d!==void 0?d:0,s.y=(c=a.y)!==null&&c!==void 0?c:0,o.size=(f=a.size)!==null&&f!==void 0?f:10,o.color=(h=a.color)!==null&&h!==void 0?h:"#666",o.label=(p=a.label)!==null&&p!==void 0?p:"",o}var b=Array.isArray(n)?n:[n];return Jr(s,b,a,t,e,r,Ie),o}function Aa(n,a,t,e,r,i){for(var o=i||{},s=o,l=0,u=Wr.length;l<u;l++)s[Wr[l]]=Hl[l];if(!n){var d,c,f;return o.size=(d=a.size)!==null&&d!==void 0?d:1,o.color=(c=a.color)!==null&&c!==void 0?c:"#ccc",o.label=(f=a.label)!==null&&f!==void 0?f:"",o}var h=Array.isArray(n)?n:[n];return Jr(s,h,a,t,e,r,Ea),typeof s.labelPosition=="number"&&(s.labelPosition=void 0),o}function $l(n,a,t){var e,r;if(n==null)return t;if(typeof n=="function")return(e=n(a))!==null&&e!==void 0?e:t;if(Z(n)==="object"&&"when"in n){var i,o=n,s=o.when(a),l=s?o.then:o.else;return l===void 0?t:typeof l=="function"?(i=l(a))!==null&&i!==void 0?i:t:l??t}if(Z(n)==="object"&&"whenState"in n){var u,d=n,c=En(d.whenState,a),f=c?d.then:d.else;return f===void 0?t:typeof f=="function"?(u=f(a))!==null&&u!==void 0?u:t:f??t}return(r=n)!==null&&r!==void 0?r:t}function Da(n,a){var t={};if(!n)return t;var e=Array.isArray(n)?n:[n],r=M(e),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;if("when"in o&&"then"in o){var s=o.when(a),l=s?o.then:o.else;l&&Z(l)==="object"&&ya(t,l,a)}else if("whenState"in o&&"then"in o){var u=En(o.whenState,a),d=u?o.then:o.else;d&&Z(d)==="object"&&ya(t,d,a)}else ya(t,o,a)}}catch(c){r.e(c)}finally{r.f()}return t}function ya(n,a,t){for(var e=0,r=Object.entries(a);e<r.length;e++){var i=Q(r[e],2),o=i[0],s=i[1];Sa.has(o)||(n[o]=$l(s,t))}}var Sn=(function(n){function a(){var t;return Y(this,a),t=ne(this,a),t.rawEmitter=t,t}return ae(a,n),K(a)})(Hr.EventEmitter);var ei=Br;function wa(n,a){var t=a.size;if(t!==0){var e=n.length;n.length+=t;var r=0;a.forEach(function(i){n[e+r]=i,r++})}}function ti(n){n=n||{};for(var a=0,t=arguments.length<=1?0:arguments.length-1;a<t;a++){var e=a+1<1||arguments.length<=a+1?void 0:arguments[a+1];e&&Object.assign(n,e)}return n}function ut(n,a){for(var t in a)if(Object.prototype.hasOwnProperty.call(a,t)&&a[t]!==n[t])return!0;return!1}function ni(n,a){var t=n,e=a;for(var r in t)if(Object.prototype.hasOwnProperty.call(t,r)&&t[r]!==e[r])return!1;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)&&e[i]!==t[i])return!1;return!0}function qe(n,a,t){t?n.add(a):n.delete(a)}var ri=Re(zt());var ii={easing:"quadraticInOut",duration:150};function Me(n){return n.labelVisibility==="visible"&&n.visibility!=="hidden"}function Ca(n){return n.backdropVisibility==="visible"&&n.visibility!=="hidden"}function Rn(n){return[n.rotationAlignment==="graph"?1:0,n.labelRotationAlignment==="graph"?1:0]}function La(n,a,t){var e=n[a];if(e)for(var r=0;r<e.length;r++){var i=e[r];if(!(t<i.offset||t>=i.offset+i.count)){if(i.count===1)e.splice(r,1);else if(t===i.offset)i.offset++,i.count--;else if(t===i.offset+i.count-1)i.count--;else{var o=t+1,s=i.offset+i.count-o;i.count=t-i.offset,e.splice(r+1,0,{offset:o,count:s})}return}}}function Pa(n,a,t){if(!n[a]){n[a]=[{offset:t,count:1}];return}for(var e=n[a],r=e.length,i=0;i<e.length;i++)if(t<e[i].offset){r=i;break}var o=r>0?e[r-1]:null,s=r<e.length?e[r]:null,l=o&&o.offset+o.count===t,u=s&&t+1===s.offset;l&&u?(o.count+=1+s.count,e.splice(r,1)):l?o.count++:u?(s.offset--,s.count++):e.splice(r,0,{offset:t,count:1})}function oi(n){if(!(0,ri.default)(n))throw new Error("Sigma: invalid graph instance.")}function An(n){var a=Q(n.x,2),t=a[0],e=a[1],r=Q(n.y,2),i=r[0],o=r[1],s=Math.max(e-t,o-i),l=(e+t)/2,u=(o+i)/2;(s===0||Math.abs(s)===1/0||isNaN(s))&&(s=1),isNaN(l)&&(l=0),isNaN(u)&&(u=0);var d=function(f){return{x:.5+(f.x-l)/s,y:.5+(f.y-u)/s}};return d.applyTo=function(c){c.x=.5+(c.x-l)/s,c.y=.5+(c.y-u)/s},d.inverse=function(c){return{x:l+s*(c.x-.5),y:u+s*(c.y-.5)}},d.ratio=s,d}var Dn={hideEdgesOnMove:!1,hideLabelsOnMove:!1,renderLabels:!0,renderEdgeLabels:!1,edgeLabelAnchors:"nodeLabels",enableEdgeEvents:!1,nodeLabelEvents:!1,edgeLabelEvents:!1,pickingDownSizingRatio:2,nodePickingPadding:0,edgePickingPadding:4,labelPickingPadding:10,stagePadding:30,minEdgeThickness:1.7,antiAliasingFeather:1,antialiasEdges:!0,antialiasNodes:!0,dragTimeout:100,draggedEventsTolerance:3,inertiaDuration:200,inertiaRatio:3,zoomDuration:250,zoomingRatio:1.7,doubleClickTimeout:300,doubleClickZoomingRatio:2.2,doubleClickZoomingDuration:200,tapMoveTolerance:10,zoomToSizeRatioFunction:Math.sqrt,itemSizesReference:"positions",autoRescale:!0,autoRescaleContent:"positions",enableNodeDrag:!1,getDraggedNodes:function(a){return[a]},dragPositionToAttributes:null,labelDensity:1,labelGridCellSize:100,labelRenderedSizeThreshold:6,labelPixelSnapping:!0,minCameraRatio:null,maxCameraRatio:null,enableCameraZooming:!0,enableCameraPanning:!0,enableCameraRotation:!0,enableCameraMouseRotation:!0,cameraPanBoundaries:null,gestureTarget:"graph",sharedGestureWheelMessage:"Use Ctrl + scroll to zoom the graph",sharedGestureAppleWheelMessage:"Use \u2318 + scroll to zoom the graph",sharedGestureTouchMessage:"Use two fingers to move the graph",allowInvalidContainer:!1,DEBUG_displayPickingLayer:!1,DEBUG_logShaders:!1,DEBUG_logRenderStats:!1,DEBUG_gpuTimerQueries:!1};function wn(n){if(typeof n.labelDensity!="number"||n.labelDensity<0)throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");var a=n.minCameraRatio,t=n.maxCameraRatio;if(typeof a=="number"&&typeof t=="number"&&t<a)throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.")}function si(n){return ti({},Dn,n)}var Vl=new Set(["italic","oblique"]),jl=new Set(["bold","bolder","lighter"]);function Cn(n){for(var a="normal",t="normal",e=n.trim(),r=e.split(/\s+/),i=0,o=0;o<r.length;o++){var s=r[o].toLowerCase();if(Vl.has(s))t=s,i=o+1;else if(jl.has(s)||/^\d{3}$/.test(s))a=s,i=o+1;else if(s==="normal")i=o+1;else break}var l=r.slice(i).join(" ");return{family:l||e,weight:a,style:t}}function dt(n,a,t){var e=document.createElement(n);if(a)for(var r in a)e.style[r]=a[r];if(t)for(var i in t)e.setAttribute(i,t[i]);return e}function Mt(){return typeof window.devicePixelRatio<"u"?window.devicePixelRatio:1}var gi=Re(Xe());function Xl(n){var a=n.type===WebGL2RenderingContext.FLOAT&&!n.normalized,t=n.type===WebGL2RenderingContext.UNSIGNED_BYTE&&n.size===4&&n.normalized;if(!a&&!t)throw new Error('Attribute "'.concat(n.name,'" is invalid: only non-normalized FLOAT and normalized UNSIGNED_BYTE with size 4 are supported.'));return n.normalized?1:n.size}function Nn(n){var a=0;return n.forEach(function(t){return a+=Xl(t)}),a}function pi(n,a,t){var e=n==="VERTEX"?a.VERTEX_SHADER:a.FRAGMENT_SHADER,r=a.createShader(e);if(r===null)throw new Error("loadShader: error while creating the shader");a.shaderSource(r,t),a.compileShader(r);var i=a.getShaderParameter(r,a.COMPILE_STATUS);if(!i){var o=a.getShaderInfoLog(r);throw a.deleteShader(r),new Error(`loadShader: error while compiling the shader:
`.concat(o,`
`).concat(t))}return r}function Ht(n,a){return pi("VERTEX",n,a)}function $t(n,a){return pi("FRAGMENT",n,a)}function Vt(n,a){var t=n.createProgram();if(t===null)throw new Error("loadProgram: error while creating the program.");var e,r;for(e=0,r=a.length;e<r;e++)n.attachShader(t,a[e]);n.linkProgram(t);var i=n.getProgramParameter(t,n.LINK_STATUS);if(!i){var o=n.getProgramInfoLog(t);throw n.deleteProgram(t),new Error("loadProgram: error while linking the program: ".concat(o))}return t}function Fa(n){var a=n.gl,t=n.buffer,e=n.program,r=n.vertexShader,i=n.fragmentShader;a.deleteShader(r),a.deleteShader(i),a.deleteProgram(e),a.deleteBuffer(t)}function te(n){return n%1===0?n.toFixed(1):n.toString()}var Gn=new Map,vi=new Map,ql=0;function Ga(n,a){var t,e=(t=n.variables)===null||t===void 0||(t=t[a.source||a.name.replace(/^a_/,"")])===null||t===void 0?void 0:t.default,r=typeof e=="number"?e:typeof a.defaultValue=="number"?a.defaultValue:0;return te(r)}function jt(n,a,t){var e,r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:function(o){return"v_".concat(o.name.replace(/^a_/,""))},i=[a,t].concat($(n.uniforms.filter(function(o){return o.type==="float"}).map(function(o){var s;return te((s=o.value)!==null&&s!==void 0?s:0)})),$(((e=n.attributes)!==null&&e!==void 0?e:[]).map(r)));return"sdf_".concat(n.name,"(").concat(i.join(", "),")")}function Yl(n){var a,t=n.name,e=n.uniforms.filter(function(o){return o.type==="float"&&o.value!==void 0&&o.value!==0}).map(function(o){return"".concat(o.name.replace("u_",""),"=").concat(o.value)}).sort(),r=((a=n.attributes)!==null&&a!==void 0?a:[]).map(function(o){var s;return"".concat(o.name,"@").concat((s=o.source)!==null&&s!==void 0?s:"","=").concat(Ga(n,o))}),i=[].concat($(e),$(r));return i.length>0&&(t+="#"+i.join("#")),t}function mi(n){var a=Yl(n);if(!Gn.has(a)){var t={},e=M(n.uniforms),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;i.type==="float"&&i.value!==void 0&&(t[i.name]=i.value)}}catch(o){e.e(o)}finally{e.f()}Gn.set(a,{shape:n,uniformValues:t,slug:a}),vi.set(a,ql++)}return a}function ht(n){var a;return(a=vi.get(n))!==null&&a!==void 0?a:-1}function bi(n){var a=[],t=new Set,e=new Set,r=/mat2 rotate2D\(float angle\)\s*\{[^}]+\}/,i=M(n),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;if(!e.has(s.name)){e.add(s.name);var l=s.glsl;r.test(l)&&(t.has("rotate2D")?l=l.replace(r,""):t.add("rotate2D")),a.push(l)}}}catch(u){i.e(u)}finally{i.f()}return a.join(`
`)}function yi(){return bi(Array.from(Gn.values()).map(function(n){return n.shape}))}function xi(n){var a=Array.from(Gn.entries());if(a.length===0)return`
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`;var t=a.map(function(e,r){var i=Q(e,2),o=i[0],s=i[1].shape,l=jt(s,"uv","size",function(u){var d=u.name.replace(/^a_/,"");return n!=null&&n.has(d)?"g_".concat(d):Ga(s,u)});return"    case ".concat(r,": return ").concat(l,"; // ").concat(o)}).join(`
`);return`
float querySDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
`.concat(t,`
    default: return length(uv) - size;
  }
}
`)}function zn(n){return bi(n)}function ft(n){return $(new Map(n.flatMap(function(a){return a.uniforms}).map(function(a){return[a.name,a]})).values())}function _i(n,a){if(n.length===0)return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;var t=function(c){return jt(c,"uv","size")},e=function(c){var f,h;return(f=c.inradiusFactorGLSL)!==null&&f!==void 0?f:te((h=c.inradiusFactor)!==null&&h!==void 0?h:1)};if(n.length===1){var r=n[0];return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = `.concat(t(r),`;
  context.inradiusFactor = `).concat(e(r),`;
}
`)}var i=n.map(function(d,c){return"    case ".concat(c,": // ").concat(d.name,`
      context.sdf = `).concat(t(d),`;
      context.inradiusFactor = `).concat(e(d),`;
      break;`)}).join(`
`),o=n[0],s="",l="shapeId";if(a&&a.length>1){var u=a.map(function(d,c){return"    case ".concat(d,": return ").concat(c,"; // ").concat(n[c].name)}).join(`
`);s=`
int globalToLocalShapeId(int globalId) {
  switch (globalId) {
`.concat(u,`
    default: return 0;
  }
}
`),l="globalToLocalShapeId(shapeId)"}return"".concat(s,`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  switch (`).concat(l,`) {
`).concat(i,`
    default:
      context.sdf = `).concat(t(o),`;
      context.inradiusFactor = `).concat(e(o),`;
  }
}
`)}var Ke={right:0,left:1,above:2,below:3,over:4},Ze=5,Mn=3,za=`
float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;
`,On=`
mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
`,Ma=`
vec2 getLabelDirection(float positionMode) {
  if (positionMode < 0.5) return vec2(1.0, 0.0);   // Right
  if (positionMode < 1.5) return vec2(-1.0, 0.0);  // Left
  if (positionMode < 2.5) return vec2(0.0, -1.0);  // Above
  if (positionMode < 3.5) return vec2(0.0, 1.0);   // Below
  return vec2(0.0);                                 // Over (centered)
}
`,Ti=`
float sdfBox(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,Ei=`
float sdfRotatedBox(vec2 p, vec2 halfSize, float angle) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfBox(rotatedP, halfSize);
}
`,Si=`
float sdfRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 d = abs(p) - halfSize + radius;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`,Ri=`
float sdfRoundedRotatedBox(vec2 p, vec2 halfSize, float angle, float radius) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfRoundedBox(rotatedP, halfSize, radius);
}
`,Oa=`
vec2 labelBoxCenter(float positionMode, float labelStart, vec2 halfSize, float textHalfY) {
  if (positionMode < 0.5) return vec2(labelStart + halfSize.x, 0.0);    // right
  if (positionMode < 1.5) return vec2(-(labelStart + halfSize.x), 0.0); // left
  if (positionMode < 2.5) return vec2(0.0, -(labelStart + textHalfY));  // above
  if (positionMode < 3.5) return vec2(0.0, labelStart + textHalfY);     // below
  return vec2(0.0);                                                     // over
}
`,Bn=2,we=`
vec4 readNodeData(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(Bn,`;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`),Ue=`
vec4 readNodeFlags(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(Bn,` + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`),Ai=`
vec4 readNodeColor(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(Bn,` + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  vec4 texel = texelFetch(nodeDataTexture, coord, 0);
  float r = floor(texel.b / 65536.0);
  float g = floor(mod(texel.b, 65536.0) / 256.0);
  float b = mod(texel.b, 256.0);
  return vec4(r / 255.0, g / 255.0, b / 255.0, texel.a);
}
`),Qe=`
vec4 readFrameTexel(sampler2D frameTexture, int frameTextureWidth, int index) {
  ivec2 coord = ivec2(index % frameTextureWidth, index / frameTextureWidth);
  return texelFetch(frameTexture, coord, 0);
}
`;function Di(n,a){var t=function(o){return jt(o,"uv","size")};if(n.length===1)return{code:li(t(n[0])),multiShape:!1};var e=n.map(function(i,o){return"    case ".concat(a?a[o]:o,": return ").concat(t(i),";")}).join(`
`),r=`
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
`.concat(e,`
    default: return `).concat(t(n[0]),`;
  }
}
int g_shapeId;
`).concat(li("queryShapeSDF(g_shapeId, uv, size)"),`
`);return{code:r,multiShape:!0}}function li(n){return`
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (`.concat(n,` < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}
`)}function Kl(n,a){for(;!{}.hasOwnProperty.call(n,a)&&(n=je(n))!==null;);return n}function ka(){return ka=typeof Reflect<"u"&&Reflect.get?Reflect.get.bind():function(n,a,t){var e=Kl(n,a);if(e){var r=Object.getOwnPropertyDescriptor(e,a);return r.get?r.get.call(arguments.length<3?n:t):r.value}},ka.apply(null,arguments)}function re(n,a,t,e){var r=ka(je(1&e?n.prototype:n),a,t);return 2&e&&typeof r=="function"?function(i){return r.apply(t,i)}:r}var Zl=1024,Ql=1.5,wi=-1,Xt=(function(){function n(a,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Zl;Y(this,n),E(this,"texture",null),E(this,"dirty",!1),E(this,"dirtyRangeStart",1/0),E(this,"dirtyRangeEnd",-1),E(this,"indexMap",new Map),E(this,"freeIndices",[]),E(this,"nextIndex",0),this.gl=a,this.maxTextureSize=a.getParameter(a.MAX_TEXTURE_SIZE),this.TEXELS_PER_ITEM=t,this.capacity=this.roundUpToPowerOfTwo(e);var r=this.computeTextureDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.data=new Float32Array(this.textureWidth*this.textureHeight*4),this.createTexture()}return K(n,[{key:"computeTextureDimensions",value:function(t){var e=t*this.TEXELS_PER_ITEM,r=Math.min(e,this.maxTextureSize),i=Math.ceil(e/r);return{width:r,height:i}}},{key:"roundUpToPowerOfTwo",value:function(t){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,t))))}},{key:"createTexture",value:function(){var t=this.gl;this.texture=t.createTexture(),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,this.textureWidth,this.textureHeight,0,t.RGBA,t.FLOAT,this.data),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.bindTexture(t.TEXTURE_2D,null)}},{key:"resize",value:function(t){if(!(t<=this.capacity)){var e=this.roundUpToPowerOfTwo(Math.ceil(t*Ql)),r=this.gl,i=this.computeTextureDimensions(e),o=new Float32Array(i.width*i.height*4);o.set(this.data),this.texture&&r.deleteTexture(this.texture),this.data=o,this.capacity=e,this.textureWidth=i.width,this.textureHeight=i.height,this.createTexture(),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.nextIndex}}},{key:"allocate",value:function(t){var e=this.indexMap.get(t);if(e!==void 0)return e;var r;return this.freeIndices.length>0?r=this.freeIndices.pop():(r=this.nextIndex++,r>=this.capacity&&this.resize(r+1)),this.indexMap.set(t,r),r}},{key:"free",value:function(t){var e=this.indexMap.get(t);if(e!==void 0){this.indexMap.delete(t),this.freeIndices.push(e);for(var r=e*this.TEXELS_PER_ITEM*4,i=0;i<this.TEXELS_PER_ITEM*4;i++)this.data[r+i]=0;this.markDirty(e)}}},{key:"getIndex",value:function(t){var e;return(e=this.indexMap.get(t))!==null&&e!==void 0?e:-1}},{key:"has",value:function(t){return this.indexMap.has(t)}},{key:"markDirty",value:function(t){this.dirty=!0,this.dirtyRangeStart=Math.min(this.dirtyRangeStart,t),this.dirtyRangeEnd=Math.max(this.dirtyRangeEnd,t+1)}},{key:"upload",value:function(){if(!(!this.dirty||!this.texture)){var t=this.gl,e=this.textureWidth;t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture);var r=this.dirtyRangeStart*this.TEXELS_PER_ITEM,i=Math.min(this.dirtyRangeEnd*this.TEXELS_PER_ITEM,this.capacity*this.TEXELS_PER_ITEM);if(r<i)for(var o=Math.floor(r/e),s=Math.floor((i-1)/e),l=o;l<=s;l++){var u=l*e,d=Math.min(u+e,this.capacity*this.TEXELS_PER_ITEM),c=Math.max(r,u),f=Math.min(i,d);if(c<f){var h=c-u,p=f-c,b=this.data.subarray(c*4,f*4);t.texSubImage2D(t.TEXTURE_2D,0,h,l,p,1,t.RGBA,t.FLOAT,b)}}t.bindTexture(t.TEXTURE_2D,null),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}}},{key:"bind",value:function(t){var e=this.gl;e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.texture)}},{key:"getTexture",value:function(){return this.texture}},{key:"getCapacity",value:function(){return this.capacity}},{key:"getTextureWidth",value:function(){return this.textureWidth}},{key:"getTextureHeight",value:function(){return this.textureHeight}},{key:"getTexelsPerItem",value:function(){return this.TEXELS_PER_ITEM}},{key:"getCount",value:function(){return this.indexMap.size}},{key:"getHighWaterMark",value:function(){return this.nextIndex}},{key:"isDirty",value:function(){return this.dirty}},{key:"clear",value:function(){this.indexMap.clear(),this.freeIndices=[],this.nextIndex=0,this.data.fill(0),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.capacity}},{key:"restore",value:function(){this.createTexture(),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}},{key:"kill",value:function(){this.texture&&(this.gl.deleteTexture(this.texture),this.texture=null),this.indexMap.clear(),this.freeIndices=[]}}])})();function be(n){var a={},t={},e=0,r=M(n),i;try{for(r.s();!(i=r.n()).done;){var o=i.value,s=M(o.attributes),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.name.replace(/^a_/,"");d in a||(a[d]=e,t[d]=u,e+=u.size)}}catch(c){s.e(c)}finally{s.f()}}}catch(c){r.e(c)}finally{r.f()}return{floatsPerItem:e,texelsPerItem:Math.max(1,Math.ceil(e/4)),offsets:a,specs:t}}var Un=(function(n){function a(t,e,r){var i;return Y(this,a),i=ne(this,a,[t,e.texelsPerItem,r]),i.floatsPerItem=e.floatsPerItem,i}return ae(a,n),K(a,[{key:"updateAllAttributes",value:function(e,r){var i=this.indexMap.get(e);i===void 0&&(i=this.allocate(e));for(var o=i*this.TEXELS_PER_ITEM*4,s=Math.min(r.length,this.floatsPerItem),l=0;l<s;l++)this.data[o+l]=r[l];this.markDirty(i)}},{key:"updateAllAttributesAtRow",value:function(e,r){e>=this.capacity&&this.resize(e+1);for(var i=e*this.TEXELS_PER_ITEM*4,o=Math.min(r.length,this.floatsPerItem),s=0;s<o;s++)this.data[i+s]=r[s];this.markDirty(e)}}])})(Xt);function Wn(n,a,t){for(var e=[],r=new Set,i=0;i<n.length;i++){var o=n[i],s=M(o.attributes),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.name.replace(/^a_/,"");if(!r.has(d)){r.add(d);var c=a.offsets[d];if(c!==void 0){var f=t?.get(i);e.push({sourceKey:u.source||d,packedOffset:c,size:u.size,isColor:u.size===4&&!!u.normalized,defaultNum:typeof u.defaultValue=="number"?u.defaultValue:u.defaultValue===!0?1:0,defaultColor:typeof u.defaultValue=="string"?u.defaultValue:"",sourceIndex:i,hasLifecycleHook:!!(f!=null&&f.getAttributeData)})}}}}catch(h){s.e(h)}finally{s.f()}}return e}function Hn(n,a,t,e,r,i){t.fill(0);for(var o=0,s=n.length;o<s;o++){var l=n[o],u=l.packedOffset,d=void 0;if(l.hasLifecycleHook){var c=r.get(l.sourceIndex-i);d=c.getAttributeData(a,l.sourceKey),d===null&&(d=a[l.sourceKey])}else d=a[l.sourceKey];if(l.isColor){var f=typeof d=="string"?d:l.defaultColor||e,h=ve(f),p=Q(h,4),b=p[0],v=p[1],g=p[2],m=p[3];t[u]=b/255,t[u+1]=v/255,t[u+2]=g/255,t[u+3]=m/255}else if(l.size===1)t[u]=typeof d=="number"?d:typeof d=="boolean"?d?1:0:l.defaultNum;else{var y=Array.isArray(d)?d:null;if(y)for(var T=0;T<l.size;T++){var x;t[u+T]=(x=y[T])!==null&&x!==void 0?x:0}}}}var Ln=["r","g","b","a"];function ct(n,a){var t=n.offsets,e=n.specs,r=n.texelsPerItem,i=n.floatsPerItem,o=Object.keys(t);if(o.length===0||i===0)return{fetchCode:"",varyingAssignments:""};var s=a.varPrefix,l=a.baseTexelExpr,u=a.textureWidthUniform,d=a.textureSamplerUniform,c=a.outputPrefix,f=c===void 0?"v_":c,h=[];h.push("  int ".concat(s,"BaseTexel = ").concat(l,";")),h.push("");for(var p=0;p<r;p++)h.push("  ivec2 ".concat(s,"Coord").concat(p," = ivec2((").concat(s,"BaseTexel + ").concat(p,") % ").concat(u,", (").concat(s,"BaseTexel + ").concat(p,") / ").concat(u,");")),h.push("  vec4 ".concat(s,"Texel").concat(p," = texelFetch(").concat(d,", ").concat(s,"Coord").concat(p,", 0);"));h.push("");for(var b=[],v=function(){var T=m[g],x=e[T],_=t[T],R=Math.floor(_/4),S=_%4,C="".concat(s,"Texel").concat(R),D="".concat(s,"Texel").concat(R+1),k="".concat(s,"Fetched_").concat(T);if(x.size===1)h.push("  float ".concat(k," = ").concat(C,".").concat(Ln[S],";"));else if(x.size===4&&S===0)h.push("  vec4 ".concat(k," = ").concat(C,";"));else{var A=S+x.size;if(A<=4){var I="vec".concat(x.size),w=Ln.slice(S,A).join("");h.push("  ".concat(I," ").concat(k," = ").concat(C,".").concat(w,";"))}else{var F=x.size===4?"vec4":"vec".concat(x.size),G=Ln.slice(S).map(function(L){return"".concat(C,".").concat(L)}),N=Ln.slice(0,A-4).map(function(L){return"".concat(D,".").concat(L)}),P=[].concat($(G),$(N)).join(", ");h.push("  ".concat(F," ").concat(k," = ").concat(F,"(").concat(P,");"))}}b.push("  ".concat(f).concat(T," = ").concat(k,";"))},g=0,m=o;g<m.length;g++)v();return{fetchCode:h.join(`
`),varyingAssignments:b.join(`
`)}}function Ba(n,a,t){if(!(!a||t.type==="sampler2D"))switch(t.type){case"float":n.uniform1f(a,t.value);break;case"int":case"bool":n.uniform1i(a,t.value);break;case"vec2":n.uniform2fv(a,t.value);break;case"vec3":n.uniform3fv(a,t.value);break;case"vec4":n.uniform4fv(a,t.value);break;case"mat3":n.uniformMatrix3fv(a,!1,t.value);break;case"mat4":n.uniformMatrix4fv(a,!1,t.value);break}}var Jl=E(E(E(E(E(E(E(E({},WebGL2RenderingContext.BOOL,1),WebGL2RenderingContext.BYTE,1),WebGL2RenderingContext.UNSIGNED_BYTE,1),WebGL2RenderingContext.SHORT,2),WebGL2RenderingContext.UNSIGNED_SHORT,2),WebGL2RenderingContext.INT,4),WebGL2RenderingContext.UNSIGNED_INT,4),WebGL2RenderingContext.FLOAT,4);function Pn(n){var a=n.match(/^(#version[^\n]*\n)/);return a?a[1]+`#define PICKING_MODE
`+n.slice(a[1].length):`#define PICKING_MODE
`+n}var Ce=(function(){function n(a,t,e){Y(this,n),E(this,"floats",new Float32Array),E(this,"ints",new Uint32Array),E(this,"constantArray",new Float32Array),E(this,"capacity",0),E(this,"verticesCount",0),E(this,"bufferGeneration",0),E(this,"uploadedGeneration",new Map),E(this,"constantBufferGeneration",0),E(this,"uploadedConstantGeneration",new Map),E(this,"renderOffset",0),E(this,"renderCount",-1),E(this,"debugStats",{drawCalls:0,verticesDrawn:0,bufferUploadBytes:0}),E(this,"shadersLogged",!1),E(this,"pickProgram",null);var r=this.getDefinition();if(this.VERTICES=r.VERTICES,this.VERTEX_SHADER_SOURCE=r.VERTEX_SHADER_SOURCE,this.FRAGMENT_SHADER_SOURCE=r.FRAGMENT_SHADER_SOURCE,this.UNIFORMS=r.UNIFORMS,this.ATTRIBUTES=r.ATTRIBUTES,this.METHOD=r.METHOD,this.CONSTANT_ATTRIBUTES="CONSTANT_ATTRIBUTES"in r?r.CONSTANT_ATTRIBUTES:[],this.CONSTANT_DATA="CONSTANT_DATA"in r?r.CONSTANT_DATA:[],this.isInstanced="CONSTANT_ATTRIBUTES"in r,this.ATTRIBUTES_ITEMS_COUNT=Nn(this.ATTRIBUTES),this.STRIDE=this.VERTICES*this.ATTRIBUTES_ITEMS_COUNT,this.renderer=e,this.normalProgram=this.getProgramInfo("normal",a,r.VERTEX_SHADER_SOURCE,r.FRAGMENT_SHADER_SOURCE,null),this.pickProgram=this.getProgramInfo("pick",a,Pn(r.VERTEX_SHADER_SOURCE),Pn(r.FRAGMENT_SHADER_SOURCE),null),this.isInstanced){var i=Nn(this.CONSTANT_ATTRIBUTES);if(this.CONSTANT_DATA.length!==this.VERTICES)throw new Error("Program: error while getting constant data (expected ".concat(this.VERTICES," items, received ").concat(this.CONSTANT_DATA.length," instead)"));this.constantArray=new Float32Array(this.CONSTANT_DATA.length*i);for(var o=0;o<this.CONSTANT_DATA.length;o++){var s=this.CONSTANT_DATA[o];if(s.length!==i)throw new Error("Program: error while getting constant data (one vector has ".concat(s.length," items instead of ").concat(i,")"));for(var l=0;l<s.length;l++)this.constantArray[o*i+l]=s[l]}this.STRIDE=this.ATTRIBUTES_ITEMS_COUNT}}return K(n,[{key:"kill",value:function(){Fa(this.normalProgram),this.pickProgram&&Fa(this.pickProgram)}},{key:"resetDebugStats",value:function(){this.debugStats.drawCalls=0,this.debugStats.verticesDrawn=0,this.debugStats.bufferUploadBytes=0}},{key:"getProgramInfo",value:function(t,e,r,i,o){var s=e.createBuffer();if(s===null)throw new Error("Program: error while creating the WebGL buffer.");var l=Ht(e,r),u=$t(e,i),d=Vt(e,[l,u]),c={};this.UNIFORMS.forEach(function(p){var b=e.getUniformLocation(d,p);b&&(c[p]=b)});var f={};this.ATTRIBUTES.forEach(function(p){f[p.name]=e.getAttribLocation(d,p.name)});var h;if(this.isInstanced&&(this.CONSTANT_ATTRIBUTES.forEach(function(p){f[p.name]=e.getAttribLocation(d,p.name)}),h=e.createBuffer(),h===null))throw new Error("Program: error while creating the WebGL constant buffer.");return{name:t,program:d,gl:e,frameBuffer:o,buffer:s,constantBuffer:h||{},uniformLocations:c,attributeLocations:f,isPicking:t==="pick",vertexShader:l,fragmentShader:u}}},{key:"bindProgram",value:function(t){var e=this,r=0,i=t.gl,o=t.buffer;if(this.isInstanced){if(i.bindBuffer(i.ARRAY_BUFFER,t.constantBuffer),r=0,this.CONSTANT_ATTRIBUTES.forEach(function(d){return r+=e.bindAttribute(d,t,r,!1)}),this.uploadedConstantGeneration.get(t.constantBuffer)!==this.constantBufferGeneration){var l;i.bufferData(i.ARRAY_BUFFER,this.constantArray,i.STATIC_DRAW),this.uploadedConstantGeneration.set(t.constantBuffer,this.constantBufferGeneration),(l=this.renderer)!==null&&l!==void 0&&l.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.constantArray.byteLength)}if(i.bindBuffer(i.ARRAY_BUFFER,t.buffer),r=this.renderOffset*this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT,this.ATTRIBUTES.forEach(function(d){return r+=e.bindAttribute(d,t,r,!0)}),this.uploadedGeneration.get(o)!==this.bufferGeneration){var u;i.bufferData(i.ARRAY_BUFFER,this.floats,i.DYNAMIC_DRAW),this.uploadedGeneration.set(o,this.bufferGeneration),(u=this.renderer)!==null&&u!==void 0&&u.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength)}}else if(i.bindBuffer(i.ARRAY_BUFFER,o),r=0,this.ATTRIBUTES.forEach(function(d){return r+=e.bindAttribute(d,t,r)}),this.uploadedGeneration.get(o)!==this.bufferGeneration){var s;i.bufferData(i.ARRAY_BUFFER,this.floats,i.DYNAMIC_DRAW),this.uploadedGeneration.set(o,this.bufferGeneration),(s=this.renderer)!==null&&s!==void 0&&s.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength)}i.bindBuffer(i.ARRAY_BUFFER,null)}},{key:"unbindProgram",value:function(t){var e=this;this.isInstanced?(this.CONSTANT_ATTRIBUTES.forEach(function(r){return e.unbindAttribute(r,t,!1)}),this.ATTRIBUTES.forEach(function(r){return e.unbindAttribute(r,t,!0)})):this.ATTRIBUTES.forEach(function(r){return e.unbindAttribute(r,t)})}},{key:"bindAttribute",value:function(t,e,r,i){var o=Jl[t.type];if(typeof o!="number")throw new Error('Program.bind: yet unsupported attribute type "'.concat(t.type,'"'));var s=e.attributeLocations[t.name],l=e.gl;if(s!==-1){l.enableVertexAttribArray(s);var u=this.isInstanced?(i?this.ATTRIBUTES_ITEMS_COUNT:Nn(this.CONSTANT_ATTRIBUTES))*Float32Array.BYTES_PER_ELEMENT:this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT;l.vertexAttribPointer(s,t.size,t.type,t.normalized||!1,u,r),this.isInstanced&&i&&l.vertexAttribDivisor(s,1)}return t.size*o}},{key:"unbindAttribute",value:function(t,e,r){var i=e.attributeLocations[t.name],o=e.gl;i!==-1&&(o.disableVertexAttribArray(i),this.isInstanced&&r&&o.vertexAttribDivisor(i,0))}},{key:"reallocate",value:function(t){t!==this.capacity&&(this.capacity=t,this.verticesCount=this.VERTICES*t,this.floats=new Float32Array(this.isInstanced?this.capacity*this.ATTRIBUTES_ITEMS_COUNT:this.verticesCount*this.ATTRIBUTES_ITEMS_COUNT),this.ints=new Uint32Array(this.floats.buffer),this.invalidateBuffers())}},{key:"invalidateBuffers",value:function(){this.bufferGeneration++,this.constantBufferGeneration++}},{key:"hasNothingToRender",value:function(){return this.verticesCount===0}},{key:"setTypedUniform",value:function(t,e){var r;Ba(e.gl,(r=e.uniformLocations[t.name])!==null&&r!==void 0?r:null,t)}},{key:"renderProgram",value:function(t,e){var r=e.gl,i=e.program,o=e.isPicking;o?r.disable(r.BLEND):r.enable(r.BLEND),r.useProgram(i),this.setUniforms(t,e),this.drawWebGL(this.METHOD,e)}},{key:"render",value:function(t,e,r){var i;if(!this.shadersLogged&&(i=this.renderer)!==null&&i!==void 0&&i.getSetting("DEBUG_logShaders")&&(this.shadersLogged=!0,console.log("[sigma] DEBUG_logShaders: ".concat(this.constructor.name),{normal:{vertexShaderSource:this.VERTEX_SHADER_SOURCE,fragmentShaderSource:this.FRAGMENT_SHADER_SOURCE},pick:{vertexShaderSource:Pn(this.VERTEX_SHADER_SOURCE),fragmentShaderSource:Pn(this.FRAGMENT_SHADER_SOURCE)}})),!this.hasNothingToRender()){this.renderOffset=e??0,this.renderCount=r??-1;var o=this.normalProgram.gl;if(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,t.width*t.pixelRatio,t.height*t.pixelRatio),this.bindProgram(this.normalProgram),this.renderProgram(t,this.normalProgram),this.unbindProgram(this.normalProgram),this.pickProgram&&t.pickingFrameBuffer){var s=Math.ceil(t.width*t.pixelRatio/t.downSizingRatio),l=Math.ceil(t.height*t.pixelRatio/t.downSizingRatio);o.bindFramebuffer(o.FRAMEBUFFER,t.pickingFrameBuffer),o.viewport(0,0,s,l),this.bindProgram(this.pickProgram),this.renderProgram(t,this.pickProgram),this.unbindProgram(this.pickProgram),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,t.width*t.pixelRatio,t.height*t.pixelRatio)}}}},{key:"drawWebGL",value:function(t,e){var r,i=e.gl,o=this.renderCount>=0?this.renderCount:this.capacity;(r=this.renderer)!==null&&r!==void 0&&r.getSetting("DEBUG_logRenderStats")&&(this.debugStats.drawCalls++,this.debugStats.verticesDrawn+=o*this.VERTICES),this.isInstanced?i.drawArraysInstanced(t,0,this.VERTICES,o):i.drawArrays(t,this.renderOffset*this.VERTICES,o*this.VERTICES)}}])})(),We=2,qt=7,Ci={below:0,above:1,left:2,right:3};function eu(){var n=`#version 300 es
precision highp float;

uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;

uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

// Atlas size is fixed at 2048\xD72048 \u2014 matches AttachmentManager.ATLAS_SIZE.
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;           // node-data texture index
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // attachment dimensions (CSS px)
in float a_positionMode;        // label position: 0=right 1=left 2=above 3=below 4=over
in float a_attachmentPlacement; // 0=below 1=above 2=left 3=right (relative to label)
in float a_labelWidth;          // label width (CSS px)
in float a_labelHeight;         // label height: font line box (CSS px)
in float a_textHeight;          // actual glyph height (CSS px)
in float a_labelAngle;          // label rotation angle (radians)

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

`.concat(we,`
`).concat(Ue,`
`).concat(Qe,`
`).concat(Oa,`
`).concat(On,`

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; we just read the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  vec3 nodeClip = u_matrix * vec3(nodePos, 1.0);

  // Node radius in physical pixels (matches label/background).
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusPixels = nodeRadiusGraphSpace * matrixScaleX * u_resolution.x / 2.0;

  // CSS-px inputs -> physical px, scaled by the zoom-dependent label ratio, so
  // the attachment stays glued to the label box exactly as the label scales.
  float zoomScale = u_zoomLabelSizeRatio;
  vec2 labelHalf = vec2(a_labelWidth, a_labelHeight) * 0.5 * zoomScale * u_pixelRatio;
  vec2 attachHalf = a_attachmentSize * 0.5 * zoomScale * u_pixelRatio;
  float gap = `).concat(We.toFixed(1),` * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Graph-aligned labels add the camera angle so the attachment orbits with the box.
  mat2 labelRotMat = rotate2D(a_labelAngle - labelRotation * u_cameraAngle);

  // Label box center relative to the node center (pre-rotation). The shape-aware
  // edge distance comes from the frame texture, so placement matches the label.
  vec2 boxCenter = vec2(0.0);
  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * 0.5 * zoomScale * u_pixelRatio;
    boxCenter = labelBoxCenter(a_positionMode, labelStart, labelHalf, textHalf);
  }

  // Horizontal anchor of below/above attachments tracks the label position, so
  // the attachment hangs from the label edge nearest the node (or is centered
  // when the label itself is node-centered): right->left, left->right, else center.
  float anchorX = 0.0;
  if (a_positionMode < 0.5) anchorX = -labelHalf.x + attachHalf.x;       // right label
  else if (a_positionMode < 1.5) anchorX = labelHalf.x - attachHalf.x;   // left label

  // Attachment center relative to the box (pre-rotation, Y-down). This offset
  // depends only on the box, the gap and the attachment size \u2014 never the shape.
  vec2 attachCenter;
  if (a_attachmentPlacement < 0.5) {
    // below
    attachCenter = boxCenter + vec2(anchorX, labelHalf.y + gap + attachHalf.y);
  } else if (a_attachmentPlacement < 1.5) {
    // above
    attachCenter = boxCenter + vec2(anchorX, -(labelHalf.y + gap + attachHalf.y));
  } else if (a_attachmentPlacement < 2.5) {
    // left, top-aligned
    attachCenter = boxCenter + vec2(-(labelHalf.x + gap + attachHalf.x), -labelHalf.y + attachHalf.y);
  } else {
    // right, top-aligned
    attachCenter = boxCenter + vec2(labelHalf.x + gap + attachHalf.x, -labelHalf.y + attachHalf.y);
  }

  // Rotate the whole assembly by the label angle, around the node center.
  vec2 rotatedCenter = labelRotMat * attachCenter;
  vec2 cornerOffset = labelRotMat * (a_quadCorner * attachHalf);

  // Node center in screen px (Y-down).
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;

  // Snap node center to the pixel grid so label/backdrop/attachment move as one.
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left to integer pixels so atlas texels map 1:1.
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - attachHalf;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + attachHalf;

  vec2 vertexScreen = centerScreen + cornerOffset;
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`);return n}var tu=`#version 300 es
precision highp float;

uniform sampler2D u_atlasTexture;

in vec2 v_texCoord;

layout(location = 0) out vec4 fragColor;
#ifdef PICKING_MODE
layout(location = 1) out vec4 pickColor;
#endif

void main() {
  // Canvas textures are premultiplied; output directly for (ONE, 1-SRC_ALPHA) blending
  vec4 color = texture(u_atlasTexture, v_texCoord);
  if (color.a < 0.01) discard;
  fragColor = color;
#ifdef PICKING_MODE
  pickColor = vec4(0.0); // Attachments are not pickable
#endif
}
`;function nu(n,a,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:Ze,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=eu(),c=tu,f=(function(h){function p(){var b;Y(this,p);for(var v=arguments.length,g=new Array(v),m=0;m<v;m++)g[m]=arguments[m];return b=ne(this,p,[].concat(g)),E(b,"totalCount",0),E(b,"bufferCapacity",0),b}return ae(p,h),K(p,[{key:"getDefinition",value:function(){var v=WebGL2RenderingContext,g=v.FLOAT,m=v.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:c,METHOD:m,UNIFORMS:["u_matrix","u_resolution","u_labelPixelSnapping","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_atlasTexture"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:g},{name:"a_atlasRect",size:4,type:g},{name:"a_attachmentSize",size:2,type:g},{name:"a_positionMode",size:1,type:g},{name:"a_attachmentPlacement",size:1,type:g},{name:"a_labelWidth",size:1,type:g},{name:"a_labelHeight",size:1,type:g},{name:"a_textHeight",size:1,type:g},{name:"a_labelAngle",size:1,type:g}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:g}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processAttachment",value:function(v,g){var m=this.floats,y=v*this.STRIDE;m[y++]=g.nodeIndex,m[y++]=g.atlasX,m[y++]=g.atlasY,m[y++]=g.atlasW,m[y++]=g.atlasH,m[y++]=g.attachWidth,m[y++]=g.attachHeight,m[y++]=g.positionMode,m[y++]=g.attachmentPlacement,m[y++]=g.labelWidth,m[y++]=g.labelHeight,m[y++]=g.textHeight,m[y++]=g.labelAngle}},{key:"setUniforms",value:function(v,g){var m=g.gl,y=g.uniformLocations;m.uniformMatrix3fv(y.u_matrix,!1,v.matrix),m.uniform2f(y.u_resolution,v.width*v.pixelRatio,v.height*v.pixelRatio),m.uniform1f(y.u_labelPixelSnapping,v.labelPixelSnapping),m.uniform1f(y.u_sizeRatio,v.sizeRatio),m.uniform1f(y.u_correctionRatio,v.correctionRatio),m.uniform1f(y.u_cameraAngle,v.cameraAngle),m.uniform1f(y.u_pixelRatio,v.pixelRatio),m.uniform1f(y.u_labelMargin,p.labelMargin),m.uniform1f(y.u_zoomLabelSizeRatio,1/u(v.zoomRatio)),m.uniform1i(y.u_nodeDataTexture,v.nodeDataTextureUnit),m.uniform1i(y.u_nodeDataTextureWidth,v.nodeDataTextureWidth),m.uniform1i(y.u_nodeFrameTexture,v.nodeFrameTextureUnit),m.uniform1i(y.u_nodeFrameTextureWidth,v.nodeFrameTextureWidth),m.uniform1i(y.u_atlasTexture,qt)}},{key:"reallocateAttachments",value:function(v){this.totalCount=v,v>this.bufferCapacity&&(this.bufferCapacity=Math.max(v,Math.ceil(this.bufferCapacity*1.5)||10),re(p,"reallocate",this,3)([this.bufferCapacity]))}},{key:"hasNothingToRender",value:function(){return this.totalCount===0}},{key:"drawWebGL",value:function(v,g){var m=g.gl;this.totalCount!==0&&m.drawArraysInstanced(v,0,this.VERTICES,this.totalCount)}}])})(Ce);return E(f,"labelMargin",l),new f(n,a,t)}var Oe=5;function $n(n,a){return[].concat($(a),$(n.map(function(t){var e;return{attributes:(e=t.attributes)!==null&&e!==void 0?e:[]}})))}function gt(n,a){var t=be($n(n,a)),e=new Set(n.flatMap(function(u){var d;return(d=u.attributes)!==null&&d!==void 0?d:[]}).map(function(u){return u.name.replace(/^a_/,"")})),r={},i={},o=M(e),s;try{for(o.s();!(s=o.n()).done;){var l=s.value;r[l]=t.offsets[l],i[l]=t.specs[l]}}catch(u){o.e(u)}finally{o.f()}return O(O({},t),{},{offsets:r,specs:i})}function Li(n,a){var t=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pickingPadding","u_nodeDataTexture","u_layerAttributeTexture"]),e=new Set,r=n.flatMap(function(h){return h.uniforms}).filter(function(h){return t.has(h.name)||e.has(h.name)?!1:(e.add(h.name),!0)}).map(function(h){return"uniform ".concat(h.type," ").concat(h.name,";")}).join(`
`),i=a.flatMap(function(h){return h.uniforms}).filter(function(h){return t.has(h.name)||e.has(h.name)?!1:(e.add(h.name),!0)}).map(function(h){return"uniform ".concat(h.type," ").concat(h.name,";")}).join(`
`),o=$n(n,a),s=new Set,l=o.flatMap(function(h){return h.attributes}).filter(function(h){var p=h.name.replace(/^a_/,"");return s.has(p)?!1:(s.add(p),!0)}).map(function(h){var p=h.name.replace(/^a_/,""),b=h.size===1?"float":"vec".concat(h.size);return"out ".concat(b," v_").concat(p,";")}).join(`
`),u=ct(be(o),{varPrefix:"layer",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),d=u.fetchCode,c=u.varyingAssignments,f=`#version 300 es

// Standard node attributes (per instance) - minimal buffer usage
in float a_nodeIndex;  // Index into node data texture AND layer attribute texture
in vec4 a_id;          // Node ID for picking
in float a_opacity;    // Node opacity, applied once to the final fragment

// Constant attributes (per vertex, same for all instances)
in vec2 a_quadCorner;  // (-1,-1), (1,-1), (1,1), (-1,1) for quad corners

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;

// Layer attribute texture uniforms
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

`.concat(r,`
`).concat(i,`

// Standard varyings
out vec2 v_uv;                    // Normalized coordinates [-1, 1]
out vec4 v_id;
out float v_opacity;
out float v_antialiasingWidth;    // Width for antialiasing in UV space
out float v_pixelSize;            // Node size in pixels (for pixel-mode borders)
out float v_pixelToUV;            // Conversion factor: multiply by this to convert screen pixels to UV units
out float v_shapeId;              // Shape ID for multi-shape programs

// Layer varyings
`).concat(l,`

// Node-data fetch helpers (geometry texel + rotation-flags texel)
`).concat(we,`
`).concat(Ue,`

void main() {
  // Fetch node geometry: vec4(x, y, size, shapeId).
  int nodeIdx = int(a_nodeIndex);

  // Hidden nodes are flagged with a negative row by NodeProgram.process(). Push
  // the whole quad outside the clip volume: every vertex lands at the same
  // out-of-range position, so the primitive is fully clipped and rasterizes
  // nothing \u2014 neither to the frame buffer nor to the picking buffer.
  if (nodeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    return;
  }

  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_position = nodeData.xy;
  float a_size = nodeData.z;
  v_shapeId = nodeData.w;  // Pass shape ID to fragment shader

  // Per-node rotation alignment: 0 = viewport (screen-upright), 1 = graph.
  float nodeRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).r;

`).concat(d,`

  // Calculate the actual size in pixels
  float size = a_size * u_correctionRatio / u_sizeRatio * 2.0;

  // In PICKING_MODE, inflate the quad by nodePickingPadding pixels on each side
  #ifdef PICKING_MODE
    float paddedSize = size + u_pickingPadding * u_correctionRatio;
    vec2 offset = a_quadCorner * paddedSize;
  #else
    vec2 offset = a_quadCorner * size;
  #endif
  // Counter-rotate the quad offset so viewport-aligned nodes stay upright as the
  // camera turns. Graph-aligned nodes (nodeRotation=1) skip it and turn with the
  // camera. The angle scales by (1 - nodeRotation) so both fall out of one path.
  {
    float ca = u_cameraAngle * (1.0 - nodeRotation);
    float c = cos(ca);
    float s = sin(ca);
    offset = mat2(c, s, -s, c) * offset;
  }
  vec2 position = a_position + offset;

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  // In PICKING_MODE, UV is scaled beyond [-1, 1] to match the inflated quad
  #ifdef PICKING_MODE
    v_uv = a_quadCorner * (paddedSize / size);
  #else
    v_uv = a_quadCorner;
  #endif

  // Pass ID to fragment shader
  v_id = a_id;
  v_opacity = a_opacity;

  // Pass pixel size for layers that need pixel-mode calculations
  // Multiply by 2 because 'size' is half-width (offset from center), not full diameter
  v_pixelSize = size * 2.0;

  // Conversion factor from screen pixels to UV units
  // Same derivation as v_antialiasingWidth which represents ~1 pixel in UV space
  // P pixels in UV space = P * u_correctionRatio / size
  v_pixelToUV = u_correctionRatio / size;

  // We use an antialiasing width of 1px (so v_pixelToUV)
  v_antialiasingWidth = v_pixelToUV;

  // Pass layer attributes to fragment shader (fetched from texture)
`).concat(c,`
}
`);return f}function Pi(n,a,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!0,r=a.map(function(p,b){var v="layer_".concat(p.name),g=[].concat($(p.attributes.map(function(m){return"v_".concat(m.name.replace(/^a_/,""))})),$(p.uniforms.map(function(m){return m.name}))).join(", ");return"  // Layer ".concat(b+1,": ").concat(p.name,`
  color = blendOver(color, `).concat(v,"(").concat(g,"));")}).join(`

`),i=new Set(["u_correctionRatio"]),o=new Set,s=n.flatMap(function(p){return p.uniforms}).filter(function(p){return i.has(p.name)||o.has(p.name)?!1:(o.add(p.name),!0)}).map(function(p){return"uniform ".concat(p.type," ").concat(p.name,";")}).join(`
`),l=a.flatMap(function(p){return p.uniforms}).filter(function(p){return i.has(p.name)||o.has(p.name)?!1:(o.add(p.name),!0)}).map(function(p){return"uniform ".concat(p.type," ").concat(p.name,";")}).join(`
`),u=new Set,d=$n(n,a).flatMap(function(p){return p.attributes}).filter(function(p){var b=p.name.replace(/^a_/,"");return u.has(b)?!1:(u.add(b),!0)}).map(function(p){var b=p.name.replace(/^a_/,""),v=p.size===1?"float":"vec".concat(p.size);return"in ".concat(v," v_").concat(b,";")}).join(`
`),c=zn(n),f=_i(n,t),h=`#version 300 es
precision highp float;

// Standard varyings
in vec2 v_uv;
in vec4 v_id;
in float v_opacity;
in float v_antialiasingWidth;
in float v_pixelSize;
in float v_pixelToUV;
in float v_shapeId;  // Shape ID for multi-shape programs

// Standard uniforms (needed for some layer calculations like pixel-mode borders)
uniform float u_correctionRatio;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Shape uniforms
`.concat(s,`

// Layer uniforms
`).concat(l,`

// Layer varyings
`).concat(d,`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// LayerContext struct - provides rendering context to all layers
struct LayerContext {
  float sdf;             // Signed distance from shape boundary (negative inside)
  vec2 uv;               // UV coordinates [-1, 1], center at (0,0)
  float shapeSize;       // Effective shape size (~diameter) in UV space (1.0 - aaWidth)
  float shapeHalfSize;   // Effective shape half size (~radius) in UV space
  float pixelSize;       // Node full size (~diameter) in screen pixels
  float aaWidth;         // Anti-aliasing width for smooth transitions
  float correctionRatio; // Scaling factor for consistent rendering across zoom levels
  float pixelToUV;       // Conversion factor: multiply screen pixels by this to get UV units
  float inradiusFactor;  // Ratio of inradius to circumradius (shape depth factor)
};

LayerContext context;  // Global instance, populated before layer calls

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// SDF shape functions
`).concat(c,`

// Shape selector function (sets context.sdf and context.inradiusFactor)
`).concat(f,`

// Layer functions
`).concat(a.map(function(p){return p.glsl}).join(`

`),`

void main() {
  // 1. Setup LayerContext (available to all layer functions)
  context.shapeSize = 1.0 - v_antialiasingWidth;
  context.shapeHalfSize = context.shapeSize * 0.5;
  context.pixelSize = v_pixelSize;
  context.uv = v_uv;
  context.aaWidth = v_antialiasingWidth;
  context.correctionRatio = u_correctionRatio;
  context.pixelToUV = v_pixelToUV;

  // Query shape SDF based on shapeId (sets context.sdf and context.inradiusFactor)
  queryNodeSDF(int(v_shapeId), v_uv, context.shapeSize);

  // 2. Early discard for pixels fully outside the shape (with AA margin)
  // In PICKING_MODE, allow extra fragments up to the picking padding distance
  #ifdef PICKING_MODE
    if (context.sdf > u_pickingPadding * v_pixelToUV + context.aaWidth) discard;
  #else
    if (context.sdf > context.aaWidth) discard;
  #endif

  // 3. Apply layers sequentially with "over" compositing
  vec4 color = vec4(0.0);

`).concat(r,`

  #ifdef PICKING_MODE
    // Picking pass: output node ID for pixels within the picking area.
    if (context.sdf > u_pickingPadding * v_pixelToUV) discard;
    fragColor = v_id;
  #else
`).concat(e?`    // Visual pass: apply antialiasing at shape boundary, node opacity once
    // smoothstep provides smooth transition from opaque to transparent
    float alpha = smoothstep(context.aaWidth, -context.aaWidth, context.sdf) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) shape boundary, node opacity applied once
    float alpha = (context.sdf < 0.0 ? 1.0 : 0.0) * v_opacity;`,`
    // Mix with transparent to fade both color AND alpha together (avoids bright halo)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`);return h}function Fi(n,a){var t=new Set;return t.add("u_matrix"),t.add("u_sizeRatio"),t.add("u_correctionRatio"),t.add("u_cameraAngle"),t.add("u_pickingPadding"),t.add("u_nodeDataTexture"),t.add("u_nodeDataTextureWidth"),t.add("u_layerAttributeTexture"),t.add("u_layerAttributeTextureWidth"),t.add("u_layerAttributeTexelsPerNode"),n.forEach(function(e){e.uniforms.forEach(function(r){return t.add(r.name)})}),a.forEach(function(e){e.uniforms.forEach(function(r){return t.add(r.name)})}),Array.from(t)}function ki(n){var a=WebGL2RenderingContext,t=a.UNSIGNED_BYTE,e=a.FLOAT;return[{name:"a_nodeIndex",size:1,type:e},{name:"a_id",size:4,type:t,normalized:!0},{name:"a_opacity",size:1,type:e}]}function Ia(n){var a=n.shapes,t=n.layers,e=n.shapeGlobalIds,r=n.antialias,i=r===void 0?!0:r;return{vertexShader:Li(a,t),fragmentShader:Pi(a,t,e,i),uniforms:Fi(a,t),attributes:ki()}}function Ii(n,a,t){var e=gt(n,a),r=e.specs;return Object.keys(r).map(function(i){return"flat ".concat(t," ").concat(r[i].size===1?"float":"vec".concat(r[i].size)," v_").concat(i,";")}).join(`
`)}function Ni(n){var a,t,e=n.shapes,r=n.layers,i=n.shapeGlobalIds,o=ct(gt(e,r),{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),s=e.length===1?"float inradiusFactor = ".concat(te((a=e[0].inradiusFactor)!==null&&a!==void 0?a:1),";"):"float inradiusFactor = ".concat(te((t=e[0].inradiusFactor)!==null&&t!==void 0?t:1),`;
  switch (int(shapeId)) {
`).concat(e.map(function(u,d){var c,f=i?i[d]:d;return"    case ".concat(f,": inradiusFactor = ").concat(te((c=u.inradiusFactor)!==null&&c!==void 0?c:1),"; break;")}).join(`
`),`
    default: break;
  }`),l=`#version 300 es

in float a_nodeIndex;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in vec4 a_backdropColor;
in vec4 a_backdropShadowColor;
in float a_backdropShadowBlur;
in float a_backdropPadding;
in vec4 a_backdropBorderColor;
in vec4 a_backdropExtra; // [borderWidth, cornerRadius, labelPadding, area]
in vec2 a_labelBoxOffset;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

out vec2 v_uv;
out vec2 v_nodeCenter;
out float v_nodeRadius;
out vec2 v_labelCenter;
out vec2 v_labelHalfSize;
out float v_aaWidth;
out float v_shapeId;
out float v_nodeRotation;
out float v_labelAngle;
out vec4 v_backdropColor;
out vec4 v_backdropShadowColor;
out float v_backdropShadowBlur;
out float v_backdropPadding;
out vec4 v_backdropBorderColor;
out float v_backdropBorderWidth;
out float v_backdropCornerRadius;
out float v_backdropArea;
`.concat(Ii(e,r,"out"),`

`).concat(we,`
`).concat(Ue,`
`).concat(Qe,`

void main() {
  int nodeIdx = int(a_nodeIndex);
`).concat(o.fetchCode,`
`).concat(o.varyingAssignments,`

  // Node data: (x, y, size, shapeId). shapeId (global) is forwarded to the
  // fragment shader, which keeps the shape SDF for the outline.
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;
  float shapeId = nodeData.w;

  // Per-node rotation alignment (0 = viewport, 1 = graph). nodeRotation drives
  // the fragment's shape outline; labelRotation turns the label box with camera.
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;
  v_nodeRotation = nodeRotation;

  `).concat(za,`
  // CSS pixel attributes are multiplied by u_pixelRatio to match nodeRadiusPixels,
  // which is already in physical pixels (nodeRadiusNDC * u_resolution.x / 2.0).
  float padding = a_backdropPadding * u_pixelRatio;
  float shadowBlur = a_backdropShadowBlur * u_pixelRatio;
  // Unpack a_backdropExtra: [borderWidth, cornerRadius, labelPadding, area]
  float borderWidth = a_backdropExtra.x * u_pixelRatio;
  float cornerRadius = a_backdropExtra.y * u_pixelRatio;
  float labelPad = a_backdropExtra.z * u_pixelRatio;
  float backdropArea = a_backdropExtra.w;
  // Use 2x shadowBlur so the Gaussian fully decays before the quad edge
  float totalExpansion = shadowBlur * 2.0 + borderWidth;
  float enlargedRadius = nodeRadiusPixels + padding;

  // Circumscribed radius for the quad bounds. Non-circular shapes reach past
  // their inradius out to their circumradius (= enlargedRadius / inradiusFactor),
  // in any direction once rotated. The axis-aligned quad must contain that, or
  // the fill/shadow gets clipped (square corners, triangle tip, etc.).
  `).concat(s,`
  float boundRadius = enlargedRadius / inradiusFactor;

  // Apply zoom-dependent label size scaling
  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Only apply labelPad when a label is actually present
  float effectiveLabelPad = labelW > 0.0 ? labelPad : 0.0;
  vec2 labelHalfSize = vec2(labelW * 0.5 + effectiveLabelPad, labelH * 0.5 + effectiveLabelPad);
  vec2 labelOffset = vec2(0.0);

  // Effective label angle: intrinsic angle plus the camera angle when the label
  // is graph-aligned, so the box orbits the node in lockstep with the frame-pass.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 snapDelta = vec2(0.0);

  if (labelW > 0.0) {
    // labelW > 0.0 means this node's label is displayed, so the frame-pass wrote
    // its edge distance this frame.
    float edgeDistPixels = nodeRadiusPixels * readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;
    // labelMargin matches the label shader's margin (gap from node edge to text)
    float labelStart = edgeDistPixels + labelMargin;
    // Above/below center on the actual glyph height, not the font line box, so
    // the box stays aligned with the rendered text (matches labelBoxCenter()).
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;

    // Snap node center to pixel grid so label/backdrop/attachment move as a unit
    vec2 nodeScreen = vec2(
      (nodeClip.x + 1.0) * u_resolution.x,
      (1.0 - nodeClip.y) * u_resolution.y
    ) * 0.5;
    snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

    if (a_positionMode < 0.5) {
      // Right: box spans from node center to text end + padding
      float boxRightEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(boxRightEdge * 0.5, 0.0);
      labelHalfSize.x = boxRightEdge * 0.5;
    } else if (a_positionMode < 1.5) {
      // Left: mirror of right
      float boxLeftEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(-boxLeftEdge * 0.5, 0.0);
      labelHalfSize.x = boxLeftEdge * 0.5;
    } else if (a_positionMode < 2.5) {
      // Above: text bottom at labelStart, centered horizontally
      labelOffset = vec2(0.0, -(labelStart + textHalf));
    } else if (a_positionMode < 3.5) {
      // Below: text top at labelStart, centered horizontally
      labelOffset = vec2(0.0, labelStart + textHalf);
    }
    // over (>=4): labelOffset stays (0,0) \u2014 text centered on the node.

    // The attachment-cover shift is in label space (like the attachment itself),
    // so rotate it together with the position offset \u2014 otherwise the box drifts
    // off the attachment as the label angle grows.
    labelOffset = labelRotMat * (labelOffset + a_labelBoxOffset * zoomScale * u_pixelRatio);
  }

  // For node-only mode, zero out label dimensions
  if (backdropArea > 0.5 && backdropArea < 1.5) {
    labelHalfSize = vec2(0.0);
    labelOffset = vec2(0.0);
  }

  vec2 minBound, maxBound;

  bool hasLabelBounds = labelW > 0.0 && (backdropArea > 1.5 || backdropArea < 0.5);

  if (hasLabelBounds) {
    // Union with label bounds (area=both) or label-only bounds (area=label)
    vec2 labelMin, labelMax;

    if (a_labelAngle != 0.0) {
      vec2 corner1 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, -labelHalfSize.y);
      vec2 corner2 = labelOffset + labelRotMat * vec2(labelHalfSize.x, -labelHalfSize.y);
      vec2 corner3 = labelOffset + labelRotMat * vec2(labelHalfSize.x, labelHalfSize.y);
      vec2 corner4 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, labelHalfSize.y);
      labelMin = min(min(corner1, corner2), min(corner3, corner4));
      labelMax = max(max(corner1, corner2), max(corner3, corner4));
    } else {
      labelMin = labelOffset - labelHalfSize;
      labelMax = labelOffset + labelHalfSize;
    }

    if (backdropArea > 1.5) {
      // Label-only: bounds from label rect only
      minBound = labelMin - totalExpansion;
      maxBound = labelMax + totalExpansion;
    } else {
      // Both: union of node + label
      minBound = min(-vec2(boundRadius), labelMin) - totalExpansion;
      maxBound = max(vec2(boundRadius), labelMax) + totalExpansion;
    }
  } else {
    // Node-only or no visible label
    float totalRadius = boundRadius + totalExpansion;
    minBound = -vec2(totalRadius);
    maxBound = vec2(totalRadius);
  }

  vec2 quadSize = maxBound - minBound;
  vec2 quadCenter = (minBound + maxBound) * 0.5;

  vec2 localPos = quadCenter + a_quadCorner * quadSize * 0.5 + snapDelta;
  vec2 ndcOffset = localPos * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);

  v_uv = localPos;
  v_nodeCenter = vec2(0.0);
  v_nodeRadius = nodeRadiusPixels;
  v_labelCenter = labelOffset;
  v_labelHalfSize = labelHalfSize;
  v_aaWidth = 1.0;
  v_shapeId = shapeId;
  v_labelAngle = labelAngle;
  v_backdropColor = a_backdropColor;
  v_backdropShadowColor = a_backdropShadowColor;
  v_backdropShadowBlur = a_backdropShadowBlur;
  v_backdropPadding = a_backdropPadding;
  v_backdropBorderColor = a_backdropBorderColor;
  v_backdropBorderWidth = borderWidth;
  v_backdropCornerRadius = cornerRadius;
  v_backdropArea = backdropArea;
}
`);return l}function Gi(n){var a=n.shapes,t=n.layers,e=n.shapeGlobalIds,r=zn(a),i=ft(a).map(function(f){return"uniform ".concat(f.type," ").concat(f.name,";")}).join(`
`),o=function(h){return jt(h,"nodeUV","1.0")},s;if(a.length===1)s="float nodeSdfNormalized = ".concat(o(a[0]),";");else{var l=a.map(function(f,h){var p=e?e[h]:h;return"    case ".concat(p,": nodeSdfNormalized = ").concat(o(f),"; break;")}).join(`
`),u=o(a[0]);s=`float nodeSdfNormalized;
  int shapeId = int(v_shapeId);
  switch (shapeId) {
`.concat(l,`
    default: nodeSdfNormalized = `).concat(u,`;
  }`)}var d=`float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  float ca = u_cameraAngle * v_nodeRotation;
  float ca_c = cos(ca);
  float ca_s = sin(ca);
  vec2 rotatedScreenUV = mat2(ca_c, -ca_s, ca_s, ca_c) * screenUV;
  vec2 nodeUV = vec2(rotatedScreenUV.x, -rotatedScreenUV.y) / effectiveRadius;`,c=`#version 300 es
precision highp float;

in vec2 v_uv;
in vec2 v_nodeCenter;
in float v_nodeRadius;
in vec2 v_labelCenter;
in vec2 v_labelHalfSize;
in float v_aaWidth;
in float v_shapeId;
in float v_nodeRotation;
in float v_labelAngle;
in vec4 v_backdropColor;
in vec4 v_backdropShadowColor;
in float v_backdropShadowBlur;
in float v_backdropPadding;
in vec4 v_backdropBorderColor;
in float v_backdropBorderWidth;
in float v_backdropCornerRadius;
in float v_backdropArea;
`.concat(Ii(a,t,"in"),`

uniform float u_cameraAngle;
`).concat(i,`

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragPicking;

`).concat(r,`
`).concat(Ti,`
`).concat(Ei,`
`).concat(Si,`
`).concat(Ri,`

void main() {
  vec4 backdropColor = v_backdropColor;
  vec4 shadowColor = v_backdropShadowColor;
  float shadowBlur = v_backdropShadowBlur;
  float padding = v_backdropPadding;
  vec4 borderColor = v_backdropBorderColor;
  float borderWidth = v_backdropBorderWidth;
  float cornerRadius = v_backdropCornerRadius;

  float enlargedRadius = v_nodeRadius + padding;
  vec2 screenUV = v_uv - v_nodeCenter;
  `).concat(d,`

  // Query the correct shape SDF based on shapeId
  `).concat(s,`
  float nodeSdfPixels = nodeSdfNormalized * effectiveRadius - cornerRadius;

  // Label SDF with optional corner radius and rotation
  float labelSdfPixels;
  if (v_labelHalfSize.x > 0.0) {
    vec2 labelP = v_uv - v_labelCenter;
    labelSdfPixels = sdfRoundedRotatedBox(labelP, v_labelHalfSize, v_labelAngle, cornerRadius);
  } else {
    labelSdfPixels = 10000.0;
  }

  // Select area: 0=both, 1=node, 2=label
  float combinedSdf;
  if (v_backdropArea > 1.5) {
    combinedSdf = labelSdfPixels;
  } else if (v_backdropArea > 0.5) {
    combinedSdf = nodeSdfPixels;
  } else {
    combinedSdf = min(nodeSdfPixels, labelSdfPixels);
  }

  // Fill + border composite
  float outerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf);
  vec4 background;
  if (borderWidth > 0.5) {
    float innerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf + borderWidth);
    float fillAlpha = innerEdge * backdropColor.a;
    vec4 fill = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
    float borderAlpha = (outerEdge - innerEdge) * borderColor.a;
    vec4 border = vec4(borderColor.rgb * borderAlpha, borderAlpha);
    background = fill + border * (1.0 - fill.a);
  } else {
    float fillAlpha = outerEdge * backdropColor.a;
    background = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
  }

  // Gaussian-like shadow falloff (mimics canvas shadowBlur)
  vec4 shadow = vec4(0.0);
  float sigma = shadowBlur / 2.5;
  if (sigma > 0.001) {
    float shadowDist = max(0.0, combinedSdf);
    float shadowAlpha = exp(-(shadowDist * shadowDist) / (2.0 * sigma * sigma)) * shadowColor.a;
    shadow = vec4(shadowColor.rgb * shadowAlpha, shadowAlpha);
  }

  fragColor = background + shadow * (1.0 - background.a);
  fragPicking = vec4(0.0);
}
`);return c}function zi(n){var a=["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"],t=M(ft(n)),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;a.includes(r.name)||a.push(r.name)}}catch(i){t.e(i)}finally{t.f()}return a}function Mi(n){return{vertexShader:Ni(n),fragmentShader:Gi(n),uniforms:zi(n.shapes)}}function Oi(n,a,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=e.shapes,u=e.layers,d=e.getAttributeTexture,c=e.shapeGlobalIds;if(l.length===0)throw new Error("createBackdropProgram: at least one shape must be provided in 'shapes'");var f=(r=s.margin)!==null&&r!==void 0?r:5,h=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},p={shapes:l,layers:u,shapeGlobalIds:c},b=Mi(p),v=(function(g){function m(){var y;Y(this,m);for(var T=arguments.length,x=new Array(T),_=0;_<T;_++)x[_]=arguments[_];return y=ne(this,m,[].concat(x)),E(y,"totalBackdropCount",0),E(y,"bufferCapacity",0),y}return ae(m,g),K(m,[{key:"getDefinition",value:function(){var T=WebGL2RenderingContext,x=T.FLOAT,_=T.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:b.vertexShader,FRAGMENT_SHADER_SOURCE:b.fragmentShader,METHOD:_,UNIFORMS:b.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:x},{name:"a_labelWidth",size:1,type:x},{name:"a_labelHeight",size:1,type:x},{name:"a_textHeight",size:1,type:x},{name:"a_positionMode",size:1,type:x},{name:"a_labelAngle",size:1,type:x},{name:"a_backdropColor",size:4,type:x},{name:"a_backdropShadowColor",size:4,type:x},{name:"a_backdropShadowBlur",size:1,type:x},{name:"a_backdropPadding",size:1,type:x},{name:"a_backdropBorderColor",size:4,type:x},{name:"a_backdropExtra",size:4,type:x},{name:"a_labelBoxOffset",size:2,type:x}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:x}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processBackdrop",value:function(T,x){var _=this.floats,R=this.STRIDE,S=T*R;_[S++]=x.nodeIndex,_[S++]=x.labelWidth,_[S++]=x.labelHeight,_[S++]=x.textHeight,_[S++]=Ke[x.position],_[S++]=x.labelAngle,_[S++]=x.backdropColor[0],_[S++]=x.backdropColor[1],_[S++]=x.backdropColor[2],_[S++]=x.backdropColor[3],_[S++]=x.backdropShadowColor[0],_[S++]=x.backdropShadowColor[1],_[S++]=x.backdropShadowColor[2],_[S++]=x.backdropShadowColor[3],_[S++]=x.backdropShadowBlur,_[S++]=x.backdropPadding,_[S++]=x.backdropBorderColor[0],_[S++]=x.backdropBorderColor[1],_[S++]=x.backdropBorderColor[2],_[S++]=x.backdropBorderColor[3],_[S++]=x.backdropBorderWidth,_[S++]=x.backdropCornerRadius,_[S++]=x.backdropLabelPadding,_[S++]=x.backdropArea,_[S++]=x.labelBoxOffset[0],_[S++]=x.labelBoxOffset[1]}},{key:"setUniforms",value:function(T,x){var _=x.gl,R=x.uniformLocations;_.uniformMatrix3fv(R.u_matrix,!1,T.matrix),_.uniform1f(R.u_sizeRatio,T.sizeRatio),_.uniform1f(R.u_correctionRatio,T.correctionRatio),_.uniform1f(R.u_cameraAngle,T.cameraAngle),_.uniform2f(R.u_resolution,T.width*T.pixelRatio,T.height*T.pixelRatio),_.uniform1f(R.u_pixelRatio,T.pixelRatio),_.uniform1f(R.u_labelMargin,m.labelMargin),_.uniform1f(R.u_zoomLabelSizeRatio,1/h(T.zoomRatio)),_.uniform1f(R.u_labelPixelSnapping,T.labelPixelSnapping),_.uniform1i(R.u_nodeDataTexture,T.nodeDataTextureUnit),_.uniform1i(R.u_nodeDataTextureWidth,T.nodeDataTextureWidth),_.uniform1i(R.u_nodeFrameTexture,T.nodeFrameTextureUnit),_.uniform1i(R.u_nodeFrameTextureWidth,T.nodeFrameTextureWidth);var S=d();R.u_layerAttributeTexture&&S&&(S.bind(Oe),_.uniform1i(R.u_layerAttributeTexture,Oe),_.uniform1i(R.u_layerAttributeTextureWidth,S.getTextureWidth()),_.uniform1i(R.u_layerAttributeTexelsPerNode,S.getTexelsPerItem()));var C=M(ft(l)),D;try{for(C.s();!(D=C.n()).done;){var k=D.value;this.setTypedUniform(k,x)}}catch(A){C.e(A)}finally{C.f()}}},{key:"hasNothingToRender",value:function(){return this.totalBackdropCount===0}},{key:"drawWebGL",value:function(T,x){var _=x.gl;this.totalBackdropCount!==0&&(this.isInstanced?_.drawArraysInstanced(T,0,this.VERTICES,this.totalBackdropCount):_.drawArrays(T,0,this.totalBackdropCount*this.VERTICES))}},{key:"reallocate",value:function(T){this.totalBackdropCount=T,T>this.bufferCapacity&&(this.bufferCapacity=Math.max(T,Math.ceil(this.bufferCapacity*1.5)||10),re(m,"reallocate",this,3)([this.bufferCapacity]))}}])})(Ce);return E(v,"labelMargin",f),new v(n,a,t)}var Ua=(function(n){function a(){var t;Y(this,a);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return t=ne(this,a,[].concat(r)),E(t,"totalCharacterCount",0),E(t,"bufferCapacity",0),t}return ae(a,n),K(a,[{key:"processLabel",value:function(e,r,i){if(i.hidden||!i.text)return 0;for(var o=i.text,s=o.length,l=0;l<s;l++){var u=o[l];this.processCharacter(r+l,i,u,l)}return s}},{key:"hasNothingToRender",value:function(){return this.totalCharacterCount===0}},{key:"drawWebGL",value:function(e,r){var i=r.gl;this.totalCharacterCount!==0&&(this.isInstanced?i.drawArraysInstanced(e,0,this.VERTICES,this.totalCharacterCount):i.drawArrays(e,0,this.totalCharacterCount*this.VERTICES))}},{key:"reallocate",value:function(e){this.totalCharacterCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||1e3),re(a,"reallocate",this,3)([this.bufferCapacity]))}}])})(Ce);function au(){var n=`#version 300 es

in float a_nodeIndex;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec4 v_id;
out vec4 v_color;

`.concat(we,`
`).concat(Ue,`
`).concat(Qe,`
`).concat(Oa,`

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;

  // Shape-aware edge distance, read once from the shared frame texture.
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  `).concat(za,`

  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;
#ifdef PICKING_MODE
  float padding = u_pickingPadding * u_pixelRatio;
#else
  float padding = a_padding * u_pixelRatio;
#endif

  if (labelW <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    v_color = vec4(0.0);
    return;
  }

  vec2 labelHalfSize = vec2(labelW * 0.5 + padding, labelH * 0.5 + padding);
  vec2 labelOffset = vec2(0.0);

  // Graph-aligned labels add the camera angle so the rect orbits with the text.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;
    // Box center uses the text half-size; the padding expands the quad below.
    labelOffset = labelRotMat * labelBoxCenter(a_positionMode, labelStart, vec2(labelW * 0.5, labelH * 0.5), textHalf);
  }

  // Rotate the rect with the label so it stays aligned with the (rotated) text.
  vec2 localPos = labelOffset + labelRotMat * (a_quadCorner * labelHalfSize);
  vec2 ndcOffset = (localPos + snapDelta) * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);
  v_id = a_id;
  v_color = a_color;
}
`);return n}var ru=`#version 300 es
precision highp float;

in vec4 v_id;
in vec4 v_color;

out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    fragColor = v_id;
  #else
    if (v_color.a <= 0.0) discard;
    // v_color is non-premultiplied RGBA (0-1); convert to premultiplied for blending
    fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  #endif
}
`;function iu(n,a,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:Ze,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=au(),c=(function(f){function h(){var p;Y(this,h);for(var b=arguments.length,v=new Array(b),g=0;g<b;g++)v[g]=arguments[g];return p=ne(this,h,[].concat(v)),E(p,"totalCount",0),E(p,"bufferCapacity",0),p}return ae(h,f),K(h,[{key:"getDefinition",value:function(){var b=WebGL2RenderingContext,v=b.FLOAT,g=b.UNSIGNED_BYTE,m=b.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:ru,METHOD:m,UNIFORMS:["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:v},{name:"a_id",size:4,type:g,normalized:!0},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_labelWidth",size:1,type:v},{name:"a_labelHeight",size:1,type:v},{name:"a_textHeight",size:1,type:v},{name:"a_positionMode",size:1,type:v},{name:"a_labelAngle",size:1,type:v},{name:"a_padding",size:1,type:v}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:v}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processLabelBackground",value:function(b,v){var g=this.floats,m=this.ints,y=b*this.STRIDE;g[y++]=v.nodeIndex,m[y++]=v.id,g[y++]=v.color,g[y++]=v.labelWidth,g[y++]=v.labelHeight,g[y++]=v.textHeight,g[y++]=v.positionMode,g[y++]=v.labelAngle,g[y++]=v.padding}},{key:"setUniforms",value:function(b,v){var g=v.gl,m=v.uniformLocations;g.uniformMatrix3fv(m.u_matrix,!1,b.matrix),g.uniform1f(m.u_sizeRatio,b.sizeRatio),g.uniform1f(m.u_correctionRatio,b.correctionRatio),g.uniform1f(m.u_cameraAngle,b.cameraAngle),g.uniform2f(m.u_resolution,b.width*b.pixelRatio,b.height*b.pixelRatio),g.uniform1f(m.u_pixelRatio,b.pixelRatio),g.uniform1f(m.u_labelMargin,h.labelMargin),g.uniform1f(m.u_zoomLabelSizeRatio,1/u(b.zoomRatio)),g.uniform1f(m.u_labelPixelSnapping,b.labelPixelSnapping),g.uniform1f(m.u_pickingPadding,b.labelPickingPadding),g.uniform1i(m.u_nodeDataTexture,b.nodeDataTextureUnit),g.uniform1i(m.u_nodeDataTextureWidth,b.nodeDataTextureWidth),g.uniform1i(m.u_nodeFrameTexture,b.nodeFrameTextureUnit),g.uniform1i(m.u_nodeFrameTextureWidth,b.nodeFrameTextureWidth)}},{key:"hasNothingToRender",value:function(){return this.totalCount===0}},{key:"drawWebGL",value:function(b,v){var g=v.gl;this.totalCount!==0&&g.drawArraysInstanced(g.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}},{key:"reallocate",value:function(b){this.totalCount=b,b>this.bufferCapacity&&(this.bufferCapacity=Math.max(b,Math.ceil(this.bufferCapacity*1.5)||10),re(h,"reallocate",this,3)([this.bufferCapacity]))}}])})(Ce);return E(c,"labelMargin",l),new c(n,a,t)}var De={fontSize:64,buffer:8,radius:24,cutoff:.25,maxTextureSize:2048,debounceTimeout:100},Ot=2,Ut=1e20;function ou(n,a,t,e,r){var i=n+r*4,o=document.createElement("canvas");o.width=i,o.height=i;var s=o.getContext("2d",{willReadFrequently:!0});return s.font="".concat(e," ").concat(t," ").concat(n,"px ").concat(a),s.textBaseline="alphabetic",s.textAlign="left",s.fillStyle="black",{ctx:s,canvasSize:i,gridOuter:new Float64Array(i*i),gridInner:new Float64Array(i*i),f:new Float64Array(i),z:new Float64Array(i+1),v:new Uint16Array(i)}}function su(n,a,t,e,r){var i=n.ctx,o=n.canvasSize,s=i.measureText(a),l=s.width,u=s.actualBoundingBoxAscent,d=s.actualBoundingBoxDescent,c=s.actualBoundingBoxLeft,f=s.actualBoundingBoxRight,h=Math.ceil(u),p=Math.ceil(c),b=Math.max(0,Math.min(o-t,Math.ceil(c)+Math.ceil(f))),v=Math.min(o-t,h+Math.ceil(d)),g=b+2*t,m=v+2*t,y=Math.max(g*m,0),T=new Uint8ClampedArray(y),x={data:T,width:g,height:m,glyphWidth:b,glyphHeight:v,glyphTop:h,glyphLeft:p,glyphAdvance:l};if(b===0||v===0)return x;var _=n.gridInner,R=n.gridOuter;i.clearRect(t,t,b,v),i.fillText(a,t+p,t+h);var S=i.getImageData(t,t,b,v);R.fill(Ut,0,y),_.fill(0,0,y);for(var C=0;C<v;C++)for(var D=0;D<b;D++){var k=S.data[4*(C*b+D)+3]/255;if(k!==0){var A=(C+t)*g+D+t;if(k===1)R[A]=0,_[A]=Ut;else{var I=.5-k;R[A]=I>0?I*I:0,_[A]=I<0?I*I:0}}}ui(R,0,0,g,m,g,n.f,n.v,n.z),ui(_,t,t,b,v,g,n.f,n.v,n.z);for(var w=0;w<y;w++){var F=Math.sqrt(R[w])-Math.sqrt(_[w]);T[w]=Math.round(255-255*(F/e+r))}return x}function ui(n,a,t,e,r,i,o,s,l){for(var u=a;u<a+e;u++)di(n,t*i+u,i,r,o,s,l);for(var d=t;d<t+r;d++)di(n,d*i+a,1,e,o,s,l)}function di(n,a,t,e,r,i,o){i[0]=0,o[0]=-Ut,o[1]=Ut,r[0]=n[a];for(var s=1,l=0,u=0;s<e;s++){r[s]=n[a+s*t];var d=s*s;do{var c=i[l];u=(r[s]-r[c]+d-c*c)/(s-c)/2}while(u<=o[l]&&--l>-1);l++,i[l]=s,o[l]=u,o[l+1]=Ut}for(var f=0,h=0;f<e;f++){for(;o[h+1]<f;)h++;var p=i[h],b=f-p;n[a+f*t]=r[p]+b*b}}var Ye=(function(n){function a(){var t,e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Y(this,a),t=ne(this,a),E(t,"fonts",new Map),E(t,"textures",[]),E(t,"cursor",{x:0,y:0,rowHeight:0,atlasIndex:0}),E(t,"pendingGlyphs",[]),E(t,"debounceTimer",null),t.options=O(O({},De),e),t.canvas=document.createElement("canvas"),t.canvas.width=t.options.maxTextureSize,t.canvas.height=t.options.maxTextureSize,t.ctx=t.canvas.getContext("2d",{willReadFrequently:!0}),t.measureCanvas=document.createElement("canvas"),t.measureCtx=t.measureCanvas.getContext("2d"),t.textures.push(t.ctx.getImageData(0,0,1,1)),t}return ae(a,n),K(a,[{key:"getFontKey",value:function(e){return"".concat(e.family,"-").concat(e.weight,"-").concat(e.style)}},{key:"registerFont",value:function(e){var r=this.getFontKey(e);if(this.fonts.has(r))return r;var i=ou(this.options.fontSize,e.family,e.weight,e.style,this.options.buffer);return this.fonts.set(r,{descriptor:e,generator:i,glyphs:new Map}),r}},{key:"ensureGlyphs",value:function(e,r){var i=this.fonts.get(r);if(!i)throw new Error('Font "'.concat(r,'" is not registered. Call registerFont() first.'));var o=!1,s=M(e),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.codePointAt(0);d!==void 0&&(i.glyphs.has(d)||(this.pendingGlyphs.push({fontKey:r,charCode:d}),o=!0))}}catch(c){s.e(c)}finally{s.f()}o&&this.scheduleTextureGeneration()}},{key:"measureText",value:function(e,r){var i=this.fonts.get(r);if(!i)throw new Error('Font "'.concat(r,'" is not registered.'));var o=i.descriptor,s=o.family,l=o.weight,u=o.style;return this.measureCtx.font="".concat(u," ").concat(l," ").concat(this.options.fontSize,"px ").concat(s),this.measureCtx.measureText(e).width}},{key:"getGlyph",value:function(e,r){var i=this.fonts.get(r);if(i)return i.glyphs.get(e)}},{key:"getTextures",value:function(){return this.textures}},{key:"getFontCount",value:function(){return this.fonts.size}},{key:"getGlyphCount",value:function(){var e=0,r=M(this.fonts.values()),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;e+=o.glyphs.size}}catch(s){r.e(s)}finally{r.f()}return e}},{key:"hasPendingGlyphs",value:function(){return this.pendingGlyphs.length>0}},{key:"flush",value:function(){this.debounceTimer&&(clearTimeout(this.debounceTimer),this.debounceTimer=null),this.generateTextures()}},{key:"destroy",value:function(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.fonts.clear(),this.textures=[],this.pendingGlyphs=[],this.removeAllListeners()}},{key:"scheduleTextureGeneration",value:function(){var e=this;this.debounceTimer===null&&(this.options.debounceTimeout===null?this.generateTextures():this.debounceTimer=setTimeout(function(){e.debounceTimer=null,e.generateTextures()},this.options.debounceTimeout))}},{key:"generateTextures",value:function(){if(this.pendingGlyphs.length!==0){var e=this.options,r=e.maxTextureSize,i=e.buffer,o=e.radius,s=e.cutoff,l=M(this.pendingGlyphs),u;try{for(l.s();!(u=l.n()).done;){var d=u.value,c=d.fontKey,f=d.charCode,h=this.fonts.get(c);if(!(!h||h.glyphs.has(f))){var p=String.fromCodePoint(f),b=su(h.generator,p,i,o,s),v=b.width,g=b.height;this.cursor.x+v+Ot>r&&(this.cursor.x=0,this.cursor.y+=this.cursor.rowHeight+Ot,this.cursor.rowHeight=0),this.cursor.y+g+Ot>r&&(this.finalizeCurrentTexture(),this.cursor={x:0,y:0,rowHeight:0,atlasIndex:this.cursor.atlasIndex+1},this.ctx.clearRect(0,0,r,r));for(var m=b.data,y=new Uint8ClampedArray(v*g*4),T=0;T<m.length;T++){var x=T*4;y[x]=255,y[x+1]=255,y[x+2]=255,y[x+3]=m[T]}var _=new ImageData(y,v,g);this.ctx.putImageData(_,this.cursor.x,this.cursor.y);var R={charCode:f,width:b.glyphWidth,height:b.glyphHeight,bearingX:-b.glyphLeft-i,bearingY:b.glyphTop+i,advance:b.glyphAdvance,atlasX:this.cursor.x,atlasY:this.cursor.y,atlasWidth:v,atlasHeight:g,atlasIndex:this.cursor.atlasIndex};h.glyphs.set(f,R),this.cursor.x+=v+Ot,this.cursor.rowHeight=Math.max(this.cursor.rowHeight,g)}}}catch(S){l.e(S)}finally{l.f()}this.finalizeCurrentTexture(),this.pendingGlyphs=[],this.emit(a.ATLAS_UPDATED_EVENT,{textures:this.textures,glyphCount:this.getGlyphCount()})}}},{key:"finalizeCurrentTexture",value:function(){var e=this.options.maxTextureSize,r=this.cursor.y>0||this.cursor.rowHeight>0,i=Math.min(e,Math.max(this.cursor.x,r?e:1)),o=Math.min(e,this.cursor.y+this.cursor.rowHeight+Ot),s=this.ctx.getImageData(0,0,i,o);this.cursor.atlasIndex>=this.textures.length?this.textures.push(s):this.textures[this.cursor.atlasIndex]=s}}])})(gi.EventEmitter);E(Ye,"ATLAS_UPDATED_EVENT","atlasUpdated");var lu=De.fontSize;function Bi(){var n=`  // -------------------------------------------------------------------------
  // Step 3: Calculate position offset from the shared edge distance
  // -------------------------------------------------------------------------
  vec2 positionOffset = vec2(0.0);

  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    float boundaryDistPixels = nodeRadiusPixels * edgeDist;
    positionOffset = screenDir * (boundaryDistPixels + margin);
  }`,a=`#version 300 es

// ============================================================================
// Attributes
// ============================================================================

// Per-character (instanced)
in float a_nodeIndex;        // Index into node data texture
in vec2 a_charOffset;        // Character offset from label origin (pixels)
in vec2 a_charSize;          // Character dimensions (pixels)
in vec4 a_texCoords;         // Atlas coords: (x, y, width, height) in pixels
in vec4 a_color;             // Text color (RGBA)
in float a_margin;           // Gap between node edge and label (pixels)
in float a_positionMode;     // Position: 0=right, 1=left, 2=above, 3=below, 4=over
in float a_labelWidth;       // Total label width (pixels)
in float a_labelHeight;      // Label height (pixels)
in float a_verticalCenter;   // Vertical center offset from baseline (pixels)
in float a_textHeight;       // Actual text height: maxAscent + maxDescent (pixels)
in float a_labelAngle;       // Label rotation angle (radians)

// Per-vertex (constant quad corners)
in vec2 a_quadCorner;        // Quad corner: [-1,-1], [1,-1], [-1,1], [1,1]

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pixelRatio;

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
out float v_fontScale;

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float ATLAS_FONT_SIZE = `.concat(te(lu),`;

// ============================================================================
// Helper Functions
// ============================================================================

`).concat(we,`
`).concat(Ue,`
`).concat(Qe,`
`).concat(Ma,`

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Step 0: Fetch node data + shared edge distance from textures
  // -------------------------------------------------------------------------
  // Node-data texture format: vec4(x, y, size, shapeId)
  // 2D texture layout: texCoord = (index % width, index / width)
  int nodeIdx = int(a_nodeIndex);
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_anchorPosition = nodeData.xy;
  float a_nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; the label just reads the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  // Apply zoom-dependent label size scaling
  // Positional values are in CSS pixels; multiply by u_pixelRatio to convert to
  // physical pixels, which is what the NDC conversion (/ u_resolution) expects.
  float zoomScale = u_zoomLabelSizeRatio;
  float margin = a_margin * zoomScale * u_pixelRatio;
  vec2 charOffset = a_charOffset * zoomScale * u_pixelRatio;
  vec2 charSize = a_charSize * zoomScale * u_pixelRatio;
  float labelWidth = a_labelWidth * zoomScale * u_pixelRatio;
  float labelHeight = a_labelHeight * zoomScale;

  // Font scale: ratio of CSS label size to the base atlas font size.
  // Divided by u_pixelRatio because the atlas is generated at ATLAS_FONT_SIZE * pixelRatio,
  // which cancels out the u_pixelRatio in the fragment shader's gamma formula and keeps
  // the anti-aliasing band width consistent across pixel densities.
  v_fontScale = a_labelHeight * zoomScale / (ATLAS_FONT_SIZE * u_pixelRatio);

  // -------------------------------------------------------------------------
  // Step 1: Transform node position to clip space
  // -------------------------------------------------------------------------
  vec3 anchorClip = u_matrix * vec3(a_anchorPosition, 1.0);

  // -------------------------------------------------------------------------
  // Step 2: Convert node size to screen pixels
  // -------------------------------------------------------------------------
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = a_nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
  float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;

`).concat(n,`

  // -------------------------------------------------------------------------
  // Step 4: Calculate final vertex position
  // -------------------------------------------------------------------------
  vec2 cornerOffset = (a_quadCorner + 1.0) * 0.5;
  vec2 charPixelPos = positionOffset + charOffset + cornerOffset * charSize;

  // Apply text alignment based on position mode
  float verticalCenter = a_verticalCenter * zoomScale * u_pixelRatio;
  float textHeight = a_textHeight * zoomScale * u_pixelRatio;
  float baselineToDescent = textHeight / 2.0 - verticalCenter;
  float baselineToAscent = textHeight / 2.0 + verticalCenter;

  if (a_positionMode < 0.5) {
    // Right: vertically center
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 1.5) {
    // Left: right-align and vertically center
    charPixelPos.x -= labelWidth;
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 2.5) {
    // Above: center horizontally, bottom of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y -= baselineToDescent;
  } else if (a_positionMode < 3.5) {
    // Below: center horizontally, top of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += baselineToAscent;
  } else {
    // Over: center both
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += verticalCenter;
  }

  // Apply label angle rotation. Graph-aligned labels add the camera angle so the
  // whole label orbits the node in lockstep with the frame-pass edge distance.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);
  charPixelPos = labelRotMat * charPixelPos;

  // Snap node center to pixel grid so label/backdrop/attachment move as a unit
  vec2 nodeScreen = vec2(
    (anchorClip.x + 1.0) * u_resolution.x,
    (1.0 - anchorClip.y) * u_resolution.y
  ) * 0.5;
  charPixelPos += (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Convert to NDC (flip Y: screen Y-down -> clip Y-up)
  vec2 ndcOffset = vec2(charPixelPos.x, -charPixelPos.y) * 2.0 / u_resolution;
  gl_Position = vec4(anchorClip.xy + ndcOffset, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 5: Texture coordinates
  // -------------------------------------------------------------------------
  v_texCoord = (a_texCoords.xy + cornerOffset * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 6: Pass color
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
}
`);return a}function Ui(){var n=`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
in float v_fontScale;

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Labels are not pickable - discard all fragments in picking mode
    fragColor = vec4(0.0);
    discard;
  #else
    // Sample SDF value from atlas (high = inside glyph, low = outside)
    float sdfValue = texture(u_atlas, v_texCoord).a;

    // Edge threshold: 1.0 - cutoff = 0.75 for default cutoff=0.25
    // This is where the glyph edge is located in the SDF
    float edgeThreshold = 1.0 - u_sdfBuffer;

    // Gamma controls the anti-aliasing band width.
    // Scale inversely with font scale so small labels get a wider AA band
    // (smoother) and large labels get a tighter band (sharper).
    float gamma = u_gamma / (u_pixelRatio * v_fontScale);

    // Pure gamma-based anti-aliasing using smoothstep
    // The AA band extends from (threshold - gamma) to (threshold + gamma)
    float alpha = smoothstep(edgeThreshold - gamma, edgeThreshold + gamma, sdfValue);

    // Premultiplied alpha output for correct blending
    float finalAlpha = v_color.a * alpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  #endif
}
`;return n}function Wi(){return["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_pixelRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_zoomLabelSizeRatio","u_labelPixelSnapping"]}function Hi(){return{vertexShader:Bi(),fragmentShader:Ui(),uniforms:Wi()}}function $i(n,a,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:Ze,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=Hi(),c=(function(f){function h(p,b,v){var g,m,y,T;if(Y(this,h),T=ne(this,h,[p,b,v]),E(T,"atlasTexture",null),E(T,"atlasNeedsUpdate",!1),E(T,"labelGlyphCache",new Map),T.atlasFontSize=De.fontSize*Mt(),T.atlasManager=new Ye({fontSize:T.atlasFontSize}),T.gamma=.025,T.sdfBuffer=De.cutoff,T.atlasTexture=p.createTexture(),!T.atlasTexture)throw new Error("NodeLabelProgram: failed to create atlas texture");p.bindTexture(p.TEXTURE_2D,T.atlasTexture),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_S,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_T,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MIN_FILTER,p.LINEAR),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MAG_FILTER,p.LINEAR),p.bindTexture(p.TEXTURE_2D,null),T.atlasManager.on(Ye.ATLAS_UPDATED_EVENT,function(){T.atlasNeedsUpdate=!0});var x={family:((g=s.font)===null||g===void 0?void 0:g.family)||"sans-serif",weight:((m=s.font)===null||m===void 0?void 0:m.weight)||"normal",style:((y=s.font)===null||y===void 0?void 0:y.style)||"normal"};return T.defaultFontKey=T.atlasManager.registerFont(x),T}return ae(h,f),K(h,[{key:"getDefinition",value:function(){var b=WebGL2RenderingContext,v=b.FLOAT,g=b.UNSIGNED_BYTE,m=b.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d.vertexShader,FRAGMENT_SHADER_SOURCE:d.fragmentShader,METHOD:m,UNIFORMS:d.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:v},{name:"a_charOffset",size:2,type:v},{name:"a_charSize",size:2,type:v},{name:"a_texCoords",size:4,type:v},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_margin",size:1,type:v},{name:"a_positionMode",size:1,type:v},{name:"a_labelWidth",size:1,type:v},{name:"a_labelHeight",size:1,type:v},{name:"a_verticalCenter",size:1,type:v},{name:"a_textHeight",size:1,type:v},{name:"a_labelAngle",size:1,type:v}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:v}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"prepareLabelGlyphs",value:function(b,v){if(v.hidden||!v.text){this.labelGlyphCache.delete(b);return}var g=v.text,m=v.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(g,m);var y=[],T=[],x=0,_=0,R=0,S=M(g),C;try{for(S.s();!(C=S.n()).done;){var D=C.value,k=D.codePointAt(0);if(k===void 0){y.push(void 0),T.push(x);continue}var A=this.atlasManager.getGlyph(k,m);y.push(A),T.push(x),A&&(x+=A.advance,_=Math.max(_,A.bearingY),R=Math.max(R,A.atlasHeight-A.bearingY))}}catch(I){S.e(I)}finally{S.f()}this.labelGlyphCache.set(b,{glyphs:y,xOffsets:T,totalWidth:x,totalHeight:_+R,verticalCenterOffset:(_-R)/2})}},{key:"processCharacter",value:function(b,v,g,m){var y=this.floats,T=this.STRIDE,x=b*T,_=this.labelGlyphCache.get(v.parentKey);if(!_||!_.glyphs[m]){for(var R=0;R<T;R++)y[x+R]=0;return}var S=_.glyphs[m],C=_.xOffsets[m],D=v.size/this.atlasFontSize,k=he(v.color),A=x;y[A++]=v.nodeIndex,y[A++]=(C+S.bearingX)*D,y[A++]=-S.bearingY*D,y[A++]=S.atlasWidth*D,y[A++]=S.atlasHeight*D,y[A++]=S.atlasX,y[A++]=S.atlasY,y[A++]=S.atlasWidth,y[A++]=S.atlasHeight,y[A++]=k,y[A++]=v.margin,y[A++]=Ke[v.position],y[A++]=_.totalWidth*D,y[A++]=v.size,y[A++]=_.verticalCenterOffset*D,y[A++]=_.totalHeight*D,y[A++]=v.labelAngle}},{key:"processLabel",value:function(b,v,g){return this.prepareLabelGlyphs(b,g),re(h,"processLabel",this,3)([b,v,g])}},{key:"updateAtlasTexture",value:function(){if(this.atlasNeedsUpdate){var b=this.normalProgram.gl,v=this.atlasManager.getTextures();if(v.length!==0){var g=v[0];b.bindTexture(b.TEXTURE_2D,this.atlasTexture),b.texImage2D(b.TEXTURE_2D,0,b.RGBA,g.width,g.height,0,b.RGBA,b.UNSIGNED_BYTE,g.data),b.bindTexture(b.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}}}},{key:"setUniforms",value:function(b,v){var g=v.gl,m=v.uniformLocations;g.uniformMatrix3fv(m.u_matrix,!1,b.matrix),g.uniform1f(m.u_sizeRatio,b.sizeRatio),g.uniform1f(m.u_correctionRatio,b.correctionRatio),g.uniform1f(m.u_cameraAngle,b.cameraAngle),g.uniform2f(m.u_resolution,b.width*b.pixelRatio,b.height*b.pixelRatio);var y=this.atlasManager.getTextures();y.length>0?g.uniform2f(m.u_atlasSize,y[0].width,y[0].height):g.uniform2f(m.u_atlasSize,1,1),g.activeTexture(g.TEXTURE0),g.bindTexture(g.TEXTURE_2D,this.atlasTexture),g.uniform1i(m.u_atlas,0),m.u_nodeDataTexture!==void 0&&g.uniform1i(m.u_nodeDataTexture,b.nodeDataTextureUnit),m.u_nodeDataTextureWidth!==void 0&&g.uniform1i(m.u_nodeDataTextureWidth,b.nodeDataTextureWidth),g.uniform1i(m.u_nodeFrameTexture,b.nodeFrameTextureUnit),g.uniform1i(m.u_nodeFrameTextureWidth,b.nodeFrameTextureWidth),g.uniform1f(m.u_gamma,this.gamma),g.uniform1f(m.u_sdfBuffer,this.sdfBuffer),g.uniform1f(m.u_pixelRatio,b.pixelRatio),g.uniform1f(m.u_zoomLabelSizeRatio,1/h.zoomToLabelSizeRatioFunction(b.zoomRatio)),g.uniform1f(m.u_labelPixelSnapping,b.labelPixelSnapping)}},{key:"renderProgram",value:function(b,v){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),re(h,"renderProgram",this,3)([b,v])}},{key:"registerFont",value:function(b){var v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"normal",g=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"normal";return this.atlasManager.registerFont({family:b,weight:v,style:g})}},{key:"getAtlasManager",value:function(){return this.atlasManager}},{key:"measureLabel",value:function(b,v,g){var m=g||this.defaultFontKey;this.atlasManager.ensureGlyphs(b,m),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();var y=0,T=0,x=0,_=M(b),R;try{for(_.s();!(R=_.n()).done;){var S=R.value,C=S.codePointAt(0);if(C!==void 0){var D=this.atlasManager.getGlyph(C,m);D&&(y+=D.advance,T=Math.max(T,D.bearingY),x=Math.max(x,D.atlasHeight-D.bearingY))}}}catch(A){_.e(A)}finally{_.f()}var k=v/this.atlasFontSize;return{width:y*k,height:v,textHeight:(T+x)*k}}},{key:"ensureGlyphsReady",value:function(b,v){var g=v||this.defaultFontKey,m=M(b),y;try{for(m.s();!(y=m.n()).done;){var T=y.value;this.atlasManager.ensureGlyphs(T,g)}}catch(x){m.e(x)}finally{m.f()}this.atlasManager.flush()}},{key:"kill",value:function(){var b=this.normalProgram.gl;this.atlasTexture&&(b.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),re(h,"kill",this,3)([])}}])})(Ua);return E(c,"labelMargin",l),E(c,"zoomToLabelSizeRatioFunction",u),new c(n,a,t)}var uu=`#version 300 es
precision highp float;

in float v_edgeDist;

// R32F target: only the .r channel is stored.
out vec4 fragColor;

void main() {
  fragColor = vec4(v_edgeDist, 0.0, 0.0, 0.0);
}
`;function du(n,a,t){var e=zn(n),r=ft(n).map(function(p){return"uniform ".concat(p.type," ").concat(p.name,";")}).join(`
`),i=Di(n,t),o=i.code,s=i.multiShape,l=gt(n,a),u=Object.keys(l.specs).map(function(p){return"float v_".concat(p,";")}).join(`
`),d=ct(l,{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),c=d.fetchCode,f=d.varyingAssignments,h=`#version 300 es
precision highp float;

uniform float u_cameraAngle;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;
`.concat(r,`

in float a_nodeIndex;     // node-data texture index (also the target frame texel)
in float a_positionMode;  // 0=right 1=left 2=above 3=below 4=over
in float a_labelAngle;    // intrinsic label angle (radians)

out float v_edgeDist;

// Shape attributes (plain globals: this pass is vertex-only)
`).concat(u,`

`).concat(we,`
`).concat(Ue,`
`).concat(e,`
`).concat(o,`
`).concat(Ma,`

void main() {
  int nodeIdx = int(a_nodeIndex);
`).concat(c,`
`).concat(f,`
  `).concat(s?`// Multi-shape: the shape id lives in the node-data texture's .w channel:
  g_shapeId = int(readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).w);`:"// Single-shape mode, shape id not needed",`

  // Per-node rotation alignment (0 = viewport, 1 = graph).
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;

  // Effective angle: intrinsic (style-given) plus the camera angle when the label
  // is graph-aligned. The companions place the box at this same angle.
  float effectiveAngle = a_labelAngle - labelRotation * u_cameraAngle;

  // The "over" mode (4) sits on the node center, so it has no edge distance.
  float edgeDist = 0.0;
  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    // Rotate by the effective label angle. Inlined rather than via rotate2D()
    // because the shape SDFs (getShapeGLSLForShapes) already define that helper
    // for multi-shape programs, and redefining it would be a GLSL error.
    float ea_c = cos(effectiveAngle);
    float ea_s = sin(effectiveAngle);
    vec2 rotatedScreenDir = mat2(ea_c, -ea_s, ea_s, ea_c) * screenDir;
    // Screen (Y-down) -> SDF (Y-up).
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);
    // Counter-rotate into the shape's local frame for graph-aligned nodes, so the
    // boundary is queried against the shape's actual on-screen orientation.
    float nodeCa = -u_cameraAngle * nodeRotation;
    float nc = cos(nodeCa), ns = sin(nodeCa);
    sdfDir = mat2(nc, -ns, ns, nc) * sdfDir;
    edgeDist = findEdgeDistance(sdfDir, 1.0);
  }
  v_edgeDist = edgeDist;

  // Scatter to this node's texel center in the frame texture.
  float x = mod(a_nodeIndex, u_frameTextureWidth);
  float y = floor(a_nodeIndex / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`);return h}var Wa=(function(){function n(a,t){Y(this,n),E(this,"uniformLocations",{});var e=t.shapes,r=t.layers,i=t.shapeGlobalIds;if(e.length===0)throw new Error("NodeLabelFramePass: at least one shape must be provided");this.gl=a,this.shapeUniforms=ft(e),this.hasAttributeData=Object.keys(gt(e,r).offsets).length>0,this.vertexShader=Ht(a,du(e,r,i)),this.fragmentShader=$t(a,uu),this.program=Vt(a,[this.vertexShader,this.fragmentShader]);var o=["u_cameraAngle","u_nodeDataTexture","u_nodeDataTextureWidth","u_frameTextureWidth","u_frameTextureHeight","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"].concat($(this.shapeUniforms.map(function(g){return g.name}))),s=M(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;this.uniformLocations[u]=a.getUniformLocation(this.program,u)}}catch(g){s.e(g)}finally{s.f()}var d=n.FLOATS_PER_POINT*4;this.vao=a.createVertexArray(),this.buffer=a.createBuffer(),a.bindVertexArray(this.vao),a.bindBuffer(a.ARRAY_BUFFER,this.buffer);var c=M([["a_nodeIndex",0],["a_positionMode",4],["a_labelAngle",8]]),f;try{for(c.s();!(f=c.n()).done;){var h=Q(f.value,2),p=h[0],b=h[1],v=a.getAttribLocation(this.program,p);v>=0&&(a.enableVertexAttribArray(v),a.vertexAttribPointer(v,1,a.FLOAT,!1,d,b))}}catch(g){c.e(g)}finally{c.f()}a.bindVertexArray(null)}return K(n,[{key:"run",value:function(t,e,r,i,o){if(e!==0){var s=this.gl;s.useProgram(this.program),s.bindVertexArray(this.vao),s.bindBuffer(s.ARRAY_BUFFER,this.buffer),s.bufferData(s.ARRAY_BUFFER,t.subarray(0,e*n.FLOATS_PER_POINT),s.DYNAMIC_DRAW);var l=this.uniformLocations;s.uniform1f(l.u_cameraAngle,i.cameraAngle),s.uniform1i(l.u_nodeDataTexture,i.nodeDataTextureUnit),s.uniform1i(l.u_nodeDataTextureWidth,i.nodeDataTextureWidth),s.uniform1f(l.u_frameTextureWidth,r.getTextureWidth()),s.uniform1f(l.u_frameTextureHeight,r.getTextureHeight()),this.hasAttributeData&&o&&(o.bind(Oe),l.u_layerAttributeTexture&&s.uniform1i(l.u_layerAttributeTexture,Oe),l.u_layerAttributeTextureWidth&&s.uniform1i(l.u_layerAttributeTextureWidth,o.getTextureWidth()),l.u_layerAttributeTexelsPerNode&&s.uniform1i(l.u_layerAttributeTexelsPerNode,o.getTexelsPerItem()));var u=M(this.shapeUniforms),d;try{for(u.s();!(d=u.n()).done;){var c=d.value;Ba(s,this.uniformLocations[c.name],c)}}catch(f){u.e(f)}finally{u.f()}r.bindAsRenderTarget(),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.drawArrays(s.POINTS,0,e),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindVertexArray(null)}}},{key:"kill",value:function(){var t=this.gl;t.deleteProgram(this.program),t.deleteShader(this.vertexShader),t.deleteShader(this.fragmentShader),t.deleteBuffer(this.buffer),t.deleteVertexArray(this.vao)}}])})();E(Wa,"FLOATS_PER_POINT",3);function Ha(n,a,t,e,r){var i,o=e.label,s=o===void 0?{}:o,l=e.shapes;if(l.length===0)throw new Error("createNodeProgram: at least one shape must be provided in 'shapes'");var u={},d=[],c;l.forEach(function(R,S){var C=mi(R);S===0&&(c=C),u[R.name]=S,d[S]=ht(C)});var f=$(e.layers),h=Ia({shapes:l,layers:f,shapeGlobalIds:l.length>1?d:void 0,antialias:r}),p=$i(n,null,t,{label:s}),b=Oi(n,null,t,{shapes:l,layers:f,getAttributeTexture:function(){return _.getAttributeTexture()},label:s,shapeGlobalIds:l.length>1?d:void 0}),v=iu(n,a,t,{label:s}),g=e.labelAttachments&&Object.keys(e.labelAttachments).length>0?nu(n,null,t,{label:s}):null,m=new Wa(n,{shapes:l,layers:f,shapeGlobalIds:l.length>1?d:void 0}),y=$n(l,f),T=be(y),x=(i=(function(R){function S(C,D,k){var A;Y(this,S),A=ne(this,S,[C,D,k]),E(A,"layerLifecycles",new Map),E(A,"layersNeedingRegeneration",new Set),E(A,"attrDescriptors",[]),A._pickingBuffer=D;var I=x.layerTextures.get(C);I||(I=new Un(C,T),x.layerTextures.set(C,I)),A.layerAttributeTexture=I;var w=x.textureRefCounts.get(C)||0;x.textureRefCounts.set(C,w+1),A.packedAttributeData=new Float32Array(T.floatsPerItem),f.forEach(function(G,N){if(G.lifecycle){var P={gl:C,renderer:{refresh:function(){return k.refresh()}},getUniformLocation:function(H){return C.getUniformLocation(A.normalProgram.program,H)},requestShaderRegeneration:function(){A.layersNeedingRegeneration.add(N)},requestRefresh:function(){k.refresh()}},L=G.lifecycle(P);A.layerLifecycles.set(N,L)}}),A.layerLifecycles.forEach(function(G){var N;(N=G.init)===null||N===void 0||N.call(G)});var F=new Map;return A.layerLifecycles.forEach(function(G,N){G.getAttributeData&&F.set(N,G)}),A.attrDescriptors=Wn(y,T,F),A}return ae(S,R),K(S,[{key:"getDefinition",value:function(){var D=WebGL2RenderingContext,k=D.FLOAT,A=D.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:h.vertexShader,FRAGMENT_SHADER_SOURCE:h.fragmentShader,METHOD:A,UNIFORMS:h.uniforms,ATTRIBUTES:h.attributes,CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:k}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"maybeRegenerateShaders",value:function(){var D=this;if(this.layersNeedingRegeneration.size!==0){f=f.map(function(N,P){if(D.layersNeedingRegeneration.has(P)){var L=D.layerLifecycles.get(P);if(L!=null&&L.regenerate){var z=L.regenerate();return O(O({},z),{},{lifecycle:N.lifecycle})}}return N}),this.layersNeedingRegeneration.clear(),h=Ia({shapes:l,layers:f,shapeGlobalIds:l.length>1?d:void 0,antialias:this.renderer.getSetting("antialiasNodes")});var k=this.normalProgram.gl,A=this.normalProgram,I=A.program,w=A.buffer,F=A.vertexShader,G=A.fragmentShader;k.deleteProgram(I),k.deleteBuffer(w),k.deleteShader(F),k.deleteShader(G),this.normalProgram=this.getProgramInfo("normal",k,h.vertexShader,h.fragmentShader,this._pickingBuffer)}}},{key:"getAttributeTexture",value:function(){return this.layerAttributeTexture}},{key:"uploadLayerTexture",value:function(){this.layerAttributeTexture.upload()}},{key:"process",value:function(D,k,A,I){var w=k*this.STRIDE;if(A.visibility==="hidden"){for(var F=w+this.STRIDE;w<F;w++)this.floats[w]=0;this.floats[k*this.STRIDE]=wi;return}this.processVisibleItem(Ve(D),w,A,I)}},{key:"processVisibleItem",value:function(D,k,A,I){var w,F=this.floats,G=this.ints;if(F[k++]=I,G[k++]=D,F[k++]=(w=A.opacity)!==null&&w!==void 0?w:1,T.floatsPerItem!==0){var N=this.packedAttributeData;Hn(this.attrDescriptors,A,N,A.color,this.layerLifecycles,0),this.layerAttributeTexture.updateAllAttributesAtRow(I,N)}}},{key:"setUniforms",value:function(D,k){var A=this,I=k.gl,w=k.uniformLocations;w.u_matrix&&I.uniformMatrix3fv(w.u_matrix,!1,D.matrix),w.u_sizeRatio&&I.uniform1f(w.u_sizeRatio,D.sizeRatio),w.u_correctionRatio&&I.uniform1f(w.u_correctionRatio,D.correctionRatio),w.u_pickingPadding&&I.uniform1f(w.u_pickingPadding,D.nodePickingPadding),w.u_cameraAngle&&I.uniform1f(w.u_cameraAngle,D.cameraAngle),w.u_nodeDataTexture&&I.uniform1i(w.u_nodeDataTexture,D.nodeDataTextureUnit),w.u_nodeDataTextureWidth&&I.uniform1i(w.u_nodeDataTextureWidth,D.nodeDataTextureWidth),w.u_layerAttributeTexture&&(this.layerAttributeTexture.bind(Oe),I.uniform1i(w.u_layerAttributeTexture,Oe)),w.u_layerAttributeTextureWidth&&I.uniform1i(w.u_layerAttributeTextureWidth,this.layerAttributeTexture.getTextureWidth()),w.u_layerAttributeTexelsPerNode&&I.uniform1i(w.u_layerAttributeTexelsPerNode,this.layerAttributeTexture.getTexelsPerItem()),l.forEach(function(F){F.uniforms.forEach(function(G){A.setTypedUniform(G,k)})}),f.forEach(function(F){F.uniforms.forEach(function(G){A.setTypedUniform(G,k)})})}},{key:"render",value:function(D,k,A){this.maybeRegenerateShaders(),re(S,"render",this,3)([D,k,A])}},{key:"renderProgram",value:function(D,k){var A=k.gl,I=k.program;A.useProgram(I),k===this.normalProgram&&this.layerLifecycles.forEach(function(w){var F;(F=w.beforeRender)===null||F===void 0||F.call(w)}),re(S,"renderProgram",this,3)([D,k])}},{key:"kill",value:function(){this.layerLifecycles.forEach(function(A){var I;(I=A.kill)===null||I===void 0||I.call(A)}),this.layerLifecycles.clear();var D=this.normalProgram.gl,k=(x.textureRefCounts.get(D)||1)-1;k<=0?(this.layerAttributeTexture.kill(),x.layerTextures.delete(D),x.textureRefCounts.delete(D)):x.textureRefCounts.set(D,k),re(S,"kill",this,3)([])}}])})(Ce),E(i,"layerTextures",new WeakMap),E(i,"textureRefCounts",new WeakMap),i),_=new x(n,null,t);return{nodeProgram:_,labelProgram:p,backdropProgram:b,labelBackgroundProgram:v,attachmentProgram:g,framePass:m,shapeSlug:c,shapeNameToIndex:l.length>1?u:void 0,shapeGlobalIds:l.length>1?d:void 0}}var Be=6;function Yt(n){var a=n.offsets,t=n.specs,e=n.floatsPerItem,r=Object.keys(a);if(r.length===0||e===0)return{uniformDeclarations:"",uniformNames:[],vertexVaryingDeclarations:"",fragmentVaryingDeclarations:"",fetchCode:"",varyingAssignments:""};var i=`
uniform sampler2D u_edgeAttributeTexture;
uniform int u_edgeAttributeTextureWidth;
uniform int u_edgeAttributeTexelsPerEdge;`,o=["u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"],s=r.map(function(h){var p=t[h].size===1?"float":"vec".concat(t[h].size);return"".concat(p," v_").concat(h,";")}),l=s.map(function(h){return"out ".concat(h)}).join(`
`),u=s.map(function(h){return"in ".concat(h)}).join(`
`),d=ct(n,{varPrefix:"attr",baseTexelExpr:"edgeIdx * u_edgeAttributeTexelsPerEdge",textureWidthUniform:"u_edgeAttributeTextureWidth",textureSamplerUniform:"u_edgeAttributeTexture"}),c=d.fetchCode,f=d.varyingAssignments;return{uniformDeclarations:i,uniformNames:o,vertexVaryingDeclarations:l,fragmentVaryingDeclarations:u,fetchCode:c,varyingAssignments:f}}function cu(n){return`
float findSourceClampT_`.concat(n,`(vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  float lo = 0.0, hi = 0.5;
  float nodeExtent = sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // Counter-rotate the query point so viewport-aligned nodes (rotateAlign=0) are
  // clamped against their on-screen orientation; graph-aligned nodes skip it.
  float ca = u_cameraAngle * (1.0 - sourceRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_`).concat(n,`_position(mid, source, target);
    vec2 localPos = rot * ((pos - source) / nodeExtent);
    float sdf = querySDF(sourceShapeId, localPos, effectiveSize);
    if (sdf < 0.0) lo = mid;
    else hi = mid;
  }

  float pathLen = path_`).concat(n,`_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 + marginT;
}
`)}function hu(n){return`
float findTargetClampT_`.concat(n,`(vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  float lo = 0.5, hi = 1.0;
  float nodeExtent = targetSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // See findSourceClampT_ for the rotation rationale.
  float ca = u_cameraAngle * (1.0 - targetRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_`).concat(n,`_position(mid, source, target);
    vec2 localPos = rot * ((pos - target) / nodeExtent);
    float sdf = querySDF(targetShapeId, localPos, effectiveSize);
    if (sdf < 0.0) hi = mid;
    else lo = mid;
  }

  float pathLen = path_`).concat(n,`_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 - marginT;
}
`)}function Vi(n){return`
// Auto-generated numerical tangent (from position via finite differences)
vec2 path_`.concat(n,`_tangent(float t, vec2 source, vec2 target) {
  float epsilon = 0.001;
  float t1 = max(0.0, t - epsilon);
  float t2 = min(1.0, t + epsilon);
  vec2 p1 = path_`).concat(n,`_position(t1, source, target);
  vec2 p2 = path_`).concat(n,`_position(t2, source, target);
  return normalize(p2 - p1);
}

// Auto-generated normal (perpendicular to tangent)
vec2 path_`).concat(n,`_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_`).concat(n,`_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`)}function fu(n){return`
// Auto-generated path length (samples position 16 times)
float path_`.concat(n,`_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_`).concat(n,`_position(0.0, source, target);
  for (int i = 1; i <= 16; i++) {
    float t = float(i) / 16.0;
    vec2 curr = path_`).concat(n,`_position(t, source, target);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}
`)}function gu(n){return`
// Auto-generated closest_t (coarse sample + ternary search)
float path_`.concat(n,`_closest_t(vec2 p, vec2 source, vec2 target) {
  // Coarse search: find best among 10 samples
  float bestT = 0.0;
  float bestDist = 1e10;
  for (int i = 0; i <= 10; i++) {
    float t = float(i) / 10.0;
    vec2 pos = path_`).concat(n,`_position(t, source, target);
    float d = length(p - pos);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
    }
  }

  // Refine with ternary search
  float lo = max(0.0, bestT - 0.1);
  float hi = min(1.0, bestT + 0.1);
  for (int i = 0; i < 10; i++) {
    float mid1 = lo + (hi - lo) / 3.0;
    float mid2 = hi - (hi - lo) / 3.0;
    float d1 = length(p - path_`).concat(n,`_position(mid1, source, target));
    float d2 = length(p - path_`).concat(n,`_position(mid2, source, target));
    if (d1 < d2) {
      hi = mid2;
    } else {
      lo = mid1;
    }
  }
  return (lo + hi) * 0.5;
}
`)}function pu(n){return`
// Auto-generated signed distance (via closest_t + normal)
float path_`.concat(n,`_distance(vec2 p, vec2 source, vec2 target) {
  float closestT = path_`).concat(n,`_closest_t(p, source, target);
  vec2 closest = path_`).concat(n,`_position(closestT, source, target);
  vec2 diff = p - closest;
  float dist = length(diff);
  if (dist < 0.0001) return 0.0;

  // Get normal at closest point
  vec2 normal = path_`).concat(n,`_normal(closestT, source, target);
  return dist * sign(dot(diff, normal));
}
`)}function vu(n){return`
// Auto-generated t_at_distance (binary search)
float path_`.concat(n,`_t_at_distance(float targetDist, vec2 source, vec2 target) {
  if (targetDist <= 0.0) return 0.0;

  float totalLen = path_`).concat(n,`_length(source, target);
  if (targetDist >= totalLen) return 1.0;

  // Binary search for t
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;

    // Compute arc length from 0 to mid
    float arcLen = 0.0;
    vec2 prev = path_`).concat(n,`_position(0.0, source, target);
    for (int j = 1; j <= 8; j++) {
      float t = mid * float(j) / 8.0;
      vec2 curr = path_`).concat(n,`_position(t, source, target);
      arcLen += length(curr - prev);
      prev = curr;
    }

    if (arcLen < targetDist) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}
`)}function Fn(n,a){var t=new RegExp("\\b(float|vec[234]|void|int|bool)\\s+".concat(a,"\\s*\\("));return t.test(n)}function ji(n,a){var t=[];return Fn(a,"path_".concat(n,"_length"))||t.push(fu(n)),Fn(a,"path_".concat(n,"_closest_t"))||t.push(gu(n)),Fn(a,"path_".concat(n,"_distance"))||t.push(pu(n)),Fn(a,"path_".concat(n,"_t_at_distance"))||t.push(vu(n)),t.length>0?`
// ============================================================================
// Auto-generated fallback functions (path only provided position)
// ============================================================================
`.concat(t.join(`
`)):""}function Xi(n){var a,t,e,r=n.paths,i=n.layers,o=(a=n.extremities)!==null&&a!==void 0?a:[];if(r.length===0)throw new Error("At least one path is required in 'paths'");if(i.length===0)throw new Error("At least one layer is required in 'layers'");var s=(t=n.defaultHead)!==null&&t!==void 0?t:"none",l=(e=n.defaultTail)!==null&&e!==void 0?e:"none";return{paths:r,extremities:o,layers:i,path:r[0],layer:i[0],defaultHead:s,defaultTail:l}}var qi=WebGL2RenderingContext,Wt=qi.FLOAT,ci=qi.UNSIGNED_BYTE;function mu(n,a,t){var e=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"]),r=new Set(e);return n.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),a.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),t.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),Array.from(r)}function $a(n){var a=new Set,t=[],e=M(n),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;a.has(i.name)||(a.add(i.name),t.push("// Path: ".concat(i.name)),t.push(i.glsl),t.push(Vi(i.name)),t.push(ji(i.name,i.glsl)))}}catch(o){e.e(o)}finally{e.f()}return t.join(`

`)}function bu(n){var a=[],t=M(n),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;a.push("// Extremity: ".concat(r.name)),a.push(r.glsl)}}catch(i){t.e(i)}finally{t.f()}return a.join(`

`)}var yu=[{queryName:"queryPathPosition",pathFunc:"position",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathTangent",pathFunc:"tangent",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathNormal",pathFunc:"normal",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathLength",pathFunc:"length",returnType:"float",params:"vec2 source, vec2 target",args:"source, target"},{queryName:"queryPathClosestT",pathFunc:"closest_t",returnType:"float",params:"vec2 p, vec2 source, vec2 target",args:"p, source, target"}];function xu(n,a){var t=a.queryName,e=a.pathFunc,r=a.returnType,i=a.params,o=a.args;if(n.length===1)return"".concat(r," ").concat(t,"(int pathId, ").concat(i,`) {
  return path_`).concat(n[0].name,"_").concat(e,"(").concat(o,`);
}`);var s=n.map(function(l,u){return"    case ".concat(u,": return path_").concat(l.name,"_").concat(e,"(").concat(o,");")}).join(`
`);return"".concat(r," ").concat(t,"(int pathId, ").concat(i,`) {
  switch (pathId) {
`).concat(s,`
    default: return path_`).concat(n[0].name,"_").concat(e,"(").concat(o,`);
  }
}`)}function Va(n){return yu.map(function(a){return xu(n,a)}).join(`

`)}function _u(n){if(n.length===1)return`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  return extremity_`.concat(n[0].name,`(uv, lengthRatio, widthRatio);
}`);var a=n.map(function(t,e){return"    case ".concat(e,": return extremity_").concat(t.name,"(uv, lengthRatio, widthRatio);")}).join(`
`);return`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  switch (extremityId) {
`.concat(a,`
    default: return extremity_`).concat(n[0].name,`(uv, lengthRatio, widthRatio);
  }
}`)}function Tu(n){var a=[],t=M(n),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;a.push(cu(r.name)),a.push(hu(r.name))}}catch(s){t.e(s)}finally{t.f()}if(n.length===1)a.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_`.concat(n[0].name,`(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_`).concat(n[0].name,`(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`));else{var i=n.map(function(s,l){return"    case ".concat(l,": return findSourceClampT_").concat(s.name,"(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);")}).join(`
`),o=n.map(function(s,l){return"    case ".concat(l,": return findTargetClampT_").concat(s.name,"(source, target, targetSize, targetShapeId, targetRotateAlign, margin);")}).join(`
`);a.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
`.concat(i,`
    default: return findSourceClampT_`).concat(n[0].name,`(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
`).concat(o,`
    default: return findTargetClampT_`).concat(n[0].name,`(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`))}return a.join(`

`)}function Eu(n,a,t,e,r){var i=be([].concat($(n),$(t))),o=Yt(i),s=gt(e,r),l=Object.keys(s.offsets),u=function(R){var S=s.specs[R].size;return S===1?"float":"vec".concat(S)},d=l.map(function(_){return"".concat(u(_)," v_source_").concat(_,`;
`).concat(u(_)," v_target_").concat(_,";")}).join(`
`),c=ct(s,{varPrefix:"srcNodeAttr",baseTexelExpr:"srcIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_source_"}),f=ct(s,{varPrefix:"tgtNodeAttr",baseTexelExpr:"tgtIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_target_"}),h=l.map(function(_){return"".concat(u(_)," g_").concat(_,";")}).join(`
`),p=l.map(function(_){return"  g_".concat(_," = v_source_").concat(_,";")}).join(`
`),b=l.map(function(_){return"  g_".concat(_," = v_target_").concat(_,";")}).join(`
`),v=new Set,g=[],m=function(R){v.has(R.name)||(v.add(R.name),g.push("uniform ".concat(R.type," ").concat(R.name,";")))};n.forEach(function(_){return _.uniforms.forEach(m)}),a.forEach(function(_){return _.uniforms.forEach(m)});var y=a.map(function(_){return te(_.widthFactor)}).join(", "),T=Math.max.apply(Math,$(n.map(function(_){return _.minBodyLengthRatio||0}))),x=`#version 300 es

// Node and edge data textures
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;

// Edge attribute texture (for path-specific attributes like curvature)
`.concat(o.uniformDeclarations,`

// Node attribute texture (for node shape attributes)
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

// Render params needed for clamping
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;

// Edge-frame texture dimensions, for scattering each point to its texel
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;

// Custom path/extremity uniforms
`).concat(g.join(`
`),`

// Path attribute varyings \u2014 assigned so path functions can read them as globals
`).concat(o.vertexVaryingDeclarations,`

// Node size varyings \u2014 read by path functions like loop
out float v_sourceNodeSize;
out float v_targetNodeSize;

// Node shape attributes per endpoint, and the ones querySDF reads
`).concat(d,`
`).concat(h,`

// Scattered output written to the edge-frame texel: [tStart, tEnd, straightenFactor, pathLength]
out vec4 v_clamp;

// Extremity width factor array (needed for extremityScale computation)
const float EXTREMITY_WIDTH_FACTORS[`).concat(a.length,"] = float[](").concat(y,`);

// Node-data fetch helpers (geometry texel + rotation-flags texel)
`).concat(we,`
`).concat(Ue,`

// Shape SDFs for node boundary clamping
`).concat(yi(),`
`).concat(xi(new Set(l)),`

// Path functions
`).concat($a(n),`
`).concat(Va(n),`
`).concat(Tu(n),`

void main() {
  // One point per edge-data row; the row index is the edge-frame texel target.
  int edgeIdx = gl_VertexID;
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes and assign to path-function globals
`).concat(o.fetchCode,`
`).concat(o.varyingAssignments,`

  // Fetch node shape attributes for both endpoints
`).concat(c.fetchCode,`
`).concat(c.varyingAssignments,`
`).concat(f.fetchCode,`
`).concat(f.varyingAssignments,`

  // Fetch node geometry (texel 0) and rotation flags (texel 1).
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;
  float a_sourceShapeId = srcNodeData.w;
  float a_targetShapeId = tgtNodeData.w;
  // Per-node rotation alignment (0 = viewport, 1 = graph), for boundary clamping.
  float a_sourceRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx).r;
  float a_targetRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx).r;

  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = `).concat(te(T),`;

  // Thickness in WebGL units (needed to compute clamping margin and extremity lengths)
  float pixelsThickness = max(a_thickness, u_minEdgeThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // SDF clamping: find where the edge body meets the node boundaries. Always
  // searched (ungated) so labels get a true boundary clamp; the body re-applies
  // its extremity gating in-shader.
`).concat(p,`
  float tStart = queryFindSourceClampT(pathId, a_source, a_sourceSize, int(a_sourceShapeId), a_sourceRotateAlign, a_target, 0.0);
`).concat(b,`
  float tEnd = queryFindTargetClampT(pathId, a_source, a_target, a_targetSize, int(a_targetShapeId), a_targetRotateAlign, 0.0);

  // straightenFactor (frame .z) is consumed only by the body, which runs to the
  // node center when an extremity is absent. Derive the straightening math from
  // these gated clamps \u2014 not the ungated boundary ones above \u2014 so it matches the
  // geometry it drives. The ungated tStart/tEnd remain what labels read.
  float bodyTStart = tailLengthRatio > 0.0 ? tStart : 0.0;
  float bodyTEnd = headLengthRatio > 0.0 ? tEnd : 1.0;

  // Path length and zone boundaries (needed for straightening check)
  float pathLength = queryPathLength(pathId, a_source, a_target);
  float visibleLength = pathLength * (bodyTEnd - bodyTStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  float tTailEnd = bodyTStart + tailLengthT;
  float tHeadStart = bodyTEnd - headLengthT;
  if (tTailEnd > tHeadStart) {
    float mid = (bodyTStart + bodyTEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Straighten factor: blend toward straight line when path twists in extremity zones
  float straightenFactor = 0.0;
  {
    float maxDeviation = 0.0;
    if (tailLengthT > 0.0001) {
      vec2 tailTang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
      vec2 tailChord = queryPathPosition(pathId, bodyTStart, a_source, a_target)
                     - queryPathPosition(pathId, tTailEnd, a_source, a_target);
      float tailChordLen = length(tailChord);
      if (tailChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(-tailTang, tailChord / tailChordLen));
      }
    }
    if (headLengthT > 0.0001) {
      vec2 headTang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
      vec2 headChord = queryPathPosition(pathId, bodyTEnd, a_source, a_target)
                     - queryPathPosition(pathId, tHeadStart, a_source, a_target);
      float headChordLen = length(headChord);
      if (headChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(headTang, headChord / headChordLen));
      }
    }
    straightenFactor = smoothstep(0.035, 0.5, maxDeviation);
  }

  // When straightening, blend the ungated tStart/tEnd (the label-facing clamps)
  // toward straight-line clamp positions.
  if (straightenFactor > 0.001) {
    if (tailLengthRatio > 0.0) {
`).concat(p,`
      float srcExtent = a_sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
      float srcEffective = 1.0 - u_correctionRatio / srcExtent;
      float srcCa = u_cameraAngle * (1.0 - a_sourceRotateAlign);
      mat2 srcRot = mat2(cos(srcCa), -sin(srcCa), sin(srcCa), cos(srcCa));
      float lo = 0.0, hi = 0.5;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = srcRot * ((pos - a_source) / srcExtent);
        float sdf = querySDF(int(a_sourceShapeId), localPos, srcEffective);
        if (sdf < 0.0) lo = mid; else hi = mid;
      }
      tStart = mix(tStart, (lo + hi) * 0.5, straightenFactor);
    }
    if (headLengthRatio > 0.0) {
`).concat(b,`
      float tgtExtent = a_targetSize * u_correctionRatio / u_sizeRatio * 2.0;
      float tgtEffective = 1.0 - u_correctionRatio / tgtExtent;
      float tgtCa = u_cameraAngle * (1.0 - a_targetRotateAlign);
      mat2 tgtRot = mat2(cos(tgtCa), -sin(tgtCa), sin(tgtCa), cos(tgtCa));
      float lo = 0.5, hi = 1.0;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = tgtRot * ((pos - a_target) / tgtExtent);
        float sdf = querySDF(int(a_targetShapeId), localPos, tgtEffective);
        if (sdf < 0.0) hi = mid; else lo = mid;
      }
      tEnd = mix(tEnd, (lo + hi) * 0.5, straightenFactor);
    }
  }

  v_clamp = vec4(tStart, tEnd, straightenFactor, pathLength);

  // Scatter this point to its edge's texel center in the frame texture.
  float x = mod(float(edgeIdx), u_frameTextureWidth);
  float y = floor(float(edgeIdx) / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`);return x}var kn=0,hi=1,In=2;function Su(n,a,t){var e=[];t&&(e.push([kn,0,-1],[kn,0,1]),e.push([kn,1,-1],[kn,1,1]));for(var r=0;r<=n;r++){var i=r/n;e.push([hi,i,-1],[hi,i,1])}return a&&(e.push([In,0,-1],[In,0,1]),e.push([In,1,-1],[In,1,1])),{data:e,attributes:[{name:"a_zone",size:1,type:Wt},{name:"a_zoneT",size:1,type:Wt},{name:"a_side",size:1,type:Wt}],verticesPerEdge:e.length}}function Ru(n,a,t,e){var r=be([].concat($(n),$(t))),i=Yt(r),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture"]),s=new Set,l=[],u=function(g){!o.has(g.name)&&!s.has(g.name)&&(s.add(g.name),l.push("uniform ".concat(g.type," ").concat(g.name,";")))};n.forEach(function(v){return v.uniforms.forEach(u)}),a.forEach(function(v){return v.uniforms.forEach(u)}),t.forEach(function(v){return v.uniforms.forEach(u)});var d=e.map(function(v){var g=v.size===1?"float":"vec".concat(v.size);return"in ".concat(g," ").concat(v.name,";")}).join(`
`),c=a.map(function(v){return te(v.widthFactor)}).join(", "),f=Math.max.apply(Math,$(n.map(function(v){return v.minBodyLengthRatio||0}))),h=t.some(function(v){return v.needsNodeColors}),p=n.some(function(v){return v.needsNodeSize}),b=`#version 300 es

// Constant attributes (per vertex)
`.concat(d,`

// Per-edge attributes
// Edge data (source/target indices, thickness, extremity ratios, path/extremity IDs)
// is fetched from edge data texture via edge index
in float a_edgeIndex;   // Index into edge data texture
in vec4 a_color;        // Edge color
in vec4 a_id;           // Edge ID for picking
in float a_opacity;     // Edge opacity

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture;
uniform int u_edgeFrameTextureWidth;

// Edge path attribute texture uniforms
`).concat(i.uniformDeclarations,`

// Custom uniforms
`).concat(l.join(`
`),`

// Standard varyings
out vec4 v_color;
out float v_opacity;
out vec4 v_id;
out float v_thickness;       // Edge body thickness (in consistent units)
out float v_t;
out float v_tStart;
out float v_tEnd;
out float v_side;
out float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
out vec2 v_source;
out vec2 v_target;
out float v_edgeLength;
`).concat(p?`
out float v_sourceNodeSize;  // Source node size (mirrored in labels/generator.ts as plain float)
out float v_targetNodeSize;  // Target node size (mirrored in labels/generator.ts as plain float)`:"",`
`).concat(h?`
out vec4 v_sourceColor;
out vec4 v_targetColor;`:"",`
// Zone varyings
out float v_zone;            // 0=tail, 1=body, 2=head
out float v_zoneT;           // Position within zone [0,1]
out float v_headLengthRatio; // Head length as ratio of thickness
out float v_tailLengthRatio; // Tail length as ratio of thickness
out float v_headWidthRatio;  // Head width factor
out float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat out int v_pathId;
flat out int v_headId;
flat out int v_tailId;

// Path/layer attribute varyings (fetched from edge attribute texture)
`).concat(i.vertexVaryingDeclarations,`

const float bias = 255.0 / 254.0;

// Width factor array for extremities (shared pool for head/tail)
const float EXTREMITY_WIDTH_FACTORS[`).concat(a.length,"] = float[](").concat(c,`);

// All path functions
`).concat($a(n),`

// Path selector functions
`).concat(Va(n),`

// Node-data fetch helper (geometry texel of the two-texel node stride)
`).concat(we,`
`).concat(h?Ai:"",`
// Per-edge clamp from the frame-pass (tStart, tEnd, straightenFactor, pathLength)
`).concat(Qe,`

void main() {
  // Fetch edge data from edge texture (2 texels per edge)
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, (headId << 4) | tailId
  int edgeIdx = int(a_edgeIndex);

  // Hidden edges are flagged with a negative row by EdgeProgram.process(). Push
  // the whole primitive outside the clip volume: every vertex lands at the same
  // out-of-range position, so it is fully clipped and rasterizes nothing \u2014
  // neither to the frame buffer nor to the picking buffer.
  if (edgeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    return;
  }

  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  // edgeData0.w is now reserved (curvature moved to path attribute texture)
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes from edge attribute texture
`).concat(i.fetchCode,`

  // Assign path/layer attribute varyings
`).concat(i.varyingAssignments,`

  // Fetch source and target node geometry (texel 0 of the two-texel node stride)
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
`).concat(p?`
  // Assign node size varyings early (path functions like loops need them during clamping)
  v_sourceNodeSize = srcNodeData.z;
  v_targetNodeSize = tgtNodeData.z;`:"",`
`).concat(h?`
  v_sourceColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  v_targetColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);`:"",`

  // Convert thickness to WebGL units
  float minThickness = u_minEdgeThickness;
  float pixelsThickness = max(a_thickness, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Extremity parameters from ID lookups (shared pool)
  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = `).concat(te(f),`;

  // Per-edge values from the frame-pass texture (read by edge index).
  // tStart/tEnd are the ungated boundary clamps: re-apply the body's extremity
  // gating here (no extremity \u2192 body runs to the node center, 0/1).
  vec4 frameClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  float tStart           = a_tailLengthRatio > 0.0 ? frameClamp.x : 0.0;
  float tEnd             = a_headLengthRatio > 0.0 ? frameClamp.y : 1.0;
  float straightenFactor = frameClamp.z;
  float pathLength       = frameClamp.w;

  // Anti-aliasing width (~1 pixel, normalized by thickness)
  float antialiasingWidth = u_correctionRatio / webGLThickness;

  float visibleLength = pathLength * (tEnd - tStart);

  // Compute extremity lengths in world units
  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  // Handle short edges: scale down extremities if needed
  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  // Convert lengths to t-values
  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  // Zone boundaries in t-space
  float tTailEnd = tStart + tailLengthT;
  float tHeadStart = tEnd - headLengthT;

  // Ensure body has non-negative length
  if (tTailEnd > tHeadStart) {
    float mid = (tStart + tEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Convert to webGL units for geometry expansion
  float aaWidthWebGL = antialiasingWidth * webGLThickness;

  // Extra geometry width for picking padding (0 in visual mode)
  #ifdef PICKING_MODE
    float pickingPaddingWebGL = u_pickingPadding * u_correctionRatio;
  #else
    float pickingPaddingWebGL = 0.0;
  #endif

  // Straight-line direction and normal (for blending when straightenFactor > 0)
  vec2 straightDir = length(a_target - a_source) > 0.0001
    ? normalize(a_target - a_source) : vec2(1.0, 0.0);
  vec2 straightNormal = vec2(-straightDir.y, straightDir.x);

  // Zone-based vertex processing using path selectors
  vec2 position;
  vec2 normal;
  float t;
  float zone = a_zone;
  float zoneT = a_zoneT;
  float side = a_side;

  // Scaled extremity width factors (geometry must be at least as wide as body)
  float scaledTailWidth = max(tailWidthFactor * extremityScale, 1.0);
  float scaledHeadWidth = max(headWidthFactor * extremityScale, 1.0);

  if (zone < 0.5) {
    // TAIL ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tStart, a_source, a_target),
                         queryPathPosition(pathId, tTailEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tStart, tTailEnd, zoneT);

  } else if (zone < 1.5) {
    // BODY ZONE: follows path curvature with width = 1.0
    t = mix(tTailEnd, tHeadStart, zoneT);
    normal = queryPathNormal(pathId, t, a_source, a_target);
    float halfWidth = webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = queryPathPosition(pathId, t, a_source, a_target) + normal * side * halfWidth;

  } else {
    // HEAD ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tHeadStart, a_source, a_target),
                         queryPathPosition(pathId, tEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tHeadStart, tEnd, zoneT);
  }

  // Blend toward straight line based on path twist in extremity zones
  if (straightenFactor > 0.001) {
    float zoneWidth = zone < 0.5 ? webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      zone < 1.5 ? webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    vec2 straightPos = mix(a_source, a_target, t) + straightNormal * side * zoneWidth;
    position = mix(position, straightPos, straightenFactor);
  }

  gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0.0, 1.0);

  // Pass varyings to fragment shader
  v_color = a_color;
  v_color.a *= bias;
  v_opacity = a_opacity;
  v_id = a_id;
  v_thickness = webGLThickness;
  v_t = t;
  v_tStart = tStart;
  v_tEnd = tEnd;
  v_side = side;
  v_antialiasingWidth = antialiasingWidth;
  v_source = a_source;
  v_target = a_target;
  v_edgeLength = pathLength;

  // Zone varyings
  v_zone = zone;
  v_zoneT = zoneT;
  v_headLengthRatio = headLengthRatio * extremityScale;
  v_tailLengthRatio = tailLengthRatio * extremityScale;
  // Scale extremity width proportionally with length when crushed
  v_headWidthRatio = headWidthFactor * extremityScale;
  v_tailWidthRatio = tailWidthFactor * extremityScale;

  // Multi-path varyings
  v_pathId = pathId;
  v_headId = headId;
  v_tailId = tailId;
}
`);return b}function Au(n,a,t,e){var r=be([].concat($(n),$(t))),i=Yt(r),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding"]),s=new Set,l=[],u=function(m){!o.has(m.name)&&!s.has(m.name)&&(s.add(m.name),l.push("uniform ".concat(m.type," ").concat(m.name,";")))};n.forEach(function(g){return g.uniforms.forEach(u)}),a.forEach(function(g){return g.uniforms.forEach(u)}),t.forEach(function(g){return g.uniforms.forEach(u)});var d=a.map(function(g){var m;return te((m=g.baseRatio)!==null&&m!==void 0?m:.5)}).join(", "),c=function(m){var y,T;return a.length>1?"EXTREMITY_BASE_RATIOS[".concat(m,"]"):te((y=(T=a[0])===null||T===void 0?void 0:T.baseRatio)!==null&&y!==void 0?y:.5)},f=a.some(function(g){return Te(g.length)?!0:g.length>0}),h=t.some(function(g){return g.needsNodeColors}),p=n.some(function(g){return g.needsNodeSize}),b=t.map(function(g,m){return"  // Layer ".concat(m+1,": ").concat(g.name,`
  color = blendOver(color, layer_`).concat(g.name,"(context));")}).join(`

`),v=`#version 300 es
precision highp float;

// Standard varyings
in vec4 v_color;
in float v_opacity;
in vec4 v_id;
in float v_thickness;       // Edge body thickness
in float v_t;
in float v_tStart;
in float v_tEnd;
in float v_side;
in float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
in vec2 v_source;
in vec2 v_target;
in float v_edgeLength;
`.concat(p?`
in float v_sourceNodeSize;   // Source node size (mirrored in labels/generator.ts as plain float)
in float v_targetNodeSize;   // Target node size (mirrored in labels/generator.ts as plain float)`:"",`
`).concat(h?`
in vec4 v_sourceColor;
in vec4 v_targetColor;`:"",`
// Zone varyings
in float v_zone;            // 0=tail, 1=body, 2=head
in float v_zoneT;           // Position within zone [0,1]
in float v_headLengthRatio; // Head length as ratio of thickness (scaled for short edges)
in float v_tailLengthRatio; // Tail length as ratio of thickness (scaled for short edges)
in float v_headWidthRatio;  // Head width factor
in float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat in int v_pathId;
flat in int v_headId;
flat in int v_tailId;

// Path/layer attribute varyings (from vertex shader texture fetch)
`).concat(i.fragmentVaryingDeclarations,`

// Standard uniforms (needed by some path types)
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Custom uniforms
`).concat(l.join(`
`),`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

`).concat(a.length>1?`// Base ratio array for extremities (shared pool for head/tail)
const float EXTREMITY_BASE_RATIOS[`.concat(a.length,"] = float[](").concat(d,");"):"",`

// EdgeContext struct
struct EdgeContext {
  float t;                   // Position along path [0, 1]
  float sdf;                 // Signed distance from centerline
  vec2 position;             // World position
  vec2 tangent;              // Path tangent
  vec2 normal;               // Path normal
  float thickness;           // Edge thickness
  float aaWidth;             // Anti-aliasing width
  float edgeLength;          // Total path length
  float tStart;              // Clamped start t
  float tEnd;                // Clamped end t
  float distanceFromSource;  // Arc distance from source
  float distanceToTarget;    // Arc distance to target
};

EdgeContext context;

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// All path functions
`).concat($a(n),`

// Path selector functions
`).concat(Va(n),`

// All extremity functions
`).concat(bu(a),`

// Extremity SDF selector (shared pool for head/tail)
`).concat(_u(a),`

// Layer functions
`).concat(t.map(function(g){return g.glsl}).join(`

`),`

// Helper: Compute arc length using path selector
float computeArcLengthMulti(int pathId, float t0, float t1, vec2 source, vec2 target, int samples) {
  float arcLen = 0.0;
  vec2 prev = queryPathPosition(pathId, t0, source, target);
  for (int i = 1; i <= samples; i++) {
    float t = t0 + (t1 - t0) * float(i) / float(samples);
    vec2 curr = queryPathPosition(pathId, t, source, target);
    arcLen += length(curr - prev);
    prev = curr;
  }
  return arcLen;
}

void main() {
  // Compute normalized t within visible edge (0 = start, 1 = end)
  float tNorm = (v_t - v_tStart) / max(v_tEnd - v_tStart, 0.0001);

  // Edge body half-thickness
  float halfThickness = v_thickness * 0.5;

  // Convert normalized AA width to webGL units (~1 pixel)
  float aaWidthWebGL = v_antialiasingWidth * v_thickness;

  // Distance from centerline based on v_side interpolation
  float zoneWidthFactor = v_zone < 0.5 ? v_tailWidthRatio :
                          v_zone < 1.5 ? 1.0 :
                          v_headWidthRatio;
  // In PICKING_MODE, inflate halfGeometryWidth to match the inflated vertex geometry
  #ifdef PICKING_MODE
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL + u_pickingPadding * aaWidthWebGL;
  #else
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL;
  #endif
  float distFromCenter = abs(v_side) * halfGeometryWidth;

  // Populate EdgeContext (for layer functions)
  context.t = tNorm;
  context.sdf = distFromCenter - halfThickness;
  context.position = queryPathPosition(v_pathId, v_t, v_source, v_target);
  context.tangent = queryPathTangent(v_pathId, v_t, v_source, v_target);
  context.normal = vec2(-context.tangent.y, context.tangent.x);
  context.thickness = v_thickness;
  context.aaWidth = aaWidthWebGL;
  context.edgeLength = v_edgeLength;
  context.tStart = v_tStart;
  context.tEnd = v_tEnd;

  // Compute arc distances
  float visibleLength = v_edgeLength * (v_tEnd - v_tStart);
  float pathT = v_t;
  float pathTNorm = tNorm;
`).concat(n.every(function(g){return g.linearParameterization})?`  // All paths have linear parameterization: t maps directly to arc distance
  context.distanceFromSource = pathTNorm * visibleLength;
  context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;`:n.every(function(g){return!g.linearParameterization})?`  // No paths have linear parameterization: use numerical integration
  context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
  context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);`:`  // Mixed parameterization: use analytical for linear paths, numerical for others
  if (`.concat(n.filter(function(g){return g.linearParameterization}).map(function(g){return"v_pathId == ".concat(n.indexOf(g))}).join(" || "),`) {
    context.distanceFromSource = pathTNorm * visibleLength;
    context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;
  } else {
    context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
    context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);
  }`),`

  // Compute SDF based on zone using extremity selector (shared pool)
  float bodySDF = distFromCenter - halfThickness;
  float finalSDF;

`).concat(f?`  // Base ratios, from baseRatioLookup
  float headBaseRatio = `.concat(c("v_headId"),`;
  float tailBaseRatio = `).concat(c("v_tailId"),`;

  if (v_zone < 0.5) {
    // TAIL ZONE: v_zoneT goes 0 (tip) to 1 (base)
    vec2 uv = vec2((1.0 - v_zoneT) * v_tailLengthRatio, v_side * v_tailWidthRatio * 0.5);
    float tailSDF = queryExtremitySDF(v_tailId, uv, v_tailLengthRatio, v_tailWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT > 1 - baseRatio)
    if (v_zoneT > 1.0 - tailBaseRatio) {
      finalSDF = min(tailSDF, bodySDF);
    } else {
      finalSDF = tailSDF;
    }
  } else if (v_zone < 1.5) {
    // BODY ZONE: distance from centerline
    finalSDF = bodySDF;
  } else {
    // HEAD ZONE: v_zoneT goes 0 (base) to 1 (tip)
    vec2 uv = vec2(v_zoneT * v_headLengthRatio, v_side * v_headWidthRatio * 0.5);
    float headSDF = queryExtremitySDF(v_headId, uv, v_headLengthRatio, v_headWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT < baseRatio)
    if (v_zoneT < headBaseRatio) {
      finalSDF = min(headSDF, bodySDF);
    } else {
      finalSDF = headSDF;
    }
  }`):`  // No extremity draws tail/head geometry, so every vertex is body zone.
  finalSDF = bodySDF;`,`

  #ifdef PICKING_MODE
    // Picking pass: output edge ID for pixels within the picking area
    if (finalSDF > u_pickingPadding * aaWidthWebGL) discard;
    fragColor = v_id;
  #else
`).concat(e?`    // Visual pass: anti-aliased edge with layers, edge opacity applied once
    float alpha = smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) edge with layers, edge opacity applied once
    float alpha = (finalSDF < 0.0 ? 1.0 : 0.0) * v_opacity;`,`
    if (alpha < 0.01) discard;

    // Apply layers sequentially with "over" compositing
    vec4 color = vec4(0.0);

`).concat(b,`

    // Mix with transparent to fade both color AND alpha (pre-multiplied alpha for correct blending)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`);return v}function Du(n,a,t){var e=Te(a.length)?!0:a.length>0,r=Te(t.length)?!0:t.length>0;if(n.generateConstantData){var i=n.generateConstantData();return{data:i.data,attributes:i.attributes,verticesPerEdge:i.verticesPerEdge}}return Su(n.segments,e,r)}function Na(n){var a,t=Xi(n),e=t.paths,r=t.extremities,i=t.layers,o=(a=n.antialias)!==null&&a!==void 0?a:!0,s=new Map,l=new Map,u=new Map,d=M(e),c;try{for(d.s();!(c=d.n()).done;){var f=c.value,h=M(r),p;try{for(h.s();!(p=h.n()).done;){var b=p.value,v=M(r),g;try{for(v.s();!(g=v.n()).done;){var m=g.value,y="".concat(f.name,":").concat(b.name,":").concat(m.name),T=Du(f,b,m);s.set(y,T.verticesPerEdge),l.set(y,T.data);var x=M(T.attributes),_;try{for(x.s();!(_=x.n()).done;){var R=_.value;u.has(R.name)||u.set(R.name,R)}}catch(j){x.e(j)}finally{x.f()}}}catch(j){v.e(j)}finally{v.f()}}}catch(j){h.e(j)}finally{h.f()}}}catch(j){d.e(j)}finally{d.f()}var S=Array.from(u.values()),C={};S.forEach(function(j,X){C[j.name]=X});var D=0,k="",A=M(s),I;try{for(A.s();!(I=A.n()).done;){var w=Q(I.value,2),F=w[0],G=w[1];G>D&&(D=G,k=F)}}catch(j){A.e(j)}finally{A.f()}var N=l.get(k)||[],P=k.split(":"),L=Q(P,1),z=L[0],H=e.find(function(j){return j.name===z}),W=[];H!=null&&H.generateConstantData?W=H.generateConstantData().attributes:W=[{name:"a_zone"},{name:"a_zoneT"},{name:"a_side"}];var q=N.map(function(j){var X=new Array(S.length).fill(0);return W.forEach(function(_e,de){var Pe=C[_e.name];Pe!==void 0&&de<j.length&&(X[Pe]=j[de])}),X});return{vertexShader:Ru(e,r,i,S),fragmentShader:Au(e,r,i,o),uniforms:mu(e,r,i),attributes:wu(),verticesPerEdge:D,constantData:q,constantAttributes:S,vertexCountsPerCombination:s,constantDataPerCombination:l}}function wu(n,a,t){return[{name:"a_edgeIndex",size:1,type:Wt},{name:"a_color",size:4,type:ci,normalized:!0},{name:"a_id",size:4,type:ci,normalized:!0},{name:"a_opacity",size:1,type:Wt}]}var Cu=`#version 300 es
precision highp float;

in vec4 v_clamp;

// RGBA32F target: stores (tStart, tEnd, straightenFactor, pathLength).
out vec4 fragColor;

void main() {
  fragColor = v_clamp;
}
`,Yi=(function(){function n(a,t){Y(this,n),E(this,"uniformLocations",{});var e=t.paths,r=t.extremities,i=t.layers,o=t.nodeShapes,s=t.nodeLayers;this.gl=a,this.hasAttributeData=be([].concat($(e),$(i))).floatsPerItem>0,this.hasNodeAttributeData=Object.keys(gt(o,s).offsets).length>0,this.vertexShader=Ht(a,Eu(e,r,i,o,s)),this.fragmentShader=$t(a,Cu),this.program=Vt(a,[this.vertexShader,this.fragmentShader]);var l=new Set;this.customUniforms=[];for(var u=0,d=[].concat($(e),$(r));u<d.length;u++){var c=d[u],f=M(c.uniforms),h;try{for(f.s();!(h=f.n()).done;){var p=h.value;l.has(p.name)||(l.add(p.name),this.customUniforms.push(p))}}catch(y){f.e(y)}finally{f.f()}}var b=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_minEdgeThickness","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode","u_frameTextureWidth","u_frameTextureHeight"].concat($(this.customUniforms.map(function(y){return y.name}))),v=M(b),g;try{for(v.s();!(g=v.n()).done;){var m=g.value;this.uniformLocations[m]=a.getUniformLocation(this.program,m)}}catch(y){v.e(y)}finally{v.f()}this.vao=a.createVertexArray()}return K(n,[{key:"run",value:function(t,e,r,i,o){if(r!==0){var s=this.gl,l=this.uniformLocations;s.useProgram(this.program),s.bindVertexArray(this.vao),l.u_sizeRatio&&s.uniform1f(l.u_sizeRatio,t.sizeRatio),l.u_correctionRatio&&s.uniform1f(l.u_correctionRatio,t.correctionRatio),l.u_cameraAngle&&s.uniform1f(l.u_cameraAngle,t.cameraAngle),l.u_minEdgeThickness&&s.uniform1f(l.u_minEdgeThickness,t.minEdgeThickness),l.u_nodeDataTexture&&s.uniform1i(l.u_nodeDataTexture,t.nodeDataTextureUnit),l.u_nodeDataTextureWidth&&s.uniform1i(l.u_nodeDataTextureWidth,t.nodeDataTextureWidth),l.u_edgeDataTexture&&s.uniform1i(l.u_edgeDataTexture,t.edgeDataTextureUnit),l.u_edgeDataTextureWidth&&s.uniform1i(l.u_edgeDataTextureWidth,t.edgeDataTextureWidth),l.u_frameTextureWidth&&s.uniform1f(l.u_frameTextureWidth,e.getTextureWidth()),l.u_frameTextureHeight&&s.uniform1f(l.u_frameTextureHeight,e.getTextureHeight()),this.hasAttributeData&&i&&(i.bind(Be),l.u_edgeAttributeTexture&&s.uniform1i(l.u_edgeAttributeTexture,Be),l.u_edgeAttributeTextureWidth&&s.uniform1i(l.u_edgeAttributeTextureWidth,i.getTextureWidth()),l.u_edgeAttributeTexelsPerEdge&&s.uniform1i(l.u_edgeAttributeTexelsPerEdge,i.getTexelsPerItem())),this.hasNodeAttributeData&&o&&(o.bind(Oe),l.u_layerAttributeTexture&&s.uniform1i(l.u_layerAttributeTexture,Oe),l.u_layerAttributeTextureWidth&&s.uniform1i(l.u_layerAttributeTextureWidth,o.getTextureWidth()),l.u_layerAttributeTexelsPerNode&&s.uniform1i(l.u_layerAttributeTexelsPerNode,o.getTexelsPerItem()));var u=M(this.customUniforms),d;try{for(u.s();!(d=u.n()).done;){var c=d.value;Ba(s,this.uniformLocations[c.name],c)}}catch(f){u.e(f)}finally{u.f()}e.bindAsRenderTarget(),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.drawArrays(s.POINTS,0,r),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindVertexArray(null)}}},{key:"kill",value:function(){var t=this.gl;t.deleteProgram(this.program),t.deleteShader(this.vertexShader),t.deleteShader(this.fragmentShader),t.deleteVertexArray(this.vao)}}])})();function Bt(n,a,t,e,r,i){if(n.length===1)return"".concat(e," ").concat(a,"(int pathId, ").concat(r,`) {
  return path_`).concat(n[0].name,"_").concat(t,"(").concat(i,`);
}`);var o=n.map(function(s,l){return"    case ".concat(l,": return path_").concat(s.name,"_").concat(t,"(").concat(i,");")}).join(`
`);return"".concat(e," ").concat(a,"(int pathId, ").concat(r,`) {
  switch (pathId) {
`).concat(o,`
    default: return path_`).concat(n[0].name,"_").concat(t,"(").concat(i,`);
  }
}`)}var Lu=`
vec3 computeEdgeLabelBodyBounds(
  float tStart, float tEnd, float pathLength,
  float webGLThickness, float headLengthRatio, float tailLengthRatio
) {
  float visibleLength = pathLength * (tEnd - tStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float totalNeededLength = headLength + tailLength;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    float extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float bodyStartDist = tStart * pathLength + tailLength;
  float bodyEndDist = tEnd * pathLength - headLength;
  return vec3(bodyStartDist, bodyEndDist, max(bodyEndDist - bodyStartDist, 0.0));
}
`;function Pu(n,a){var t=te(n),e=te(a);return`
float computeEdgeLabelAlpha(float bodyLength, float textWidthWebGL) {
  float ratio = textWidthWebGL > 0.0001 ? min(bodyLength / textWidthWebGL, 1.0) : 1.0;
  if (ratio < `.concat(t,`) return 0.0;
  if (ratio < `).concat(e,") return (ratio - ").concat(t,") / (").concat(e," - ").concat(t,`);
  return 1.0;
}
`)}var Fu=`
float computeEdgeLabelScreenDir(int pathId, float t, vec2 source, vec2 target, mat3 matrix) {
  vec2 tangent = queryPathTangent(pathId, t, source, target);
  return (matrix * vec3(tangent, 0.0)).x < 0.0 ? -1.0 : 1.0;
}
`,ku=`
float computeEdgeLabelPerpOffset(
  float positionMode,
  float halfThickness, float marginWebGL, float halfTextHeight,
  float readingSign, float screenDir
) {
  float magnitude = halfThickness + marginWebGL + halfTextHeight;
  if (positionMode == 1.0) return magnitude * readingSign;
  if (positionMode == 2.0) return -magnitude * readingSign;
  if (positionMode == 3.0) return magnitude * screenDir;
  return 0.0;
}
`;function Ki(n){var a=n.paths,t=n.minVisibilityThreshold,e=n.fullVisibilityThreshold,r=a.some(function(s){return s.hasSharpCorners}),i=a.map(function(s){return"// --- Path: ".concat(s.name,` ---
`).concat(s.glsl,`

// Tangent/normal functions: analytical if provided, otherwise numerical
`).concat(s.analyticalTangentGlsl||Vi(s.name),`

// Auto-generated fallbacks for any missing path functions
`).concat(ji(s.name,s.glsl),`

// Corner skip helpers (for paths with sharp corners like step/taxi)
`).concat(s.cornerSkipGlsl||"",`
`)}).join(`
`),o=r?`// Corner function selectors (only some paths have sharp corners)
vec2 queryGetCornerTs(int pathId, vec2 source, vec2 target) {
  switch (pathId) {
`.concat(a.map(function(s,l){return s.hasSharpCorners?"    case ".concat(l,": return path_").concat(s.name,"_getCornerTs(source, target);"):"    case ".concat(l,": return vec2(-1.0, -1.0); // No corners for ").concat(s.name)}).join(`
`),`
    default: return vec2(-1.0, -1.0);
  }
}

vec2 queryGetCornerConcavity(int pathId, vec2 source, vec2 target, float perpOffset) {
  switch (pathId) {
`).concat(a.map(function(s,l){return s.hasSharpCorners?"    case ".concat(l,": return path_").concat(s.name,"_getCornerConcavity(source, target, perpOffset);"):"    case ".concat(l,": return vec2(0.0, 0.0); // No corners for ").concat(s.name)}).join(`
`),`
    default: return vec2(0.0, 0.0);
  }
}`):"";return`
// ============================================================================
// Node data fetch (geometry texel) and per-edge clamp fetch (edge-frame texture)
// ============================================================================

`.concat(we,`
`).concat(Qe,`

// ============================================================================
// Path Functions (one block per path)
// ============================================================================

`).concat(i,`

// ============================================================================
// Path Query Selectors (dispatch by pathId)
// ============================================================================

`).concat(Bt(a,"queryPathPosition","position","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(Bt(a,"queryPathTangent","tangent","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(Bt(a,"queryPathNormal","normal","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(Bt(a,"queryPathLength","length","float","vec2 source, vec2 target","source, target"),`

`).concat(Bt(a,"queryPathTAtDistance","t_at_distance","float","float dist, vec2 source, vec2 target","dist, source, target"),`

`).concat(o,`

// ============================================================================
// Shared helpers (body bounds, alpha ramp, screen direction, perpendicular offset)
// ============================================================================

`).concat(Lu,`
`).concat(Pu(t,e),`
`).concat(Fu,`
`).concat(ku,`
`)}var Iu=De.fontSize,Nu=new Map,Zi=24,fi=(Zi+1)*2;function Gu(n){var a=n.paths,t=n.fontSizeMode,e=n.headLengthRatio,r=n.tailLengthRatio,i=n.minVisibilityThreshold,o=n.fullVisibilityThreshold,s=n.keepUpright,l=t==="scaled",u=Ae(),d=be([].concat($(a),[u])),c=Yt(d),f=`#version 300 es

// Per-instance attributes
in float a_edgeIndex;
in float a_edgeAttrIndex;
in float a_baseFontSize;
in float a_totalTextWidth;
in float a_positionMode;
in float a_margin;
in float a_padding;
in vec4 a_color;
in vec4 a_id;

// Per-vertex (constant) attribute: strip vertex index
in float a_vertexIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
`.concat(l?"uniform float u_zoomSizeRatio;":"",`

`).concat(c.uniformDeclarations,`

out vec4 v_color;
out vec4 v_id;
out float v_alphaModifier;

const float ATLAS_FONT_SIZE = `).concat(te(Iu),`;
const float HEAD_RATIO = `).concat(te(e),`;
const float TAIL_RATIO = `).concat(te(r),`;
const int RIBBON_SEGMENTS = `).concat(Zi,`;

// Path attribute varyings (declared as plain locals since this shader has no FS inputs for them)
`).concat(c.vertexVaryingDeclarations.replace(/out /g,""),`

// Node size variables used by some path functions (self-loops, etc.)
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
`).concat(Ki({paths:a,minVisibilityThreshold:i,fullVisibilityThreshold:o}),`

void main() {
  int vIdx = int(a_vertexIndex);
  int pairIdx = vIdx / 2;
  int side = vIdx - pairIdx * 2; // 0 = left/bottom, 1 = right/top

  // --- Fetch edge data (2 texels per edge) ---
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 e0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 e1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, e0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, e1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  int pathId = int(edgeData1.z);

  // --- Fetch path attributes (curvature, etc.) ---
  {
    int edgeIdx = int(a_edgeAttrIndex);
`).concat(c.fetchCode,`
`).concat(c.varyingAssignments,`
  }

  // --- Fetch node data: geometry (texel 0) + rotation flags (texel 1) ---
  vec4 srcN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcN.xy;
  vec2 target = tgtN.xy;
  float sourceSize = srcN.z;
  float targetSize = tgtN.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;

  // --- Pixel-to-graph conversion (fixed font mode) ---
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // --- Body bounds (shared with edge label shader) ---
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, HEAD_RATIO, TAIL_RATIO
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // --- Text dimensions ---
  float baseFontSize = a_baseFontSize;
  `).concat(l?`float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  float textWidthWebGL = a_totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float marginWebGL = a_margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  float textWidthWebGL = a_totalTextWidth * fontScale * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;
  float marginWebGL = a_margin * pixelToGraph;`,`
  float paddingWebGL = a_padding * pixelToGraph;

  // --- Alpha modifier (shared with edge label shader) ---
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);
  if (alphaModifier <= 0.0 || textWidthWebGL <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    v_alphaModifier = 0.0;
    return;
  }

  // --- Perpendicular offset (shared with edge label shader) ---
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;
  float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);
  float screenDir = computeEdgeLabelScreenDir(pathId, centerT, source, target, u_matrix);
  float readingSign = `).concat(s?"screenDir":"1.0",`;
  float halfThickness = webGLThickness * 0.5;
  float perpOffset = computeEdgeLabelPerpOffset(
    a_positionMode, halfThickness, marginWebGL, halfTextHeight, readingSign, screenDir
  );

  // --- Ribbon span (clipped to body) ---
  float halfTextWebGL = textWidthWebGL * 0.5;
  float labelStartDist = max(bodyCenterDist - halfTextWebGL, bodyStartDist);
  float labelEndDist = min(bodyCenterDist + halfTextWebGL, bodyEndDist);

  // Sample centerline at this pair, then apply perpendicular offset.
  // The ribbon follows the centerline path (simple & robust); for curved edges
  // this closely matches the offset path the characters sit on.
  float u = float(pairIdx) / float(RIBBON_SEGMENTS);
  float arcDist = mix(labelStartDist, labelEndDist, u);
  float t = queryPathTAtDistance(pathId, arcDist, source, target);
  vec2 pos = queryPathPosition(pathId, t, source, target);
  vec2 tan = queryPathTangent(pathId, t, source, target);
  vec2 perp = vec2(-tan.y, tan.x);

  vec2 centerPos = pos + perp * perpOffset;

  float halfRibbon = halfTextHeight + paddingWebGL;
  float sideSign = side == 0 ? -1.0 : 1.0;
  vec2 ribbonPos = centerPos + perp * (sideSign * halfRibbon);

  vec3 clipPos = u_matrix * vec3(ribbonPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  v_color = a_color;
  v_id = a_id;
  v_alphaModifier = alphaModifier;
}
`);return f}var zu=`#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_id;
in float v_alphaModifier;

out vec4 fragColor;

void main() {
#ifdef PICKING_MODE
  if (v_alphaModifier <= 0.0) discard;
  fragColor = v_id;
#else
  float alpha = v_color.a * v_alphaModifier;
  if (alpha <= 0.0) discard;
  fragColor = vec4(v_color.rgb * alpha, alpha);
#endif
}
`;function Qi(n,a,t,e){var r=e.shaderConfig,i=r.paths,o=r.fontSizeMode;if(i.length===0)throw new Error("createEdgeLabelBackgroundProgram: shaderConfig must declare at least one path");var s=Ae(),l=be([].concat($(i),[s])),u=Wn([].concat($(i),[s]),l),d=Gu(r),c=(function(f){function h(p,b,v){var g;return Y(this,h),g=ne(this,h,[p,b,v]),E(g,"totalCount",0),E(g,"bufferCapacity",0),E(g,"edgeAttributeTexture",null),g.edgeAttributeTexture=new Un(p,l),g.packedAttributeData=new Float32Array(l.floatsPerItem),g}return ae(h,f),K(h,[{key:"getDefinition",value:function(){for(var b=WebGL2RenderingContext,v=b.FLOAT,g=b.UNSIGNED_BYTE,m=b.TRIANGLE_STRIP,y=[],T=0;T<fi;T++)y.push([T]);var x=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_resolution","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth"];return o==="scaled"&&x.push("u_zoomSizeRatio"),l.floatsPerItem>0&&x.push("u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"),{VERTICES:fi,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:zu,METHOD:m,UNIFORMS:x,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:v},{name:"a_edgeAttrIndex",size:1,type:v},{name:"a_baseFontSize",size:1,type:v},{name:"a_totalTextWidth",size:1,type:v},{name:"a_positionMode",size:1,type:v},{name:"a_margin",size:1,type:v},{name:"a_padding",size:1,type:v},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_id",size:4,type:g,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:"a_vertexIndex",size:1,type:v}],CONSTANT_DATA:y}}},{key:"processEdgeLabelBackground",value:function(b,v,g){var m=0;if(this.edgeAttributeTexture&&l.floatsPerItem>0){m=this.edgeAttributeTexture.allocate(v);var y=this.packedAttributeData;Hn(u,g.edgeAttributes,y,"",Nu,0),this.edgeAttributeTexture.updateAllAttributes(v,y)}var T=this.floats,x=this.ints,_=b*this.STRIDE;T[_++]=g.edgeIndex,T[_++]=m,T[_++]=g.baseFontSize,T[_++]=g.totalTextWidth,T[_++]=g.positionMode,T[_++]=g.margin,T[_++]=g.padding,T[_++]=g.color,x[_++]=g.id}},{key:"setUniforms",value:function(b,v){var g=v.gl,m=v.uniformLocations;if(g.uniformMatrix3fv(m.u_matrix,!1,b.matrix),g.uniform1f(m.u_sizeRatio,b.sizeRatio),g.uniform1f(m.u_correctionRatio,b.correctionRatio),g.uniform1f(m.u_pixelRatio,b.pixelRatio),g.uniform1f(m.u_cameraAngle,b.cameraAngle),g.uniform2f(m.u_resolution,b.width,b.height),m.u_nodeDataTexture!==void 0&&g.uniform1i(m.u_nodeDataTexture,b.nodeDataTextureUnit),m.u_nodeDataTextureWidth!==void 0&&g.uniform1i(m.u_nodeDataTextureWidth,b.nodeDataTextureWidth),m.u_edgeDataTexture!==void 0&&g.uniform1i(m.u_edgeDataTexture,b.edgeDataTextureUnit),m.u_edgeDataTextureWidth!==void 0&&g.uniform1i(m.u_edgeDataTextureWidth,b.edgeDataTextureWidth),m.u_edgeFrameTexture!==void 0&&g.uniform1i(m.u_edgeFrameTexture,b.edgeFrameTextureUnit),m.u_edgeFrameTextureWidth!==void 0&&g.uniform1i(m.u_edgeFrameTextureWidth,b.edgeFrameTextureWidth),o==="scaled"&&m.u_zoomSizeRatio!==void 0){var y=this.renderer.getSetting("zoomToSizeRatioFunction");g.uniform1f(m.u_zoomSizeRatio,1/y(b.zoomRatio))}this.edgeAttributeTexture&&l.floatsPerItem>0&&m.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(Be),g.uniform1i(m.u_edgeAttributeTexture,Be),g.uniform1i(m.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),g.uniform1i(m.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()))}},{key:"renderProgram",value:function(b,v){this.edgeAttributeTexture&&l.floatsPerItem>0&&this.edgeAttributeTexture.upload(),re(h,"renderProgram",this,3)([b,v])}},{key:"kill",value:function(){this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),re(h,"kill",this,3)([])}},{key:"drawWebGL",value:function(b,v){var g=v.gl;this.totalCount!==0&&g.drawArraysInstanced(g.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}},{key:"reallocate",value:function(b){this.totalCount=b,b>this.bufferCapacity&&(this.bufferCapacity=Math.max(b,Math.ceil(this.bufferCapacity*1.5)||10),re(h,"reallocate",this,3)([this.bufferCapacity]))}}])})(Ce);return new c(n,a,t)}function Ji(n){var a,t,e,r,i,o;return{paths:n.paths,headLengthRatio:(a=n.headLengthRatio)!==null&&a!==void 0?a:0,tailLengthRatio:(t=n.tailLengthRatio)!==null&&t!==void 0?t:0,fontSizeMode:(e=n.fontSizeMode)!==null&&e!==void 0?e:"fixed",minVisibilityThreshold:(r=n.minVisibilityThreshold)!==null&&r!==void 0?r:.7,fullVisibilityThreshold:(i=n.fullVisibilityThreshold)!==null&&i!==void 0?i:.8,keepUpright:(o=n.keepUpright)!==null&&o!==void 0?o:!0}}var Mu=De.fontSize,Ou=17/64;function Bu(n){var a=n.paths,t=n.hasBorder,e=t===void 0?!1:t,r=n.fontSizeMode,i=r===void 0?"fixed":r,o=n.minVisibilityThreshold,s=o===void 0?.5:o,l=n.fullVisibilityThreshold,u=l===void 0?.6:l,d=n.keepUpright,c=d===void 0?!0:d,f=i==="scaled",h=a.some(function(m){return m.hasSharpCorners}),p=Ae(),b=be([].concat($(a),[p])),v=Yt(b),g=`#version 300 es

// ============================================================================
// Attributes - Per Character (Instanced)
// ============================================================================

// Edge geometry: indices for texture lookup
// Edge data (source/target node indices, thickness, head/tail ratios) is fetched from edge data texture
// Edge path attributes (curvature, etc.) are fetched from edge attribute texture
in float a_edgeIndex;       // Index into edge data texture
in float a_edgeAttrIndex;   // Index into edge attribute texture (for curvature, etc.)
in float a_baseFontSize;    // Base font size in pixels (per-label)

// Character metrics (in glyph units = atlas font size pixels)
in vec4 a_charMetrics;      // (charTextOffset, charAdvance, totalTextWidth, positionMode)
in vec4 a_charDims;         // (charSize.x, charSize.y, charOffset.x, charOffset.y)

// Atlas texture coordinates
in vec4 a_texCoords;        // (x, y, width, height) in atlas pixels

// Label parameters
in vec2 a_labelParams;      // (margin, unused)

// Appearance
in vec4 a_color;            // Character color (RGBA, normalized)
`.concat(e?"in vec4 a_borderColor;      // Border color (RGBA, normalized)":"",`

// ============================================================================
// Attributes - Per Vertex (Constant)
// ============================================================================

in vec2 a_quadCorner;       // Quad corner: (0,0), (1,0), (0,1), (1,1)

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;    // Required by node shape SDFs
// u_sdfBufferPixels kept for ABI compatibility but unused in shader
uniform float u_sdfBufferPixels;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture; // Shared texture with node position/size/shape data
uniform int u_nodeDataTextureWidth;  // Width of 2D node data texture for coordinate calculation
uniform sampler2D u_edgeDataTexture; // Shared texture with edge data
uniform int u_edgeDataTextureWidth;  // Width of 2D edge data texture for coordinate calculation
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
`).concat(f?"uniform float u_zoomSizeRatio;  // Zoom-based size ratio from zoomToSizeRatioFunction":"",`

// Edge path attribute texture uniforms (for curvature and other path attributes)
`).concat(v.uniformDeclarations,`

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
`).concat(e?"out vec4 v_borderColor;":"",`
out float v_edgeFade;  // 0 = fully visible, 1 = fully faded (outside body)
out float v_alphaModifier;  // 0-1 based on label visibility ratio
out float v_fontScale;  // Ratio of rendered font size to atlas font size
`).concat(e?"out float v_positionMode;  // Position mode for conditional border (0=over needs border)":"",`

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float FADE_WIDTH_PIXELS = 15.0;  // Width of fade gradient in pixels
const float ATLAS_FONT_SIZE = `).concat(te(Mu),`;  // Base font size used in SDF atlas
const float VERTICAL_CENTER_RATIO = `).concat(te(Ou),`;  // Baseline to visual center ratio

// ============================================================================
// Path Attribute Variables (set in main, used by path functions)
// ============================================================================
// Path attributes are fetched from the edge attribute texture and stored in
// variables with v_ prefix (e.g., v_curvature) for path functions to access.
`).concat(v.vertexVaryingDeclarations.replace(/out /g,""),`

// Node size variables (set in main, used by some path functions like loops).
// These mirror the v_sourceNodeSize / v_targetNodeSize varyings in generator.ts,
// but are plain floats here since the label shader is vertex-only.
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
`).concat(Ki({paths:a,minVisibilityThreshold:s,fullVisibilityThreshold:u}),`

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Fetch edge data from edge texture (2 texels per edge)
  // -------------------------------------------------------------------------
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, extremityIds
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  // edgeData0.w is reserved
  float headLengthRatio = edgeData1.x;
  float tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);  // Path type for multi-path support
  float baseFontSize = a_baseFontSize;

  // -------------------------------------------------------------------------
  // Fetch path attributes from edge attribute texture
  // -------------------------------------------------------------------------
  // Note: The fetch code uses 'edgeIdx' variable, so we set it to the attribute texture index
  {
    int edgeIdx = int(a_edgeAttrIndex);  // Use attribute texture index for path attributes
`).concat(v.fetchCode,`
`).concat(v.varyingAssignments,`
  }

  // -------------------------------------------------------------------------
  // Fetch node data from node texture (geometry texel + rotation-flags texel)
  // -------------------------------------------------------------------------
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcNodeData.xy;
  vec2 target = tgtNodeData.xy;
  float sourceSize = srcNodeData.z;
  float targetSize = tgtNodeData.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;
  float charTextOffset = a_charMetrics.x;
  float charAdvance = a_charMetrics.y;
  float totalTextWidth = a_charMetrics.z;
  float positionMode = a_charMetrics.w;
  vec2 charSize = a_charDims.xy;
  vec2 charOffset = a_charDims.zw;
  float margin = a_labelParams.x;

  // -------------------------------------------------------------------------
  // Compute pixel-to-graph conversion (for fixed font size mode)
  // -------------------------------------------------------------------------
  // This converts screen pixels to graph units such that N pixels on screen
  // becomes N pixels regardless of zoom level.
  // matrixScaleX is how much the matrix scales graph units to clip space
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  // -------------------------------------------------------------------------
  // Step 1: Convert thickness to WebGL units
  // -------------------------------------------------------------------------
  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // -------------------------------------------------------------------------
  // Step 2: Compute body bounds (truncated at node boundaries + extremities)
  // -------------------------------------------------------------------------
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, headLengthRatio, tailLengthRatio
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // -------------------------------------------------------------------------
  // Step 3: Compute font scale and text dimensions
  // -------------------------------------------------------------------------
  // Font size modes:
  // - "fixed": Constant pixel size regardless of zoom, using pixelToGraph conversion
  // - "scaled": Scales with zoom using zoomToSizeRatioFunction
  `).concat(f?`// Scaled mode: font scales with zoom
  float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  // Convert glyph-unit metrics to WebGL units (scales with zoom)
  float textWidthWebGL = totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float charOffsetWebGL = charTextOffset * fontScale * u_correctionRatio / u_sizeRatio;
  float charAdvanceWebGL = charAdvance * fontScale * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: font stays constant in screen pixels
  float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  // Convert glyph-unit metrics to graph units using pixelToGraph (zoom-independent)
  float textWidthWebGL = totalTextWidth * fontScale * pixelToGraph;
  float charOffsetWebGL = charTextOffset * fontScale * pixelToGraph;
  float charAdvanceWebGL = charAdvance * fontScale * pixelToGraph;`,`

  // Font scale varying for fragment shader gamma scaling.
  // Ratio of rendered font size to atlas font size \u2014 used to tighten the
  // anti-aliasing band for large labels so they stay sharp.
  v_fontScale = fontScale;

  // -------------------------------------------------------------------------
  // Step 4: Alpha modifier from how much of the label fits in the body
  // -------------------------------------------------------------------------
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);

  // -------------------------------------------------------------------------
  // Step 5: Compute character center offset (truncation check moved to after curvature adjustment)
  // -------------------------------------------------------------------------
  // Body center in arc distance
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;

  float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);
  float screenDir = computeEdgeLabelScreenDir(pathId, centerT, source, target, u_matrix);

  // Reversed labels lay their characters out from target to source
  float readingSign = `).concat(c?"screenDir":"1.0",`;

  // Character center position relative to label center (on centerline, before curvature adjustment)
  float charCenterOffset = readingSign * (charOffsetWebGL + charAdvanceWebGL * 0.5 - textWidthWebGL * 0.5);

  // -------------------------------------------------------------------------
  // Step 6: Compute perpendicular offset based on position mode
  // -------------------------------------------------------------------------
  // Position modes: 0=over, 1=above, 2=below, 3=auto
  // Needed early for curvature-adaptive character spacing in Step 7
  float halfThickness = webGLThickness * 0.5;
  `).concat(f?`// Scaled mode: margin and text height scale with zoom (same factor as font)
  float marginWebGL = margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: margin and text height stay constant in screen pixels
  float marginWebGL = margin * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;`,`
  float perpOffset = computeEdgeLabelPerpOffset(
    positionMode, halfThickness, marginWebGL, halfTextHeight, readingSign, screenDir
  );

  // -------------------------------------------------------------------------
  // Step 7: Position character on path using offset path traversal
  // -------------------------------------------------------------------------
  // For "over" mode (perpOffset = 0), use simple centerline placement
  // For above/below modes, walk along the offset path to find correct position
  float charT;

  if (perpOffset == 0.0) {
    // Simple case: place on centerline
    float charArcDist = bodyCenterDist + charCenterOffset;
    charT = queryPathTAtDistance(pathId, charArcDist, source, target);
  } else {
    // Offset path traversal: walk along the offset curve to find character position
    // This ensures even character spacing regardless of curvature

    `).concat(h?`// -----------------------------------------------------------------------
    // Corner skip setup for step/taxi edges with above/below labels
    // -----------------------------------------------------------------------
    // At concave corners (inner side of the bend), characters would bunch up
    // because the offset path has near-zero arc length. We detect corner
    // crossings during the offset path traversal and add skip distance.

    // Get corner t values and concavity
    vec2 cornerTs = queryGetCornerTs(pathId, source, target);
    vec2 concavity = queryGetCornerConcavity(pathId, source, target, perpOffset);

    // Skip distance in graph units, proportional to on-screen font size
    // For fixed mode: use pixelToGraph so gap stays constant regardless of zoom
    // For scaled mode: use the same conversion as text width
    `.concat(f?"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;":"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * pixelToGraph;",`

    // Corner t values for detecting crossings during traversal
    float corner1T = cornerTs.x;
    float corner2T = cornerTs.y;
    bool corner1IsConcave = concavity.x > 0.5;
    bool corner2IsConcave = concavity.y > 0.5;`):"",`

    // Target distance along offset path from center
    float targetOffsetDist = abs(charCenterOffset);

    // Handle center character (charCenterOffset \u2248 0) - no search needed
    if (targetOffsetDist < 0.0001) {
      charT = centerT;
    } else {
      vec2 centerPos = queryPathPosition(pathId, centerT, source, target);
      vec2 centerNormal = queryPathNormal(pathId, centerT, source, target);
      vec2 offsetCenter = centerPos + centerNormal * perpOffset;

      float searchDir = charCenterOffset > 0.0 ? 1.0 : -1.0;

      // Search bounds (t values for body start and end)
      float tBodyStart = queryPathTAtDistance(pathId, bodyStartDist, source, target);
      float tBodyEnd = queryPathTAtDistance(pathId, bodyEndDist, source, target);

      // Walk along offset path to find character position
      float accumDist = 0.0;
      vec2 prevOffsetPos = offsetCenter;
      float prevT = centerT;
      float foundT = centerT;

      // Search range depends on direction
      float tSearchEnd = searchDir > 0.0 ? tBodyEnd : tBodyStart;

      `).concat(h?`// Track which concave corners we've crossed to add skip distance
      bool crossedCorner1 = false;
      bool crossedCorner2 = false;
      float effectiveTargetDist = targetOffsetDist;`:"",`

      const int STEPS = 32;
      for (int i = 1; i <= STEPS; i++) {
        // Step along centerline t, from center toward target
        float stepT = centerT + searchDir * float(i) * abs(tSearchEnd - centerT) / float(STEPS);

        `).concat(h?`// Check for concave corner crossings and add skip distance
        // Corner 1 crossing check
        if (corner1IsConcave && !crossedCorner1) {
          bool crossingCorner1 = (searchDir > 0.0)
            ? (prevT < corner1T && stepT >= corner1T)
            : (prevT > corner1T && stepT <= corner1T);
          if (crossingCorner1) {
            crossedCorner1 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }

        // Corner 2 crossing check
        if (corner2IsConcave && !crossedCorner2) {
          bool crossingCorner2 = (searchDir > 0.0)
            ? (prevT < corner2T && stepT >= corner2T)
            : (prevT > corner2T && stepT <= corner2T);
          if (crossingCorner2) {
            crossedCorner2 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }`:"",`

        // Compute offset position at this t
        vec2 stepPos = queryPathPosition(pathId, stepT, source, target);
        vec2 stepNormal = queryPathNormal(pathId, stepT, source, target);
        vec2 offsetPos = stepPos + stepNormal * perpOffset;

        // Distance along offset path
        float segDist = length(offsetPos - prevOffsetPos);

        `).concat(h?`if (accumDist + segDist >= effectiveTargetDist) {
          // Interpolate within segment to find exact t
          float remaining = effectiveTargetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`:`if (accumDist + segDist >= targetOffsetDist) {
          // Interpolate within segment to find exact t
          float remaining = targetOffsetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`,`

        accumDist += segDist;
        prevOffsetPos = offsetPos;
        prevT = stepT;
        // Update foundT to last valid position in case loop exhausts without finding target
        foundT = stepT;
      }

      charT = foundT;
    }
  }

  // Get position and tangent at final character position
  vec2 pathPos = queryPathPosition(pathId, charT, source, target);
  vec2 tangent = queryPathTangent(pathId, charT, source, target);

  // Compute perpendicular direction (90 degrees from tangent)
  vec2 perpDir = vec2(-tangent.y, tangent.x);

  // Apply perpendicular offset to path position
  vec2 offsetPathPos = pathPos + perpDir * perpOffset;

  // -------------------------------------------------------------------------
  // Step 8: Build character quad
  // -------------------------------------------------------------------------
  // Character size in screen pixels
  vec2 charSizePixels = charSize * fontScale;

  // Character offset from origin to the atlas region's top-left corner.
  // bearingX/bearingY already include the SDF buffer.
  vec2 charOffsetPixels = charOffset * fontScale;

  // The character's local X offset from pathPos (which is at character center)
  float charLocalX = -charAdvance * 0.5 * fontScale;

  // Build quad position:
  // - Start at character origin (charLocalX on X axis, 0 on Y axis = baseline)
  // - Add bearing offset to get to atlas region corner
  // - Add quad corner * size to get vertex position
  vec2 quadPos;
  quadPos.x = charLocalX + charOffsetPixels.x + a_quadCorner.x * charSizePixels.x;
  // charOffset.y = -bearingY (negated), so -charOffsetPixels.y = bearingY * fontScale
  // (distance from baseline to atlas region top, positive = upward)
  // Quad corner (0,0) = bottom-left, (1,1) = top-right
  quadPos.y = -charOffsetPixels.y - charSizePixels.y * (1.0 - a_quadCorner.y);

  // Center vertically on the path by offsetting by half the visual text height
  // VERTICAL_CENTER_RATIO is the distance from baseline to visual center as a ratio of atlas font size
  float verticalCenterOffset = VERTICAL_CENTER_RATIO * ATLAS_FONT_SIZE * fontScale;
  quadPos.y -= verticalCenterOffset;

  // -------------------------------------------------------------------------
  // Step 9: Rotate quad to align with tangent
  // -------------------------------------------------------------------------
  // Rotation matrix from the reading direction
  // readingDir = (cos(angle), sin(angle)), so we can build rotation directly
  vec2 readingDir = tangent * readingSign;
  mat2 rotation = mat2(readingDir.x, readingDir.y, -readingDir.y, readingDir.x);

  // Convert pixel offset to WebGL units for rotation
  `).concat(f?"vec2 quadPosWebGL = quadPos * u_correctionRatio / u_sizeRatio; // Scaled mode":"vec2 quadPosWebGL = quadPos * pixelToGraph; // Fixed mode: use pixelToGraph for zoom-independent size",`

  // Rotate around character center on path
  vec2 rotatedOffset = rotation * quadPosWebGL;

  // Final position in graph space (using offset path position for above/below modes)
  vec2 worldPos = offsetPathPos + rotatedOffset;

  // -------------------------------------------------------------------------
  // Step 10: Transform to clip space
  // -------------------------------------------------------------------------
  vec3 clipPos = u_matrix * vec3(worldPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 11: Texture coordinates
  // -------------------------------------------------------------------------
  // Flip Y for texture coordinates (texture Y goes down, quad Y goes up)
  vec2 texCorner = vec2(a_quadCorner.x, 1.0 - a_quadCorner.y);
  v_texCoord = (a_texCoords.xy + texCorner * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 12: Pass color, border color, and alpha modifier
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
`).concat(e?`  v_borderColor = a_borderColor;
  v_borderColor.a *= bias;
  v_positionMode = positionMode;`:"",`
  v_alphaModifier = alphaModifier;

  // -------------------------------------------------------------------------
  // Step 13: Compute edge fade for soft truncation
  // -------------------------------------------------------------------------
  // Convert fade width from pixels to WebGL units
  `).concat(f?"float fadeWidthWebGL = FADE_WIDTH_PIXELS * u_correctionRatio / u_sizeRatio;":"float fadeWidthWebGL = FADE_WIDTH_PIXELS * pixelToGraph;",`

  // Compute the arc position of THIS VERTEX (not just character center)
  // The quad extends from charCenter - advance/2 to charCenter + advance/2
  // a_quadCorner.x is 0 for left edge, 1 for right edge
  float vertexLocalOffset = readingSign * (a_quadCorner.x - 0.5) * charAdvanceWebGL;
  float vertexArcOffset = charCenterOffset + vertexLocalOffset;

  // Compute distance from body edges (positive = inside body, negative = outside)
  float halfBody = bodyLength * 0.5;
  float distFromStart = vertexArcOffset + halfBody;  // Distance from body start edge
  float distFromEnd = halfBody - vertexArcOffset;    // Distance from body end edge
  float distFromEdge = min(distFromStart, distFromEnd);

  // Compute fade: 0 = fully visible (deep inside body), 1 = fully faded (at body edge)
  // Fade goes from 0 (at 2*fadeWidth inside) to 1 (at body edge)
  // This ensures text is fully transparent before reaching extremities
  v_edgeFade = 1.0 - smoothstep(0.0, fadeWidthWebGL * 2.0, distFromEdge);
}
`);return g}function Uu(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=n.hasBorder,t=a===void 0?!1:a,e=`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
`.concat(t?"in vec4 v_borderColor;":"",`
in float v_edgeFade;  // 0 = fully visible, 1 = fully faded
in float v_alphaModifier;  // 0-1 based on label visibility ratio
in float v_fontScale;  // Ratio of rendered font size to atlas font size
`).concat(t?"in float v_positionMode;  // Position mode (0=over, 1=above, 2=below, 3=auto)":"",`

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;
`).concat(t?"uniform float u_borderWidth;  // Border width in SDF units (normalized)":"",`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Edge labels are not pickable - discard all fragments in picking mode
    fragColor = vec4(0.0);
    discard;
  #else
  // SDF stores normalized distance: 0.5 = on edge, >0.5 = inside glyph
  float sdfValue = texture(u_atlas, v_texCoord).a;

  // Edge threshold accounting for SDF buffer padding
  float edge = 1.0 - u_sdfBuffer;

  // Scale gamma inversely with font scale so small labels get a wider AA band
  // (smoother) and large labels get a tighter band (sharper).
  float aaWidth = u_gamma / (u_pixelRatio * v_fontScale);

  // Apply edge fade for soft truncation at body boundaries
  // Also apply visibility-based alpha modifier for short edge labels
  float edgeAlpha = (1.0 - v_edgeFade) * v_alphaModifier;

`).concat(t?`  // Fill alpha: fully opaque inside the glyph
  float fillAlpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Only apply border for "over" position mode (v_positionMode == 0.0)
  // Labels positioned above/below/auto don't overlap the edge line and don't need borders
  if (v_positionMode < 0.5) {
    // Border rendering: compute alpha for both fill and border regions
    // Border extends from (edge - borderWidth) to edge
    float borderEdge = edge - u_borderWidth;

    // Border alpha: opaque in the border region (between borderEdge and edge)
    float borderAlpha = smoothstep(borderEdge - aaWidth, borderEdge + aaWidth, sdfValue);

    // Composite: fill on top of border
    // Border is visible where borderAlpha > 0 but fillAlpha < 1
    vec3 borderColorPremult = v_borderColor.rgb * v_borderColor.a * borderAlpha * edgeAlpha;
    vec3 fillColorPremult = v_color.rgb * v_color.a * fillAlpha * edgeAlpha;

    // Blend fill over border (fill replaces border where fill is opaque)
    float finalBorderAlpha = borderAlpha * (1.0 - fillAlpha);
    vec3 finalColor = fillColorPremult + v_borderColor.rgb * v_borderColor.a * finalBorderAlpha * edgeAlpha;
    float finalAlpha = (v_color.a * fillAlpha + v_borderColor.a * finalBorderAlpha) * edgeAlpha;

    fragColor = vec4(finalColor, finalAlpha);
  } else {
    // No border for above/below/auto positions - simple text rendering
    float finalAlpha = v_color.a * fillAlpha * edgeAlpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  }`:`  // Smooth transition from transparent to opaque at glyph edge
  float alpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Premultiplied alpha output
  float finalAlpha = v_color.a * alpha * edgeAlpha;
  fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);`,`
  #endif
}
`);return e}function Wu(n){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"fixed",e=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_sdfBufferPixels","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"];t==="scaled"&&e.push("u_zoomSizeRatio"),a&&e.push("u_borderWidth");var r=M(n),i;try{for(r.s();!(i=r.n()).done;){var o=i.value,s=M(o.uniforms),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;e.includes(u.name)||e.push(u.name)}}catch(d){s.e(d)}finally{s.f()}}}catch(d){r.e(d)}finally{r.f()}return e}function eo(n){var a=n.hasBorder,t=a===void 0?!1:a,e=n.fontSizeMode,r=e===void 0?"fixed":e;return{vertexShader:Bu(n),fragmentShader:Uu({hasBorder:t}),uniforms:Wu(n.paths,t,r)}}var Hu=new Map;function $u(n){switch(n){case"over":return 0;case"above":return 1;case"below":return 2;case"auto":return 3;default:return 0}}function to(n,a,t,e){var r=e.color,i=e.margin,o=e.textBorder,s=Ji(e),l=s.paths,u=s.fontSizeMode,d=s.minVisibilityThreshold,c=s.fullVisibilityThreshold,f=s.keepUpright,h=!!o,p=eo({paths:l,hasBorder:h,fontSizeMode:u,minVisibilityThreshold:d,fullVisibilityThreshold:c,keepUpright:f}),b=(function(v){function g(m,y,T){var x;Y(this,g),x=ne(this,g,[m,y,T]),E(x,"atlasTexture",null),E(x,"atlasNeedsUpdate",!1),E(x,"refreshTimeout",null),E(x,"labelGlyphCache",new Map),E(x,"edgeAttributeTexture",null);var _=Ae();if(x.attributeLayout=be([].concat($(l),[_])),x.attrDescriptors=Wn([].concat($(l),[_]),x.attributeLayout),x.edgeAttributeTexture=new Un(m,x.attributeLayout),x.packedAttributeData=new Float32Array(x.attributeLayout.floatsPerItem),x.atlasManager=new Ye,x.gamma=.025,x.sdfBuffer=De.cutoff,x.atlasTexture=m.createTexture(),!x.atlasTexture)throw new Error("EdgeLabelProgram: failed to create atlas texture");m.bindTexture(m.TEXTURE_2D,x.atlasTexture),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_WRAP_S,m.CLAMP_TO_EDGE),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_WRAP_T,m.CLAMP_TO_EDGE),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_MIN_FILTER,m.LINEAR),m.texParameteri(m.TEXTURE_2D,m.TEXTURE_MAG_FILTER,m.LINEAR),m.bindTexture(m.TEXTURE_2D,null),x.atlasManager.on(Ye.ATLAS_UPDATED_EVENT,function(){x.atlasNeedsUpdate=!0,x.refreshTimeout!==null&&clearTimeout(x.refreshTimeout),x.refreshTimeout=setTimeout(function(){x.refreshTimeout=null,x.renderer.refresh()},0)});var R={family:"sans-serif",weight:"normal",style:"normal"};return x.defaultFontKey=x.atlasManager.registerFont(R),x}return ae(g,v),K(g,[{key:"getDefinition",value:function(){var y=WebGL2RenderingContext,T=y.FLOAT,x=y.UNSIGNED_BYTE,_=y.TRIANGLE_STRIP,R=new Set,S=[],C=M(l),D;try{for(C.s();!(D=C.n()).done;){var k=D.value,A=M(k.attributes),I;try{for(A.s();!(I=A.n()).done;){var w=I.value,F=w.name.startsWith("a_")?w.name:"a_".concat(w.name);R.has(F)||(R.add(F),S.push({name:F,size:w.size,type:w.type}))}}catch(G){A.e(G)}finally{A.f()}}}catch(G){C.e(G)}finally{C.f()}return{VERTICES:4,VERTEX_SHADER_SOURCE:p.vertexShader,FRAGMENT_SHADER_SOURCE:p.fragmentShader,METHOD:_,UNIFORMS:p.uniforms,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:T},{name:"a_edgeAttrIndex",size:1,type:T},{name:"a_baseFontSize",size:1,type:T},{name:"a_charMetrics",size:4,type:T},{name:"a_charDims",size:4,type:T},{name:"a_texCoords",size:4,type:T},{name:"a_labelParams",size:2,type:T},{name:"a_color",size:4,type:x,normalized:!0}].concat($(h?[{name:"a_borderColor",size:4,type:x,normalized:!0}]:[]),$(S.filter(function(G){return!["a_curvature","curvature"].includes(G.name)}))),CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:T}],CONSTANT_DATA:[[0,0],[1,0],[0,1],[1,1]]}}},{key:"prepareLabelGlyphs",value:function(y,T){if(T.hidden||!T.text){this.labelGlyphCache.delete(y);return}var x=T.text,_=T.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(x,_);var R=[],S=[],C=0,D=M(x),k;try{for(D.s();!(k=D.n()).done;){var A=k.value,I=A.codePointAt(0);if(I===void 0){R.push(void 0),S.push(C);continue}var w=this.atlasManager.getGlyph(I,_);R.push(w),S.push(C),w&&(C+=w.advance)}}catch(F){D.e(F)}finally{D.f()}this.labelGlyphCache.set(y,{glyphs:R,xOffsets:S,totalWidth:C})}},{key:"processCharacter",value:function(y,T,x,_){var R,S,C,D=this.floats,k=this.STRIDE,A=y*k,I=this.labelGlyphCache.get(T.parentKey);if(!I||!I.glyphs[_]){for(var w=0;w<k;w++)D[A+w]=0;return}var F=I.glyphs[_],G=I.xOffsets[_],N=g.labelColor,P=N&&Z(N)==="object"&&"color"in N&&N.color?N.color:T.color,L=he(P),z=A;D[z++]=T.edgeIndex,D[z++]=(R=(S=this.edgeAttributeTexture)===null||S===void 0?void 0:S.getIndex(T.parentKey))!==null&&R!==void 0?R:0,D[z++]=T.size,D[z++]=G,D[z++]=F.advance,D[z++]=I.totalWidth,D[z++]=$u(T.position),D[z++]=F.atlasWidth,D[z++]=F.atlasHeight,D[z++]=F.bearingX,D[z++]=-F.bearingY,D[z++]=F.atlasX,D[z++]=F.atlasY,D[z++]=F.atlasWidth,D[z++]=F.atlasHeight;var H=(C=g.labelMargin)!==null&&C!==void 0?C:T.margin;if(D[z++]=H,D[z++]=0,D[z++]=L,h&&o){var W;typeof o.color=="string"?W=o.color:W=o.color.color||"#ffffff",D[z++]=he(W)}var q=new Set,j=M(l),X;try{for(j.s();!(X=j.n()).done;){var _e=X.value,de=M(_e.attributes),Pe;try{for(de.s();!(Pe=de.n()).done;){var at=Pe.value,Rt=at.name.startsWith("a_")?at.name.slice(2):at.name;if(Rt!=="curvature"&&!q.has(Rt)){q.add(Rt);for(var At=0;At<at.size;At++)D[z++]=0}}}catch(Dt){de.e(Dt)}finally{de.f()}}}catch(Dt){j.e(Dt)}finally{j.f()}}},{key:"processEdgeLabel",value:function(y,T,x){if(this.prepareLabelGlyphs(y,x),this.edgeAttributeTexture&&!x.hidden&&x.text){this.edgeAttributeTexture.allocate(y);var _=this.packedAttributeData;Hn(this.attrDescriptors,x.edgeAttributes,_,"",Hu,0),this.edgeAttributeTexture.updateAllAttributes(y,_)}return re(g,"processLabel",this,3)([y,T,x])}},{key:"updateAtlasTexture",value:function(){if(this.atlasNeedsUpdate){var y=this.normalProgram.gl,T=this.atlasManager.getTextures();if(T.length!==0){var x=T[0];y.bindTexture(y.TEXTURE_2D,this.atlasTexture),y.texImage2D(y.TEXTURE_2D,0,y.RGBA,x.width,x.height,0,y.RGBA,y.UNSIGNED_BYTE,x.data),y.bindTexture(y.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}}}},{key:"setUniforms",value:function(y,T){var x=T.gl,_=T.uniformLocations,R=this.atlasManager.getTextures(),S=R.length>0?[R[0].width,R[0].height]:[1,1];if(x.uniformMatrix3fv(_.u_matrix,!1,y.matrix),x.uniform1f(_.u_sizeRatio,y.sizeRatio),x.uniform1f(_.u_correctionRatio,y.correctionRatio),x.uniform1f(_.u_pixelRatio,y.pixelRatio),x.uniform1f(_.u_cameraAngle,y.cameraAngle),x.uniform1f(_.u_sdfBufferPixels,De.buffer),x.uniform2f(_.u_resolution,y.width,y.height),x.uniform2f(_.u_atlasSize,S[0],S[1]),x.uniform1f(_.u_gamma,this.gamma),x.uniform1f(_.u_sdfBuffer,this.sdfBuffer),x.activeTexture(x.TEXTURE0),x.bindTexture(x.TEXTURE_2D,this.atlasTexture),x.uniform1i(_.u_atlas,0),_.u_nodeDataTexture!==void 0&&x.uniform1i(_.u_nodeDataTexture,y.nodeDataTextureUnit),_.u_nodeDataTextureWidth!==void 0&&x.uniform1i(_.u_nodeDataTextureWidth,y.nodeDataTextureWidth),_.u_edgeDataTexture!==void 0&&x.uniform1i(_.u_edgeDataTexture,y.edgeDataTextureUnit),_.u_edgeDataTextureWidth!==void 0&&x.uniform1i(_.u_edgeDataTextureWidth,y.edgeDataTextureWidth),_.u_edgeFrameTexture!==void 0&&x.uniform1i(_.u_edgeFrameTexture,y.edgeFrameTextureUnit),_.u_edgeFrameTextureWidth!==void 0&&x.uniform1i(_.u_edgeFrameTextureWidth,y.edgeFrameTextureWidth),h&&o&&_.u_borderWidth!==void 0){var C=o.width/De.buffer*this.sdfBuffer;x.uniform1f(_.u_borderWidth,C)}if(this.edgeAttributeTexture&&_.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(Be),x.uniform1i(_.u_edgeAttributeTexture,Be),x.uniform1i(_.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),x.uniform1i(_.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem())),u==="scaled"&&_.u_zoomSizeRatio!==void 0){var D=this.renderer.getSetting("zoomToSizeRatioFunction"),k=1/D(y.zoomRatio);x.uniform1f(_.u_zoomSizeRatio,k)}}},{key:"renderProgram",value:function(y,T){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),this.edgeAttributeTexture&&this.edgeAttributeTexture.upload(),re(g,"renderProgram",this,3)([y,T])}},{key:"registerFont",value:function(y){var T=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"normal",x=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"normal";return this.atlasManager.registerFont({family:y,weight:T,style:x})}},{key:"getAtlasManager",value:function(){return this.atlasManager}},{key:"ensureGlyphsReady",value:function(y,T){var x=T||this.defaultFontKey,_=M(y),R;try{for(_.s();!(R=_.n()).done;){var S=R.value;this.atlasManager.ensureGlyphs(S,x)}}catch(C){_.e(C)}finally{_.f()}this.atlasManager.flush()}},{key:"measureLabelAtlasWidth",value:function(y,T){var x=T||this.defaultFontKey;this.atlasManager.ensureGlyphs(y,x),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();var _=0,R=M(y),S;try{for(R.s();!(S=R.n()).done;){var C=S.value,D=C.codePointAt(0);if(D!==void 0){var k=this.atlasManager.getGlyph(D,x);k&&(_+=k.advance)}}}catch(A){R.e(A)}finally{R.f()}return _}},{key:"measureLabel",value:function(y,T,x){var _=this.measureLabelAtlasWidth(y,x),R=T/De.fontSize;return{width:_*R,height:T,textHeight:T}}},{key:"kill",value:function(){var y=this.normalProgram.gl;this.refreshTimeout!==null&&(clearTimeout(this.refreshTimeout),this.refreshTimeout=null),this.atlasTexture&&(y.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),re(g,"kill",this,3)([])}}])})(Ua);return E(b,"labelColor",r),E(b,"labelMargin",i),new b(n,a,t)}function Vu(){var n=`
// No extremity - always returns positive (outside)
float extremity_none(vec2 uv, float lengthRatio, float widthRatio) {
  return 1.0;
}
`;return{name:"none",glsl:n,length:0,widthFactor:1,margin:0,uniforms:[],attributes:[]}}function ja(n,a,t,e,r,i,o){var s,l,u=Xi(e),d=u.paths,c=u.layers,f=u.defaultHead,h=u.defaultTail,p=[Vu()].concat($(u.extremities)),b={},v={};d.forEach(function(A,I){return b[A.name]=I}),p.forEach(function(A,I){return v[A.name]=I});var g=(s=v[f])!==null&&s!==void 0?s:0,m=(l=v[h])!==null&&l!==void 0?l:0,y=null,T=be([].concat($(d),$(c))),x=(function(A){function I(w,F,G){var N;Y(this,I),y||(y=Na({paths:d,extremities:p,layers:c,antialias:r})),N=ne(this,I,[w,F,G]),E(N,"layerLifecycles",new Map),E(N,"needsShaderRegeneration",!1),E(N,"edgeAttributeTexture",null),E(N,"layout",T),E(N,"attrDescriptors",[]),E(N,"lifecycleIndexOffset",d.length),N._pickingBuffer=F,N.edgeAttributeTexture=new Un(w,N.layout),N.packedAttributeData=new Float32Array(N.layout.floatsPerItem),c.forEach(function(L,z){if(L.lifecycle){var H={gl:w,renderer:{refresh:function(){return G.refresh()}},getUniformLocation:function(q){return w.getUniformLocation(N.normalProgram.program,q)},requestShaderRegeneration:function(){N.needsShaderRegeneration=!0},requestRefresh:function(){G.refresh()}};N.layerLifecycles.set(z,L.lifecycle(H))}}),N.layerLifecycles.forEach(function(L){var z;return(z=L.init)===null||z===void 0?void 0:z.call(L)});var P=new Map;return N.layerLifecycles.forEach(function(L,z){L.getAttributeData&&P.set(d.length+z,L)}),N.attrDescriptors=Wn([].concat($(d),$(c)),N.layout,P),N}return ae(I,A),K(I,[{key:"getAttributeTexture",value:function(){return this.edgeAttributeTexture}},{key:"resolveEdgeIds",value:function(F,G,N){var P=F,L=0,z=g,H=m,W=G?P.selfLoopPath:N&&P.parallelPath?P.parallelPath:P.path;W&&b[W]!==void 0&&(L=b[W]),P.head&&P.head!=="none"&&v[P.head]!==void 0&&(z=v[P.head]),P.tail&&P.tail!=="none"&&v[P.tail]!==void 0&&(H=v[P.tail]);var q=p[z],j=p[H];return{pathId:L,headId:z,tailId:H,headLengthRatio:Te(q.length)?0:q.length,tailLengthRatio:Te(j.length)?0:j.length}}},{key:"getDefinition",value:function(){var F=WebGL2RenderingContext,G=F.TRIANGLE_STRIP,N=G,P=y;return{VERTICES:P.verticesPerEdge,VERTEX_SHADER_SOURCE:P.vertexShader,FRAGMENT_SHADER_SOURCE:P.fragmentShader,METHOD:N,UNIFORMS:P.uniforms,ATTRIBUTES:P.attributes,CONSTANT_ATTRIBUTES:P.constantAttributes,CONSTANT_DATA:P.constantData}}},{key:"maybeRegenerateShaders",value:function(){var F=this;if(this.needsShaderRegeneration){this.needsShaderRegeneration=!1;var G=c.map(function(q,j){var X=F.layerLifecycles.get(j);return X!=null&&X.regenerate?X.regenerate():q});y=Na({paths:d,extremities:p,layers:G,antialias:this.renderer.getSetting("antialiasEdges")});var N=this.normalProgram.gl,P=this.normalProgram,L=P.program,z=P.buffer,H=P.vertexShader,W=P.fragmentShader;N.deleteProgram(L),N.deleteBuffer(z),N.deleteShader(H),N.deleteShader(W),this.normalProgram=this.getProgramInfo("normal",N,y.vertexShader,y.fragmentShader,this._pickingBuffer)}}},{key:"process",value:function(F,G,N,P,L,z){var H=G*this.STRIDE;if(L.visibility==="hidden"||N.visibility==="hidden"||P.visibility==="hidden"){for(var W=H+this.STRIDE;H<W;H++)this.floats[H]=0;this.floats[G*this.STRIDE]=wi;return}this.processVisibleItem(Ve(F),H,N,P,L,z)}},{key:"processVisibleItem",value:function(F,G,N,P,L,z){var H,W=this.floats,q=this.ints;W[G++]=z,W[G++]=he(L.color),q[G++]=F,W[G++]=(H=L.opacity)!==null&&H!==void 0?H:1;var j=this.packedAttributeData;Hn(this.attrDescriptors,L,j,L.color,this.layerLifecycles,this.lifecycleIndexOffset),this.edgeAttributeTexture.updateAllAttributesAtRow(z,j)}},{key:"setUniforms",value:function(F,G){var N=this,P=G.gl,L=G.uniformLocations;L.u_matrix&&P.uniformMatrix3fv(L.u_matrix,!1,F.matrix),L.u_sizeRatio&&P.uniform1f(L.u_sizeRatio,F.sizeRatio),L.u_correctionRatio&&P.uniform1f(L.u_correctionRatio,F.correctionRatio),L.u_zoomRatio&&P.uniform1f(L.u_zoomRatio,F.zoomRatio),L.u_pixelRatio&&P.uniform1f(L.u_pixelRatio,F.pixelRatio),L.u_cameraAngle&&P.uniform1f(L.u_cameraAngle,F.cameraAngle),L.u_feather&&P.uniform1f(L.u_feather,F.antiAliasingFeather),L.u_minEdgeThickness&&P.uniform1f(L.u_minEdgeThickness,F.minEdgeThickness),L.u_pickingPadding&&P.uniform1f(L.u_pickingPadding,F.edgePickingPadding),L.u_nodeDataTexture&&P.uniform1i(L.u_nodeDataTexture,F.nodeDataTextureUnit),L.u_nodeDataTextureWidth&&P.uniform1i(L.u_nodeDataTextureWidth,F.nodeDataTextureWidth),L.u_edgeDataTexture&&P.uniform1i(L.u_edgeDataTexture,F.edgeDataTextureUnit),L.u_edgeDataTextureWidth&&P.uniform1i(L.u_edgeDataTextureWidth,F.edgeDataTextureWidth),L.u_edgeFrameTexture&&P.uniform1i(L.u_edgeFrameTexture,F.edgeFrameTextureUnit),L.u_edgeFrameTextureWidth&&P.uniform1i(L.u_edgeFrameTextureWidth,F.edgeFrameTextureWidth),this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&(this.edgeAttributeTexture.bind(Be),L.u_edgeAttributeTexture&&P.uniform1i(L.u_edgeAttributeTexture,Be),L.u_edgeAttributeTextureWidth&&P.uniform1i(L.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),L.u_edgeAttributeTexelsPerEdge&&P.uniform1i(L.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()));var z=new Set;d.forEach(function(H){H.uniforms.forEach(function(W){z.has(W.name)||(z.add(W.name),N.setTypedUniform(W,G))})}),p.forEach(function(H){H.uniforms.forEach(function(W){z.has(W.name)||(z.add(W.name),N.setTypedUniform(W,G))})}),c.forEach(function(H){H.uniforms.forEach(function(W){z.has(W.name)||(z.add(W.name),N.setTypedUniform(W,G))})})}},{key:"render",value:function(F,G,N){this.maybeRegenerateShaders(),re(I,"render",this,3)([F,G,N])}},{key:"renderProgram",value:function(F,G){this.layerLifecycles.forEach(function(N){var P;return(P=N.beforeRender)===null||P===void 0?void 0:P.call(N)}),re(I,"renderProgram",this,3)([F,G])}},{key:"uploadAttributeTexture",value:function(){this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&this.edgeAttributeTexture.upload()}},{key:"kill",value:function(){this.layerLifecycles.forEach(function(F){var G;return(G=F.kill)===null||G===void 0?void 0:G.call(F)}),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),re(I,"kill",this,3)([])}}])})(Ce),_=p[g],R=p[m],S=O({paths:d,headLengthRatio:Te(_.length)?0:_.length,tailLengthRatio:Te(R.length)?0:R.length},e.label),C=Ji(S),D=function(){return{labelProgram:to(n,null,t,S),labelBackgroundProgram:Qi(n,a,t,{shaderConfig:C})}},k=new Yi(n,{paths:d,extremities:p,layers:c,nodeShapes:i,nodeLayers:o});return{edgeProgram:new x(n,null,t),createLabelPrograms:D,framePass:k}}function ju(n){return Z(n)==="object"&&"uniforms"in n&&Array.isArray(n.uniforms)}function Xu(n){return Z(n)==="object"&&"uniforms"in n&&"attributes"in n&&"glsl"in n}function qu(n){return Z(n)==="object"&&"uniforms"in n&&"attributes"in n&&"segments"in n}function Yu(n){return Z(n)==="object"&&"uniforms"in n&&"attributes"in n&&"length"in n}function Ku(n){return Z(n)==="object"&&"uniforms"in n&&"attributes"in n&&"glsl"in n}function Zu(n){return Z(n)==="object"&&"glsl"in n&&"name"in n&&!("uniforms"in n)}function Qu(n){return Z(n)==="object"&&"glsl"in n&&"name"in n&&!("uniforms"in n)}function Ju(n){return Z(n)==="object"&&"glsl"in n&&"name"in n&&!("uniforms"in n)}function ed(n){if(ju(n))return n;if(Zu(n))return{name:n.name,glsl:n.glsl,inradiusFactor:n.inradiusFactor,uniforms:[]};throw new Error("Invalid node shape specification: ".concat(JSON.stringify(n)))}function td(n){if(Xu(n))return n;if(Mr(n))return{name:n.name,glsl:n.glsl,uniforms:[],attributes:[]};throw new Error("Invalid node layer specification: ".concat(JSON.stringify(n)))}function nd(n){if(qu(n))return n;if(Qu(n))return{name:n.name,glsl:n.glsl,segments:n.segments,uniforms:[],attributes:[]};throw new Error("Invalid edge path specification: ".concat(JSON.stringify(n)))}function ad(n){if(Ku(n))return n;if(Or(n))return{name:n.name,glsl:n.glsl,uniforms:[],attributes:[]};throw new Error("Invalid edge layer specification: ".concat(JSON.stringify(n)))}function rd(n){if(Yu(n))return n;if(Ju(n))return{name:n.name,glsl:n.glsl,length:n.length,widthFactor:n.widthFactor,margin:0,uniforms:[],attributes:[]};throw new Error("Invalid edge extremity specification: ".concat(JSON.stringify(n)))}function no(n){var a,t,e=(a=n?.shapes)!==null&&a!==void 0?a:Nt.shapes,r=(t=n?.layers)!==null&&t!==void 0?t:Nt.layers,i=e.map(ed),o=r.map(td);if(i.length===0)throw new Error("At least one node shape must be specified.");if(o.length===0)throw new Error("At least one node layer must be specified.");return{shapes:i,layers:o}}function id(n){var a,t,e,r=(a=n?.paths)!==null&&a!==void 0?a:st.paths,i=(t=n?.extremities)!==null&&t!==void 0?t:st.extremities,o=(e=n?.layers)!==null&&e!==void 0?e:st.layers,s=r.map(nd),l=i.map(rd).filter(function(d){return d!==null}),u=o.map(ad);if(s.length===0)throw new Error("At least one edge path must be specified.");if(u.length===0)throw new Error("At least one edge layer must be specified.");return{paths:s,extremities:l,layers:u}}function ao(n,a){var t={},e=M(n),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;i.variables&&Object.assign(t,i.variables)}}catch(o){e.e(o)}finally{e.f()}return Object.assign(t,a||{}),t}function ro(n,a,t,e,r){var i=no(e),o=i.shapes,s=i.layers,l=ao(o,e?.variables),u=Ha(n,a,t,{shapes:o,layers:s,label:e?.label,backdrop:e?.backdrop,labelAttachments:e?.labelAttachments},r);return O(O({},u),{},{variables:l})}function io(n,a,t,e,r,i){var o=id(e),s=o.paths,l=o.extremities,u=o.layers,d=no(i),c=d.shapes,f=d.layers,h=ao(s,e?.variables),p=ja(n,a,t,{paths:s,extremities:l,layers:u,defaultHead:e?.defaultHead,defaultTail:e?.defaultTail,label:e?.label},r,c,f);return O(O({},p),{},{variables:h,paths:s})}var od=2;function oo(n,a,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:od,r=a.canvas,i=r.width,o=r.height,s=t.x,l=t.y,u=t.rowHeight,d=t.maxRowWidth,c={},f=[],h=M(n),p;try{for(h.s();!(p=h.n()).done;){var b=p.value,v=b.width+e,g=b.height+e;if(v>i||g>o||s+v>i&&l+u+g>o){f.push(b);continue}s+v>i&&(d=Math.max(d,s),s=0,l+=u,u=g),b.draw(a,s,l),c[b.key]={x:s,y:l,width:b.width,height:b.height},s+=v,u=Math.max(u,g)}}catch(m){h.e(m)}finally{h.f()}return d=Math.max(d,s),{atlas:c,cursor:{x:s,y:l,rowHeight:u,maxRowWidth:d},remaining:f}}function fe(n,a,t,e){var r=Object.defineProperty;try{r({},"",{})}catch{r=0}fe=function(i,o,s,l){function u(d,c){fe(i,d,function(f){return this._invoke(d,c,f)})}o?r?r(i,o,{value:s,enumerable:!l,configurable:!l,writable:!l}):i[o]=s:(u("next",0),u("throw",1),u("return",2))},fe(n,a,t,e)}function ge(){var n,a,t=typeof Symbol=="function"?Symbol:{},e=t.iterator||"@@iterator",r=t.toStringTag||"@@toStringTag";function i(h,p,b,v){var g=p&&p.prototype instanceof s?p:s,m=Object.create(g.prototype);return fe(m,"_invoke",(function(y,T,x){var _,R,S,C=0,D=x||[],k=!1,A={p:0,n:0,v:n,a:I,f:I.bind(n,4),d:function(w,F){return _=w,R=0,S=n,A.n=F,o}};function I(w,F){for(R=w,S=F,a=0;!k&&C&&!G&&a<D.length;a++){var G,N=D[a],P=A.p,L=N[2];w>3?(G=L===F)&&(S=N[(R=N[4])?5:(R=3,3)],N[4]=N[5]=n):N[0]<=P&&((G=w<2&&P<N[1])?(R=0,A.v=F,A.n=N[1]):P<L&&(G=w<3||N[0]>F||F>L)&&(N[4]=w,N[5]=F,A.n=L,R=0))}if(G||w>1)return o;throw k=!0,F}return function(w,F,G){if(C>1)throw TypeError("Generator is already running");for(k&&F===1&&I(F,G),R=F,S=G;(a=R<2?n:S)||!k;){_||(R?R<3?(R>1&&(A.n=-1),I(R,S)):A.n=S:A.v=S);try{if(C=2,_){if(R||(w="next"),a=_[w]){if(!(a=a.call(_,S)))throw TypeError("iterator result is not an object");if(!a.done)return a;S=a.value,R<2&&(R=0)}else R===1&&(a=_.return)&&a.call(_),R<2&&(S=TypeError("The iterator does not provide a '"+w+"' method"),R=1);_=n}else if((a=(k=A.n<0)?S:y.call(T,A))!==o)break}catch(N){_=n,R=1,S=N}finally{C=1}}return{value:a,done:k}}})(h,b,v),!0),m}var o={};function s(){}function l(){}function u(){}a=Object.getPrototypeOf;var d=[][e]?a(a([][e]())):(fe(a={},e,function(){return this}),a),c=u.prototype=s.prototype=Object.create(d);function f(h){return Object.setPrototypeOf?Object.setPrototypeOf(h,u):(h.__proto__=u,fe(h,r,"GeneratorFunction")),h.prototype=Object.create(c),h}return l.prototype=u,fe(c,"constructor",u),fe(u,"constructor",l),l.displayName="GeneratorFunction",fe(u,r,"GeneratorFunction"),fe(c),fe(c,r,"Generator"),fe(c,e,function(){return this}),fe(c,"toString",function(){return"[object Generator]"}),(ge=function(){return{w:i,m:f}})()}function so(n,a,t,e,r,i,o){try{var s=n[i](o),l=s.value}catch(u){return void t(u)}s.done?a(l):Promise.resolve(l).then(e,r)}function vt(n){return function(){var a=this,t=arguments;return new Promise(function(e,r){var i=n.apply(a,t);function o(l){so(i,e,r,o,s,"next",l)}function s(l){so(i,e,r,o,s,"throw",l)}o(void 0)})}}var Vn=new Map,lo=!1;function sd(n){return new Promise(function(a,t){var e=new FileReader;e.onload=function(){return a(e.result)},e.onerror=t,e.readAsDataURL(n)})}function ld(n){if(!Vn.has(n)){var a=fetch(n).then(function(t){return t.blob()}).then(sd).catch(function(){return Vn.delete(n),null});Vn.set(n,a)}return Vn.get(n)}function ud(n){return Xa.apply(this,arguments)}function Xa(){return Xa=vt(ge().m(function n(a){var t,e,r;return ge().w(function(i){for(;;)switch(i.n){case 0:return t=document.createElement("div"),t.innerHTML=a,e=Array.from(t.querySelectorAll("img[src]")),r=e.filter(function(o){return!o.getAttribute("src").startsWith("data:")}),i.n=1,Promise.all(r.map((function(){var o=vt(ge().m(function s(l){var u;return ge().w(function(d){for(;;)switch(d.n){case 0:return d.n=1,ld(l.getAttribute("src"));case 1:u=d.v,u&&l.setAttribute("src",u);case 2:return d.a(2)}},s)}));return function(s){return o.apply(this,arguments)}})()));case 1:return i.a(2,t.innerHTML)}},n)})),Xa.apply(this,arguments)}function uo(n){return qa.apply(this,arguments)}function qa(){return qa=vt(ge().m(function n(a){var t,e,r,i,o,s,l,u,d,c,f,h,p,b=arguments;return ge().w(function(v){for(;;)switch(v.n){case 0:if(t=b.length>1&&b[1]!==void 0?b[1]:1,e=a instanceof SVGElement?new XMLSerializer().serializeToString(a):a,r=new DOMParser,i=r.parseFromString(e,"image/svg+xml"),o=i.querySelector("svg"),o){v.n=1;break}return v.a(2,null);case 1:if(s=parseFloat(o.getAttribute("width")||""),l=parseFloat(o.getAttribute("height")||""),(!(s>0)||!(l>0))&&(u=o.getAttribute("viewBox"),u&&(d=u.trim().split(/[\s,]+/),s=parseFloat(d[2]),l=parseFloat(d[3]))),!(!(s>0)||!(l>0))){v.n=2;break}return console.warn("Sigma: SVG label attachment has no parseable dimensions \u2014 skipped."),v.a(2,null);case 2:return c=Math.ceil(s*t),f=Math.ceil(l*t),h=new Blob([e],{type:"image/svg+xml"}),p=URL.createObjectURL(h),v.a(2,new Promise(function(g){var m=new Image;m.onload=function(){var y=document.createElement("canvas");y.width=c,y.height=f,y.getContext("2d").drawImage(m,0,0,c,f),URL.revokeObjectURL(p);try{y.getContext("2d").getImageData(0,0,1,1)}catch(T){if(T instanceof DOMException&&T.name==="SecurityError"){lo||(lo=!0,console.warn('Sigma: A label attachment was skipped because the rendered canvas is tainted. SVG with <foreignObject> (used by the "html" attachment type) is blocked in Chromium and Safari. Use type: "canvas" with Canvas 2D rendering instead.')),g(null);return}throw T}g(y)},m.onerror=function(){URL.revokeObjectURL(p),g(null)},m.src=p}))}},n)})),qa.apply(this,arguments)}function dd(n,a){var t=document.createElement("div");t.style.cssText="position:fixed;left:-99999px;top:0;visibility:hidden;width:max-content;height:max-content",t.innerHTML=(a?"<style>".concat(a,"</style>"):"")+n,document.body.appendChild(t);var e=t.getBoundingClientRect(),r=e.width,i=e.height;return document.body.removeChild(t),{width:Math.ceil(r),height:Math.ceil(i)}}function cd(n,a,t,e){return Ya.apply(this,arguments)}function Ya(){return Ya=vt(ge().m(function n(a,t,e,r){var i,o,s,l,u,d,c,f,h=arguments;return ge().w(function(p){for(;;)switch(p.n){case 0:return i=h.length>4&&h[4]!==void 0?h[4]:1,o=a instanceof HTMLElement?a.outerHTML:a,p.n=1,ud(o);case 1:return s=p.v,(e==null||r==null)&&(l=dd(s,t),e=e??l.width,r=r??l.height),u=Math.ceil(e*i),d=Math.ceil(r*i),c=t?"<style>".concat(t,"</style>"):"",f='<svg xmlns="http://www.w3.org/2000/svg" '+'width="'.concat(u,'" height="').concat(d,'" viewBox="0 0 ').concat(e," ").concat(r,'">')+'<foreignObject width="'.concat(e,'" height="').concat(r,'">')+'<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">'.concat(c).concat(s,"</body>")+"</foreignObject></svg>",p.a(2,uo(f,1))}},n)})),Ya.apply(this,arguments)}function hd(n){return Ka.apply(this,arguments)}function Ka(){return Ka=vt(ge().m(function n(a){var t,e=arguments,r;return ge().w(function(i){for(;;)switch(i.n){case 0:t=e.length>1&&e[1]!==void 0?e[1]:1,r=a.type,i.n=r==="canvas"?1:r==="svg"?2:r==="html"?3:4;break;case 1:return i.a(2,a.canvas);case 2:return i.a(2,uo(a.svg,t));case 3:return i.a(2,cd(a.html,a.css,a.width,a.height,t));case 4:return i.a(2)}},n)})),Ka.apply(this,arguments)}var pt=2048,co=(function(){function n(a,t,e){Y(this,n),E(this,"cache",new Map),E(this,"pending",new Set),E(this,"atlas",{}),E(this,"glTexture",null),E(this,"dirty",!0),this.gl=a,this.renderers=t,this.scheduleRender=e,this.packCanvas=document.createElement("canvas"),this.packCanvas.width=pt,this.packCanvas.height=pt,this.packCtx=this.packCanvas.getContext("2d")}return K(n,[{key:"renderAttachment",value:function(t,e,r){var i=this,o="".concat(t,":").concat(e);if(!(this.cache.has(o)||this.pending.has(o))){var s=this.renderers[e];if(s){var l=s(r);if(l){this.pending.add(o);var u=r.pixelRatio;Promise.resolve(l).then((function(){var d=vt(ge().m(function c(f){var h;return ge().w(function(p){for(;;)switch(p.n){case 0:if(i.pending.has(o)){p.n=1;break}return p.a(2);case 1:if(i.pending.delete(o),f){p.n=2;break}return p.a(2);case 2:return p.n=3,hd(f,u);case 3:if(h=p.v,!(!h||h.width===0||h.height===0)){p.n=4;break}return p.a(2);case 4:i.cache.set(o,{image:h,width:h.width,height:h.height}),i.dirty=!0,i.scheduleRender();case 5:return p.a(2)}},c)}));return function(c){return d.apply(this,arguments)}})())}}}}},{key:"regenerateAtlas",value:function(){if(this.dirty){this.dirty=!1;var t=[];if(this.cache.forEach(function(u,d){t.push({key:d,width:u.width,height:u.height,draw:function(f,h,p){f.drawImage(u.image,h,p)}})}),t.length===0){this.atlas={},this.deleteGLTexture();return}var e={x:0,y:0,rowHeight:0,maxRowWidth:0};this.packCtx.clearRect(0,0,pt,pt);var r=oo(t,this.packCtx,e),i=r.atlas,o=r.remaining;this.atlas=i,o.length>0&&console.warn("Sigma: ".concat(o.length," label attachment(s) could not fit in the ").concat(pt,"x").concat(pt," atlas and will not be rendered.")),this.deleteGLTexture();var s=this.gl,l=s.createTexture();s.activeTexture(s.TEXTURE0+qt),s.bindTexture(s.TEXTURE_2D,l),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,this.packCanvas),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.glTexture=l}}},{key:"bindTexture",value:function(t){if(this.glTexture){var e=this.gl;e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.glTexture)}}},{key:"getEntry",value:function(t,e){var r="".concat(t,":").concat(e);return this.atlas[r]||null}},{key:"invalidateNode",value:function(t){var e="".concat(t,":"),r=M(this.cache.keys()),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;o.startsWith(e)&&(this.cache.delete(o),this.dirty=!0)}}catch(d){r.e(d)}finally{r.f()}var s=M(this.pending),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;u.startsWith(e)&&this.pending.delete(u)}}catch(d){s.e(d)}finally{s.f()}}},{key:"restore",value:function(){this.glTexture=null,this.dirty=!0}},{key:"clear",value:function(){this.cache.clear(),this.pending.clear(),this.atlas={},this.dirty=!0,this.deleteGLTexture()}},{key:"kill",value:function(){this.clear(),this.packCanvas=null,this.packCtx=null,this.gl=null}},{key:"deleteGLTexture",value:function(){this.glTexture&&(this.gl.deleteTexture(this.glTexture),this.glTexture=null)}}])})(),Za=(function(){function n(a){Y(this,n),E(this,"buckets",new Map),E(this,"keyDepth",new Map);var t=M(a),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;this.buckets.set(r,new Set)}}catch(i){t.e(i)}finally{t.f()}}return K(n,[{key:"has",value:function(t){return this.keyDepth.has(t)}},{key:"getBucket",value:function(t){return this.buckets.get(t)}},{key:"set",value:function(t,e){var r,i=this.keyDepth.get(t);if(i!==e){var o=this.buckets.get(e);if(!o)throw new Error('Sigma: "'.concat(e,'" is not a declared depth layer'));i!==void 0&&((r=this.buckets.get(i))===null||r===void 0||r.delete(t)),o.add(t),this.keyDepth.set(t,e)}}},{key:"remove",value:function(t){var e=this.keyDepth.get(t);e!==void 0&&(this.buckets.get(e).delete(t),this.keyDepth.delete(t))}},{key:"clearAll",value:function(){var t=M(this.buckets.values()),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;r.clear()}}catch(i){t.e(i)}finally{t.f()}this.keyDepth.clear()}},{key:"getSorted",value:function(t,e){var r=this.buckets.get(t);return!r||r.size===0?[]:$(r).sort(function(i,o){return e(i)-e(o)})}}])})(),ho=(function(n){function a(t,e){return Y(this,a),ne(this,a,[t,2,e])}return ae(a,n),K(a,[{key:"updateNode",value:function(e,r,i,o,s,l,u,d){var c=this.indexMap.get(e);if(c===void 0)throw new Error('Node "'.concat(e,'" not allocated in NodeDataTexture'));var f=ve(d),h=Q(f,4),p=h[0],b=h[1],v=h[2],g=h[3],m=c*2*4;this.data[m]=r,this.data[m+1]=i,this.data[m+2]=o,this.data[m+3]=s,this.data[m+4]=l,this.data[m+5]=u,this.data[m+6]=p*65536+b*256+v,this.data[m+7]=g/255,this.markDirty(c)}}])})(Xt),fd=1024,gd=1.5,Qa=(function(){function n(a,t){var e;if(Y(this,n),E(this,"texture",null),E(this,"framebuffer",null),!a.getExtension("EXT_color_buffer_float"))throw new Error("sigma: EXT_color_buffer_float is required for label/edge placement but is unavailable in this WebGL2 context.");this.gl=a,this.maxTextureSize=a.getParameter(a.MAX_TEXTURE_SIZE),this.channels=t.channels,this.capacity=this.roundUpToPowerOfTwo((e=t.initialCapacity)!==null&&e!==void 0?e:fd);var r=this.computeDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.create()}return K(n,[{key:"roundUpToPowerOfTwo",value:function(t){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,t))))}},{key:"computeDimensions",value:function(t){var e=Math.min(t,this.maxTextureSize),r=Math.ceil(t/e);return{width:e,height:r}}},{key:"create",value:function(){var t=this.gl,e=this.channels===1?t.R32F:t.RGBA32F,r=this.channels===1?t.RED:t.RGBA;if(this.texture=t.createTexture(),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,e,this.textureWidth,this.textureHeight,0,r,t.FLOAT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.framebuffer=t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.texture,0),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE)throw new Error("sigma: float framebuffer for frame-pass placement is incomplete.");t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindTexture(t.TEXTURE_2D,null)}},{key:"ensureCapacity",value:function(t){if(!(t<=this.capacity)){var e=this.gl;this.capacity=this.roundUpToPowerOfTwo(Math.ceil(t*gd));var r=this.computeDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.texture&&e.deleteTexture(this.texture),this.framebuffer&&e.deleteFramebuffer(this.framebuffer),this.create()}}},{key:"bindAsRenderTarget",value:function(){var t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.viewport(0,0,this.textureWidth,this.textureHeight)}},{key:"bind",value:function(t){var e=this.gl;e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.texture)}},{key:"getTexture",value:function(){return this.texture}},{key:"getTextureWidth",value:function(){return this.textureWidth}},{key:"getTextureHeight",value:function(){return this.textureHeight}},{key:"restore",value:function(){this.gl.getExtension("EXT_color_buffer_float"),this.create()}},{key:"kill",value:function(){var t=this.gl;this.texture&&(t.deleteTexture(this.texture),this.texture=null),this.framebuffer&&(t.deleteFramebuffer(this.framebuffer),this.framebuffer=null)}}])})(),fo=(function(n){function a(t,e){return Y(this,a),ne(this,a,[t,2,e])}return ae(a,n),K(a,[{key:"updateEdge",value:function(e,r,i,o,s,l){var u=arguments.length>6&&arguments[6]!==void 0?arguments[6]:0,d=arguments.length>7&&arguments[7]!==void 0?arguments[7]:0,c=arguments.length>8&&arguments[8]!==void 0?arguments[8]:0,f=this.indexMap.get(e);if(f===void 0)throw new Error('Edge "'.concat(e,'" not allocated in EdgeDataTexture'));var h=f*this.TEXELS_PER_ITEM*4;this.data[h+0]=r,this.data[h+1]=i,this.data[h+2]=o,this.data[h+3]=0,this.data[h+4]=s,this.data[h+5]=l,this.data[h+6]=u,this.data[h+7]=(d&15)<<4|c&15,this.markDirty(f)}}])})(Xt);var tg=Re(Xe()),ng=Re(zt());function pd(n,a){if(n==null)return{};var t={};for(var e in n)if({}.hasOwnProperty.call(n,e)){if(a.indexOf(e)!==-1)continue;t[e]=n[e]}return t}function go(n,a){if(n==null)return{};var t,e,r=pd(n,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(e=0;e<i.length;e++)t=i[e],a.indexOf(t)===-1&&{}.propertyIsEnumerable.call(n,t)&&(r[t]=n[t])}return r}var vd=["factor"],md=["factor"],po=1.5,Ja={x:.5,y:.5,angle:0,ratio:1},vo=(function(n){function a(){var t;Y(this,a);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return t=ne(this,a,[].concat(r)),E(t,"minRatio",null),E(t,"maxRatio",null),E(t,"enabled",!0),E(t,"enabledZooming",!0),E(t,"enabledPanning",!0),E(t,"enabledRotation",!0),E(t,"constrainState",null),E(t,"state",O({},Ja)),E(t,"previousState",O({},Ja)),E(t,"nextFrame",null),E(t,"currentAnimationFrom",null),E(t,"currentAnimationTo",null),E(t,"animationCallback",null),t}return ae(a,n),K(a,[{key:"x",get:function(){return this.state.x}},{key:"y",get:function(){return this.state.y}},{key:"angle",get:function(){return this.state.angle}},{key:"ratio",get:function(){return this.state.ratio}},{key:"getState",value:function(){return O({},this.state)}},{key:"getPreviousState",value:function(){return O({},this.previousState)}},{key:"getBoundedRatio",value:function(e){var r=e;return typeof this.minRatio=="number"&&(r=Math.max(r,this.minRatio)),typeof this.maxRatio=="number"&&(r=Math.min(r,this.maxRatio)),r}},{key:"validateState",value:function(e){var r=this.getState();return this.enabledPanning&&typeof e.x=="number"&&(r.x=e.x),this.enabledPanning&&typeof e.y=="number"&&(r.y=e.y),this.enabledZooming&&typeof e.ratio=="number"&&(r.ratio=this.getBoundedRatio(e.ratio)),this.enabledRotation&&typeof e.angle=="number"&&(r.angle=e.angle),this.constrainState?this.constrainState(r):r}},{key:"isAnimating",value:function(){return this.nextFrame!==null}},{key:"setState",value:function(e){if(!this.enabled)return this;var r=this.validateState(e);return ni(this.state,r)?this:(this.previousState=this.state,this.state=r,this.emit("updated",this.getState()),this)}},{key:"updateState",value:function(e){return this.setState(e(this.getState())),this}},{key:"animate",value:function(e,r){var i=this;return this.enabled?new Promise(function(o){return i.runAnimation(e,O(O({},ii),r),o)}):Promise.resolve()}},{key:"cancelAnimation",value:function(){return this.nextFrame!==null&&(cancelAnimationFrame(this.nextFrame),this.nextFrame=null),this.resolveAnimation(),this.emitAnimationEnd(!1),this}},{key:"zoomIn",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=e.factor,i=r===void 0?po:r,o=go(e,vd);return this.animate({ratio:this.ratio/i},o)}},{key:"zoomOut",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=e.factor,i=r===void 0?po:r,o=go(e,md);return this.animate({ratio:this.ratio*i},o)}},{key:"reset",value:function(e){return this.animate(Ja,e)}},{key:"runAnimation",value:function(e,r,i){var o=this,s=xn(r.easing),l=Date.now(),u=this.getState(),d=this.validateState(e),c=function(){if(!o.enabled){o.cancelAnimation();return}var h=r.duration>0?(Date.now()-l)/r.duration:1;if(h>=1){o.nextFrame=null,o.setState(d),o.resolveAnimation(),o.emitAnimationEnd(!0);return}var p=s(h);o.setState({x:u.x+(d.x-u.x)*p,y:u.y+(d.y-u.y)*p,angle:u.angle+(d.angle-u.angle)*p,ratio:u.ratio+(d.ratio-u.ratio)*p}),o.nextFrame=requestAnimationFrame(c)};this.cancelAnimation(),this.currentAnimationFrom=u,this.currentAnimationTo=d,this.animationCallback=i,this.emit("animationStart",{from:u,to:d}),c()}},{key:"resolveAnimation",value:function(){var e=this.animationCallback;this.animationCallback=null,e&&e()}},{key:"emitAnimationEnd",value:function(e){var r=this.currentAnimationFrom,i=this.currentAnimationTo;!r||!i||(this.currentAnimationFrom=null,this.currentAnimationTo=null,this.emit("animationEnd",{from:r,to:i,completed:e}))}}],[{key:"from",value:function(e){var r=new a;return r.setState(e)}}])})(Sn);function pe(n,a){var t=a.getBoundingClientRect();return{x:n.clientX-t.left,y:n.clientY-t.top}}function Le(n,a){var t=O(O({},pe(n,a)),{},{sigmaDefaultPrevented:!1,preventSigmaDefault:function(){t.sigmaDefaultPrevented=!0},original:n});return t}function Je(n){var a="x"in n?n:O(O({},n.touches[0]||n.previousTouches[0]),{},{original:n.original,sigmaDefaultPrevented:n.sigmaDefaultPrevented,preventSigmaDefault:function(){n.sigmaDefaultPrevented=!0,a.sigmaDefaultPrevented=!0}});return a}function bd(n,a){var t=Le(n,a);return t.delta=Fo(n),t}var yd=2;function qn(n){for(var a=[],t=0,e=Math.min(n.length,yd);t<e;t++)a.push(n[t]);return a}function Kt(n,a,t){var e={touches:qn(n.touches).map(function(r){return pe(r,t)}),previousTouches:a.map(function(r){return pe(r,t)}),sigmaDefaultPrevented:!1,preventSigmaDefault:function(){e.sigmaDefaultPrevented=!0},original:n};return e}function Fo(n){if(typeof n.deltaY<"u")return n.deltaY*-3/360;if(typeof n.detail<"u")return n.detail/-9;throw new Error("Captor: could not extract delta from event.")}var ko=(function(n){function a(t,e){var r;return Y(this,a),r=ne(this,a),r.container=t,r.renderer=e,r}return ae(a,n),K(a)})(Sn),xd=["doubleClickTimeout","doubleClickZoomingDuration","doubleClickZoomingRatio","dragTimeout","draggedEventsTolerance","enableCameraMouseRotation","gestureTarget","inertiaDuration","inertiaRatio","zoomDuration","zoomingRatio"],_d=xd.reduce(function(n,a){return O(O({},n),{},E({},a,Dn[a]))},{});function Zt(n){return n instanceof PointerEvent&&n.pointerType==="touch"}var Td=(function(n){function a(t,e){var r;return Y(this,a),r=ne(this,a,[t,e]),E(r,"enabled",!0),E(r,"draggedEvents",0),E(r,"downStartTime",null),E(r,"lastMouseX",null),E(r,"lastMouseY",null),E(r,"isMouseDown",!1),E(r,"isMoving",!1),E(r,"isPanningStage",!1),E(r,"movingTimeout",null),E(r,"startCameraState",null),E(r,"clicks",0),E(r,"doubleClickTimeout",null),E(r,"isRightMouseDown",!1),E(r,"startRotationAngle",null),E(r,"startCameraAngle",null),E(r,"currentWheelDirection",0),E(r,"lastWheelAnimationId",0),E(r,"settings",_d),r.handleRightClick=r.handleRightClick.bind(r),r.handleDown=r.handleDown.bind(r),r.handleUp=r.handleUp.bind(r),r.handleMove=r.handleMove.bind(r),r.handleWheel=r.handleWheel.bind(r),r.handleLeave=r.handleLeave.bind(r),r.handleEnter=r.handleEnter.bind(r),t.addEventListener("contextmenu",r.handleRightClick,{capture:!1}),t.addEventListener("pointerdown",r.handleDown,{capture:!1}),t.addEventListener("wheel",r.handleWheel,{capture:!1,passive:!1}),t.addEventListener("pointerleave",r.handleLeave,{capture:!1}),t.addEventListener("pointerenter",r.handleEnter,{capture:!1}),document.addEventListener("pointermove",r.handleMove,{capture:!1}),document.addEventListener("pointerup",r.handleUp,{capture:!1}),r}return ae(a,n),K(a,[{key:"kill",value:function(){var e=this.container;e.removeEventListener("contextmenu",this.handleRightClick),e.removeEventListener("pointerdown",this.handleDown),e.removeEventListener("wheel",this.handleWheel),e.removeEventListener("pointerleave",this.handleLeave),e.removeEventListener("pointerenter",this.handleEnter),document.removeEventListener("pointermove",this.handleMove),document.removeEventListener("pointerup",this.handleUp)}},{key:"handleClick",value:function(e){var r=this;if(this.enabled){if(this.clicks++,this.clicks===2)return this.clicks=0,typeof this.doubleClickTimeout=="number"&&(clearTimeout(this.doubleClickTimeout),this.doubleClickTimeout=null),this.handleDoubleClick(e);setTimeout(function(){r.clicks=0,r.doubleClickTimeout=null},this.settings.doubleClickTimeout),this.draggedEvents<this.settings.draggedEventsTolerance&&this.emit("click",Le(e,this.container))}}},{key:"handleRightClick",value:function(e){this.enabled&&(this.settings.enableCameraMouseRotation&&e.preventDefault(),this.emit("rightClick",Le(e,this.container)))}},{key:"handleDoubleClick",value:function(e){if(this.enabled){e.preventDefault(),e.stopPropagation();var r=Le(e,this.container);if(this.emit("doubleClick",r),!r.sigmaDefaultPrevented){var i=this.renderer.getCamera(),o=i.getBoundedRatio(i.getState().ratio/this.settings.doubleClickZoomingRatio);i.animate(this.renderer.getViewportZoomedState(pe(e,this.container),o),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}}},{key:"handleDown",value:function(e){if(!(!this.enabled||Zt(e))){if(e.button===0){this.startCameraState=this.renderer.getCamera().getState();var r=pe(e,this.container),i=r.x,o=r.y;this.lastMouseX=i,this.lastMouseY=o,this.draggedEvents=0,this.downStartTime=Date.now(),this.isMouseDown=!0}if(e.button===2&&this.settings.enableCameraMouseRotation){var s=pe(e,this.container),l=s.x,u=s.y,d=this.container.offsetWidth/2,c=this.container.offsetHeight/2;this.startRotationAngle=Math.atan2(u-c,l-d),this.startCameraAngle=this.renderer.getCamera().getState().angle,this.isRightMouseDown=!0}this.emit("mousedown",Le(e,this.container))}}},{key:"handleUp",value:function(e){var r=this;if(!(!this.enabled||Zt(e)||!this.isMouseDown&&!this.isRightMouseDown)){if(this.isRightMouseDown){this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.emit("mouseup",Le(e,this.container));return}var i=this.renderer.getCamera();this.isMouseDown=!1,this.isPanningStage&&(this.isPanningStage=!1,this.renderer._setPanning(!1)),typeof this.movingTimeout=="number"&&(clearTimeout(this.movingTimeout),this.movingTimeout=null);var o=pe(e,this.container),s=o.x,l=o.y,u=i.getState(),d=i.getPreviousState();this.isMoving?i.animate({x:u.x+this.settings.inertiaRatio*(u.x-d.x),y:u.y+this.settings.inertiaRatio*(u.y-d.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"}):(this.lastMouseX!==s||this.lastMouseY!==l)&&i.setState({x:u.x,y:u.y}),this.isMoving=!1,setTimeout(function(){var c=r.draggedEvents>0;r.draggedEvents=0;var f=r.renderer.getSetting("hideEdgesOnMove")||r.renderer.getSetting("hideLabelsOnMove");c&&f&&r.renderer.refresh()},0),this.emit("mouseup",Le(e,this.container)),(e.target===this.container||e.composedPath()[0]===this.container)&&this.handleClick(e)}}},{key:"handleMove",value:function(e){var r=this;if(!(!this.enabled||Zt(e))){var i=Le(e,this.container);if(this.emit("mousemovebody",i),(e.target===this.container||e.composedPath()[0]===this.container)&&this.emit("mousemove",i),this.isMouseDown&&this.draggedEvents++,!i.sigmaDefaultPrevented){if(this.isMouseDown){this.isMoving=!0,typeof this.movingTimeout=="number"&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(function(){r.movingTimeout=null,r.isMoving=!1},this.settings.dragTimeout);var o=this.renderer.getCamera(),s=pe(e,this.container),l=s.x,u=s.y,d=this.renderer.viewportToFramedGraph({x:this.lastMouseX,y:this.lastMouseY}),c=this.renderer.viewportToFramedGraph({x:l,y:u}),f=d.x-c.x,h=d.y-c.y,p=o.getState(),b=p.x+f,v=p.y+h;this.isPanningStage||(this.isPanningStage=!0,this.renderer._setPanning(!0)),o.setState({x:b,y:v}),this.lastMouseX=l,this.lastMouseY=u,e.preventDefault(),e.stopPropagation()}if(this.isRightMouseDown){var g=pe(e,this.container),m=g.x,y=g.y,T=this.container.offsetWidth/2,x=this.container.offsetHeight/2,_=Math.atan2(y-x,m-T),R=_-this.startRotationAngle,S=this.renderer.getCamera();S.setState({angle:this.startCameraAngle+R}),e.preventDefault(),e.stopPropagation()}}}}},{key:"handleLeave",value:function(e){Zt(e)||this.emit("mouseleave",Le(e,this.container))}},{key:"handleEnter",value:function(e){Zt(e)||this.emit("mouseenter",Le(e,this.container))}},{key:"handleWheel",value:function(e){var r=this,i=this.renderer.getCamera();if(!(!this.enabled||!i.enabledZooming)){var o=bd(e,this.container);if(this.emit("wheel",o),!o.sigmaDefaultPrevented){var s=this.settings.gestureTarget;if(s!=="page"){if(s==="shared"&&!e.ctrlKey&&!e.metaKey){this.renderer._showGestureHint("wheel");return}var l=Fo(e);if(l){e.preventDefault(),e.stopPropagation();var u=i.getState().ratio,d=l>0?1/this.settings.zoomingRatio:this.settings.zoomingRatio,c=i.getBoundedRatio(u*d),f=l>0?1:-1,h=Date.now();if(u!==c&&!(this.currentWheelDirection===f&&this.lastWheelTriggerTime&&h-this.lastWheelTriggerTime<this.settings.zoomDuration/5)){var p=++this.lastWheelAnimationId;i.animate(this.renderer.getViewportZoomedState(pe(e,this.container),c),{easing:"quadraticOut",duration:this.settings.zoomDuration}).then(function(){r.lastWheelAnimationId===p&&(r.currentWheelDirection=0)}),this.currentWheelDirection=f,this.lastWheelTriggerTime=h}}}}}}},{key:"setSettings",value:function(e){this.settings=e}}])})(ko),Ed=["dragTimeout","gestureTarget","inertiaDuration","inertiaRatio","doubleClickTimeout","doubleClickZoomingRatio","doubleClickZoomingDuration","tapMoveTolerance"],Sd=Ed.reduce(function(n,a){return O(O({},n),{},E({},a,Dn[a]))},{}),Rd=(function(n){function a(t,e){var r;return Y(this,a),r=ne(this,a,[t,e]),E(r,"enabled",!0),E(r,"isMoving",!1),E(r,"hasMoved",!1),E(r,"isPanningStage",!1),E(r,"isZoomingStage",!1),E(r,"touchMode",0),E(r,"startTouchesPositions",[]),E(r,"lastTouches",[]),E(r,"lastTap",null),E(r,"settings",Sd),r.handleStart=r.handleStart.bind(r),r.handleLeave=r.handleLeave.bind(r),r.handleMove=r.handleMove.bind(r),t.addEventListener("touchstart",r.handleStart,{capture:!1}),t.addEventListener("touchcancel",r.handleLeave,{capture:!1}),document.addEventListener("touchend",r.handleLeave,{capture:!1,passive:!1}),document.addEventListener("touchmove",r.handleMove,{capture:!1,passive:!1}),r}return ae(a,n),K(a,[{key:"kill",value:function(){var e=this.container;e.removeEventListener("touchstart",this.handleStart),e.removeEventListener("touchcancel",this.handleLeave),document.removeEventListener("touchend",this.handleLeave),document.removeEventListener("touchmove",this.handleMove)}},{key:"getDimensions",value:function(){return{width:this.container.offsetWidth,height:this.container.offsetHeight}}},{key:"doesCapture",value:function(e){var r=this.settings.gestureTarget;return r==="graph"?!0:r==="page"?!1:e>=2}},{key:"syncStageFlags",value:function(){var e=this.touchMode===1&&this.hasMoved,r=this.touchMode===2;e!==this.isPanningStage&&(this.isPanningStage=e,this.renderer._setPanning(e)),r!==this.isZoomingStage&&(this.isZoomingStage=r,this.renderer._setZooming(r))}},{key:"handleStart",value:function(e){var r=this;if(this.enabled){var i=qn(e.touches);if(this.touchMode=i.length,this.startCameraState=this.renderer.getCamera().getState(),this.startTouchesPositions=i.map(function(h){return pe(h,r.container)}),this.touchMode===2){var o=Q(this.startTouchesPositions,2),s=o[0],l=s.x,u=s.y,d=o[1],c=d.x,f=d.y;this.startTouchesAngle=Math.atan2(f-u,c-l),this.startTouchesDistance=Math.sqrt(Math.pow(c-l,2)+Math.pow(f-u,2))}this.syncStageFlags(),this.emit("touchdown",Kt(e,this.lastTouches,this.container)),this.lastTouches=i,this.lastTouchesPositions=this.startTouchesPositions,e.cancelable&&(this.doesCapture(e.touches.length)||this.renderer._hasNodeDrag())&&e.preventDefault()}}},{key:"handleLeave",value:function(e){if(!(!this.enabled||!this.startTouchesPositions.length)){switch(e.cancelable&&this.doesCapture(this.touchMode)&&e.preventDefault(),this.movingTimeout&&(this.isMoving=!1,clearTimeout(this.movingTimeout)),this.touchMode){case 2:if(e.touches.length===1){this.handleStart(e);break}case 1:if(this.isMoving){var r=this.renderer.getCamera(),i=r.getState(),o=r.getPreviousState();r.animate({x:i.x+this.settings.inertiaRatio*(i.x-o.x),y:i.y+this.settings.inertiaRatio*(i.y-o.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"})}this.hasMoved=!1,this.isMoving=!1,this.touchMode=0;break}if(this.syncStageFlags(),this.emit("touchup",Kt(e,this.lastTouches,this.container)),!e.touches.length){var s=pe(this.lastTouches[0],this.container),l=this.startTouchesPositions[0],u=Math.pow(s.x-l.x,2)+Math.pow(s.y-l.y,2);if(!e.touches.length&&u<Math.pow(this.settings.tapMoveTolerance,2))if(this.lastTap&&Date.now()-this.lastTap.time<this.settings.doubleClickTimeout){var d=Kt(e,this.lastTouches,this.container);if(this.emit("doubletap",d),this.lastTap=null,!d.sigmaDefaultPrevented&&this.settings.gestureTarget!=="page"){var c=this.renderer.getCamera(),f=c.getBoundedRatio(c.getState().ratio/this.settings.doubleClickZoomingRatio);c.animate(this.renderer.getViewportZoomedState(s,f),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}else{var h=Kt(e,this.lastTouches,this.container);this.emit("tap",h),this.lastTap={time:Date.now(),position:h.touches[0]||h.previousTouches[0]}}}this.lastTouches=qn(e.touches),this.startTouchesPositions=[]}}},{key:"handleMove",value:function(e){var r=this;if(!(!this.enabled||!this.startTouchesPositions.length)){var i=this.doesCapture(e.touches.length);i&&e.preventDefault();var o=qn(e.touches),s=o.map(function(W){return pe(W,r.container)}),l=this.lastTouches;this.lastTouches=o,this.lastTouchesPositions=s;var u=Kt(e,l,this.container);if(this.emit("touchmove",u),!u.sigmaDefaultPrevented&&(this.hasMoved||(this.hasMoved=s.some(function(W,q){var j=r.startTouchesPositions[q];return j&&(W.x!==j.x||W.y!==j.y)})),!!this.hasMoved)){if(!i){this.settings.gestureTarget==="shared"&&this.renderer._showGestureHint("touch");return}this.isMoving=!0,this.syncStageFlags(),this.movingTimeout&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(function(){r.isMoving=!1},this.settings.dragTimeout);var d=this.renderer.getCamera(),c=this.startCameraState,f=this.renderer.getSetting("stagePadding");switch(this.touchMode){case 1:{var h=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0]),p=h.x,b=h.y,v=this.renderer.viewportToFramedGraph(s[0]),g=v.x,m=v.y;d.setState({x:c.x+p-g,y:c.y+b-m});break}case 2:{var y={x:.5,y:.5,angle:0,ratio:1},T=s[0],x=T.x,_=T.y,R=s[1],S=R.x,C=R.y,D=Math.atan2(C-_,S-x)-this.startTouchesAngle,k=Math.hypot(C-_,S-x)/this.startTouchesDistance,A=d.getBoundedRatio(c.ratio/k);y.ratio=A,y.angle=c.angle+D;var I=this.getDimensions(),w=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0],{cameraState:c}),F=Math.min(I.width,I.height)-2*f,G=F/I.width,N=F/I.height,P=A/F,L=x-F/2/G,z=_-F/2/N,H=cn({x:L,y:z},y.angle);L=H.x,z=H.y,y.x=w.x-L*P,y.y=w.y+z*P,d.setState(y);break}}}}}},{key:"setSettings",value:function(e){this.settings=e}}])})(ko),Ad=(function(){function n(a,t,e,r){Y(this,n),E(this,"pendingNode",null),E(this,"session",null),this.graph=a,this.viewportToGraph=t,this.setNodesState=e,this.emit=r}return K(n,[{key:"start",value:function(t,e,r,i,o){var s=r(t),l=!1;if(this.emit("nodeDragStart",{node:t,allDraggedNodes:s,event:e,preventSigmaDefault:function(){l=!0}}),l)return!1;var u=new Map,d=M(s),c;try{for(d.s();!(c=d.n()).done;){var f=c.value;u.set(f,{x:this.graph.getNodeAttribute(f,i),y:this.graph.getNodeAttribute(f,o)})}}catch(h){d.e(h)}finally{d.f()}return this.session={node:t,allNodes:s,startPosition:this.viewportToGraph(e),startNodePositions:u,xAttr:i,yAttr:o},this.setNodesState(s,{isDragged:!0}),!0}},{key:"applyMove",value:function(t,e){var r=this.session,i=r.allNodes,o=r.startNodePositions,s=r.startPosition,l=r.xAttr,u=r.yAttr,d=this.viewportToGraph(t),c={x:d.x-s.x,y:d.y-s.y},f=M(i),h;try{for(f.s();!(h=f.n()).done;){var p=h.value,b=o.get(p);if(!(!b||!this.graph.hasNode(p))){var v={x:b.x+c.x,y:b.y+c.y};e?this.graph.mergeNodeAttributes(p,e(v,p)):(this.graph.setNodeAttribute(p,l,v.x),this.graph.setNodeAttribute(p,u,v.y))}}}catch(g){f.e(g)}finally{f.f()}}},{key:"end",value:function(){if(this.pendingNode=null,!this.session)return null;var t=this.session,e=t.node,r=t.allNodes;return this.setNodesState(r,{isDragged:!1}),this.session=null,{node:e,allNodes:r}}},{key:"removeNode",value:function(t){t===this.pendingNode&&(this.pendingNode=null),this.session&&(this.session.node===t?(this.setNodesState(this.session.allNodes,{isDragged:!1}),this.session=null):this.session.allNodes.includes(t)&&(this.session.allNodes=this.session.allNodes.filter(function(e){return e!==t}),this.session.startNodePositions.delete(t)))}},{key:"clear",value:function(){this.pendingNode=null,this.session=null}}])})();function mo(n,a){return n<a?"".concat(n,"\0").concat(a):"".concat(a,"\0").concat(n)}var Dd=(function(){function n(a,t){Y(this,n),E(this,"groups",new Map),E(this,"edgeToGroupKey",new Map),this.graph=a,this.onGroupChanged=t}return K(n,[{key:"getGroupKey",value:function(t){return mo(this.graph.source(t),this.graph.target(t))}},{key:"sortGroup",value:function(t,e){var r=this,i=e.split("\0")[0];t.sort(function(o,s){var l=r.graph.source(o)===i||!r.graph.isDirected(o)?0:1,u=r.graph.source(s)===i||!r.graph.isDirected(s)?0:1;return l-u})}},{key:"register",value:function(t){var e=this.getGroupKey(t),r=this.groups.get(e);r||(r=[],this.groups.set(e,r)),r.includes(t)||r.push(t),this.edgeToGroupKey.set(t,e),r.length>1&&this.sortGroup(r,e),this.onGroupChanged(r,r.length)}},{key:"unregister",value:function(t){var e=this.edgeToGroupKey.get(t);if(e){this.edgeToGroupKey.delete(t);var r=this.groups.get(e);if(r){var i=r.indexOf(t);i!==-1&&r.splice(i,1),r.length===0?this.groups.delete(e):this.onGroupChanged(r,r.length)}}}},{key:"getGroup",value:function(t){var e,r=this.edgeToGroupKey.get(t);return r?(e=this.groups.get(r))!==null&&e!==void 0?e:[]:[]}},{key:"getSiblings",value:function(t){return this.getGroup(t).filter(function(e){return e!==t})}},{key:"rebuild",value:function(){var t=this;this.groups.clear(),this.edgeToGroupKey.clear(),this.graph.forEachEdge(function(l,u,d,c){var f=mo(d,c),h=t.groups.get(f);h||(h=[],t.groups.set(f,h)),h.push(l),t.edgeToGroupKey.set(l,f)});var e=M(this.groups),r;try{for(e.s();!(r=e.n()).done;){var i=Q(r.value,2),o=i[0],s=i[1];s.length>1&&this.sortGroup(s,o),this.onGroupChanged(s,s.length)}}catch(l){e.e(l)}finally{e.f()}}},{key:"clear",value:function(){this.groups.clear(),this.edgeToGroupKey.clear()}}])})();function bo(n,a){var t;if(n===!1||n==="extend"||n==="separate")return n;var e=n[a];return e!==void 0?e:(t=n.default)!==null&&t!==void 0?t:!1}function yo(n){return n===!1?!1:n==="extend"||n==="separate"?!0:Object.values(n).some(function(a){return a==="extend"||a==="separate"})}function xo(n){return n==="separate"?!0:n===!1||n==="extend"?!1:n.default==="separate"?!0:Object.values(n).includes("separate")}var se={node:{parent:null,eventSuffix:"Node",payloadKey:"node",isEnabled:function(){return!0},writesPickingThisFrame:function(){return!0},setHover:function(a,t,e){return a.setNodeState(t,{isHovered:e})},getCursor:function(a,t){var e;return(e=a.nodeDataCache[t])===null||e===void 0?void 0:e.cursor},isHitValid:function(a,t){var e;return((e=a.nodeDataCache[t])===null||e===void 0?void 0:e.visibility)!=="hidden"}},edge:{parent:null,eventSuffix:"Edge",payloadKey:"edge",isEnabled:function(a){return!!a.settings.enableEdgeEvents},writesPickingThisFrame:function(a){return!!a.settings.enableEdgeEvents},setHover:function(a,t,e){return a.setEdgeState(t,{isHovered:e})},getCursor:function(a,t){var e;return(e=a.edgeDataCache[t])===null||e===void 0?void 0:e.cursor}},nodeLabel:{parent:"node",eventSuffix:"NodeLabel",payloadKey:"node",isEnabled:function(a){return xo(a.settings.nodeLabelEvents)},writesPickingThisFrame:function(a){return yo(a.settings.nodeLabelEvents)},setHover:function(a,t,e){return a.setNodeState(t,{isLabelHovered:e})},getCursor:function(a,t){var e;return(e=a.nodeDataCache[t])===null||e===void 0?void 0:e.labelCursor},resolveForVerb:function(a,t,e){var r=bo(e.settings.nodeLabelEvents,t);return r===!1?null:r==="extend"?{kind:"node",key:a.key}:a}},edgeLabel:{parent:"edge",eventSuffix:"EdgeLabel",payloadKey:"edge",isEnabled:function(a){return xo(a.settings.edgeLabelEvents)},writesPickingThisFrame:function(a){return yo(a.settings.edgeLabelEvents)},setHover:function(a,t,e){return a.setEdgeState(t,{isLabelHovered:e})},getCursor:function(a,t){var e;return(e=a.edgeDataCache[t])===null||e===void 0?void 0:e.labelCursor},resolveForVerb:function(a,t,e){var r=bo(e.settings.edgeLabelEvents,t);return r===!1?null:r==="extend"?{kind:"edge",key:a.key}:a}}},nt=["node","edge","nodeLabel","edgeLabel"];function wd(){return{lookup:[null],idsByKind:{node:new Map,edge:new Map,nodeLabel:new Map,edgeLabel:new Map},nextId:1}}function tt(n,a,t){var e;return(e=n.idsByKind[a].get(t))!==null&&e!==void 0?e:0}function jn(n,a){var t=M(nt),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;if(r===a||se[r].parent===a){var i=M(n.idsByKind[r].values()),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;n.lookup[s]=null}}catch(f){i.e(f)}finally{i.f()}n.idsByKind[r]=new Map}}}catch(f){t.e(f)}finally{t.f()}var l=1,u=M(nt),d;try{for(u.s();!(d=u.n()).done;){var c=d.value;if(c===a)break;l+=n.idsByKind[c].size}}catch(f){u.e(f)}finally{u.f()}n.nextId=l}function _o(n,a,t){var e=n.nextId++;return n.idsByKind[a].set(t,e),n.lookup[e]={kind:a,key:t},e}function To(n,a,t){for(var e=0,r=Yn(a);e<r.length;e++){var i=r[e],o=n.idsByKind[i].get(t);o!==void 0&&(n.lookup[o]=null,n.idsByKind[i].delete(t))}}function Cd(n,a){var t=M(nt),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;if(se[r].parent!==null){var i=M(n.idsByKind[r].values()),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;n.lookup[s]=null}}catch(x){i.e(x)}finally{i.f()}n.idsByKind[r]=new Map}}}catch(x){t.e(x)}finally{t.f()}n.nextId=1;var l=M(nt),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;if(se[d].parent===null){var c=M(n.idsByKind[d].values()),f;try{for(c.s();!(f=c.n()).done;){var h=f.value;h>=n.nextId&&(n.nextId=h+1)}}catch(x){c.e(x)}finally{c.f()}}}}catch(x){l.e(x)}finally{l.f()}var p=M(nt),b;try{for(p.s();!(b=p.n()).done;){var v=b.value,g=se[v];if(!(g.parent===null||!g.isEnabled(a))){var m=M(n.idsByKind[g.parent].keys()),y;try{for(m.s();!(y=m.n()).done;){var T=y.value;n.idsByKind[v].set(T,n.nextId),n.lookup[n.nextId]={kind:v,key:T},n.nextId++}}catch(x){m.e(x)}finally{m.f()}}}}catch(x){p.e(x)}finally{p.f()}}function Ld(n,a){var t=M(nt),e;try{for(t.s();!(e=t.n()).done;){var r=e.value,i=n[r],o=a[r];if(i!==o){if(i.size!==o.size)return!1;var s=M(i),l;try{for(s.s();!(l=s.n()).done;){var u=Q(l.value,2),d=u[0],c=u[1];if(o.get(d)!==c)return!1}}catch(f){s.e(f)}finally{s.f()}}}}catch(f){t.e(f)}finally{t.f()}return!0}function Eo(n,a,t){se[a.kind].setHover(n,a.key,t)}function Pd(n,a){return se[a.kind].getCursor(n,a.key)}function Qt(n,a){return"".concat(a).concat(se[n].eventSuffix)}function Jt(n,a){return O(O({},a),{},E({},se[n.kind].payloadKey,n.key))}function Fd(n,a,t){var e=se[a.kind].resolveForVerb;return e?e(a,t,n):a}function kd(n,a){var t=se[a.kind].isHitValid;return t?t(n,a.key):!0}function Yn(n){return nt.filter(function(a){return a===n||se[a].parent===n})}function Io(n,a,t){return a&&(a=Fd(n,a,t)),a&&!kd(n,a)&&(a=null),a}function er(n,a,t){var e=t==="wheel"?n.stateManager.hovered:n.getHitAtPosition(a);return Io(n,e,t)}function Id(n,a){return!n||!a?n===a:n.kind===a.kind&&n.key===a.key}function No(n,a,t){var e={event:t,preventSigmaDefault:function(){return t.preventSigmaDefault()}},r=n.dragManager.session,i=r?{kind:"node",key:r.node}:Io(n,a,"enter"),o=n.stateManager,s=o.hovered;Id(s,i)||(s&&(Eo(n,s,!1),n.emit(Qt(s.kind,"leave"),Jt(s,e))),o.setHovered(i),i&&(Eo(n,i,!0),n.emit(Qt(i.kind,"enter"),Jt(i,e))),n.updateContainerCursor())}function Nd(n,a,t,e){e.handleResize=function(){return n.scheduleRefresh()},window.addEventListener("resize",e.handleResize),e.handleMove=function(i){n.hoverResolver.pointerMoved(Je(i))},e.handleMoveBody=function(i){var o=Je(i),s=n.dragManager;if(s.pendingNode&&!s.session){var l=n.nodeStyleAnalysis,u=l.xAttribute,d=l.yAttribute,c=n.settings;s.start(s.pendingNode,o,c.getDraggedNodes,u||"x",d||"y"),s.pendingNode=null}s.session&&(s.applyMove(o,n.settings.dragPositionToAttributes),n.emit("nodeDrag",{node:s.session.node,allDraggedNodes:s.session.allNodes,event:o}),o.preventSigmaDefault()),n.emit("moveBody",{event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}})},e.handleLeave=function(i){var o=Je(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}};n.hoverResolver.pointerLeft(),No(n,null,o),n.emit("leaveStage",s)},e.handleEnter=function(i){var o=Je(i);n.emit("enterStage",{event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}})};var r=function(o){return function(s){var l=Je(s),u={event:l,preventSigmaDefault:function(){return l.preventSigmaDefault()}},d=er(n,l,o);if(d){n.emit(Qt(d.kind,o),Jt(d,u));return}n.emit("".concat(o,"Stage"),u)}};e.handleClick=r("click"),e.handleRightClick=r("rightClick"),e.handleDoubleClick=r("doubleClick"),e.handleWheel=r("wheel"),e.handleDown=function(i){var o=Je(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}},l=er(n,o,"down");if(l){l.kind==="node"&&n.settings.enableNodeDrag&&(n.dragManager.pendingNode=l.key),n.emit(Qt(l.kind,"down"),Jt(l,s));return}n.emit("downStage",s)},e.handleUp=function(i){var o=Je(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}},l=n.dragManager.end();l&&n.emit("nodeDragEnd",O({node:l.node,allDraggedNodes:l.allNodes},s));var u=er(n,o,"up");if(u){n.emit(Qt(u.kind,"up"),Jt(u,s));return}n.emit("upStage",s)},a.on("mousemove",e.handleMove),a.on("mousemovebody",e.handleMoveBody),a.on("click",e.handleClick),a.on("rightClick",e.handleRightClick),a.on("doubleClick",e.handleDoubleClick),a.on("wheel",e.handleWheel),a.on("mousedown",e.handleDown),a.on("mouseup",e.handleUp),a.on("mouseleave",e.handleLeave),a.on("mouseenter",e.handleEnter),t.on("touchdown",e.handleDown),t.on("touchdown",e.handleMove),t.on("touchup",e.handleUp),t.on("touchmove",e.handleMove),t.on("tap",e.handleClick),t.on("doubletap",e.handleDoubleClick),t.on("touchmove",e.handleMoveBody)}function Gd(n,a){var t=n.graph,e=new Set(["x","y","zIndex","type"]);a.eachNodeAttributesUpdatedGraphUpdate=function(r){var i,o=(i=r.hints)===null||i===void 0?void 0:i.attributes,s=!o||o.some(function(l){return e.has(l)});n.refresh({partialGraph:{nodes:t.nodes()},skipIndexation:!s,schedule:!0})},a.eachEdgeAttributesUpdatedGraphUpdate=function(r){var i,o=(i=r.hints)===null||i===void 0?void 0:i.attributes,s=o&&["zIndex","type"].some(function(l){return o?.includes(l)});n.refresh({partialGraph:{edges:t.edges()},skipIndexation:!s,schedule:!0})},a.addNodeGraphUpdate=function(r){n.refresh({partialGraph:{nodes:[r.key]},skipIndexation:!1,schedule:!0})},a.updateNodeGraphUpdate=function(r){n.refresh({partialGraph:{nodes:[r.key]},skipIndexation:!1,schedule:!0})},a.dropNodeGraphUpdate=function(r){n.removeNode(r.key),n.scheduleProcess()},a.addEdgeGraphUpdate=function(r){var i=r.key;n.markNodesDirty([r.source,r.target]),n.edgeGroups.register(i);var o=n.edgeGroups.getSiblings(i);n.refresh({partialGraph:{edges:[i].concat($(o))},schedule:!0})},a.updateEdgeGraphUpdate=function(r){n.refresh({partialGraph:{edges:[r.key]},skipIndexation:!1,schedule:!0})},a.dropEdgeGraphUpdate=function(r){var i=r.key;n.markNodesDirty([r.source,r.target]);var o=n.edgeGroups.getSiblings(i);n.edgeGroups.unregister(i),n.removeEdge(i);var s=M(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;n.addEdge(u)}}catch(d){s.e(d)}finally{s.f()}n.scheduleProcess()},a.clearEdgesGraphUpdate=function(){n.clearEdgeState(),n.clearEdgeIndices(),n.refresh({schedule:!0})},a.clearGraphUpdate=function(){n.clearEdgeState(),n.clearNodeState(),n.clearEdgeIndices(),n.clearNodeIndices(),n.refresh({schedule:!0})},t.on("nodeAdded",a.addNodeGraphUpdate),t.on("nodeDropped",a.dropNodeGraphUpdate),t.on("nodeAttributesUpdated",a.updateNodeGraphUpdate),t.on("eachNodeAttributesUpdated",a.eachNodeAttributesUpdatedGraphUpdate),t.on("edgeAdded",a.addEdgeGraphUpdate),t.on("edgeDropped",a.dropEdgeGraphUpdate),t.on("edgeAttributesUpdated",a.updateEdgeGraphUpdate),t.on("eachEdgeAttributesUpdated",a.eachEdgeAttributesUpdatedGraphUpdate),t.on("edgesCleared",a.clearEdgesGraphUpdate),t.on("cleared",a.clearGraphUpdate)}function zd(n,a){n.removeListener("nodeAdded",a.addNodeGraphUpdate),n.removeListener("nodeDropped",a.dropNodeGraphUpdate),n.removeListener("nodeAttributesUpdated",a.updateNodeGraphUpdate),n.removeListener("eachNodeAttributesUpdated",a.eachNodeAttributesUpdatedGraphUpdate),n.removeListener("edgeAdded",a.addEdgeGraphUpdate),n.removeListener("edgeDropped",a.dropEdgeGraphUpdate),n.removeListener("edgeAttributesUpdated",a.updateEdgeGraphUpdate),n.removeListener("eachEdgeAttributesUpdated",a.eachEdgeAttributesUpdatedGraphUpdate),n.removeListener("edgesCleared",a.clearEdgesGraphUpdate),n.removeListener("cleared",a.clearGraphUpdate)}var Md={x:.5,y:.5,angle:0,ratio:1},Od=8,Bd=.001;function Ud(n){var a=n.coords,t=n.nodeData,e=n.dimensions,r=n.stagePadding,i=n.zoomToSizeRatioFunction,o=n.itemSizesReference,s=n.fitLabels,l=n.nodeLabelBox,u=Object.keys(a);if(!u.length)return n.extent;for(var d=i(1)||1,c=o==="positions",f=e.width,h=e.height,p=n.extent,b=0;b<Od;b++){for(var v=An(p),g={width:p.x[1]-p.x[0]||1,height:p.y[1]-p.y[0]||1},m=ke(Md,e,g,r),y=So(m,v({x:0,y:0}),f,h),T=So(m,v({x:1,y:0}),f,h),x=Math.hypot(T.x-y.x,T.y-y.y)||1,_=1/0,R=-1/0,S=1/0,C=-1/0,D=0,k=u.length;D<k;D++){var A=u[D],I=t[A],w=I.size/d*(c?x:1),F=-w,G=w,N=-w,P=w;if(s){var L=l(I,w);L&&(L.minX<F&&(F=L.minX),L.maxX>G&&(G=L.maxX),L.minY<N&&(N=L.minY),L.maxY>P&&(P=L.maxY))}var z=a[A],H=z.x,W=z.y;_=Math.min(_,H+F/x),R=Math.max(R,H+G/x),S=Math.min(S,W-P/x),C=Math.max(C,W-N/x)}var q={x:[_,R],y:[S,C]},j=Math.max(q.x[1]-q.x[0],q.y[1]-q.y[0])||1,X=Math.max(Math.abs(q.x[0]-p.x[0]),Math.abs(q.x[1]-p.x[1]),Math.abs(q.y[0]-p.y[0]),Math.abs(q.y[1]-p.y[1]));if(p=q,X/j<Bd)break}return p}function So(n,a,t,e){var r=$e(n,a);return{x:(1+r.x)*t/2,y:(1-r.y)*e/2}}var Wd=typeof navigator<"u"&&/Mac|iP(hone|ad|od)/.test(navigator.platform),Hd=1500,$d=`.sigma-gesture-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
  background: #00000066;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: opacity 0.1s;
}`;function Ro(n){var a,t,e=dt("style");e.textContent=n,document.head.appendChild(e);var r=((a=(t=e.sheet)===null||t===void 0?void 0:t.cssRules.length)!==null&&a!==void 0?a:0)>0;return e.remove(),r}var et=null;function Vd(){return et===null&&(et=$d,Ro("@scope {}")&&(et=`@scope {
`.concat(et,`
}`)),Ro("@layer sigma-gesture-hint {}")&&(et=`@layer sigma-gesture-hint {
`.concat(et,`
}`))),et}var jd=(function(){function n(a){Y(this,n),E(this,"hideTimeout",null),this.styleElement=dt("style"),this.styleElement.textContent=Vd(),a.appendChild(this.styleElement),this.element=dt("div",{opacity:"0"},{class:"sigma-gesture-hint"}),a.appendChild(this.element)}return K(n,[{key:"show",value:function(t,e){var r=this,i=t==="touch"?e.sharedGestureTouchMessage:Wd?e.sharedGestureAppleWheelMessage:e.sharedGestureWheelMessage;i&&(this.element.textContent=i,this.element.style.opacity="1",typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.hideTimeout=window.setTimeout(function(){r.hideTimeout=null,r.element.style.opacity="0"},Hd))}},{key:"kill",value:function(){typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.styleElement.remove(),this.element.remove()}}])})(),Xd=(function(){function n(a){Y(this,n),E(this,"readBuffer",null),E(this,"fence",null),E(this,"result",new Uint8Array(4)),E(this,"generation",0),E(this,"readGeneration",0),E(this,"lastEvent",null),E(this,"active",!1),E(this,"dirty",!1),E(this,"rafId",null),E(this,"killed",!1),this.options=a}return K(n,[{key:"pointerMoved",value:function(t){this.lastEvent=t,this.active=!0,!this.options.isRenderPending()&&this.request()}},{key:"pointerLeft",value:function(){this.active=!1,this.dirty=!1}},{key:"frameRendered",value:function(){this.request()}},{key:"invalidate",value:function(){this.generation++}},{key:"request",value:function(){if(!(this.killed||!this.active||!this.lastEvent)){if(this.fence){this.dirty=!0;return}this.startRead()}}},{key:"startRead",value:function(){var t=this.options,e=t.gl,r=t.getFrameBuffer,i=t.getPixelRatio,o=t.getDownSizingRatio;this.readGeneration=this.generation;var s=this.lastEvent,l=hn(e,s.x,s.y,i(),o()),u=Q(l,2),d=u[0],c=u[1];this.readBuffer||(this.readBuffer=e.createBuffer()),e.bindFramebuffer(e.FRAMEBUFFER,r()),e.bindBuffer(e.PIXEL_PACK_BUFFER,this.readBuffer),e.bufferData(e.PIXEL_PACK_BUFFER,4,e.STREAM_READ),e.readPixels(d,c,1,1,e.RGBA,e.UNSIGNED_BYTE,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),this.fence=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0),e.flush(),this.schedulePoll(s)}},{key:"schedulePoll",value:function(t){var e=this;this.rafId=requestAnimationFrame(function(){e.rafId=null,e.poll(t)})}},{key:"poll",value:function(t){var e=this.options,r=e.gl,i=e.onIndex;if(!(this.killed||!this.fence)){var o=r.clientWaitSync(this.fence,0,0);if(o===r.TIMEOUT_EXPIRED){this.schedulePoll(t);return}if(r.deleteSync(this.fence),this.fence=null,o!==r.WAIT_FAILED&&this.readGeneration===this.generation){r.bindBuffer(r.PIXEL_PACK_BUFFER,this.readBuffer),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,this.result),r.bindBuffer(r.PIXEL_PACK_BUFFER,null);var s=Q(this.result,4),l=s[0],u=s[1],d=s[2],c=s[3];this.active&&i(fn(l,u,d,c),t)}this.dirty&&(this.dirty=!1,this.active&&this.lastEvent&&!this.options.isRenderPending()&&this.startRead())}}},{key:"reset",value:function(){this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null,this.fence=null,this.readBuffer=null,this.dirty=!1}},{key:"kill",value:function(){this.killed=!0,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null;var t=this.options.gl;this.fence&&t.deleteSync(this.fence),this.fence=null,this.readBuffer&&t.deleteBuffer(this.readBuffer),this.readBuffer=null}}])})(),Ao=(function(){function n(a,t){Y(this,n),this.key=a,this.size=t}return K(n,null,[{key:"compare",value:function(t,e){return t.size>e.size?-1:t.size<e.size||t.key>e.key?1:-1}}])})(),Xn=(function(){function n(){Y(this,n),E(this,"width",0),E(this,"height",0),E(this,"cellSize",0),E(this,"columns",0),E(this,"rows",0),E(this,"cells",{})}return K(n,[{key:"resizeAndClear",value:function(t,e){this.width=t.width,this.height=t.height,this.cellSize=e,this.columns=Math.ceil(t.width/e),this.rows=Math.ceil(t.height/e),this.cells={}}},{key:"getIndex",value:function(t){var e=Math.floor(t.x/this.cellSize),r=Math.floor(t.y/this.cellSize);return r*this.columns+e}},{key:"add",value:function(t,e,r){var i=new Ao(t,e),o=this.getIndex(r),s=this.cells[o];s||(s=[],this.cells[o]=s),s.push(i)}},{key:"organize",value:function(){for(var t in this.cells){var e=this.cells[t];e.sort(Ao.compare)}}},{key:"getLabelsToDisplay",value:function(t,e,r){var i=this.cellSize*this.cellSize,o=i/t/t,s=o*e/i,l=Math.ceil(s),u=[];if(r)for(var d=Math.max(0,Math.floor(r.x1/this.cellSize)),c=Math.min(this.columns-1,Math.floor(r.x2/this.cellSize)),f=Math.max(0,Math.floor(r.y1/this.cellSize)),h=Math.min(this.rows-1,Math.floor(r.y2/this.cellSize)),p=f;p<=h;p++)for(var b=d;b<=c;b++){var v=p*this.columns+b,g=this.cells[v];if(g)for(var m=0;m<Math.min(l,g.length);m++)u.push(g[m].key)}else for(var y in this.cells)for(var T=this.cells[y],x=0;x<Math.min(l,T.length);x++)u.push(T[x].key);return u}}])})();function qd(n){var a=n.graph,t=n.hoveredNode,e=n.highlightedNodes,r=n.displayedNodeLabels,i=new Set,o=new Set(e);t&&o.add(t);var s=M(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;a.hasNode(u)&&a.forEachEdge(u,function(h){i.add(h)})}}catch(h){s.e(h)}finally{s.f()}var d=M(r),c;try{var f=function(){var p=c.value;if(o.has(p))return 1;a.forEachEdge(p,function(b,v,g,m){var y=g===p?m:g;r.has(y)&&i.add(b)})};for(d.s();!(c=d.n()).done;)f()}catch(h){d.e(h)}finally{d.f()}return Array.from(i)}var mt=150,bt=50,Yd={both:0,node:1,label:2},Kd={over:0,above:1,below:2,auto:3},Do=12,Zd=3,Qd=(function(){function n(a){Y(this,n),E(this,"labelGrid",new Xn),E(this,"edgeAnchorGrid",new Xn),E(this,"displayedNodeLabels",new Set),E(this,"displayedEdgeLabels",new Set),E(this,"edgeLabelCandidates",[]),E(this,"renderedNodeLabels",new Set),E(this,"labelSizeCache",new Map),E(this,"framePassPoints",new Float32Array(0)),E(this,"labelsDirty",!0),this.internals=a}return K(n,[{key:"resetFrame",value:function(){this.displayedNodeLabels=new Set,this.renderedNodeLabels=new Set,this.labelSizeCache.clear()}},{key:"clearEdgeLabels",value:function(){this.displayedEdgeLabels=new Set}},{key:"resetLabelGrid",value:function(){this.labelGrid=new Xn,this.edgeAnchorGrid=new Xn}},{key:"processWebGLLabels",value:function(t){for(var e,r=this.internals,i=r.labelProgram,o=r.primitives,s=r.nodeDataCache,l=(o==null||(e=o.nodes)===null||e===void 0||(e=e.label)===null||e===void 0||(e=e.font)===null||e===void 0?void 0:e.family)||"sans-serif",u=new Map,d=0,c=t.length;d<c;d++){var f=t[d],h=s[f];if(!(h.visibility==="hidden"||!h.label)){var p=h.labelFont||l,b=u.get(p);b?b.push(h.label):u.set(p,[h.label])}}var v=M(u),g;try{for(v.s();!(g=v.n()).done;){var m=Q(g.value,2),y=m[0],T=m[1],x=Cn(y),_=x.family,R=x.weight,S=x.style,C=i.registerFont(_,R,S);i.ensureGlyphsReady(T,C)}}catch(D){v.e(D)}finally{v.f()}}},{key:"measureNodeLabel",value:function(t){var e,r;if(!t.label)return{width:0,height:0,textHeight:0};var i=this.internals,o=i.labelProgram,s=i.primitives,l=(e=t.labelSize)!==null&&e!==void 0?e:14,u=t.labelFont||(s==null||(r=s.nodes)===null||r===void 0||(r=r.label)===null||r===void 0||(r=r.font)===null||r===void 0?void 0:r.family)||"sans-serif",d="".concat(t.label,"|").concat(l,"|").concat(u);if(this.labelSizeCache.has(d))return this.labelSizeCache.get(d);var c=Cn(u),f=c.family,h=c.weight,p=c.style,b=o.registerFont(f,h,p),v=o.measureLabel(t.label,l,b);return this.labelSizeCache.set(d,v),v}},{key:"nodeLabelBox",value:function(t,e){var r,i,o,s,l;if(t.visibility==="hidden"||t.labelVisibility==="hidden")return null;var u=this.measureNodeLabel(t),d=u.width,c=u.height,f=u.textHeight;if(!d)return null;var h=(r=(i=this.internals.primitives)===null||i===void 0||(i=i.nodes)===null||i===void 0||(i=i.label)===null||i===void 0?void 0:i.margin)!==null&&r!==void 0?r:Ze,p=e+h,b=t.labelBackgroundColor?(o=t.labelBackgroundPadding)!==null&&o!==void 0?o:Mn:0,v=d/2,g=c/2,m=v+b,y=g+b,T=f/2,x=0,_=0;switch((s=t.labelPosition)!==null&&s!==void 0?s:"right"){case"left":x=-(p+v);break;case"above":_=-(p+T);break;case"below":_=p+T;break;case"over":break;default:x=p+v}var R=(l=t.labelAngle)!==null&&l!==void 0?l:0,S=cn({x,y:_},R),C=S.x,D=S.y,k=Math.abs(Math.cos(R)),A=Math.abs(Math.sin(R)),I=k*m+A*y,w=A*m+k*y;return{minX:C-I,maxX:C+I,minY:D-w,maxY:D+w}}},{key:"computeDisplayedNodeLabels",value:function(){var t=this.internals.getCameraState(),e=this.internals.getDimensions(),r=e.width,i=e.height,o=this.internals.viewportToFramedGraph({x:-mt,y:-bt}),s=this.internals.viewportToFramedGraph({x:r+mt,y:-bt}),l=this.internals.viewportToFramedGraph({x:-mt,y:i+bt}),u=this.internals.viewportToFramedGraph({x:r+mt,y:i+bt}),d=Math.min(o.x,s.x,l.x,u.x),c=Math.max(o.x,s.x,l.x,u.x),f=Math.min(o.y,s.y,l.y,u.y),h=Math.max(o.y,s.y,l.y,u.y),p=ke({x:.5,y:.5,ratio:1,angle:0},{width:r,height:i},this.internals.getGraphDimensions(),this.internals.getStagePadding()),b=function(L){var z=$e(p,L);return{x:(1+z.x)*r/2,y:(1-z.y)*i/2}},v=b({x:d,y:f}),g=b({x:c,y:f}),m=b({x:d,y:h}),y=b({x:c,y:h}),T={x1:Math.min(v.x,g.x,m.x,y.x),y1:Math.min(v.y,g.y,m.y,y.y),x2:Math.max(v.x,g.x,m.x,y.x),y2:Math.max(v.y,g.y,m.y,y.y)},x=this.internals,_=x.settings,R=x.nodeDataCache,S=x.nodesWithForcedLabels,C=this.labelGrid.getLabelsToDisplay(t.ratio,_.labelDensity,T);wa(C,S);for(var D=0,k=C.length;D<k;D++){var A=C[D],I=R[A];if(!this.displayedNodeLabels.has(A)&&!(I.visibility==="hidden"||I.labelVisibility==="hidden")&&I.label&&!(I.x<d||I.x>c||I.y<f||I.y>h)){var w=this.internals.framedGraphToViewport(I),F=w.x,G=w.y,N=this.internals.scaleSize(I.size);!Me(I)&&N<_.labelRenderedSizeThreshold||F<-mt-N||F>r+mt+N||G<-bt-N||G>i+bt+N||this.displayedNodeLabels.add(A)}}}},{key:"buildFramePassPoints",value:function(){var t=this.internals,e=t.nodeDataCache,r=t.nodeDataTexture;if(!r)return{data:this.framePassPoints,count:0};var i=this.displayedNodeLabels.size*3;this.framePassPoints.length<i&&(this.framePassPoints=new Float32Array(i));var o=this.framePassPoints,s=0,l=M(this.displayedNodeLabels),u;try{for(l.s();!(u=l.n()).done;){var d,c,f=u.value,h=e[f];if(h){var p=r.getIndex(f);p<0||(o[s*3]=p,o[s*3+1]=(d=Ke[h.labelPosition||Ie.labelPosition])!==null&&d!==void 0?d:0,o[s*3+2]=(c=h.labelAngle)!==null&&c!==void 0?c:0,s++)}}}catch(b){l.e(b)}finally{l.f()}return{data:o,count:s}}},{key:"renderWebGLLabels",value:function(t,e){var r=this.internals,i=r.nodeDataCache,o=r.labelProgram,s=r.primitives,l=r.nodeDataTexture,u=[],d=M(this.displayedNodeLabels),c;try{for(d.s();!(c=d.n()).done;){var f=c.value;if(!this.renderedNodeLabels.has(f)){var h=i[f];e&&h.labelDepth!==e||(this.renderedNodeLabels.add(f),u.push(f))}}}catch(de){d.e(de)}finally{d.f()}if(u.length!==0){if(this.labelsDirty){for(var p,b,v,g=0,m=0,y=u.length;m<y;m++){var T=i[u[m]];g+=T.label.length}o.reallocate(g);for(var x=14,_=(p=s==null||(b=s.nodes)===null||b===void 0||(b=b.label)===null||b===void 0?void 0:b.margin)!==null&&p!==void 0?p:Ze,R=Ie.labelPosition,S=(s==null||(v=s.nodes)===null||v===void 0||(v=v.label)===null||v===void 0||(v=v.font)===null||v===void 0?void 0:v.family)||"sans-serif",C=new Map,D=0,k=0,A=u.length;k<A;k++){var I,w,F,G,N=u[k],P=i[N],L=P.labelFont||S,z=C.get(L);if(z===void 0){var H=Cn(L),W=H.family,q=H.weight,j=H.style;z=o.registerFont(W,q,j),C.set(L,z)}var X={text:P.label,x:P.x,y:P.y,size:(I=P.labelSize)!==null&&I!==void 0?I:x,color:P.labelColor,nodeSize:P.size,margin:_,position:(w=P.labelPosition)!==null&&w!==void 0?w:R,hidden:!1,forceLabel:Me(P),type:"default",zIndex:(F=P.zIndex)!==null&&F!==void 0?F:0,parentType:"node",parentKey:N,fontKey:z,labelAngle:(G=P.labelAngle)!==null&&G!==void 0?G:0,nodeIndex:l.getIndex(N)},_e=o.processLabel(N,D,X);D+=_e}o.invalidateBuffers()}o.render(t)}}},{key:"renderBackdrops",value:function(t,e){var r=this.internals,i=r.backdropProgram,o=r.nodeDataCache,s=r.nodesWithBackdrop,l=r.attachmentManager,u=r.pixelRatio,d=r.nodeDataTexture,c=[],f=M(s),h;try{for(f.s();!(h=f.n()).done;){var p,b=h.value,v=o[b];if(!(!v||v.visibility==="hidden")&&!(e&&v.depth!==e)){var g=(p=d?.getIndex(b))!==null&&p!==void 0?p:-1;g<0||c.push({key:b,nodeIndex:g})}}}catch(He){f.e(He)}finally{f.f()}if(c.length!==0){i.reallocate(c.length);for(var m=0;m<c.length;m++){var y,T,x,_,R,S,C,D,k=c[m],A=k.key,I=k.nodeIndex,w=o[A],F=this.displayedNodeLabels.has(A),G=F?this.measureNodeLabel(w):{width:0,height:0,textHeight:0},N=G.textHeight,P=G.width,L=G.height,z=0,H=0;if(F&&w.labelAttachment&&l){var W=l.getEntry(A,w.labelAttachment);if(W){var q=w.labelAttachmentPlacement||"below";if(q==="below"||q==="above"){var j=W.height/u;L+=j+We,P=Math.max(P,W.width/u),H=q==="below"?(j+We)/2:-(j+We)/2}else{var X=W.width/u;P+=X+We,L=Math.max(L,W.height/u),z=q==="right"?(X+We)/2:-(X+We)/2}}}var _e=w.backdropColor?ve(w.backdropColor):[255,255,255,255],de=w.backdropShadowColor?ve(w.backdropShadowColor):[0,0,0,128],Pe=_e.map(function(He){return He/255}),at=de.map(function(He){return He/255}),Rt=(y=w.backdropShadowBlur)!==null&&y!==void 0?y:12,At=(T=w.backdropPadding)!==null&&T!==void 0?T:6,Dt=w.backdropBorderColor?ve(w.backdropBorderColor):[0,0,0,0],qs=Dt.map(function(He){return He/255}),Ys=(x=w.backdropBorderWidth)!==null&&x!==void 0?x:0,Ks=(_=w.backdropCornerRadius)!==null&&_!==void 0?_:0,br=(R=w.backdropLabelPadding)!==null&&R!==void 0?R:-1,Zs=br<0?At:br,Qs=(S=Yd[(C=w.backdropArea)!==null&&C!==void 0?C:"both"])!==null&&S!==void 0?S:0,Js={key:A,nodeIndex:I,label:w.label,labelWidth:P,labelHeight:L,textHeight:N,type:"default",position:w.labelPosition||Ie.labelPosition,labelAngle:(D=w.labelAngle)!==null&&D!==void 0?D:0,backdropColor:Pe,backdropShadowColor:at,backdropShadowBlur:Rt,backdropPadding:At,backdropBorderColor:qs,backdropBorderWidth:Ys,backdropCornerRadius:Ks,backdropLabelPadding:Zs,backdropArea:Qs,labelBoxOffset:[z,H]};i.processBackdrop(m,Js)}i.invalidateBuffers(),i.render(t)}}},{key:"renderLabelBackgrounds",value:function(t,e){var r=this.internals,i=r.labelBackgroundProgram,o=r.nodeDataCache,s=r.nodeDataTexture,l=se.nodeLabel.writesPickingThisFrame(this.internals),u=[],d=M(this.displayedNodeLabels),c;try{for(d.s();!(c=d.n()).done;){var f=c.value,h=o[f];!h||h.visibility==="hidden"||e&&h.labelDepth!==e||!l&&!h.labelBackgroundColor||u.push(f)}}catch(I){d.e(I)}finally{d.f()}if(u.length!==0){i.reallocate(u.length);for(var p=0;p<u.length;p++){var b,v,g,m,y=u[p],T=o[y],x=(b=s?.getIndex(y))!==null&&b!==void 0?b:-1;if(!(x<0)){var _=this.measureNodeLabel(T),R=_.width,S=_.height,C=_.textHeight,D=tt(this.internals.pickingState,"nodeLabel",y)||tt(this.internals.pickingState,"node",y),k=T.labelBackgroundColor?he(T.labelBackgroundColor):he("transparent"),A={nodeIndex:x,id:Ve(D),color:k,labelWidth:R,labelHeight:S,textHeight:C,positionMode:(v=Ke[T.labelPosition||Ie.labelPosition])!==null&&v!==void 0?v:0,labelAngle:(g=T.labelAngle)!==null&&g!==void 0?g:0,padding:(m=T.labelBackgroundPadding)!==null&&m!==void 0?m:Mn};i.processLabelBackground(p,A)}}i.invalidateBuffers(),i.render(t)}}},{key:"cacheAttachments",value:function(t){var e=this.internals,r=e.attachmentManager,i=e.pixelRatio,o=e.nodeDataCache,s=e.nodesWithBackdrop,l=e.graph;if(r){var u=M(s),d;try{for(u.s();!(d=u.n()).done;){var c=d.value;if(this.displayedNodeLabels.has(c)){var f=o[c];if(!(!f||f.visibility==="hidden")&&!(t&&f.depth!==t)&&f.labelAttachment){var h=l.getNodeAttributes(c),p=this.measureNodeLabel(f),b=p.width,v=p.height,g={node:c,attributes:h,pixelRatio:i,labelWidth:b,labelHeight:v};r.renderAttachment(c,f.labelAttachment,g)}}}}catch(m){u.e(m)}finally{u.f()}r.regenerateAtlas()}}},{key:"renderAttachments",value:function(t,e){var r=this.internals,i=r.attachmentManager,o=r.attachmentProgram,s=r.nodeDataCache,l=r.nodesWithBackdrop,u=r.pixelRatio,d=r.nodeDataTexture;if(!(!i||!o)){var c=0;o.reallocateAttachments(l.size);var f=M(l),h;try{for(f.s();!(h=f.n()).done;){var p,b,v,g,m=h.value;if(this.displayedNodeLabels.has(m)){var y=s[m];if(!(!y||y.visibility==="hidden")&&!(e&&y.labelDepth!==e)&&y.labelAttachment){var T=i.getEntry(m,y.labelAttachment);if(T){var x=(p=d?.getIndex(m))!==null&&p!==void 0?p:-1;if(!(x<0)){var _=this.measureNodeLabel(y),R=_.width,S=_.height,C=_.textHeight,D=(b=Ci[y.labelAttachmentPlacement||"below"])!==null&&b!==void 0?b:0;o.processAttachment(c,{nodeIndex:x,atlasX:T.x,atlasY:T.y,atlasW:T.width,atlasH:T.height,attachWidth:T.width/u,attachHeight:T.height/u,positionMode:(v=Ke[y.labelPosition||Ie.labelPosition])!==null&&v!==void 0?v:0,attachmentPlacement:D,labelWidth:R,labelHeight:S,textHeight:C,labelAngle:(g=y.labelAngle)!==null&&g!==void 0?g:0}),c++}}}}}}catch(k){f.e(k)}finally{f.f()}c!==0&&(o.reallocateAttachments(c),i.bindTexture(qt),o.invalidateBuffers(),o.render(t))}}},{key:"computeDisplayedEdgeLabels",value:function(){var t=this.internals,e=t.graph,r=t.stateManager,i=t.settings,o=t.edgesWithForcedLabels,s=r.getHighlightedNodes(),l=i.edgeLabelAnchors==="allNodes"?new Set(this.edgeAnchorGrid.getLabelsToDisplay(this.internals.getCameraState().ratio,i.labelDensity)):this.displayedNodeLabels,u=r.hovered,d=qd({graph:e,hoveredNode:u?.kind==="node"?u.key:null,displayedNodeLabels:l,highlightedNodes:s});wa(d,o),this.edgeLabelCandidates=d,this.displayedEdgeLabels=new Set}},{key:"filterEdgeLabelsForDepth",value:function(t){for(var e=this.internals,r=e.graph,i=e.nodeDataCache,o=e.edgeDataCache,s=[],l=new Set,u=0,d=this.edgeLabelCandidates.length;u<d;u++){var c=this.edgeLabelCandidates[u];if(!l.has(c)){l.add(c);var f=r.extremities(c),h=i[f[0]],p=i[f[1]],b=o[c];!b||!h||!p||b.visibility==="hidden"||b.labelVisibility==="hidden"||h.visibility==="hidden"||p.visibility==="hidden"||t&&b.labelDepth!==t||b.label&&s.push(c)}}return s}},{key:"renderEdgeLabels",value:function(t,e){var r=this.internals,i=r.graph,o=r.nodeDataCache,s=r.edgeDataCache,l=r.primitives,u=r.edgeLabelProgram,d=r.nodeDataTexture,c=r.edgeDataTexture;if(u){var f=this.filterEdgeLabelsForDepth(e),h=M(f),p;try{for(h.s();!(p=h.n()).done;){var b=p.value;this.displayedEdgeLabels.add(b)}}catch(X){h.e(X)}finally{h.f()}if(f.length!==0){if(this.labelsDirty){var v,g,m=0,y=M(f),T;try{for(y.s();!(T=y.n()).done;){var x=T.value;m+=s[x].label.length}}catch(X){y.e(X)}finally{y.f()}u.reallocate(m);var _=(v=l==null||(g=l.edges)===null||g===void 0||(g=g.label)===null||g===void 0?void 0:g.margin)!==null&&v!==void 0?v:5,R="over",S=0,C=M(f),D;try{for(C.s();!(D=C.n()).done;){var k,A,I=D.value,w=i.extremities(I),F=w[0],G=w[1],N=o[F],P=o[G],L=s[I],z=d.getIndex(F),H=d.getIndex(G),W=c.getIndex(I),q={text:L.label,x:(N.x+P.x)/2,y:(N.y+P.y)/2,size:Do,color:L.labelColor,nodeSize:0,nodeIndex:-1,margin:_,position:(k=L.labelPosition)!==null&&k!==void 0?k:R,hidden:!1,forceLabel:Me(L),type:"default",zIndex:(A=L.zIndex)!==null&&A!==void 0?A:0,parentType:"edge",parentKey:I,fontKey:"",labelAngle:0,sourceX:N.x,sourceY:N.y,targetX:P.x,targetY:P.y,sourceSize:N.size,targetSize:P.size,sourceShape:N.shape||"circle",targetShape:P.shape||"circle",edgeSize:L.size,offset:0,edgeAttributes:L,sourceNodeIndex:z,targetNodeIndex:H,edgeIndex:W},j=u.processEdgeLabel(I,S,q);S+=j}}catch(X){C.e(X)}finally{C.f()}u.invalidateBuffers()}u.render(t)}}}},{key:"renderEdgeLabelBackgrounds",value:function(t,e){var r,i,o=this.internals,s=o.edgeLabelBackgroundProgram,l=o.edgeLabelProgram,u=o.edgeDataCache,d=o.primitives,c=o.edgeDataTexture;if(!(!c||!l||!s)){var f=se.edgeLabel.writesPickingThisFrame(this.internals),h=(r=d==null||(i=d.edges)===null||i===void 0||(i=i.label)===null||i===void 0?void 0:i.margin)!==null&&r!==void 0?r:5,p="over",b=this.filterEdgeLabelsForDepth(e),v=[],g=M(b),m;try{for(g.s();!(m=g.n()).done;){var y=m.value;!f&&!u[y].labelBackgroundColor||v.push(y)}}catch(N){g.e(N)}finally{g.f()}if(v.length!==0){s.reallocate(v.length);for(var T=0;T<v.length;T++){var x,_,R,S=v[T],C=u[S],D=C.label,k=l.measureLabelAtlasWidth(D),A=(x=C.labelPosition)!==null&&x!==void 0?x:p,I=typeof A=="string"&&(_=Kd[A])!==null&&_!==void 0?_:0,w=tt(this.internals.pickingState,"edgeLabel",S)||tt(this.internals.pickingState,"edge",S),F=C.labelBackgroundColor?he(C.labelBackgroundColor):he("transparent"),G={edgeIndex:c.getIndex(S),baseFontSize:Do,totalTextWidth:k,positionMode:I,margin:h,padding:(R=C.labelBackgroundPadding)!==null&&R!==void 0?R:Zd,color:F,id:Ve(w),edgeAttributes:C};s.processEdgeLabelBackground(T,S,G)}s.invalidateBuffers(),s.render(t)}}}}])})(),Jd=(function(){function n(a,t,e,r){Y(this,n),E(this,"nodeStates",new Map),E(this,"edgeStates",new Map),E(this,"hovered",null),E(this,"dirtyNodes",new Set),E(this,"dirtyEdges",new Set),E(this,"graphStateChanged",!1),E(this,"graphStateFlagsDirty",!1),this.scheduleRefresh=a,this.customNodeStateDefaults=t,this.customEdgeStateDefaults=e,this.customGraphStateDefaults=r,this.graphState=_a(r)}return K(n,[{key:"getNodeState",value:function(t){t=""+t;var e=this.nodeStates.get(t);return e||(e=qr(this.customNodeStateDefaults),this.nodeStates.set(t,e)),e}},{key:"getEdgeState",value:function(t){t=""+t;var e=this.edgeStates.get(t);return e||(e=Yr(this.customEdgeStateDefaults),this.edgeStates.set(t,e)),e}},{key:"getGraphState",value:function(){return this.flushGraphStateFlags(),this.graphState}},{key:"getHighlightedNodes",value:function(){var t=new Set,e=M(this.nodeStates),r;try{for(e.s();!(r=e.n()).done;){var i=Q(r.value,2),o=i[0],s=i[1];s.isHighlighted&&t.add(o)}}catch(l){e.e(l)}finally{e.f()}return t}},{key:"setNodeState",value:function(t,e){t=""+t;var r=this.getNodeState(t);if(ut(r,e)){var i=O(O({},r),e);this.nodeStates.set(t,i),this.dirtyNodes.add(t),this.updateHoveredNodeTracking(t,r,i),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}}},{key:"setEdgeState",value:function(t,e){t=""+t;var r=this.getEdgeState(t);if(ut(r,e)){var i=O(O({},r),e);this.edgeStates.set(t,i),this.dirtyEdges.add(t),this.updateHoveredEdgeTracking(t,r,i),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}}},{key:"setGraphState",value:function(t){if(ut(this.graphState,t)){var e=O(O({},this.graphState),t);e.isIdle=!e.isPanning&&!e.isZooming&&!e.isDragging,this.graphState=e,this.graphStateChanged=!0,this.scheduleRefresh()}}},{key:"setNodesState",value:function(t,e){var r=!1,i=M(t),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s=""+s;var l=this.getNodeState(s);if(ut(l,e)){var u=O(O({},l),e);this.nodeStates.set(s,u),this.dirtyNodes.add(s),this.updateHoveredNodeTracking(s,l,u),r=!0}}}catch(d){i.e(d)}finally{i.f()}r&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}},{key:"setEdgesState",value:function(t,e){var r=!1,i=M(t),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s=""+s;var l=this.getEdgeState(s);if(ut(l,e)){var u=O(O({},l),e);this.edgeStates.set(s,u),this.dirtyEdges.add(s),this.updateHoveredEdgeTracking(s,l,u),r=!0}}}catch(d){i.e(d)}finally{i.f()}r&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}},{key:"markNodesDirty",value:function(t){var e=M(t),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;this.dirtyNodes.add(i)}}catch(o){e.e(o)}finally{e.f()}this.scheduleRefresh()}},{key:"removeNode",value:function(t){this.nodeStates.delete(t),this.dirtyNodes.delete(t),this.clearHoveredFor("node",t),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"removeEdge",value:function(t){this.edgeStates.delete(t),this.dirtyEdges.delete(t),this.clearHoveredFor("edge",t),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"pruneNodes",value:function(t){var e=M(this.nodeStates.keys()),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;t(i)||this.removeNode(i)}}catch(o){e.e(o)}finally{e.f()}}},{key:"pruneEdges",value:function(t){var e=M(this.edgeStates.keys()),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;t(i)||this.removeEdge(i)}}catch(o){e.e(o)}finally{e.f()}}},{key:"clearNodes",value:function(){this.nodeStates.clear(),this.dirtyNodes.clear(),this.clearHoveredForKinds(Yn("node")),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"clearEdges",value:function(){this.edgeStates.clear(),this.dirtyEdges.clear(),this.clearHoveredForKinds(Yn("edge")),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"resetGraphState",value:function(){this.graphState=_a(this.customGraphStateDefaults),this.graphStateChanged=!1,this.graphStateFlagsDirty=!1}},{key:"clearDirtyTracking",value:function(){this.dirtyNodes.clear(),this.dirtyEdges.clear(),this.graphStateChanged=!1}},{key:"setHovered",value:function(t){this.hovered=t}},{key:"clearHoveredFor",value:function(t,e){this.hovered&&this.hovered.key===e&&Yn(t).includes(this.hovered.kind)&&(this.hovered=null)}},{key:"clearHoveredForKinds",value:function(t){this.hovered&&t.includes(this.hovered.kind)&&(this.hovered=null)}},{key:"updateGraphStateFromNodes",value:function(){var t,e=!1,r=!1,i=!1,o=M(this.nodeStates),s;try{for(o.s();!(s=o.n()).done;){var l=Q(s.value,2),u=l[1];if(u.isHovered&&(e=!0),u.isHighlighted&&(r=!0),u.isDragged&&(i=!0),e&&r&&i)break}}catch(c){o.e(c)}finally{o.f()}!e&&((t=this.hovered)===null||t===void 0?void 0:t.kind)==="edge"&&(e=!0);var d=!this.graphState.isPanning&&!this.graphState.isZooming&&!i;(this.graphState.hasHovered!==e||this.graphState.hasHighlighted!==r||this.graphState.isDragging!==i||this.graphState.isIdle!==d)&&(this.graphStateChanged=!0),this.graphState=O(O({},this.graphState),{},{hasHovered:e,hasHighlighted:r,isDragging:i,isIdle:d})}},{key:"updateGraphStateFromEdges",value:function(){var t,e=((t=this.hovered)===null||t===void 0?void 0:t.kind)==="node";if(!e){var r=M(this.edgeStates),i;try{for(r.s();!(i=r.n()).done;){var o=Q(i.value,2),s=o[1];if(s.isHovered){e=!0;break}}}catch(l){r.e(l)}finally{r.f()}}this.graphState.hasHovered!==e&&(this.graphStateChanged=!0),this.graphState=O(O({},this.graphState),{},{hasHovered:e})}},{key:"flushGraphStateFlags",value:function(){this.graphStateFlagsDirty&&(this.updateGraphStateFromNodes(),this.updateGraphStateFromEdges(),this.graphStateFlagsDirty=!1)}},{key:"updateHoveredNodeTracking",value:function(t,e,r){var i;if(e.isHovered!==r.isHovered)if(r.isHovered){var o;if(((o=this.hovered)===null||o===void 0?void 0:o.kind)==="node"&&this.hovered.key!==t){var s=this.hovered.key,l=this.getNodeState(s);this.nodeStates.set(s,O(O({},l),{},{isHovered:!1})),this.dirtyNodes.add(s)}this.hovered={kind:"node",key:t}}else((i=this.hovered)===null||i===void 0?void 0:i.kind)==="node"&&this.hovered.key===t&&(this.hovered=null)}},{key:"updateHoveredEdgeTracking",value:function(t,e,r){var i;if(e.isHovered!==r.isHovered)if(r.isHovered){var o;if(((o=this.hovered)===null||o===void 0?void 0:o.kind)==="edge"&&this.hovered.key!==t){var s=this.hovered.key,l=this.getEdgeState(s);this.edgeStates.set(s,O(O({},l),{},{isHovered:!1})),this.dirtyEdges.add(s)}this.hovered={kind:"edge",key:t}}else((i=this.hovered)===null||i===void 0?void 0:i.kind)==="edge"&&this.hovered.key===t&&(this.hovered=null)}}])})(),wo=1,Co=2,Lo=3,Po=4,ec=(function(n){function a(t,e){var r,i,o,s,l,u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};Y(this,a),l=ne(this,a),E(l,"nodeReducer",null),E(l,"edgeReducer",null),E(l,"stageCanvas",null),E(l,"mouseLayer",null),E(l,"gestureHint",null),E(l,"extraElements",{}),E(l,"webGLContext",null),E(l,"pickingFrameBuffer",null),E(l,"pickingTexture",null),E(l,"pickingDepthBuffer",null),E(l,"activeListeners",{}),E(l,"nodeVariableEntries",[]),E(l,"edgeVariableEntries",[]),E(l,"edgePathsByName",new Map),E(l,"nodeProgramIndex",{}),E(l,"edgeProgramIndex",{}),E(l,"edgeTextureIndexCache",{}),E(l,"nodeGraphCoords",{}),E(l,"nodeExtent",{x:[0,1],y:[0,1]}),E(l,"matrix",ce()),E(l,"invMatrix",ce()),E(l,"correctionRatio",1),E(l,"frameId",0),E(l,"customBBox",null),E(l,"gpuTimerExt",void 0),E(l,"activeGpuTimerQuery",null),E(l,"pendingGpuTimerQueries",[]),E(l,"normalizationFunction",An({x:[0,1],y:[0,1]})),E(l,"graphToViewportRatio",1),E(l,"pickingState",wd()),E(l,"prevNodeVisibilities",{}),E(l,"width",0),E(l,"height",0),E(l,"autoRescaleFrozen",!1),E(l,"stylesDeclaration",null),E(l,"resolvedStageStyle",{}),E(l,"renderFrame",null),E(l,"contextLost",!1),E(l,"pendingProcess","full"),E(l,"needToRefreshState",!1),E(l,"checkEdgesEventsFrame",null),E(l,"edgeStyleAnalysis",{dependency:"static",xAttribute:null,yAttribute:null}),E(l,"depthLayers",$(yn)),E(l,"customLayerPrograms",new Map),E(l,"nodeShapeSlug",null),E(l,"sdfAtlas",null),E(l,"depthRanges",{nodes:{},edges:{}}),E(l,"nodeBaseDepth",{}),E(l,"edgeBaseDepth",{});var d=u.primitives,c=u.styles,f=u.settings,h=f===void 0?{}:f,p=u.nodeReducer,b=u.edgeReducer,v=u.customNodeState,g=u.customEdgeState,m=u.customGraphState;l.stateManager=new Jd(function(){return l.scheduleStateRefresh()},v,g,m);var y=d??ei;l.stylesDeclaration=c?{nodes:(r=c.nodes)!==null&&r!==void 0?r:Gt.nodes,edges:(i=c.edges)!==null&&i!==void 0?i:Gt.edges,stage:c.stage}:Gt,l.nodeReducer=p??null,l.edgeReducer=b??null;var T=Ta(l.stylesDeclaration.nodes);l.nodeReducer&&(T.dependency="graph-state"),l.edgeStyleAnalysis=Ta(l.stylesDeclaration.edges),l.edgeReducer&&(l.edgeStyleAnalysis.dependency="graph-state"),l.stylesDeclaration.stage&&(l.resolvedStageStyle=Da(l.stylesDeclaration.stage,l.stateManager.graphState));var x=si(h);if(wn(x),x.enableNodeDrag){var _=T.xAttribute,R=T.yAttribute;if((!_||!R)&&!x.dragPositionToAttributes)throw new Error('Sigma: `enableNodeDrag` is true but position attribute names could not be inferred from styles. Either use attribute bindings for x/y in your node styles (e.g. `x: { attribute: "x" }`), or provide a `dragPositionToAttributes` setting.')}if(oi(t),!(e instanceof HTMLElement))throw new Error("Sigma: container should be an html element.");l.container=e,l.edgeGroups=new Dd(t,function(P,L){for(var z=0;z<P.length;z++){var H=l.stateManager.getEdgeState(P[z]);H.parallelIndex=z,H.parallelCount=L}});var S=new Ad(t,l.viewportToGraph.bind(l),l.setNodesState.bind(l),function(P,L){return l.emit(P,L)});if(l.depthLayers=(o=y.depthLayers)!==null&&o!==void 0?o:$(yn),!(c!=null&&c.nodes)&&!mn.every(function(P){return l.depthLayers.includes(P)}))throw new Error("Sigma: depthLayers must include ".concat(mn.join(", ")," for the built-in node styles."));if(!(c!=null&&c.edges)&&!bn.every(function(P){return l.depthLayers.includes(P)}))throw new Error("Sigma: depthLayers must include ".concat(bn.join(", ")," for the built-in edge styles."));l.itemBuckets={nodes:new Za(l.depthLayers),edges:new Za(l.depthLayers)},l.initWebGLContext(),l.mouseLayer=dt("div",{position:"absolute",touchAction:"none",userSelect:"none"},{class:"sigma-mouse"}),l.container.appendChild(l.mouseLayer),l.resolvedStageStyle.background&&(l.container.style.backgroundColor=l.resolvedStageStyle.background),l.resolvedStageStyle.cursor&&(l.container.style.cursor=l.resolvedStageStyle.cursor);var C=new ho(l.webGLContext),D=new Qa(l.webGLContext,{channels:1}),k=new fo(l.webGLContext),A=new Qa(l.webGLContext,{channels:4}),I=l.webGLContext,w=new Xd({gl:I,getFrameBuffer:function(){return l.pickingFrameBuffer},getPixelRatio:function(){return l.internals.pixelRatio},getDownSizingRatio:function(){return l.internals.settings.pickingDownSizingRatio},isRenderPending:function(){return l.renderFrame!==null},onIndex:function(L,z){var H;return No(l.internals,(H=l.pickingState.lookup[L])!==null&&H!==void 0?H:null,z)}}),F=l.initPrograms(y,x),G=y==null||(s=y.nodes)===null||s===void 0?void 0:s.labelAttachments,N=null;return G&&Object.keys(G).length>0&&(N=new co(I,G,function(){return l.scheduleRender()})),l.internals=O(O({nodeDataCache:{},edgeDataCache:{},nodesWithForcedLabels:new Set,nodesWithBackdrop:new Set,edgesWithForcedLabels:new Set,settings:x,primitives:y,pixelRatio:Mt(),graph:t,stateManager:l.stateManager,dragManager:S,hoverResolver:w,nodeStyleAnalysis:T,pickingState:l.pickingState},F),{},{attachmentManager:N,nodeDataTexture:C,nodeFrameTexture:D,edgeDataTexture:k,edgeFrameTexture:A,getDimensions:function(){return l.getDimensions()},getGraphDimensions:function(){return l.getGraphDimensions()},getStagePadding:function(){return l.getStagePadding()},getCameraState:function(){return l.camera.getState()},getHitAtPosition:function(L){return l.getHitAtPosition(L)},setNodeState:function(L,z){return l.setNodeState(L,z)},setEdgeState:function(L,z){return l.setEdgeState(L,z)},updateContainerCursor:function(){return l.updateContainerCursor()},scheduleRefresh:function(){return l.scheduleRefresh()},viewportToFramedGraph:function(L){return l.viewportToFramedGraph(L)},viewportToGraph:function(L){return l.viewportToGraph(L)},framedGraphToViewport:function(L){return l.framedGraphToViewport(L)},scaleSize:function(L){return l.scaleSize(L)},emit:function(L,z){return l.emit(L,z)}}),l.labelRenderer=new Qd(l.internals),l.resize(),l.initializeWebGLLabels(),l.camera=new vo,l.bindCameraHandlers(),l.mouseCaptor=new Td(l.mouseLayer,l),l.mouseCaptor.setSettings(l.internals.settings),l.touchCaptor=new Rd(l.mouseLayer,l),l.touchCaptor.setSettings(l.internals.settings),l.bindEventHandlers(),l.bindGraphHandlers(),l.handleSettingsUpdate(),l.refresh(),l}return ae(a,n),K(a,[{key:"initializeWebGLLabels",value:function(){this.sdfAtlas=new Ye,this.sdfAtlas.registerFont({family:"sans-serif",weight:"normal",style:"normal"})}},{key:"resetWebGLTexture",value:function(){var e=this.webGLContext;if(!this.pickingFrameBuffer)return this;var r=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),i=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);e.bindFramebuffer(e.FRAMEBUFFER,this.pickingFrameBuffer),this.pickingTexture&&e.deleteTexture(this.pickingTexture);var o=e.createTexture();o&&(e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,i,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0),this.pickingTexture=o),this.pickingDepthBuffer&&e.deleteRenderbuffer(this.pickingDepthBuffer);var s=e.createRenderbuffer();return s&&(e.bindRenderbuffer(e.RENDERBUFFER,s),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,r,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,s),this.pickingDepthBuffer=s),e.bindFramebuffer(e.FRAMEBUFFER,null),this}},{key:"bindCameraHandlers",value:function(){var e=this;return this.activeListeners.camera=function(){e.refreshMatrices(),e.labelRenderer.labelsDirty=!0,e.scheduleRender()},this.activeListeners.cameraAnimationStart=function(r){var i=r.from,o=r.to;i.ratio!==o.ratio&&e.stateManager.setGraphState({isZooming:!0})},this.activeListeners.cameraAnimationEnd=function(){e.stateManager.setGraphState({isZooming:!1})},this.camera.on("updated",this.activeListeners.camera),this.camera.on("animationStart",this.activeListeners.cameraAnimationStart),this.camera.on("animationEnd",this.activeListeners.cameraAnimationEnd),this}},{key:"unbindCameraHandlers",value:function(){return this.camera.removeListener("updated",this.activeListeners.camera),this.camera.removeListener("animationStart",this.activeListeners.cameraAnimationStart),this.camera.removeListener("animationEnd",this.activeListeners.cameraAnimationEnd),this}},{key:"getHitAtPosition",value:function(e){var r;if(this.contextLost)return null;var i=this.webGLContext;i.bindFramebuffer(i.FRAMEBUFFER,this.pickingFrameBuffer);var o=fa(i,this.pickingFrameBuffer,e.x,e.y,this.internals.pixelRatio,this.internals.settings.pickingDownSizingRatio),s=fn.apply(void 0,$(o));return(r=this.pickingState.lookup[s])!==null&&r!==void 0?r:null}},{key:"bindEventHandlers",value:function(){return Nd(this.internals,this.mouseCaptor,this.touchCaptor,this.activeListeners),this}},{key:"bindGraphHandlers",value:function(){var e=this;return Gd({graph:this.internals.graph,edgeGroups:this.edgeGroups,updateNode:this.updateNode.bind(this),removeNode:this.removeNode.bind(this),addEdge:this.addEdge.bind(this),updateEdge:this.updateEdge.bind(this),removeEdge:this.removeEdge.bind(this),clearEdgeState:this.clearEdgeState.bind(this),clearNodeState:this.clearNodeState.bind(this),clearEdgeIndices:this.clearEdgeIndices.bind(this),clearNodeIndices:this.clearNodeIndices.bind(this),refresh:this.refresh.bind(this),scheduleProcess:function(){e.pendingProcess="full",e.scheduleRender()},markNodesDirty:function(i){e.internals.nodeStyleAnalysis.dependency==="graph-state"&&e.stateManager.markNodesDirty(i)}},this.activeListeners),this}},{key:"unbindGraphHandlers",value:function(){zd(this.internals.graph,this.activeListeners)}},{key:"getNodeShapeId",value:function(e){return this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&e.shape&&e.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[e.shape]]:ht(e.shape||"circle")}},{key:"processNodes",value:function(){var e=this,r=this.internals.graph,i=this.internals.settings,o=this.getDimensions(),s=i.autoRescale,l=i.autoRescaleContent,u=this.nodeExtent;if(s===!1){var d=o.width,c=o.height;u={x:[-d/2,d/2],y:[-c/2,c/2]}}else(s!=="once"||!this.autoRescaleFrozen)&&(u=this.computeNodeExtent(),l!=="positions"&&!this.customBBox&&(u=Ud({extent:u,coords:this.nodeGraphCoords,nodeData:this.internals.nodeDataCache,dimensions:o,stagePadding:this.getStagePadding(),zoomToSizeRatioFunction:i.zoomToSizeRatioFunction,itemSizesReference:i.itemSizesReference,fitLabels:l==="labels",nodeLabelBox:function(H,W){return e.labelRenderer.nodeLabelBox(H,W)}})),s==="once"&&(this.autoRescaleFrozen=!0));this.nodeExtent=u,this.normalizationFunction=An(this.customBBox||this.nodeExtent);var f=new vo,h=ke(f.getState(),o,this.getGraphDimensions(),this.getStagePadding());this.labelRenderer.labelGrid.resizeAndClear(o,i.labelGridCellSize),this.labelRenderer.edgeAnchorGrid.resizeAndClear(o,i.labelGridCellSize);var p=i.renderEdgeLabels&&i.edgeLabelAnchors==="allNodes",b=!1;jn(this.pickingState,"node");for(var v=r.nodes(),g=0,m=v.length;g<m;g++){var y=v[g],T=this.internals.nodeDataCache[y],x=this.nodeGraphCoords[y];T.x=x.x,T.y=x.y,this.normalizationFunction.applyTo(T),T.visibility!==this.prevNodeVisibilities[y]&&(b=!0),typeof T.label=="string"&&T.visibility!=="hidden"&&T.labelVisibility!=="hidden"&&this.labelRenderer.labelGrid.add(y,T.size,this.framedGraphToViewport(T,{matrix:h})),p&&T.visibility!=="hidden"&&this.labelRenderer.edgeAnchorGrid.add(y,T.size,this.framedGraphToViewport(T,{matrix:h}))}this.labelRenderer.labelGrid.organize(),this.labelRenderer.edgeAnchorGrid.organize(),this.nodeProgram.reallocate(v.length);var _=0;this.depthRanges.nodes={},this.nodeBaseDepth={};var R=this.internals.nodeDataCache,S=M(this.depthLayers),C;try{for(S.s();!(C=S.n()).done;){var D=C.value,k=this.itemBuckets.nodes.getSorted(D,function(z){return R[z].zIndex});if(k.length!==0){this.depthRanges.nodes[D]=[{offset:_,count:k.length}];var A=M(k),I;try{for(A.s();!(I=A.n()).done;){var w=I.value;this.nodeBaseDepth[w]=D,_o(this.pickingState,"node",w),this.addNodeToProgram(w,_++)}}catch(z){A.e(z)}finally{A.f()}}}}catch(z){S.e(z)}finally{S.f()}this.nodeProgram.invalidateBuffers();for(var F=0,G=v.length;F<G;F++)this.prevNodeVisibilities[v[F]]=this.internals.nodeDataCache[v[F]].visibility;this.labelRenderer.processWebGLLabels(v);var N=M(this.customLayerPrograms.values()),P;try{for(N.s();!(P=N.n()).done;){var L=P.value.program;L.cacheData&&L.cacheData()}}catch(z){N.e(z)}finally{N.f()}return b}},{key:"processEdges",value:function(){var e=this.internals.graph,r=e.edges();this.edgeProgram.reallocate(r.length);var i=0;jn(this.pickingState,"edge"),this.depthRanges.edges={},this.edgeBaseDepth={};var o=this.internals.edgeDataCache,s=M(this.depthLayers),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=this.itemBuckets.edges.getSorted(u,function(p){return o[p].zIndex});if(d.length!==0){this.depthRanges.edges[u]=[{offset:i,count:d.length}];var c=M(d),f;try{for(c.s();!(f=c.n()).done;){var h=f.value;this.edgeBaseDepth[h]=u,_o(this.pickingState,"edge",h),this.addEdgeToProgram(h,i++)}}catch(p){c.e(p)}finally{c.f()}}}}catch(p){s.e(p)}finally{s.f()}this.edgeProgram.invalidateBuffers()}},{key:"updateNodeDepthRanges",value:function(e,r,i){var o=this.nodeProgramIndex[e];o!==void 0&&(La(this.depthRanges.nodes,r,o),Pa(this.depthRanges.nodes,i,o))}},{key:"updateEdgeDepthRanges",value:function(e,r,i){var o=this.edgeProgramIndex[e];o!==void 0&&(La(this.depthRanges.edges,r,o),Pa(this.depthRanges.edges,i,o))}},{key:"handleSettingsUpdate",value:function(){var e=this,r=this.internals.settings;return this.camera.minRatio=r.minCameraRatio,this.camera.maxRatio=r.maxCameraRatio,this.camera.enabledZooming=r.enableCameraZooming,this.camera.enabledPanning=r.enableCameraPanning,this.camera.enabledRotation=r.enableCameraRotation,r.cameraPanBoundaries?this.camera.constrainState=function(i){return e.cleanCameraState(i,r.cameraPanBoundaries&&Z(r.cameraPanBoundaries)==="object"?r.cameraPanBoundaries:{})}:this.camera.constrainState=null,this.camera.setState(this.camera.getState()),this.mouseLayer.style.touchAction=r.gestureTarget==="graph"?"none":r.gestureTarget==="shared"?"pan-x pan-y":"auto",r.gestureTarget!=="shared"&&this.gestureHint&&(this.gestureHint.kill(),this.gestureHint=null),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor.setSettings(this.internals.settings),this}},{key:"cleanCameraState",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=r.tolerance,o=i===void 0?0:i,s=r.boundaries,l=O({},e),u=s||this.nodeExtent,d=Q(u.x,2),c=d[0],f=d[1],h=Q(u.y,2),p=h[0],b=h[1],v=[this.graphToViewport({x:c,y:p},{cameraState:e}),this.graphToViewport({x:f,y:p},{cameraState:e}),this.graphToViewport({x:c,y:b},{cameraState:e}),this.graphToViewport({x:f,y:b},{cameraState:e})],g=1/0,m=-1/0,y=1/0,T=-1/0;v.forEach(function(w){var F=w.x,G=w.y;g=Math.min(g,F),m=Math.max(m,F),y=Math.min(y,G),T=Math.max(T,G)});var x=m-g,_=T-y,R=this.getDimensions(),S=R.width,C=R.height,D=0,k=0;if(x>=S?m<S-o?D=m-(S-o):g>o&&(D=g-o):m>S+o?D=m-(S+o):g<-o&&(D=g+o),_>=C?T<C-o?k=T-(C-o):y>o&&(k=y-o):T>C+o?k=T-(C+o):y<-o&&(k=y+o),D||k){var A=this.viewportToFramedGraph({x:0,y:0},{cameraState:e}),I=this.viewportToFramedGraph({x:D,y:k},{cameraState:e});D=I.x-A.x,k=I.y-A.y,l.x+=D,l.y+=k}return l}},{key:"refreshMatrices",value:function(){var e=this.camera.getState(),r=this.getDimensions(),i=this.getGraphDimensions(),o=this.getStagePadding();this.matrix=ke(e,r,i,o),this.invMatrix=ke(e,r,i,o,!0),this.correctionRatio=ha(this.matrix,e,r),this.graphToViewportRatio=this.getGraphToViewportRatio()}},{key:"processData",value:function(){var e;this.emit("beforeProcess"),(e=this.internals.attachmentManager)===null||e===void 0||e.clear();var r=O({},this.pickingState.idsByKind),i=this.processNodes();(this.pendingProcess==="full"||i)&&this.processEdges(),Cd(this.pickingState,this.internals),Ld(r,this.pickingState.idsByKind)||this.internals.hoverResolver.invalidate(),this.pendingProcess="none",this.emit("afterProcess")}},{key:"render",value:function(){var e=this;if(this.contextLost)return this;this.emit("beforeRender");var r=function(){return e.internals.hoverResolver.frameRendered(),e.emit("afterRender"),e};if(this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null),this.resize(),(this.pendingProcess!=="none"||this.needToRefreshState)&&(this.labelRenderer.labelsDirty=!0),this.pendingProcess!=="none"&&this.processData(),this.needToRefreshState&&this.refreshState(),this.needToRefreshState=!1,this.stateManager.clearDirtyTracking(),this.pendingProcess!=="none"&&this.processData(),this.clear(),this.resetWebGLTexture(),!this.internals.graph.order)return r();var i=this.mouseCaptor,o=this.camera.isAnimating()||i.isMoving||i.draggedEvents||i.currentWheelDirection;if(this.refreshMatrices(),this.frameId++,this.internals.settings.renderEdgeLabels&&!this.internals.edgeLabelProgram){var s=this.createEdgeLabelPrograms(),l=s.labelProgram,u=s.labelBackgroundProgram;this.internals.edgeLabelProgram=l,this.internals.edgeLabelBackgroundProgram=u}var d=this.internals.settings.DEBUG_logRenderStats?this.getDebugPrograms():null;d&&d.forEach(function(X){return X.resetDebugStats()}),this.internals.settings.DEBUG_gpuTimerQueries&&this.beginGpuTimerQuery(),this.internals.nodeFrameTexture.ensureCapacity(this.internals.nodeDataTexture.getCapacity()),this.internals.edgeFrameTexture.ensureCapacity(this.internals.edgeDataTexture.getCapacity());var c=this.getRenderParams(),f=se.edge.writesPickingThisFrame(this.internals)?c:O(O({},c),{},{pickingFrameBuffer:null});this.labelRenderer.resetFrame();var h=this.webGLContext,p=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),b=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);if(h.bindFramebuffer(h.FRAMEBUFFER,this.pickingFrameBuffer),h.viewport(0,0,p,b),h.clear(h.COLOR_BUFFER_BIT|h.DEPTH_BUFFER_BIT),h.bindFramebuffer(h.FRAMEBUFFER,null),h.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),h.clear(h.COLOR_BUFFER_BIT|h.DEPTH_BUFFER_BIT),this.internals.nodeDataTexture.upload(),this.internals.edgeDataTexture.upload(),this.nodeProgram.uploadLayerTexture(),this.edgeProgram.uploadAttributeTexture(),this.emit("afterTexturesUpload"),this.internals.nodeDataTexture.bind(Lo),this.internals.edgeDataTexture.bind(Po),this.edgeFramePass.run(c,this.internals.edgeFrameTexture,this.internals.edgeDataTexture.getHighWaterMark(),this.edgeProgram.getAttributeTexture(),this.nodeProgram.getAttributeTexture()),this.internals.edgeFrameTexture.bind(wo),this.internals.settings.renderLabels){this.labelRenderer.computeDisplayedNodeLabels();var v=this.labelRenderer.buildFramePassPoints(),g=v.data,m=v.count;this.nodeFramePass.run(g,m,this.internals.nodeFrameTexture,c,this.nodeProgram.getAttributeTexture()),this.internals.nodeFrameTexture.bind(Co)}this.internals.settings.renderEdgeLabels&&this.labelRenderer.computeDisplayedEdgeLabels();var y=M(this.customLayerPrograms.values()),T;try{for(y.s();!(T=y.n()).done;){var x=T.value.program;x.preRender&&x.preRender(c)}}catch(X){y.e(X)}finally{y.f()}h.bindFramebuffer(h.FRAMEBUFFER,null),h.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),h.blendFunc(h.ONE,h.ONE_MINUS_SRC_ALPHA);var _=!this.internals.settings.hideLabelsOnMove||!o,R=M(this.depthLayers),S;try{for(R.s();!(S=R.n()).done;){var C=S.value,D=M(this.customLayerPrograms.values()),k;try{for(D.s();!(k=D.n()).done;){var A=k.value;A.depth===C&&A.program.render(c)}}catch(X){D.e(X)}finally{D.f()}var I=this.depthRanges.edges[C];if(I&&(!this.internals.settings.hideEdgesOnMove||!o)){var w=M(I),F;try{for(w.s();!(F=w.n()).done;){var G=F.value,N=G.offset,P=G.count;P>0&&this.edgeProgram.render(f,N,P)}}catch(X){w.e(X)}finally{w.f()}}this.internals.settings.renderEdgeLabels&&_&&(this.labelRenderer.renderEdgeLabelBackgrounds(se.edgeLabel.writesPickingThisFrame(this.internals)?c:O(O({},c),{},{pickingFrameBuffer:null}),C),this.labelRenderer.renderEdgeLabels(c,C)),this.labelRenderer.cacheAttachments(C),this.labelRenderer.renderBackdrops(O(O({},c),{},{pickingFrameBuffer:null}),C);var L=this.depthRanges.nodes[C];if(L){var z=M(L),H;try{for(z.s();!(H=z.n()).done;){var W=H.value,q=W.offset,j=W.count;j>0&&this.nodeProgram.render(c,q,j)}}catch(X){z.e(X)}finally{z.f()}}_&&(this.labelRenderer.renderAttachments(O(O({},c),{},{pickingFrameBuffer:null}),C),this.labelRenderer.renderLabelBackgrounds(se.nodeLabel.writesPickingThisFrame(this.internals)?c:O(O({},c),{},{pickingFrameBuffer:null}),C),this.internals.settings.renderLabels&&this.labelRenderer.renderWebGLLabels(c,C))}}catch(X){R.e(X)}finally{R.f()}return this.labelRenderer.labelsDirty=!1,this.internals.settings.DEBUG_displayPickingLayer&&(h.bindFramebuffer(h.READ_FRAMEBUFFER,this.pickingFrameBuffer),h.bindFramebuffer(h.DRAW_FRAMEBUFFER,null),h.blitFramebuffer(0,0,p,b,0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio,h.COLOR_BUFFER_BIT,h.NEAREST)),this.internals.settings.DEBUG_gpuTimerQueries&&this.endGpuTimerQuery(),this.pollGpuTimerQueries(),d&&this.logRenderStats(d),r()}},{key:"getDebugPrograms",value:function(){return[this.nodeProgram,this.edgeProgram,this.internals.labelProgram,this.internals.edgeLabelProgram,this.internals.edgeLabelBackgroundProgram,this.internals.backdropProgram,this.internals.labelBackgroundProgram,this.internals.attachmentProgram].filter(function(e){return e!==null})}},{key:"logRenderStats",value:function(e){var r={},i=M(e),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;r[s.constructor.name]=O({},s.debugStats)}}catch(l){i.e(l)}finally{i.f()}console.log("[sigma] DEBUG_logRenderStats: frame #".concat(this.frameId)),console.table(r)}},{key:"getGpuTimerExtension",value:function(){return this.gpuTimerExt===void 0&&(this.gpuTimerExt=this.webGLContext.getExtension("EXT_disjoint_timer_query_webgl2"),this.gpuTimerExt||console.warn("Sigma: DEBUG_gpuTimerQueries is enabled, but this browser/driver doesn't support EXT_disjoint_timer_query_webgl2.")),this.gpuTimerExt}},{key:"beginGpuTimerQuery",value:function(){var e=this.getGpuTimerExtension();if(e){var r=this.webGLContext,i=r.createQuery();i&&(r.beginQuery(e.TIME_ELAPSED_EXT,i),this.activeGpuTimerQuery=i)}}},{key:"endGpuTimerQuery",value:function(){!this.gpuTimerExt||!this.activeGpuTimerQuery||(this.webGLContext.endQuery(this.gpuTimerExt.TIME_ELAPSED_EXT),this.pendingGpuTimerQueries.push({query:this.activeGpuTimerQuery,frameId:this.frameId}),this.activeGpuTimerQuery=null)}},{key:"pollGpuTimerQueries",value:function(){if(this.pendingGpuTimerQueries.length!==0){var e=this.webGLContext,r=this.gpuTimerExt;if(!r){this.pendingGpuTimerQueries.forEach(function(c){var f=c.query;return e.deleteQuery(f)}),this.pendingGpuTimerQueries=[];return}var i=e.getParameter(r.GPU_DISJOINT_EXT),o=[],s=M(this.pendingGpuTimerQueries),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;if(!e.getQueryParameter(u.query,e.QUERY_RESULT_AVAILABLE)){o.push(u);continue}if(!i){var d=e.getQueryParameter(u.query,e.QUERY_RESULT);console.log("[sigma] DEBUG_gpuTimerQueries: frame #".concat(u.frameId," GPU time = ").concat((d/1e6).toFixed(2),"ms"))}e.deleteQuery(u.query)}}catch(c){s.e(c)}finally{s.f()}this.pendingGpuTimerQueries=o}}},{key:"postEvaluateNode",value:function(e,r,i){var o=e;o.x===void 0&&(o.x=r.x),o.y===void 0&&(o.y=r.y),e.highlighted=i.isHighlighted;for(var s=0,l=this.nodeVariableEntries.length;s<l;s++){var u,d,c=Q(this.nodeVariableEntries[s],2),f=c[0],h=c[1];o[f]=(u=(d=o[f])!==null&&d!==void 0?d:r[f])!==null&&u!==void 0?u:h.default}}},{key:"addNode",value:function(e){var r=this.internals.graph.getNodeAttributes(e),i=this.stateManager.getNodeState(e),o=this.internals.nodeDataCache[e]||{};if(Ra(this.stylesDeclaration.nodes,r,i,this.stateManager.graphState,this.internals.graph,o),this.postEvaluateNode(o,r,i),this.nodeReducer){var s=this.nodeReducer(e,o,r,i,this.stateManager.graphState,this.internals.graph);o=O(O({},o),s)}if(typeof o.x!="number"||typeof o.y!="number")throw new Error('Sigma: could not find a valid position (x, y) for node "'.concat(e,'". ')+"Provide coordinates via node attributes, styles, or a nodeReducer.");this.internals.nodeShapeMap?(!o.shape||!(o.shape in this.internals.nodeShapeMap))&&(o.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(o.shape=this.nodeShapeSlug),this.internals.nodeDataCache[e]=o,this.nodeGraphCoords[e]={x:o.x,y:o.y},qe(this.internals.nodesWithForcedLabels,e,Me(o)),qe(this.internals.nodesWithBackdrop,e,Ca(o)),this.itemBuckets.nodes.set(e,o.depth)}},{key:"updateNode",value:function(e){this.addNode(e);var r=this.internals.nodeDataCache[e];this.normalizationFunction.applyTo(r)}},{key:"removeNode",value:function(e){To(this.pickingState,"node",e),this.itemBuckets.nodes.remove(e),delete this.internals.nodeDataCache[e],delete this.nodeGraphCoords[e],delete this.nodeProgramIndex[e],this.internals.nodeDataTexture.free(e),this.internals.dragManager.removeNode(e),this.stateManager.removeNode(e),this.internals.nodesWithForcedLabels.delete(e),this.internals.nodesWithBackdrop.delete(e)}},{key:"postEvaluateEdge",value:function(e,r){for(var i=e,o=0,s=this.edgeVariableEntries.length;o<s;o++){var l,u,d=Q(this.edgeVariableEntries[o],2),c=d[0],f=d[1];i[c]=(l=(u=i[c])!==null&&u!==void 0?u:r[c])!==null&&l!==void 0?l:f.default}}},{key:"applyEdgeSpread",value:function(e,r,i){var o;if(!(i.parallelCount<=1)){var s=this.internals.graph.source(e),l=this.internals.graph.target(e),u=s===l,d=u?r.selfLoopPath||r.path:r.parallelPath||r.path,c=d?this.edgePathsByName.get(d):void 0;if(c!=null&&c.spread){var f=(o=r.parallelSpread)!==null&&o!==void 0?o:.25,h=c.spread.compute(i.parallelIndex,i.parallelCount,f);!u&&this.internals.graph.isDirected(e)&&s>l&&(h=-h),r[c.spread.variable]=h}}}},{key:"addEdge",value:function(e){var r=this.internals.graph.getEdgeAttributes(e),i=this.stateManager.getEdgeState(e),o={};if(Aa(this.stylesDeclaration.edges,r,i,this.stateManager.graphState,this.internals.graph,o),this.postEvaluateEdge(o,r),this.edgeReducer){var s=this.edgeReducer(e,o,r,i,this.stateManager.graphState,this.internals.graph);o=O(O({},o),s)}this.applyEdgeSpread(e,o,i),this.internals.edgeDataCache[e]=o,qe(this.internals.edgesWithForcedLabels,e,Me(o)),this.itemBuckets.edges.set(e,o.depth)}},{key:"updateEdge",value:function(e){this.addEdge(e)}},{key:"removeEdge",value:function(e){this.itemBuckets.edges.remove(e),delete this.internals.edgeDataCache[e],delete this.edgeProgramIndex[e],delete this.edgeTextureIndexCache[e],this.internals.edgeDataTexture.free(e),To(this.pickingState,"edge",e),this.stateManager.removeEdge(e),this.internals.edgesWithForcedLabels.delete(e)}},{key:"clearNodeIndices",value:function(){var e;this.labelRenderer.resetLabelGrid(),this.autoRescaleFrozen||(this.nodeExtent={x:[0,1],y:[0,1]}),this.internals.nodeDataCache={},this.nodeGraphCoords={},this.nodeProgramIndex={},(e=this.internals.nodeDataTexture)===null||e===void 0||e.clear(),this.internals.nodesWithForcedLabels.clear(),this.internals.nodesWithBackdrop.clear(),this.prevNodeVisibilities={},this.itemBuckets.nodes.clearAll(),this.depthRanges.nodes={},this.nodeBaseDepth={}}},{key:"clearEdgeIndices",value:function(){var e;this.internals.edgeDataCache={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},(e=this.internals.edgeDataTexture)===null||e===void 0||e.clear(),this.internals.edgesWithForcedLabels.clear(),this.itemBuckets.edges.clearAll(),this.depthRanges.edges={},this.edgeBaseDepth={},this.edgeGroups.clear()}},{key:"clearIndices",value:function(){this.clearEdgeIndices(),this.clearNodeIndices()}},{key:"clearNodeState",value:function(){this.labelRenderer.resetFrame(),this.internals.nodesWithBackdrop.clear(),this.internals.dragManager.clear(),this.autoRescaleFrozen=!1,this.stateManager.clearNodes(),jn(this.pickingState,"node")}},{key:"clearEdgeState",value:function(){this.labelRenderer.clearEdgeLabels(),this.stateManager.clearEdges(),jn(this.pickingState,"edge")}},{key:"clearState",value:function(){this.clearEdgeState(),this.clearNodeState(),this.stateManager.resetGraphState()}},{key:"addNodeToProgram",value:function(e,r){var i,o=this.internals.nodeDataCache[e];this.internals.nodeDataTexture.allocate(e),(i=this.internals.nodeDataTexture).updateNode.apply(i,[e,o.x,o.y,o.size,this.getNodeShapeId(o)].concat($(Rn(o)),[o.color]));var s=this.internals.nodeDataTexture.getIndex(e);this.nodeProgram.process(tt(this.pickingState,"node",e),r,o,s),this.nodeProgramIndex[e]=r}},{key:"addEdgeToProgram",value:function(e,r){var i,o,s=this.internals.edgeDataCache[e],l=this.internals.graph.source(e),u=this.internals.graph.target(e),d=this.internals.edgeDataTexture.allocate(e);this.edgeTextureIndexCache[e]=d;var c=l===u,f=!c&&((i=(o=this.stateManager.getEdgeState(e))===null||o===void 0?void 0:o.parallelCount)!==null&&i!==void 0?i:1)>1,h=this.edgeProgram.resolveEdgeIds(s,c,f),p=h.pathId,b=h.headId,v=h.tailId,g=h.headLengthRatio,m=h.tailLengthRatio;this.internals.edgeDataTexture.updateEdge(e,this.internals.nodeDataTexture.getIndex(l),this.internals.nodeDataTexture.getIndex(u),s.size,g,m,p,b,v),this.edgeProgram.process(tt(this.pickingState,"edge",e),r,this.internals.nodeDataCache[l],this.internals.nodeDataCache[u],s,d),this.edgeProgramIndex[e]=r}},{key:"getRenderParams",value:function(){return{frameId:this.frameId,matrix:this.matrix,invMatrix:this.invMatrix,width:this.width,height:this.height,pixelRatio:this.internals.pixelRatio,zoomRatio:this.camera.ratio,cameraAngle:this.camera.angle,sizeRatio:1/this.scaleSize(),correctionRatio:this.correctionRatio,downSizingRatio:this.internals.settings.pickingDownSizingRatio,minEdgeThickness:this.internals.settings.minEdgeThickness,antiAliasingFeather:this.internals.settings.antiAliasingFeather,nodePickingPadding:this.internals.settings.nodePickingPadding,edgePickingPadding:this.internals.settings.edgePickingPadding,labelPickingPadding:this.internals.settings.labelPickingPadding,nodeDataTextureUnit:Lo,nodeDataTextureWidth:this.internals.nodeDataTexture.getTextureWidth(),nodeFrameTextureUnit:Co,nodeFrameTextureWidth:this.internals.nodeFrameTexture.getTextureWidth(),edgeDataTextureUnit:Po,edgeDataTextureWidth:this.internals.edgeDataTexture.getTextureWidth(),edgeFrameTextureUnit:wo,edgeFrameTextureWidth:this.internals.edgeFrameTexture.getTextureWidth(),pickingFrameBuffer:this.pickingFrameBuffer,labelPixelSnapping:this.internals.settings.labelPixelSnapping?1:0}}},{key:"getStagePadding",value:function(){var e=this.internals.settings,r=e.stagePadding,i=e.autoRescale;return i&&r||0}},{key:"getLayerElement",value:function(e){if(e==="mouse")return this.mouseLayer;var r=this.extraElements[e];if(!r)throw new Error('Sigma: layer "'.concat(e,'" does not exist'));return r}},{key:"initWebGLContext",value:function(){var e=this,r=this.createWebGLContext("stage");this.stageCanvas=this.extraElements.stage,this.webGLContext=r,this.stageCanvas.addEventListener("webglcontextlost",function(i){e.webGLContext&&(i.preventDefault(),e.contextLost=!0,e.renderFrame&&(cancelAnimationFrame(e.renderFrame),e.renderFrame=null),e.gpuTimerExt=void 0,e.activeGpuTimerQuery=null,e.pendingGpuTimerQueries=[],e.emit("webglContextLost"))}),this.stageCanvas.addEventListener("webglcontextrestored",function(){requestAnimationFrame(function(){e.webGLContext&&!e.webGLContext.isContextLost()&&e.restoreWebGLContext()})}),this.initPickingFramebuffer()}},{key:"initPickingFramebuffer",value:function(){var e=this.webGLContext,r=e.createFramebuffer();if(!r)throw new Error("Sigma: cannot create picking frame buffer");e.bindFramebuffer(e.FRAMEBUFFER,r);var i=e.createTexture();if(!i)throw new Error("Sigma: cannot create picking texture");e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0);var o=e.createRenderbuffer();if(!o)throw new Error("Sigma: cannot create picking depth buffer");if(e.bindRenderbuffer(e.RENDERBUFFER,o),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,1,1),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,o),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("Sigma: picking framebuffer is not complete");e.bindFramebuffer(e.FRAMEBUFFER,null),this.pickingFrameBuffer=r,this.pickingTexture=i,this.pickingDepthBuffer=o}},{key:"initPrograms",value:function(e,r){var i=this,o=this.webGLContext,s=ro(o,this.pickingFrameBuffer,i,e?.nodes,r.antialiasNodes),l=s.nodeProgram,u=s.labelProgram,d=s.backdropProgram,c=s.labelBackgroundProgram,f=s.attachmentProgram,h=s.framePass,p=s.shapeSlug,b=s.shapeNameToIndex,v=s.shapeGlobalIds,g=s.variables;this.nodeProgram=l,this.nodeFramePass=h,this.nodeVariableEntries=Object.entries(g),p&&(this.nodeShapeSlug=p);var m=io(o,this.pickingFrameBuffer,i,e?.edges,r.antialiasEdges,e?.nodes),y=m.edgeProgram,T=m.createLabelPrograms,x=m.framePass,_=m.variables,R=m.paths;return this.createEdgeLabelPrograms=T,this.edgeProgram=y,this.edgeFramePass=x,this.edgeVariableEntries=Object.entries(_),this.edgePathsByName=new Map(R.map(function(S){return[S.name,S]})),{labelProgram:u,edgeLabelProgram:null,edgeLabelBackgroundProgram:null,backdropProgram:d,labelBackgroundProgram:c,attachmentProgram:f,nodeShapeMap:b??null,nodeGlobalShapeIds:v??null}}},{key:"restoreWebGLContext",value:function(){var e,r,i,o,s,l=this.internals;this.initPickingFramebuffer(),(e=l.nodeDataTexture)===null||e===void 0||e.restore(),(r=l.nodeFrameTexture)===null||r===void 0||r.restore(),(i=l.edgeDataTexture)===null||i===void 0||i.restore(),(o=l.edgeFrameTexture)===null||o===void 0||o.restore(),(s=l.attachmentManager)===null||s===void 0||s.restore(),l.hoverResolver.reset(),Object.assign(l,this.initPrograms(l.primitives,l.settings));var u=M(this.customLayerPrograms.values()),d;try{for(u.s();!(d=u.n()).done;){var c=d.value;c.program.kill(),c.program=c.factory(this.webGLContext)}}catch(f){u.e(f)}finally{u.f()}this.contextLost=!1,this.emit("webglContextRestored"),this.refresh()}},{key:"createLayer",value:function(e,r){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(this.extraElements[e])throw new Error('Sigma: a layer named "'.concat(e,'" already exists'));var o=dt(r,{position:"absolute"},{class:"sigma-".concat(e)});return i.style&&Object.assign(o.style,i.style),this.extraElements[e]=o,"beforeLayer"in i&&i.beforeLayer?this.getLayerElement(i.beforeLayer).before(o):"afterLayer"in i&&i.afterLayer?this.getLayerElement(i.afterLayer).after(o):this.container.appendChild(o),o}},{key:"createCanvas",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createLayer(e,"canvas",r)}},{key:"createWebGLContext",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=this.createCanvas(e,r);r.hidden&&i.remove();var o=i.getContext("webgl2",O({preserveDrawingBuffer:!1,antialias:!1,depth:!0},r));if(!o)throw new Error("Sigma: WebGL 2 is not supported by your browser. Please use a modern browser (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+).");return o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o}},{key:"killLayer",value:function(e){if(e==="stage"||e==="mouse")throw new Error('Sigma: cannot kill built-in layer "'.concat(e,'"'));var r=this.extraElements[e];if(!r)throw new Error("Sigma: cannot kill layer ".concat(e,", which does not exist"));return r.remove(),delete this.extraElements[e],this}},{key:"getWebGLContext",value:function(){if(!this.webGLContext)throw new Error("Sigma: WebGL context is not available");return this.webGLContext}},{key:"getNodeDataTexture",value:function(){if(!this.internals.nodeDataTexture)throw new Error("Sigma: node data texture is not available");return this.internals.nodeDataTexture}},{key:"getNormalizationFunction",value:function(){return this.normalizationFunction}},{key:"addCustomLayerProgram",value:function(e,r,i){var o;if(!this.depthLayers.includes(r))throw new Error('Sigma: cannot add custom layer program at depth "'.concat(r,'", ')+"it must be declared in primitives.depthLayers. Current layers: ".concat(this.depthLayers.join(", ")));(o=this.customLayerPrograms.get(e))===null||o===void 0||o.program.kill();var s=i(this.webGLContext);return this.customLayerPrograms.set(e,{depth:r,factory:i,program:s}),s.cacheData&&s.cacheData(),this.scheduleRender(),this}},{key:"removeCustomLayerProgram",value:function(e){var r=this.customLayerPrograms.get(e);return r&&(r.program.kill(),this.customLayerPrograms.delete(e),this.scheduleRender()),this}},{key:"getCamera",value:function(){return this.camera}},{key:"setCamera",value:function(e){return this.camera.cancelAnimation(),this.unbindCameraHandlers(),this.camera=e,this.bindCameraHandlers(),this.scheduleRender(),this}},{key:"getContainer",value:function(){return this.container}},{key:"getGraph",value:function(){return this.internals.graph}},{key:"setGraph",value:function(e){return e===this.internals.graph?this:(this.stateManager.pruneNodes(function(r){return e.hasNode(r)}),this.stateManager.pruneEdges(function(r){return e.hasEdge(r)}),this.unbindGraphHandlers(),this.checkEdgesEventsFrame!==null&&(cancelAnimationFrame(this.checkEdgesEventsFrame),this.checkEdgesEventsFrame=null),this.internals.graph=e,this.autoRescaleFrozen=!1,this.bindGraphHandlers(),this.refresh(),this)}},{key:"getMouseCaptor",value:function(){return this.mouseCaptor}},{key:"getTouchCaptor",value:function(){return this.touchCaptor}},{key:"getDimensions",value:function(){return{width:this.width,height:this.height}}},{key:"getGraphDimensions",value:function(){var e=this.customBBox||this.nodeExtent;return{width:e.x[1]-e.x[0]||1,height:e.y[1]-e.y[0]||1}}},{key:"getNodeDisplayData",value:function(e){var r=this.internals.nodeDataCache[e];return r?Object.assign({},r):void 0}},{key:"getEdgeDisplayData",value:function(e){var r=this.internals.edgeDataCache[e];return r?Object.assign({},r):void 0}},{key:"getNodeState",value:function(e){return this.stateManager.getNodeState(e)}},{key:"getEdgeState",value:function(e){return this.stateManager.getEdgeState(e)}},{key:"getGraphState",value:function(){return this.stateManager.getGraphState()}},{key:"setNodeState",value:function(e,r){return this.stateManager.setNodeState(e,r),this}},{key:"setEdgeState",value:function(e,r){return this.stateManager.setEdgeState(e,r),this}},{key:"setGraphState",value:function(e){return this.stateManager.setGraphState(e),this}},{key:"_setPanning",value:function(e){this.stateManager.setGraphState({isPanning:e})}},{key:"_setZooming",value:function(e){this.stateManager.setGraphState({isZooming:e})}},{key:"_hasNodeDrag",value:function(){var e=this.internals.dragManager;return!!(e.pendingNode||e.session)}},{key:"_showGestureHint",value:function(e){var r=this.internals.settings;r.gestureTarget==="shared"&&(this.gestureHint=this.gestureHint||new jd(this.container),this.gestureHint.show(e,r))}},{key:"setNodesState",value:function(e,r){return this.stateManager.setNodesState(e,r),this}},{key:"setEdgesState",value:function(e,r){return this.stateManager.setEdgesState(e,r),this}},{key:"updateContainerCursor",value:function(){var e=this.stateManager.hovered,r=this.resolvedStageStyle.cursor||"";this.container.style.cursor=e&&Pd(this.internals,e)||r}},{key:"refreshStageStyle",value:function(){this.resolvedStageStyle=Da(this.stylesDeclaration.stage,this.stateManager.graphState),this.resolvedStageStyle.background!==void 0&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.updateContainerCursor()}},{key:"getNodeDisplayedLabels",value:function(){return new Set(this.labelRenderer.displayedNodeLabels)}},{key:"getEdgeDisplayedLabels",value:function(){return new Set(this.labelRenderer.displayedEdgeLabels)}},{key:"getSettings",value:function(){return O({},this.internals.settings)}},{key:"getSetting",value:function(e){return this.internals.settings[e]}},{key:"getStyles",value:function(){return O({},this.stylesDeclaration)}},{key:"getPrimitives",value:function(){return O({},this.internals.primitives)}},{key:"setSetting",value:function(e,r){return this.internals.settings[e]=r,wn(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}},{key:"updateSetting",value:function(e,r){return this.setSetting(e,r(this.internals.settings[e])),this}},{key:"setSettings",value:function(e){return this.internals.settings=O(O({},this.internals.settings),e),wn(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}},{key:"resize",value:function(e){var r=this.width,i=this.height;if(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.internals.pixelRatio=Mt(),this.width===0)if(this.internals.settings.allowInvalidContainer)this.width=1;else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(this.height===0)if(this.internals.settings.allowInvalidContainer)this.height=1;else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(!e&&r===this.width&&i===this.height)return this;this.labelRenderer.labelsDirty=!0;for(var o=0,s=[this.mouseLayer].concat($(Object.values(this.extraElements)));o<s.length;o++){var l=s[o];l.style.width=this.width+"px",l.style.height=this.height+"px"}return this.webGLContext&&(this.stageCanvas.setAttribute("width",this.width*this.internals.pixelRatio+"px"),this.stageCanvas.setAttribute("height",this.height*this.internals.pixelRatio+"px"),this.webGLContext.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio)),this.emit("resize"),this}},{key:"clear",value:function(){return this.emit("beforeClear"),this.webGLContext.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER,null),this.webGLContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT),this.emit("afterClear"),this}},{key:"scheduleStateRefresh",value:function(){this.needToRefreshState=!0,this.scheduleRender()}},{key:"refreshState",value:function(){var e=this,r;this.stateManager.flushGraphStateFlags();var i=this.stateManager.graphStateChanged&&this.internals.nodeStyleAnalysis.dependency==="graph-state",o=this.stateManager.graphStateChanged&&this.edgeStyleAnalysis.dependency==="graph-state",s=!1;if(i)this.internals.graph.forEachNode(function(p){e.refreshNodeState(p)&&(s=!0)});else if(this.internals.nodeStyleAnalysis.dependency!=="static"){var l=M(this.stateManager.dirtyNodes),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;this.refreshNodeState(d)&&(s=!0)}}catch(p){l.e(p)}finally{l.f()}}if(o)this.internals.graph.forEachEdge(function(p){e.refreshEdgeState(p)&&(s=!0)});else if(this.edgeStyleAnalysis.dependency!=="static"){var c=M(this.stateManager.dirtyEdges),f;try{for(c.s();!(f=c.n()).done;){var h=f.value;this.refreshEdgeState(h)&&(s=!0)}}catch(p){c.e(p)}finally{c.f()}}this.stateManager.graphStateChanged&&(r=this.stylesDeclaration)!==null&&r!==void 0&&r.stage&&this.refreshStageStyle(),this.stateManager.clearDirtyTracking(),s&&(this.pendingProcess="full")}},{key:"refreshNodeState",value:function(e){var r=this.internals.nodeDataCache[e];if(!r||this.nodeReducer){var i,o,s,l,u=(i=this.internals.nodeDataCache[e])===null||i===void 0?void 0:i.depth,d=(o=this.internals.nodeDataCache[e])===null||o===void 0?void 0:o.zIndex,c=(s=this.internals.nodeDataCache[e])===null||s===void 0?void 0:s.labelAttachment;this.updateNode(e);var f=this.internals.nodeDataCache[e];this.internals.attachmentManager&&f.labelAttachment!==c&&this.internals.attachmentManager.invalidateNode(e);var h;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&f.shape&&f.shape in this.internals.nodeShapeMap?h=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[f.shape]]:h=ht(f.shape||"circle"),(l=this.internals.nodeDataTexture).updateNode.apply(l,[e,f.x,f.y,f.size,h].concat($(Rn(f)),[f.color])),u&&f.depth!==u&&this.updateNodeDepthRanges(e,u,f.depth);var p=this.nodeProgramIndex[e];return p!==void 0&&(this.addNodeToProgram(e,p),this.nodeProgram.invalidateBuffers()),d!==void 0&&f.zIndex!==d}var b=this.internals.graph.getNodeAttributes(e),v=this.stateManager.getNodeState(e),g=r.size,m=r.shape,y=r.depth,T=r.zIndex,x=r.labelAttachment,_=r.rotationAlignment,R=r.labelRotationAlignment,S=r.color;Ra(this.stylesDeclaration.nodes,b,v,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateNode(r,b,v);var C=this.nodeGraphCoords[e],D=r.x!==C.x||r.y!==C.y;if(D&&(C.x=r.x,C.y=r.y),this.normalizationFunction.applyTo(r),this.internals.nodeShapeMap?(!r.shape||!(r.shape in this.internals.nodeShapeMap))&&(r.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(r.shape=this.nodeShapeSlug),this.internals.attachmentManager&&r.labelAttachment!==x&&this.internals.attachmentManager.invalidateNode(e),qe(this.internals.nodesWithForcedLabels,e,Me(r)),qe(this.internals.nodesWithBackdrop,e,Ca(r)),D||r.size!==g||r.shape!==m||r.rotationAlignment!==_||r.labelRotationAlignment!==R||r.color!==S){var k,A;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&r.shape&&r.shape in this.internals.nodeShapeMap?A=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[r.shape]]:A=ht(r.shape||"circle"),(k=this.internals.nodeDataTexture).updateNode.apply(k,[e,r.x,r.y,r.size,A].concat($(Rn(r)),[r.color]))}this.itemBuckets.nodes.set(e,r.depth),r.depth!==y&&this.updateNodeDepthRanges(e,y,r.depth);var I=this.nodeProgramIndex[e];return I!==void 0&&(this.addNodeToProgram(e,I),this.nodeProgram.invalidateBuffers()),r.zIndex!==T}},{key:"refreshEdgeState",value:function(e){var r=this.internals.edgeDataCache[e];if(!r||this.edgeReducer){var i=r?.depth,o=r?.zIndex;this.updateEdge(e);var s=this.internals.edgeDataCache[e];i&&s.depth!==i&&this.updateEdgeDepthRanges(e,i,s.depth);var l=this.edgeProgramIndex[e];return l!==void 0&&(this.addEdgeToProgram(e,l),this.edgeProgram.invalidateBuffers()),o!==void 0&&s.zIndex!==o}var u=this.internals.graph.getEdgeAttributes(e),d=this.stateManager.getEdgeState(e),c=r.depth,f=r.zIndex,h=r.size,p=r.path,b=r.selfLoopPath,v=r.parallelPath,g=r.head,m=r.tail;Aa(this.stylesDeclaration.edges,u,d,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateEdge(r,u),this.applyEdgeSpread(e,r,d),qe(this.internals.edgesWithForcedLabels,e,Me(r)),this.itemBuckets.edges.set(e,r.depth),r.depth!==c&&this.updateEdgeDepthRanges(e,c,r.depth);var y=this.edgeProgramIndex[e];if(y!==void 0){var T=r.size!==h||r.path!==p||r.selfLoopPath!==b||r.parallelPath!==v||r.head!==g||r.tail!==m;if(T)this.addEdgeToProgram(e,y),this.edgeProgram.invalidateBuffers();else{var x=this.internals.graph.source(e),_=this.internals.graph.target(e),R=this.internals.nodeDataCache[x],S=this.internals.nodeDataCache[_],C=this.edgeTextureIndexCache[e];this.edgeProgram.process(tt(this.pickingState,"edge",e),y,R,S,r,C),this.edgeProgram.invalidateBuffers()}}return r.zIndex!==f}},{key:"refresh",value:function(e){var r=this,i=e?.skipIndexation!==void 0?e?.skipIndexation:!1,o=e?.schedule!==void 0?e.schedule:!1,s=!e||!e.partialGraph;if(s)this.clearEdgeIndices(),this.clearNodeIndices(),this.internals.graph.forEachNode(function(R){return r.addNode(R)}),this.edgeGroups.rebuild(),this.internals.graph.forEachEdge(function(R){return r.addEdge(R)}),this.pendingProcess="full";else{for(var l,u,d=((l=e.partialGraph)===null||l===void 0?void 0:l.nodes)||[],c=0,f=d?.length||0;c<f;c++){var h,p,b=""+d[c],v=(h=this.internals.nodeDataCache[b])===null||h===void 0?void 0:h.labelAttachment;if(this.updateNode(b),this.internals.attachmentManager&&((p=this.internals.nodeDataCache[b])!==null&&p!==void 0&&p.labelAttachment||v)&&this.internals.attachmentManager.invalidateNode(b),i){var g=this.nodeProgramIndex[b];if(g===void 0)throw new Error('Sigma: node "'.concat(b,`" can't be repaint`));this.addNodeToProgram(b,g)}}i&&d.length>0&&(this.nodeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0);for(var m=(e==null||(u=e.partialGraph)===null||u===void 0?void 0:u.edges)||[],y=0,T=m.length;y<T;y++){var x=""+m[y];if(this.updateEdge(x),i){var _=this.edgeProgramIndex[x];if(_===void 0)throw new Error('Sigma: edge "'.concat(x,`" can't be repaint`));this.addEdgeToProgram(x,_)}}i&&m.length>0&&(this.edgeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0),!i&&this.pendingProcess!=="full"&&(this.pendingProcess=m.length>0?"full":"nodes")}return o?this.scheduleRender():this.render(),this}},{key:"scheduleRender",value:function(){var e=this;return this.renderFrame||(this.renderFrame=requestAnimationFrame(function(){e.render()})),this}},{key:"scheduleRefresh",value:function(e){return this.refresh(O(O({},e),{},{schedule:!0}))}},{key:"getViewportZoomedState",value:function(e,r){var i=this.camera.getState(),o=i.ratio,s=i.angle,l=i.x,u=i.y,d=this.internals.settings,c=d.minCameraRatio,f=d.maxCameraRatio;typeof f=="number"&&(r=Math.min(r,f)),typeof c=="number"&&(r=Math.max(r,c));var h=r/o,p={x:this.width/2,y:this.height/2},b=this.viewportToFramedGraph(e),v=this.viewportToFramedGraph(p);return{angle:s,x:(b.x-v.x)*(1-h)+l,y:(b.y-v.y)*(1-h)+u,ratio:r}}},{key:"viewRectangle",value:function(){var e=this.viewportToFramedGraph({x:0,y:0}),r=this.viewportToFramedGraph({x:this.width,y:0}),i=this.viewportToFramedGraph({x:0,y:this.height});return{x1:e.x,y1:e.y,x2:r.x,y2:r.y,height:r.y-i.y}}},{key:"framedGraphToViewport",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=!!r.cameraState||!!r.viewportDimensions||!!r.graphDimensions||!!r.padding,o=r.matrix||(i?ke(r.cameraState||this.camera.getState(),r.viewportDimensions||this.getDimensions(),r.graphDimensions||this.getGraphDimensions(),r.padding||this.getStagePadding()):this.matrix),s=$e(o,e);return{x:(1+s.x)*this.width/2,y:(1-s.y)*this.height/2}}},{key:"viewportToFramedGraph",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=!!r.cameraState||!!r.viewportDimensions||!!r.graphDimensions||!!r.padding,o=r.matrix||(i?ke(r.cameraState||this.camera.getState(),r.viewportDimensions||this.getDimensions(),r.graphDimensions||this.getGraphDimensions(),r.padding||this.getStagePadding(),!0):this.invMatrix),s=$e(o,{x:e.x/this.width*2-1,y:1-e.y/this.height*2});return isNaN(s.x)&&(s.x=0),isNaN(s.y)&&(s.y=0),s}},{key:"viewportToGraph",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.normalizationFunction.inverse(this.viewportToFramedGraph(e,r))}},{key:"graphToViewport",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.framedGraphToViewport(this.normalizationFunction(e),r)}},{key:"graphToFramedGraph",value:function(e){return this.normalizationFunction(e)}},{key:"framedGraphToGraph",value:function(e){return this.normalizationFunction.inverse(e)}},{key:"getGraphToViewportRatio",value:function(){var e={x:0,y:0},r={x:1,y:1},i=Math.sqrt(Math.pow(e.x-r.x,2)+Math.pow(e.y-r.y,2)),o=this.graphToViewport(e),s=this.graphToViewport(r),l=Math.sqrt(Math.pow(o.x-s.x,2)+Math.pow(o.y-s.y,2));return l/i}},{key:"computeNodeExtent",value:function(){var e=this.nodeGraphCoords,r=Object.keys(e);if(!r.length)return{x:[0,1],y:[0,1]};for(var i=1/0,o=-1/0,s=1/0,l=-1/0,u=0,d=r.length;u<d;u++){var c=e[r[u]],f=c.x,h=c.y;f<i&&(i=f),f>o&&(o=f),h<s&&(s=h),h>l&&(l=h)}return{x:[i,o],y:[s,l]}}},{key:"getBBox",value:function(){return this.nodeExtent}},{key:"getCustomBBox",value:function(){return this.customBBox}},{key:"setCustomBBox",value:function(e){return this.customBBox=e,this.scheduleRender(),this}},{key:"kill",value:function(){var e,r,i,o,s;this.emit("kill"),this.removeAllListeners(),this.camera.cancelAnimation(),this.unbindCameraHandlers(),window.removeEventListener("resize",this.activeListeners.handleResize),this.mouseCaptor.kill(),this.touchCaptor.kill(),this.internals.hoverResolver.kill(),this.unbindGraphHandlers(),this.clearIndices(),this.clearState(),this.internals.nodeDataCache={},this.internals.edgeDataCache={},this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null);for(var l=this.container;l.firstChild;)l.removeChild(l.firstChild);this.nodeProgram.kill(),this.nodeFramePass.kill(),this.edgeProgram.kill(),this.edgeFramePass.kill(),this.internals.labelProgram.kill(),(e=this.internals.edgeLabelProgram)===null||e===void 0||e.kill(),(r=this.internals.edgeLabelBackgroundProgram)===null||r===void 0||r.kill(),this.internals.backdropProgram.kill(),this.internals.labelBackgroundProgram.kill(),(i=this.internals.attachmentProgram)===null||i===void 0||i.kill(),(o=this.internals.attachmentManager)===null||o===void 0||o.kill(),this.internals.attachmentProgram=null,this.internals.attachmentManager=null;var u=M(this.customLayerPrograms.values()),d;try{for(u.s();!(d=u.n()).done;){var c=d.value.program;c.kill()}}catch(p){u.e(p)}finally{u.f()}if(this.customLayerPrograms.clear(),this.sdfAtlas&&(this.sdfAtlas=null),this.internals.nodeDataTexture&&(this.internals.nodeDataTexture.kill(),this.internals.nodeDataTexture=null),this.internals.nodeFrameTexture&&(this.internals.nodeFrameTexture.kill(),this.internals.nodeFrameTexture=null),this.internals.edgeDataTexture&&(this.internals.edgeDataTexture.kill(),this.internals.edgeDataTexture=null),this.internals.edgeFrameTexture&&(this.internals.edgeFrameTexture.kill(),this.internals.edgeFrameTexture=null),this.webGLContext){var f;(f=this.webGLContext.getExtension("WEBGL_lose_context"))===null||f===void 0||f.loseContext(),this.webGLContext=null}(s=this.gestureHint)===null||s===void 0||s.kill(),this.gestureHint=null,this.mouseLayer.remove();for(var h in this.extraElements)this.extraElements[h].remove();this.extraElements={}}},{key:"scaleSize",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:this.camera.ratio;return e/this.internals.settings.zoomToSizeRatioFunction(r)*(this.getSetting("itemSizesReference")==="positions"?r*this.graphToViewportRatio:1)}},{key:"getStageCanvas",value:function(){return this.stageCanvas}},{key:"getMouseLayer",value:function(){return this.mouseLayer}}])})(Sn),Go=ec;var fg=Re(Xe());function zo(n,a){return typeof n=="number"?n:(Z(n)==="object"&&n!==null&&"attribute"in n,a)}function Mo(n){var a=n??{},t=a.cornerRadius,e=a.rotation,r=zo(t,0),i=zo(e,0),o=`
`.concat(On,`
float sdf_diamond(vec2 uv, float size, float cornerRadius, float rotation) {
  // Apply rotation if needed
  vec2 p = uv;
  if (rotation != 0.0) {
    p = rotate2D(rotation) * p;
  }

  // Diamond SDF - using rhombus formula from Inigo Quilez
  // https://iquilezles.org/articles/distfunctions2d/
  // For a diamond (square rotated 45\xB0), b = (size, size)
  vec2 b = vec2(size, -size);
  p = abs(p);
  float h = clamp((dot(b, p) + b.y * b.y) / dot(b, b), 0.0, 1.0);
  p -= b * vec2(h, h - 1.0);
  float d = length(p) * sign(p.x);

  // Apply corner radius if specified
  if (cornerRadius > 0.0) {
    d = d + cornerRadius;
  }

  return d;
}
`);return{name:"diamond",glsl:o,uniforms:[{name:"u_cornerRadius",type:"float",value:r},{name:"u_rotation",type:"float",value:i}],inradiusFactor:Math.SQRT1_2}}function Oo(n){var a=n??{},t=a.segments,e=t===void 0?16:t,r=`
// Compute control point from curvature
// Control point is placed perpendicular to the midpoint of source-target line
vec2 computeControlPoint(vec2 source, vec2 target, float curvature) {
  vec2 midpoint = 0.5 * (source + target);
  vec2 delta = target - source;
  // Perpendicular direction (rotated 90 degrees)
  vec2 perp = vec2(-delta.y, delta.x);
  float len = length(perp);
  if (len < 0.0001) return midpoint;
  perp = perp / len;
  // Offset by curvature * edge length
  return midpoint + perp * curvature * len;
}

// Position at parameter t \u2208 [0, 1]
vec2 path_curved_position(float t, vec2 source, vec2 target) {
  float curvature = v_curvature;
  vec2 control = computeControlPoint(source, target, curvature);
  float u = 1.0 - t;
  return u * u * source + 2.0 * u * t * control + t * t * target;
}

// Derivative of quadratic Bezier (for efficient arc length computation)
vec2 path_curved_derivative(float t, vec2 source, vec2 target) {
  float curvature = v_curvature;
  vec2 control = computeControlPoint(source, target, curvature);
  // B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
  return 2.0 * (1.0 - t) * (control - source) + 2.0 * t * (target - control);
}

// Approximate arc length using 5-point Gauss-Legendre quadrature
float path_curved_length(vec2 source, vec2 target) {
  // Gauss-Legendre 5-point weights and abscissae
  const float x1 = 0.9061798459, x2 = 0.5384693101;
  const float w1 = 0.2369268850, w2 = 0.4786286705, w3 = 0.5688888889;

  // Transform from [-1,1] to [0,1]: t = 0.5 * (x + 1)
  float t1a = 0.5 * (-x1 + 1.0), t1b = 0.5 * (x1 + 1.0);
  float t2a = 0.5 * (-x2 + 1.0), t2b = 0.5 * (x2 + 1.0);

  // Evaluate derivative magnitudes at sample points
  float d1a = length(path_curved_derivative(t1a, source, target));
  float d1b = length(path_curved_derivative(t1b, source, target));
  float d2a = length(path_curved_derivative(t2a, source, target));
  float d2b = length(path_curved_derivative(t2b, source, target));
  float d3 = length(path_curved_derivative(0.5, source, target));

  // Sum weighted samples (factor of 0.5 for interval transformation)
  return 0.5 * (w1 * (d1a + d1b) + w2 * (d2a + d2b) + w3 * d3);
}
`;return{name:"curved",segments:e,glsl:r,uniforms:[],attributes:[{name:"curvature",size:1,type:WebGL2RenderingContext.FLOAT}],variables:{curvature:{type:"number",default:0}},spread:{variable:"curvature",compute:function(o,s,l){return(o-(s-1)/2)*l}}}}function Bo(n){var a=n??{},t=a.lengthRatio,e=t===void 0?5:t,r=a.widthRatio,i=r===void 0?4:r,o=a.margin,s=o===void 0?0:o,l=`
// Arrow SDF: triangle with base at x=0, tip at x=lengthRatio
// uv.x: 0 (base) to lengthRatio (tip), uv.y: [-halfW, +halfW]
// Returns signed distance (negative inside, positive outside)
float extremity_arrow(vec2 uv, float lengthRatio, float widthRatio) {
  float x = uv.x;
  float y = abs(uv.y);
  float halfW = widthRatio * 0.5;

  // Past the tip: euclidean distance to tip point
  if (x > lengthRatio) {
    return length(vec2(x - lengthRatio, y));
  }

  // Back edge: signed distance to x=0 line
  float backDist = -x;

  // Side edge: signed distance to sloped triangle edge
  float clampedX = max(0.0, x);
  float maxY = halfW * (1.0 - clampedX / lengthRatio);
  float sideDist = y - maxY;

  // Convex shape SDF = max of half-plane distances
  return max(backDist, sideDist);
}
`;return{name:"arrow",glsl:l,length:e,widthFactor:i,margin:s,uniforms:[],attributes:[]}}var mg=Re(zt());var xg=Re(Xe());function Uo(n,a){return{type:"number",default:n,variable:a?.variable}}function Wo(n,a){return{type:"color",default:n,variable:a?.variable}}function Ho(n,a){return{type:"boolean",default:n,variable:a?.variable}}function $o(n,a){return{type:{enum:n},default:a,variable:!1}}function Vo(n,a){return{type:"array",items:n,minItems:a?.minItems}}function tr(n,a){(a==null||a>n.length)&&(a=n.length);for(var t=0,e=Array(a);t<a;t++)e[t]=n[t];return e}function tc(n){if(Array.isArray(n))return tr(n)}function nc(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function ac(n,a){if(n){if(typeof n=="string")return tr(n,a);var t={}.toString.call(n).slice(8,-1);return t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set"?Array.from(n):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?tr(n,a):void 0}}function rc(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function yt(n){return tc(n)||nc(n)||ac(n)||rc()}function Zn(n){"@babel/helpers - typeof";return Zn=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(a){return typeof a}:function(a){return a&&typeof Symbol=="function"&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},Zn(n)}function nr(n){return Zn(n)==="object"&&n!==null&&"attribute"in n}function jo(n){return typeof n=="string"}function Kn(n){return Zn(n)==="object"&&n!==null&&"attribute"in n}function ic(n){var a=n.filter(function(v){return v.fill}).length,t=te(a||1),e=n.flatMap(function(v,g){if(v.fill)return[];var m=v.size,y=v.mode,T=y==="pixels",x;return Kn(m)?x="v_borderSize_".concat(g+1):x=te(typeof m=="number"?m:0),T?["  float borderSize_".concat(g+1," = ").concat(x," * context.pixelToUV;")]:["  float borderSize_".concat(g+1," = context.shapeHalfSize * ").concat(x,";")]}).join(`
`),r=n.flatMap(function(v,g){return v.fill?[]:["borderSize_".concat(g+1)]}).join(" + "),i=r||"0.0",o=n.flatMap(function(v,g){return v.fill?["  float borderSize_".concat(g+1," = fillBorderSize;")]:[]}).join(`
`),s=n.map(function(v,g){return"  float boundary_".concat(g+1," = boundary_").concat(g," - borderSize_").concat(g+1,";")}).join(`
`),l=n.map(function(v,g){var m=v.color;return nr(m)?"  vec4 borderColor_".concat(g+1," = v_borderColor_").concat(g+1,";"):"  vec4 borderColor_".concat(g+1," = u_borderColor_").concat(g+1,";")}).join(`
`),u=n.map(function(v,g){return"  borderColor_".concat(g+1,`.a *= bias;
  if (borderSize_`).concat(g+1," <= 2.0 * context.aaWidth) { borderColor_").concat(g+1," = ").concat(g===0?"borderColor_1":"borderColor_".concat(g),"; }")}).join(`
`),d=n.map(function(v,g){return g===0?`if (context.sdf > boundary_1) {
    color = borderColor_1;
  } else `:"if (context.sdf > boundary_".concat(g,` - 2.0 * context.aaWidth) {
    color = mix(borderColor_`).concat(g+1,", borderColor_").concat(g,", (context.sdf - boundary_").concat(g,` + 2.0 * context.aaWidth) / (2.0 * context.aaWidth));
  } else if (context.sdf > boundary_`).concat(g+1,`) {
    color = borderColor_`).concat(g+1,`;
  } else `)}).join(""),c=[].concat(yt(n.flatMap(function(v,g){var m=v.color;return nr(m)?["vec4 v_borderColor_".concat(g+1)]:[]})),yt(n.flatMap(function(v,g){var m=v.size;return Kn(m)?["float v_borderSize_".concat(g+1)]:[]}))),f=n.flatMap(function(v,g){var m=v.color;return jo(m)?["vec4 u_borderColor_".concat(g+1)]:[]}),h=[].concat(yt(c),yt(f)).join(", "),p=Kn(n[0].size),b=`
vec4 layer_border(`.concat(h,`) {
  const float bias = 255.0 / 254.0;

  // Calculate border sizes (using context.shapeSize and context.pixelSize)
`).concat(e,`
`).concat(p?`
  // Early return if first border size is effectively zero (layer disabled)
  if (borderSize_1 <= context.aaWidth) {
    return vec4(0.0);
  }
`:"",`
  // Calculate fill border size (distribute remaining space)
  // Use inradiusFactor to get actual shape depth from the bounding size
  // For circle/square (inradiusFactor=1.0), this equals shapeSize
  // For triangle (inradiusFactor=0.5), this is half of shapeSize
  float shapeDepth = context.shapeSize * context.inradiusFactor;
  float fillBorderSize = (shapeDepth - (`).concat(i,")) / ").concat(t,`;
`).concat(o,`

  // Calculate cumulative boundaries (from outside to inside in SDF space)
  float boundary_0 = 0.0;  // Shape edge at context.sdf=0
`).concat(s,`

  // Set up colors
`).concat(l,`
`).concat(u,`

  // Select color based on SDF position with antialiasing
  // Note: outer edge AA (context.sdf > 0 transition) is handled by the composed generator's smoothstep
  vec4 color = vec4(0.0);
  `).concat(d,"{ color = borderColor_").concat(n.length,`; }

  return color;
}
`);return b}function Xo(n){var a,t=(a=n?.borders)!==null&&a!==void 0?a:[];if(t.length===0)return{name:"border",uniforms:[],attributes:[],glsl:"vec4 layer_border() { return vec4(0.0); }"};var e=WebGL2RenderingContext,r=e.UNSIGNED_BYTE,i=e.FLOAT,o=t.flatMap(function(l,u){var d=l.color;return jo(d)?[{name:"u_borderColor_".concat(u+1),type:"vec4",value:Pt(d)}]:[]}),s=[].concat(yt(t.flatMap(function(l,u){var d=l.color;return nr(d)?[{name:"borderColor_".concat(u+1),size:4,type:r,normalized:!0,source:d.attribute,defaultValue:d.default}]:[]})),yt(t.flatMap(function(l,u){var d=l.size;return Kn(d)?[{name:"borderSize_".concat(u+1),size:1,type:i,source:d.attribute,defaultValue:d.default}]:[]})));return{name:"border",uniforms:o,attributes:s,glsl:ic(t)}}var Rg={borders:Vo({size:Uo(.1,{variable:!0}),color:Wo("#000000",{variable:!0}),mode:$o(["relative","pixels"],"relative"),fill:Ho(!1)})};var $s=Re(Yo(),1);function rr(n,a){(a==null||a>n.length)&&(a=n.length);for(var t=0,e=Array(a);t<a;t++)e[t]=n[t];return e}function lc(n){if(Array.isArray(n))return rr(n)}function uc(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function ts(n,a){if(n){if(typeof n=="string")return rr(n,a);var t={}.toString.call(n).slice(8,-1);return t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set"?Array.from(n):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?rr(n,a):void 0}}function dc(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ko(n){return lc(n)||uc(n)||ts(n)||dc()}function ns(n,a){if(!(n instanceof a))throw new TypeError("Cannot call a class as a function")}function cc(n,a){if(typeof n!="object"||!n)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var e=t.call(n,a||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(a==="string"?String:Number)(n)}function as(n){var a=cc(n,"string");return typeof a=="symbol"?a:a+""}function Zo(n,a){for(var t=0;t<a.length;t++){var e=a[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,as(e.key),e)}}function rs(n,a,t){return a&&Zo(n.prototype,a),t&&Zo(n,t),Object.defineProperty(n,"prototype",{writable:!1}),n}function Qn(n){return Qn=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(a){return a.__proto__||Object.getPrototypeOf(a)},Qn(n)}function is(){try{var n=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(is=function(){return!!n})()}function hc(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function fc(n,a){if(a&&(typeof a=="object"||typeof a=="function"))return a;if(a!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return hc(n)}function os(n,a,t){return a=Qn(a),fc(n,is()?Reflect.construct(a,t||[],Qn(n).constructor):a.apply(n,t))}function ir(n,a){return ir=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},ir(n,a)}function ss(n,a){if(typeof a!="function"&&a!==null)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(a&&a.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),Object.defineProperty(n,"prototype",{writable:!1}),a&&ir(n,a)}function gc(){var n=`#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
  `;return n}var Jn=[-1,1,1,1,-1,-1,1,-1],pc=new Float32Array(Jn),vc=(function(n){function a(t,e,r){var i;ns(this,a),i=os(this,a,[t,e,r]),i.verticesCount=Jn.length/2;var o=i.normalProgram.buffer;return t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,pc,t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),i}return ss(a,n),rs(a,[{key:"getDefinition",value:function(){var e=this.getCustomLayerDefinition(),r=e.FRAGMENT_SHADER_SOURCE,i=e.CAMERA_UNIFORMS,o=e.DATA_UNIFORMS;return{UNIFORMS:[].concat(Ko(i),Ko(o)),FRAGMENT_SHADER_SOURCE:r,VERTEX_SHADER_SOURCE:gc(),VERTICES:4,METHOD:WebGL2RenderingContext.TRIANGLE_STRIP,ATTRIBUTES:[{name:"a_position",size:2,type:WebGL2RenderingContext.FLOAT}]}}},{key:"hasNothingToRender",value:function(){return!1}},{key:"setUniforms",value:function(e,r){this.setCameraUniforms(e,r)}},{key:"cacheData",value:function(){var e=this.normalProgram.gl;e.useProgram(this.normalProgram.program),this.cacheDataUniforms(this.normalProgram)}},{key:"render",value:function(e){this.bindProgram(this.normalProgram),this.renderProgram(e,this.normalProgram),this.unbindProgram(this.normalProgram)}},{key:"drawWebGL",value:function(e,r){var i=r.gl;i.drawArrays(e,0,Jn.length/2)}},{key:"bindProgram",value:function(e){var r=this,i=e.gl,o=e.buffer;i.bindBuffer(i.ARRAY_BUFFER,o);var s=0;this.ATTRIBUTES.forEach(function(l){return s+=r.bindAttribute(l,e,s)})}}])})(Ce),mc=0;function ls(n,a,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"webgl-layer-".concat(mc++);return a.addCustomLayerProgram(e,n,function(r){return new t(r,null,a)}),function(){return a.removeCustomLayerProgram(e)}}function bc(n,a,t){return(a=as(a))in n?Object.defineProperty(n,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[a]=t,n}var Lg=new Float32Array(Jn);function yc(n){if(Array.isArray(n))return n}function xc(n,a){var t=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(t!=null){var e,r,i,o,s=[],l=!0,u=!1;try{if(i=(t=t.call(n)).next,a===0){if(Object(t)!==t)return;l=!1}else for(;!(l=(e=i.call(t)).done)&&(s.push(e.value),s.length!==a);l=!0);}catch(d){u=!0,r=d}finally{try{if(!l&&t.return!=null&&(o=t.return(),Object(o)!==o))return}finally{if(u)throw r}}return s}}function _c(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Qo(n,a){return yc(n)||xc(n,a)||ts(n,a)||_c()}function Jo(n,a){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(n);a&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),t.push.apply(t,e)}return t}function es(n){for(var a=1;a<arguments.length;a++){var t=arguments[a]!=null?arguments[a]:{};a%2?Jo(Object(t),!0).forEach(function(e){bc(n,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):Jo(Object(t)).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))})}return n}function Tc(){return`#version 300 es
precision mediump float;

uniform vec4 u_color;

out vec4 fragColor;

void main() {
  // Premultiply alpha to match sigma's (ONE, ONE_MINUS_SRC_ALPHA) blend mode
  fragColor = vec4(u_color.rgb * u_color.a, u_color.a);
}
`}var Ec={color:"rgba(255, 255, 255, 0.5)"};function us(n){var a=es(es({},Ec),n||{}),t=a.color,e=ve(t),r=Qo(e,4),i=r[0],o=r[1],s=r[2],l=r[3],u=(function(d){function c(){return ns(this,c),os(this,c,arguments)}return ss(c,d),rs(c,[{key:"getCustomLayerDefinition",value:function(){return{FRAGMENT_SHADER_SOURCE:Tc(),DATA_UNIFORMS:[],CAMERA_UNIFORMS:["u_color"]}}},{key:"cacheDataUniforms",value:function(h){}},{key:"setCameraUniforms",value:function(h,p){var b=p.gl,v=p.uniformLocations;b.uniform4f(v.u_color,i/255,o/255,s/255,l/255)}}])})(vc);return u.setColor=function(d){var c=ve(d),f=Qo(c,4);i=f[0],o=f[1],s=f[2],l=f[3]},u}var fs=Re(Xe(),1);function Sc(){let n=arguments[0];for(let a=1,t=arguments.length;a<t;a++)if(arguments[a])for(let e in arguments[a])n[e]=arguments[a][e];return n}var ie=Sc;typeof Object.assign=="function"&&(ie=Object.assign);function xe(n,a,t,e){let r=n._nodes.get(a),i=null;return r&&(e==="mixed"?i=r.out&&r.out[t]||r.undirected&&r.undirected[t]:e==="directed"?i=r.out&&r.out[t]:i=r.undirected&&r.undirected[t]),i}function oe(n){return typeof n=="object"&&n!==null}function gs(n){let a;for(a in n)return!1;return!0}function ye(n,a,t){Object.defineProperty(n,a,{enumerable:!1,configurable:!1,writable:!0,value:t})}function Se(n,a,t){let e={enumerable:!0,configurable:!0};typeof t=="function"?e.get=t:(e.value=t,e.writable=!1),Object.defineProperty(n,a,e)}function ds(n){return!(!oe(n)||n.attributes&&!Array.isArray(n.attributes))}function Rc(){let n=Math.floor(Math.random()*256)&255;return()=>n++}function Ne(){let n=arguments,a=null,t=-1;return{[Symbol.iterator](){return this},next(){let e=null;do{if(a===null){if(t++,t>=n.length)return{done:!0};a=n[t][Symbol.iterator]()}if(e=a.next(),e.done){a=null;continue}break}while(!0);return e}}}function _t(){return{[Symbol.iterator](){return this},next(){return{done:!0}}}}var nn=class extends Error{constructor(a){super(),this.name="GraphError",this.message=a}},U=class n extends nn{constructor(a){super(a),this.name="InvalidArgumentsGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,n.prototype.constructor)}},B=class n extends nn{constructor(a){super(a),this.name="NotFoundGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,n.prototype.constructor)}},V=class n extends nn{constructor(a){super(a),this.name="UsageGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,n.prototype.constructor)}};function ps(n,a){this.key=n,this.attributes=a,this.clear()}ps.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={}};function vs(n,a){this.key=n,this.attributes=a,this.clear()}vs.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={}};function ms(n,a){this.key=n,this.attributes=a,this.clear()}ms.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={}};function Tt(n,a,t,e,r){this.key=a,this.attributes=r,this.undirected=n,this.source=t,this.target=e}Tt.prototype.attach=function(){let n="out",a="in";this.undirected&&(n=a="undirected");let t=this.source.key,e=this.target.key;this.source[n][e]=this,!(this.undirected&&t===e)&&(this.target[a][t]=this)};Tt.prototype.attachMulti=function(){let n="out",a="in",t=this.source.key,e=this.target.key;this.undirected&&(n=a="undirected");let r=this.source[n],i=r[e];if(typeof i>"u"){r[e]=this,this.undirected&&t===e||(this.target[a][t]=this);return}i.previous=this,this.next=i,r[e]=this,this.target[a][t]=this};Tt.prototype.detach=function(){let n=this.source.key,a=this.target.key,t="out",e="in";this.undirected&&(t=e="undirected"),delete this.source[t][a],delete this.target[e][n]};Tt.prototype.detachMulti=function(){let n=this.source.key,a=this.target.key,t="out",e="in";this.undirected&&(t=e="undirected"),this.previous===void 0?this.next===void 0?(delete this.source[t][a],delete this.target[e][n]):(this.next.previous=void 0,this.source[t][a]=this.next,this.target[e][n]=this.next):(this.previous.next=this.next,this.next!==void 0&&(this.next.previous=this.previous))};var bs=0,ys=1,Ac=2,xs=3;function Ge(n,a,t,e,r,i,o){let s,l,u,d;if(e=""+e,t===bs){if(s=n._nodes.get(e),!s)throw new B(`Graph.${a}: could not find the "${e}" node in the graph.`);u=r,d=i}else if(t===xs){if(r=""+r,l=n._edges.get(r),!l)throw new B(`Graph.${a}: could not find the "${r}" edge in the graph.`);let c=l.source.key,f=l.target.key;if(e===c)s=l.target;else if(e===f)s=l.source;else throw new B(`Graph.${a}: the "${e}" node is not attached to the "${r}" edge (${c}, ${f}).`);u=i,d=o}else{if(l=n._edges.get(e),!l)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`);t===ys?s=l.source:s=l.target,u=r,d=i}return[s,u,d]}function Dc(n,a,t){n.prototype[a]=function(e,r,i){let[o,s]=Ge(this,a,t,e,r,i);return o.attributes[s]}}function wc(n,a,t){n.prototype[a]=function(e,r){let[i]=Ge(this,a,t,e,r);return i.attributes}}function Cc(n,a,t){n.prototype[a]=function(e,r,i){let[o,s]=Ge(this,a,t,e,r,i);return o.attributes.hasOwnProperty(s)}}function Lc(n,a,t){n.prototype[a]=function(e,r,i,o){let[s,l,u]=Ge(this,a,t,e,r,i,o);return s.attributes[l]=u,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function Pc(n,a,t){n.prototype[a]=function(e,r,i,o){let[s,l,u]=Ge(this,a,t,e,r,i,o);if(typeof u!="function")throw new U(`Graph.${a}: updater should be a function.`);let d=s.attributes,c=u(d[l]);return d[l]=c,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function Fc(n,a,t){n.prototype[a]=function(e,r,i){let[o,s]=Ge(this,a,t,e,r,i);return delete o.attributes[s],this.emit("nodeAttributesUpdated",{key:o.key,type:"remove",attributes:o.attributes,name:s}),this}}function kc(n,a,t){n.prototype[a]=function(e,r,i){let[o,s]=Ge(this,a,t,e,r,i);if(!oe(s))throw new U(`Graph.${a}: provided attributes are not a plain object.`);return o.attributes=s,this.emit("nodeAttributesUpdated",{key:o.key,type:"replace",attributes:o.attributes}),this}}function Ic(n,a,t){n.prototype[a]=function(e,r,i){let[o,s]=Ge(this,a,t,e,r,i);if(!oe(s))throw new U(`Graph.${a}: provided attributes are not a plain object.`);return ie(o.attributes,s),this.emit("nodeAttributesUpdated",{key:o.key,type:"merge",attributes:o.attributes,data:s}),this}}function Nc(n,a,t){n.prototype[a]=function(e,r,i){let[o,s]=Ge(this,a,t,e,r,i);if(typeof s!="function")throw new U(`Graph.${a}: provided updater is not a function.`);return o.attributes=s(o.attributes),this.emit("nodeAttributesUpdated",{key:o.key,type:"update",attributes:o.attributes}),this}}var Gc=[{name:n=>`get${n}Attribute`,attacher:Dc},{name:n=>`get${n}Attributes`,attacher:wc},{name:n=>`has${n}Attribute`,attacher:Cc},{name:n=>`set${n}Attribute`,attacher:Lc},{name:n=>`update${n}Attribute`,attacher:Pc},{name:n=>`remove${n}Attribute`,attacher:Fc},{name:n=>`replace${n}Attributes`,attacher:kc},{name:n=>`merge${n}Attributes`,attacher:Ic},{name:n=>`update${n}Attributes`,attacher:Nc}];function zc(n){Gc.forEach(function({name:a,attacher:t}){t(n,a("Node"),bs),t(n,a("Source"),ys),t(n,a("Target"),Ac),t(n,a("Opposite"),xs)})}function Mc(n,a,t){n.prototype[a]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=xe(this,o,s,t),!i)throw new B(`Graph.${a}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}return i.attributes[r]}}function Oc(n,a,t){n.prototype[a]=function(e){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>1){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let i=""+e,o=""+arguments[1];if(r=xe(this,i,o,t),!r)throw new B(`Graph.${a}: could not find an edge for the given path ("${i}" - "${o}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,r=this._edges.get(e),!r)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}return r.attributes}}function Bc(n,a,t){n.prototype[a]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=xe(this,o,s,t),!i)throw new B(`Graph.${a}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}return i.attributes.hasOwnProperty(r)}}function Uc(n,a,t){n.prototype[a]=function(e,r,i){let o;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let s=""+e,l=""+r;if(r=arguments[2],i=arguments[3],o=xe(this,s,l,t),!o)throw new B(`Graph.${a}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,o=this._edges.get(e),!o)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}function Wc(n,a,t){n.prototype[a]=function(e,r,i){let o;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let s=""+e,l=""+r;if(r=arguments[2],i=arguments[3],o=xe(this,s,l,t),!o)throw new B(`Graph.${a}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,o=this._edges.get(e),!o)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}if(typeof i!="function")throw new U(`Graph.${a}: updater should be a function.`);return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}function Hc(n,a,t){n.prototype[a]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=xe(this,o,s,t),!i)throw new B(`Graph.${a}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}function $c(n,a,t){n.prototype[a]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=xe(this,o,s,t),!i)throw new B(`Graph.${a}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}if(!oe(r))throw new U(`Graph.${a}: provided attributes are not a plain object.`);return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}function Vc(n,a,t){n.prototype[a]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=xe(this,o,s,t),!i)throw new B(`Graph.${a}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}if(!oe(r))throw new U(`Graph.${a}: provided attributes are not a plain object.`);return ie(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}function jc(n,a,t){n.prototype[a]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new V(`Graph.${a}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new V(`Graph.${a}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=xe(this,o,s,t),!i)throw new B(`Graph.${a}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new V(`Graph.${a}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${a}: could not find the "${e}" edge in the graph.`)}if(typeof r!="function")throw new U(`Graph.${a}: provided updater is not a function.`);return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this}}var Xc=[{name:n=>`get${n}Attribute`,attacher:Mc},{name:n=>`get${n}Attributes`,attacher:Oc},{name:n=>`has${n}Attribute`,attacher:Bc},{name:n=>`set${n}Attribute`,attacher:Uc},{name:n=>`update${n}Attribute`,attacher:Wc},{name:n=>`remove${n}Attribute`,attacher:Hc},{name:n=>`replace${n}Attributes`,attacher:$c},{name:n=>`merge${n}Attributes`,attacher:Vc},{name:n=>`update${n}Attributes`,attacher:jc}];function qc(n){Xc.forEach(function({name:a,attacher:t}){t(n,a("Edge"),"mixed"),t(n,a("DirectedEdge"),"directed"),t(n,a("UndirectedEdge"),"undirected")})}var Yc=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function Kc(n,a,t,e){let r=!1;for(let i in a){if(i===e)continue;let o=a[i];if(r=t(o.key,o.attributes,o.source.key,o.target.key,o.source.attributes,o.target.attributes,o.undirected),n&&r)return o.key}}function Zc(n,a,t,e){let r,i,o,s=!1;for(let l in a)if(l!==e){r=a[l];do{if(i=r.source,o=r.target,s=t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected),n&&s)return r.key;r=r.next}while(r!==void 0)}}function or(n,a){let t=Object.keys(n),e=t.length,r,i=0;return{[Symbol.iterator](){return this},next(){do if(r)r=r.next;else{if(i>=e)return{done:!0};let o=t[i++];if(o===a){r=void 0;continue}r=n[o]}while(!r);return{done:!1,value:{edge:r.key,attributes:r.attributes,source:r.source.key,target:r.target.key,sourceAttributes:r.source.attributes,targetAttributes:r.target.attributes,undirected:r.undirected}}}}}function Qc(n,a,t,e){let r=a[t];if(!r)return;let i=r.source,o=r.target;if(e(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected)&&n)return r.key}function Jc(n,a,t,e){let r=a[t];if(!r)return;let i=!1;do{if(i=e(r.key,r.attributes,r.source.key,r.target.key,r.source.attributes,r.target.attributes,r.undirected),n&&i)return r.key;r=r.next}while(r!==void 0)}function sr(n,a){let t=n[a];if(t.next!==void 0)return{[Symbol.iterator](){return this},next(){if(!t)return{done:!0};let r={edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected};return t=t.next,{done:!1,value:r}}};let e=!1;return{[Symbol.iterator](){return this},next(){return e===!0?{done:!0}:(e=!0,{done:!1,value:{edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected}})}}}function eh(n,a){if(n.size===0)return[];if(a==="mixed"||a===n.type)return Array.from(n._edges.keys());let t=a==="undirected"?n.undirectedSize:n.directedSize,e=new Array(t),r=a==="undirected",i=n._edges.values(),o=0,s,l;for(;s=i.next(),s.done!==!0;)l=s.value,l.undirected===r&&(e[o++]=l.key);return e}function _s(n,a,t,e){if(a.size===0)return;let r=t!=="mixed"&&t!==a.type,i=t==="undirected",o,s,l=!1,u=a._edges.values();for(;o=u.next(),o.done!==!0;){if(s=o.value,r&&s.undirected!==i)continue;let{key:d,attributes:c,source:f,target:h}=s;if(l=e(d,c,f.key,h.key,f.attributes,h.attributes,s.undirected),n&&l)return d}}function th(n,a){if(n.size===0)return _t();let t=a!=="mixed"&&a!==n.type,e=a==="undirected",r=n._edges.values();return{[Symbol.iterator](){return this},next(){let i,o;for(;;){if(i=r.next(),i.done)return i;if(o=i.value,!(t&&o.undirected!==e))break}return{value:{edge:o.key,attributes:o.attributes,source:o.source.key,target:o.target.key,sourceAttributes:o.source.attributes,targetAttributes:o.target.attributes,undirected:o.undirected},done:!1}}}}function lr(n,a,t,e,r,i){let o=a?Zc:Kc,s;if(t!=="undirected"&&(e!=="out"&&(s=o(n,r.in,i),n&&s)||e!=="in"&&(s=o(n,r.out,i,e?void 0:r.key),n&&s))||t!=="directed"&&(s=o(n,r.undirected,i),n&&s))return s}function nh(n,a,t,e){let r=[];return lr(!1,n,a,t,e,function(i){r.push(i)}),r}function ah(n,a,t){let e=_t();return n!=="undirected"&&(a!=="out"&&typeof t.in<"u"&&(e=Ne(e,or(t.in))),a!=="in"&&typeof t.out<"u"&&(e=Ne(e,or(t.out,a?void 0:t.key)))),n!=="directed"&&typeof t.undirected<"u"&&(e=Ne(e,or(t.undirected))),e}function ur(n,a,t,e,r,i,o){let s=t?Jc:Qc,l;if(a!=="undirected"&&(typeof r.in<"u"&&e!=="out"&&(l=s(n,r.in,i,o),n&&l)||typeof r.out<"u"&&e!=="in"&&(e||r.key!==i)&&(l=s(n,r.out,i,o),n&&l))||a!=="directed"&&typeof r.undirected<"u"&&(l=s(n,r.undirected,i,o),n&&l))return l}function rh(n,a,t,e,r){let i=[];return ur(!1,n,a,t,e,r,function(o){i.push(o)}),i}function ih(n,a,t,e){let r=_t();return n!=="undirected"&&(typeof t.in<"u"&&a!=="out"&&e in t.in&&(r=Ne(r,sr(t.in,e))),typeof t.out<"u"&&a!=="in"&&e in t.out&&(a||t.key!==e)&&(r=Ne(r,sr(t.out,e)))),n!=="directed"&&typeof t.undirected<"u"&&e in t.undirected&&(r=Ne(r,sr(t.undirected,e))),r}function oh(n,a){let{name:t,type:e,direction:r}=a;n.prototype[t]=function(i,o){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return[];if(!arguments.length)return eh(this,e);if(arguments.length===1){i=""+i;let s=this._nodes.get(i);if(typeof s>"u")throw new B(`Graph.${t}: could not find the "${i}" node in the graph.`);return nh(this.multi,e==="mixed"?this.type:e,r,s)}if(arguments.length===2){i=""+i,o=""+o;let s=this._nodes.get(i);if(!s)throw new B(`Graph.${t}:  could not find the "${i}" source node in the graph.`);if(!this._nodes.has(o))throw new B(`Graph.${t}:  could not find the "${o}" target node in the graph.`);return rh(e,this.multi,r,s,o)}throw new U(`Graph.${t}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function sh(n,a){let{name:t,type:e,direction:r}=a,i="forEach"+t[0].toUpperCase()+t.slice(1,-1);n.prototype[i]=function(u,d,c){if(!(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)){if(arguments.length===1)return c=u,_s(!1,this,e,c);if(arguments.length===2){u=""+u,c=d;let f=this._nodes.get(u);if(typeof f>"u")throw new B(`Graph.${i}: could not find the "${u}" node in the graph.`);return lr(!1,this.multi,e==="mixed"?this.type:e,r,f,c)}if(arguments.length===3){u=""+u,d=""+d;let f=this._nodes.get(u);if(!f)throw new B(`Graph.${i}:  could not find the "${u}" source node in the graph.`);if(!this._nodes.has(d))throw new B(`Graph.${i}:  could not find the "${d}" target node in the graph.`);return ur(!1,e,this.multi,r,f,d,c)}throw new U(`Graph.${i}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)}};let o="map"+t[0].toUpperCase()+t.slice(1);n.prototype[o]=function(){let u=Array.prototype.slice.call(arguments),d=u.pop(),c;if(u.length===0){let f=0;e!=="directed"&&(f+=this.undirectedSize),e!=="undirected"&&(f+=this.directedSize),c=new Array(f);let h=0;u.push((p,b,v,g,m,y,T)=>{c[h++]=d(p,b,v,g,m,y,T)})}else c=[],u.push((f,h,p,b,v,g,m)=>{c.push(d(f,h,p,b,v,g,m))});return this[i].apply(this,u),c};let s="filter"+t[0].toUpperCase()+t.slice(1);n.prototype[s]=function(){let u=Array.prototype.slice.call(arguments),d=u.pop(),c=[];return u.push((f,h,p,b,v,g,m)=>{d(f,h,p,b,v,g,m)&&c.push(f)}),this[i].apply(this,u),c};let l="reduce"+t[0].toUpperCase()+t.slice(1);n.prototype[l]=function(){let u=Array.prototype.slice.call(arguments);if(u.length<2||u.length>4)throw new U(`Graph.${l}: invalid number of arguments (expecting 2, 3 or 4 and got ${u.length}).`);if(typeof u[u.length-1]=="function"&&typeof u[u.length-2]!="function")throw new U(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let d,c;u.length===2?(d=u[0],c=u[1],u=[]):u.length===3?(d=u[1],c=u[2],u=[u[0]]):u.length===4&&(d=u[2],c=u[3],u=[u[0],u[1]]);let f=c;return u.push((h,p,b,v,g,m,y)=>{f=d(f,h,p,b,v,g,m,y)}),this[i].apply(this,u),f}}function lh(n,a){let{name:t,type:e,direction:r}=a,i="find"+t[0].toUpperCase()+t.slice(1,-1);n.prototype[i]=function(l,u,d){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return!1;if(arguments.length===1)return d=l,_s(!0,this,e,d);if(arguments.length===2){l=""+l,d=u;let c=this._nodes.get(l);if(typeof c>"u")throw new B(`Graph.${i}: could not find the "${l}" node in the graph.`);return lr(!0,this.multi,e==="mixed"?this.type:e,r,c,d)}if(arguments.length===3){l=""+l,u=""+u;let c=this._nodes.get(l);if(!c)throw new B(`Graph.${i}:  could not find the "${l}" source node in the graph.`);if(!this._nodes.has(u))throw new B(`Graph.${i}:  could not find the "${u}" target node in the graph.`);return ur(!0,e,this.multi,r,c,u,d)}throw new U(`Graph.${i}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)};let o="some"+t[0].toUpperCase()+t.slice(1,-1);n.prototype[o]=function(){let l=Array.prototype.slice.call(arguments),u=l.pop();return l.push((c,f,h,p,b,v,g)=>u(c,f,h,p,b,v,g)),!!this[i].apply(this,l)};let s="every"+t[0].toUpperCase()+t.slice(1,-1);n.prototype[s]=function(){let l=Array.prototype.slice.call(arguments),u=l.pop();return l.push((c,f,h,p,b,v,g)=>!u(c,f,h,p,b,v,g)),!this[i].apply(this,l)}}function uh(n,a){let{name:t,type:e,direction:r}=a,i=t.slice(0,-1)+"Entries";n.prototype[i]=function(o,s){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return _t();if(!arguments.length)return th(this,e);if(arguments.length===1){o=""+o;let l=this._nodes.get(o);if(!l)throw new B(`Graph.${i}: could not find the "${o}" node in the graph.`);return ah(e,r,l)}if(arguments.length===2){o=""+o,s=""+s;let l=this._nodes.get(o);if(!l)throw new B(`Graph.${i}:  could not find the "${o}" source node in the graph.`);if(!this._nodes.has(s))throw new B(`Graph.${i}:  could not find the "${s}" target node in the graph.`);return ih(e,r,l,s)}throw new U(`Graph.${i}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function dh(n){Yc.forEach(a=>{oh(n,a),sh(n,a),lh(n,a),uh(n,a)})}var ch=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function oa(){this.A=null,this.B=null}oa.prototype.wrap=function(n){this.A===null?this.A=n:this.B===null&&(this.B=n)};oa.prototype.has=function(n){return this.A!==null&&n in this.A||this.B!==null&&n in this.B};function en(n,a,t,e,r){for(let i in e){let o=e[i],s=o.source,l=o.target,u=s===t?l:s;if(a&&a.has(u.key))continue;let d=r(u.key,u.attributes);if(n&&d)return u.key}}function dr(n,a,t,e,r){if(a!=="mixed"){if(a==="undirected")return en(n,null,e,e.undirected,r);if(typeof t=="string")return en(n,null,e,e[t],r)}let i=new oa,o;if(a!=="undirected"){if(t!=="out"){if(o=en(n,null,e,e.in,r),n&&o)return o;i.wrap(e.in)}if(t!=="in"){if(o=en(n,i,e,e.out,r),n&&o)return o;i.wrap(e.out)}}if(a!=="directed"&&(o=en(n,i,e,e.undirected,r),n&&o))return o}function hh(n,a,t){if(n!=="mixed"){if(n==="undirected")return Object.keys(t.undirected);if(typeof a=="string")return Object.keys(t[a])}let e=[];return dr(!1,n,a,t,function(r){e.push(r)}),e}function tn(n,a,t){let e=Object.keys(t),r=e.length,i=0;return{[Symbol.iterator](){return this},next(){let o=null;do{if(i>=r)return n&&n.wrap(t),{done:!0};let s=t[e[i++]],l=s.source,u=s.target;if(o=l===a?u:l,n&&n.has(o.key)){o=null;continue}}while(o===null);return{done:!1,value:{neighbor:o.key,attributes:o.attributes}}}}}function fh(n,a,t){if(n!=="mixed"){if(n==="undirected")return tn(null,t,t.undirected);if(typeof a=="string")return tn(null,t,t[a])}let e=_t(),r=new oa;return n!=="undirected"&&(a!=="out"&&(e=Ne(e,tn(r,t,t.in))),a!=="in"&&(e=Ne(e,tn(r,t,t.out)))),n!=="directed"&&(e=Ne(e,tn(r,t,t.undirected))),e}function gh(n,a){let{name:t,type:e,direction:r}=a;n.prototype[t]=function(i){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return[];i=""+i;let o=this._nodes.get(i);if(typeof o>"u")throw new B(`Graph.${t}: could not find the "${i}" node in the graph.`);return hh(e==="mixed"?this.type:e,r,o)}}function ph(n,a){let{name:t,type:e,direction:r}=a,i="forEach"+t[0].toUpperCase()+t.slice(1,-1);n.prototype[i]=function(u,d){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return;u=""+u;let c=this._nodes.get(u);if(typeof c>"u")throw new B(`Graph.${i}: could not find the "${u}" node in the graph.`);dr(!1,e==="mixed"?this.type:e,r,c,d)};let o="map"+t[0].toUpperCase()+t.slice(1);n.prototype[o]=function(u,d){let c=[];return this[i](u,(f,h)=>{c.push(d(f,h))}),c};let s="filter"+t[0].toUpperCase()+t.slice(1);n.prototype[s]=function(u,d){let c=[];return this[i](u,(f,h)=>{d(f,h)&&c.push(f)}),c};let l="reduce"+t[0].toUpperCase()+t.slice(1);n.prototype[l]=function(u,d,c){if(arguments.length<3)throw new U(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let f=c;return this[i](u,(h,p)=>{f=d(f,h,p)}),f}}function vh(n,a){let{name:t,type:e,direction:r}=a,i=t[0].toUpperCase()+t.slice(1,-1),o="find"+i;n.prototype[o]=function(u,d){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return;u=""+u;let c=this._nodes.get(u);if(typeof c>"u")throw new B(`Graph.${o}: could not find the "${u}" node in the graph.`);return dr(!0,e==="mixed"?this.type:e,r,c,d)};let s="some"+i;n.prototype[s]=function(u,d){return!!this[o](u,d)};let l="every"+i;n.prototype[l]=function(u,d){return!this[o](u,(f,h)=>!d(f,h))}}function mh(n,a){let{name:t,type:e,direction:r}=a,i=t.slice(0,-1)+"Entries";n.prototype[i]=function(o){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return _t();o=""+o;let s=this._nodes.get(o);if(typeof s>"u")throw new B(`Graph.${i}: could not find the "${o}" node in the graph.`);return fh(e==="mixed"?this.type:e,r,s)}}function bh(n){ch.forEach(a=>{gh(n,a),ph(n,a),vh(n,a),mh(n,a)})}function ea(n,a,t,e,r){let i=e._nodes.values(),o=e.type,s,l,u,d,c,f,h;for(;s=i.next(),s.done!==!0;){let p=!1;if(l=s.value,o!=="undirected"){d=l.out;for(u in d){c=d[u];do{if(f=c.target,p=!0,h=r(l.key,f.key,l.attributes,f.attributes,c.key,c.attributes,c.undirected),n&&h)return c;c=c.next}while(c)}}if(o!=="directed"){d=l.undirected;for(u in d)if(!(a&&l.key>u)){c=d[u];do{if(f=c.target,f.key!==u&&(f=c.source),p=!0,h=r(l.key,f.key,l.attributes,f.attributes,c.key,c.attributes,c.undirected),n&&h)return c;c=c.next}while(c)}}if(t&&!p&&(h=r(l.key,null,l.attributes,null,null,null,null),n&&h))return null}}function yh(n,a){let t={key:n};return gs(a.attributes)||(t.attributes=ie({},a.attributes)),t}function xh(n,a,t){let e={key:a,source:t.source.key,target:t.target.key};return gs(t.attributes)||(e.attributes=ie({},t.attributes)),n==="mixed"&&t.undirected&&(e.undirected=!0),e}function _h(n){if(!oe(n))throw new U('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in n))throw new U("Graph.import: serialized node is missing its key.");if("attributes"in n&&(!oe(n.attributes)||n.attributes===null))throw new U("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function Th(n){if(!oe(n))throw new U('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in n))throw new U("Graph.import: serialized edge is missing its source.");if(!("target"in n))throw new U("Graph.import: serialized edge is missing its target.");if("attributes"in n&&(!oe(n.attributes)||n.attributes===null))throw new U("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in n&&typeof n.undirected!="boolean")throw new U("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}var Eh=Rc(),Sh=new Set(["directed","undirected","mixed"]),cs=new Set(["domain","_events","_eventsCount","_maxListeners"]),Rh=[{name:n=>`${n}Edge`,generateKey:!0},{name:n=>`${n}DirectedEdge`,generateKey:!0,type:"directed"},{name:n=>`${n}UndirectedEdge`,generateKey:!0,type:"undirected"},{name:n=>`${n}EdgeWithKey`},{name:n=>`${n}DirectedEdgeWithKey`,type:"directed"},{name:n=>`${n}UndirectedEdgeWithKey`,type:"undirected"}],Ah={allowSelfLoops:!0,multi:!1,type:"mixed"};function Dh(n,a,t){if(t&&!oe(t))throw new U(`Graph.addNode: invalid attributes. Expecting an object but got "${t}"`);if(a=""+a,t=t||{},n._nodes.has(a))throw new V(`Graph.addNode: the "${a}" node already exist in the graph.`);let e=new n.NodeDataClass(a,t);return n._nodes.set(a,e),n.emit("nodeAdded",{key:a,attributes:t}),e}function hs(n,a,t){let e=new n.NodeDataClass(a,t);return n._nodes.set(a,e),n.emit("nodeAdded",{key:a,attributes:t}),e}function Ts(n,a,t,e,r,i,o,s){if(!e&&n.type==="undirected")throw new V(`Graph.${a}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);if(e&&n.type==="directed")throw new V(`Graph.${a}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);if(s&&!oe(s))throw new U(`Graph.${a}: invalid attributes. Expecting an object but got "${s}"`);if(i=""+i,o=""+o,s=s||{},!n.allowSelfLoops&&i===o)throw new V(`Graph.${a}: source & target are the same ("${i}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let l=n._nodes.get(i),u=n._nodes.get(o);if(!l)throw new B(`Graph.${a}: source node "${i}" not found.`);if(!u)throw new B(`Graph.${a}: target node "${o}" not found.`);let d={key:null,undirected:e,source:i,target:o,attributes:s};if(t)r=n._edgeKeyGenerator();else if(r=""+r,n._edges.has(r))throw new V(`Graph.${a}: the "${r}" edge already exists in the graph.`);if(!n.multi&&(e?typeof l.undirected[o]<"u":typeof l.out[o]<"u"))throw new V(`Graph.${a}: an edge linking "${i}" to "${o}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);let c=new Tt(e,r,l,u,s);n._edges.set(r,c);let f=i===o;return e?(l.undirectedDegree++,u.undirectedDegree++,f&&(l.undirectedLoops++,n._undirectedSelfLoopCount++)):(l.outDegree++,u.inDegree++,f&&(l.directedLoops++,n._directedSelfLoopCount++)),n.multi?c.attachMulti():c.attach(),e?n._undirectedSize++:n._directedSize++,d.key=r,n.emit("edgeAdded",d),r}function wh(n,a,t,e,r,i,o,s,l){if(!e&&n.type==="undirected")throw new V(`Graph.${a}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`);if(e&&n.type==="directed")throw new V(`Graph.${a}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`);if(s){if(l){if(typeof s!="function")throw new U(`Graph.${a}: invalid updater function. Expecting a function but got "${s}"`)}else if(!oe(s))throw new U(`Graph.${a}: invalid attributes. Expecting an object but got "${s}"`)}i=""+i,o=""+o;let u;if(l&&(u=s,s=void 0),!n.allowSelfLoops&&i===o)throw new V(`Graph.${a}: source & target are the same ("${i}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let d=n._nodes.get(i),c=n._nodes.get(o),f,h;if(!t&&(f=n._edges.get(r),f)){if((f.source.key!==i||f.target.key!==o)&&(!e||f.source.key!==o||f.target.key!==i))throw new V(`Graph.${a}: inconsistency detected when attempting to merge the "${r}" edge with "${i}" source & "${o}" target vs. ("${f.source.key}", "${f.target.key}").`);h=f}if(!h&&!n.multi&&d&&(h=e?d.undirected[o]:d.out[o]),h){let m=[h.key,!1,!1,!1];if(l?!u:!s)return m;if(l){let y=h.attributes;h.attributes=u(y),n.emit("edgeAttributesUpdated",{type:"replace",key:h.key,attributes:h.attributes})}else ie(h.attributes,s),n.emit("edgeAttributesUpdated",{type:"merge",key:h.key,attributes:h.attributes,data:s});return m}s=s||{},l&&u&&(s=u(s));let p={key:null,undirected:e,source:i,target:o,attributes:s};if(t)r=n._edgeKeyGenerator();else if(r=""+r,n._edges.has(r))throw new V(`Graph.${a}: the "${r}" edge already exists in the graph.`);let b=!1,v=!1;d||(d=hs(n,i,{}),b=!0,i===o&&(c=d,v=!0)),c||(c=hs(n,o,{}),v=!0),f=new Tt(e,r,d,c,s),n._edges.set(r,f);let g=i===o;return e?(d.undirectedDegree++,c.undirectedDegree++,g&&(d.undirectedLoops++,n._undirectedSelfLoopCount++)):(d.outDegree++,c.inDegree++,g&&(d.directedLoops++,n._directedSelfLoopCount++)),n.multi?f.attachMulti():f.attach(),e?n._undirectedSize++:n._directedSize++,p.key=r,n.emit("edgeAdded",p),[r,!0,b,v]}function xt(n,a){n._edges.delete(a.key);let{source:t,target:e,attributes:r}=a,i=a.undirected,o=t===e;i?(t.undirectedDegree--,e.undirectedDegree--,o&&(t.undirectedLoops--,n._undirectedSelfLoopCount--)):(t.outDegree--,e.inDegree--,o&&(t.directedLoops--,n._directedSelfLoopCount--)),n.multi?a.detachMulti():a.detach(),i?n._undirectedSize--:n._directedSize--,n.emit("edgeDropped",{key:a.key,attributes:r,source:t.key,target:e.key,undirected:i})}var ee=class n extends fs.EventEmitter{constructor(a){if(super(),a=ie({},Ah,a),typeof a.multi!="boolean")throw new U(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${a.multi}".`);if(!Sh.has(a.type))throw new U(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${a.type}".`);if(typeof a.allowSelfLoops!="boolean")throw new U(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${a.allowSelfLoops}".`);let t=a.type==="mixed"?ps:a.type==="directed"?vs:ms;ye(this,"NodeDataClass",t);let e="geid_"+Eh()+"_",r=0,i=()=>{let o;do o=e+r++;while(this._edges.has(o));return o};ye(this,"_attributes",{}),ye(this,"_nodes",new Map),ye(this,"_edges",new Map),ye(this,"_directedSize",0),ye(this,"_undirectedSize",0),ye(this,"_directedSelfLoopCount",0),ye(this,"_undirectedSelfLoopCount",0),ye(this,"_edgeKeyGenerator",i),ye(this,"_options",a),cs.forEach(o=>ye(this,o,this[o])),Se(this,"order",()=>this._nodes.size),Se(this,"size",()=>this._edges.size),Se(this,"directedSize",()=>this._directedSize),Se(this,"undirectedSize",()=>this._undirectedSize),Se(this,"selfLoopCount",()=>this._directedSelfLoopCount+this._undirectedSelfLoopCount),Se(this,"directedSelfLoopCount",()=>this._directedSelfLoopCount),Se(this,"undirectedSelfLoopCount",()=>this._undirectedSelfLoopCount),Se(this,"multi",this._options.multi),Se(this,"type",this._options.type),Se(this,"allowSelfLoops",this._options.allowSelfLoops),Se(this,"implementation",()=>"graphology")}_resetInstanceCounters(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0}hasNode(a){return this._nodes.has(""+a)}hasDirectedEdge(a,t){if(this.type==="undirected")return!1;if(arguments.length===1){let e=""+a,r=this._edges.get(e);return!!r&&!r.undirected}else if(arguments.length===2){a=""+a,t=""+t;let e=this._nodes.get(a);return e?e.out.hasOwnProperty(t):!1}throw new U(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasUndirectedEdge(a,t){if(this.type==="directed")return!1;if(arguments.length===1){let e=""+a,r=this._edges.get(e);return!!r&&r.undirected}else if(arguments.length===2){a=""+a,t=""+t;let e=this._nodes.get(a);return e?e.undirected.hasOwnProperty(t):!1}throw new U(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasEdge(a,t){if(arguments.length===1){let e=""+a;return this._edges.has(e)}else if(arguments.length===2){a=""+a,t=""+t;let e=this._nodes.get(a);return e?typeof e.out<"u"&&e.out.hasOwnProperty(t)||typeof e.undirected<"u"&&e.undirected.hasOwnProperty(t):!1}throw new U(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}directedEdge(a,t){if(this.type==="undirected")return;if(a=""+a,t=""+t,this.multi)throw new V("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");let e=this._nodes.get(a);if(!e)throw new B(`Graph.directedEdge: could not find the "${a}" source node in the graph.`);if(!this._nodes.has(t))throw new B(`Graph.directedEdge: could not find the "${t}" target node in the graph.`);let r=e.out&&e.out[t]||void 0;if(r)return r.key}undirectedEdge(a,t){if(this.type==="directed")return;if(a=""+a,t=""+t,this.multi)throw new V("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");let e=this._nodes.get(a);if(!e)throw new B(`Graph.undirectedEdge: could not find the "${a}" source node in the graph.`);if(!this._nodes.has(t))throw new B(`Graph.undirectedEdge: could not find the "${t}" target node in the graph.`);let r=e.undirected&&e.undirected[t]||void 0;if(r)return r.key}edge(a,t){if(this.multi)throw new V("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.edge: could not find the "${a}" source node in the graph.`);if(!this._nodes.has(t))throw new B(`Graph.edge: could not find the "${t}" target node in the graph.`);let r=e.out&&e.out[t]||e.undirected&&e.undirected[t]||void 0;if(r)return r.key}areDirectedNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areDirectedNeighbors: could not find the "${a}" node in the graph.`);return this.type==="undirected"?!1:t in e.in||t in e.out}areOutNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areOutNeighbors: could not find the "${a}" node in the graph.`);return this.type==="undirected"?!1:t in e.out}areInNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areInNeighbors: could not find the "${a}" node in the graph.`);return this.type==="undirected"?!1:t in e.in}areUndirectedNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areUndirectedNeighbors: could not find the "${a}" node in the graph.`);return this.type==="directed"?!1:t in e.undirected}areNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areNeighbors: could not find the "${a}" node in the graph.`);return this.type!=="undirected"&&(t in e.in||t in e.out)||this.type!=="directed"&&t in e.undirected}areInboundNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areInboundNeighbors: could not find the "${a}" node in the graph.`);return this.type!=="undirected"&&t in e.in||this.type!=="directed"&&t in e.undirected}areOutboundNeighbors(a,t){a=""+a,t=""+t;let e=this._nodes.get(a);if(!e)throw new B(`Graph.areOutboundNeighbors: could not find the "${a}" node in the graph.`);return this.type!=="undirected"&&t in e.out||this.type!=="directed"&&t in e.undirected}inDegree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.inDegree: could not find the "${a}" node in the graph.`);return this.type==="undirected"?0:t.inDegree}outDegree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.outDegree: could not find the "${a}" node in the graph.`);return this.type==="undirected"?0:t.outDegree}directedDegree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.directedDegree: could not find the "${a}" node in the graph.`);return this.type==="undirected"?0:t.inDegree+t.outDegree}undirectedDegree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.undirectedDegree: could not find the "${a}" node in the graph.`);return this.type==="directed"?0:t.undirectedDegree}inboundDegree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.inboundDegree: could not find the "${a}" node in the graph.`);let e=0;return this.type!=="directed"&&(e+=t.undirectedDegree),this.type!=="undirected"&&(e+=t.inDegree),e}outboundDegree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.outboundDegree: could not find the "${a}" node in the graph.`);let e=0;return this.type!=="directed"&&(e+=t.undirectedDegree),this.type!=="undirected"&&(e+=t.outDegree),e}degree(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.degree: could not find the "${a}" node in the graph.`);let e=0;return this.type!=="directed"&&(e+=t.undirectedDegree),this.type!=="undirected"&&(e+=t.inDegree+t.outDegree),e}inDegreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.inDegreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);return this.type==="undirected"?0:t.inDegree-t.directedLoops}outDegreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.outDegreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);return this.type==="undirected"?0:t.outDegree-t.directedLoops}directedDegreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.directedDegreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);return this.type==="undirected"?0:t.inDegree+t.outDegree-t.directedLoops*2}undirectedDegreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.undirectedDegreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);return this.type==="directed"?0:t.undirectedDegree-t.undirectedLoops*2}inboundDegreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.inboundDegreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);let e=0,r=0;return this.type!=="directed"&&(e+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!=="undirected"&&(e+=t.inDegree,r+=t.directedLoops),e-r}outboundDegreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.outboundDegreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);let e=0,r=0;return this.type!=="directed"&&(e+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!=="undirected"&&(e+=t.outDegree,r+=t.directedLoops),e-r}degreeWithoutSelfLoops(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.degreeWithoutSelfLoops: could not find the "${a}" node in the graph.`);let e=0,r=0;return this.type!=="directed"&&(e+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!=="undirected"&&(e+=t.inDegree+t.outDegree,r+=t.directedLoops*2),e-r}source(a){a=""+a;let t=this._edges.get(a);if(!t)throw new B(`Graph.source: could not find the "${a}" edge in the graph.`);return t.source.key}target(a){a=""+a;let t=this._edges.get(a);if(!t)throw new B(`Graph.target: could not find the "${a}" edge in the graph.`);return t.target.key}extremities(a){a=""+a;let t=this._edges.get(a);if(!t)throw new B(`Graph.extremities: could not find the "${a}" edge in the graph.`);return[t.source.key,t.target.key]}opposite(a,t){a=""+a,t=""+t;let e=this._edges.get(t);if(!e)throw new B(`Graph.opposite: could not find the "${t}" edge in the graph.`);let r=e.source.key,i=e.target.key;if(a===r)return i;if(a===i)return r;throw new B(`Graph.opposite: the "${a}" node is not attached to the "${t}" edge (${r}, ${i}).`)}hasExtremity(a,t){a=""+a,t=""+t;let e=this._edges.get(a);if(!e)throw new B(`Graph.hasExtremity: could not find the "${a}" edge in the graph.`);return e.source.key===t||e.target.key===t}isUndirected(a){a=""+a;let t=this._edges.get(a);if(!t)throw new B(`Graph.isUndirected: could not find the "${a}" edge in the graph.`);return t.undirected}isDirected(a){a=""+a;let t=this._edges.get(a);if(!t)throw new B(`Graph.isDirected: could not find the "${a}" edge in the graph.`);return!t.undirected}isSelfLoop(a){a=""+a;let t=this._edges.get(a);if(!t)throw new B(`Graph.isSelfLoop: could not find the "${a}" edge in the graph.`);return t.source===t.target}addNode(a,t){return Dh(this,a,t).key}mergeNode(a,t){if(t&&!oe(t))throw new U(`Graph.mergeNode: invalid attributes. Expecting an object but got "${t}"`);a=""+a,t=t||{};let e=this._nodes.get(a);return e?(t&&(ie(e.attributes,t),this.emit("nodeAttributesUpdated",{type:"merge",key:a,attributes:e.attributes,data:t})),[a,!1]):(e=new this.NodeDataClass(a,t),this._nodes.set(a,e),this.emit("nodeAdded",{key:a,attributes:t}),[a,!0])}updateNode(a,t){if(t&&typeof t!="function")throw new U(`Graph.updateNode: invalid updater function. Expecting a function but got "${t}"`);a=""+a;let e=this._nodes.get(a);if(e){if(t){let i=e.attributes;e.attributes=t(i),this.emit("nodeAttributesUpdated",{type:"replace",key:a,attributes:e.attributes})}return[a,!1]}let r=t?t({}):{};return e=new this.NodeDataClass(a,r),this._nodes.set(a,e),this.emit("nodeAdded",{key:a,attributes:r}),[a,!0]}dropNode(a){a=""+a;let t=this._nodes.get(a);if(!t)throw new B(`Graph.dropNode: could not find the "${a}" node in the graph.`);let e;if(this.type!=="undirected"){for(let r in t.out){e=t.out[r];do xt(this,e),e=e.next;while(e)}for(let r in t.in){e=t.in[r];do xt(this,e),e=e.next;while(e)}}if(this.type!=="directed")for(let r in t.undirected){e=t.undirected[r];do xt(this,e),e=e.next;while(e)}this._nodes.delete(a),this.emit("nodeDropped",{key:a,attributes:t.attributes})}dropEdge(a){let t;if(arguments.length>1){let e=""+arguments[0],r=""+arguments[1];if(t=xe(this,e,r,this.type),!t)throw new B(`Graph.dropEdge: could not find the "${e}" -> "${r}" edge in the graph.`)}else if(a=""+a,t=this._edges.get(a),!t)throw new B(`Graph.dropEdge: could not find the "${a}" edge in the graph.`);return xt(this,t),this}dropDirectedEdge(a,t){if(arguments.length<2)throw new V("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new V("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");a=""+a,t=""+t;let e=xe(this,a,t,"directed");if(!e)throw new B(`Graph.dropDirectedEdge: could not find a "${a}" -> "${t}" edge in the graph.`);return xt(this,e),this}dropUndirectedEdge(a,t){if(arguments.length<2)throw new V("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new V("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");let e=xe(this,a,t,"undirected");if(!e)throw new B(`Graph.dropUndirectedEdge: could not find a "${a}" -> "${t}" edge in the graph.`);return xt(this,e),this}clear(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")}clearEdges(){let a=this._nodes.values(),t;for(;t=a.next(),t.done!==!0;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")}getAttribute(a){return this._attributes[a]}getAttributes(){return this._attributes}hasAttribute(a){return this._attributes.hasOwnProperty(a)}setAttribute(a,t){return this._attributes[a]=t,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:a}),this}updateAttribute(a,t){if(typeof t!="function")throw new U("Graph.updateAttribute: updater should be a function.");let e=this._attributes[a];return this._attributes[a]=t(e),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:a}),this}removeAttribute(a){return delete this._attributes[a],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:a}),this}replaceAttributes(a){if(!oe(a))throw new U("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=a,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this}mergeAttributes(a){if(!oe(a))throw new U("Graph.mergeAttributes: provided attributes are not a plain object.");return ie(this._attributes,a),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:a}),this}updateAttributes(a){if(typeof a!="function")throw new U("Graph.updateAttributes: provided updater is not a function.");return this._attributes=a(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this}updateEachNodeAttributes(a,t){if(typeof a!="function")throw new U("Graph.updateEachNodeAttributes: expecting an updater function.");if(t&&!ds(t))throw new U("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");let e=this._nodes.values(),r,i;for(;r=e.next(),r.done!==!0;)i=r.value,i.attributes=a(i.key,i.attributes);this.emit("eachNodeAttributesUpdated",{hints:t||null})}updateEachEdgeAttributes(a,t){if(typeof a!="function")throw new U("Graph.updateEachEdgeAttributes: expecting an updater function.");if(t&&!ds(t))throw new U("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");let e=this._edges.values(),r,i,o,s;for(;r=e.next(),r.done!==!0;)i=r.value,o=i.source,s=i.target,i.attributes=a(i.key,i.attributes,o.key,s.key,o.attributes,s.attributes,i.undirected);this.emit("eachEdgeAttributesUpdated",{hints:t||null})}forEachAdjacencyEntry(a){if(typeof a!="function")throw new U("Graph.forEachAdjacencyEntry: expecting a callback.");ea(!1,!1,!1,this,a)}forEachAdjacencyEntryWithOrphans(a){if(typeof a!="function")throw new U("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");ea(!1,!1,!0,this,a)}forEachAssymetricAdjacencyEntry(a){if(typeof a!="function")throw new U("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");ea(!1,!0,!1,this,a)}forEachAssymetricAdjacencyEntryWithOrphans(a){if(typeof a!="function")throw new U("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");ea(!1,!0,!0,this,a)}nodes(){return Array.from(this._nodes.keys())}forEachNode(a){if(typeof a!="function")throw new U("Graph.forEachNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)r=e.value,a(r.key,r.attributes)}findNode(a){if(typeof a!="function")throw new U("Graph.findNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)if(r=e.value,a(r.key,r.attributes))return r.key}mapNodes(a){if(typeof a!="function")throw new U("Graph.mapNode: expecting a callback.");let t=this._nodes.values(),e,r,i=new Array(this.order),o=0;for(;e=t.next(),e.done!==!0;)r=e.value,i[o++]=a(r.key,r.attributes);return i}someNode(a){if(typeof a!="function")throw new U("Graph.someNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)if(r=e.value,a(r.key,r.attributes))return!0;return!1}everyNode(a){if(typeof a!="function")throw new U("Graph.everyNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)if(r=e.value,!a(r.key,r.attributes))return!1;return!0}filterNodes(a){if(typeof a!="function")throw new U("Graph.filterNodes: expecting a callback.");let t=this._nodes.values(),e,r,i=[];for(;e=t.next(),e.done!==!0;)r=e.value,a(r.key,r.attributes)&&i.push(r.key);return i}reduceNodes(a,t){if(typeof a!="function")throw new U("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new U("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");let e=t,r=this._nodes.values(),i,o;for(;i=r.next(),i.done!==!0;)o=i.value,e=a(e,o.key,o.attributes);return e}nodeEntries(){let a=this._nodes.values();return{[Symbol.iterator](){return this},next(){let t=a.next();if(t.done)return t;let e=t.value;return{value:{node:e.key,attributes:e.attributes},done:!1}}}}export(){let a=new Array(this._nodes.size),t=0;this._nodes.forEach((r,i)=>{a[t++]=yh(i,r)});let e=new Array(this._edges.size);return t=0,this._edges.forEach((r,i)=>{e[t++]=xh(this.type,i,r)}),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:a,edges:e}}import(a,t=!1){if(a instanceof n)return a.forEachNode((l,u)=>{t?this.mergeNode(l,u):this.addNode(l,u)}),a.forEachEdge((l,u,d,c,f,h,p)=>{t?p?this.mergeUndirectedEdgeWithKey(l,d,c,u):this.mergeDirectedEdgeWithKey(l,d,c,u):p?this.addUndirectedEdgeWithKey(l,d,c,u):this.addDirectedEdgeWithKey(l,d,c,u)}),this;if(!oe(a))throw new U("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(a.attributes){if(!oe(a.attributes))throw new U("Graph.import: invalid attributes. Expecting a plain object.");t?this.mergeAttributes(a.attributes):this.replaceAttributes(a.attributes)}let e,r,i,o,s;if(a.nodes){if(i=a.nodes,!Array.isArray(i))throw new U("Graph.import: invalid nodes. Expecting an array.");for(e=0,r=i.length;e<r;e++){o=i[e],_h(o);let{key:l,attributes:u}=o;t?this.mergeNode(l,u):this.addNode(l,u)}}if(a.edges){let l=!1;if(this.type==="undirected"&&(l=!0),i=a.edges,!Array.isArray(i))throw new U("Graph.import: invalid edges. Expecting an array.");for(e=0,r=i.length;e<r;e++){s=i[e],Th(s);let{source:u,target:d,attributes:c,undirected:f=l}=s,h;"key"in s?(h=t?f?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:f?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey,h.call(this,s.key,u,d,c)):(h=t?f?this.mergeUndirectedEdge:this.mergeDirectedEdge:f?this.addUndirectedEdge:this.addDirectedEdge,h.call(this,u,d,c))}}return this}nullCopy(a){let t=new n(ie({},this._options,a));return t.replaceAttributes(ie({},this.getAttributes())),t}emptyCopy(a){let t=this.nullCopy(a);return this._nodes.forEach((e,r)=>{let i=ie({},e.attributes);e=new t.NodeDataClass(r,i),t._nodes.set(r,e)}),t}copy(a){if(a=a||{},typeof a.type=="string"&&a.type!==this.type&&a.type!=="mixed")throw new V(`Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${a.type}" because this would mean losing information about the current graph.`);if(typeof a.multi=="boolean"&&a.multi!==this.multi&&a.multi!==!0)throw new V("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if(typeof a.allowSelfLoops=="boolean"&&a.allowSelfLoops!==this.allowSelfLoops&&a.allowSelfLoops!==!0)throw new V("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");let t=this.emptyCopy(a),e=this._edges.values(),r,i;for(;r=e.next(),r.done!==!0;)i=r.value,Ts(t,"copy",!1,i.undirected,i.key,i.source.key,i.target.key,ie({},i.attributes));return t}toJSON(){return this.export()}toString(){return"[object Graph]"}inspect(){let a={};this._nodes.forEach((i,o)=>{a[o]=i.attributes});let t={},e={};this._edges.forEach((i,o)=>{let s=i.undirected?"--":"->",l="",u=i.source.key,d=i.target.key,c;i.undirected&&u>d&&(c=u,u=d,d=c);let f=`(${u})${s}(${d})`;o.startsWith("geid_")?this.multi&&(typeof e[f]>"u"?e[f]=0:e[f]++,l+=`${e[f]}. `):l+=`[${o}]: `,l+=f,t[l]=i.attributes});let r={};for(let i in this)this.hasOwnProperty(i)&&!cs.has(i)&&typeof this[i]!="function"&&typeof i!="symbol"&&(r[i]=this[i]);return r.attributes=this._attributes,r.nodes=a,r.edges=t,ye(r,"constructor",this.constructor),r}};typeof Symbol<"u"&&(ee.prototype[Symbol.for("nodejs.util.inspect.custom")]=ee.prototype.inspect);Rh.forEach(n=>{["add","merge","update"].forEach(a=>{let t=n.name(a),e=a==="add"?Ts:wh;n.generateKey?ee.prototype[t]=function(r,i,o){return e(this,t,!0,(n.type||this.type)==="undirected",null,r,i,o,a==="update")}:ee.prototype[t]=function(r,i,o,s){return e(this,t,!1,(n.type||this.type)==="undirected",r,i,o,s,a==="update")}})});zc(ee);qc(ee);dh(ee);bh(ee);var ta=class extends ee{constructor(a){let t=ie({type:"directed"},a);if("multi"in t&&t.multi!==!1)throw new U("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(t.type!=="directed")throw new U('DirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}},na=class extends ee{constructor(a){let t=ie({type:"undirected"},a);if("multi"in t&&t.multi!==!1)throw new U("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(t.type!=="undirected")throw new U('UndirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}},aa=class extends ee{constructor(a){let t=ie({multi:!0},a);if("multi"in t&&t.multi!==!0)throw new U("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");super(t)}},ra=class extends ee{constructor(a){let t=ie({type:"directed",multi:!0},a);if("multi"in t&&t.multi!==!0)throw new U("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(t.type!=="directed")throw new U('MultiDirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}},ia=class extends ee{constructor(a){let t=ie({type:"undirected",multi:!0},a);if("multi"in t&&t.multi!==!0)throw new U("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(t.type!=="undirected")throw new U('MultiUndirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}};function Et(n){n.from=function(a,t){let e=ie({},a.options,t),r=new n(e);return r.import(a),r}}Et(ee);Et(ta);Et(na);Et(aa);Et(ra);Et(ia);ee.Graph=ee;ee.DirectedGraph=ta;ee.UndirectedGraph=na;ee.MultiGraph=aa;ee.MultiDirectedGraph=ra;ee.MultiUndirectedGraph=ia;ee.InvalidArgumentsGraphError=U;ee.NotFoundGraphError=B;ee.UsageGraphError=V;async function Es(){function n(u){let d=[],c="",f=!1;for(let h=0;h<u.length;h++){let p=u[h];f?p==='"'&&u[h+1]==='"'?(c+='"',h++):p==='"'?f=!1:c+=p:p==='"'?f=!0:p===","?(d.push(c),c=""):c+=p}return d.push(c),d}let[a,t]=await Promise.all([fetch("./data/demo-nodes.csv"),fetch("./data/demo-edges.csv")]),[e,r]=await Promise.all([a.text(),t.text()]),i=e.trim().split(`
`).slice(1),o=r.trim().split(`
`).slice(1),s=new ee({multi:!0,type:"directed"}),l=[];for(let u of i){let d=n(u),c=String(l.length);l.push(c),s.addNode(c,{author:d[0],x:parseFloat(d[1]),y:parseFloat(d[2]),score:parseFloat(d[3]),modularityClass:parseInt(d[4],10),label:d[7]||d[0]})}for(let u of o){let[d,c,f]=u.split(",");s.hasNode(d)&&s.hasNode(c)&&s.addEdge(d,c,{type:f==="a"?"coauthored":"cites"})}return s}var Ch=typeof global=="object"&&global&&global.Object===Object&&global,Ss=Ch;var Lh=typeof self=="object"&&self&&self.Object===Object&&self,Ph=Ss||Lh||Function("return this")(),Rs=Ph;var Fh=Rs.Symbol,ze=Fh;var As=Object.prototype,kh=As.hasOwnProperty,Ih=As.toString,an=ze?ze.toStringTag:void 0;function Nh(n){var a=kh.call(n,an),t=n[an];try{n[an]=void 0;var e=!0}catch{}var r=Ih.call(n);return e&&(a?n[an]=t:delete n[an]),r}var Ds=Nh;var Gh=Object.prototype,zh=Gh.toString;function Mh(n){return zh.call(n)}var ws=Mh;var Oh="[object Null]",Bh="[object Undefined]",Cs=ze?ze.toStringTag:void 0;function Uh(n){return n==null?n===void 0?Bh:Oh:Cs&&Cs in Object(n)?Ds(n):ws(n)}var Ls=Uh;function Wh(n){return n!=null&&typeof n=="object"}var Ps=Wh;var Hh="[object Symbol]";function $h(n){return typeof n=="symbol"||Ps(n)&&Ls(n)==Hh}var Fs=$h;function Vh(n,a){for(var t=-1,e=n==null?0:n.length,r=Array(e);++t<e;)r[t]=a(n[t],t,n);return r}var ks=Vh;var jh=Array.isArray,Is=jh;var Xh=1/0,Ns=ze?ze.prototype:void 0,Gs=Ns?Ns.toString:void 0;function zs(n){if(typeof n=="string")return n;if(Is(n))return ks(n,zs)+"";if(Fs(n))return Gs?Gs.call(n):"";var a=n+"";return a=="0"&&1/n==-Xh?"-0":a}var Ms=zs;function qh(n){return n==null?"":Ms(n)}var Os=qh;function Yh(n){return function(a){return n?.[a]}}var Bs=Yh;var Kh={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Zh=Bs(Kh),Us=Zh;var Ws=/[&<>"']/g,Qh=RegExp(Ws.source);function Jh(n){return n=Os(n),n&&Qh.test(n)?n.replace(Ws,Us):n}var cr=Jh;var gr='"Public Sans", Lato, Arial, sans-serif',la=document.documentElement.dataset.theme==="dark",sa=la?"#1f2026":"#f0f0f0",hr=la?"#2a2b33":"#ffffff",Vs=la?"#e8e9ec":"#333333",ef=la?{0:"#8f88ff",1:"#ff5aa5",2:"#5470ff",3:"#e040d8",4:"#7d70ff",5:"#d65cff"}:{0:"#756cff",1:"#ef368b",2:"#011acc",3:"#b900af",4:"#201887",5:"#c904ff"},tf={cites:"#e3a95b",coauthored:"#e22653"},Hs=document.createElement("canvas").getContext("2d");function nf({attributes:n}){let t=n.author;return Hs.font=`11px ${gr}`,{type:"svg",svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(Hs.measureText(t).width)+8}" height="19">
        <text x="4" y="13" font-family='${gr}' font-size="11" fill="${Vs}">${cr(t)}</text>
      </svg>`}}var le=await Es(),[af,rf]=(0,$s.nodeExtent)(le,"score"),ue=new Go(le,document.getElementById("sigma-container"),{customNodeState:{status:"normal"},customEdgeState:{status:"normal"},customGraphState:{hasActiveSubgraph:!1},primitives:{depthLayers:["edges","nodes","overlay","activeEdges","activeNodes","focusedNodes"],nodes:{shapes:[Mo()],layers:[Ft(),Xo({borders:[{size:.1,color:hr,mode:"relative"},{fill:!0,color:{attribute:"color"}}]})],labelAttachments:{authorInfo:nf}},edges:{paths:[kt(),Oo(),It()],extremities:[Bo({lengthRatio:6,widthRatio:4})],layers:[Ae()]}},styles:{stage:{background:sa},nodes:[Tn.nodes,{color:{attribute:"modularityClass",dict:ef},labelFont:gr,labelColor:Vs,backdropColor:hr,backdropShadowColor:"transparent",backdropLabelPadding:10,labelBackgroundColor:`${hr}66`,size:{attribute:"score",min:50,max:200,minValue:af,maxValue:rf}},{matchState:"status",cases:{normal:{depth:"nodes"},active:{depth:"activeNodes"}}},{when:(n,{isHovered:a,isHighlighted:t})=>a||t,then:{depth:"focusedNodes",labelVisibility:"visible",labelAttachment:"authorInfo",backdropVisibility:"visible"}},{when:(n,{status:a},{hasActiveSubgraph:t})=>t&&a==="normal",then:{labelVisibility:"hidden"}}],edges:[Tn.edges,{depth:"edges",path:"straight",parallelPath:"curved",selfLoopPath:"loop",opacity:.2,size:25,color:{attribute:"type",dict:tf}},{matchData:"type",cases:{cites:{head:"arrow"}}},{matchState:"status",cases:{direct:{depth:"activeEdges",opacity:1,size:50},indirect:{depth:"activeEdges",opacity:.5,size:50}}}]},settings:{itemSizesReference:"positions",labelDensity:.5,labelRenderedSizeThreshold:6}}),js=us({color:`${sa}00`});ls("overlay",ue,js);var Xs=new Map;le.forEachNode((n,a)=>{Xs.set(a.label,n)});var on=null,St=null,fr=null,sn=document.getElementById("search-input"),pr=document.getElementById("suggestions");function mr(n){if(n){let a=new Set(le.neighbors(n));le.forEachNode(t=>{let e=t===n||a.has(t);ue.setNodeState(t,{status:e?"active":"normal"})}),le.forEachEdge(t=>{let[e,r]=le.extremities(t),i=e===n,o=r===n,s="normal";i||o?s="direct":a.has(e)&&a.has(r)&&(s="indirect"),ue.setEdgeState(t,{status:s})})}else le.forEachNode(a=>ue.setNodeState(a,{status:"normal"})),le.forEachEdge(a=>ue.setEdgeState(a,{status:"normal"}));js.setColor(n?`${sa}cc`:`${sa}00`),ue.setGraphState({hasActiveSubgraph:!!n})}function of(n){if(!n){pr.innerHTML="";return}let a=n.toLowerCase(),t=le.nodes().filter(e=>le.getNodeAttribute(e,"label").toLowerCase().includes(a)).slice(0,50);pr.innerHTML=t.map(e=>`<option value="${le.getNodeAttribute(e,"label")}"></option>`).join(`
`)}function vr(n){if(St=n,fr&&ue.setNodeState(fr,{isHighlighted:!1}),fr=n,n&&ue.setNodeState(n,{isHighlighted:!0}),mr(on||St),n){let a=ue.getNodeDisplayData(n);ue.getCamera().animate(a,{duration:500})}}var rn=null;sn.addEventListener("input",()=>{let n=sn.value||"",a=Xs.get(n);if(a){vr(a);return}St&&vr(null),rn&&clearTimeout(rn),rn=setTimeout(()=>of(n),200)});sn.addEventListener("blur",()=>{St&&vr(null),sn.value="",pr.innerHTML=""});ue.on("enterNode",({node:n})=>{on=n,mr(on)});ue.on("leaveNode",()=>{on=null,mr(St)});window.__motionAtlasOriginal={id:"sigma",upstreamCommit:"e7748c88c861f19cab00be80cb7f836c5fef61e8",renderer:ue,graph:le,getState:()=>({nodes:le.order,edges:le.size,selectedNode:St,hoveredNode:on,search:sn.value,camera:ue.getCamera().getState()})};window.addEventListener("pagehide",()=>{rn&&clearTimeout(rn),ue.kill()},{once:!0});document.getElementById("runtime-status")?.remove();
/*! For license information please see app.js.LEGAL.txt */
//# sourceMappingURL=app.js.map
