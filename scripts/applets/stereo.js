/* Section 5.3 stereo extension. Uses the shared laboratory shell and controls. */
if (PAGE.id === 'S53') {
  let controller = null;
  const stereo = s => {
    const uL=s.f*s.X/s.Z, uR=s.f*(s.X-s.B)/s.Z, v=s.f*s.Y/s.Z;
    return {uL,uR,vL:v,vR:v,d:uL-uR,Z:s.f*s.B/(uL-uR)};
  };
  const line=(a,b,color='#718081',extra='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" ${extra}/>`;
  const text=(p,t,extra='')=>`<text x="${p[0]}" y="${p[1]}" ${extra}>${esc(t)}</text>`;
  const dot=(p,r,color)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${color}"/>`;
  const project=(s,x,y,z)=>[380+110*(x-2+(s.view==='top'?0:.15*y+.1*z)),340+110*((s.view==='top'?0:.025*x+.9*y)-.2*z)];
  function rig(s){
    const p=(x,y,z)=>project(s,x,y,z),F=s.f/1000,P=p(s.X,s.Y,s.Z),ol=p(0,0,0),or=p(s.B,0,0);
    let b='';
    [0,s.B].forEach(c=>{
      b+=line(p(c,0,0),p(c,0,10.4),'#9eaaa6','stroke-dasharray="3 6"');
      const corners=[p(c-.64,-.36,F),p(c+.64,-.36,F),p(c+.64,.36,F),p(c-.64,.36,F)];
      b+=`<polygon points="${corners.map(v=>v.join(',')).join(' ')}" fill="#247780" fill-opacity=".055" stroke="#718081"/>`;
      b+=line(p(c-.64,F*s.Y/s.Z,F),p(c+.64,F*s.Y/s.Z,F),'#247780','stroke-width="1.6"');
    });
    b+=line(ol,P,'#985218','stroke-width="2"')+line(or,P,'#247780','stroke-width="2" stroke-dasharray="6 4"')+line(ol,or,'#718081');
    const pl=p(F*s.X/s.Z,F*s.Y/s.Z,F),pr=p(s.B+F*(s.X-s.B)/s.Z,F*s.Y/s.Z,F);
    b+=dot(pl,6,'#985218')+dot(pr,6,'#247780')+dot(ol,9,'#596968')+dot(or,9,'#596968')+dot(P,11,'#b38335');
    b+=text([ol[0]-10,ol[1]+31],'Oₗ','class="stereo-math" text-anchor="end"')+text([or[0]+10,or[1]+31],'Oᵣ','class="stereo-math"');
    b+=text([pl[0]-10,pl[1]-15],'pₗ','class="stereo-math" text-anchor="end"')+text([pr[0]+10,pr[1]-15],'pᵣ','class="stereo-math"');
    b+=text([P[0],P[1]-21],'P','class="stereo-math" text-anchor="middle"');
    b+=text([(ol[0]+or[0])/2,(ol[1]+or[1])/2+30],`B = ${fmt(s.B)} m`,'text-anchor="middle"');
    b+=text([P[0]-22,(P[1]+ol[1])/2],`Z = ${fmt(s.Z)} m`,'text-anchor="end"');
    b+=`<circle data-stereo-point cx="${P[0]}" cy="${P[1]}" r="25" fill="transparent" class="stereo-point"><title>Drag P to change X and Z; the position sliders provide keyboard access.</title></circle>`;
    return `<div class="actions stereo-actions"><button type="button" data-stereo-play aria-pressed="${!!controller?.playing}">${controller?.playing?'Pause':'Animate'}</button><span>Drag P to change X and Z</span></div><div class="plot-scroll"><svg class="stereo-rig" viewBox="0 0 760 420" role="img" aria-label="Parallel stereo cameras with projection rays to point P"><title>Parallel stereo cameras</title>${b}</svg></div><div class="legend"><span><i style="background:#985218"></i>Left ray (solid)</span><span><i style="background:#247780"></i>Right ray (dashed)</span></div>`;
  }
  function images(s){
    const q=stereo(s),W=760,panels=[{x:20,u:q.uL,label:'Left',color:'#985218'},{x:420,u:q.uR,label:'Right',color:'#247780'}];
    let b='';
    for(const panel of panels){
      const cx=panel.x+160,cy=125,px=cx+panel.u*.25,py=cy+q.vL*.25;
      b+=text([panel.x,20],`${panel.label} image`)+text([panel.x+320,20],`u = ${fmt(panel.u)} px`,'text-anchor="end"');
      b+=`<rect x="${panel.x}" y="35" width="320" height="180" fill="none" stroke="#718081"/>`;
      b+=line([cx,35],[cx,215],'#c5c8bd','stroke-dasharray="3 5"')+line([panel.x,cy],[panel.x+320,cy],'#c5c8bd');
      b+=line([panel.x,py],[panel.x+320,py],panel.color,'opacity=".6"');
      if(Math.abs(panel.u)<=640)b+=dot([px,py],6,panel.color);
      else b+=text([cx,cy-12],'P outside image','text-anchor="middle"');
      b+=text([cx,232],'0','text-anchor="middle"')+text([panel.x+320,232],'u (px) →','text-anchor="end"');
    }
    const xr=380+.5*q.uR,xl=380+.5*q.uL,y=288;
    b+=line([60,y],[700,y],'#718081')+line([380,y-4],[380,y+4],'#718081')+text([380,y+21],'0','text-anchor="middle"');
    if(xr>=60&&xl<=700){
      b+=line([xr,y-13],[xl,y-13],'#985218','stroke-width="2"')+line([xr,y-18],[xr,y+5],'#247780')+line([xl,y-18],[xl,y+5],'#985218');
      b+=dot([xr,y],5,'#247780')+dot([xl,y],5,'#985218');
      b+=text([(xr+xl)/2,y-26],`d = ${fmt(q.d)} px`,'text-anchor="middle"');
    }else b+=text([380,y-20],`d = ${fmt(q.d)} px · P outside image`,'text-anchor="middle"');
    b+=text([60,335],`vₗ = vᵣ = ${fmt(q.vL)} px`)+text([700,335],'Common centered u axis (px)','text-anchor="end"');
    return `<div class="plot-scroll"><svg viewBox="0 0 ${W} 350" role="img" aria-label="Left and right images, equal vertical coordinates, and horizontal disparity"><title>Image coordinates and disparity</title>${b}</svg></div>`;
  }
  lab('stereo','Depth from stereo','Move a point in front of two parallel cameras. Compare its two image positions, measure disparity, and recover depth.',[
    slider('Z','Depth Z (m)',6,3,10,.01),slider('B','Baseline B (m)',3,1.5,4,.01),slider('f','Focal length f (pixels)',700,400,1000),
    slider('X','Point X (m)',1.5,-.5,4,.01),slider('Y','Point Y (m, down)',-.3,-.7,.7,.01),
    select('motion','Animation','depth',[['depth','Near → far → near'],['sideways','Sideways at fixed depth']]),
    select('view','Rig view','oblique',[['oblique','Oblique view'],['top','Top view']])
  ],s=>{const q=stereo(s);return {
    metrics:[['Disparity d (pixels)',q.d],['Recovered depth Z (m)',q.Z],['Common row v (pixels)',q.vL]],
    charts:[{type:'custom',title:'Parallel stereo rig',render:()=>rig(s)},{type:'custom',title:'Two images, one disparity',render:()=>images(s)}],
    stereo:q,
    text:'d = uₗ − uᵣ = f B / Z, so Z = f B / d. Moving sideways at fixed depth shifts both image points equally. The cameras share their calibration; centered image coordinates set u₀ = v₀ = 0. The enlarged virtual planes use an illustrative scale of 1 mm per pixel. The rig is a geometric illustration, not a model of a particular physical camera.'
  };},[],'Interactive extension of Section 5.3’s Stereo Vision equations. The book’s u, v, f, B, and Z notation is preserved; the example parameters are illustrative.');
  const experiment=experiments.at(-1);experiment.resetLabel='Example defaults';
  experiment.attach=api=>{
    const results=$('results'),controls=$('controls'),metrics=$('metrics');
    const c={playing:false,frame:null,last:null,phase:0,drag:null};controller=c;
    const stop=()=>{c.playing=false;if(c.frame!==null)cancelAnimationFrame(c.frame);c.frame=null;metrics.setAttribute('aria-live','polite');};
    const tick=t=>{if(!c.playing)return;const dt=c.last===null?0:Math.min((t-c.last)/1000,.05);c.last=t;c.phase+=dt*Math.PI/6;
      api.setValues(api.state.motion==='depth'?{Z:6.5-3.5*Math.cos(c.phase)}:{X:1.75-2.25*Math.cos(c.phase)});
      c.frame=requestAnimationFrame(tick);
    };
    const click=e=>{if(!e.target.closest('[data-stereo-play]'))return;if(c.playing){stop();api.update();return;}
      c.phase=api.state.motion==='depth'?Math.acos(Math.max(-1,Math.min(1,(6.5-api.state.Z)/3.5))):Math.acos(Math.max(-1,Math.min(1,(1.75-api.state.X)/2.25)));
      c.last=null;c.playing=true;metrics.setAttribute('aria-live','off');api.update();c.frame=requestAnimationFrame(tick);
    };
    const down=e=>{if(!e.target.closest('[data-stereo-point]'))return;stop();c.drag=e.pointerId;results.setPointerCapture(e.pointerId);e.preventDefault();};
    const move=e=>{if(c.drag!==e.pointerId)return;if(!(e.buttons&1)){c.drag=null;return;}
      const rect=results.querySelector('.stereo-rig').getBoundingClientRect(),u=((e.clientX-rect.left)*760/rect.width-380)/110+2,v=((e.clientY-rect.top)*420/rect.height-340)/110;
      const top=api.state.view==='top',a=top?0:.1,b=top?0:.025,ux=u-(top?0:.15*api.state.Y),vy=v-(top?0:.9*api.state.Y),det=-.2-a*b;
      const X=(-.2*ux-a*vy)/det,Z=(vy-b*ux)/det;
      api.setValues({X:Math.max(-.5,Math.min(4,X)),Z:Math.max(3,Math.min(10,Z))});
    };
    const up=()=>{c.drag=null;};
    const input=()=>{stop();api.update();};
    const visibility=()=>{if(document.hidden){stop();api.update();}};
    for(const [name,fn] of [['click',click],['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up]])results.addEventListener(name,fn);
    controls.addEventListener('input',input);controls.addEventListener('change',input);document.addEventListener('visibilitychange',visibility);
    return ()=>{stop();controller=null;for(const [name,fn] of [['click',click],['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up]])results.removeEventListener(name,fn);controls.removeEventListener('input',input);controls.removeEventListener('change',input);document.removeEventListener('visibilitychange',visibility);};
  };
}
