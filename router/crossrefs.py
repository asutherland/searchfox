import json
import sys
import mmap
import os.path
from logger import log

repo_data = {}

def load(config):
    global repo_data

    for repo_name in config['trees']:
        log('Loading %s', repo_name)
        index_path = config['trees'][repo_name]['index_path']

        f = open(os.path.join(index_path, 'crossref'))
        mm = mmap.mmap(f.fileno(), 0, prot=mmap.PROT_READ)
        f.close()

        key = None
        pos = 0

        crossrefs = {}
        while True:
            line = mm.readline()
            if line == '':
                break

            if key == None:
                pos += len(line)
                key = line.strip()
            else:
                value = line.strip()
                s = "{},{}".format(pos, pos + len(value))
                crossrefs[key] = s
                key = None
                pos += len(line)

        repo_data[repo_name] = (mm, crossrefs)

def lookup_merging(tree_name, symbols):
    '''
    Split `symbols` on commas, and lookup all of the requested symbols, merging
    their results.
    '''
    symbols = symbols.split(',')

    (mm, crossrefs) = repo_data[tree_name]

    results = {}
    for symbol in symbols:
        s = crossrefs.get(symbol)
        if s == None:
            return {}

        (startPos, endPos) = s.split(',')
        (startPos, endPos) = (int(startPos), int(endPos))

        data = mm[startPos:endPos]
        result = json.loads(data)

        for (k, v) in result.items():
            results[k] = results.get(k, []) + result[k]

    return results

def lookup_single_symbol(tree_name, symbol):
    '''
    Look up a single symbol, returning its results dict if it existed or None
    if it didn't exist.
    '''
    (mm, crossrefs) = repo_data[tree_name]

    s = crossrefs.get(symbol)
    if s == None:
        return None

    (startPos, endPos) = s.split(',')
    (startPos, endPos) = (int(startPos), int(endPos))

    data = mm[startPos:endPos]
    result = json.loads(data)

    return result
