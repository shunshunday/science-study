import * as THREE from 'three';
import {BODY,G0,gravityAcceleration,atmosphericDensity,orbitalElements,rk4Step,deltaV,rocketMassKg} from './physics/orbital.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],toast=m=>{let t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)};
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8298a6);scene.fog=new THREE.Fog(0x8298a6,180,600);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.0001,20000);camera.position.set(24,18,34);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('#viewport').appendChild(renderer.domElement);
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
const rocket=new THREE.Group();rocket.scale.setScalar(.001);scene.add(rocket);const parts=[];let mode='center',gameMode=localStorage.getItem('space-game-mode')||'career',funds=25000,science=0,stage=0,assemblyStage=0,stageUiFuelPercent=-1,throttle=0,flight=false,paused=false,sasEnabled=false,rcsEnabled=false,elapsed=0,craftMass=0,fuel=0,maxFuel=0,thrust=0,position=new THREE.Vector3(0,2,0),velocity=new THREE.Vector3(),attitude=new THREE.Quaternion(),angular=new THREE.Vector3(),last=performance.now(),map=false;
const catalog=[
{id:'pod',name:'Mk1 コマンドポッド',type:'pod',tech:'basic',mass:0.84,cost:600,crew:1,icon:'◉',height:2,radius:.9},
{id:'probe',name:'プローブコア',type:'probe',tech:'basic',mass:.1,cost:450,icon:'⌖',height:.7,radius:.65},
{id:'tank-s',name:'FL-T100 燃料タンク',type:'tank',tech:'basic',mass:.062,fuel:360,cost:275,icon:'▤',height:1.4,radius:.62},
{id:'tank-m',name:'FL-T400 燃料タンク',type:'tank',tech:'basic',mass:.25,fuel:1440,cost:700,icon:'▤',height:2.8,radius:.72},
{id:'tank-l',name:'X200-16 燃料タンク',type:'tank',tech:'heavy',mass:.45,fuel:2880,cost:1100,icon:'▤',height:3.5,radius:.9},
{id:'engine-s',name:'LV-909 液体エンジン',type:'engine',tech:'basic',mass:.5,cost:390,thrust:60,isp:320,icon:'◈',height:1.3,radius:.65},
{id:'engine-m',name:'LV-T45 エンジン',type:'engine',tech:'basic',mass:1.5,cost:1200,thrust:200,isp:320,icon:'◈',height:2,radius:.9},
{id:'engine-l',name:'Mainsail 大型エンジン',type:'engine',tech:'heavy',mass:6,cost:8500,thrust:1500,isp:310,icon:'◈',height:3,radius:1.5},
{id:'decoupler',name:'TD-12 デカプラー',type:'decoupler',tech:'basic',mass:.05,cost:400,icon:'⊖',height:.35,radius:.78},
{id:'booster',name:'固体燃料ブースター',type:'booster',tech:'basic',mass:1.5,cost:900,fuel:800,thrust:180,isp:220,icon:'▥',height:3.5,radius:.55},
{id:'fin',name:'空力フィン',type:'fin',tech:'basic',mass:.08,cost:120,icon:'△',height:.6,radius:.9},
{id:'chute',name:'Mk16 パラシュート',type:'chute',tech:'basic',mass:.1,cost:400,icon:'⌃',height:.6,radius:.8},
{id:'battery',name:'Z-100 バッテリー',type:'battery',tech:'flight',mass:.05,cost:80,icon:'▣',height:.35,radius:.5},
{id:'solar',name:'OX-STAT ソーラーパネル',type:'solar',tech:'flight',mass:.017,cost:75,icon:'▦',height:.3,radius:1},
{id:'science',name:'科学実験装置',type:'science',tech:'science',mass:.1,cost:450,icon:'⚗',height:.55,radius:.55}
];
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
let unlockedTech=new Set(['basic']),activeContract=null,crewMembers=[{id:1,name:'Jebediah Kerman',role:'パイロット',level:1},{id:2,name:'Valentina Kerman',role:'パイロット',level:1},{id:3,name:'Bob Kerman',role:'科学者',level:1}];
function saveCareer(){const key=gameMode==='career'?'space-career-v1':'space-'+gameMode+'-v1';localStorage.setItem(key,JSON.stringify({funds,science,unlocked:[...unlockedTech],activeContract:activeContract?.id||null,crew:crewMembers}));}
function renderPartList(){$('#part-list').innerHTML=catalog.map(p=>{const unlocked=gameMode==='sandbox'||unlockedTech.has(p.tech||'basic');return '<button class="part" data-part="'+p.id+'" '+(unlocked?'':'disabled')+'><span class="part-icon">'+p.icon+'</span><span>'+p.name+'<small>質量 '+p.mass+' t　'+(gameMode==='sandbox'?'無料':'₡'+p.cost)+(unlocked?'':'　🔒研究が必要')+'</small></span></button>';}).join('');}
function renderResearch(){$('#career-title').textContent='研究開発';$('#career-content').innerHTML='<div class="career-content"><p>利用可能な科学ポイント：<b>'+science+'</b></p>'+techTree.map(t=>{const done=unlockedTech.has(t.id),ready=t.requires.every(x=>unlockedTech.has(x))&&science>=t.cost;return '<div class="career-item"><h3>'+t.name+'</h3><p>'+t.description+'</p><span class="career-tag">必要科学：'+t.cost+'　前提：'+(t.requires.join(', ')||'なし')+'</span><br><button data-unlock-tech="'+t.id+'" '+(done||!ready?'disabled':'')+'>'+(done?'解放済み':ready?'研究を完了':'条件未達')+'</button></div>';}).join('')+'</div>';}
function renderCrew(){$('#career-title').textContent='乗組員管理';$('#career-content').innerHTML='<div class="career-content"><p>乗組員を雇用し、訓練してミッションに備えます。</p>'+crewMembers.map(k=>'<div class="career-item"><h3>'+k.name+'</h3><p>'+k.role+'　/　経験レベル '+k.level+'</p><button data-train-crew="'+k.id+'" '+(gameMode==='sandbox'?'':'')+'>訓練 '+(gameMode==='sandbox'?'無料':'₡1,000')+'</button></div>').join('')+'<div class="career-item"><h3>新しい乗組員を雇用</h3><p>パイロット・エンジニア・科学者を採用できます。</p><button data-hire-crew="pilot">パイロットを雇用</button><button data-hire-crew="engineer">エンジニアを雇用</button><button data-hire-crew="scientist">科学者を雇用</button></div></div>';}$('#career-title').textContent='ミッション管理';$('#career-content').innerHTML='<div class="career-content">'+(activeContract?'<div class="career-item"><h3>受注中：'+activeContract.name+'</h3><p>'+activeContract.description+'</p><span class="career-tag">報酬 ₡'+activeContract.reward.toLocaleString()+' / 科学 '+activeContract.science+'</span></div>':'<p>受注中の契約はありません。</p>')+contracts.map(k=>'<div class="career-item"><h3>'+k.name+'</h3><p>'+k.description+'</p><span class="career-tag">報酬 ₡'+k.reward.toLocaleString()+' / 科学 '+k.science+'</span><br><button data-accept-contract="'+k.id+'" '+(activeContract?'disabled':'')+'>契約を受注</button></div>').join('')+'</div>';}
try{const saveKey=gameMode==='career'?'space-career-v1':'space-'+gameMode+'-v1';const savedCareer=JSON.parse(localStorage.getItem(saveKey)||'null');if(savedCareer){funds=savedCareer.funds??funds;science=savedCareer.science??science;unlockedTech=new Set(savedCareer.unlocked||['basic']);activeContract=contracts.find(k=>k.id===savedCareer.activeContract)||null;crewMembers=savedCareer.crew||crewMembers;}}catch{}if(gameMode==='sandbox'){funds=999999999;unlockedTech=new Set(techTree.map(t=>t.id));activeContract=null;}if(gameMode==='science')activeContract=null;
function material(c,metal=0.3){return new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:.38});}
function partMesh(p){
 const g=new THREE.Group(),r=p.radius,h=p.height,metal=material(0x899398,.72),dark=material(0x3c474d,.82),white=material(0xd8d7c9,.55),glass=material(0x315e77,.35);
 if(p.type==='pod'){
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.62,.82,1.35,24),white);body.position.y=.7;g.add(body);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.63,24,16,0,Math.PI*2,0,Math.PI/2),material(0xb9c8c9,.4));nose.position.y=1.35;g.add(nose);
  const window=new THREE.Mesh(new THREE.CircleGeometry(.2,24),glass);window.position.set(0,.85,.625);g.add(window);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.23,.045,8,24),dark);rim.position.set(0,.85,.63);g.add(rim);
 }else if(p.type==='probe'){
  const core=new THREE.Mesh(new THREE.OctahedronGeometry(.48,1),material(0xb4b9b7,.7));core.position.y=.4;g.add(core);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.75,8),dark);mast.position.y=1.05;g.add(mast);
  const antenna=new THREE.Mesh(new THREE.SphereGeometry(.14,12,8),material(0xd8c17c,.4));antenna.position.y=1.45;g.add(antenna);
 }else if(p.type==='engine'){
  const body=new THREE.Mesh(new THREE.CylinderGeometry(r*.7,r,h,24),metal);body.position.y=h/2;g.add(body);
  const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(r*.35,r*.7,.65,24),dark);nozzle.position.y=-.32;g.add(nozzle);
  const flame=new THREE.Mesh(new THREE.ConeGeometry(r*.42,.9,16),new THREE.MeshBasicMaterial({color:0xff9b37,transparent:true,opacity:.82}));flame.name='engine-flame';flame.rotation.x=Math.PI;flame.position.y=-.82;flame.visible=false;g.add(flame);
 }else if(p.type==='tank'){
  const shell=new THREE.Mesh(new THREE.CylinderGeometry(r*.98,r*.98,h*.82,24),material(0xb9c0bf,.58));shell.position.y=h*.5;g.add(shell);
  for(const yy of [h*.09,h*.9]){const cap=new THREE.Mesh(new THREE.SphereGeometry(r*.98,20,12),material(0xaeb8b8,.62));cap.scale.y=.22;cap.position.y=yy;g.add(cap);}
  for(const yy of [h*.2,h*.78]){const band=new THREE.Mesh(new THREE.TorusGeometry(r*.99,.045,8,32),dark);band.rotation.x=Math.PI/2;band.position.y=yy;g.add(band);}
 }else if(p.type==='booster'){
  const shell=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.94,h*.78,20),white);shell.position.y=h*.48;g.add(shell);
  const nose=new THREE.Mesh(new THREE.ConeGeometry(r,h*.22,20),material(0xc8c5b8,.72));nose.position.y=h*.98;g.add(nose);
  const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(r*.28,r*.5,.45,16),dark);nozzle.position.y=-.12;g.add(nozzle);
  const flame=new THREE.Mesh(new THREE.ConeGeometry(r*.42,.9,12),new THREE.MeshBasicMaterial({color:0xff8b2d,transparent:true,opacity:.82}));flame.name='engine-flame';flame.rotation.x=Math.PI;flame.position.y=-.72;flame.visible=false;g.add(flame);
 }else if(p.type==='decoupler'){
  const ring=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.88,h,24),dark);ring.position.y=h/2;g.add(ring);
  for(const yy of [.08,h-.08]){const lip=new THREE.Mesh(new THREE.TorusGeometry(r,.055,8,32),metal);lip.rotation.x=Math.PI/2;lip.position.y=yy;g.add(lip);}
 }else if(p.type==='fin'){
  const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(.2,0);shape.lineTo(.85,.8);shape.lineTo(.12,.65);shape.closePath();const fin=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2}),material(0x9b9d99));g.add(fin);
 }else if(p.type==='solar'){
  const hub=new THREE.Mesh(new THREE.BoxGeometry(.45,.32,.45),metal);hub.position.y=h/2;g.add(hub);
  for(const side of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(1.25,.055,1.05),material(0x244b72,.55));panel.position.set(side*.9,h/2,0);g.add(panel);for(let k=0;k<4;k++){const stripe=new THREE.Mesh(new THREE.BoxGeometry(.018,.012,1),material(0x8eb5cf,.4));stripe.position.set(side*.9+(k-1.5)*.24,h/2+.035,0);g.add(stripe);}}
 }else if(p.type==='battery'){
  const box=new THREE.Mesh(new THREE.BoxGeometry(r*1.7,h,r*1.5),material(0x9ca7a7,.7));box.position.y=h/2;g.add(box);
  const cap=new THREE.Mesh(new THREE.BoxGeometry(r*1.3,.08,r*1.2),dark);cap.position.y=h+.04;g.add(cap);
 }else if(p.type==='science'){
  const can=new THREE.Mesh(new THREE.CylinderGeometry(r*.65,r*.65,h*.8,16),white);can.position.y=h*.5;g.add(can);
  const dish=new THREE.Mesh(new THREE.SphereGeometry(r*.8,20,12,0,Math.PI*2,0,Math.PI/2),material(0x9ca9a9,.5));dish.position.y=h*.85;g.add(dish);
  const sensor=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.55,8),dark);sensor.position.set(0,h+.2,0);g.add(sensor);
 }else if(p.type==='chute'){
  const can=new THREE.Mesh(new THREE.CylinderGeometry(r*.75,r*.75,h,16),white);can.position.y=h/2;g.add(can);
  const lid=new THREE.Mesh(new THREE.TorusGeometry(r*.75,.06,8,24),material(0xc5a66d,.6));lid.rotation.x=Math.PI/2;lid.position.y=h;g.add(lid);
 }else{
  body=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.98,h,16),metal);body.position.y=h/2;g.add(body);
 }
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;
}
function renderStages(){stageUiFuelPercent=maxFuel?Math.round(fuel/maxFuel*100):0;const groups=[...new Set(parts.map(p=>p.stage))].sort((a,b)=>b-a);$('#stage-list').innerHTML=groups.map(n=>{const group=parts.filter(p=>p.stage===n),fuelMax=group.reduce((s,p)=>s+(p.data.fuel||0),0),fuelNow=group.reduce((s,p)=>s+(p.fuel||0),0),names=group.map(p=>p.data.name).join(' / ');return '<div class="stage-card '+(n<=stage?'active':'')+'"><b>'+n+'</b><span>'+names+'</span><small>'+(fuelMax?Math.round(fuelNow/fuelMax*100)+'% 推進剤':'パーツ '+group.length)+'</small><div class="fuel-track"><i style="width:'+(fuelMax?fuelNow/fuelMax*100:0)+'%"></i></div></div>';}).join('')||'<small>ステージなし</small>';}
function recalc(){craftMass=rocketMassKg(parts)/1000;fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);maxFuel=parts.reduce((s,p)=>s+(p.data.fuel||0),0);thrust=parts.reduce((s,p)=>s+(p.data.thrust||0),0);const dv=deltaV(parts);$('#craft-name').textContent='機体重量 '+craftMass.toFixed(2)+' t　Δv '+Math.round(dv)+' m/s　推力 '+thrust+' kN';$('#funds').textContent=gameMode==='sandbox'?'∞':'₡'+funds.toLocaleString();$('#science').textContent=science;renderStages();}
function layout(){rocket.clear();let y=0;for(const p of parts){const m=partMesh(p.data),h=p.data.height;p.mesh=m;p.y=y;m.position.y=y;rocket.add(m);y+=h*.82;}rocket.position.y=0;recalc();$('#stage-build-label').textContent='組立ステージ '+assemblyStage;}
function addPart(id){const d=catalog.find(x=>x.id===id);if(!d)return;if(gameMode!=='sandbox'&&!unlockedTech.has(d.tech||'basic')){toast('先に必要な技術を研究してください');return;}if(gameMode!=='sandbox'&&funds<d.cost){toast('資金が不足しています');return;}if(gameMode!=='sandbox')funds-=d.cost;saveCareer();parts.push({data:d,fuel:d.fuel||0,stage:assemblyStage});layout();toast(d.name+' を追加');}
function setMode(m){mode=m;campus.visible=m==='center';$('.tabs').classList.toggle('hidden',m==='flight');$('#home').classList.toggle('hidden',m==='flight');$$('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===m));$('#parts').classList.toggle('open',m==='vab');$('#flight-hud').classList.toggle('show',m==='flight');$('#career-panel').classList.toggle('hidden',m!=='research'&&m!=='contracts'&&m!=='crew');$('.vab-tools').classList.toggle('hidden',m!=='vab');$('#hint').classList.toggle('hidden',m==='flight');if(m==='center'){camera.position.set(.14,.10,.20);camera.lookAt(0,.005,0);rocket.visible=false;$('#hint').textContent='宇宙センター：ロケット組立棟で機体を設計し、発射場から宇宙へ。';}if(m==='vab'){rocket.visible=true;rocket.position.set(0,0,0);camera.position.set(.012,.009,.016);camera.lookAt(0,.005,0);$('#hint').textContent='下段から上段へ順にパーツを追加。ステージ0が先に作動し、分離後に上段ステージへ進みます。';}if(m==='research'){rocket.visible=false;$('#hint').textContent='研究開発：飛行・実験で得た科学ポイントを使って技術を解放します。';}if(m==='contracts'){rocket.visible=false;$('#hint').textContent='ミッション管理：軌道投入・高度到達・回収などの契約を選択します。';}if(m==='crew'){rocket.visible=false;$('#hint').textContent='乗組員管理：雇用・訓練を行い、飛行ミッションに備えます。';}if(m==='flight'){rocket.visible=true;camera.position.set(.022,.014,.027);}}
$('[data-screen]').forEach(b=>b.onclick=()=>{setMode(b.dataset.screen);if(b.dataset.screen==='research')renderResearch();if(b.dataset.screen==='contracts')renderContracts();if(b.dataset.screen==='crew')renderCrew();});
$('#career-close').onclick=()=>$('#career-panel').classList.add('hidden');
$('#career-content').addEventListener('click',e=>{const hire=e.target.closest('[data-hire-crew]');if(hire){const role=hire.dataset.hireCrew,cost=2500;if(gameMode!=='sandbox'&&funds<cost){toast('雇用資金が不足しています');return;}if(gameMode!=='sandbox')funds-=cost;const names={pilot:['Bill Kerman','Val Kerman','Gene Kerman'],engineer:['Wernher Kerman','Linus Kerman','Mortimer Kerman'],scientist:['D鄰 Kerman','Bobak Kerman','Mikki Kerman']};const roleNames={pilot:'パイロット',engineer:'エンジニア',scientist:'科学者'};const pool=names[role],name=pool.find(n=>!crewMembers.some(k=>k.name===n))||pool[0]+' '+(crewMembers.length+1);crewMembers.push({id:Date.now(),name,role:roleNames[role],level:1});saveCareer();renderCrew();recalc();toast(name+' を雇用しました');}const train=e.target.closest('[data-train-crew]');if(train){const member=crewMembers.find(k=>String(k.id)===train.dataset.trainCrew),cost=1000;if(member&&(gameMode==='sandbox'||funds>=cost)){if(gameMode!=='sandbox')funds-=cost;member.level++;saveCareer();renderCrew();recalc();toast(member.name+' の訓練完了');}else toast('訓練資金が不足しています');}const tech=e.target.closest('[data-unlock-tech]');if(tech){const item=techTree.find(t=>t.id===tech.dataset.unlockTech);if(item&&!unlockedTech.has(item.id)&&item.requires.every(x=>unlockedTech.has(x))&&science>=item.cost){science-=item.cost;unlockedTech.add(item.id);saveCareer();renderPartList();renderResearch();recalc();toast(item.name+' を研究しました');}}const contract=e.target.closest('[data-accept-contract]');if(contract&&!activeContract){activeContract=contracts.find(k=>k.id===contract.dataset.acceptContract)||null;if(activeContract){saveCareer();renderContracts();toast('契約を受注しました');}}});
function panelMessage(title,msg){toast(title+' — '+msg.replaceAll('\n',' / '));}
$('#home').onclick=()=>{flight=false;setMode('center');};$('#change-mode').onclick=()=>$('#mode-select').classList.remove('hidden');$('[data-game-mode]').forEach(b=>b.onclick=()=>{localStorage.setItem('space-game-mode',b.dataset.gameMode);location.reload();});$('#mode-select').classList.toggle('hidden',!!localStorage.getItem('space-game-mode'));if(gameMode!=='career'){$('[data-screen="contracts"]').classList.add('hidden');}if(gameMode==='sandbox'){$('[data-screen="research"]').classList.add('hidden');}
renderPartList();
$('#part-list').addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(b)addPart(b.dataset.part);});$('#close-parts').onclick=()=>$('#parts').classList.remove('open');
$('#clear-craft').onclick=()=>{if(flight)return;parts.length=0;assemblyStage=0;layout();toast('機体を空にしました');};
$('#new-stage').onclick=()=>{if(flight)return;assemblyStage++;$('#stage-build-label').textContent='組立ステージ '+assemblyStage;toast('新しい組立ステージ '+assemblyStage);};
$('#save-craft').onclick=()=>{localStorage.setItem('space-craft-v1',JSON.stringify(parts.map(p=>({id:p.data.id,stage:p.stage,fuel:p.fuel}))));toast('機体を保存しました');};
$('#load-craft').onclick=()=>{try{const a=JSON.parse(localStorage.getItem('space-craft-v1')||'[]');parts.length=0;a.forEach(v=>{const d=catalog.find(p=>p.id===v.id);if(d)parts.push({data:d,stage:v.stage,fuel:v.fuel??d.fuel??0});});assemblyStage=Math.max(0,...parts.map(p=>p.stage||0));layout();toast('機体を読み込みました');}catch{toast('保存データがありません');}};
function startFlight(){if(!parts.length){toast('先にロケットを組み立ててください');return;}if(!parts.some(p=>p.data.type==='engine'||p.data.type==='booster')){toast('エンジンまたはブースターが必要です');return;}if(!parts.some(p=>['tank','booster'].includes(p.data.type)&&(p.fuel||0)>0)){toast('燃料タンクまたは燃料入りブースターが必要です');return;}flight=true;paused=false;elapsed=0;stage=0;throttle=0;flightAccumulator=0;window._orb=false;sasEnabled=false;rcsEnabled=false;position.set(0,.002,0);velocity.set(0,0,0);angular.set(0,0,0);attitude.identity();rocket.position.copy(position);rocket.quaternion.copy(attitude);rocket.visible=true;setMode('flight');toast('発射準備完了 — Zでスロットル最大、Spaceで点火');}
$('#launch').onclick=startFlight;$('#stage-next').onclick=()=>{if(flight)activateStage();};$('#map-toggle').onclick=()=>{map=!map;toast(map?'軌道マップ表示（M）':'飛行ビュー');};
let keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='Escape'&&mode==='flight'){flight=false;throttle=0;setMode('center');toast('宇宙センターへ戻りました');}if(e.code==='Space'&&flight){e.preventDefault();activateStage();}if(e.key.toLowerCase()==='z')throttle=1;if(e.key.toLowerCase()==='x')throttle=0;if(e.key.toLowerCase()==='t'){sasEnabled=!sasEnabled;toast('SAS '+(sasEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='r'){rcsEnabled=!rcsEnabled;toast('RCS '+(rcsEnabled?'ON':'OFF'));}if(e.key.toLowerCase()==='m'&&flight){map=!map;}});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function activateStage(){const previous=stage;stage++;const hasSeparator=parts.some(p=>p.data.type==='decoupler'&&p.stage===previous);if(hasSeparator){for(let i=parts.length-1;i>=0;i--)if(parts[i].stage===previous)parts.splice(i,1);layout();}toast('ステージ '+stage+' 作動');}
const bodyCenter=new THREE.Vector3(0,-BODY.radius,0);
let properG=1,flightAccumulator=0;
function physicsStep(dt){
 if(!flight||paused)return;
 elapsed+=dt;const mins=Math.floor(elapsed/60),secs=Math.floor(elapsed%60);$('#mission-time').textContent='T+ '+String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
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
 if(mdot>0){let liquidBurn=liquidMdot*dt;for(const tank of liquidTanks){const take=Math.min(tank.fuel,liquidBurn);tank.fuel-=take;liquidBurn-=take;if(liquidBurn<=1e-8)break;}let solidBurn=solidMdot*dt;for(const booster of activeEngines.filter(p=>p.data.type==='booster')){const take=Math.min(booster.fuel,solidBurn);booster.fuel-=take;solidBurn-=take;if(solidBurn<=1e-8)break;}fuel=parts.reduce((s,p)=>s+(p.fuel||0),0);if((maxFuel?Math.round(fuel/maxFuel*100):0)!==stageUiFuelPercent)renderStages();}
 const radial=position.clone().sub(bodyCenter),radius=radial.length(),altitude=radius-BODY.radius;
 if(altitude<=0){position.copy(bodyCenter).add(radial.normalize().multiplyScalar(BODY.radius));const normal=position.clone().sub(bodyCenter).normalize(),impact=velocity.dot(normal);if(impact< -8){flight=false;toast('地表衝突 — 機体が破損しました');}else{velocity.addScaledVector(normal,-Math.min(0,impact));velocity.multiplyScalar(.985);}}
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
setMode('center');layout();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});$('#boot').style.display='none';