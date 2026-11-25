// Independently authored high-detail KSP1-inspired procedural part models.
// Each stock-style part family gets its own silhouette, finish, decals and mechanical detailing.

// Cached family finishes and per-part artwork keep materials consistent without
// allocating a new high-resolution texture every time a preview is revisited.
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
 const ivory=M(0xd9d9d0,.42,.52),paint=M(0xe7e6dc,.28,.6),aluminium=M(0xaeb9bd,.82,.28),steel=M(0x59666d,.82,.34),dark=M(0x252f35,.68,.38),rubber=M(0x171b1e,.04,.91),gold=M(0xb68b4e,.72,.32),orange=M(0xc56b31,.35,.58),blue=M(0x28547c,.58,.3),green=M(0x4c9b65,.3,.4),glass=M(0x173f5c,.62,.14,{emissive:0x071a2c,emissiveIntensity:.22}),black=M(0x111a20,.45,.25);
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
  const isRcs=id.startsWith('rcs-'),xenon=id.includes('xenon'),ore=id.startsWith('ore-')||/ore storage|鉱石/.test(name),oscar=id.includes('oscar'),donut=id.includes('donut')||id.includes('r12'),baguette=id.includes('baguette')||id.includes('r11'),rock=/rockomax|x200|jumbo/i.test(id+' '+name),kerb=id.includes('s3-'),mk2=id.includes('mk2-lf'),mk3=id.includes('mk3-lf'),mk0=id.includes('mk0-lf');
  if(ore){
   const large=/large|大型/.test(id+' '+name),rr=r*(large?1.02:.82),hh=h*(large?1.08:.78),radial=id.includes('radial');
   const skin=painted('#858f8d','#d29b3c','ORE STORAGE VESSEL',name);
   lathe([[0,-hh*.5],[rr*.72,-hh*.5],[rr*.94,-hh*.4],[rr, -hh*.28],[rr,hh*.28],[rr*.94,hh*.4],[rr*.72,hh*.5],[0,hh*.5]],skin,80);
   for(let y of [-hh*.42,-hh*.28,hh*.28,hh*.42])band(rr*.98,y,.04,y<0?steel:gold);
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;radialPipe(rr*.99,-hh*.32,hh*.32,ang,aluminium,.02);bolt(rr*.98*Math.cos(ang),-hh*.39,rr*.98*Math.sin(ang),.02,gold);}
   box(rr*.62,hh*.22,.045,dark,[0,0,rr*.91]);
   for(let i=0;i<5;i++)box(rr*.48,.018,.02,i%2?orange:aluminium,[0,(i-2)*hh*.035,rr*.94]);
   cyl(rr*.42,rr*.42,.12,steel,hh*.52,48);cyl(rr*.38,rr*.38,.1,dark,-hh*.52,48);
   if(radial){box(rr*1.42,hh*.74,.1,steel,[0,0,-rr*.82]);for(let side of [-1,1])box(rr*.12,hh*.82,.12,gold,[side*rr*.58,0,-rr*.84]);}
   return;
  }
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
  const nm=(id+' '+name).toLowerCase();
  const solid=type==='booster'||/solid booster|sepratron|bacc|rt-10|rt-5|thumper|hammer/.test(nm);
  const jet=type==='jet'||id.startsWith('jet-'),ion=id.includes('ion')||id.includes('dawn'),nuclear=id.includes('nerv'),dart=id.includes('dart')||/aerospike/.test(nm),vector=id.includes('vector'),mammoth=id.includes('mammoth'),twin=id.includes('twinboar'),spider=id.includes('spider'),thud=id.includes('thud'),poodle=id.includes('poodle'),rapier=id.includes('rapier'),terrier=/terrier|lv-909/.test(nm),swivel=/swivel|lv-t45/.test(nm),reliant=/reliant|lv-t30/.test(nm),wolfhound=/wolfhound/.test(nm),cheetah=/cheetah/.test(nm),skiff=/skiff/.test(nm),mainsail=/mainsail/.test(nm),juno=/juno/.test(nm),wheesley=/wheesley/.test(nm),panther=/panther/.test(nm),goliath=/goliath/.test(nm);
  if(solid){
   // Solid boosters: long pressure casing, domed head, hazard band, aft nozzle and radial mounting shoes.
   const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const q=canvas.getContext('2d');
   q.fillStyle='#d4d5cf';q.fillRect(0,0,512,256);
   const grad=q.createLinearGradient(0,0,512,0);grad.addColorStop(0,'rgba(0,0,0,.2)');grad.addColorStop(.25,'rgba(255,255,255,.14)');grad.addColorStop(.7,'rgba(255,255,255,.02)');grad.addColorStop(1,'rgba(0,0,0,.2)');q.fillStyle=grad;q.fillRect(0,0,512,256);
   q.fillStyle='#252c30';q.fillRect(0,196,512,60);
   for(let x=-48;x<560;x+=64){q.save();q.translate(x,0);q.rotate(-.48);q.fillStyle='#e2b64b';q.fillRect(0,184,28,100);q.restore();}
   q.fillStyle='#202a30';q.fillRect(104,72,304,92);q.strokeStyle='#b68b4e';q.lineWidth=4;q.strokeRect(104,72,304,92);
   q.fillStyle='#f0eee5';q.font='bold 20px Arial';q.fillText('SOLID MOTOR',122,104);q.font='bold 15px Arial';q.fillText(name.toUpperCase().slice(0,28),122,132);q.font='11px Arial';q.fillText('PRESSURE CASE / IGNITER',122,151);
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
   const caseMat=M(0xffffff,.42,.58,{map:tex});
   lathe([[0,-h*.5],[r*.62,-h*.5],[r*.82,-h*.44],[r*.96,-h*.34],[r,h*.28],[r*.94,h*.4],[r*.72,h*.5],[0,h*.5]],caseMat,80);
   for(const y of [-h*.43,-h*.34,h*.31,h*.42])band(r*(y>0?.96:.98),y,.035,y<0?steel:aluminium);
   // Rounded ogive cap and recessed aft nozzle.
   lathe([[0,h*.32],[r*.9,h*.32],[r*.86,h*.4],[r*.65,h*.48],[r*.32,h*.52],[0,h*.52]],ivory,64);
   lathe([[0,-h*.68],[r*.28,-h*.68],[r*.4,-h*.59],[r*.34,-h*.48],[r*.24,-h*.43],[0,-h*.43]],steel,48);
   add(new THREE.TorusGeometry(r*.38,.035,10,48),gold,[0,-h*.58,0],[Math.PI/2,0,0]);
   add(new THREE.CircleGeometry(r*.27,40),black,[0,-h*.675,0],[Math.PI/2,0,0]);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.99,-h*.31,h*.27,a,steel,.018);bolt(Math.cos(a)*r*.99,-h*.4,Math.sin(a)*r*.99,.02,gold);}
   for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.cos(a)*r*.98,z=Math.sin(a)*r*.98;box(r*.34,h*.16,r*.22,aluminium,[x,-h*.1,z],[0,-a,0]);bolt(x,-h*.1,z,.035,gold);}
  }else if(jet){
   const shellR=r*.78;lathe([[0,-h*.43],[shellR*.7,-h*.43],[shellR,-h*.34],[shellR,h*.32],[shellR*.82,h*.44],[shellR*.45,h*.47],[0,h*.47]],aluminium,64);
   const inlet=add(new THREE.TorusGeometry(shellR*.72,.075,16,64),steel,[0,0,h*.43],[Math.PI/2,0,0]);add(new THREE.CircleGeometry(shellR*.66,48),black,[0,0,h*.432],[Math.PI/2,0,0]);
   for(let i=0;i<(goliath?24:16);i++){const a=i*Math.PI*2/(goliath?24:16);const blade=box(.035,.035,shellR*.62,aluminium,[Math.cos(a)*shellR*.34,Math.sin(a)*shellR*.34,h*.44],[0,0,a]);}
   add(new THREE.TorusGeometry(shellR*.42,.035,10,48),gold,[0,0,h*.45],[0,0,0]);
   cyl(shellR*.18,shellR*.18,.08,steel,0,24).position.z=h*.46;
   for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(shellR*1.02,-h*.28,h*.28,a,steel,.026);}
   band(shellR,-h*.3,.045,gold);band(shellR,h*.32,.045,dark);
   if(panther){for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(shellR*1.04,-h*.2,h*.22,a,orange,.018);}band(shellR*1.08,h*.12,.045,gold);}
   if(wheesley||juno){for(let i=0;i<10;i++){const a=i*Math.PI/5;radialPipe(shellR*.9,-h*.22,h*.2,a,aluminium,.022);}}
   if(rapier){add(new THREE.TorusGeometry(shellR*.78,.07,12,64),gold,[0,0,h*.34],[Math.PI/2,0,0]);for(let i=0;i<18;i++){const a=i*Math.PI/9;box(.025,.025,shellR*.6,[0,0,0],[Math.cos(a)*shellR*.55,Math.sin(a)*shellR*.55,h*.35],[0,0,a]);}}
   if(id.includes('whiplash')){for(let i=0;i<10;i++){const a=i*Math.PI/5;radialPipe(shellR*1.06,-h*.35,h*.3,a,steel,.035);}for(let y of [-h*.34,-h*.2,-h*.06])band(shellR*1.04,y,.035,orange);}
   if(id.includes('goliath')){for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(shellR*1.03,-h*.3,h*.3,a,gold,.035);}}
  }else if(ion){
   lathe([[0,-h*.28],[r*.25,-h*.28],[r*.42,-h*.12],[r*.48,h*.1],[r*.32,h*.25],[0,h*.25]],steel,48);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.46,-h*.2,h*.28,a,gold,.018);}
   add(new THREE.TorusGeometry(r*.4,.055,12,48),gold,[0,h*.23,0]);add(new THREE.CircleGeometry(r*.36,48),blue,[0,h*.25,0]);
   for(let i=0;i<6;i++){const a=i*Math.PI/3;box(.055,h*.42,.055,aluminium,[Math.cos(a)*r*.53,h*.05,Math.sin(a)*r*.53]);}
  }else{
   const cluster=mammoth?4:twin?2:spider?4:1,bodyR=r*(mammoth?1.02:twin?.9:wolfhound?.94:cheetah?.72:skiff?.76:.82);
   lathe([[0,-h*.12],[bodyR*.78,-h*.12],[bodyR,-h*.05],[bodyR,h*.28],[bodyR*.88,h*.38],[bodyR*.62,h*.4],[0,h*.4]],painted(nuclear?'#6f7777':'#d9d9d0',nuclear?'#c56b31':'#b68b4e',nuclear?'NUCLEAR PROPULSION':'ROCKET ENGINE'),64);
   band(bodyR,h*.28,.045,steel);band(bodyR,-h*.06,.045,gold);
   if(nuclear){lathe([[r*.18,-h*.48],[r*.28,-h*.45],[r*.38,-h*.12],[r*.4,h*.04],[r*.34,h*.08],[r*.22,h*.08]],gold,48);for(let i=0;i<16;i++){const a=i*Math.PI/8;radialPipe(bodyR*1.05,-h*.08,h*.24,a,steel,.035);}band(bodyR*1.04,h*.22,.06,orange);}
   else if(dart){
    // Toroidal aerospike: annular thrust ring with a long central expansion spike.
    lathe([[r*.05,-h*.5],[r*.24,-h*.48],[r*.52,-h*.18],[r*.7,-h*.08],[r*.58,h*.12],[r*.35,h*.18],[0,h*.18]],steel,64);
    add(new THREE.TorusGeometry(r*.64,.075,16,64),aluminium,[0,-h*.13,0],[Math.PI/2,0,0]);
    const spike=add(new THREE.ConeGeometry(r*.28,h*.68,48),gold,[0,-h*.12,0],[Math.PI,0,0]);
    band(r*.6,-h*.12,.06,gold);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.66,-h*.1,h*.17,a,steel,.022);}
   }
   else{
    for(let k=0;k<cluster;k++){
     const a=k*Math.PI*2/cluster,x=cluster===1?0:Math.cos(a)*r*.38,z=cluster===1?0:Math.sin(a)*r*.38,nr=cluster===4?r*.34:cluster===2?r*.42:terrier?r*.72:poodle?r*.82:wolfhound?r*.9:cheetah?r*.56:skiff?r*.62:mainsail?r*.78:r*.68;
     const profile=[[nr*.22,-h*.58],[nr*.3,-h*.55],[nr*.48,-h*.4],[nr*.72,-h*.2],[nr*.92,-h*.06],[nr,-h*.025],[nr*.94,-h*.0],[nr*.82,-h*.04],[nr*.68,-h*.13],[nr*.48,-h*.34],[nr*.3,-h*.52],[nr*.22,-h*.58]];
     lathe(profile,steel,48,[x,0,z]);
     const throat=add(new THREE.CircleGeometry(nr*.56,32),black,[x,-h*.565,z],[Math.PI/2,0,0]);
     const rim=add(new THREE.TorusGeometry(nr*.93,.045,10,40),aluminium,[x,-h*.055,z],[Math.PI/2,0,0]);
     for(let j=0;j<8;j++){const aa=j*Math.PI/4;bolt(x+Math.cos(aa)*nr*.85,-h*.08,z+Math.sin(aa)*nr*.85,.022,gold);}
     for(let j=0;j<3;j++){const aa=j*Math.PI*2/3;radialPipe(nr*.86,-h*.08,-h*.36,aa,aluminium,.018);}
    }
    if(vector){for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(r*.72,-h*.02,h*.27,a,gold,.04);}}
    if(poodle){for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.7,-h*.03,h*.24,a,aluminium,.035);}}
    if(rapier){band(bodyR*1.02,h*.1,.055,orange);for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(bodyR*1.03,-h*.05,h*.27,a,gold,.025);}add(new THREE.TorusGeometry(bodyR*.72,.055,12,64),aluminium,[0,h*.36,0],[Math.PI/2,0,0]);add(new THREE.CircleGeometry(bodyR*.62,48),black,[0,h*.365,0],[Math.PI/2,0,0]);for(let i=0;i<14;i++){const a=i*Math.PI/7;box(.03,.035,bodyR*.56,steel,[Math.cos(a)*bodyR*.38,h*.37,Math.sin(a)*bodyR*.38],[0,-a,0]);}}
   }
   // Engine mounting flange, gimbal bearing, feed lines and actuator hardware.
   for(const y of [-h*.105,-h*.075])band(bodyR*.96,y,.026,y<0?gold:aluminium);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;const x=Math.cos(a)*bodyR*.99,z=Math.sin(a)*bodyR*.99;bolt(x,h*.23,z,.018,aluminium);}
   for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(bodyR*1.015,-h*.02,h*.24,a,i%2?steel:aluminium,.018);}
   const gimballed=swivel||terrier||vector||rapier||poodle||id.includes('twitch')||id.includes('spark')||id.includes('wolfhound')||id.includes('skiff');
   if(gimballed){
    const gimbalRing=add(new THREE.TorusGeometry(bodyR*.56,.045,10,48),gold,[0,-h*.17,0],[Math.PI/2,0,0]);
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*bodyR*.72,z=Math.sin(a)*bodyR*.72;tube([[x,h*.12,z],[x*1.12,-h*.02,z*1.12],[x*.9,-h*.2,z*.9]],.022,aluminium);}
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*bodyR*.82,z=Math.sin(a)*bodyR*.82;box(bodyR*.16,h*.11,bodyR*.12,steel,[x,h*.04,z],[0,-a,0]);}
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*bodyR*.68,z=Math.sin(a)*bodyR*.68;const actuator=tube([[x,h*.05,z],[x*1.08,-h*.08,z*1.08],[x*.92,-h*.19,z*.92]],.012,gold);actuator.name='engine-gimbal-actuator';}
   }else{
    // Fixed-engine mount: rigid struts, no false thrust-vectoring hardware.
    for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.cos(a)*bodyR*.72,z=Math.sin(a)*bodyR*.72;tube([[x,h*.16,z],[x*1.08,-h*.04,z*1.08],[x*.9,-h*.2,z*.9]],.028,steel);}
   }
   if(terrier){
    // Terrier's distinctive broad grey shroud and black bell with amber feed lines.
    add(new THREE.TorusGeometry(bodyR*1.13,.11,16,72),M(0x858d8e,.7,.32),[0,h*.27,0]);
    add(new THREE.TorusGeometry(bodyR*1.02,.035,10,72),gold,[0,h*.22,0]);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(bodyR*1.1,-h*.02,h*.27,a,i%2?steel:aluminium,.025);}
    for(let side of [-1,1])tube([[side*bodyR*.58,h*.2,bodyR*.25],[side*bodyR*.9,h*.08,bodyR*.38],[side*bodyR*.72,-h*.16,bodyR*.52]],.025,orange);
   }
   if(swivel){
    // Swivel-specific pivot ring and paired hydraulic actuators.
    add(new THREE.TorusGeometry(bodyR*.82,.055,12,64),gold,[0,-h*.14,0],[Math.PI/2,0,0]);
    for(let side of [-1,1]){tube([[side*bodyR*.62,h*.12,0],[side*bodyR*.94,-h*.02,0],[side*bodyR*.7,-h*.2,0]],.028,aluminium);sphere(.055,gold,[side*bodyR*.94,-h*.02,0]);}
   }
   if(reliant){
    // Reliant's fixed thrust frame: exposed support webs, without Swivel's gimbal ring.
    for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(bodyR*.98,-h*.08,h*.22,a,steel,.025);}
   }
   if(mammoth||twin){
    const count=mammoth?4:2;for(let i=0;i<count;i++){const a=i*Math.PI*2/count;const x=Math.cos(a)*r*.48,z=Math.sin(a)*r*.48;band(r*.28,-h*.08,.018,orange).position.set(x,-h*.08,z);}
   }
   if(mainsail){for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(bodyR*1.06,-h*.12,h*.25,a,orange,.03);}}
   if(wolfhound||cheetah||skiff){for(let i=0;i<10;i++){const a=i*Math.PI/5;radialPipe(bodyR*1.02,-h*.1,h*.28,a,aluminium,.018);}}
   if(thud){
    // Thud is a radial engine; rotate the complete assembly to its side mount.
    const sideGroup=new THREE.Group();const children=[...g.children];for(const child of children){g.remove(child);sideGroup.add(child);}sideGroup.rotation.z=Math.PI/2;g.add(sideGroup);
   }
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
  const nm=(id+' '+name).toLowerCase();
  const oct=/okto/.test(nm),hecs=/hecs/.test(nm),qbe=/qbe/.test(nm),stay=/stayputnik|ステイプートニク/.test(nm),rover=/rovemate|rove.?mate|ローブメイト/.test(nm),rcl=/rc-l01|rcl01|remote guidance unit/.test(nm),rc001=/rc-001s|rc001s/.test(nm),mk2drone=/mk2 drone/.test(nm);
  const skin=(base,accent,label)=>painted(base,accent,label,name);
  const shell=skin(oct?'#9da6a6':hecs?'#d7d9d2':qbe?'#b8bebc':stay?'#8b9292':'#d6d8d2','#b68b4e','PROBODOBODYNE AVIONICS');
  const facePlate=(x,y,z,w,d,material=dark)=>box(w,d,.035,material,[x,y,z]);
  if(qbe){
   // QBE: compact rectangular probe core with flat service faces.
   box(r*1.62,h*.78,r*1.62,shell);
   for(const side of [-1,1]){
    facePlate(0,h*.02,side*r*.82,r*.92,h*.42,dark);
    box(r*.72,h*.28,.025,ivory,[0,h*.02,side*r*.845]);
    for(let i=0;i<5;i++)box(r*.08,.018,.018,steel,[(i-2)*r*.13,h*.12,side*r*.865]);
    for(let i=0;i<4;i++)bolt((i%2?1:-1)*r*.58,(i<2?1:-1)*h*.28,side*r*.83,.025,gold);
   }
   cyl(r*.34,r*.34,.1,steel,h*.43,32);band(r*.34,h*.49,.025,gold);
   for(let x of [-1,1])for(let z of [-1,1])box(.09,h*.18,.09,aluminium,[x*r*.72,-h*.36,z*r*.72]);
  }
  else if(oct||hecs||mk2drone){
   const sides=hecs?6:oct?8:8,bodyH=h*.76,bodyR=r*.92;
   const body=new THREE.Mesh(new THREE.CylinderGeometry(bodyR*.96,bodyR,bodyH,sides,1,false),shell);
   body.castShadow=true;body.receiveShadow=true;g.add(body);
   band(bodyR*.99,bodyH*.48,.04,gold);band(bodyR*.99,-bodyH*.48,.035,steel);
   for(let i=0;i<sides;i++){
    const ang=(i+.5)*Math.PI*2/sides,x=Math.sin(ang)*bodyR*.91,z=Math.cos(ang)*bodyR*.91;
    const plate=box(bodyR*.56,bodyH*.55,.035,i%2?ivory:aluminium,[x,0,z],[0,ang,0]);
    for(let y of [-bodyH*.2,bodyH*.2])bolt(x,y,z+.018,.018,gold);
    // Individual thermal-blanket seams on HECS faces.
    if(hecs)for(let j=0;j<3;j++)box(bodyR*.4,.012,.012,steel,[x,(j-1)*bodyH*.13,z+.025],[0,ang,0]);
   }
   cyl(bodyR*.46,bodyR*.46,.12,steel,bodyH*.48,48);band(bodyR*.46,bodyH*.55,.025,gold);
   cyl(bodyR*.35,bodyR*.35,.055,black,-bodyH*.5,48);
   sphere(bodyR*.15,glass,[0,bodyH*.62,0],[1,.45,1]);
   for(let i=0;i<sides;i++){const ang=i*Math.PI*2/sides;const x=Math.sin(ang)*bodyR*.75,z=Math.cos(ang)*bodyR*.75;sphere(.035, i%2?orange:blue,[x,bodyH*.5,z],[1,.55,1]);}
  }
  else if(stay){
   // Sputnik-like polished sphere, deliberately lacking an upper stack node.
   sphere(r*.78,aluminium,[0,0,0],[1,.88,1]);
   const equator=add(new THREE.TorusGeometry(r*.77,.035,10,64),steel,[0,0,0],[Math.PI/2,0,0]);
   cyl(r*.38,r*.42,h*.18,steel,-h*.39,48);band(r*.4,-h*.3,.03,gold);
   for(let i=0;i<4;i++){const ang=i*Math.PI/2;const x=Math.cos(ang)*r*.72,z=Math.sin(ang)*r*.72;tube([[0,h*.1,0],[x,h*.2,z],[x*1.12,h*.3,z*1.12]],.018,gold);}
   sphere(.055,gold,[0,h*.32,0]);
  }
  else if(rover){
   // RoveMate is a low rectangular rover avionics box, not a cylindrical probe.
   box(r*1.72,h*.62,r*1.42,skin('#d3d5cd','#b68b4e','ROVER AVIONICS'));
   box(r*1.5,.055,r*1.18,steel,[0,h*.34,0]);
   for(let x of [-1,1])for(let z of [-1,1]){
    box(r*.28,h*.18,r*.28,aluminium,[x*r*.72,-h*.38,z*r*.58]);
    tube([[x*r*.72,-h*.28,z*r*.58],[x*r*.9,-h*.52,z*r*.72],[x*r*1.1,-h*.52,z*r*.72]],.025,steel);
   }
   facePlate(0,h*.02,r*.72,r*.9,h*.3,dark);
   for(let i=0;i<4;i++)sphere(.055,i%2?orange:blue,[(i-1.5)*r*.18,h*.02,r*.75],[1,.6,.3]);
   // Stereo navigation cameras and dust-sealed connectors.
   for(let x of [-1,1]){sphere(r*.14,steel,[x*r*.42,h*.2,r*.74],[1,1,.35]);sphere(r*.09,glass,[x*r*.42,h*.2,r*.78],[1,1,.25]);}
   for(let i=0;i<6;i++)bolt((i-2.5)*r*.22,-h*.22,r*.72,.018,gold);
  }
  else if(rcl||rc001){
   // Remote guidance cores use a thin circular bus with radial connector ears.
   cyl(r*.92,r*.92,h*.46,skin('#aeb6b5','#b68b4e','REMOTE GUIDANCE UNIT'),0,64);
   band(r*.94,h*.2,.05,gold);band(r*.94,-h*.2,.04,steel);
   for(let i=0;i<4;i++){
    const ang=i*Math.PI/2,x=Math.sin(ang)*r*1.04,z=Math.cos(ang)*r*1.04;
    box(r*.42,.1,r*.28,aluminium,[x,0,z],[0,ang,0]);
    bolt(x,0,z,.045,gold);
   }
   const face=box(r*.9,h*.22,.045,dark,[0,h*.03,r*.88]);
   box(r*.54,.035,.018,ivory,[0,h*.08,r*.91]);
   for(let i=0;i<5;i++)sphere(.035,i%2?orange:blue,[(i-2)*r*.13,-h*.015,r*.92],[1,.6,.3]);
   if(rcl)for(let i=0;i<4;i++){const ang=i*Math.PI/2;tube([[Math.sin(ang)*r*.6,h*.18,Math.cos(ang)*r*.6],[Math.sin(ang)*r*.9,h*.48,Math.cos(ang)*r*.9]],.025,gold);}
  }
  else if(id.includes('legacy-hecs')){
   const body=new THREE.Mesh(new THREE.CylinderGeometry(r*.92,r*.92,h*.72,6,1,false),skin('#d6d8d2','#b68b4e','HECS LEGACY'));
   g.add(body);band(r*.94,h*.36,.04,gold);band(r*.94,-h*.36,.04,steel);
   for(let i=0;i<6;i++){const ang=i*Math.PI/3;radialPipe(r*.94,-h*.25,h*.25,ang,aluminium,.025);}
   cyl(r*.34,r*.34,.1,steel,h*.42,6);
  }
  else{
   // Generic compact guidance core, with a clearly defined octagonal casing.
   const body=new THREE.Mesh(new THREE.CylinderGeometry(r*.92,r*.92,h*.75,8,1,false),shell);g.add(body);
   band(r*.94,h*.38,.04,gold);band(r*.94,-h*.38,.035,steel);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(r*.92,-h*.28,h*.28,ang,aluminium,.018);bolt(Math.cos(ang)*r*.9,h*.25,Math.sin(ang)*r*.9,.02,gold);}
   cyl(r*.42,r*.42,.09,steel,h*.42,32);sphere(r*.2,glass,[0,h*.5,0]);
   radialLabel(r*.94,0,r*.64,h*.18,getLabelMaterial());
  }
 };
 const makeWing=()=>{
  const nm=(id+' '+name).toLowerCase();
  const vertical=type==='tail'||/rudder|winglet|tail fin|垂直尾翼|ウィングレット|テールフィン/.test(nm);
  const delta=/delta|デルタ/.test(nm),swept=/swept|後退翼/.test(nm),strake=/strake|ストレーキ/.test(nm);
  const connector=/wing connector|ウィングコネクター/.test(nm),control=type==='control'||/elevon|control surface|canard|エレボン|カナード/.test(nm);
  const big=/big-s|fat-455|fat455|large/.test(nm),small=/small|basic fin|structural wing type d/.test(nm);
  const winglet=/winglet|ウィングレット/.test(nm),canard=/canard|カナード/.test(nm);
  const span=r*(small?.78:big?1.32:1.12),chord=vertical?h*.86:h*(delta?1.55:big?1.35:1.12);
  const root=chord*(delta?1.48:connector?1.05:1),tip=chord*(delta?.12:swept?.34:vertical?.42:small?.48:.62);
  const sweep=connector?span*.08:delta?span*.88:swept?span*.58:strake?span*.72:canard?span*.28:span*.18;
  const trailSweep=connector?span*.06:delta?span*.42:swept?span*.2:strake?span*.3:span*.1;
  const thickness=big?.16:small?.055:.09;
  const shape=new THREE.Shape();
  shape.moveTo(-root*.5,-root*.48);
  shape.lineTo(root*.5,-root*.48);
  shape.lineTo(span-sweep,tip*.5);
  shape.lineTo(span-trailSweep,-tip*.5);
  shape.lineTo(-root*.5,root*.48);
  shape.closePath();
  const skin=painted(vertical?'#c6cbc8':'#d5d8d4',control?'#c56b31':'#b68b4e',vertical?'VERTICAL STABILIZER':control?'FLIGHT CONTROL SURFACE':'AERODYNAMIC WING',name);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:Math.min(.045,thickness*.42),bevelThickness:thickness*.32,curveSegments:10});
  const wing=add(geo,skin,[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  if(vertical)wing.position.y=h*.1;
  // Separate leading-edge cap, dark trailing-edge strip and inset skin panel seams.
  const leadingPts=[[-root*.5,-root*.48,thickness*.55],[span*.34-sweep*.34,root*.12,thickness*.55],[span-sweep,tip*.5,thickness*.55]];
  const leadCurve=new THREE.CatmullRomCurve3(leadingPts.map(v=>new THREE.Vector3(...v)));
  add(new THREE.TubeGeometry(leadCurve,36,thickness*.22,10,false),aluminium,[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  const trailPts=[[root*.5,-root*.48,thickness*.55],[span*.58-trailSweep*.55,-tip*.05,thickness*.55],[span-trailSweep,-tip*.5,thickness*.55]];
  const trailCurve=new THREE.CatmullRomCurve3(trailPts.map(v=>new THREE.Vector3(...v)));
  add(new THREE.TubeGeometry(trailCurve,32,thickness*.12,8,false),dark,[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  // Spanwise ribs and access panels follow each wing's individual planform.
  for(let i=0;i<6;i++){
   const t=.12+i*.135,x=t*span;
   const yTop=(root*.48)*(1-t)+tip*.34*t;
   const rib=box(thickness*.18,Math.max(.025,yTop*1.45),thickness*.2,aluminium,[x,yTop*.08,thickness*.56]);
   if(!vertical)rib.rotation.x=-Math.PI/2;
   for(let side of [-1,1])bolt(x,side*yTop*.34,thickness*.95,.012,gold);
  }
  for(let i=0;i<3;i++){
   const t=.2+i*.25,x=t*span,y=(root*.22)*(1-t)+(tip*.18)*t;
   const panel=box(span*.12,.018,thickness*.12,ivory,[x,y,thickness*.58]);
   if(!vertical)panel.rotation.x=-Math.PI/2;
  }
  // Root attachment spar and tip caps are different pieces, not a single flat polygon.
  const rootCap=box(root*.92,.045,thickness*1.18,steel,[0,0,thickness*.45]);if(!vertical)rootCap.rotation.x=-Math.PI/2;
  const tipCap=box(thickness*.6,tip*.9,thickness*.9,aluminium,[span-sweep*.55,.01,thickness*.45]);if(!vertical)tipCap.rotation.x=-Math.PI/2;
  if(control){
   // Hinged elevon/canard panel with a continuous hinge line, hinge barrels and servo links.
   const flapRoot=root*.48,flapTip=tip*.84,flapSpan=span*.47;
   const flapShape=new THREE.Shape();flapShape.moveTo(-flapRoot*.5,0);flapShape.lineTo(flapRoot*.5,0);flapShape.lineTo(flapSpan,flapTip*.5);flapShape.lineTo(flapSpan*.94,-flapTip*.5);flapShape.lineTo(-flapRoot*.5,-flapRoot*.34);flapShape.closePath();
   const flap=add(new THREE.ExtrudeGeometry(flapShape,{depth:thickness*.72,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.018}),painted('#c9cfcc','#c56b31','MOVABLE CONTROL SURFACE',name),[span*.48,-root*.22,thickness*.62],vertical?[0,0,0]:[-Math.PI/2,0,0]);
   const hinge=add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(span*.46,-root*.2,thickness*.7),new THREE.Vector3(span*.68,-root*.12,thickness*.7),new THREE.Vector3(span*.92,-root*.05,thickness*.7)]),24,.025,8,false),dark,[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
   for(let i=0;i<5;i++){
    const t=.15+i*.17,x=span*(.49+t*.43),y=-root*.18+t*root*.08;
    const hingePin=add(new THREE.CylinderGeometry(.025,.025,thickness*1.25,12),gold,[x,y,thickness*.72],[0,0,Math.PI/2]);
    tube([[x,y,thickness*.78],[x+span*.035,y+thickness*.55,thickness*.92],[x+span*.07,y,thickness*.8]],.014,aluminium);
   }
  }
  if(winglet){
   const tipFin=box(thickness*.7,tip*.55,span*.2,ivory,[span-sweep*.45,tip*.2,0]);
   tipFin.rotation.z=.18;
   for(let side of [-1,1])box(thickness*.5,tip*.4,span*.12,steel,[span-sweep*.45,tip*.18,side*span*.1]);
  }
  if(strake){for(let i=0;i<4;i++){const t=.18+i*.16;box(span*.22,.025,thickness*.18,aluminium,[span*t,root*.18*(1-t),thickness*.58]);}}
  // Red/green navigation lenses and small fasteners at the tips.
  sphere(.035, M(0xc94b3e,.18,.2,{emissive:0x42100b,emissiveIntensity:.15}),[span-sweep*.9,tip*.32,thickness*.72]);
  sphere(.035, M(0x4c9b68,.18,.2,{emissive:0x10351d,emissiveIntensity:.15}),[span-sweep*.9,-tip*.32,thickness*.72]);
  for(let i=0;i<8;i++){const x=span*(.12+i*.1);bolt(x,0,thickness*.78,.012,gold);}
 }; const makeSolar=()=>{
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
  const nm=(id+' '+name).toLowerCase();
  const radial=/radial|ラジアル/.test(nm),drogue=/drogue|ドラッグ|mk25/.test(nm),xl=/xl/.test(nm);
  const rad=r*(xl?1.02:drogue?.66:.76),bodyH=h*(radial?.62:xl?1.08:.92);
  const canisterMat=painted(drogue?'#c4c7bf':'#d5d7cf',drogue?'#c56b31':'#b68b4e',drogue?'DROGUE PARACHUTE':'RECOVERY PARACHUTE',name);
  if(radial){
   // Radial chute canister: horizontal pressure capsule, flat attachment shoe and release latches.
   const can=lathe([[0,-bodyH*.5],[rad*.58,-bodyH*.5],[rad*.82,-bodyH*.38],[rad*.82,bodyH*.38],[rad*.58,bodyH*.5],[0,bodyH*.5]],canisterMat,64);
   can.rotation.z=Math.PI/2;
   for(let side of [-1,1])add(new THREE.TorusGeometry(rad*.82,.035,8,64),gold,[side*bodyH*.36,0,0],[0,Math.PI/2,0]);
   const plate=box(rad*1.1,bodyH*.92,.08,steel,[0,0,-rad*.78]);
   box(rad*.84,bodyH*.68,.04,dark,[0,0,-rad*.83]);
   for(let side of [-1,1]){box(rad*.12,bodyH*.84,.12,aluminium,[side*rad*.48,0,-rad*.84]);for(let j=0;j<4;j++)bolt(side*rad*.48,(j-1.5)*bodyH*.18,-rad*.91,.02,gold);}
   for(let i=0;i<6;i++)box(rad*.55,.025,.025,i%2?dark:orange,[0,(i-2.5)*bodyH*.1,rad*.7]);
   cyl(rad*.22,rad*.22,.09,black,0,24).rotation.z=Math.PI/2;
  }else{
   lathe([[0,-bodyH*.5],[rad*.68,-bodyH*.5],[rad*.9,-bodyH*.4],[rad,bodyH*.24],[rad*.86,bodyH*.42],[rad*.54,bodyH*.5],[0,bodyH*.5]],canisterMat,72);
   for(let y of [-bodyH*.4,-bodyH*.28,bodyH*.28,bodyH*.42])band(rad*(y>0?.9:.98),y,.035,y<0?steel:gold);
   cyl(rad*.56,rad*.56,.09,dark,-bodyH*.49,48);
   cyl(rad*.52,rad*.52,.07,orange,bodyH*.49,48);
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;bolt(rad*.92*Math.cos(ang),-bodyH*.34,rad*.92*Math.sin(ang),.018,aluminium);}
  }
  const rig=new THREE.Group();rig.name='parachute-rig';rig.visible=false;
  const canopy=new THREE.Group();canopy.name='parachute-canopy';canopy.position.y=h*(radial?1.12:1.35);canopy.scale.setScalar(.04);
  const canopyR=r*(drogue?.92:xl?2.65:2.1),canopyH=canopyR*(drogue?.38:.72);
  const clothA=M(drogue?0xc96d3e:0xe5e5dc,.05,.88,{side:THREE.DoubleSide});
  const clothB=M(drogue?0xe8e2d2:0x4b6b84,.05,.88,{side:THREE.DoubleSide});
  for(let i=0;i<20;i++){
   const ang=i*Math.PI/10;
   const panel=new THREE.Mesh(new THREE.SphereGeometry(canopyR,24,16,ang,Math.PI/10,0,Math.PI/2),i%2?clothA:clothB);
   panel.scale.set(1,canopyH/canopyR,1);panel.castShadow=true;canopy.add(panel);
   const seam=new THREE.CatmullRomCurve3([new THREE.Vector3(0,canopyH,0),new THREE.Vector3(Math.cos(ang)*canopyR*.38,canopyH*.82,Math.sin(ang)*canopyR*.38),new THREE.Vector3(Math.cos(ang)*canopyR*.96,0,Math.sin(ang)*canopyR*.96)]);
   canopy.add(new THREE.Mesh(new THREE.TubeGeometry(seam,24,.009,6,false),gold));
  }
  const skirt=new THREE.Mesh(new THREE.TorusGeometry(canopyR*.98,.025,8,96),steel);skirt.position.y=0;canopy.add(skirt);
  const vent=new THREE.Mesh(new THREE.CircleGeometry(canopyR*.12,32),dark);vent.position.y=canopyH*.98;vent.rotation.x=-Math.PI/2;canopy.add(vent);
  rig.add(canopy);
  const cordCount=drogue?12:16;
  for(let i=0;i<cordCount;i++){
   const ang=i*Math.PI*2/cordCount;
   const start=new THREE.Vector3(Math.cos(ang)*rad*.18,bodyH*.62,Math.sin(ang)*rad*.18);
   const end=new THREE.Vector3(Math.cos(ang)*canopyR*.94,h*(radial?1.12:1.35),Math.sin(ang)*canopyR*.94);
   const dir=end.clone().sub(start),line=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,dir.length(),6),gold);
   line.position.copy(start).add(end).multiplyScalar(.5);line.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());rig.add(line);
  }
  g.add(rig);
 }; const makeDecoupler=()=>{
  const nm=(id+' '+name).toLowerCase();
  const adapter=/adapter|アダプター/.test(nm),tri=/tri.?coupler|トライ/.test(nm),quad=/quad.?coupler|クアッド/.test(nm),bi=/bi.?coupler|バイカプラー/.test(nm),hub=/hubmax/.test(nm);
  const radial=/radial|tt-?38|tt-?70|hydraulic|hdm|ラジアル|油圧式/.test(nm);
  const fuelLine=/fuel.?line|fuel-line|燃料ダクト/.test(nm);
  if(fuelLine){
   // FTX-2 external fuel duct: twin flexible transfer hoses with end couplings and clamp saddles.
   const length=h*1.08,sep=r*.22,thick=Math.max(.018,r*.045);
   for(let side of [-1,1]){
    const path=new THREE.CatmullRomCurve3([[side*sep,-length*.5,0],[side*sep*1.15,-length*.22,r*.12],[side*sep*.85,length*.18,r*.12],[side*sep,length*.5,0]].map(v=>new THREE.Vector3(...v)));
    add(new THREE.TubeGeometry(path,40,thick,10,false),orange);
    for(let y of [-length*.48,length*.48]){const ring=add(new THREE.TorusGeometry(thick*1.8,thick*.55,8,24),steel,[side*sep,y,0],[Math.PI/2,0,0]);}
    for(let y of [-length*.33,0,length*.33])box(thick*3,.07,thick*2,aluminium,[side*sep,y,r*.1]);
   }
   for(let side of [-1,1]){cyl(r*.12,r*.12,.12,steel,-length*.5,20).rotation.z=Math.PI/2;cyl(r*.12,r*.12,.12,steel,length*.5,20).rotation.z=Math.PI/2;}
   return;
  }

  const separator=/separator|セパレーター/.test(nm);
  const enginePlate=/engine plate|エンジンプレート/.test(nm);
  const grip=/grip.?strip|grip.?pad|グリップ/.test(nm);
  const beam=/i-beam|girder|beam|panel|mobility enhancer|パネル|ビーム|桁/.test(nm);
  const strut=/strut|hardpoint|pylon|ストラット|ハードポイント|パイロン/.test(nm);
  if(radial){
   // TT-38K family: narrow side-mounted release rail, twin guide cheeks and a sprung ejector.
   const bodyW=Math.max(.12,r*.34),bodyH=Math.max(.42,h*.9);
   box(bodyW,bodyH,r*.22,steel);
   box(bodyW*.42,bodyH*.82,r*.25,dark,[0,0,r*.16]);
   for(let side of [-1,1]){
    box(bodyW*.18,bodyH*.9,r*.18,aluminium,[side*bodyW*.43,0,r*.18]);
    for(let j=0;j<5;j++)box(bodyW*.13,bodyH*.055,.018,(j%2?dark:gold),[side*bodyW*.43,(j-2)*bodyH*.17,r*.28]);
    for(let j=0;j<3;j++)bolt(side*bodyW*.45,(j-1)*bodyH*.31,r*.29,.018,gold);
   }
   box(bodyW*.28,bodyH*.34,.06,steel,[0,0,r*.31]);
   box(bodyW*.12,bodyH*.2,.045,orange,[0,0,r*.35]);
   for(let y of [-bodyH*.46,bodyH*.46])box(bodyW*.95,.055,r*.3,aluminium,[0,y,r*.05]);
   for(let side of [-1,1])tube([[side*bodyW*.45,-bodyH*.3,r*.3],[side*bodyW*.55,0,r*.38],[side*bodyW*.45,bodyH*.3,r*.3]],.018,gold);
   return;
  }
  if(grip){
   const w=r*1.55,len=h*.92,depth=Math.max(.045,r*.12);
   box(w,len,depth,steel);
   const padMat=M(0x252a2c,.02,.98);
   if(/strip/.test(nm)){
    for(let i=0;i<7;i++)box(w*.88,.045,depth*.8,padMat,[0,(i-3)*len*.13,depth*.56]);
   }else{
    const n=id.includes('156')||id.includes('gp156')?5:id.includes('036')?3:2;
    for(let x=0;x<n;x++)for(let y=0;y<n;y++)box(w*.12,len*.1,depth*.8,padMat,[(x-(n-1)/2)*w*.18,(y-(n-1)/2)*len*.17,depth*.58]);
   }
   for(let x of [-1,1])for(let y of [-1,1])bolt(x*w*.43,y*len*.43,depth*.62,.025,gold);
   return;
  }
  if(enginePlate){
   const count=id.includes('ep50')?8:id.includes('ep37')?6:id.includes('ep25')?4:3;
   lathe([[r*.42,-h*.12],[r*.9,-h*.12],[r,-h*.06],[r,h*.08],[r*.9,h*.14],[r*.42,h*.14]],steel,80);
   band(r*.98,h*.08,.04,gold);band(r*.98,-h*.07,.04,aluminium);
   for(let i=0;i<count;i++){
    const ang=i*Math.PI*2/count,x=Math.cos(ang)*r*.64,z=Math.sin(ang)*r*.64;
    const mount=new THREE.Mesh(new THREE.CylinderGeometry(r*.2,r*.2,h*.18,48),dark);mount.position.set(x,h*.02,z);g.add(mount);
    band(r*.2,h*.11,.018,gold).position.set(x,h*.11,z);
    for(let j=0;j<6;j++){const aa=j*Math.PI/3;bolt(x+Math.cos(aa)*r*.16,h*.12,z+Math.sin(aa)*r*.16,.015,aluminium);}
   }
   return;
  }
  if(strut||beam){
   if(id.includes('cubic')||/octagonal strut|octagonal connector/.test(nm)){
    const shape=new THREE.OctahedronGeometry(r*.7,0);add(shape,aluminium);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=Math.cos(a)*r*.62,z=Math.sin(a)*r*.62;bolt(x,0,z,.035,gold);}
   }else if(beam){
    const long=h>r*1.4;
    const length=long?h:r*1.7,width=long?r*.2:r*.16,depth=r*.18;
    box(width,length,depth,steel);
    box(width*.28,length*.92,depth*1.08,aluminium,[0,0,depth*.08]);
    for(let y=-length*.42;y<=length*.43;y+=length*.14){
     box(width*.96,.035,depth*.95,aluminium,[0,y,0]);
     for(let side of [-1,1])bolt(side*width*.38,y,depth*.52,.018,gold);
    }
    if(/panel/.test(nm)){
     box(r*1.65,h*.82,.06,ivory);
     for(let x=-2;x<=2;x++)box(.018,h*.72,.018,steel,[x*r*.28,0,.045]);
     for(let y=-2;y<=2;y++)box(r*1.5,.018,.018,steel,[0,y*h*.16,.05]);
    }
   }else{
    box(r*1.7,.12,r*.5,steel);box(.12,r*1.7,r*.5,aluminium);
    for(let x of [-1,1])for(let z of [-1,1])bolt(x*r*.72,0,z*r*.3,.05,gold);
   }
   return;
  }
  if(hub){
   cyl(r*.9,r*.9,h*.65,steel);
   for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a)*r*.86,z=Math.sin(a)*r*.86;lathe([[0,-h*.18],[r*.18,-h*.18],[r*.2,h*.18],[0,h*.18]],aluminium,24,[x,0,z]);}
   band(r*.9,h*.32,.05,gold);return;
  }
  // Axial stack couplers have a thin split collar and machined top/bottom flanges.
  const hh=separator?h*.34:h*.28;
  lathe([[0,-hh*.5],[r*.72,-hh*.5],[r*.92,-hh*.42],[r,-hh*.28],[r,-hh*.16],[r*.84,-hh*.08],[r*.84,hh*.08],[r,hh*.16],[r,hh*.28],[r*.92,hh*.42],[r*.72,hh*.5],[0,hh*.5]],steel,80);
  band(r*.99,hh*.42,.045,aluminium);band(r*.99,-hh*.42,.045,gold);
  band(r*.86,0,.045,dark);band(r*.9,separator?hh*.16:-hh*.12,.025,orange);
  detailRivets(r*.93,-hh*.3,16);detailRivets(r*.93,hh*.3,16,.1);
  // Small black/yellow caution blocks around the separation seam.
  for(let i=0;i<12;i++){const ang=i*Math.PI/6,x=Math.cos(ang)*r*.995,z=Math.sin(ang)*r*.995;box(r*.09,.035,.025,i%2?dark:gold,[x,0,z],[0,-ang,0]);}
  if(adapter){
   lathe([[0,hh*.12],[r*.5,hh*.12],[r*.55,hh*.22],[r*.85,hh*.48],[r*.95,hh*.5],[0,hh*.5]],ivory,64);
   band(r*.55,hh*.22,.035,gold);
  }
  if(tri||quad||bi){
   const n=tri?3:quad?4:2;
   for(let i=0;i<n;i++){const ang=i*Math.PI*2/n,x=Math.cos(ang)*r*.58,z=Math.sin(ang)*r*.58;lathe([[0,hh*.12],[r*.22,hh*.12],[r*.24,hh*.48],[0,hh*.48]],aluminium,32,[x,0,z]);band(r*.23,hh*.46,.025,gold).position.set(x,hh*.46,z);}
  }
  // Direction arrow on one-way decouplers; separators receive symmetric release lips.
  if(!separator){
   const arrow=new THREE.Mesh(new THREE.ConeGeometry(r*.13,h*.18,3),orange);arrow.position.set(0,hh*.54,r*.84);arrow.rotation.x=Math.PI/2;g.add(arrow);
  }else{
   band(r*.97,hh*.5,.025,orange);band(r*.97,-hh*.5,.025,orange);
  }
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
  const nm=(id+' '+name).toLowerCase();
  const landingLeg=/lt-?1|lt-?2|lt-?5|着陸脚/.test(nm);
  const fixed=/ly-?01|ly-?05|固定式|steerable/.test(nm)&&!id.includes('ly10');
  const retractable=/ly-?10|ly-?35|ly-?60|ly-?99|小型ランディング|中型ランディング|大型ランディング|超大型/.test(nm);
  const large=/ly-?60|ly-?99|大型|超大型/.test(nm),medium=/ly-?35|中型/.test(nm),steer=/ly-?05|ly-?10|ly-?35|steering|ステアリング/.test(nm);
  if(landingLeg){
   // LT landing strut: one telescopic leg with a splayed brace and a broad ground shoe.
   const pivot=new THREE.Group();pivot.name='landing-gear-pivot';pivot.userData.side=1;pivot.position.set(0,-h*.02,0);g.add(pivot);
   const legScale=/lt-?5/.test(nm)?.72:/lt-?2/.test(nm)?1.22:1;
   const L=h*.68*legScale,spread=r*.72*legScale,rod=Math.max(.025,r*.11);
   const mount=new THREE.Mesh(new THREE.CylinderGeometry(r*.34,r*.38,h*.24,24),steel);mount.position.set(0,h*.22,0);pivot.add(mount);
   band(r*.38,h*.32,.035,gold);
   const mainPath=new THREE.CatmullRomCurve3([new THREE.Vector3(0,h*.18,0),new THREE.Vector3(spread*.18,0,0),new THREE.Vector3(spread*.62,-L*.62,0),new THREE.Vector3(spread,-L,0)]);
   const main=new THREE.Mesh(new THREE.TubeGeometry(mainPath,32,rod,12,false),aluminium);main.castShadow=true;main.receiveShadow=true;pivot.add(main);
   const oleo=new THREE.Mesh(new THREE.CylinderGeometry(rod*.9,rod*1.15,L*.3,20),steel);oleo.position.set(spread*.34,-L*.35,r*.05);oleo.rotation.z=-.42;pivot.add(oleo);
   const piston=new THREE.Mesh(new THREE.CylinderGeometry(rod*.32,rod*.32,L*.22,16),gold);piston.position.set(spread*.55,-L*.65,r*.05);piston.rotation.z=-.38;pivot.add(piston);
   const bracePath=new THREE.CatmullRomCurve3([new THREE.Vector3(0,h*.12,-r*.12),new THREE.Vector3(spread*.35,-L*.22,-r*.18),new THREE.Vector3(spread*.82,-L*.82,-r*.18)]);
   const brace=new THREE.Mesh(new THREE.TubeGeometry(bracePath,20,rod*.42,8,false),steel);pivot.add(brace);
   const shoe=new THREE.Mesh(new THREE.BoxGeometry(r*.72*legScale,.09*legScale,r*.42*legScale),dark);shoe.position.set(spread,-L,r*.02);shoe.castShadow=true;pivot.add(shoe);
   const foot=new THREE.Mesh(new THREE.BoxGeometry(r*.68*legScale,.035*legScale,r*.38*legScale),aluminium);foot.position.set(spread,-L-.045*legScale,r*.02);pivot.add(foot);
   for(let x of [-1,1])bolt(spread+x*r*.22*legScale,-L-.02,r*.18,.022,gold);
   for(let i=0;i<5;i++)box(r*.5,.025,.025,i%2?dark:gold,[spread,-L*.78+i*L*.035,r*.13]);
   return;
  }
  // LY aircraft gear: a single compact wheel assembly with an actual fork, oleo and bay door.
  const wheelR=large?r*.36:medium?r*.31:r*.27,wheelW=large?.2:medium?.16:.13;
  const bayW=r*(large?1.12:medium?.98:.82),bayH=h*.42;
  lathe([[0,-h*.35],[r*.36,-h*.35],[r*.48,-h*.22],[r*.48,h*.24],[r*.34,h*.35],[0,h*.35]],steel,40);
  band(r*.49,h*.24,.035,gold);band(r*.49,-h*.22,.025,aluminium);
  box(bayW,bayH,.11,painted('#d5d8d5','#b68b4e','LANDING GEAR BAY',name),[0,h*.16,r*.22]);
  box(bayW*.72,bayH*.68,.04,dark,[0,h*.16,r*.29]);
  for(let side of [-1,1]){
   tube([[side*bayW*.34,h*.32,r*.26],[side*bayW*.34,h*.02,r*.3],[side*bayW*.28,-h*.12,r*.28]],.025,aluminium);
   for(let j=0;j<4;j++)bolt(side*bayW*.32,(j-1.5)*bayH*.18,r*.3,.018,gold);
  }
  const pivot=new THREE.Group();pivot.name=fixed?'landing-gear-fixed':'landing-gear-pivot';pivot.userData.side=1;pivot.position.set(0,-h*.12,0);g.add(pivot);
  const strutPath=new THREE.CatmullRomCurve3([new THREE.Vector3(0,h*.22,0),new THREE.Vector3(0,h*.02,r*.08),new THREE.Vector3(0,-h*.2,r*.22),new THREE.Vector3(0,-h*.43,r*.32)]);
  const strut=new THREE.Mesh(new THREE.TubeGeometry(strutPath,28,Math.max(.035,r*.075),12,false),aluminium);strut.castShadow=true;pivot.add(strut);
  const oleo=new THREE.Mesh(new THREE.CylinderGeometry(r*.09,r*.12,h*.28,20),steel);oleo.position.set(0,-h*.12,r*.16);oleo.rotation.x=.18;pivot.add(oleo);
  const piston=new THREE.Mesh(new THREE.CylinderGeometry(r*.045,r*.045,h*.22,16),gold);piston.position.set(0,-h*.29,r*.22);piston.rotation.x=.18;pivot.add(piston);
  for(let side of [-1,1]){
   const fork=tube([[side*r*.12,-h*.25,r*.2],[side*r*.24,-h*.39,r*.28],[side*r*.25,-h*.52,r*.34]],Math.max(.025,r*.04),steel);pivot.add(fork);
  }
  const count=large?4:medium?2:1;
  for(let i=0;i<count;i++){
   const z=(i-(count-1)/2)*wheelR*.62;
   const wheel=makeRollingWheel(wheelR,wheelW,[0,-h*.57,z+r*.34],'aircraft');
   g.remove(wheel);pivot.add(wheel);
  }
  // Fixed LY-01/05 retain the exposed fork; LY-10 and larger have retractable clamshell doors.
  if(retractable){
   for(let side of [-1,1]){
    const door=box(bayW*.38,h*.06,.055,ivory,[side*bayW*.25,-h*.12,r*.42]);
    door.rotation.z=side*.08;
    tube([[side*bayW*.25,-h*.12,r*.42],[side*bayW*.38,-h*.22,r*.48],[side*bayW*.4,-h*.32,r*.46]],.018,gold);
   }
  }else{
   // Fixed gear uses a rigid triangular brace and no false retractable door.
   for(let side of [-1,1])tube([[side*r*.25,h*.18,0],[side*r*.42,-h*.08,r*.1],[0,-h*.48,r*.3]],.035,steel);
  }
  if(steer){
   const steeringHub=new THREE.Mesh(new THREE.CylinderGeometry(wheelR*.18,wheelR*.18,wheelW*.9,20),gold);steeringHub.rotation.z=Math.PI/2;steeringHub.position.set(0,-h*.56,r*.34);pivot.add(steeringHub);
  }
  // Landing lights and hydraulic service fittings.
  for(let side of [-1,1]){
   sphere(.045, M(0xe7e4c7,.1,.18,{emissive:0x6b5c2c,emissiveIntensity:.3}),[side*bayW*.36,h*.2,r*.3],[1,.7,.35]);
   bolt(side*bayW*.36,h*.32,r*.3,.02,gold);
  }
 };

 const makeIntake=()=>{
  const nm=(id+' '+name).toLowerCase();
  const shock=/shock|ショック/.test(nm),circular=/circular|サーキュラー/.test(nm),ram=/ram|ramp|可変インテーク|可変型/.test(nm),radial=/radial|ラジアル/.test(nm),nacelle=/nacelle|ナセル/.test(nm),precool=/precool|プリクーラー/.test(nm),dsi=/diverterless|supersonic|ダイバータレス/.test(nm);
  const shell=painted('#cbd0cd','#b68b4e','AIR INDUCTION SYSTEM',name);
  if(nacelle||precool){
   const long=nacelle?h*1.1:h*.88,rr=r*.82;
   const duct=add(new THREE.CylinderGeometry(rr,rr,long,64,1,false),shell,[0,0,0],[Math.PI/2,0,0]);
   for(let z of [-long*.48,long*.48]){const ring=add(new THREE.TorusGeometry(rr,.055,12,64),gold,[0,0,z],[0,0,0]);}
   // Forward intake lip and deep internal compressor throat.
   add(new THREE.TorusGeometry(rr*.84,.07,14,64),aluminium,[0,0,long*.5],[0,0,0]);
   add(new THREE.CircleGeometry(rr*.72,48),black,[0,0,long*.505]);
   for(let i=0;i<14;i++){const ang=i*Math.PI*2/14,x=Math.cos(ang)*rr*.5,y=Math.sin(ang)*rr*.5;const blade=box(.025,.12,rr*.5,steel,[x,y,long*.43],[0,0,ang]);}
   if(precool){
    for(let i=0;i<12;i++){const z=(i-5.5)*long*.07;const fin=add(new THREE.TorusGeometry(rr*1.02,.018,8,64),aluminium,[0,0,z],[0,0,0]);}
    for(let side of [-1,1]){box(rr*.18,long*.55,.1,dark,[side*rr*.94,0,0]);for(let j=0;j<5;j++)box(rr*.16,.025,.03,orange,[side*rr*.99,(j-2)*long*.1,0]);}
   }else{
    for(let side of [-1,1]){const p=box(rr*.3,long*.5,.07,ivory,[side*rr*.78,0,0]);p.rotation.z=side*.12;for(let j=0;j<4;j++)bolt(side*rr*.85,(j-1.5)*long*.1,.05,.018,gold);}
   }
   return;
  }
  if(dsi){
   // Mk1 DSI inlet: flattened rectangular mouth, curved compression bump and side fences.
   const width=r*1.75,depth=h*.72,thick=r*.54;
   box(width,thick,depth,shell);
   box(width*.86,thick*.5,depth*.88,dark,[0,thick*.05,depth*.08]);
   box(width*.72,thick*.36,depth*.7,black,[0,thick*.12,depth*.12]);
   const bump=add(new THREE.SphereGeometry(width*.24,32,20),aluminium,[0,thick*.42,depth*.12],[0,0,0],[1,.3,1.25]);
   for(let side of [-1,1]){
    box(width*.08,thick*.7,depth*.92,steel,[side*width*.47,0,0]);
    tube([[side*width*.38,thick*.2,-depth*.35],[side*width*.32,thick*.32,0],[side*width*.38,thick*.2,depth*.35]],.025,gold);
   }
   for(let i=0;i<6;i++)box(width*.07,.025,.04,aluminium,[(i-2.5)*width*.12,thick*.35,depth*.42]);
   return;
  }
  if(radial){
   // XM-G50 / variable radial intake: side-mounted oval duct with an offset mounting shoe.
   const rr=r*.78,bodyH=h*.72;
   lathe([[0,-bodyH*.5],[rr*.72,-bodyH*.5],[rr,-bodyH*.34],[rr,h*.2],[rr*.82,h*.44],[rr*.5,h*.5],[0,h*.5]],shell,64);
   const lip=add(new THREE.TorusGeometry(rr*.78,.07,14,56),aluminium,[0,0,h*.48],[Math.PI/2,0,0]);
   add(new THREE.CircleGeometry(rr*.67,48),black,[0,0,h*.485],[Math.PI/2,0,0]);
   box(r*1.2,h*.28,.1,steel,[0,-h*.28,-r*.3]);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(rr*.96,-h*.28,h*.28,ang,aluminium,.018);}
   for(let i=0;i<4;i++)box(.04,.04,r*.42,steel,[(i-1.5)*r*.2,h*.02,h*.36]);
   if(ram){
    const ramp=box(rr*.9,.055,h*.34,gold,[0,-h*.1,h*.28],[.3,0,0]);
    for(let side of [-1,1])tube([[side*rr*.48,-h*.2,h*.25],[side*rr*.3,h*.05,h*.42],[side*rr*.22,h*.25,h*.46]],.022,steel);
   }
   return;
  }
  if(shock){
   // Shock cone: long pointed centrebody suspended inside a wide annular inlet.
   const shellR=r*.88;
   lathe([[0,-h*.48],[shellR*.55,-h*.48],[shellR*.92,-h*.32],[shellR,h*.2],[shellR*.82,h*.42],[shellR*.5,h*.5],[0,h*.5]],shell,72);
   add(new THREE.TorusGeometry(shellR*.78,.075,16,64),aluminium,[0,0,h*.46],[Math.PI/2,0,0]);
   add(new THREE.CircleGeometry(shellR*.66,48),black,[0,0,h*.47],[Math.PI/2,0,0]);
   const spike=add(new THREE.ConeGeometry(shellR*.34,h*.82,48),steel,[0,0,h*.12],[Math.PI/2,0,0]);
   spike.rotation.x=Math.PI/2;
   const support=add(new THREE.TorusGeometry(shellR*.48,.035,10,48),gold,[0,0,h*.2],[Math.PI/2,0,0]);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(shellR*.9,-h*.3,h*.28,ang,steel,.025);}
   band(shellR,h*.22,.045,gold);
   return;
  }
  if(ram){
   // Adjustable ramp intake: rectangular duct with a hinged internal compression ramp.
   const width=r*1.5,length=h*.86,thick=r*.54;
   box(width,thick,length,shell);
   box(width*.86,thick*.64,length*.84,dark,[0,0,length*.05]);
   box(width*.7,thick*.42,length*.7,black,[0,thick*.02,length*.06]);
   const ramp=box(width*.62,.07,length*.48,aluminium,[0,-thick*.18,length*.2],[.36,0,0]);
   for(let side of [-1,1]){
    box(width*.08,thick*.82,length*.9,steel,[side*width*.46,0,0]);
    tube([[side*width*.28,-thick*.18,length*.1],[side*width*.28,thick*.16,length*.34],[side*width*.28,thick*.12,length*.42]],.025,gold);
    for(let j=0;j<5;j++)bolt(side*width*.46,(j-2)*thick*.14,length*.42,.018,aluminium);
   }
   band(width*.48,length*.47,.025,gold);
   return;
  }
  // Circular intake family: short duct, rolled lip, inner diffuser and stator vanes.
  const shellR=r*.82;
  lathe([[0,-h*.48],[shellR*.62,-h*.48],[shellR*.92,-h*.3],[shellR,h*.22],[shellR*.82,h*.46],[shellR*.48,h*.5],[0,h*.5]],shell,64);
  add(new THREE.TorusGeometry(shellR*.78,.07,14,56),aluminium,[0,0,h*.48],[Math.PI/2,0,0]);
  add(new THREE.CircleGeometry(shellR*.66,48),black,[0,0,h*.485],[Math.PI/2,0,0]);
  for(let i=0;i<12;i++){const ang=i*Math.PI/6;const x=Math.cos(ang)*shellR*.43,y=Math.sin(ang)*shellR*.43;box(.025,.035,shellR*.48,steel,[x,y,h*.25],[0,0,ang]);}
  for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(shellR*.98,-h*.25,h*.28,ang,steel,.018);}
  band(shellR,h*.22,.04,gold);band(shellR*.9,-h*.38,.025,aluminium);
 };

 const makeBattery=()=>{
  const nm=(id+' '+name).toLowerCase();
  const reaction=/wheel-(small|advanced|large)|reaction wheel|リアクションホイール|スタビライザー/.test(nm);
  if(reaction){
   // Reaction wheel assembly: machined gyroscope housing, high-speed flywheel and bearing rings.
   const big=/large|大型/.test(nm),rr=r*(big?.92:.66),hh=h*(big?.78:.62);
   lathe([[0,-hh*.5],[rr*.72,-hh*.5],[rr*.92,-hh*.38],[rr,hh*.3],[rr*.82,hh*.48],[0,hh*.48]],painted('#778286','#b68b4e','REACTION CONTROL GYROSCOPE',name),72);
   for(let y of [-hh*.38,hh*.34])band(rr,y,.04,gold);
   cyl(rr*.72,rr*.72,.08,dark,hh*.49,56);
   cyl(rr*.54,rr*.54,.12,steel,hh*.56,56);
   add(new THREE.TorusGeometry(rr*.48,.05,12,64),aluminium,[0,hh*.63,0]);
   cyl(rr*.25,rr*.25,.16,gold,hh*.66,40);
   for(let i=0;i<16;i++){const ang=i*Math.PI/8;radialPipe(rr*.98,-hh*.28,hh*.28,ang,steel,.018);}
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(rr*.84*Math.cos(ang),-hh*.35,rr*.84*Math.sin(ang),.022,aluminium);}
   for(let side of [-1,1])box(rr*.22,.16,rr*.28,steel,[side*rr*.84,-hh*.2,0]);
   return;
  }
  const rtg=/rtg|pb-nuk|mininuk|原子力電池/.test(nm),fuelcell=/fuel.?cell|燃料電池/.test(nm);
  if(rtg){
   box(r*1.25,.12,r*1.15,steel,[0,-h*.38,0]);
   const coreR=r*.27;
   lathe([[0,-h*.3],[coreR*.7,-h*.3],[coreR,-h*.2],[coreR,h*.32],[coreR*.72,h*.42],[0,h*.42]],painted('#515b5d','#b68b4e','RADIOISOTOPE POWER CORE',name),48);
   for(let i=0;i<12;i++){
    const ang=i*Math.PI/6,x=Math.cos(ang)*r*.58,z=Math.sin(ang)*r*.58;
    box(r*.3,h*.58,.055,aluminium,[x,h*.02,z],[0,-ang,0]);
    for(let j=0;j<4;j++)box(r*.22,.018,.018,steel,[x,(j-1.5)*h*.12,z+.03],[0,-ang,0]);
    tube([[Math.cos(ang)*coreR,h*.22,Math.sin(ang)*coreR],[x,h*.22,z]],.018,gold);
   }
   cyl(coreR*.7,coreR*.7,.1,gold,h*.45,32);
   for(let i=0;i<4;i++){const x=(i%2?1:-1)*r*.42,z=(i<2?1:-1)*r*.36;box(.12,.12,.12,dark,[x,-h*.3,z]);bolt(x,-h*.23,z,.025,orange);}
   return;
  }
  if(fuelcell){
   box(r*1.5,h*.8,r*.88,painted('#8b9791','#c56b31','FUEL CELL CONVERTER',name));
   box(r*1.15,h*.52,.045,dark,[0,0,r*.47]);
   for(let i=0;i<9;i++)box(r*.96,.025,.025,aluminium,[0,(i-4)*h*.055,r*.5]);
   for(let side of [-1,1]){
    lathe([[0,-h*.32],[r*.2,-h*.32],[r*.23,-h*.22],[r*.23,h*.22],[r*.18,h*.32],[0,h*.32]],steel,32,[side*r*.65,0,0]);
    band(r*.23,h*.25,.025,gold).position.x=side*r*.65;
    tube([[side*r*.65,h*.22,0],[side*r*.88,h*.32,r*.08],[side*r*.88,-h*.3,r*.08]],.028,orange);
   }
   box(r*.46,.13,.12,steel,[0,h*.48,0]);
   for(let i=0;i<4;i++)sphere(.04,i%2?orange:blue,[(i-1.5)*r*.18,h*.5,.08],[1,.6,.4]);
   return;
  }
  const z100=/z-?100/.test(nm),z200=/z-?200/.test(nm),z400=/z-?400/.test(nm),z1k=/z-?1k|z-?1000/.test(nm),z4k=/z-?4k|z-?4000/.test(nm);
  const height=z4k?h*1.15:z1k?h*.95:z200?h*.72:h*.62,width=z4k?r*1.3:z1k?r*1.05:z200?r*.88:r*.72;
  const mat=painted(z100?'#c6c9c3':'#b8c0c0','#b68b4e','RECHARGEABLE POWER BANK',name);
  if(z200||z1k||z4k){
   lathe([[0,-height*.5],[width*.72,-height*.5],[width*.92,-height*.4],[width,height*.38],[width*.78,height*.5],[0,height*.5]],mat,64);
   for(let y of [-height*.4,-height*.28,height*.34,height*.44])band(width*.98,y,.028,y<0?steel:gold);
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;radialPipe(width*.98,-height*.32,height*.3,ang,aluminium,.014);}
  }else{
   box(width*1.25,height,width*.55,mat);
   for(let side of [-1,1])box(width*.08,height*.82,.035,steel,[side*width*.62,0,width*.29]);
   for(let i=0;i<7;i++)box(width*.9,.018,.018,aluminium,[0,(i-3)*height*.11,width*.29]);
  }
  box(width*.58,height*.16,.045,dark,[0,height*.22,width*.32]);
  for(let i=0;i<5;i++)sphere(.035,i<2?green:i===2?orange:blue,[(i-2)*width*.1,height*.22,width*.35],[1,.7,.3]);
  for(let side of [-1,1]){cyl(width*.12,width*.12,.1,steel,height*.52,20).position.x=side*width*.26;bolt(side*width*.46,-height*.4,width*.34,.022,gold);}
  radialLabel(width*.68,0,width*.5,height*.18,getLabelMaterial());
 }; const makeScience=()=>{
  const nm=(id+' '+name).toLowerCase();
  const goo=/goo|グー/.test(nm),gauge=/thermo|barometer|温度計|気圧計/.test(nm),material=/materialbay|science jr|サイエンスjr/.test(nm);
  const magnet=/magnetometer|磁力計/.test(nm),seismic=/accelerometer|seismic|地震/.test(nm),atmos=/atmosphere|spectro|大気分光/.test(nm);
  const grav=/grav|重力子|グラヴィオリ/.test(nm),telescope=/telescope|sentinel|望遠鏡/.test(nm),m4435=/m4435|narrow.?band/.test(nm),m700=/m700|survey scanner|探査スキャナー/.test(nm);
  const surface=/surface scan|地表スキャン/.test(nm),arm=/scan arm|スキャンアーム|crsy|sprt|op-e/.test(nm),control=/experiment control|実験制御/.test(nm);
  const monitor=/goo monitor|観察滞在/.test(nm),weather=/weather|ウェザー/.test(nm),ion=/ionographer|イオノグラファー/.test(nm),grand=/grand slam|受動地震/.test(nm);
  const body=painted('#cbd0ca','#b68b4e','SCIENTIFIC INSTRUMENT',name);
  if(goo||monitor){
   // Mystery Goo containment: clear pressure vessel, dark retaining cage and visible green sample.
   cyl(r*.62,r*.62,h*.1,steel,-h*.35,48);
   const jar=add(new THREE.SphereGeometry(r*.56,48,32),M(0xdce8e2,.05,.12,{transparent:true,opacity:.32,side:THREE.DoubleSide}),[0,h*.04,0],[1,1.12,1]);
   sphere(r*.38,M(0x799a59,.08,.28),[0,-h*.05,0],[1,.86,.9]);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(r*.62,-h*.3,h*.28,ang,steel,.025);bolt(r*.62*Math.cos(ang),h*.32,r*.62*Math.sin(ang),.02,gold);}
   band(r*.62,-h*.3,.045,gold);band(r*.62,h*.3,.045,aluminium);
   if(monitor){box(r*.34,h*.18,.06,dark,[0,h*.38,r*.42]);sphere(.09,glass,[0,h*.4,r*.47]);}
   return;
  }
  if(gauge){
   // Analog instrument face with calibrated tick marks and a physical pointer.
   box(r*1.15,h*.78,r*.42,painted('#d1d4ce','#b68b4e','ENVIRONMENTAL SENSOR',name));
   const face=add(new THREE.CircleGeometry(r*.43,48),dark,[0,h*.05,r*.24],[0,0,0]);
   add(new THREE.TorusGeometry(r*.44,.035,10,48),aluminium,[0,h*.05,r*.25],[0,0,0]);
   add(new THREE.CircleGeometry(r*.34,48),ivory,[0,h*.05,r*.27]);
   for(let i=0;i<21;i++){const ang=-Math.PI*.8+i*Math.PI*1.6/20,x=Math.sin(ang)*r*.29,y=Math.cos(ang)*r*.29;box(.018,.065,.018,steel,[x,h*.05+y,r*.29],[0,0,-ang]);}
   const needle=box(.018,r*.27,.02,orange,[0,h*.12,r*.31]);needle.rotation.z=-.55;
   sphere(.06,gold,[0,h*.05,r*.33]);
   for(let side of [-1,1])bolt(side*r*.42,-h*.3,r*.24,.02,gold);
   return;
  }
  if(material){
   // SC-9001 Science Jr.: cylindrical lab canister with four opening instrument panels.
   lathe([[0,-h*.48],[r*.78,-h*.48],[r*.94,-h*.36],[r*.94,h*.34],[r*.78,h*.48],[0,h*.48]],body,72);
   for(let y of [-h*.38,h*.38])band(r*.96,y,.045,gold);
   cyl(r*.62,r*.62,.08,dark,h*.42,48);
   for(let i=0;i<4;i++){
    const ang=i*Math.PI/2,x=Math.sin(ang)*r*.78,z=Math.cos(ang)*r*.78;
    box(r*.58,h*.54,.06,ivory,[x,0,z],[0,-ang,0]);
    box(r*.42,h*.4,.025,dark,[x,0,z+.04],[0,-ang,0]);
    for(let j=0;j<4;j++)box(r*.3,.025,.02,aluminium,[x,(j-1.5)*h*.085,z+.06],[0,-ang,0]);
    for(let j=0;j<3;j++)sphere(.045,j%2?orange:blue,[x+(j-1)*r*.12,h*.2,z+.08]);
    tube([[x-r*.22,-h*.28,z],[x-r*.22,-h*.4,z],[x+r*.22,-h*.4,z],[x+r*.22,-h*.28,z]],.018,steel);
   }
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;bolt(r*.94*Math.cos(ang),-h*.4,r*.94*Math.sin(ang),.02,aluminium);}
   return;
  }
  if(magnet||seismic||grand){
   const boom=magnet||grand;
   box(r*1.25,.13,r*1.1,steel,[0,-h*.36,0]);
   lathe([[0,-h*.3],[r*.32,-h*.3],[r*.42,-h*.18],[r*.42,h*.25],[r*.28,h*.35],[0,h*.35]],body,48);
   for(let side of [-1,1]){
    const x=side*r*.42;
    tube([[x,h*.12,0],[x*1.4,h*.28,0],[x*1.9,h*.58,0],[x*2.2,h*.65,0]],.035,aluminium);
    for(let j=0;j<3;j++)tube([[x*(1.2+j*.3),h*.28+j*h*.1,0],[x*(1.25+j*.3),h*.34+j*h*.1,r*.16]],.018,gold);
   }
   if(magnet){
    for(let side of [-1,1])add(new THREE.TorusGeometry(r*.35,.035,10,48),gold,[side*r*1.05,h*.64,0],[Math.PI/2,0,0]);
    sphere(.11,blue,[0,h*.42,0]);
   }else if(seismic||grand){
    for(let i=0;i<3;i++){const ang=i*Math.PI*2/3,x=Math.cos(ang)*r*.58,z=Math.sin(ang)*r*.58;tube([[0,-h*.18,0],[x,-h*.48,z]],.045,steel);cyl(.11,.11,.06,dark,-h*.49,20).position.set(x,-h*.49,z);}
    const pendulum=add(new THREE.SphereGeometry(r*.14,20,16),gold,[0,h*.12,0]);
    tube([[0,h*.12,0],[0,h*.34,0]],.025,aluminium);
   }
   return;
  }
  if(atmos||weather||ion){
   box(r*1.1,h*.5,r*.72,body);
   for(let side of [-1,1])box(r*.12,h*.65,r*.12,steel,[side*r*.45,0,0]);
   const mastH=h*(weather?1.05:.78);
   tube([[0,h*.22,0],[0,h*.22+mastH*.7,0],[0,h*.22+mastH,0]],.03,aluminium);
   if(weather){
    for(let i=0;i<3;i++){const ang=i*Math.PI*2/3;const x=Math.cos(ang)*r*.42,z=Math.sin(ang)*r*.42;tube([[0,h*.65,0],[x,h*.82,z]],.02,gold);sphere(.08,ivory,[x,h*.82,z]);}
    box(r*.65,.06,.08,orange,[0,h*.96,0]);
   }else if(ion){
    for(let i=0;i<6;i++){const ang=i*Math.PI/3;const x=Math.cos(ang)*r*.7,z=Math.sin(ang)*r*.7;tube([[0,h*.35,0],[x,h*.7,z],[x*1.15,h*.92,z*1.15]],.025,gold);sphere(.045,blue,[x*1.15,h*.92,z*1.15]);}
   }else{
    lathe([[0,h*.3],[r*.2,h*.3],[r*.34,h*.46],[r*.5,h*.72],[r*.42,h*.78],[0,h*.78]],aluminium,40);
    cyl(r*.16,r*.16,.1,glass,h*.78,24);
    for(let i=0;i<4;i++){const ang=i*Math.PI/2;radialPipe(r*.48,h*.35,h*.7,ang,steel,.02);}
   }
   for(let i=0;i<4;i++)bolt((i-1.5)*r*.22,-h*.2,r*.4,.02,gold);
   return;
  }
  if(telescope||m4435||m700||surface){
   const long=telescope||m4435,scanner=m700||surface;
   lathe([[0,-h*.48],[r*.42,-h*.48],[r*.52,-h*.36],[r*.52,h*.38],[r*.4,h*.5],[0,h*.5]],painted('#596368','#b68b4e',scanner?'SURVEY SCANNER':'OPTICAL INSTRUMENT',name),64);
   for(let y of [-h*.35,h*.34])band(r*.53,y,.045,gold);
   if(telescope||m4435){
    const tubeR=r*(telescope?.38:.28);
    lathe([[0,h*.18],[tubeR*.8,h*.18],[tubeR,h*.28],[tubeR,h*.82],[tubeR*.82,h*.92],[0,h*.92]],steel,48);
    band(tubeR,h*.78,.035,gold);
    add(new THREE.CircleGeometry(tubeR*.72,48),glass,[0,h*.92,0],[Math.PI/2,0,0]);
    for(let side of [-1,1])tube([[side*r*.35,h*.25,0],[side*r*.5,h*.58,0],[0,h*.78,0]],.025,aluminium);
    if(telescope){box(r*.8,h*.18,.06,dark,[0,h*.38,r*.45]);sphere(.12,glass,[0,h*.42,r*.5]);}
   }else{
    const head=box(r*1.05,h*.2,r*.72,steel,[0,h*.42,0]);
    for(let i=0;i<4;i++){const x=(i-1.5)*r*.22;sphere(.09,glass,[x,h*.43,r*.38],[1,.5,1]);}
    if(m700){
     add(new THREE.TorusGeometry(r*.54,.04,10,48),gold,[0,h*.53,0],[Math.PI/2,0,0]);
     for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(r*.54,h*.38,h*.68,ang,aluminium,.018);}
    }else{
     for(let side of [-1,1])tube([[side*r*.42,h*.3,0],[side*r*.62,h*.62,0],[side*r*.62,h*.75,0]],.025,gold);
    }
   }
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(r*.5*Math.cos(ang),-h*.4,r*.5*Math.sin(ang),.018,gold);}
   return;
  }
  if(arm){
   const count=/op-e|large|ラージ/.test(nm)?4:/sprt|medium|ミディアム/.test(nm)?3:2;
   box(r*.72,h*.22,r*.72,steel,[0,-h*.38,0]);
   let last=[0,-h*.22,0];
   for(let i=0;i<count;i++){
    const end=[r*(.3+i*.34),h*(.02+i*.18),0];
    tube([last,end],Math.max(.025,r*.075),aluminium);
    tube([[last[0],last[1]+.06,last[2]+.05],[end[0],end[1]+.06,end[2]+.05]],.018,steel);
    sphere(.06,gold,end);
    last=end;
   }
   box(r*.42,.12,r*.32,painted('#bfc6c2','#b68b4e','ROBOTIC SCIENCE SCANNER',name),last);
   for(let i=0;i<3;i++)sphere(.055,i===0?blue:glass,[last[0]+(i-1)*r*.12,last[1]+.08,last[2]+r*.18],[1,.6,.3]);
   return;
  }
  if(control){
   box(r*1.1,h*.62,r*.72,body);
   for(let i=0;i<4;i++){const ang=i*Math.PI/2;const x=Math.cos(ang)*r*.42,z=Math.sin(ang)*r*.42;tube([[0,h*.2,0],[x,h*.55,z]],.025,gold);}
   return;
  }
  // Generic instrument chassis: raised control face, fasteners and cable glands.
  box(r*1.2,h*.72,r*.68,body);
  box(r*.82,h*.38,.04,dark,[0,0,r*.36]);
  for(let i=0;i<5;i++){const x=(i-2)*r*.16;sphere(.045,i%2?orange:blue,[x,h*.06,r*.4],[1,.7,.3]);}
  for(let side of [-1,1]){tube([[side*r*.48,-h*.22,0],[side*r*.66,-h*.3,r*.18],[side*r*.66,h*.3,r*.18]],.02,gold);bolt(side*r*.5,h*.28,r*.35,.02,aluminium);}
 };
 const makeComm=()=>{
  const nm=(id+' '+name).toLowerCase();
  const dish=/dts|hg-5|hg-55|88-88|ra-|relay|dish|中継|ハイゲイン/.test(nm);
  const large=/ra-100|88-88/.test(nm),medium=/ra-15|hg-55|dts/.test(nm),small=/ra-2|hg-5/.test(nm);
  const fixed=/16-s|communotron 16-s|固定/.test(nm),flat=/dts/.test(nm);
  const baseR=r*(large?1.05:medium?.86:small?.62:.38);
  lathe([[0,-h*.42],[baseR*.68,-h*.42],[baseR,-h*.25],[baseR,h*.12],[baseR*.78,h*.22],[0,h*.22]],painted('#aeb6b6','#b68b4e','COMMUNICATION HARDWARE',name),48);
  band(baseR,h*.14,.035,gold);band(baseR*.82,-h*.3,.025,steel);
  if(dish){
   const dishR=r*(large?1.18:medium?.92:small?.7:.72),dishY=h*(flat?.48:.58);
   if(flat){
    box(dishR*1.75,dishR*.16,dishR*.58,aluminium,[0,dishY,0]);
    box(dishR*1.58,dishR*.08,dishR*.48,ivory,[0,dishY+.1,0]);
    for(let i=0;i<7;i++)box(.025,dishR*.06,dishR*.42,steel,[(i-3)*dishR*.22,dishY+.15,0]);
    for(let side of [-1,1])tube([[side*dishR*.7,h*.2,0],[side*dishR*.86,dishY,0],[side*dishR*.72,dishY+.18,0]],.025,gold);
   }else{
    lathe([[0,dishY],[dishR*.22,dishY+.025],[dishR*.48,dishY+.07],[dishR*.74,dishY+.15],[dishR,dishY+.24],[dishR*.96,dishY+.27],[dishR*.9,dishY+.22],[0,dishY+.02]],painted('#cbd0cd','#b68b4e','PARABOLIC REFLECTOR',name),80);
    add(new THREE.TorusGeometry(dishR*.98,.045,12,72),aluminium,[0,dishY+.24,0],[Math.PI/2,0,0]);
    for(let i=0;i<16;i++){const ang=i*Math.PI/8,x=Math.cos(ang)*dishR*.82,z=Math.sin(ang)*dishR*.82;tube([[0,dishY+.04,0],[x,dishY+.2,z]],.018,steel);}
    for(let i=0;i<3;i++){const ang=i*Math.PI*2/3,x=Math.cos(ang)*dishR*.34,z=Math.sin(ang)*dishR*.34;tube([[x,dishY+.16,z],[x*1.6,dishY+.42,z*1.6],[0,dishY+.48,0]],.025,gold);}
    cyl(dishR*.13,dishR*.13,.1,black,dishY+.48,24);sphere(dishR*.09,glass,[0,dishY+.54,0],[1,.5,1]);
   }
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;bolt(Math.cos(ang)*dishR*.94,dishY+.24,Math.sin(ang)*dishR*.94,.018,gold);}
   tube([[0,h*.15,0],[0,dishY*.72,0],[0,dishY+.05,0]],.04,steel);
   for(let side of [-1,1])tube([[side*baseR*.72,-h*.12,0],[side*dishR*.38,dishY*.55,0],[side*dishR*.7,dishY,0]],.022,aluminium);
  }else{
   const mastH=h*(fixed?.85:1.12);
   cyl(r*.18,r*.22,.14,steel,h*.22,24);band(r*.2,h*.3,.025,gold);
   tube([[0,h*.28,0],[0,h*.28+mastH*.45,0],[0,h*.28+mastH,0]],fixed?.018:.028,aluminium);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4,x=Math.cos(ang)*r*.24,z=Math.sin(ang)*r*.24;tube([[0,h*.3,0],[x,h*.42,z],[x*.6,h*.28+mastH*.85,z*.6]],.012,steel);}
   for(let j=0;j<5;j++)band(r*(.18+j*.008),h*.34+j*mastH*.12,.012,j%2?gold:aluminium);
   sphere(.045,gold,[0,h*.28+mastH,0]);
  }
  for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(baseR*.9*Math.cos(ang),-h*.3,baseR*.9*Math.sin(ang),.018,gold);}
 }; const makeDock=()=>{
  const nm=(id+' '+name).toLowerCase();
  const shielded=/shield|シールド/.test(nm),inline=/inline|インライン/.test(nm),grabbing=/grabbing|グラビング/.test(nm),inflatable=/inflatable|膨張式/.test(nm),mk2=/mk2/.test(nm),sr=/\bsr\b|senior|sr\./.test(nm);
  const faceY=h*.48,bodyMat=painted('#bfc5c3','#c6a04c','CLAMP-O-TRON DOCKING SYSTEM',name);
  if(grabbing){
   lathe([[0,-h*.5],[r*.58,-h*.5],[r*.82,-h*.3],[r*.9,h*.15],[r*.78,h*.4],[r*.58,h*.5],[0,h*.5]],steel,64);
   band(r*.82,h*.34,.055,gold);cyl(r*.54,r*.54,.08,dark,faceY,48);
   for(let i=0;i<3;i++){
    const a=i*Math.PI*2/3,x=Math.cos(a)*r*.5,z=Math.sin(a)*r*.5;
    tube([[x,h*.25,z],[x*1.18,h*.5,z*1.18],[x*1.35,h*.72,z*1.35]],.055,aluminium);
    tube([[x*1.35,h*.72,z*1.35],[x*1.12,h*.84,z*1.12],[x*.82,h*.72,z*.82]],.04,gold);
    sphere(.075,steel,[x,h*.25,z]);
   }
   sphere(r*.22,glass,[0,h*.54,0],[1,.3,1]);return;
  }
  if(inflatable){
   cyl(r*.44,r*.44,h*.28,steel);
   const torus=add(new THREE.TorusGeometry(r*.72,r*.22,24,80),painted('#c5c8c1','#b68b4e','INFLATABLE AIRLOCK'),[0,h*.2,0]);torus.scale.set(1,1,.86);
   band(r*.5,h*.34,.045,gold);cyl(r*.46,r*.46,.07,dark,h*.36,48);
   for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.86,-h*.05,h*.35,a,steel,.025);}return;
  }
  const baseR=mk2?r*.92:sr?r*.98:r*.9;
  lathe([[0,-h*.5],[baseR*.58,-h*.5],[baseR*.82,-h*.38],[baseR*.94,-h*.12],[baseR*.94,h*.16],[baseR*.82,h*.34],[baseR*.62,h*.5],[0,h*.5]],bodyMat,80);
  for(const y of [-h*.38,-h*.18,h*.28,h*.4])band(baseR*(y>0?.92:.98),y,.035,y<0?steel:aluminium);
  band(baseR*.88,h*.42,.055,gold);band(baseR*.7,h*.47,.035,ivory);
  cyl(baseR*.58,baseR*.58,.09,dark,faceY,64);cyl(baseR*.4,baseR*.4,.045,steel,faceY+.045,64);
  add(new THREE.CircleGeometry(baseR*.34,64),black,[0,faceY+.07,0],[-Math.PI/2,0,0]);
  add(new THREE.TorusGeometry(baseR*.34,.035,10,64),gold,[0,faceY+.075,0]);
  add(new THREE.CircleGeometry(baseR*.12,48),blue,[0,faceY+.078,0],[-Math.PI/2,0,0]);
  for(let i=0;i<12;i++){
   const a=i*Math.PI/6,x=Math.cos(a)*baseR*.79,z=Math.sin(a)*baseR*.79;
   bolt(x,faceY+.045,z,.028,aluminium);
   box(baseR*.08,.025,.035,i%2?steel:gold,[Math.cos(a)*baseR*.52,faceY+.08,Math.sin(a)*baseR*.52],[0,-a,0]);
  }
  for(let i=0;i<16;i++){const a=i*Math.PI/8,x=Math.cos(a)*baseR*.96,z=Math.sin(a)*baseR*.96;box(baseR*.12,.07,.035,i%2?dark:gold,[x,-h*.22,z],[0,-a,0]);}
  for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(baseR*.9,-h*.28,h*.22,a,steel,.025);}
  if(shielded){
   for(let i=0;i<3;i++){
    const a=i*Math.PI*2/3,x=Math.cos(a)*baseR*.9,z=Math.sin(a)*baseR*.9;
    const petal=box(baseR*.72,h*.16,.055,ivory,[x,faceY+.06,z],[0,-a,0]);petal.rotation.z=Math.sin(a)*.18;
    box(baseR*.2,.12,.12,steel,[x*.78,faceY+.02,z*.78],[0,-a,0]);
    tube([[x*.55,faceY-.02,z*.55],[x*1.05,faceY+.2,z*1.05],[x*1.25,faceY+.12,z*1.25]],.025,gold);
   }
   band(baseR*.7,faceY+.13,.035,orange);
  }
  if(inline){
   lathe([[0,-h*.5],[baseR*.76,-h*.5],[baseR*.86,-h*.35],[baseR*.86,h*.48],[baseR*.7,h*.5],[0,h*.5]],steel,72);
   band(baseR*.86,h*.43,.045,gold);
  }
  if(mk2){
   box(baseR*1.9,h*.66,baseR*1.15,steel,[0,-h*.05,0]);
   for(let side of [-1,1])box(baseR*.08,h*.55,baseR*.95,gold,[side*baseR*.9,-h*.05,0]);
  }
  for(let i=0;i<16;i++){const a=i*Math.PI/8;bolt(baseR*.94*Math.cos(a),-h*.38,baseR*.94*Math.sin(a),.018,gold);}
 };
 const makePayload=()=>{
  const nm=(id+' '+name).toLowerCase();
  const fairing=/fairing|防護シェル/.test(nm),cargoBay=/cargo bay|カーゴベイ/.test(nm),ramp=/cargo ramp|カーゴドア/.test(nm),service=/service bay|サービスベイ/.test(nm),storage=/seq-|seq\d|保管ユニット|コンテナ/.test(nm),eva=/eva|ジェットパック|修理キット|実験キット|燃料シリンダー|個人用パラシュート/.test(nm),lab=/science lab|移動研究室/.test(nm),scienceStore=/science storage|実験用記憶装置/.test(nm),serviceModule=/sm-\d|サービスモジュール/.test(nm);
  if(fairing){
   // Aerodynamic fairings: tapered shell, structural base, split clamshell seam and latch hardware.
   const shellMat=painted('#d7d8d1','#b68b4e','AIRSTREAM PROTECTIVE SHELL',name);
   lathe([[0,-h*.5],[r*.9,-h*.5],[r,-h*.38],[r*.98,h*.12],[r*.72,h*.35],[r*.36,h*.48],[0,h*.5]],shellMat,96);
   lathe([[0,-h*.5],[r*.96,-h*.5],[r*.96,-h*.42],[r*.82,-h*.36],[0,-h*.36]],steel,72);
   band(r*.98,-h*.4,.045,gold);band(r*.96,-h*.32,.025,dark);
   // Two longitudinal panel splits and repeated release clamps.
   for(let side of [-1,1]){
    const ang=side*Math.PI/2;radialPipe(r*.99,-h*.34,h*.38,ang,steel,.018);
    for(let j=0;j<5;j++){const y=-h*.25+j*h*.14;bolt(side*r*.99,y,0,.02,gold);}
   }
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;const x=Math.cos(ang)*r*.98,z=Math.sin(ang)*r*.98;bolt(x,-h*.43,z,.018,aluminium);}
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(r*.96,-h*.3,h*.22,ang,aluminium,.012);}
  }
  else if(cargoBay){
   // Mk2/Mk3 payload bays are longitudinal spaceplane shells with a dark cavity,
   // internal rails, twin clamshell doors and visible hinge hardware.
   const mk3=/mk3/.test(nm),length=/100/.test(nm)?r*4:/50/.test(nm)?r*2:/25/.test(nm)?r*1.25:/08/.test(nm)?r*2.9:r*1.45;
   const width=mk3?r*1.18:r*1.04,thick=mk3?r*.58:r*.52;
   const shell=painted(mk3?'#d5d8d5':'#d8d9d2','#b68b4e',mk3?'MK3 CARGO BAY':'MK2 CARGO BAY',name);
   // Upper pressure shell and two structural side rails leave a recessed cargo well.
   box(width,thick*.18,length,shell,[0,thick*.38,0]);
   box(width*.94,thick*.12,length*.96,dark,[0,-thick*.18,0]);
   for(let side of [-1,1]){
    box(width*.12,thick*.56,length,steel,[side*width*.44,0,0]);
    box(width*.1,thick*.34,length*.92,shell,[side*width*.39,-thick*.02,0]);
    box(width*.08,thick*.12,length*.9,aluminium,[side*width*.32,thick*.3,0]);
    // Door skins, hinge barrels and actuator arms.
    box(width*.34,thick*.08,length*.88,ivory,[side*width*.29,-thick*.31,0]);
    for(let j=0;j<8;j++)bolt(side*width*.29,-thick*.26,(j-3.5)*length*.105,.018,gold);
    for(let z of [-length*.43,length*.43]){cyl(thick*.055,thick*.055,width*.38,steel,side*width*.15,16).position.set(side*width*.15,0,z);}
    for(let z of [-length*.36,length*.36])tube([[side*width*.46,-thick*.15,z],[side*width*.31,-thick*.38,z],[side*width*.16,-thick*.24,z]],.025,gold);
   }
   // Payload guide rails, tie-down points and illuminated service sockets.
   for(let side of [-1,1]){
    box(.045,.045,length*.82,aluminium,[side*width*.22,-thick*.1,0]);
    for(let j=0;j<6;j++){const z=(j-2.5)*length*.13;box(.12,.035,.035,gold,[side*width*.22,-thick*.06,z]);}
   }
   for(let z of [-length*.48,length*.48])for(let x of [-1,1])box(width*.12,thick*.62,.08,steel,[x*width*.42,0,z]);
   if(ramp){
    box(width*.78,thick*.12,length*.48,ivory,[0,-thick*.42,length*.68],[.5,0,0]);
    for(let side of [-1,1])tube([[side*width*.36,-thick*.3,length*.42],[side*width*.3,-thick*.6,length*.66],[side*width*.18,-thick*.64,length*.88]],.035,steel);
   }
  }
  else if(service){
   // Service bays are short cylindrical equipment lockers with split access doors.
   lathe([[0,-h*.5],[r*.82,-h*.5],[r,-h*.38],[r,h*.38],[r*.82,h*.5],[0,h*.5]],painted('#59636a','#c69a4c','SERVICE BAY',name),80);
   for(let y of [-h*.4,h*.4])band(r*.99,y,.05,gold);
   band(r*.99,0,.025,aluminium);
   for(let side of [-1,1]){
    const door=box(r*.72,h*.62,.06,ivory,[side*r*.42,0,side*r*.72]);
    box(r*.5,h*.48,.025,dark,[side*r*.42,0,side*r*.75]);
    for(let j=0;j<6;j++)box(r*.34,.025,.02,aluminium,[side*r*.42,(j-2.5)*h*.065,side*r*.77]);
    for(let j=0;j<4;j++)bolt(side*r*.72,(j-1.5)*h*.18,side*r*.72,.022,gold);
   }
   // Internal avionics racks and wiring visible through the open end.
   cyl(r*.62,r*.62,.06,dark,-h*.47,48);
   for(let i=0;i<4;i++){const ang=i*Math.PI/2,x=Math.cos(ang)*r*.52,z=Math.sin(ang)*r*.52;box(r*.18,h*.46,.12,i%2?steel:orange,[x,0,z]);}
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(r*.9,-h*.3,h*.3,ang,steel,.018);}
  }
  else if(storage){
   const large=/seq-?24|seq-?9|seq9/.test(nm),conformal=/seq-?3c/.test(nm);
   if(conformal){
    box(r*1.4,h*.55,r*.55,painted('#c6cbc6','#b68b4e','CONFORMAL STORAGE',name));
    for(let i=0;i<5;i++)box(r*.2,h*.32,.025,steel,[(i-2)*r*.24,0,r*.29]);
   }else{
    const width=large?r*1.15:r*.82,depth=large?r*.9:r*.65;
    box(width,h*.82,depth,painted('#c9ccc5','#b68b4e','KERBAL CARGO SYSTEM',name));
    for(let x of [-1,1])for(let z of [-1,1])box(.06,h*.9,.06,steel,[x*width*.46,0,z*depth*.46]);
    const slots=large?6:3;
    for(let i=0;i<slots;i++){
     box(width*.7,.025,depth*.72,aluminium,[0,(i-(slots-1)/2)*h*.12,depth*.52]);
     for(let j=0;j<4;j++)box(width*.08,.04,.025,j%2?orange:dark,[(j-1.5)*width*.16,(i-(slots-1)/2)*h*.12,depth*.55]);
    }
   }
   for(let x of [-1,1])for(let y of [-1,1])bolt(x*r*.62,y*h*.34,r*.5,.022,gold);
  }
  else if(eva){
   if(/jetpack/.test(nm)){
    box(r*.78,h*.8,r*.46,painted('#c5c8c0','#c56b31','EVA PROPULSION PACK',name));
    for(let side of [-1,1]){
     lathe([[0,-h*.3],[r*.16,-h*.3],[r*.2,h*.3],[r*.12,h*.4],[0,h*.4]],steel,24,[side*r*.42,0,0]);
     cyl(r*.13,r*.13,.16,orange,0,24).position.set(side*r*.42,-h*.38,0);
     tube([[side*r*.22,h*.24,0],[side*r*.45,h*.42,0],[side*r*.45,h*.52,0]],.025,gold);
    }
    box(r*.52,h*.2,.04,dark,[0,-h*.12,r*.25]);
   }else if(/repair/.test(nm)){
    box(r*.9,h*.72,r*.42,painted('#d3d5ce','#d38c36','ENGINEER REPAIR KIT',name));
    for(let i=0;i<4;i++)box(r*.12,h*.42,.025,steel,[(i-1.5)*r*.18,0,r*.23]);
    for(let i=0;i<3;i++)sphere(.055,gold,[(i-1)*r*.22,h*.28,r*.25]);
   }else if(/science/.test(nm)){
    box(r*.88,h*.72,r*.42,painted('#d6d8d1','#6f9db0','SCIENCE KIT',name));
    for(let i=0;i<3;i++)box(r*.16,h*.38,.035,blue,[(i-1)*r*.24,0,r*.24]);
   }else if(/fuel cylinder/.test(nm)){
    lathe([[0,-h*.5],[r*.4,-h*.5],[r*.48,-h*.4],[r*.48,h*.36],[r*.36,h*.5],[0,h*.5]],painted('#c7cbc5','#c56b31','EVA FUEL CYLINDER',name),48);
    band(r*.48,-h*.36,.03,gold);band(r*.48,h*.36,.03,steel);
    cyl(r*.22,r*.22,.08,steel,h*.48,24);
   }else if(/parachute/.test(nm)){
    lathe([[0,-h*.4],[r*.55,-h*.4],[r*.62,-h*.2],[r*.62,h*.25],[r*.48,h*.4],[0,h*.4]],painted('#d2d2c8','#c56b31','PERSONAL PARACHUTE',name),48);
    for(let i=0;i<6;i++){const a=i*Math.PI/3;radialPipe(r*.6,-h*.18,h*.2,a,orange,.018);}
    for(let i=0;i<4;i++)tube([[Math.cos(i*Math.PI/2)*r*.4,h*.35,Math.sin(i*Math.PI/2)*r*.4],[0,h*.62,0]],.012,steel);
   }else{
    lathe([[0,-h*.45],[r*.45,-h*.45],[r*.55,-h*.3],[r*.55,h*.3],[r*.4,h*.45],[0,h*.45]],steel,40);
    band(r*.55,h*.32,.035,gold);
   }
  }
  else if(lab){
   lathe([[0,-h*.5],[r*.7,-h*.5],[r*.92,-h*.38],[r*.92,h*.36],[r*.72,h*.5],[0,h*.5]],painted('#d6d8d1','#b68b4e','MOBILE PROCESSING LAB',name),72);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(r*.93,-h*.3,h*.28,ang,steel,.025);}
   for(let i=0;i<4;i++){const ang=i*Math.PI/2,x=Math.cos(ang)*r*.78,z=Math.sin(ang)*r*.78;sphere(r*.13,steel,[x,h*.05,z],[1,1,.28]);sphere(r*.09,glass,[x,h*.05,z+Math.sign(z||1)*r*.03],[1,1,.25]);}
   box(r*.48,h*.24,.06,dark,[0,-h*.12,r*.84]);
   for(let i=0;i<4;i++)box(r*.08,.035,.025,orange,[(i-1.5)*r*.1,-h*.12,r*.88]);
  }
  else if(scienceStore){
   box(r*1.15,h*.72,r*.62,painted('#d5d8d1','#b68b4e','SCIENCE DATA ARCHIVE',name));
   for(let i=0;i<6;i++){box(r*.82,.025,.035,steel,[0,(i-2.5)*h*.1,r*.33]);}
   for(let x of [-1,1])for(let y of [-1,1])bolt(x*r*.48,y*h*.28,r*.34,.02,gold);
   sphere(.09,blue,[0,h*.22,r*.35]);
  }
  else if(serviceModule){
   lathe([[0,-h*.5],[r*.76,-h*.5],[r*.92,-h*.38],[r*.92,h*.38],[r*.76,h*.5],[0,h*.5]],painted('#bfc6c5','#c56b31','SERVICE MODULE',name),72);
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;radialPipe(r*.93,-h*.35,h*.35,ang,steel,.02);}
   for(let y of [-h*.38,h*.38])band(r*.93,y,.045,gold);
   for(let i=0;i<4;i++){const ang=i*Math.PI/2;const x=Math.cos(ang)*r*.9,z=Math.sin(ang)*r*.9;box(r*.16,h*.32,.08,orange,[x,0,z]);}
  }
  else{
   lathe([[0,-h*.45],[r*.72,-h*.45],[r*.85,-h*.3],[r*.85,h*.35],[r*.7,h*.45],[0,h*.45]],painted('#d9d9d0','#b68b4e','PAYLOAD EQUIPMENT',name),48);
   band(r*.85,h*.32,.035,gold);radialLabel(r*.86,0,r*.7,h*.2,getLabelMaterial());
  }
 }; const makeThermal=()=>{
  const nm=(id+' '+name).toLowerCase();
  const shield=/heat shield|耐熱シールド|heatshield/.test(nm),inflatable=/10m|inflatable|膨張/.test(nm),panel=/radiator panel|ラジエーターパネル/.test(nm),edge=/edge|エッジ/.test(nm),control=/thermal control|熱制御システム/.test(nm),large=/large|大型/.test(nm),medium=/medium|中型/.test(nm);
  if(shield){
   // Ablative shield: ceramic tile face, segmented metal rim and recessed separation hardware.
   const rr=r*(inflatable?1.5:1),th=h*(inflatable?.22:.3),tileMat=M(0xffffff,.08,.96,{map:makeThermalTileMaterial(THREE)});
   if(inflatable){
    const membrane=add(new THREE.CircleGeometry(rr,96),M(0x9da7a7,.12,.92,{side:THREE.DoubleSide}),[0,h*.18,0],[Math.PI/2,0,0]);
    const outer=add(new THREE.TorusGeometry(rr,.13,18,96),M(0x6d777b,.25,.82),[0,h*.18,0],[Math.PI/2,0,0]);
    for(let i=0;i<24;i++){const ang=i*Math.PI/12,x=Math.cos(ang)*rr*.92,z=Math.sin(ang)*rr*.92;tube([[0,h*.18,0],[x,h*.18,z]],.018,aluminium);bolt(x,h*.18,z,.025,gold);}
    for(let i=0;i<12;i++){const ang=i*Math.PI/6;const x=Math.cos(ang)*rr*.8,z=Math.sin(ang)*rr*.8;box(rr*.22,.07,.1,steel,[x,h*.18,z],[0,-ang,0]);}
    cyl(rr*.38,rr*.38,.12,dark,-h*.08,64);band(rr*.42,-h*.08,.045,gold);
   }else{
    lathe([[0,-th*.5],[rr*.76,-th*.5],[rr*.94,-th*.42],[rr,-th*.2],[rr*.98,th*.2],[rr*.86,th*.5],[rr*.58,th*.55],[0,th*.55]],tileMat,96);
    band(rr*.99,-th*.25,.06,steel);band(rr*.98,th*.3,.055,gold);band(rr*.82,th*.5,.025,aluminium);
    cyl(rr*.58,rr*.58,.08,dark,-th*.5,72);
    for(let i=0;i<32;i++){const ang=i*Math.PI/16,x=Math.cos(ang)*rr*.96,z=Math.sin(ang)*rr*.96;bolt(x,th*.22,z,.018,aluminium);}
    for(let i=0;i<16;i++){const ang=i*Math.PI/8;radialPipe(rr*.94,-th*.16,th*.36,ang,steel,.014);}
    for(let ring=1;ring<=3;ring++)band(rr*(.28+ring*.16),th*.52,.012,steel);
   }
   return;
  }
  if(panel){
   // Fixed radiator panels are thin, framed heat exchangers with exposed coolant channels.
   const width=r*(edge?.42:large?1.65:medium?1.15:.82),length=h*(edge?1.28:large?1.5:1.05),thick=edge?.055:.075;
   box(width,length,thick,painted('#303a3e','#b68b4e','RADIATOR PANEL',name));
   box(width*.9,length*.92,.025,dark,[0,0,thick*.58]);
   for(let i=0;i<(edge?3:12);i++){
    const x=edge?0:(i-5.5)*width*.07;
    box(edge?width*.78:width*.025,length*.84,.018,aluminium,[x,0,thick*.8]);
   }
   for(let side of [-1,1])box(width*.045,length*.98,thick*1.4,steel,[side*width*.48,0,0]);
   tube([[-width*.38,-length*.38,thick*.72],[0,-length*.22,thick*.72],[width*.38,-length*.38,thick*.72]],.025,orange);
   tube([[-width*.38,length*.38,thick*.72],[0,length*.22,thick*.72],[width*.38,length*.38,thick*.72]],.025,blue);
   for(let x of [-1,1])for(let y of [-1,1])bolt(x*width*.44,y*length*.44,thick*.82,.022,gold);
   if(edge){box(width*.2,.16,.14,steel,[0,-length*.48,0]);}
   return;
  }
  if(control){
   // Thermal Control System: compact stowed housing with folded radiator leaves and hinge packs.
   const size=large?1.12:medium?.9:.68,coreR=r*size;
   lathe([[0,-h*.42],[coreR*.72,-h*.42],[coreR,-h*.3],[coreR,h*.28],[coreR*.72,h*.42],[0,h*.42]],painted('#6f797c','#b68b4e','THERMAL CONTROL SYSTEM',name),64);
   for(let y of [-h*.34,h*.32])band(coreR,y,.045,gold);
   const leaves=large?6:4;
   for(let i=0;i<leaves;i++){
    const ang=i*Math.PI*2/leaves,x=Math.cos(ang)*coreR*.82,z=Math.sin(ang)*coreR*.82;
    const hinge=new THREE.Mesh(new THREE.CylinderGeometry(coreR*.09,coreR*.09,h*.72,20),steel);hinge.position.set(x,0,z);hinge.rotation.z=Math.PI/2;g.add(hinge);
    for(let j=0;j<3;j++){
     const leaf=box(coreR*.48,h*.2,.035,dark,[x+Math.cos(ang)*coreR*(.2+j*.16),h*(.15-j*.15),z+Math.sin(ang)*coreR*(.2+j*.16)],[0,-ang,0]);
     for(let k=0;k<4;k++)box(coreR*.36,.012,.018,aluminium,[leaf.position.x,leaf.position.y+(k-1.5)*h*.045,leaf.position.z+.025],[0,-ang,0]);
    }
    tube([[x,0,z],[x*1.35,h*.25,z*1.35],[x*1.5,h*.12,z*1.5]],.025,gold);
   }
   box(coreR*.5,.16,coreR*.5,steel,[0,-h*.46,0]);
   return;
  }
  // Thermal parts without a more specific name retain an insulated shield-like profile.
  const tileMat=M(0xffffff,.08,.96,{map:makeThermalTileMaterial(THREE)});
  lathe([[0,-h*.5],[r*.72,-h*.5],[r,-h*.34],[r*.94,h*.25],[r*.7,h*.5],[0,h*.5]],tileMat,96);
  band(r*.96,h*.28,.06,gold);band(r*.94,-h*.32,.035,steel);
  for(let i=0;i<24;i++){const a=i*Math.PI/12;radialPipe(r*.95,-h*.28,h*.24,a,steel,.018);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;bolt(Math.cos(a)*r*.96,h*.2,Math.sin(a)*r*.96,.022,aluminium);}
 }; const makeUtility=()=>{
  const nm=(id+' '+name).toLowerCase();
  const ladder=/ladder|mobility enhancer|機動性向上/.test(nm),light=/light|illuminator|照明|ライト|イルミネーター/.test(nm);
  const launch=/launch escape|脱出システム/.test(nm),drill=/drill|採掘機/.test(nm),isru=/isru|convert-o-tron|コンバートオートロン/.test(nm);
  const flag=/flag|フラッグ/.test(nm),firework=/starshot|firework|スターショット/.test(nm),anchor=/ground anchor|グラウンドアンカー/.test(nm);
  if(flag){
   const w=r*(/rfp-3/.test(nm)?2.4:/rfp-2/.test(nm)?1.8:/rfp-1/.test(nm)?1.25:.8),hh=h*(/rfp-3/.test(nm)?1.5:/rfp-2/.test(nm)?1.25:1);
   const canvas=document.createElement('canvas');canvas.width=512;canvas.height=320;const q=canvas.getContext('2d');
   q.fillStyle='#327c52';q.fillRect(0,0,512,320);q.fillStyle='#e6e9d9';q.beginPath();q.arc(256,160,82,0,Math.PI*2);q.fill();
   q.fillStyle='#2e6d4a';q.font='bold 58px Arial';q.textAlign='center';q.fillText('K',256,180);q.strokeStyle='#d7b85d';q.lineWidth=10;q.strokeRect(18,18,476,284);
   q.fillStyle='#f4f0df';q.font='bold 20px Arial';q.fillText('KERBAL SPACE PROGRAM',256,280);
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
   const pole=new THREE.Mesh(new THREE.CylinderGeometry(.025,.04,hh*1.25,12),steel);pole.position.set(-w*.48,hh*.58,0);g.add(pole);
   const cloth=new THREE.PlaneGeometry(w,hh,10,6),pos=cloth.attributes.position;
   for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,Math.sin((x/w+.5)*Math.PI*2)*.035*(.5+y/hh));}
   cloth.computeVertexNormals();
   const fabric=new THREE.Mesh(cloth,M(0xffffff,.8,.1,{map:tex,side:THREE.DoubleSide}));fabric.position.set(w*.02,hh*.55,0);g.add(fabric);
   for(let y=0;y<5;y++)tube([[-w*.48,hh*(.1+y*.2),0],[-w*.43,hh*(.1+y*.2),0]],.012,gold);
   return;
  }
  if(ladder){
   const length=h*(id.includes('bay')?1.18:1),width=r*.76,railR=Math.max(.025,r*.07);
   for(let side of [-1,1]){tube([[side*width*.5,-length*.5,0],[side*width*.5,length*.5,0]],railR,aluminium);for(let y of [-1,1])box(width*.18,.12,.12,steel,[side*width*.5,y*length*.48,0]);}
   const rungs=id.includes('telescopic')?12:8;
   for(let i=0;i<rungs;i++){const y=-length*.43+i*length*.86/(rungs-1);tube([[-width*.5,y,0],[width*.5,y,0]],railR*.72,steel);for(let side of [-1,1])bolt(side*width*.5,y,0,.018,gold);}
   if(id.includes('telescopic'))for(let side of [-1,1]){tube([[side*width*.5,-length*.25,.04],[side*width*.5,length*.45,.04]],railR*.45,gold);box(width*.12,.08,.12,orange,[side*width*.5,length*.4,.06]);}
   return;
  }
  if(light){
   const dome=/dome|ドーム/.test(nm),nav=/nav|navigation|ナビゲーション/.test(nm),strip=/strip|ストリップ/.test(nm),large=/mk2|standard/.test(nm);
   if(strip){
    const length=h*1.3;box(r*.34,.1,length,steel);box(r*.24,.055,length*.92,ivory,[0,.055,0]);
    for(let i=0;i<12;i++)sphere(.035,M(0xf1e8bd,.12,.2,{emissive:0x8b7b48,emissiveIntensity:.25}),[0,.1,(i-5.5)*length*.075],[1,.5,1]);
   }else if(nav){
    cyl(r*.42,r*.48,h*.22,steel);for(let side of [-1,1])sphere(r*.24,M(side<0?0xc94b3e:0x4b9e65,.15,.18,{emissive:side<0?0x55110b:0x10351d,emissiveIntensity:.25}),[side*r*.3,h*.18,0],[1,.8,1]);band(r*.48,h*.1,.025,gold);
   }else if(dome){
    cyl(r*.46,r*.52,.12,steel);sphere(r*.48,M(0xe8e5cf,.1,.18,{transparent:true,opacity:.68,emissive:0x8e8b6d,emissiveIntensity:.25}),[0,h*.14,0],[1,.5,1]);band(r*.5,h*.05,.035,gold);
   }else{
    const headR=r*(large?.68:.48);cyl(r*.34,r*.4,h*.2,steel);
    const housing=add(new THREE.CylinderGeometry(headR,headR*.85,h*.32,48,1,false),aluminium,[0,h*.22,0]);housing.rotation.x=Math.PI/2;
    add(new THREE.TorusGeometry(headR*.88,.045,12,48),gold,[0,h*.22,h*.17]);
    add(new THREE.CircleGeometry(headR*.72,48),M(0xece8d1,.1,.12,{emissive:0x7d7658,emissiveIntensity:.25}),[0,h*.22,h*.18]);
    for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(headR*.9*Math.cos(ang),h*.22+headR*.9*Math.sin(ang),h*.19,.018,steel);}
    for(let side of [-1,1])tube([[side*r*.3,-h*.05,0],[side*r*.42,h*.2,h*.08],[0,h*.22,h*.22]],.025,steel);
   }
   return;
  }
  if(launch){
   lathe([[0,h*.34],[r*.32,h*.34],[r*.4,h*.44],[r*.22,h*.9],[0,h]],painted('#c7c9c1','#c56b31','LAUNCH ESCAPE SYSTEM',name),48);
   for(let i=0;i<4;i++){const ang=i*Math.PI/2,x=Math.cos(ang)*r*.62,z=Math.sin(ang)*r*.62;tube([[0,h*.28,0],[x,h*.52,z],[x*1.1,h*.94,z*1.1]],.055,aluminium);tube([[x,h*.42,z],[x*1.1,h*.72,z*1.1],[0,h*.82,0]],.025,steel);for(let j=0;j<3;j++)box(.1,.055,.1,orange,[x,h*(.46+j*.13),z]);}
   for(let i=0;i<3;i++){const ang=i*Math.PI*2/3,x=Math.cos(ang)*r*.42,z=Math.sin(ang)*r*.42;lathe([[0,-h*.18],[r*.13,-h*.18],[r*.16,h*.2],[r*.12,h*.28],[0,h*.28]],steel,24,[x,-h*.15,z]);}
   band(r*.66,h*.32,.06,gold);return;
  }
  if(drill){
   box(r*1.05,h*.28,r*.9,painted('#c5c8c1','#c56b31','MINING EXCAVATOR',name),[0,h*.28,0]);
   for(let side of [-1,1]){box(r*.18,h*.36,r*.16,steel,[side*r*.42,h*.05,0]);tube([[side*r*.35,h*.12,0],[side*r*.62,h*.04,r*.16],[side*r*.88,-h*.2,r*.22]],.055,orange);}
   const armPath=new THREE.CatmullRomCurve3([[0,h*.12,0],[r*.5,h*.1,r*.22],[r*.95,-h*.05,r*.35],[r*1.25,-h*.25,r*.42]].map(v=>new THREE.Vector3(...v)));
   const armMesh=new THREE.Mesh(new THREE.TubeGeometry(armPath,32,r*.11,12,false),aluminium);g.add(armMesh);
   const joint=new THREE.Mesh(new THREE.SphereGeometry(r*.2,24,16),gold);joint.position.set(r*.5,h*.1,r*.22);g.add(joint);
   const motor=new THREE.Mesh(new THREE.CylinderGeometry(r*.22,r*.26,h*.36,32),steel);motor.position.set(r*1.2,-h*.22,r*.42);motor.rotation.z=Math.PI/2;g.add(motor);
   const bit=new THREE.Mesh(new THREE.ConeGeometry(r*.19,h*.5,8),dark);bit.position.set(r*1.2,-h*.52,r*.42);bit.rotation.x=Math.PI;g.add(bit);
   for(let i=0;i<6;i++){const ang=i*Math.PI/3;tube([[r*1.2+Math.cos(ang)*r*.22,-h*.22-h*.15,r*.42+Math.sin(ang)*r*.22],[r*1.2+Math.cos(ang)*r*.22,-h*.22+h*.15,r*.42+Math.sin(ang)*r*.22]],.022,orange);}
   box(r*.65,h*.12,.06,black,[0,-h*.2,r*.45]);for(let i=0;i<4;i++)bolt((i-1.5)*r*.14,-h*.2,r*.49,.018,gold);return;
  }
  if(isru){
   const big=/250/.test(nm),coreR=r*(big?.86:.7),coreH=h*(big?1.05:.88);
   lathe([[0,-coreH*.5],[coreR*.78,-coreH*.5],[coreR,-coreH*.4],[coreR,coreH*.4],[coreR*.78,coreH*.5],[0,coreH*.5]],painted('#737d7d','#c56b31','ORE REFINERY',name),80);
   for(let y of [-coreH*.42,-coreH*.3,coreH*.3,coreH*.42])band(coreR*.99,y,.045,y<0?steel:gold);
   for(let i=0;i<16;i++){const ang=i*Math.PI/8;radialPipe(coreR*1.02,-coreH*.32,coreH*.32,ang,aluminium,.025);}
   for(let side of [-1,1]){box(coreR*.46,coreH*.62,.09,dark,[side*coreR*.74,0,coreR*.52]);for(let j=0;j<7;j++)box(coreR*.4,.025,.035,steel,[side*coreR*.74,(j-3)*coreH*.08,coreR*.58]);tube([[side*coreR*.55,-coreH*.3,coreR*.3],[side*coreR*.95,-coreH*.42,coreR*.45],[side*coreR*.9,coreH*.28,coreR*.48]],.04,orange);}
   cyl(coreR*.4,coreR*.4,.12,steel,coreH*.52,48);for(let i=0;i<8;i++){const ang=i*Math.PI/4;bolt(coreR*.96*Math.cos(ang),-coreH*.4,coreR*.96*Math.sin(ang),.022,gold);}return;
  }
  if(anchor){
   cyl(r*.62,r*.72,h*.18,steel,-h*.36,48);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(r*.14,r*.22,h*.82,24),aluminium);shaft.position.y=-h*.02;g.add(shaft);
   for(let i=0;i<7;i++){const y=h*.28-i*h*.1;add(new THREE.TorusGeometry(r*(.18+i*.008),.025,8,32),gold,[0,y,0],[Math.PI/2,0,0]);}
   const tip=new THREE.Mesh(new THREE.ConeGeometry(r*.22,h*.25,8),dark);tip.position.y=-h*.53;g.add(tip);
   for(let i=0;i<4;i++){const ang=i*Math.PI/2;box(r*.3,.08,r*.12,orange,[Math.cos(ang)*r*.52,-h*.34,Math.sin(ang)*r*.52],[0,-ang,0]);}return;
  }
  if(firework){
   const count=/32/.test(nm)?8:4;cyl(r*.58,r*.58,h*.62,painted('#c5c8c2','#c56b31','STARSHOT PYROTECHNICS',name),0,40);
   band(r*.58,h*.28,.035,gold);band(r*.58,-h*.28,.035,steel);
   for(let i=0;i<count;i++){const ang=i*Math.PI*2/count,x=Math.cos(ang)*r*.62,z=Math.sin(ang)*r*.62;box(.06,h*.2,.04,orange,[x,-h*.34,z],[0,-ang,0]);}
   cyl(r*.2,r*.2,.12,black,h*.36,24);for(let i=0;i<3;i++){const ang=i*Math.PI*2/3;tube([[0,h*.35,0],[Math.cos(ang)*r*.28,h*.5,Math.sin(ang)*r*.28]],.018,gold);}return;
  }
  lathe([[0,-h*.5],[r*.75,-h*.5],[r*.85,-h*.3],[r*.85,h*.35],[r*.7,h*.5],[0,h*.5]],painted('#cbd0ca','#b68b4e','UTILITY EQUIPMENT',name),48);
  band(r*.84,h*.32,.04,gold);radialLabel(r*.86,0,r*.7,h*.2,getLabelMaterial());
 }; const makeNosecone=()=>{
  const nm=(id+' '+name).toLowerCase();
  const heat=/heat shield|耐熱シールド|heatshield/.test(nm),protective=/protective|保護用/.test(nm),advanced=/advanced|先進的/.test(nm),slanted=/type b|タイプb|slanted|斜め/.test(nm),tiny=/tiny|極小型/.test(nm),small=/small|小型/.test(nm),mk7=/mk7|mk5a/.test(nm),mk12=/mk12/.test(nm),mk16=/mk16/.test(nm);
  const base=r*.92,tip=tiny?.012:small?r*.025:r*.035;
  const shell=painted(heat?'#625e55':protective?'#c6c9c3':'#d8dad4',heat?'#c56b31':'#b68b4e',heat?'THERMAL PROTECTION':'AERODYNAMIC NOSE ASSEMBLY',name);
  let profile;
  if(heat)profile=[[0,-h*.5],[base*.78,-h*.5],[base,-h*.38],[base*.98,-h*.18],[base*.72,-h*.1],[base*.18,-h*.08],[0,-h*.08]];
  else if(protective){
   const shoulder=mk16?1.08:mk12?1.02:.92;
   profile=[[0,-h*.5],[base*.78,-h*.5],[base*shoulder,-h*.38],[base*shoulder,-h*.18],[base*.92,h*.08],[base*.76,h*.28],[base*.48,h*.42],[base*.2,h*.49],[0,h*.5]];
  }else if(advanced&&slanted){
   profile=[[0,h*.5],[tip,h*.48],[base*.16,h*.38],[base*.42,h*.2],[base*.74,-h*.12],[base,-h*.42],[base*.98,-h*.5],[0,-h*.5]];
  }else if(advanced){
   profile=[[0,h*.5],[tip,h*.48],[base*.1,h*.4],[base*.3,h*.25],[base*.62,-h*.08],[base*.9,-h*.36],[base,-h*.46],[base*.98,-h*.5],[0,-h*.5]];
  }else{
   profile=[[0,h*.5],[tip,h*.48],[base*.12,h*.4],[base*.34,h*.25],[base*.62,-h*.05],[base*.88,-h*.32],[base,-h*.44],[base*.98,-h*.5],[0,-h*.5]];
  }
  lathe(profile,shell,96);
  // Machined mounting collar and part-specific ring geometry.
  band(base*.99,-h*.44,.05,steel);band(base*.94,-h*.35,.025,gold);
  if(protective){
   // Protective nose caps have a rounded, serviceable crown and a removable lower skirt.
   sphere(base*.78,ivory,[0,h*.32,0],[1,.48,1]);
   band(base*.96,h*.08,.045,orange);band(base*.82,h*.28,.025,aluminium);
   for(let i=0;i<16;i++){const ang=i*Math.PI/8;radialPipe(base*.98,-h*.32,h*.22,ang,steel,.018);bolt(base*.96*Math.cos(ang),-h*.36,base*.96*Math.sin(ang),.018,gold);}
   // Access hatch and the inner parachute/service cavity lip.
   box(base*.42,h*.18,.035,dark,[0,-h*.12,base*.88]);
   for(let i=0;i<4;i++)bolt((i-1.5)*base*.12,-h*.12,base*.91,.018,aluminium);
   cyl(base*.56,base*.56,.08,black,-h*.49,64);
  }else if(heat){
   for(let i=0;i<24;i++){const ang=i*Math.PI/12;radialPipe(base*.98,-h*.4,-h*.12,ang,dark,.018);}
   for(let y of [-h*.32,-h*.24,-h*.16])band(base*.98,y,.025,steel);
   cyl(base*.72,base*.72,.08,dark,-h*.48,64);
  }else{
   for(let i=0;i<12;i++){const ang=i*Math.PI/6;radialPipe(base*.96,-h*.36,h*.32,ang,aluminium,.014);bolt(base*.96*Math.cos(ang),-h*.34,base*.96*Math.sin(ang),.018,gold);}
   band(base*.98,h*.28,.025,steel);
   if(advanced){for(let side of [-1,1])tube([[side*base*.3,h*.22,base*.68],[side*base*.55,h*.02,base*.75],[side*base*.7,-h*.2,base*.68]],.018,gold);}
  }
  // Tip cap and subtle panel seams.
  sphere(tip*1.5,protective?steel:aluminium,[0,h*.48,0],[1,.65,1]);
  for(let side of [-1,1])box(base*.12,h*.08,.025,orange,[side*base*.62,-h*.2,base*.72]);
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
 else if(type==='ground')makeUtility();
 else if(type==='gear')makeGear();
 else if(type==='intake')makeIntake();
 else if(type==='comm')makeComm();
 else if(type==='docking')makeDock();
 else if(type==='payload')makePayload();
 else if(type==='thermal')makeThermal();
 else if(type==='utility')makeUtility();
 else if(type==='robotics'||type==='rotor-blade'){
  const nm=(id+' '+name).toLowerCase();
  const rotor=type==='rotor-blade'||id.includes('rotor'),servo=/servo|サーボ/.test(nm),hinge=/hinge|ヒンジ/.test(nm),piston=/piston|cylinder|油圧シリンダー/.test(nm),controller=/kal|controller|コントローラー/.test(nm);
  const nested=/nested|入れ子/.test(nm),alligator=/alligator|アリゲーター/.test(nm),large=/64|25|g32|3p6|large|重量/.test(nm),small=/16s|16|f12|1p2|small|軽量/.test(nm);
  if(rotor){
   // Individual KSP rotor/propeller blade: one twisted airfoil blade, not a fake three-blade propeller.
   const heli=/helicopter|ヘリコプター/.test(nm),slim=/type s|タイプs/.test(nm),broad=/type b|タイプb/.test(nm);
   const span=r*(heli?2.5:1.85),root=r*(broad?.5:.34),tip=root*(slim?.48:broad?.78:.62),sweep=span*(heli?.2:.12),thick=slim?.055:.085;
   const shape=new THREE.Shape();
   shape.moveTo(-root*.5,-root*.48);shape.lineTo(root*.5,-root*.48);
   shape.lineTo(span-sweep,tip*.5);shape.lineTo(span-sweep*.6,-tip*.5);shape.closePath();
   const blade=add(new THREE.ExtrudeGeometry(shape,{depth:thick,bevelEnabled:true,bevelSegments:4,bevelSize:.025,bevelThickness:.018}),painted('#c9ceca','#b68b4e',heli?'HELICOPTER ROTOR BLADE':'PROPELLER BLADE',name),[0,0,0],[-Math.PI/2,0,0]);
   const leading=new THREE.CatmullRomCurve3([new THREE.Vector3(-root*.5,-root*.48,thick*.6),new THREE.Vector3(span*.42-sweep*.35,root*.05,thick*.6),new THREE.Vector3(span-sweep,tip*.5,thick*.6)]);
   add(new THREE.TubeGeometry(leading,32,thick*.22,8,false),aluminium,[0,0,0],[-Math.PI/2,0,0]);
   const trailing=box(span*.48,.018,thick*.18,steel,[span*.68,-tip*.05,thick*.62]);trailing.rotation.x=-Math.PI/2;
   // Root grip, pitch collar and attachment pin.
   cyl(root*.42,root*.42,thick*1.8,steel,0,24);
   band(root*.42,0,.025,gold);
   for(let side of [-1,1])bolt(side*root*.28,-root*.22,thick*.85,.02,aluminium);
   box(root*.82,root*.28,.12,dark,[root*.12,0,thick*.72]);
   sphere(.045,gold,[span-sweep*.9,tip*.34,thick*.72]);
  }
  else if(piston){
   // Hydraulic actuators use concentric pressure tubes and a polished moving rod.
   const stageCount=nested?3:1,baseR=r*(large?.42:.3),bodyH=h*(large?1.05:.9);
   lathe([[0,-bodyH*.5],[baseR*.78,-bodyH*.5],[baseR,-bodyH*.4],[baseR,bodyH*.18],[baseR*.82,bodyH*.28],[0,bodyH*.28]],painted('#69757a','#b68b4e','HYDRAULIC ACTUATOR',name),48);
   band(baseR,bodyH*.2,.035,gold);band(baseR,-bodyH*.4,.035,steel);
   for(let i=0;i<stageCount;i++){
    const rr=baseR*(nested?(.78-i*.14):.58),start=bodyH*(.2+i*.11),end=bodyH*(.5+i*.13);
    lathe([[0,start],[rr*.78,start],[rr,end],[rr*.72,end+.04],[0,end+.04]],aluminium,32);
    band(rr,end,.025,gold);
   }
   const rodR=baseR*.22;const rod=new THREE.Mesh(new THREE.CylinderGeometry(rodR,rodR,bodyH*.42,20),steel);rod.position.y=bodyH*.53;g.add(rod);
   for(let side of [-1,1]){
    const lug=new THREE.Mesh(new THREE.TorusGeometry(baseR*.32,.055,10,32),aluminium);lug.position.set(side*baseR*.82,-bodyH*.46,0);lug.rotation.y=Math.PI/2;g.add(lug);
    box(baseR*.36,.1,baseR*.42,steel,[side*baseR*.82,-bodyH*.46,0]);
   }
   tube([[-baseR*.6,-bodyH*.28,baseR*.7],[0,-bodyH*.12,baseR*.78],[baseR*.6,bodyH*.1,baseR*.7]],.025,orange);
  }
  else if(servo){
   // Rotation servo: motor can, output bearing, drive shaft and keyed horn.
   const motorR=r*(large?.74:small?.46:.58),motorH=h*.56;
   lathe([[0,-motorH*.5],[motorR*.82,-motorH*.5],[motorR,-motorH*.38],[motorR,motorH*.32],[motorR*.8,motorH*.5],[0,motorH*.5]],painted('#69747a','#c56b31','ROTATION SERVO MOTOR',name),64);
   for(let y of [-motorH*.38,motorH*.34])band(motorR,y,.04,gold);
   cyl(motorR*.42,motorR*.42,.14,steel,motorH*.56,40);
   add(new THREE.TorusGeometry(motorR*.43,.045,10,48),aluminium,[0,motorH*.64,0]);
   const shaftR=motorR*.18;const shaft=new THREE.Mesh(new THREE.CylinderGeometry(shaftR,shaftR,motorH*.36,24),gold);shaft.position.y=motorH*.82;g.add(shaft);
   box(motorR*1.35,.09,motorR*.25,aluminium,[0,motorH*.98,0]);
   for(let side of [-1,1])bolt(side*motorR*.5,-motorH*.2,motorR*.78,.025,steel);
   for(let i=0;i<8;i++){const ang=i*Math.PI/4;radialPipe(motorR*.98,-motorH*.28,motorH*.25,ang,steel,.018);}
  }
  else if(hinge){
   // Hinge assemblies: machined leaves, multiple knuckles, central pin and fasteners.
   const width=r*(alligator?1.7:large?1.35:1),length=h*(alligator?1.05:.72),barrelR=r*(large?.24:.17);
   box(width*.92,length*.72,.09,painted('#b8c0bf','#b68b4e','HINGE LEAF',name),[-width*.43,0,0]);
   box(width*.92,length*.72,.09,steel,[width*.43,0,0]);
   const knuckles=alligator?5:3;
   for(let i=0;i<knuckles;i++){
    const y=(i-(knuckles-1)/2)*length*.18;
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(barrelR,barrelR,length*.2,32),aluminium);barrel.rotation.x=Math.PI/2;barrel.position.set(0,y,0);g.add(barrel);
    band(barrelR,y,.025,gold);
   }
   const pin=new THREE.Mesh(new THREE.CylinderGeometry(barrelR*.32,barrelR*.32,length*.94,16),gold);pin.rotation.x=Math.PI/2;g.add(pin);
   for(let side of [-1,1])for(let i=0;i<4;i++)bolt(side*width*.72,(i-1.5)*length*.16,.06,.022,aluminium);
   if(alligator)for(let side of [-1,1])tube([[side*width*.2,-length*.4,.12],[side*width*.75,-length*.2,.12],[side*width*.2,length*.4,.12]],.025,steel);
  }
  else if(controller){
   box(r*1.45,h*.72,r*.62,painted('#6e797d','#c56b31','KAL 1000 ROBOTICS CONTROLLER',name));
   box(r*.92,h*.32,.04,dark,[0,h*.12,r*.33]);
   box(r*.72,h*.22,.025,blue,[0,h*.14,r*.36]);
   for(let i=0;i<6;i++){const x=(i-2.5)*r*.18;sphere(.04,i%2?orange:green,[x,-h*.18,r*.35],[1,.7,.3]);}
   for(let side of [-1,1]){cyl(.08,.08,.1,steel,-h*.1,16).position.x=side*r*.48;box(.16,.12,.08,gold,[side*r*.48,-h*.3,r*.25]);}
   for(let i=0;i<4;i++)box(r*.12,.035,.025,aluminium,[(i-1.5)*r*.18,-h*.36,r*.35]);
  }
  else{
   const motorR=r*(large?.78:.55),motorH=h*.66;
   lathe([[0,-motorH*.5],[motorR*.78,-motorH*.5],[motorR,-motorH*.38],[motorR,motorH*.34],[motorR*.78,motorH*.5],[0,motorH*.5]],painted('#68747a','#b68b4e','ELECTRIC ROTOR DRIVE',name),64);
   for(let i=0;i<16;i++){const ang=i*Math.PI/8;radialPipe(motorR*.99,-motorH*.3,motorH*.3,ang,aluminium,.018);}
   for(let y of [-motorH*.4,motorH*.4])band(motorR,y,.045,gold);
   cyl(motorR*.48,motorR*.48,.12,dark,motorH*.55,48);
   cyl(motorR*.26,motorR*.26,.16,steel,motorH*.7,32);
   const shaft=new THREE.Mesh(new THREE.CylinderGeometry(motorR*.12,motorR*.12,motorH*.45,20),gold);shaft.position.y=motorH*.96;g.add(shaft);
   for(let i=0;i<6;i++){const ang=i*Math.PI/3;box(motorR*.18,motorH*.18,.08,steel,[Math.cos(ang)*motorR*.8,0,Math.sin(ang)*motorR*.8],[0,-ang,0]);}
  }
 }
 else{
  lathe([[0,-h*.5],[r*.72,-h*.5],[r*.9,-h*.35],[r*.9,h*.35],[r*.72,h*.5],[0,h*.5]],ivory,48);band(r*.9,h*.36,.035,gold);radialLabel(r*.91,0,r*.7,h*.2,getLabelMaterial());
 }
 // Functional visual hooks used by the flight simulation.
 if(type==='engine'||type==='jet'||type==='booster'){
  const plume=add(new THREE.ConeGeometry(r*.38,.9,24),new THREE.MeshBasicMaterial({color:0xffa34d,transparent:true,opacity:.82,depthWrite:false}),[0,-h*.62,0],[Math.PI,0,0]);if(id.includes('thud'))plume.rotation.z=Math.PI/2;plume.name='engine-flame';plume.visible=false;
 }

 // Keep authored material assignments per sub-mesh; never stamp one generic decal atlas
 // across every surface (that distorts wheels, solar cells, glass and small mechanisms).
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});

 return g;
}
