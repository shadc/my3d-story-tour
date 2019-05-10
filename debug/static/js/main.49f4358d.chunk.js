(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,r){e.exports=r(20)},18:function(e,t,r){},19:function(e,t,r){},20:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),o=r(9),i=r.n(o),s=r(2),c=r.n(s),l=r(5),u=r(1),p=r(4),m=(r(18),r(7)),d=function(e){var t=Object(a.useState)(),r=Object(u.a)(t,2),o=r[0],i=r[1],s=Object(a.useState)("basemapsSlideup"),c=Object(u.a)(s,2),l=c[0],d=c[1];Object(a.useEffect)(function(){return Object(p.c)(["esri/layers/WebTileLayer","esri/Basemap"]).then(function(e){var t=Object(u.a)(e,2),r=t[0],a=t[1],n=m.basemaps.map(function(e,t){var n=new r({subDomains:e.subDomains,urlTemplate:e.url});return new a({baseLayers:[n],id:e.id,title:e.id,type:"WebTiledLayer"})});i(n)}).catch(function(e){return console.log(e)}),function(){i(null)}},[]);var b=function(t){if(t.preventDefault(),"a"===t.currentTarget.tagName.toLowerCase()){var r=m.basemaps.map(function(e){return e.id}).indexOf(t.currentTarget.innerHTML);e.map.basemap=o[r]}d("basemapsSlideup"===l?"basemapsSlidedown":"basemapsSlideup")};return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"basemap-button-container"},n.a.createElement("div",{className:"esri-widget--button esri-widget esri-interactive",role:"button",title:"Change Basemap",onClick:b},n.a.createElement("span",{"aria-hidden":"true",role:"presentation",className:"esri-icon esri-icon-basemap"}),n.a.createElement("span",{className:"esri-icon-font-fallback-text"},"Change Basemap"))),n.a.createElement("div",{className:l},n.a.createElement("ul",{className:"basemapbuttons"},m.basemaps.map(function(e,t){return n.a.createElement("li",{key:t},n.a.createElement("a",{onClick:b,href:"#"},e.id))}))))},b={hidden:{display:"none"},visible:{display:"inline-block"}},g=function(e){return n.a.createElement("div",{className:"header"},n.a.createElement("div",{className:"tour-title"},n.a.createElement("div",{className:"tour-name"},"My 3D Story Tour - ",e.title?e.title:"Loading Story Tour...")),n.a.createElement("div",{className:"tour-caption"},e.caption),n.a.createElement("div",{onClick:function(t){t.preventDefault(),e.onClick()},style:e.title&&!e.caption?b.visible:b.hidden,className:"tour-start"},"Start tour..."))},h=r(3),v={getGraphics:function(){var e=Object(l.a)(c.a.mark(function e(t,r){var a;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return(a=t.createQuery()).where="OBJECTID = "+r,e.next=4,t.queryFeatures(a);case 4:return e.abrupt("return",e.sent.features);case 5:case"end":return e.stop()}},e)}));return function(t,r){return e.apply(this,arguments)}}(),getHeading:function(e,t){var r=Object(h.bearing)(Object(h.point)([e[0],e[1]]),Object(h.point)([t[0],t[1]]));return r<0?360+r:r},getPicRouteIndex:function(){var e=Object(l.a)(c.a.mark(function e(t,r,a){var n,o,i;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return(n=a.createQuery()).where="Route = '"+r+"'",e.next=4,a.queryFeatures(n);case 4:return o=e.sent,i=Object(h.lineString)(t),e.abrupt("return",o.features.map(function(e){var t=e.geometry,r=Object(h.point)([t.longitude,t.latitude]);return Object(h.nearestPointOnLine)(i,r,{units:"meters"}).properties.index}));case 7:case"end":return e.stop()}},e)}));return function(t,r,a){return e.apply(this,arguments)}}(),getRouteCoords:function(e,t){for(var r=[],a=Object(h.lineString)(e.paths[0]),n=3.28084*Object(h.length)(a,{units:"meters"}),o=0;o<=n/t;o++){var i=Object(h.along)(a,o*(.3048*t),{units:"meters"});r.push([i.geometry.coordinates[0],i.geometry.coordinates[1]])}return r},getScales:function(e){for(var t=e,r=0;r<19;r++){var a=t[0],n=a*(a/100+1.03);t.unshift(n)}return t},getSplit:function(){var e=Object(l.a)(c.a.mark(function e(t){var r;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.queryFeatures();case 2:return r=e.sent,e.abrupt("return",Math.min.apply(null,r.features.map(function(e){var t=e.geometry,r=Object(h.lineString)(t.paths[0]),a=3.28084*Object(h.length)(r,{units:"meters"}),n=Math.floor(a/400);return n<=5?5:n})));case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),getUrlVars:function(e){var t=new URLSearchParams(window.location.search).get(e);return t&&"yes"===t.toLowerCase()?"true":t&&"no"===t.toLowerCase()?"false":t||"false"}},f=function(e){var t=Object(a.useState)(),r=Object(u.a)(t,2),n=r[0],o=r[1];return Object(a.useEffect)(function(){return Object(p.c)(["esri/layers/GeoJSONLayer","esri/layers/GraphicsLayer","esri/Graphic"]).then(function(t){var r=Object(u.a)(t,3),a=r[0],n=r[1],i=r[2],s=new a({geometryType:"polyline",renderer:{symbol:{color:[0,255,255,.75],style:"solid",type:"simple-line",width:1},type:"simple"},url:e.gist}),c=new a({definitionExpression:"Pic is not NULL",geometryType:"point",renderer:{symbol:{height:"20px",type:"picture-marker",url:"http://shadc.github.io/presentations/images/camera-64x64.png",width:"20px"},type:"simple"},url:e.gist}),l=new a({definitionExpression:"Pic is NULL",geometryType:"point",labelingInfo:[{labelExpressionInfo:{value:"{LABEL}"},labelPlacement:"above-center",symbol:{callout:{border:{color:[255,255,255,.7]},color:[0,0,0],size:.2,type:"line"},symbolLayers:[{halo:{color:[0,0,139,.75],size:"1px"},material:{color:"white"},size:10,type:"text"}],type:"label-3d",verticalOffset:{maxWorldLength:1e3,minWorldLength:10,screenLength:50}}}],renderer:{symbol:{color:[227,139,79,.25],outline:{color:[227,139,79,1],width:"1px"},size:10,type:"simple-marker"},type:"simple"},url:e.gist}),p=new n;p.elevationInfo={mode:"relative-to-ground",offset:10,unit:"feet"},e.map.add(p);var m={color:[0,255,255,.25],outline:{color:[0,255,255,1],width:"1px"},size:10,type:"simple-marker"};s.when(function(){var t=s.createQuery({where:"OBJECTID = 1"});s.queryFeatures(t).then(function(t){var r=Object(u.a)(t.features[0].geometry.toJSON().paths[0][0],2),a=r[0],n=r[1],o=new i({geometry:{type:"point",x:a,y:n},symbol:m});p.add(o),e.setTour(s,c,e.view,o)})}),o([[s,c,l]]),e.map.addMany([s,c,l])}).catch(function(e){return console.error(e)}),function(){e.map.removeMany(n)}},[]),null},y={active:"animateIn",deactive:"animateOut"},w=function(e){var t,r,a;return n.a.createElement("li",{style:(a=e.height,{"--tx":a}),className:(t=e.id,r=e.picAction,t===r[0]&&"deactive"===r[1]?"polaroidCenter animateRight":t<r[0]?"polaroidCenter animateRight":"polaroidCenter")},n.a.createElement("div",{className:function(e,t){return e>t[0]?"polaroid polaroidInitial":e===t[0]?"polaroid "+y[t[1]]:"polaroid animateOut"}(e.id,e.picAction)},n.a.createElement("img",{className:"picImage",src:e.img}),n.a.createElement("div",null,e.caption)))};w.defaultProps={picAction:[0,""]};var S=w,O=function(e){var t=Object(a.useState)(e.initSliderVal),r=Object(u.a)(t,2),o=r[0],i=r[1];return n.a.createElement("input",{id:"slider",type:"range",min:"1",max:"20",className:"slider",value:o,onChange:function(t){i(t.target.value),e.handleChange(t.target.value)}})},E={},N=0,j=10,x=!1,D=function(){for(var e=Object(a.useState)(),t=Object(u.a)(e,2),r=t[0],o=t[1],i=Object(a.useState)(""),s=Object(u.a)(i,2),m=s[0],b=s[1],h=Object(a.useState)([]),y=Object(u.a)(h,2),w=y[0],D=y[1],C=Object(a.useState)(),I=Object(u.a)(C,2),G=I[0],$=I[1],T="true"===v.getUrlVars("droneView"),k="true"===v.getUrlVars("hidePhotos"),A="false"===v.getUrlVars("geoJson")?"https://gist.githubusercontent.com/shadc/5f28c0d4f3d3fdf1e789/raw/4495bf6e4194adb1ce215c032c93c1fc8273e32a/Bluebird%2520Day%2520at%2520Mt.%2520Bachelor.geojson":v.getUrlVars("geoJson"),L=function(){var e=Object(l.a)(c.a.mark(function e(){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:E.routeNum=1,E.coordNum=0,M();case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),M=function(){var e=Object(l.a)(c.a.mark(function e(){var t,r;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return E.map.graphics&&E.map.graphics.removeAll(),E.routeLayer.definitionExpression="OBJECTID < "+E.routeNum,e.next=4,v.getGraphics(E.routeLayer,E.routeNum);case 4:if((t=e.sent).length){e.next=8;break}return b(""),e.abrupt("return");case 8:return r=t[0].geometry,E.routeCoords=v.getRouteCoords(r,E.splits),b(t[0].getAttribute("Caption")),e.next=13,v.getPicRouteIndex(E.routeCoords,t[0].getAttribute("Route"),E.picsLayer);case 13:E.picIndexes=e.sent,T?N=window.setInterval(J,V(j)):E.map.goTo(r).then(function(){N=window.setInterval(J,V(j))});case 15:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),U=1,J=function e(){if(E.coordNum>E.routeCoords.length-1)return clearInterval(N),E.coordNum=0,E.routeNum++,void setTimeout(function(){M()},1e3);x&&(clearInterval(N),N=window.setInterval(e,V(j)),x=!1);var t=Object(u.a)(E.routeCoords[E.coordNum],2),r=t[0],a=t[1],n={type:"point",longitude:r,latitude:a};E.pointGraphic.geometry=n;var o=E.pointGraphic.clone();if(o.symbol.set("size",1),o.geometry=n,E.map.graphics.add(o),T&&E.coordNum%2&&E.map.stationary){var i=E.coordNum>10?E.routeCoords[E.coordNum-10]:E.routeCoords[E.coordNum],s=E.coordNum<E.routeCoords.length-10?E.routeCoords[E.coordNum+10]:E.routeCoords[E.coordNum],c=v.getHeading(i,s);E.map.goTo({center:[r,a],heading:c,tilt:E.map.camera.tilt>1?E.map.camera.tilt:60,zoom:16},{easing:"linear",speedFactor:.9})}!k&&E.picIndexes.includes(E.coordNum)&&(clearInterval(N),$([U,"active"]),setTimeout(function(){$([U,"deactive"]),setTimeout(function(){N=window.setInterval(e,V(j)),U++},1e3)},4e3)),E.coordNum++},B=function(){var e=Object(l.a)(c.a.mark(function e(t,r,a,n){var i;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return E.routeLayer=t,E.picsLayer=r,E.map=a,E.pointGraphic=n,E.routeNum=1,E.coordNum=0,E.scales=v.getScales([4]),e.next=9,v.getSplit(t);case 9:return E.splits=e.sent,t.queryExtent().then(function(e){E.map.goTo(e.extent.expand(2),{easing:"in-out-expo"})}),e.t0=D,e.next=14,r.queryFeatures();case 14:e.t1=e.sent.features,(0,e.t0)(e.t1),i=decodeURI(decodeURI(A.substring(A.lastIndexOf("/")+1))),o(i.substr(0,i.lastIndexOf("."))||i);case 18:case"end":return e.stop()}},e)}));return function(t,r,a,n){return e.apply(this,arguments)}}(),P=[4],R=0;R<19;R++){var W=P[0],_=W*(W/100+1.03);P.unshift(_)}var V=function(e){return P[e-1]};return n.a.createElement(n.a.Fragment,null,n.a.createElement(g,{caption:m,title:r,onClick:L}),n.a.createElement(p.b,{loaderOptions:{url:"https://js.arcgis.com/4.11"},className:"mapcontainer",mapProperties:{ground:"world-elevation"},viewProperties:{zoom:2}},n.a.createElement(O,{handleChange:function(e){j=e,x=!0},initSliderVal:j}),n.a.createElement(f,{view:p.b,map:p.a,gist:A,setTour:B}),n.a.createElement(d,{view:p.b,map:p.a})),n.a.createElement("ul",null,w.map(function(e,t){return n.a.createElement(S,{key:t,height:0===t?"10vh":85/w.length*t+10+"vh",id:t+1,picAction:G,caption:e.getAttribute("Caption"),img:"https://shadc.github.io/presentations/"+e.getAttribute("Pic")})})))};r(19),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(n.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},7:function(e){e.exports={basemaps:[{id:"MapBox Run/Bike/Hike",visible:!1,subDomains:["a","b","c","d"],copyright:"MapBox",url:"http://{subDomain}.tiles.mapbox.com/v4/mapbox.run-bike-hike/${level}/${col}/${row}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw"},{id:"MapBox Outdoors",visible:!1,subDomains:["a","b","c","d"],copyright:"MapBox",url:"http://{subDomain}.tiles.mapbox.com/v4/mapbox.outdoors/${level}/${col}/${row}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw"},{id:"MapBox Dark",visible:!1,subDomains:["a","b","c","d"],copyright:"MapBox",url:"http://{subDomain}.tiles.mapbox.com/v4/mapbox.dark/${level}/${col}/${row}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw"},{id:"National Geographic",visible:!1,subDomains:["services","server"],copyright:"National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",url:"http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/${level}/${row}/${col}"},{id:"Esri World Imagery",visible:!0,subDomains:["services","server"],copyright:"Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community ",url:"http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${level}/${row}/${col}"},{id:"Esri World Topo",visible:!1,subDomains:["services","server"],copyright:"Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community ",url:"http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${level}/${row}/${col}"},{id:"Esri Street Map",visible:!1,subDomains:["services","server"],copyright:"Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community ",url:"http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${level}/${row}/${col}"},{id:"Stamen Watercolor",visible:!1,subDomains:["a","b","c","d"],copyright:"Stamen Watercolor",url:"http://{subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg"},{id:"Open Cycle Map",visible:!1,subDomains:["a","b","c"],copyright:"Open Cycle Map",url:"http://{subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png"},{id:"Open Street Map",visible:!1,subDomains:["a","b","c"],copyright:"Open Street Maps",url:"https://{subDomain}.tile.openstreetmap.org/${level}/${col}/${row}.png"},{id:" Open Topo Map",visible:!1,subDomains:["a","b","c"],copyright:"Open Topo Map",url:"https://{subDomain}.tile.opentopomap.org/${level}/${col}/${row}.png"},{id:"Thunderforest Outdoors",visible:!1,subDomains:["a","b","c"],copyright:"Thunderforest",url:"https://{subDomain}.tile.thunderforest.com/outdoors/${level}/${col}/${row}.png?apikey=a5dd6a2f1c934394bce6b0fb077203eb"},{id:"Thunderforest Spinal Map",visible:!1,subDomains:["a","b","c"],copyright:"Thunderforest",url:"https://{subDomain}.tile.thunderforest.com/spinal-map/${level}/${col}/${row}.png?apikey=a5dd6a2f1c934394bce6b0fb077203eb"},{id:" Deschutes County Imagery",visible:!1,copyright:" Deschutes County Imagery",url:"https://maps.deschutes.org/arcgis/rest/services/Dial/DOQ_Deschutes_1ft/MapServer/tile/${level}/${row}/${col}"}]}}},[[10,1,2]]]);
//# sourceMappingURL=main.49f4358d.chunk.js.map