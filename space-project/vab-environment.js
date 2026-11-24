// Purpose-built VAB architecture for the browser game.
// Geometry is authored as structural sections and architectural assemblies;
// the floor carries a painted concrete/marking texture rather than a debug grid.
export function createVABEnvironment(THREE){
 const root=new THREE.Group();root.name='VAB-KSP1-inspired';root.scale.set(.0018,.0022,.0018);
 const mat=(color,metalness=.35,roughness=.72,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});
 const concrete=mat(0x777a77,.08,.94),steel=mat(0x59656c,.72,.46),edgeSteel=mat(0x9aa2a2,.78,.34),darkSteel=mat(0x303a40,.65,.55),yellow=mat(0xc69a3e,.42,.58),yellowDark=mat(0x85652e,.5,.64),glass=mat(0x9ab5bb,.18,.2,{transparent:true,opacity:.34,side:THREE.DoubleSide}),windowDark=mat(0x34464f,.38,.28),white=mat(0xe0dfd4,.12,.82),line=mat(0xe2dfd1,.04,.88),black=mat(0x20282c,.45,.68);
 const add=(geo,ma,pos=[0,0,0],rot=[0,0,0],parent=root)=>{const o=new THREE.Mesh(geo,ma);o.position.set(...pos);o.rotation.set(...rot);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const box=(w,h,d,x,y,z,ma,parent=root)=>add(new THREE.BoxGeometry(w,h,d),ma,[x,y,z],[0,0,0],parent);
 const beamBatches=new Map();
 const beam=(a,b,w=.8,ma=steel,depth=w*.72)=>{
  const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),dir=B.clone().sub(A),len=dir.length();
  const key=w.toFixed(3)+'|'+ma.uuid;let batch=beamBatches.get(key);
  if(!batch){
   const shape=new THREE.Shape(),flange=w,web=w*.19,thick=w*.17;
   shape.moveTo(-flange/2,-w/2);shape.lineTo(flange/2,-w/2);shape.lineTo(flange/2,-w/2+thick);shape.lineTo(web/2,-w/2+thick);shape.lineTo(web/2,w/2-thick);shape.lineTo(flange/2,w/2-thick);shape.lineTo(flange/2,w/2);shape.lineTo(-flange/2,w/2);shape.lineTo(-flange/2,w/2-thick);shape.lineTo(-web/2,w/2-thick);shape.lineTo(-web/2,-w/2+thick);shape.lineTo(-flange/2,-w/2+thick);shape.closePath();
   const geo=new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.018,curveSegments:1});geo.translate(0,0,-.5);
   const mesh=new THREE.InstancedMesh(geo,ma,256);mesh.count=0;mesh.castShadow=true;mesh.receiveShadow=true;mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);root.add(mesh);batch={mesh,used:0};beamBatches.set(key,batch);
  }
  if(batch.used>=batch.mesh.instanceMatrix.count)return;
  const quaternion=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),dir.normalize());
  const matrix=new THREE.Matrix4().compose(A.clone().add(B).multiplyScalar(.5),quaternion,new THREE.Vector3(1,1,len));
  batch.mesh.setMatrixAt(batch.used++,matrix);batch.mesh.count=batch.used;batch.mesh.instanceMatrix.needsUpdate=true;
 };
 const panel=(w,h,x,y,z,ma=steel)=>box(.65,h,w,x,y,z,ma);
 // Painted, high-resolution concrete apron with wear, seams, safety zones and bay IDs.
 const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=2048;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#777a78';ctx.fillRect(0,0,2048,2048);
 let seed=78123;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<26000;i++){const x=rnd()*2048,y=rnd()*2048,a=.018+rnd()*.06;ctx.fillStyle=rnd()>.5?'rgba(235,235,225,'+a+')':'rgba(25,31,33,'+a+')';ctx.fillRect(x,y,1+rnd()*5,1+rnd()*3);}
 ctx.strokeStyle='rgba(40,45,46,.25)';ctx.lineWidth=3;for(let x=128;x<2048;x+=256){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,2048);ctx.stroke();}for(let y=128;y<2048;y+=256){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2048,y);ctx.stroke();}
 ctx.strokeStyle='#e6e1d2';ctx.lineWidth=8;ctx.strokeRect(280,280,1488,1488);ctx.strokeRect(440,440,1168,1168);
 ctx.strokeStyle='#d0a13c';ctx.lineWidth=18;ctx.strokeRect(220,220,1608,1608);
 ctx.fillStyle='#d0a13c';ctx.fillRect(190,900,165,248);ctx.fillRect(1693,900,165,248);
 ctx.fillStyle='rgba(232,229,216,.72)';ctx.font='bold 72px sans-serif';ctx.fillText('VAB  /  ASSEMBLY BAY',520,190);ctx.font='bold 100px sans-serif';ctx.fillText('01',1550,1700);
 const floorTex=new THREE.CanvasTexture(canvas);floorTex.colorSpace=THREE.SRGBColorSpace;floorTex.anisotropy=8;floorTex.wrapS=floorTex.wrapT=THREE.ClampToEdgeWrapping;
 const floorMat=mat(0xffffff,.04,.96,{map:floorTex});
 add(new THREE.PlaneGeometry(230,270),floorMat,[0,-.2,0],[-Math.PI/2,0,0]);
 // Floor expansion joints, marked bays and service lanes.
 for(let x=-105;x<=105;x+=21)box(.09,.025,260,x,-.175,0,darkSteel);
 for(let z=-125;z<=125;z+=25)box(220,.025,.09,0,-.174,z,darkSteel);
 for(const x of [-94,94]){box(1,.035,208,x,-.16,0,line);box(14,.04,1.4,x,-.15,0,yellow);}
 box(1.2,.04,170,-43,-.15,0,line);box(1.2,.04,170,43,-.15,0,line);
 for(const z of [-104,104]){box(100,.04,1.5,0,-.15,z,yellow);for(let x=-45;x<=45;x+=15)box(1.2,.05,8,x,-.14,z-6,yellow);}
 // Massive rear wall, glazed clerestory, and segmented industrial door.
 for(const x of [-112,112]){box(5,154,5,x,76,-96,steel);box(5,154,5,x,76,96,steel);}
 for(const y of [12,42,72,102,132,154]){beam([-112,y,-96],[112,y,-96],1.05,edgeSteel);beam([-112,y,96],[112,y,96],1.05,edgeSteel);}
 for(let x=-105;x<=105;x+=21){
  beam([x,12,-96],[x,150,-96],.7,steel);beam([x,12,96],[x,150,96],.7,steel);
  beam([x,12,-96],[x+21,34,-96],.46,edgeSteel);beam([x+21,12,-96],[x,34,-96],.46,edgeSteel);
  beam([x,12,96],[x+21,34,96],.46,edgeSteel);beam([x+21,12,96],[x,34,96],.46,edgeSteel);
 }
 // Huge rear sliding door with actual framed panels and diagonal reinforcement.
 box(174,130,2.4,0,69,-93,yellowDark);
 for(let x=-84;x<=84;x+=14){
  box(12.8,126,1.4,x,69,-91.3,yellow);
  box(.65,124,1.8,x-6.3,69,-90.4,darkSteel);
  beam([x-5.5,10,-89.9],[x+5.5,128,-89.9],.34,edgeSteel);
  beam([x+5.5,10,-89.9],[x-5.5,128,-89.9],.34,edgeSteel);
 }
 box(184,4,3,0,136,-89.2,edgeSteel);box(184,4,3,0,3,-89.2,edgeSteel);
 // Side walls: glazed high windows, cladding panels, external buttresses.
 for(const side of [-1,1]){
  const x=side*110;
  for(let z=-84;z<=84;z+=28){
   panel(2,25,x,25,z,darkSteel);panel(2,28,x,69,z,windowDark);panel(2,22,x,116,z,glass);
   box(3,1.1,27,x,12,z,edgeSteel);box(3,1.1,27,x,51,z,edgeSteel);box(3,1.1,27,x,91,z,edgeSteel);box(3,1.1,27,x,130,z,edgeSteel);
   beam([side*106,14,z-13],[side*106,48,z+13],.5,edgeSteel);beam([side*106,14,z+13],[side*106,48,z-13],.5,edgeSteel);
  }
  for(const y of [18,48,78,108,138])beam([x,y,-95],[x,y,95],.72,steel);
 }
 // Roof: high steel trusses, skylight strips, cross-bracing and maintenance rails.
 for(let z=-84;z<=84;z+=21){
  beam([-110,150,z],[0,166,z],.95,edgeSteel);beam([0,166,z],[110,150,z],.95,edgeSteel);
  beam([-110,150,z],[110,150,z],.52,steel);
  beam([-110,150,z],[0,166,z+21],.36,steel);beam([110,150,z],[0,166,z+21],.36,steel);
  box(76,1.1,16,-55,158,z,glass);box(76,1.1,16,55,158,z,glass);
 }
 for(const x of [-75,-25,25,75]){beam([x,151,-90],[x,151,90],.45,steel);beam([x,164,-90],[x,164,90],.34,edgeSteel);}
 // Catwalks and maintenance balconies on both long walls.
 for(const side of [-1,1]){
  const x=side*82;
  for(const y of [34,68,102,136]){
   box(22,1.1,174,x,y,0,darkSteel);
   box(22,.25,174,x,y+.7,0,edgeSteel);
   for(let z=-84;z<=84;z+=12){
    beam([x-11,y+1,z],[x-11,y+5,z],.18,edgeSteel);beam([x+11,y+1,z],[x+11,y+5,z],.18,edgeSteel);beam([x-11,y+5,z],[x+11,y+5,z],.22,yellow);
   }
  }
  // Stair flights and landings, repeated in bays.
  for(const z of [-58,24]){
   box(13,1,12,x,18,z,darkSteel);
   beam([x,19,z-7],[x,34,z+7],.6,edgeSteel);
   for(let i=0;i<10;i++)box(5,.22,1.2,x,20+i*1.25,z-6+i*1.35,steel);
  }
 }
 // Overhead gantry crane and suspended hoist.
 const craneY=119;
 beam([-95,craneY,-54],[95,craneY,-54],2.2,yellow);
 beam([-95,craneY-3,-54],[95,craneY-3,-54],.8,darkSteel);
 for(const x of [-92,92]){box(4,22,5,x,craneY-12,-54,yellow);box(9,2,8,x,craneY-24,-54,edgeSteel);}
 box(18,8,14,-18,craneY+3,-54,yellow);box(12,2,10,-18,craneY-2,-54,darkSteel);
 beam([-18,craneY-3,-54],[-18,craneY-31,-54],.28,edgeSteel);box(3,3,3,-18,craneY-32,-54,yellow);
 // Secondary crane rails and hoist trolley.
 for(const z of [-72,72])beam([-100,craneY-12,z],[100,craneY-12,z],.65,steel);
 // Ground-level service stations, tool lockers, workbenches, and safety bollards.
 const cabinet=mat(0x4b5960,.35,.7),worktop=mat(0x9b9d97,.58,.5);
 for(const side of [-1,1])for(const z of [-68,-18,32,72]){
  const x=side*96;box(13,13,18,x,6.5,z,cabinet);box(13.5,1,18.5,x,13.4,z,edgeSteel);
  box(8,7,.22,x,7,z+side*9.2,glass);box(13,.35,1,x,1,z+side*9.5,yellow);
  box(15,1.5,8,x-side*5,4,z-12,worktop);
 }
 for(const x of [-64,64])for(const z of [-76,76]){
  box(8,1.5,6,x,1,z,yellow);
  for(const dx of [-3,3]){const wheel=add(new THREE.CylinderGeometry(.85,.85,.5,16),black,[x+dx,.8,z],[0,0,Math.PI/2]);}
  box(4,3.2,4,x,3.2,z,glass);
 }
 for(const x of [-105,105])for(const z of [-78,-38,2,42,82]){box(1.2,26,1.2,x,13,z,yellow);box(4,1,4,x,26,z,edgeSteel);}
 // Light banks, warm industrial lamps with physical housings.
 const lampMat=mat(0xffe6b8,.05,.25,{emissive:0xffdca0,emissiveIntensity:.65});
 for(const x of [-72,-36,0,36,72])for(const z of [-65,-22,22,65]){
  box(10,1.4,4,x,145,z,darkSteel);add(new THREE.PlaneGeometry(8,2.8),lampMat,[x,144.1,z],[Math.PI/2,0,0]);
 }
 // Finalize static beam batches once; all truss members share a small set of draw calls.
 for(const batch of beamBatches.values())batch.mesh.computeBoundingSphere();
 // Outside apron / taxiway beyond the large door.
 box(82,.3,230,0,-.25,-218,darkSteel);
 for(const x of [-39,39])box(1.3,.04,220,x,-.07,-218,line);
 for(let z=-125;z>-326;z-=24)box(1.1,.05,11,0,-.06,z,line);
 for(const z of [-108,-326])box(86,.05,2,0,-.06,z,yellow);
 return root;
}
