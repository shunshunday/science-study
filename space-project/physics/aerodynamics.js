// 部品ごとの投影面積・迎角を使う簡易6DoF向け空力モデル。
// 座標/速度は km・km/s、質量 kg、密度 kg/m³。戻り値は km/s²。
import {BODY, atmosphericDensity} from './orbital.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const norm=v=>Math.hypot(v.x,v.y,v.z);
const scale=(v,s)=>({x:v.x*s,y:v.y*s,z:v.z*s});
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});

export function aerodynamicAcceleration(position, velocity, forward, parts, massKg, center={x:0,y:-BODY.radius,z:0}) {
  const radial=sub(position,center);
  const altitude=Math.max(0,norm(radial)-BODY.radius);
  const rho=atmosphericDensity(altitude);
  const speedKm=norm(velocity);
  if(rho<=0||speedKm<1e-7||massKg<=0||!parts.length) return {x:0,y:0,z:0};

  const flow=scale(velocity,1/speedKm);
  const axis=scale(forward,1/Math.max(norm(forward),1e-9));
  const axial=clamp(Math.abs(dot(axis,flow)),0,1);
  const sinAoA=Math.sqrt(Math.max(0,1-axial*axial));
  const maxRadius=Math.max(.25,...parts.map(p=>p.data.radius||.25));
  const frontalArea=Math.PI*maxRadius*maxRadius;
  const bodyLength=parts.reduce((sum,p)=>sum+(p.data.height||0),0);
  const sideArea=bodyLength*2*maxRadius;
  const finArea=parts.reduce((area,p)=>{const type=p.data.type;if(type==='fin')return area+.42;if(type==='wing')return area+Math.max(.25,(p.data.radius||1)*.85);if(type==='tail'||type==='control')return area+Math.max(.12,(p.data.radius||.5)*.32);if(type==='gear')return area+.08;if(type==='intake')return area+.12;return area;},0);
  const chuteArea=parts.reduce((area,p)=>area+(p.data.type==='chute'&&p.deployed?(p.data.canopyArea||50)*(p.deployProgress??1):0),0);
  const cd=0.22+0.65*sinAoA*sinAoA;
  const projectedArea=frontalArea*axial+sideArea*sinAoA*.7+finArea*sinAoA*1.4;
  const speedMs=speedKm*1000;
  const q=.5*rho*speedMs*speedMs;
  const dragMagnitude=q*(cd*projectedArea+chuteArea)/massKg/1000;
  let result=scale(flow,-dragMagnitude);

  // 翼・尾翼・フィンがある場合、迎角に応じた簡易揚力を発生。
  if(finArea>0&&sinAoA>.002){
    const along=dot(axis,flow);
    const liftAxis=sub(axis,scale(flow,along));
    const liftLength=norm(liftAxis);
    if(liftLength>1e-8){
      const liftDir=scale(liftAxis,1/liftLength);
      const cl=clamp(2.1*sinAoA,-1.1,1.1);
      const liftMagnitude=q*finArea*cl/massKg/1000;
      result={x:result.x+liftDir.x*liftMagnitude,y:result.y+liftDir.y*liftMagnitude,z:result.z+liftDir.z*liftMagnitude};
    }
  }
  return result;
}
