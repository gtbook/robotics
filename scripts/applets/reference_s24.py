import ast,json
from pathlib import Path
import gtsam
import numpy as np
from gtbook.discrete import Variables
root=Path(__file__).resolve().parents[2]
n=json.loads((root/'S24_sorter_perception.ipynb').read_text())
ns={'gtsam':gtsam,'np':np,'VARIABLES':Variables()}
for i in [4,9,16,28,34,40,68]:
    tree=ast.parse(''.join(n['cells'][i]['source']))
    tree.body=[s for s in tree.body if not isinstance(s,ast.Expr)]
    exec(compile(tree,'S24','exec'),ns)
refs=[]
for prior in [[200,300,250,200,50],[1,1,1,1,1],[1,2,30,4,50]]:
    ns['category_prior']=gtsam.DiscreteDistribution(ns['Category'],'/'.join(map(str,prior)))
    for c in [0,1]:
        for d in ns['detector_outcomes']:
            for w in [0,5,15,20,50,100,150,270,299,300,500]:
                refs.append({'w':w,'c':c,'d':d,'prior':prior,'p':list(ns['posterior'](c,d,w))})
Path('s24_reference.json').write_text(json.dumps(refs))
print(f'Generated {len(refs)} reference posteriors using S24 and GTSAM.')
