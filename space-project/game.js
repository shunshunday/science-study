import * as THREE from 'three';
import {BODY,G0,gravityAcceleration,atmosphericDensity,orbitalElements,rk4Step,deltaV,rocketMassKg} from './physics/orbital.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],toast=m=>{let t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)};
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8298a6);scene.fog=new THREE.Fog(0x8298a6,180,600);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.0001,20000);camera.position.set(24,18,34);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('#viewport').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xd8e8ff,0x665344,1.8));const sun=new THREE.DirectionalLight(0xffedcf,3.1);sun.position.set(-35,70,25);sun.castShadow=true;scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshStandardMaterial({color:0x7e8d73,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.001;ground.receiveShadow=true;scene.add(ground);
const planet=new THREE.Mesh(new THREE.SphereGeometry(600,64,48),new THREE.MeshStandardMaterial({color:0x477f9a,roughness:.9}));planet.position.set(0,-600,0);planet.visible=true;scene.add(planet);

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
const rocket=new THREE.Group();rocket.scale.setScalar(.001);scene.add(rocket);const parts=[];let mode='center',funds=25000,science=0,stage=0,assemblyStage=0,throttle=0,flight=false,paused=false,sasEnabled=false,rcsEnabled=false,elapsed=0,craftMass=0,fuel=0,maxFuel=0,thrust=0,position=new THREE.Vector3(0,2,0),velocity=new THREE.Vector3(),attitude=new THREE.Quaternion(),angular=new THREE.Vector3(),last=performance.now(),map=false;
const catalog=[
{id:'pod',name:'Mk1 コマンドポッド',type:'pod',mass:0.84,cost:600,crew:1,icon:'◉',height:2,radius:.9},
{id:'probe',name:'プローブコア',type:'probe',mass:.1,cost:450,icon:'⌖',height:.7,radius:.65},
{id:'tank-s',name:'FL-T100 燃料タンク',type:'tank',mass:.062,fuel:360,cost:275,icon:'▤',height:1.4,radius:.62},
{id:'tank-m',name:'FL-T400 燃料タンク',type:'tank',mass:.25,fuel:1440,cost:700,icon:'▤',height:2.8,radius:.72},
{id:'tank-l',name:'X200-16 燃料タンク',type:'tank',mass:.45,fuel:2880,cost:1100,icon:'▤',height:3.5,radius:.9},
{id:'engine-s',name:'LV-909 液体エンジン',type:'engine',mass:.5,cost:390,thrust:60,isp:320,icon:'◈',height:1.3,radius:.65},
{id:'engine-m',name:'LV-T45 エンジン',type:'engine',mass:1.5,cost:1200,thrust:200,isp:320,icon:'◈',height:2,radius:.9},
{id:'engine-l',name:'Mainsail 大型エンジン',type:'engine',mass:6,cost:8500,thrust:1500,isp:310,icon:'◈',height:3,radius:1.5},
{id:'decoupler',name:'TD-12 デカプラー',type:'decoupler',mass:.05,cost:400,icon:'⊖',height:.35,radius:.78},
{id:'booster',name:'固体燃料ブースター',type:'booster',mass:1.5,cost:900,fuel:800,thrust:180,isp:220,icon:'▥',height:3.5,radius:.55},
{id:'fin',name:'空力フィン',type:'fin',mass:.08,cost:120,icon:'△',height:.6,radius:.9},
{id:'chute',name:'Mk16 パラシュート',type:'chute',mass:.1,cost:400,icon:'⌃',height:.6,radius:.8},
{id:'battery',name:'Z-100 バッテリー',type:'battery',mass:.05,cost:80,icon:'▣',height:.35,radius:.5},
{id:'solar',name:'OX-STAT ソーラーパネル',type:'solar',mass:.017,cost:75,icon:'▦',height:.3,radius:1},
{id:'science',name:'科学実験装置',type:'science',mass:.1,cost:450,icon:'⚗',height:.55,radius:.55}
];
function material(c,metal=0.3){return new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:.38});}
function partMesh(p){const g=new THREE.Group(),r=p.radius,h=p.height;let body;if(p.type==='pod'){body=new THREE.Mesh(new THREE.CylinderGeometry(.62,.82,1.35,16),material(0xd8d7c9,.55));body.position.y=.7;g.add(body);const nose=new THREE.Mesh(new THREE.SphereGeometry(.63,16,12,0,Math.PI*2,0,Math.PI/2),material(0xb9c8c9,.4));nose.position.y=1.35;g.add(nose);const window=new THREE.Mesh(new THREE.CircleGeometry(.2,20),material(0x315e77,.7));window.position.set(0,.85,.625);g.add(window);}else if(p.type==='engine'){body=new THREE.Mesh(new THREE.CylinderGeometry(r*.7,r,h,16),material(0x858c8e,.75));body.position.y=h/2;g.add(body);const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(r*.35,r*.7,.5,16),material(0x424b50,.8));nozzle.position.y=-.25;g.add(nozzle);const flame=new THREE.Mesh(new THREE.ConeGeometry(r*.42,.9,12),new THREE.MeshBasicMaterial({color:0xff9b37,transparent:true,opacity:.82}));flame.name='engine-flame';flame.rotation.x=Math.PI;flame.position.y=-.82;flame.visible=false;g.add(flame);}else if(p.type==='fin'){const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(.2,0);shape.lineTo(.85,.8);shape.lineTo(.12,.65);shape.closePath();body=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:1}),material(0x9b9d99));g.add(body);}else{body=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.98,h,16),material(p.type==='tank'?0xb9c0bf:p.type==='booster'?0xc6c1b2:p.type==='decoupler'?0x7f898b:p.type==='chute'?0xc4c0b5:0x8d9b9c,.6));body.position.y=h/2;g.add(body);if(p.type==='tank'||p.type==='booster'){const band=new THREE.Mesh(new THREE.TorusGeometry(r,.045,6,24),material(0x525e62,.7));band.rotation.x=Math.PI/2;band.position.y=h*.22;g.add(band);}}g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;}
function recalc(){craftMass=rocketMassKg(parts)/1000;fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);maxFuel=parts.reduce((s,p)=>s+(p.data.fuel||0),0);thrust=parts.reduce((s,p)=>s+(p.data.thrust||0),0);const dv=deltaV(parts);$('#craft-name').textContent='機体重量 '+craftMass.toFixed(2)+' t　Δv '+Math.round(dv)+' m/s　推力 '+thrust+' kN';$('#funds').textContent='₡'+funds.toLocaleString();$('#science').textContent=science;}
function layout(){rocket.clear();let y=parts.reduce((sum,p)=>sum+p.data.height*.82,0);for(const p of parts){const m=partMesh(p.data),h=p.data.height;y-=h*.82;p.mesh=m;p.y=y;m.position.y=y;rocket.add(m);}rocket.position.y=0;recalc();$('#stage-build-label').textContent='組立ステージ '+assemblyStage;}
function addPart(id){const d=catalog.find(x=>x.id===id);if(!d)return;if(funds<d.cost){toast('資金が不足しています');return;}funds-=d.cost;parts.push({data:d,fuel:d.fuel||0,stage:assemblyStage});layout();toast(d.name+' を追加');}
function setMode(m){mode=m;campus.visible=m==='center';$$('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===m));$('#parts').classList.toggle('open',m==='vab');$('#flight-hud').classList.toggle('show',m==='flight');$('.vab-tools').classList.toggle('hidden',m!=='vab');$('#hint').classList.toggle('hidden',m==='flight');if(m==='center'){camera.position.set(.14,.10,.20);camera.lookAt(0,.005,0);rocket.visible=false;$('#hint').textContent='宇宙センター：ロケット組立棟で機体を設計し、発射場から宇宙へ。';}if(m==='vab'){rocket.visible=true;rocket.position.set(0,0,0);camera.position.set(.012,.009,.016);camera.lookAt(0,.005,0);$('#hint').textContent='パーツを追加してロケットを組み立てます。ステージは下段から順に作動。';}if(m==='research'){rocket.visible=false;$('#hint').textContent='研究開発：飛行・実験で得た科学ポイントを使って技術を解放します。';}if(m==='contracts'){rocket.visible=false;$('#hint').textContent='ミッション管理：軌道投入・高度到達・回収などの契約を選択します。';}if(m==='flight'){rocket.visible=true;camera.position.set(.022,.014,.027);}}
$$('[data-screen]').forEach(b=>b.onclick=()=>{if(b.dataset.screen==='research'){panelMessage('研究開発','科学ポイント '+science+'\n初期技術：基礎ロケット\n次の技術：高度推進（科学 20）');}else if(b.dataset.screen==='contracts'){panelMessage('ミッション管理','契約：高度 10 km 到達\n報酬 ₡3,000 / 評判 +5\n契約：安定軌道へ投入\n報酬 ₡8,000 / 科学 +10');}setMode(b.dataset.screen);});
function panelMessage(title,msg){toast(title+' — '+msg.replaceAll('\n',' / '));}
$('#home').onclick=()=>{flight=false;setMode('center');};
$('#part-list').innerHTML=catalog.map(p=>'<button class="part" data-part="'+p.id+'"><span class="part-icon">'+p.icon+'</span><span>'+p.name+'<small>質量 '+p.mass+' t　₡'+p.cost+'</small></span></button>').join('');
$('#part-list').addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(b)addPart(b.dataset.part);});$('#close-parts').onclick=()=>$('#parts').classList.remove('open');
$('#clear-craft').onclick=()=>{if(flight)return;parts.length=0;assemblyStage=0;layout();toast('機体を空にしました');};
$('#new-stage').onclick=()=>{if(flight)return;assemblyStage++;$('#stage-build-label').textContent='組立ステージ '+assemblyStage;toast('新しい組立ステージ '+assemblyStage);};
$('#save-craft').onclick=()=>{localStorage.setItem('space-craft-v1',JSON.stringify(parts.map(p=>({id:p.data.id,stage:p.stage,fuel:p.fuel}))));toast('機体を保存しました');};
$('#load-craft').onclick=()=>{try{const a=JSON.parse(localStorage.getItem('space-craft-v1')||'[]');parts.length=0;a.forEach(v=>{const d=catalog.find(p=>p.id===v.id);if(d)parts.push({data:d,stage:v.stage,fuel:v.fuel??d.fuel??0});});assemblyStage=Math.max(0,...parts.map(p=>p.stage||0));layout();toast('機体を読み込みました');}catch{toast('保存データがありません');}};
function startFlight(){if(!parts.length){toast('先にロケットを組み立ててください');return;}if(!parts.some(p=>p.data.type==='engine'||p.data.type==='booster')){toast('エンジンまたはブースターが必要です');return;}if(!parts.some(p=>['tank','booster'].includes(p.data.type)&&(p.fuel||0)>0)){toast('燃料タンクまたは燃料入りブースターが必要です');return;}flight=true;paused=false;elapsed=0;stage=0;throttle=0;flightAccumulator=0;window._orb=false;sasEnabled=false;rcsEnabled=false;position.set(0,.002,0);velocity.set(0,0,0);angular.set(0,0,0);attitude.identity();rocket.position.copy(position);rocket.quaternion.copy(attitude);rocket.visible=true;setMode('flight');toast('発射準備完了 — Zでスロットル最大、Spaceで点火');}
$('#launch').onclick=startFlight;$('#map-toggle').onclick=()=>{map=!map;toast(map?'軌道マップ表示（M）':'飛行ビュー');};
let keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.code==='Space'&&flight){e.preventDefault();activateStage();}if(e.key.toLowerCase()==='z')throttle=1;if(e.key.toLowerCase()==='x')throttle=0;if(e.key.toLowerCase()==='t'){sasEnabled=!sasEnabled;toast('SAS '+(sasEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='r'){rcsEnabled=!rcsEnabled;toast('RCS '+(rcsEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='m'&&flight){map=!map;}});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function activateStage(){const previous=stage;stage++;const hasSeparator=parts.some(p=>p.data.type==='decoupler'&&p.stage===previous);if(hasSeparator){for(let i=parts.length-1;i>=0;i--)if(parts[i].stage===previous)parts.splice(i,1);layout();}toast('ステージ '+stage+' 作動');}
const bodyCenter=new THREE.Vector3(0,-BODY.radius,0);
let properG=1,flightAccumulator=0;
function physicsStep(dt){
 if(!flight||paused)return;
 elapsed+=dt;
 if(keys.shift)throttle=Math.min(1,throttle+dt*.35);if(keys.control)throttle=Math.max(0,throttle-dt*.35);const controlGain=rcsEnabled?1.6:.8;const pitch=(keys.w?1:0)-(keys.s?1:0),yaw=(keys.d?1:0)-(keys.a?1:0),roll=(keys.e?1:0)-(keys.q?1:0);
 angular.x+=pitch*dt*controlGain;angular.y+=yaw*dt*controlGain;angular.z+=roll*dt*controlGain;angular.multiplyScalar(Math.exp(-dt*(sasEnabled?4.5:.8)));
 const dq=new THREE.Quaternion().setFromEuler(new THREE.Euler(angular.x*dt,angular.y*dt,angular.z*dt,'YXZ'));attitude.multiply(dq).normalize();
 const liquidTanks=parts.filter(p=>p.data.type==='tank'&&p.stage<=stage&&p.fuel>0);const activeEngines=parts.filter(p=>['engine','booster'].includes(p.data.type)&&p.stage<=stage&&(p.data.type==='engine'?liquidTanks.length>0:p.fuel>0));
 const totalThrustN=activeEngines.reduce((s,p)=>s+(p.data.thrust||0)*1000,0)*throttle;
 const massKg=Math.max(1,rocketMassKg(parts));
 const thrustDirection=new THREE.Vector3(0,1,0).applyQuaternion(attitude).normalize();
 const liquidMdot=activeEngines.filter(p=>p.data.type==='engine').reduce((s,p)=>s+(p.data.thrust||0)*1000/(Math.max(1,p.data.isp||320)*G0),0)*throttle,solidMdot=activeEngines.filter(p=>p.data.type==='booster').reduce((s,p)=>s+(p.data.thrust||0)*1000/(Math.max(1,p.data.isp||220)*G0),0)*throttle,mdot=liquidMdot+solidMdot;
 const acceleration=(pos,vel)=>{
   const grav=gravityAcceleration(pos,BODY.mu,bodyCenter);
   const r=new THREE.Vector3(pos.x-bodyCenter.x,pos.y-bodyCenter.y,pos.z-bodyCenter.z);
   const altitude=Math.max(0,r.length()-BODY.radius),rho=atmosphericDensity(altitude),v=Math.hypot(vel.x,vel.y,vel.z);
   const dragScale=v>0?-.5*rho*(v*1000)*.8/massKg:0;
   return {x:grav.x+thrustDirection.x*totalThrustN/massKg/1000+vel.x*dragScale,y:grav.y+thrustDirection.y*totalThrustN/massKg/1000+vel.y*dragScale,z:grav.z+thrustDirection.z*totalThrustN/massKg/1000+vel.z*dragScale};
 };
 properG=(totalThrustN/massKg)/G0;
 const state=rk4Step({x:position.x,y:position.y,z:position.z},{x:velocity.x,y:velocity.y,z:velocity.z},dt,acceleration);
 position.set(state.position.x,state.position.y,state.position.z);velocity.set(state.velocity.x,state.velocity.y,state.velocity.z);
 if(mdot>0){let liquidBurn=liquidMdot*dt;for(const tank of liquidTanks){const take=Math.min(tank.fuel,liquidBurn);tank.fuel-=take;liquidBurn-=take;if(liquidBurn<=1e-8)break;}let solidBurn=solidMdot*dt;for(const booster of activeEngines.filter(p=>p.data.type==='booster')){const take=Math.min(booster.fuel,solidBurn);booster.fuel-=take;solidBurn-=take;if(solidBurn<=1e-8)break;}fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);}
 const radial=position.clone().sub(bodyCenter),radius=radial.length(),altitude=radius-BODY.radius;
 if(altitude<=0){position.copy(bodyCenter).add(radial.normalize().multiplyScalar(BODY.radius));const normal=position.clone().sub(bodyCenter).normalize(),impact=velocity.dot(normal);if(impact< -8){flight=false;toast('地表衝突 — 機体が破損しました');}else{velocity.addScaledVector(normal,-Math.min(0,impact));velocity.multiplyScalar(.985);}}
 rocket.position.copy(position);rocket.quaternion.copy(attitude);for(const part of parts){if(part.mesh){const plume=part.mesh.getObjectByName('engine-flame');if(plume){plume.visible=flight&&throttle>0&&activeEngines.includes(part);plume.scale.setScalar(.5+throttle*1.4);}}}
 const forward=new THREE.Vector3(0,0,1).applyQuaternion(attitude),heading=(Math.atan2(forward.x,forward.z)*180/Math.PI+360)%360;$('#heading').textContent='HDG '+Math.round(heading).toString().padStart(3,'0')+'°';const attitudeEuler=new THREE.Euler().setFromQuaternion(attitude,'YXZ');$('.navball-sky').style.transform='rotate('+(-attitudeEuler.z*180/Math.PI)+'deg)';
 const elements=orbitalElements(position,velocity,BODY.mu,bodyCenter),alt=Math.max(0,elements.altitude),spd=elements.speed,verticalSpeed=velocity.dot(position.clone().sub(bodyCenter).normalize());
 $('#altitude').textContent='高度 '+Math.round(alt*1000).toLocaleString()+' m';$('#speed').textContent='速度 '+(spd*1000).toFixed(1)+' m/s';$('#vertical').textContent='垂直速度 '+(verticalSpeed*1000).toFixed(1)+' m/s';$('#throttle').textContent='スロットル '+Math.round(throttle*100)+'%';$('#fuel').textContent='燃料 '+(maxFuel?Math.round(fuel/maxFuel*100):0)+'%';$('#stage-label').textContent='ステージ '+stage;$('#gforce').textContent='G '+properG.toFixed(1);
 $('#apo').textContent='遠点 '+(Number.isFinite(elements.apoapsisAltitude)?Math.round(elements.apoapsisAltitude*1000).toLocaleString()+' m':'脱出軌道');$('#peri').textContent='近点 '+(Number.isFinite(elements.periapsisAltitude)?Math.round(elements.periapsisAltitude*1000).toLocaleString()+' m':'--');
 const atmospheric=THREE.MathUtils.clamp(1-alt/BODY.atmosphereHeight,0,1);scene.background.set(new THREE.Color(0x030914).lerp(new THREE.Color(0x8298a6),atmospheric));
 const chaseOffset=map?new THREE.Vector3(0,.18,.001):new THREE.Vector3(.022,.014,.027);camera.position.lerp(position.clone().add(chaseOffset),.035);camera.lookAt(position.clone().add(new THREE.Vector3(0,.005,0)));
 if(alt>100&&!window._orb){window._orb=true;toast('大気圏外へ到達');science+=5;$('#science').textContent=science;}
}
function physics(dt){if(!flight||paused)return;flightAccumulator+=Math.min(dt,.1);const fixed=1/120;let steps=0;while(flightAccumulator>=fixed&&steps<12){physicsStep(fixed);flightAccumulator-=fixed;steps++;}if(steps===12)flightAccumulator=0;}
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.04,(now-last)/1000);last=now;physics(dt);if(!flight&&mode==='center'){rocket.rotation.y=now*.00015;}if(mode==='vab'){rocket.rotation.y=0;}renderer.render(scene,camera);}requestAnimationFrame(tick);
setMode('center');layout();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});$('#boot').style.display='none';