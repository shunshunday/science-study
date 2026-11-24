// Original KSP1-inspired part models.
// Primary silhouettes are authored continuous lathed/extruded meshes with UV-painted
// surface maps. No proprietary KSP geometry, textures, or logos are included.
export function createPartModel(p,THREE){
 const root=new THREE.Group(),r=Math.max(.06,Number(p.radius)||.5),h=Math.max(.12,Number(p.height)||.5),id=String(p.id||''),name=String(p.name||'');
 const mat=(color,metalness=.18,roughness=.68)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const paint=(base,accent,kind='tank')=>{
  const cacheKey=base+'|'+accent+'|'+kind;if(textureCache.has(cacheKey))return textureCache.get(cacheKey);
  const c=document.createElement('canvas');c.width=512;c.height=1024;const x=c.getContext('2d');
  x.fillStyle=base;x.fillRect(0,0,512,1024);
  const grad=x.createLinearGradient(0,0,512,0);grad.addColorStop(0,'rgba(0,0,0,.18)');grad.addColorStop(.18,'rgba(255,255,255,.09)');grad.addColorStop(.5,'rgba(255,255,255,.02)');grad.addColorStop(.82,'rgba(0,0,0,.08)');grad.addColorStop(1,'rgba(0,0,0,.2)');x.fillStyle=grad;x.fillRect(0,0,512,1024);
  x.strokeStyle='rgba(25,34,39,.38)';x.lineWidth=3;
  for(let y=90;y<1024;y+=170){x.beginPath();x.moveTo(0,y);x.lineTo(512,y);x.stroke();}
  x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=2;
  for(let y=92;y<1024;y+=170){x.beginPath();x.moveTo(0,y+4);x.lineTo(512,y+4);x.stroke();}
  if(kind==='tank'||kind==='pod'||kind==='payload'){
   x.fillStyle=accent;x.fillRect(0,115,512,24);x.fillRect(0,835,512,18);
   x.strokeStyle='rgba(25,32,36,.32)';x.lineWidth=2;
   for(let xx=42;xx<512;xx+=86){x.beginPath();x.moveTo(xx,145);x.lineTo(xx,820);x.stroke();}
   for(let yy=185;yy<820;yy+=160)for(let xx=42;xx<512;xx+=86){x.fillStyle='rgba(18,25,29,.45)';x.fillRect(xx-3,yy-3,6,6);}
  }
  x.fillStyle='rgba(20,28,32,.55)';x.fillRect(12,490,488,34);
  x.fillStyle='rgba(255,255,255,.55)';x.font='bold 20px sans-serif';x.fillText(kind==='engine'?'PROPULSION':kind==='pod'?'CREW MODULE':'FLIGHT HARDWARE',28,482);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.ClampToEdgeWrapping;textureCache.set(cacheKey,texture);return texture;
 };
 const shell=(base,accent,kind='tank',metalness=.12,roughness=.72)=>new THREE.MeshStandardMaterial({map:paint(base,accent,kind),metalness,roughness});
 const white=shell('#d5d6d0','#9caaad','tank',.16,.62),cream=shell('#c4c7c0','#d9b56e','pod',.12,.7),dark=mat(0x283238,.55,.42),steel=mat(0x89969a,.78,.34),gold=mat(0xb18a48,.68,.36),black=mat(0x121a1f,.22,.84),glass=mat(0x183c4b,.62,.2),orange=mat(0xb66d32,.18,.64),blue=mat(0x315d78,.48,.42);
 const add=(geometry,material,position=[0,0,0],rotation=[0,0,0])=>{const m=new THREE.Mesh(geometry,material);m.position.set(...position);m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;};
 const lathe=(profile,material,segments=64)=>add(new THREE.LatheGeometry(profile.map(([x,y])=>new THREE.Vector2(x,y)),segments),material);
 const ring=(radius,y,tube=.025,material=steel)=>add(new THREE.TorusGeometry(radius,tube,10,64),material,[0,y,0],[Math.PI/2,0,0]);
 const cylinder=(radius,height,material,y=0,radial=48)=>add(new THREE.CylinderGeometry(radius,radius,height,radial,1),material,[0,y,0]);
 const panelBox=(w,d,y,material=dark)=>add(new THREE.BoxGeometry(w,.012,d),material,[0,y,0]);
 const bolts=(radius,y,count=16)=>{for(let i=0;i<count;i++){const a=i*Math.PI*2/count;add(new THREE.SphereGeometry(.018,8,6),gold,[Math.cos(a)*radius,y,Math.sin(a)*radius]);}};
 const baseRadius=r*.94;
 if(['tank','resource','fuselage'].includes(p.type)){
  const aircraft=p.type==='fuselage',mk2=id.includes('mk2'),mk3=id.includes('mk3'),donut=/donut/i.test(id),baguette=/baguette/i.test(id),ore=/ore/i.test(id);
  if(aircraft){
   const w=mk3?r*1.32:mk2?r*1.18:r;
   const shape=new THREE.Shape();shape.moveTo(-w*.88,-h*.5);shape.lineTo(w*.88,-h*.5);shape.lineTo(w,h*.36);shape.lineTo(w*.82,h*.5);shape.lineTo(-w*.82,h*.5);shape.lineTo(-w,h*.36);shape.closePath();
   const body=add(new THREE.ExtrudeGeometry(shape,{depth:w*1.35,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.09,bevelThickness:.06}),white,[0,0,-w*.675],[0,0,0]);
   for(const y of [-h*.34,h*.34]){const seam=add(new THREE.BoxGeometry(w*1.65,.025,w*1.32),gold,[0,y,0]);}
   for(let i=0;i<6;i++){const z=-w*.55+i*w*.22;add(new THREE.BoxGeometry(.018,h*.68,.018),dark,[w*.88,0,z]);}
  }else if(donut){
   lathe([[0,-h*.25],[r*.76,-h*.25],[r*.98,-h*.18],[r,-h*.06],[r,.08],[r*.9,h*.19],[r*.72,h*.25],[0,h*.25]],white);
   ring(r*.9,0,.07,gold);
  }else if(baguette){
   lathe([[0,-h*.5],[r*.35,-h*.48],[r*.68,-h*.36],[r*.8,-h*.1],[r*.72,h*.3],[r*.48,h*.48],[0,h*.5]],white);
  }else if(ore){
   lathe([[0,-h*.5],[r*.78,-h*.5],[r*.92,-h*.42],[r*.94,h*.38],[r*.8,h*.5],[0,h*.5]],shell('#718274','#b0a06c','tank',.2,.8),32);
  }else{
   const profile=[[0,-h*.5],[r*.76,-h*.5],[r*.91,-h*.46],[r*.98,-h*.38],[r,-h*.29],[r,h*.29],[r*.98,h*.38],[r*.91,h*.46],[r*.76,h*.5],[0,h*.5]];
   lathe(profile,white,72);
   for(const y of [-h*.43,-h*.34,h*.34,h*.43])ring(r*(Math.abs(y)>h*.4?.91:.995),y,.022,Math.abs(y)>h*.4?steel:gold);
   ring(r*.98,0,.012,dark);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;const seam=add(new THREE.BoxGeometry(.012,h*.68,.012),dark,[Math.cos(a)*r*.995,0,Math.sin(a)*r*.995]);}
   bolts(r*.93,-h*.42,20);bolts(r*.93,h*.42,20);
  }
 }else if(p.type==='engine'||p.type==='jet'||p.type==='booster'){
  const solid=p.type==='booster',ion=/ion|dawn/i.test(id),jet=p.type==='jet';
  if(solid){
   lathe([[0,-h*.5],[r*.74,-h*.5],[r*.9,-h*.44],[r*.96,-h*.32],[r*.96,h*.28],[r*.9,h*.4],[r*.62,h*.48],[0,h*.5]],white);
   ring(r*.92,-h*.32,.035,orange);ring(r*.92,h*.34,.035,steel);
   lathe([[0,h*.48],[r*.62,h*.48],[0,h*.66]],orange);
  }else if(ion){
   lathe([[0,-h*.35],[r*.34,-h*.35],[r*.48,-h*.18],[r*.5,h*.1],[r*.36,h*.34],[r*.2,h*.4],[0,h*.4]],blue);
   ring(r*.48,-h*.2,.04,gold);
  }else if(jet){
   lathe([[0,-h*.5],[r*.44,-h*.5],[r*.76,-h*.36],[r*.9,-h*.05],[r*.78,h*.35],[r*.72,h*.5],[0,h*.5]],steel);
   ring(r*.78,h*.42,.065,gold);
   add(new THREE.CylinderGeometry(r*.53,r*.53,.025,48),black,[0,0,h*.5],[Math.PI/2,0,0]);
  }else{
   const nozzleR=r*(id.includes('mammoth')?.48:id.includes('twinboar')?.42:.86);
   const count=id.includes('mammoth')?4:id.includes('twinboar')||id.includes('rapier')?2:id.includes('spider')?4:1;
   lathe([[0,h*.5],[r*.75,h*.5],[r*.78,h*.28],[r*.62,h*.12],[r*.52,-h*.04],[nozzleR*.82,-h*.2],[nozzleR,-h*.48],[nozzleR*.92,-h*.5]],white);
   for(let i=0;i<count;i++){
    const a=i*Math.PI*2/count,ox=count===1?0:Math.cos(a)*r*.34,oz=count===1?0:Math.sin(a)*r*.34,nr=count===1?nozzleR: r*(count===4?.28:.36);
    const nozzleProfile=[[nr*.48,-h*.65],[nr*.7,-h*.56],[nr*.95,-h*.28],[nr*.86,-h*.1],[nr*.56,h*.05],[nr*.52,h*.12],[0,h*.12]];
    const n=add(new THREE.LatheGeometry(nozzleProfile.map(([x,y])=>new THREE.Vector2(x,y)),48),dark,[ox,-h*.05,oz]);
    ring(nr*.94,-h*.58,.035,steel).position.set(ox,-h*.58,oz);
   }
   ring(r*.76,h*.28,.035,gold);bolts(r*.75,h*.3,16);
  }
 }else if(p.type==='pod'||p.type==='cockpit'){
  const inline=id.includes('inline'),lander=id.includes('lander'),cupola=id.includes('cupola'),mk2=id.includes('mk2'),mk3=id.includes('mk3'),seat=id==='seat';
  if(seat){
   const sh=new THREE.Shape();sh.moveTo(-r*.45,0);sh.lineTo(r*.45,0);sh.lineTo(r*.38,h*.5);sh.lineTo(r*.25,h*.9);sh.lineTo(-r*.25,h*.9);sh.lineTo(-r*.38,h*.5);sh.closePath();
   add(new THREE.ExtrudeGeometry(sh,{depth:r*.42,bevelEnabled:true,bevelSegments:4,bevelSize:.05,bevelThickness:.04}),cream,[0,0,-r*.21]);
  }else{
   const rr=mk3?r*.83:mk2?r*.9:r*.78;
   const profile=lander?[[0,-h*.5],[rr*.82,-h*.5],[rr,-h*.34],[rr,h*.25],[rr*.78,h*.4],[rr*.48,h*.5],[0,h*.5]]:cupola?[[0,-h*.5],[rr*.9,-h*.5],[rr,-h*.28],[rr*.95,h*.12],[rr*.82,h*.36],[rr*.5,h*.48],[0,h*.5]]:[[0,-h*.5],[rr*.8,-h*.5],[rr,-h*.4],[rr,h*.18],[rr*.9,h*.32],[rr*.72,h*.4],[rr*.5,h*.48],[0,h*.5]];
   lathe(profile,cream,64);
   ring(rr*.96,-h*.38,.035,steel);ring(rr*.96,h*.22,.03,gold);
   if(!cupola){for(let i=0;i<(inline?2:mk3?5:mk2?4:3);i++){const a=(i-((inline?2:mk3?5:mk2?4:3)-1)/2)*.42;const z=Math.cos(a)*rr*.88,x=Math.sin(a)*rr*.88;add(new THREE.SphereGeometry(rr*.17,24,16),glass,[x,h*.04,z],[0,0,0]);add(new THREE.TorusGeometry(rr*.18,.018,8,32),steel,[x,h*.04,z],[0,0,0]);}}
   if(cupola){for(let i=0;i<6;i++){const a=i*Math.PI/3;add(new THREE.SphereGeometry(rr*.18,18,12),glass,[Math.cos(a)*rr*.58,h*.24,Math.sin(a)*rr*.58],[0,0,0],[1,.75,.2]);}}
   if(lander){for(let i=0;i<4;i++){const a=i*Math.PI/2;const legShape=new THREE.Shape();legShape.moveTo(-.035,0);legShape.lineTo(.035,0);legShape.lineTo(.09,-h*.42);legShape.lineTo(-.09,-h*.42);legShape.closePath();add(new THREE.ExtrudeGeometry(legShape,{depth:.08,bevelEnabled:true,bevelSegments:2,bevelSize:.012,bevelThickness:.01}),steel,[Math.cos(a)*rr*.85,-h*.12,Math.sin(a)*rr*.85],[0,-a,0]);}}
   for(let i=0;i<4;i++){const a=i*Math.PI/2;add(new THREE.BoxGeometry(.055,h*.18,.055),dark,[Math.cos(a)*rr*.98,-h*.12,Math.sin(a)*rr*.98]);}
  }
 }else if(p.type==='nosecone'||p.type==='payload'){
  const fairing=/fairing|防護シェル/i.test(name);
  if(fairing){lathe([[0,-h*.5],[r*.9,-h*.5],[r,-h*.38],[r*.94,h*.08],[r*.72,h*.28],[r*.4,h*.43],[0,h*.5]],white,72);ring(r*.96,-h*.42,.04,steel);}
  else{lathe([[0,-h*.5],[r*.92,-h*.5],[r*.94,-h*.32],[r*.76,h*.02],[r*.48,h*.3],[r*.18,h*.46],[0,h*.5]],white,72);ring(r*.92,-h*.45,.035,gold);}
 }else if(['wing','tail','control','fin'].includes(p.type)){
  const span=r,vertical=p.type==='tail'||id.includes('rudder')||id.includes('winglet'),delta=id.includes('delta'),swept=id.includes('swept')||id.includes('strake');
  const shape=new THREE.Shape();shape.moveTo(-span*.24,-h*.35);shape.lineTo(span*(swept?.48:.78),-h*.24);shape.lineTo(span*(delta?.34:.42),h*.34);shape.lineTo(-span*.24,h*.28);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:Math.max(.055,r*.1),bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.045,bevelThickness:.025});
  add(geo,shell('#aeb8b7','#8e9b9c','wing',.34,.58),[0,vertical?0:-r*.05,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
 }else if(p.type==='decoupler'||p.type==='structural'||p.type==='docking'){
  const docking=p.type==='docking',adapter=/adapter|アダプター/i.test(name),r2=r*.88;
  if(adapter){lathe([[0,-h*.5],[r,-h*.5],[r*.95,-h*.34],[r*.68,h*.34],[r*.64,h*.5],[0,h*.5]],white);ring(r*.98,-h*.43,.03,gold);}
  else{lathe([[0,-h*.5],[r2*.82,-h*.5],[r2,-h*.36],[r2,h*.36],[r2*.82,h*.5],[0,h*.5]],docking?steel:dark,48);ring(r2*.95,-h*.32,.045,gold);ring(r2*.95,h*.32,.045,steel);bolts(r2*.82,0,20);if(docking){ring(r2*.62,h*.45,.06,gold);cylinder(r2*.42,.06,black,h*.48);}}
 }else if(p.type==='solar'){
  const wide=id.includes('gigantor')||id.includes('xl'),w=wide?r*1.8:r*1.25,depth=h*1.35;
  for(const side of [-1,1]){const shape=new THREE.Shape();shape.moveTo(-w/2,-depth/2);shape.lineTo(w/2,-depth/2);shape.lineTo(w/2,depth/2);shape.lineTo(-w/2,depth/2);shape.closePath();const panel=add(new THREE.ShapeGeometry(shape),blue,[side*w*.72,h*.45,0]);panel.rotation.x=-Math.PI/2;for(let k=1;k<8;k++)add(new THREE.BoxGeometry(.012,.012,depth),steel,[side*w*.72-w/2+w*k/8,h*.45+.01,0]);}
  cylinder(r*.12,.3,steel,h*.4,20);ring(r*.16,h*.58,.025,gold);
 }else if(p.type==='battery'||p.type==='probe'||p.type==='science'||p.type==='comm'||p.type==='utility'||p.type==='thermal'){
  const wide=id.includes('okto')||id.includes('hecs')||id.includes('stayputnik');
  const rr=wide?r*.8:r*.66;
  lathe([[0,-h*.5],[rr*.8,-h*.5],[rr,-h*.38],[rr,h*.28],[rr*.78,h*.44],[0,h*.5]],p.type==='probe'?shell('#b7c2bd','#b48b49','tank') : white,40);
  ring(rr*.95,-h*.36,.025,gold);ring(rr*.95,h*.32,.025,steel);
  if(p.type==='comm'){const mast=add(new THREE.CylinderGeometry(.018,.026,h*.48,12),steel,[0,h*.72,0]);add(new THREE.SphereGeometry(rr*.28,24,16),gold,[0,h*.98,0]);}
  if(p.type==='science'){panelBox(rr*1.4,rr*1.4,h*.12,dark);add(new THREE.SphereGeometry(rr*.32,20,12),glass,[0,h*.64,0]);}
  if(p.type==='solar'){/* solar branch handled above */}
 }else if(p.type==='gear'||p.type==='ground'){
  const shape=new THREE.Shape();shape.moveTo(-r*.4,h*.5);shape.lineTo(-r*.16,h*.5);shape.lineTo(r*.08,-h*.18);shape.lineTo(r*.5,-h*.36);shape.lineTo(r*.46,-h*.5);shape.lineTo(r*.24,-h*.5);shape.lineTo(-r*.12,-h*.34);shape.closePath();
  add(new THREE.ExtrudeGeometry(shape,{depth:r*.12,bevelEnabled:true,bevelSegments:4,bevelSize:.035,bevelThickness:.025}),steel,[0,0,-r*.06]);
  ring(r*.28,-h*.45,.04,black);
 }else if(p.type==='robotics'||p.type==='rotor-blade'){
  const shape=new THREE.Shape();shape.moveTo(-r*.12,-h*.5);shape.lineTo(r*.12,-h*.5);shape.lineTo(r*.16,h*.32);shape.lineTo(r*.34,h*.5);shape.lineTo(-r*.34,h*.5);shape.lineTo(-r*.16,h*.32);shape.closePath();
  add(new THREE.ExtrudeGeometry(shape,{depth:r*.16,bevelEnabled:true,bevelSegments:4,bevelSize:.03,bevelThickness:.02}),steel);
  ring(r*.3,-h*.36,.04,gold);
 }else if(p.type==='chute'){
  lathe([[0,-h*.5],[r*.72,-h*.5],[r*.84,-h*.35],[r*.84,h*.22],[r*.64,h*.42],[0,h*.5]],cream,48);ring(r*.82,h*.24,.04,gold);
  const canopy=new THREE.SphereGeometry(r*.8,32,20,0,Math.PI*2,0,Math.PI/2);add(canopy,orange,[0,h*.9,0],[Math.PI,0,0]);
 }else{
  lathe([[0,-h*.5],[r*.8,-h*.5],[r,h*.35],[r*.78,h*.5],[0,h*.5]],white,40);ring(r*.9,-h*.35,.03,gold);
 }
 root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return root;
}
