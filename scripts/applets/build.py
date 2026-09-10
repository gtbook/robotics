"""Build standalone HTML laboratories. Run with: conda run -n py312 python scripts/applets/build.py"""
from pathlib import Path
import base64, html, json
ROOT=Path(__file__).resolve().parents[2]; SRC=Path(__file__).resolve().parent; OUT=ROOT/'applets'
CHAPTERS={'2':('The trash sorter','sorter.js'),'3':('The robot vacuum','vacuum.js'),'4':('Warehouse robots','logistics.js'),'5':('The differential-drive robot','diffdrive.js'),'6':('Autonomous vehicles','driving.js'),'7':('Autonomous drones','drone.js')}

def script(data):return json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
def build():
    OUT.mkdir(exist_ok=True); css=(SRC/'style.css').read_text(); common=(SRC/'models.js').read_text()+'\n'+(SRC/'runtime.js').read_text()
    sections=json.loads((SRC/'sections.json').read_text()); rendered=[]
    for ident,title,desc in sections:
        p=next(ROOT.glob(ident+'_*.ipynb')); file='S24_perception.html' if ident=='S24' else p.stem+'.html'
        chapter=ident[1]; bundle=SRC/CHAPTERS[chapter][1]
        if ident=='S24':rendered.append((ident,title,desc,file,4));continue
        if not bundle.exists():raise FileNotFoundError(bundle)
        nb=json.loads(p.read_text());code={i:''.join(c['source']) for i,c in enumerate(nb['cells']) if c['cell_type']=='code'}
        datafile=SRC/'data'/f'{ident}.json';data=json.loads(datafile.read_text()) if datafile.exists() else {}
        shared=SRC/'data'/'logistics.json'
        if chapter=='4' and shared.exists():data.update(json.loads(shared.read_text()))
        artwork=sorted((ROOT/'Art/steampunk').glob(ident+'-*.jpg'))
        if not artwork:artwork=sorted((ROOT/'Art/steampunk').glob('S'+chapter+'*-*.jpg'))
        art='data:image/jpeg;base64,'+base64.b64encode(artwork[0].read_bytes()).decode() if artwork else ''
        payload={'id':ident,'code':code,'data':data};source=bundle.read_text();n=source.count('lab(') # metadata count is corrected by validation's live inventory
        page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{html.escape(desc,quote=True)}"><title>{html.escape(title)} · {ident} Laboratory</title><style>{css}</style></head><body><div class="shell">
<a class="home" href="index.html">← All robotics laboratories</a><header class="masthead"><img class="portrait" src="{art}" alt="Steampunk robot artwork from the book"><div><div class="eyebrow">Robotics &amp; Perception · Section {ident[1]}.{ident[2]}</div><h1>{html.escape(title)}</h1><p class="muted">{html.escape(desc)}</p></div></header>
<nav id="tabs" class="tabs" role="tablist" aria-label="Experiments"></nav><main id="experiment" role="tabpanel" tabindex="0"><div class="intro"><h2 id="experiment-title"></h2><p id="description" class="muted"></p></div><div id="note" class="note" hidden></div><div class="workbench"><aside class="controls-panel"><h3>The experiment</h3><div id="controls"></div><div class="actions"><button id="run">Recalculate</button><button id="reset">Notebook defaults</button></div></aside><div><div id="error" class="error" role="alert" hidden></div><div id="metrics" class="metrics" aria-live="polite"></div><div id="results"></div><details><summary>Compare with the notebook’s Python example</summary><p class="muted">Cell numbers below are zero-based indices in the notebook. Browser calculations use the same stated parameters; seeded random realizations and pedagogical extensions are identified in the experiment.</p><div id="source"></div></details></div></div></main>
<footer class="footer"><span>Robotics &amp; Perception · Frank Dellaert &amp; Seth Hutchinson</span><span>Standalone HTML · Works offline · <a href="https://github.com/gtbook/robotics/blob/main/{p.name}">Source notebook</a></span></footer><noscript><p class="error">Enable JavaScript to use the interactive experiments.</p></noscript></div><script>const PAGE={script(payload)};</script><script>{common}</script><script>{source}\nmount();</script></body></html>'''
        (OUT/file).write_text(page);rendered.append((ident,title,desc,file,n))
    groups=''
    for chapter,(name,_) in CHAPTERS.items():
        cards=''.join(f'<a href="{file}"><span class="number">SECTION {ident[1]}.{ident[2]}</span><h3>{html.escape(title)}</h3><p>{html.escape(desc)}</p></a>' for ident,title,desc,file,_ in rendered if ident[1]==chapter)
        groups+=f'<section class="chapter" id="chapter-{chapter}"><h2>{chapter}. {name}</h2><div class="catalogue">{cards}</div></section>'
    index=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Independent, offline interactive laboratories for Robotics and Perception."><title>The Robotics Laboratory</title><style>{css}</style></head><body><main class="shell"><header class="index-head"><div class="eyebrow">Robotics &amp; Perception · An independent companion</div><h1>The Robotics Laboratory</h1><p class="muted">Turn the book’s numerical examples into experiments. Adjust a measurement, move a robot, or step through an algorithm—and inspect what changes.</p><div class="index-stats"><div><strong>{len(rendered)}</strong><span>Section laboratories</span></div><div><strong>6</strong><span>Robot chapters</span></div><div><strong>Offline</strong><span>Every page is self-contained</span></div></div></header><nav class="chapter-links" aria-label="Robot chapters">{''.join(f'<a href="#chapter-{c}">{name}</a>' for c,(name,_) in CHAPTERS.items())}</nav>{groups}<details><summary>About this collection</summary><p>Each laboratory starts from the notebook’s numerical models and includes the relevant Python code. Randomized experiments expose a reproducible seed. Recorded outputs from large pretrained models are labeled as recorded results; they are not live neural-network inference.</p><p>The collection covers every section containing substantive executable Python. Introductions, summaries, and sections containing only imports or comments are omitted. You can save or copy an individual HTML file and use it without installing Python or connecting to a server.</p></details><footer class="footer"><span>Robotics &amp; Perception · Frank Dellaert &amp; Seth Hutchinson</span><span>Steampunk artwork from the book · Independent pedagogical resource</span></footer></main></body></html>'''
    (OUT/'index.html').write_text(index)
    print(f'Built {len(rendered)} section pages and applets/index.html.')
if __name__=='__main__':build()
