import * as THREE from 'three';
import {createPartModel} from './parts-models.js?v=20261122-5-part-family-models';
import {additionalParts} from './parts-inventory.js?v=20261122-7-twinboar-caveat';
import {BODY,G0,gravityAcceleration,atmosphericDensity,orbitalElements,rk4Step,deltaV,rocketMassKg} from './physics/orbital.js';
import {aerodynamicAcceleration} from './physics/aerodynamics.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],toast=m=>{let t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)};
const scene=new THREE.Scene();
const crewStage=new THREE.Group();crewStage.visible=false;scene.add(crewStage);
function makeCrewFigure(member,index){
 const root=new THREE.Group(),role=member.role||'科学者',pilot=role==='パイロット',engineer=role==='エンジニア';
 const skin=material(0xc9dc4b,.05),eyeWhite=material(0xf6f7e9,.02),suit=material(pilot?0xd8ddd9:engineer?0x102e59:0x65747d,.25),trim=material(pilot?0x8b9698:engineer?0x4775a6:0xb8c2c5,.3),boot=material(0x202a32,.45);
 const faceStyles=[
  {pupil:0x17232c,brow:0x53652c,eyeGap:.31,mouth:0x637d2d,freckles:false},
  {pupil:0x263d70,brow:0x45552a,eyeGap:.34,mouth:0x8a593d,freckles:true},
  {pupil:0x382b20,brow:0x66502b,eyeGap:.28,mouth:0x526b38,freckles:false},
  {pupil:0x174c43,brow:0x53652c,eyeGap:.32,mouth:0x795044,freckles:true},
  {pupil:0x49345f,brow:0x62502a,eyeGap:.29,mouth:0x637d2d,freckles:false},
  {pupil:0x26313b,brow:0x76502c,eyeGap:.35,mouth:0x8a593d,freckles:true}
 ];
 const face=faceStyles[Math.abs(index)%faceStyles.length],pupil=material(face.pupil,.02),browMat=material(face.brow,.12),mouthMat=material(face.mouth,.05);
 const sphere=(r,mat,x,y,z,scale=null)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,18,14),mat);m.position.set(x,y,z);if(scale)m.scale.set(...scale);root.add(m);m.castShadow=true;return m;};
 const limb=(a,b,r1,r2,mat)=>{const v=new THREE.Vector3().subVectors(b,a),m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,v.length(),12),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());root.add(m);m.castShadow=true;return m;};
 // 全員共通の体格・頭部サイズ
 for(const x of [-.43,.43]){limb(new THREE.Vector3(x,.65,0),new THREE.Vector3(x,.18,0),.19,.15,suit);sphere(.2,boot,x,.13,.08,[1,.55,1.35]);}
 const torso=new THREE.Mesh(new THREE.CylinderGeometry(.62,.48,1.25,18),suit);torso.position.y=1.48;root.add(torso);torso.castShadow=true;
 sphere(.57,trim,0,2.02,0,[1,.34,.82]);
 for(const x of [-.72,.72]){sphere(.24,suit,x,1.88,0);limb(new THREE.Vector3(x,1.9,0),new THREE.Vector3(x*1.18,1.12,.12),.17,.13,suit);sphere(.16,trim,x*1.18,1.1,.13);}
 const pack=new THREE.Mesh(new THREE.BoxGeometry(.62,.95,.35),trim);pack.position.set(0,1.62,-.48);root.add(pack);
 const chest=new THREE.Mesh(new THREE.BoxGeometry(.45,.34,.07),material(engineer?0xb8c9d9:0x3b6476,.45));chest.position.set(0,1.63,.53);root.add(chest);
 if(engineer){const patch=new THREE.Mesh(new THREE.CircleGeometry(.16,20),material(0xb83232,.1));patch.position.set(.28,1.95,.51);root.add(patch);}
 // 全員同じ大きさの縦長・丸角四角フェイス
 const faceShape=new THREE.Shape();
 // 縦長の四角形をベースに、角だけを少し丸めた顔
 faceShape.moveTo(-.49,-.69);faceShape.lineTo(.49,-.69);faceShape.quadraticCurveTo(.62,-.69,.62,-.56);
 faceShape.lineTo(.62,.56);faceShape.quadraticCurveTo(.62,.69,.49,.69);faceShape.lineTo(-.49,.69);
 faceShape.quadraticCurveTo(-.62,.69,-.62,.56);faceShape.lineTo(-.62,-.56);faceShape.quadraticCurveTo(-.62,-.69,-.49,-.69);
 // 円柱と縦長四角柱の中間になるよう、丸みのある角丸四角柱を顔の輪郭にする
 const faceGeo=new THREE.ExtrudeGeometry(faceShape,{depth:.48,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.11,bevelThickness:.09,curveSegments:12});
 faceGeo.computeVertexNormals();
 // 顔の奥に縦向き円柱を重ね、側面に円柱らしい丸みを加える
 const faceCore=new THREE.Mesh(new THREE.CylinderGeometry(.615,.615,1.38,32,1,false),skin);
 faceCore.position.set(0,3.05,-.55);root.add(faceCore);faceCore.castShadow=true;
 const head=new THREE.Mesh(faceGeo,skin);head.position.set(0,3.05,-.27);root.add(head);head.castShadow=true;
 // 髪は頭頂部に薄く乗せ、前髪や分け目だけを乗組員ごとに変える
 const hairStyles=[
  {color:0x3b281b,kind:0},{color:0x17191d,kind:1},{color:0x8a5526,kind:2},
  {color:0x4b3025,kind:3},{color:0xb9a15d,kind:4},{color:0x6d777b,kind:5},
  {color:0x202c45,kind:6},{color:0x9b4c32,kind:7}
 ];
 const hs=hairStyles[Math.abs(index)%hairStyles.length],hairMat=material(hs.color,.08);
 sphere(.59,hairMat,0,3.72,-.005,[1,.16,.82]);
 if(hs.kind===0||hs.kind===3){sphere(.34,hairMat,-.2,3.69,.34,[1.25,.12,.42]);}
 if(hs.kind===1||hs.kind===6){sphere(.38,hairMat,.18,3.7,.34,[1.1,.11,.4]);}
 if(hs.kind===2||hs.kind===4){for(let j=-1;j<=1;j++)sphere(.17,hairMat,j*.24,3.7,.34,[1,.12,.42]);}
 if(hs.kind===5){sphere(.42,hairMat,0,3.74,-.12,[1.05,.14,.7]);}
 if(hs.kind===7){sphere(.3,hairMat,.27,3.7,.3,[1.2,.12,.4]);}
 for(const x of [-face.eyeGap,face.eyeGap]){
  sphere(.295,eyeWhite,x,3.12,.32,[.84,1.14,.58]);
  sphere(.14,pupil,x+.025,3.1,.455,[.92,1.1,.58]);
  sphere(.039,material(0xffffff,.02),x+.045,3.16,.49);
  const brow=new THREE.Mesh(new THREE.BoxGeometry(.29,.055,.07),browMat);brow.position.set(x,3.43,.39);brow.rotation.z=x<0?.12:-.12;root.add(brow);
 }
 // 顔の中央に縦向きの小さな円柱パーツ（鼻）
 const nose=new THREE.Mesh(new THREE.CylinderGeometry(.082,.092,.32,12),skin);
 nose.position.set(0,3.0,.52);root.add(nose);nose.castShadow=true;
 const smile=new THREE.Mesh(new THREE.TorusGeometry(.15,.023,6,16,Math.PI),mouthMat);smile.position.set(0,2.82,.42);smile.rotation.z=Math.PI;root.add(smile);
 if(face.freckles){for(const x of [-.43,.43])for(const y of [2.98,3.04])sphere(.022,mouthMat,x,y,.37);}
 root.scale.setScalar(.88);
 root.position.set(0,1.5,0);
 return root;
}
function rebuildCrewStage(){while(crewStage.children.length)crewStage.remove(crewStage.children[0]);}
scene.background=new THREE.Color(0x8298a6);scene.fog=new THREE.Fog(0x8298a6,180,600);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.0001,20000);camera.position.set(24,18,34);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);
function renderCrewPortraits(){
 const canvases=$$('.crew-avatar');if(!canvases.length)return;
 const target=new THREE.WebGLRenderTarget(96,128,{depthBuffer:true,stencilBuffer:false});
 const portraitScene=new THREE.Scene();portraitScene.background=new THREE.Color(0x52616a);
 portraitScene.add(new THREE.HemisphereLight(0xeaf4ff,0x45505a,2.0));
 const key=new THREE.DirectionalLight(0xffffff,2.5);key.position.set(-3,6,7);portraitScene.add(key);
 const fill=new THREE.DirectionalLight(0xb9d8ff,1.0);fill.position.set(4,2,3);portraitScene.add(fill);
 const portraitCamera=new THREE.OrthographicCamera(-1.62,1.62,4.15,-.15,.1,30);
 portraitCamera.position.set(0,2,9);portraitCamera.lookAt(0,1.58,0);
 for(const canvas of canvases){
  const member=crewMembers[Number(canvas.dataset.crewIndex)];if(!member)continue;
  const figure=makeCrewFigure(member,Number(canvas.dataset.crewIndex)||0);portraitScene.add(figure);
  renderer.setRenderTarget(target);renderer.clear();renderer.render(portraitScene,portraitCamera);
  const pixels=new Uint8Array(96*128*4);renderer.readRenderTargetPixels(target,0,0,96,128,pixels);
  const ctx=canvas.getContext('2d'),img=ctx.createImageData(96,128);
  for(let y=0;y<128;y++)for(let x=0;x<96;x++){const src=((127-y)*96+x)*4,dst=(y*96+x)*4;img.data[dst]=pixels[src];img.data[dst+1]=pixels[src+1];img.data[dst+2]=pixels[src+2];img.data[dst+3]=pixels[src+3];}
  ctx.putImageData(img,0,0);portraitScene.remove(figure);
 }
 renderer.setRenderTarget(null);target.dispose();
}
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('#viewport').appendChild(renderer.domElement);
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;toast('3D表示を一時停止しました。復旧を待っています…');});renderer.domElement.addEventListener('webglcontextrestored',()=>{paused=false;last=performance.now();toast('3D表示が復旧しました');});
document.addEventListener('visibilitychange',()=>{last=performance.now();});
scene.add(new THREE.HemisphereLight(0xd8e8ff,0x665344,1.8));const sun=new THREE.DirectionalLight(0xffedcf,3.1);sun.position.set(-35,70,25);sun.castShadow=true;scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshStandardMaterial({color:0x7e8d73,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.001;ground.receiveShadow=true;scene.add(ground);
const planetGeo=new THREE.SphereGeometry(BODY.radius,160,112),planetPos=planetGeo.attributes.position,planetColors=new Float32Array(planetPos.count*3),ocean=new THREE.Color(0x245b82),shallow=new THREE.Color(0x4d8fa0),landLow=new THREE.Color(0x547b49),landHigh=new THREE.Color(0x9a8c6b);for(let i=0;i<planetPos.count;i++){const x=planetPos.getX(i)/BODY.radius,y=planetPos.getY(i)/BODY.radius,z=planetPos.getZ(i)/BODY.radius,n=Math.sin(x*13+Math.sin(z*9)*1.7)*.38+Math.cos(y*17-z*7)*.27+Math.sin(z*23+x*5)*.18+Math.cos(y*31+x*19)*.12;let color;if(n<-.12)color=ocean.clone().lerp(shallow,THREE.MathUtils.clamp((n+.55)/.43,0,1));else{const elevation=THREE.MathUtils.clamp((n-.12)/.48,0,1);color=landLow.clone().lerp(landHigh,elevation);}planetColors[i*3]=color.r;planetColors[i*3+1]=color.g;planetColors[i*3+2]=color.b;}planetGeo.setAttribute('color',new THREE.BufferAttribute(planetColors,3));const planet=new THREE.Mesh(planetGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92}));planet.position.set(0,-BODY.radius,0);planet.visible=true;planet.receiveShadow=true;scene.add(planet);const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(BODY.radius+3,96,64),new THREE.MeshBasicMaterial({color:0x5ba8d5,transparent:true,opacity:.075,side:THREE.BackSide,depthWrite:false}));atmosphere.position.copy(planet.position);scene.add(atmosphere);

// 宇宙センターの3D施設群（独自モデル）
const campus=new THREE.Group();campus.scale.setScalar(.001);scene.add(campus);
function campusBuilding(x,z,w,h,d,color,roof=0x68747a){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.82}));b.position.y=h/2;b.castShadow=true;b.receiveShadow=true;g.add(b);const r=new THREE.Mesh(new THREE.BoxGeometry(w*1.04,.45,d*1.04),new THREE.MeshStandardMaterial({color:roof,roughness:.72}));r.position.y=h+.2;g.add(r);for(let i=0;i<Math.max(2,Math.floor(w/3));i++){const win=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.3,.06),new THREE.MeshStandardMaterial({color:0x9dc4ca,metalness:.25,roughness:.2,emissive:0x182c35}));win.position.set(-w/2+1.5+i*(w-3)/Math.max(1,Math.floor(w/3)-1),h*.55,d/2+.04);g.add(win);}g.position.set(x,0,z);campus.add(g);return g;}
campusBuilding(-28,8,22,8,16,0xb8b8aa,0x555e64);
campusBuilding(26,14,28,11,20,0x9faeb1,0x4c5962);
campusBuilding(0,-35,16,6,10,0xc3c4b8,0x59656a);
campusBuilding(-54,-16,10,24,10,0xb8c0bc,0x4c5962);
const towerA=new THREE.Mesh(new THREE.CylinderGeometry(2.5,3.5,24,12),new THREE.MeshStandardMaterial({color:0xb9bcb7,roughness:.8}));towerA.position.set(-54,12,-16);campus.add(towerA);
const towerTop=new THREE.Mesh(new THREE.CylinderGeometry(4,3,4,12),new THREE.MeshStandardMaterial({color:0x657b84,metalness:.2}));towerTop.position.set(-54,26,-16);campus.add(towerTop);
const pad=new THREE.Mesh(new THREE.CylinderGeometry(15,17,.65,48),new THREE.MeshStandardMaterial({color:0x777d7d,roughness:.95}));pad.position.set(0,.1,0);pad.receiveShadow=true;campus.add(pad);
const runway=new THREE.Mesh(new THREE.BoxGeometry(16,.16,180),new THREE.MeshStandardMaterial({color:0x414b50,roughness:.95}));runway.position.set(72,.03,5);campus.add(runway);
for(let i=0;i<18;i++){const x=-82+(i%9)*20,z=-65+Math.floor(i/9)*145;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2.5,7),new THREE.MeshStandardMaterial({color:0x69503b}));trunk.position.set(x,1.25,z);campus.add(trunk);const crown=new THREE.Mesh(new THREE.ConeGeometry(1.7,4.5,8),new THREE.MeshStandardMaterial({color:0x355b48}));crown.position.set(x,4.3,z);campus.add(crown);}

// 独自デザインの低ポリ宇宙飛行士。組立棟と発射場に配置。
function makeCrew(){const g=new THREE.Group(),suit=new THREE.MeshStandardMaterial({color:0xd8d6c8,roughness:.75}),visor=new THREE.MeshStandardMaterial({color:0x263e4c,metalness:.55,roughness:.2}),skin=new THREE.MeshStandardMaterial({color:0x83a66b,roughness:.85});const body=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.55,4,8),suit);body.position.y=.85;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.29,12,10),skin);head.position.y=1.48;g.add(head);const helmet=new THREE.Mesh(new THREE.TorusGeometry(.3,.055,6,16),suit);helmet.position.y=1.48;g.add(helmet);const glass=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8,0,Math.PI*2,0,Math.PI/2),visor);glass.position.set(0,1.49,.17);g.add(glass);for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,.55,7),suit);arm.position.set(side*.38,.9,0);arm.rotation.z=side*.2;g.add(arm);const leg=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.55,7),suit);leg.position.set(side*.16,.28,0);g.add(leg);}g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
const crew=makeCrew();crew.position.set(4,0,7);campus.add(crew);

// 大型格納庫：鉄骨トラス、格子床、黄色い格納扉、照明、作業足場を独自モデルで構成
const hangar=new THREE.Group();hangar.scale.setScalar(.001);scene.add(hangar);
const hangarMat=(color,metalness=.45,roughness=.72)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const steel=hangarMat(0x46525a,.78),steelLight=hangarMat(0x899398,.72),darkSteel=hangarMat(0x202a30,.55),yellow=hangarMat(0xb18a35,.55),floorMat=hangarMat(0x62696b,.2,.92);
function hBox(w,h,d,x,y,z,mat,parent=hangar){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function hBeam(a,b,r=.42,mat=steel){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=vb.clone().sub(va),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),6),mat);m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;hangar.add(m);}
hBox(230,.8,270,0,-.65,0,floorMat);
for(let x=-110;x<=110;x+=22)hBox(.45,.025,265,x,-.21,0,hangarMat(0x9b9b8d,.1,.95));
for(let z=-125;z<=125;z+=22)hBox(225,.025,.45,0,-.2,z,hangarMat(0x9b9b8d,.1,.95));
for(let x of [-105,-75,-45,45,75,105]){
 hBox(3,100,3,x,49,-95,steel);hBox(3,100,3,x,49,95,steel);
 hBeam([x,2,-95],[x,98,-95],.65,steelLight);hBeam([x,2,95],[x,98,95],.65,steelLight);
}
for(let y of [12,34,56,78,98]){
 hBeam([-112,y,-95],[112,y,-95],.85,steelLight);
 hBeam([-112,y,95],[112,y,95],.85,steelLight);
}
for(let x=-105;x<105;x+=21){
 hBeam([x,12,-95],[x+21,34,-95],.55,steel);hBeam([x+21,12,-95],[x,34,-95],.55,steel);
 hBeam([x,56,-95],[x+21,78,-95],.55,steel);hBeam([x+21,56,-95],[x,78,-95],.55,steel);
 hBeam([x,12,95],[x+21,34,95],.55,steel);hBeam([x+21,12,95],[x,34,95],.55,steel);
}
for(let x of [-95,-65,65,95]){hBox(5,88,5,x,44,0,darkSteel);for(let y=12;y<88;y+=18)hBox(12,1,10,x+(x<0?7:-7),y,0,steelLight);}
for(let x=-42;x<=42;x+=14){hBox(13,78,1.8,x,39,-94,yellow);for(let y=7;y<78;y+=14)hBox(12,.7,2,x,y,-92,darkSteel);}
hBox(190,4,5,0,88,-94,darkSteel);hBox(190,4,5,0,3,-94,yellow);
for(let z=-75;z<=75;z+=25){hBox(1.4,1.4,150,-112,1,z,steel);hBox(1.4,1.4,150,112,1,z,steel);}
for(let x of [-72,72]){for(let z of [-45,45]){hBox(2,18,2,x,9,z,darkSteel);hBox(10,1,4,x,18,z,steelLight);}}
for(let x of [-55,55])for(let z of [-30,30]){const lamp=new THREE.Mesh(new THREE.BoxGeometry(8,.8,3),new THREE.MeshBasicMaterial({color:0xffe4b5}));lamp.position.set(x,76,z);hangar.add(lamp);}
/* Aircraft workshop markings and the runway outside the hangar doors */
const runwayMat=hangarMat(0x343d42,.15,.95),runwayLine=hangarMat(0xe5dfc7,.05,.85),taxiYellow=hangarMat(0xd2a53c,.2,.8);
hBox(68,.18,300,0,-.12,-245,runwayMat);
hBox(2,.025,290,-34,-.015,-245,runwayLine);hBox(2,.025,290,34,-.015,-245,runwayLine);
for(let z=-115;z>-385;z-=22)hBox(1.3,.03,10,0,-.015,z,runwayLine);
hBox(74,.025,2,-1,-.015,-105,taxiYellow);hBox(74,.025,2,-1,-.015,-385,taxiYellow);
/* Yellow aircraft service bay outline on the hangar floor */
hBox(26,.035,1.1,0,-.19,-13,taxiYellow);hBox(26,.035,1.1,0,-.19,13,taxiYellow);
hBox(1.1,.035,26,-13,-.19,0,taxiYellow);hBox(1.1,.035,26,13,-.19,0,taxiYellow);


const rocket=new THREE.Group();rocket.scale.setScalar(.001);scene.add(rocket);const parts=[];let mode='center',gameMode='career',aircraftCraft=false,funds=25000,fundsUnlimited=true,science=0,stage=0,assemblyStage=0,stageUiFuelPercent=-1,throttle=0,flight=false,flightPeakAltitude=0,paused=false,sasEnabled=false,rcsEnabled=false,elapsed=0,craftMass=0,fuel=0,maxFuel=0,thrust=0,position=new THREE.Vector3(0,2,0),velocity=new THREE.Vector3(),attitude=new THREE.Quaternion(),angular=new THREE.Vector3(),last=performance.now(),map=false;
const catalog=[
{id:'pod',name:'Mk1 コマンドポッド',type:'pod',tech:'basic',mass:0.84,cost:600,crew:1,icon:'◉',height:2,radius:.9},
{id:'probe',name:'プローブコア',type:'probe',tech:'basic',mass:.1,cost:450,icon:'⌖',height:.7,radius:.65},
{id:'tank-s',name:'FL-T100 燃料タンク',type:'tank',tech:'basic',mass:.062,fuel:360,cost:275,icon:'▤',height:1.4,radius:.62},
{id:'tank-m',name:'FL-T400 燃料タンク',type:'tank',tech:'basic',mass:.25,fuel:1440,cost:700,icon:'▤',height:2.8,radius:.72},
{id:'tank-l',name:'X200-16 燃料タンク',type:'tank',tech:'heavy',mass:.45,fuel:2880,cost:1100,icon:'▤',height:3.5,radius:.9},
{id:'engine-s',name:'LV-909 液体エンジン',type:'engine',tech:'basic',mass:.5,cost:390,thrust:70,isp:320,icon:'◈',height:1.3,radius:.65},
{id:'engine-m',name:'LV-T45 エンジン',type:'engine',tech:'basic',mass:1.5,cost:1200,thrust:167,isp:320,icon:'◈',height:2,radius:.9},
{id:'engine-l',name:'Mainsail 大型エンジン',type:'engine',tech:'heavy',mass:6,cost:8500,thrust:1500,isp:310,icon:'◈',height:3,radius:1.5},
{id:'decoupler',name:'TD-12 デカプラー',type:'decoupler',tech:'basic',mass:.05,cost:400,icon:'⊖',height:.35,radius:.78},
{id:'booster',name:'固体燃料ブースター',type:'booster',tech:'basic',mass:1.5,cost:900,fuel:800,thrust:180,isp:220,icon:'▥',height:3.5,radius:.55},
{id:'fin',name:'空力フィン',type:'fin',tech:'basic',mass:.08,cost:120,icon:'△',height:.6,radius:.9},
{id:'chute',name:'Mk16 パラシュート',type:'chute',tech:'basic',mass:.1,cost:400,icon:'⌃',height:.6,radius:.8},
{id:'battery',name:'Z-100 バッテリー',type:'battery',tech:'flight',mass:.05,cost:80,icon:'▣',height:.35,radius:.5},
{id:'solar',name:'OX-STAT ソーラーパネル',type:'solar',tech:'flight',mass:.017,cost:75,icon:'▦',height:.3,radius:1},
{id:'science',name:'科学実験装置',type:'science',tech:'science',mass:.1,cost:450,icon:'⚗',height:.55,radius:.55},

{id:'pod-mk1-inline',name:'Mk1 インラインコックピット',type:'pod',mass:1.03,cost:1600,crew:1,icon:'◉',height:2.2,radius:.625},
{id:'pod-mk2',name:'Mk2 コックピット',type:'pod',mass:2.06,cost:3500,crew:2,icon:'◉',height:3.2,radius:1.25},
{id:'pod-mk3',name:'Mk3 コックピット',type:'pod',mass:3.9,cost:10000,crew:4,icon:'◉',height:4.5,radius:1.875},
{id:'pod-mk13',name:'Mk1-3 コマンドポッド',type:'pod',mass:2.72,cost:3800,crew:3,icon:'◉',height:2.4,radius:1.25},
{id:'pod-lander',name:'Mk1 ランダー缶',type:'pod',mass:.66,cost:1500,crew:1,icon:'◉',height:1.3,radius:.625},
{id:'pod-cupola',name:'PPD-12 キューポラ',type:'pod',mass:1.8,cost:3200,crew:1,icon:'◉',height:2.2,radius:1.25},
{id:'seat',name:'EAS-1 コマンドシート',type:'pod',mass:.05,cost:200,crew:1,icon:'◉',height:.5,radius:.3},
{id:'probe-qbe',name:'Probodobodyne QBE',type:'probe',mass:.07,cost:360,icon:'⌖',height:.5,radius:.5},
{id:'probe-okto',name:'Probodobodyne OKTO',type:'probe',mass:.1,cost:450,icon:'⌖',height:.55,radius:.5},
{id:'probe-okto2',name:'Probodobodyne OKTO2',type:'probe',mass:.04,cost:1480,icon:'⌖',height:.4,radius:.45},
{id:'probe-hecs',name:'Probodobodyne HECS',type:'probe',mass:.1,cost:650,icon:'⌖',height:.65,radius:.55},
{id:'probe-hecs2',name:'Probodobodyne HECS2',type:'probe',mass:.2,cost:7500,icon:'⌖',height:.8,radius:.625},
{id:'probe-rovemate',name:'Probodobodyne RoveMate',type:'probe',mass:.15,cost:800,icon:'⌖',height:.6,radius:.7},
{id:'probe-stayputnik',name:'Stayputnik',type:'probe',mass:.05,cost:300,icon:'⌖',height:.5,radius:.5},
{id:'probe-rcl01',name:'RC-L01 Remote Guidance Unit',type:'probe',mass:.5,cost:3400,icon:'⌖',height:1.1,radius:.625},
{id:'probe-rc001s',name:'RC-001S Remote Guidance Unit',type:'probe',mass:.1,cost:2250,icon:'⌖',height:.65,radius:.5},
{id:'tank-oscarb',name:'Oscar-B 燃料タンク',type:'tank',mass:.225,cost:70,fuel:40,icon:'▤',height:.65,radius:.32},
{id:'tank-r11',name:'R-11 Baguette 外部燃料タンク',type:'tank',mass:.3038,cost:50,fuel:54,icon:'▤',height:1.5,radius:.22},
{id:'tank-r12',name:'R-12 Donut 外部燃料タンク',type:'tank',mass:.3375,cost:147,fuel:60,icon:'▤',height:.8,radius:.4},
{id:'tank-r4',name:'R-4 Dumpling 外部燃料タンク',type:'tank',mass:.1238,cost:50,fuel:22,icon:'▤',height:.55,radius:.22},
{id:'tank-t200',name:'FL-T200 燃料タンク',type:'tank',mass:1.125,cost:275,fuel:200,icon:'▤',height:1.8,radius:.625},
{id:'tank-t800',name:'FL-T800 燃料タンク',type:'tank',mass:4.5,cost:800,fuel:800,icon:'▤',height:4.4,radius:.625},
{id:'tank-x2008',name:'Rockomax X200-8 燃料タンク',type:'tank',mass:4.5,cost:800,fuel:800,icon:'▤',height:1.8,radius:1.25},
{id:'tank-x20032',name:'Rockomax X200-32 燃料タンク',type:'tank',mass:18,cost:3000,fuel:3200,icon:'▤',height:5.5,radius:1.25},
{id:'tank-jumbo64',name:'Rockomax Jumbo-64 燃料タンク',type:'tank',mass:36,cost:5750,fuel:6400,icon:'▤',height:8,radius:1.25},
{id:'tank-s3-3600',name:'Kerbodyne S3-3600 タンク',type:'tank',mass:20.25,cost:3250,fuel:3600,icon:'▤',height:3.2,radius:1.875},
{id:'tank-s3-7200',name:'Kerbodyne S3-7200 タンク',type:'tank',mass:40.5,cost:6500,fuel:7200,icon:'▤',height:6.4,radius:1.875},
{id:'tank-s3-14400',name:'Kerbodyne S3-14400 タンク',type:'tank',mass:81,cost:13000,fuel:14400,icon:'▤',height:12.8,radius:1.875},
{id:'tank-mk0-lf',name:'Mk0 液体燃料タンク搭載ボディ',type:'tank',mass:.275,cost:200,fuel:50,icon:'▤',height:1.25,radius:.3125},
{id:'tank-mk1-lf',name:'Mk1 液体燃料タンク搭載ボディ',type:'tank',mass:2.25,cost:550,fuel:400,icon:'▤',height:2.5,radius:.625},
{id:'tank-mk2-lf',name:'Mk2 液体燃料タンク搭載ボディ',type:'tank',mass:4.57,cost:1450,fuel:800,icon:'▤',height:5,radius:1.25},
{id:'tank-mk3-lf',name:'Mk3 液体燃料タンク搭載ボディ',type:'tank',mass:28.57,cost:8600,fuel:5000,icon:'▤',height:7.5,radius:1.875},
{id:'rcs-flr10',name:'FL-R10 RCS燃料タンク',type:'tank',mass:.1,cost:200,fuel:20,icon:'▤',height:.5,radius:.35},
{id:'rcs-flr25',name:'FL-R25 RCS燃料タンク',type:'tank',mass:.56,cost:330,fuel:120,icon:'▤',height:1,radius:.625},
{id:'rcs-flr1',name:'FL-R1 RCS燃料タンク',type:'tank',mass:3.4,cost:1800,fuel:750,icon:'▤',height:2.2,radius:1.25},
{id:'xenon-pbx150',name:'PB-X150 キセノンコンテナ',type:'tank',mass:.096,cost:3680,fuel:720,icon:'▤',height:.8,radius:.4},
{id:'xenon-pbx50r',name:'PB-X50R キセノンコンテナ',type:'tank',mass:.054,cost:2220,fuel:405,icon:'▤',height:.65,radius:.3},
{id:'xenon-pbx750',name:'PB-X750 キセノンコンテナ',type:'tank',mass:.76,cost:24300,fuel:5700,icon:'▤',height:1.5,radius:.625},
{id:'engine-ant',name:'LV-1 Ant',type:'engine',mass:.02,cost:110,thrust:2,isp:315,icon:'◈',height:.45,radius:.25},
{id:'engine-spark',name:'48-7S Spark',type:'engine',mass:.1,cost:240,thrust:20,isp:320,icon:'◈',height:.7,radius:.3},
{id:'engine-reliant',name:'LV-T30 Reliant',type:'engine',mass:1.25,cost:1100,thrust:240,isp:310,icon:'◈',height:1.5,radius:.625},
{id:'engine-swivel',name:'LV-T45 Swivel',type:'engine',mass:1.5,cost:1200,thrust:215,isp:320,icon:'◈',height:1.6,radius:.625},
{id:'engine-dart',name:'T-1 Toroidal Aerospike Dart',type:'engine',mass:1,cost:3850,thrust:180,isp:340,icon:'◈',height:1.2,radius:.625},
{id:'engine-nerv',name:'LV-N Nerv 原子力ロケットモーター',type:'engine',mass:3,cost:10000,thrust:60,isp:800,icon:'◈',height:2,radius:.625},
{id:'engine-rapier',name:'CR-7 RAPIER',type:'engine',mass:2,cost:6000,thrust:180,isp:305,icon:'◈',height:2,radius:.625},
{id:'engine-vector',name:'S3 KS-25 Vector',type:'engine',mass:4,cost:18000,thrust:1000,isp:315,icon:'◈',height:2.8,radius:1.25},
{id:'engine-poodle',name:'RE-L10 Poodle',type:'engine',mass:1.75,cost:1300,thrust:250,isp:350,icon:'◈',height:1.8,radius:1.25},
{id:'engine-skipper',name:'RE-I5 Skipper',type:'engine',mass:3,cost:5300,thrust:650,isp:320,icon:'◈',height:2.2,radius:1.25},
{id:'engine-mainsail-stock',name:'RE-M3 Mainsail',type:'engine',mass:6,cost:13000,thrust:1500,isp:310,icon:'◈',height:2.8,radius:1.25},
{id:'engine-twinboar',name:'LFB KR-1x2 Twin-Boar',type:'engine',mass:42.5,cost:17000,thrust:2000,isp:300,icon:'◈',height:5,radius:1.875},
{id:'engine-rhino',name:'KR-2L+ Rhino',type:'engine',mass:9,cost:25000,thrust:2000,isp:340,icon:'◈',height:3.5,radius:1.875},
{id:'engine-mammoth',name:'S3 KS-25x4 Mammoth',type:'engine',mass:15,cost:39000,thrust:4000,isp:315,icon:'◈',height:4,radius:1.875},
{id:'engine-spider',name:'LV-1R Spider',type:'engine',mass:.02,cost:120,thrust:2,isp:290,icon:'◈',height:.4,radius:.25},
{id:'engine-twitch',name:'24-77 Twitch',type:'engine',mass:.09,cost:400,thrust:16,isp:290,icon:'◈',height:.6,radius:.3},
{id:'engine-thud',name:'Mk-55 Thud',type:'engine',mass:.9,cost:820,thrust:120,isp:305,icon:'◈',height:1,radius:.5},
{id:'engine-puff',name:'O-10 Puff',type:'engine',mass:.09,cost:150,thrust:20,isp:250,icon:'◈',height:.6,radius:.3},
{id:'tank-fuelcell',name:'燃料電池',type:'battery',mass:.05,cost:750,icon:'▣',height:.4,radius:.4},
{id:'solar-ox10c',name:'OX-10C 太陽電池パネル',type:'solar',mass:.09,cost:1200,icon:'▦',height:.5,radius:.7},
{id:'solar-ox4l',name:'OX-4L 1x6 太陽電池パネル',type:'solar',mass:.0175,cost:380,icon:'▦',height:.3,radius:.8},
{id:'solar-ox4w',name:'OX-4W 3x2 太陽電池パネル',type:'solar',mass:.0175,cost:380,icon:'▦',height:.3,radius:.8},
{id:'solar-oxstatxl',name:'OX-STAT-XL 太陽電池パネル',type:'solar',mass:.04,cost:600,icon:'▦',height:.4,radius:.6},
{id:'solar-sp10c',name:'SP-10C 太陽電池パネル',type:'solar',mass:.13,cost:1400,icon:'▦',height:.5,radius:.9},
{id:'parachute-mk16xl',name:'Mk16-XL パラシュート',type:'chute',mass:.3,cost:850,icon:'⌃',height:.6,radius:.8},
{id:'parachute-mk25',name:'Mk25 パラシュート',type:'chute',mass:.2,cost:400,icon:'⌃',height:.5,radius:.7},
{id:'wing-delta',name:'デルタ翼',type:'fin',mass:.2,cost:600,icon:'△',height:.3,radius:1.5},
{id:'wing-small-delta',name:'小型デルタ翼',type:'fin',mass:.05,cost:200,icon:'△',height:.2,radius:.7},
{id:'wing-strake',name:'ストレーキ',type:'fin',mass:.05,cost:400,icon:'△',height:.2,radius:.8},
{id:'wing-struct-a',name:'ストラクチャーウィング タイプA',type:'fin',mass:.1,cost:500,icon:'△',height:.2,radius:1.2},
{id:'wing-struct-b',name:'ストラクチャーウィング タイプB',type:'fin',mass:.1,cost:500,icon:'△',height:.2,radius:1.2},
{id:'wing-struct-c',name:'ストラクチャーウィング タイプC',type:'fin',mass:.05,cost:300,icon:'△',height:.2,radius:.8},
{id:'wing-struct-d',name:'ストラクチャーウィング タイプD',type:'fin',mass:.025,cost:150,icon:'△',height:.2,radius:.6}
,

{id:'srb-mite',name:'FM1 Mite 固体燃料ブースター',type:'booster',mass:.38,cost:75,fuel:30,thrust:13,isp:210,icon:'▥',height:.8,radius:.3},
{id:'srb-shrimp',name:'F3S0 Shrimp 固体燃料ブースター',type:'booster',mass:.83,cost:150,fuel:67,thrust:30,isp:215,icon:'▥',height:1.1,radius:.4},
{id:'srb-rt5',name:'RT-5 Flea 固体燃料ブースター',type:'booster',mass:1.5,cost:200,fuel:105,thrust:192,isp:165,icon:'▥',height:1.5,radius:.625},
{id:'srb-rt10',name:'RT-10 Hammer 固体燃料ブースター',type:'booster',mass:3.56,cost:400,fuel:281,thrust:227,isp:195,icon:'▥',height:2.5,radius:.625},
{id:'srb-bacc',name:'BACC Thumper 固体燃料ブースター',type:'booster',mass:7.65,cost:850,fuel:615,thrust:300,isp:210,icon:'▥',height:3.5,radius:.625},
{id:'srb-kickback',name:'S1 SRB-KD25k Kickback',type:'booster',mass:24,cost:2700,fuel:1950,thrust:670,isp:220,icon:'▥',height:6,radius:.625},
{id:'srb-thoroughbred',name:'S2-17 Thoroughbred',type:'booster',mass:70,cost:9000,fuel:6000,thrust:1700,isp:230,icon:'▥',height:8,radius:1.25},
{id:'srb-clydesdale',name:'S2-33 Clydesdale',type:'booster',mass:144,cost:18500,fuel:12300,thrust:3300,isp:235,icon:'▥',height:10,radius:1.25},
{id:'srb-sepatron',name:'Sepratron I',type:'booster',mass:.07,cost:75,fuel:6,thrust:18,isp:154,icon:'▥',height:.45,radius:.18},
{id:'jet-juno',name:'J-20 Juno ジェットエンジン',type:'engine',mass:.25,cost:450,thrust:20.6,isp:6400,icon:'◈',height:.8,radius:.3},
{id:'jet-whiplash',name:'J-X4 Whiplash ターボラムジェット',type:'engine',mass:1.8,cost:2250,thrust:386.66,isp:4000,icon:'◈',height:1.7,radius:.625},
{id:'jet-panther',name:'J-404 Panther アフターバーナー',type:'engine',mass:1.2,cost:2000,thrust:219.48,isp:4000,icon:'◈',height:1.4,radius:.5},
{id:'jet-goliath',name:'J-90 Goliath ターボファン',type:'engine',mass:4.5,cost:2600,thrust:360,isp:12600,icon:'◈',height:2.5,radius:1.25},
{id:'ion-dawn',name:'IX-6315 Dawn イオンエンジン',type:'engine',mass:.25,cost:8000,thrust:2,isp:4200,icon:'◈',height:.8,radius:.3125},
{id:'wheel-small',name:'小型リアクションホイール',type:'battery',mass:.05,cost:600,icon:'◉',height:.3,radius:.3},
{id:'wheel-advanced',name:'先進的インラインスタビライザー',type:'battery',mass:.1,cost:1200,icon:'◉',height:.5,radius:.5},
{id:'wheel-large',name:'大型リアクションホイール',type:'battery',mass:.2,cost:2100,icon:'◉',height:.7,radius:.7},
{id:'rcs-rv105',name:'RV-105 RCSスラスターブロック',type:'engine',mass:.04,cost:45,thrust:1,isp:240,icon:'◈',height:.35,radius:.25},
{id:'rcs-rv1x',name:'RV-1X RCSスラスターブロック',type:'engine',mass:.005,cost:30,thrust:.1,isp:240,icon:'◈',height:.2,radius:.15},
{id:'rcs-place7',name:'Place-Anywhere 7 リニアRCSポート',type:'engine',mass:.02,cost:25,thrust:2,isp:240,icon:'◈',height:.25,radius:.15},
{id:'rcs-place1',name:'Place-Anywhere 1 リニアRCSポート',type:'engine',mass:.0013,cost:15,thrust:.2,isp:240,icon:'◈',height:.15,radius:.1},
{id:'vernor',name:'Vernor エンジン',type:'engine',mass:.08,cost:150,thrust:12,isp:260,icon:'◈',height:.4,radius:.2},
{id:'sas-chj3',name:'CH-J3 フライバイワイヤ アビオニクス',type:'probe',mass:.08,cost:5200,icon:'⌖',height:.4,radius:.3},
{id:'adapter-fla5',name:'FL-A5 変換アダプター',type:'decoupler',mass:.04,cost:100,icon:'⊖',height:.3,radius:.5},
{id:'adapter-fla10',name:'FL-A10 変換アダプター',type:'decoupler',mass:.05,cost:150,icon:'⊖',height:.5,radius:.5},
{id:'adapter-rockomax',name:'Rockomax アダプター',type:'decoupler',mass:.1,cost:500,icon:'⊖',height:.6,radius:1.25},
{id:'adapter-rockomax-short',name:'Rockomax アダプター 02',type:'decoupler',mass:.08,cost:450,icon:'⊖',height:.3,radius:1.25},
{id:'coupler-tri',name:'TVR-1180C Mk1 トライカプラー',type:'decoupler',mass:.15,cost:680,icon:'⊖',height:.4,radius:.625},
{id:'coupler-quad',name:'TVR-2160C Mk2 クアッドカプラー',type:'decoupler',mass:.175,cost:2000,icon:'⊖',height:.5,radius:.625},
{id:'coupler-bi',name:'TVR-200 バイカプラー',type:'decoupler',mass:.1,cost:400,icon:'⊖',height:.4,radius:.625},
{id:'coupler-biadapter',name:'TVR-200L バイアダプター',type:'decoupler',mass:.1,cost:400,icon:'⊖',height:.4,radius:1.25},
{id:'coupler-triadapter',name:'TVR-300L トライアダプター',type:'decoupler',mass:.15,cost:600,icon:'⊖',height:.5,radius:1.25},
{id:'coupler-quadadapter',name:'TVR-400L クアッドアダプター',type:'decoupler',mass:.2,cost:800,icon:'⊖',height:.5,radius:1.25},
{id:'strut-eas4',name:'EAS-4 ストラットコネクター',type:'decoupler',mass:.05,cost:42,icon:'⊖',height:.2,radius:.1},
{id:'structural-body',name:'構造用ボディ',type:'decoupler',mass:.1,cost:380,icon:'▤',height:1,radius:.5},
{id:'attachment-bz52',name:'BZ-52 ラジアル型アタッチメントポイント',type:'decoupler',mass:.04,cost:250,icon:'⊖',height:.2,radius:.2},
{id:'hubmax',name:'Rockomax HubMax マルチポイントコネクター',type:'decoupler',mass:1.5,cost:900,icon:'⊖',height:1,radius:1.25},
{id:'hardpoint-small',name:'小型ハードポイント',type:'decoupler',mass:.05,cost:60,icon:'⊖',height:.3,radius:.25},
{id:'pylon',name:'パイロン',type:'decoupler',mass:.2,cost:125,icon:'⊖',height:.5,radius:.25},
{id:'strut-cubic',name:'立方体型オクタゴン ストラット',type:'decoupler',mass:.001,cost:16,icon:'⊖',height:.2,radius:.1},
{id:'strut-octagonal',name:'オクタゴン ストラット',type:'decoupler',mass:.001,cost:20,icon:'⊖',height:.2,radius:.1},
{id:'modular-girder',name:'モジュラー構造アダプター',type:'decoupler',mass:.25,cost:50,icon:'▤',height:1,radius:.2}
,
{"id":"mk0-fuselage","name":"Mk0 機体胴体","type":"fuselage","tech":"basic","mass":0.35,"cost":450,"fuel":80,"height":2.2,"radius":0.38},
{"id":"mk1-fuselage","name":"Mk1 機体胴体","type":"fuselage","tech":"basic","mass":1.2,"cost":950,"fuel":300,"height":3.8,"radius":0.62},
{"id":"mk2-fuselage","name":"Mk2 機体胴体","type":"fuselage","tech":"flight","mass":3.8,"cost":2600,"fuel":850,"height":5.2,"radius":1.05},
{"id":"mk3-fuselage","name":"Mk3 大型機体胴体","type":"fuselage","tech":"heavy","mass":12,"cost":7800,"fuel":2600,"height":7.5,"radius":1.55},
{"id":"mk1-cockpit-aircraft","name":"Mk1 航空機コックピット","type":"cockpit","tech":"basic","mass":1.1,"cost":1800,"crew":1,"height":1.8,"radius":0.62},
{"id":"wing-basic","name":"標準主翼","type":"wing","tech":"basic","mass":0.8,"cost":650,"height":0.25,"radius":2.5},
{"id":"wing-swept","name":"後退翼","type":"wing","tech":"flight","mass":1.15,"cost":950,"height":0.25,"radius":3.2},
{"id":"wing-delta-large","name":"大型デルタ翼","type":"wing","tech":"flight","mass":1.6,"cost":1450,"height":0.3,"radius":3.5},
{"id":"wing-small","name":"小型主翼","type":"wing","tech":"basic","mass":0.25,"cost":260,"height":0.18,"radius":1.4},
{"id":"tail-fin","name":"垂直尾翼","type":"tail","tech":"basic","mass":0.22,"cost":320,"height":1.3,"radius":1.1},
{"id":"tail-horizontal","name":"水平尾翼","type":"wing","tech":"basic","mass":0.3,"cost":380,"height":0.18,"radius":1.3},
{"id":"elevon","name":"エレボン","type":"control","tech":"flight","mass":0.12,"cost":260,"height":0.12,"radius":1.2},
{"id":"rudder","name":"方向舵","type":"control","tech":"flight","mass":0.1,"cost":220,"height":0.5,"radius":0.45},
{"id":"jet-engine-juno","name":"J-20 ジェットエンジン","type":"jet","tech":"flight","mass":0.5,"cost":900,"thrust":20,"isp":900,"height":1.2,"radius":0.42},
{"id":"jet-engine-panther","name":"J-404 パンサー","type":"jet","tech":"flight","mass":1.2,"cost":2400,"thrust":65,"isp":950,"height":1.8,"radius":0.62},
{"id":"jet-engine-whiplash","name":"J-X4 ウィップラッシュ","type":"jet","tech":"heavy","mass":2.5,"cost":6200,"thrust":180,"isp":1100,"height":2.2,"radius":0.72},
{"id":"air-intake","name":"RAM 空気吸入口","type":"intake","tech":"flight","mass":0.08,"cost":150,"height":0.55,"radius":0.38},
{"id":"landing-gear-small","name":"小型着陸脚","type":"gear","tech":"basic","mass":0.08,"cost":180,"height":0.55,"radius":0.3},
{"id":"landing-gear-large","name":"大型着陸脚","type":"gear","tech":"flight","mass":0.2,"cost":420,"height":0.85,"radius":0.45},
{"id":"airbrake","name":"エアブレーキ","type":"airbrake","tech":"flight","mass":0.12,"cost":280,"height":0.55,"radius":0.65}
];


const stockExpansion=[["probe-mpo","MPO 探査機コア","probe",0.895,9900,1.2,0.65,"science"],["probe-mtm","MTM ステージコア","probe",0.795,21500,1.1,0.65,"science"],["ore-radial","ラジアル型貯蔵タンク","resource",0.125,300,0.8,0.42,"science"],["ore-small","小型貯蔵タンク","resource",0.5,1000,1.5,0.625,"science"],["ore-large","大型貯蔵タンク","resource",2,3000,3,1.25,"heavy"],["fuel-line","FTX-2 外部燃料ダクト","structural",0.05,150,1.4,0.18,"flight"],["engine-ion","IX-6315 Dawn イオンエンジン","engine",0.25,8000,1.1,0.4,"science"],["engine-mastodon","KE-1 Mastodon","engine",5,8000,3.2,1.25,"heavy"],["engine-wolfhound","RE-J10 Wolfhound","engine",3.3,3000,2.5,1.25,"heavy"],["engine-skiff","RE-I2 Skiff","engine",1.6,2300,1.8,0.9,"heavy"],["engine-cheetah","LV-T91 Cheetah","engine",1,850,1.5,0.625,"flight"],["engine-bobcat","LV-TX87 Bobcat","engine",2,2000,2,0.9,"heavy"],["engine-kodiak","RK-7 Kodiak","engine",1.25,1100,1.7,0.625,"flight"],["intake-circular","Circular Intake","intake",0.01,200,0.6,0.45,"flight"],["intake-shock","Shock Cone Intake","intake",0.12,600,1.3,0.5,"heavy"],["intake-ram","Ram Air Intake","intake",0.01,200,0.65,0.45,"flight"],["wing-basic","Basic Wing コントロール面","wing",0.08,300,0.12,1.2,"flight"],["wing-elevon1","Elevon 1","control",0.05,250,0.08,0.8,"flight"],["wing-elevon2","Elevon 2","control",0.1,450,0.1,1.2,"flight"],["wing-elevon3","Elevon 3","control",0.2,750,0.12,1.8,"heavy"],["wing-elevon4","Elevon 4","control",0.35,1100,0.15,2.4,"heavy"],["wing-rudder","AV-R8 ウィングレット","tail",0.08,450,0.65,0.9,"flight"],["gear-small","LY-01 小型着陸脚","gear",0.08,300,0.8,0.35,"flight"],["gear-medium","LY-05 中型着陸脚","gear",0.16,450,1.1,0.48,"flight"],["gear-large","LY-60 大型着陸脚","gear",0.4,800,1.5,0.7,"heavy"],["rover-wheel-m1","RoveMax Model M1","ground",0.1,250,0.45,0.45,"science"],["rover-wheel-s2","RoveMax Model S2","ground",0.15,450,0.55,0.55,"science"],["rover-wheel-xl3","RoveMax Model XL3","ground",0.3,900,0.7,0.7,"heavy"],["battery-z200","Z-200 バッテリー","battery",0.1,150,0.45,0.45,"flight"],["battery-z400","Z-400 バッテリー","battery",0.2,300,0.65,0.55,"science"],["battery-z1k","Z-1k バッテリー","battery",0.5,550,0.9,0.65,"science"],["battery-z4k","Z-4K バッテリー","battery",1,1000,1.2,0.8,"heavy"],["solar-gigantor","Gigantor XL ソーラーパネル","solar",0.3,3000,0.35,2,"heavy"],["comm-16","Communotron 16 アンテナ","comm",0.005,300,0.65,0.25,"flight"],["comm-dts","Communotron DTS-M1 パラボラアンテナ","comm",0.025,1200,1.1,0.7,"science"],["science-goo","Goo™ 格納ユニット","science",0.05,800,0.55,0.4,"science"],["science-material","SC-9001 Science Jr.","science",0.2,1800,0.8,0.55,"science"],["science-thermo","2ホット 温度計","science",0.005,900,0.3,0.2,"flight"],["science-barometer","プレスマット 気圧計","science",0.005,880,0.3,0.2,"flight"],["science-magnet","磁力計ブーム","science",0.05,2200,1.2,0.25,"science"],["science-atmo","大気分光器","science",0.005,6500,0.6,0.3,"heavy"],["thermal-heatshield","Heat Shield 1.25m","thermal",0.3,600,0.35,0.7,"flight"],["thermal-heatshield2","Heat Shield 2.5m","thermal",1.3,1600,0.45,1.3,"science"],["thermal-radiator","Radiator Panel","thermal",0.08,700,0.15,0.8,"science"],["payload-bay1","1.25m サービスベイ","payload",0.1,500,1.2,0.625,"flight"],["payload-bay2","2.5m サービスベイ","payload",0.3,500,1.6,1.25,"science"],["payload-cargo1","Mk2 カーゴベイ CRG-04","payload",0.25,320,2.2,1.25,"science"],["payload-cargo2","Mk2 カーゴベイ CRG-08","payload",0.5,500,3.8,1.25,"science"],["payload-cargo3","Mk3 カーゴベイ CRG-25","payload",1.5,750,4.5,1.875,"heavy"],["payload-cargo4","Mk3 カーゴベイ CRG-50","payload",3,1500,7,1.875,"heavy"],["payload-cargo5","Mk3 カーゴベイ CRG-100","payload",6,3000,10,1.875,"heavy"],["docking-port","Clamp-O-Tron ドッキングポート","docking",0.05,400,0.35,0.55,"science"],["docking-jr","Clamp-O-Tron Jr. ドッキングポート","docking",0.02,250,0.25,0.3,"science"],["docking-shielded","Clamp-O-Tron Shielded ドッキングポート","docking",0.08,800,0.55,0.65,"heavy"],["grapple","Advanced Grabbing Unit","docking",0.25,4500,0.8,0.6,"heavy"],["utility-ladder","Pegasus I 機動性向上装置","utility",0.005,100,1.2,0.15,"flight"],["utility-light","Illuminator Mk1","utility",0.015,100,0.25,0.25,"flight"],["ground-anchor","Stamp-O-Tron グラウンドアンカー","ground",0.05,300,0.6,0.35,"science"],["ground-light","作業用照明（スタンド）","ground",0.003,35,1.1,0.2,"science"],["adapter-fla5","FL-A5 変換アダプター","structural",0.05,150,0.45,0.55,"flight"],["coupler-tri","TVR-1180C Mk1 トライカプラー","structural",0.08,300,0.45,0.8,"science"],["coupler-quad","TVR-2160C Mk2 クアッドカプラー","structural",0.15,600,0.55,1.1,"heavy"],["coupler-bi","TVR-200 バイカプラー","structural",0.08,250,0.45,0.8,"flight"],["hubmax","Rockomax HubMax マルチポイントコネクター","structural",0.3,1000,0.7,1.2,"heavy"],["strut-eas4","EAS-4 ストラットコネクター","structural",0.01,75,1,0.15,"flight"]];
for(const [id,name,type,mass,cost,height,radius,tech] of stockExpansion){if(!catalog.some(p=>p.id===id))catalog.push({id,name,type,mass,cost,height,radius,tech,icon:'◈',catalogSource:'stock',dataQuality:'candidate-estimate'});}
for(const p of additionalParts){if(!catalog.some(q=>q.id===p.id)&&!catalog.some(q=>q.name===p.name))catalog.push(p);}
// Replace four generic demo placeholders with real named parts; old saved craft IDs are migrated below.
const legacyCatalogAliases={probe:'probe-hecs',booster:'srb-rt10',fin:'wing-small-delta',science:'science-goo'};
for(let i=catalog.length-1;i>=0;i--)if(legacyCatalogAliases[catalog[i].id])catalog.splice(i,1);
let activePartCategory='すべて';
function categoryFor(p){if(p.catalogSource==='Making History')return 'DLC・Making History';if(p.catalogSource==='Breaking Ground')return 'DLC・Breaking Ground';return ['cockpit','fuselage','wing','tail','control','jet','intake','gear','airbrake','rotor-blade'].includes(p.type)?'航空機':['pod','probe'].includes(p.type)?'制御・乗員':['tank','resource'].includes(p.type)?'燃料・資源':['engine','booster'].includes(p.type)?'エンジン・推進':['fin','chute','nosecone'].includes(p.type)?'空力・航空機':['ground'].includes(p.type)?'着陸・地上':['decoupler','structural','payload','docking','robotics'].includes(p.type)?'構造・貨物':['battery','solar','comm','science','thermal','utility'].includes(p.type)?'電力・科学・装備':'その他';}
function renderCategories(){
 const cats=['すべて','制御・乗員','燃料・資源','エンジン・推進','航空機','空力・航空機','着陸・地上','構造・貨物','電力・科学・装備','DLC・Making History','DLC・Breaking Ground','その他'];
 const icons=['🗂️','👨‍🚀','⛽','🚀','🛩️','🪂','🛬','📦','🔋','🏛️','🦾','🧰'];
 $('#part-categories').innerHTML=cats.map((c,i)=>'<button class="part-category '+(activePartCategory===c?'active':'')+'" data-part-category="'+c+'" title="'+c+'"><span class="cat-icon">'+icons[i]+'</span><span class="cat-label">'+c+'</span></button>').join('');
}
function partPreviewSvg(p){const d='<defs><linearGradient id="ps" x2="1" y2="1"><stop stop-color="#f1f3ef"/><stop offset=".5" stop-color="#9ca8aa"/><stop offset="1" stop-color="#46545c"/></linearGradient></defs>';let s=p.type==='pod'?'<path d="M29 57V31Q29 13 40 8Q51 13 51 31V57Z" fill="url(#ps)" stroke="#26333a" stroke-width="2"/><path d="M33 27Q40 17 47 27L45 34H35Z" fill="#263e4b"/>':p.type==='tank'?'<path d="M31 8H49L53 15V55L49 62H31L27 55V15Z" fill="url(#ps)" stroke="#26333a" stroke-width="2"/><path d="M28 18H52M28 51H52" stroke="#596970" stroke-width="2"/>':(p.type==='engine'||p.type==='booster')?'<path d="M31 8H49V39L55 57H25L31 39Z" fill="url(#ps)" stroke="#26333a" stroke-width="2"/><path d="M34 41H46L51 55H29Z" fill="#303b42"/><path d="M34 56L40 68L46 56Z" fill="#e58b37"/>':p.type==='solar'?'<path d="M35 27H45V43H35Z" fill="url(#ps)"/><path d="M4 20H32V50H4ZM48 20H76V50H48Z" fill="#234e75" stroke="#9eabb0" stroke-width="2"/><path d="M4 30H32M4 40H32M48 30H76M48 40H76M18 20V50M62 20V50" stroke="#9bb5c4"/>':p.type==='chute'?'<path d="M13 35Q40 2 67 35L61 43H19Z" fill="#d6c6a2" stroke="#394850" stroke-width="2"/><path d="M13 35L40 61L67 35" fill="none" stroke="#7d4d3d" stroke-width="2"/>':'<path d="M30 14H50V54H30Z" fill="url(#ps)" stroke="#26333a" stroke-width="2"/><path d="M25 22H55M25 46H55" stroke="#e0bd6b" stroke-width="2"/>';return '<svg class="part-preview" viewBox="0 0 80 72" aria-hidden="true">'+d+s+'</svg>';}
const partPreviewRenderers=new Map();let partPreviewObserver=null,selectedPartId=null,sharedPreviewRenderer=null;
function getSharedPreviewRenderer(){
 if(!sharedPreviewRenderer){
  const surface=document.createElement('canvas');
  sharedPreviewRenderer=new THREE.WebGLRenderer({canvas:surface,antialias:false,alpha:false,powerPreference:'low-power'});
  sharedPreviewRenderer.setPixelRatio(1);sharedPreviewRenderer.setSize(232,116,false);sharedPreviewRenderer.outputColorSpace=THREE.SRGBColorSpace;sharedPreviewRenderer.toneMapping=THREE.ACESFilmicToneMapping;sharedPreviewRenderer.toneMappingExposure=1.2;
 }
 return sharedPreviewRenderer;
}
function paintPartPreview(entry,canvas){
 const renderer=getSharedPreviewRenderer();renderer.render(entry.scene,entry.camera);
 const ctx=canvas.getContext('2d');if(ctx)ctx.drawImage(renderer.domElement,0,0,canvas.width,canvas.height);
}
function disposePartPreview(canvas){const entry=partPreviewRenderers.get(canvas);if(entry){entry.hovered=false;if(entry.raf)cancelAnimationFrame(entry.raf);entry.model.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials)m.dispose();}});}partPreviewRenderers.delete(canvas);}
function renderOnePartPreview(canvas,p){
 if(partPreviewRenderers.has(canvas))return;
 try{
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x778894);scene.add(new THREE.HemisphereLight(0xeaf4ff,0x30383d,2.1));
  const key=new THREE.DirectionalLight(0xffedcf,3.2);key.position.set(3,5,4);scene.add(key);
  const fill=new THREE.DirectionalLight(0x9fc8e8,1.1);fill.position.set(-4,1,-3);scene.add(fill);
  const model=partMesh(p);scene.add(model);const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),sphere=box.getBoundingSphere(new THREE.Sphere());model.position.sub(center);
  const camera=new THREE.PerspectiveCamera(34,2,.01,1000),dist=Math.max(.7,sphere.radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))*.8194);camera.position.set(dist*.55,dist*.35,dist*.75);camera.lookAt(0,0,0);camera.far=dist*12;camera.updateProjectionMatrix();
  const originalRotation=model.rotation.clone();
  const entry={scene,camera,model,originalRotation,hovered:false,raf:0,lastFrame:0};partPreviewRenderers.set(canvas,entry);paintPartPreview(entry,canvas);
  canvas.draggable=false;
  canvas.addEventListener('dragstart',e=>e.preventDefault());
  canvas.addEventListener('click',e=>e.stopPropagation());
  const animate=now=>{if(!entry.hovered||!canvas.isConnected){entry.raf=0;return;}if(!entry.lastFrame)entry.lastFrame=now;const dt=Math.min(.05,(now-entry.lastFrame)/1000);entry.lastFrame=now;model.rotation.y+=dt*.9;paintPartPreview(entry,canvas);entry.raf=requestAnimationFrame(animate);};
  canvas.addEventListener('pointerenter',()=>{entry.hovered=true;entry.lastFrame=0;if(!entry.raf)entry.raf=requestAnimationFrame(animate);});
  canvas.addEventListener('pointerleave',()=>{entry.hovered=false;entry.lastFrame=0;if(entry.raf){cancelAnimationFrame(entry.raf);entry.raf=0;}model.rotation.copy(entry.originalRotation);paintPartPreview(entry,canvas);});
  canvas.addEventListener('pointerdown',e=>e.stopPropagation());
 }catch(err){canvas.replaceWith(Object.assign(document.createElement('span'),{className:'part-preview-error',textContent:'3D'}));}
}
function renderPartPreviews(items){
 if(partPreviewObserver){partPreviewObserver.disconnect();partPreviewObserver=null;}
 for(const [canvas] of partPreviewRenderers)disposePartPreview(canvas);
 const list=$('#part-list');list.innerHTML=list.innerHTML;
 const canvases=[...list.querySelectorAll('button[data-part]')];
 for(const button of canvases){const p=items.find(x=>x.id===button.dataset.part);const holder=button.querySelector('.part-icon');if(!p||!holder)continue;holder.innerHTML='<canvas class="part-preview-canvas" width="232" height="116" aria-label="'+p.name+' の回転可能な3Dモデル"></canvas>';const canvas=holder.firstElementChild;canvas.dataset.partId=p.id;}
 if('IntersectionObserver' in window){
  partPreviewObserver=new IntersectionObserver(entries=>{for(const e of entries){const canvas=e.target;if(e.isIntersecting){const p=catalog.find(x=>x.id===canvas.dataset.partId);if(p)renderOnePartPreview(canvas,p);}else disposePartPreview(canvas);}},{root:list,rootMargin:'100px'});
  list.querySelectorAll('.part-preview-canvas').forEach(c=>partPreviewObserver.observe(c));
 }else list.querySelectorAll('.part-preview-canvas').forEach(c=>{const p=catalog.find(x=>x.id===c.dataset.partId);if(p)renderOnePartPreview(c,p);});
}
function partHoverInfo(p){
 const types={pod:'有人操縦用のコマンドモジュール。飛行中の操作と乗員の搭乗に使用します。',probe:'無人探査機用のプローブコア。機体の制御ユニットとして使用します。',tank:'推進剤を貯蔵するタンク。エンジンや機体構成に合わせて容量を選びます。',engine:'推進剤を燃焼させて推力を発生するロケットエンジン。',booster:'固体推進剤を燃焼させる補助ロケット。離昇時の推力を補います。',decoupler:'ステージ分離や機体構造の切り離しに使用する装置。',fin:'大気圏内で空力安定性を高めるためのフィン。',chute:'大気圏内で展開し、降下速度を低下させるパラシュート。',battery:'電力を蓄えるバッテリーユニット。',solar:'太陽光を電力へ変換する発電パネル。',science:'飛行中に科学データを取得する実験・観測装置。',cockpit:'パイロットが搭乗する航空機用コックピット。前方視界を確保するキャノピーを備えます。',fuselage:'航空機の胴体。燃料を搭載し、コックピット・主翼・尾部を接続します。',wing:'主翼。揚力を発生させ、航空機の重量を支えます。',tail:'垂直尾翼。ヨー方向の安定性を確保します。',control:'エレボンや方向舵など、機体の姿勢を制御する動翼です。',jet:'吸気した空気と燃料を使って推力を発生するジェットエンジン。',intake:'ジェットエンジンへ空気を供給する吸気口。',gear:'離着陸時に機体を支える着陸脚。',airbrake:'展開して抗力を増やし、着陸時などの減速に使用します。',docking:'宇宙船どうしを接続するためのドッキング機構。',robotics:'ヒンジ・油圧シリンダー・回転サーボ・ローターなどのロボット機構。','rotor-blade':'ヘリコプターやプロペラ機の回転翼。', 'rotor-blade':'プロペラやヘリコプターの揚力・推力を生む回転翼。',nosecone:'機体先端の空気抵抗を抑えるノーズコーン。'};
 const brands=['Kerbodyne','Rockomax','Probodobodyne','Mk1','Mk2','Mk3','FL-','LV-','OX-','Z-','PPD-','EAS-','Oscar','Stayputnik','RC-','PB-','Mainsail'];
 const maker=brands.find(b=>p.name.startsWith(b))||'汎用パーツ';
 const lines=[p.name,'メーカー／シリーズ：'+maker,'重量：'+(p.mass??'—')+' t'];
 if(p.catalogSource)lines.push('収録：'+p.catalogSource+'（追加候補）');
 if(p.referenceSource)lines.push('参考値：'+p.referenceSource);
 if(p.dataQuality==='candidate-estimate')lines.push('注意：重量・寸法・価格・性能は暫定推定値。正確な1.12.5設定値は未照合');
 if(p.thrust!=null)lines.push('最大推力（暫定値）：'+p.thrust+' kN');
 if(p.isp!=null)lines.push('比推力（Isp）：'+p.isp+' s');
 if(p.fuel!=null)lines.push('推進剤容量（暫定値）：'+p.fuel);
 if(p.crew!=null)lines.push('搭乗定員：'+p.crew+' 名');
 if(p.height!=null)lines.push('全高：'+p.height+' m');
 if(p.radius!=null)lines.push('半径：'+p.radius+' m');
 lines.push('費用：₡ '+Number(p.cost||0).toLocaleString('ja-JP'),' ',types[p.type]||'機体の構造・機能を構成するパーツです。');
 return lines.join(String.fromCharCode(10));
}
function drawPartsCatalogV2(){
 const query=($('#part-search')?.value||'').trim().toLowerCase(),sort=$('#part-sort')?.value||'name';
 let items=catalog.filter(p=>(activePartCategory==='すべて'||categoryFor(p)===activePartCategory)&&(!query||(p.name+' '+p.id+' '+categoryFor(p)).toLowerCase().includes(query)));
 items.sort((a,b)=>sort==='mass'?a.mass-b.mass:sort==='cost'?a.cost-b.cost:sort==='size'?a.height-b.height:a.name.localeCompare(b.name,'ja'));
 $('#parts-count').textContent=catalog.length+' PARTS';$('#part-result-count').textContent=items.length+' 件';
 const simplePartNames={robotics:'可動ロボット機構','rotor-blade':'プロペラ・回転翼',docking:'宇宙船の接続部',pod:'人が乗る場所',probe:'無人で動かす装置',tank:'燃料を入れるタンク',engine:'ロケットエンジン',decoupler:'切り離し装置',booster:'補助ロケット',fin:'向きを安定させる翼',chute:'パラシュート',battery:'電池',solar:'太陽電池',science:'実験道具'};$('#part-list').innerHTML=items.map(p=>{const unlocked=gameMode==='sandbox'||unlockedTech.has(p.tech||'basic'),esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const sourceLabel=p.catalogSource==='Making History'?'MAKING HISTORY':p.catalogSource==='Breaking Ground'?'BREAKING GROUND':p.catalogSource==='stock'?'STOCK':'BASE';return '<button class="part" data-part="'+p.id+'" aria-label="'+esc(p.name)+'" '+(unlocked?'':'disabled')+' data-tip="'+esc(partHoverInfo(p))+'"><span class="part-icon"></span><span class="part-name">'+esc(p.name)+'</span><small class="part-meta">'+sourceLabel+(p.dataQuality==='candidate-estimate'?' · 仮データ':'')+'</small></button>';}).join('');renderPartPreviews(items);
}

const techTree=[
{id:'basic',name:'基礎ロケット',cost:0,requires:[],description:'基本的な機体・液体エンジン・固体ブースター。'},
{id:'flight',name:'飛行制御',cost:15,requires:['basic'],description:'電力・太陽電池・制御システム。'},
{id:'science',name:'科学機器',cost:25,requires:['flight'],description:'科学実験装置と観測機器。'},
{id:'heavy',name:'大型推進',cost:45,requires:['flight'],description:'大型燃料タンクと高推力エンジン。'}
];
const contracts=[
{id:'suborbital',name:'弾道飛行',description:'高度10 kmに到達する。',altitude:10,reward:3000,science:5},
{id:'space',name:'宇宙空間到達',description:'高度70 kmに到達する。',altitude:70,reward:8000,science:15},
{id:'orbit',name:'低軌道投入',description:'近点70 km以上・遠点100 km以上の軌道へ投入する。',orbit:true,reward:15000,science:30}
];
let unlockedTech=new Set(techTree.map(t=>t.id)),activeContract=null,crewMembers=[{id:1,name:'Jebediah Kerman',role:'パイロット',level:1},{id:2,name:'Valentina Kerman',role:'パイロット',level:1},{id:3,name:'Bob Kerman',role:'科学者',level:1}];
const abilityRanges={1:{stupidity:[70,100],bravery:[0,30]},2:{stupidity:[50,69],bravery:[31,50]},3:{stupidity:[30,49],bravery:[51,70]},4:{stupidity:[10,29],bravery:[71,90]},5:{stupidity:[0,9],bravery:[91,100]}};
function syncCrewAbilities(member){
 const stars=Math.max(1,Math.min(5,Math.round(member.stars??1))),range=abilityRanges[stars];
 const valid=(value,bounds)=>Number.isFinite(value)&&value>=bounds[0]&&value<=bounds[1];
 if(!valid(member.stupidity,range.stupidity))member.stupidity=Math.floor(Math.random()*(range.stupidity[1]-range.stupidity[0]+1))+range.stupidity[0];
 if(!valid(member.bravery,range.bravery))member.bravery=Math.floor(Math.random()*(range.bravery[1]-range.bravery[0]+1))+range.bravery[0];
 member.stars=stars;
}
function saveCareer(){const key=gameMode==='career'?'space-career-v1':'space-'+gameMode+'-v1';localStorage.setItem(key,JSON.stringify({funds,fundsUnlimited,science,unlocked:[...unlockedTech],activeContract:activeContract?.id||null,crew:crewMembers}));}
function renderResearch(){$('#career-title').textContent='研究開発';$('#career-content').innerHTML='<div class="career-content"><p>利用可能な科学ポイント：<b>'+science+'</b></p>'+techTree.map(t=>{const done=unlockedTech.has(t.id),ready=t.requires.every(x=>unlockedTech.has(x))&&science>=t.cost;return '<div class="career-item"><h3>'+t.name+'</h3><p>'+t.description+'</p><span class="career-tag">必要科学：'+t.cost+'　前提：'+(t.requires.join(', ')||'なし')+'</span><br><button data-unlock-tech="'+t.id+'" '+(done||!ready?'disabled':'')+'>'+(done?'解放済み':ready?'研究を完了':'条件未達')+'</button></div>';}).join('')+'</div>';}
function renderCrew(){
 $('#career-title').textContent='乗組員管理';
 crewStage.visible=false;
 $('#career-content').innerHTML='<div class="crew-intro"><span>CREW ROSTER</span><p>3D乗組員一覧。飛行から帰還すると経験が上がります。</p></div><div class="crew-grid">'+crewMembers.map((k)=>{
  syncCrewAbilities(k);
  const stars=k.stars,bravery=k.bravery,stupidity=k.stupidity;
  return '<article class="crew-card"><canvas class="crew-avatar" data-crew-index="'+crewMembers.indexOf(k)+'" width="96" height="128" aria-label="'+k.name+' の全身3Dモデル"></canvas><div class="crew-info"><h3>'+k.name+'</h3><span class="crew-role">'+k.role+' ・ 経験 '+('★'.repeat(stars))+('☆'.repeat(5-stars))+'</span><div class="crew-stat"><div><span>バカ度</span><b>'+stupidity+'%</b></div><div class="crew-meter"><i style="width:'+stupidity+'%"></i></div></div><div class="crew-stat"><div><span>勇敢度</span><b>'+bravery+'%</b></div><div class="crew-meter brave"><i style="width:'+bravery+'%"></i></div></div><button class="crew-retire" data-retire-crew="'+crewMembers.indexOf(k)+'" type="button" aria-label="'+k.name+' を退職させる" title="退職させる">×</button></div></article>';
 }).join('')+'</div><section class="crew-recruit"><b>乗組員を雇用</b><div><button data-hire-crew="pilot">パイロットを雇用</button><button data-hire-crew="engineer">エンジニアを雇用</button><button data-hire-crew="scientist">科学者を雇用</button></div></section>';
 renderCrewPortraits();
 saveCareer();
}function renderContracts(){$('#career-title').textContent='ミッション管理';$('#career-content').innerHTML='<div class="career-content">'+(activeContract?'<div class="career-item"><h3>受注中：'+activeContract.name+'</h3><p>'+activeContract.description+'</p><span class="career-tag">報酬 ₡'+activeContract.reward.toLocaleString()+' / 科学 '+activeContract.science+'</span></div>':'<p>受注中の契約はありません。</p>')+contracts.map(k=>'<div class="career-item"><h3>'+k.name+'</h3><p>'+k.description+'</p><span class="career-tag">報酬 ₡'+k.reward.toLocaleString()+' / 科学 '+k.science+'</span><br><button data-accept-contract="'+k.id+'" '+(activeContract?'disabled':'')+'>契約を受注</button></div>').join('')+'</div>';}
try{const saveKey=gameMode==='career'?'space-career-v1':'space-'+gameMode+'-v1';const savedCareer=JSON.parse(localStorage.getItem(saveKey)||'null');if(savedCareer){funds=savedCareer.funds??funds;fundsUnlimited=savedCareer.fundsUnlimited??true;science=savedCareer.science??science;unlockedTech=new Set(savedCareer.unlocked||['basic']);activeContract=contracts.find(k=>k.id===savedCareer.activeContract)||null;crewMembers=savedCareer.crew||crewMembers;}}catch{}if(gameMode==='sandbox'){funds=999999999;unlockedTech=new Set(techTree.map(t=>t.id));activeContract=null;}if(gameMode==='science')activeContract=null;
function partMesh(p){return createPartModel(p,THREE);}
function renderStages(){stageUiFuelPercent=maxFuel?Math.round(fuel/maxFuel*100):0;const groups=[...new Set([...parts.map(p=>p.stage),assemblyStage])].sort((a,b)=>b-a);const cards=groups.map(n=>{const group=parts.filter(p=>p.stage===n),fuelMax=group.reduce((s,p)=>s+(p.data.fuel||0),0),fuelNow=group.reduce((s,p)=>s+(p.fuel||0),0),names=group.map(p=>p.data.name).join(' / ');return '<div class="stage-card '+(n===assemblyStage?'active':'')+'"><b>'+n+'</b><span>'+(names||'空のステージ')+'</span><small>'+(fuelMax?Math.round(fuelNow/fuelMax*100)+'% 推進剤':'パーツ '+group.length)+'</small><div class="fuel-track"><i style="width:'+(fuelMax?fuelNow/fuelMax*100:0)+'%"></i></div></div>';});$('#stage-list').innerHTML=cards.join('')||'<small>ステージなし</small>';const build=$('#build-stage-list');if(build)build.innerHTML=cards.map((c,i)=>c.replace('stage-card ','stage-card build-stage ')).join('');}
function recalc(){craftMass=rocketMassKg(parts)/1000;fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);maxFuel=parts.reduce((s,p)=>s+(p.data.fuel||0),0);thrust=parts.reduce((s,p)=>s+(p.data.thrust||0),0);const dv=deltaV(parts);$('#craft-name').textContent='機体重量 '+craftMass.toFixed(2)+' t　Δv '+Math.round(dv)+' m/s　推力 '+thrust+' kN';$('#funds').textContent=gameMode==='sandbox'||fundsUnlimited?'∞':'₡'+funds.toLocaleString();$('#funds-toggle').textContent='資金: '+(fundsUnlimited?'無制限':'通常');$('#funds-toggle').classList.toggle('active',fundsUnlimited);$('#science').textContent=science;renderStages();}
function disposeCraftModel(root){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials)m.dispose();}});}
function layout(){for(const child of [...rocket.children])disposeCraftModel(child);rocket.clear();let y=0,z=0;for(const p of parts){const m=partMesh(p.data),h=p.data.height;p.mesh=m;m.userData.partItem=p;if(p.manualPosition&&p.position)m.position.copy(p.position);else if(aircraftCraft){p.y=0;m.position.set(0,0,z);z+=h*.82;}else{p.y=y;m.position.y=y;y+=h*.82;}rocket.add(m);}rocket.position.y=0;recalc();$('#stage-build-label').textContent='組立ステージ '+assemblyStage;}
function addPart(id,place=null){const d=catalog.find(x=>x.id===id);if(!d)return;if(gameMode!=='sandbox'&&!fundsUnlimited&&funds<d.cost){toast('資金が不足しています');return;}if(gameMode!=='sandbox'&&!fundsUnlimited)funds-=d.cost;saveCareer();const item={data:d,fuel:d.fuel||0,stage:assemblyStage};if(place){item.manualPosition=true;item.position=place.clone();}parts.push(item);layout();toast(d.name+' を設置しました');}
function setMode(m){mode=m;campus.visible=m==='center';hangar.visible=m==='vab';$('#build-staging').classList.toggle('show',m==='vab');$('.tabs').classList.toggle('hidden',m==='flight');$('#home').classList.toggle('hidden',m==='flight');$$('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===m));$('#parts').classList.toggle('open',m==='vab');$('#flight-hud').classList.toggle('show',m==='flight');$('#career-panel').classList.toggle('hidden',m!=='crew');$('.vab-tools').classList.toggle('hidden',m!=='vab');$('#hint').classList.toggle('hidden',m==='flight');if(m==='center'){camera.position.set(.14,.10,.20);camera.lookAt(0,.005,0);rocket.visible=false;$('#hint').textContent='宇宙センター：ロケット組立棟で機体を設計し、発射場から宇宙へ。';}if(m==='vab'){rocket.visible=true;rocket.position.set(0,0,0);camera.position.copy(aircraftCraft?new THREE.Vector3(.022,.010,.002):new THREE.Vector3(.012,.009,.016));camera.lookAt(0,aircraftCraft ? .002 : .005,0);$('#hint').textContent=aircraftCraft?'航空機組立：コックピット・胴体を中心に、主翼・尾翼・エンジン・着陸脚を取り付けます。':'ロケット組立：下段から上段へ順にパーツを追加します。';}if(m==='crew'){rocket.visible=false;crewStage.visible=true;camera.position.set(0,5.5,16.2);camera.lookAt(0,1.8,0);$('#hint').textContent='';}else{crewStage.visible=false;}if(m==='flight'){rocket.visible=true;camera.position.set(.022,.014,.027);}}
$$('[data-screen]').forEach(b=>b.onclick=()=>{setMode(b.dataset.screen);if(b.dataset.screen==='crew')renderCrew();});

$('#career-content').addEventListener('click',e=>{const retire=e.target.closest('[data-retire-crew]');if(retire){const index=Number(retire.dataset.retireCrew),member=crewMembers[index];if(member){crewMembers.splice(index,1);saveCareer();renderCrew();toast(member.name+' が退職しました');}return;}const hire=e.target.closest('[data-hire-crew]');if(hire){const role=hire.dataset.hireCrew,cost=2500;if(gameMode!=='sandbox'&&!fundsUnlimited&&funds<cost){toast('雇用資金が不足しています');return;}if(gameMode!=='sandbox'&&!fundsUnlimited)funds-=cost;const names=['Avery','Boris','Caden','Daisy','Elwin','Fiona','Gordon','Hana','Ivo','Juno','Kellan','Lena','Marek','Nora','Otto','Piper','Quinn','Rhea','Soren','Talia','Uma','Viktor','Willa','Xander','Yuri','Zelda','Arlo','Bria','Cyrus','Della','Ezra','Freya','Hugo','Iris','Jonas','Kaia','Luka','Mira','Niko','Orla','Pavel','Rina','Silas','Tess','Uri','Vera','Wes','Yara','Zane','Adrian','Beatrix','Callum','Delia','Emmett','Flora','Gideon','Helena','Isak','Juniper','Kieran','Lyra','Milo','Nadia','Oren','Petra','Quincy','Ronan','Sasha','Thea','Ulric','Violet','Warren','Yvette','Zora','Alistair','Brenna','Corin','Dorian','Evelyn','Felix','Greta','Hollis','Imogen','Jasper','Kira','Leander','Maeve','Noel','Opal','Percy','Rowan','Selene','Tobin','Una','Vance','Winona','Yael','Zeke'];const roleNames={pilot:'パイロット',engineer:'エンジニア',scientist:'科学者'};const firstName=names.find(n=>!crewMembers.some(k=>k.name===n+' Kerman'))||'Kerbal';let name=firstName+' Kerman';let suffix='';while(crewMembers.some(k=>k.name===name)){suffix+=' Jr';name=firstName+suffix+' Kerman';}const recruit={id:Date.now(),name,role:roleNames[role],level:1,stars:1};syncCrewAbilities(recruit);crewMembers.push(recruit);saveCareer();renderCrew();recalc();toast(name+' を雇用しました');}const tech=e.target.closest('[data-unlock-tech]');if(tech){const item=techTree.find(t=>t.id===tech.dataset.unlockTech);if(item&&!unlockedTech.has(item.id)&&item.requires.every(x=>unlockedTech.has(x))&&science>=item.cost){science-=item.cost;unlockedTech.add(item.id);saveCareer();drawPartsCatalogV2();renderResearch();recalc();toast(item.name+' を研究しました');}}const contract=e.target.closest('[data-accept-contract]');if(contract&&!activeContract){activeContract=contracts.find(k=>k.id===contract.dataset.acceptContract)||null;if(activeContract){saveCareer();renderContracts();toast('契約を受注しました');}}});
function panelMessage(title,msg){toast(title+' — '+msg.replaceAll('\n',' / '));}
$('#home').onclick=()=>{flight=false;setMode('center');};
renderCategories();drawPartsCatalogV2();
$('#part-categories').addEventListener('click',e=>{const b=e.target.closest('[data-part-category]');if(b){const chosen=b.dataset.partCategory;activePartCategory=activePartCategory===chosen?'すべて':chosen;renderCategories();drawPartsCatalogV2();}});
$('#part-search').addEventListener('input',drawPartsCatalogV2);$('#part-sort').addEventListener('change',drawPartsCatalogV2);
$('#part-list').addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(b){selectedPartId=b.dataset.part;$('#hint').textContent='設置モード：3D機体上の取り付けたい場所をクリック。Escでキャンセル。';toast('設置する場所を3D機体上でクリック');}});
$('#clear-craft').onclick=()=>{if(flight)return;parts.length=0;assemblyStage=0;layout();toast('機体を空にしました');};
$('#new-stage').onclick=()=>{if(flight)return;assemblyStage++;$('#stage-build-label').textContent='組立ステージ '+assemblyStage;toast('新しい組立ステージ '+assemblyStage);};
$('#stage-add-side').onclick=()=>{if(flight)return;assemblyStage++;$('#stage-build-label').textContent='組立ステージ '+assemblyStage;renderStages();toast('新しい組立ステージ '+assemblyStage);};
$('#save-craft').onclick=()=>{localStorage.setItem('space-craft-v1',JSON.stringify(parts.map(p=>({id:p.data.id,stage:p.stage,fuel:p.fuel,manualPosition:p.manualPosition,position:p.position? p.position.toArray():null}))));toast('機体を保存しました');};
$('#load-craft').onclick=()=>{try{const a=JSON.parse(localStorage.getItem('space-craft-v1')||'[]');parts.length=0;a.forEach(v=>{const replacementId=legacyCatalogAliases[v.id]||v.id;const d=catalog.find(p=>p.id===replacementId);if(d)parts.push({data:d,stage:v.stage,fuel:v.fuel??d.fuel??0,manualPosition:!!v.manualPosition,position:v.position?new THREE.Vector3(...v.position):null});});assemblyStage=Math.max(0,...parts.map(p=>p.stage||0));layout();toast('機体を読み込みました');}catch{toast('保存データがありません');}};
renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='vab'||!selectedPartId)return;const rect=renderer.domElement.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();rocket.updateWorldMatrix(true,true);ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(rocket.children,true);let place=new THREE.Vector3(0,0,0),attachHit=null,attachRoot=null;for(const hit of hits){let obj=hit.object;while(obj&&!obj.userData.partItem)obj=obj.parent;if(obj){attachHit=hit;attachRoot=obj;break;}}if(attachHit){place.copy(rocket.worldToLocal(attachHit.point.clone()));const normal=attachHit.face?attachHit.face.normal.clone().transformDirection(attachHit.object.matrixWorld):new THREE.Vector3(0,1,0);const localNormal=normal.transformDirection(rocket.matrixWorld.clone().invert());const selectedData=catalog.find(p=>p.id===selectedPartId);place.addScaledVector(localNormal,Math.max(.18,selectedData?.radius||.3)*.72);}else if(parts.length){toast('機体の部品をクリックして取り付けてください');return;}addPart(selectedPartId,place);selectedPartId=null;$('#hint').textContent='部品を選択してから、機体の取り付け位置をクリック。';});
function startFlight(){if(!parts.length){toast('先に機体を組み立ててください');return;}aircraftCraft=parts.some(p=>p.data.type==='jet'||p.data.type==='rotor-blade');const hasPropulsion=parts.some(p=>['engine','booster','jet'].includes(p.data.type));if(!hasPropulsion){toast('ロケットエンジンまたはジェットエンジンが必要です');return;}const hasFuel=parts.some(p=>['tank','fuselage','booster'].includes(p.data.type)&&(p.fuel||0)>0);if(!hasFuel){toast('燃料タンクまたは燃料入り胴体が必要です');return;}if(aircraftCraft&&!parts.some(p=>p.data.type==='fuselage'||p.data.type==='cockpit')){toast('飛行機には胴体またはコックピットが必要です');return;}flight=true;flightPeakAltitude=0;paused=false;elapsed=0;stage=0;throttle=0;flightAccumulator=0;experimentLog=[];window._orb=false;sasEnabled=false;rcsEnabled=false;position.set(0,.002,0);velocity.set(0,0,0);if(aircraftCraft)velocity.set(0,0,.06);angular.set(0,0,0);attitude.identity();rocket.position.copy(position);rocket.quaternion.copy(attitude);rocket.visible=true;setMode('flight');toast(aircraftCraft?'航空機飛行開始 — Zで推力、姿勢操作で操縦':'発射準備完了 — Zでスロットル最大、Spaceで点火');}
$('#aircraft-mode').onclick=()=>{aircraftCraft=!aircraftCraft;activePartCategory=aircraftCraft?'航空機':'すべて';renderCategories();drawPartsCatalogV2();layout();setMode('vab');$('#aircraft-mode').classList.toggle('active',aircraftCraft);$('#aircraft-mode').textContent=aircraftCraft?'✈ 航空機組立中':'🚀 ロケット組立中';toast(aircraftCraft?'航空機組立モード：航空機パーツを表示':'ロケット組立モード：全パーツを表示');};
$('#launch').onclick=startFlight;$('#stage-next').onclick=()=>{if(flight)activateStage();};function runScienceExperiment(){if(!flight){toast('飛行中に実験できます');return;}const instruments=parts.filter(p=>['pod','probe','science'].includes(p.data.type));if(!instruments.length){toast('実験装置・プローブ・乗員ポッドが必要です');return;}const altitude=position.clone().sub(bodyCenter).length()-BODY.radius;const situation=altitude>=70?'宇宙空間':altitude>=10?'高高度大気圏':'低高度・地表';if(experimentLog.includes(situation)){toast('この飛行状況の実験は完了しています');return;}const scienceParts=parts.filter(p=>p.data.type==='science').length;const reward=(situation==='宇宙空間'?10:situation==='高高度大気圏'?6:3)+scienceParts*5;experimentLog.push(situation);science+=reward;saveCareer();recalc();toast(situation+'の実験データを回収：科学 +'+reward);}
$('#science-experiment').onclick=runScienceExperiment;$('#map-toggle').onclick=()=>{map=!map;toast(map?'軌道マップ表示（M）':'飛行ビュー');};
let keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='Escape'&&selectedPartId){selectedPartId=null;toast('部品設置をキャンセル');}if(e.key==='Escape'&&mode==='flight'){flight=false;throttle=0;setMode('center');toast('宇宙センターへ戻りました');}if(e.code==='Space'&&flight){e.preventDefault();activateStage();}if(e.key.toLowerCase()==='z')throttle=1;if(e.key.toLowerCase()==='x')throttle=0;if(e.key.toLowerCase()==='t'){sasEnabled=!sasEnabled;toast('SAS '+(sasEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='r'){rcsEnabled=!rcsEnabled;toast('RCS '+(rcsEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='p'&&flight){const alt=position.clone().sub(bodyCenter).length()-BODY.radius,speed=velocity.length()*1000,chutes=parts.filter(p=>p.data.type==='chute');if(!chutes.length)toast('パラシュートがありません');else if(alt>10||speed>250)toast('展開条件外：高度10 km以下・速度250 m/s以下が必要');else{chutes.forEach(p=>p.deployed=true);toast('パラシュートを展開しました');}}if(e.key.toLowerCase()==='m'&&flight){map=!map;}});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function activateStage(){const previous=stage;stage++;const hasSeparator=parts.some(p=>p.data.type==='decoupler'&&p.stage===previous);if(hasSeparator){for(let i=parts.length-1;i>=0;i--)if(parts[i].stage===previous)parts.splice(i,1);layout();}toast('ステージ '+stage+' 作動');}
const bodyCenter=new THREE.Vector3(0,-BODY.radius,0);
let properG=1,flightAccumulator=0,experimentLog=[];
function physicsStep(dt){
 if(!flight||paused)return;
 elapsed+=dt;const mins=Math.floor(elapsed/60),secs=Math.floor(elapsed%60);$('#mission-time').textContent='T+ '+String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
 if(keys.shift)throttle=Math.min(1,throttle+dt*.35);if(keys.control)throttle=Math.max(0,throttle-dt*.35);const controlGain=rcsEnabled?1.6:.8;const pitch=(keys.w?1:0)-(keys.s?1:0),yaw=(keys.d?1:0)-(keys.a?1:0),roll=(keys.e?1:0)-(keys.q?1:0);
 angular.x+=pitch*dt*controlGain;angular.y+=yaw*dt*controlGain;angular.z+=roll*dt*controlGain;angular.multiplyScalar(Math.exp(-dt*(sasEnabled?4.5:.8)));
 const dq=new THREE.Quaternion().setFromEuler(new THREE.Euler(angular.x*dt,angular.y*dt,angular.z*dt,'YXZ'));attitude.multiply(dq).normalize();
 const liquidTanks=parts.filter(p=>['tank','fuselage'].includes(p.data.type)&&p.stage<=stage&&p.fuel>0);const activeEngines=parts.filter(p=>['engine','booster','jet'].includes(p.data.type)&&p.stage<=stage&&(p.data.type==='booster'?p.fuel>0:liquidTanks.length>0));
 const totalThrustN=activeEngines.reduce((s,p)=>s+(p.data.thrust||0)*1000,0)*throttle;
 const massKg=Math.max(1,rocketMassKg(parts));
 const thrustDirection=new THREE.Vector3(0,aircraftCraft?0:1,aircraftCraft?1:0).applyQuaternion(attitude).normalize();
 const liquidMdot=activeEngines.filter(p=>p.data.type==='engine'||p.data.type==='jet').reduce((s,p)=>s+(p.data.thrust||0)*1000/(Math.max(1,p.data.isp||320)*G0),0)*throttle,solidMdot=activeEngines.filter(p=>p.data.type==='booster').reduce((s,p)=>s+(p.data.thrust||0)*1000/(Math.max(1,p.data.isp||220)*G0),0)*throttle,mdot=liquidMdot+solidMdot;
 const acceleration=(pos,vel)=>{
   const grav=gravityAcceleration(pos,BODY.mu,bodyCenter);
   const aero=aerodynamicAcceleration(pos,vel,{x:thrustDirection.x,y:thrustDirection.y,z:thrustDirection.z},parts,massKg,bodyCenter);
   return {x:grav.x+thrustDirection.x*totalThrustN/massKg/1000+aero.x,y:grav.y+thrustDirection.y*totalThrustN/massKg/1000+aero.y,z:grav.z+thrustDirection.z*totalThrustN/massKg/1000+aero.z};
 };
 properG=(totalThrustN/massKg)/G0;
 const state=rk4Step({x:position.x,y:position.y,z:position.z},{x:velocity.x,y:velocity.y,z:velocity.z},dt,acceleration);
 position.set(state.position.x,state.position.y,state.position.z);velocity.set(state.velocity.x,state.velocity.y,state.velocity.z);
 if(mdot>0){let liquidBurn=liquidMdot*dt;for(const tank of liquidTanks){const take=Math.min(tank.fuel,liquidBurn);tank.fuel-=take;liquidBurn-=take;if(liquidBurn<=1e-8)break;}let solidBurn=solidMdot*dt;for(const booster of activeEngines.filter(p=>p.data.type==='booster')){const take=Math.min(booster.fuel,solidBurn);booster.fuel-=take;solidBurn-=take;if(solidBurn<=1e-8)break;}fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);if((maxFuel?Math.round(fuel/maxFuel*100):0)!==stageUiFuelPercent)renderStages();}
 const radial=position.clone().sub(bodyCenter),radius=radial.length(),altitude=radius-BODY.radius;
 if(altitude>flightPeakAltitude)flightPeakAltitude=altitude;if(altitude<=0){position.copy(bodyCenter).add(radial.normalize().multiplyScalar(BODY.radius));const normal=position.clone().sub(bodyCenter).normalize(),impact=velocity.dot(normal);if(impact< -8){flight=false;toast('地表衝突 — 機体が破損しました');}else{velocity.addScaledVector(normal,-Math.min(0,impact));velocity.multiplyScalar(.985);if(flight&&flightPeakAltitude>=1){flight=false;throttle=0;const earnedStars=flightPeakAltitude>=70?5:flightPeakAltitude>=10?2:1;crewMembers.forEach(k=>{k.stars=Math.max(1,Math.min(5,Math.max(1,k.stars??1)+earnedStars));k.stupidity=undefined;k.bravery=undefined;syncCrewAbilities(k);});saveCareer();toast(flightPeakAltitude>=70?'宇宙飛行から帰還！乗組員の経験が★5になりました':flightPeakAltitude>=10?'高高度飛行から帰還！乗組員の経験が上がりました':'飛行回収成功！乗組員の経験が上がりました');}}}
 rocket.position.copy(position);rocket.quaternion.copy(attitude);for(const part of parts){if(part.mesh){const plume=part.mesh.getObjectByName('engine-flame');if(plume){plume.visible=flight&&throttle>0&&activeEngines.includes(part);plume.scale.setScalar(.5+throttle*1.4);}}}
 const forward=new THREE.Vector3(0,0,1).applyQuaternion(attitude),heading=(Math.atan2(forward.x,forward.z)*180/Math.PI+360)%360;$('#heading').textContent='HDG '+Math.round(heading).toString().padStart(3,'0')+'°';const attitudeEuler=new THREE.Euler().setFromQuaternion(attitude,'YXZ');$('.navball-sky').style.transform='rotate('+(-attitudeEuler.z*180/Math.PI)+'deg)';
 const elements=orbitalElements(position,velocity,BODY.mu,bodyCenter),alt=Math.max(0,elements.altitude),spd=elements.speed,verticalSpeed=velocity.dot(position.clone().sub(bodyCenter).normalize());
 if(activeContract&&(activeContract.orbit?(elements.periapsisAltitude>=70&&elements.apoapsisAltitude>=100):alt>=activeContract.altitude)){funds+=activeContract.reward;science+=activeContract.science;toast('契約達成：'+activeContract.name+'　報酬 ₡'+activeContract.reward.toLocaleString());activeContract=null;saveCareer();recalc();if(mode==='contracts')renderContracts();}
 $('#altitude').textContent='高度 '+Math.round(alt*1000).toLocaleString()+' m';$('#speed').textContent='速度 '+(spd*1000).toFixed(1)+' m/s';$('#vertical').textContent='垂直速度 '+(verticalSpeed*1000).toFixed(1)+' m/s';$('#throttle').textContent='スロットル '+Math.round(throttle*100)+'%';$('#fuel').textContent='燃料 '+(maxFuel?Math.round(fuel/maxFuel*100):0)+'%';$('#stage-label').textContent='ステージ '+stage;$('#gforce').textContent='G '+properG.toFixed(1);
 $('#apo').textContent='遠点 '+(Number.isFinite(elements.apoapsisAltitude)?Math.round(elements.apoapsisAltitude*1000).toLocaleString()+' m':'脱出軌道');$('#peri').textContent='近点 '+(Number.isFinite(elements.periapsisAltitude)?Math.round(elements.periapsisAltitude*1000).toLocaleString()+' m':'--');
 const atmospheric=THREE.MathUtils.clamp(1-alt/BODY.atmosphereHeight,0,1);scene.background.set(new THREE.Color(0x030914).lerp(new THREE.Color(0x8298a6),atmospheric));
 const chaseOffset=map?new THREE.Vector3(0,.18,.001):new THREE.Vector3(.022,.014,.027);camera.position.lerp(position.clone().add(chaseOffset),.035);camera.lookAt(position.clone().add(new THREE.Vector3(0,.005,0)));
 if(alt>100&&!window._orb){window._orb=true;toast('大気圏外へ到達');science+=5;$('#science').textContent=science;saveCareer();}
}
function physics(dt){if(!flight||paused)return;flightAccumulator+=Math.min(dt,.1);const fixed=1/120;let steps=0;while(flightAccumulator>=fixed&&steps<12){physicsStep(fixed);flightAccumulator-=fixed;steps++;}if(steps===12)flightAccumulator=0;}
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.04,(now-last)/1000);last=now;physics(dt);if(!flight&&mode==='center'){rocket.rotation.y=now*.00015;}if(mode==='vab'){rocket.rotation.y=0;}renderer.render(scene,camera);}requestAnimationFrame(tick);
$('#funds-toggle').onclick=()=>{fundsUnlimited=!fundsUnlimited;saveCareer();recalc();toast(fundsUnlimited?'資金を無制限にしました':'通常の資金制に戻しました');};
setMode('center');layout();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});