/* Numerical kernels shared by the standalone robotics laboratories. */
'use strict';
const MathLab = (() => {
 const sum=a=>a.reduce((x,y)=>x+y,0), dot=(a,b)=>sum(a.map((x,i)=>x*b[i]));
 const norm=a=>Math.sqrt(dot(a,a)), add=(a,b)=>a.map((x,i)=>x+b[i]), sub=(a,b)=>a.map((x,i)=>x-b[i]), scale=(a,s)=>a.map(x=>x*s);
 const normalize=a=>{const s=sum(a);if(!(s>0))throw Error('At least one weight must be positive.');return a.map(x=>x/s);};
 const softmax=a=>{const m=Math.max(...a);return normalize(a.map(x=>Math.exp(x-m)));};
 const eye=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>+(i===j))), tr=a=>a[0].map((_,j)=>a.map(r=>r[j])), mv=(a,x)=>a.map(r=>dot(r,x)), mm=(a,b)=>a.map(r=>tr(b).map(c=>dot(r,c)));
 function solve(a,b){a=a.map((r,i)=>[...r,b[i]]);const n=b.length;for(let i=0;i<n;i++){let p=i;for(let j=i+1;j<n;j++)if(Math.abs(a[j][i])>Math.abs(a[p][i]))p=j;if(Math.abs(a[p][i])<1e-13)throw Error('The system is singular. Choose independent observations.');[a[p],a[i]]=[a[i],a[p]];const d=a[i][i];for(let k=i;k<=n;k++)a[i][k]/=d;for(let j=0;j<n;j++)if(j!==i){const f=a[j][i];for(let k=i;k<=n;k++)a[j][k]-=f*a[i][k];}}return a.map(r=>r[n]);}
 const ls=(a,b)=>solve(mm(tr(a),a),mv(tr(a),b));
 function rng(seed=42){let s=seed>>>0;const u=()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};u.normal=()=>Math.sqrt(-2*Math.log(Math.max(u(),1e-12)))*Math.cos(2*Math.PI*u());u.pick=p=>{let t=u()*sum(p);for(let i=0;i<p.length;i++){t-=p[i];if(t<0)return i;}return p.length-1;};return u;}
 const gaussian=(x,mu=0,s=1)=>Math.exp(-.5*((x-mu)/s)**2)/(s*Math.sqrt(2*Math.PI));
 const wrap=x=>Math.atan2(Math.sin(x),Math.cos(x));
 const r2=t=>[[Math.cos(t),-Math.sin(t)],[Math.sin(t),Math.cos(t)]];
 const transform=(t,p)=>add(mv(r2(t[2]),p),t.slice(0,2));
 const compose=(a,b)=>[...transform(a,b.slice(0,2)),wrap(a[2]+b[2])];
 const inverse=t=>[...mv(r2(-t[2]),scale(t.slice(0,2),-1)),-t[2]];
 const r3=(axis,t)=>{const c=Math.cos(t),s=Math.sin(t);return axis===0?[[1,0,0],[0,c,-s],[0,s,c]]:axis===1?[[c,0,s],[0,1,0],[-s,0,c]]:[[c,-s,0],[s,c,0],[0,0,1]];};
 function exp3(w){const a=norm(w);if(a<1e-12)return eye(3);const [x,y,z]=scale(w,1/a),K=[[0,-z,y],[z,0,-x],[-y,x,0]],K2=mm(K,K);return eye(3).map((r,i)=>r.map((v,j)=>v+Math.sin(a)*K[i][j]+(1-Math.cos(a))*K2[i][j]));}
 function optimize(initial,residual,iterations=10){let x=[...initial],history=[];for(let it=0;it<=iterations;it++){const r=residual(x),cost=dot(r,r)/2;history.push({x:[...x],cost});if(it===iterations)break;const h=1e-5,J=tr(x.map((_,j)=>{const a=[...x];a[j]+=h;return scale(sub(residual(a),r),1/h);}));const H=mm(tr(J),J),g=mv(tr(J),r);H.forEach((row,i)=>row[i]+=1e-6);const dx=solve(H,scale(g,-1));let step=1,next;while(step>1/1024){next=add(x,scale(dx,step));const rr=residual(next);if(dot(rr,rr)<=2*cost)break;step/=2;}if(step<=1/1024)break;x=next;}return history;}
 function hmm(T,S,actions,z,prior){const n=z.length,k=prior.length;let paths=[];function recurse(xs,p){const t=xs.length;if(t===n){paths.push({xs,p});return;}for(let x=0;x<k;x++){const q=(t?T[xs[t-1]][actions[t-1]][x]:prior[x])*S[x][z[t]];if(q>0)recurse([...xs,x],p*q);}}recurse([],1);const evidence=sum(paths.map(p=>p.p));if(!evidence)throw Error('The observations have zero probability under this model.');paths.sort((a,b)=>b.p-a.p);const marg=Array.from({length:n},()=>Array(k).fill(0));paths.forEach(p=>p.xs.forEach((x,t)=>marg[t][x]+=p.p/evidence));return {paths,evidence,marg};}
 function qValues(T,R,V,gamma){return T.map((aa,x)=>aa.map((p,a)=>dot(p,R[x][a].map((r,y)=>r+gamma*V[y]))));}
 function policyValue(T,R,pi,gamma){return solve(T.map((aa,x)=>aa[pi[x]].map((p,y)=>+(x===y)-gamma*p)),T.map((aa,x)=>dot(aa[pi[x]],R[x][pi[x]])));}
 function conv1(a,k){const h=Math.floor(k.length/2);return a.map((_,i)=>sum(k.map((v,j)=>v*(a[i+j-h]||0))));}
 function volume(d,rgb,bg=[1,1,1]){let trans=1,out=[0,0,0],weights=[];d.forEach((v,i)=>{const a=-Math.expm1(-Math.max(0,v)),w=trans*a;weights.push(w);out=add(out,scale(rgb[i],w));trans*=Math.exp(-Math.max(0,v));});return {color:add(out,scale(bg,trans)),weights,trans};}
 function tri(values,x,y,z){return sum(values.map((v,i)=>v*((i&4)?x:1-x)*((i&2)?y:1-y)*((i&1)?z:1-z)));}
 return {sum,dot,norm,add,sub,scale,normalize,softmax,eye,tr,mv,mm,solve,ls,rng,gaussian,wrap,r2,r3,exp3,transform,compose,inverse,optimize,hmm,qValues,policyValue,conv1,volume,tri};
})();
