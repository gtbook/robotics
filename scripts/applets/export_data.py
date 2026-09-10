"""Export notebook assets without downloading models or executing notebooks (py312)."""
from pathlib import Path
import base64,json
import numpy as np
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[2]; OUT=Path(__file__).parent/'data'
def write(id,data): (OUT/f'{id}.json').write_text(json.dumps(data,separators=(',',':')))
def read(id): return json.loads((OUT/f'{id}.json').read_text())
for id,cells in {'S54':[41,45,51],'S64':[34,43,50],'S74':[17,26],'S75':[37,43,45,54,65],'S76':[38,51,58,60]}.items():
    nb=json.loads(next(ROOT.glob(id+'_*.ipynb')).read_text()); data=read(id) if (OUT/f'{id}.json').exists() else {}; data['saved']={}
    for i in cells:
        for output in nb['cells'][i].get('outputs',[]):
            png=output.get('data',{}).get('image/png')
            if png: data['saved'][str(i)]='data:image/png;base64,'+(''.join(png) if isinstance(png,list) else png)
    write(id,data)
# Preserve original full-resolution grayscale pixels; the browser computes the filters.
p=next(ROOT.rglob('LL_color_1201754063.387872.jpeg')); im=ImageOps.grayscale(Image.open(p)); d=read('S54'); d['gray']={'width':im.width,'height':im.height,'pixels':base64.b64encode(im.tobytes()).decode()};d['original']='data:image/jpeg;base64,'+base64.b64encode(p.read_bytes()).decode();write('S54',d)
# Read the actual binary PLY vertex records and retain a deterministic stride.
clouds=[]
for name in ['PC_315967795019746000.ply','PC_315967795520065000.ply','PC_315967795919523000.ply']:
    raw=(ROOT/'Figures6/lidar'/name).read_bytes();offset=raw.index(b'end_header\n')+len(b'end_header\n')
    header=raw[:offset].decode();count=int(next(x.split()[-1] for x in header.splitlines() if x.startswith('element vertex')))
    dtype=np.dtype([('x','<f4'),('y','<f4'),('z','<f4'),('intensity','u1'),('laser_number','<u2')])
    vertices=np.frombuffer(raw,dtype=dtype,count=count,offset=offset);points=np.column_stack([vertices[k] for k in ('x','y','z')])
    clouds.append({'name':name,'count':count,'points':np.round(points[::int(np.ceil(count/1200))].astype(float),5).tolist()})
write('S63',{'clouds':clouds})
# Fixed warehouse geometry from gtbook.logistics (shelves: width 9, gap 8).
base=np.zeros((50,100));proximity=np.zeros((50,100));off=np.ones((50,100))
for i in range(4):
    x=20+17*i;base[10:40,x:x+9]=1;proximity[8:42,x-2:x+11]=1;off[8:42,x-2:x+11]=0
proximity[:2]=1;proximity[-2:]=1;proximity[:,:2]=1;proximity[:,-2:]=1
proximity[base==1]=0;off[:2]=0;off[-2:]=0;off[:,:2]=0;off[:,-2:]=0
write('logistics',{'base':base.tolist(),'proximity':proximity.tolist(),'off':off.tolist(),'beacons':[[24+17*i,y] for y in (9.5,39.5) for i in range(4)],'mapOrigin':[0,0]})
# Exact gtbook.drone.create_random_map algorithm, using NumPy instead of importing its optional GTSAM extensions.
rng=np.random.default_rng(seed=7); a=np.zeros((100,300),dtype=np.float32)
for _ in range(50):
    x,y=rng.integers(0,300),rng.integers(0,100);a[y,x]=rng.random()*.5+.5
b=np.zeros_like(a);padded=np.pad(a,2)
for i in range(5):
    for j in range(5):b+=padded[i:i+100,j:j+300]
d=read('S75');d['obstacles']=[[int(x),int(y),float(b[y,x])] for y,x in np.argwhere(b)];write('S75',d)
print('Exported saved figures, grayscale pixels, lidar subsets, and the seeded obstacle map.')
