import * as THREE from 'three';
import {createPartModel} from './parts-models.js?v=20261125-wheelspin-01';
import {additionalParts} from './parts-inventory.js?v=20261124-rollback-01';
import {BODY,G0,gravityAcceleration,atmosphericDensity,orbitalElements,rk4Step,deltaV,rocketMassKg} from './physics/orbital.js';
import {aerodynamicAcceleration} from './physics/aerodynamics.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],toast=m=>{let t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)};
const scene=new THREE.Scene();
const crewStage=new THREE.Group();crewStage.visible=false;scene.add(crewStage);
function makeCrewFigure(member,index){
 const mat=(color,roughness=.62,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const root=new THREE.Group(),legParts=[],armParts=[];
 const skin=mat(0x8eae43,.84),eyeWhite=mat(0xf5f4e9,.18),pupilMat=mat(0x18251d,.2),suit=mat(0xe6e5d9,.76),suitShade=mat(0xb9c1bc,.72),orange=mat(0xd87932,.62),bootMat=mat(0x4b5558,.78),rubber=mat(0x252d30,.9),badgeMat=mat(index%3===0?0x3f7190:index%3===1?0x9b563e:0x5d7850,.7);
 const sphere=(parent,r,material,x,y,z,scale)=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,40,28),material);mesh.position.set(x,y,z);if(scale)mesh.scale.set(...scale);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const box=(parent,w,h,d,material,x,y,z)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const segment=(parent,length,radius,material)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius*.9,radius,length,28),material);mesh.position.y=-length/2;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 // Short, sturdy suit silhouette with separate hip, knee and ankle pivots.
 const pelvis=new THREE.Group();pelvis.position.y=.92;root.add(pelvis);
 sphere(pelvis,.31,suit,0,0,0,[1.18,.72,.92]);
 for(const side of [-1,1]){
  const hip=new THREE.Group();hip.position.set(side*.235,-.08,0);pelvis.add(hip);
  sphere(hip,.17,suit,0,-.04,0,[1,1.12,.96]);
  segment(hip,.38,.145,suit);
  const knee=new THREE.Group();knee.position.y=-.38;hip.add(knee);
  sphere(knee,.145,suitShade,0,0,0,[1,.9,.92]);
  segment(knee,.37,.128,suit);
  const ankle=new THREE.Group();ankle.position.set(0,-.36,.015);knee.add(ankle);
  const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.09,28),orange);cuff.rotation.x=Math.PI/2;cuff.position.set(0,.015,.005);ankle.add(cuff);
  const boot=new THREE.Group();boot.position.set(0,-.075,.095);ankle.add(boot);
  box(boot,.275,.19,.36,bootMat,0,-.015,.045);
  box(boot,.28,.055,.32,rubber,0,-.112,.045);
  sphere(boot,.14,suitShade,0,.025,.19,[1,.62,.75]);
  legParts.push({hip,knee,ankle,side});
 }
 // Suit torso, panel, webbing, seams and compact life-support pack.
 const torso=new THREE.Group();torso.position.y=1.42;root.add(torso);
 const torsoMesh=new THREE.Mesh(new THREE.CapsuleGeometry(.37,.48,7,20),suit);torsoMesh.scale.set(1.08,1,.84);torsoMesh.castShadow=true;torsoMesh.receiveShadow=true;torso.add(torsoMesh);
 box(torso,.43,.34,.075,suitShade,0,-.035,.325);
 box(torso,.22,.105,.025,badgeMat,0,.045,.372);
 box(torso,.12,.07,.03,orange,0,-.17,.375);
 // Shoulder-to-waist suit seams and harness strips.
 for(const side of [-1,1]){
  const strap=box(torso,.055,.62,.035,suitShade,side*.255,.02,.315);strap.rotation.z=side*.12;
  box(torso,.07,.12,.045,orange,side*.29,.24,.31);
 }
 const pack=new THREE.Group();pack.position.set(0,.015,-.34);torso.add(pack);
 box(pack,.55,.72,.34,suitShade,0,0,0);
 box(pack,.42,.13,.36,orange,0,.32,0);
 box(pack,.42,.12,.035,bootMat,0,-.22,.18);
 for(const side of [-1,1])box(pack,.1,.42,.37,bootMat,side*.25,-.02,0);
 const collar=new THREE.Mesh(new THREE.TorusGeometry(.32,.085,10,28),orange);collar.position.set(0,.43,0);collar.rotation.x=Math.PI/2;collar.castShadow=true;torso.add(collar);
 // Fully articulated arms: shoulder -> elbow -> wrist -> glove.
 for(const side of [-1,1]){
  sphere(root,.19,suit,side*.49,1.67,0,[1,.95,.95]);
  const shoulder=new THREE.Group();shoulder.position.set(side*.51,1.66,0);root.add(shoulder);
  segment(shoulder,.39,.145,suit);
  const elbow=new THREE.Group();elbow.position.set(0,-.39,.025);shoulder.add(elbow);
  sphere(elbow,.135,suitShade,0,0,0,[1,.92,.92]);
  segment(elbow,.34,.125,suit);
  const wrist=new THREE.Group();wrist.position.set(0,-.33,.025);elbow.add(wrist);
  const wristRing=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.075,28),orange);wristRing.rotation.x=Math.PI/2;wrist.add(wristRing);
  sphere(wrist,.145,suitShade,0,-.09,.035,[.94,.9,.9]);
  box(wrist,.17,.19,.19,suitShade,0,-.17,.08);
  armParts.push({shoulder,elbow,wrist,side});
 }
 // Capsule-like head volume: no cheek pads, no human-style cheek protrusions.
 const headPivot=new THREE.Group();headPivot.position.set(0,2.72,0);root.add(headPivot);
 const head=sphere(headPivot,.62,skin,0,.015,0,[.91,1.13,.88]);
 // A restrained short military-style hair cap, kept behind the face.
 const hairColors=[0x211b18,0x17191d,0x493020,0x30231d,0x9a733c,0x51413a];
 const hairMat=mat(hairColors[Math.abs(index)%hairColors.length],.9);
 sphere(headPivot,.565,hairMat,0,.53,-.055,[1.02,.30,.94]);
 const hairline=sphere(headPivot,.49,hairMat,0,.42,.27,[1.02,.13,.35]);
 hairline.rotation.x=-.08;
 // Unequal, protruding eyes are part of the head rig and therefore bob with it.
 const eyes=[];
 for(const side of [-1,1]){
  const eyeGroup=new THREE.Group();eyeGroup.position.set(side*.255,.095,.455);headPivot.add(eyeGroup);
  const size=side===-1?.255:.235;
  sphere(eyeGroup,size,eyeWhite,0,0,.035,[.94,1.05,.92]);
  sphere(eyeGroup,size*.39,pupilMat,side*.035,-.012,.245,[.95,1,.78]);
  sphere(eyeGroup,size*.12,mat(0xffffff,.12),side*.012,.075,.285);
  eyes.push(eyeGroup);
 }
 const mouthGroup=new THREE.Group();mouthGroup.position.set(0,-.39,.535);headPivot.add(mouthGroup);
 const mouthDark=mat(0x30120f,.76);
 const cavity=sphere(mouthGroup,.105,mouthDark,0,0,.02,[1.45,.48,.34]);
 const mouthLine=new THREE.Mesh(new THREE.TorusGeometry(.13,.018,6,20,Math.PI),mat(0x42632c,.82));mouthLine.position.set(0,-.025,.045);mouthLine.rotation.z=Math.PI;mouthGroup.add(mouthLine);
 root.scale.setScalar(.88);
 root.userData.walkParts={legs:legParts,arms:armParts,head:headPivot,eyes,mouth:{cavity,smile:mouthLine}};
 return root;
}
function rebuildCrewStage(){while(crewStage.children.length){const child=crewStage.children[0];crewStage.remove(child);child.traverse(o=>{if(o.geometry)o.geometry.dispose();});}crewMembers.forEach((member,index)=>{const figure=makeCrewFigure(member,index);figure.position.x=(index-(crewMembers.length-1)/2)*3.1;crewStage.add(figure);});}
scene.background=new THREE.Color(0x91b6ce);scene.fog=new THREE.Fog(0x91b6ce,210,720);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.0001,20000);camera.position.set(24,18,34);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);
function renderCrewPortraits(){
 const canvases=$('.crew-avatar');if(!canvases.length)return;
 const portraitWidth=288,portraitHeight=384;
 const target=new THREE.WebGLRenderTarget(portraitWidth,portraitHeight,{depthBuffer:true,stencilBuffer:false});
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
  const pixels=new Uint8Array(portraitWidth*portraitHeight*4);renderer.readRenderTargetPixels(target,0,0,portraitWidth,portraitHeight,pixels);
  canvas.width=portraitWidth;canvas.height=portraitHeight;
  const ctx=canvas.getContext('2d'),img=ctx.createImageData(portraitWidth,portraitHeight);
  for(let y=0;y<portraitHeight;y++)for(let x=0;x<portraitWidth;x++){const src=((portraitHeight-1-y)*portraitWidth+x)*4,dst=(y*portraitWidth+x)*4;img.data[dst]=pixels[src];img.data[dst+1]=pixels[src+1];img.data[dst+2]=pixels[src+2];img.data[dst+3]=pixels[src+3];}
  ctx.putImageData(img,0,0);portraitScene.remove(figure);
 }
 renderer.setRenderTarget(null);target.dispose();
}
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('#viewport').appendChild(renderer.domElement);
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;toast('3D表示を一時停止しました。復旧を待っています…');});renderer.domElement.addEventListener('webglcontextrestored',()=>{paused=false;last=performance.now();toast('3D表示が復旧しました');});
document.addEventListener('visibilitychange',()=>{last=performance.now();});
scene.add(new THREE.HemisphereLight(0xe5f0fb,0x76634e,1.55));const sun=new THREE.DirectionalLight(0xfff1dc,2.75);sun.position.set(-35,70,25);sun.castShadow=true;scene.add(sun);const skyFill=new THREE.DirectionalLight(0xc5e0f4,.62);skyFill.position.set(38,24,-42);scene.add(skyFill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshStandardMaterial({color:0x827b65,roughness:1,metalness:0}));ground.rotation.x=-Math.PI/2;ground.position.y=-.001;ground.receiveShadow=true;scene.add(ground);
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
// Center circular pad removed; keep the central campus area clear.
const runway=new THREE.Mesh(new THREE.BoxGeometry(16,.16,180),new THREE.MeshStandardMaterial({color:0x414b50,roughness:.95}));runway.position.set(72,.03,5);campus.add(runway);
for(let i=0;i<18;i++){const x=-82+(i%9)*20,z=-65+Math.floor(i/9)*145;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2.5,7),new THREE.MeshStandardMaterial({color:0x69503b}));trunk.position.set(x,1.25,z);campus.add(trunk);const crown=new THREE.Mesh(new THREE.ConeGeometry(1.7,4.5,8),new THREE.MeshStandardMaterial({color:0x355b48}));crown.position.set(x,4.3,z);campus.add(crown);}

// 独自デザインの低ポリ宇宙飛行士。組立棟と発射場に配置。
function makeCrew(){const g=new THREE.Group(),suit=new THREE.MeshStandardMaterial({color:0xd8d6c8,roughness:.75}),visor=new THREE.MeshStandardMaterial({color:0x263e4c,metalness:.55,roughness:.2}),skin=new THREE.MeshStandardMaterial({color:0x83a66b,roughness:.85});const body=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.55,4,8),suit);body.position.y=.85;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.29,12,10),skin);head.position.y=1.48;g.add(head);const helmet=new THREE.Mesh(new THREE.TorusGeometry(.3,.055,6,16),suit);helmet.position.y=1.48;g.add(helmet);const glass=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8,0,Math.PI*2,0,Math.PI/2),visor);glass.position.set(0,1.49,.17);g.add(glass);for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,.55,7),suit);arm.position.set(side*.38,.9,0);arm.rotation.z=side*.2;g.add(arm);const leg=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.55,7),suit);leg.position.set(side*.16,.28,0);g.add(leg);}g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
const crew=makeCrew();crew.position.set(4,0,7);campus.add(crew);

// 大型格納庫：鉄骨トラス、格子床、黄色い格納扉、照明、作業足場を独自モデルで構成
const hangar=new THREE.Group();hangar.scale.set(.0018,.0022,.0018);scene.add(hangar);

const hangarCrewGroup=new THREE.Group();hangar.add(hangarCrewGroup);
const hangarMat=(color,metalness=.45,roughness=.72)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const steel=hangarMat(0x657782,.72,.62),steelLight=hangarMat(0xb1bdc1,.68,.48),darkSteel=hangarMat(0x34434b,.62,.58),yellow=hangarMat(0xc5c9c5,.28,.72);
const concreteCanvas=document.createElement('canvas');concreteCanvas.width=256;concreteCanvas.height=256;
const concreteCtx=concreteCanvas.getContext('2d'),concretePixels=concreteCtx.createImageData(256,256);
for(let i=0;i<concretePixels.data.length;i+=4){const n=112+Math.floor(Math.random()*30);concretePixels.data[i]=n;concretePixels.data[i+1]=n+2;concretePixels.data[i+2]=n+3;concretePixels.data[i+3]=255;}
concreteCtx.putImageData(concretePixels,0,0);
const concreteTexture=new THREE.CanvasTexture(concreteCanvas);concreteTexture.wrapS=concreteTexture.wrapT=THREE.RepeatWrapping;concreteTexture.repeat.set(10,12);concreteTexture.colorSpace=THREE.SRGBColorSpace;
const floorMat=new THREE.MeshStandardMaterial({color:0xb0b0aa,map:concreteTexture,roughness:.98,metalness:0});
function hBox(w,h,d,x,y,z,mat,parent=hangar){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function hBeam(a,b,r=.42,mat=steel){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=vb.clone().sub(va),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),6),mat);m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;hangar.add(m);}
hBox(230,.8,270,0,-.65,0,floorMat);
/* Concrete floor with restrained joints, painted safety lanes and assembly-bay markings. */
const floorJoint=hangarMat(0x646d70,.02,.99),floorWhite=hangarMat(0xd9d8ce,.02,.88),floorYellow=hangarMat(0xd1a12e,.08,.82),floorStencil=hangarMat(0x929895,.02,.95);
hBox(.12,.012,258,0,-.244,0,floorJoint);hBox(220,.012,.12,0,-.244,-64,floorJoint);hBox(220,.012,.12,0,-.244,64,floorJoint);
for(const [cx,cz,w,d] of [[0,0,76,104],[-69,37,42,54],[69,-35,42,62]]){
 hBox(w,.022,1.15,cx,-.224,cz-d/2,floorWhite);hBox(w,.022,1.15,cx,-.224,cz+d/2,floorWhite);
 hBox(1.15,.022,d,cx-w/2,-.224,cz,floorWhite);hBox(1.15,.022,d,cx+w/2,-.224,cz,floorWhite);
}
hBox(7,.025,68,-49,-.218,2,floorYellow);hBox(7,.025,68,49,-.218,-4,floorYellow);
hBox(30,.025,1.2,0,-.218,-58,floorYellow);hBox(30,.025,1.2,0,-.218,58,floorYellow);
for(const [x,z] of [[-78,-58],[78,58],[-78,58],[78,-58]])hBox(13,.012,8,x,-.231,z,floorStencil);
for(let y of [18,48,78,108,138,150]){
 hBeam([-112,y,-95],[112,y,-95],.9,steelLight);
 hBeam([-112,y,95],[112,y,95],.9,steelLight);
}
/* Tall roof trusses and cross-bracing keep the assembly hall enclosed overhead. */
for(let z=-88;z<=66;z+=22){
 hBeam([-112,148,z],[0,164,z],.72,steelLight);hBeam([0,164,z],[112,148,z],.72,steelLight);
 hBeam([-112,148,z],[0,148,z],.48,steel);hBeam([0,148,z],[112,148,z],.48,steel);
 hBeam([-112,148,z],[0,164,z+22],.32,steel);hBeam([112,148,z],[0,164,z+22],.32,steel);
}
for(let x=-105;x<105;x+=21){
 hBeam([x,12,-95],[x+21,34,-95],.55,steel);hBeam([x+21,12,-95],[x,34,-95],.55,steel);
 hBeam([x,56,-95],[x+21,78,-95],.55,steel);hBeam([x+21,56,-95],[x,78,-95],.55,steel);
 hBeam([x,12,95],[x+21,34,95],.55,steel);hBeam([x+21,12,95],[x,34,95],.55,steel);
}
for(let x=-42;x<=42;x+=14){hBox(13,128,1.8,x,65,-94,yellow);for(let y=8;y<128;y+=16)hBox(12,.7,2,x,y,-92,darkSteel);}
hBox(190,5,5,0,140,-94,darkSteel);hBox(190,4,5,0,3,-94,yellow);
for(let z=-75;z<=75;z+=25){hBox(1.4,1.4,150,-112,1,z,steel);hBox(1.4,1.4,150,112,1,z,steel);}
for(let x of [-55,55])for(let z of [-30,30]){const lamp=new THREE.Mesh(new THREE.BoxGeometry(8,.8,3),new THREE.MeshBasicMaterial({color:0xffe4b5}));lamp.position.set(x,76,z);hangar.add(lamp);}
/* Aircraft workshop markings and the runway outside the hangar doors */
const runwayMat=hangarMat(0x343d42,.15,.95),runwayLine=hangarMat(0xe5dfc7,.05,.85),taxiYellow=hangarMat(0xd2a53c,.2,.8);
hBox(68,.18,300,0,-.12,-245,runwayMat);
hBox(2,.025,290,-34,-.015,-245,runwayLine);hBox(2,.025,290,34,-.015,-245,runwayLine);
for(let z=-115;z>-385;z-=22)hBox(1.3,.03,10,0,-.015,z,runwayLine);
hBox(74,.025,2,-1,-.015,-105,taxiYellow);hBox(74,.025,2,-1,-.015,-385,taxiYellow);
/* Yellow aircraft service bay outline on the hangar floor */
hBox(26,.035,1.1,0,-.19,-13,taxiYellow);hBox(26,.035,1.1,0,-.19,13,taxiYellow);
hBox(1.1,.035,26,-13,-.19,0,taxiYellow);
hBox(1.1,.035,26,13,-.19,0,taxiYellow);

/* Industrial gantry crane, catwalks and maintenance buildings */
const craneYellow=hangarMat(0xc18d2d,.62,.48),glassMat=hangarMat(0x6d9ba8,.38,.22),serviceMat=hangarMat(0x414d55,.5,.78);
for(const z of [-54,48]){
 hBeam([-100,82,z],[100,82,z],1.25,craneYellow);
 hBeam([-100,78,z],[100,78,z],.75,darkSteel);
 for(const x of [-98,98]){hBox(3,15,4,x,70,z,craneYellow);hBox(7,2,7,x,62,z,steelLight);}
}
hBox(18,3,15,-12,80,48,craneYellow);hBox(10,2,10,-12,77,48,darkSteel);
hBeam([-12,76,48],[-12,47,48],.28,steelLight);hBox(2,2,2,-12,46,48,craneYellow);
for(const side of [-1,1]){
 const x=side*83;
 for(const y of [28,53]){
  hBox(8,1.1,174,x,y,0,steelLight);
  for(const z of [-87,-62,-37,-12,13,38,63,87]){
   hBeam([x-4,y+1,z],[x-4,y+5,z],.13,steelLight);hBeam([x+4,y+1,z],[x+4,y+5,z],.13,steelLight);
   hBeam([x-4,y+5,z],[x+4,y+5,z],.2,craneYellow);
  }
 }
 for(const z of [-67,-18,31,70]){
  hBox(18,15,22,side*101,8,z,serviceMat);
  hBox(18.4,1.2,22.4,side*101,16,z,steelLight);
  hBox(.25,7,10,side*91.8,8,z,glassMat);
  hBox(.35,8,8,side*91.65,4,z,craneYellow);
  hBox(18.5,.45,1,side*101,1,z-11.2,craneYellow);
 }
 for(const z of [-48,0,48]){
  hBeam([x,29,z],[x,52,z],.2,steelLight);
  for(let y=31;y<52;y+=3)hBeam([x-.8,y,z],[x+.8,y,z],.13,craneYellow);
 }
}
for(let i=0;i<10;i++){
 const x=(i%5)*24-48,z=i<5?68:-72;
 hBox(5,6,5,x,2.7,z,serviceMat);hBox(5.3,.45,5.3,x,5.9,z,steelLight);
 hBox(3.8,2.8,.12,x,2.8,z+2.56,glassMat);
}
for(const x of [-64,64])for(const z of [-82,82]){
 hBox(10,2,6,x,1,z,craneYellow);
 for(const wx of [-4,4])for(const wz of [-2,2]){
  const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.55,12),darkSteel);
  wheel.rotation.z=Math.PI/2;wheel.position.set(x+wx,.8,z+wz);wheel.castShadow=true;hangar.add(wheel);
 }
 hBox(5,3.2,4,x,3.3,z,glassMat);
}
/* KSP1-inspired VAB envelope: flush wall skins, X-braced panels and a full-width lift door. */
const vabGlass=new THREE.MeshStandardMaterial({color:0x7898a6,metalness:.22,roughness:.3,transparent:true,opacity:.48,side:THREE.DoubleSide,depthWrite:false});
const vabWall=hangarMat(0x59666d,.42,.78),vabDoor=hangarMat(0xb28a36,.38,.62),vabBrace=hangarMat(0x3e4b52,.48,.72),vabSeam=hangarMat(0x77838a,.42,.72);
function hWallBrace(a,b){
 const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),delta=vb.clone().sub(va),length=delta.length();
 const brace=new THREE.Mesh(new THREE.BoxGeometry(length,.72,.24),vabBrace);
 brace.position.copy(va.add(vb).multiplyScalar(.5));brace.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),delta.normalize());
 brace.castShadow=true;brace.receiveShadow=true;hangar.add(brace);
}
for(const side of [-1,1]){
 const face=side*110.67;
 hBox(.9,76,184,side*111.2,39,0,vabWall);hBox(.9,35,184,side*111.2,132.5,0,vabWall);
 hBox(.55,34,184,side*110.65,94,0,vabGlass);
 for(let z=-92;z<=92;z+=23)hBox(.28,34,.48,side*110.67,94,z,steelLight);
 hBox(.28,.65,184,side*110.67,77,0,steelLight);hBox(.28,.65,184,side*110.67,111,0,steelLight);
 for(let z=-80;z<=80;z+=23){
  hWallBrace([face,5,z-10],[face,72,z+10]);hWallBrace([face,5,z+10],[face,72,z-10]);
  hBox(.26,.55,19,side*110.67,5,z,vabSeam);
  hWallBrace([face,116,z-10],[face,148,z+10]);hWallBrace([face,116,z+10],[face,148,z-10]);
 }
}
hBox(224,150,1.1,0,75,-96,vabWall);hBox(92,132,1.25,0,69,-96,vabDoor);
for(let x=-42;x<=42;x+=14)hBox(1.1,128,1.5,x,69,-95.2,steelLight);
for(let y=13;y<=125;y+=16)hBox(90,.75,1.5,0,y,-95.2,steelLight);
for(const side of [-1,1])for(let x=side<0?-108:94;side<0?x<=-48:x<=108;x+=20){
 hWallBrace([x,8,-95.15],[x+18,68,-95.15]);hWallBrace([x,8,-95.15],[x-2,68,-95.15]);
}
hBox(224,22,.5,0,137,-95.25,vabGlass);
for(let x=-105;x<=105;x+=21)hBox(.35,22,.8,x,137,-95.1,steelLight);
for(let z=-77;z<=55;z+=44)for(const side of [-1,1]){const pane=new THREE.Mesh(new THREE.BoxGeometry(34,.35,28),vabGlass);pane.position.set(side*54,151.2,z);hangar.add(pane);}
const rocket=new THREE.Group();rocket.scale.setScalar(.001);scene.add(rocket);const parts=[],debrisAssemblies=[];let mode='vab',gameMode='career',aircraftCraft=false,funds=25000,fundsUnlimited=true,science=0,stage=0,assemblyStage=0,stageUiFuelPercent=-1,throttle=0,flight=false,flightPeakAltitude=0,paused=false,sasEnabled=false,rcsEnabled=false,elapsed=0,craftMass=0,fuel=0,maxFuel=0,thrust=0,position=new THREE.Vector3(0,2,0),velocity=new THREE.Vector3(),attitude=new THREE.Quaternion(),angular=new THREE.Vector3(),last=performance.now(),map=false;
const catalog=[
{id:'pod',name:'Mk1 コマンドポッド',type:'pod',tech:'basic',mass:0.84,cost:600,crew:1,icon:'◉',height:2,radius:.9},
{id:'probe',name:'プローブコア',type:'probe',tech:'basic',mass:.1,cost:450,icon:'⌖',height:.7,radius:.65},
{id:'tank-s',name:'FL-T100 燃料タンク',type:'tank',tech:'basic',mass:.0725,fuel:490,cost:150,icon:'▤',height:.5,radius:.625},
{id:'tank-m',name:'FL-T400 燃料タンク',type:'tank',tech:'basic',mass:.25,fuel:2000,cost:500,icon:'▤',height:2,radius:.625},
{id:'tank-l',name:'X200-16 燃料タンク',type:'tank',tech:'heavy',mass:1,fuel:8000,cost:1550,icon:'▤',height:2.5,radius:1.25},
{id:'engine-s',name:'LV-909 液体エンジン',type:'engine',tech:'basic',mass:.5,cost:390,thrust:60,seaLevelThrust:14.783,isp:345,seaLevelIsp:85,icon:'◈',height:1.3,radius:.65},
{id:'engine-m',name:'LV-T45 スウィーベル液体エンジン',type:'engine',tech:'basic',mass:1.5,cost:1200,thrust:215,seaLevelThrust:167.969,isp:320,seaLevelIsp:250,icon:'◈',height:2,radius:.9},
{id:'engine-l',name:'RE-M3 メインセイル液体エンジン',type:'engine',tech:'heavy',mass:6,cost:13000,thrust:1500,seaLevelThrust:1379.03,isp:310,seaLevelIsp:285,icon:'◈',height:3,radius:1.5},
{id:'decoupler',name:'TD-12 デカプラー',type:'decoupler',tech:'basic',mass:.05,cost:400,icon:'⊖',height:.35,radius:.78},
{id:'booster',name:'RT-10 ハマー固体燃料ブースター',type:'booster',tech:'basic',mass:.75,cost:400,fuel:2810,thrust:227,seaLevelThrust:197.9,isp:195,seaLevelIsp:170,icon:'▥',height:3.5,radius:.55},
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
const partPreviewRenderers=new Map(),partPreviewModelCache=new Map();let partPreviewObserver=null,selectedPartId=null,sharedPreviewRenderer=null;const partPreviewQueue=[];let partPreviewQueueRaf=0;
function queuePartPreview(canvas,p){if(partPreviewRenderers.has(canvas)||partPreviewQueue.some(item=>item.canvas===canvas))return;partPreviewQueue.push({canvas,p});if(!partPreviewQueueRaf)partPreviewQueueRaf=requestAnimationFrame(renderNextPartPreview);}
function renderNextPartPreview(){partPreviewQueueRaf=0;let count=0;while(partPreviewQueue.length&&count<10){const item=partPreviewQueue.shift();if(item&&item.canvas.isConnected)renderOnePartPreview(item.canvas,item.p);count++;}if(partPreviewQueue.length)partPreviewQueueRaf=requestAnimationFrame(renderNextPartPreview);}
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
 const ctx=entry.snapshot.getContext('2d');if(ctx)ctx.drawImage(renderer.domElement,0,0,entry.snapshot.width,entry.snapshot.height);
 const target=canvas.getContext('2d');if(target)target.drawImage(entry.snapshot,0,0,canvas.width,canvas.height);
}
function showCachedPartPreview(entry,canvas){
 const ctx=canvas.getContext('2d');if(ctx)ctx.drawImage(entry.snapshot,0,0,canvas.width,canvas.height);
}
function disposePartPreview(canvas){const entry=partPreviewRenderers.get(canvas);if(entry){entry.hovered=false;entry.canvas=null;if(entry.raf)cancelAnimationFrame(entry.raf);entry.raf=0;}partPreviewRenderers.delete(canvas);}
function attachPartPreview(canvas,p,entry){
 entry.canvas=canvas;partPreviewRenderers.set(canvas,entry);canvas.draggable=false;
 const animate=now=>{if(!entry.hovered||!canvas.isConnected){entry.raf=0;return;}if(!entry.lastFrame)entry.lastFrame=now;const dt=Math.min(.05,(now-entry.lastFrame)/1000);entry.lastFrame=now;entry.model.rotation.y+=dt*.9;paintPartPreview(entry,canvas);entry.raf=requestAnimationFrame(animate);};
 canvas.addEventListener('pointerenter',()=>{entry.hovered=true;entry.lastFrame=0;if(!entry.raf)entry.raf=requestAnimationFrame(animate);});
 canvas.addEventListener('pointerleave',()=>{entry.hovered=false;entry.lastFrame=0;if(entry.raf){cancelAnimationFrame(entry.raf);entry.raf=0;}entry.model.rotation.copy(entry.originalRotation);paintPartPreview(entry,canvas);});
 canvas.addEventListener('pointerdown',e=>e.stopPropagation());
}
function renderOnePartPreview(canvas,p){
 if(partPreviewRenderers.has(canvas))return;
 try{
  let entry=partPreviewModelCache.get(p.id);
  if(entry){attachPartPreview(canvas,p,entry);showCachedPartPreview(entry,canvas);return;}
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x778894);scene.add(new THREE.HemisphereLight(0xeaf4ff,0x30383d,2.1));
  const key=new THREE.DirectionalLight(0xffedcf,3.2);key.position.set(3,5,4);scene.add(key);
  const fill=new THREE.DirectionalLight(0x9fc8e8,1.1);fill.position.set(-4,1,-3);scene.add(fill);
  const model=partMesh(p);scene.add(model);const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),sphere=box.getBoundingSphere(new THREE.Sphere());model.position.sub(center);
  const camera=new THREE.PerspectiveCamera(34,2,.01,1000),dist=Math.max(.7,sphere.radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))*.8194);camera.position.set(dist*.55,dist*.35,dist*.75);camera.lookAt(0,0,0);camera.far=dist*12;camera.updateProjectionMatrix();
  const originalRotation=model.rotation.clone(),snapshot=document.createElement('canvas');snapshot.width=232;snapshot.height=116;
  entry={scene,camera,model,originalRotation,snapshot,canvas:null,hovered:false,raf:0,lastFrame:0};partPreviewModelCache.set(p.id,entry);attachPartPreview(canvas,p,entry);paintPartPreview(entry,canvas);
 }catch(err){canvas.replaceWith(Object.assign(document.createElement('span'),{className:'part-preview-error',textContent:'3D'}));}
}
function renderPartPreviews(items){
 if(partPreviewObserver){partPreviewObserver.disconnect();partPreviewObserver=null;}
 partPreviewQueue.length=0;if(partPreviewQueueRaf){cancelAnimationFrame(partPreviewQueueRaf);partPreviewQueueRaf=0;}
 for(const [canvas] of partPreviewRenderers)disposePartPreview(canvas);
 const list=$('#part-list');list.innerHTML=list.innerHTML;
 const buttons=[...list.querySelectorAll('button[data-part]')];
 const previews=[];
 for(const button of buttons){const p=items.find(x=>x.id===button.dataset.part);const holder=button.querySelector('.part-icon');if(!p||!holder)continue;holder.innerHTML='<canvas class="part-preview-canvas" width="232" height="116" aria-label="'+p.name+' の回転可能な3Dモデル"></canvas>';const canvas=holder.firstElementChild;canvas.dataset.partId=p.id;previews.push({canvas,p});}
 // 画面内に入った部品だけ3D生成する。下に隠れた部品はスクロールされるまで処理しない。
 partPreviewObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   const canvas=entry.target,part=items.find(p=>p.id===canvas.dataset.partId);
   if(part){partPreviewObserver.unobserve(canvas);queuePartPreview(canvas,part);}
  }
 },{root:list,rootMargin:'140px 0px'});
 for(const item of previews){
  const cached=partPreviewModelCache.get(item.p.id);
  if(cached){attachPartPreview(item.canvas,item.p,cached);showCachedPartPreview(cached,item.canvas);}
  else partPreviewObserver.observe(item.canvas);
 }
}
function partHoverInfo(p){
 const types={
  pod:'有人宇宙船の操縦区画です。乗員が搭乗し、機体の指令・姿勢制御・帰還時の乗員保護を担います。有人飛行ではパラシュートや熱防護と組み合わせて使用します。',
  probe:'無人探査機の中枢となる制御装置です。操縦士を必要とせず、通信・電力を確保すれば遠隔から機体を制御できます。長期探査機や中継衛星の基礎になります。',
  tank:'ロケットエンジンへ供給する推進剤を貯蔵します。エンジンの燃料構成に合ったタンクを選び、機体の重心や必要な燃焼時間を考慮して配置してください。',
  engine:'推進剤を燃焼させ、高温・高速の排気を噴射して推力を得ます。離昇用の大推力型、上段用の高効率型など、飛行段階と機体重量に合わせた選定が重要です。',
  booster:'内部の固体推進剤を燃焼させて推力を発生します。点火後の出力調整や停止が難しいため、燃焼時間と分離タイミングを計画して主エンジンを補助します。',
  decoupler:'機体を段ごとに切り離すための分離装置です。分離後の部位が機体やエンジンに接触しないよう、取り付け位置と分離方向を確認してください。',
  fin:'大気中で空気の流れを受け、機体後部に復元力を生みます。ロケットの姿勢安定に役立ちますが、高速飛行では空力加熱や過大な空気抵抗にも注意が必要です。',
  chute:'大気圏内で傘体を展開し、空気抵抗によって降下速度を下げます。安全な展開高度と速度を設定し、着地時の機体重量に見合う数を搭載してください。',
  battery:'搭載機器へ電力を供給する蓄電装置です。夜間や日陰、太陽電池を展開できない飛行中も電力を維持できるよう、消費電力と飛行時間に応じて容量を確保します。',
  solar:'太陽光を電力へ変換する発電装置です。太陽に向けて展開すると発電効率を確保できます。惑星の夜側や機体・構造物の陰では発電量が低下します。',
  science:'飛行環境や天体表面のデータを取得する科学実験装置です。実験可能な環境や取得条件は装置ごとに異なります。探査計画に合わせて必要な実験機器を選びます。',
  cockpit:'航空機の操縦区画です。パイロットの搭乗スペースと前方視界を備え、滑走路からの離着陸や大気圏内の飛行に適しています。',
  fuselage:'航空機の胴体を構成する機体セクションです。コックピット・主翼・尾部を接続し、形式によっては燃料も搭載します。断面規格をそろえると空力的に滑らかな機体を組み立てられます。',
  wing:'揚力を発生させ、航空機の重量を支える主翼です。翼面積や取り付け位置は離着陸性能と飛行安定性に影響します。左右のバランスをそろえて配置してください。',
  tail:'尾翼は機体後部で飛行姿勢を安定させます。垂直尾翼は主に左右方向、水平尾翼は上下方向の安定性に関わります。',
  control:'エレボン・フラップ・方向舵などの可動翼です。操縦入力に応じて空気の流れを変え、機体のピッチ・ロール・ヨーを制御します。取り付け方向と制御軸を確認してください。',
  jet:'大気中の酸素を利用して燃料を燃焼させる航空機用エンジンです。真空では作動できないため、吸気口を確保し、ロケットエンジンとの併用や切り替えを計画してください。',
  intake:'ジェットエンジンへ大気を取り込む吸気装置です。エンジンの前方に配置し、飛行速度や機体形状に応じて十分な空気を取り込めるようにします。',
  gear:'滑走路や地表への着陸時に機体を支える脚部です。重心を支えられる位置に配置し、離陸時の安定性と着陸時の接地姿勢を確保してください。',
  airbrake:'展開して空気抵抗を増やし、降下・進入時の速度を抑える装置です。左右のバランスを取り、必要に応じて複数基を配置します。',
  docking:'軌道上で別の宇宙船やステーションと結合するための接続機構です。接続面の向きとサイズを合わせ、接近時には相対速度を十分に落としてドッキングしてください。',
  robotics:'ヒンジ・ピストン・サーボ・ローターなど、可動機構を構成する装置です。関節の接続順や可動範囲を設計し、展開式構造物やロボットアームなどに利用します。',
  'rotor-blade':'回転翼のブレードです。ローターやプロペラに取り付け、回転によって揚力または推力を発生させます。回転方向とブレードの取り付け角をそろえてください。',
  nosecone:'機体先端の空気抵抗を抑える整流部品です。ロケットや航空機の先端に取り付け、空気の流れを滑らかにして飛行中の抵抗を低減します。',
  payload:'人工衛星・探査機・貨物などを保護し、運搬するための部品です。フェアリングは上昇中の空力加熱や風圧から搭載物を守り、所定の高度で分離します。',
  battery:'電力を蓄え、搭載機器へ供給する装置です。'
 };
 const family={
  'stack decoupler':'機体の上下段を軸方向に分離します。分離後に上段が下段へ接触しないよう、エンジン停止と分離の順序を調整してください。',
  'separator':'接続された複数の機体を分離します。通常の段間分離だけでなく、複数の補助ブースターを同時に切り離す構成にも使用できます。',
  'radial decoupler':'機体側面に補助ロケットや外部タンクを取り付け、飛行中に横方向へ切り離すための装置です。左右対称に配置すると分離時の姿勢変化を抑えられます。',
  'docking port':'同規格のドッキングポートと接続し、軌道上で機体を結合します。接続面を進行方向に向け、相手側のポートと正対させてください。',
  'grabbing unit':'ドッキングポートを備えない対象物を把持するための機構です。小惑星や漂流物などへの接近・捕獲作業に使用します。',
  'fairing':'上昇中の空気抵抗や空力加熱から衛星・探査機を保護します。搭載物を覆う形状に組み立て、十分に大気が薄くなってから分離します。',
  'cargo bay':'内部に衛星や貨物を格納し、大気圏内の飛行中は扉を閉じて保護します。軌道上や目的地で扉を開き、搭載物を展開・放出できます。',
  'service bay':'内部機器を外部環境から保護する収納区画です。バッテリーや小型装置などを格納し、必要なときに扉を開いてアクセスします。',
  'heat shield':'大気圏再突入時に機体前面を高温から守る耐熱部品です。熱防護面を進行方向へ向け、十分な遮熱面積を確保してください。',
  'radiator':'機器や推進システムで発生した熱を宇宙空間へ放出します。熱源と接続し、周囲を遮られない位置へ展開すると放熱しやすくなります。',
  'solar panel':'展開式の太陽電池パネルです。収納状態で打ち上げ、軌道上で展開して発電します。太陽方向と機体の影を考慮して配置してください。',
  'landing leg':'着陸時の衝撃を吸収し、機体を地表に保持する脚部です。着陸時の重量と重心を支えられるよう、複数本を均等に配置してください。',
  'wheel':'地表を走行するための車輪です。車軸の向きと操舵・駆動輪の配置を確認し、重心を低く保つと rover の走行が安定します。',
  'mining drill':'天体表面の資源を掘削する装置です。採掘対象へ接地させ、必要な電力と運用条件を満たした状態で使用します。',
  'isru':'採掘した資源を推進剤などへ加工する設備です。採掘装置や資源貯蔵タンクと組み合わせ、現地での補給拠点を構築できます。',
  'parachute':'大気圏内で減速・着陸するための回収装置です。展開条件を適切に設定し、機体重量に応じた数を搭載してください。',
  'airlock':'乗員が宇宙船や施設の外へ出入りするための気密区画です。船内と外部環境を隔て、船外活動の出入口として使用します。',
  'robotic hinge':'接続した構造物を指定した軸の周りに回転させます。展開式パネルや折りたたみ構造の関節として使用します。',
  'hydraulic cylinder':'直線方向に伸縮する駆動装置です。アームや脚部などを押し出したり引き込んだりする機構を構成します。',
  'rotor':'回転軸を駆動する装置です。ブレードを取り付けて回転翼機やプロペラ機の推進機構を構成します。'
 };
 const brands=['Kerbodyne','Rockomax','Probodobodyne','Mk1','Mk2','Mk3','FL-','LV-','OX-','Z-','PPD-','EAS-','Oscar','Stayputnik','RC-','PB-','Mainsail'];
 const maker=brands.find(b=>p.name.startsWith(b))||'汎用パーツ';
 const familyText=family[p.partFamily];
 const lines=[p.name,'メーカー／シリーズ：'+maker,'重量：'+(p.mass??'—')+' t'];
 if(p.thrust!=null)lines.push('最大推力：'+p.thrust+' kN');
 if(p.isp!=null)lines.push('比推力（Isp）：'+p.isp+' s');
 if(p.fuel!=null)lines.push('推進剤容量：'+p.fuel);
 if(p.crew!=null)lines.push('搭乗定員：'+p.crew+' 名');
 if(p.height!=null)lines.push('全高：'+p.height+' m');
 if(p.radius!=null)lines.push('半径：'+p.radius+' m');
 lines.push('費用：₡ '+Number(p.cost||0).toLocaleString('ja-JP'),' ',familyText||types[p.type]||'機体の構造・機能を構成するパーツです。');
 return lines.join(String.fromCharCode(10));
}
function drawPartsCatalogV2(){
 const query=($('#part-search')?.value||'').trim().toLowerCase(),sort=$('#part-sort')?.value||'name';
 let items=catalog.filter(p=>(activePartCategory==='すべて'||categoryFor(p)===activePartCategory)&&(!query||(p.name+' '+p.id+' '+categoryFor(p)).toLowerCase().includes(query)));
 items.sort((a,b)=>sort==='mass'?a.mass-b.mass:sort==='cost'?a.cost-b.cost:sort==='size'?a.height-b.height:a.name.localeCompare(b.name,'ja'));
 $('#part-result-count').textContent=items.length+' 件';
 $('#part-list').innerHTML=items.map(p=>{const unlocked=gameMode==='sandbox'||unlockedTech.has(p.tech||'basic'),esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const sourceLabel=p.catalogSource==='Making History'?'MAKING HISTORY':p.catalogSource==='Breaking Ground'?'BREAKING GROUND':p.catalogSource==='stock'?'STOCK':'BASE';return '<button class="part" draggable="true" data-part="'+p.id+'" aria-label="'+esc(p.name)+'" '+(unlocked?'':'disabled')+' data-tip="'+esc(partHoverInfo(p))+'"><span class="part-icon"></span></button>';}).join('');renderPartPreviews(items);
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
function rebuildHangarCrew(){
 while(hangarCrewGroup.children.length){const child=hangarCrewGroup.children[0];hangarCrewGroup.remove(child);child.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});}
 const occupied=[];
 const randomPoint=()=>{
  let point;
  for(let tries=0;tries<60;tries++){
   point=new THREE.Vector3(-88+Math.random()*176,-.22,-84+Math.random()*168);
   if(occupied.every(p=>p.distanceTo(point)>13))break;
  }
  occupied.push(point.clone());return point;
 };
 const ambientWorkers=Array.from({length:7},(_,i)=>({id:100+i,name:'整備作業員 '+(i+1),role:'整備士',level:1}));
 [...crewMembers,...ambientWorkers].forEach((member,index)=>{
  const figure=makeCrewFigure(member,index),point=randomPoint();
  figure.scale.multiplyScalar(index<crewMembers.length?.66:.56);
  figure.position.copy(point);figure.rotation.y=Math.random()*Math.PI*2;
  const startWalking=Math.random()<.82;figure.userData.hangarWalk={target:randomPoint(),mode:startWalking?'walk':'think',wait:Math.random()*2.5,phase:Math.random()*Math.PI*2,pauseIn:4+Math.random()*14,index};
  hangarCrewGroup.add(figure);
 });
}
function updateHangarCrew(dt){
 for(const figure of hangarCrewGroup.children){
  const state=figure.userData.hangarWalk,parts=figure.userData.walkParts;if(!state||!parts)continue;
  state.phase+=dt;
  const gait=state.phase*7.2;
  const mouth=parts.mouth;
  if(mouth){
   if(state.talkTimer===undefined){state.talkTimer=2+Math.random()*5;state.talkUntil=0;}
   state.talkTimer-=dt;
   if(state.talkTimer<=0){state.talkUntil=state.phase+.7+Math.random()*1.5;state.talkTimer=5+Math.random()*11;}
   const talking=state.phase<state.talkUntil,syllable=talking?Math.abs(Math.sin(state.phase*13.5)):0;
   mouth.cavity.scale.y=THREE.MathUtils.damp(mouth.cavity.scale.y,talking?.18+syllable*.72:.12,15,dt);
   mouth.smile.scale.y=THREE.MathUtils.damp(mouth.smile.scale.y,talking?.35:.12,12,dt);
  }
  if(state.mode==='think'){
   state.wait-=dt;
   const breathe=Math.sin(state.phase*1.25)*.012;
   figure.position.y=THREE.MathUtils.damp(figure.position.y,-.22+breathe,4,dt);
   figure.rotation.z=THREE.MathUtils.damp(figure.rotation.z,Math.sin(state.phase*.55)*.012,3,dt);
   parts.head.rotation.z=THREE.MathUtils.damp(parts.head.rotation.z,.18+Math.sin(state.phase*.65)*.025,4,dt);
   parts.head.rotation.x=THREE.MathUtils.damp(parts.head.rotation.x,-.08+Math.sin(state.phase*.45)*.02,4,dt);
   parts.arms.forEach(arm=>{
    const nearFace=arm.side===1;
    arm.shoulder.rotation.x=THREE.MathUtils.damp(arm.shoulder.rotation.x,nearFace?-.18:.08,5,dt);
    arm.shoulder.rotation.z=THREE.MathUtils.damp(arm.shoulder.rotation.z,nearFace?-.48:-.38,5,dt);
    arm.elbow.rotation.x=THREE.MathUtils.damp(arm.elbow.rotation.x,nearFace?-.12:-.08,5,dt);
    arm.elbow.rotation.z=THREE.MathUtils.damp(arm.elbow.rotation.z,nearFace?-1.08:.82,5,dt);
   });
   parts.legs.forEach(leg=>{leg.hip.rotation.x=THREE.MathUtils.damp(leg.hip.rotation.x,0,5,dt);leg.knee.rotation.x=THREE.MathUtils.damp(leg.knee.rotation.x,0,5,dt);leg.ankle.rotation.x=THREE.MathUtils.damp(leg.ankle.rotation.x,0,5,dt);});
   if(state.wait<=0){state.mode='walk';state.target=new THREE.Vector3(-88+Math.random()*176,-.22,-84+Math.random()*168);state.pauseIn=7+Math.random()*17;}
  }else{
   state.pauseIn-=dt;
   if(state.pauseIn<=0&&Math.random()<dt*.16){state.mode='think';state.wait=2+Math.random()*4;continue;}
   const dx=state.target.x-figure.position.x,dz=state.target.z-figure.position.z,dist=Math.hypot(dx,dz);
   const speed=2.0+Math.sin(state.phase*.4)*.18,step=Math.min(dist,dt*speed);
   if(dist>.001){figure.position.x+=dx/dist*step;figure.position.z+=dz/dist*step;figure.rotation.y=THREE.MathUtils.damp(figure.rotation.y,Math.atan2(dx,dz),5,dt);}
   const stride=Math.sin(gait),bob=Math.max(0,Math.sin(gait*2))*.045;
   parts.legs.forEach(leg=>{
    const phase=gait+(leg.side<0?0:Math.PI),swing=Math.sin(phase);
    const lift=Math.max(0,-swing);
    const kneeBend=lift*.92+Math.max(0,Math.sin(phase+Math.PI*.5))*.12;
    leg.hip.rotation.x=THREE.MathUtils.damp(leg.hip.rotation.x,swing*.43,13,dt);
    leg.knee.rotation.x=THREE.MathUtils.damp(leg.knee.rotation.x,kneeBend,15,dt);
    // Toe lifts during swing and levels on stance, keeping the boot from clipping through the floor.
    leg.ankle.rotation.x=THREE.MathUtils.damp(leg.ankle.rotation.x,-swing*.18-kneeBend*.42,13,dt);
   });
   parts.arms.forEach(arm=>{
    const swing=Math.sin(gait+(arm.side<0?Math.PI:0));
    arm.shoulder.rotation.x=THREE.MathUtils.damp(arm.shoulder.rotation.x,swing*.32,10,dt);
    arm.shoulder.rotation.z=THREE.MathUtils.damp(arm.shoulder.rotation.z,arm.side*.045,8,dt);
    arm.elbow.rotation.x=THREE.MathUtils.damp(arm.elbow.rotation.x,-.12+Math.max(0,swing)*.16,9,dt);
    arm.elbow.rotation.z=THREE.MathUtils.damp(arm.elbow.rotation.z,0,8,dt);
    arm.wrist.rotation.x=THREE.MathUtils.damp(arm.wrist.rotation.x,-swing*.08,8,dt);
   });
   figure.position.y=THREE.MathUtils.damp(figure.position.y,-.22+bob,10,dt);
   figure.rotation.z=THREE.MathUtils.damp(figure.rotation.z,Math.sin(gait)*.012,8,dt);
   // Head and eyes share the same moving rig: the whole gaze visibly rises and falls with each step.
   parts.head.position.y=THREE.MathUtils.damp(parts.head.position.y,2.72+bob*.42,10,dt);
   parts.head.rotation.z=THREE.MathUtils.damp(parts.head.rotation.z,Math.sin(state.phase*1.8)*.018,5,dt);
   parts.head.rotation.x=THREE.MathUtils.damp(parts.head.rotation.x,Math.sin(gait)*.018,6,dt);
   if(dist<1.1){state.mode='think';state.wait=2+Math.random()*5;}
  }
  if(state.mode==='think')parts.head.position.y=THREE.MathUtils.damp(parts.head.position.y,2.72,7,dt);
 }
}
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
  return '<article class="crew-card"><canvas class="crew-avatar" data-crew-index="'+crewMembers.indexOf(k)+'" width="288" height="384" aria-label="'+k.name+' の全身3Dモデル"></canvas><div class="crew-info"><h3>'+k.name+'</h3><span class="crew-role">'+k.role+' ・ 経験 '+('★'.repeat(stars))+('☆'.repeat(5-stars))+'</span><div class="crew-stat"><div><span>バカ度</span><b>'+stupidity+'%</b></div><div class="crew-meter"><i style="width:'+stupidity+'%"></i></div></div><div class="crew-stat"><div><span>勇敢度</span><b>'+bravery+'%</b></div><div class="crew-meter brave"><i style="width:'+bravery+'%"></i></div></div><button class="crew-retire" data-retire-crew="'+crewMembers.indexOf(k)+'" type="button" aria-label="'+k.name+' を退職させる" title="退職させる">×</button></div></article>';
 }).join('')+'</div><section class="crew-recruit"><b>乗組員を雇用</b><div><button data-hire-crew="pilot">パイロットを雇用</button><button data-hire-crew="engineer">エンジニアを雇用</button><button data-hire-crew="scientist">科学者を雇用</button></div></section>';
 renderCrewPortraits();
 rebuildHangarCrew();
 saveCareer();
}function renderContracts(){$('#career-title').textContent='ミッション管理';$('#career-content').innerHTML='<div class="career-content">'+(activeContract?'<div class="career-item"><h3>受注中：'+activeContract.name+'</h3><p>'+activeContract.description+'</p><span class="career-tag">報酬 ₡'+activeContract.reward.toLocaleString()+' / 科学 '+activeContract.science+'</span></div>':'<p>受注中の契約はありません。</p>')+contracts.map(k=>'<div class="career-item"><h3>'+k.name+'</h3><p>'+k.description+'</p><span class="career-tag">報酬 ₡'+k.reward.toLocaleString()+' / 科学 '+k.science+'</span><br><button data-accept-contract="'+k.id+'" '+(activeContract?'disabled':'')+'>契約を受注</button></div>').join('')+'</div>';}
try{const saveKey=gameMode==='career'?'space-career-v1':'space-'+gameMode+'-v1';const savedCareer=JSON.parse(localStorage.getItem(saveKey)||'null');if(savedCareer){funds=savedCareer.funds??funds;fundsUnlimited=savedCareer.fundsUnlimited??true;science=savedCareer.science??science;unlockedTech=new Set(savedCareer.unlocked||['basic']);activeContract=contracts.find(k=>k.id===savedCareer.activeContract)||null;crewMembers=savedCareer.crew||crewMembers;}}catch{}if(gameMode==='sandbox'){funds=999999999;unlockedTech=new Set(techTree.map(t=>t.id));activeContract=null;}if(gameMode==='science')activeContract=null;
function partMesh(p){return createPartModel(p,THREE);}
function renderStages(){
 stageUiFuelPercent=maxFuel?Math.round(fuel/maxFuel*100):0;
 const groups=[...new Set([...parts.map(p=>p.stage),assemblyStage])].sort((a,b)=>b-a);
 const cards=groups.map(n=>{
  const group=parts.filter(p=>p.stage===n),fuelMax=group.reduce((s,p)=>s+(p.data.fuel||0),0),fuelNow=group.reduce((s,p)=>s+(p.fuel||0),0),names=group.map(p=>p.data.name).join(' / ');
  return '<div class="stage-card '+(n===assemblyStage?'active':'')+'"><b>'+n+'</b><span>'+(names||'空のステージ')+'</span><small>'+(fuelMax?Math.round(fuelNow/fuelMax*100)+'% 推進剤':'パーツ '+group.length)+'</small><div class="fuel-track"><i style="width:'+(fuelMax?fuelNow/fuelMax*100:0)+'%"></i></div></div>';
 });
 $('#stage-list').innerHTML=cards.join('')||'<small>ステージなし</small>';
 const build=$('#build-stage-list');
 if(build)build.innerHTML=groups.map(n=>{
  const group=parts.filter(p=>p.stage===n);
  const fuelMax=group.reduce((s,p)=>s+(p.data.fuel||0),0),fuelNow=group.reduce((s,p)=>s+(p.fuel||0),0);
  const items=group.map(p=>'<div class="build-stage-part" title="'+p.data.name.replace(/"/g,'&quot;')+'"><i>'+p.data.icon+'</i></div>').join('');
  const categoryIcons={'制御・乗員':'👨‍🚀','燃料・資源':'⛽','エンジン・推進':'🚀','航空機':'🛩️','空力・航空機':'🪂','着陸・地上':'🛬','構造・貨物':'📦','電力・科学・装備':'🔋','DLC・Making History':'🏛️','DLC・Breaking Ground':'🦾'};
  const marks=[...new Set(group.map(p=>categoryFor(p.data)))].filter(c=>categoryIcons[c]).map(c=>'<span title="'+c+'">'+categoryIcons[c]+'</span>').join('');
  return '<section class="build-stage-card '+(n===assemblyStage?'active':'')+'"><button class="build-stage-title" type="button" data-build-stage="'+n+'" title="ステージ '+n+' を編集"><b>'+n+'</b><span>Ⅲ</span></button>'+(marks?'<div class="build-stage-category-marks" aria-label="このステージの部品カテゴリ">'+marks+'</div>':'')+'<div class="build-stage-items">'+(items||'<small>—</small>')+'</div>'+(fuelMax?'<div class="build-stage-fuel"><i style="width:'+Math.round(fuelNow/fuelMax*100)+'%"></i></div>':'')+'</section>';
 }).join('');
}
function recalc(){craftMass=rocketMassKg(parts)/1000;fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);maxFuel=parts.reduce((s,p)=>s+(p.data.fuel||0),0);thrust=parts.reduce((s,p)=>s+(p.data.thrust||0),0);const dv=deltaV(parts);$('#craft-name').textContent='機体重量 '+craftMass.toFixed(2)+' t　Δv '+Math.round(dv)+' m/s　推力 '+thrust+' kN';$('#funds').textContent=gameMode==='sandbox'||fundsUnlimited?'∞':'₡'+funds.toLocaleString();$('#funds-toggle').textContent='資金: '+(fundsUnlimited?'無制限':'通常');$('#funds-toggle').classList.toggle('active',fundsUnlimited);$('#science').textContent=science;renderStages();}
function disposeCraftModel(root){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){if(m.map)m.map.dispose();if(m.normalMap)m.normalMap.dispose();if(m.roughnessMap)m.roughnessMap.dispose();if(m.metalnessMap)m.metalnessMap.dispose();m.dispose();}}});}
function fitVabCamera(force=false){
 if(mode!=='vab'||!rocket.visible||!parts.length)return;
 rocket.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(rocket);
 if(bounds.isEmpty())return;
 const center=bounds.getCenter(new THREE.Vector3()),sphere=bounds.getBoundingSphere(new THREE.Sphere());
 const radius=Math.max(sphere.radius,.18);
 const direction=new THREE.Vector3(.55,.34,.76).normalize();
 const distance=Math.max(.018,radius/Math.sin(THREE.MathUtils.degToRad(camera.fov*.5))*1.28);
 const previous=orbitTarget.clone();
 orbitTarget.copy(center);
 if(force||camera.position.distanceTo(previous)<.0001||camera.position.distanceTo(center)<distance*.78){
  camera.position.copy(center).addScaledVector(direction,distance);
 }else{
  const offset=camera.position.clone().sub(previous);
  const current=offset.length();
  if(current<distance*1.12)camera.position.copy(center).addScaledVector(offset.normalize(),distance*1.12);
  else camera.position.add(center.clone().sub(previous));
 }
 camera.near=Math.max(.00001,distance/1200);camera.far=Math.max(100,distance*1200);camera.updateProjectionMatrix();camera.lookAt(center);
}
function layout(){for(const child of [...rocket.children])disposeCraftModel(child);rocket.clear();let y=0,z=0;for(const p of parts){const m=partMesh(p.data),h=p.data.height;p.mesh=m;m.userData.partItem=p;if(p.manualPosition&&p.position)m.position.copy(p.position);else if(aircraftCraft){p.y=0;m.position.set(0,0,z);z+=h*.82;}else{p.y=y;m.position.y=y;y+=h*.82;}rocket.add(m);}rocket.position.y=0;recalc();$('#stage-build-label').textContent='組立ステージ '+assemblyStage;fitVabCamera(parts.length===1);}
function addPart(id,place=null){const d=catalog.find(x=>x.id===id);if(!d)return;if(gameMode!=='sandbox'&&!fundsUnlimited&&funds<d.cost){toast('資金が不足しています');return;}if(gameMode!=='sandbox'&&!fundsUnlimited)funds-=d.cost;saveCareer();const item={data:d,fuel:d.fuel||0,stage:assemblyStage};if(place){item.manualPosition=true;item.position=place.clone();}parts.push(item);layout();toast(d.name+' を設置しました');}
function placePartAtScreen(id,clientX,clientY){if(mode!=='vab'||flight)return false;const rect=renderer.domElement.getBoundingClientRect();if(!rect.width||!rect.height)return false;const mouse=new THREE.Vector2((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();rocket.updateWorldMatrix(true,true);ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(rocket.children,true);let place=null;for(const hit of hits){let obj=hit.object;while(obj&&!obj.userData.partItem)obj=obj.parent;if(obj){const normal=hit.face?hit.face.normal.clone().transformDirection(hit.object.matrixWorld):new THREE.Vector3(0,1,0);const localNormal=normal.transformDirection(rocket.matrixWorld.clone().invert());const data=catalog.find(p=>p.id===id);place=rocket.worldToLocal(hit.point.clone()).addScaledVector(localNormal,Math.max(.18,data?.radius||.3)*.72);break;}}if(!place){const groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);const point=new THREE.Vector3();if(ray.ray.intersectPlane(groundPlane,point))place=rocket.worldToLocal(point);else place=new THREE.Vector3(0,0,0);}addPart(id,place);return true;}
function setMode(m){mode=m;document.body.classList.toggle('crew-roster-mode',m==='crew');renderer.domElement.style.display=m==='crew'?'none':'block';crewStage.visible=false;campus.visible=false;hangar.visible=m==='vab';ground.visible=m!=='crew';planet.visible=m!=='crew';atmosphere.visible=m!=='crew';$('#build-staging').classList.toggle('show',m==='vab');$('.tabs').classList.toggle('hidden',m==='flight');$('#home').classList.toggle('hidden',m==='flight');$$('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===m));$('#parts').classList.toggle('open',m==='vab');$('#flight-hud').classList.toggle('show',m==='flight');$('#career-panel').classList.toggle('hidden',m!=='crew');$('.vab-tools').classList.toggle('hidden',m!=='vab');$('#hint').classList.toggle('hidden',m==='flight');if(m==='center'){camera.position.set(.14,.10,.20);camera.lookAt(0,.005,0);rocket.visible=false;$('#hint').textContent='宇宙センター：ロケット組立棟で機体を設計し、発射場から宇宙へ。';}if(m==='vab'){rocket.visible=true;rocket.position.set(0,0,0);if(parts.length)fitVabCamera(true);else{camera.position.copy(aircraftCraft?new THREE.Vector3(.033,.015,.003):new THREE.Vector3(.018,.0135,.024));camera.lookAt(0,aircraftCraft ? .002 : .005,0);syncOrbitTarget();}$('#hint').textContent=aircraftCraft?'航空機組立：コックピット・胴体を中心に、主翼・尾翼・エンジン・着陸脚を取り付けます。':'ロケット組立：下段から上段へ順にパーツを追加します。';}if(m==='crew'){rocket.visible=false;crewStage.visible=false;$('#hint').textContent='';}else{crewStage.visible=false;}if(m==='flight'){rocket.visible=true;camera.position.set(.022,.014,.027);}}
$$('[data-screen]').forEach(b=>b.onclick=()=>{setMode(b.dataset.screen);if(b.dataset.screen==='crew')renderCrew();});

$('#career-content').addEventListener('click',e=>{const retire=e.target.closest('[data-retire-crew]');if(retire){const index=Number(retire.dataset.retireCrew),member=crewMembers[index];if(member){crewMembers.splice(index,1);saveCareer();renderCrew();toast(member.name+' が退職しました');}return;}const hire=e.target.closest('[data-hire-crew]');if(hire){const role=hire.dataset.hireCrew,cost=2500;if(gameMode!=='sandbox'&&!fundsUnlimited&&funds<cost){toast('雇用資金が不足しています');return;}if(gameMode!=='sandbox'&&!fundsUnlimited)funds-=cost;const names=['Avery','Boris','Caden','Daisy','Elwin','Fiona','Gordon','Hana','Ivo','Juno','Kellan','Lena','Marek','Nora','Otto','Piper','Quinn','Rhea','Soren','Talia','Uma','Viktor','Willa','Xander','Yuri','Zelda','Arlo','Bria','Cyrus','Della','Ezra','Freya','Hugo','Iris','Jonas','Kaia','Luka','Mira','Niko','Orla','Pavel','Rina','Silas','Tess','Uri','Vera','Wes','Yara','Zane','Adrian','Beatrix','Callum','Delia','Emmett','Flora','Gideon','Helena','Isak','Juniper','Kieran','Lyra','Milo','Nadia','Oren','Petra','Quincy','Ronan','Sasha','Thea','Ulric','Violet','Warren','Yvette','Zora','Alistair','Brenna','Corin','Dorian','Evelyn','Felix','Greta','Hollis','Imogen','Jasper','Kira','Leander','Maeve','Noel','Opal','Percy','Rowan','Selene','Tobin','Una','Vance','Winona','Yael','Zeke'];const roleNames={pilot:'パイロット',engineer:'エンジニア',scientist:'科学者'};const firstName=names.find(n=>!crewMembers.some(k=>k.name===n+' Kerman'))||'Kerbal';let name=firstName+' Kerman';let suffix='';while(crewMembers.some(k=>k.name===name)){suffix+=' Jr';name=firstName+suffix+' Kerman';}const recruit={id:Date.now(),name,role:roleNames[role],level:1,stars:1};syncCrewAbilities(recruit);crewMembers.push(recruit);saveCareer();renderCrew();recalc();toast(name+' を雇用しました');}const tech=e.target.closest('[data-unlock-tech]');if(tech){const item=techTree.find(t=>t.id===tech.dataset.unlockTech);if(item&&!unlockedTech.has(item.id)&&item.requires.every(x=>unlockedTech.has(x))&&science>=item.cost){science-=item.cost;unlockedTech.add(item.id);saveCareer();drawPartsCatalogV2();renderResearch();recalc();toast(item.name+' を研究しました');}}const contract=e.target.closest('[data-accept-contract]');if(contract&&!activeContract){activeContract=contracts.find(k=>k.id===contract.dataset.acceptContract)||null;if(activeContract){saveCareer();renderContracts();toast('契約を受注しました');}}});
function panelMessage(title,msg){toast(title+' — '+msg.replaceAll('\n',' / '));}
$('#home').onclick=()=>{flight=false;setMode('vab');};
renderCategories();drawPartsCatalogV2();rebuildHangarCrew();

$('#part-categories').addEventListener('click',e=>{const b=e.target.closest('[data-part-category]');if(b){const chosen=b.dataset.partCategory;const panel=$('#parts');if(activePartCategory===chosen&&!panel.classList.contains('categories-collapsed')){panel.classList.add('categories-collapsed');return;}activePartCategory=chosen;panel.classList.remove('categories-collapsed');renderCategories();drawPartsCatalogV2();}});
$('#part-search').addEventListener('input',drawPartsCatalogV2);$('#part-sort').addEventListener('change',drawPartsCatalogV2);
$('#part-list').addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(b){selectedPartId=b.dataset.part;$('#hint').textContent='設置モード：3D機体上をクリック、または部品をドラッグ＆ドロップ。';toast('3D画面へドラッグ、または設置位置をクリック');}});
$('#part-list').addEventListener('dragstart',e=>{const b=e.target.closest('button[data-part]');if(!b||b.disabled)return;selectedPartId=b.dataset.part;e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-space-part',b.dataset.part);e.dataTransfer.setData('text/plain',b.dataset.part);document.body.classList.add('part-dragging');});
$('#part-list').addEventListener('dragend',()=>document.body.classList.remove('part-dragging'));
renderer.domElement.addEventListener('dragover',e=>{if(mode==='vab'&&!flight){e.preventDefault();e.dataTransfer.dropEffect='copy';document.body.classList.add('part-drag-over');}});
renderer.domElement.addEventListener('dragleave',e=>{if(!renderer.domElement.contains(e.relatedTarget))document.body.classList.remove('part-drag-over');});
renderer.domElement.addEventListener('drop',e=>{if(mode!=='vab'||flight)return;e.preventDefault();document.body.classList.remove('part-dragging','part-drag-over');const id=e.dataTransfer.getData('application/x-space-part')||e.dataTransfer.getData('text/plain');if(id&&catalog.some(p=>p.id===id)){selectedPartId=null;placePartAtScreen(id,e.clientX,e.clientY);}});
$('#clear-craft').onclick=()=>{if(flight)return;parts.length=0;assemblyStage=0;layout();toast('機体を空にしました');};
$('#new-stage').onclick=()=>{if(flight)return;assemblyStage++;$('#stage-build-label').textContent='組立ステージ '+assemblyStage;toast('新しい組立ステージ '+assemblyStage);};
$('#stage-add-side').onclick=()=>{if(flight)return;assemblyStage++;$('#stage-build-label').textContent='組立ステージ '+assemblyStage;renderStages();toast('新しい組立ステージ '+assemblyStage);};
$('#build-stage-list').addEventListener('click',e=>{const b=e.target.closest('[data-build-stage]');if(!b||flight)return;assemblyStage=Number(b.dataset.buildStage);$('#stage-build-label').textContent='組立ステージ '+assemblyStage;renderStages();toast('組立ステージ '+assemblyStage+' を選択');});
$('#save-craft').onclick=()=>{localStorage.setItem('space-craft-v1',JSON.stringify(parts.map(p=>({id:p.data.id,stage:p.stage,fuel:p.fuel,manualPosition:p.manualPosition,position:p.position? p.position.toArray():null}))));toast('機体を保存しました');};
$('#load-craft').onclick=()=>{try{const a=JSON.parse(localStorage.getItem('space-craft-v1')||'[]');parts.length=0;a.forEach(v=>{const replacementId=legacyCatalogAliases[v.id]||v.id;const d=catalog.find(p=>p.id===replacementId);if(d)parts.push({data:d,stage:v.stage,fuel:v.fuel??d.fuel??0,manualPosition:!!v.manualPosition,position:v.position?new THREE.Vector3(...v.position):null});});assemblyStage=Math.max(0,...parts.map(p=>p.stage||0));layout();toast('機体を読み込みました');}catch{toast('保存データがありません');}};
renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='vab'||!selectedPartId||flight)return;const id=selectedPartId;if(placePartAtScreen(id,e.clientX,e.clientY)){selectedPartId=null;$('#hint').textContent='部品を選択してから、3D画面へドラッグ＆ドロップ、またはクリックで配置。';}});
// Orbit by dragging, zoom by wheel or two-finger trackpad/touch pinch.
let orbitPointerId=null,orbitLastX=0,orbitLastY=0,pinchDistance=0;
const activeCameraPointers=new Map(),orbitTarget=new THREE.Vector3();
renderer.domElement.style.touchAction='none';renderer.domElement.style.cursor='grab';
function orbitCollisionRoots(){
 if(mode==='vab')return [hangar,rocket,ground];
 if(mode==='center')return [campus,ground,planet];
 if(mode==='crew')return [crewStage,ground,planet];
 return [ground,planet];
}
function keepCameraOutsideGeometry(candidate){
 // Sweep from the current camera position to the proposed position.
 // Do not raycast from the destination back toward the orbit target: that
 // incorrectly treats every wall between the camera and target as a zoom limit.
 const movement=candidate.clone().sub(camera.position),distance=movement.length();
 if(distance>1e-8){
  const direction=movement.clone().normalize();scene.updateMatrixWorld(true);
  const raycaster=new THREE.Raycaster(camera.position.clone(),direction,0,distance);
  const hits=raycaster.intersectObjects(orbitCollisionRoots(),true).filter(hit=>hit.object.visible&&hit.distance>1e-7);
  if(hits.length){
   const clearance=mode==='vab'?.00035:mode==='crew'?.18:.001;
   const safeDistance=Math.max(0,hits[0].distance-clearance);
   candidate.copy(camera.position).addScaledVector(direction,safeDistance);
  }
 }
 if(mode==='vab')candidate.y=Math.max(candidate.y,-.00008);
 return candidate;
}
function syncOrbitTarget(){if(mode==='vab'&&parts.length){rocket.updateMatrixWorld(true);new THREE.Box3().setFromObject(rocket).getCenter(orbitTarget);return;}orbitTarget.set(0,mode==='crew'?1.8:mode==='vab'?(aircraftCraft?.002:.005):.005,0);}
function cameraZoomByFactor(factor){
 const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(orbitTarget));
 const minRadius=mode==='vab'?.0012:mode==='crew'?3.5:.025;
 const maxRadius=mode==='vab'?.16:mode==='crew'?36:1.5;
 spherical.radius=THREE.MathUtils.clamp(spherical.radius*factor,minRadius,maxRadius);
 const candidate=orbitTarget.clone().add(new THREE.Vector3().setFromSpherical(spherical));
 camera.position.copy(keepCameraOutsideGeometry(candidate));camera.lookAt(orbitTarget);
}
function getPinchDistance(){
 const pts=[...activeCameraPointers.values()];
 return pts.length>=2?Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y):0;
}
renderer.domElement.addEventListener('pointerdown',e=>{
 if(mode==='flight'||selectedPartId||(e.pointerType==='mouse'&&e.button!==0))return;
 syncOrbitTarget();activeCameraPointers.set(e.pointerId,{x:e.clientX,y:e.clientY,type:e.pointerType});
 try{renderer.domElement.setPointerCapture(e.pointerId);}catch{}
 if(activeCameraPointers.size===1){orbitPointerId=e.pointerId;orbitLastX=e.clientX;orbitLastY=e.clientY;renderer.domElement.style.cursor='grabbing';}
 else if(activeCameraPointers.size===2){orbitPointerId=null;pinchDistance=getPinchDistance();}
 e.preventDefault();
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(!activeCameraPointers.has(e.pointerId))return;
 activeCameraPointers.set(e.pointerId,{x:e.clientX,y:e.clientY,type:e.pointerType});
 if(activeCameraPointers.size>=2){
  const distance=getPinchDistance();
  if(pinchDistance>0&&distance>0)cameraZoomByFactor(Math.pow(pinchDistance/distance,5));
  pinchDistance=distance;return;
 }
 if(orbitPointerId!==e.pointerId)return;
 const dx=e.clientX-orbitLastX,dy=e.clientY-orbitLastY;orbitLastX=e.clientX;orbitLastY=e.clientY;
 const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(orbitTarget));
 spherical.theta-=dx*.006;spherical.phi=THREE.MathUtils.clamp(spherical.phi-dy*.006,.08,Math.PI-.08);
 const candidate=orbitTarget.clone().add(new THREE.Vector3().setFromSpherical(spherical));
 camera.position.copy(keepCameraOutsideGeometry(candidate));camera.lookAt(orbitTarget);
});
renderer.domElement.addEventListener('wheel',e=>{
 if(mode==='flight')return;e.preventDefault();syncOrbitTarget();
 const sensitivity=e.ctrlKey?5:1;
 cameraZoomByFactor(Math.exp(e.deltaY*.001*sensitivity));
},{passive:false});
function endOrbitDrag(e){
 if(!activeCameraPointers.has(e.pointerId))return;
 activeCameraPointers.delete(e.pointerId);if(orbitPointerId===e.pointerId)orbitPointerId=null;
 if(activeCameraPointers.size===1){
  const [id,p]=[...activeCameraPointers.entries()][0];
  if(p.type!=='mouse'){orbitPointerId=id;orbitLastX=p.x;orbitLastY=p.y;}
 }else if(activeCameraPointers.size===0)renderer.domElement.style.cursor='grab';
 pinchDistance=getPinchDistance();
}
renderer.domElement.addEventListener('pointerup',endOrbitDrag);
renderer.domElement.addEventListener('pointercancel',endOrbitDrag);function startFlight(){if(!parts.length){toast('先に機体を組み立ててください');return;}aircraftCraft=parts.some(p=>p.data.type==='jet'||p.data.type==='rotor-blade');const hasPropulsion=parts.some(p=>['engine','booster','jet'].includes(p.data.type));if(!hasPropulsion){toast('ロケットエンジンまたはジェットエンジンが必要です');return;}const hasFuel=parts.some(p=>['tank','fuselage','booster'].includes(p.data.type)&&(p.fuel||0)>0);if(!hasFuel){toast('燃料タンクまたは燃料入り胴体が必要です');return;}if(aircraftCraft&&!parts.some(p=>p.data.type==='fuselage'||p.data.type==='cockpit')){toast('飛行機には胴体またはコックピットが必要です');return;}clearStageDebris();parts.forEach(p=>{p.deployed=false;p.deployProgress=0;});flight=true;flightPeakAltitude=0;paused=false;elapsed=0;stage=0;throttle=0;flightAccumulator=0;experimentLog=[];window._orb=false;sasEnabled=false;rcsEnabled=false;position.set(0,.002,0);velocity.set(0,0,0);if(aircraftCraft)velocity.set(0,0,.06);angular.set(0,0,0);attitude.identity();rocket.position.copy(position);rocket.quaternion.copy(attitude);rocket.visible=true;setMode('flight');toast(aircraftCraft?'航空機飛行開始 — Zで推力、姿勢操作で操縦':'発射準備完了 — Zでスロットル最大、Spaceで点火');}
$('#aircraft-mode').onclick=()=>{aircraftCraft=!aircraftCraft;activePartCategory=aircraftCraft?'航空機':'すべて';renderCategories();drawPartsCatalogV2();layout();setMode('vab');$('#aircraft-mode').classList.toggle('active',aircraftCraft);$('#aircraft-mode').textContent=aircraftCraft?'✈ 航空機組立中':'🚀 ロケット組立中';toast(aircraftCraft?'航空機組立モード：航空機パーツを表示':'ロケット組立モード：全パーツを表示');};
$('#launch').onclick=startFlight;$('#stage-next').onclick=()=>{if(flight)activateStage();};function runScienceExperiment(){if(!flight){toast('飛行中に実験できます');return;}const instruments=parts.filter(p=>['pod','probe','science'].includes(p.data.type));if(!instruments.length){toast('実験装置・プローブ・乗員ポッドが必要です');return;}const altitude=position.clone().sub(bodyCenter).length()-BODY.radius;const situation=altitude>=70?'宇宙空間':altitude>=10?'高高度大気圏':'低高度・地表';if(experimentLog.includes(situation)){toast('この飛行状況の実験は完了しています');return;}const scienceParts=parts.filter(p=>p.data.type==='science').length;const reward=(situation==='宇宙空間'?10:situation==='高高度大気圏'?6:3)+scienceParts*5;experimentLog.push(situation);science+=reward;saveCareer();recalc();toast(situation+'の実験データを回収：科学 +'+reward);}
$('#science-experiment').onclick=runScienceExperiment;$('#map-toggle').onclick=()=>{map=!map;toast(map?'軌道マップ表示（M）':'飛行ビュー');};
let keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='Escape'&&selectedPartId){selectedPartId=null;toast('部品設置をキャンセル');}if(e.key==='Escape'&&mode==='flight'){flight=false;throttle=0;setMode('vab');toast('ロケット組立棟へ戻りました');}if(e.code==='Space'&&flight){e.preventDefault();activateStage();}if(e.key.toLowerCase()==='z')throttle=1;if(e.key.toLowerCase()==='x')throttle=0;if(e.key.toLowerCase()==='t'){sasEnabled=!sasEnabled;toast('SAS '+(sasEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='r'){rcsEnabled=!rcsEnabled;toast('RCS '+(rcsEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='p'&&flight){const alt=position.clone().sub(bodyCenter).length()-BODY.radius,speed=velocity.length()*1000,chutes=parts.filter(p=>p.data.type==='chute');if(!chutes.length)toast('パラシュートがありません');else if(alt>10||speed>250)toast('展開条件外：高度10 km以下・速度250 m/s以下が必要');else{chutes.forEach(p=>{p.deployed=true;p.deployProgress=0;});toast('パラシュートを展開しました');}}if(e.key.toLowerCase()==='m'&&flight){map=!map;}});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function spawnStageDebris(dropped,impulse){
 if(!dropped.length)return;
 const group=new THREE.Group();group.position.copy(position);group.quaternion.copy(attitude);group.scale.setScalar(.001);
 for(const part of dropped){const model=partMesh(part.data);if(part.mesh){model.position.copy(part.mesh.position);model.quaternion.copy(part.mesh.quaternion);model.scale.copy(part.mesh.scale);}group.add(model);}
 scene.add(group);debrisAssemblies.push({group,velocity:velocity.clone().addScaledVector(impulse,-.00022),age:0});
}
function updateStageDebris(dt){
 for(let i=debrisAssemblies.length-1;i>=0;i--){
  const debris=debrisAssemblies[i];debris.age+=dt;
  const gravity=gravityAcceleration(debris.group.position,BODY.mu,bodyCenter);
  debris.velocity.add(new THREE.Vector3(gravity.x,gravity.y,gravity.z).multiplyScalar(dt));
  debris.group.position.addScaledVector(debris.velocity,dt);debris.group.rotateX(dt*.16);debris.group.rotateZ(dt*.11);
  if(debris.age>90||debris.group.position.distanceTo(position)>2.5){scene.remove(debris.group);disposeCraftModel(debris.group);debrisAssemblies.splice(i,1);}
 }
}
function clearStageDebris(){for(const debris of debrisAssemblies){scene.remove(debris.group);disposeCraftModel(debris.group);}debrisAssemblies.length=0;}
function activateStage(){
 const nextStage=stage+1,hasSeparator=parts.some(p=>p.data.type==='decoupler'&&p.stage===nextStage);
 if(hasSeparator){
  const impulse=new THREE.Vector3(0,1,0).applyQuaternion(attitude).normalize();
  const dropped=parts.filter(p=>p.stage<nextStage||(p.data.type==='decoupler'&&p.stage===nextStage));
  spawnStageDebris(dropped,impulse);
  for(let i=parts.length-1;i>=0;i--)if(parts[i].stage<nextStage||(parts[i].data.type==='decoupler'&&parts[i].stage===nextStage))parts.splice(i,1);
  velocity.addScaledVector(impulse,.00022);layout();
 }
 stage=nextStage;
 toast(hasSeparator?'ステージ '+stage+' 作動 — 下段を分離':'ステージ '+stage+' 作動');
}
const bodyCenter=new THREE.Vector3(0,-BODY.radius,0);
let properG=1,flightAccumulator=0,experimentLog=[];
function physicsStep(dt){
 if(!flight||paused)return;
 elapsed+=dt;updateStageDebris(dt);const mins=Math.floor(elapsed/60),secs=Math.floor(elapsed%60);$('#mission-time').textContent='T+ '+String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
 if(keys.shift)throttle=Math.min(1,throttle+dt*.35);if(keys.control)throttle=Math.max(0,throttle-dt*.35);const controlGain=rcsEnabled?1.6:.8;const pitch=(keys.w?1:0)-(keys.s?1:0),yaw=(keys.d?1:0)-(keys.a?1:0),roll=(keys.e?1:0)-(keys.q?1:0);
 angular.x+=pitch*dt*controlGain;angular.y+=yaw*dt*controlGain;angular.z+=roll*dt*controlGain;angular.multiplyScalar(Math.exp(-dt*(sasEnabled?4.5:.8)));
 const dq=new THREE.Quaternion().setFromEuler(new THREE.Euler(angular.x*dt,angular.y*dt,angular.z*dt,'YXZ'));attitude.multiply(dq).normalize();
 const liquidTanks=parts.filter(p=>['tank','fuselage'].includes(p.data.type)&&p.stage<=stage&&p.fuel>0);const activeEngines=parts.filter(p=>['engine','booster','jet'].includes(p.data.type)&&p.stage<=stage&&(p.data.type==='booster'?p.fuel>0:liquidTanks.length>0));
 const liquidEngines=activeEngines.filter(p=>p.data.type==='engine'||p.data.type==='jet'),solidEngines=activeEngines.filter(p=>p.data.type==='booster');const currentAltitude=Math.max(0,position.clone().sub(bodyCenter).length()-BODY.radius),pressureRatio=THREE.MathUtils.clamp(atmosphericDensity(currentAltitude)/1.225,0,1),engineThrust=p=>THREE.MathUtils.lerp(p.data.thrust||0,p.data.seaLevelThrust??p.data.thrust??0,pressureRatio),engineIsp=p=>THREE.MathUtils.lerp(p.data.isp||320,p.data.seaLevelIsp??p.data.isp??320,pressureRatio);const liquidThrustN=liquidEngines.reduce((s,p)=>s+engineThrust(p)*1000,0)*throttle,solidThrustN=solidEngines.reduce((s,p)=>s+engineThrust(p)*1000,0),totalThrustN=liquidThrustN+solidThrustN;
 const massKg=Math.max(1,rocketMassKg(parts));
 const thrustDirection=new THREE.Vector3(0,aircraftCraft?0:1,aircraftCraft?1:0).applyQuaternion(attitude).normalize();
 const liquidMdot=liquidEngines.reduce((s,p)=>s+engineThrust(p)*1000/(Math.max(1,engineIsp(p))*G0),0)*throttle,solidMdot=solidEngines.reduce((s,p)=>s+engineThrust(p)*1000/(Math.max(1,engineIsp(p))*G0),0),mdot=liquidMdot+solidMdot;
 const acceleration=(pos,vel)=>{
   const grav=gravityAcceleration(pos,BODY.mu,bodyCenter);
   const aero=aerodynamicAcceleration(pos,vel,{x:thrustDirection.x,y:thrustDirection.y,z:thrustDirection.z},parts,massKg,bodyCenter);
   return {x:grav.x+thrustDirection.x*totalThrustN/massKg/1000+aero.x,y:grav.y+thrustDirection.y*totalThrustN/massKg/1000+aero.y,z:grav.z+thrustDirection.z*totalThrustN/massKg/1000+aero.z};
 };
 properG=(totalThrustN/massKg)/G0;
 const state=rk4Step({x:position.x,y:position.y,z:position.z},{x:velocity.x,y:velocity.y,z:velocity.z},dt,acceleration);
 position.set(state.position.x,state.position.y,state.position.z);velocity.set(state.velocity.x,state.velocity.y,state.velocity.z);
 if(mdot>0){let liquidBurn=liquidMdot*dt;const feedable=liquidTanks.filter(t=>t.fuel>0),feedTotal=feedable.reduce((s,t)=>s+t.fuel,0);if(feedTotal>0){for(const tank of feedable){const share=liquidBurn*(tank.fuel/feedTotal);tank.fuel=Math.max(0,tank.fuel-Math.min(tank.fuel,share));}}let solidBurn=solidMdot*dt;const burningBoosters=solidEngines.filter(p=>p.fuel>0),solidFuelTotal=burningBoosters.reduce((s,p)=>s+p.fuel,0);if(solidFuelTotal>0){for(const booster of burningBoosters){const share=solidBurn*(booster.fuel/solidFuelTotal);booster.fuel=Math.max(0,booster.fuel-Math.min(booster.fuel,share));}}fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);if((maxFuel?Math.round(fuel/maxFuel*100):0)!==stageUiFuelPercent)renderStages();}
 const radial=position.clone().sub(bodyCenter),radius=radial.length(),altitude=radius-BODY.radius;
 if(altitude>flightPeakAltitude)flightPeakAltitude=altitude;if(altitude<=0){position.copy(bodyCenter).add(radial.normalize().multiplyScalar(BODY.radius));const normal=position.clone().sub(bodyCenter).normalize(),impact=velocity.dot(normal);if(impact< -8){flight=false;toast('地表衝突 — 機体が破損しました');}else{velocity.addScaledVector(normal,-Math.min(0,impact));velocity.multiplyScalar(.985);if(flight&&flightPeakAltitude>=1){flight=false;throttle=0;const earnedStars=flightPeakAltitude>=70?5:flightPeakAltitude>=10?2:1;crewMembers.forEach(k=>{k.stars=Math.max(1,Math.min(5,Math.max(1,k.stars??1)+earnedStars));k.stupidity=undefined;k.bravery=undefined;syncCrewAbilities(k);});saveCareer();toast(flightPeakAltitude>=70?'宇宙飛行から帰還！乗組員の経験が★5になりました':flightPeakAltitude>=10?'高高度飛行から帰還！乗組員の経験が上がりました':'飛行回収成功！乗組員の経験が上がりました');}}}
 const groundNormal=radial.clone().normalize(),surfaceVelocity=velocity.clone().addScaledVector(groundNormal,-velocity.dot(groundNormal)),wheelForward=new THREE.Vector3(0,0,1).applyQuaternion(attitude),signedGroundSpeed=surfaceVelocity.dot(wheelForward)*1000,wheelMotion=altitude<.08?signedGroundSpeed:0;
 rocket.position.copy(position);rocket.quaternion.copy(attitude);for(const part of parts){if(part.deployed)part.deployProgress=Math.min(1,(part.deployProgress||0)+dt/1.8);if(part.mesh){part.mesh.traverse(node=>{if(node.name==='wheel-spin'){const rr=Math.max(.05,node.userData.rollRadius||.3);node.rotation.x+=wheelMotion/rr*dt;}});const plume=part.mesh.getObjectByName('engine-flame');if(plume){plume.visible=flight&&activeEngines.includes(part)&&(part.data.type==='booster'?part.fuel>0:throttle>0);plume.scale.setScalar(part.data.type==='booster'?1.5:.5+throttle*1.4);}const rig=part.mesh.getObjectByName('parachute-rig');if(rig){rig.visible=!!part.deployed;const canopy=rig.getObjectByName('parachute-canopy');if(canopy)canopy.scale.setScalar(.04+.96*(part.deployProgress||0));}}}
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
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.04,(now-last)/1000);last=now;physics(dt);if(mode==='vab'){rocket.rotation.y=0;updateHangarCrew(dt);}if(mode!=='crew')renderer.render(scene,camera);}requestAnimationFrame(tick);
$('#funds-toggle').onclick=()=>{fundsUnlimited=!fundsUnlimited;saveCareer();recalc();toast(fundsUnlimited?'資金を無制限にしました':'通常の資金制に戻しました');};
setMode('vab');layout();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});