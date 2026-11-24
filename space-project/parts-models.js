// Independently authored high-detail KSP1-inspired procedural part models.
// Each stock-style part family gets its own silhouette, finish, decals and mechanical detailing.
export function createPartModel(p,THREE){
 const g=new THREE.Group(),id=String(p.id||''),name=String(p.name||''),type=String(p.type||''),r=Math.max(.055,Number(p.radius)||.5),h=Math.max(.12,Number(p.height)||.5);
 const M=(color,metalness=.35,roughness=.48,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});
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
 const labelMat=makeLabel(id.includes('rockomax')||id.includes('x200')?'#b84c36':id.includes('s3')?'#b68b4e':'#b68b4e',id.includes('rockomax')?'ROCKOMAX INDUSTRIES':'KERBODYNE',id);
 const radialLabel=(radius,y,w,hh,mat=labelMat)=>{const m=add(new THREE.PlaneGeometry(w,hh),mat,[0,y,radius]);return m;};
 const torusAt=(rad,y,t,mat)=>band(rad,y,t,mat);
 const detailRivets=(rad,y,count=16,offset=0)=>{for(let i=0;i<count;i++){const a=i*Math.PI*2/count+offset;bolt(Math.cos(a)*rad,y,Math.sin(a)*rad,.018);}};
 const radialPipe=(rad,y0,y1,a,mat=aluminium,thick=.018)=>tube([[Math.cos(a)*rad,y0,Math.sin(a)*rad],[Math.cos(a*1.02)*rad*1.025,(y0+y1)/2,Math.sin(a*1.02)*rad*1.025],[Math.cos(a)*rad,y1,Math.sin(a)*rad]],thick,mat); 
 const tankTexture=labelMat;
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
   const shellMat=xenon?M(0x708b9c,.7,.24):isRcs?M(0xc5c8c3,.48,.48):mk2||mk3?M(0xc4c9c7,.5,.5):ivory;
   lathe(profile,shellMat,96);
   const rimR=rad*(rock?1.005:.99);
   for(const y of [-h*.44,h*.44]){band(rimR,y,.035,steel);band(rimR*.97,y+(y<0?.035:-.035),.018,aluminium);}
   if(rock){band(r*1.01,-h*.34,.032,orange);band(r*1.01,h*.34,.032,orange);for(let i=0;i<12;i++){const a=i*Math.PI/6;radialPipe(r*.99,-h*.31,h*.31,a,steel,.022);}radialLabel(r*1.004,0,r*.72,h*.2,labelMat);}
   else if(kerb){for(let y of [-h*.34,h*.34])band(r*.99,y,.026,gold);for(let i=0;i<16;i++){const a=i*Math.PI/8;radialPipe(r*.99,-h*.36,h*.36,a,aluminium,.012);}radialLabel(r*1.002,0,r*.72,h*.16,labelMat);}
   else if(xenon){for(let y of [-h*.34,h*.34])band(r*.99,y,.026,gold);radialLabel(r*1.003,0,r*.68,h*.2,M(0xffffff,.25,.5,{map:makeLabel('#648ba0','XENON STORAGE',id).map}));}
   else if(isRcs){for(let y of [-h*.3,h*.3])band(r*.99,y,.028,orange);radialLabel(r*1.004,0,r*.65,h*.22,labelMat);}
   else if(oscar){band(r*1.01,-h*.32,.025,dark);band(r*1.01,h*.32,.025,gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;bolt(Math.cos(a)*r*.96,0,Math.sin(a)*r*.96,.025,gold);}}
   else if(mk2||mk3||mk0){for(let y of [-h*.35,h*.35])band(r*.99,y,.035,dark);for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(r*.98,-h*.36,h*.36,a,steel,.024);}radialLabel(r*1.002,0,r*.72,h*.18,labelMat);}
   else{for(let y of [-h*.36,h*.36])band(r*.99,y,.026,dark);band(r*.99,-h*.27,.018,gold);band(r*.99,h*.27,.018,gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.98,-h*.32,h*.32,a,aluminium,.012);}radialLabel(r*1.002,0,r*.66,h*.22,labelMat);}
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
   lathe([[0,-h*.12],[bodyR*.78,-h*.12],[bodyR,-h*.05],[bodyR,h*.28],[bodyR*.88,h*.38],[bodyR*.62,h*.4],[0,h*.4]],nuclear?M(0x6f7777,.65,.42):ivory,64);
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
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const x=Math.cos(a)*bodyR*.75,z=Math.sin(a)*bodyR*.75;tube([[x,h*.2,z],[x*1.1,h*.02,z*1.1],[x*.92,-h*.12,z*.92]],.025,aluminium);}
  }
 };
 const makePod=()=>{
  const inline=id.includes('inline'),lander=id.includes('lander'),cupola=id.includes('cupola'),mk2=id.includes('mk2'),mk3=id.includes('mk3'),mk13=id.includes('mk13'),seat=id==='seat',aircraft=id.includes('aircraft');
  if(seat){lathe([[0,-h*.22],[r*.58,-h*.22],[r*.7,-h*.1],[r*.7,h*.12],[r*.58,h*.22],[0,h*.22]],steel,32);const back=box(r*1.25,h*.82,.12,ivory,[0,h*.5,-r*.28]);back.rotation.x=-.14;for(let x of [-1,1])tube([[x*r*.38,h*.55,-r*.2],[x*r*.32,h*.2,r*.35],[x*r*.22,-h*.12,r*.3]],.035,gold);return;}
  const rr=mk3?r*.78:mk2||mk13?r*.84:r*.7;
  if(lander){lathe([[0,-h*.5],[rr*.75,-h*.5],[rr,-h*.38],[rr,h*.12],[rr*.86,h*.24],[rr*.62,h*.43],[0,h*.48]],M(0xc5c6bd,.4,.5),72);band(rr,h*.1,.05,gold);}
  else if(cupola){lathe([[0,-h*.5],[rr*.7,-h*.5],[rr,-h*.36],[rr,h*.12],[rr*.95,h*.25],[rr*.8,h*.42],[rr*.52,h*.5],[0,h*.5]],ivory,72);sphere(rr*.98,ivory,[0,h*.38,0],[1,.45,1]);}
  else if(aircraft){lathe([[0,-h*.5],[rr*.8,-h*.5],[rr,-h*.4],[rr*.95,h*.2],[rr*.72,h*.42],[rr*.5,h*.5],[0,h*.5]],ivory,64);const canopy=add(new THREE.SphereGeometry(rr*.68,32,20,0,Math.PI*2,0,Math.PI/2),glass,[0,h*.36,0]);canopy.scale.set(1,.85,1);}
  else{lathe([[0,-h*.5],[rr*.76,-h*.5],[rr*.96,-h*.38],[rr,h*.14],[rr*.88,h*.3],[rr*.58,h*.47],[0,h*.5]],ivory,72);lathe([[0,h*.25],[rr*.86,h*.25],[rr*.78,h*.34],[rr*.48,h*.47],[0,h*.5]],paint,64);}
  band(rr*.98,-h*.38,.04,steel);band(rr*.98,h*.23,.045,gold);
  // Distinctive forward-facing portholes with raised bezels and deep blue glass.
  const windows=cupola?8:mk13?5:mk2?4:3;
  for(let i=0;i<windows;i++){
   const a=(i-(windows-1)/2)*.46,ang=a+(inline?Math.PI/2:0),x=Math.sin(ang)*rr*.73,z=Math.cos(ang)*rr*.73,y=h*(aircraft?.37:.06);
   const bezel=sphere(rr*.205,steel,[x,y,z],[1,.82,.2]);sphere(rr*.16,glass,[x,y,z+rr*.035],[1,.78,.2]); 
   const glint=add(new THREE.SphereGeometry(rr*.045,12,8),M(0x9ec7d8,.2,.18,{emissive:0x18394a,emissiveIntensity:.3}),[x-rr*.045,y+rr*.035,z+rr*.07],[0,0,0],[1,.55,.18]);
  }
  if(!cupola&&!aircraft){for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(rr*1.02,-h*.24,h*.06,a,steel,.035);}}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;bolt(rr*.98*Math.cos(a),-h*.38,rr*.98*Math.sin(a),.018,gold);}
  if(lander){cyl(rr*.86,rr*.95,.12,dark,-h*.48);for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*rr*1.38,z=Math.sin(a)*rr*1.38;tube([[Math.cos(a)*rr*.8,-h*.3,Math.sin(a)*rr*.8],[x,-h*.1,z],[x,-h*.45,z]],.045,aluminium);}}
  else if(cupola){for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=Math.cos(a)*rr*.9,z=Math.sin(a)*rr*.9;radialPipe(rr*.9,h*.16,h*.38,a,steel,.025);}}
  else{cyl(rr*.75,rr*.82,.1,steel,-h*.49);band(rr*.82,-h*.47,.045,orange);}
  const hatch=add(new THREE.TorusGeometry(rr*.18,.035,8,32),gold,[0,-h*.2,rr*.96]);hatch.rotation.y=0;
 };
 const makeProbe=()=>{
  const oct=id.includes('okto')||id.includes('hecs'),flat=id.includes('stayputnik'),qbe=id.includes('qbe'),rover=id.includes('rovemate'),rcl=id.includes('rcl');
  if(flat){lathe([[0,-h*.18],[r*.78,-h*.18],[r*.95,-h*.08],[r*.95,h*.08],[r*.78,h*.18],[0,h*.18]],ivory,48);band(r*.94,h*.12,.04,gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;radialPipe(r*.9,-h*.12,h*.12,a,steel,.025);}}
  else if(oct||qbe||rover){const n=oct?8:4,shape=new THREE.CylinderGeometry(r*.92,r*.92,h*.75,n,1,false);add(shape,oct?M(0xb8b9b0,.42,.55):ivory,[0,0,0]);band(r*.9,h*.38,.045,gold);band(r*.9,-h*.38,.045,steel);for(let i=0;i<n;i++){const a=i*Math.PI*2/n;const x=Math.cos(a)*r*.66,z=Math.sin(a)*r*.66;bolt(x,h*.28,z,.035,gold);}}
  else{lathe([[0,-h*.5],[r*.78,-h*.5],[r,h*.36],[r*.78,h*.5],[0,h*.5]],ivory,8);band(r*.98,h*.38,.04,gold);}
  const domeR=r*.26;sphere(domeR,gold,[0,h*.46,0]);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;radialPipe(r*.62,h*.2,h*.72,a,aluminium,.025);}
  if(rcl){for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*1.25,z=Math.sin(a)*r*1.25;box(r*.48,.055,r*.36,blue,[x,h*.12,z]);}}
  if(rover){for(let i=0;i<4;i++){const x=i%2?1:-1,z=i<2?1:-1;const leg=box(.08,h*.65,.08,steel,[x*r*.78,-h*.4,z*r*.78]);leg.rotation.z=x*.3;}}
  radialLabel(r*.94,0,r*.65,h*.2,labelMat);
 };
 const makeWing=()=>{
  const vertical=type==='tail'||id.includes('rudder')||id.includes('winglet'),delta=id.includes('delta'),swept=id.includes('swept')||id.includes('strake'),small=id.includes('small')||id.includes('struct-d');
  const span=r*(small?.82:1.15),chord=vertical?h*.85:h*1.15,root=chord*(delta?1.5:1),tip=chord*(delta?.2:swept?.48:.62);
  const shape=new THREE.Shape();shape.moveTo(-root*.5,0);shape.lineTo(root*.5,0);shape.lineTo(span,tip*.5);shape.lineTo(span*.86,-tip*.5);shape.lineTo(-root*.5,-root*.5);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.09,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:8});
  const wing=add(geo,M(0xb6bfbd,.55,.42),[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  if(vertical)wing.position.y=h*.12;
  const leading=add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-root*.5,0,.04),new THREE.Vector3(span*.5,tip*.2,.04),new THREE.Vector3(span,0,.04)]),32,.025,8,false),steel,[0,0,0],vertical?[0,0,0]:[-Math.PI/2,0,0]);
  for(let i=0;i<4;i++){const x=span*(.15+i*.16);const line=box(.018,.015,.075,gold,[x,.1,.02]);if(!vertical)line.rotation.x=-Math.PI/2;}
  if(type==='control'||id.includes('elevon')||id.includes('rudder')){const hinge=box(span*.52,.055,.12,dark,[span*.43,.04,.1]);if(!vertical)hinge.rotation.x=-Math.PI/2;for(let i=0;i<5;i++)bolt(span*(.2+i*.12),.09,.16,.018);}
 };
 const makeSolar=()=>{
  const large=id.includes('xl')||id.includes('sp10')||id.includes('gigantor'),fixed=id.includes('ox-stat'),count=id.includes('ox4')?2:large?4:2,w=large?1.45:fixed?.92:1.05;
  cyl(.16,.2,.32,aluminium,h*.18,24);band(.18,h*.18,.035,gold);
  for(let side of [-1,1]){
   const x=side*(w*.65);const panelMat=M(0x173d65,.62,.28,{emissive:0x071a28,emissiveIntensity:.12});
   const panel=box(w,.045,large?1.35:1.0,panelMat,[x,h*.18,0]);
   for(let i=0;i<8;i++)box(.012,.012,large?1.3:.95,M(0x8db8d1,.48,.32),[x-w*.5+w*(i+1)/9,h*.208,0]);
   for(let j=0;j<6;j++)box(w*.96,.012,.012,M(0x8db8d1,.45,.34),[x,h*.21,-.45+j*.18]);
   for(let z of [-.52,.52])box(w*.98,.035,.025,aluminium,[x,h*.23,z]);
   const hinge=add(new THREE.CylinderGeometry(.055,.055,w*.16,16),gold,[side*w*.13,h*.18,0],[0,0,Math.PI/2]);
  }
  if(fixed){const frame=box(.08,.07,1.1,steel,[0,h*.18,0]);}
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
  radialLabel(rad*1.01,0,rad*.7,h*.24,labelMat);
 };
 const makeScience=()=>{
  const nm=name.toLowerCase();
  if(/goo|グー/.test(nm)){lathe([[0,-h*.35],[r*.68,-h*.35],[r*.78,-h*.2],[r*.78,h*.24],[r*.55,h*.38],[0,h*.38]],ivory,48);sphere(r*.42,M(0x879b75,.08,.24),[0,h*.35,0],[1,.8,1]);band(r*.78,-h*.2,.035,gold);}
  else if(/thermo|barometer|温度計|気圧計/.test(nm)){lathe([[0,-h*.4],[r*.6,-h*.4],[r*.72,-h*.3],[r*.72,h*.25],[r*.55,h*.4],[0,h*.4]],steel,40);sphere(r*.22,orange,[0,h*.52,0]);for(let i=0;i<5;i++)box(r*.55,.018,.018,ivory,[0,h*(.1+i*.07),r*.7]);}
  else if(/scan|スキャン|gravioli|加速度|地震/.test(nm)){lathe([[0,-h*.35],[r*.7,-h*.35],[r*.85,-h*.2],[r*.85,h*.22],[r*.7,h*.35],[0,h*.35]],ivory,40);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;tube([[Math.cos(a)*r*.55,h*.15,Math.sin(a)*r*.55],[Math.cos(a)*r*.95,h*.6,Math.sin(a)*r*.95],[Math.cos(a)*r*.75,h*.82,Math.sin(a)*r*.75]],.035,aluminium);}sphere(r*.16,gold,[0,h*.82,0]);}
  else if(/telescope|望遠鏡/.test(nm)){lathe([[0,-h*.35],[r*.34,-h*.35],[r*.4,-h*.2],[r*.3,h*.65],[r*.42,h*.8],[r*.28,h*.9],[0,h*.9]],steel,40);band(r*.4,h*.7,.04,gold);sphere(r*.26,glass,[0,h*.9,0],[1,.3,1]);}
  else{lathe([[0,-h*.45],[r*.72,-h*.45],[r*.85,-h*.3],[r*.85,h*.35],[r*.7,h*.45],[0,h*.45]],ivory,48);band(r*.85,h*.32,.035,gold);for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*.58,z=Math.sin(a)*r*.58;box(r*.18,h*.62,.08,steel,[x,h*.15,z]);}radialLabel(r*.86,0,r*.68,h*.22,labelMat);}
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
 const makeGear=()=>{
  const large=id.includes('large'),legR=large?.09:.06,spread=r*.72;
  lathe([[0,-h*.42],[r*.42,-h*.42],[r*.52,-h*.25],[r*.42,h*.38],[r*.3,h*.44],[0,h*.44]],steel,32);
  for(let side of [-1,1]){const x=side*spread; tube([[side*r*.25,h*.2,0],[x,h*.02,0],[side*r*.9,-h*.35,0]],legR,aluminium);tube([[side*r*.2,h*.12,0],[x*1.25,-h*.18,0],[x*1.25,-h*.43,0]],legR*.55,gold);const foot=box(large?.42:.28,.08,.22,rubber,[side*r*.9,-h*.4,0]);foot.rotation.z=side*.08;}
  band(r*.5,h*.34,.04,gold);
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
  else{lathe([[0,-h*.5],[r*.8,-h*.5],[r,-h*.38],[r,h*.38],[r*.8,h*.5],[0,h*.5]],ivory,64);for(let y of [-h*.4,h*.4])band(r,y,.035,gold);radialLabel(r*1.01,0,r*.72,h*.22,labelMat);}
 };
 const makeThermal=()=>{
  lathe([[0,-h*.5],[r*.72,-h*.5],[r,-h*.34],[r*.94,h*.25],[r*.7,h*.5],[0,h*.5]],M(0x62534a,.22,.92),64);
  band(r*.96,h*.28,.06,gold);for(let i=0;i<16;i++){const a=i*Math.PI/8;radialPipe(r*.95,-h*.28,h*.24,a,steel,.025);}
 };
 const makeUtility=()=>{
  if(/launch escape|脱出システム/i.test(name)){for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=Math.cos(a)*r*.58,z=Math.sin(a)*r*.58;tube([[x,-h*.35,z],[x*1.15,h*.25,z*1.15],[x*.9,h*.5,z*.9]],.045,aluminium);}lathe([[0,h*.25],[r*.28,h*.25],[r*.36,h*.5],[r*.2,h*.92],[0,h]],orange,32);}
  else if(/light|illuminator|照明|ライト/i.test(name)){cyl(r*.38,r*.45,h*.4,steel);band(r*.62,h*.2,.06,gold);sphere(r*.5,glass,[0,h*.3,0],[1,.35,1]);}
  else if(/drill|採掘/.test(name)){lathe([[0,-h*.5],[r*.65,-h*.5],[r*.7,h*.1],[r*.38,h*.35],[r*.12,h*.5],[0,h*.5]],aluminium,40);for(let i=0;i<4;i++){const a=i*Math.PI/2;radialPipe(r*.7,-h*.3,h*.28,a,gold,.035);}}
  else{lathe([[0,-h*.5],[r*.75,-h*.5],[r*.85,-h*.3],[r*.85,h*.35],[r*.7,h*.5],[0,h*.5]],ivory,40);band(r*.84,h*.32,.04,gold);radialLabel(r*.86,0,r*.7,h*.2,labelMat);}
 };
 // Select a dedicated construction family; no one-size-fits-all primitive stand-in.
 if(type==='tank'||type==='resource')makeTank();
 else if(type==='engine'||type==='jet'||type==='booster')makeEngine();
 else if(type==='pod'||type==='cockpit')makePod();
 else if(type==='probe')makeProbe();
 else if(type==='fin'||type==='wing'||type==='tail'||type==='control')makeWing();
 else if(type==='solar')makeSolar();
 else if(type==='chute')makeParachute();
 else if(type==='battery')makeBattery();
 else if(type==='science')makeScience();
 else if(type==='decoupler'||type==='structural')makeDecoupler();
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
  lathe([[0,-h*.5],[r*.72,-h*.5],[r*.9,-h*.35],[r*.9,h*.35],[r*.72,h*.5],[0,h*.5]],ivory,48);band(r*.9,h*.36,.035,gold);radialLabel(r*.91,0,r*.7,h*.2,labelMat);
 }
 // Functional visual hooks used by the flight simulation.
 if(type==='engine'||type==='jet'||type==='booster'){
  const plume=add(new THREE.ConeGeometry(r*.38,.9,24),new THREE.MeshBasicMaterial({color:0xffa34d,transparent:true,opacity:.82,depthWrite:false}),[0,-h*.62,0],[Math.PI,0,0]);plume.name='engine-flame';plume.visible=false;
 }
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 return g;
}
