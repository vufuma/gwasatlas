#!/usr/bin/python

##### getGCheat.py #####
# return json for heatmap of genetic correlatioin
# arguments need mysql connection info and ids
# 2 Mar 2017
########################

import sys
import MySQLdb
import numpy as np
import json
from scipy.cluster.hierarchy import linkage, leaves_list
import time

if len(sys.argv)<6:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getGCheat.py <host> <user> <passwd> <database> <ids>")

#start = time.time()

## Get arguments
host = sys.argv[1]
user = sys.argv[2]
passwd = sys.argv[3]
db = sys.argv[4]
ids = sys.argv[5]
ids = ids.split(":")
ids = [int(s) for s in ids]

## connect mysql
conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
c = conn.cursor()

## genetic correlation filters on given ids
c.execute('SELECT * from GenCor')
rows = c.fetchall()
gc = []
for r in rows:
    if int(r[0]) in ids and int(r[1]) in ids:
        r = np.array(r)
        r[0] = int(r[0])
        r[1] = int(r[1])
        gc.append(r)
gc = np.array(gc)

## ids of GWAS which have at least one genetic correlation
inids = np.unique(list(gc[:,0].astype(int))+list(gc[:,1].astype(int)))
if len(inids) == 0:
	sys.exit()
inids.sort()

## get trait and domain info
c.execute('SELECT id,Domain,Trait,Year from gwasDB');
rows = c.fetchall()
traits = []
for r in rows:
	if int(r[0]) in inids:
		traits.append([r[0], r[1], r[2], str(r[0])+": "+r[2]+" ("+str(r[3])+")"])

traits = np.array(traits)

## create matrix for hierarchical clustering
n = len(inids)*(len(inids)-1)/2 # number of test to correct for
rg = []
mat = []
for i in inids:
    row = []
    for j in inids:
        if i == j:
            rg.append([i,j,1,0,0,1])
            row += [1]
            continue
        elif i<j:
            tmp = gc[gc[:,0].astype(int)==j]
            if i not in tmp[:,1].astype(int):
                row += [0]
                continue
            tmp = tmp[tmp[:,1].astype(int)==i][0]
        else:
            tmp = gc[gc[:,0].astype(int)==i]
            if j not in tmp[:,1].astype(int):
                row += [0]
                continue
            tmp = tmp[tmp[:,1].astype(int)==j][0]

        if len(tmp)==0:
            row += [0]
            continue
        elif abs(float(tmp[2]))>=1.25:
            row += [1.25]
            continue
        else:
            row += [float(tmp[2])]
            rg.append([i,j,float(tmp[2]), float(tmp[5]), float(tmp[5])*n, float(tmp[3])])
    mat.append(row)

mat = np.array(mat)

## clustering order
clst = list(leaves_list(linkage(mat, "single")))
oclst = {}

## Domain order
domain = list(np.lexsort((traits[:,2], traits[:,1])))
odomain = {}

## Trait alphabetical order
trait = list(np.argsort(traits[:,2]))
otrait = {}

for i in range(0,len(inids)):
    oclst[str(int(inids[int(clst[i])]))] = i
    odomain[str(int(inids[domain[i]]))] = i
    otrait[str(int(inids[trait[i]]))] = i

## domain and trait name
domain = {}
trait = {}
for l in traits:
    domain[str(int(l[0]))]=l[1]
    trait[str(int(l[0]))]=l[3]

## return nested json
inids = list(inids)
data = {"data":{"id":inids, "Domain":domain, "Trait":trait, "rg":rg, "order":{"alph":otrait, "domain":odomain, "clst": oclst}}}
print json.dumps(data)
