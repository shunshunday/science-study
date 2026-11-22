// Deterministic road graph with intersection splitting and A* routing.
export class RoadNetwork {
  constructor(tolerance=.35){this.tolerance=tolerance;this.segments=[];this.nodes=[];this.edges=[];this.adjacency=[];}
  addSegment(a,b){if(Math.hypot(b.x-a.x,b.z-a.z)<2)return;this.segments.push({a:{x:a.x,z:a.z},b:{x:b.x,z:b.z}});this.rebuild();}
  rebuild(){
    const cuts=this.segments.map(()=>[0,1]);
    for(let i=0;i<this.segments.length;i++)for(let j=i+1;j<this.segments.length;j++){
      const A=this.segments[i],B=this.segments[j],rx=A.b.x-A.a.x,rz=A.b.z-A.a.z,sx=B.b.x-B.a.x,sz=B.b.z-B.a.z,den=rx*sz-rz*sx;
      if(Math.abs(den)<1e-8)continue;
      const qx=B.a.x-A.a.x,qz=B.a.z-A.a.z,t=(qx*sz-qz*sx)/den,u=(qx*rz-qz*rx)/den;
      if(t>=0&&t<=1&&u>=0&&u<=1){cuts[i].push(t);cuts[j].push(u);}
    }
    this.nodes=[];this.edges=[];this.adjacency=[];
    const node=(x,z)=>{let id=this.nodes.findIndex(n=>Math.hypot(n.x-x,n.z-z)<this.tolerance);if(id<0){id=this.nodes.length;this.nodes.push({id,x,z});this.adjacency.push([]);}return id;};
    for(let i=0;i<this.segments.length;i++){
      const s=this.segments[i],ts=[...new Set(cuts[i].map(t=>Math.round(t*1e6)/1e6))].sort((a,b)=>a-b);
      for(let k=0;k<ts.length-1;k++){const t0=ts[k],t1=ts[k+1],a=node(s.a.x+(s.b.x-s.a.x)*t0,s.a.z+(s.b.z-s.a.z)*t0),b=node(s.a.x+(s.b.x-s.a.x)*t1,s.a.z+(s.b.z-s.a.z)*t1);if(a===b)continue;const p=this.nodes[a],q=this.nodes[b],length=Math.hypot(q.x-p.x,q.z-p.z),id=this.edges.length;const edge={id,a,b,length};this.edges.push(edge);this.adjacency[a].push({edge:id,to:b,cost:length});this.adjacency[b].push({edge:id,to:a,cost:length});}
    }
  }
  nearestNode(point){let best=-1,d=Infinity;for(const n of this.nodes){const q=Math.hypot(n.x-point.x,n.z-point.z);if(q<d){d=q;best=n.id;}}return best;}
  findPath(start,goal){
    if(start<0||goal<0||!this.nodes[start]||!this.nodes[goal])return [];
    const open=new Set([start]),came=new Map(),g=new Map([[start,0]]),f=new Map([[start,this.distance(start,goal)]]);
    while(open.size){let current=-1,best=Infinity;for(const n of open){const score=f.get(n)??Infinity;if(score<best){best=score;current=n;}}
      if(current===goal){const path=[];let n=goal;while(came.has(n)){const prev=came.get(n);path.unshift({edge:prev.edge,from:prev.node,to:n});n=prev.node;}return path;}
      open.delete(current);
      for(const next of this.adjacency[current]){const tentative=(g.get(current)??Infinity)+next.cost;if(tentative<(g.get(next.to)??Infinity)){came.set(next.to,{node:current,edge:next.edge});g.set(next.to,tentative);f.set(next.to,tentative+this.distance(next.to,goal));open.add(next.to);}}
    }return [];
  }
  distance(a,b){const p=this.nodes[a],q=this.nodes[b];return Math.hypot(p.x-q.x,p.z-q.z);}
}
export class FixedStepClock {
  constructor(step=1/30,maxSteps=8){this.step=step;this.maxSteps=maxSteps;this.accumulator=0;}
  advance(realDt,update){this.accumulator+=Math.min(Math.max(realDt,0),.25);let count=0;while(this.accumulator>=this.step&&count<this.maxSteps){update(this.step);this.accumulator-=this.step;count++;}if(count===this.maxSteps)this.accumulator=0;return count;}
}
