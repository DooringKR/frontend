// 픽토그램 엔진 — 3D 물체(상자·판·원통·돔·돌출체·선)를 원근 투영해 24 칸 SVG 로. 칠은 면 방향으로 4단, 강조(em)·경고(al)·바탕(g).
const sub=(a,b)=>a.map((v,i)=>v-b[i]), add=(a,b)=>a.map((v,i)=>v+b[i]), mul=(a,k)=>a.map(v=>v*k);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0), len=a=>Math.hypot(...a), norm=a=>mul(a,1/len(a));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const cen=ps=>mul(ps.reduce((s,p)=>add(s,p),[0,0,0]),1/ps.length);
const R=d=>d*Math.PI/180;

// ── 물체 만들기 ──
// prism: XY 윤곽(반시계)을 z0→z1 로 밀어낸 것. box 는 그 직사각형. open: '+z'|'+y'… 그 면을 빼고 안쪽 면을 그린다
function prism(profile, z0, z1, role, o={}){
  const n=profile.length, V=[...profile.map(p=>[p[0],p[1],z0]), ...profile.map(p=>[p[0],p[1],z1])];
  const F=[{i:[...Array(n).keys()].reverse()}, {i:[...Array(n).keys()].map(k=>k+n)}];
  for(let k=0;k<n;k++){const m=(k+1)%n; F.push({i:[k,m,m+n,k+n]});}
  return {kind:'poly', V, F, role, ...o};
}
const box=(x0,y0,z0,x1,y1,z1,role,o={})=>prism([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],z0,z1,role,o);
// x 방향으로 밀어낸 것 — (z,y) 윤곽, 바닥 y0 위에(신발)
function prismX(profile, x0, x1, y0, role, o={}){
  const n=profile.length, V=[...profile.map(([z,y])=>[x0,y0+y,z]), ...profile.map(([z,y])=>[x1,y0+y,z])];
  const F=[{i:[...Array(n).keys()]}, {i:[...Array(n).keys()].map(k=>k+n)}];
  for(let k=0;k<n;k++){const m=(k+1)%n; F.push({i:[k,m,m+n,k+n]});}
  return {kind:'poly', V, F, role, convex:true, ...o};
}
// 판(두께 없는 면) — 양면
const panel=(pts,role,o={})=>({kind:'panel', V:pts, role, ...o});
// 원통(축 방향 아무거나) — 옆면은 매끈(선 없음), 윤곽만 긋는다
function cyl(c, axis, r, h, role, o={}){
  const a=norm(axis), t=Math.abs(a[1])<0.9?[0,1,0]:[1,0,0], u=norm(cross(a,t)), v=cross(a,u), N=o.n||28;
  const ring=k=>{const q=2*Math.PI*k/N;return add(c,add(mul(u,r*Math.cos(q)),mul(v,r*Math.sin(q))))};
  const V=[]; for(let k=0;k<N;k++) V.push(ring(k)); for(let k=0;k<N;k++) V.push(add(V[k],mul(a,h)));
  const F=[{i:[...Array(N).keys()]},{i:[...Array(N).keys()].map(k=>k+N)}];
  for(let k=0;k<N;k++){const m=(k+1)%N;F.push({i:[k,m,m+N,k+N],smooth:true});}
  return {kind:'poly', V, F, role, curved:true, convex:true, ...o};
}
// 반구(+ 아래 원통 h) — 경광등·안전모
function dome(c, r, h, role, o={}){
  const N=24, M=7, V=[], F=[];
  for(let k=0;k<N;k++){const q=2*Math.PI*k/N;V.push([c[0]+r*Math.cos(q),c[1],c[2]+r*Math.sin(q)]);}
  for(let j=0;j<=M;j++){const p=R(90*j/M), rr=r*Math.cos(p), y=c[1]+h+r*Math.sin(p);
    for(let k=0;k<N;k++){const q=2*Math.PI*k/N;V.push([c[0]+rr*Math.cos(q),y,c[2]+rr*Math.sin(q)]);}}
  F.push({i:[...Array(N).keys()]});
  for(let j=0;j<=M;j++) for(let k=0;k<N;k++){const m=(k+1)%N,b=j*N,t=(j+1)*N;F.push({i:[b+k,b+m,t+m,t+k],smooth:true});}
  return {kind:'poly', V, F, role, curved:true, convex:true, ...o};
}
function sphere(c, r, role, o={}){
  const N=14, M=7, V=[], F=[];
  for(let j=0;j<=M;j++){const p=R(-90+180*j/M), rr=r*Math.cos(p), y=c[1]+r*Math.sin(p);
    for(let k=0;k<N;k++){const q=2*Math.PI*k/N;V.push([c[0]+rr*Math.cos(q),y,c[2]+rr*Math.sin(q)]);}}
  for(let j=0;j<M;j++) for(let k=0;k<N;k++){const m=(k+1)%N,b=j*N,t=(j+1)*N;F.push({i:[b+k,b+m,t+m,t+k],smooth:true});}
  return {kind:'poly', V, F, role, curved:true, convex:true, ...o};
}
// 두 점을 잇는 원통(팔·다리)
const rod=(a,b,r,role,o={})=>cyl(a,sub(b,a),r,len(sub(b,a)),role,{n:12,...o});
const line=(pts,role='g',o={})=>({kind:'line', V:pts, role, ...o});
// 문 — 세로 경첩(hx), 닫혔을 때 side 방향(+1 오른쪽)으로 w, 앞(+z)으로 a 도 열림
const doorV=(hx,side,y0,y1,z,w,a)=>{const fx=hx+side*w*Math.cos(R(a)),fz=z+w*Math.sin(R(a));return [[hx,y0,z],[fx,y0,fz],[fx,y1,fz],[hx,y1,z]]};
// 위 경첩(플랩) — 닫혔을 때 아래로 h, 위·앞으로 a 도
const doorTop=(x0,x1,hy,z,h,a)=>{const y=hy-h*Math.cos(R(a)),fz=z+h*Math.sin(R(a));return [[x0,hy,z],[x1,hy,z],[x1,y,fz],[x0,y,fz]]};
// 아래 경첩(식세기) — 닫혔을 때 위로 h, 아래·앞으로 a 도
const doorBot=(x0,x1,hy,z,h,a)=>{const y=hy+h*Math.cos(R(a)),fz=z+h*Math.sin(R(a));return [[x0,hy,z],[x1,hy,z],[x1,y,fz],[x0,y,fz]]};

// ── 그리기 ──
const L=norm([-0.45,0.8,0.55]);
const tone=b=>b>0.55?0:b>0.15?1:b>-0.25?2:3;
function clipPoly(subj,poly){
  const area=poly.reduce((s,p,i)=>{const q=poly[(i+1)%poly.length];return s+(p[0]*q[1]-q[0]*p[1])},0);
  const inside=(p,a,b)=>((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]))*Math.sign(area)>=-1e-9;
  const hit=(p,q,a,b)=>{const A1=q[1]-p[1],B1=p[0]-q[0],C1=A1*p[0]+B1*p[1],A2=b[1]-a[1],B2=a[0]-b[0],C2=A2*a[0]+B2*a[1],d=A1*B2-A2*B1;return [(B2*C1-B1*C2)/d,(A1*C2-A2*C1)/d]};
  let out=subj;
  for(let i=0;i<poly.length&&out.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inp=out;out=[];
    for(let j=0;j<inp.length;j++){const p=inp[j],q=inp[(j+1)%inp.length];
      if(inside(q,a,b)){if(!inside(p,a,b))out.push(hit(p,q,a,b));out.push(q)}else if(inside(p,a,b))out.push(hit(p,q,a,b));}}
  return out;
}
function hull(ps){ // 볼록 껍질(단조 사슬)
  const p=[...ps].sort((a,b)=>a[0]-b[0]||a[1]-b[1]); const c=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],up=[]; for(const q of p){while(lo.length>=2&&c(lo.at(-2),lo.at(-1),q)<=0)lo.pop();lo.push(q)}
  for(const q of p.reverse()){while(up.length>=2&&c(up.at(-2),up.at(-1),q)<=0)up.pop();up.push(q)}
  return lo.slice(0,-1).concat(up.slice(0,-1));
}

// scene: { objs, yaw=-32, el=15, dist=2.0, cam?, target? } → [{f,s,d}] (24 칸 좌표)
function render(scene){
  const all=scene.objs.flatMap(o=>o.V);
  const mn=[0,1,2].map(i=>Math.min(...all.map(p=>p[i]))), mx=[0,1,2].map(i=>Math.max(...all.map(p=>p[i])));
  const target=scene.target||mul(add(mn,mx),0.5), diag=len(sub(mx,mn));
  const yaw=R(scene.yaw??-32), el=R(scene.el??15), D=(scene.dist??2.0)*diag;
  const cam=scene.cam||add(target,[D*Math.sin(yaw)*Math.cos(el),D*Math.sin(el),D*Math.cos(yaw)*Math.cos(el)]);
  const fw=norm(sub(target,cam)), rt=norm(cross(fw,[0,1,0])), up=cross(rt,fw);
  const P=p=>{const v=sub(p,cam),z=dot(v,fw);return [dot(v,rt)/z,-dot(v,up)/z]};
  const dist=p=>len(sub(p,cam));
  const items=[]; // {f,s,pts2d,closed}
  const facing=(n,p)=>dot(n,sub(cam,p))>0;
  const order=[...scene.objs].map((o,k)=>({o,k,d:dist(cen(o.V))})).sort((a,b)=>(a.o.z||0)-(b.o.z||0)||b.d-a.d);
  const mono=!!scene.mono, T1=t=>mono?1:t;
  for(const {o} of order){
    const r=mono?'b':o.role;
    if(o.kind==='line'){ items.push({f:'',s:r+'l',pts:o.V.map(P),closed:!!o.closed,w:o.w}); continue; }
    if(o.kind==='panel'){
      let n=norm(cross(sub(o.V[1],o.V[0]),sub(o.V[2],o.V[0]))); if(!facing(n,o.V[0])) n=mul(n,-1);
      items.push({f:(mono?(o.fill==='i'||o.fill==='j'?'j':'b'):(o.fill||r))+T1(tone(dot(n,L)+(o.dk||0))),s:mono?'b':(o.stroke??r),pts:o.V.map(P),closed:true}); continue;
    }
    const C=cen(o.V);
    const faces=o.F.map(f=>{const ps=f.i.map(i=>o.V[i]);let n=norm(cross(sub(ps[1],ps[0]),sub(ps[2],ps[0])));
      if(o.convex&&dot(n,sub(cen(ps),C))<0){n=mul(n,-1);} return {...f,ps,n,c:cen(ps)}});
    let rim=null, opened=null;
    if(o.open){const dir={'+z':[0,0,1],'+y':[0,1,0],'-z':[0,0,-1]}[o.open];
      opened=faces.find(f=>dot(f.n,dir)>0.99); rim=opened.ps.map(P);}
    const shell=faces.filter(f=>f!==opened);
    if(o.open){ // 안쪽 면: 법선 뒤집어 보이는 것만, 앞 테두리 안으로 잘라 진하게
      const ins=shell.map(f=>({...f,n:mul(f.n,-1)})).filter(f=>facing(f.n,f.c)).sort((a,b)=>dist(b.c)-dist(a.c));
      for(const f of ins){const q=clipPoly(f.ps.map(P),rim); if(q.length>2) items.push({f:(r==='g'?'i':r==='b'?'j':'k')+(mono?1:Math.min(3,tone(dot(f.n,L))+1)),s:'',pts:q,closed:true});}
    }
    const vis=(o.shell===false?[]:shell).filter(f=>facing(f.n,f.c)).sort((a,b)=>dist(b.c)-dist(a.c));
    if(o.curved){
      for(const f of vis) items.push({f:r+T1(tone(dot(f.n,L))),s:'',pts:f.ps.map(P),closed:true,seam:true});
      items.push({f:'',s:r,pts:hull(o.V.map(P)),closed:true});
      for(const f of vis) if(!f.smooth) items.push({f:'',s:r,pts:f.ps.map(P),closed:true});
    } else {
      for(const f of vis) items.push({f:r+T1(tone(dot(f.n,L))),s:r,pts:f.ps.map(P),closed:true});
      if(rim) items.push({f:'',s:r,pts:rim,closed:true});
    }
    for(const ln of o.lines||[]) items.push({f:'',s:(mono?'b':(ln.role||r))+'l',pts:ln.pts.map(P),closed:false});
  }
  // 24 칸 맞추기
  const xs=items.flatMap(it=>it.pts.map(p=>p[0])), ys=items.flatMap(it=>it.pts.map(p=>p[1]));
  const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const pad=scene.pad??1.2, sc=Math.min((24-2*pad)/(x1-x0),(24-2*pad)/(y1-y0)), ox=(24-(x1-x0)*sc)/2, oy=(24-(y1-y0)*sc)/2;
  const T=p=>`${+((p[0]-x0)*sc+ox).toFixed(1)} ${+((p[1]-y0)*sc+oy).toFixed(1)}`;
  return items.map(it=>({f:it.f,s:it.s,seam:it.seam,d:'M'+it.pts.map(T).join('L')+(it.closed?'Z':'')}));
}

// ── 색 ──
const PAL={
  g:['#ffffff','#f1f1f4','#e3e3e8','#d3d3da'], i:['#ececf0','#dedee4','#cfcfd6','#c2c2ca'],
  b:['hsl(214 100% 98%)','hsl(214 95% 93%)','hsl(214 88% 86%)','hsl(214 80% 79%)'], j:['hsl(214 80% 88%)','hsl(214 70% 82%)','hsl(214 62% 76%)','hsl(214 55% 70%)'],
  r:['hsl(0 100% 98%)','hsl(0 92% 94%)','hsl(0 86% 88%)','hsl(0 80% 82%)'], k:['hsl(0 70% 88%)','hsl(0 62% 82%)','hsl(0 55% 76%)','hsl(0 50% 70%)'],
};
const STROKE={g:['#8a8a94',1], b:['hsl(216 100% 58%)',1.4], r:['hsl(0 84% 58%)',1.4], gl:['#a3a3ad',0.75], bl:['hsl(216 100% 64%)',1], rl:['hsl(0 84% 62%)',1]};
function toSvg(items,size){
  const fill=c=>c?PAL[c[0]][+c[1]]:'none';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke-linecap="round" stroke-linejoin="round">`+
    items.map(it=>{const s=it.s?STROKE[it.s]:null;
      return `<path d="${it.d}" fill="${fill(it.f)}"${s?` stroke="${s[0]}" stroke-width="${s[1]}"`:it.seam?` stroke="${fill(it.f)}" stroke-width="0.3"`:''}/>`}).join('')+`</svg>`;
}
if(typeof module!=='undefined') module.exports={render,toSvg,PAL,STROKE};
