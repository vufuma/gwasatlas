#!/usr/bin/python

##### getGeneheat.py #####
# return json for heatmap of significant gene overlap
# 2 Mar 2017
########################

import sys
import os
import ConfigParser
import MySQLdb
import numpy as np
import json
from scipy.cluster.hierarchy import linkage, leaves_list

if len(sys.argv)<6:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getGeneheat.py <host> <user> <passwd> <database> <ids>")

##### Return index of a1 which exists in a2 #####
def ArrayIn(a1, a2):
	# results = [i for i, x in enumerate(a1) if x in a2]
	results = np.where(np.in1d(a1, a2))[0]
	return results

## Get arguments
host = sys.argv[1]
user = sys.argv[2]
passwd = sys.argv[3]
db = sys.argv[4]
ids = sys.argv[5]
ids = ids.split(":")
ids = [int(s) for s in ids]

ids.sort()

## config
cfg = ConfigParser.ConfigParser()
cfg.read(os.path.dirname(os.path.realpath(__file__))+'/app.config')

datadir = cfg.get('path', 'data')

## connect mysql
conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
c = conn.cursor()

## get sig genes
genes = []

with open(datadir+"/magma.sig.genes", 'r') as fin:
	fin.readline()
	for l in fin:
		l = l.strip().split("\t")
		if int(l[0]) not in ids:
			continue
		if len(l) < 2:
			genes.append([])
		else:
			g = l[1].split(":")
			if len(g) > 0:
				genes.append(g)
			else:
				genes.append([])

## n genes
ng = []
for i in range(0, len(ids)):
    ng.append([ids[i], len(genes[i])])

## create matrix for hierarchical clustering
go = []
mat = []
for i in range(0,len(ids)):
    row = []
    if len(genes[i]) == 0:
        row = [0]*len(ids)
        for j in range(0,len(ids)):
            go.append([ids[i], ids[j], -1])
    else:
        for j in range(0,len(ids)):
            if i==j:
                row.append(1)
                go.append([ids[i], ids[j], 1])
            elif len(genes[j])==0:
                row.append(0)
                go.append([ids[i], ids[j], -1])
            else:
                n = len(ArrayIn(np.array(genes[i]), np.array(genes[j])))
                go.append([ids[i], ids[j], float(n)/float(len(genes[j]))])
                row.append(float(n)/float(len(genes[j])))
    mat.append(row)

mat = np.array(mat)

## get trait and domain info
c.execute('SELECT id,Domain,Trait,Year from gwasDB');
rows = c.fetchall()
traits = []
for r in rows:
    if int(r[0]) in ids:
        traits.append([r[0], r[1], r[2], str(r[0])+": "+r[2]+" ("+str(r[3])+")"])

traits = np.array(traits)

## clustering order
clst = list(leaves_list(linkage(mat, "single")))
oclst = {}

## Domain order
domain = list(np.lexsort((traits[:,2], traits[:,1])))
odomain = {}

## Trait alphabetical order
trait = list(np.argsort(traits[:,2]))
otrait = {}

for i in range(0,len(ids)):
    oclst[str(int(ids[int(clst[i])]))] = i
    odomain[str(int(ids[domain[i]]))] = i
    otrait[str(int(ids[trait[i]]))] = i

## domain and trait name
domain = {}
trait = {}
for l in traits:
    domain[str(int(l[0]))]=l[1]
    trait[str(int(l[0]))]=l[3]

## return nested json
data = {"data":{"id":ids, "Domain":domain, "Trait":trait, "go":go, "ng":ng, "order":{"alph":otrait, "domain":odomain, "clst": oclst}}}
print json.dumps(data)
