/* Run from a build directory with make -j6 testApplets.run. Requires jsdom. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');const root=path.resolve(__dirname,'../..'),out=path.join(root,'applets');
const refs=JSON.parse(fs.readFileSync('reference.json','utf8'));
let failures=[],count=0,refCount=0,changes=0,manifest=[];
function near(actual,expected,tol,label){if(Array.isArray(expected)){assert.equal(actual.length,expected.length,label+' length');expected.forEach((e,i)=>near(actual[i],e,tol,label+'['+i+']'));}else if(typeof expected==='number')assert(Number.isFinite(actual)&&Math.abs(actual-expected)<=tol*Math.max(1,Math.abs(expected)),`${label}: ${actual} != ${expected}`);else assert.equal(actual,expected,label);}
function resultOK(o){for(const[k,v]of o.metrics||[])if(typeof v==='number')assert(Number.isFinite(v),'Non-finite metric '+k);for(const ch of o.charts||[]){assert(ch&&typeof ch==='object','Invalid chart');if(ch.type==='image')assert(/^data:image/.test(ch.src),'Missing saved image');if(ch.type==='xy')for(const s of ch.series)for(const p of s.points)assert(p.every(Number.isFinite),'Non-finite plotted coordinate');if(ch.type==='heat')assert(ch.values.flat().every(Number.isFinite),'Non-finite heatmap');if(ch.type==='bar')assert(ch.values.every(Number.isFinite),'Non-finite bar');}}
const files=fs.readdirSync(out).filter(f=>/^S\d\d_.*html$/.test(f));assert.equal(files.length,33);
const index=new JSDOM(fs.readFileSync(path.join(out,'index.html'),'utf8'));for(const f of files)assert(index.window.document.querySelector(`a[href="${f}"]`),'Index missing '+f);index.window.close();
for(const file of files.filter(f=>!f.startsWith('S24'))){
 const html=fs.readFileSync(path.join(out,file),'utf8'),virtualConsole=new VirtualConsole();let errors=[];virtualConsole.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'file://'+path.join(out,file),virtualConsole});const w=dom.window,a=w.APPLET;
 if(!a){failures.push(file+': '+errors.join(';'));w.close();continue;}
 const info={file,experiments:[]};
 for(let i=0;i<a.experiments.length;i++){
 const e=a.experiments[i],defaults=Object.fromEntries(e.controls.map(c=>[c.key,c.value]));info.experiments.push({id:e.id,title:e.title,cells:e.cells});count++;
 try{a.show(i);assert(w.document.getElementById('error').hidden,w.document.getElementById('error').textContent);resultOK(w.APPLET_LAST_RESULT);assert(!w.document.querySelector('svg')?.outerHTML.match(/(?:NaN|Infinity)/));
 for(const c of e.cells)assert(w.eval('PAGE.code')[c],`Missing source cell ${c}`);
 for(const ref of refs.filter(r=>file.startsWith(r.section)&&r.lab===e.id)){const o=e.run({...defaults,...ref.args});let actual=ref.path[0]==='metric'?o.metrics.find(([k])=>k===ref.path[1])?.[1]:ref.path.reduce((a,k)=>a[k],o);near(actual,ref.value,ref.tol,ref.path.join('/'));refCount++;}
 for(const c of e.controls){let values=c.type==='select'?c.options.map(v=>Array.isArray(v)?String(v[0]):v):c.type==='range'?[c.min,c.max]:[];for(const v of values){try{resultOK(e.run({...defaults,[c.key]:v}));changes++;}catch(err){if(e.id==='particles'&&/No particles explain/.test(err.message)){changes++;continue;}throw Error(c.key+'='+v+': '+err.message);}}}
 // Exercise actual tab keyboard and reset handlers.
 const tab=w.document.querySelector('[role="tab"][aria-selected="true"]');assert(tab);tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(w.document.querySelector('[role="tab"][aria-selected="true"]').id,'tab-'+((i+1)%a.experiments.length));a.show(i);w.document.getElementById('reset').click();assert.deepEqual(JSON.parse(JSON.stringify(a.states[i])),defaults);
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
