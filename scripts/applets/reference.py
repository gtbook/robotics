"""Independent NumPy/GTSAM references for book numerical examples. Use py312."""
from pathlib import Path
import json,math,io,contextlib,ast
import numpy as np
import gtsam
ROOT=Path(__file__).resolve().parents[2]; DATA=Path(__file__).parent/'data'; cases=[]
def case(section,lab,path,value,args=None,tol=1e-7):
    cases.append(dict(section=section,lab=lab,path=path,value=np.asarray(value).tolist() if not isinstance(value,str) else value,args=args or {},tol=tol))
def metric(section,lab,name,value,args=None,tol=1e-7):case(section,lab,['metric',name],value,args,tol)
prior=np.array([.2,.3,.25,.2,.05]); costs=np.array([[2,2,4,6,0],[1,1,0,0,2],[0,0,5,10,3],[1,1,1,1,1]])
for a in range(4):metric('S22','cost','Expected cost',costs[a]@prior,{'action':str(a)})
case('S21','sampling',['charts',1,'values'],np.cumsum(prior));case('S21','spec',['charts',0,'values'],[.25,.5,.25])
case('S26','counts',['charts',0,'values'],(np.array([3,11,7,1,3])+1)/30)
for i,(mu,sigma) in enumerate([(20,10),(5,5),(15,5),(150,100),(300,200)]):
    case('S23','density',['charts',0,'series',0,'points'],[[x,math.exp(-.5*((x-mu)/sigma)**2)/(sigma*math.sqrt(2*math.pi))]for x in range(500)],{'category':str(i)})
# Read the actual installed gtbook discrete transition specification, independently of browser tables.
import gtbook.vacuum as vacuum
T=np.array([[float(x)for x in row.split('/')]for row in vacuum.action_spec.split()]);T=(T/T.sum(axis=1,keepdims=True)).reshape(5,4,5)
case('S32','motion',['charts',0,'values'],T[2,1]@T[:,2,:])
case('S32','battery',['charts',1,'values'],[.81,.18,.01])
for room in range(5):case('S35','rewards',['charts',0,'values'],10*T[room,:,0],{'room':str(room)})
for gamma in [0,.5,.9,.99]:
    pi=np.array([2,0,1,2,0]);P=T[np.arange(5),pi];V=np.linalg.solve(np.eye(5)-gamma*P,10*P[:,0]);case('S35','policy',['charts',0,'values'],V,{'gamma':gamma})
V=np.full(5,100.)
for _ in range(10):V=np.max(np.sum(T*(np.array([10,0,0,0,0])+.9*V),axis=2),axis=1)
case('S36','value',['charts',0,'values'],V)
# Enumerate the three-state hidden Markov model.
S=np.array([[.1,.1,.8],[.1,.1,.8],[.2,.7,.1],[.8,.1,.1],[.1,.8,.1]])
joint=np.einsum('i,ij,j,jk,k->ijk',S[:,0],T[:,1,:],S[:,1],T[:,2,:],S[:,2]);metric('S34','hmm','MAP factor score',joint.max())
for t in range(3):case('S34','hmm',['charts',t,'values'],joint.sum(axis=tuple(i for i in range(3)if i!=t))/joint.sum())
case('S31','state',['charts',0,'values'],[0,0,1,0,0])
metric('S42','motion','Position variance (m²)',.25+4*.2**2)
case('S42','omni',['tables',0,'rows'],[[i,-.3*np.sin(2*np.pi*i/3)+.1*np.cos(2*np.pi*i/3),.3*np.cos(2*np.pi*i/3)+.1*np.sin(2*np.pi*i/3),(-.3*np.sin(2*np.pi*i/3)+.1*np.cos(2*np.pi*i/3))/.2]for i in range(3)])
case('S44','least-squares',['charts',0,'values'],np.array([[1,0],[-1,1],[0,1]])@np.linalg.lstsq([[1,0],[-1,1],[0,1]],[3,5,7],rcond=None)[0]-[3,5,7])
# Exact notebook warehouse Q_value implemented with array shifts.
m=json.loads((DATA/'logistics.json').read_text());base=np.array(m['base']);prox=np.array(m['proximity']);V=np.zeros((50,100))
for _ in range(120):
    qs=[]
    for di,dj in [(0,-1),(0,1),(-1,0),(1,0)]:
        ii,jj=np.indices(V.shape);r=np.clip(ii+di,0,49);c=np.clip(jj+dj,0,99)
        q=100*((r==35)&(c==50))-50*(prox!=0)-50*(prox[r,c]!=0)+.975*V[r,c];q[base!=0]=0;q[35,50]=0;qs.append(q)
    V=np.max(qs,axis=0)
case('S45','value-map',['charts',0,'values'],V)
metric('S52','wheels','Left wheel (rad/s)',1.25);metric('S52','wheels','Right wheel (rad/s)',2.75)
metric('S53','projection','Image height (pixels)',464)
case('S54','derivative',['tables',0,'rows'],[[i,x,y]for i,(x,y)in enumerate(zip([3,3,3,5,5,5,5,2,2,2],np.correlate([0,3,3,3,5,5,5,5,2,2,2,0],[-1,0,1],'valid')))])
from PIL import Image,ImageOps
im=np.asarray(ImageOps.grayscale(Image.open(next(ROOT.rglob('LL_color_1201754063.387872.jpeg')))),dtype=float);p=np.pad(im,1);u=p[1:-1,2:]-p[1:-1,:-2];v=p[2:,1:-1]-p[:-2,1:-1]
metric('S54','edges','Pixels above threshold',np.count_nonzero(np.hypot(u,v)>50))
metric('S56','interpolation','Interpolated value',1.5)
# Use GTSAM's actual pose operations and the notebook's two graph definitions.
p=gtsam.Pose2(1,2,math.radians(20)).transformFrom([4,3]);case('S61','transform',['charts',0,'series',2,'points',1],p)
nb=json.loads((ROOT/'S64_driving_perception.ipynb').read_text());ns={'np':np,'gtsam':gtsam,'show':lambda *a,**k:None}
with contextlib.redirect_stdout(io.StringIO()):
    for i in [27,29,32,38,39,41]:exec(''.join(nb['cells'][i]['source']),ns)
poses=[[i,ns['result'].atPose2(i).x(),ns['result'].atPose2(i).y(),ns['result'].atPose2(i).theta()]for i in range(1,6)]
case('S64','pose-slam',['tables',0,'rows'],poses,tol=1e-5)
metric('S64','pose-slam','Initial graph error',ns['graph'].error(ns['initial_estimate']))
result=gtsam.LevenbergMarquardtOptimizer(ns['slam_graph'],ns['slam_initial']).optimize()
case('S64','landmarks',['tables',0,'rows'],[[i,*result.atPoint2(ns['l'][i])]for i in [1,2]],tol=1e-5)
for mode,angle in [('literal',math.degrees(20)),('intended',math.radians(20))]:
    metric('S71','pose3','Yaw passed to Rot3 (rad)',angle,{'mode':mode})
metric('S72','pitch-speed','Steady speed (m/s)',15*math.sqrt(math.tan(math.radians(10))))
R=gtsam.Rot3.Pitch(math.radians(10));p=np.zeros(3);z=[0.]
for _ in range(10):p+=R.rotate([6,0,0]);R=R.compose(gtsam.Rot3.Expmap([0,0,math.radians(10)]));z.append(float(p[2]))
case('S72','kinematics',['charts',1,'series',0,'points'],[[i,v]for i,v in enumerate(z)])
metric('S73','stereo','Front disparity (pixels)',300*.1/9.9)
metric('S74','imu','Bias-only lateral drift ½bt² (m)',.5*.1*3.5**2)
# Exact normalized displaced Gaussian kernel on the seed-7 map.
d=json.loads((DATA/'S75.json').read_text());a=np.zeros((100,300))
for x,y,v in d['obstacles']:a[y,x]=v
def cost(q):
    uv=10*np.asarray(q);j0,i0=np.round(uv).astype(int);ii,jj=np.meshgrid(np.arange(i0-10,i0+11),np.arange(j0-10,j0+11),indexing='ij');k=np.exp(-((ii-uv[1])**2+(jj-uv[0])**2)/50);k/=k.sum();return np.sum(k*a[ii,jj])
metric('S75','cost','Smoothed obstacle cost',cost([7.5,5.3]))
points=np.column_stack([np.linspace(2,28,100),np.full(100,5)]);objective=.5*sum(cost(q)**2 for q in points)+.005*np.sum(np.diff(points,axis=0)**2)
metric('S75','path','Initial objective',objective)
case('S75','control',['charts',0,'values'],[9.81/4]*4)
case('S76','initial-volume',['charts',2,'values'],[np.exp(-.064),np.exp(-.064),1])
metric('S76','voxel','Interpolated output',3.8)
Path('reference.json').write_text(json.dumps(cases,allow_nan=False))
print(f'Wrote {len(cases)} independent reference cases, including full grids and GTSAM optimized poses.')
