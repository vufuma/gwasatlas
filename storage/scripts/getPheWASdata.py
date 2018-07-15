#!/usr/bin/python

##### getPheWASdata.py #####
# return json for PheWAS plot
# 5 Mar 2018
###########################

import sys
import os
import ConfigParser
import MySQLdb
import numpy as np
import json
import re
import tabix

##### check integer #####
def is_int(s):
	try:
		int(s)
		return True
	except ValueError:
		return False

##### define input type (SNP or Gene) ####
def CheckInputType(text):
	if re.match(r'^rs', text, re.IGNORECASE):
		return "SNP"
	elif ":" in text:
		chrom,pos = text.split(":")
		if is_int(chrom) and is_int(pos):
			return "SNP"
		else:
			"SNP_error"
	else:
		return "Gene"

##### get SNP data #####
def getSNP(text, ids, host, user, passwd, db, datadir):
	## connect mysql
	conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
	c = conn.cursor()

	chrom = 0;
	pos = 0;
	if re.match(r'^rs', text, re.IGNORECASE):
		ucsc = MySQLdb.connect(host="genome-mysql.soe.ucsc.edu", user="genome", db="hg19")
		dbSNP = ucsc.cursor()
		dbSNP.execute('SELECT chrom, chromEnd FROM snp146 WHERE name='+'"'+text+'"')
		rows = dbSNP.fetchall()
		chrom, pos = rows[0]
		chrom = int(chrom.replace('chr', ''))
		pos = int(pos)
	else:
		chrom, pos = [int(x) for x in text.split(":")]

	if len(ids)==0:
		c.execute('SELECT id FROM gwasDB')
		rows = c.fetchall()
		for r in rows:
			ids.append(int(r[0]))

	out = []
	for i in ids:
		if os.path.isfile(datadir+"/"+str(i)+"/all.txt.gz"):
			tb = tabix.open(datadir+"/"+str(i)+"/all.txt.gz")
			snp = tb.querys(str(chrom)+":"+str(pos)+"-"+str(pos))
			s = []
			for l in snp:
				s = [i, float(l[2])]
			if len(s)>0:
				c.execute("SELECT PMID,Year,Domain,Trait,N FROM gwasDB WHERE id="+str(i))
				rows = c.fetchall()
				out.append(s+list(rows[0]))

	return out

##### get Gene data #####
def getGene(text, ids, host, user, passwd, db, datadir, genesdir):
	text = text.upper()
	if not re.match(r'^ENSG', text):
		with open(genesdir, 'r') as ensg:
			ensg.readline()
			for l in ensg:
				l = l.strip().split()
				if l[1]==text or l[8]==text or l[9]==text:
					text = l[0]
					break;
		if not re.match(r'^ENSG', text):
			return "Gene_id_not_match"

	## connect mysql
	conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
	c = conn.cursor()

	if len(ids)==0:
		c.execute('SELECT id FROM gwasDB')
		rows = c.fetchall()
		for r in rows:
			ids.append(int(r[0]))

	out = []
	c.execute('SELECT * FROM magmaGenes WHERE ensg='+'"'+text+'"')
	rows = c.fetchall()
	for r in rows:
		if r[0] in ids:
			g = [r[0], float(r[2])]
			c.execute("SELECT PMID,Year,Domain,Trait,N FROM gwasDB WHERE id="+str(r[0]))
			rows = c.fetchall()
			out.append(g+list(rows[0]))

	return out

def main():
	if len(sys.argv)<7:
	    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getPheWASdata.py <host> <user> <passwd> <database> <text> <ids> <datadir>")

	## Get arguments
	host = sys.argv[1]
	user = sys.argv[2]
	passwd = sys.argv[3]
	db = sys.argv[4]
	text = sys.argv[5]
	ids = sys.argv[6]
	if ids=="NA":
		ids = []
	else:
		ids = [int(s) for s in ids.split(":")]
		ids.sort()
	datadir = sys.argv[7]

	## config
	cfg = ConfigParser.ConfigParser()
	cfg.read(os.path.dirname(os.path.realpath(__file__))+'/app.config')
 	genedir = cfg.get('path', 'ENSG')


	## check type of text
	input_type = CheckInputType(text)

	error=""
	out = []
	order = []
	if input_type=="SNP_error":
		error = "SNP_input_error"
	elif input_type=="SNP":
		out = getSNP(text, ids, host, user, passwd, db, datadir)
		if len(out)==0:
			error = "SNP_not_found"
	else:
		out = getGene(text, ids, host, user, passwd, db, datadir, genedir)
		if len(out)==0:
			error = "Gene_not_found"
		elif out=="Gene_id_not_match":
			error = out
			out = []

	if len(out)>0:
		t = np.array(out, dtype=object)
		order.append(list(t[np.argsort(t[:,5]),0])) ## alph
		order.append(list(t[np.argsort(t[:,1].astype(float)),0])) ## p
		order.append(list(t[np.argsort(t[:,6].astype(int)),0][::-1])) ## n
		order.append(list(t[np.lexsort((t[:,5], t[:,4])),0])) ## domain_alph
		order.append(list(t[np.lexsort((t[:,1].astype(float), t[:,4])),0])) ## domain_p

	print json.dumps({"data":out, "order":order, "error":error})

if __name__=="__main__": main()
