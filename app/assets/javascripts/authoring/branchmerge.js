(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.branchmerge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Import into browser. Then, to use:
var diff = branchmerge.threeWayMerge(master_updated, master, branch)
console.log(JSON.stringify(diff, null, 3));
var merged = branchmerge.patch(diff.diff, master_updated);

Note that if you uncomment some code,
these functions can also take default arguments that can be
used for quick testing, like so:
	var diff = branchmerge.threeWayMerge();
	JSON.stringify(diff, null, 3)
	branchmerge.patch(diff.diff)
*/


var xdiff = require('xdiff');

// DEFAULT VARIABLES FOR TESTING PURPOSES
//var test_master = require('./master.json');
//var test_master_updated = require('./master_updated.json');
//var test_branch = require('./branch.json');
// CHANGES IN THE TEST master_updated.json
// changed --- CC6 has changed title, duration, and start time
// changed --- old CC7 has an update, whereas in branch it's deleted --- should cause a conflict

// to do a two way merge
// var d = xdiff.diff(master, branch);
// console.log(d);

module.exports = {

	/**
	 * Performs a three way merge and returns a data structure with a complete
	 * diff as well as with a set of conflicted items.
	 */
	threeWayMerge: function(master_updated, master, branch) {
		//master_updated = typeof master_updated !== 'undefined' ?  master_updated : test_master_updated;
		//master = typeof master !== 'undefined' ?  master : test_master;
		//branch = typeof branch !== 'undefined' ?  branch : test_branch;

		var d3 = xdiff.diff3(master_updated, master, branch);
		var conflicts = xdiff.conflicts(); 
		var results = {
			'diff': d3,
			'conflicts': conflicts
		}
		return results;
	},

	/**
	 * Patches the current upstream using the diff returned
	 */
	patch: function(d3, master_updated) {
		//master_updated = typeof master_updated !== 'undefined' ?  master_updated : test_master_updated;

		return xdiff.patch(master_updated, d3);
	}
}
},{"xdiff":2}],2:[function(require,module,exports){

// msb added conflicts
var _conflicts = new Array();

// msb also changed the required __id__ element to just id,
// which is what the flash orgs JSON uses

//inject a matchRef, isRef, and a getRef function?
//could use the same pattern with objects.

//I don't really want to force id
//should be able to use anything, aslong as you 

function shallowEqual (a, b) {
    if(isObject(a) 
      && isObject(b) 
      && (a.id == b.id || a === b))
      return true
    if(a && !b) return false
    return a == b
  }


function equal (a, b) {
 if((a && !b) || (!a && b)) return false
  if(Array.isArray(a))
    if(a.length != b.length) return false
  if(isObject(a) && isObject(b)) {
    if (a.id == b.id || a === b)
      return true
    for(var i in a)
      if(!equal(a[i], b[i])) return false
    return true
  }
  if(a == null && b == null) return true
  return a === b
}

var adiff = require('adiff')({ equal: equal })

function getPath (obj, path) {
  if(!Array.isArray(path))
    return obj[path]
  for(var i in path) {
    obj = obj[path[i]]
  }
  return obj
}

function findRefs(obj, refs) {
  refs = refs || {}
  //add leaves before branches.
  //this will FAIL if there are circular references.

  if(!obj)
    return refs

  for(var k in obj) {
    if(obj[k] && 'object' == typeof obj[k])
      findRefs(obj[k], refs)
  }
  
  if(obj.id && !refs[obj.id])
    refs[obj.id] = obj
  return refs
}

function toRef(v) {
  //TODO escape strings that happen to start with #*=
  var r
  if(r = isRef(v)) return '#*='+r
  return v
}

function isObject (o) {
  return o && 'object' == typeof o
}

function isRef(x) {
  return x ? x.id : undefined
}

function sameRef(a, b) {
  return a && b && isRef(a) == isRef(b)
}

//traverse o, and replace every object with id with a pointer.
//make diffing references easy.


exports.deref = function (o, mutate) {
  var refs = findRefs(o)
  var derefed = {}
  function deref (o, K) {
    if(isRef(o) && K != isRef(o))
      return toRef(o)
 
    var p = mutate ? o : Array.isArray(o) ? [] : {} //will copy the tree!
    for (var k in o) {
      var r 
      if(isRef(o[k])) p[k] = toRef(o[k])
      else if(isObject(o[k])) p[k] = deref(o[k])
      else p[k] = o[k]
    }
    return p
  }
  
  refs.root = o
  for (var k in refs)
    refs[k] = deref(refs[k], k)
  return refs
}

exports.reref = function (refs, mutate) {

  function fromRef(v) {
    //TODO escape strings that happen to start with #*=
    if('string' == typeof v && /^#\*=/.test(v)) return refs[v.substring(3)]
      return v
  }

  function reref (o) { //will MUTATE the tree
    if(!isObject(o))
      return fromRef(o)

    var p = mutate ? o : Array.isArray(o) ? [] : {} //will copy the tree!
    for (var k in o) {
      if(isObject(o[k]))
         p[k] = reref(o[k])
      else
        p[k] = fromRef(o[k])
    }
    return p
  }
  //if the root is a ref. need a special case
  for (var k in refs) {
    refs[k] = reref(refs[k])
  }
  return refs.root
}

exports.diff = function (a, b) {

  var aRefs = exports.deref(a)
  var bRefs = exports.deref(b)

  var seen = []

  for (var k in aRefs)
    seen.push(k)

 function isSeen(o) {
    if(isRef(o)) return ~seen.indexOf(o.id)
    return true 
  }
  function addSeen(o) {
    if(!isRef(o)) return o
    if(!isSeen(o)) seen.push(o.id)
    return o
  }

  // how to handle references?
  // this is necessary to handle objects in arrays nicely
  // otherwise mergeing an edit and a move is ambigous.  // will need to perform a topoligical sort of the refs and diff them first, in that order.
  // first, apply changes to all refs,
  // then traverse over the root object,

  function _diff (a, b, path) {
    path = path || []

    if(Array.isArray(a) && Array.isArray(b)) {
      var d = adiff.diff(a, b)
      if(d.length) delta.push(['splice', path, d])
      return delta
    }

// references to objects with ids are
// changed into strings of thier id.
// the string is prepended with '#*='
// to distinguish it from other strings
// if you use that string in your model,
// it will break.
// TODO escape strings so this is safe

   //ah, treat root like it's a id

   var isRoot = path.length === 1 && path[0] === 'root'

    for (var k in b) {
      // if both are nonRef objects, or are the same object, branch into them.
    
    if(isObject(a[k]) && isObject(b[k]) && sameRef(b[k], a[k])) 
      _diff(a[k], b[k], path.concat(k))
    else if(b[k] !== a[k])
      delta.push(['set', path.concat(k), cpy(b[k])])
    }
    
    for (var k in a)
      if('undefined' == typeof b[k])
        delta.push(['del', path.concat(k)])
  }

  var delta = []
  _diff(aRefs, bRefs, [])

  if(delta.length)
    return cpy(delta)
}

exports.patch = function (a, patch) {

  if(!patch) throw new Error('expected patch')

  var refs = exports.deref(a, true)
  refs.root = a

  var methods = {
    set: function (key, value) {
      this[key] = cpy(value) // incase this was a reference, remove it.
    },
    del: function (key) {
      delete this[key]
    },
    splice: function (changes) {
      adiff.patch(this, changes, true)
    }
  }

  function pathTo(a, p) {
    for (var i in p) a = a[p[i]]
    return a
  }

  patch.forEach(function (args) {
    args = args.slice()
    var method = args.shift()
    var path = args.shift().slice()
    var key
    if(method != 'splice') {
      key = path.pop()
      args.unshift(key)
    }
    var obj = pathTo(refs, path)
    methods[method].apply(obj, args)
  })

  return exports.reref(refs, true)
}

function cpy(o) {
  if(!o) return o
  return JSON.parse(JSON.stringify(o))
}

exports.diff3 = function (a, o, b) {
  // msb added conflicts
  _conflicts = new Array();

  if(arguments.length == 1)
    o = a[1], b = a[2], a = a[0]
  var _a = exports.diff(o, a) || [] // if there where no changes, still merge
    , _b = exports.diff(o, b) || []

  function cmp (a, b) {
    //check if a[1] > b[1]
    if(!b)
      return 1

    var p = a[1], q = b[1]
    var i = 0
    while (p[i] === q[i] && p[i] != null)
      i++

    if(p[i] === q[i]) return 0
    return p[i] < q[i] ? -1 : 1
  }

  function isPrefix(a, b) {
    if(!b) return 1
    var p = a[1], q = b[1]
    var i = 0
    while (p[i] === q[i] && i < p.length && i < q.length)
      i++
    if(i == p.length || i == q.length) return 0
    return p[i] < q[i] ? -1 : 1 
  }

  //merge two lists, which must be sorted.

  function cmpSp (a, b) {
    if(a[0] == b[0])
      return 0
    function max(k) {
      return k[0] + (k[1] >= 1 ? k[1] - 1 : 0)
    }
    if(max(a) < b[0] || max(b) < a[0])
      return a[0] - b[0]
    return 0
  }

  function resolveAry(a, b) {
    return a
  }

  function resolve(a, b) {
    if(a[1].length == b[1].length) { 
      if(a[0] == b[0]) {
        if(a[0] == 'splice') {
          var R = merge(a[2], b[2], cmpSp, resolveAry)
          return ['splice', a[1].slice(), R]
        } else if(equal(a[2], b[2])) //same change both sides.
          return a
      }
    }

    _conflicts.push( {
      'master': a,
      'branch': b
    });

    return a
  }

  function merge(a, b, cmp, resolve) {
    var i = a.length - 1, j = b.length - 1, r = []
    while(~i && ~j) {
      var c = cmp(a[i], b[j])
      if(c > 0) r.push(a[i--])
      if(c < 0) r.push(b[j--])
      if(!c) {
        var R = resolve(a[i], b[j])
          j--, i--
        r.push(R)
      }
    }
    //finish off the list if there are any left over
    while(~i) r.push(a[i--])
    while(~j) r.push(b[j--])
    return r
  }

  _a.sort(cmp)
  _b.sort(cmp)

  var m = merge(_a, _b, isPrefix, resolve)
  return m.length ? m : null
}

// msb added a list of conflicts
exports.conflicts = function (){
  return _conflicts;
}

},{"adiff":3}],3:[function(require,module,exports){
function head (a) {
  return a[0]
}

function last (a) {
  return a[a.length - 1]
}

function tail(a) {
  return a.slice(1)
}

function retreat (e) {
  return e.pop()
}

function hasLength (e) {
  return e.length
}

function any(ary, test) {
  for(var i=0;i<ary.length;i++)
    if(test(ary[i]))
      return true
  return false
}

function score (a) {
  return a.reduce(function (s, a) {
      return s + a.length + a[1] + 1
  }, 0)
}

function best (a, b) {
  return score(a) <= score(b) ? a : b
}


var _rules // set at the bottom  

// note, naive implementation. will break on circular objects.

function _equal(a, b) {
  if(a && !b) return false
  if(Array.isArray(a))
    if(a.length != b.length) return false
  if(a && 'object' == typeof a) {
    for(var i in a)
      if(!_equal(a[i], b[i])) return false
    for(var i in b)
      if(!_equal(a[i], b[i])) return false
    return true
  }
  return a == b
}

function getArgs(args) {
  return args.length == 1 ? args[0] : [].slice.call(args)
}

// return the index of the element not like the others, or -1
function oddElement(ary, cmp) {
  var c
  function guess(a) {
    var odd = -1
    c = 0
    for (var i = a; i < ary.length; i ++) {
      if(!cmp(ary[a], ary[i])) {
        odd = i, c++
      }
    }
    return c > 1 ? -1 : odd
  }
  //assume that it is the first element.
  var g = guess(0)
  if(-1 != g) return g
  //0 was the odd one, then all the other elements are equal
  //else there more than one different element
  guess(1)
  return c == 0 ? 0 : -1
}
var exports = module.exports = function (deps, exports) {
  var equal = (deps && deps.equal) || _equal
  exports = exports || {} 
  exports.lcs = 
  function lcs() {
    var cache = {}
    var args = getArgs(arguments)
    var a = args[0], b = args[1]

    function key (a,b){
      return a.length + ':' + b.length
    }

    //find length that matches at the head

    if(args.length > 2) {
      //if called with multiple sequences
      //recurse, since lcs(a, b, c, d) == lcs(lcs(a,b), lcs(c,d))
      args.push(lcs(args.shift(), args.shift()))
      return lcs(args)
    }
    
    //this would be improved by truncating input first
    //and not returning an lcs as an intermediate step.
    //untill that is a performance problem.

    var start = 0, end = 0
    for(var i = 0; i < a.length && i < b.length 
      && equal(a[i], b[i])
      ; i ++
    )
      start = i + 1

    if(a.length === start)
      return a.slice()

    for(var i = 0;  i < a.length - start && i < b.length - start
      && equal(a[a.length - 1 - i], b[b.length - 1 - i])
      ; i ++
    )
      end = i

    function recurse (a, b) {
      if(!a.length || !b.length) return []
      //avoid exponential time by caching the results
      if(cache[key(a, b)]) return cache[key(a, b)]

      if(equal(a[0], b[0]))
        return [head(a)].concat(recurse(tail(a), tail(b)))
      else { 
        var _a = recurse(tail(a), b)
        var _b = recurse(a, tail(b))
        return cache[key(a,b)] = _a.length > _b.length ? _a : _b  
      }
    }
    
    var middleA = a.slice(start, a.length - end)
    var middleB = b.slice(start, b.length - end)

    return (
      a.slice(0, start).concat(
        recurse(middleA, middleB)
      ).concat(a.slice(a.length - end))
    )
  }

  // given n sequences, calc the lcs, and then chunk strings into stable and unstable sections.
  // unstable chunks are passed to build
  exports.chunk =
  function (q, build) {
    var q = q.map(function (e) { return e.slice() })
    var lcs = exports.lcs.apply(null, q)
    var all = [lcs].concat(q)

    function matchLcs (e) {
      if(e.length && !lcs.length || !e.length && lcs.length)
        return false //incase the last item is null
      return equal(last(e), last(lcs)) || ((e.length + lcs.length) === 0)
    }

    while(any(q, hasLength)) {
      //if each element is at the lcs then this chunk is stable.
      while(q.every(matchLcs) && q.every(hasLength))
        all.forEach(retreat)
      //collect the changes in each array upto the next match with the lcs
      var c = false
      var unstable = q.map(function (e) {
        var change = []
        while(!matchLcs(e)) {
          change.unshift(retreat(e))
          c = true
        }
        return change
      })
      if(c) build(q[0].length, unstable)
    }
  }

  //calculate a diff this is only updates
  exports.optimisticDiff =
  function (a, b) {
    var M = Math.max(a.length, b.length)
    var m = Math.min(a.length, b.length)
    var patch = []
    for(var i = 0; i < M; i++)
      if(a[i] !== b[i]) {
        var cur = [i,0], deletes = 0
        while(a[i] !== b[i] && i < m) {
          cur[1] = ++deletes
          cur.push(b[i++])
        }
        //the rest are deletes or inserts
        if(i >= m) {
          //the rest are deletes
          if(a.length > b.length)
            cur[1] += a.length - b.length
          //the rest are inserts
          else if(a.length < b.length)
            cur = cur.concat(b.slice(a.length))
        }
        patch.push(cur)
      }

    return patch
  }

  exports.diff =
  function (a, b) {
    var optimistic = exports.optimisticDiff(a, b)
    var changes = []
    exports.chunk([a, b], function (index, unstable) {
      var del = unstable.shift().length
      var insert = unstable.shift()
      changes.push([index, del].concat(insert))
    })
    return best(optimistic, changes)
  }

  exports.patch = function (a, changes, mutate) {
    if(mutate !== true) a = a.slice(a)//copy a
    changes.forEach(function (change) {
      [].splice.apply(a, change)
    })
    return a
  }

  // http://en.wikipedia.org/wiki/Concestor
  // me, concestor, you...
  exports.merge = function () {
    var args = getArgs(arguments)
    var patch = exports.diff3(args)
    return exports.patch(args[0], patch)
  }

  exports.diff3 = function () {
    var args = getArgs(arguments)
    var r = []
    exports.chunk(args, function (index, unstable) {
      var mine = unstable[0]
      var insert = resolve(unstable)
      if(equal(mine, insert)) return 
      r.push([index, mine.length].concat(insert)) 
    })
    return r
  }
  exports.oddOneOut =
    function oddOneOut (changes) {
      changes = changes.slice()
      //put the concestor first
      changes.unshift(changes.splice(1,1)[0])
      var i = oddElement(changes, equal)
      if(i == 0) // concestor was different, 'false conflict'
        return changes[1]
      if (~i)
        return changes[i] 
    }
  exports.insertMergeOverDelete = 
    //i've implemented this as a seperate rule,
    //because I had second thoughts about this.
    function insertMergeOverDelete (changes) {
      changes = changes.slice()
      changes.splice(1,1)// remove concestor
      
      //if there is only one non empty change thats okay.
      //else full confilct
      for (var i = 0, nonempty; i < changes.length; i++)
        if(changes[i].length) 
          if(!nonempty) nonempty = changes[i]
          else return // full conflict
      return nonempty
    }

  var rules = (deps && deps.rules) || [exports.oddOneOut, exports.insertMergeOverDelete]

  function resolve (changes) {
    var l = rules.length
    for (var i in rules) { // first
      
      var c = rules[i] && rules[i](changes)
      if(c) return c
    }
    changes.splice(1,1) // remove concestor
    //returning the conflicts as an object is a really bad idea,
    // because == will not detect they are the same. and conflicts build.
    // better to use
    // '<<<<<<<<<<<<<'
    // of course, i wrote this before i started on snob, so i didn't know that then.
    /*var conflict = ['>>>>>>>>>>>>>>>>']
    while(changes.length)
      conflict = conflict.concat(changes.shift()).concat('============')
    conflict.pop()
    conflict.push          ('<<<<<<<<<<<<<<<')
    changes.unshift       ('>>>>>>>>>>>>>>>')
    return conflict*/
    //nah, better is just to use an equal can handle objects
    return {'?': changes}
  }
  return exports
}
exports(null, exports)

},{}]},{},[1])(1)
});