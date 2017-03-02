
//inject a matchRef, isRef, and a getRef function?
//could use the same pattern with objects.

// TODO:
// at end, only update the essentialJSON fields in the actual
// object in the db, NOT replace it since we only conducted the
// diff over those essential fields

// TODO:
// add tests for the splice case of interactions and not just the set case

SPLICE_EVENTS_CONTEXT = JSON.stringify(["root", "events", "root"]);
SPLICE_MEMBERS_CONTEXT = JSON.stringify(["root", "members", "root"]);
SPLICE_INTERACTIONS_CONTEXT = JSON.stringify(["root", "interactions", "root"]);
SET_EVENTS_CONTEXT = JSON.stringify(["root", "events"]);
SET_MEMBERS_CONTEXT = JSON.stringify(["root", "members"]);
SET_INTERACTIONS_CONTEXT = JSON.stringify(["root", "interactions"]);

EVENTS_OVERLAP_CONFLICT = "events overlap conflict";
INTERACTIONS_DIFF_TYPE_SAME_EVENTS = "interactions of different type on same event pair"
INTERACTION_MISSING_EVENT_CONFLICT = "interaction missing event conflict";
HANDOFF_MISORDERED_EVENTS_CONFLICT = "handoff misordered events conflict";
COLLABORATION_SAME_Y_CONFLICT = "collaboration same y conflict";
COLLABORATION_NO_OVERLAP_CONFLICT = "collaboration no overlap conflict";

var xdiff = {};

function shallowEqual(a, b) {
    if(isObject(a) 
      && isObject(b) 
      && (a.id == b.id || a === b))
      return true
    if(a && !b) return false
    return a == b
  }


function equal(a, b) {
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

function getPath(obj, path) {
  if(!Array.isArray(path))
    return obj[path]
  for(var i in path) {
    obj = obj[path[i]]
  }
  return obj
}

function findRefs(obj, refs) {
  refs = refs || {} // initialize in the first call
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

// traverse o, and replace (every object with id) with a pointer.
// make diffing references easy.

// tries to clone each object (only the objects)?
// objects are dicts and arrays
xdiff.deref = function (o, mutate) {
  var refs = findRefs(o)
  var derefed = {}
  function deref (o, K) {
    if(isRef(o) && K != isRef(o))
      return toRef(o)
 
    var p = mutate ? o : Array.isArray(o) ? [] : {} //will copy the tree!
    for (var k in o) {
      var r 
      if(isRef(o[k])) p[k] = toRef(o[k])
      else if(isObject(o[k])) p[k] = xdiff.deref(o[k])
      else p[k] = o[k]
    }
    return p
  }
  
  refs.root = o
  for (var k in refs) {
    var derefed = deref(refs[k], k)
    refs[k] = derefed
  }

  return refs
}

xdiff.reref = function (refs, mutate) {

  function fromRef(v) {
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
  return refs
}

xdiff.diff = function (a, b) {

  var aRefs = xdiff.deref(a)
  var bRefs = xdiff.deref(b)
  
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

xdiff.patch = function (a, patch) {
  if(!patch) throw new Error('expected patch')

  var refs = xdiff.deref(a, true)
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

  // [
  //   ["set",["#2"],{"__id__":"#2"}],
  //   ["splice",["root"],[
  //                        [1,1,{"#2":{"__id__":"#2"},"root":{"d":7,"e":"#*=#2"}}]
  //                      ]
  //   ]
  //  ]
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

  var rerefed = xdiff.reref(refs, true);
  var normalized = xdiff.normalized(rerefed);
  return normalized;
}

xdiff.normalized = function(o) {
  if (typeof o !== 'object') {
    return o;
  }
  if (o == null) {
    return null;
  }
  if (o.hasOwnProperty("root")) {
    return xdiff.normalized(o["root"]);
  } else {
    var p = Array.isArray(o) ? [] : {};
    for (var k in o) {
      p[k] = xdiff.normalized(o[k]);
    }
    return p;
  }
};

function cpy(o) {
  if(!o) return o
  return JSON.parse(JSON.stringify(o))
}

xdiff._conflicts = new Array();

xdiff.conflicts = function(){
  return xdiff._conflicts;
}

xdiff._teamARefs = {};
xdiff.teamARefs = function() {
  return xdiff._teamARefs;
}

xdiff._teamBRefs = {};
xdiff.teamBRefs = function() {
  return xdiff._teamBRefs;
}

function startAndEndTimesEvents(ev) {
  var startTime = (parseInt(ev.startHr)*60) + parseInt(ev.startMin);
  return {
    "start": startTime,
    "end": startTime + parseInt(ev.duration),
  }
}

xdiff.diff3 = function (a, o, b) {
  xdiff._conflicts = new Array();

  if(arguments.length == 1)
    o = a[1], b = a[2], a = a[0]
  var _a = xdiff.diff(o, a) || [] // if there where no changes, still merge
    , _b = xdiff.diff(o, b) || []

  xdiff._teamARefs = xdiff.deref(a);
  xdiff._teamBRefs = xdiff.deref(b);

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
  
  function overlapEvents(evA, evB) {
    if (evA.y != evB.y) {
      return false; // can never have overlap if on different levels on the canvas
    }
    var timesA = startAndEndTimesEvents(evA);
    var timesB = startAndEndTimesEvents(evB);

    var times = [[timesA.start, "start"], [timesA.end, "end"], [timesB.start, "start"], [timesB.end, "end"]];
    times.sort(function(a, b) {
      return a[0]-b[0]; // sort by numerical value
    });

    var withinEvent = false;
    for (var i in times) {
      switch(times[i][1]) {
        case "start":
          if (withinEvent) {
            return true; // overlap found
          } else {
            withinEvent = true;
          }
          break;
        case "end":
          withinEvent = false;
          break;
      }
    }
    return false;
  }

  function checkEventsConflict(refA, refB) {
    // eg. refA: "#*=5"
    // eg. refB: "#*=7"
    var resolvedA = xdiff.teamARefs()[refA.substring(3)];
    var resolvedB = xdiff.teamBRefs()[refB.substring(3)];

    // decide which ones to accept in the final merged result
    var accept = {};
    accept[refA] = false;
    accept[refB] = false;
    if (!overlapEvents(resolvedA, resolvedB)) {
      accept[refA] = true;
      accept[refB] = true;
    }
    return accept;
  }

  function checkMembersConflict(refA, refB) {
    var accept = {};
    accept[refA] = true;
    accept[refB] = true;
    return accept;
  }

  function checkInteractionsConflict(refA, refB) {
    var resolvedA = xdiff.teamARefs()[refA.substring(3)];
    var resolvedB = xdiff.teamBRefs()[refB.substring(3)];

    var differentTypes = resolvedA.type != resolvedB.type;
    var sameEventPair = ((resolvedA.event1 == resolvedB.event2) && (resolvedA.event2 == resolvedB.event1)) || 
                            ((resolvedA.event1 == resolvedB.event1) && (resolvedA.event2 == resolvedB.event2));
    
    // decide which ones to accept in the final merged result
    var accept = {};
    accept[refA] = false;
    accept[refB] = false;
    if (!differentTypes && sameEventPair) {
      if (refA.event1 == refB.event1) {
        if (refA.id < refB.id) {
          accept[refA] = true;
        } else {
          accept[refB] = true;
        }
      } else if (refA.event1 < refB.event1) {
        accept[refA] = true;
      } else {
        accept[refB] = true;
      }
    } else if (!sameEventPair) { // regardless of type
      accept[refA] = true;
      accept[refB] = true;
    }
    return accept;
  }

  function cmpSetContextually(refA, refB, context) {
    var conflicts = [];
    var accept = {};

    var result;
    switch (context) {
      case "setEvents":
        result = checkEventsConflict(refA, refB);
        break;
      case "setMembers":
        result = checkMembersConflict(refA, refB);
        break;
      case "setInteractions":
        result = checkInteractionsConflict(refA, refB);
        break;
    }

    // both not accepted means conflict
    if (!result[refA] && !result[refB]) {
      switch (context) {
        case "setEvents":
          conflicts.push({"type": EVENTS_OVERLAP_CONFLICT, "event1": refA, "event2": refB});
          break;
        case "setMembers":
          break;
        case "setInteractions":
          conflicts.push({"type": INTERACTIONS_DIFF_TYPE_SAME_EVENTS, "interaction1": refA, "interaction2": refB});
          break;
      }
    }

    // record accepts
    var fullA = JSON.stringify(refA);
    var fullB = JSON.stringify(refB);
    accept[fullA] = accept[fullA] != false ? result[refA] : false; 
    accept[fullB] = accept[fullB] != false ? result[refB] : false;

    return {
      "accept": accept,
      "conflicts": conflicts,
    }
  }

  // 0 means conflict and it will then choose a random one out of a and b
  // non-0 means no conflict and it will choose one and move the merge op ahead
  // (the other one may find its way in, OR may conflict with some other change item
  // further ahead)

  // this function is to compare ONE change item, like below
  // eg. a: [2, 0, "#*=5"]
  // eg. b: [2, 0, "#*=6", "#*=7"]

  // the grouping of change items (at different indices) like the following happens
  // at the higher level function that called this function
  // [[2, 0, "#*=5"], [4, 1]]
  function cmpSpliceContextually(a, b, context) {
    var conflicts = [];
    var accept = {};

    var aChanges = a.slice(2);
    var bChanges = b.slice(2);
    for (var i in aChanges) {
      for (var j in bChanges) {
        var refA = aChanges[i];
        var refB = bChanges[j];
        
        var result;
        switch (context) {
          case "spliceEvents":
            result = checkEventsConflict(refA, refB);
            break;
          case "spliceMembers":
            result = checkMembersConflict(refA, refB);
            break;
          case "spliceInteractions":
            result = checkInteractionsConflict(refA, refB);
            break;
        }

        // both not accepted means conflict
        if (!result[refA] && !result[refB]) {
          switch (context) {
            case "spliceEvents":
              conflicts.push({"type": EVENTS_OVERLAP_CONFLICT, "event1": refA, "event2": refB});
              break;
            case "spliceMembers":
              break;
            case "spliceInteractions":
              conflicts.push({"type": INTERACTIONS_DIFF_TYPE_SAME_EVENTS, "interaction1": refA, "interaction2": refB});
              break;
          }
        }

        // record accepts
        var fullA = JSON.stringify(a.slice(0,2).concat(refA));
        var fullB = JSON.stringify(b.slice(0,2).concat(refB));
        accept[fullA] = accept[fullA] != false ? result[refA] : false; 
        accept[fullB] = accept[fullB] != false ? result[refB] : false;
      }
    }

    return {
      "accept": accept,
      "conflicts": conflicts,
    }
  }

  function resolveAry(a, b) {
    return a
  }

  function resolve(a, b) {
    // Notes:
    // when it comes to this function, almost guaranteed to be a conflict
    // BUT can save it from a conflict if find that it's one of these cases:
    // 1. both trying to 'set' the exact same path with the same thing
    // 2. both trying to 'del' the exact same path
    // 3. both trying to 'splice' the exact same path

    // a and b are change items
    var context;
    // check if paths of a and b are EXACTLY the same
    if(a[1].length == b[1].length) {
      if(a[0] == b[0]) { // check if change method of a and b are the same
        if(a[0] == 'splice') { // both are 'splice' AND have same path
          var result;
          switch(JSON.stringify(a[1])) {
            case SPLICE_EVENTS_CONTEXT:
              result = mergeContextually(a[2], b[2], "spliceEvents");
              break;
            case SPLICE_MEMBERS_CONTEXT:
              result = mergeContextually(a[2], b[2], "spliceMembers");
              break;
            case SPLICE_INTERACTIONS_CONTEXT:
              result = mergeContextually(a[2], b[2], "spliceInteractions");
              break;
            default:
              result = {
                "merged": [],
                "conflicts": [],
              }
          }
          return {
            "merged": ['splice', a[1].slice(), result.merged],
            "conflicts": result.conflicts,
          }
        } else if (a[0] == 'set') {
          var result;
          switch(JSON.stringify(a[1])) {
            case SET_EVENTS_CONTEXT:
              result = mergeContextually(a[2].root, b[2].root, "setEvents");
              break;
            case SET_MEMBERS_CONTEXT:
              result = mergeContextually(a[2].root, b[2].root, "setMembers");
              break;
            case SET_INTERACTIONS_CONTEXT:
              result = mergeContextually(a[2].root, b[2].root, "setInteractions");
              break;
            default:
              result = {
                "merged": [],
                "conflicts": [],
              }
          }
          return {
            "merged": ['set', a[1].slice(), result.merged],
            "conflicts": result.conflicts,
          }
        } else if(equal(a[2], b[2])) { // 'set' or 'del', AND same change to same path
          return {
            "merged": a,
            "conflicts": [],
          } // since both are same, just return any one i.e. not a conflict
        }
      }
    }

    // if paths are prefixes BUT different length, then
    // just take any one
    return {
      "merged": a,
      "conflicts": [{"teamA": a, "teamB": b, "type": "subtree"}],
    }
  }

  function mergeContextually(a, b, context) {
    // input is basically entire change item set for a splice call
    // eg. a: [ [1,0,"#*=3"] ]
    // eg. b: [ [1,0,"#*=2"] ]
    // OR
    // like this for set call
    // eg. a: [ "#*=3" ]
    // eg. a: [ "#*=5" ]

    var conflicts = [];
    var accept = {};
    
    for (var i in a) {
      for (var j in b) {
        var result;
        switch (context) {
          case "spliceEvents":
          case "spliceMembers":
          case "spliceInteractions":
            result = cmpSpliceContextually(a[i], b[j], context);
            break;
          case "setEvents":
          case "setMembers":
          case "setInteractions":
            result = cmpSetContextually(a[i], b[j], context);
            break;
          default:
            result = {
              "accept": {},
              "conflicts": [],
            }
            break;
        }
        
        // combine conflicts
        conflicts = conflicts.concat(result.conflicts);
        
        // record accepts
        for (var i in result.accept) {
          accept[i] = accept[i] != false ? result.accept[i] : false;
        }
      }
    }

    var merged = [];
    for (var i in accept) {
      if (accept[i]) {
        merged.push(JSON.parse(i));
      }
    }

    return {
      "merged": merged,
      "conflicts": conflicts,
    }
  }

  function merge(a, b, cmp, resolve) {
    var merged = [];
    var conflicts = [];

    var i = a.length - 1, j = b.length - 1
    while(~i && ~j) { // while both i and j are >= 0
      var c = cmp(a[i], b[j]) // compares two change items
      if(c > 0) merged.push(a[i--]) // if path of a[i] is lexicographically bigger
      if(c < 0) merged.push(b[j--]) // if path of b[j] is lexicographically bigger
      if(!c) { // if path of one is a prefix of the other's, for the current 2 change items
        // here, we know that trying to splice to the same index
        // in the array, and can check from arg whether within "root events root" context
        // if both true, then we can resolve the #*=3 and #*=2 into objects from arg
        // that contains the original a, o, b,
        // and then check if they are overlapping in x coordinate
        // if no overlap, accept BOTH
        // if have overlap, accept NONE, give conflict
        var result = resolve(a[i], b[j])
          j--, i--
        merged.push(result.merged);
        conflicts = conflicts.concat(result.conflicts);
      }
    }
    //finish off the list if there are any left over
    while(~i) merged.push(a[i--]) // while i is >= 0
    while(~j) merged.push(b[j--]) // while j is >= 0
    
    return {
      "merged": merged,
      "conflicts": conflicts,
    }
  }

  _a.sort(cmp) // sort within diff of a, by path
  _b.sort(cmp) // sort within diff of b, by path

  var merged = merge(_a, _b, isPrefix, resolve);
  merged.conflicts = merged.conflicts.concat(xdiff.integrityCheck(merged.merged, o));
  return merged;
}

// This function does 3 things:
// check handoffs are consistent in order of events
// check collaborations are consistent in appropriate overlap of events and not same y
// check handoffs and collaborations are consistent in existence of events
xdiff.integrityCheck = function(diffs, ancestor) {
  var patched = xdiff.patch(ancestor, diffs);
  var conflicts = [];
  
  for (var i in patched.interactions) {
    var interaction = patched.interactions[i];
    var event1;
    var event2;
    for (var j in patched.events) {
      var ev = patched.events[j];
      if (interaction.event1 == ev.id) {
        event1 = ev;
      } else if (interaction.event2 == ev.id) {
        event2 = ev;
      }
    }

    if (!event1 || !event2) {
      conflicts.push({"type": INTERACTION_MISSING_EVENT_CONFLICT, "interaction": interaction.id});
    } else {
      var event1Times = startAndEndTimesEvents(event1);
      var event2Times = startAndEndTimesEvents(event2);

      switch (interaction.type) {
        case "handoff":
          if (event1Times.end >= event2Times.start) {
            conflicts.push({"type": HANDOFF_MISORDERED_EVENTS_CONFLICT, "interaction": interaction.id});
          }
          break;
        case "collaboration":
          if (event1.y == event2.y) {
            conflicts.push({"type": COLLABORATION_SAME_Y_CONFLICT, "interaction": interaction.id});
          }
          if (event1Times.end < event2Times.start || event2Times.end < event1Times.start) {
            conflicts.push({"type": COLLABORATION_NO_OVERLAP_CONFLICT, "interaction": interaction.id});
          }
          break;
      }
    }
  }
  return conflicts;
};

xdiff.diff3Teams = function (teamA, ancestor, teamB) {
  teamA = xdiff.essentialJSON(teamA);
  ancestor = xdiff.essentialJSON(ancestor);
  teamB = xdiff.essentialJSON(teamB);
  
  var result = xdiff.diff3(teamA, ancestor, teamB);
  return {
    'diffs': result.merged,
    'conflicts': result.conflicts,
  }
};

xdiff.patchTeam = function(diffs, ancestor) {
  var copy = JSON.parse(JSON.stringify(ancestor));
  return xdiff.patch(copy, diffs);
};

xdiff.essentialJSON = function(team) {
  var copy = {};
  if(team.events && team.events.length > 0){
    copy.events = JSON.parse(JSON.stringify(team.events));
  }
  if(team.members && team.members.length > 0){
    copy.members = JSON.parse(JSON.stringify(team.members));
  }
  if(team.interactions && team.interactions.length > 0){
    copy.interactions = JSON.parse(JSON.stringify(team.interactions));
  }
  return copy;
};
