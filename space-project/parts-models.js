// Original, independently authored KSP-inspired part geometry.
// No proprietary KSP meshes, textures, logos, or extracted game assets are used.
export function createPartModel(p,THREE){
 const g=new THREE.Group(),r=Math.max(.08,p.radius||.5),h=Math.max(.12,p.height||.5),id=p.id||'',name=p.name||'';
 const mat=(c,m=.45,rough=.42)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:rough});
 const alloy=mat(0xaeb9bb,.78,.3),white=mat(0xd8d8cf,.48,.48),dark=mat(0x303b42,.8,.34),black=mat(0x17232a,.65,.25),gold=mat(0xb68b42,.72,.28),glass=mat(0x234e68,.55,.16),blue=mat(0x244f79,.62,.28),rubber=mat(0x20262a,.05,.9),orange=mat(0xc47b35,.48,.52);
 const mesh=(geo,ma,pos=[0,0,0],rot=[0,0,0],scale=null)=>{const o=new THREE.Mesh(geo,ma);o.position.set(...pos);o.rotation.set(...rot);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const cyl=(rt,rb,len,ma,y=0,seg=32)=>mesh(new THREE.CylinderGeometry(rt,rb,len,seg),ma,[0,y,0]);
 const torus=(rad,tube,ma,y=0)=>mesh(new THREE.TorusGeometry(rad,tube,8,40),ma,[0,y,0],[Math.PI/2,0,0]);
 const box=(w,hh,d,ma,pos=[0,0,0],rot=[0,0,0])=>mesh(new THREE.BoxGeometry(w,hh,d),ma,pos,rot);
 const sphere=(rad,ma,pos=[0,0,0],scale=[1,1,1])=>mesh(new THREE.SphereGeometry(rad,24,16),ma,pos,[0,0,0],scale);
 const nozzle=(rad,len,ma=dark,y=0)=>{cyl(rad*.48,rad,len,ma,y-len*.45,32);torus(rad*.94,.055,alloy,y-len*.9);};
 const boltRing=(rad,y,count=12)=>{for(let i=0;i<count;i++){const a=i*Math.PI*2/count;sphere(.035,gold,[Math.cos(a)*rad,y,Math.sin(a)*rad],[1,1,1]);}};
 const panel=(w,hh,x,z)=>{box(w,.045,hh,blue,[x,0,z]);for(let k=1;k<5;k++)box(.018,.018,hh*.94,mat(0x82a9c2,.5,.3),[x-w/2+w*k/5,.032,z]);box(w*.98,.018,.025,alloy,[x,.034,0]);};
 const bodyBand=(rad,y,ma=dark)=>torus(rad,.045,ma,y);
 if(['pod','cockpit'].includes(p.type)){
  const inline=id.includes('inline'),lander=id.includes('lander'),cupola=id.includes('cupola'),mk2=id.includes('mk2'),mk3=id.includes('mk3'),seat=id==='seat';
  if(seat){box(.52,.16,.55,dark,[0,.12,0]);box(.42,.72,.12,white,[0,.52,-.18]);for(const x of [-.19,.19])box(.1,.45,.1,alloy,[x,.28,.1]);}
  else{
   const radius=mk3?r*.78:mk2?r*.84:r*.7;
   cyl(radius*.9,radius,h*.65,white,h*.34,40);cyl(radius*.9,radius*.9,.12,dark,h*.68,40);torus(radius*.92,.07,alloy,h*.68);
   if(lander){cyl(radius*.9,radius*.65,.22,orange,h*.72,32);for(let i=0;i<4;i++){const a=i*Math.PI/2;box(.12,.62,.12,alloy,[Math.cos(a)*radius*1.5,-.06,Math.sin(a)*radius*1.5]);}}
   else if(cupola){sphere(radius*.94,white,[0,h*.7,0],[1,.52,1]);for(let i=0;i<6;i++){const a=i*Math.PI/3;const w=box(.14,.23,.05,glass,[Math.cos(a)*radius*.75,h*.78,Math.sin(a)*radius*.75]);w.lookAt(Math.cos(a)*2,h*.78,Math.sin(a)*2);}}
   else{mesh(new THREE.ConeGeometry(radius*.92,h*.34,32),white,[0,h*.82,0]);}
   const windowCount=inline?2:mk3?5:mk2?4:3;
   for(let i=0;i<windowCount;i++){const a=(i-(windowCount-1)/2)*.42;const x=Math.sin(a)*radius*.7,z=Math.cos(a)*radius*.7;mesh(new THREE.SphereGeometry(radius*.19,18,12),glass,[x,h*.43,z],[0,0,0],[1,.78,.18]);torus(radius*.19,.025,alloy,h*.43).position.set(x,h*.43,z);}
   bodyBand(radius*.94,h*.18);bodyBand(radius*.94,h*.58,gold);
   for(let i=0;i<4;i++){const a=i*Math.PI/2;box(.13,.34,.16,dark,[Math.cos(a)*radius*1.02,h*.1,Math.sin(a)*radius*1.02]);}
   if(p.crew>1)for(let i=0;i<Math.min(4,p.crew);i++){const a=i*Math.PI/2;mesh(new THREE.SphereGeometry(.08,10,8),gold,[Math.cos(a)*radius*.45,-h*.02,Math.sin(a)*radius*.45]);}
  }
 }else if(p.type==='probe'){
  const oct=id.includes('okto')||id.includes('hecs'),flat=id.includes('stayputnik'),qbe=id.includes('qbe');
  if(flat){cyl(r*.92,r*.92,h*.38,white);torus(r*.9,.07,gold,h*.2);for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.12,.08,.42,alloy,[Math.cos(a)*r*.65,0,Math.sin(a)*r*.65],[0,-a,0]);}}
  else if(oct){mesh(new THREE.BoxGeometry(r*1.5,h*.85,r*1.5),white,[0,h*.45,0],[0,Math.PI/4,0]);for(let x of [-1,1])for(let z of [-1,1])sphere(.07,gold,[x*r*.52,h*.45,z*r*.52]);}
  else{cyl(r*.8,r*.8,h*.65,white,h*.36,8);torus(r*.78,.06,gold,h*.68);for(let i=0;i<4;i++){const a=i*Math.PI/2;box(.12,.42,.12,alloy,[Math.cos(a)*r*.8,h*.25,Math.sin(a)*r*.8]);}}
  cyl(r*.18,r*.22,h*.7,dark,h*1.02,12);sphere(r*.28,gold,[0,h*1.42,0]);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;box(.05,.5,.05,alloy,[Math.cos(a)*r*.55,h*1.22,Math.sin(a)*r*.55]);}
  if(qbe)box(r*1.8,.12,r*1.8,black,[0,-h*.1,0]);
 }else if(p.type==='tank'||p.type==='fuselage'||p.type==='resource'){
  const aircraft=p.type==='fuselage',mk2=id.includes('mk2'),mk3=id.includes('mk3'),donut=id.includes('donut'),baguette=id.includes('baguette'),xenon=id.includes('xenon'),ore=id.includes('ore');
  if(aircraft){
   const width=mk3?r*1.35:mk2?r*1.2:r;const shell=mesh(new THREE.CylinderGeometry(width,width,h,32),white,[0,0,0],[Math.PI/2,0,0]);torus(width*.96,.06,dark).rotation.x=0;
   for(const z of [-h*.34,0,h*.34]){const band=mesh(new THREE.TorusGeometry(width*.96,.045,8,32),gold,[0,0,z],[Math.PI/2,0,0]);}
   for(let i=0;i<4;i++){const x=(i-1.5)*width*.35;box(.035,.025,h*.82,dark,[x,width*.95,0]);}
  }else if(donut){cyl(r,r,h*.38,white);torus(r*.93,.12,alloy);torus(r*.93,.055,dark,.14);}
  else if(baguette){mesh(new THREE.CapsuleGeometry(r*.6,h*.28,6,16),white,[0,0,0],[Math.PI/2,0,0]);}
  else if(ore){cyl(r*.88,r*.88,h*.8,mat(0x788d77,.58,.55),h*.4,12);for(let y of [.15,h*.65])bodyBand(r*.9,y,gold);}
  else{
   cyl(r*.94,r*.94,h*.76,xenon?mat(0x718c9b,.72,.24):white,h*.5,40);
   mesh(new THREE.SphereGeometry(r*.94,32,12,0,Math.PI*2,0,Math.PI/2),alloy,[0,h*.88,0]);
   mesh(new THREE.SphereGeometry(r*.94,32,12,0,Math.PI*2,Math.PI/2,Math.PI/2),alloy,[0,h*.12,0]);
   for(const y of [h*.12,h*.22,h*.78,h*.88])bodyBand(r*.96,y,y===h*.22||y===h*.78?gold:dark);
   for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.035,h*.48,.035,dark,[Math.cos(a)*r*.95,h*.5,Math.sin(a)*r*.95]);}
   if(xenon){for(let i=0;i<6;i++){const a=i*Math.PI/3;sphere(.06,gold,[Math.cos(a)*r*.6,h*.5,Math.sin(a)*r*.6]);}}
  }
 }else if(p.type==='engine'||p.type==='jet'||p.type==='booster'){
  const jet=p.type==='jet'||id.startsWith('jet-'),solid=p.type==='booster',ion=id.includes('ion')||id.includes('dawn'),nerv=id.includes('nerv'),mammoth=id.includes('mammoth'),vector=id.includes('vector'),spider=id.includes('spider'),poodle=id.includes('poodle'),twin=id.includes('twinboar');
  const count=mammoth?4:twin?2:spider?4:1;
  if(jet){
   cyl(r*.72,r,h*.72,alloy,h*.53,40);const lip=mesh(new THREE.TorusGeometry(r*.72,.1,12,40),gold,[0,0,h*.18],[Math.PI/2,0,0]);mesh(new THREE.CylinderGeometry(r*.52,r*.52,.07,32),black,[0,0,h*.22],[Math.PI/2,0,0]);for(let i=0;i<12;i++){const a=i*Math.PI/6;box(.035,.035,r*.95,alloy,[Math.cos(a)*r*.45,Math.sin(a)*r*.45,h*.22]);}
   if(id.includes('whiplash'))for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.06,.08,h*.58,dark,[Math.cos(a)*r*.9,Math.sin(a)*r*.9,0]);}
  }else if(ion){cyl(r*.34,r*.65,h*.32,alloy,h*.35);for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.035,h*.55,.035,gold,[Math.cos(a)*r*.52,h*.48,Math.sin(a)*r*.52]);}mesh(new THREE.CylinderGeometry(r*.5,r*.28,.08,24),blue,[0,h*.72,0]);}
  else{
   if(solid){cyl(r,r,h*.72,white,h*.52,32);mesh(new THREE.ConeGeometry(r*.98,h*.28,32),orange,[0,h*.99,0]);}
   else{cyl(r*.9,r,h*.48,white,h*.7,36);for(let i=0;i<count;i++){const a=i*Math.PI*2/count,x=count===1?0:Math.cos(a)*r*.42,z=count===1?0:Math.sin(a)*r*.42;const nr=count===4?r*.38:count===2?r*.43:r*.78;nozzle(nr,h*.62,dark,-h*.03);if(count>1){g.children.slice(-3).forEach(o=>o.position.x+=x);g.children.slice(-3).forEach(o=>o.position.z+=z);}}}
   if(nerv){cyl(r*.38,r*.5,h*.6,gold,h*.23);for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.07,h*.5,.07,dark,[Math.cos(a)*r*.65,h*.38,Math.sin(a)*r*.65]);}}
   else if(poodle){for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.07,.24,.07,gold,[Math.cos(a)*r*.8,h*.42,Math.sin(a)*r*.8]);}}
   else{for(let i=0;i<6;i++){const a=i*Math.PI/3;box(.035,h*.22,.035,dark,[Math.cos(a)*r*.91,h*.65,Math.sin(a)*r*.91]);}}
  }
  torus(r*.88,.055,gold,-h*.01);
  const flame=mesh(new THREE.ConeGeometry(r*.42,.9,16),new THREE.MeshBasicMaterial({color:0xff9b37,transparent:true,opacity:.82}),[0,-h*.38,0],[Math.PI,0,0]);flame.name='engine-flame';flame.visible=false;
 }else if(p.type==='wing'||p.type==='tail'||p.type==='control'||p.type==='fin'){
  const span=r,delta=id.includes('delta'),swept=id.includes('swept')||id.includes('strake'),vertical=p.type==='tail'||id.includes('rudder')||id.includes('winglet');
  const shape=new THREE.Shape();shape.moveTo(-span*.2,-.25);shape.lineTo(span*(swept?.5:.72),-.12);shape.lineTo(span*(delta?.34:.42),.18);shape.lineTo(-span*.2,.22);shape.closePath();
  const wing=mesh(new THREE.ExtrudeGeometry(shape,{depth:Math.max(.07,p.height),bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.025,curveSegments:8}),mat(0xaeb9b7,.68,.36),[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  if(vertical){wing.rotation.x=0;wing.position.y=p.height*.15;}
  const stripe=box(span*.55,.025,.035,gold,[span*.18,p.height+.03,.05]);stripe.rotation.y=swept?.12:0;
  if(p.type==='control'||id.includes('elevon')){const hinge=box(span*.52,.035,.04,dark,[span*.2,p.height+.055,.14]);}
  if(id.includes('wing-delta')||delta)for(let i=0;i<3;i++)box(.025,.02,.3,alloy,[span*(.05+i*.13),p.height+.04,.1]);
 }else if(p.type==='solar'){
  const large=id.includes('gigantor')||id.includes('xl')||id.includes('sp10');
  const count=id.includes('ox4')?2:large?3:2,width=large?1.7:1.05;
  cyl(.15,.2,.35,alloy,h*.5,16);box(.12,.12,large?1.5:1.15,gold,[0,h*.5,0]);
  for(let side of [-1,1]){const x=side*(width*.68);box(width,.055,large?1.55:1.05,blue,[x,h*.5,0]);for(let k=1;k<6;k++)box(.022,.018,large?1.5:1.0,mat(0x8bb5cf,.55,.3),[x-width/2+width*k/6,h*.5+.035,0]);box(width,.025,.035,alloy,[x,h*.5+.04,.53]);}
  if(count===3)box(.08,.08,2.5,alloy,[0,h*.5,0]);
 }else if(p.type==='chute'){
  cyl(r*.78,r*.78,h*.7,white,h*.38,24);torus(r*.78,.06,gold,h*.73);cyl(r*.56,r*.56,.12,orange,h*.78,20);
  const canopy=new THREE.Group();for(let i=0;i<12;i++){const a=i*Math.PI/6;const seg=mesh(new THREE.SphereGeometry(r*.55,12,8,0,Math.PI/6,0,Math.PI/2),i%2?white:orange,[Math.cos(a)*r*.22,h*.95,Math.sin(a)*r*.22],[0,-a,0],[1,.28,1]);}
  for(let i=0;i<8;i++){const a=i*Math.PI/4;const line=mesh(new THREE.CylinderGeometry(.008,.008,h*.45,5),gold,[Math.cos(a)*r*.25,h*.6,Math.sin(a)*r*.25]);}
 }else if(p.type==='battery'){
  const fuelCell=id.includes('fuelcell'),wheel=id.includes('wheel');box(r*1.65,h*.72,r*1.4,fuelCell?mat(0x687f70,.65,.4):white,[0,h*.45,0]);box(r*1.5,.08,r*1.25,dark,[0,h*.84,0]);for(let x of [-1,1])for(let z of [-1,1])box(.07,.12,.07,gold,[x*r*.65,h*.9,z*r*.55]);
  if(wheel){torus(r*.52,.09,gold,h*.48);cyl(r*.35,r*.35,.14,dark,h*.48,20);}
 }else if(p.type==='comm'){
  cyl(r*.18,r*.22,h*.5,alloy,h*.25,12);cyl(r*.08,r*.08,h*.85,dark,h*.8,10);
  if(id.includes('dts')||id.includes('dish')){mesh(new THREE.SphereGeometry(r*.78,24,12,0,Math.PI*2,0,Math.PI/2),white,[0,h*1.15,0]);torus(r*.78,.04,gold,h*1.15);}
  else{sphere(r*.2,gold,[0,h*1.25,0]);for(let i=0;i<4;i++){const a=i*Math.PI/2;box(.025,h*.35,.025,alloy,[Math.cos(a)*r*.4,h*1.02,Math.sin(a)*r*.4]);}}
 }else if(p.type==='science'){
  cyl(r*.75,r*.75,h*.65,white,h*.34,24);bodyBand(r*.78,h*.1,gold);bodyBand(r*.78,h*.62,dark);
  if(id.includes('goo')){sphere(r*.5,mat(0x9da78d,.1,.25),[0,h*.82,0]);}
  else if(id.includes('material')){box(r*1.65,h*.55,r*1.65,dark,[0,h*.5,0]);for(let i=0;i<3;i++)box(.08,.6,.08,gold,[(i-1)*r*.4,h*.7,0]);}
  else if(id.includes('thermo')||id.includes('barometer')){cyl(r*.22,r*.22,h*.7,dark,h*.9,12);sphere(r*.25,orange,[0,h*1.3,0]);}
  else{cyl(r*.12,r*.12,h*.65,alloy,h*1.05,10);mesh(new THREE.SphereGeometry(r*.55,18,10,0,Math.PI*2,0,Math.PI/2),alloy,[0,h*1.38,0]);}
 }else if(p.type==='decoupler'||p.type==='structural'){
  const tri=id.includes('tri'),quad=id.includes('quad'),bi=id.includes('bi'),strut=id.includes('strut')||id.includes('hardpoint'),adapter=id.includes('adapter');
  if(strut){box(r*1.6,.16,r*.42,alloy);box(.16,.16,r*1.6,alloy);for(let x of [-1,1])for(let z of [-1,1])sphere(.09,gold,[x*r*.7,0,z*r*.7]);}
  else{cyl(r,r*.82,h*.55,dark,h*.45,32);torus(r*.98,.07,alloy,h*.72);torus(r*.8,.055,gold,h*.15);boltRing(r*.88,h*.45,16);
   if(adapter){mesh(new THREE.CylinderGeometry(r*.48,r*.9,h*.65,32),white,[0,h*.55,0]);}
   if(tri||quad||bi){const count=tri?3:quad?4:2;for(let i=0;i<count;i++){const a=i*Math.PI*2/count;const x=Math.cos(a)*r*.9,z=Math.sin(a)*r*.9;cyl(r*.26,r*.26,h*.35,alloy,h*.48,16).position.set(x,h*.48,z);}}
  }
 }else if(p.type==='docking'){
  cyl(r*.86,r*.72,h*.52,alloy,h*.38,40);torus(r*.82,.12,gold,h*.68);torus(r*.58,.07,dark,h*.72);cyl(r*.46,r*.46,.12,black,h*.73,32);boltRing(r*.72,h*.4,16);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.08,.22,.08,dark,[Math.cos(a)*r*.92,h*.35,Math.sin(a)*r*.92]);}
 }else if(p.type==='robotics'){
  const nm=(p.name||'').toLowerCase(),isPiston=/cylinder|油圧/.test(nm),isRotor=/rotor|ローター/.test(nm),isController=/kal|controller|コントローラー/.test(nm);
  if(isPiston){cyl(r*.22,r*.22,h*.82,alloy,h*.42,20);cyl(r*.13,r*.13,h*.62,gold,h*.95,16);cyl(r*.38,r*.38,.12,dark,h*.08,20);cyl(r*.38,r*.38,.12,dark,h*.83,20);torus(r*.3,.04,orange,h*.82);}
  else if(isRotor){cyl(r*.52,r*.52,h*.34,dark,h*.3,32);torus(r*.48,.08,gold,h*.5);for(let i=0;i<6;i++){const a=i*Math.PI/3;box(.11,h*.16,r*1.45,alloy,[Math.cos(a)*r*.78,h*.56,Math.sin(a)*r*.78],[0,-a,0]);}cyl(r*.16,r*.16,h*.65,gold,h*.92,16);}
  else if(isController){box(r*1.5,h*.68,r*1.25,white,[0,h*.38,0]);for(let i=0;i<4;i++){const a=i*Math.PI/2;sphere(.08,i%2?orange:blue,[Math.cos(a)*r*.48,h*.78,Math.sin(a)*r*.4]);}box(r*1.25,.08,r*.85,dark,[0,h*.76,0]);}
  else{cyl(r*.62,r*.62,h*.3,dark,h*.25,24);torus(r*.56,.1,gold,h*.48);const arm=box(r*1.5,.14,.18,alloy,[r*.7,h*.48,0]);arm.rotation.z=-.18;box(.16,h*.3,.16,dark,[r*1.42,h*.34,0]);sphere(.18,gold,[r*1.42,h*.15,0]);}
 }else if(p.type==='rotor-blade'){
  cyl(r*.2,r*.2,h*.32,dark,h*.18,20);cyl(r*.1,r*.1,h*.9,gold,h*.72,16);
  const bladeCount=/type s|タイプs/i.test(p.name||'')?3:2;
  for(let i=0;i<bladeCount;i++){const a=i*Math.PI*2/bladeCount;const blade=box(r*2.4,.07,Math.max(.16,h*.28),white,[Math.cos(a)*r*1.15,h*.78,Math.sin(a)*r*1.15],[0,-a,0]);blade.rotation.z=.025;box(r*1.9,.018,.025,gold,[Math.cos(a)*r*1.15,h*.83,Math.sin(a)*r*1.15],[0,-a,0]);}
 }else if(p.type==='payload'){
  cyl(r,r,h*.8,dark,h*.42,32);for(let y of [h*.08,h*.82])bodyBand(r,y,alloy);box(r*1.72,h*.58,.08,white,[0,h*.44,r*.93]);for(let i=0;i<6;i++)box(.025,h*.45,.04,gold,[(i-2.5)*r*.22,h*.44,r*.98]);
 }else if(p.type==='thermal'){
  cyl(r,r*.78,h*.34,mat(0x5c4638,.2,.9),h*.2,40);torus(r*.9,.08,gold,h*.42);for(let i=0;i<12;i++){const a=i*Math.PI/6;box(.05,.08,.18,dark,[Math.cos(a)*r*.8,h*.3,Math.sin(a)*r*.8]);}
 }else if(p.type==='intake'){
  cyl(r*.8,r,h*.68,alloy,h*.42,32);torus(r*.8,.1,gold,h*.77);cyl(r*.57,r*.57,.07,black,h*.79,32);for(let i=0;i<12;i++){const a=i*Math.PI/6;box(.04,.04,r*.55,alloy,[Math.cos(a)*r*.4,h*.79,Math.sin(a)*r*.4]);}
 }else if(p.type==='gear'||p.type==='ground'){
  const wheelR=r*.56;box(.14,h*.72,.14,alloy,[0,h*.43,0],[0,0,-.22]);box(.12,.1,.42,dark,[0,h*.08,0]);mesh(new THREE.CylinderGeometry(wheelR,wheelR,.2,28),rubber,[r*.55,.02,0],[0,0,Math.PI/2]);mesh(new THREE.CylinderGeometry(wheelR*.5,wheelR*.5,.22,20),alloy,[r*.55,.02,0],[0,0,Math.PI/2]);torus(wheelR*.7,.035,gold,.02).rotation.z=Math.PI/2;
 }else if(p.type==='airbrake'){
  box(r*1.65,.12,r*.55,dark);box(r*1.5,h*.8,.08,white,[0,h*.45,0]);for(let i=0;i<4;i++)box(.035,h*.68,.025,gold,[(i-1.5)*r*.3,h*.45,.06]);
 }else if(p.type==='utility'){
  for(let x of [-r*.35,r*.35])cyl(.035,.035,h,alloy,h*.5,8).position.x=x;
  for(let y=.1;y<h;y+=.16)box(r*.9,.045,.07,dark,[0,y,0]);
 }else{
  cyl(r*.85,r*.85,h*.65,alloy,h*.35,20);bodyBand(r*.86,h*.12,gold);
 }
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;
}
