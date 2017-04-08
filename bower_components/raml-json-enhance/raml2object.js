"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,r){for(var a=0;a<r.length;a++){var t=r[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,a,t){return a&&e(r.prototype,a),t&&e(r,t),r}}();!function e(r,a,t){function n(o,c){if(!a[o]){if(!r[o]){var i="function"==typeof require&&require;if(!c&&i)return i(o,!0);if(s)return s(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var m=a[o]={exports:{}};r[o][0].call(m.exports,function(e){var a=r[o][1][e];return n(a?a:e)},m,m.exports,e,r,a,t)}return a[o].exports}for(var s="function"==typeof require&&require,o=0;o<t.length;o++)n(t[o]);return n}({1:[function(e,r,a){function t(e){return e===Object(e)}function n(e){return Array.isArray(e)?e:Object.keys(e).map(function(r){return t(e[r])&&(e[r].key=r),e[r]})}function s(e){return e.reduce(function(e,r){return Object.keys(r).forEach(function(a){e[a]=r[a]}),e},{})}function o(e){return t(e)?Object.keys(e).forEach(function(r){var a=e[r];t(e)&&["responses","body","queryParameters","headers","properties","baseUriParameters","annotations","uriParameters"].indexOf(r)!==-1&&(e[r]=n(a)),o(a)}):Array.isArray(e)&&e.forEach(function(e){o(e)}),e}function c(e){return["types","traits","resourceTypes","annotationTypes","securitySchemes"].forEach(function(r){e[r]&&(e[r]=s(e[r]))}),e}r.exports={arraysToObjects:c,recursiveObjectToArray:o}},{}],2:[function(e,r,a){var t=e("./");"undefined"==typeof window?self.raml2obj=t:window.raml2obj=t},{"./":4}],3:[function(e,r,a){function t(e){return e===Object(e)}function n(e,r){return t(e)?(e.type&&(Array.isArray(e.type)&&(e.type=e.type[0]),r&&r&&r[e.type]&&Object.assign(e,r[e.type])),e.items&&r&&r[e.items]&&(e.items=r[e.items]),e.examples&&e.examples.length&&(e.examples=e.examples.map(function(e){return e.value?e.value:e})),e.structuredExample&&("undefined"==typeof e.examples&&(e.examples=[]),e.examples.push(e.structuredExample.value),delete e.example,delete e.structuredExample),Object.keys(e).forEach(function(a){var t=e[a];n(t,r)})):Array.isArray(e)&&e.forEach(function(e){n(e,r)}),e}r.exports=n},{}],4:[function(e,r,a){var t=e("./consistency-helpers"),n=e("./arrays-objects-helpers"),s=n.arraysToObjects,o=n.recursiveObjectToArray,c=function(){function e(r){_classCallCheck(this,e),this.raml=r,this.debug=!1}return _createClass(e,[{key:"mark",value:function(e){this.debug&&performance&&performance.mark&&performance.mark(e)}},{key:"getMeasurement",value:function(){if(!this.debug)return[];try{performance.measure("raml2obj-enhace","raml2obj-enhace-start","raml2obj-enhace-end"),performance.measure("raml2obj-arrays-to-object","raml2obj-arrays-to-object-start","raml2obj-arrays-to-object-end"),performance.measure("raml2obj-expanding-root-types","raml2obj-expanding-root-types-start","raml2obj-expanding-root-types-end"),performance.measure("raml2obj-make-consistent-root-types","raml2obj-make-consistent-root-types-start","raml2obj-make-consistent-root-types-end"),performance.measure("raml2obj-make-consistent-raml","raml2obj-make-consistent-raml-start","raml2obj-make-consistent-raml-end"),performance.measure("raml2obj-recursive-object-to-array","raml2obj-recursive-object-to-array-start","raml2obj-recursive-object-to-array-end"),performance.measure("raml2obj-apply-raml-types","raml2obj-apply-raml-types-start","raml2obj-apply-raml-types-end")}catch(e){return[]}return performance.getEntriesByType("measure")}},{key:"enhance",value:function(){var e=this;return this.mark("raml2obj-enhace-start"),this.mark("raml2obj-arrays-to-object-start"),s(this.raml),this.mark("raml2obj-arrays-to-object-end"),this.mark("raml2obj-expanding-root-types-start"),this.expandRootTypes(this.raml.types).then(function(r){e.mark("raml2obj-expanding-root-types-end"),e.mark("raml2obj-make-consistent-root-types-start");var a=t(r);return e.mark("raml2obj-make-consistent-root-types-end"),delete e.raml.types,e.mark("raml2obj-make-consistent-raml-start"),t(e.raml,a),e.mark("raml2obj-make-consistent-raml-end"),e.mark("raml2obj-recursive-object-to-array-start"),o(e.raml),e.mark("raml2obj-recursive-object-to-array-end"),e.securitySchemes=e.raml.securitySchemes,e.mark("raml2obj-apply-raml-types-start"),e.applyRamlTypes(e.raml),e.mark("raml2obj-apply-raml-types-end"),a&&(e.raml.types=a),e.mark("raml2obj-enhace-end"),e.raml})}},{key:"applySecuritySchemes",value:function(e){e.queryParameters||(e.queryParameters=[]),e.headers||(e.headers=[]),e.securedBy||(e.securedBy=[]);var r=[];e.securedBy.forEach(function(a){a&&"string"!=typeof a&&a.describedBy&&(a.describedBy.queryParameters&&(e.queryParameters=e.queryParameters.concat(a.describedBy.queryParameters)),a.describedBy.headers&&(e.headers=e.headers.concat(a.describedBy.headers)),a.describedBy.responses&&(r=r.concat(a.describedBy.responses)))}),e.responses&&(r=r.concat(e.responses)),r.sort(function(e,r){var a=Number(e.code),t=Number(r.code);return a>t?1:a<t?-1:0}),e.responses=r}},{key:"isObject",value:function(e){return e===Object(e)}},{key:"addSecuritSchemes",value:function(e){var r=this,a=this.securitySchemes;if(a&&Object.keys(a).length&&e&&e.securedBy&&e.securedBy.length){var t=!1;e.securedBy.forEach(function(n,s){if("string"==typeof n)n in a&&(t=!0,e.securedBy[s]=Object.assign({},a[n]));else if(r.isObject(n)){var o=Object.keys(n),c=o[0];if(c in a){t=!0;var i=Object.assign({},a[c]),u=n[c];i.settings=Object.assign({},i.settings,u),e.securedBy[s]=i}}}),t&&this.applySecuritySchemes(e)}}},{key:"applyRamlTypes",value:function(e,r,a){var t=this;e.resources&&e.resources.forEach(function(n){n.parentUrl=r||"",n.allUriParameters=e.baseUriParameters||[],a&&(n.allUriParameters=n.allUriParameters.concat(a)),n.uriParameters&&(n.allUriParameters=n.allUriParameters.concat(n.uriParameters)),n.methods&&n.methods.forEach(function(e){e.allUriParameters=n.allUriParameters,e.absoluteUri=n.absoluteUri,t.addSecuritSchemes(e)}),t.addSecuritSchemes(n),t.applyRamlTypes(n,n.parentUrl+n.relativeUri,n.allUriParameters)})}},{key:"expandRootTypes",value:function(e){var r=this;if(!e)return Promise.resolve(e);var a=Object.keys(e).map(function(a){return r._expandType(e,a)});return Promise.all(a).then(function(r){return r.forEach(function(r){e[r[0]]=r[1]}),e})}},{key:"_expandType",value:function(e,r){return new Promise(function(a){datatype_expansion.js.expandedForm(e[r],e,function(t,n){n?datatype_expansion.js.canonicalForm(n,function(t,n){a(n?[r,n]:[r,e[r]])}):a([r,e[r]])})})}}]),e}();r.exports.parse=function(e){var r=new c(e);return r.enhance()}},{"./arrays-objects-helpers":1,"./consistency-helpers":3}]},{},[2]);