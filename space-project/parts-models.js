// Independently authored high-detail KSP1-inspired procedural part models.
// Each stock-style part family gets its own silhouette, finish, decals and mechanical detailing.

// One compact, hand-painted surface atlas per part family. Reused by all 454 catalog
// entries so the finish stays cohesive without allocating hundreds of large textures.
const PART_SKIN_CACHE=new Map();
function getPartSkin(THREE,family){
 if(PART_SKIN_CACHE.has(family))return PART_SKIN_CACHE.get(family);
 const c=document.createElement('canvas');c.width=512;c.height=512;
 const x=c.getContext('2d');
 const palettes={
  tank:['#e6e5dc','#343d40','#c65b35','FUEL SYSTEM'],
  engine:['#777f80','#252c30','#c56b31','PROPULSION'],
  pod:['#e8e7df','#263b48','#d18a38','CREW MODULE'],
  aero:['#e5e5df','#35424a','#c18b48','AERODYNAMICS'],
  solar:['#173c5b','#a8c5d4','#b68b4e','POWER ARRAY'],
  science:['#d9ddd8','#33434b','#c18b48','SCIENCE PAYLOAD'],
  structure:['#aeb8b8','#354047','#c18b48','STRUCTURAL'],
  utility:['#d9d9d0','#354047','#c18b48','FLIGHT SYSTEM'],
  general:['#dedfd8','#354047','#bd8750','FLIGHT HARDWARE']
 };
 const [base,ink,accent,label]=palettes[family]||palettes.general;
 x.fillStyle=base;x.fillRect(0,0,512,512);
 // Soft painted-metal lighting, not photographic noise.
 const grad=x.createLinearGradient(0,0,512,0);grad.addColorStop(0,'rgba(0,0,0,.13)');grad.addColorStop(.18,'rgba(255,255,255,.14)');grad.addColorStop(.52,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(0,0,0,.16)');x.fillStyle=grad;x.fillRect(0,0,512,512);
 // Repeated formed-panel seams and restrained fasteners.
 x.strokeStyle='rgba(30,42,47,.30)';x.lineWidth=2;
 for(let y=28;y<512;y+=96){x.beginPath();x.moveTo(0,y);x.lineTo(512,y);x.stroke();}
 for(let xx=64;xx<512;xx+=128){x.beginPath();x.moveTo(xx,0);x.lineTo(xx,512);x.stroke();}
 for(let y=34;y<512;y+=96)for(let xx=18;xx<512;xx+=64){
  x.fillStyle='#b8c0bd';x.beginPath();x.arc(xx,y,3.2,0,Math.PI*2);x.fill();
  x.fillStyle='rgba(25,34,39,.65)';x.beginPath();x.arc(xx,y,1.5,0,Math.PI*2);x.fill();
 }
 // A real-looking, small equipment stencil and serial panel.
 x.fillStyle=ink;x.fillRect(24,174,214,92);x.strokeStyle=accent;x.lineWidth=5;x.strokeRect(24,174,214,92);
 x.fillStyle='#f3f0e5';x.font='bold 24px Arial';x.fillText(label,38,208,186);
 x.font='bold 15px Arial';x.fillText('KSP FLIGHT HARDWARE',38,232,186);
 x.font='12px Arial';x.fillText('SERIES 01  /  INSPECTED',38,251,186);
 // Caution band and service access hatch.
 x.fillStyle=ink;x.fillRect(280,184,206,68);
 x.fillStyle=accent;
 for(let i=0;i<12;i++){x.beginPath();x.moveTo(286+i*17,184);x.lineTo(298+i*17,184);x.lineTo(286+i*17,202);x.lineTo(274+i*17,202);x.fill();}
 x.strokeStyle='rgba(255,255,255,.72)';x.lineWidth=2;x.strokeRect(300,280,150,116);
 x.fillStyle='rgba(25,38,44,.12)';x.fillRect(308,288,134,100);
 x.fillStyle=ink;x.fillRect(326,314,98,10);x.fillRect(326,338,72,7);x.fillRect(326,358,84,7);
 x.fillStyle=accent;x.fillRect(24,456,464,12);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
 PART_SKIN_CACHE.set(family,tex);return tex;
}


function getFinishTexture(THREE,kind){
 const key='finish:'+kind;
 if(PART_SKIN_CACHE.has(key))return PART_SKIN_CACHE.get(key);
 const c=document.createElement('canvas');c.width=512;c.height=512;const q=c.getContext('2d');
 const palettes={
  enamel:['#dedfd8','#59636a','#b8b8ae'],paint:['#e8e7df','#414d54','#b66f39'],
  aluminium:['#aeb8ba','#667277','#e2e5e2'],steel:['#59646a','#202b31','#a5afb0'],
  rubber:['#202326','#111518','#555b5c']
 };
 const [base,ink,accent]=palettes[kind]||palettes.enamel;
 q.fillStyle=base;q.fillRect(0,0,512,512);
 const grad=q.createLinearGradient(0,0,512,0);grad.addColorStop(0,'rgba(0,0,0,.18)');grad.addColorStop(.2,'rgba(255,255,255,.17)');grad.addColorStop(.48,'rgba(255,255,255,.025)');grad.addColorStop(.8,'rgba(0,0,0,.045)');grad.addColorStop(1,'rgba(0,0,0,.2)');q.fillStyle=grad;q.fillRect(0,0,512,512);
 if(kind==='aluminium'||kind==='steel'){
  q.globalAlpha=.13;q.strokeStyle=kind==='steel'?'#e3e7e5':'#ffffff';q.lineWidth=1;
  for(let y=0;y<512;y+=4){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}q.globalAlpha=1;
 }else if(kind==='rubber'){
  for(let i=0;i<1800;i++){const x=(i*97)%512,y=(i*193)%512;q.fillStyle=i%2?'rgba(255,255,255,.045)':'rgba(0,0,0,.12)';q.fillRect(x,y,2,2);}
  q.strokeStyle='rgba(0,0,0,.35)';q.lineWidth=3;for(let y=18;y<512;y+=48){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}
 }else{
  q.strokeStyle='rgba(35,47,52,.27)';q.lineWidth=2;
  for(let x=32;x<512;x+=96){q.beginPath();q.moveTo(x,0);q.lineTo(x,512);q.stroke();}
  for(let y=36;y<512;y+=112){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}
  for(let y=30;y<512;y+=112)for(let x=26;x<512;x+=48){q.fillStyle='#aab3b1';q.beginPath();q.arc(x,y,2.6,0,Math.PI*2);q.fill();q.fillStyle='rgba(20,29,33,.55)';q.beginPath();q.arc(x,y,1.2,0,Math.PI*2);q.fill();}
  q.fillStyle=ink;q.fillRect(24,166,190,112);q.strokeStyle=accent;q.lineWidth=4;q.strokeRect(24,166,190,112);
  q.fillStyle='#f2f0e8';q.font='bold 25px Arial';q.fillText(kind==='paint'?'FLIGHT SYSTEM':'STRUCTURAL',36,204);
  q.font='bold 17px Arial';q.fillText('KSP / SERIES 01',36,232);q.font='12px Arial';q.fillText('INSPECTED  •  FLIGHT READY',36,254);
  q.fillStyle=ink;q.fillRect(252,176,236,66);q.fillStyle=accent;
  for(let i=0;i<14;i++){q.beginPath();q.moveTo(260+i*16,176);q.lineTo(270+i*16,176);q.lineTo(260+i*16,194);q.lineTo(250+i*16,194);q.fill();}
  q.strokeStyle='rgba(255,255,255,.7)';q.lineWidth=2;q.strokeRect(274,286,178,106);
  q.fillStyle=ink;q.fillRect(290,306,145,9);q.fillRect(290,330,112,6);q.fillRect(290,348,128,6);
  q.fillStyle=accent;q.fillRect(24,462,464,9);
 }
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=8;
 PART_SKIN_CACHE.set(key,tex);return tex;
}


function makeTankArtwork(THREE,id,name,kind){
 const key='tank-art:'+id;
 if(PART_SKIN_CACHE.has(key))return PART_SKIN_CACHE.get(key);
 const c=document.createElement('canvas');c.width=512;c.height=256;const q=c.getContext('2d');
 const palette={
  fl:{base:'#c9cbc5',shade:'#8f9998',accent:'#20282d',metal:'#dfe2dc',brand:'KERLINGTON',stripe:'#171d21'},
  rock:{base:'#c56b35',shade:'#86472f',accent:'#e4b36c',metal:'#b9c1bf',brand:'ROCKOMAX',stripe:'#293238'},
  kerb:{base:'#9ba5a5',shade:'#59666a',accent:'#c69a55',metal:'#d9dfdc',brand:'KERBODYNE',stripe:'#293238'},
  mk:{base:'#aeb8b7',shade:'#626e72',accent:'#d2d5cf',metal:'#dfe3df',brand:'C7 AEROSPACE',stripe:'#303a40'},
  rcs:{base:'#b9bdb7',shade:'#6d7778',accent:'#c76b3b',metal:'#dfe2dc',brand:'STRATUS',stripe:'#202a30'},
  xenon:{base:'#718b9a',shade:'#344b59',accent:'#d5b66c',metal:'#bdc8c9',brand:'PB-X',stripe:'#263b48'},
  nerv:{base:'#646c6e',shade:'#30393d',accent:'#c46b35',metal:'#aab4b4',brand:'KERBODYNE',stripe:'#1e292e'}
 }[kind]||{base:'#c9cbc5',shade:'#8f9998',accent:'#b68b4e',metal:'#dfe2dc',brand:'KSP',stripe:'#20282d'};
 q.fillStyle=palette.base;q.fillRect(0,0,512,256);
 const grad=q.createLinearGradient(0,0,512,0);grad.addColorStop(0,'rgba(0,0,0,.28)');grad.addColorStop(.17,'rgba(255,255,255,.14)');grad.addColorStop(.5,'rgba(255,255,255,.025)');grad.addColorStop(.82,'rgba(0,0,0,.06)');grad.addColorStop(1,'rgba(0,0,0,.3)');q.fillStyle=grad;q.fillRect(0,0,512,256);
 // Rolled-shell longitudinal welds and circumferential end seams.
 q.strokeStyle='rgba(24,34,39,.42)';q.lineWidth=2;
 for(const x of [24,488]){q.beginPath();q.moveTo(x,8);q.lineTo(x,248);q.stroke();}
 for(const y of [18,30,226,238]){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}
 // Fastener rows and fine stamped panel divisions.
 for(let x=18;x<512;x+=32){for(const y of [24,232]){q.fillStyle=palette.metal;q.beginPath();q.arc(x,y,2.2,0,Math.PI*2);q.fill();q.fillStyle='rgba(25,34,38,.7)';q.beginPath();q.arc(x,y,1,0,Math.PI*2);q.fill();}}
 if(kind==='fl'){
  // FL-T series: light alloy shell and the characteristic black longitudinal speed stripes.
  q.fillStyle=palette.stripe;q.fillRect(112,0,15,256);q.fillRect(138,0,7,256);
  q.fillStyle=palette.metal;q.fillRect(0,34,512,5);q.fillRect(0,217,512,5);
 }else if(kind==='rock'){
  // Rockomax: orange pressure shell, dark equipment strip and pale end bands.
  q.fillStyle=palette.metal;q.fillRect(0,35,512,9);q.fillRect(0,212,512,9);
  q.fillStyle=palette.shade;q.fillRect(0,92,512,8);q.fillRect(0,156,512,8);
  q.fillStyle=palette.stripe;q.fillRect(350,45,34,166);
  for(let y=50;y<210;y+=16){q.fillStyle=palette.accent;q.fillRect(354,y,26,4);}
 }else if(kind==='kerb'){
  q.fillStyle=palette.shade;q.fillRect(0,38,512,9);q.fillRect(0,209,512,9);
  q.fillStyle=palette.accent;q.fillRect(0,53,512,4);q.fillRect(0,202,512,4);
  for(let x=16;x<512;x+=48){q.fillStyle='rgba(27,38,42,.36)';q.fillRect(x,72,2,112);}
 }else if(kind==='mk'){
  q.fillStyle=palette.stripe;q.fillRect(0,42,512,12);q.fillRect(0,202,512,12);
  q.fillStyle=palette.metal;q.fillRect(0,58,512,4);q.fillRect(0,194,512,4);
 }else if(kind==='rcs'){
  q.fillStyle=palette.accent;q.fillRect(0,40,512,10);q.fillRect(0,206,512,10);
  q.fillStyle=palette.stripe;q.fillRect(380,55,28,146);
 }else if(kind==='xenon'){
  q.fillStyle=palette.accent;q.fillRect(0,34,512,7);q.fillRect(0,215,512,7);
  for(let x=20;x<500;x+=22){q.fillStyle=palette.stripe;q.fillRect(x,78,5,100);}
 }else{
  q.fillStyle=palette.accent;q.fillRect(0,40,512,12);q.fillRect(0,204,512,12);
  for(let x=20;x<500;x+=28){q.fillStyle=palette.metal;q.fillRect(x,74,3,112);}
 }
 // Small, flush identification plate with exact part name and manufacturer family.
 q.fillStyle='#202a2f';q.fillRect(28,88,236,82);q.strokeStyle=palette.accent;q.lineWidth=3;q.strokeRect(28,88,236,82);
 q.fillStyle='#f1f0e8';q.font='bold 18px Arial';q.fillText(palette.brand,40,112);
 q.font='bold 15px Arial';q.fillText(String(name).toUpperCase().slice(0,27),40,137,210);
 q.font='10px Arial';q.fillStyle='#c8d0cc';q.fillText('PRESSURE VESSEL  /  INSPECT',40,155);
 // Inspection hatch, caution marks and stamped serial blocks.
 q.fillStyle=palette.shade;q.fillRect(292,96,126,66);q.strokeStyle=palette.metal;q.lineWidth=2;q.strokeRect(292,96,126,66);
 q.fillStyle=palette.metal;q.fillRect(304,108,102,5);q.fillRect(304,121,78,4);q.fillRect(304,133,89,4);
 q.fillStyle=palette.accent;for(let i=0;i<7;i++){q.beginPath();q.moveTo(432+i*8,96);q.lineTo(438+i*8,96);q.lineTo(432+i*8,108);q.lineTo(426+i*8,108);q.fill();}
 q.fillStyle=palette.stripe;q.fillRect(28,184,456,10);q.fillStyle=palette.accent;q.fillRect(28,184,456,2);
 // Subtle manufacturing grain, never a flat color swatch.
 for(let i=0;i<900;i++){const x=(i*73)%512,y=(i*139)%256;q.fillStyle=i%3?'rgba(255,255,255,.025)':'rgba(0,0,0,.035)';q.fillRect(x,y,1,1);}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.ClampToEdgeWrapping;tex.anisotropy=8;
 PART_SKIN_CACHE.set(key,tex);return tex;
}


function makeThermalTileMaterial(THREE){
 const key='ksp1-thermal-tile-map';
 if(PART_SKIN_CACHE.has(key))return PART_SKIN_CACHE.get(key);
 const c=document.createElement('canvas');c.width=512;c.height=512;const q=c.getContext('2d');
 q.fillStyle='#493d35';q.fillRect(0,0,512,512);
 for(let y=0;y<512;y+=32)for(let x=0;x<512;x+=32){
  const ox=(Math.floor(y/32)%2)*16,px=x+ox;
  const shade=34+((x*7+y*11)%23);
  q.fillStyle='rgb('+shade+','+(shade-5)+','+(shade-9)+')';q.fillRect(px+2,y+2,28,28);
  q.strokeStyle='rgba(9,12,14,.8)';q.lineWidth=3;q.strokeRect(px+2,y+2,28,28);
  q.strokeStyle='rgba(191,174,151,.18)';q.lineWidth=1;q.beginPath();q.moveTo(px+5,y+5);q.lineTo(px+24,y+5);q.stroke();
 }
 const grad=q.createLinearGradient(0,0,512,512);grad.addColorStop(0,'rgba(255,255,255,.08)');grad.addColorStop(1,'rgba(0,0,0,.18)');q.fillStyle=grad;q.fillRect(0,0,512,512);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=8;PART_SKIN_CACHE.set(key,tex);return tex;
}

export function createPartModel(p,THREE){
 const g=new THREE.Group(),id=String(p.id||''),name=String(p.name||''),type=String(p.type||''),r=Math.max(.055,Number(p.radius)||.5),h=Math.max(.12,Number(p.height)||.5);
 const M=(color,metalness=.35,roughness=.48,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});

 const painted=(base,accent,word,serial=id.toUpperCase())=>{
  const brand=/rockomax|x200|mainsail|skipper|poodle/i.test(id+' '+name)?'ROCKOMAX':/kerbodyne|s3-|mammoth|nerv/i.test(id+' '+name)?'KERBODYNE':/mk2|mk3|c7/i.test(id+' '+name)?'C7 AEROSPACE':/probe|okto|hecs|qbe|stayputnik|probodobodyne/i.test(id+' '+name)?'PROBODOBODYNE':/engine|lv-|terrier|swivel|reliant|spark/i.test(id+' '+name)?'JEBEDIAH KERMAN\'S JUNKYARD':'SQUAD FLIGHT SYSTEMS';
  const key='part-art:'+id+':'+base+':'+accent;
  let tex=PART_SKIN_CACHE.get(key);
  if(!tex){
   const c=document.createElement('canvas');c.width=512;c.height=256;const q=c.getContext('2d');
   q.fillStyle=base;q.fillRect(0,0,512,256);
   const grad=q.createLinearGradient(0,0,512,0);grad.addColorStop(0,'rgba(0,0,0,.24)');grad.addColorStop(.18,'rgba(255,255,255,.15)');grad.addColorStop(.52,'rgba(255,255,255,.02)');grad.addColorStop(.84,'rgba(0,0,0,.08)');grad.addColorStop(1,'rgba(0,0,0,.24)');q.fillStyle=grad;q.fillRect(0,0,512,256);
   q.strokeStyle='rgba(25,36,41,.36)';q.lineWidth=2;
   for(let x=18;x<512;x+=64){q.beginPath();q.moveTo(x,12);q.lineTo(x,244);q.stroke();}
   for(const y of [18,34,220,238]){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}
   for(let x=20;x<512;x+=32){for(const y of [26,230]){q.fillStyle='#d4d8d3';q.beginPath();q.arc(x,y,2,0,Math.PI*2);q.fill();}}
   q.fillStyle=accent;q.fillRect(0,48,512,7);q.fillRect(0,202,512,7);
   // Recessed equipment identification plate, manufacturer and part-specific marking.
   q.fillStyle='#202a30';q.fillRect(28,78,270,92);q.strokeStyle=accent;q.lineWidth=3;q.strokeRect(28,78,270,92);
   q.fillStyle='#f1f0e8';q.font='bold 16px Arial';q.fillText(brand,40,101,246);
   q.font='bold 14px Arial';q.fillText(String(name).toUpperCase().slice(0,30),40,126,246);
   q.fillStyle='#c7cfca';q.font='10px Arial';q.fillText(String(serial).toUpperCase().slice(0,34),40,146,246);
   q.fillText('INSPECT  /  SERVICE PANEL',40,160,246);
   // Stamped caution area, service hatches and fastener shadows.
   q.fillStyle='#29343a';q.fillRect(326,82,150,76);q.strokeStyle='#c5ccc7';q.lineWidth=2;q.strokeRect(326,82,150,76);
   q.fillStyle='#dce0d9';q.fillRect(338,94,116,5);q.fillRect(338,108,82,4);q.fillRect(338,121,102,4);
   q.fillStyle=accent;for(let i=0;i<8;i++){q.beginPath();q.moveTo(338+i*15,137);q.lineTo(348+i*15,137);q.lineTo(338+i*15,153);q.lineTo(328+i*15,153);q.fill();}
   for(let i=0;i<650;i++){const x=(i*73)%512,y=(i*139)%256;q.fillStyle=i%2?'rgba(255,255,255,.025)':'rgba(0,0,0,.035)';q.fillRect(x,y,1,1);}
   tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.ClampToEdgeWrapping;tex.anisotropy=8;PART_SKIN_CACHE.set(key,tex);
  }
  return M(0xffffff,.48,.58,{map:tex});
 };
 const ivory=M(0xd9d9d0,.42,.52),paint=M(0xe7e6dc,.28,.6),aluminium=M(0xaeb9bd,.82,.28),steel=M(0x59666d,.82,.34),dark=M(0x252f35,.68,.38),rubber=M(0x171b1e,.04,.91),gold=M(0xb68b4e,.72,.32),orange=M(0xc56b31,.35,.58),blue=M(0x28547c,.58,.3),glass=M(0x173f5c,.62,.14,{emissive:0x071a2c,emissiveIntensity:.22}),black=M(0x111a20,.45,.25);
 const add=(geo,mat,pos=[0,0,0],rot=[0,0,0],scale)=>{const o=new THREE.Mesh(geo,mat);o.position.set(...pos);o.rotation.set(...rot);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const lathe=(profile,mat,segments=64,pos=[0,0,0])=>add(new THREE.LatheGeometry(profile.map(v=>new THREE.Vector2(v[0],v[1])),segments),mat,pos);
 const band=(radius,y,t=.025,mat=steel)=>add(new THREE.TorusGeometry(radius,t,8,64),mat,[0,y,0],[Math.PI/2,0,0]);
 const cyl=(top,bottom,len,mat,y=0,segments=48)=>add(new THREE.CylinderGeometry(top,bottom,len,segments,1,false),mat,[0,y,0]);
 const box=(w,d,depth,mat,pos=[0,0,0],rot=[0,0,0])=>add(new THREE.BoxGeometry(w,d,depth),mat,pos,rot);
 const sphere=(rad,mat,pos=[0,0,0],scale=[1,1,1])=>add(new THREE.SphereGeometry(rad,24,16),mat,pos,[0,0,0],scale);
 const tube=(points,rad,mat)=>{const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));return add(new THREE.TubeGeometry(curve,32,rad,8,false),mat);};
 const bolt=(x,y,z,rad=.018,mat=aluminium)=>sphere(rad,mat,[x,y,z],[1,1,.42]);
 const makeLabel=(accent='#b58b4d',caption='KERBAL SPACE PROGRAM',serial=id.toUpperCase())=>{
  const c=document.createElement('canvas');c.width=512;c.height=256;const q=c.getContext('2d');
  q.fillStyle='#e3e3da';q.fillRect(0,0,512,256);q.fillStyle=accent;q.fillRect(0,0,512,18);q.fillRect(0,228,512,8);
  q.strokeStyle='#9ba5a5';q.lineWidth=2;for(let y=42;y<220;y+=28){q.beginPath();q.moveTo(18,y);q.lineTo(494,y);q.stroke();}
  q.fillStyle='#26343a';q.font='bold 28px Arial';q.fillText(caption,22,76);q.font='bold 23px Arial';q.fillText(serial.slice(0,25),22,116);
  q.font='16px Arial';q.fillText('FLIGHT HARDWARE  •  FLIGHT READY',22,158);q.fillText('PRESSURE / STRUCTURAL SYSTEMS',22,190);
  for(let i=0;i<12;i++){q.fillStyle=i%2?'#5c666a':'#b7c0be';q.fillRect(22+i*13,207,8,10);}
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
  return M(0xffffff,.22,.62,{map:tex});
 };
 let labelMaterial=null;const getLabelMaterial=()=>labelMaterial||(labelMaterial=makeLabel(id.includes('rockomax')||id.includes('x200')?'#b84c36':id.includes('s3')?'#b68b4e':'#b68b4e',id.includes('rockomax')?'ROCKOMAX INDUSTRIES':'KERBODYNE',id));
 const radialLabel=(radius,y,w,hh,mat=getLabelMaterial())=>{const m=add(new THREE.PlaneGeometry(w,hh),mat,[0,y,radius]);return m;};
 const torusAt=(rad,y,t,mat)=>band(rad,y,t,mat);
 const detailRivets=(rad,y,count=16,offset=0)=>{for(let i=0;i<count;i++){const a=i*Math.PI*2/count+offset;bolt(Math.cos(a)*rad,y,Math.sin(a)*rad,.018);}};
 const radialPipe=(rad,y0,y1,a,mat=aluminium,thick=.018)=>tube([[Math.cos(a)*rad,y0,Math.sin(a)*rad],[Math.cos(a*1.02)*rad*1.025,(y0+y1)/2,Math.sin(a*1.02)*rad*1.025],[Math.cos(a)*rad,y1,Math.sin(a)*rad]],thick,mat); 
 const makeTank=()=>{
  const isRcs=id.startsWith('rcs-'),xenon=id.includes('xenon'),oscar=id.includes('oscar'),donut=id.includes('donut')||id.includes('r12'),baguette=id.includes('baguette')||id.includes('r11'),rock=/rockomax|x200|jumbo/i.test(id+' '+name),kerb=id.includes('s3-'),mk2=id.includes('mk2-lf'),mk3=id.includes('mk3-lf'),mk0=id.includes('mk0-lf');
  if(donut){const ring=add(new THREE.TorusGeometry(r*.76,r*.27,24,72),M(0xd6d7cf,.42,.5));ring.scale.set(1,.82,1);band(r*.98,.04,.035,steel);band(r*.98,-.04,.035,gold);cyl(r*.22,r*.22,.12,dark,0,32);detailRivets(r*.96,0,20);}
  else if(baguette){lathe([[0,-h*.48],[r*.45,-h*.48],[r*.68,-h*.42],[r*.72,-h*.32],[r*.72,h*.32],[r*.65,h*.44],[r*.42,h*.48],[0,h*.48]],ivory,64);band(r*.71,-h*.38,.025,gold);band(r*.71,h*.38,.025,steel);for(let y of [-h*.25,h*.25])band(r*.72,y,.012,aluminium);}
  else{
   let rad=r,profile;
   if(mk2||mk3){rad*=mk3?1.05:1;profile=[[0,-h*.5],[rad*.72,-h*.5],[rad*.93,-h*.45],[rad,-h*.35],[rad,h*.35],[rad*.93,h*.45],[rad*.72,h*.5],[0,h*.5]];}
   else if(oscar){profile=[[0,-h*.5],[r*.65,-h*.5],[r*.92,-h*.42],[r,-h*.25],[r,h*.25],[r*.92,h*.42],[r*.65,h*.5],[0,h*.5]];}
   else if(rock){profile=[[0,-h*.5],[r*.72,-h*.5],[r*.9,-h*.47],[r*.98,-h*.42],[r,-h*.34],[r,h*.34],[r*.98,h*.42],[r*.9,h*.47],[r*.72,h*.5],[0,h*.5]];}
   else if(kerb){profile=[[0,-h*.5],[r*.68,-h*.5],[r*.88,-h*.47],[r*.97,-h*.42],[r,h*.42],[r*.97,h*.46],[r*.88,h*.49],[r*.68,h*.5],[0,h*.5]];}
   else{profile=[[0,-h*.5],[r*.58,-h*.5],[r*.82,-h*.48],[r*.94,-h*.44],[r*.985,-h*.36],[r*.985,h*.36],[r*.94,h*.44],[r*.82,h*.48],[r*.58,h*.5],[0,h*.5]];}
   const tankKind=xenon?'xenon':isRcs?'rcs':rock?'rock':kerb?'kerb':mk2||mk3||mk0?'mk':/nerv|nuclear/i.test(id+' '+name)?'nerv':'fl';
   const tankSkin=makeTankArtwork(THREE,id,name,tankKind);
   const shellMat=M(0xffffff,.48,.56,{map:tankSkin});
   lathe(profile,shellMat,96);
   const rimR=rad*(rock?1.005:.99);
   for(const y of [-h*.44,h*.44]){band(rimR,y,.035,steel);band(rimR*.97,y+(y<0?.035:-.035),.018,aluminium);}
   if(rock){band(r*1.01,-h*.34,.032,orange);band(r*1.01,h*.34,.032,orange);for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.99,-h*.31,h*.31,a,steel,.022);}radialLabel(r*1.004,0,r*.72,h*.2,getLabelMaterial());}
   else if(kerb){for(let y of [-h*.34,h*.34])band(r*.99,y,.026,gold);for(let i=0;i<16;i++){const a=i*Math.PI/8;radialPipe(r*.99,-h*.36,h*.36,a,aluminium,.012);}radialLabel(r*1.002,0,r*.72,h*.16,getLabelMaterial());}
   else if(xenon){for(let y of [-h*.34,h*.34])band(r*.99,y,.026,gold);radialLabel(r*1.003,0,r*.68,h*.2,M(0xffffff,.25,.5,{map:makeLabel('#648ba0','XENON STORAGE',id).map}));}
   else if(isRcs){for(let y of [-h*.3,h*.3])band(r*.99,y,.028,orange);radialLabel(r*1.004,0,r*.65,h*.22,getLabelMaterial());}
   else if(oscar){band(r*1.01,-h*.32,.025,dark);band(r*1.01,h*.32,.025,gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;bolt(Math.cos(a)*r*.96,0,Math.sin(a)*r*.96,.025,gold);}}
   else if(mk2||mk3||mk0){for(let y of [-h*.35,h*.35])band(r*.99,y,.035,dark);for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(r*.98,-h*.36,h*.36,a,steel,.024);}radialLabel(r*1.002,0,r*.72,h*.18,getLabelMaterial());}
   else{for(let y of [-h*.36,h*.36])band(r*.99,y,.026,dark);band(r*.99,-h*.27,.018,gold);band(r*.99,h*.27,.018,gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.98,-h*.32,h*.32,a,aluminium,.012);}radialLabel(r*1.002,0,r*.66,h*.22,getLabelMaterial());}
   detailRivets(rimR,-h*.44,16);detailRivets(rimR,h*.44,16,.1);
   if(!oscar&&!donut){cyl(r*.72,r*.72,.065,steel,h*.49,64);cyl(r*.7,r*.7,.05,dark,-h*.49,64);}
  }
 };
 const makeEngine=()=>{
  const jet=type==='jet'||id.startsWith('jet-'),ion=id.includes('ion')||id.includes('dawn'),nuclear=id.includes('nerv'),dart=id.includes('dart'),vector=id.includes('vector'),mammoth=id.includes('mammoth'),twin=id.includes('twinboar'),spider=id.includes('spider'),thud=id.includes('thud'),poodle=id.includes('poodle'),rapier=id.includes('rapier');
  if(jet){
   const shellR=r*.78;lathe([[0,-h*.43],[shellR*.7,-h*.43],[shellR,-h*.34],[shellR,h*.32],[shellR*.82,h*.44],[shellR*.45,h*.47],[0,h*.47]],aluminium,64);
   const inlet=add(new THREE.TorusGeometry(shellR*.72,.075,16,64),steel,[0,0,h*.43],[Math.PI/2,0,0]);add(new THREE.CircleGeometry(shellR*.66,48),black,[0,0,h*.432],[Math.PI/2,0,0]);
   for(let i=0;i<14;i++){const a=i*Math.PI*2/14;box(.025,.025,shellR*.58,aluminium,[Math.cos(a)*shellR*.34,Math.sin(a)*shellR*.34,h*.44],[0,0,a]);}
   for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(shellR*1.02,-h*.28,h*.28,a,steel,.026);}
   band(shellR,-h*.3,.045,gold);band(shellR,h*.32,.045,dark);
   if(id.includes('panther')){for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(shellR*1.04,-h*.2,h*.22,a,orange,.018);}}
   if(id.includes('whiplash')){for(let i=0;i<10;i++){const a=i*Math.PI/5;radialPipe(shellR*1.06,-h*.35,h*.3,a,steel,.035);}}
   if(id.includes('goliath')){for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(shellR*1.03,-h*.3,h*.3,a,gold,.035);}}
  }else if(ion){
   lathe([[0,-h*.28],[r*.25,-h*.28],[r*.42,-h*.12],[r*.48,h*.1],[r*.32,h*.25],[0,h*.25]],steel,48);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.46,-h*.2,h*.28,a,gold,.018);}
   add(new THREE.TorusGeometry(r*.4,.055,12,48),gold,[0,h*.23,0]);add(new THREE.CircleGeometry(r*.36,48),blue,[0,h*.25,0]);
   for(let i=0;i<6;i++){const a=i*Math.PI/3;box(.055,h*.42,.055,aluminium,[Math.cos(a)*r*.53,h*.05,Math.sin(a)*r*.53]);}
  }else{
   const cluster=mammoth?4:twin?2:spider?4:1,bodyR=r*.82;
   lathe([[0,-h*.12],[bodyR*.78,-h*.12],[bodyR,-h*.05],[bodyR,h*.28],[bodyR*.88,h*.38],[bodyR*.62,h*.4],[0,h*.4]],painted(nuclear?'#6f7777':'#d9d9d0',nuclear?'#c56b31':'#b68b4e',nuclear?'NUCLEAR PROPULSION':'ROCKET ENGINE'),64);
   band(bodyR,h*.28,.045,steel);band(bodyR,-h*.06,.045,gold);
   if(nuclear){lathe([[r*.18,-h*.48],[r*.28,-h*.45],[r*.38,-h*.12],[r*.4,h*.04],[r*.34,h*.08],[r*.22,h*.08]],gold,48);for(let i=0;i<16;i++){const a=i*Math.PI/8;radialPipe(bodyR*1.05,-h*.08,h*.24,a,steel,.035);}band(bodyR*1.04,h*.22,.06,orange);}
   else if(dart){lathe([[r*.05,-h*.5],[r*.24,-h*.48],[r*.52,-h*.18],[r*.7,-h*.08],[r*.58,h*.12],[r*.35,h*.18],[0,h*.18]],steel,48);band(r*.6,-h*.12,.06,gold);}
   else{
    for(let k=0;k<cluster;k++){
     const a=k*Math.PI*2/cluster,x=cluster===1?0:Math.cos(a)*r*.38,z=cluster===1?0:Math.sin(a)*r*.38,nr=cluster===4?r*.34:cluster===2?r*.42:r*.68;
     const profile=[[nr*.22,-h*.58],[nr*.3,-h*.55],[nr*.48,-h*.4],[nr*.72,-h*.2],[nr*.92,-h*.06],[nr,-h*.025],[nr*.94,-h*.0],[nr*.82,-h*.04],[nr*.68,-h*.13],[nr*.48,-h*.34],[nr*.3,-h*.52],[nr*.22,-h*.58]];
     lathe(profile,steel,48,[x,0,z]);
     const throat=add(new THREE.CircleGeometry(nr*.56,32),black,[x,-h*.565,z],[Math.PI/2,0,0]);
     const rim=add(new THREE.TorusGeometry(nr*.93,.045,10,40),aluminium,[x,-h*.055,z],[Math.PI/2,0,0]);
     for(let j=0;j<8;j++){const aa=j*Math.PI/4;bolt(x+Math.cos(aa)*nr*.85,-h*.08,z+Math.sin(aa)*nr*.85,.022,gold);}
     for(let j=0;j<3;j++){const aa=j*Math.PI*2/3;radialPipe(nr*.86,-h*.08,-h*.36,aa,aluminium,.018);}
    }
    if(vector){for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(r*.72,-h*.02,h*.27,a,gold,.04);}}
    if(poodle){for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.7,-h*.03,h*.24,a,aluminium,.035);}}
    if(rapier){band(bodyR*1.02,h*.1,.055,orange);for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(bodyR*1.03,-h*.05,h*.27,a,gold,.025);}}
   }
   // Engine mounting flange, gimbal bearing, feed lines and actuator hardware.
   for(const y of [-h*.105,-h*.075])band(bodyR*.96,y,.026,y<0?gold:aluminium);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;const x=Math.cos(a)*bodyR*.99,z=Math.sin(a)*bodyR*.99;bolt(x,h*.23,z,.018,aluminium);}
   for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(bodyR*1.015,-h*.02,h*.24,a,i%2?steel:aluminium,.018);}
   const gimbalRing=add(new THREE.TorusGeometry(bodyR*.56,.045,10,48),gold,[0,-h*.17,0],[Math.PI/2,0,0]);
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*bodyR*.72,z=Math.sin(a)*bodyR*.72;tube([[x,h*.12,z],[x*1.12,-h*.02,z*1.12],[x*.9,-h*.2,z*.9]],.022,aluminium);}
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*bodyR*.82,z=Math.sin(a)*bodyR*.82;box(bodyR*.16,h*.11,bodyR*.12,steel,[x,h*.04,z],[0,-a,0]);}
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*bodyR*.68,z=Math.sin(a)*bodyR*.68;const actuator=tube([[x,h*.05,z],[x*1.08,-h*.08,z*1.08],[x*.92,-h*.19,z*.92]],.012,gold);actuator.name='engine-gimbal-actuator';}
  }
 };
 const makePod=()=>{
  const inline=id.includes('inline'),lander=id.includes('lander'),cupola=id.includes('cupola'),mk2=id.includes('mk2'),mk3=id.includes('mk3'),mk13=id.includes('mk13')||/mk1-3|mk1 3/.test((id+' '+name).toLowerCase()),seat=id==='seat',aircraft=id.includes('aircraft');
  const crewCabin=/^crew-|crew cabin|crew container|乗員収容|客室/.test(id+' '+name.toLowerCase());
  const kv=/mh-kv[123]|onion|pomegranate|ピー/.test(id+' '+name.toLowerCase());
  const mem=/munar|mem/.test(id+' '+name.toLowerCase());
  const command=/command|コマンドポッド|mk1 pod/.test(id+' '+name.toLowerCase())||mk13;
  const wideCrew=crewCabin&&(mk2||mk3||id.includes('ppd10'));
  const rr=mk3?r*.78:mk2||mk13||mem?r*.84:r*.7;
  if(seat){
   lathe([[0,-h*.22],[r*.58,-h*.22],[r*.7,-h*.1],[r*.7,h*.12],[r*.58,h*.22],[0,h*.22]],steel,32);
   const back=box(r*1.25,h*.82,.12,ivory,[0,h*.5,-r*.28]);back.rotation.x=-.14;
   for(let x of [-1,1])tube([[x*r*.38,h*.55,-r*.2],[x*r*.32,h*.2,r*.35],[x*r*.22,-h*.12,r*.3]],.035,gold);
   for(let y=0;y<4;y++)box(r*.7,.025,.035,orange,[0,h*(.15+y*.12),-r*.34]);
   return;
  }
  if(crewCabin){
   const cabinR=mk3?r*.9:mk2?r*.92:r*.88;
   const profile=mk3?
    [[0,-h*.5],[cabinR*.86,-h*.5],[cabinR,-h*.44],[cabinR,h*.44],[cabinR*.86,h*.5],[0,h*.5]]:
    [[0,-h*.5],[cabinR*.82,-h*.5],[cabinR,-h*.4],[cabinR,h*.4],[cabinR*.82,h*.5],[0,h*.5]];
   lathe(profile,painted(mk3?'#d5d8d5':'#d9d9d0','#b68b4e',mk3?'MK3 CREW HABITAT':'CREW PRESSURE CABIN',name),72);
   for(const y of [-h*.44,-h*.32,h*.32,h*.44])band(cabinR*.99,y,.035,y<0?steel:gold);
   // Recessed longitudinal shell panels and structural stringers.
   for(let i=0;i<12;i++){
    const ang=i*Math.PI/6;
    radialPipe(cabinR*.99,-h*.36,h*.36,ang,i%3===0?aluminium:steel,i%3===0?.022:.012);
   }
   const rows=mk3?3:2,cols=mk3?6:4;
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const ang=(col-(cols-1)/2)*.34,radAng=ang+(inline?Math.PI/2:0);
    const x=Math.sin(radAng)*cabinR*.91,z=Math.cos(radAng)*cabinR*.91,y=(row-(rows-1)/2)*h*.22;
    sphere(cabinR*.105,steel,[x,y,z],[1,1,.24]);
    sphere(cabinR*.078,glass,[x,y,z+cabinR*.025],[1,1,.22]);
   }
   // Full-height side hatch, recessed handle and ladder rails.
   const hatchZ=-cabinR*.91;
   box(cabinR*.38,h*.42,.035,dark,[0,-h*.03,hatchZ]);
   box(cabinR*.32,h*.36,.025,ivory,[0,-h*.03,hatchZ-.018]);
   for(const x of [-1,1]){
    tube([[x*cabinR*.2,-h*.3,hatchZ-.04],[x*cabinR*.2,h*.28,hatchZ-.04]],.018,steel);
    for(let j=0;j<5;j++)tube([[-cabinR*.18,-h*.23+j*h*.105,hatchZ-.055],[cabinR*.18,-h*.23+j*h*.105,hatchZ-.055]],.018,gold);
   }
   for(let i=0;i<16;i++){const ang=i*Math.PI/8;bolt(cabinR*.99*Math.cos(ang),-h*.43,cabinR*.99*Math.sin(ang),.018,gold);}
   box(cabinR*.55,.08,.05,steel,[0,h*.48,0]);
   radialLabel(cabinR*1.002,0,cabinR*.56,h*.14,getLabelMaterial());
   return;
  }
  if(kv){
   const tier=/kv1|onion/.test(id+' '+name.toLowerCase())?1:/kv2|ピー/.test(id+' '+name.toLowerCase())?2:3;
   const shell=painted('#c9cbc4','#b68b4e','ATMOSPHERIC RETURN CAPSULE',name);
   const profile=tier===1?
    [[0,-h*.5],[rr*.72,-h*.5],[rr*.94,-h*.38],[rr,h*.04],[rr*.82,h*.24],[rr*.55,h*.4],[rr*.25,h*.47],[0,h*.48]]:
    tier===2?
    [[0,-h*.5],[rr*.76,-h*.5],[rr*.98,-h*.4],[rr,h*.08],[rr*.91,h*.28],[rr*.68,h*.43],[rr*.32,h*.49],[0,h*.5]]:
    [[0,-h*.5],[rr*.8,-h*.5],[rr,h*.42],[rr*.82,h*.49],[rr*.35,h*.5],[0,h*.5]];
   lathe(profile,shell,64);
   band(rr*.99,-h*.43,.055,gold);band(rr*.96,-h*.32,.025,steel);
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;radialPipe(rr*.99,-h*.28,h*.3,ang,steel,.018);}
   const winCount=tier;
   for(let i=0;i<winCount;i++){
    const ang=(i-(winCount-1)/2)*.72,x=Math.sin(ang)*rr*.72,z=Math.cos(ang)*rr*.72,y=h*.08;
    sphere(rr*.19,steel,[x,y,z],[1,.88,.24]);sphere(rr*.145,glass,[x,y,z+rr*.035],[1,.88,.22]);
   }
   // Ablative lower skirt, service access, and top attachment collar.
   lathe([[0,-h*.5],[rr*.82,-h*.5],[rr*.86,-h*.42],[rr*.8,-h*.34],[0,-h*.34]],M(0x4b4b46,.12,.94),64);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(rr*.84*Math.cos(ang),-h*.39,rr*.84*Math.sin(ang),.025,gold);}
   band(rr*.38,h*.47,.045,aluminium);
   radialLabel(rr*1.002,-h*.12,rr*.6,h*.13,getLabelMaterial());
   return;
  }
  if(mem){
   lathe([[0,-h*.5],[rr*.7,-h*.5],[rr*.94,-h*.38],[rr,h*.12],[rr*.88,h*.28],[rr*.62,h*.43],[rr*.3,h*.49],[0,h*.5]],painted('#d6d8d1','#b68b4e','MUNAR EXCURSION MODULE',name),72);
   band(rr*.98,-h*.42,.05,gold);band(rr*.94,h*.3,.035,steel);
   for(let i=0;i<2;i++){
    const ang=(i-.5)*.7,x=Math.sin(ang)*rr*.8,z=Math.cos(ang)*rr*.8;
    sphere(rr*.2,steel,[x,h*.04,z],[1,.9,.25]);sphere(rr*.15,glass,[x,h*.04,z+rr*.035],[1,.9,.22]);
   }
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;radialPipe(rr*.96,-h*.34,h*.25,ang,aluminium,.016);}
   lathe([[0,h*.36],[rr*.32,h*.36],[rr*.38,h*.44],[rr*.24,h*.5],[0,h*.5]],steel,48);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(rr*.94*Math.cos(ang),-h*.4,rr*.94*Math.sin(ang),.02,gold);}
   return;
  }
  if(lander){
   // Mk1/Mk2 lander cans are faceted, boxy pressure vessels rather than smooth cones.
   const sides=8,body=new THREE.Mesh(new THREE.CylinderGeometry(rr*.91,rr, h*.68,sides,1,false),painted('#c5c6bd','#b68b4e','LANDER CAN',name));
   body.position.y=-h*.02;body.castShadow=true;body.receiveShadow=true;g.add(body);
   const cap=add(new THREE.CylinderGeometry(rr*.72,rr*.91,h*.18,sides,1,false),ivory,[0,h*.41,0]);
   band(rr*.99,-h*.37,.05,gold);band(rr*.93,h*.32,.035,steel);
   for(let i=0;i<sides;i++){
    const ang=i*Math.PI*2/sides;
    radialPipe(rr*.99,-h*.3,h*.25,ang,i%2?aluminium:steel,.022);
   }
   for(let i=0;i<4;i++){
    const ang=(i-.5)*.58,x=Math.sin(ang)*rr*.79,z=Math.cos(ang)*rr*.79;
    sphere(rr*.18,steel,[x,h*.08,z],[1,.9,.22]);sphere(rr*.135,glass,[x,h*.08,z+rr*.03],[1,.9,.2]);
   }
   const hatchZ=-rr*.99;
   box(rr*.42,h*.38,.045,dark,[0,-h*.02,hatchZ]);
   box(rr*.35,h*.31,.025,ivory,[0,-h*.02,hatchZ-.025]);
   for(let j=0;j<5;j++)tube([[-rr*.18,-h*.25+j*h*.09,hatchZ-.05],[rr*.18,-h*.25+j*h*.09,hatchZ-.05]],.018,gold);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;const x=Math.cos(ang)*rr*1.28,z=Math.sin(ang)*rr*1.28;tube([[Math.cos(ang)*rr*.8,-h*.2,Math.sin(ang)*rr*.8],[x,-h*.08,z],[x,-h*.47,z]],.035,aluminium);}
  }
  else if(cupola){
   lathe([[0,-h*.5],[rr*.7,-h*.5],[rr,-h*.36],[rr,h*.12],[rr*.95,h*.25],[rr*.8,h*.42],[rr*.52,h*.5],[0,h*.5]],painted('#d9d9d0','#b68b4e','CUPOLA PRESSURE SHELL',name),72);
   // The Cupola's unmistakable hemispherical crown and ring of radial windows.
   sphere(rr*.98,ivory,[0,h*.38,0],[1,.45,1]);
   for(let i=0;i<8;i++){
    const ang=i*Math.PI/4,x=Math.sin(ang)*rr*.74,z=Math.cos(ang)*rr*.74;
    sphere(rr*.205,steel,[x,h*.17,z],[1,.88,.22]);sphere(rr*.16,glass,[x,h*.17,z+rr*.035],[1,.86,.2]);
    radialPipe(rr*.91,h*.1,h*.4,ang,aluminium,.022);
   }
   band(rr*.98,h*.1,.045,gold);
  }
  else if(aircraft){
   lathe([[0,-h*.5],[rr*.8,-h*.5],[rr,-h*.4],[rr*.95,h*.2],[rr*.72,h*.42],[rr*.5,h*.5],[0,h*.5]],painted('#d9d9d0','#b68b4e','COCKPIT PRESSURE SHELL',name),64);
   const canopy=add(new THREE.SphereGeometry(rr*.68,32,20,0,Math.PI*2,0,Math.PI/2),glass,[0,h*.36,0]);canopy.scale.set(1,.85,1);
   for(let side of [-1,1])tube([[side*rr*.56,h*.18,0],[side*rr*.42,h*.42,0],[0,h*.5,0]],.025,aluminium);
  }
  else{
   // Standard Mk1 and multi-seat command capsules: tapered alloy shell, segmented heat skirt.
   const profile=mk13?
    [[0,-h*.5],[rr*.78,-h*.5],[rr*.96,-h*.4],[rr,h*.08],[rr*.9,h*.25],[rr*.65,h*.42],[rr*.32,h*.49],[0,h*.5]]:
    [[0,-h*.5],[rr*.72,-h*.5],[rr*.94,-h*.4],[rr,h*.12],[rr*.86,h*.31],[rr*.56,h*.46],[rr*.26,h*.5],[0,h*.5]];
   lathe(profile,painted('#cfd1cb','#b68b4e','COMMAND MODULE',name),96);
   // Deep lower heat shield, machined retaining rings and a raised docking collar.
   lathe([[0,-h*.5],[rr*.9,-h*.5],[rr*.96,-h*.43],[rr*.88,-h*.34],[0,-h*.34]],M(0x55534e,.18,.93),72);
   band(rr*.98,-h*.4,.055,gold);band(rr*.96,h*.2,.035,steel);band(rr*.34,h*.48,.035,aluminium);
   // Alternating bright shell panels and dark recessed longitudinal seams.
   const ribCount=mk13?12:10;
   for(let i=0;i<ribCount;i++){
    const ang=i*Math.PI*2/ribCount;
    radialPipe(rr*.985,-h*.32,h*.25,ang,i%3===0?ivory:steel,i%3===0?.025:.012);
    if(i%3===0)radialPipe(rr*1.002,-h*.28,h*.2,ang,aluminium,.008);
   }
   const windows=mk13?5:3;
   for(let i=0;i<windows;i++){
    const ang=(i-(windows-1)/2)*.54,x=Math.sin(ang)*rr*.77,z=Math.cos(ang)*rr*.77,y=h*.08;
    sphere(rr*.18,steel,[x,y,z],[1,.9,.24]);sphere(rr*.135,glass,[x,y,z+rr*.035],[1,.9,.22]);
    add(new THREE.SphereGeometry(rr*.035,12,8),M(0xb7d7e0,.18,.16,{emissive:0x25495a,emissiveIntensity:.3}),[x-rr*.04,y+rr*.035,z+rr*.065]);
   }
   // Offset side hatch with hinge barrels, grab handles and a short external ladder.
   const hatchX=rr*.42,hatchZ=-rr*.86;
   box(rr*.38,h*.34,.035,dark,[hatchX,-h*.03,hatchZ]);
   box(rr*.31,h*.28,.025,ivory,[hatchX,-h*.03,hatchZ-.02]);
   for(let side of [-1,1]){
    tube([[hatchX+side*rr*.2,-h*.22,hatchZ-.045],[hatchX+side*rr*.2,h*.16,hatchZ-.045]],.018,steel);
    for(let j=0;j<4;j++)tube([[hatchX-rr*.16,-h*.18+j*h*.1,hatchZ-.055],[hatchX+rr*.16,-h*.18+j*h*.1,hatchZ-.055]],.016,gold);
   }
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;bolt(rr*.96*Math.cos(ang),-h*.39,rr*.96*Math.sin(ang),.02,gold);}
  }
  if(!cupola&&!aircraft&&!crewCabin){
   // Lower connection flange with a visible stack interface and fastening bolts.
   cyl(rr*.78,rr*.84,.11,steel,-h*.49,64);band(rr*.84,-h*.47,.045,orange);
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;bolt(rr*.8*Math.cos(ang),-h*.47,rr*.8*Math.sin(ang),.018,aluminium);}
  }
  // Shared inspection plates and small service fittings, kept off the main windows.
  const plateZ=rr*.98;
  box(rr*.3,h*.12,.025,dark,[-rr*.48,-h*.27,plateZ]);
  box(rr*.24,h*.025,.012,orange,[-rr*.48,-h*.23,plateZ+.016]);
  for(let i=0;i<4;i++)bolt(-rr*.6+i*rr*.08,-h*.31,plateZ+.018,.012,aluminium);
  if(!cupola&&!aircraft&&!crewCabin){
   for(let side of [-1,1]){
    tube([[side*rr*.72,-h*.28,plateZ*.82],[side*rr*.72,-h*.05,plateZ*.9],[side*rr*.72,h*.18,plateZ*.82]],.018,gold);
   }
  }
 };
 const makeProbe=()=>{
  const oct=id.includes('okto')||id.includes('hecs'),flat=id.includes('stayputnik'),qbe=id.includes('qbe'),rover=id.includes('rovemate'),rcl=id.includes('rcl');
  if(flat){lathe([[0,-h*.18],[r*.78,-h*.18],[r*.95,-h*.08],[r*.95,h*.08],[r*.78,h*.18],[0,h*.18]],painted('#d9d9d0','#b68b4e','PROBE CORE'),48);band(r*.94,h*.12,.04,gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.9,-h*.12,h*.12,a,steel,.025);}}
  else if(oct||qbe||rover){const n=oct?8:4,shape=new THREE.CylinderGeometry(r*.92,r*.92,h*.75,n,1,false);add(shape,oct?M(0xb8b9b0,.42,.55):ivory,[0,0,0]);band(r*.9,h*.38,.045,gold);band(r*.9,-h*.38,.045,steel);for(let i=0;i<n;i++){const a=i*Math.PI*2/n;const x=Math.cos(a)*r*.66,z=Math.sin(a)*r*.66;bolt(x,h*.28,z,.035,gold);}}
  else{lathe([[0,-h*.5],[r*.78,-h*.5],[r,h*.36],[r*.78,h*.5],[0,h*.5]],ivory,8);band(r*.98,h*.38,.04,gold);}
  const domeR=r*.26;sphere(domeR,gold,[0,h*.46,0]);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;radialPipe(r*.62,h*.2,h*.72,a,aluminium,.025);}
  if(rcl){for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*1.25,z=Math.sin(a)*r*1.25;box(r*.48,.055,r*.36,blue,[x,h*.12,z]);}}
  if(rover){for(let i=0;i<4;i++){const x=i%2?1:-1,z=i<2?1:-1;const leg=box(.08,h*.65,.08,steel,[x*r*.78,-h*.4,z*r*.78]);leg.rotation.z=x*.3;}}
  radialLabel(r*.94,0,r*.65,h*.2,getLabelMaterial());
 };
 const makeWing=()=>{
  const vertical=type==='tail'||id.includes('rudder')||id.includes('winglet'),delta=id.includes('delta'),swept=id.includes('swept')||id.includes('strake'),small=id.includes('small')||id.includes('struct-d');
  const span=r*(small?.82:1.15),chord=vertical?h*.85:h*1.15,root=chord*(delta?1.5:1),tip=chord*(delta?.2:swept?.48:.62);
  const shape=new THREE.Shape();shape.moveTo(-root*.5,0);shape.lineTo(root*.5,0);shape.lineTo(span,tip*.5);shape.lineTo(span*.86,-tip*.5);shape.lineTo(-root*.5,-root*.5);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.09,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:8});
  const wing=add(geo,painted('#c9ceca','#c56b31',vertical?'VERTICAL STABILIZER':'AERO SURFACE'),[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  if(vertical)wing.position.y=h*.12;
  const leading=add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-root*.5,0,.04),new THREE.Vector3(span*.5,tip*.2,.04),new THREE.Vector3(span,0,.04)]),32,.025,8,false),steel,[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  // Flush inspection panels, spanwise ribs and raised hinge hardware.
  for(let i=0;i<5;i++){
   const x=span*(.12+i*.15);
   const rib=box(.012,Math.max(.018,tip*.62),.018,aluminium,[x,.105,.025]);
   if(!vertical)rib.rotation.x=-Math.PI/2;
   for(const side of [-1,1])bolt(x,side*tip*.18,.075,.012,gold);
  }
  const rootCap=box(root*.94,.025,.12,steel,[0,.025,.045]);if(!vertical)rootCap.rotation.x=-Math.PI/2;
  const tipCap=box(.04,tip*.94,.08,aluminium,[span*.96,.02,.04]);if(!vertical)tipCap.rotation.x=-Math.PI/2;
  for(let i=0;i<4;i++){const x=span*(.15+i*.16);const line=box(.018,.015,.075,gold,[x,.1,.02]);if(!vertical)line.rotation.x=-Math.PI/2;}
  if(type==='control'||id.includes('elevon')||id.includes('rudder')){
   const hinge=box(span*.52,.055,.12,dark,[span*.43,.04,.1]);if(!vertical)hinge.rotation.x=-Math.PI/2;
   for(let i=0;i<5;i++){bolt(span*(.2+i*.12),.09,.16,.018);}
   for(let i=0;i<4;i++){const x=span*(.24+i*.13);const actuator=tube([[x,.06,.08],[x+span*.04,.14,.16],[x+span*.08,.08,.2]],.014,gold);}
  }
 };
 const makeSolar=()=>{
  const large=id.includes('xl')||id.includes('sp10')||id.includes('gigantor'),fixed=id.includes('ox-stat'),count=id.includes('ox4')?2:large?4:2,w=large?1.45:fixed?.92:1.05,depth=large?1.35:1.0;
  const textureKey='solar-cells-ksp1-v1';
  let cellTexture=PART_SKIN_CACHE.get(textureKey);
  if(!cellTexture){
   const c=document.createElement('canvas');c.width=512;c.height=512;const q=c.getContext('2d');
   const grad=q.createLinearGradient(0,0,512,512);grad.addColorStop(0,'#285b83');grad.addColorStop(.45,'#12395f');grad.addColorStop(1,'#09233f');q.fillStyle=grad;q.fillRect(0,0,512,512);
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){
    const px=x*64+3,py=y*64+3;q.fillStyle=(x+y)%2?'#17466f':'#1c527e';q.fillRect(px,py,58,58);
    q.strokeStyle='rgba(153,198,220,.42)';q.lineWidth=2;q.strokeRect(px+2,py+2,54,54);
    q.fillStyle='rgba(210,232,239,.22)';q.fillRect(px+7,py+7,2,44);q.fillRect(px+7,py+7,44,2);
   }
   q.fillStyle='rgba(206,227,237,.52)';q.fillRect(0,0,512,5);q.fillRect(0,0,5,512);
   q.fillStyle='rgba(255,255,255,.10)';q.beginPath();q.moveTo(0,0);q.lineTo(512,0);q.lineTo(512,80);q.closePath();q.fill();
   cellTexture=new THREE.CanvasTexture(c);cellTexture.colorSpace=THREE.SRGBColorSpace;cellTexture.anisotropy=8;PART_SKIN_CACHE.set(textureKey,cellTexture);
  }
  cyl(.16,.2,.32,aluminium,h*.18,24);band(.18,h*.18,.035,gold);
  for(let side of [-1,1]){
   const x=side*(w*.65),panelMat=M(0xffffff,.66,.24,{map:cellTexture,emissive:0x061525,emissiveIntensity:.08});
   box(w,.045,depth,panelMat,[x,h*.18,0]);
   // Real panel frame, perimeter rails and electrical bus bars.
   for(let z of [-depth*.5,depth*.5])box(w*1.02,.055,.035,aluminium,[x,h*.18,z]);
   for(let xx of [-w*.5,w*.5])box(.035,.055,depth,aluminium,[x+xx,h*.18,0]);
   for(let j=1;j<4;j++)box(w*.94,.014,.018,M(0x8db8d1,.55,.28),[x,h*.207,-depth*.5+depth*j/4]);
   const hinge=add(new THREE.CylinderGeometry(.055,.055,w*.16,16),gold,[side*w*.13,h*.18,0],[0,0,Math.PI/2]);
   for(let z of [-depth*.36,depth*.36])bolt(x,h*.22,z,.018,steel);
  }
  if(fixed){box(.08,.07,depth*1.08,steel,[0,h*.18,0]);}
  else{for(let side of [-1,1])tube([[0,h*.18,0],[side*w*.4,h*.18,.1],[side*w*.72,h*.18,.12]],.035,aluminium);}
 };
 const makeParachute=()=>{
  const rad=r*.76;lathe([[0,-h*.5],[rad*.75,-h*.5],[rad,-h*.36],[rad,h*.25],[rad*.86,h*.5],[0,h*.5]],ivory,48);
  band(rad,h*.34,.045,gold);cyl(rad*.56,rad*.56,.1,orange,h*.49,32);
  const rig=new THREE.Group();rig.name='parachute-rig';rig.visible=false;
  const canopy=new THREE.Group();canopy.name='parachute-canopy';canopy.position.y=h*1.35;canopy.scale.setScalar(.04);
  const canopyR=r*2.1,canopyH=r*.72;
  const geo=new THREE.SphereGeometry(canopyR,64,24,0,Math.PI*2,0,Math.PI/2);
  const clothA=M(0xd6d2c2,.05,.88,{side:THREE.DoubleSide}),clothB=M(0xc86b3b,.04,.86,{side:THREE.DoubleSide});
  for(let i=0;i<16;i++){const a=i*Math.PI/8;const panel=new THREE.Mesh(new THREE.SphereGeometry(canopyR,16,12,a,Math.PI/8,0,Math.PI/2),i%2?clothA:clothB);panel.scale.set(1,canopyH/canopyR,1);panel.castShadow=true;canopy.add(panel);}
  rig.add(canopy);
  for(let i=0;i<12;i++){const a=i*Math.PI/6,start=new THREE.Vector3(Math.cos(a)*r*.18,h*.62,Math.sin(a)*r*.18),end=new THREE.Vector3(Math.cos(a)*canopyR*.92,h*1.35,Math.sin(a)*canopyR*.92),dir=end.clone().sub(start),line=add(new THREE.CylinderGeometry(.008,.008,dir.length(),6),gold,[0,0,0]);line.position.copy(start).add(end).multiplyScalar(.5);line.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());rig.add(line);}
  g.add(rig);
 };
 const makeBattery=()=>{
  const wheel=id.includes('wheel'),fuelcell=id.includes('fuelcell'),rad=r*.82;
  lathe([[0,-h*.42],[rad*.72,-h*.42],[rad,-h*.32],[rad,h*.32],[rad*.72,h*.42],[0,h*.42]],fuelcell?M(0x788879,.5,.55):ivory,48);
  band(rad,h*.3,.035,steel);band(rad,-h*.3,.035,gold);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(rad*.99,-h*.25,h*.25,a,aluminium,.018);}
  if(wheel){const rr=rad*.55;band(rr,0,.09,gold);cyl(rr*.55,rr*.55,.12,steel,0,32);for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(rr*.8,-h*.15,h*.15,a,aluminium,.02);}}
  radialLabel(rad*1.01,0,rad*.7,h*.24,getLabelMaterial());
 };
 const makeScience=()=>{
  const nm=name.toLowerCase();
  if(/goo|グー/.test(nm)){lathe([[0,-h*.35],[r*.68,-h*.35],[r*.78,-h*.2],[r*.78,h*.24],[r*.55,h*.38],[0,h*.38]],ivory,48);sphere(r*.42,M(0x879b75,.08,.24),[0,h*.35,0],[1,.8,1]);band(r*.78,-h*.2,.035,gold);}
  else if(/thermo|barometer|温度計|気圧計/.test(nm)){lathe([[0,-h*.4],[r*.6,-h*.4],[r*.72,-h*.3],[r*.72,h*.25],[r*.55,h*.4],[0,h*.4]],steel,40);sphere(r*.22,orange,[0,h*.52,0]);for(let i=0;i<5;i++)box(r*.55,.018,.018,ivory,[0,h*(.1+i*.07),r*.7]);}
  else if(/scan|スキャン|gravioli|加速度|地震/.test(nm)){lathe([[0,-h*.35],[r*.7,-h*.35],[r*.85,-h*.2],[r*.85,h*.22],[r*.7,h*.35],[0,h*.35]],ivory,40);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;tube([[Math.cos(a)*r*.55,h*.15,Math.sin(a)*r*.55],[Math.cos(a)*r*.95,h*.6,Math.sin(a)*r*.95],[Math.cos(a)*r*.75,h*.82,Math.sin(a)*r*.75]],.035,aluminium);}sphere(r*.16,gold,[0,h*.82,0]);}
  else if(/telescope|望遠鏡/.test(nm)){lathe([[0,-h*.35],[r*.34,-h*.35],[r*.4,-h*.2],[r*.3,h*.65],[r*.42,h*.8],[r*.28,h*.9],[0,h*.9]],steel,40);band(r*.4,h*.7,.04,gold);sphere(r*.26,glass,[0,h*.9,0],[1,.3,1]);}
  else{lathe([[0,-h*.45],[r*.72,-h*.45],[r*.85,-h*.3],[r*.85,h*.35],[r*.7,h*.45],[0,h*.45]],painted('#d9d9d0','#b68b4e','SCIENCE INSTRUMENT'),48);band(r*.85,h*.32,.035,gold);for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*.58,z=Math.sin(a)*r*.58;box(r*.18,h*.62,.08,steel,[x,h*.15,z]);}radialLabel(r*.86,0,r*.68,h*.22,getLabelMaterial());}
 };
 const makeDecoupler=()=>{
  const adapter=id.includes('adapter'),tri=id.includes('tri'),quad=id.includes('quad'),bi=id.includes('bi'),strut=id.includes('strut')||id.includes('hardpoint')||id.includes('pylon'),hub=id.includes('hubmax');
  if(strut){if(id.includes('cubic')){const shape=new THREE.OctahedronGeometry(r*.7,0);add(shape,aluminium);}else{const beam=box(r*1.7,.12,r*.5,steel);box(.12,r*1.7,r*.5,aluminium);for(let x of [-1,1])for(let z of [-1,1])bolt(x*r*.72,0,z*r*.3,.05,gold);}return;}
  if(hub){cyl(r*.9,r*.9,h*.65,steel);for(let i=0;i<6;i++){const a=i*Math.PI/3;const x=Math.cos(a)*r*.86,z=Math.sin(a)*r*.86;const p=lathe([[0,-h*.18],[r*.18,-h*.18],[r*.2,h*.18],[0,h*.18]],aluminium,24,[x,0,z]);}band(r*.9,h*.32,.05,gold);return;}
  lathe([[0,-h*.5],[r*.76,-h*.5],[r*.96,-h*.4],[r,-h*.25],[r,h*.25],[r*.94,h*.4],[r*.75,h*.5],[0,h*.5]],steel,64);
  band(r*.98,h*.42,.045,aluminium);band(r*.98,-h*.42,.045,gold);band(r*.78,0,.035,dark);detailRivets(r*.92,-h*.22,16);detailRivets(r*.92,h*.22,16,.1);
  if(adapter){lathe([[0,h*.12],[r*.5,h*.12],[r*.55,h*.22],[r*.85,h*.48],[r*.95,h*.5],[0,h*.5]],ivory,64);band(r*.55,h*.22,.035,gold);}
  if(tri||quad||bi){const n=tri?3:quad?4:2;for(let i=0;i<n;i++){const a=i*Math.PI*2/n,x=Math.cos(a)*r*.58,z=Math.sin(a)*r*.58;lathe([[0,h*.12],[r*.22,h*.12],[r*.24,h*.48],[0,h*.48]],aluminium,32,[x,0,z]);band(r*.23,h*.46,.025,gold).position.set(x,h*.46,z);}}
 };
 const makeM1TireTexture=()=>{
  if(PART_SKIN_CACHE.has('rovemax-m1-tire'))return PART_SKIN_CACHE.get('rovemax-m1-tire');
  const c=document.createElement('canvas');c.width=512;c.height=256;const q=c.getContext('2d');
  q.fillStyle='#b9ad8c';q.fillRect(0,0,512,256);
  const shade=q.createLinearGradient(0,0,512,256);shade.addColorStop(0,'rgba(255,255,255,.16)');shade.addColorStop(.5,'rgba(80,70,50,.02)');shade.addColorStop(1,'rgba(25,25,20,.22)');q.fillStyle=shade;q.fillRect(0,0,512,256);
  // The stock M1 has a fine, orthogonal moulded grid rather than aircraft-style lugs.
  q.strokeStyle='rgba(66,62,49,.34)';q.lineWidth=2;
  for(let x=0;x<=512;x+=32){q.beginPath();q.moveTo(x,0);q.lineTo(x,256);q.stroke();}
  for(let y=0;y<=256;y+=32){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}
  q.strokeStyle='rgba(238,229,202,.18)';q.lineWidth=1;
  for(let x=16;x<512;x+=32){q.beginPath();q.moveTo(x,0);q.lineTo(x,256);q.stroke();}
  for(let y=16;y<256;y+=32){q.beginPath();q.moveTo(0,y);q.lineTo(512,y);q.stroke();}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;
  PART_SKIN_CACHE.set('rovemax-m1-tire',t);return t;
 };
 const makeRollingWheel=(radius,width,at=[0,0,0],variant='rover')=>{
  const wheel=new THREE.Group();wheel.name='wheel-spin';wheel.position.set(...at);wheel.userData.rollRadius=radius;wheel.userData.rollAxis='x';g.add(wheel);
  const wheelId=(id+' '+name).toLowerCase(),m1=/m1|rovermax.?model.?1/.test(wheelId),rugged=/tr-2l|xl3|rugged|large/.test(wheelId),small=/s2|small|tiny/.test(wheelId),aircraft=variant==='aircraft';
  const tireMat=m1?M(0xffffff,.01,.98,{map:makeM1TireTexture()}):M(0x17191b,.015,.99),sideMat=M(m1?0xb9ad8c:0x24282a,.04,.92),rimMat=M(m1?0xb9b9b2:0x9ca6a8,.84,.27),rimDark=M(0x343d42,.72,.38),hubMat=M(m1?0x858b8b:0x68747a,.82,.3),boltMat=M(0xb6bfbd,.88,.24),rubberInset=M(m1?0x8f856c:0x101416,.02,.98);
  const section=aircraft?.17:m1?.24:rugged?.235:.205;
  // Rounded pneumatic tyre carcass with a broad, continuous shoulder.
  const carcass=new THREE.Mesh(new THREE.TorusGeometry(radius*(1-section),radius*section,32,96),tireMat);
  carcass.rotation.y=Math.PI/2;carcass.castShadow=true;carcass.receiveShadow=true;wheel.add(carcass);
  // Sidewall shoulders and concentric moulded rings.
  for(const side of [-1,1]){
   const faceX=side*width*.34;
   const shoulder=new THREE.Mesh(new THREE.TorusGeometry(radius*.77,radius*.035,12,80),sideMat);
   shoulder.rotation.y=Math.PI/2;shoulder.position.x=faceX;wheel.add(shoulder);
   for(const rr of [.55,.64,.72]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(radius*rr,radius*.012,8,64),sideMat);
    ring.rotation.y=Math.PI/2;ring.position.x=side*width*.405;wheel.add(ring);
   }
   // Recessed metal wheel dish and inset dark well.
   const dish=new THREE.Mesh(new THREE.CylinderGeometry(radius*.57,radius*.57,width*.19,64),rimDark);
   dish.rotation.z=Math.PI/2;dish.position.x=side*width*.34;wheel.add(dish);
   const rim=new THREE.Mesh(new THREE.CylinderGeometry(radius*.49,radius*.49,width*.205,64),rimMat);
   rim.rotation.z=Math.PI/2;rim.position.x=side*width*.405;wheel.add(rim);
   const inset=new THREE.Mesh(new THREE.CylinderGeometry(radius*.39,radius*.39,width*.214,64),rimDark);
   inset.rotation.z=Math.PI/2;inset.position.x=side*width*.42;wheel.add(inset);
   const hub=new THREE.Mesh(new THREE.CylinderGeometry(radius*.22,radius*.22,width*.24,48),hubMat);
   hub.rotation.z=Math.PI/2;hub.position.x=side*width*.47;wheel.add(hub);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(radius*.115,radius*.115,width*.25,40),rimMat);
   cap.rotation.z=Math.PI/2;cap.position.x=side*width*.49;wheel.add(cap);
   // Evenly spaced recessed lug nuts around the hub.
   for(let i=0;i<10;i++){
    const a=i*Math.PI/5,y=Math.cos(a)*radius*.34,z=Math.sin(a)*radius*.34;
    const nut=new THREE.Mesh(new THREE.CylinderGeometry(radius*.027,radius*.027,width*.035,8),boltMat);
    nut.rotation.set(Math.PI/2,0,Math.PI/2);nut.position.set(side*width*.49,y,z);wheel.add(nut);
   }
   // Tiny moulded sidewall lettering/size marks.
   const mark=new THREE.Mesh(new THREE.BoxGeometry(width*.012,radius*.19,radius*.035),rubberInset);
   mark.position.set(side*width*.445,-radius*.69, radius*.12);mark.rotation.x=-.2;wheel.add(mark);
  }
  // Tread blocks are individually modelled and follow the tyre curvature.
  const count=small?32:rugged?40:36;
  if(!m1)for(let i=0;i<count;i++){
   const a=i*Math.PI*2/count;
   if(rugged){
    for(const side of [-1,1]){
     const lug=new THREE.Mesh(new THREE.BoxGeometry(width*.48,radius*.092,radius*.17),i%2?sideMat:tireMat);
     lug.position.set(side*width*.235,Math.cos(a)*radius*.965,Math.sin(a)*radius*.965);
     lug.rotation.x=a;lug.rotation.z=side*.24*(i%2?1:-1);lug.castShadow=true;wheel.add(lug);
    }
   }else if(/rover/.test(wheelId)){
    const lug=new THREE.Mesh(new THREE.BoxGeometry(width*.88,radius*.09,radius*.145),sideMat);
    lug.position.set(0,Math.cos(a)*radius*.96,Math.sin(a)*radius*.96);
    lug.rotation.x=a;lug.castShadow=true;wheel.add(lug);
   }else{
    const lug=new THREE.Mesh(new THREE.BoxGeometry(width*.9,radius*.075,radius*.12),sideMat);
    lug.position.set(0,Math.cos(a)*radius*.96,Math.sin(a)*radius*.96);
    lug.rotation.x=a;lug.castShadow=true;wheel.add(lug);
   }
  }
  // Sidewall bead and inner bead seat.
  for(const side of [-1,1]){
   const bead=new THREE.Mesh(new THREE.TorusGeometry(radius*.79,radius*.018,8,80),rubberInset);
   bead.rotation.y=Math.PI/2;bead.position.x=side*width*.43;wheel.add(bead);
  }
  return wheel;
 };
 const makeRoverWheel=()=>{
  const rr=Math.max(r*.62,.16),width=Math.max(rr*.48,.09);
  const mount=new THREE.Mesh(new THREE.CylinderGeometry(rr*.17,rr*.17,h*.62,20),steel);mount.position.set(0,h*.32,0);g.add(mount);
  const arm=new THREE.Mesh(new THREE.BoxGeometry(rr*.2,h*.18,rr*.22),aluminium);arm.position.set(0,h*.05,0);g.add(arm);
  makeRollingWheel(rr,width,[0,-h*.08,0],'rover');

 };
 const makeGear=()=>{
  const large=id.includes('large'),legR=large?.075:.052,spread=r*.72;
  // Compact oleo strut housing with a reinforced mounting collar.
  lathe([[0,-h*.42],[r*.34,-h*.42],[r*.48,-h*.28],[r*.48,h*.28],[r*.34,h*.42],[0,h*.42]],steel,40);
  band(r*.49,h*.27,.035,gold);band(r*.49,-h*.27,.025,aluminium);
  for(const side of [-1,1]){
   const pivot=new THREE.Group();pivot.name='landing-gear-pivot';pivot.userData.side=side;pivot.position.set(side*spread*.28,-h*.02,0);g.add(pivot);
   const strutPath=new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,0,0),new THREE.Vector3(side*spread*.22,-h*.16,0),
    new THREE.Vector3(side*spread*.55,-h*.40,0),new THREE.Vector3(side*spread*.70,-h*.61,0)
   ]);
   const main=new THREE.Mesh(new THREE.TubeGeometry(strutPath,24,legR,10,false),aluminium);main.castShadow=true;main.receiveShadow=true;pivot.add(main);
   const bracePath=new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,-h*.04,0),new THREE.Vector3(side*spread*.35,-h*.18,r*.16),
    new THREE.Vector3(side*spread*.67,-h*.48,r*.16)
   ]);
   const brace=new THREE.Mesh(new THREE.TubeGeometry(bracePath,18,legR*.48,8,false),gold);brace.castShadow=true;pivot.add(brace);
   const oleo=new THREE.Mesh(new THREE.CylinderGeometry(legR*.38,legR*.38,h*.25,16),steel);oleo.position.set(side*spread*.39,-h*.28,r*.025);oleo.rotation.z=-side*.62;pivot.add(oleo);
   const wheel=makeRollingWheel(large?r*.34:r*.27,large?.17:.13,[side*spread*.70,-h*.61,0],'aircraft');
   g.remove(wheel);pivot.add(wheel);
   const fork=new THREE.Mesh(new THREE.TorusGeometry(large?r*.35:r*.28,legR*.42,8,48),gold);fork.rotation.y=Math.PI/2;fork.position.set(side*spread*.70,-h*.61,0);pivot.add(fork);
  }
 };
 const makeIntake=()=>{
  const shock=id.includes('shock'),circular=id.includes('circular'),ram=id.includes('ram'),rad=r*.82;
  lathe([[0,-h*.48],[rad*.62,-h*.48],[rad*.94,-h*.3],[rad,h*.22],[rad*.82,h*.48],[rad*.48,h*.5],[0,h*.5]],aluminium,64);
  const inlet=add(new THREE.TorusGeometry(rad*.76,.075,14,48),steel,[0,0,h*.48],[Math.PI/2,0,0]);add(new THREE.CircleGeometry(rad*.67,48),black,[0,0,h*.482],[Math.PI/2,0,0]);
  if(shock){const cone=add(new THREE.ConeGeometry(rad*.34,h*.62,32),steel,[0,0,h*.25],[Math.PI/2,0,0]);}
  else if(ram){for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.025,.025,rad*1.1,[0,0,0],[Math.cos(a)*rad*.5,Math.sin(a)*rad*.5,h*.35],[0,0,a]);}}
  else if(circular){band(rad*.98,h*.42,.055,gold);}
 };
 const makeComm=()=>{
  if(id.includes('dish')||id.includes('dts')){const dish=add(new THREE.SphereGeometry(r*.8,48,24,0,Math.PI*2,0,Math.PI/2),ivory,[0,h*.45,0]);dish.rotation.x=Math.PI;band(r*.78,h*.45,.035,gold);tube([[0,h*.1,0],[0,h*.42,0],[0,h*.7,0]],.025,steel);sphere(.1,black,[0,h*.72,0]);}
  else{lathe([[0,-h*.4],[r*.35,-h*.4],[r*.42,-h*.25],[r*.3,h*.15],[r*.18,h*.2],[0,h*.2]],steel,32);tube([[0,h*.1,0],[0,h*.6,0],[0,h*1.1,0]],.025,aluminium);sphere(.07,gold,[0,h*1.1,0]);for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*.3,z=Math.sin(a)*r*.3;tube([[0,h*.35,0],[x,h*.85,z]],.015,gold);}}
 };
 const makeDock=()=>{
  lathe([[0,-h*.5],[r*.52,-h*.5],[r*.8,-h*.35],[r*.92,-h*.1],[r*.92,h*.18],[r*.82,h*.38],[r*.62,h*.5],[0,h*.5]],aluminium,64);
  band(r*.84,h*.32,.08,gold);band(r*.62,h*.42,.045,steel);cyl(r*.48,r*.48,.08,black,h*.43,48);detailRivets(r*.77,-h*.2,20);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.88,-h*.25,h*.2,a,steel,.035);}
 };
 const makePayload=()=>{
  const nm=name.toLowerCase();
  if(/fairing|フェアリング|防護シェル/.test(nm)){lathe([[0,-h*.5],[r*.9,-h*.5],[r,-h*.38],[r*.98,h*.12],[r*.72,h*.35],[r*.36,h*.48],[0,h*.5]],ivory,64);band(r*.98,-h*.38,.05,gold);for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.98,-h*.32,h*.28,a,steel,.018);}}
  else if(/service bay|サービスベイ/.test(nm)){lathe([[0,-h*.5],[r*.88,-h*.5],[r,-h*.4],[r,h*.4],[r*.88,h*.5],[0,h*.5]],steel,64);for(let y of [-h*.38,h*.38])band(r,y,.045,gold);const hatch=box(r*1.55,h*.68,.08,ivory,[0,0,r*.84]);for(let i=0;i<8;i++)bolt((i-3.5)*r*.18,0,r*.9,.025);}
  else{lathe([[0,-h*.5],[r*.8,-h*.5],[r,-h*.38],[r,h*.38],[r*.8,h*.5],[0,h*.5]],ivory,64);for(let y of [-h*.4,h*.4])band(r,y,.035,gold);radialLabel(r*1.01,0,r*.72,h*.22,getLabelMaterial());}
 };
 const makeThermal=()=>{
  const tileMat=M(0xffffff,.08,.96,{map:makeThermalTileMaterial(THREE)});
  lathe([[0,-h*.5],[r*.72,-h*.5],[r,-h*.34],[r*.94,h*.25],[r*.7,h*.5],[0,h*.5]],tileMat,96);
  band(r*.96,h*.28,.06,gold);band(r*.94,-h*.32,.035,steel);
  for(let i=0;i<24;i++){const a=i*Math.PI/12;radialPipe(r*.95,-h*.28,h*.24,a,steel,.018);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;bolt(Math.cos(a)*r*.96,h*.2,Math.sin(a)*r*.96,.022,aluminium);}
 };
 const makeUtility=()=>{
  if(/launch escape|脱出システム/i.test(name)){for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*.58,z=Math.sin(a)*r*.58;tube([[x,-h*.35,z],[x*1.15,h*.25,z*1.15],[x*.9,h*.5,z*.9]],.045,aluminium);}lathe([[0,h*.25],[r*.28,h*.25],[r*.36,h*.5],[r*.2,h*.92],[0,h]],orange,32);}
  else if(/light|illuminator|照明|ライト/i.test(name)){cyl(r*.38,r*.45,h*.4,steel);band(r*.62,h*.2,.06,gold);sphere(r*.5,glass,[0,h*.3,0],[1,.35,1]);}
  else if(/drill|採掘/.test(name)){lathe([[0,-h*.5],[r*.65,-h*.5],[r*.7,h*.1],[r*.38,h*.35],[r*.12,h*.5],[0,h*.5]],aluminium,40);for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(r*.7,-h*.3,h*.28,a,gold,.035);}}
  else{lathe([[0,-h*.5],[r*.75,-h*.5],[r*.85,-h*.3],[r*.85,h*.35],[r*.7,h*.5],[0,h*.5]],ivory,40);band(r*.84,h*.32,.04,gold);radialLabel(r*.86,0,r*.7,h*.2,getLabelMaterial());}
 };
 const makeNosecone=()=>{
  const heat=id.includes('heat')||/heat shield|耐熱/.test(name.toLowerCase()),small=id.includes('small')||id.includes('tiny'),mk=id.includes('mk7')||id.includes('mk12')||id.includes('mk16');
  const tip=small?.018:r*.035,base=r*.92;
  const profile=heat?[[0,-h*.5],[base*.78,-h*.5],[base,-h*.36],[base*.98,-h*.2],[base*.72,-h*.12],[base*.18,-h*.08],[0,-h*.08]]:mk?[[0,h*.5],[tip,h*.48],[base*.12,h*.38],[base*.42,h*.12],[base*.78,-h*.22],[base,-h*.42],[base*.98,-h*.5],[0,-h*.5]]:[[0,h*.5],[tip,h*.48],[base*.16,h*.35],[base*.46,h*.08],[base*.78,-h*.25],[base,-h*.44],[base*.98,-h*.5],[0,-h*.5]];
  lathe(profile,heat?painted('#6c6258','#c56b31','THERMAL SHIELD'):painted('#d9d9d0','#b68b4e','NOSE ASSEMBLY'),64);
  band(base*.99,-h*.43,.045,steel);band(base*.92,-h*.34,.025,gold);
  if(heat){for(let i=0;i<16;i++){const a=i*Math.PI/8;radialPipe(base*.98,-h*.4,-h*.2,a,dark,.018);}cyl(base*.72,base*.72,.06,dark,-h*.48,64);}
  else{for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(base*.94,-h*.38,h*.22,a,aluminium,.012);}sphere(tip*1.6,gold,[0,h*.47,0]);}
 };
 const makeFuselage=()=>{
  const mk0=id.includes('mk0'),mk2=id.includes('mk2'),mk3=id.includes('mk3'),w=r*(mk3?1.2:mk2?1.05:mk0?.72:.9),height=r*(mk3?.9:mk2?.78:.82);
  const shell=add(new THREE.CylinderGeometry(w*.92,w,h*.82,48,1,false),mk0?painted('#9da8a9','#b68b4e','MK0 FUSELAGE'):painted('#d9d9d0','#b68b4e','FUSELAGE'),[0,0,0],[Math.PI/2,0,0],[1,1,height/w]);
  const end1=add(new THREE.TorusGeometry(w*.94,.045,10,48),steel,[0,0,-h*.41],[0,0,0],[1,height/w,1]);
  const end2=add(new THREE.TorusGeometry(w*.94,.045,10,48),gold,[0,0,h*.41],[0,0,0],[1,height/w,1]);
  for(let z of [-h*.26,0,h*.26]){const seam=add(new THREE.TorusGeometry(w*.925,.018,8,48),aluminium,[0,0,z],[0,0,0],[1,height/w,1]);}
  // Side service strip and fuel inspection windows are aligned to the fuselage axis.
  box(w*.72,.055,h*.46,dark,[0,height*.92,0]);for(let i=0;i<5;i++)box(w*.09,.018,h*.38,blue,[(i-2)*w*.13,height*.96,0]);
  for(let z of [-h*.32,h*.32])for(let side of [-1,1])bolt(side*w*.72,0,z,.035,gold);
 };
 const makeAirbrake=()=>{
  const root=lathe([[0,-h*.28],[r*.36,-h*.28],[r*.44,h*.22],[r*.36,h*.28],[0,h*.28]],steel,32);
  const bladeShape=new THREE.Shape();bladeShape.moveTo(-r*.72,-h*.42);bladeShape.lineTo(r*.72,-h*.42);bladeShape.lineTo(r*.62,h*.42);bladeShape.lineTo(-r*.62,h*.42);bladeShape.closePath();
  const blade=add(new THREE.ExtrudeGeometry(bladeShape,{depth:.07,bevelEnabled:true,bevelSegments:3,bevelSize:.035,bevelThickness:.02}),ivory,[0,0,r*.22],[Math.PI/2,0,0]);
  for(let i=0;i<5;i++){box(.025,h*.64,.018,gold,[(i-2)*r*.24,.09,r*.27]);}
  for(let side of [-1,1]){tube([[side*r*.28,-h*.2,0],[side*r*.6,h*.05,r*.22],[side*r*.62,h*.2,r*.28]],.035,aluminium);bolt(side*r*.35,-h*.18,0,.05,gold);}
  band(r*.42,h*.22,.035,gold);
 };
 // Select a dedicated construction family; no one-size-fits-all primitive stand-in.
 if(type==='tank'||type==='resource')makeTank();
 else if(type==='engine'||type==='jet'||type==='booster')makeEngine();
 else if(type==='pod'||type==='cockpit')makePod();
 else if(type==='fuselage')makeFuselage();
 else if(type==='nosecone')makeNosecone();
 else if(type==='airbrake')makeAirbrake();
 else if(type==='probe')makeProbe();
 else if(type==='fin'||type==='wing'||type==='tail'||type==='control')makeWing();
 else if(type==='solar')makeSolar();
 else if(type==='chute')makeParachute();
 else if(type==='battery')makeBattery();
 else if(type==='science')makeScience();
 else if(type==='decoupler'||type==='structural')makeDecoupler();
 else if(/rover-wheel|rover.*wheel|wheel.*rover/i.test(id)||(/wheel/i.test(name)&&/rover|rovermax|ローブマックス/i.test(name)))makeRoverWheel();
 else if(type==='gear'||type==='ground')makeGear();
 else if(type==='intake')makeIntake();
 else if(type==='comm')makeComm();
 else if(type==='docking')makeDock();
 else if(type==='payload')makePayload();
 else if(type==='thermal')makeThermal();
 else if(type==='utility')makeUtility();
 else if(type==='robotics'||type==='rotor-blade'){
  const rotor=type==='rotor-blade'||id.includes('rotor'),servo=/servo|サーボ/i.test(name),hinge=/hinge|ヒンジ/i.test(name);
  if(rotor){cyl(r*.28,r*.28,h*.3,steel);cyl(r*.12,r*.12,h*.8,gold,h*.5);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const blade=box(r*2.1,.06,Math.max(.14,h*.3),ivory,[Math.cos(a)*r,h*.68,Math.sin(a)*r],[0,-a,0]);blade.rotation.z=.025;}}
  else if(servo){lathe([[0,-h*.4],[r*.6,-h*.4],[r*.7,h*.35],[r*.5,h*.4],[0,h*.4]],steel,32);tube([[r*.5,h*.2,0],[r*1.15,h*.35,0],[r*1.3,h*.68,0]],.055,aluminium);sphere(.12,gold,[r*1.3,h*.68,0]);}
  else if(hinge){cyl(r*.62,r*.62,h*.5,steel);cyl(r*.3,r*.3,h*.95,gold,h*.1);for(let x of [-1,1])box(.12,h*.45,.12,aluminium,[x*r*.58,h*.35,0]);}
  else{lathe([[0,-h*.4],[r*.72,-h*.4],[r*.8,h*.35],[r*.62,h*.4],[0,h*.4]],ivory,32);band(r*.75,h*.3,.04,gold);for(let i=0;i<4;i++){const a=i*Math.PI/2;bolt(Math.cos(a)*r*.7,h*.2,Math.sin(a)*r*.7,.05);}}
 }
 else{
  lathe([[0,-h*.5],[r*.72,-h*.5],[r*.9,-h*.35],[r*.9,h*.35],[r*.72,h*.5],[0,h*.5]],ivory,48);band(r*.9,h*.36,.035,gold);radialLabel(r*.91,0,r*.7,h*.2,getLabelMaterial());
 }
 // Functional visual hooks used by the flight simulation.
 if(type==='engine'||type==='jet'||type==='booster'){
  const plume=add(new THREE.ConeGeometry(r*.38,.9,24),new THREE.MeshBasicMaterial({color:0xffa34d,transparent:true,opacity:.82,depthWrite:false}),[0,-h*.62,0],[Math.PI,0,0]);plume.name='engine-flame';plume.visible=false;
 }

 // Keep authored material assignments per sub-mesh; never stamp one generic decal atlas
 // across every surface (that distorts wheels, solar cells, glass and small mechanisms).
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});

 return g;
}
