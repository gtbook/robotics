/* Run from a build directory with make -j6 testApplets.run. Requires jsdom. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');const root=path.resolve(__dirname,'../..'),out=path.join(root,'applets');
const refs=JSON.parse(fs.readFileSync('reference.json','utf8'));
let failures=[],count=0,refCount=0,changes=0,manifest=[];
function near(actual,expected,tol,label){if(Array.isArray(expected)){assert.equal(actual.length,expected.length,label+' length');expected.forEach((e,i)=>near(actual[i],e,tol,label+'['+i+']'));}else if(typeof expected==='number')assert(Number.isFinite(actual)&&Math.abs(actual-expected)<=tol*Math.max(1,Math.abs(expected)),`${label}: ${actual} != ${expected}`);else assert.equal(actual,expected,label);}
function resultOK(o){for(const[k,v]of o.metrics||[])if(typeof v==='number')assert(Number.isFinite(v),'Non-finite metric '+k);for(const ch of o.charts||[]){assert(ch&&typeof ch==='object','Invalid chart');if(ch.type==='custom')assert(!ch.render().match(/(?:NaN|Infinity)/),'Non-finite custom geometry');if(ch.type==='image')assert(/^data:image/.test(ch.src),'Missing saved image');if(ch.type==='xy')for(const s of ch.series)for(const p of s.points)assert(p.every(Number.isFinite),'Non-finite plotted coordinate');if(ch.type==='heat')assert(ch.values.flat().every(Number.isFinite),'Non-finite heatmap');if(ch.type==='bar')assert(ch.values.every(Number.isFinite),'Non-finite bar');}}
const files=fs.readdirSync(out).filter(f=>/^S\d\d_.*html$/.test(f));assert.equal(files.length,34);
const motionStudies={S61:{'reference-frames':3,'rotation-composition':4},S62:{'driving-kinematics':3}};
function checkStudyPlayback(srcdoc, id, canvasCount) {
 const pending = new Map();
 let now = 0, next = 0;
 const errors = [];
 const virtualConsole = new VirtualConsole();
 virtualConsole.on('jsdomError', error => errors.push(error.message));
 const dom = new JSDOM(srcdoc, {runScripts:'dangerously', virtualConsole, beforeParse(window) {
  window.ResizeObserver = class {observe() {}};
  window.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {
   get: (context, key) => context[key] ?? (() => {}),
  });
  window.performance.now = () => now;
  window.setInterval = callback => {pending.set(++next, callback); return next;};
  window.clearInterval = timer => pending.delete(timer);
 }});
 try {
  const {document} = dom.window;
  const find = selector => document.querySelector(selector);
  const advance = elapsed => {
   assert.equal(pending.size, 1, 'Playback has one active timer');
   now += elapsed;
   pending.values().next().value();
  };
  assert.equal(document.querySelectorAll('canvas').length, canvasCount);
  assert(!find('script[src],link[rel="stylesheet"]'), 'External motion study dependency');
  assert.equal(pending.size, 0, 'Study is initially paused');
  if (id === 'rotation-composition') {
   const play = find('#comp-animate');
   play.click();
   advance(1500);
   assert.equal(find('[data-comp-step][aria-pressed="true"]').dataset.compStep, '1');
   play.click();
   assert.equal(pending.size, 0, 'Pause stops the sequence');
   play.click();
   advance(1500);
   assert.equal(find('[data-comp-step][aria-pressed="true"]').dataset.compStep, '2');
   find('[data-comp-step="0"]').click();
   assert.equal(pending.size, 0, 'Choosing a stage stops the sequence');
  } else {
   const play = find('.transport .play');
   const sliders = [...document.querySelectorAll('.mrange')];
   const values = () => sliders.map(slider => Number(slider.value));
   assert.equal(play.getAttribute('aria-label'), 'Play all three');
   play.click();
   advance(50);
   assert(values().every(value => value > 0 && value === values()[0]), 'First click moves all three timelines');
   play.click();
   assert.equal(pending.size, 0, 'Pause stops all three timelines');
   const paused = values();
   find('.mplay').click();
   advance(50);
   assert(values()[0] > paused[0], 'Per-view playback advances');
   assert.deepEqual(values().slice(1), paused.slice(1), 'Other views stay paused');
   find('.mplay').click();
   assert.equal(pending.size, 0, 'Pausing the last view stops the timer');
  }
  assert.deepEqual(errors, []);
 } finally {
  dom.window.close();
 }
}
const index=new JSDOM(fs.readFileSync(path.join(out,'index.html'),'utf8'));for(const f of files)assert(index.window.document.querySelector(`a[href="${f}"]`),'Index missing '+f);index.window.close();
for(const file of files.filter(f=>!f.startsWith('S24'))){
 const html=fs.readFileSync(path.join(out,file),'utf8'),virtualConsole=new VirtualConsole();let errors=[];virtualConsole.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'file://'+path.join(out,file)+(file.startsWith('S53')?'#stereo':''),virtualConsole});const w=dom.window,a=w.APPLET;
 if(!a){failures.push(file+': '+errors.join(';'));w.close();continue;}
 if(file.startsWith('S53'))assert.equal(w.document.querySelector('[aria-selected="true"]').textContent,'Depth from stereo','Stereo deep link');
 const studies=motionStudies[file.slice(0,3)]||{};
 assert.deepEqual(Array.from(a.experiments.filter(e=>e.srcdoc),e=>e.id),Object.keys(studies),file+' motion studies');
 if(file.startsWith('S61')){
  assert.deepEqual(Array.from(a.experiments,e=>e.id),Object.keys(studies),'Section 6.1 tabs');
  assert.equal(w.document.querySelector('[aria-selected="true"]').textContent,'Reference frames in motion','Section 6.1 default tab');
 }
 const info={file,experiments:[]};
 for(let i=0;i<a.experiments.length;i++){
 const e=a.experiments[i],defaults=Object.fromEntries(e.controls.map(c=>[c.key,c.value]));info.experiments.push({id:e.id,title:e.title,cells:e.cells});count++;
 try{a.show(i);
 if(e.srcdoc){
  const frame=w.document.querySelector('iframe.motion-study');
  assert.equal(frame.getAttribute('sandbox'),'allow-scripts');
  assert.equal(frame.title,e.title);
  assert(w.document.querySelector('.workbench').hidden);
  checkStudyPlayback(frame.srcdoc,e.id,studies[e.id]);
  if(a.experiments.length>1){
   const next=(i+1)%a.experiments.length;
   const tab=w.document.querySelector('[role="tab"][aria-selected="true"]');
   tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
   assert.equal(w.document.querySelector('[aria-selected="true"]').id,'tab-'+next);
   assert(!frame.isConnected);
   assert.equal(w.document.querySelector('.workbench').hidden,Boolean(a.experiments[next].srcdoc));
  }
  continue;
 }
 assert(w.document.getElementById('error').hidden,w.document.getElementById('error').textContent);resultOK(w.APPLET_LAST_RESULT);assert(!w.document.querySelector('svg')?.outerHTML.match(/(?:NaN|Infinity)/));
 for(const c of e.cells)assert(w.eval('PAGE.code')[c],`Missing source cell ${c}`);
 for(const ref of refs.filter(r=>file.startsWith(r.section)&&r.lab===e.id)){const o=e.run({...defaults,...ref.args});let actual=ref.path[0]==='metric'?o.metrics.find(([k])=>k===ref.path[1])?.[1]:ref.path.reduce((a,k)=>a[k],o);// GTSAM may choose either side of the ±π branch cut for the same rotation.
 if(ref.section==='S64'&&ref.lab==='pose-slam'&&ref.path.join('/')==='tables/0/rows')actual=actual.map((row,i)=>row.map((v,j)=>j===3?ref.value[i][j]+Math.atan2(Math.sin(v-ref.value[i][j]),Math.cos(v-ref.value[i][j])):v));
 near(actual,ref.value,ref.tol,ref.path.join('/'));refCount++;}
 for(const c of e.controls){let values=c.type==='select'?c.options.map(v=>Array.isArray(v)?String(v[0]):v):c.type==='range'?[c.min,c.max]:[];for(const v of values){try{resultOK(e.run({...defaults,[c.key]:v}));changes++;}catch(err){if(e.id==='particles'&&/No particles explain/.test(err.message)){changes++;continue;}throw Error(c.key+'='+v+': '+err.message);}}}
 // Exercise actual tab keyboard and reset handlers.
 const tab=w.document.querySelector('[role="tab"][aria-selected="true"]');assert(tab);tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(w.document.querySelector('[role="tab"][aria-selected="true"]').id,'tab-'+((i+1)%a.experiments.length));a.show(i);w.document.getElementById('reset').click();assert.deepEqual(JSON.parse(JSON.stringify(a.states[i])),defaults);
 if(file.startsWith('S53')&&e.id==='stereo'){
  assert(w.document.getElementById('source').closest('details').hidden,'Prose extension has no invented Python cell');
  const pending=new Map();let next=0;
  w.requestAnimationFrame=fn=>{pending.set(++next,fn);return next;};w.cancelAnimationFrame=id=>pending.delete(id);
  const advance=t=>{const item=pending.entries().next().value;assert(item,'Animation schedules a frame');pending.delete(item[0]);item[1](t);};
  const play=()=>w.document.querySelector('[data-stereo-play]').click();
  play();advance(1000);advance(1050);assert.notEqual(a.states[i].Z,defaults.Z,'Depth animation moves the point');
  const motion=w.document.getElementById('control-motion');motion.value='sideways';motion.dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(pending.size,0,'Changing motion stops animation');
  const depth=a.states[i].Z,disparity=w.APPLET_LAST_RESULT.stereo.d,x=a.states[i].X;
  play();advance(2000);advance(2050);assert.notEqual(a.states[i].X,x,'Sideways animation moves X');near(a.states[i].Z,depth,1e-12,'Fixed depth');near(w.APPLET_LAST_RESULT.stereo.d,disparity,1e-12,'Sideways disparity');
  w.document.getElementById('reset').click();assert.equal(pending.size,0,'Reset cancels animation');assert.deepEqual(JSON.parse(JSON.stringify(a.states[i])),defaults);
  play();a.show(0);assert.equal(pending.size,0,'Tab changes cancel animation');a.show(i);assert.equal(w.document.querySelector('[data-stereo-play]').getAttribute('aria-pressed'),'false','Returning to the tab is paused');
 }

 }catch(err){failures.push(file+' / '+e.id+': '+err.message);}
 }
 assert(!w.document.querySelector('script[src],link[rel="stylesheet"]'),'External dependency');
 for(const img of w.document.querySelectorAll('img'))assert(img.src.startsWith('data:'),'External image');
 assert(w.document.querySelector('a[href="index.html"]'),'Missing home link');
 manifest.push(info);w.close();
}
fs.writeFileSync('manifest.json',JSON.stringify(manifest,null,2));
console.log(`${count} experiments across ${manifest.length} new pages; ${refCount}/${refs.length} independent numerical references; ${changes} control variations.`);
if(refCount!==refs.length)failures.push('Not all numerical references ran.');
if(failures.length){console.error('FAILURES:\n'+failures.join('\n'));process.exitCode=1;}else console.log('PASS: defaults, controls, keyboard navigation, resets, source links, offline assets, and index coverage.');
