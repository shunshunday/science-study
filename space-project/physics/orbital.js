// Two-body orbital mechanics and atmosphere model. SI units throughout.
export const G0 = 9.80665;
export const BODY = Object.freeze({ radius: 600, mu: 3531.6, rotationRate: 2.0e-4, atmosphereHeight: 70 });
export function gravityAcceleration(position, mu=BODY.mu, center={x:0,y:-BODY.radius,z:0}) {
  const x=position.x-center.x, y=position.y-center.y, z=position.z-center.z;
  const r2=x*x+y*y+z*z, r=Math.sqrt(Math.max(r2,1));
  const k=-mu/(r2*r);
  return {x:x*k,y:y*k,z:z*k};
}
export function atmosphericDensity(altitude) {
  if (altitude<=0) return 1.225;
  if (altitude>=BODY.atmosphereHeight) return 0;
  const layers=[[0,1.225,8.5],[11,.3639,6.341],[20,.0880,7.2],[32,.0132,7.6],[47,.00143,8],[60,.00031,7.5]];
  let i=0; while(i<layers.length-1 && altitude>layers[i+1][0]) i++;
  const [h,rho,scale]=layers[i];
  return rho*Math.exp(-(altitude-h)/scale);
}
export function orbitalElements(position, velocity, mu=BODY.mu, center={x:0,y:-BODY.radius,z:0}) {
  const rx=position.x-center.x, ry=position.y-center.y, rz=position.z-center.z;
  const r=Math.hypot(rx,ry,rz), v2=velocity.x**2+velocity.y**2+velocity.z**2;
  const hx=ry*velocity.z-rz*velocity.y, hy=rz*velocity.x-rx*velocity.z, hz=rx*velocity.y-ry*velocity.x;
  const h2=hx*hx+hy*hy+hz*hz;
  const vxhX=velocity.y*hz-velocity.z*hy, vxhY=velocity.z*hx-velocity.x*hz, vxhZ=velocity.x*hy-velocity.y*hx;
  const ex=vxhX/mu-rx/r, ey=vxhY/mu-ry/r, ez=vxhZ/mu-rz/r, eccentricity=Math.hypot(ex,ey,ez);
  const energy=v2*.5-mu/r, semiMajorAxis=Math.abs(energy)>1e-10?-mu/(2*energy):Infinity;
  const periapsis=semiMajorAxis*(1-eccentricity), apoapsis=energy<0?semiMajorAxis*(1+eccentricity):Infinity;
  const inclination=Math.acos(Math.max(-1,Math.min(1,hy/Math.sqrt(Math.max(h2,1e-20)))));
  return {radius:r,altitude:r-BODY.radius,speed:Math.sqrt(v2),specificEnergy:energy,eccentricity,semiMajorAxis,periapsisAltitude:periapsis-BODY.radius,apoapsisAltitude:apoapsis-BODY.radius,inclination};
}
export function rk4Step(position, velocity, dt, acceleration) {
  const a1=acceleration(position,velocity), p2={x:position.x+velocity.x*dt*.5,y:position.y+velocity.y*dt*.5,z:position.z+velocity.z*dt*.5}, v2={x:velocity.x+a1.x*dt*.5,y:velocity.y+a1.y*dt*.5,z:velocity.z+a1.z*dt*.5};
  const a2=acceleration(p2,v2), p3={x:position.x+v2.x*dt*.5,y:position.y+v2.y*dt*.5,z:position.z+v2.z*dt*.5}, v3={x:velocity.x+a2.x*dt*.5,y:velocity.y+a2.y*dt*.5,z:velocity.z+a2.z*dt*.5};
  const a3=acceleration(p3,v3), p4={x:position.x+v3.x*dt,y:position.y+v3.y*dt,z:position.z+v3.z*dt}, v4={x:velocity.x+a3.x*dt,y:velocity.y+a3.y*dt,z:velocity.z+a3.z*dt};
  const a4=acceleration(p4,v4), sixth=dt/6;
  return {
    position:{x:position.x+sixth*(velocity.x+2*v2.x+2*v3.x+v4.x),y:position.y+sixth*(velocity.y+2*v2.y+2*v3.y+v4.y),z:position.z+sixth*(velocity.z+2*v2.z+2*v3.z+v4.z)},
    velocity:{x:velocity.x+sixth*(a1.x+2*a2.x+2*a3.x+a4.x),y:velocity.y+sixth*(a1.y+2*a2.y+2*a3.y+a4.y),z:velocity.z+sixth*(a1.z+2*a2.z+2*a3.z+a4.z)}
  };
}
export function rocketMassKg(parts) { return parts.reduce((sum,p)=>sum+p.data.mass*1000+(p.fuel||0),0); }
export function deltaV(parts) {
  const dry=parts.reduce((s,p)=>s+p.data.mass*1000,0), prop=parts.reduce((s,p)=>s+(p.fuel||0),0);
  const engines=parts.filter(p=>p.data.isp>0), isp=engines.length?engines.reduce((s,p)=>s+p.data.isp*(p.data.thrust||1),0)/engines.reduce((s,p)=>s+(p.data.thrust||1),0):0;
  return dry>0&&prop>0&&isp>0?isp*G0*Math.log((dry+prop)/dry):0;
}
