/*!
 * jQuery JavaScript Library v1.11.0
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-01-23T21:02Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var trim = "".trim;

var support = {};



var
	version = "1.11.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return a 'clean' array
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return just the object
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return obj - parseFloat( obj ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: trim && !trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.16
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-01-13
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select t=''><option selected=''></option></select>";

			// Support: IE8, Opera 10-12
			// Nothing should be selected when empty strings follow ^= or $= or *=
			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !(--remaining) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	}
});

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};


var strundefined = typeof undefined;



// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

jQuery(function() {
	// We need to execute this one support test ASAP because we need to know
	// if body.style.zoom needs to be set.

	var container, div,
		body = document.getElementsByTagName("body")[0];

	if ( !body ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

	div = document.createElement( "div" );
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1";

		if ( (support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 )) ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );

	// Null elements to avoid leaks in IE
	container = div = null;
});




(function() {
	var div = document.createElement( "div" );

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute("classid") === noData;
};


var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,
		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};



// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[0], key ) : emptyGet;
};
var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		input = document.createElement("input");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	fragment = div = input = null;
})();


(function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined && (
				// Support: IE < 9
				src.returnValue === false ||
				// Support: Android < 4.0
				src.getPreventDefault && src.getPreventDefault() ) ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!support.noCloneEvent || !support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = (rtagName.exec( elem ) || [ "", "" ])[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ (rtagName.exec( value ) || [ "", "" ])[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			window.getDefaultComputedStyle( elem[ 0 ] ).display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}


(function() {
	var a, shrinkWrapBlocksVal,
		div = document.createElement( "div" ),
		divReset =
			"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;" +
			"display:block;padding:0;margin:0;border:0";

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	a.style.cssText = "float:left;opacity:.5";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Null elements to avoid leaks in IE.
	a = div = null;

	support.shrinkWrapBlocks = function() {
		var body, container, div, containerStyles;

		if ( shrinkWrapBlocksVal == null ) {
			body = document.getElementsByTagName( "body" )[ 0 ];
			if ( !body ) {
				// Test fired too early or in an unsupported environment, exit.
				return;
			}

			containerStyles = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px";
			container = document.createElement( "div" );
			div = document.createElement( "div" );

			body.appendChild( container ).appendChild( div );

			// Will be changed later if needed.
			shrinkWrapBlocksVal = false;

			if ( typeof div.style.zoom !== strundefined ) {
				// Support: IE6
				// Check if elements with layout shrink-wrap their children
				div.style.cssText = divReset + ";width:1px;padding:1px;zoom:1";
				div.innerHTML = "<div></div>";
				div.firstChild.style.width = "5px";
				shrinkWrapBlocksVal = div.offsetWidth !== 3;
			}

			body.removeChild( container );

			// Null elements to avoid leaks in IE.
			body = container = div = null;
		}

		return shrinkWrapBlocksVal;
	};

})();
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );



var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var a, reliableHiddenOffsetsVal, boxSizingVal, boxSizingReliableVal,
		pixelPositionVal, reliableMarginRightVal,
		div = document.createElement( "div" ),
		containerStyles = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
		divReset =
			"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;" +
			"display:block;padding:0;margin:0;border:0";

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	a.style.cssText = "float:left;opacity:.5";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Null elements to avoid leaks in IE.
	a = div = null;

	jQuery.extend(support, {
		reliableHiddenOffsets: function() {
			if ( reliableHiddenOffsetsVal != null ) {
				return reliableHiddenOffsetsVal;
			}

			var container, tds, isSupported,
				div = document.createElement( "div" ),
				body = document.getElementsByTagName( "body" )[ 0 ];

			if ( !body ) {
				// Return for frameset docs that don't have a body
				return;
			}

			// Setup
			div.setAttribute( "className", "t" );
			div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

			container = document.createElement( "div" );
			container.style.cssText = containerStyles;

			body.appendChild( container ).appendChild( div );

			// Support: IE8
			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName( "td" );
			tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
			isSupported = ( tds[ 0 ].offsetHeight === 0 );

			tds[ 0 ].style.display = "";
			tds[ 1 ].style.display = "none";

			// Support: IE8
			// Check if empty table cells still have offsetWidth/Height
			reliableHiddenOffsetsVal = isSupported && ( tds[ 0 ].offsetHeight === 0 );

			body.removeChild( container );

			// Null elements to avoid leaks in IE.
			div = body = null;

			return reliableHiddenOffsetsVal;
		},

		boxSizing: function() {
			if ( boxSizingVal == null ) {
				computeStyleTests();
			}
			return boxSizingVal;
		},

		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {
			var body, container, div, marginDiv;

			// Use window.getComputedStyle because jsdom on node.js will break without it.
			if ( reliableMarginRightVal == null && window.getComputedStyle ) {
				body = document.getElementsByTagName( "body" )[ 0 ];
				if ( !body ) {
					// Test fired too early or in an unsupported environment, exit.
					return;
				}

				container = document.createElement( "div" );
				div = document.createElement( "div" );
				container.style.cssText = containerStyles;

				body.appendChild( container ).appendChild( div );

				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// Fails in WebKit before Feb 2011 nightlies
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				marginDiv = div.appendChild( document.createElement( "div" ) );
				marginDiv.style.cssText = div.style.cssText = divReset;
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";

				reliableMarginRightVal =
					!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );

				body.removeChild( container );
			}

			return reliableMarginRightVal;
		}
	});

	function computeStyleTests() {
		var container, div,
			body = document.getElementsByTagName( "body" )[ 0 ];

		if ( !body ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		container = document.createElement( "div" );
		div = document.createElement( "div" );
		container.style.cssText = containerStyles;

		body.appendChild( container ).appendChild( div );

		div.style.cssText =
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:absolute;display:block;padding:1px;border:1px;width:4px;" +
				"margin-top:1%;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			boxSizingVal = div.offsetWidth === 4;
		});

		// Will be changed later if needed.
		boxSizingReliableVal = true;
		pixelPositionVal = false;
		reliableMarginRightVal = true;

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			pixelPositionVal = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			boxSizingReliableVal =
				( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE.
		div = body = null;
	}

})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,

	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing() && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					// Support: Chrome, Safari
					// Setting style to blank string required to delete "style: x !important;"
					style[ name ] = "";
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing() && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, dDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );
		dDisplay = defaultDisplay( elem.nodeName );
		if ( display === "none" ) {
			display = dDisplay;
		}
		if ( display === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || dDisplay === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var a, input, select, opt,
		div = document.createElement("div" );

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];

	// First batch of tests.
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// Null elements to avoid leaks in IE.
	a = input = select = opt = div = null;
})();


var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					jQuery.text( elem );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) >= 0 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// Retrieve booleans specially
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		} :
		function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

// Support: Safari, IE9+
// mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		return !this.isLocal &&

			// Support: IE7-8
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			/^(get|post|head|put|delete|options)$/i.test( this.type ) &&

			createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	});
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( options ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch( e ) {
									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;
								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					if ( !options.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};





var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray("auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // making sure that all forms have actual up-to-date token(cached forms contain old one)
    refreshCSRFTokens: function(){
      var csrfToken = $('meta[name=csrf-token]').attr('content');
      var csrfParam = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrfParam + '"]').val(csrfToken);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = $('meta[name=csrf-token]').attr('content'),
        csrfParam = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
d3=function(){function n(n){return null!=n&&!isNaN(n)}function t(n){return n.length}function e(n){for(var t=1;n*t%1;)t*=10;return t}function r(n,t){try{for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}catch(r){n.prototype=t}}function i(){}function u(){}function a(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function o(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.substring(1);for(var e=0,r=Na.length;r>e;++e){var i=Na[e]+t;if(i in n)return i}}function c(n){for(var t=-1,e=n.length,r=[];++t<e;)r.push(n[t]);return r}function l(n){return Array.prototype.slice.call(n)}function s(){}function f(){}function h(n){function t(){for(var t,r=e,i=-1,u=r.length;++i<u;)(t=r[i].on)&&t.apply(this,arguments);return n}var e=[],r=new i;return t.on=function(t,i){var u,a=r.get(t);return arguments.length<2?a&&a.on:(a&&(a.on=null,e=e.slice(0,u=e.indexOf(a)).concat(e.slice(u+1)),r.remove(t)),i&&e.push(r.set(t,{on:i})),n)},t}function g(){ya.event.preventDefault()}function p(){for(var n,t=ya.event;n=t.sourceEvent;)t=n;return t}function d(n){for(var t=new f,e=0,r=arguments.length;++e<r;)t[arguments[e]]=h(t);return t.of=function(e,r){return function(i){try{var u=i.sourceEvent=ya.event;i.target=n,ya.event=i,t[i.type].apply(e,r)}finally{ya.event=u}}},t}function m(n){return za(n,Fa),n}function v(n){return"function"==typeof n?n:function(){return Da(n,this)}}function y(n){return"function"==typeof n?n:function(){return ja(n,this)}}function M(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function i(){this.setAttribute(n,t)}function u(){this.setAttributeNS(n.space,n.local,t)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ya.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?o:a:n.local?u:i}function x(n){return n.trim().replace(/\s+/g," ")}function b(n){return new RegExp("(?:^|\\s+)"+ya.requote(n)+"(?:\\s+|$)","g")}function _(n,t){function e(){for(var e=-1;++e<i;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<i;)n[e](this,r)}n=n.trim().split(/\s+/).map(w);var i=n.length;return"function"==typeof t?r:e}function w(n){var t=b(n);return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n);var i=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",x(i+" "+n))):e.setAttribute("class",x(i.replace(t," ")))}}function S(n,t,e){function r(){this.style.removeProperty(n)}function i(){this.style.setProperty(n,t,e)}function u(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?u:i}function E(n,t){function e(){delete this[n]}function r(){this[n]=t}function i(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?i:r}function k(n){return"function"==typeof n?n:(n=ya.ns.qualify(n)).local?function(){return Ma.createElementNS(n.space,n.local)}:function(){return Ma.createElementNS(this.namespaceURI,n)}}function A(n){return{__data__:n}}function N(n){return function(){return Ha(this,n)}}function q(n){return arguments.length||(n=ya.ascending),function(t,e){return!t-!e||n(t.__data__,e.__data__)}}function T(n,t){for(var e=0,r=n.length;r>e;e++)for(var i,u=n[e],a=0,o=u.length;o>a;a++)(i=u[a])&&t(i,a,e);return n}function C(n){return za(n,Oa),n}function z(n,t,e){function r(){var t=this[a];t&&(this.removeEventListener(n,t,t.$),delete this[a])}function i(){var i=c(t,qa(arguments));r.call(this),this.addEventListener(n,this[a]=i,i.$=e),i._=t}function u(){var t,e=new RegExp("^__on([^.]+)"+ya.requote(n)+"$");for(var r in this)if(t=r.match(e)){var i=this[r];this.removeEventListener(t[1],i,i.$),delete this[r]}}var a="__on"+n,o=n.indexOf("."),c=D;o>0&&(n=n.substring(0,o));var l=Ra.get(n);return l&&(n=l,c=j),o?t?i:r:t?s:u}function D(n,t){return function(e){var r=ya.event;ya.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ya.event=r}}}function j(n,t){var e=D(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function L(n){var t="selectstart."+n,e="dragstart."+n,r="click."+n,i=ya.select(ba).on(t,g).on(e,g),u=xa.style,a=u[Ua];return u[Ua]="none",function(n){function o(){i.on(r,null)}i.on(t,null).on(e,null),u[Ua]=a,n&&(i.on(r,function(){g(),o()},!0),setTimeout(o,0))}}function H(n,t){var e=n.ownerSVGElement||n;if(e.createSVGPoint){var r=e.createSVGPoint();if(0>Ia&&(ba.scrollX||ba.scrollY)){e=ya.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var i=e[0][0].getScreenCTM();Ia=!(i.f||i.e),e.remove()}return Ia?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}var u=n.getBoundingClientRect();return[t.clientX-u.left-n.clientLeft,t.clientY-u.top-n.clientTop]}function F(){}function P(n,t,e){return new O(n,t,e)}function O(n,t,e){this.h=n,this.s=t,this.l=e}function Y(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?u+(a-u)*n/60:180>n?a:240>n?u+(a-u)*(240-n)/60:u}function i(n){return Math.round(255*r(n))}var u,a;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,a=.5>=e?e*(1+t):e+t-e*t,u=2*e-a,rt(i(n+120),i(n),i(n-120))}function R(n){return n>0?1:0>n?-1:0}function U(n){return n>1?0:-1>n?$a:Math.acos(n)}function I(n){return n>1?$a/2:-1>n?-$a/2:Math.asin(n)}function V(n){return(Math.exp(n)-Math.exp(-n))/2}function X(n){return(Math.exp(n)+Math.exp(-n))/2}function Z(n){return(n=Math.sin(n/2))*n}function B(n,t,e){return new $(n,t,e)}function $(n,t,e){this.h=n,this.c=t,this.l=e}function W(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),J(e,Math.cos(n*=Ga)*t,Math.sin(n)*t)}function J(n,t,e){return new G(n,t,e)}function G(n,t,e){this.l=n,this.a=t,this.b=e}function K(n,t,e){var r=(n+16)/116,i=r+t/500,u=r-e/200;return i=nt(i)*to,r=nt(r)*eo,u=nt(u)*ro,rt(et(3.2404542*i-1.5371385*r-.4985314*u),et(-.969266*i+1.8760108*r+.041556*u),et(.0556434*i-.2040259*r+1.0572252*u))}function Q(n,t,e){return n>0?B(Math.atan2(e,t)*Ka,Math.sqrt(t*t+e*e),n):B(0/0,0/0,n)}function nt(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function tt(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function et(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function rt(n,t,e){return new it(n,t,e)}function it(n,t,e){this.r=n,this.g=t,this.b=e}function ut(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function at(n,t,e){var r,i,u,a=0,o=0,c=0;if(r=/([a-z]+)\((.*)\)/i.exec(n))switch(i=r[2].split(","),r[1]){case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100);case"rgb":return t(st(i[0]),st(i[1]),st(i[2]))}return(u=ao.get(n))?t(u.r,u.g,u.b):(null!=n&&"#"===n.charAt(0)&&(4===n.length?(a=n.charAt(1),a+=a,o=n.charAt(2),o+=o,c=n.charAt(3),c+=c):7===n.length&&(a=n.substring(1,3),o=n.substring(3,5),c=n.substring(5,7)),a=parseInt(a,16),o=parseInt(o,16),c=parseInt(c,16)),t(a,o,c))}function ot(n,t,e){var r,i,u=Math.min(n/=255,t/=255,e/=255),a=Math.max(n,t,e),o=a-u,c=(a+u)/2;return o?(i=.5>c?o/(a+u):o/(2-a-u),r=n==a?(t-e)/o+(e>t?6:0):t==a?(e-n)/o+2:(n-t)/o+4,r*=60):(r=0/0,i=c>0&&1>c?0:r),P(r,i,c)}function ct(n,t,e){n=lt(n),t=lt(t),e=lt(e);var r=tt((.4124564*n+.3575761*t+.1804375*e)/to),i=tt((.2126729*n+.7151522*t+.072175*e)/eo),u=tt((.0193339*n+.119192*t+.9503041*e)/ro);return J(116*i-16,500*(r-i),200*(i-u))}function lt(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function st(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function ft(n){return"function"==typeof n?n:function(){return n}}function ht(n){return n}function gt(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),pt(t,e,n,r)}}function pt(n,t,e,r){function i(){var n,t=c.status;if(!t&&c.responseText||t>=200&&300>t||304===t){try{n=e.call(u,c)}catch(r){return a.error.call(u,r),void 0}a.load.call(u,n)}else a.error.call(u,c)}var u={},a=ya.dispatch("progress","load","error"),o={},c=new XMLHttpRequest,l=null;return!ba.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(n)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=i:c.onreadystatechange=function(){c.readyState>3&&i()},c.onprogress=function(n){var t=ya.event;ya.event=n;try{a.progress.call(u,c)}finally{ya.event=t}},u.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?o[n]:(null==t?delete o[n]:o[n]=t+"",u)},u.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",u):t},u.responseType=function(n){return arguments.length?(l=n,u):l},u.response=function(n){return e=n,u},["get","post"].forEach(function(n){u[n]=function(){return u.send.apply(u,[n].concat(qa(arguments)))}}),u.send=function(e,r,i){if(2===arguments.length&&"function"==typeof r&&(i=r,r=null),c.open(e,n,!0),null==t||"accept"in o||(o.accept=t+",*/*"),c.setRequestHeader)for(var a in o)c.setRequestHeader(a,o[a]);return null!=t&&c.overrideMimeType&&c.overrideMimeType(t),null!=l&&(c.responseType=l),null!=i&&u.on("error",i).on("load",function(n){i(null,n)}),c.send(null==r?null:r),u},u.abort=function(){return c.abort(),u},ya.rebind(u,a,"on"),null==r?u:u.get(dt(r))}function dt(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function mt(){var n=vt(),t=yt()-n;t>24?(isFinite(t)&&(clearTimeout(so),so=setTimeout(mt,t)),lo=0):(lo=1,fo(mt))}function vt(){for(var n=Date.now(),t=oo;t;)n>=t.time&&(t.flush=t.callback(n-t.time)),t=t.next;return n}function yt(){for(var n,t=oo,e=1/0;t;)t.flush?t=n?n.next=t.next:oo=t.next:(t.time<e&&(e=t.time),t=(n=t).next);return co=n,e}function Mt(n,t){var e=Math.pow(10,3*Math.abs(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function xt(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function bt(n){return n+""}function _t(){}function wt(n,t,e){var r=e.s=n+t,i=r-n,u=r-i;e.t=n-u+(t-i)}function St(n,t){n&&wo.hasOwnProperty(n.type)&&wo[n.type](n,t)}function Et(n,t,e){var r,i=-1,u=n.length-e;for(t.lineStart();++i<u;)r=n[i],t.point(r[0],r[1]);t.lineEnd()}function kt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)Et(n[e],t,1);t.polygonEnd()}function At(){function n(n,t){n*=Ga,t=t*Ga/2+$a/4;var e=n-r,a=Math.cos(t),o=Math.sin(t),c=u*o,l=i*a+c*Math.cos(e),s=c*Math.sin(e);Eo.add(Math.atan2(s,l)),r=n,i=a,u=o}var t,e,r,i,u;ko.point=function(a,o){ko.point=n,r=(t=a)*Ga,i=Math.cos(o=(e=o)*Ga/2+$a/4),u=Math.sin(o)},ko.lineEnd=function(){n(t,e)}}function Nt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function qt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function Tt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Ct(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function zt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function Dt(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function jt(n){return[Math.atan2(n[1],n[0]),I(n[2])]}function Lt(n,t){return Math.abs(n[0]-t[0])<Wa&&Math.abs(n[1]-t[1])<Wa}function Ht(n,t){n*=Ga;var e=Math.cos(t*=Ga);Ft(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function Ft(n,t,e){++Ao,qo+=(n-qo)/Ao,To+=(t-To)/Ao,Co+=(e-Co)/Ao}function Pt(){function n(n,i){n*=Ga;var u=Math.cos(i*=Ga),a=u*Math.cos(n),o=u*Math.sin(n),c=Math.sin(i),l=Math.atan2(Math.sqrt((l=e*c-r*o)*l+(l=r*a-t*c)*l+(l=t*o-e*a)*l),t*a+e*o+r*c);No+=l,zo+=l*(t+(t=a)),Do+=l*(e+(e=o)),jo+=l*(r+(r=c)),Ft(t,e,r)}var t,e,r;Po.point=function(i,u){i*=Ga;var a=Math.cos(u*=Ga);t=a*Math.cos(i),e=a*Math.sin(i),r=Math.sin(u),Po.point=n,Ft(t,e,r)}}function Ot(){Po.point=Ht}function Yt(){function n(n,t){n*=Ga;var e=Math.cos(t*=Ga),a=e*Math.cos(n),o=e*Math.sin(n),c=Math.sin(t),l=i*c-u*o,s=u*a-r*c,f=r*o-i*a,h=Math.sqrt(l*l+s*s+f*f),g=r*a+i*o+u*c,p=h&&-U(g)/h,d=Math.atan2(h,g);Lo+=p*l,Ho+=p*s,Fo+=p*f,No+=d,zo+=d*(r+(r=a)),Do+=d*(i+(i=o)),jo+=d*(u+(u=c)),Ft(r,i,u)}var t,e,r,i,u;Po.point=function(a,o){t=a,e=o,Po.point=n,a*=Ga;var c=Math.cos(o*=Ga);r=c*Math.cos(a),i=c*Math.sin(a),u=Math.sin(o),Ft(r,i,u)},Po.lineEnd=function(){n(t,e),Po.lineEnd=Ot,Po.point=Ht}}function Rt(){return!0}function Ut(n,t,e,r,i){var u=[],a=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Lt(e,r)){i.lineStart();for(var o=0;t>o;++o)i.point((e=n[o])[0],e[1]);return i.lineEnd(),void 0}var c={point:e,points:n,other:null,visited:!1,entry:!0,subject:!0},l={point:e,points:[e],other:c,visited:!1,entry:!1,subject:!1};c.other=l,u.push(c),a.push(l),c={point:r,points:[r],other:null,visited:!1,entry:!1,subject:!0},l={point:r,points:[r],other:c,visited:!1,entry:!0,subject:!1},c.other=l,u.push(c),a.push(l)}}),a.sort(t),It(u),It(a),u.length){if(e)for(var o=1,c=!e(a[0].point),l=a.length;l>o;++o)a[o].entry=c=!c;for(var s,f,h,g=u[0];;){for(s=g;s.visited;)if((s=s.next)===g)return;f=s.points,i.lineStart();do{if(s.visited=s.other.visited=!0,s.entry){if(s.subject)for(var o=0;o<f.length;o++)i.point((h=f[o])[0],h[1]);else r(s.point,s.next.point,1,i);s=s.next}else{if(s.subject){f=s.prev.points;for(var o=f.length;--o>=0;)i.point((h=f[o])[0],h[1])}else r(s.point,s.prev.point,-1,i);s=s.prev}s=s.other,f=s.points}while(!s.visited);i.lineEnd()}}}function It(n){if(t=n.length){for(var t,e,r=0,i=n[0];++r<t;)i.next=e=n[r],e.prev=i,i=e;i.next=e=n[0],e.prev=i}}function Vt(n,t,e,r){return function(i){function u(t,e){n(t,e)&&i.point(t,e)}function a(n,t){d.point(n,t)}function o(){m.point=a,d.lineStart()}function c(){m.point=u,d.lineEnd()}function l(n,t){y.point(n,t),p.push([n,t])}function s(){y.lineStart(),p=[]}function f(){l(p[0][0],p[0][1]),y.lineEnd();var n,t=y.clean(),e=v.buffer(),r=e.length;if(p.pop(),g.push(p),p=null,r){if(1&t){n=e[0];var u,r=n.length-1,a=-1;for(i.lineStart();++a<r;)i.point((u=n[a])[0],u[1]);return i.lineEnd(),void 0}r>1&&2&t&&e.push(e.pop().concat(e.shift())),h.push(e.filter(Xt))}}var h,g,p,d=t(i),m={point:u,lineStart:o,lineEnd:c,polygonStart:function(){m.point=l,m.lineStart=s,m.lineEnd=f,h=[],g=[],i.polygonStart()},polygonEnd:function(){m.point=u,m.lineStart=o,m.lineEnd=c,h=ya.merge(h),h.length?Ut(h,Bt,null,e,i):r(g)&&(i.lineStart(),e(null,null,1,i),i.lineEnd()),i.polygonEnd(),h=g=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},v=Zt(),y=t(v);return m}}function Xt(n){return n.length>1}function Zt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:s,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Bt(n,t){return((n=n.point)[0]<0?n[1]-$a/2-Wa:$a/2-n[1])-((t=t.point)[0]<0?t[1]-$a/2-Wa:$a/2-t[1])}function $t(n,t){var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],u=0,a=!1,o=!1,c=0;Eo.reset();for(var l=0,s=t.length;s>l;++l){var f=t[l],h=f.length;if(h){for(var g=f[0],p=g[0],d=g[1]/2+$a/4,m=Math.sin(d),v=Math.cos(d),y=1;;){y===h&&(y=0),n=f[y];var M=n[0],x=n[1]/2+$a/4,b=Math.sin(x),_=Math.cos(x),w=M-p,S=Math.abs(w)>$a,E=m*b;if(Eo.add(Math.atan2(E*Math.sin(w),v*_+E*Math.cos(w))),Math.abs(x)<Wa&&(o=!0),u+=S?w+(w>=0?2:-2)*$a:w,S^p>=e^M>=e){var k=Tt(Nt(g),Nt(n));Dt(k);var A=Tt(i,k);Dt(A);var N=(S^w>=0?-1:1)*I(A[2]);r>N&&(c+=S^w>=0?1:-1)}if(!y++)break;p=M,m=b,v=_,g=n}Math.abs(u)>Wa&&(a=!0)}}return(!o&&!a&&0>Eo||-Wa>u)^1&c}function Wt(n){var t,e=0/0,r=0/0,i=0/0;return{lineStart:function(){n.lineStart(),t=1},point:function(u,a){var o=u>0?$a:-$a,c=Math.abs(u-e);Math.abs(c-$a)<Wa?(n.point(e,r=(r+a)/2>0?$a/2:-$a/2),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(o,r),n.point(u,r),t=0):i!==o&&c>=$a&&(Math.abs(e-i)<Wa&&(e-=i*Wa),Math.abs(u-o)<Wa&&(u-=o*Wa),r=Jt(e,r,u,a),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(o,r),t=0),n.point(e=u,r=a),i=o},lineEnd:function(){n.lineEnd(),e=r=0/0},clean:function(){return 2-t}}}function Jt(n,t,e,r){var i,u,a=Math.sin(n-e);return Math.abs(a)>Wa?Math.atan((Math.sin(t)*(u=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*u*a)):(t+r)/2}function Gt(n,t,e,r){var i;if(null==n)i=e*$a/2,r.point(-$a,i),r.point(0,i),r.point($a,i),r.point($a,0),r.point($a,-i),r.point(0,-i),r.point(-$a,-i),r.point(-$a,0),r.point(-$a,i);else if(Math.abs(n[0]-t[0])>Wa){var u=(n[0]<t[0]?1:-1)*$a;i=e*u/2,r.point(-u,i),r.point(0,i),r.point(u,i)}else r.point(t[0],t[1])}function Kt(n){return $t(Yo,n)}function Qt(n){function t(n,t){return Math.cos(n)*Math.cos(t)>a}function e(n){var e,u,a,c,s;return{lineStart:function(){c=a=!1,s=1},point:function(f,h){var g,p=[f,h],d=t(f,h),m=o?d?0:i(f,h):d?i(f+(0>f?$a:-$a),h):0;if(!e&&(c=a=d)&&n.lineStart(),d!==a&&(g=r(e,p),(Lt(e,g)||Lt(p,g))&&(p[0]+=Wa,p[1]+=Wa,d=t(p[0],p[1]))),d!==a)s=0,d?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(l&&e&&o^d){var v;m&u||!(v=r(p,e,!0))||(s=0,o?(n.lineStart(),n.point(v[0][0],v[0][1]),n.point(v[1][0],v[1][1]),n.lineEnd()):(n.point(v[1][0],v[1][1]),n.lineEnd(),n.lineStart(),n.point(v[0][0],v[0][1])))}!d||e&&Lt(e,p)||n.point(p[0],p[1]),e=p,a=d,u=m},lineEnd:function(){a&&n.lineEnd(),e=null},clean:function(){return s|(c&&a)<<1}}}function r(n,t,e){var r=Nt(n),i=Nt(t),u=[1,0,0],o=Tt(r,i),c=qt(o,o),l=o[0],s=c-l*l;if(!s)return!e&&n;var f=a*c/s,h=-a*l/s,g=Tt(u,o),p=zt(u,f),d=zt(o,h);Ct(p,d);var m=g,v=qt(p,m),y=qt(m,m),M=v*v-y*(qt(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=zt(m,(-v-x)/y);if(Ct(b,p),b=jt(b),!e)return b;var _,w=n[0],S=t[0],E=n[1],k=t[1];w>S&&(_=w,w=S,S=_);var A=S-w,N=Math.abs(A-$a)<Wa,q=N||Wa>A;if(!N&&E>k&&(_=E,E=k,k=_),q?N?E+k>0^b[1]<(Math.abs(b[0]-w)<Wa?E:k):E<=b[1]&&b[1]<=k:A>$a^(w<=b[0]&&b[0]<=S)){var T=zt(m,(-v+x)/y);return Ct(T,p),[b,jt(T)]}}}function i(t,e){var r=o?n:$a-n,i=0;return-r>t?i|=1:t>r&&(i|=2),-r>e?i|=4:e>r&&(i|=8),i}function u(n){return $t(c,n)}var a=Math.cos(n),o=a>0,c=[n,0],l=Math.abs(a)>Wa,s=Se(n,6*Ga);return Vt(t,e,s,u)}function ne(n,t,e,r){function i(r,i){return Math.abs(r[0]-n)<Wa?i>0?0:3:Math.abs(r[0]-e)<Wa?i>0?2:1:Math.abs(r[1]-t)<Wa?i>0?1:0:i>0?3:2}function u(n,t){return a(n.point,t.point)}function a(n,t){var e=i(n,1),r=i(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}function o(i,u){var a=u[0]-i[0],o=u[1]-i[1],c=[0,1];return Math.abs(a)<Wa&&Math.abs(o)<Wa?n<=i[0]&&i[0]<=e&&t<=i[1]&&i[1]<=r:te(n-i[0],a,c)&&te(i[0]-e,-a,c)&&te(t-i[1],o,c)&&te(i[1]-r,-o,c)?(c[1]<1&&(u[0]=i[0]+c[1]*a,u[1]=i[1]+c[1]*o),c[0]>0&&(i[0]+=c[0]*a,i[1]+=c[0]*o),!0):!1}return function(c){function l(u){var a=i(u,-1),o=s([0===a||3===a?n:e,a>1?r:t]);return o}function s(n){for(var t=0,e=M.length,r=n[1],i=0;e>i;++i)for(var u,a=1,o=M[i],c=o.length,l=o[0];c>a;++a)u=o[a],l[1]<=r?u[1]>r&&f(l,u,n)>0&&++t:u[1]<=r&&f(l,u,n)<0&&--t,l=u;return 0!==t}function f(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(e[0]-n[0])*(t[1]-n[1])}function h(u,o,c,l){var s=0,f=0;if(null==u||(s=i(u,c))!==(f=i(o,c))||a(u,o)<0^c>0){do l.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+c+4)%4)!==f)}else l.point(o[0],o[1])}function g(i,u){return i>=n&&e>=i&&u>=t&&r>=u}function p(n,t){g(n,t)&&c.point(n,t)}function d(){T.point=v,M&&M.push(x=[]),A=!0,k=!1,S=E=0/0}function m(){y&&(v(b,_),w&&k&&q.rejoin(),y.push(q.buffer())),T.point=p,k&&c.lineEnd()}function v(n,t){n=Math.max(-Ro,Math.min(Ro,n)),t=Math.max(-Ro,Math.min(Ro,t));var e=g(n,t);if(M&&x.push([n,t]),A)b=n,_=t,w=e,A=!1,e&&(c.lineStart(),c.point(n,t));else if(e&&k)c.point(n,t);else{var r=[S,E],i=[n,t];o(r,i)?(k||(c.lineStart(),c.point(r[0],r[1])),c.point(i[0],i[1]),e||c.lineEnd()):e&&(c.lineStart(),c.point(n,t))}S=n,E=t,k=e}var y,M,x,b,_,w,S,E,k,A,N=c,q=Zt(),T={point:p,lineStart:d,lineEnd:m,polygonStart:function(){c=q,y=[],M=[]},polygonEnd:function(){c=N,(y=ya.merge(y)).length?(c.polygonStart(),Ut(y,u,l,h,c),c.polygonEnd()):s([n,t])&&(c.polygonStart(),c.lineStart(),h(null,null,1,c),c.lineEnd(),c.polygonEnd()),y=M=x=null}};return T}}function te(n,t,e){if(Math.abs(t)<Wa)return 0>=n;var r=n/t;if(t>0){if(r>e[1])return!1;r>e[0]&&(e[0]=r)}else{if(r<e[0])return!1;r<e[1]&&(e[1]=r)}return!0}function ee(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function re(n){var t=0,e=$a/3,r=ve(n),i=r(t,e);return i.parallels=function(n){return arguments.length?r(t=n[0]*$a/180,e=n[1]*$a/180):[180*(t/$a),180*(e/$a)]},i}function ie(n,t){function e(n,t){var e=Math.sqrt(u-2*i*Math.sin(t))/i;return[e*Math.sin(n*=i),a-e*Math.cos(n)]}var r=Math.sin(n),i=(r+Math.sin(t))/2,u=1+r*(2*i-r),a=Math.sqrt(u)/i;return e.invert=function(n,t){var e=a-t;return[Math.atan2(n,e)/i,I((u-(n*n+e*e)*i*i)/(2*i))]},e}function ue(){function n(n,t){Io+=i*n-r*t,r=n,i=t}var t,e,r,i;$o.point=function(u,a){$o.point=n,t=r=u,e=i=a},$o.lineEnd=function(){n(t,e)}}function ae(n,t){Vo>n&&(Vo=n),n>Zo&&(Zo=n),Xo>t&&(Xo=t),t>Bo&&(Bo=t)}function oe(){function n(n,t){a.push("M",n,",",t,u)}function t(n,t){a.push("M",n,",",t),o.point=e}function e(n,t){a.push("L",n,",",t)}function r(){o.point=n}function i(){a.push("Z")}var u=ce(4.5),a=[],o={point:n,lineStart:function(){o.point=t},lineEnd:r,polygonStart:function(){o.lineEnd=i},polygonEnd:function(){o.lineEnd=r,o.point=n},pointRadius:function(n){return u=ce(n),o},result:function(){if(a.length){var n=a.join("");return a=[],n}}};return o}function ce(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function le(n,t){qo+=n,To+=t,++Co}function se(){function n(n,r){var i=n-t,u=r-e,a=Math.sqrt(i*i+u*u);zo+=a*(t+n)/2,Do+=a*(e+r)/2,jo+=a,le(t=n,e=r)}var t,e;Jo.point=function(r,i){Jo.point=n,le(t=r,e=i)}}function fe(){Jo.point=le}function he(){function n(n,t){var e=n-r,u=t-i,a=Math.sqrt(e*e+u*u);zo+=a*(r+n)/2,Do+=a*(i+t)/2,jo+=a,a=i*n-r*t,Lo+=a*(r+n),Ho+=a*(i+t),Fo+=3*a,le(r=n,i=t)}var t,e,r,i;Jo.point=function(u,a){Jo.point=n,le(t=r=u,e=i=a)},Jo.lineEnd=function(){n(t,e)}}function ge(n){function t(t,e){n.moveTo(t,e),n.arc(t,e,a,0,2*$a)}function e(t,e){n.moveTo(t,e),o.point=r}function r(t,e){n.lineTo(t,e)}function i(){o.point=t}function u(){n.closePath()}var a=4.5,o={point:t,lineStart:function(){o.point=e},lineEnd:i,polygonStart:function(){o.lineEnd=u},polygonEnd:function(){o.lineEnd=i,o.point=t},pointRadius:function(n){return a=n,o},result:s};return o}function pe(n){function t(t){function r(e,r){e=n(e,r),t.point(e[0],e[1])}function i(){M=0/0,S.point=a,t.lineStart()}function a(r,i){var a=Nt([r,i]),o=n(r,i);e(M,x,y,b,_,w,M=o[0],x=o[1],y=r,b=a[0],_=a[1],w=a[2],u,t),t.point(M,x)}function o(){S.point=r,t.lineEnd()}function c(){i(),S.point=l,S.lineEnd=s}function l(n,t){a(f=n,h=t),g=M,p=x,d=b,m=_,v=w,S.point=a}function s(){e(M,x,y,b,_,w,g,p,f,d,m,v,u,t),S.lineEnd=o,o()}var f,h,g,p,d,m,v,y,M,x,b,_,w,S={point:r,lineStart:i,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=c},polygonEnd:function(){t.polygonEnd(),S.lineStart=i}};return S}function e(t,u,a,o,c,l,s,f,h,g,p,d,m,v){var y=s-t,M=f-u,x=y*y+M*M;if(x>4*r&&m--){var b=o+g,_=c+p,w=l+d,S=Math.sqrt(b*b+_*_+w*w),E=Math.asin(w/=S),k=Math.abs(Math.abs(w)-1)<Wa?(a+h)/2:Math.atan2(_,b),A=n(k,E),N=A[0],q=A[1],T=N-t,C=q-u,z=M*T-y*C;(z*z/x>r||Math.abs((y*T+M*C)/x-.5)>.3||i>o*g+c*p+l*d)&&(e(t,u,a,o,c,l,N,q,k,b/=S,_/=S,w,m,v),v.point(N,q),e(N,q,k,b,_,w,s,f,h,g,p,d,m,v))}}var r=.5,i=Math.cos(30*Ga),u=16;return t.precision=function(n){return arguments.length?(u=(r=n*n)>0&&16,t):Math.sqrt(r)},t}function de(n){var t=pe(function(t,e){return n([t*Ka,e*Ka])});return function(n){return n=t(n),{point:function(t,e){n.point(t*Ga,e*Ga)},sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}}function me(n){return ve(function(){return n})()}function ve(n){function t(n){return n=o(n[0]*Ga,n[1]*Ga),[n[0]*h+c,l-n[1]*h]}function e(n){return n=o.invert((n[0]-c)/h,(l-n[1])/h),n&&[n[0]*Ka,n[1]*Ka]}function r(){o=ee(a=xe(v,y,M),u);var n=u(d,m);return c=g-n[0]*h,l=p+n[1]*h,i()}function i(){return s&&(s.valid=!1,s=null),t}var u,a,o,c,l,s,f=pe(function(n,t){return n=u(n,t),[n[0]*h+c,l-n[1]*h]}),h=150,g=480,p=250,d=0,m=0,v=0,y=0,M=0,x=Oo,b=ht,_=null,w=null;return t.stream=function(n){return s&&(s.valid=!1),s=ye(a,x(f(b(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(x=null==n?(_=n,Oo):Qt((_=+n)*Ga),i()):_},t.clipExtent=function(n){return arguments.length?(w=n,b=null==n?ht:ne(n[0][0],n[0][1],n[1][0],n[1][1]),i()):w},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(d=n[0]%360*Ga,m=n[1]%360*Ga,r()):[d*Ka,m*Ka]},t.rotate=function(n){return arguments.length?(v=n[0]%360*Ga,y=n[1]%360*Ga,M=n.length>2?n[2]%360*Ga:0,r()):[v*Ka,y*Ka,M*Ka]},ya.rebind(t,f,"precision"),function(){return u=n.apply(this,arguments),t.invert=u.invert&&e,r()}}function ye(n,t){return{point:function(e,r){r=n(e*Ga,r*Ga),e=r[0],t.point(e>$a?e-2*$a:-$a>e?e+2*$a:e,r[1])},sphere:function(){t.sphere()},lineStart:function(){t.lineStart()},lineEnd:function(){t.lineEnd()},polygonStart:function(){t.polygonStart()},polygonEnd:function(){t.polygonEnd()}}}function Me(n,t){return[n,t]}function xe(n,t,e){return n?t||e?ee(_e(n),we(t,e)):_e(n):t||e?we(t,e):Me}function be(n){return function(t,e){return t+=n,[t>$a?t-2*$a:-$a>t?t+2*$a:t,e]}}function _e(n){var t=be(n);return t.invert=be(-n),t}function we(n,t){function e(n,t){var e=Math.cos(t),o=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*r+o*i;return[Math.atan2(c*u-s*a,o*r-l*i),I(s*u+c*a)]}var r=Math.cos(n),i=Math.sin(n),u=Math.cos(t),a=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),o=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*u-c*a;return[Math.atan2(c*u+l*a,o*r+s*i),I(s*r-o*i)]},e}function Se(n,t){var e=Math.cos(n),r=Math.sin(n);return function(i,u,a,o){null!=i?(i=Ee(e,i),u=Ee(e,u),(a>0?u>i:i>u)&&(i+=2*a*$a)):(i=n+2*a*$a,u=n);for(var c,l=a*t,s=i;a>0?s>u:u>s;s-=l)o.point((c=jt([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],c[1])}}function Ee(n,t){var e=Nt(t);e[0]-=n,Dt(e);var r=U(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Wa)%(2*Math.PI)}function ke(n,t,e){var r=ya.range(n,t-Wa,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function Ae(n,t,e){var r=ya.range(n,t-Wa,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function Ne(n){return n.source}function qe(n){return n.target}function Te(n,t,e,r){var i=Math.cos(t),u=Math.sin(t),a=Math.cos(r),o=Math.sin(r),c=i*Math.cos(n),l=i*Math.sin(n),s=a*Math.cos(e),f=a*Math.sin(e),h=2*Math.asin(Math.sqrt(Z(r-t)+i*a*Z(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*c+t*s,i=e*l+t*f,a=e*u+t*o;return[Math.atan2(i,r)*Ka,Math.atan2(a,Math.sqrt(r*r+i*i))*Ka]}:function(){return[n*Ka,t*Ka]};return p.distance=h,p}function Ce(){function n(n,i){var u=Math.sin(i*=Ga),a=Math.cos(i),o=Math.abs((n*=Ga)-t),c=Math.cos(o);Go+=Math.atan2(Math.sqrt((o=a*Math.sin(o))*o+(o=r*u-e*a*c)*o),e*u+r*a*c),t=n,e=u,r=a}var t,e,r;Ko.point=function(i,u){t=i*Ga,e=Math.sin(u*=Ga),r=Math.cos(u),Ko.point=n},Ko.lineEnd=function(){Ko.point=Ko.lineEnd=s}}function ze(n,t){function e(t,e){var r=Math.cos(t),i=Math.cos(e),u=n(r*i);return[u*i*Math.sin(t),u*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),i=t(r),u=Math.sin(i),a=Math.cos(i);return[Math.atan2(n*u,r*a),Math.asin(r&&e*u/r)]},e}function De(n,t){function e(n,t){var e=Math.abs(Math.abs(t)-$a/2)<Wa?0:a/Math.pow(i(t),u);return[e*Math.sin(u*n),a-e*Math.cos(u*n)]}var r=Math.cos(n),i=function(n){return Math.tan($a/4+n/2)},u=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(i(t)/i(n)),a=r*Math.pow(i(n),u)/u;return u?(e.invert=function(n,t){var e=a-t,r=R(u)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/u,2*Math.atan(Math.pow(a/r,1/u))-$a/2]},e):Le}function je(n,t){function e(n,t){var e=u-t;return[e*Math.sin(i*n),u-e*Math.cos(i*n)]}var r=Math.cos(n),i=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),u=r/i+n;return Math.abs(i)<Wa?Me:(e.invert=function(n,t){var e=u-t;return[Math.atan2(n,e)/i,u-R(i)*Math.sqrt(n*n+e*e)]},e)}function Le(n,t){return[n,Math.log(Math.tan($a/4+t/2))]}function He(n){var t,e=me(n),r=e.scale,i=e.translate,u=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=i.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var a=u.apply(e,arguments);if(a===e){if(t=null==n){var o=$a*r(),c=i();u([[c[0]-o,c[1]-o],[c[0]+o,c[1]+o]])}}else t&&(a=null);return a},e.clipExtent(null)}function Fe(n,t){var e=Math.cos(t)*Math.sin(n);return[Math.log((1+e)/(1-e))/2,Math.atan2(Math.tan(t),Math.cos(n))]}function Pe(n){function t(t){function a(){l.push("M",u(n(s),o))}for(var c,l=[],s=[],f=-1,h=t.length,g=ft(e),p=ft(r);++f<h;)i.call(this,c=t[f],f)?s.push([+g.call(this,c,f),+p.call(this,c,f)]):s.length&&(a(),s=[]);return s.length&&a(),l.length?l.join(""):null}var e=Oe,r=Ye,i=Rt,u=Re,a=u.key,o=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(i=n,t):i},t.interpolate=function(n){return arguments.length?(a="function"==typeof n?u=n:(u=ic.get(n)||Re).key,t):a},t.tension=function(n){return arguments.length?(o=n,t):o},t}function Oe(n){return n[0]}function Ye(n){return n[1]}function Re(n){return n.join("L")}function Ue(n){return Re(n)+"Z"}function Ie(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&i.push("H",r[0]),i.join("")}function Ve(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0]);return i.join("")}function Xe(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1]);return i.join("")}function Ze(n,t){return n.length<4?Re(n):n[1]+We(n.slice(1,n.length-1),Je(n,t))}function Be(n,t){return n.length<3?Re(n):n[0]+We((n.push(n[0]),n),Je([n[n.length-2]].concat(n,[n[1]]),t))}function $e(n,t){return n.length<3?Re(n):n[0]+We(n,Je(n,t))}function We(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Re(n);var e=n.length!=t.length,r="",i=n[0],u=n[1],a=t[0],o=a,c=1;if(e&&(r+="Q"+(u[0]-2*a[0]/3)+","+(u[1]-2*a[1]/3)+","+u[0]+","+u[1],i=n[1],c=2),t.length>1){o=t[1],u=n[c],c++,r+="C"+(i[0]+a[0])+","+(i[1]+a[1])+","+(u[0]-o[0])+","+(u[1]-o[1])+","+u[0]+","+u[1];for(var l=2;l<t.length;l++,c++)u=n[c],o=t[l],r+="S"+(u[0]-o[0])+","+(u[1]-o[1])+","+u[0]+","+u[1]}if(e){var s=n[c];r+="Q"+(u[0]+2*o[0]/3)+","+(u[1]+2*o[1]/3)+","+s[0]+","+s[1]}return r}function Je(n,t){for(var e,r=[],i=(1-t)/2,u=n[0],a=n[1],o=1,c=n.length;++o<c;)e=u,u=a,a=n[o],r.push([i*(a[0]-e[0]),i*(a[1]-e[1])]);return r}function Ge(n){if(n.length<3)return Re(n);var t=1,e=n.length,r=n[0],i=r[0],u=r[1],a=[i,i,i,(r=n[1])[0]],o=[u,u,u,r[1]],c=[i,",",u];for(er(c,a,o);++t<e;)r=n[t],a.shift(),a.push(r[0]),o.shift(),o.push(r[1]),er(c,a,o);for(t=-1;++t<2;)a.shift(),a.push(r[0]),o.shift(),o.push(r[1]),er(c,a,o);return c.join("")}function Ke(n){if(n.length<4)return Re(n);for(var t,e=[],r=-1,i=n.length,u=[0],a=[0];++r<3;)t=n[r],u.push(t[0]),a.push(t[1]);for(e.push(tr(oc,u)+","+tr(oc,a)),--r;++r<i;)t=n[r],u.shift(),u.push(t[0]),a.shift(),a.push(t[1]),er(e,u,a);return e.join("")}function Qe(n){for(var t,e,r=-1,i=n.length,u=i+4,a=[],o=[];++r<4;)e=n[r%i],a.push(e[0]),o.push(e[1]);for(t=[tr(oc,a),",",tr(oc,o)],--r;++r<u;)e=n[r%i],a.shift(),a.push(e[0]),o.shift(),o.push(e[1]),er(t,a,o);return t.join("")}function nr(n,t){var e=n.length-1;if(e)for(var r,i,u=n[0][0],a=n[0][1],o=n[e][0]-u,c=n[e][1]-a,l=-1;++l<=e;)r=n[l],i=l/e,r[0]=t*r[0]+(1-t)*(u+i*o),r[1]=t*r[1]+(1-t)*(a+i*c);return Ge(n)}function tr(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function er(n,t,e){n.push("C",tr(uc,t),",",tr(uc,e),",",tr(ac,t),",",tr(ac,e),",",tr(oc,t),",",tr(oc,e))}function rr(n,t){return(t[1]-n[1])/(t[0]-n[0])}function ir(n){for(var t=0,e=n.length-1,r=[],i=n[0],u=n[1],a=r[0]=rr(i,u);++t<e;)r[t]=(a+(a=rr(i=u,u=n[t+1])))/2;return r[t]=a,r}function ur(n){for(var t,e,r,i,u=[],a=ir(n),o=-1,c=n.length-1;++o<c;)t=rr(n[o],n[o+1]),Math.abs(t)<1e-6?a[o]=a[o+1]=0:(e=a[o]/t,r=a[o+1]/t,i=e*e+r*r,i>9&&(i=3*t/Math.sqrt(i),a[o]=i*e,a[o+1]=i*r));
for(o=-1;++o<=c;)i=(n[Math.min(c,o+1)][0]-n[Math.max(0,o-1)][0])/(6*(1+a[o]*a[o])),u.push([i||0,a[o]*i||0]);return u}function ar(n){return n.length<3?Re(n):n[0]+We(n,ur(n))}function or(n,t,e,r){var i,u,a,o,c,l,s;return i=r[n],u=i[0],a=i[1],i=r[t],o=i[0],c=i[1],i=r[e],l=i[0],s=i[1],(s-a)*(o-u)-(c-a)*(l-u)>0}function cr(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function lr(n,t,e,r){var i=n[0],u=e[0],a=t[0]-i,o=r[0]-u,c=n[1],l=e[1],s=t[1]-c,f=r[1]-l,h=(o*(c-l)-f*(i-u))/(f*a-o*s);return[i+h*a,c+h*s]}function sr(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function fr(n,t){var e={list:n.map(function(n,t){return{index:t,x:n[0],y:n[1]}}).sort(function(n,t){return n.y<t.y?-1:n.y>t.y?1:n.x<t.x?-1:n.x>t.x?1:0}),bottomSite:null},r={list:[],leftEnd:null,rightEnd:null,init:function(){r.leftEnd=r.createHalfEdge(null,"l"),r.rightEnd=r.createHalfEdge(null,"l"),r.leftEnd.r=r.rightEnd,r.rightEnd.l=r.leftEnd,r.list.unshift(r.leftEnd,r.rightEnd)},createHalfEdge:function(n,t){return{edge:n,side:t,vertex:null,l:null,r:null}},insert:function(n,t){t.l=n,t.r=n.r,n.r.l=t,n.r=t},leftBound:function(n){var t=r.leftEnd;do t=t.r;while(t!=r.rightEnd&&i.rightOf(t,n));return t=t.l},del:function(n){n.l.r=n.r,n.r.l=n.l,n.edge=null},right:function(n){return n.r},left:function(n){return n.l},leftRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[n.side]},rightRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[lc[n.side]]}},i={bisect:function(n,t){var e={region:{l:n,r:t},ep:{l:null,r:null}},r=t.x-n.x,i=t.y-n.y,u=r>0?r:-r,a=i>0?i:-i;return e.c=n.x*r+n.y*i+.5*(r*r+i*i),u>a?(e.a=1,e.b=i/r,e.c/=r):(e.b=1,e.a=r/i,e.c/=i),e},intersect:function(n,t){var e=n.edge,r=t.edge;if(!e||!r||e.region.r==r.region.r)return null;var i=e.a*r.b-e.b*r.a;if(Math.abs(i)<1e-10)return null;var u,a,o=(e.c*r.b-r.c*e.b)/i,c=(r.c*e.a-e.c*r.a)/i,l=e.region.r,s=r.region.r;l.y<s.y||l.y==s.y&&l.x<s.x?(u=n,a=e):(u=t,a=r);var f=o>=a.region.r.x;return f&&"l"===u.side||!f&&"r"===u.side?null:{x:o,y:c}},rightOf:function(n,t){var e=n.edge,r=e.region.r,i=t.x>r.x;if(i&&"l"===n.side)return 1;if(!i&&"r"===n.side)return 0;if(1===e.a){var u=t.y-r.y,a=t.x-r.x,o=0,c=0;if(!i&&e.b<0||i&&e.b>=0?c=o=u>=e.b*a:(c=t.x+t.y*e.b>e.c,e.b<0&&(c=!c),c||(o=1)),!o){var l=r.x-e.region.l.x;c=e.b*(a*a-u*u)<l*u*(1+2*a/l+e.b*e.b),e.b<0&&(c=!c)}}else{var s=e.c-e.a*t.x,f=t.y-s,h=t.x-r.x,g=s-r.y;c=f*f>h*h+g*g}return"l"===n.side?c:!c},endPoint:function(n,e,r){n.ep[e]=r,n.ep[lc[e]]&&t(n)},distance:function(n,t){var e=n.x-t.x,r=n.y-t.y;return Math.sqrt(e*e+r*r)}},u={list:[],insert:function(n,t,e){n.vertex=t,n.ystar=t.y+e;for(var r=0,i=u.list,a=i.length;a>r;r++){var o=i[r];if(!(n.ystar>o.ystar||n.ystar==o.ystar&&t.x>o.vertex.x))break}i.splice(r,0,n)},del:function(n){for(var t=0,e=u.list,r=e.length;r>t&&e[t]!=n;++t);e.splice(t,1)},empty:function(){return 0===u.list.length},nextEvent:function(n){for(var t=0,e=u.list,r=e.length;r>t;++t)if(e[t]==n)return e[t+1];return null},min:function(){var n=u.list[0];return{x:n.vertex.x,y:n.ystar}},extractMin:function(){return u.list.shift()}};r.init(),e.bottomSite=e.list.shift();for(var a,o,c,l,s,f,h,g,p,d,m,v,y,M=e.list.shift();;)if(u.empty()||(a=u.min()),M&&(u.empty()||M.y<a.y||M.y==a.y&&M.x<a.x))o=r.leftBound(M),c=r.right(o),h=r.rightRegion(o),v=i.bisect(h,M),f=r.createHalfEdge(v,"l"),r.insert(o,f),d=i.intersect(o,f),d&&(u.del(o),u.insert(o,d,i.distance(d,M))),o=f,f=r.createHalfEdge(v,"r"),r.insert(o,f),d=i.intersect(f,c),d&&u.insert(f,d,i.distance(d,M)),M=e.list.shift();else{if(u.empty())break;o=u.extractMin(),l=r.left(o),c=r.right(o),s=r.right(c),h=r.leftRegion(o),g=r.rightRegion(c),m=o.vertex,i.endPoint(o.edge,o.side,m),i.endPoint(c.edge,c.side,m),r.del(o),u.del(c),r.del(c),y="l",h.y>g.y&&(p=h,h=g,g=p,y="r"),v=i.bisect(h,g),f=r.createHalfEdge(v,y),r.insert(l,f),i.endPoint(v,lc[y],m),d=i.intersect(l,f),d&&(u.del(l),u.insert(l,d,i.distance(d,h))),d=i.intersect(f,s),d&&u.insert(f,d,i.distance(d,h))}for(o=r.right(r.leftEnd);o!=r.rightEnd;o=r.right(o))t(o.edge)}function hr(n){return n.x}function gr(n){return n.y}function pr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function dr(n,t,e,r,i,u){if(!n(t,e,r,i,u)){var a=.5*(e+i),o=.5*(r+u),c=t.nodes;c[0]&&dr(n,c[0],e,r,a,o),c[1]&&dr(n,c[1],a,r,i,o),c[2]&&dr(n,c[2],e,o,a,u),c[3]&&dr(n,c[3],a,o,i,u)}}function mr(n,t){n=ya.rgb(n),t=ya.rgb(t);var e=n.r,r=n.g,i=n.b,u=t.r-e,a=t.g-r,o=t.b-i;return function(n){return"#"+ut(Math.round(e+u*n))+ut(Math.round(r+a*n))+ut(Math.round(i+o*n))}}function vr(n,t){var e,r={},i={};for(e in n)e in t?r[e]=xr(n[e],t[e]):i[e]=n[e];for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n);return i}}function yr(n,t){return t-=n=+n,function(e){return n+t*e}}function Mr(n,t){var e,r,i,u,a,o=0,c=0,l=[],s=[];for(n+="",t+="",sc.lastIndex=0,r=0;e=sc.exec(t);++r)e.index&&l.push(t.substring(o,c=e.index)),s.push({i:l.length,x:e[0]}),l.push(null),o=sc.lastIndex;for(o<t.length&&l.push(t.substring(o)),r=0,u=s.length;(e=sc.exec(n))&&u>r;++r)if(a=s[r],a.x==e[0]){if(a.i)if(null==l[a.i+1])for(l[a.i-1]+=a.x,l.splice(a.i,1),i=r+1;u>i;++i)s[i].i--;else for(l[a.i-1]+=a.x+l[a.i+1],l.splice(a.i,2),i=r+1;u>i;++i)s[i].i-=2;else if(null==l[a.i+1])l[a.i]=a.x;else for(l[a.i]=a.x+l[a.i+1],l.splice(a.i+1,1),i=r+1;u>i;++i)s[i].i--;s.splice(r,1),u--,r--}else a.x=yr(parseFloat(e[0]),parseFloat(a.x));for(;u>r;)a=s.pop(),null==l[a.i+1]?l[a.i]=a.x:(l[a.i]=a.x+l[a.i+1],l.splice(a.i+1,1)),u--;return 1===l.length?null==l[0]?(a=s[0].x,function(n){return a(n)+""}):function(){return t}:function(n){for(r=0;u>r;++r)l[(a=s[r]).i]=a.x(n);return l.join("")}}function xr(n,t){for(var e,r=ya.interpolators.length;--r>=0&&!(e=ya.interpolators[r](n,t)););return e}function br(n,t){var e,r=[],i=[],u=n.length,a=t.length,o=Math.min(n.length,t.length);for(e=0;o>e;++e)r.push(xr(n[e],t[e]));for(;u>e;++e)i[e]=n[e];for(;a>e;++e)i[e]=t[e];return function(n){for(e=0;o>e;++e)i[e]=r[e](n);return i}}function _r(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function wr(n){return function(t){return 1-n(1-t)}}function Sr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function Er(n){return n*n}function kr(n){return n*n*n}function Ar(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function Nr(n){return function(t){return Math.pow(t,n)}}function qr(n){return 1-Math.cos(n*$a/2)}function Tr(n){return Math.pow(2,10*(n-1))}function Cr(n){return 1-Math.sqrt(1-n*n)}function zr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/(2*$a)*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,10*-r)*Math.sin(2*(r-e)*$a/t)}}function Dr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function jr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Lr(n,t){n=ya.hcl(n),t=ya.hcl(t);var e=n.h,r=n.c,i=n.l,u=t.h-e,a=t.c-r,o=t.l-i;return isNaN(a)&&(a=0,r=isNaN(r)?t.c:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return W(e+u*n,r+a*n,i+o*n)+""}}function Hr(n,t){n=ya.hsl(n),t=ya.hsl(t);var e=n.h,r=n.s,i=n.l,u=t.h-e,a=t.s-r,o=t.l-i;return isNaN(a)&&(a=0,r=isNaN(r)?t.s:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return Y(e+u*n,r+a*n,i+o*n)+""}}function Fr(n,t){n=ya.lab(n),t=ya.lab(t);var e=n.l,r=n.a,i=n.b,u=t.l-e,a=t.a-r,o=t.b-i;return function(n){return K(e+u*n,r+a*n,i+o*n)+""}}function Pr(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Or(n){var t=[n.a,n.b],e=[n.c,n.d],r=Rr(t),i=Yr(t,e),u=Rr(Ur(e,t,-i))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Ka,this.translate=[n.e,n.f],this.scale=[r,u],this.skew=u?Math.atan2(i,u)*Ka:0}function Yr(n,t){return n[0]*t[0]+n[1]*t[1]}function Rr(n){var t=Math.sqrt(Yr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Ur(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Ir(n,t){var e,r=[],i=[],u=ya.transform(n),a=ya.transform(t),o=u.translate,c=a.translate,l=u.rotate,s=a.rotate,f=u.skew,h=a.skew,g=u.scale,p=a.scale;return o[0]!=c[0]||o[1]!=c[1]?(r.push("translate(",null,",",null,")"),i.push({i:1,x:yr(o[0],c[0])},{i:3,x:yr(o[1],c[1])})):c[0]||c[1]?r.push("translate("+c+")"):r.push(""),l!=s?(l-s>180?s+=360:s-l>180&&(l+=360),i.push({i:r.push(r.pop()+"rotate(",null,")")-2,x:yr(l,s)})):s&&r.push(r.pop()+"rotate("+s+")"),f!=h?i.push({i:r.push(r.pop()+"skewX(",null,")")-2,x:yr(f,h)}):h&&r.push(r.pop()+"skewX("+h+")"),g[0]!=p[0]||g[1]!=p[1]?(e=r.push(r.pop()+"scale(",null,",",null,")"),i.push({i:e-4,x:yr(g[0],p[0])},{i:e-2,x:yr(g[1],p[1])})):(1!=p[0]||1!=p[1])&&r.push(r.pop()+"scale("+p+")"),e=i.length,function(n){for(var t,u=-1;++u<e;)r[(t=i[u]).i]=t.x(n);return r.join("")}}function Vr(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return(e-n)*t}}function Xr(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return Math.max(0,Math.min(1,(e-n)*t))}}function Zr(n){for(var t=n.source,e=n.target,r=$r(t,e),i=[t];t!==r;)t=t.parent,i.push(t);for(var u=i.length;e!==r;)i.splice(u,0,e),e=e.parent;return i}function Br(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function $r(n,t){if(n===t)return n;for(var e=Br(n),r=Br(t),i=e.pop(),u=r.pop(),a=null;i===u;)a=i,i=e.pop(),u=r.pop();return a}function Wr(n){n.fixed|=2}function Jr(n){n.fixed&=-7}function Gr(n){n.fixed|=4,n.px=n.x,n.py=n.y}function Kr(n){n.fixed&=-5}function Qr(n,t,e){var r=0,i=0;if(n.charge=0,!n.leaf)for(var u,a=n.nodes,o=a.length,c=-1;++c<o;)u=a[c],null!=u&&(Qr(u,t,e),n.charge+=u.charge,r+=u.charge*u.cx,i+=u.charge*u.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var l=t*e[n.point.index];n.charge+=n.pointCharge=l,r+=l*n.point.x,i+=l*n.point.y}n.cx=r/n.charge,n.cy=i/n.charge}function ni(n,t){return ya.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=ii,n}function ti(n){return n.children}function ei(n){return n.value}function ri(n,t){return t.value-n.value}function ii(n){return ya.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function ui(n){return n.x}function ai(n){return n.y}function oi(n,t,e){n.y0=t,n.y=e}function ci(n){return ya.range(n.length)}function li(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function si(n){for(var t,e=1,r=0,i=n[0][1],u=n.length;u>e;++e)(t=n[e][1])>i&&(r=e,i=t);return r}function fi(n){return n.reduce(hi,0)}function hi(n,t){return n+t[1]}function gi(n,t){return pi(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function pi(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,u=[];++e<=t;)u[e]=i*e+r;return u}function di(n){return[ya.min(n),ya.max(n)]}function mi(n,t){return n.parent==t.parent?1:2}function vi(n){var t=n.children;return t&&t.length?t[0]:n._tree.thread}function yi(n){var t,e=n.children;return e&&(t=e.length)?e[t-1]:n._tree.thread}function Mi(n,t){var e=n.children;if(e&&(i=e.length))for(var r,i,u=-1;++u<i;)t(r=Mi(e[u],t),n)>0&&(n=r);return n}function xi(n,t){return n.x-t.x}function bi(n,t){return t.x-n.x}function _i(n,t){return n.depth-t.depth}function wi(n,t){function e(n,r){var i=n.children;if(i&&(a=i.length))for(var u,a,o=null,c=-1;++c<a;)u=i[c],e(u,o),o=u;t(n,r)}e(n,null)}function Si(n){for(var t,e=0,r=0,i=n.children,u=i.length;--u>=0;)t=i[u]._tree,t.prelim+=e,t.mod+=e,e+=t.shift+(r+=t.change)}function Ei(n,t,e){n=n._tree,t=t._tree;var r=e/(t.number-n.number);n.change+=r,t.change-=r,t.shift+=e,t.prelim+=e,t.mod+=e}function ki(n,t,e){return n._tree.ancestor.parent==t.parent?n._tree.ancestor:e}function Ai(n,t){return n.value-t.value}function Ni(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function qi(n,t){n._pack_next=t,t._pack_prev=n}function Ti(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r;return.999*i*i>e*e+r*r}function Ci(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(l=e.length)){var e,r,i,u,a,o,c,l,s=1/0,f=-1/0,h=1/0,g=-1/0;if(e.forEach(zi),r=e[0],r.x=-r.r,r.y=0,t(r),l>1&&(i=e[1],i.x=i.r,i.y=0,t(i),l>2))for(u=e[2],Li(r,i,u),t(u),Ni(r,u),r._pack_prev=u,Ni(u,i),i=r._pack_next,a=3;l>a;a++){Li(r,i,u=e[a]);var p=0,d=1,m=1;for(o=i._pack_next;o!==i;o=o._pack_next,d++)if(Ti(o,u)){p=1;break}if(1==p)for(c=r._pack_prev;c!==o._pack_prev&&!Ti(c,u);c=c._pack_prev,m++);p?(m>d||d==m&&i.r<r.r?qi(r,i=o):qi(r=c,i),a--):(Ni(r,u),i=u,t(u))}var v=(s+f)/2,y=(h+g)/2,M=0;for(a=0;l>a;a++)u=e[a],u.x-=v,u.y-=y,M=Math.max(M,u.r+Math.sqrt(u.x*u.x+u.y*u.y));n.r=M,e.forEach(Di)}}function zi(n){n._pack_next=n._pack_prev=n}function Di(n){delete n._pack_next,delete n._pack_prev}function ji(n,t,e,r){var i=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,i)for(var u=-1,a=i.length;++u<a;)ji(i[u],t,e,r)}function Li(n,t,e){var r=n.r+e.r,i=t.x-n.x,u=t.y-n.y;if(r&&(i||u)){var a=t.r+e.r,o=i*i+u*u;a*=a,r*=r;var c=.5+(r-a)/(2*o),l=Math.sqrt(Math.max(0,2*a*(r+o)-(r-=o)*r-a*a))/(2*o);e.x=n.x+c*i+l*u,e.y=n.y+c*u-l*i}else e.x=n.x+r,e.y=n.y}function Hi(n){return 1+ya.max(n,function(n){return n.y})}function Fi(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Pi(n){var t=n.children;return t&&t.length?Pi(t[0]):n}function Oi(n){var t,e=n.children;return e&&(t=e.length)?Oi(e[t-1]):n}function Yi(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Ri(n,t){var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],u=n.dy-t[0]-t[2];return 0>i&&(e+=i/2,i=0),0>u&&(r+=u/2,u=0),{x:e,y:r,dx:i,dy:u}}function Ui(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Ii(n){return n.rangeExtent?n.rangeExtent():Ui(n.range())}function Vi(n,t,e,r){var i=e(n[0],n[1]),u=r(t[0],t[1]);return function(n){return u(i(n))}}function Xi(n,t){var e,r=0,i=n.length-1,u=n[r],a=n[i];return u>a&&(e=r,r=i,i=e,e=u,u=a,a=e),n[r]=t.floor(u),n[i]=t.ceil(a),n}function Zi(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:xc}function Bi(n,t,e,r){var i=[],u=[],a=0,o=Math.min(n.length,t.length)-1;for(n[o]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<=o;)i.push(e(n[a-1],n[a])),u.push(r(t[a-1],t[a]));return function(t){var e=ya.bisect(n,t,1,o)-1;return u[e](i[e](t))}}function $i(n,t,e,r){function i(){var i=Math.min(n.length,t.length)>2?Bi:Vi,c=r?Xr:Vr;return a=i(n,t,c,e),o=i(t,n,c,xr),u}function u(n){return a(n)}var a,o;return u.invert=function(n){return o(n)},u.domain=function(t){return arguments.length?(n=t.map(Number),i()):n},u.range=function(n){return arguments.length?(t=n,i()):t},u.rangeRound=function(n){return u.range(n).interpolate(Pr)},u.clamp=function(n){return arguments.length?(r=n,i()):r},u.interpolate=function(n){return arguments.length?(e=n,i()):e},u.ticks=function(t){return Qi(n,t)},u.tickFormat=function(t,e){return nu(n,t,e)},u.nice=function(t){return Ji(n,t),i()},u.copy=function(){return $i(n,t,e,r)},i()}function Wi(n,t){return ya.rebind(n,t,"range","rangeRound","interpolate","clamp")}function Ji(n,t){return Xi(n,Zi(t?Ki(n,t)[2]:Gi(n)))}function Gi(n){var t=Ui(n),e=t[1]-t[0];return Math.pow(10,Math.round(Math.log(e)/Math.LN10)-1)}function Ki(n,t){var e=Ui(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),u=t/r*i;return.15>=u?i*=10:.35>=u?i*=5:.75>=u&&(i*=2),e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}function Qi(n,t){return ya.range.apply(ya,Ki(n,t))}function nu(n,t,e){var r=-Math.floor(Math.log(Ki(n,t)[2])/Math.LN10+.01);return ya.format(e?e.replace(vo,function(n,t,e,i,u,a,o,c,l,s){return[t,e,i,u,a,o,c,l||"."+(r-2*("%"===s)),s].join("")}):",."+r+"f")}function tu(n,t,e,r,i){function u(t){return n(e(t))}return u.invert=function(t){return r(n.invert(t))},u.domain=function(t){return arguments.length?(t[0]<0?(e=iu,r=uu):(e=eu,r=ru),n.domain((i=t.map(Number)).map(e)),u):i},u.base=function(n){return arguments.length?(t=+n,u):t},u.nice=function(){function r(n){return Math.pow(t,Math.floor(Math.log(n)/Math.log(t)))}function a(n){return Math.pow(t,Math.ceil(Math.log(n)/Math.log(t)))}return n.domain(Xi(i,e===eu?{floor:r,ceil:a}:{floor:function(n){return-a(-n)},ceil:function(n){return-r(-n)}}).map(e)),u},u.ticks=function(){var i=Ui(n.domain()),u=[];if(i.every(isFinite)){var a=Math.log(t),o=Math.floor(i[0]/a),c=Math.ceil(i[1]/a),l=r(i[0]),s=r(i[1]),f=t%1?2:t;if(e===iu)for(u.push(-Math.pow(t,-o));o++<c;)for(var h=f-1;h>0;h--)u.push(-Math.pow(t,-o)*h);else{for(;c>o;o++)for(var h=1;f>h;h++)u.push(Math.pow(t,o)*h);u.push(Math.pow(t,o))}for(o=0;u[o]<l;o++);for(c=u.length;u[c-1]>s;c--);u=u.slice(o,c)}return u},u.tickFormat=function(n,i){if(!arguments.length)return bc;arguments.length<2?i=bc:"function"!=typeof i&&(i=ya.format(i));var a,o=Math.log(t),c=Math.max(.1,n/u.ticks().length),l=e===iu?(a=-1e-12,Math.floor):(a=1e-12,Math.ceil);return function(n){return n/r(o*l(e(n)/o+a))<=c?i(n):""}},u.copy=function(){return tu(n.copy(),t,e,r,i)},Wi(u,n)}function eu(n){return Math.log(0>n?0:n)}function ru(n){return Math.exp(n)}function iu(n){return-Math.log(n>0?0:-n)}function uu(n){return-Math.exp(-n)}function au(n,t,e){function r(t){return n(i(t))}var i=ou(t),u=ou(1/t);return r.invert=function(t){return u(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(i)),r):e},r.ticks=function(n){return Qi(e,n)},r.tickFormat=function(n,t){return nu(e,n,t)},r.nice=function(n){return r.domain(Ji(e,n))},r.exponent=function(a){return arguments.length?(i=ou(t=a),u=ou(1/t),n.domain(e.map(i)),r):t},r.copy=function(){return au(n.copy(),t,e)},Wi(r,n)}function ou(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function cu(n,t){function e(t){return a[((u.get(t)||u.set(t,n.push(t)))-1)%a.length]}function r(t,e){return ya.range(n.length).map(function(n){return t+e*n})}var u,a,o;return e.domain=function(r){if(!arguments.length)return n;n=[],u=new i;for(var a,o=-1,c=r.length;++o<c;)u.has(a=r[o])||u.set(a,n.push(a));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(a=n,o=0,t={t:"range",a:arguments},e):a},e.rangePoints=function(i,u){arguments.length<2&&(u=0);var c=i[0],l=i[1],s=(l-c)/(Math.max(1,n.length-1)+u);return a=r(n.length<2?(c+l)/2:c+s*u/2,s),o=0,t={t:"rangePoints",a:arguments},e},e.rangeBands=function(i,u,c){arguments.length<2&&(u=0),arguments.length<3&&(c=u);var l=i[1]<i[0],s=i[l-0],f=i[1-l],h=(f-s)/(n.length-u+2*c);return a=r(s+h*c,h),l&&a.reverse(),o=h*(1-u),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(i,u,c){arguments.length<2&&(u=0),arguments.length<3&&(c=u);var l=i[1]<i[0],s=i[l-0],f=i[1-l],h=Math.floor((f-s)/(n.length-u+2*c)),g=f-s-(n.length-u)*h;return a=r(s+Math.round(g/2),h),l&&a.reverse(),o=Math.round(h*(1-u)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Ui(t.a[0])},e.copy=function(){return cu(n,t)},e.domain(n)}function lu(n,t){function e(){var e=0,u=t.length;for(i=[];++e<u;)i[e-1]=ya.quantile(n,e/u);return r}function r(n){return isNaN(n=+n)?void 0:t[ya.bisect(i,n)]}var i;return r.domain=function(t){return arguments.length?(n=t.filter(function(n){return!isNaN(n)}).sort(ya.ascending),e()):n},r.range=function(n){return arguments.length?(t=n,e()):t},r.quantiles=function(){return i},r.copy=function(){return lu(n,t)},e()}function su(n,t,e){function r(t){return e[Math.max(0,Math.min(a,Math.floor(u*(t-n))))]}function i(){return u=e.length/(t-n),a=e.length-1,r}var u,a;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],i()):[n,t]},r.range=function(n){return arguments.length?(e=n,i()):e},r.copy=function(){return su(n,t,e)},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?0/0:t/u+n,[t,t+1/u]},i()}function fu(n,t){function e(e){return e>=e?t[ya.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return fu(n,t)},e}function hu(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return Qi(n,t)},t.tickFormat=function(t,e){return nu(n,t,e)},t.copy=function(){return hu(n)},t}function gu(n){return n.innerRadius}function pu(n){return n.outerRadius}function du(n){return n.startAngle}function mu(n){return n.endAngle}function vu(n){for(var t,e,r,i=-1,u=n.length;++i<u;)t=n[i],e=t[0],r=t[1]+kc,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function yu(n){function t(t){function c(){d.push("M",o(n(v),f),s,l(n(m.reverse()),f),"Z")}for(var h,g,p,d=[],m=[],v=[],y=-1,M=t.length,x=ft(e),b=ft(i),_=e===r?function(){return g}:ft(r),w=i===u?function(){return p}:ft(u);++y<M;)a.call(this,h=t[y],y)?(m.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),v.push([+_.call(this,h,y),+w.call(this,h,y)])):m.length&&(c(),m=[],v=[]);return m.length&&c(),d.length?d.join(""):null}var e=Oe,r=Oe,i=0,u=Ye,a=Rt,o=Re,c=o.key,l=o,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(i=u=n,t):u},t.y0=function(n){return arguments.length?(i=n,t):i},t.y1=function(n){return arguments.length?(u=n,t):u},t.defined=function(n){return arguments.length?(a=n,t):a},t.interpolate=function(n){return arguments.length?(c="function"==typeof n?o=n:(o=ic.get(n)||Re).key,l=o.reverse||o,s=o.closed?"M":"L",t):c},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Mu(n){return n.radius}function xu(n){return[n.x,n.y]}function bu(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]+kc;return[e*Math.cos(r),e*Math.sin(r)]}}function _u(){return 64}function wu(){return"circle"}function Su(n){var t=Math.sqrt(n/$a);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Eu(n,t){return za(n,zc),n.id=t,n}function ku(n,t,e,r){var i=n.id;return T(n,"function"==typeof e?function(n,u,a){n.__transition__[i].tween.set(t,r(e.call(n,n.__data__,u,a)))}:(e=r(e),function(n){n.__transition__[i].tween.set(t,e)}))}function Au(n){return null==n&&(n=""),function(){this.textContent=n}}function Nu(n,t,e,r){var u=n.__transition__||(n.__transition__={active:0,count:0}),a=u[e];if(!a){var o=r.time;return a=u[e]={tween:new i,event:ya.dispatch("start","end"),time:o,ease:r.ease,delay:r.delay,duration:r.duration},++u.count,ya.timer(function(r){function i(r){return u.active>e?l():(u.active=e,h.start.call(n,s,t),a.tween.forEach(function(e,r){(r=r.call(n,s,t))&&d.push(r)}),c(r)||ya.timer(c,0,o),1)}function c(r){if(u.active!==e)return l();for(var i=(r-g)/p,a=f(i),o=d.length;o>0;)d[--o].call(n,a);return i>=1?(l(),h.end.call(n,s,t),1):void 0}function l(){return--u.count?delete u[e]:delete n.__transition__,1}var s=n.__data__,f=a.ease,h=a.event,g=a.delay,p=a.duration,d=[];return r>=g?i(r):ya.timer(i,g,o),1},0,o),a}}function qu(n,t){n.attr("transform",function(n){return"translate("+t(n)+",0)"})}function Tu(n,t){n.attr("transform",function(n){return"translate(0,"+t(n)+")"})}function Cu(n,t,e){if(r=[],e&&t.length>1){for(var r,i,u,a=Ui(n.domain()),o=-1,c=t.length,l=(t[1]-t[0])/++e;++o<c;)for(i=e;--i>0;)(u=+t[o]-i*l)>=a[0]&&r.push(u);for(--o,i=0;++i<e&&(u=+t[o]+i*l)<a[1];)r.push(u)}return r}function zu(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function Du(n,t,e){function r(t){var e=n(t),r=u(e,1);return r-t>t-e?e:r}function i(e){return t(e=n(new Oc(e-1)),1),e}function u(n,e){return t(n=new Oc(+n),e),n}function a(n,r,u){var a=i(n),o=[];if(u>1)for(;r>a;)e(a)%u||o.push(new Date(+a)),t(a,1);else for(;r>a;)o.push(new Date(+a)),t(a,1);return o}function o(n,t,e){try{Oc=zu;var r=new zu;return r._=n,a(r,t,e)}finally{Oc=Date}}n.floor=n,n.round=r,n.ceil=i,n.offset=u,n.range=a;var c=n.utc=ju(n);return c.floor=c,c.round=ju(r),c.ceil=ju(i),c.offset=ju(u),c.range=o,n}function ju(n){return function(t,e){try{Oc=zu;var r=new zu;return r._=t,n(r,e)._}finally{Oc=Date}}}function Lu(n,t,e,r){for(var i,u,a=0,o=t.length,c=e.length;o>a;){if(r>=c)return-1;if(i=t.charCodeAt(a++),37===i){if(u=al[t.charAt(a++)],!u||(r=u(n,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function Hu(n){return new RegExp("^(?:"+n.map(ya.requote).join("|")+")","i")}function Fu(n){for(var t=new i,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function Pu(n,t,e){var r=0>n?"-":"",i=(r?-n:n)+"",u=i.length;return r+(e>u?new Array(e-u+1).join(t)+i:i)}function Ou(n,t,e){Gc.lastIndex=0;var r=Gc.exec(t.substring(e));return r?(n.w=Kc.get(r[0].toLowerCase()),e+r[0].length):-1}function Yu(n,t,e){Wc.lastIndex=0;var r=Wc.exec(t.substring(e));return r?(n.w=Jc.get(r[0].toLowerCase()),e+r[0].length):-1}function Ru(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Uu(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e));return r?(n.U=+r[0],e+r[0].length):-1}function Iu(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e));return r?(n.W=+r[0],e+r[0].length):-1}function Vu(n,t,e){tl.lastIndex=0;var r=tl.exec(t.substring(e));return r?(n.m=el.get(r[0].toLowerCase()),e+r[0].length):-1}function Xu(n,t,e){Qc.lastIndex=0;var r=Qc.exec(t.substring(e));return r?(n.m=nl.get(r[0].toLowerCase()),e+r[0].length):-1}function Zu(n,t,e){return Lu(n,ul.c.toString(),t,e)}function Bu(n,t,e){return Lu(n,ul.x.toString(),t,e)}function $u(n,t,e){return Lu(n,ul.X.toString(),t,e)}function Wu(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Ju(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+2));return r?(n.y=Gu(+r[0]),e+r[0].length):-1}function Gu(n){return n+(n>68?1900:2e3)}function Ku(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function Qu(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function na(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function ta(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ea(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function ra(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ia(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ua(n,t,e){var r=cl.get(t.substring(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}function aa(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=~~(Math.abs(t)/60),i=Math.abs(t)%60;return e+Pu(r,"0",2)+Pu(i,"0",2)}function oa(n,t,e){rl.lastIndex=0;var r=rl.exec(t.substring(e,e+1));return r?e+r[0].length:-1}function ca(n){return n.toISOString()}function la(n,t,e){function r(t){return n(t)}return r.invert=function(t){return sa(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(sa)},r.nice=function(n){return r.domain(Xi(r.domain(),n))},r.ticks=function(e,i){var u=Ui(r.domain());if("function"!=typeof e){var a=u[1]-u[0],o=a/e,c=ya.bisect(sl,o);if(c==sl.length)return t.year(u,e);if(!c)return n.ticks(e).map(sa);Math.log(o/sl[c-1])<Math.log(sl[c]/o)&&--c,e=t[c],i=e[1],e=e[0].range}return e(u[0],new Date(+u[1]+1),i)},r.tickFormat=function(){return e},r.copy=function(){return la(n.copy(),t,e)},Wi(r,n)}function sa(n){return new Date(n)}function fa(n){return function(t){for(var e=n.length-1,r=n[e];!r[1](t);)r=n[--e];return r[0](t)}}function ha(n){var t=new Date(n,0,1);return t.setFullYear(n),t}function ga(n){var t=n.getFullYear(),e=ha(t),r=ha(t+1);return t+(n-e)/(r-e)}function pa(n){var t=new Date(Date.UTC(n,0,1));return t.setUTCFullYear(n),t}function da(n){var t=n.getUTCFullYear(),e=pa(t),r=pa(t+1);return t+(n-e)/(r-e)}function ma(n){return JSON.parse(n.responseText)}function va(n){var t=Ma.createRange();return t.selectNode(Ma.body),t.createContextualFragment(n.responseText)}var ya={version:"3.2.3"};Date.now||(Date.now=function(){return+new Date});var Ma=document,xa=Ma.documentElement,ba=window;try{Ma.createElement("div").style.setProperty("opacity",0,"")}catch(_a){var wa=ba.CSSStyleDeclaration.prototype,Sa=wa.setProperty;wa.setProperty=function(n,t,e){Sa.call(this,n,t+"",e)}}ya.ascending=function(n,t){return t>n?-1:n>t?1:n>=t?0:0/0},ya.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:0/0},ya.min=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u&&!(null!=(e=n[i])&&e>=e);)e=void 0;for(;++i<u;)null!=(r=n[i])&&e>r&&(e=r)}else{for(;++i<u&&!(null!=(e=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<u;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e},ya.max=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u&&!(null!=(e=n[i])&&e>=e);)e=void 0;for(;++i<u;)null!=(r=n[i])&&r>e&&(e=r)}else{for(;++i<u&&!(null!=(e=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<u;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e},ya.extent=function(n,t){var e,r,i,u=-1,a=n.length;if(1===arguments.length){for(;++u<a&&!(null!=(e=i=n[u])&&e>=e);)e=i=void 0;for(;++u<a;)null!=(r=n[u])&&(e>r&&(e=r),r>i&&(i=r))}else{for(;++u<a&&!(null!=(e=i=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<a;)null!=(r=t.call(n,n[u],u))&&(e>r&&(e=r),r>i&&(i=r))}return[e,i]},ya.sum=function(n,t){var e,r=0,i=n.length,u=-1;if(1===arguments.length)for(;++u<i;)isNaN(e=+n[u])||(r+=e);else for(;++u<i;)isNaN(e=+t.call(n,n[u],u))||(r+=e);return r},ya.mean=function(t,e){var r,i=t.length,u=0,a=-1,o=0;if(1===arguments.length)for(;++a<i;)n(r=t[a])&&(u+=(r-u)/++o);else for(;++a<i;)n(r=e.call(t,t[a],a))&&(u+=(r-u)/++o);return o?u:void 0},ya.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],u=e-r;return u?i+u*(n[r]-i):i},ya.median=function(t,e){return arguments.length>1&&(t=t.map(e)),t=t.filter(n),t.length?ya.quantile(t.sort(ya.ascending),.5):void 0},ya.bisector=function(n){return{left:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;n.call(t,t[u],u)<e?r=u+1:i=u}return r},right:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;e<n.call(t,t[u],u)?i=u:r=u+1}return r}}};var Ea=ya.bisector(function(n){return n});ya.bisectLeft=Ea.left,ya.bisect=ya.bisectRight=Ea.right,ya.shuffle=function(n){for(var t,e,r=n.length;r;)e=0|Math.random()*r--,t=n[r],n[r]=n[e],n[e]=t;return n},ya.permute=function(n,t){for(var e=[],r=-1,i=t.length;++r<i;)e[r]=n[t[r]];return e},ya.zip=function(){if(!(i=arguments.length))return[];for(var n=-1,e=ya.min(arguments,t),r=new Array(e);++n<e;)for(var i,u=-1,a=r[n]=new Array(i);++u<i;)a[u]=arguments[u][n];return r},ya.transpose=function(n){return ya.zip.apply(ya,n)},ya.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ya.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ya.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ya.merge=function(n){return Array.prototype.concat.apply([],n)},ya.range=function(n,t,r){if(arguments.length<3&&(r=1,arguments.length<2&&(t=n,n=0)),1/0===(t-n)/r)throw new Error("infinite range");var i,u=[],a=e(Math.abs(r)),o=-1;if(n*=a,t*=a,r*=a,0>r)for(;(i=n+r*++o)>t;)u.push(i/a);else for(;(i=n+r*++o)<t;)u.push(i/a);return u},ya.map=function(n){var t=new i;for(var e in n)t.set(e,n[e]);return t},r(i,{has:function(n){return ka+n in this},get:function(n){return this[ka+n]},set:function(n,t){return this[ka+n]=t},remove:function(n){return n=ka+n,n in this&&delete this[n]},keys:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},values:function(){var n=[];return this.forEach(function(t,e){n.push(e)}),n},entries:function(){var n=[];return this.forEach(function(t,e){n.push({key:t,value:e})}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Aa&&n.call(this,t.substring(1),this[t])}});var ka="\0",Aa=ka.charCodeAt(0);ya.nest=function(){function n(t,o,c){if(c>=a.length)return r?r.call(u,o):e?o.sort(e):o;for(var l,s,f,h,g=-1,p=o.length,d=a[c++],m=new i;++g<p;)(h=m.get(l=d(s=o[g])))?h.push(s):m.set(l,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,c))
}):(s={},f=function(e,r){s[e]=n(t,r,c)}),m.forEach(f),s}function t(n,e){if(e>=a.length)return n;var r=[],i=o[e++];return n.forEach(function(n,i){r.push({key:n,values:t(i,e)})}),i?r.sort(function(n,t){return i(n.key,t.key)}):r}var e,r,u={},a=[],o=[];return u.map=function(t,e){return n(e,t,0)},u.entries=function(e){return t(n(ya.map,e,0),0)},u.key=function(n){return a.push(n),u},u.sortKeys=function(n){return o[a.length-1]=n,u},u.sortValues=function(n){return e=n,u},u.rollup=function(n){return r=n,u},u},ya.set=function(n){var t=new u;if(n)for(var e=0;e<n.length;e++)t.add(n[e]);return t},r(u,{has:function(n){return ka+n in this},add:function(n){return this[ka+n]=!0,n},remove:function(n){return n=ka+n,n in this&&delete this[n]},values:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Aa&&n.call(this,t.substring(1))}}),ya.behavior={},ya.rebind=function(n,t){for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=a(n,t,t[e]);return n};var Na=["webkit","ms","moz","Moz","o","O"],qa=l;try{qa(xa.childNodes)[0].nodeType}catch(Ta){qa=c}ya.dispatch=function(){for(var n=new f,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=h(n);return n},f.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.substring(e+1),n=n.substring(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ya.event=null,ya.requote=function(n){return n.replace(Ca,"\\$&")};var Ca=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,za={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},Da=function(n,t){return t.querySelector(n)},ja=function(n,t){return t.querySelectorAll(n)},La=xa[o(xa,"matchesSelector")],Ha=function(n,t){return La.call(n,t)};"function"==typeof Sizzle&&(Da=function(n,t){return Sizzle(n,t)[0]||null},ja=function(n,t){return Sizzle.uniqueSort(Sizzle(n,t))},Ha=Sizzle.matchesSelector),ya.selection=function(){return Ya};var Fa=ya.selection.prototype=[];Fa.select=function(n){var t,e,r,i,u=[];n=v(n);for(var a=-1,o=this.length;++a<o;){u.push(t=[]),t.parentNode=(r=this[a]).parentNode;for(var c=-1,l=r.length;++c<l;)(i=r[c])?(t.push(e=n.call(i,i.__data__,c)),e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return m(u)},Fa.selectAll=function(n){var t,e,r=[];n=y(n);for(var i=-1,u=this.length;++i<u;)for(var a=this[i],o=-1,c=a.length;++o<c;)(e=a[o])&&(r.push(t=qa(n.call(e,e.__data__,o))),t.parentNode=e);return m(r)};var Pa={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ya.ns={prefix:Pa,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&(e=n.substring(0,t),n=n.substring(t+1)),Pa.hasOwnProperty(e)?{space:Pa[e],local:n}:n}},Fa.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ya.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(M(t,n[t]));return this}return this.each(M(n,t))},Fa.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=n.trim().split(/^|\s+/g)).length,i=-1;if(t=e.classList){for(;++i<r;)if(!t.contains(n[i]))return!1}else for(t=e.getAttribute("class");++i<r;)if(!b(n[i]).test(t))return!1;return!0}for(t in n)this.each(_(t,n[t]));return this}return this.each(_(n,t))},Fa.style=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t="");for(e in n)this.each(S(e,n[e],t));return this}if(2>r)return ba.getComputedStyle(this.node(),null).getPropertyValue(n);e=""}return this.each(S(n,t,e))},Fa.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(E(t,n[t]));return this}return this.each(E(n,t))},Fa.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Fa.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Fa.append=function(n){return n=k(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Fa.insert=function(n,t){return n=k(n),t=v(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments))})},Fa.remove=function(){return this.each(function(){var n=this.parentNode;n&&n.removeChild(this)})},Fa.data=function(n,t){function e(n,e){var r,u,a,o=n.length,f=e.length,h=Math.min(o,f),g=new Array(f),p=new Array(f),d=new Array(o);if(t){var m,v=new i,y=new i,M=[];for(r=-1;++r<o;)m=t.call(u=n[r],u.__data__,r),v.has(m)?d[r]=u:v.set(m,u),M.push(m);for(r=-1;++r<f;)m=t.call(e,a=e[r],r),(u=v.get(m))?(g[r]=u,u.__data__=a):y.has(m)||(p[r]=A(a)),y.set(m,a),v.remove(m);for(r=-1;++r<o;)v.has(M[r])&&(d[r]=n[r])}else{for(r=-1;++r<h;)u=n[r],a=e[r],u?(u.__data__=a,g[r]=u):p[r]=A(a);for(;f>r;++r)p[r]=A(e[r]);for(;o>r;++r)d[r]=n[r]}p.update=g,p.parentNode=g.parentNode=d.parentNode=n.parentNode,c.push(p),l.push(g),s.push(d)}var r,u,a=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++a<o;)(u=r[a])&&(n[a]=u.__data__);return n}var c=C([]),l=m([]),s=m([]);if("function"==typeof n)for(;++a<o;)e(r=this[a],n.call(r,r.parentNode.__data__,a));else for(;++a<o;)e(r=this[a],n);return l.enter=function(){return c},l.exit=function(){return s},l},Fa.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Fa.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=N(n));for(var u=0,a=this.length;a>u;u++){i.push(t=[]),t.parentNode=(e=this[u]).parentNode;for(var o=0,c=e.length;c>o;o++)(r=e[o])&&n.call(r,r.__data__,o)&&t.push(r)}return m(i)},Fa.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,u=r[i];--i>=0;)(e=r[i])&&(u&&u!==e.nextSibling&&u.parentNode.insertBefore(e,u),u=e);return this},Fa.sort=function(n){n=q.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Fa.each=function(n){return T(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Fa.call=function(n){var t=qa(arguments);return n.apply(t[0]=this,t),this},Fa.empty=function(){return!this.node()},Fa.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,i=e.length;i>r;r++){var u=e[r];if(u)return u}return null},Fa.size=function(){var n=0;return this.each(function(){++n}),n};var Oa=[];ya.selection.enter=C,ya.selection.enter.prototype=Oa,Oa.append=Fa.append,Oa.insert=Fa.insert,Oa.empty=Fa.empty,Oa.node=Fa.node,Oa.call=Fa.call,Oa.size=Fa.size,Oa.select=function(n){for(var t,e,r,i,u,a=[],o=-1,c=this.length;++o<c;){r=(i=this[o]).update,a.push(t=[]),t.parentNode=i.parentNode;for(var l=-1,s=i.length;++l<s;)(u=i[l])?(t.push(r[l]=e=n.call(i.parentNode,u.__data__,l)),e.__data__=u.__data__):t.push(null)}return m(a)},Fa.transition=function(){var n,t,e=qc||++Dc,r=[],i=Object.create(jc);i.time=Date.now();for(var u=-1,a=this.length;++u<a;){r.push(n=[]);for(var o=this[u],c=-1,l=o.length;++c<l;)(t=o[c])&&Nu(t,c,e,i),n.push(t)}return Eu(r,e)},ya.select=function(n){var t=["string"==typeof n?Da(n,Ma):n];return t.parentNode=xa,m([t])},ya.selectAll=function(n){var t=qa("string"==typeof n?ja(n,Ma):n);return t.parentNode=xa,m([t])};var Ya=ya.select(xa);Fa.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(z(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(z(n,t,e))};var Ra=ya.map({mouseenter:"mouseover",mouseleave:"mouseout"});Ra.forEach(function(n){"on"+n in Ma&&Ra.remove(n)});var Ua=o(xa.style,"userSelect");ya.mouse=function(n){return H(n,p())};var Ia=/WebKit/.test(ba.navigator.userAgent)?-1:0;ya.touches=function(n,t){return arguments.length<2&&(t=p().touches),t?qa(t).map(function(t){var e=H(n,t);return e.identifier=t.identifier,e}):[]},ya.behavior.drag=function(){function n(){this.on("mousedown.drag",t).on("touchstart.drag",t)}function t(){function n(){var n=a.parentNode;return null!=l?ya.touches(n).filter(function(n){return n.identifier===l})[0]:ya.mouse(n)}function t(){if(!a.parentNode)return i();var t=n(),e=t[0]-s[0],r=t[1]-s[1];f|=e|r,s=t,o({type:"drag",x:t[0]+u[0],y:t[1]+u[1],dx:e,dy:r})}function i(){g.on(null!=l?"touchmove.drag-"+l:"mousemove.drag",null).on(null!=l?"touchend.drag-"+l:"mouseup.drag",null),h(f&&ya.event.target===c),o({type:"dragend"})}var u,a=this,o=e.of(a,arguments),c=ya.event.target,l=ya.event.touches?ya.event.changedTouches[0].identifier:null,s=n(),f=0,h=L(null!=l?"drag-"+l:"drag"),g=ya.select(ba).on(null!=l?"touchmove.drag-"+l:"mousemove.drag",t).on(null!=l?"touchend.drag-"+l:"mouseup.drag",i,!0);r?(u=r.apply(a,arguments),u=[u.x-s[0],u.y-s[1]]):u=[0,0],o({type:"dragstart"})}var e=d(n,"drag","dragstart","dragend"),r=null;return n.origin=function(t){return arguments.length?(r=t,n):r},ya.rebind(n,e,"on")},ya.behavior.zoom=function(){function n(){this.on("mousedown.zoom",o).on("mousemove.zoom",l).on(Za+".zoom",c).on("dblclick.zoom",s).on("touchstart.zoom",f).on("touchmove.zoom",h).on("touchend.zoom",f)}function t(n){return[(n[0]-_[0])/w,(n[1]-_[1])/w]}function e(n){return[n[0]*w+_[0],n[1]*w+_[1]]}function r(n){w=Math.max(S[0],Math.min(S[1],n))}function i(n,t){t=e(t),_[0]+=n[0]-t[0],_[1]+=n[1]-t[1]}function u(){y&&y.domain(v.range().map(function(n){return(n-_[0])/w}).map(v.invert)),x&&x.domain(M.range().map(function(n){return(n-_[1])/w}).map(M.invert))}function a(n){u(),ya.event.preventDefault(),n({type:"zoom",scale:w,translate:_})}function o(){function n(){c=1,i(ya.mouse(r),s),a(u)}function e(){l.on("mousemove.zoom",null).on("mouseup.zoom",null),f(c&&ya.event.target===o)}var r=this,u=E.of(r,arguments),o=ya.event.target,c=0,l=ya.select(ba).on("mousemove.zoom",n).on("mouseup.zoom",e),s=t(ya.mouse(r)),f=L("zoom")}function c(){g||(g=t(ya.mouse(this))),r(Math.pow(2,.002*Va())*w),i(ya.mouse(this),g),a(E.of(this,arguments))}function l(){g=null}function s(){var n=ya.mouse(this),e=t(n),u=Math.log(w)/Math.LN2;r(Math.pow(2,ya.event.shiftKey?Math.ceil(u)-1:Math.floor(u)+1)),i(n,e),a(E.of(this,arguments))}function f(){var n=ya.touches(this),e=Date.now();if(m=w,g={},p=0,n.forEach(function(n){g[n.identifier]=t(n)}),1===n.length){if(500>e-b){var u=n[0],o=t(n[0]);r(2*w),i(u,o),a(E.of(this,arguments))}b=e}else if(n.length>1){var u=n[0],c=n[1],l=u[0]-c[0],s=u[1]-c[1];p=l*l+s*s}}function h(){var n=ya.touches(this),t=n[0],e=g[t.identifier];if(u=n[1]){var u,o=g[u.identifier],c=ya.event.scale;if(null==c){var l=(l=u[0]-t[0])*l+(l=u[1]-t[1])*l;c=p&&Math.sqrt(l/p)}t=[(t[0]+u[0])/2,(t[1]+u[1])/2],e=[(e[0]+o[0])/2,(e[1]+o[1])/2],r(c*m)}i(t,e),b=null,a(E.of(this,arguments))}var g,p,m,v,y,M,x,b,_=[0,0],w=1,S=Xa,E=d(n,"zoom");return n.translate=function(t){return arguments.length?(_=t.map(Number),u(),n):_},n.scale=function(t){return arguments.length?(w=+t,u(),n):w},n.scaleExtent=function(t){return arguments.length?(S=null==t?Xa:t.map(Number),n):S},n.x=function(t){return arguments.length?(y=t,v=t.copy(),_=[0,0],w=1,n):y},n.y=function(t){return arguments.length?(x=t,M=t.copy(),_=[0,0],w=1,n):x},ya.rebind(n,E,"on")};var Va,Xa=[0,1/0],Za="onwheel"in Ma?(Va=function(){return-ya.event.deltaY*(ya.event.deltaMode?120:1)},"wheel"):"onmousewheel"in Ma?(Va=function(){return ya.event.wheelDelta},"mousewheel"):(Va=function(){return-ya.event.detail},"MozMousePixelScroll");F.prototype.toString=function(){return this.rgb()+""},ya.hsl=function(n,t,e){return 1===arguments.length?n instanceof O?P(n.h,n.s,n.l):at(""+n,ot,P):P(+n,+t,+e)};var Ba=O.prototype=new F;Ba.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),P(this.h,this.s,this.l/n)},Ba.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),P(this.h,this.s,n*this.l)},Ba.rgb=function(){return Y(this.h,this.s,this.l)};var $a=Math.PI,Wa=1e-6,Ja=Wa*Wa,Ga=$a/180,Ka=180/$a;ya.hcl=function(n,t,e){return 1===arguments.length?n instanceof $?B(n.h,n.c,n.l):n instanceof G?Q(n.l,n.a,n.b):Q((n=ct((n=ya.rgb(n)).r,n.g,n.b)).l,n.a,n.b):B(+n,+t,+e)};var Qa=$.prototype=new F;Qa.brighter=function(n){return B(this.h,this.c,Math.min(100,this.l+no*(arguments.length?n:1)))},Qa.darker=function(n){return B(this.h,this.c,Math.max(0,this.l-no*(arguments.length?n:1)))},Qa.rgb=function(){return W(this.h,this.c,this.l).rgb()},ya.lab=function(n,t,e){return 1===arguments.length?n instanceof G?J(n.l,n.a,n.b):n instanceof $?W(n.l,n.c,n.h):ct((n=ya.rgb(n)).r,n.g,n.b):J(+n,+t,+e)};var no=18,to=.95047,eo=1,ro=1.08883,io=G.prototype=new F;io.brighter=function(n){return J(Math.min(100,this.l+no*(arguments.length?n:1)),this.a,this.b)},io.darker=function(n){return J(Math.max(0,this.l-no*(arguments.length?n:1)),this.a,this.b)},io.rgb=function(){return K(this.l,this.a,this.b)},ya.rgb=function(n,t,e){return 1===arguments.length?n instanceof it?rt(n.r,n.g,n.b):at(""+n,rt,Y):rt(~~n,~~t,~~e)};var uo=it.prototype=new F;uo.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30;return t||e||r?(t&&i>t&&(t=i),e&&i>e&&(e=i),r&&i>r&&(r=i),rt(Math.min(255,Math.floor(t/n)),Math.min(255,Math.floor(e/n)),Math.min(255,Math.floor(r/n)))):rt(i,i,i)},uo.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),rt(Math.floor(n*this.r),Math.floor(n*this.g),Math.floor(n*this.b))},uo.hsl=function(){return ot(this.r,this.g,this.b)},uo.toString=function(){return"#"+ut(this.r)+ut(this.g)+ut(this.b)};var ao=ya.map({aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"});ao.forEach(function(n,t){ao.set(n,at(t,rt,Y))}),ya.functor=ft,ya.xhr=gt(ht),ya.dsv=function(n,t){function e(n,e,u){arguments.length<3&&(u=e,e=null);var a=ya.xhr(n,t,u);return a.row=function(n){return arguments.length?a.response(null==(e=n)?r:i(n)):e},a.row(e)}function r(n){return e.parse(n.responseText)}function i(n){return function(t){return e.parse(t.responseText,n)}}function a(t){return t.map(o).join(n)}function o(n){return c.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var c=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var i=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(i(n),e)}:i})},e.parseRows=function(n,t){function e(){if(s>=c)return a;if(i)return i=!1,u;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(i=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(i=!0),n.substring(t+1,e).replace(/""/g,'"')}for(;c>s;){var r=n.charCodeAt(s++),o=1;if(10===r)i=!0;else if(13===r)i=!0,10===n.charCodeAt(s)&&(++s,++o);else if(r!==l)continue;return n.substring(t,s-o)}return n.substring(t)}for(var r,i,u={},a={},o=[],c=n.length,s=0,f=0;(r=e())!==a;){for(var h=[];r!==u&&r!==a;)h.push(r),r=e();(!t||(h=t(h,f++)))&&o.push(h)}return o},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new u,i=[];return t.forEach(function(n){for(var t in n)r.has(t)||i.push(r.add(t))}),[i.map(o).join(n)].concat(t.map(function(t){return i.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(a).join("\n")},e},ya.csv=ya.dsv(",","text/csv"),ya.tsv=ya.dsv("	","text/tab-separated-values");var oo,co,lo,so;ya.timer=function(n,t,e){if(arguments.length<3){if(arguments.length<2)t=0;else if(!isFinite(t))return;e=Date.now()}var r=e+t,i={callback:n,time:r,next:null};co?co.next=i:oo=i,co=i,lo||(so=clearTimeout(so),lo=1,fo(mt))},ya.timer.flush=function(){vt(),yt()};var fo=ba[o(ba,"requestAnimationFrame")]||function(n){setTimeout(n,17)},ho=".",go=",",po=[3,3],mo=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(Mt);ya.formatPrefix=function(n,t){var e=0;return n&&(0>n&&(n*=-1),t&&(n=ya.round(n,xt(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((0>=e?e+1:e-1)/3)))),mo[8+e/3]},ya.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)},ya.format=function(n){var t=vo.exec(n),e=t[1]||" ",r=t[2]||">",i=t[3]||"",u=t[4]||"",a=t[5],o=+t[6],c=t[7],l=t[8],s=t[9],f=1,h="",g=!1;switch(l&&(l=+l.substring(1)),(a||"0"===e&&"="===r)&&(a=e="0",r="=",c&&(o-=Math.floor((o-1)/4))),s){case"n":c=!0,s="g";break;case"%":f=100,h="%",s="f";break;case"p":f=100,h="%",s="r";break;case"b":case"o":case"x":case"X":u&&(u="0"+s.toLowerCase());case"c":case"d":g=!0,l=0;break;case"s":f=-1,s="r"}"#"===u&&(u=""),"r"!=s||l||(s="g"),null!=l&&("g"==s?l=Math.max(1,Math.min(21,l)):("e"==s||"f"==s)&&(l=Math.max(0,Math.min(20,l)))),s=yo.get(s)||bt;var p=a&&c;return function(n){if(g&&n%1)return"";var t=0>n||0===n&&0>1/n?(n=-n,"-"):i;if(0>f){var d=ya.formatPrefix(n,l);n=d.scale(n),h=d.symbol}else n*=f;n=s(n,l),!a&&c&&(n=Mo(n));var m=u.length+n.length+(p?0:t.length),v=o>m?new Array(m=o-m+1).join(e):"";return p&&(n=Mo(v+n)),ho&&n.replace(".",ho),t+=u,("<"===r?t+n+v:">"===r?v+t+n:"^"===r?v.substring(0,m>>=1)+t+n+v.substring(m):t+(p?n:v+n))+h}};var vo=/(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,yo=ya.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ya.round(n,xt(n,t))).toFixed(Math.max(0,Math.min(20,xt(n*(1+1e-15),t))))}}),Mo=ht;if(po){var xo=po.length;Mo=function(n){for(var t=n.lastIndexOf("."),e=t>=0?"."+n.substring(t+1):(t=n.length,""),r=[],i=0,u=po[0];t>0&&u>0;)r.push(n.substring(t-=u,t+u)),u=po[i=(i+1)%xo];return r.reverse().join(go||"")+e}}ya.geo={},_t.prototype={s:0,t:0,add:function(n){wt(n,this.t,bo),wt(bo.s,this.s,this),this.s?this.t+=bo.t:this.s=bo.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var bo=new _t;ya.geo.stream=function(n,t){n&&_o.hasOwnProperty(n.type)?_o[n.type](n,t):St(n,t)};var _o={Feature:function(n,t){St(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,i=e.length;++r<i;)St(e[r].geometry,t)}},wo={Sphere:function(n,t){t.sphere()},Point:function(n,t){var e=n.coordinates;t.point(e[0],e[1])},MultiPoint:function(n,t){for(var e,r=n.coordinates,i=-1,u=r.length;++i<u;)e=r[i],t.point(e[0],e[1])},LineString:function(n,t){Et(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)Et(e[r],t,0)},Polygon:function(n,t){kt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)kt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,i=e.length;++r<i;)St(e[r],t)}};ya.geo.area=function(n){return So=0,ya.geo.stream(n,ko),So};var So,Eo=new _t,ko={sphere:function(){So+=4*$a},point:s,lineStart:s,lineEnd:s,polygonStart:function(){Eo.reset(),ko.lineStart=At},polygonEnd:function(){var n=2*Eo;So+=0>n?4*$a+n:n,ko.lineStart=ko.lineEnd=ko.point=s}};ya.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=Nt([t*Ga,e*Ga]);if(v){var i=Tt(v,r),u=[i[1],-i[0],0],a=Tt(u,i);Dt(a),a=jt(a);var c=t-p,l=c>0?1:-1,d=a[0]*Ka*l,m=Math.abs(c)>180;if(m^(d>l*p&&l*t>d)){var y=a[1]*Ka;y>g&&(g=y)}else if(d=(d+360)%360-180,m^(d>l*p&&l*t>d)){var y=-a[1]*Ka;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);m?p>t?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t)}else n(t,e);v=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,v=null}function i(n,e){if(v){var r=n-p;y+=Math.abs(r)>180?r+(r>0?360:-360):r}else d=n,m=e;ko.point(n,e),t(n,e)}function u(){ko.lineStart()}function a(){i(d,m),ko.lineEnd(),Math.abs(y)>Wa&&(s=-(h=180)),x[0]=s,x[1]=h,v=null}function o(n,t){return(t-=n)<0?t+360:t}function c(n,t){return n[0]-t[0]}function l(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,d,m,v,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=i,b.lineStart=u,b.lineEnd=a,y=0,ko.polygonStart()},polygonEnd:function(){ko.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>Eo?(s=-(h=180),f=-(g=90)):y>Wa?g=90:-Wa>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],ya.geo.stream(n,b);var t=M.length;if(t){M.sort(c);for(var e,r=1,i=M[0],u=[i];t>r;++r)e=M[r],l(e[0],i)||l(e[1],i)?(o(i[0],e[1])>o(i[0],i[1])&&(i[1]=e[1]),o(e[0],i[1])>o(i[0],i[1])&&(i[0]=e[0])):u.push(i=e);for(var a,e,p=-1/0,t=u.length-1,r=0,i=u[t];t>=r;i=e,++r)e=u[r],(a=o(i[1],e[0]))>p&&(p=a,s=e[0],h=i[1])}return M=x=null,1/0===s||1/0===f?[[0/0,0/0],[0/0,0/0]]:[[s,f],[h,g]]}}(),ya.geo.centroid=function(n){Ao=No=qo=To=Co=zo=Do=jo=Lo=Ho=Fo=0,ya.geo.stream(n,Po);var t=Lo,e=Ho,r=Fo,i=t*t+e*e+r*r;return Ja>i&&(t=zo,e=Do,r=jo,Wa>No&&(t=qo,e=To,r=Co),i=t*t+e*e+r*r,Ja>i)?[0/0,0/0]:[Math.atan2(e,t)*Ka,I(r/Math.sqrt(i))*Ka]};var Ao,No,qo,To,Co,zo,Do,jo,Lo,Ho,Fo,Po={sphere:s,point:Ht,lineStart:Pt,lineEnd:Ot,polygonStart:function(){Po.lineStart=Yt},polygonEnd:function(){Po.lineStart=Pt}},Oo=Vt(Rt,Wt,Gt,Kt),Yo=[-$a,0],Ro=1e9;(ya.geo.conicEqualArea=function(){return re(ie)}).raw=ie,ya.geo.albers=function(){return ya.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ya.geo.albersUsa=function(){function n(n){var u=n[0],a=n[1];return t=null,e(u,a),t||(r(u,a),t)||i(u,a),t}var t,e,r,i,u=ya.geo.albers(),a=ya.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),o=ya.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),c={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=u.scale(),e=u.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t;return(i>=.12&&.234>i&&r>=-.425&&-.214>r?a:i>=.166&&.234>i&&r>=-.214&&-.115>r?o:u).invert(n)},n.stream=function(n){var t=u.stream(n),e=a.stream(n),r=o.stream(n);return{point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(u.precision(t),a.precision(t),o.precision(t),n):u.precision()},n.scale=function(t){return arguments.length?(u.scale(t),a.scale(.35*t),o.scale(t),n.translate(u.translate())):u.scale()},n.translate=function(t){if(!arguments.length)return u.translate();var l=u.scale(),s=+t[0],f=+t[1];return e=u.translate(t).clipExtent([[s-.455*l,f-.238*l],[s+.455*l,f+.238*l]]).stream(c).point,r=a.translate([s-.307*l,f+.201*l]).clipExtent([[s-.425*l+Wa,f+.12*l+Wa],[s-.214*l-Wa,f+.234*l-Wa]]).stream(c).point,i=o.translate([s-.205*l,f+.212*l]).clipExtent([[s-.214*l+Wa,f+.166*l+Wa],[s-.115*l-Wa,f+.234*l-Wa]]).stream(c).point,n},n.scale(1070)};var Uo,Io,Vo,Xo,Zo,Bo,$o={point:s,lineStart:s,lineEnd:s,polygonStart:function(){Io=0,$o.lineStart=ue},polygonEnd:function(){$o.lineStart=$o.lineEnd=$o.point=s,Uo+=Math.abs(Io/2)}},Wo={point:ae,lineStart:s,lineEnd:s,polygonStart:s,polygonEnd:s},Jo={point:le,lineStart:se,lineEnd:fe,polygonStart:function(){Jo.lineStart=he},polygonEnd:function(){Jo.point=le,Jo.lineStart=se,Jo.lineEnd=fe}};ya.geo.path=function(){function n(n){return n&&("function"==typeof o&&u.pointRadius(+o.apply(this,arguments)),a&&a.valid||(a=i(u)),ya.geo.stream(n,a)),u.result()}function t(){return a=null,n}var e,r,i,u,a,o=4.5;return n.area=function(n){return Uo=0,ya.geo.stream(n,i($o)),Uo},n.centroid=function(n){return qo=To=Co=zo=Do=jo=Lo=Ho=Fo=0,ya.geo.stream(n,i(Jo)),Fo?[Lo/Fo,Ho/Fo]:jo?[zo/jo,Do/jo]:Co?[qo/Co,To/Co]:[0/0,0/0]},n.bounds=function(n){return Zo=Bo=-(Vo=Xo=1/0),ya.geo.stream(n,i(Wo)),[[Vo,Xo],[Zo,Bo]]},n.projection=function(n){return arguments.length?(i=(e=n)?n.stream||de(n):ht,t()):e},n.context=function(n){return arguments.length?(u=null==(r=n)?new oe:new ge(n),"function"!=typeof o&&u.pointRadius(o),t()):r},n.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(u.pointRadius(+t),+t),n):o},n.projection(ya.geo.albersUsa()).context(null)},ya.geo.projection=me,ya.geo.projectionMutator=ve,(ya.geo.equirectangular=function(){return me(Me)}).raw=Me.invert=Me,ya.geo.rotation=function(n){function t(t){return t=n(t[0]*Ga,t[1]*Ga),t[0]*=Ka,t[1]*=Ka,t}return n=xe(n[0]%360*Ga,n[1]*Ga,n.length>2?n[2]*Ga:0),t.invert=function(t){return t=n.invert(t[0]*Ga,t[1]*Ga),t[0]*=Ka,t[1]*=Ka,t},t},ya.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=xe(-n[0]*Ga,-n[1]*Ga,0).invert,i=[];return e(null,null,1,{point:function(n,e){i.push(n=t(n,e)),n[0]*=Ka,n[1]*=Ka}}),{type:"Polygon",coordinates:[i]}}var t,e,r=[0,0],i=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=Se((t=+r)*Ga,i*Ga),n):t},n.precision=function(r){return arguments.length?(e=Se(t*Ga,(i=+r)*Ga),n):i},n.angle(90)},ya.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Ga,i=n[1]*Ga,u=t[1]*Ga,a=Math.sin(r),o=Math.cos(r),c=Math.sin(i),l=Math.cos(i),s=Math.sin(u),f=Math.cos(u);return Math.atan2(Math.sqrt((e=f*a)*e+(e=l*s-c*f*o)*e),c*s+l*f*o)},ya.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ya.range(Math.ceil(u/m)*m,i,m).map(h).concat(ya.range(Math.ceil(l/v)*v,c,v).map(g)).concat(ya.range(Math.ceil(r/p)*p,e,p).filter(function(n){return Math.abs(n%m)>Wa}).map(s)).concat(ya.range(Math.ceil(o/d)*d,a,d).filter(function(n){return Math.abs(n%v)>Wa}).map(f))}var e,r,i,u,a,o,c,l,s,f,h,g,p=10,d=p,m=90,v=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(u).concat(g(c).slice(1),h(i).reverse().slice(1),g(l).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(u=+t[0][0],i=+t[1][0],l=+t[0][1],c=+t[1][1],u>i&&(t=u,u=i,i=t),l>c&&(t=l,l=c,c=t),n.precision(y)):[[u,l],[i,c]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],o=+t[0][1],a=+t[1][1],r>e&&(t=r,r=e,e=t),o>a&&(t=o,o=a,a=t),n.precision(y)):[[r,o],[e,a]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(m=+t[0],v=+t[1],n):[m,v]},n.minorStep=function(t){return arguments.length?(p=+t[0],d=+t[1],n):[p,d]},n.precision=function(t){return arguments.length?(y=+t,s=ke(o,a,90),f=Ae(r,e,y),h=ke(l,c,90),g=Ae(u,i,y),n):y},n.majorExtent([[-180,-90+Wa],[180,90-Wa]]).minorExtent([[-180,-80-Wa],[180,80+Wa]])},ya.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}var t,e,r=Ne,i=qe;return n.distance=function(){return ya.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(i=t,e="function"==typeof t?null:t,n):i},n.precision=function(){return arguments.length?n:0},n},ya.geo.interpolate=function(n,t){return Te(n[0]*Ga,n[1]*Ga,t[0]*Ga,t[1]*Ga)},ya.geo.length=function(n){return Go=0,ya.geo.stream(n,Ko),Go};var Go,Ko={sphere:s,point:s,lineStart:Ce,lineEnd:s,polygonStart:s,polygonEnd:s},Qo=ze(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ya.geo.azimuthalEqualArea=function(){return me(Qo)}).raw=Qo;var nc=ze(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},ht);(ya.geo.azimuthalEquidistant=function(){return me(nc)}).raw=nc,(ya.geo.conicConformal=function(){return re(De)}).raw=De,(ya.geo.conicEquidistant=function(){return re(je)}).raw=je;var tc=ze(function(n){return 1/n},Math.atan);(ya.geo.gnomonic=function(){return me(tc)}).raw=tc,Le.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-$a/2]},(ya.geo.mercator=function(){return He(Le)}).raw=Le;var ec=ze(function(){return 1},Math.asin);(ya.geo.orthographic=function(){return me(ec)}).raw=ec;var rc=ze(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ya.geo.stereographic=function(){return me(rc)}).raw=rc,Fe.invert=function(n,t){return[Math.atan2(V(n),Math.cos(t)),I(Math.sin(t)/X(n))]},(ya.geo.transverseMercator=function(){return He(Fe)}).raw=Fe,ya.geom={},ya.svg={},ya.svg.line=function(){return Pe(ht)};var ic=ya.map({linear:Re,"linear-closed":Ue,step:Ie,"step-before":Ve,"step-after":Xe,basis:Ge,"basis-open":Ke,"basis-closed":Qe,bundle:nr,cardinal:$e,"cardinal-open":Ze,"cardinal-closed":Be,monotone:ar});ic.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var uc=[0,2/3,1/3,0],ac=[0,1/3,2/3,0],oc=[0,1/6,2/3,1/6];ya.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,i,u,a,o,c,l,s,f,h,g,p,d=ft(e),m=ft(r),v=n.length,y=v-1,M=[],x=[],b=0;
if(d===Oe&&r===Ye)t=n;else for(u=0,t=[];v>u;++u)t.push([+d.call(this,i=n[u],u),+m.call(this,i,u)]);for(u=1;v>u;++u)(t[u][1]<t[b][1]||t[u][1]==t[b][1]&&t[u][0]<t[b][0])&&(b=u);for(u=0;v>u;++u)u!==b&&(c=t[u][1]-t[b][1],o=t[u][0]-t[b][0],M.push({angle:Math.atan2(c,o),index:u}));for(M.sort(function(n,t){return n.angle-t.angle}),g=M[0].angle,h=M[0].index,f=0,u=1;y>u;++u){if(a=M[u].index,g==M[u].angle){if(o=t[h][0]-t[b][0],c=t[h][1]-t[b][1],l=t[a][0]-t[b][0],s=t[a][1]-t[b][1],o*o+c*c>=l*l+s*s){M[u].index=-1;continue}M[f].index=-1}g=M[u].angle,f=u,h=a}for(x.push(b),u=0,a=0;2>u;++a)M[a].index>-1&&(x.push(M[a].index),u++);for(p=x.length;y>a;++a)if(!(M[a].index<0)){for(;!or(x[p-2],x[p-1],M[a].index,t);)--p;x[p++]=M[a].index}var _=[];for(u=p-1;u>=0;--u)_.push(n[x[u]]);return _}var e=Oe,r=Ye;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ya.geom.polygon=function(n){return za(n,cc),n};var cc=ya.geom.polygon.prototype=[];cc.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},cc.centroid=function(n){var t,e,r=-1,i=this.length,u=0,a=0,o=this[i-1];for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=o,o=this[r],e=t[0]*o[1]-o[0]*t[1],u+=(t[0]+o[0])*e,a+=(t[1]+o[1])*e;return[u*n,a*n]},cc.clip=function(n){for(var t,e,r,i,u,a,o=sr(n),c=-1,l=this.length-sr(this),s=this[l-1];++c<l;){for(t=n.slice(),n.length=0,i=this[c],u=t[(r=t.length-o)-1],e=-1;++e<r;)a=t[e],cr(a,s,i)?(cr(u,s,i)||n.push(lr(u,a,s,i)),n.push(a)):cr(u,s,i)&&n.push(lr(u,a,s,i)),u=a;o&&n.push(n[0]),s=i}return n},ya.geom.delaunay=function(n){var t=n.map(function(){return[]}),e=[];return fr(n,function(e){t[e.region.l.index].push(n[e.region.r.index])}),t.forEach(function(t,r){var i=n[r],u=i[0],a=i[1];t.forEach(function(n){n.angle=Math.atan2(n[0]-u,n[1]-a)}),t.sort(function(n,t){return n.angle-t.angle});for(var o=0,c=t.length-1;c>o;o++)e.push([i,t[o],t[o+1]])}),e},ya.geom.voronoi=function(n){function t(n){var t,u,a,o=n.map(function(){return[]}),c=ft(e),l=ft(r),s=n.length,f=1e6;if(c===Oe&&l===Ye)t=n;else for(t=new Array(s),a=0;s>a;++a)t[a]=[+c.call(this,u=n[a],a),+l.call(this,u,a)];if(fr(t,function(n){var t,e,r,i,u,a;1===n.a&&n.b>=0?(t=n.ep.r,e=n.ep.l):(t=n.ep.l,e=n.ep.r),1===n.a?(u=t?t.y:-f,r=n.c-n.b*u,a=e?e.y:f,i=n.c-n.b*a):(r=t?t.x:-f,u=n.c-n.a*r,i=e?e.x:f,a=n.c-n.a*i);var c=[r,u],l=[i,a];o[n.region.l.index].push(c,l),o[n.region.r.index].push(c,l)}),o=o.map(function(n,e){var r=t[e][0],i=t[e][1],u=n.map(function(n){return Math.atan2(n[0]-r,n[1]-i)}),a=ya.range(n.length).sort(function(n,t){return u[n]-u[t]});return a.filter(function(n,t){return!t||u[n]-u[a[t-1]]>Wa}).map(function(t){return n[t]})}),o.forEach(function(n,e){var r=n.length;if(!r)return n.push([-f,-f],[-f,f],[f,f],[f,-f]);if(!(r>2)){var i=t[e],u=n[0],a=n[1],o=i[0],c=i[1],l=u[0],s=u[1],h=a[0],g=a[1],p=Math.abs(h-l),d=g-s;if(Math.abs(d)<Wa){var m=s>c?-f:f;n.push([-f,m],[f,m])}else if(Wa>p){var v=l>o?-f:f;n.push([v,-f],[v,f])}else{var m=(l-o)*(g-s)>(h-l)*(s-c)?f:-f,y=Math.abs(d)-p;Math.abs(y)<Wa?n.push([0>d?m:-m,m]):(y>0&&(m*=-1),n.push([-f,m],[f,m]))}}}),i)for(a=0;s>a;++a)i.clip(o[a]);for(a=0;s>a;++a)o[a].point=n[a];return o}var e=Oe,r=Ye,i=null;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.clipExtent=function(n){if(!arguments.length)return i&&[i[0],i[2]];if(null==n)i=null;else{var e=+n[0][0],r=+n[0][1],u=+n[1][0],a=+n[1][1];i=ya.geom.polygon([[e,r],[e,a],[u,a],[u,r]])}return t},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):i&&i[2]},t.links=function(n){var t,i,u,a=n.map(function(){return[]}),o=[],c=ft(e),l=ft(r),s=n.length;if(c===Oe&&l===Ye)t=n;else for(t=new Array(s),u=0;s>u;++u)t[u]=[+c.call(this,i=n[u],u),+l.call(this,i,u)];return fr(t,function(t){var e=t.region.l.index,r=t.region.r.index;a[e][r]||(a[e][r]=a[r][e]=!0,o.push({source:n[e],target:n[r]}))}),o},t.triangles=function(n){if(e===Oe&&r===Ye)return ya.geom.delaunay(n);for(var t,i=new Array(c),u=ft(e),a=ft(r),o=-1,c=n.length;++o<c;)(i[o]=[+u.call(this,t=n[o],o),+a.call(this,t,o)]).data=t;return ya.geom.delaunay(i).map(function(n){return n.map(function(n){return n.data})})},t)};var lc={l:"r",r:"l"};ya.geom.quadtree=function(n,t,e,r,i){function u(n){function u(n,t,e,r,i,u,a,o){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var c=n.x,s=n.y;if(null!=c)if(Math.abs(c-e)+Math.abs(s-r)<.01)l(n,t,e,r,i,u,a,o);else{var f=n.point;n.x=n.y=n.point=null,l(n,f,c,s,i,u,a,o),l(n,t,e,r,i,u,a,o)}else n.x=e,n.y=r,n.point=t}else l(n,t,e,r,i,u,a,o)}function l(n,t,e,r,i,a,o,c){var l=.5*(i+o),s=.5*(a+c),f=e>=l,h=r>=s,g=(h<<1)+f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=pr()),f?i=l:o=l,h?a=s:c=s,u(n,t,e,r,i,a,o,c)}var s,f,h,g,p,d,m,v,y,M=ft(o),x=ft(c);if(null!=t)d=t,m=e,v=r,y=i;else if(v=y=-(d=m=1/0),f=[],h=[],p=n.length,a)for(g=0;p>g;++g)s=n[g],s.x<d&&(d=s.x),s.y<m&&(m=s.y),s.x>v&&(v=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);d>b&&(d=b),m>_&&(m=_),b>v&&(v=b),_>y&&(y=_),f.push(b),h.push(_)}var w=v-d,S=y-m;w>S?y=m+w:v=d+S;var E=pr();if(E.add=function(n){u(E,n,+M(n,++g),+x(n,g),d,m,v,y)},E.visit=function(n){dr(n,E,d,m,v,y)},g=-1,null==t){for(;++g<p;)u(E,n[g],f[g],h[g],d,m,v,y);--g}else n.forEach(E.add);return f=h=n=s=null,E}var a,o=Oe,c=Ye;return(a=arguments.length)?(o=hr,c=gr,3===a&&(i=e,r=t,e=t=0),u(n)):(u.x=function(n){return arguments.length?(o=n,u):o},u.y=function(n){return arguments.length?(c=n,u):c},u.extent=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],i=+n[1][1]),u):null==t?null:[[t,e],[r,i]]},u.size=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=e=0,r=+n[0],i=+n[1]),u):null==t?null:[r-t,i-e]},u)},ya.interpolateRgb=mr,ya.interpolateObject=vr,ya.interpolateNumber=yr,ya.interpolateString=Mr;var sc=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;ya.interpolate=xr,ya.interpolators=[function(n,t){var e=typeof t;return("string"===e?ao.has(t)||/^(#|rgb\(|hsl\()/.test(t)?mr:Mr:t instanceof F?mr:"object"===e?Array.isArray(t)?br:vr:yr)(n,t)}],ya.interpolateArray=br;var fc=function(){return ht},hc=ya.map({linear:fc,poly:Nr,quad:function(){return Er},cubic:function(){return kr},sin:function(){return qr},exp:function(){return Tr},circle:function(){return Cr},elastic:zr,back:Dr,bounce:function(){return jr}}),gc=ya.map({"in":ht,out:wr,"in-out":Sr,"out-in":function(n){return Sr(wr(n))}});ya.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.substring(0,t):n,r=t>=0?n.substring(t+1):"in";return e=hc.get(e)||fc,r=gc.get(r)||ht,_r(r(e.apply(null,Array.prototype.slice.call(arguments,1))))},ya.interpolateHcl=Lr,ya.interpolateHsl=Hr,ya.interpolateLab=Fr,ya.interpolateRound=Pr,ya.transform=function(n){var t=Ma.createElementNS(ya.ns.prefix.svg,"g");return(ya.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Or(e?e.matrix:pc)})(n)},Or.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var pc={a:1,b:0,c:0,d:1,e:0,f:0};ya.interpolateTransform=Ir,ya.layout={},ya.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Zr(n[e]));return t}},ya.layout.chord=function(){function n(){var n,l,f,h,g,p={},d=[],m=ya.range(u),v=[];for(e=[],r=[],n=0,h=-1;++h<u;){for(l=0,g=-1;++g<u;)l+=i[h][g];d.push(l),v.push(ya.range(u)),n+=l}for(a&&m.sort(function(n,t){return a(d[n],d[t])}),o&&v.forEach(function(n,t){n.sort(function(n,e){return o(i[t][n],i[t][e])})}),n=(2*$a-s*u)/n,l=0,h=-1;++h<u;){for(f=l,g=-1;++g<u;){var y=m[h],M=v[y][g],x=i[y][M],b=l,_=l+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:l,value:(l-f)/n},l+=s}for(h=-1;++h<u;)for(g=h-1;++g<u;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}c&&t()}function t(){e.sort(function(n,t){return c((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,i,u,a,o,c,l={},s=0;return l.matrix=function(n){return arguments.length?(u=(i=n)&&i.length,e=r=null,l):i},l.padding=function(n){return arguments.length?(s=n,e=r=null,l):s},l.sortGroups=function(n){return arguments.length?(a=n,e=r=null,l):a},l.sortSubgroups=function(n){return arguments.length?(o=n,e=null,l):o},l.sortChords=function(n){return arguments.length?(c=n,e&&t(),l):c},l.chords=function(){return e||n(),e},l.groups=function(){return r||n(),r},l},ya.layout.force=function(){function n(n){return function(t,e,r,i){if(t.point!==n){var u=t.cx-n.x,a=t.cy-n.y,o=1/Math.sqrt(u*u+a*a);if(d>(i-e)*o){var c=t.charge*o*o;return n.px-=u*c,n.py-=a*c,!0}if(t.point&&isFinite(o)){var c=t.pointCharge*o*o;n.px-=u*c,n.py-=a*c}}return!t.charge}}function t(n){n.px=ya.event.x,n.py=ya.event.y,o.resume()}var e,r,i,u,a,o={},c=ya.dispatch("start","tick","end"),l=[1,1],s=.9,f=dc,h=mc,g=-30,p=.1,d=.8,m=[],v=[];return o.tick=function(){if((r*=.99)<.005)return c.end({type:"end",alpha:r=0}),!0;var t,e,o,f,h,d,y,M,x,b=m.length,_=v.length;for(e=0;_>e;++e)o=v[e],f=o.source,h=o.target,M=h.x-f.x,x=h.y-f.y,(d=M*M+x*x)&&(d=r*u[e]*((d=Math.sqrt(d))-i[e])/d,M*=d,x*=d,h.x-=M*(y=f.weight/(h.weight+f.weight)),h.y-=x*y,f.x+=M*(y=1-y),f.y+=x*y);if((y=r*p)&&(M=l[0]/2,x=l[1]/2,e=-1,y))for(;++e<b;)o=m[e],o.x+=(M-o.x)*y,o.y+=(x-o.y)*y;if(g)for(Qr(t=ya.geom.quadtree(m),r,a),e=-1;++e<b;)(o=m[e]).fixed||t.visit(n(o));for(e=-1;++e<b;)o=m[e],o.fixed?(o.x=o.px,o.y=o.py):(o.x-=(o.px-(o.px=o.x))*s,o.y-=(o.py-(o.py=o.y))*s);c.tick({type:"tick",alpha:r})},o.nodes=function(n){return arguments.length?(m=n,o):m},o.links=function(n){return arguments.length?(v=n,o):v},o.size=function(n){return arguments.length?(l=n,o):l},o.linkDistance=function(n){return arguments.length?(f="function"==typeof n?n:+n,o):f},o.distance=o.linkDistance,o.linkStrength=function(n){return arguments.length?(h="function"==typeof n?n:+n,o):h},o.friction=function(n){return arguments.length?(s=+n,o):s},o.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,o):g},o.gravity=function(n){return arguments.length?(p=+n,o):p},o.theta=function(n){return arguments.length?(d=+n,o):d},o.alpha=function(n){return arguments.length?(n=+n,r?r=n>0?n:0:n>0&&(c.start({type:"start",alpha:r=n}),ya.timer(o.tick)),o):r},o.start=function(){function n(n,r){for(var i,u=t(e),a=-1,o=u.length;++a<o;)if(!isNaN(i=u[a][n]))return i;return Math.random()*r}function t(){if(!c){for(c=[],r=0;p>r;++r)c[r]=[];for(r=0;d>r;++r){var n=v[r];c[n.source.index].push(n.target),c[n.target.index].push(n.source)}}return c[e]}var e,r,c,s,p=m.length,d=v.length,y=l[0],M=l[1];for(e=0;p>e;++e)(s=m[e]).index=e,s.weight=0;for(e=0;d>e;++e)s=v[e],"number"==typeof s.source&&(s.source=m[s.source]),"number"==typeof s.target&&(s.target=m[s.target]),++s.source.weight,++s.target.weight;for(e=0;p>e;++e)s=m[e],isNaN(s.x)&&(s.x=n("x",y)),isNaN(s.y)&&(s.y=n("y",M)),isNaN(s.px)&&(s.px=s.x),isNaN(s.py)&&(s.py=s.y);if(i=[],"function"==typeof f)for(e=0;d>e;++e)i[e]=+f.call(this,v[e],e);else for(e=0;d>e;++e)i[e]=f;if(u=[],"function"==typeof h)for(e=0;d>e;++e)u[e]=+h.call(this,v[e],e);else for(e=0;d>e;++e)u[e]=h;if(a=[],"function"==typeof g)for(e=0;p>e;++e)a[e]=+g.call(this,m[e],e);else for(e=0;p>e;++e)a[e]=g;return o.resume()},o.resume=function(){return o.alpha(.1)},o.stop=function(){return o.alpha(0)},o.drag=function(){return e||(e=ya.behavior.drag().origin(ht).on("dragstart.force",Wr).on("drag.force",t).on("dragend.force",Jr)),arguments.length?(this.on("mouseover.force",Gr).on("mouseout.force",Kr).call(e),void 0):e},ya.rebind(o,c,"on")};var dc=20,mc=1;ya.layout.hierarchy=function(){function n(t,a,o){var c=i.call(e,t,a);if(t.depth=a,o.push(t),c&&(l=c.length)){for(var l,s,f=-1,h=t.children=[],g=0,p=a+1;++f<l;)s=n(c[f],p,o),s.parent=t,h.push(s),g+=s.value;r&&h.sort(r),u&&(t.value=g)}else u&&(t.value=+u.call(e,t,a)||0);return t}function t(n,r){var i=n.children,a=0;if(i&&(o=i.length))for(var o,c=-1,l=r+1;++c<o;)a+=t(i[c],l);else u&&(a=+u.call(e,n,r)||0);return u&&(n.value=a),a}function e(t){var e=[];return n(t,0,e),e}var r=ri,i=ti,u=ei;return e.sort=function(n){return arguments.length?(r=n,e):r},e.children=function(n){return arguments.length?(i=n,e):i},e.value=function(n){return arguments.length?(u=n,e):u},e.revalue=function(n){return t(n,0),n},e},ya.layout.partition=function(){function n(t,e,r,i){var u=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,u&&(a=u.length)){var a,o,c,l=-1;for(r=t.value?r/t.value:0;++l<a;)n(o=u[l],e,c=o.value*r,i),e+=c}}function t(n){var e=n.children,r=0;if(e&&(i=e.length))for(var i,u=-1;++u<i;)r=Math.max(r,t(e[u]));return 1+r}function e(e,u){var a=r.call(this,e,u);return n(a[0],0,i[0],i[1]/t(a[0])),a}var r=ya.layout.hierarchy(),i=[1,1];return e.size=function(n){return arguments.length?(i=n,e):i},ni(e,r)},ya.layout.pie=function(){function n(u){var a=u.map(function(e,r){return+t.call(n,e,r)}),o=+("function"==typeof r?r.apply(this,arguments):r),c=(("function"==typeof i?i.apply(this,arguments):i)-o)/ya.sum(a),l=ya.range(u.length);null!=e&&l.sort(e===vc?function(n,t){return a[t]-a[n]}:function(n,t){return e(u[n],u[t])});var s=[];return l.forEach(function(n){var t;s[n]={data:u[n],value:t=a[n],startAngle:o,endAngle:o+=t*c}}),s}var t=Number,e=vc,r=0,i=2*$a;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(i=t,n):i},n};var vc={};ya.layout.stack=function(){function n(o,c){var l=o.map(function(e,r){return t.call(n,e,r)}),s=l.map(function(t){return t.map(function(t,e){return[u.call(n,t,e),a.call(n,t,e)]})}),f=e.call(n,s,c);l=ya.permute(l,f),s=ya.permute(s,f);var h,g,p,d=r.call(n,s,c),m=l.length,v=l[0].length;for(g=0;v>g;++g)for(i.call(n,l[0][g],p=d[g],s[0][g][1]),h=1;m>h;++h)i.call(n,l[h][g],p+=s[h-1][g][1],s[h][g][1]);return o}var t=ht,e=ci,r=li,i=oi,u=ui,a=ai;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:yc.get(t)||ci,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:Mc.get(t)||li,n):r},n.x=function(t){return arguments.length?(u=t,n):u},n.y=function(t){return arguments.length?(a=t,n):a},n.out=function(t){return arguments.length?(i=t,n):i},n};var yc=ya.map({"inside-out":function(n){var t,e,r=n.length,i=n.map(si),u=n.map(fi),a=ya.range(r).sort(function(n,t){return i[n]-i[t]}),o=0,c=0,l=[],s=[];for(t=0;r>t;++t)e=a[t],c>o?(o+=u[e],l.push(e)):(c+=u[e],s.push(e));return s.reverse().concat(l)},reverse:function(n){return ya.range(n.length).reverse()},"default":ci}),Mc=ya.map({silhouette:function(n){var t,e,r,i=n.length,u=n[0].length,a=[],o=0,c=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];r>o&&(o=r),a.push(r)}for(e=0;u>e;++e)c[e]=(o-a[e])/2;return c},wiggle:function(n){var t,e,r,i,u,a,o,c,l,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=c=l=0,e=1;h>e;++e){for(t=0,i=0;s>t;++t)i+=n[t][e][1];for(t=0,u=0,o=f[e][0]-f[e-1][0];s>t;++t){for(r=0,a=(n[t][e][1]-n[t][e-1][1])/(2*o);t>r;++r)a+=(n[r][e][1]-n[r][e-1][1])/o;u+=a*n[t][e][1]}g[e]=c-=i?u/i*o:0,l>c&&(l=c)}for(e=0;h>e;++e)g[e]-=l;return g},expand:function(n){var t,e,r,i=n.length,u=n[0].length,a=1/i,o=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];if(r)for(t=0;i>t;t++)n[t][e][1]/=r;else for(t=0;i>t;t++)n[t][e][1]=a}for(e=0;u>e;++e)o[e]=0;return o},zero:li});ya.layout.histogram=function(){function n(n,u){for(var a,o,c=[],l=n.map(e,this),s=r.call(this,l,u),f=i.call(this,s,l,u),u=-1,h=l.length,g=f.length-1,p=t?1:1/h;++u<g;)a=c[u]=[],a.dx=f[u+1]-(a.x=f[u]),a.y=0;if(g>0)for(u=-1;++u<h;)o=l[u],o>=s[0]&&o<=s[1]&&(a=c[ya.bisect(f,o,1,g)-1],a.y+=p,a.push(n[u]));return c}var t=!0,e=Number,r=di,i=gi;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=ft(t),n):r},n.bins=function(t){return arguments.length?(i="number"==typeof t?function(n){return pi(n,t)}:ft(t),n):i},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ya.layout.tree=function(){function n(n,u){function a(n,t){var r=n.children,i=n._tree;if(r&&(u=r.length)){for(var u,o,l,s=r[0],f=s,h=-1;++h<u;)l=r[h],a(l,o),f=c(l,o,f),o=l;Si(n);var g=.5*(s._tree.prelim+l._tree.prelim);t?(i.prelim=t._tree.prelim+e(n,t),i.mod=i.prelim-g):i.prelim=g}else t&&(i.prelim=t._tree.prelim+e(n,t))}function o(n,t){n.x=n._tree.prelim+t;var e=n.children;if(e&&(r=e.length)){var r,i=-1;for(t+=n._tree.mod;++i<r;)o(e[i],t)}}function c(n,t,r){if(t){for(var i,u=n,a=n,o=t,c=n.parent.children[0],l=u._tree.mod,s=a._tree.mod,f=o._tree.mod,h=c._tree.mod;o=yi(o),u=vi(u),o&&u;)c=vi(c),a=yi(a),a._tree.ancestor=n,i=o._tree.prelim+f-u._tree.prelim-l+e(o,u),i>0&&(Ei(ki(o,n,r),n,i),l+=i,s+=i),f+=o._tree.mod,l+=u._tree.mod,h+=c._tree.mod,s+=a._tree.mod;o&&!yi(a)&&(a._tree.thread=o,a._tree.mod+=f-s),u&&!vi(c)&&(c._tree.thread=u,c._tree.mod+=l-h,r=n)}return r}var l=t.call(this,n,u),s=l[0];wi(s,function(n,t){n._tree={ancestor:n,prelim:0,mod:0,change:0,shift:0,number:t?t._tree.number+1:0}}),a(s),o(s,-s._tree.prelim);var f=Mi(s,bi),h=Mi(s,xi),g=Mi(s,_i),p=f.x-e(f,h)/2,d=h.x+e(h,f)/2,m=g.depth||1;return wi(s,i?function(n){n.x*=r[0],n.y=n.depth*r[1],delete n._tree}:function(n){n.x=(n.x-p)/(d-p)*r[0],n.y=n.depth/m*r[1],delete n._tree}),l}var t=ya.layout.hierarchy().sort(null).value(null),e=mi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ni(n,t)},ya.layout.pack=function(){function n(n,u){var a=e.call(this,n,u),o=a[0],c=i[0],l=i[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(o.x=o.y=0,wi(o,function(n){n.r=+s(n.value)}),wi(o,Ci),r){var f=r*(t?1:Math.max(2*o.r/c,2*o.r/l))/2;wi(o,function(n){n.r+=f}),wi(o,Ci),wi(o,function(n){n.r-=f})}return ji(o,c/2,l/2,t?1:1/Math.max(2*o.r/c,2*o.r/l)),a}var t,e=ya.layout.hierarchy().sort(Ai),r=0,i=[1,1];return n.size=function(t){return arguments.length?(i=t,n):i},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},ni(n,e)},ya.layout.cluster=function(){function n(n,u){var a,o=t.call(this,n,u),c=o[0],l=0;wi(c,function(n){var t=n.children;t&&t.length?(n.x=Fi(t),n.y=Hi(t)):(n.x=a?l+=e(n,a):0,n.y=0,a=n)});var s=Pi(c),f=Oi(c),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return wi(c,i?function(n){n.x=(n.x-c.x)*r[0],n.y=(c.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),o}var t=ya.layout.hierarchy().sort(null).value(null),e=mi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ni(n,t)},ya.layout.treemap=function(){function n(n,t){for(var e,r,i=-1,u=n.length;++i<u;)r=(e=n[i]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var u=e.children;if(u&&u.length){var a,o,c,l=f(e),s=[],h=u.slice(),p=1/0,d="slice"===g?l.dx:"dice"===g?l.dy:"slice-dice"===g?1&e.depth?l.dy:l.dx:Math.min(l.dx,l.dy);for(n(h,l.dx*l.dy/e.value),s.area=0;(c=h.length)>0;)s.push(a=h[c-1]),s.area+=a.area,"squarify"!==g||(o=r(s,d))<=p?(h.pop(),p=o):(s.area-=s.pop().area,i(s,d,l,!1),d=Math.min(l.dx,l.dy),s.length=s.area=0,p=1/0);s.length&&(i(s,d,l,!0),s.length=s.area=0),u.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var u,a=f(t),o=r.slice(),c=[];for(n(o,a.dx*a.dy/t.value),c.area=0;u=o.pop();)c.push(u),c.area+=u.area,null!=u.z&&(i(c,u.z?a.dx:a.dy,a,!o.length),c.length=c.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,i=0,u=1/0,a=-1,o=n.length;++a<o;)(e=n[a].area)&&(u>e&&(u=e),e>i&&(i=e));return r*=r,t*=t,r?Math.max(t*i*p/r,r/(t*u*p)):1/0}function i(n,t,e,r){var i,u=-1,a=n.length,o=e.x,l=e.y,s=t?c(n.area/t):0;if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++u<a;)i=n[u],i.x=o,i.y=l,i.dy=s,o+=i.dx=Math.min(e.x+e.dx-o,s?c(i.area/s):0);i.z=!0,i.dx+=e.x+e.dx-o,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++u<a;)i=n[u],i.x=o,i.y=l,i.dx=s,l+=i.dy=Math.min(e.y+e.dy-l,s?c(i.area/s):0);i.z=!1,i.dy+=e.y+e.dy-l,e.x+=s,e.dx-=s}}function u(r){var i=a||o(r),u=i[0];return u.x=0,u.y=0,u.dx=l[0],u.dy=l[1],a&&o.revalue(u),n([u],u.dx*u.dy/u.value),(a?e:t)(u),h&&(a=i),i}var a,o=ya.layout.hierarchy(),c=Math.round,l=[1,1],s=null,f=Yi,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return u.size=function(n){return arguments.length?(l=n,u):l},u.padding=function(n){function t(t){var e=n.call(u,t,t.depth);return null==e?Yi(t):Ri(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Ri(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Yi:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,u},u.round=function(n){return arguments.length?(c=n?Math.round:Number,u):c!=Number},u.sticky=function(n){return arguments.length?(h=n,a=null,u):h},u.ratio=function(n){return arguments.length?(p=n,u):p},u.mode=function(n){return arguments.length?(g=n+"",u):g},ni(u,o)},ya.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,i;do e=2*Math.random()-1,r=2*Math.random()-1,i=e*e+r*r;while(!i||i>1);return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){var n=ya.random.normal.apply(ya,arguments);return function(){return Math.exp(n())}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t/n}}},ya.scale={};var xc={floor:ht,ceil:ht};ya.scale.linear=function(){return $i([0,1],[0,1],xr,!1)},ya.scale.log=function(){return tu(ya.scale.linear().domain([0,Math.LN10]),10,eu,ru,[1,10])};var bc=ya.format(".0e");ya.scale.pow=function(){return au(ya.scale.linear(),1,[0,1])},ya.scale.sqrt=function(){return ya.scale.pow().exponent(.5)},ya.scale.ordinal=function(){return cu([],{t:"range",a:[[]]})},ya.scale.category10=function(){return ya.scale.ordinal().range(_c)},ya.scale.category20=function(){return ya.scale.ordinal().range(wc)},ya.scale.category20b=function(){return ya.scale.ordinal().range(Sc)},ya.scale.category20c=function(){return ya.scale.ordinal().range(Ec)};var _c=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"],wc=["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],Sc=["#393b79","#5254a3","#6b6ecf","#9c9ede","#637939","#8ca252","#b5cf6b","#cedb9c","#8c6d31","#bd9e39","#e7ba52","#e7cb94","#843c39","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6"],Ec=["#3182bd","#6baed6","#9ecae1","#c6dbef","#e6550d","#fd8d3c","#fdae6b","#fdd0a2","#31a354","#74c476","#a1d99b","#c7e9c0","#756bb1","#9e9ac8","#bcbddc","#dadaeb","#636363","#969696","#bdbdbd","#d9d9d9"];ya.scale.quantile=function(){return lu([],[])},ya.scale.quantize=function(){return su(0,1,[0,1])},ya.scale.threshold=function(){return fu([.5],[0,1])},ya.scale.identity=function(){return hu([0,1])},ya.svg.arc=function(){function n(){var n=t.apply(this,arguments),u=e.apply(this,arguments),a=r.apply(this,arguments)+kc,o=i.apply(this,arguments)+kc,c=(a>o&&(c=a,a=o,o=c),o-a),l=$a>c?"0":"1",s=Math.cos(a),f=Math.sin(a),h=Math.cos(o),g=Math.sin(o);return c>=Ac?n?"M0,"+u+"A"+u+","+u+" 0 1,1 0,"+-u+"A"+u+","+u+" 0 1,1 0,"+u+"M0,"+n+"A"+n+","+n+" 0 1,0 0,"+-n+"A"+n+","+n+" 0 1,0 0,"+n+"Z":"M0,"+u+"A"+u+","+u+" 0 1,1 0,"+-u+"A"+u+","+u+" 0 1,1 0,"+u+"Z":n?"M"+u*s+","+u*f+"A"+u+","+u+" 0 "+l+",1 "+u*h+","+u*g+"L"+n*h+","+n*g+"A"+n+","+n+" 0 "+l+",0 "+n*s+","+n*f+"Z":"M"+u*s+","+u*f+"A"+u+","+u+" 0 "+l+",1 "+u*h+","+u*g+"L0,0"+"Z"}var t=gu,e=pu,r=du,i=mu;return n.innerRadius=function(e){return arguments.length?(t=ft(e),n):t},n.outerRadius=function(t){return arguments.length?(e=ft(t),n):e},n.startAngle=function(t){return arguments.length?(r=ft(t),n):r},n.endAngle=function(t){return arguments.length?(i=ft(t),n):i},n.centroid=function(){var n=(t.apply(this,arguments)+e.apply(this,arguments))/2,u=(r.apply(this,arguments)+i.apply(this,arguments))/2+kc;return[Math.cos(u)*n,Math.sin(u)*n]},n};var kc=-$a/2,Ac=2*$a-1e-6;ya.svg.line.radial=function(){var n=Pe(vu);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},Ve.reverse=Xe,Xe.reverse=Ve,ya.svg.area=function(){return yu(ht)},ya.svg.area.radial=function(){var n=yu(vu);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ya.svg.chord=function(){function n(n,o){var c=t(this,u,n,o),l=t(this,a,n,o);return"M"+c.p0+r(c.r,c.p1,c.a1-c.a0)+(e(c,l)?i(c.r,c.p1,c.r,c.p0):i(c.r,c.p1,l.r,l.p0)+r(l.r,l.p1,l.a1-l.a0)+i(l.r,l.p1,c.r,c.p0))+"Z"}function t(n,t,e,r){var i=t.call(n,e,r),u=o.call(n,i,r),a=c.call(n,i,r)+kc,s=l.call(n,i,r)+kc;return{r:u,a0:a,a1:s,p0:[u*Math.cos(a),u*Math.sin(a)],p1:[u*Math.cos(s),u*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>$a)+",1 "+t}function i(n,t,e,r){return"Q 0,0 "+r}var u=Ne,a=qe,o=Mu,c=du,l=mu;return n.radius=function(t){return arguments.length?(o=ft(t),n):o},n.source=function(t){return arguments.length?(u=ft(t),n):u},n.target=function(t){return arguments.length?(a=ft(t),n):a},n.startAngle=function(t){return arguments.length?(c=ft(t),n):c},n.endAngle=function(t){return arguments.length?(l=ft(t),n):l},n},ya.svg.diagonal=function(){function n(n,i){var u=t.call(this,n,i),a=e.call(this,n,i),o=(u.y+a.y)/2,c=[u,{x:u.x,y:o},{x:a.x,y:o},a];return c=c.map(r),"M"+c[0]+"C"+c[1]+" "+c[2]+" "+c[3]}var t=Ne,e=qe,r=xu;return n.source=function(e){return arguments.length?(t=ft(e),n):t},n.target=function(t){return arguments.length?(e=ft(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ya.svg.diagonal.radial=function(){var n=ya.svg.diagonal(),t=xu,e=n.projection;return n.projection=function(n){return arguments.length?e(bu(t=n)):t},n},ya.svg.symbol=function(){function n(n,r){return(Nc.get(t.call(this,n,r))||Su)(e.call(this,n,r))}var t=wu,e=_u;return n.type=function(e){return arguments.length?(t=ft(e),n):t},n.size=function(t){return arguments.length?(e=ft(t),n):e},n};var Nc=ya.map({circle:Su,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Cc)),e=t*Cc;return"M0,"+-t+"L"+e+",0"+" 0,"+t+" "+-e+",0"+"Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/Tc),e=t*Tc/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/Tc),e=t*Tc/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ya.svg.symbolTypes=Nc.keys();var qc,Tc=Math.sqrt(3),Cc=Math.tan(30*Ga),zc=[],Dc=0,jc={ease:Ar,delay:0,duration:250};zc.call=Fa.call,zc.empty=Fa.empty,zc.node=Fa.node,zc.size=Fa.size,ya.transition=function(n){return arguments.length?qc?n.transition():n:Ya.transition()},ya.transition.prototype=zc,zc.select=function(n){var t,e,r,i=this.id,u=[];n=v(n);for(var a=-1,o=this.length;++a<o;){u.push(t=[]);for(var c=this[a],l=-1,s=c.length;++l<s;)(r=c[l])&&(e=n.call(r,r.__data__,l))?("__data__"in r&&(e.__data__=r.__data__),Nu(e,l,i,r.__transition__[i]),t.push(e)):t.push(null)}return Eu(u,i)},zc.selectAll=function(n){var t,e,r,i,u,a=this.id,o=[];n=y(n);for(var c=-1,l=this.length;++c<l;)for(var s=this[c],f=-1,h=s.length;++f<h;)if(r=s[f]){u=r.__transition__[a],e=n.call(r,r.__data__,f),o.push(t=[]);for(var g=-1,p=e.length;++g<p;)(i=e[g])&&Nu(i,g,a,u),t.push(i)}return Eu(o,a)},zc.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=N(n));for(var u=0,a=this.length;a>u;u++){i.push(t=[]);for(var e=this[u],o=0,c=e.length;c>o;o++)(r=e[o])&&n.call(r,r.__data__,o)&&t.push(r)}return Eu(i,this.id,this.time).ease(this.ease())},zc.tween=function(n,t){var e=this.id;return arguments.length<2?this.node().__transition__[e].tween.get(n):T(this,null==t?function(t){t.__transition__[e].tween.remove(n)}:function(r){r.__transition__[e].tween.set(n,t)})},zc.attr=function(n,t){function e(){this.removeAttribute(o)}function r(){this.removeAttributeNS(o.space,o.local)}function i(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(o);return e!==n&&(t=a(e,n),function(n){this.setAttribute(o,t(n))})})}function u(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(o.space,o.local);return e!==n&&(t=a(e,n),function(n){this.setAttributeNS(o.space,o.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var a="transform"==n?Ir:xr,o=ya.ns.qualify(n);return ku(this,"attr."+n,t,o.local?u:i)},zc.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(i));return r&&function(n){this.setAttribute(i,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(i.space,i.local));return r&&function(n){this.setAttributeNS(i.space,i.local,r(n))}}var i=ya.ns.qualify(n);return this.tween("attr."+n,i.local?r:e)},zc.style=function(n,t,e){function r(){this.style.removeProperty(n)}function i(t){return null==t?r:(t+="",function(){var r,i=ba.getComputedStyle(this,null).getPropertyValue(n);return i!==t&&(r=xr(i,t),function(t){this.style.setProperty(n,r(t),e)})})}var u=arguments.length;if(3>u){if("string"!=typeof n){2>u&&(t="");for(e in n)this.style(e,n[e],t);return this}e=""}return ku(this,"style."+n,t,i)},zc.styleTween=function(n,t,e){function r(r,i){var u=t.call(this,r,i,ba.getComputedStyle(this,null).getPropertyValue(n));return u&&function(t){this.style.setProperty(n,u(t),e)}}return arguments.length<3&&(e=""),this.tween("style."+n,r)},zc.text=function(n){return ku(this,"text",n,Au)},zc.remove=function(){return this.each("end.transition",function(){var n;!this.__transition__&&(n=this.parentNode)&&n.removeChild(this)})},zc.ease=function(n){var t=this.id;return arguments.length<1?this.node().__transition__[t].ease:("function"!=typeof n&&(n=ya.ease.apply(ya,arguments)),T(this,function(e){e.__transition__[t].ease=n}))},zc.delay=function(n){var t=this.id;return T(this,"function"==typeof n?function(e,r,i){e.__transition__[t].delay=0|n.call(e,e.__data__,r,i)}:(n|=0,function(e){e.__transition__[t].delay=n}))},zc.duration=function(n){var t=this.id;return T(this,"function"==typeof n?function(e,r,i){e.__transition__[t].duration=Math.max(1,0|n.call(e,e.__data__,r,i))}:(n=Math.max(1,0|n),function(e){e.__transition__[t].duration=n}))},zc.each=function(n,t){var e=this.id;if(arguments.length<2){var r=jc,i=qc;qc=e,T(this,function(t,r,i){jc=t.__transition__[e],n.call(t,t.__data__,r,i)}),jc=r,qc=i}else T(this,function(r){r.__transition__[e].event.on(n,t)});return this},zc.transition=function(){for(var n,t,e,r,i=this.id,u=++Dc,a=[],o=0,c=this.length;c>o;o++){a.push(n=[]);for(var t=this[o],l=0,s=t.length;s>l;l++)(e=t[l])&&(r=Object.create(e.__transition__[i]),r.delay+=r.duration,Nu(e,l,u,r)),n.push(e)}return Eu(a,u)},ya.svg.axis=function(){function n(n){n.each(function(){var n,f=ya.select(this),h=null==l?e.ticks?e.ticks.apply(e,c):e.domain():l,g=null==t?e.tickFormat?e.tickFormat.apply(e,c):String:t,p=Cu(e,h,s),d=f.selectAll(".tick.minor").data(p,String),m=d.enter().insert("line",".tick").attr("class","tick minor").style("opacity",1e-6),v=ya.transition(d.exit()).style("opacity",1e-6).remove(),y=ya.transition(d).style("opacity",1),M=f.selectAll(".tick.major").data(h,String),x=M.enter().insert("g",".domain").attr("class","tick major").style("opacity",1e-6),b=ya.transition(M.exit()).style("opacity",1e-6).remove(),_=ya.transition(M).style("opacity",1),w=Ii(e),S=f.selectAll(".domain").data([0]),E=(S.enter().append("path").attr("class","domain"),ya.transition(S)),k=e.copy(),A=this.__chart__||k;this.__chart__=k,x.append("line"),x.append("text");var N=x.select("line"),q=_.select("line"),T=M.select("text").text(g),C=x.select("text"),z=_.select("text");
switch(r){case"bottom":n=qu,m.attr("y2",u),y.attr("x2",0).attr("y2",u),N.attr("y2",i),C.attr("y",Math.max(i,0)+o),q.attr("x2",0).attr("y2",i),z.attr("x",0).attr("y",Math.max(i,0)+o),T.attr("dy",".71em").style("text-anchor","middle"),E.attr("d","M"+w[0]+","+a+"V0H"+w[1]+"V"+a);break;case"top":n=qu,m.attr("y2",-u),y.attr("x2",0).attr("y2",-u),N.attr("y2",-i),C.attr("y",-(Math.max(i,0)+o)),q.attr("x2",0).attr("y2",-i),z.attr("x",0).attr("y",-(Math.max(i,0)+o)),T.attr("dy","0em").style("text-anchor","middle"),E.attr("d","M"+w[0]+","+-a+"V0H"+w[1]+"V"+-a);break;case"left":n=Tu,m.attr("x2",-u),y.attr("x2",-u).attr("y2",0),N.attr("x2",-i),C.attr("x",-(Math.max(i,0)+o)),q.attr("x2",-i).attr("y2",0),z.attr("x",-(Math.max(i,0)+o)).attr("y",0),T.attr("dy",".32em").style("text-anchor","end"),E.attr("d","M"+-a+","+w[0]+"H0V"+w[1]+"H"+-a);break;case"right":n=Tu,m.attr("x2",u),y.attr("x2",u).attr("y2",0),N.attr("x2",i),C.attr("x",Math.max(i,0)+o),q.attr("x2",i).attr("y2",0),z.attr("x",Math.max(i,0)+o).attr("y",0),T.attr("dy",".32em").style("text-anchor","start"),E.attr("d","M"+a+","+w[0]+"H0V"+w[1]+"H"+a)}if(e.ticks)x.call(n,A),_.call(n,k),b.call(n,k),m.call(n,A),y.call(n,k),v.call(n,k);else{var D=k.rangeBand()/2,j=function(n){return k(n)+D};x.call(n,j),_.call(n,j)}})}var t,e=ya.scale.linear(),r=Lc,i=6,u=6,a=6,o=3,c=[10],l=null,s=0;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Hc?t+"":Lc,n):r},n.ticks=function(){return arguments.length?(c=arguments,n):c},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t,e){if(!arguments.length)return i;var r=arguments.length-1;return i=+t,u=r>1?+e:i,a=r>0?+arguments[r]:i,n},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(t){return arguments.length?(s=+t,n):s},n};var Lc="bottom",Hc={top:1,right:1,bottom:1,left:1};ya.svg.brush=function(){function n(u){u.each(function(){var u,a=ya.select(this),s=a.selectAll(".background").data([0]),f=a.selectAll(".extent").data([0]),h=a.selectAll(".resize").data(l,String);a.style("pointer-events","all").on("mousedown.brush",i).on("touchstart.brush",i),s.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),f.enter().append("rect").attr("class","extent").style("cursor","move"),h.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return Fc[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),h.style("display",n.empty()?"none":null),h.exit().remove(),o&&(u=Ii(o),s.attr("x",u[0]).attr("width",u[1]-u[0]),e(a)),c&&(u=Ii(c),s.attr("y",u[0]).attr("height",u[1]-u[0]),r(a)),t(a)})}function t(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+s[+/e$/.test(n)][0]+","+s[+/^s/.test(n)][1]+")"})}function e(n){n.select(".extent").attr("x",s[0][0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",s[1][0]-s[0][0])}function r(n){n.select(".extent").attr("y",s[0][1]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",s[1][1]-s[0][1])}function i(){function i(){var n=ya.event.changedTouches;return n?ya.touches(M,n)[0]:ya.mouse(M)}function l(){32==ya.event.keyCode&&(k||(v=null,N[0]-=s[1][0],N[1]-=s[1][1],k=2),g())}function h(){32==ya.event.keyCode&&2==k&&(N[0]+=s[1][0],N[1]+=s[1][1],k=0,g())}function p(){var n=i(),u=!1;y&&(n[0]+=y[0],n[1]+=y[1]),k||(ya.event.altKey?(v||(v=[(s[0][0]+s[1][0])/2,(s[0][1]+s[1][1])/2]),N[0]=s[+(n[0]<v[0])][0],N[1]=s[+(n[1]<v[1])][1]):v=null),S&&d(n,o,0)&&(e(_),u=!0),E&&d(n,c,1)&&(r(_),u=!0),u&&(t(_),b({type:"brush",mode:k?"move":"resize"}))}function d(n,t,e){var r,i,a=Ii(t),o=a[0],c=a[1],l=N[e],h=s[1][e]-s[0][e];return k&&(o-=l,c-=h+l),r=f[e]?Math.max(o,Math.min(c,n[e])):n[e],k?i=(r+=l)+h:(v&&(l=Math.max(o,Math.min(c,2*v[e]-r))),r>l?(i=r,r=l):i=l),s[0][e]!==r||s[1][e]!==i?(u=null,s[0][e]=r,s[1][e]=i,!0):void 0}function m(){p(),_.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ya.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),A(),b({type:"brushend"})}var v,y,M=this,x=ya.select(ya.event.target),b=a.of(M,arguments),_=ya.select(M),w=x.datum(),S=!/^(n|s)$/.test(w)&&o,E=!/^(e|w)$/.test(w)&&c,k=x.classed("extent"),A=L("brush"),N=i(),q=ya.select(ba).on("keydown.brush",l).on("keyup.brush",h);if(ya.event.changedTouches?q.on("touchmove.brush",p).on("touchend.brush",m):q.on("mousemove.brush",p).on("mouseup.brush",m),k)N[0]=s[0][0]-N[0],N[1]=s[0][1]-N[1];else if(w){var T=+/w$/.test(w),C=+/^n/.test(w);y=[s[1-T][0]-N[0],s[1-C][1]-N[1]],N[0]=s[T][0],N[1]=s[C][1]}else ya.event.altKey&&(v=N.slice());_.style("pointer-events","none").selectAll(".resize").style("display",null),ya.select("body").style("cursor",x.style("cursor")),b({type:"brushstart"}),p()}var u,a=d(n,"brushstart","brush","brushend"),o=null,c=null,l=Pc[0],s=[[0,0],[0,0]],f=[!0,!0];return n.x=function(t){return arguments.length?(o=t,l=Pc[!o<<1|!c],n):o},n.y=function(t){return arguments.length?(c=t,l=Pc[!o<<1|!c],n):c},n.clamp=function(t){return arguments.length?(o&&c?f=[!!t[0],!!t[1]]:(o||c)&&(f[+!o]=!!t),n):o&&c?f:o||c?f[+!o]:null},n.extent=function(t){var e,r,i,a,l;return arguments.length?(u=[[0,0],[0,0]],o&&(e=t[0],r=t[1],c&&(e=e[0],r=r[0]),u[0][0]=e,u[1][0]=r,o.invert&&(e=o(e),r=o(r)),e>r&&(l=e,e=r,r=l),s[0][0]=0|e,s[1][0]=0|r),c&&(i=t[0],a=t[1],o&&(i=i[1],a=a[1]),u[0][1]=i,u[1][1]=a,c.invert&&(i=c(i),a=c(a)),i>a&&(l=i,i=a,a=l),s[0][1]=0|i,s[1][1]=0|a),n):(t=u||s,o&&(e=t[0][0],r=t[1][0],u||(e=s[0][0],r=s[1][0],o.invert&&(e=o.invert(e),r=o.invert(r)),e>r&&(l=e,e=r,r=l))),c&&(i=t[0][1],a=t[1][1],u||(i=s[0][1],a=s[1][1],c.invert&&(i=c.invert(i),a=c.invert(a)),i>a&&(l=i,i=a,a=l))),o&&c?[[e,i],[r,a]]:o?[e,r]:c&&[i,a])},n.clear=function(){return u=null,s[0][0]=s[0][1]=s[1][0]=s[1][1]=0,n},n.empty=function(){return o&&s[0][0]===s[1][0]||c&&s[0][1]===s[1][1]},ya.rebind(n,a,"on")};var Fc={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Pc=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]];ya.time={};var Oc=Date,Yc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];zu.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){Rc.setUTCDate.apply(this._,arguments)},setDay:function(){Rc.setUTCDay.apply(this._,arguments)},setFullYear:function(){Rc.setUTCFullYear.apply(this._,arguments)},setHours:function(){Rc.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){Rc.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){Rc.setUTCMinutes.apply(this._,arguments)},setMonth:function(){Rc.setUTCMonth.apply(this._,arguments)},setSeconds:function(){Rc.setUTCSeconds.apply(this._,arguments)},setTime:function(){Rc.setTime.apply(this._,arguments)}};var Rc=Date.prototype,Uc="%a %b %e %X %Y",Ic="%m/%d/%Y",Vc="%H:%M:%S",Xc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Zc=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Bc=["January","February","March","April","May","June","July","August","September","October","November","December"],$c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];ya.time.year=Du(function(n){return n=ya.time.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ya.time.years=ya.time.year.range,ya.time.years.utc=ya.time.year.utc.range,ya.time.day=Du(function(n){var t=new Oc(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ya.time.days=ya.time.day.range,ya.time.days.utc=ya.time.day.utc.range,ya.time.dayOfYear=function(n){var t=ya.time.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},Yc.forEach(function(n,t){n=n.toLowerCase(),t=7-t;var e=ya.time[n]=Du(function(n){return(n=ya.time.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ya.time.year(n).getDay();return Math.floor((ya.time.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ya.time[n+"s"]=e.range,ya.time[n+"s"].utc=e.utc.range,ya.time[n+"OfYear"]=function(n){var e=ya.time.year(n).getDay();return Math.floor((ya.time.dayOfYear(n)+(e+t)%7)/7)}}),ya.time.week=ya.time.sunday,ya.time.weeks=ya.time.sunday.range,ya.time.weeks.utc=ya.time.sunday.utc.range,ya.time.weekOfYear=ya.time.sundayOfYear,ya.time.format=function(n){function t(t){for(var r,i,u,a=[],o=-1,c=0;++o<e;)37===n.charCodeAt(o)&&(a.push(n.substring(c,o)),null!=(i=il[r=n.charAt(++o)])&&(r=n.charAt(++o)),(u=ul[r])&&(r=u(t,null==i?"e"===r?" ":"0":i)),a.push(r),c=o+1);return a.push(n.substring(c,o)),a.join("")}var e=n.length;return t.parse=function(t){var e={y:1900,m:0,d:1,H:0,M:0,S:0,L:0},r=Lu(e,n,t,0);if(r!=t.length)return null;"p"in e&&(e.H=e.H%12+12*e.p);var i=new Oc;return"j"in e?i.setFullYear(e.y,0,e.j):"w"in e&&("W"in e||"U"in e)?(i.setFullYear(e.y,0,1),i.setFullYear(e.y,0,"W"in e?(e.w+6)%7+7*e.W-(i.getDay()+5)%7:e.w+7*e.U-(i.getDay()+6)%7)):i.setFullYear(e.y,e.m,e.d),i.setHours(e.H,e.M,e.S,e.L),i},t.toString=function(){return n},t};var Wc=Hu(Xc),Jc=Fu(Xc),Gc=Hu(Zc),Kc=Fu(Zc),Qc=Hu(Bc),nl=Fu(Bc),tl=Hu($c),el=Fu($c),rl=/^%/,il={"-":"",_:" ",0:"0"},ul={a:function(n){return Zc[n.getDay()]},A:function(n){return Xc[n.getDay()]},b:function(n){return $c[n.getMonth()]},B:function(n){return Bc[n.getMonth()]},c:ya.time.format(Uc),d:function(n,t){return Pu(n.getDate(),t,2)},e:function(n,t){return Pu(n.getDate(),t,2)},H:function(n,t){return Pu(n.getHours(),t,2)},I:function(n,t){return Pu(n.getHours()%12||12,t,2)},j:function(n,t){return Pu(1+ya.time.dayOfYear(n),t,3)},L:function(n,t){return Pu(n.getMilliseconds(),t,3)},m:function(n,t){return Pu(n.getMonth()+1,t,2)},M:function(n,t){return Pu(n.getMinutes(),t,2)},p:function(n){return n.getHours()>=12?"PM":"AM"},S:function(n,t){return Pu(n.getSeconds(),t,2)},U:function(n,t){return Pu(ya.time.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Pu(ya.time.mondayOfYear(n),t,2)},x:ya.time.format(Ic),X:ya.time.format(Vc),y:function(n,t){return Pu(n.getFullYear()%100,t,2)},Y:function(n,t){return Pu(n.getFullYear()%1e4,t,4)},Z:aa,"%":function(){return"%"}},al={a:Ou,A:Yu,b:Vu,B:Xu,c:Zu,d:Qu,e:Qu,H:ta,I:ta,j:na,L:ia,m:Ku,M:ea,p:ua,S:ra,U:Uu,w:Ru,W:Iu,x:Bu,X:$u,y:Ju,Y:Wu,"%":oa},ol=/^\s*\d+/,cl=ya.map({am:0,pm:1});ya.time.format.utc=function(n){function t(n){try{Oc=zu;var t=new Oc;return t._=n,e(t)}finally{Oc=Date}}var e=ya.time.format(n);return t.parse=function(n){try{Oc=zu;var t=e.parse(n);return t&&t._}finally{Oc=Date}},t.toString=e.toString,t};var ll=ya.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");ya.time.format.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?ca:ll,ca.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},ca.toString=ll.toString,ya.time.second=Du(function(n){return new Oc(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ya.time.seconds=ya.time.second.range,ya.time.seconds.utc=ya.time.second.utc.range,ya.time.minute=Du(function(n){return new Oc(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ya.time.minutes=ya.time.minute.range,ya.time.minutes.utc=ya.time.minute.utc.range,ya.time.hour=Du(function(n){var t=n.getTimezoneOffset()/60;return new Oc(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ya.time.hours=ya.time.hour.range,ya.time.hours.utc=ya.time.hour.utc.range,ya.time.month=Du(function(n){return n=ya.time.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ya.time.months=ya.time.month.range,ya.time.months.utc=ya.time.month.utc.range;var sl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],fl=[[ya.time.second,1],[ya.time.second,5],[ya.time.second,15],[ya.time.second,30],[ya.time.minute,1],[ya.time.minute,5],[ya.time.minute,15],[ya.time.minute,30],[ya.time.hour,1],[ya.time.hour,3],[ya.time.hour,6],[ya.time.hour,12],[ya.time.day,1],[ya.time.day,2],[ya.time.week,1],[ya.time.month,1],[ya.time.month,3],[ya.time.year,1]],hl=[[ya.time.format("%Y"),Rt],[ya.time.format("%B"),function(n){return n.getMonth()}],[ya.time.format("%b %d"),function(n){return 1!=n.getDate()}],[ya.time.format("%a %d"),function(n){return n.getDay()&&1!=n.getDate()}],[ya.time.format("%I %p"),function(n){return n.getHours()}],[ya.time.format("%I:%M"),function(n){return n.getMinutes()}],[ya.time.format(":%S"),function(n){return n.getSeconds()}],[ya.time.format(".%L"),function(n){return n.getMilliseconds()}]],gl=ya.scale.linear(),pl=fa(hl);fl.year=function(n,t){return gl.domain(n.map(ga)).ticks(t).map(ha)},ya.time.scale=function(){return la(ya.scale.linear(),fl,pl)};var dl=fl.map(function(n){return[n[0].utc,n[1]]}),ml=[[ya.time.format.utc("%Y"),Rt],[ya.time.format.utc("%B"),function(n){return n.getUTCMonth()}],[ya.time.format.utc("%b %d"),function(n){return 1!=n.getUTCDate()}],[ya.time.format.utc("%a %d"),function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],[ya.time.format.utc("%I %p"),function(n){return n.getUTCHours()}],[ya.time.format.utc("%I:%M"),function(n){return n.getUTCMinutes()}],[ya.time.format.utc(":%S"),function(n){return n.getUTCSeconds()}],[ya.time.format.utc(".%L"),function(n){return n.getUTCMilliseconds()}]],vl=fa(ml);return dl.year=function(n,t){return gl.domain(n.map(da)).ticks(t).map(pa)},ya.time.scale.utc=function(){return la(ya.scale.linear(),dl,vl)},ya.text=gt(function(n){return n.responseText}),ya.json=function(n,t){return pt(n,"application/json",ma,t)},ya.html=function(n,t){return pt(n,"text/html",va,t)},ya.xml=gt(function(n){return n.responseXML}),ya}();
(function() {
  var CSRFToken, allowLinkExtensions, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsCustomEvents, browserSupportsPushState, browserSupportsTurbolinks, bypassOnLoadPopstate, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, enableTransitionCache, executeScriptTags, extractLink, extractTitleAndBody, fetch, fetchHistory, fetchReplacement, handleClick, historyStateIsDefined, htmlExtensions, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, transitionCacheEnabled, transitionCacheFor, triggerEvent, visit, xhr, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  pageCache = {};

  cacheSize = 10;

  transitionCacheEnabled = false;

  currentState = null;

  loadedAssets = null;

  htmlExtensions = ['html'];

  referer = null;

  createDocument = null;

  xhr = null;

  fetch = function(url) {
    var cachedPage;
    rememberReferer();
    cacheCurrentPage();
    reflectNewUrl(url);
    if (transitionCacheEnabled && (cachedPage = transitionCacheFor(url))) {
      fetchHistory(cachedPage);
      return fetchReplacement(url);
    } else {
      return fetchReplacement(url, resetScrollPosition);
    }
  };

  transitionCacheFor = function(url) {
    var cachedPage;
    cachedPage = pageCache[url];
    if (cachedPage && !cachedPage.transitionCacheDisabled) {
      return cachedPage;
    }
  };

  enableTransitionCache = function(enable) {
    if (enable == null) {
      enable = true;
    }
    return transitionCacheEnabled = enable;
  };

  fetchReplacement = function(url, onLoadFunction) {
    if (onLoadFunction == null) {
      onLoadFunction = (function(_this) {
        return function() {};
      })(this);
    }
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        onLoadFunction();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.url] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset,
      cachedAt: new Date().getTime(),
      transitionCacheDisabled: document.querySelector('[data-no-transition-cache]') != null
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var cacheTimesRecentFirst, key, pageCacheKeys, _i, _len, _results;
    pageCacheKeys = Object.keys(pageCache);
    cacheTimesRecentFirst = pageCacheKeys.map(function(url) {
      return pageCache[url].cachedAt;
    }).sort(function(a, b) {
      return b - a;
    });
    _results = [];
    for (_i = 0, _len = pageCacheKeys.length; _i < _len; _i++) {
      key = pageCacheKeys[_i];
      if (!(pageCache[key].cachedAt <= cacheTimesRecentFirst[limit])) {
        continue;
      }
      triggerEvent('page:expire', pageCache[key]);
      _results.push(delete pageCache[key]);
    }
    return _results;
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function(node) {
    node.innerHTML = node.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/ig, '');
    return node;
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        url: url
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      url: document.location.href
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, removeNoscriptTags(doc.body), CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(new RegExp("\\.(?:" + (htmlExtensions.join('|')) + ")?(\\?.*)?$", 'g'));
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  allowLinkExtensions = function() {
    var extension, extensions, _i, _len;
    extensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      extension = extensions[_i];
      htmlExtensions.push(extension);
    }
    return htmlExtensions;
  };

  bypassOnLoadPopstate = function(fn) {
    return setTimeout(fn, 500);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.url]) {
        cacheCurrentPage();
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return bypassOnLoadPopstate(function() {
      return window.addEventListener('popstate', installHistoryChangeHandler, false);
    });
  };

  historyStateIsDefined = window.history.state !== void 0 || navigator.userAgent.match(/Firefox\/2[6|7]/);

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && historyStateIsDefined;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  browserSupportsCustomEvents = document.addEventListener && document.createEvent;

  if (browserSupportsCustomEvents) {
    installDocumentReadyPageEventTriggers();
    installJqueryAjaxSuccessPageUpdateTrigger();
  }

  if (browserSupportsTurbolinks) {
    visit = fetch;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    enableTransitionCache: enableTransitionCache,
    allowLinkExtensions: allowLinkExtensions,
    supported: browserSupportsTurbolinks
  };

}).call(this);
/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2013 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/

!function(e){"use strict";e(function(){e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()};var r=e.fn.alert;e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e.fn.alert.noConflict=function(){return e.fn.alert=r,this},e(document).on("click.alert.data-api",t,n.prototype.close)}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")};var n=e.fn.button;e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e.fn.button.noConflict=function(){return e.fn.button=n,this},e(document).on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.$indicators=this.$element.find(".carousel-indicators"),this.options=n,this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},getActiveIndex:function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},to:function(t){var n=this.getActiveIndex(),r=this;if(t>this.$items.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){r.to(t)}):n==t?this.pause().cycle():this.slide(t>n?"next":"prev",e(this.$items[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle(!0)),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f;this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u](),f=e.Event("slide",{relatedTarget:i[0],direction:o});if(i.hasClass("active"))return;this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var t=e(a.$indicators.children()[a.getActiveIndex()]);t&&t.addClass("active")}));if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}};var n=e.fn.carousel;e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.pause().cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e.fn.carousel.noConflict=function(){return e.fn.carousel=n,this},e(document).on("click.carousel.data-api","[data-slide], [data-slide-to]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=e.extend({},i.data(),n.data()),o;i.carousel(s),(o=n.attr("data-slide-to"))&&i.data("carousel").pause().to(o).cycle(),t.preventDefault()})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning||this.$element.hasClass("in"))return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning||!this.$element.hasClass("in"))return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};var n=e.fn.collapse;e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=e.extend({},e.fn.collapse.defaults,r.data(),typeof n=="object"&&n);i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e.fn.collapse.noConflict=function(){return e.fn.collapse=n,this},e(document).on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})}(window.jQuery),!function(e){"use strict";function r(){e(".dropdown-backdrop").remove(),e(t).each(function(){i(e(this)).removeClass("open")})}function i(t){var n=t.attr("data-target"),r;n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=n&&e(n);if(!r||!r.length)r=t.parent();return r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||("ontouchstart"in document.documentElement&&e('<div class="dropdown-backdrop"/>').insertBefore(e(this)).on("click",r),s.toggleClass("open")),n.focus(),!1},keydown:function(n){var r,s,o,u,a,f;if(!/(38|40|27)/.test(n.keyCode))return;r=e(this),n.preventDefault(),n.stopPropagation();if(r.is(".disabled, :disabled"))return;u=i(r),a=u.hasClass("open");if(!a||a&&n.keyCode==27)return n.which==27&&u.find(t).focus(),r.click();s=e("[role=menu] li:not(.divider):visible a",u);if(!s.length)return;f=s.index(s.filter(":focus")),n.keyCode==38&&f>0&&f--,n.keyCode==40&&f<s.length-1&&f++,~f||(f=0),s.eq(f).focus()}};var s=e.fn.dropdown;e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e.fn.dropdown.noConflict=function(){return e.fn.dropdown=s,this},e(document).on("click.dropdown.data-api",r).on("click.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.focus().trigger("shown")}):t.$element.focus().trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(){var e=this;this.$element.hide(),this.backdrop(function(){e.removeBackdrop(),e.$element.trigger("hidden")})},removeBackdrop:function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.$backdrop.click(this.options.backdrop=="static"?e.proxy(this.$element[0].focus,this.$element[0]):e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in");if(!t)return;i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,t):t()):t&&t()}};var n=e.fn.modal;e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e.fn.modal.noConflict=function(){return e.fn.modal=n,this},e(document).on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s,o,u,a;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,o=this.options.trigger.split(" ");for(a=o.length;a--;)u=o[a],u=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):u!="manual"&&(i=u=="hover"?"mouseenter":"focus",s=u=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this)));this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,this.$element.data(),t),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e.fn[this.type].defaults,r={},i;this._options&&e.each(this._options,function(e,t){n[e]!=t&&(r[e]=t)},this),i=e(t.currentTarget)[this.type](r).data(this.type);if(!i.options.delay||!i.options.delay.show)return i.show();clearTimeout(this.timeout),i.hoverState="in",this.timeout=setTimeout(function(){i.hoverState=="in"&&i.show()},i.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var t,n,r,i,s,o,u=e.Event("show");if(this.hasContent()&&this.enabled){this.$element.trigger(u);if(u.isDefaultPrevented())return;t=this.tip(),this.setContent(),this.options.animation&&t.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,t[0],this.$element[0]):this.options.placement,t.detach().css({top:0,left:0,display:"block"}),this.options.container?t.appendTo(this.options.container):t.insertAfter(this.$element),n=this.getPosition(),r=t[0].offsetWidth,i=t[0].offsetHeight;switch(s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}this.applyPlacement(o,s),this.$element.trigger("shown")}},applyPlacement:function(e,t){var n=this.tip(),r=n[0].offsetWidth,i=n[0].offsetHeight,s,o,u,a;n.offset(e).addClass(t).addClass("in"),s=n[0].offsetWidth,o=n[0].offsetHeight,t=="top"&&o!=i&&(e.top=e.top+i-o,a=!0),t=="bottom"||t=="top"?(u=0,e.left<0&&(u=e.left*-2,e.left=0,n.offset(e),s=n[0].offsetWidth,o=n[0].offsetHeight),this.replaceArrow(u-r+s,s,"left")):this.replaceArrow(o-i,o,"top"),a&&n.offset(e)},replaceArrow:function(e,t,n){this.arrow().css(n,e?50*(1-e/t)+"%":"")},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function i(){var t=setTimeout(function(){n.off(e.support.transition.end).detach()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.detach()})}var t=this,n=this.tip(),r=e.Event("hide");this.$element.trigger(r);if(r.isDefaultPrevented())return;return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?i():n.detach(),this.$element.trigger("hidden"),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").attr("title","")},hasContent:function(){return this.getTitle()},getPosition:function(){var t=this.$element[0];return e.extend({},typeof t.getBoundingClientRect=="function"?t.getBoundingClientRect():{width:t.offsetWidth,height:t.offsetHeight},this.$element.offset())},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},arrow:function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(t){var n=t?e(t.currentTarget)[this.type](this._options).data(this.type):this;n.tip().hasClass("in")?n.hide():n.show()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}};var n=e.fn.tooltip;e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},e.fn.tooltip.noConflict=function(){return e.fn.tooltip=n,this}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=(typeof n.content=="function"?n.content.call(t[0]):n.content)||t.attr("data-content"),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}});var n=e.fn.popover;e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),e.fn.popover.noConflict=function(){return e.fn.popover=n,this}}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var n=e(this),r=n.data("target")||n.attr("href"),i=/^#\w/.test(r)&&e(r);return i&&i.length&&[[i.position().top+(!e.isWindow(t.$scrollElement.get(0))&&t.$scrollElement.scrollTop()),r]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}};var n=e.fn.scrollspy;e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e.fn.scrollspy.noConflict=function(){return e.fn.scrollspy=n,this},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active:last a")[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}};var n=e.fn.tab;e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e.fn.tab.noConflict=function(){return e.fn.tab=n,this},e(document).on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.source=this.options.source,this.$menu=e(this.options.menu),this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return this.$menu.insertAfter(this.$element).css({top:t.top+t.height,left:t.left}).show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("focus",e.proxy(this.focus,this)).on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this)).on("mouseleave","li",e.proxy(this.mouseleave,this))},eventSupported:function(e){var t=e in this.$element;return t||(this.$element.setAttribute(e,"return;"),t=typeof this.$element[e]=="function"),t},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},focus:function(e){this.focused=!0},blur:function(e){this.focused=!1,!this.mousedover&&this.shown&&this.hide()},click:function(e){e.stopPropagation(),e.preventDefault(),this.select(),this.$element.focus()},mouseenter:function(t){this.mousedover=!0,this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")},mouseleave:function(e){this.mousedover=!1,!this.focused&&this.shown&&this.hide()}};var n=e.fn.typeahead;e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e.fn.typeahead.noConflict=function(){return e.fn.typeahead=n,this},e(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;n.typeahead(n.data())})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)).on("click.affix.data-api",e.proxy(function(){setTimeout(e.proxy(this.checkPosition,this),1)},this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))};var n=e.fn.affix;e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e.fn.affix.noConflict=function(){return e.fn.affix=n,this},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);
/*! X-editable - v1.5.1 
* In-place editing with Twitter Bootstrap, jQuery UI or pure jQuery
* http://github.com/vitalets/x-editable
* Copyright (c) 2013 Vitaliy Potapov; Licensed MIT */

!function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.editableform.defaults,c),this.$div=a(b),this.options.scope||(this.options.scope=this)};b.prototype={constructor:b,initInput:function(){this.input=this.options.input,this.value=this.input.str2value(this.options.value),this.input.prerender()},initTemplate:function(){this.$form=a(a.fn.editableform.template)},initButtons:function(){var b=this.$form.find(".editable-buttons");b.append(a.fn.editableform.buttons),"bottom"===this.options.showbuttons&&b.addClass("editable-buttons-bottom")},render:function(){this.$loading=a(a.fn.editableform.loading),this.$div.empty().append(this.$loading),this.initTemplate(),this.options.showbuttons?this.initButtons():this.$form.find(".editable-buttons").remove(),this.showLoading(),this.isSaving=!1,this.$div.triggerHandler("rendering"),this.initInput(),this.$form.find("div.editable-input").append(this.input.$tpl),this.$div.append(this.$form),a.when(this.input.render()).then(a.proxy(function(){if(this.options.showbuttons||this.input.autosubmit(),this.$form.find(".editable-cancel").click(a.proxy(this.cancel,this)),this.input.error)this.error(this.input.error),this.$form.find(".editable-submit").attr("disabled",!0),this.input.$input.attr("disabled",!0),this.$form.submit(function(a){a.preventDefault()});else{this.error(!1),this.input.$input.removeAttr("disabled"),this.$form.find(".editable-submit").removeAttr("disabled");var b=null===this.value||void 0===this.value||""===this.value?this.options.defaultValue:this.value;this.input.value2input(b),this.$form.submit(a.proxy(this.submit,this))}this.$div.triggerHandler("rendered"),this.showForm(),this.input.postrender&&this.input.postrender()},this))},cancel:function(){this.$div.triggerHandler("cancel")},showLoading:function(){var a,b;this.$form?(a=this.$form.outerWidth(),b=this.$form.outerHeight(),a&&this.$loading.width(a),b&&this.$loading.height(b),this.$form.hide()):(a=this.$loading.parent().width(),a&&this.$loading.width(a)),this.$loading.show()},showForm:function(a){this.$loading.hide(),this.$form.show(),a!==!1&&this.input.activate(),this.$div.triggerHandler("show")},error:function(b){var c,d=this.$form.find(".control-group"),e=this.$form.find(".editable-error-block");if(b===!1)d.removeClass(a.fn.editableform.errorGroupClass),e.removeClass(a.fn.editableform.errorBlockClass).empty().hide();else{if(b){c=(""+b).split("\n");for(var f=0;f<c.length;f++)c[f]=a("<div>").text(c[f]).html();b=c.join("<br>")}d.addClass(a.fn.editableform.errorGroupClass),e.addClass(a.fn.editableform.errorBlockClass).html(b).show()}},submit:function(b){b.stopPropagation(),b.preventDefault();var c=this.input.input2value(),d=this.validate(c);if("object"===a.type(d)&&void 0!==d.newValue){if(c=d.newValue,this.input.value2input(c),"string"==typeof d.msg)return this.error(d.msg),this.showForm(),void 0}else if(d)return this.error(d),this.showForm(),void 0;if(!this.options.savenochange&&this.input.value2str(c)==this.input.value2str(this.value))return this.$div.triggerHandler("nochange"),void 0;var e=this.input.value2submit(c);this.isSaving=!0,a.when(this.save(e)).done(a.proxy(function(a){this.isSaving=!1;var b="function"==typeof this.options.success?this.options.success.call(this.options.scope,a,c):null;return b===!1?(this.error(!1),this.showForm(!1),void 0):"string"==typeof b?(this.error(b),this.showForm(),void 0):(b&&"object"==typeof b&&b.hasOwnProperty("newValue")&&(c=b.newValue),this.error(!1),this.value=c,this.$div.triggerHandler("save",{newValue:c,submitValue:e,response:a}),void 0)},this)).fail(a.proxy(function(a){this.isSaving=!1;var b;b="function"==typeof this.options.error?this.options.error.call(this.options.scope,a,c):"string"==typeof a?a:a.responseText||a.statusText||"Unknown error!",this.error(b),this.showForm()},this))},save:function(b){this.options.pk=a.fn.editableutils.tryParseJson(this.options.pk,!0);var c,d="function"==typeof this.options.pk?this.options.pk.call(this.options.scope):this.options.pk,e=!!("function"==typeof this.options.url||this.options.url&&("always"===this.options.send||"auto"===this.options.send&&null!==d&&void 0!==d));return e?(this.showLoading(),c={name:this.options.name||"",value:b,pk:d},"function"==typeof this.options.params?c=this.options.params.call(this.options.scope,c):(this.options.params=a.fn.editableutils.tryParseJson(this.options.params,!0),a.extend(c,this.options.params)),"function"==typeof this.options.url?this.options.url.call(this.options.scope,c):a.ajax(a.extend({url:this.options.url,data:c,type:"POST"},this.options.ajaxOptions))):void 0},validate:function(a){return void 0===a&&(a=this.value),"function"==typeof this.options.validate?this.options.validate.call(this.options.scope,a):void 0},option:function(a,b){a in this.options&&(this.options[a]=b),"value"===a&&this.setValue(b)},setValue:function(a,b){this.value=b?this.input.str2value(a):a,this.$form&&this.$form.is(":visible")&&this.input.value2input(this.value)}},a.fn.editableform=function(c){var d=arguments;return this.each(function(){var e=a(this),f=e.data("editableform"),g="object"==typeof c&&c;f||e.data("editableform",f=new b(this,g)),"string"==typeof c&&f[c].apply(f,Array.prototype.slice.call(d,1))})},a.fn.editableform.Constructor=b,a.fn.editableform.defaults={type:"text",url:null,params:null,name:null,pk:null,value:null,defaultValue:null,send:"auto",validate:null,success:null,error:null,ajaxOptions:null,showbuttons:!0,scope:null,savenochange:!1},a.fn.editableform.template='<form class="form-inline editableform"><div class="control-group"><div><div class="editable-input"></div><div class="editable-buttons"></div></div><div class="editable-error-block"></div></div></form>',a.fn.editableform.loading='<div class="editableform-loading"></div>',a.fn.editableform.buttons='<button type="submit" class="editable-submit">ok</button><button type="button" class="editable-cancel">cancel</button>',a.fn.editableform.errorGroupClass=null,a.fn.editableform.errorBlockClass="editable-error",a.fn.editableform.engine="jquery"}(window.jQuery),function(a){"use strict";a.fn.editableutils={inherit:function(a,b){var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a,a.superclass=b.prototype},setCursorPosition:function(a,b){if(a.setSelectionRange)a.setSelectionRange(b,b);else if(a.createTextRange){var c=a.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",b),c.select()}},tryParseJson:function(a,b){if("string"==typeof a&&a.length&&a.match(/^[\{\[].*[\}\]]$/))if(b)try{a=new Function("return "+a)()}catch(c){}finally{return a}else a=new Function("return "+a)();return a},sliceObj:function(b,c,d){var e,f,g={};if(!a.isArray(c)||!c.length)return g;for(var h=0;h<c.length;h++)e=c[h],b.hasOwnProperty(e)&&(g[e]=b[e]),d!==!0&&(f=e.toLowerCase(),b.hasOwnProperty(f)&&(g[e]=b[f]));return g},getConfigData:function(b){var c={};return a.each(b.data(),function(a,b){("object"!=typeof b||b&&"object"==typeof b&&(b.constructor===Object||b.constructor===Array))&&(c[a]=b)}),c},objectKeys:function(a){if(Object.keys)return Object.keys(a);if(a!==Object(a))throw new TypeError("Object.keys called on a non-object");var b,c=[];for(b in a)Object.prototype.hasOwnProperty.call(a,b)&&c.push(b);return c},escape:function(b){return a("<div>").text(b).html()},itemsByValue:function(b,c,d){if(!c||null===b)return[];if("function"!=typeof d){var e=d||"value";d=function(a){return a[e]}}var f=a.isArray(b),g=[],h=this;return a.each(c,function(c,e){if(e.children)g=g.concat(h.itemsByValue(b,e.children,d));else if(f)a.grep(b,function(a){return a==(e&&"object"==typeof e?d(e):e)}).length&&g.push(e);else{var i=e&&"object"==typeof e?d(e):e;b==i&&g.push(e)}}),g},createInput:function(b){var c,d,e,f=b.type;return"date"===f&&("inline"===b.mode?a.fn.editabletypes.datefield?f="datefield":a.fn.editabletypes.dateuifield&&(f="dateuifield"):a.fn.editabletypes.date?f="date":a.fn.editabletypes.dateui&&(f="dateui"),"date"!==f||a.fn.editabletypes.date||(f="combodate")),"datetime"===f&&"inline"===b.mode&&(f="datetimefield"),"wysihtml5"!==f||a.fn.editabletypes[f]||(f="textarea"),"function"==typeof a.fn.editabletypes[f]?(c=a.fn.editabletypes[f],d=this.sliceObj(b,this.objectKeys(c.defaults)),e=new c(d)):(a.error("Unknown type: "+f),!1)},supportsTransitions:function(){var a=document.body||document.documentElement,b=a.style,c="transition",d=["Moz","Webkit","Khtml","O","ms"];if("string"==typeof b[c])return!0;c=c.charAt(0).toUpperCase()+c.substr(1);for(var e=0;e<d.length;e++)if("string"==typeof b[d[e]+c])return!0;return!1}}}(window.jQuery),function(a){"use strict";var b=function(a,b){this.init(a,b)},c=function(a,b){this.init(a,b)};b.prototype={containerName:null,containerDataName:null,innerCss:null,containerClass:"editable-container editable-popup",defaults:{},init:function(c,d){this.$element=a(c),this.options=a.extend({},a.fn.editableContainer.defaults,d),this.splitOptions(),this.formOptions.scope=this.$element[0],this.initContainer(),this.delayedHide=!1,this.$element.on("destroyed",a.proxy(function(){this.destroy()},this)),a(document).data("editable-handlers-attached")||(a(document).on("keyup.editable",function(b){27===b.which&&a(".editable-open").editableContainer("hide")}),a(document).on("click.editable",function(c){var d,e=a(c.target),f=[".editable-container",".ui-datepicker-header",".datepicker",".modal-backdrop",".bootstrap-wysihtml5-insert-image-modal",".bootstrap-wysihtml5-insert-link-modal"];if(a.contains(document.documentElement,c.target)&&!e.is(document)){for(d=0;d<f.length;d++)if(e.is(f[d])||e.parents(f[d]).length)return;b.prototype.closeOthers(c.target)}}),a(document).data("editable-handlers-attached",!0))},splitOptions:function(){if(this.containerOptions={},this.formOptions={},!a.fn[this.containerName])throw new Error(this.containerName+" not found. Have you included corresponding js file?");for(var b in this.options)b in this.defaults?this.containerOptions[b]=this.options[b]:this.formOptions[b]=this.options[b]},tip:function(){return this.container()?this.container().$tip:null},container:function(){var a;return this.containerDataName&&(a=this.$element.data(this.containerDataName))?a:a=this.$element.data(this.containerName)},call:function(){this.$element[this.containerName].apply(this.$element,arguments)},initContainer:function(){this.call(this.containerOptions)},renderForm:function(){this.$form.editableform(this.formOptions).on({save:a.proxy(this.save,this),nochange:a.proxy(function(){this.hide("nochange")},this),cancel:a.proxy(function(){this.hide("cancel")},this),show:a.proxy(function(){this.delayedHide?(this.hide(this.delayedHide.reason),this.delayedHide=!1):this.setPosition()},this),rendering:a.proxy(this.setPosition,this),resize:a.proxy(this.setPosition,this),rendered:a.proxy(function(){this.$element.triggerHandler("shown",a(this.options.scope).data("editable"))},this)}).editableform("render")},show:function(b){this.$element.addClass("editable-open"),b!==!1&&this.closeOthers(this.$element[0]),this.innerShow(),this.tip().addClass(this.containerClass),this.$form,this.$form=a("<div>"),this.tip().is(this.innerCss)?this.tip().append(this.$form):this.tip().find(this.innerCss).append(this.$form),this.renderForm()},hide:function(a){if(this.tip()&&this.tip().is(":visible")&&this.$element.hasClass("editable-open")){if(this.$form.data("editableform").isSaving)return this.delayedHide={reason:a},void 0;this.delayedHide=!1,this.$element.removeClass("editable-open"),this.innerHide(),this.$element.triggerHandler("hidden",a||"manual")}},innerShow:function(){},innerHide:function(){},toggle:function(a){this.container()&&this.tip()&&this.tip().is(":visible")?this.hide():this.show(a)},setPosition:function(){},save:function(a,b){this.$element.triggerHandler("save",b),this.hide("save")},option:function(a,b){this.options[a]=b,a in this.containerOptions?(this.containerOptions[a]=b,this.setContainerOption(a,b)):(this.formOptions[a]=b,this.$form&&this.$form.editableform("option",a,b))},setContainerOption:function(a,b){this.call("option",a,b)},destroy:function(){this.hide(),this.innerDestroy(),this.$element.off("destroyed"),this.$element.removeData("editableContainer")},innerDestroy:function(){},closeOthers:function(b){a(".editable-open").each(function(c,d){if(d!==b&&!a(d).find(b).length){var e=a(d),f=e.data("editableContainer");f&&("cancel"===f.options.onblur?e.data("editableContainer").hide("onblur"):"submit"===f.options.onblur&&e.data("editableContainer").tip().find("form").submit())}})},activate:function(){this.tip&&this.tip().is(":visible")&&this.$form&&this.$form.data("editableform").input.activate()}},a.fn.editableContainer=function(d){var e=arguments;return this.each(function(){var f=a(this),g="editableContainer",h=f.data(g),i="object"==typeof d&&d,j="inline"===i.mode?c:b;h||f.data(g,h=new j(this,i)),"string"==typeof d&&h[d].apply(h,Array.prototype.slice.call(e,1))})},a.fn.editableContainer.Popup=b,a.fn.editableContainer.Inline=c,a.fn.editableContainer.defaults={value:null,placement:"top",autohide:!0,onblur:"cancel",anim:!1,mode:"popup"},jQuery.event.special.destroyed={remove:function(a){a.handler&&a.handler()}}}(window.jQuery),function(a){"use strict";a.extend(a.fn.editableContainer.Inline.prototype,a.fn.editableContainer.Popup.prototype,{containerName:"editableform",innerCss:".editable-inline",containerClass:"editable-container editable-inline",initContainer:function(){this.$tip=a("<span></span>"),this.options.anim||(this.options.anim=0)},splitOptions:function(){this.containerOptions={},this.formOptions=this.options},tip:function(){return this.$tip},innerShow:function(){this.$element.hide(),this.tip().insertAfter(this.$element).show()},innerHide:function(){this.$tip.hide(this.options.anim,a.proxy(function(){this.$element.show(),this.innerDestroy()},this))},innerDestroy:function(){this.tip()&&this.tip().empty().remove()}})}(window.jQuery),function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.editable.defaults,c,a.fn.editableutils.getConfigData(this.$element)),this.options.selector?this.initLive():this.init(),this.options.highlight&&!a.fn.editableutils.supportsTransitions()&&(this.options.highlight=!1)};b.prototype={constructor:b,init:function(){var b,c=!1;if(this.options.name=this.options.name||this.$element.attr("id"),this.options.scope=this.$element[0],this.input=a.fn.editableutils.createInput(this.options),this.input){switch(void 0===this.options.value||null===this.options.value?(this.value=this.input.html2value(a.trim(this.$element.html())),c=!0):(this.options.value=a.fn.editableutils.tryParseJson(this.options.value,!0),this.value="string"==typeof this.options.value?this.input.str2value(this.options.value):this.options.value),this.$element.addClass("editable"),"textarea"===this.input.type&&this.$element.addClass("editable-pre-wrapped"),"manual"!==this.options.toggle?(this.$element.addClass("editable-click"),this.$element.on(this.options.toggle+".editable",a.proxy(function(a){if(this.options.disabled||a.preventDefault(),"mouseenter"===this.options.toggle)this.show();else{var b="click"!==this.options.toggle;this.toggle(b)}},this))):this.$element.attr("tabindex",-1),"function"==typeof this.options.display&&(this.options.autotext="always"),this.options.autotext){case"always":b=!0;break;case"auto":b=!a.trim(this.$element.text()).length&&null!==this.value&&void 0!==this.value&&!c;break;default:b=!1}a.when(b?this.render():!0).then(a.proxy(function(){this.options.disabled?this.disable():this.enable(),this.$element.triggerHandler("init",this)},this))}},initLive:function(){var b=this.options.selector;this.options.selector=!1,this.options.autotext="never",this.$element.on(this.options.toggle+".editable",b,a.proxy(function(b){var c=a(b.target);c.data("editable")||(c.hasClass(this.options.emptyclass)&&c.empty(),c.editable(this.options).trigger(b))},this))},render:function(a){return this.options.display!==!1?this.input.value2htmlFinal?this.input.value2html(this.value,this.$element[0],this.options.display,a):"function"==typeof this.options.display?this.options.display.call(this.$element[0],this.value,a):this.input.value2html(this.value,this.$element[0]):void 0},enable:function(){this.options.disabled=!1,this.$element.removeClass("editable-disabled"),this.handleEmpty(this.isEmpty),"manual"!==this.options.toggle&&"-1"===this.$element.attr("tabindex")&&this.$element.removeAttr("tabindex")},disable:function(){this.options.disabled=!0,this.hide(),this.$element.addClass("editable-disabled"),this.handleEmpty(this.isEmpty),this.$element.attr("tabindex",-1)},toggleDisabled:function(){this.options.disabled?this.enable():this.disable()},option:function(b,c){return b&&"object"==typeof b?(a.each(b,a.proxy(function(b,c){this.option(a.trim(b),c)},this)),void 0):(this.options[b]=c,"disabled"===b?c?this.disable():this.enable():("value"===b&&this.setValue(c),this.container&&this.container.option(b,c),this.input.option&&this.input.option(b,c),void 0))},handleEmpty:function(b){this.options.display!==!1&&(this.isEmpty=void 0!==b?b:"function"==typeof this.input.isEmpty?this.input.isEmpty(this.$element):""===a.trim(this.$element.html()),this.options.disabled?this.isEmpty&&(this.$element.empty(),this.options.emptyclass&&this.$element.removeClass(this.options.emptyclass)):this.isEmpty?(this.$element.html(this.options.emptytext),this.options.emptyclass&&this.$element.addClass(this.options.emptyclass)):this.options.emptyclass&&this.$element.removeClass(this.options.emptyclass))},show:function(b){if(!this.options.disabled){if(this.container){if(this.container.tip().is(":visible"))return}else{var c=a.extend({},this.options,{value:this.value,input:this.input});this.$element.editableContainer(c),this.$element.on("save.internal",a.proxy(this.save,this)),this.container=this.$element.data("editableContainer")}this.container.show(b)}},hide:function(){this.container&&this.container.hide()},toggle:function(a){this.container&&this.container.tip().is(":visible")?this.hide():this.show(a)},save:function(a,b){if(this.options.unsavedclass){var c=!1;c=c||"function"==typeof this.options.url,c=c||this.options.display===!1,c=c||void 0!==b.response,c=c||this.options.savenochange&&this.input.value2str(this.value)!==this.input.value2str(b.newValue),c?this.$element.removeClass(this.options.unsavedclass):this.$element.addClass(this.options.unsavedclass)}if(this.options.highlight){var d=this.$element,e=d.css("background-color");d.css("background-color",this.options.highlight),setTimeout(function(){"transparent"===e&&(e=""),d.css("background-color",e),d.addClass("editable-bg-transition"),setTimeout(function(){d.removeClass("editable-bg-transition")},1700)},10)}this.setValue(b.newValue,!1,b.response)},validate:function(){return"function"==typeof this.options.validate?this.options.validate.call(this,this.value):void 0},setValue:function(b,c,d){this.value=c?this.input.str2value(b):b,this.container&&this.container.option("value",this.value),a.when(this.render(d)).then(a.proxy(function(){this.handleEmpty()},this))},activate:function(){this.container&&this.container.activate()},destroy:function(){this.disable(),this.container&&this.container.destroy(),this.input.destroy(),"manual"!==this.options.toggle&&(this.$element.removeClass("editable-click"),this.$element.off(this.options.toggle+".editable")),this.$element.off("save.internal"),this.$element.removeClass("editable editable-open editable-disabled"),this.$element.removeData("editable")}},a.fn.editable=function(c){var d={},e=arguments,f="editable";switch(c){case"validate":return this.each(function(){var b,c=a(this),e=c.data(f);e&&(b=e.validate())&&(d[e.options.name]=b)}),d;case"getValue":return 2===arguments.length&&arguments[1]===!0?d=this.eq(0).data(f).value:this.each(function(){var b=a(this),c=b.data(f);c&&void 0!==c.value&&null!==c.value&&(d[c.options.name]=c.input.value2submit(c.value))}),d;case"submit":var g=arguments[1]||{},h=this,i=this.editable("validate");if(a.isEmptyObject(i)){var j={};if(1===h.length){var k=h.data("editable"),l={name:k.options.name||"",value:k.input.value2submit(k.value),pk:"function"==typeof k.options.pk?k.options.pk.call(k.options.scope):k.options.pk};"function"==typeof k.options.params?l=k.options.params.call(k.options.scope,l):(k.options.params=a.fn.editableutils.tryParseJson(k.options.params,!0),a.extend(l,k.options.params)),j={url:k.options.url,data:l,type:"POST"},g.success=g.success||k.options.success,g.error=g.error||k.options.error}else{var m=this.editable("getValue");j={url:g.url,data:m,type:"POST"}}j.success="function"==typeof g.success?function(a){g.success.call(h,a,g)}:a.noop,j.error="function"==typeof g.error?function(){g.error.apply(h,arguments)}:a.noop,g.ajaxOptions&&a.extend(j,g.ajaxOptions),g.data&&a.extend(j.data,g.data),a.ajax(j)}else"function"==typeof g.error&&g.error.call(h,i);return this}return this.each(function(){var d=a(this),g=d.data(f),h="object"==typeof c&&c;return h&&h.selector?(g=new b(this,h),void 0):(g||d.data(f,g=new b(this,h)),"string"==typeof c&&g[c].apply(g,Array.prototype.slice.call(e,1)),void 0)})},a.fn.editable.defaults={type:"text",disabled:!1,toggle:"click",emptytext:"Empty",autotext:"auto",value:null,display:null,emptyclass:"editable-empty",unsavedclass:"editable-unsaved",selector:null,highlight:"#FFFF80"}}(window.jQuery),function(a){"use strict";a.fn.editabletypes={};var b=function(){};b.prototype={init:function(b,c,d){this.type=b,this.options=a.extend({},d,c)},prerender:function(){this.$tpl=a(this.options.tpl),this.$input=this.$tpl,this.$clear=null,this.error=null},render:function(){},value2html:function(b,c){a(c)[this.options.escape?"text":"html"](a.trim(b))},html2value:function(b){return a("<div>").html(b).text()},value2str:function(a){return a},str2value:function(a){return a},value2submit:function(a){return a},value2input:function(a){this.$input.val(a)},input2value:function(){return this.$input.val()},activate:function(){this.$input.is(":visible")&&this.$input.focus()},clear:function(){this.$input.val(null)},escape:function(b){return a("<div>").text(b).html()},autosubmit:function(){},destroy:function(){},setClass:function(){this.options.inputclass&&this.$input.addClass(this.options.inputclass)},setAttr:function(a){void 0!==this.options[a]&&null!==this.options[a]&&this.$input.attr(a,this.options[a])},option:function(a,b){this.options[a]=b}},b.defaults={tpl:"",inputclass:null,escape:!0,scope:null,showbuttons:!0},a.extend(a.fn.editabletypes,{abstractinput:b})}(window.jQuery),function(a){"use strict";var b=function(){};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){var b=a.Deferred();return this.error=null,this.onSourceReady(function(){this.renderList(),b.resolve()},function(){this.error=this.options.sourceError,b.resolve()}),b.promise()},html2value:function(){return null},value2html:function(b,c,d,e){var f=a.Deferred(),g=function(){"function"==typeof d?d.call(c,b,this.sourceData,e):this.value2htmlFinal(b,c),f.resolve()};return null===b?g.call(this):this.onSourceReady(g,function(){f.resolve()}),f.promise()},onSourceReady:function(b,c){var d;if(a.isFunction(this.options.source)?(d=this.options.source.call(this.options.scope),this.sourceData=null):d=this.options.source,this.options.sourceCache&&a.isArray(this.sourceData))return b.call(this),void 0;try{d=a.fn.editableutils.tryParseJson(d,!1)}catch(e){return c.call(this),void 0}if("string"==typeof d){if(this.options.sourceCache){var f,g=d;if(a(document).data(g)||a(document).data(g,{}),f=a(document).data(g),f.loading===!1&&f.sourceData)return this.sourceData=f.sourceData,this.doPrepend(),b.call(this),void 0;if(f.loading===!0)return f.callbacks.push(a.proxy(function(){this.sourceData=f.sourceData,this.doPrepend(),b.call(this)},this)),f.err_callbacks.push(a.proxy(c,this)),void 0;f.loading=!0,f.callbacks=[],f.err_callbacks=[]}var h=a.extend({url:d,type:"get",cache:!1,dataType:"json",success:a.proxy(function(d){f&&(f.loading=!1),this.sourceData=this.makeArray(d),a.isArray(this.sourceData)?(f&&(f.sourceData=this.sourceData,a.each(f.callbacks,function(){this.call()})),this.doPrepend(),b.call(this)):(c.call(this),f&&a.each(f.err_callbacks,function(){this.call()}))},this),error:a.proxy(function(){c.call(this),f&&(f.loading=!1,a.each(f.err_callbacks,function(){this.call()}))},this)},this.options.sourceOptions);a.ajax(h)}else this.sourceData=this.makeArray(d),a.isArray(this.sourceData)?(this.doPrepend(),b.call(this)):c.call(this)},doPrepend:function(){null!==this.options.prepend&&void 0!==this.options.prepend&&(a.isArray(this.prependData)||(a.isFunction(this.options.prepend)&&(this.options.prepend=this.options.prepend.call(this.options.scope)),this.options.prepend=a.fn.editableutils.tryParseJson(this.options.prepend,!0),"string"==typeof this.options.prepend&&(this.options.prepend={"":this.options.prepend}),this.prependData=this.makeArray(this.options.prepend)),a.isArray(this.prependData)&&a.isArray(this.sourceData)&&(this.sourceData=this.prependData.concat(this.sourceData)))},renderList:function(){},value2htmlFinal:function(){},makeArray:function(b){var c,d,e,f,g=[];if(!b||"string"==typeof b)return null;if(a.isArray(b)){f=function(a,b){return d={value:a,text:b},c++>=2?!1:void 0};for(var h=0;h<b.length;h++)e=b[h],"object"==typeof e?(c=0,a.each(e,f),1===c?g.push(d):c>1&&(e.children&&(e.children=this.makeArray(e.children)),g.push(e))):g.push({value:e,text:e})}else a.each(b,function(a,b){g.push({value:a,text:b})});return g},option:function(a,b){this.options[a]=b,"source"===a&&(this.sourceData=null),"prepend"===a&&(this.prependData=null)}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{source:null,prepend:!1,sourceError:"Error when loading list",sourceCache:!0,sourceOptions:null}),a.fn.editabletypes.list=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("text",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.renderClear(),this.setClass(),this.setAttr("placeholder")},activate:function(){this.$input.is(":visible")&&(this.$input.focus(),a.fn.editableutils.setCursorPosition(this.$input.get(0),this.$input.val().length),this.toggleClear&&this.toggleClear())},renderClear:function(){this.options.clear&&(this.$clear=a('<span class="editable-clear-x"></span>'),this.$input.after(this.$clear).css("padding-right",24).keyup(a.proxy(function(b){if(!~a.inArray(b.keyCode,[40,38,9,13,27])){clearTimeout(this.t);var c=this;this.t=setTimeout(function(){c.toggleClear(b)},100)}},this)).parent().css("position","relative"),this.$clear.click(a.proxy(this.clear,this)))},postrender:function(){},toggleClear:function(){if(this.$clear){var a=this.$input.val().length,b=this.$clear.is(":visible");a&&!b&&this.$clear.show(),!a&&b&&this.$clear.hide()}},clear:function(){this.$clear.hide(),this.$input.val("").focus()}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="text">',placeholder:null,clear:!0}),a.fn.editabletypes.text=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("textarea",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.setClass(),this.setAttr("placeholder"),this.setAttr("rows"),this.$input.keydown(function(b){b.ctrlKey&&13===b.which&&a(this).closest("form").submit()})},activate:function(){a.fn.editabletypes.text.prototype.activate.call(this)}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:"<textarea></textarea>",inputclass:"input-large",placeholder:null,rows:7}),a.fn.editabletypes.textarea=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("select",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.list),a.extend(b.prototype,{renderList:function(){this.$input.empty();var b=function(c,d){var e;if(a.isArray(d))for(var f=0;f<d.length;f++)e={},d[f].children?(e.label=d[f].text,c.append(b(a("<optgroup>",e),d[f].children))):(e.value=d[f].value,d[f].disabled&&(e.disabled=!0),c.append(a("<option>",e).text(d[f].text)));return c};b(this.$input,this.sourceData),this.setClass(),this.$input.on("keydown.editable",function(b){13===b.which&&a(this).closest("form").submit()})},value2htmlFinal:function(b,c){var d="",e=a.fn.editableutils.itemsByValue(b,this.sourceData);e.length&&(d=e[0].text),a.fn.editabletypes.abstractinput.prototype.value2html.call(this,d,c)},autosubmit:function(){this.$input.off("keydown.editable").on("change.editable",function(){a(this).closest("form").submit()})}}),b.defaults=a.extend({},a.fn.editabletypes.list.defaults,{tpl:"<select></select>"}),a.fn.editabletypes.select=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("checklist",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.list),a.extend(b.prototype,{renderList:function(){var b;if(this.$tpl.empty(),a.isArray(this.sourceData)){for(var c=0;c<this.sourceData.length;c++)b=a("<label>").append(a("<input>",{type:"checkbox",value:this.sourceData[c].value})).append(a("<span>").text(" "+this.sourceData[c].text)),a("<div>").append(b).appendTo(this.$tpl);this.$input=this.$tpl.find('input[type="checkbox"]'),this.setClass()}},value2str:function(b){return a.isArray(b)?b.sort().join(a.trim(this.options.separator)):""},str2value:function(b){var c,d=null;return"string"==typeof b&&b.length?(c=new RegExp("\\s*"+a.trim(this.options.separator)+"\\s*"),d=b.split(c)):d=a.isArray(b)?b:[b],d},value2input:function(b){this.$input.prop("checked",!1),a.isArray(b)&&b.length&&this.$input.each(function(c,d){var e=a(d);a.each(b,function(a,b){e.val()==b&&e.prop("checked",!0)})})},input2value:function(){var b=[];return this.$input.filter(":checked").each(function(c,d){b.push(a(d).val())}),b},value2htmlFinal:function(b,c){var d=[],e=a.fn.editableutils.itemsByValue(b,this.sourceData),f=this.options.escape;e.length?(a.each(e,function(b,c){var e=f?a.fn.editableutils.escape(c.text):c.text;d.push(e)}),a(c).html(d.join("<br>"))):a(c).empty()},activate:function(){this.$input.first().focus()},autosubmit:function(){this.$input.on("keydown",function(b){13===b.which&&a(this).closest("form").submit()})}}),b.defaults=a.extend({},a.fn.editabletypes.list.defaults,{tpl:'<div class="editable-checklist"></div>',inputclass:null,separator:","}),a.fn.editabletypes.checklist=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("password",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),a.extend(b.prototype,{value2html:function(b,c){b?a(c).text("[hidden]"):a(c).empty()},html2value:function(){return null}}),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="password">'}),a.fn.editabletypes.password=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("email",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="email">'}),a.fn.editabletypes.email=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("url",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="url">'}),a.fn.editabletypes.url=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("tel",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="tel">'}),a.fn.editabletypes.tel=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("number",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),a.extend(b.prototype,{render:function(){b.superclass.render.call(this),this.setAttr("min"),this.setAttr("max"),this.setAttr("step")},postrender:function(){this.$clear&&this.$clear.css({right:24})}}),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="number">',inputclass:"input-mini",min:null,max:null,step:null}),a.fn.editabletypes.number=b}(window.jQuery),function(a){"use strict";
var b=function(a){this.init("range",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.number),a.extend(b.prototype,{render:function(){this.$input=this.$tpl.filter("input"),this.setClass(),this.setAttr("min"),this.setAttr("max"),this.setAttr("step"),this.$input.on("input",function(){a(this).siblings("output").text(a(this).val())})},activate:function(){this.$input.focus()}}),b.defaults=a.extend({},a.fn.editabletypes.number.defaults,{tpl:'<input type="range"><output style="width: 30px; display: inline-block"></output>',inputclass:"input-medium"}),a.fn.editabletypes.range=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("time",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.setClass()}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="time">'}),a.fn.editabletypes.time=b}(window.jQuery),function(a){"use strict";var b=function(c){if(this.init("select2",c,b.defaults),c.select2=c.select2||{},this.sourceData=null,c.placeholder&&(c.select2.placeholder=c.placeholder),!c.select2.tags&&c.source){var d=c.source;a.isFunction(c.source)&&(d=c.source.call(c.scope)),"string"==typeof d?(c.select2.ajax=c.select2.ajax||{},c.select2.ajax.data||(c.select2.ajax.data=function(a){return{query:a}}),c.select2.ajax.results||(c.select2.ajax.results=function(a){return{results:a}}),c.select2.ajax.url=d):(this.sourceData=this.convertSource(d),c.select2.data=this.sourceData)}if(this.options.select2=a.extend({},b.defaults.select2,c.select2),this.isMultiple=this.options.select2.tags||this.options.select2.multiple,this.isRemote="ajax"in this.options.select2,this.idFunc=this.options.select2.id,"function"!=typeof this.idFunc){var e=this.idFunc||"id";this.idFunc=function(a){return a[e]}}this.formatSelection=this.options.select2.formatSelection,"function"!=typeof this.formatSelection&&(this.formatSelection=function(a){return a.text})};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.setClass(),this.isRemote&&this.$input.on("select2-loaded",a.proxy(function(a){this.sourceData=a.items.results},this)),this.isMultiple&&this.$input.on("change",function(){a(this).closest("form").parent().triggerHandler("resize")})},value2html:function(c,d){var e,f="",g=this;this.options.select2.tags?e=c:this.sourceData&&(e=a.fn.editableutils.itemsByValue(c,this.sourceData,this.idFunc)),a.isArray(e)?(f=[],a.each(e,function(a,b){f.push(b&&"object"==typeof b?g.formatSelection(b):b)})):e&&(f=g.formatSelection(e)),f=a.isArray(f)?f.join(this.options.viewseparator):f,b.superclass.value2html.call(this,f,d)},html2value:function(a){return this.options.select2.tags?this.str2value(a,this.options.viewseparator):null},value2input:function(b){if(a.isArray(b)&&(b=b.join(this.getSeparator())),this.$input.data("select2")?this.$input.val(b).trigger("change",!0):(this.$input.val(b),this.$input.select2(this.options.select2)),this.isRemote&&!this.isMultiple&&!this.options.select2.initSelection){var c=this.options.select2.id,d=this.options.select2.formatSelection;if(!c&&!d){var e=a(this.options.scope);if(!e.data("editable").isEmpty){var f={id:b,text:e.text()};this.$input.select2("data",f)}}}},input2value:function(){return this.$input.select2("val")},str2value:function(b,c){if("string"!=typeof b||!this.isMultiple)return b;c=c||this.getSeparator();var d,e,f;if(null===b||b.length<1)return null;for(d=b.split(c),e=0,f=d.length;f>e;e+=1)d[e]=a.trim(d[e]);return d},autosubmit:function(){this.$input.on("change",function(b,c){c||a(this).closest("form").submit()})},getSeparator:function(){return this.options.select2.separator||a.fn.select2.defaults.separator},convertSource:function(b){if(a.isArray(b)&&b.length&&void 0!==b[0].value)for(var c=0;c<b.length;c++)void 0!==b[c].value&&(b[c].id=b[c].value,delete b[c].value);return b},destroy:function(){this.$input.data("select2")&&this.$input.select2("destroy")}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="hidden">',select2:null,placeholder:null,source:null,viewseparator:", "}),a.fn.editabletypes.select2=b}(window.jQuery),function(a){var b=function(b,c){return this.$element=a(b),this.$element.is("input")?(this.options=a.extend({},a.fn.combodate.defaults,c,this.$element.data()),this.init(),void 0):(a.error("Combodate should be applied to INPUT element"),void 0)};b.prototype={constructor:b,init:function(){this.map={day:["D","date"],month:["M","month"],year:["Y","year"],hour:["[Hh]","hours"],minute:["m","minutes"],second:["s","seconds"],ampm:["[Aa]",""]},this.$widget=a('<span class="combodate"></span>').html(this.getTemplate()),this.initCombos(),this.$widget.on("change","select",a.proxy(function(b){this.$element.val(this.getValue()).change(),this.options.smartDays&&(a(b.target).is(".month")||a(b.target).is(".year"))&&this.fillCombo("day")},this)),this.$widget.find("select").css("width","auto"),this.$element.hide().after(this.$widget),this.setValue(this.$element.val()||this.options.value)},getTemplate:function(){var b=this.options.template;return a.each(this.map,function(a,c){c=c[0];var d=new RegExp(c+"+"),e=c.length>1?c.substring(1,2):c;b=b.replace(d,"{"+e+"}")}),b=b.replace(/ /g,"&nbsp;"),a.each(this.map,function(a,c){c=c[0];var d=c.length>1?c.substring(1,2):c;b=b.replace("{"+d+"}",'<select class="'+a+'"></select>')}),b},initCombos:function(){for(var a in this.map){var b=this.$widget.find("."+a);this["$"+a]=b.length?b:null,this.fillCombo(a)}},fillCombo:function(a){var b=this["$"+a];if(b){var c="fill"+a.charAt(0).toUpperCase()+a.slice(1),d=this[c](),e=b.val();b.empty();for(var f=0;f<d.length;f++)b.append('<option value="'+d[f][0]+'">'+d[f][1]+"</option>");b.val(e)}},fillCommon:function(a){var b,c=[];if("name"===this.options.firstItem){b=moment.relativeTime||moment.langData()._relativeTime;var d="function"==typeof b[a]?b[a](1,!0,a,!1):b[a];d=d.split(" ").reverse()[0],c.push(["",d])}else"empty"===this.options.firstItem&&c.push(["",""]);return c},fillDay:function(){var a,b,c=this.fillCommon("d"),d=-1!==this.options.template.indexOf("DD"),e=31;if(this.options.smartDays&&this.$month&&this.$year){var f=parseInt(this.$month.val(),10),g=parseInt(this.$year.val(),10);isNaN(f)||isNaN(g)||(e=moment([g,f]).daysInMonth())}for(b=1;e>=b;b++)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillMonth:function(){var a,b,c=this.fillCommon("M"),d=-1!==this.options.template.indexOf("MMMM"),e=-1!==this.options.template.indexOf("MMM"),f=-1!==this.options.template.indexOf("MM");for(b=0;11>=b;b++)a=d?moment().date(1).month(b).format("MMMM"):e?moment().date(1).month(b).format("MMM"):f?this.leadZero(b+1):b+1,c.push([b,a]);return c},fillYear:function(){var a,b,c=[],d=-1!==this.options.template.indexOf("YYYY");for(b=this.options.maxYear;b>=this.options.minYear;b--)a=d?b:(b+"").substring(2),c[this.options.yearDescending?"push":"unshift"]([b,a]);return c=this.fillCommon("y").concat(c)},fillHour:function(){var a,b,c=this.fillCommon("h"),d=-1!==this.options.template.indexOf("h"),e=(-1!==this.options.template.indexOf("H"),-1!==this.options.template.toLowerCase().indexOf("hh")),f=d?1:0,g=d?12:23;for(b=f;g>=b;b++)a=e?this.leadZero(b):b,c.push([b,a]);return c},fillMinute:function(){var a,b,c=this.fillCommon("m"),d=-1!==this.options.template.indexOf("mm");for(b=0;59>=b;b+=this.options.minuteStep)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillSecond:function(){var a,b,c=this.fillCommon("s"),d=-1!==this.options.template.indexOf("ss");for(b=0;59>=b;b+=this.options.secondStep)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillAmpm:function(){var a=-1!==this.options.template.indexOf("a"),b=(-1!==this.options.template.indexOf("A"),[["am",a?"am":"AM"],["pm",a?"pm":"PM"]]);return b},getValue:function(b){var c,d={},e=this,f=!1;return a.each(this.map,function(a){if("ampm"!==a){var b="day"===a?1:0;return d[a]=e["$"+a]?parseInt(e["$"+a].val(),10):b,isNaN(d[a])?(f=!0,!1):void 0}}),f?"":(this.$ampm&&(d.hour=12===d.hour?"am"===this.$ampm.val()?0:12:"am"===this.$ampm.val()?d.hour:d.hour+12),c=moment([d.year,d.month,d.day,d.hour,d.minute,d.second]),this.highlight(c),b=void 0===b?this.options.format:b,null===b?c.isValid()?c:null:c.isValid()?c.format(b):"")},setValue:function(b){function c(b,c){var d={};return b.children("option").each(function(b,e){var f,g=a(e).attr("value");""!==g&&(f=Math.abs(g-c),("undefined"==typeof d.distance||f<d.distance)&&(d={value:g,distance:f}))}),d.value}if(b){var d="string"==typeof b?moment(b,this.options.format):moment(b),e=this,f={};d.isValid()&&(a.each(this.map,function(a,b){"ampm"!==a&&(f[a]=d[b[1]]())}),this.$ampm&&(f.hour>=12?(f.ampm="pm",f.hour>12&&(f.hour-=12)):(f.ampm="am",0===f.hour&&(f.hour=12))),a.each(f,function(a,b){e["$"+a]&&("minute"===a&&e.options.minuteStep>1&&e.options.roundTime&&(b=c(e["$"+a],b)),"second"===a&&e.options.secondStep>1&&e.options.roundTime&&(b=c(e["$"+a],b)),e["$"+a].val(b))}),this.options.smartDays&&this.fillCombo("day"),this.$element.val(d.format(this.options.format)).change())}},highlight:function(a){a.isValid()?this.options.errorClass?this.$widget.removeClass(this.options.errorClass):this.$widget.find("select").css("border-color",this.borderColor):this.options.errorClass?this.$widget.addClass(this.options.errorClass):(this.borderColor||(this.borderColor=this.$widget.find("select").css("border-color")),this.$widget.find("select").css("border-color","red"))},leadZero:function(a){return 9>=a?"0"+a:a},destroy:function(){this.$widget.remove(),this.$element.removeData("combodate").show()}},a.fn.combodate=function(c){var d,e=Array.apply(null,arguments);return e.shift(),"getValue"===c&&this.length&&(d=this.eq(0).data("combodate"))?d.getValue.apply(d,e):this.each(function(){var d=a(this),f=d.data("combodate"),g="object"==typeof c&&c;f||d.data("combodate",f=new b(this,g)),"string"==typeof c&&"function"==typeof f[c]&&f[c].apply(f,e)})},a.fn.combodate.defaults={format:"DD-MM-YYYY HH:mm",template:"D / MMM / YYYY   H : mm",value:null,minYear:1970,maxYear:2015,yearDescending:!0,minuteStep:5,secondStep:1,firstItem:"empty",errorClass:null,roundTime:!0,smartDays:!1}}(window.jQuery),function(a){"use strict";var b=function(c){this.init("combodate",c,b.defaults),this.options.viewformat||(this.options.viewformat=this.options.format),c.combodate=a.fn.editableutils.tryParseJson(c.combodate,!0),this.options.combodate=a.extend({},b.defaults.combodate,c.combodate,{format:this.options.format,template:this.options.template})};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.$input.combodate(this.options.combodate),"bs3"===a.fn.editableform.engine&&this.$input.siblings().find("select").addClass("form-control"),this.options.inputclass&&this.$input.siblings().find("select").addClass(this.options.inputclass)},value2html:function(a,c){var d=a?a.format(this.options.viewformat):"";b.superclass.value2html.call(this,d,c)},html2value:function(a){return a?moment(a,this.options.viewformat):null},value2str:function(a){return a?a.format(this.options.format):""},str2value:function(a){return a?moment(a,this.options.format):null},value2submit:function(a){return this.value2str(a)},value2input:function(a){this.$input.combodate("setValue",a)},input2value:function(){return this.$input.combodate("getValue",null)},activate:function(){this.$input.siblings(".combodate").find("select").eq(0).focus()},autosubmit:function(){}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="text">',inputclass:null,format:"YYYY-MM-DD",viewformat:null,template:"D / MMM / YYYY",combodate:null}),a.fn.editabletypes.combodate=b}(window.jQuery),function(a){"use strict";var b=a.fn.editableform.Constructor.prototype.initInput;a.extend(a.fn.editableform.Constructor.prototype,{initTemplate:function(){this.$form=a(a.fn.editableform.template),this.$form.find(".editable-error-block").addClass("help-block")},initInput:function(){b.apply(this);var c=null===this.input.options.inputclass||this.input.options.inputclass===!1,d="input-medium",e="text,select,textarea,password,email,url,tel,number,range,time".split(",");~a.inArray(this.input.type,e)&&c&&(this.input.options.inputclass=d,this.input.$input.addClass(d))}}),a.fn.editableform.buttons='<button type="submit" class="btn btn-primary editable-submit"><i class="icon-ok icon-white"></i></button><button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>',a.fn.editableform.errorGroupClass="error",a.fn.editableform.errorBlockClass=null,a.fn.editableform.engine="bs2"}(window.jQuery),function(a){"use strict";a.extend(a.fn.editableContainer.Popup.prototype,{containerName:"popover",innerCss:a.fn.popover&&a(a.fn.popover.defaults.template).find("p").length?".popover-content p":".popover-content",defaults:a.fn.popover.defaults,initContainer:function(){a.extend(this.containerOptions,{trigger:"manual",selector:!1,content:" ",template:this.defaults.template});var b;this.$element.data("template")&&(b=this.$element.data("template"),this.$element.removeData("template")),this.call(this.containerOptions),b&&this.$element.data("template",b)},innerShow:function(){this.call("show")},innerHide:function(){this.call("hide")},innerDestroy:function(){this.call("destroy")},setContainerOption:function(a,b){this.container().options[a]=b},setPosition:function(){!function(){var b,c,d,e,f,g,h,i,j,k,l=this.tip();switch(f="function"==typeof this.options.placement?this.options.placement.call(this,l[0],this.$element[0]):this.options.placement,b=/in/.test(f),l.removeClass("top right bottom left").css({top:0,left:0,display:"block"}),c=this.getPosition(b),d=l[0].offsetWidth,e=l[0].offsetHeight,f=b?f.split(" ")[1]:f,i={top:c.top+c.height,left:c.left+c.width/2-d/2},h={top:c.top-e,left:c.left+c.width/2-d/2},j={top:c.top+c.height/2-e/2,left:c.left-d},k={top:c.top+c.height/2-e/2,left:c.left+c.width},f){case"bottom":i.top+e>a(window).scrollTop()+a(window).height()&&(f=h.top>a(window).scrollTop()?"top":k.left+d<a(window).scrollLeft()+a(window).width()?"right":j.left>a(window).scrollLeft()?"left":"right");break;case"top":h.top<a(window).scrollTop()&&(f=i.top+e<a(window).scrollTop()+a(window).height()?"bottom":k.left+d<a(window).scrollLeft()+a(window).width()?"right":j.left>a(window).scrollLeft()?"left":"right");break;case"left":j.left<a(window).scrollLeft()&&(f=k.left+d<a(window).scrollLeft()+a(window).width()?"right":h.top>a(window).scrollTop()?"top":h.top>a(window).scrollTop()?"bottom":"right");break;case"right":k.left+d>a(window).scrollLeft()+a(window).width()&&(j.left>a(window).scrollLeft()?f="left":h.top>a(window).scrollTop()?f="top":h.top>a(window).scrollTop()&&(f="bottom"))}switch(f){case"bottom":g=i;break;case"top":g=h;break;case"left":g=j;break;case"right":g=k}l.offset(g).addClass(f).addClass("in")}.call(this.container())}})}(window.jQuery),function(a){function b(){return new Date(Date.UTC.apply(Date,arguments))}function c(b,c){var d,e=a(b).data(),f={},g=new RegExp("^"+c.toLowerCase()+"([A-Z])"),c=new RegExp("^"+c.toLowerCase());for(var h in e)c.test(h)&&(d=h.replace(g,function(a,b){return b.toLowerCase()}),f[d]=e[h]);return f}function d(b){var c={};if(k[b]||(b=b.split("-")[0],k[b])){var d=k[b];return a.each(j,function(a,b){b in d&&(c[b]=d[b])}),c}}var e=function(b,c){this._process_options(c),this.element=a(b),this.isInline=!1,this.isInput=this.element.is("input"),this.component=this.element.is(".date")?this.element.find(".add-on, .btn"):!1,this.hasInput=this.component&&this.element.find("input").length,this.component&&0===this.component.length&&(this.component=!1),this.picker=a(l.template),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&(this.picker.addClass("datepicker-rtl"),this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")),this.viewMode=this.o.startView,this.o.calendarWeeks&&this.picker.find("tfoot th.today").attr("colspan",function(a,b){return parseInt(b)+1}),this._allow_update=!1,this.setStartDate(this.o.startDate),this.setEndDate(this.o.endDate),this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled),this.fillDow(),this.fillMonths(),this._allow_update=!0,this.update(),this.showMode(),this.isInline&&this.show()};e.prototype={constructor:e,_process_options:function(b){this._o=a.extend({},this._o,b);var c=this.o=a.extend({},this._o),d=c.language;switch(k[d]||(d=d.split("-")[0],k[d]||(d=i.language)),c.language=d,c.startView){case 2:case"decade":c.startView=2;break;case 1:case"year":c.startView=1;break;default:c.startView=0}switch(c.minViewMode){case 1:case"months":c.minViewMode=1;break;case 2:case"years":c.minViewMode=2;break;default:c.minViewMode=0}c.startView=Math.max(c.startView,c.minViewMode),c.weekStart%=7,c.weekEnd=(c.weekStart+6)%7;var e=l.parseFormat(c.format);c.startDate!==-1/0&&(c.startDate=l.parseDate(c.startDate,e,c.language)),1/0!==c.endDate&&(c.endDate=l.parseDate(c.endDate,e,c.language)),c.daysOfWeekDisabled=c.daysOfWeekDisabled||[],a.isArray(c.daysOfWeekDisabled)||(c.daysOfWeekDisabled=c.daysOfWeekDisabled.split(/[,\s]*/)),c.daysOfWeekDisabled=a.map(c.daysOfWeekDisabled,function(a){return parseInt(a,10)})},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var b,c,d=0;d<a.length;d++)b=a[d][0],c=a[d][1],b.on(c)},_unapplyEvents:function(a){for(var b,c,d=0;d<a.length;d++)b=a[d][0],c=a[d][1],b.off(c)},_buildEvents:function(){this.isInput?this._events=[[this.element,{focus:a.proxy(this.show,this),keyup:a.proxy(this.update,this),keydown:a.proxy(this.keydown,this)}]]:this.component&&this.hasInput?this._events=[[this.element.find("input"),{focus:a.proxy(this.show,this),keyup:a.proxy(this.update,this),keydown:a.proxy(this.keydown,this)}],[this.component,{click:a.proxy(this.show,this)}]]:this.element.is("div")?this.isInline=!0:this._events=[[this.element,{click:a.proxy(this.show,this)}]],this._secondaryEvents=[[this.picker,{click:a.proxy(this.click,this)}],[a(window),{resize:a.proxy(this.place,this)}],[a(document),{mousedown:a.proxy(function(a){this.element.is(a.target)||this.element.find(a.target).size()||this.picker.is(a.target)||this.picker.find(a.target).size()||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(b,c){var d=c||this.date,e=new Date(d.getTime()+6e4*d.getTimezoneOffset());this.element.trigger({type:b,date:e,format:a.proxy(function(a){var b=a||this.o.format;return l.formatDate(d,b,this.o.language)},this)})},show:function(a){this.isInline||this.picker.appendTo("body"),this.picker.show(),this.height=this.component?this.component.outerHeight():this.element.outerHeight(),this.place(),this._attachSecondaryEvents(),a&&a.preventDefault(),this._trigger("show")},hide:function(){this.isInline||this.picker.is(":visible")&&(this.picker.hide().detach(),this._detachSecondaryEvents(),this.viewMode=this.o.startView,this.showMode(),this.o.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())&&this.setValue(),this._trigger("hide"))},remove:function(){this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date},getDate:function(){var a=this.getUTCDate();return new Date(a.getTime()+6e4*a.getTimezoneOffset())},getUTCDate:function(){return this.date},setDate:function(a){this.setUTCDate(new Date(a.getTime()-6e4*a.getTimezoneOffset()))},setUTCDate:function(a){this.date=a,this.setValue()},setValue:function(){var a=this.getFormattedDate();this.isInput?this.element.val(a):this.component&&this.element.find("input").val(a)},getFormattedDate:function(a){return void 0===a&&(a=this.o.format),l.formatDate(this.date,a,this.o.language)},setStartDate:function(a){this._process_options({startDate:a}),this.update(),this.updateNavArrows()},setEndDate:function(a){this._process_options({endDate:a}),this.update(),this.updateNavArrows()},setDaysOfWeekDisabled:function(a){this._process_options({daysOfWeekDisabled:a}),this.update(),this.updateNavArrows()},place:function(){if(!this.isInline){var b=parseInt(this.element.parents().filter(function(){return"auto"!=a(this).css("z-index")}).first().css("z-index"))+10,c=this.component?this.component.parent().offset():this.element.offset(),d=this.component?this.component.outerHeight(!0):this.element.outerHeight(!0);this.picker.css({top:c.top+d,left:c.left,zIndex:b})}},_allow_update:!0,update:function(){if(this._allow_update){var a,b=!1;arguments&&arguments.length&&("string"==typeof arguments[0]||arguments[0]instanceof Date)?(a=arguments[0],b=!0):(a=this.isInput?this.element.val():this.element.data("date")||this.element.find("input").val(),delete this.element.data().date),this.date=l.parseDate(a,this.o.format,this.o.language),b&&this.setValue(),this.viewDate=this.date<this.o.startDate?new Date(this.o.startDate):this.date>this.o.endDate?new Date(this.o.endDate):new Date(this.date),this.fill()}},fillDow:function(){var a=this.o.weekStart,b="<tr>";if(this.o.calendarWeeks){var c='<th class="cw">&nbsp;</th>';b+=c,this.picker.find(".datepicker-days thead tr:first-child").prepend(c)}for(;a<this.o.weekStart+7;)b+='<th class="dow">'+k[this.o.language].daysMin[a++%7]+"</th>";b+="</tr>",this.picker.find(".datepicker-days thead").append(b)},fillMonths:function(){for(var a="",b=0;12>b;)a+='<span class="month">'+k[this.o.language].monthsShort[b++]+"</span>";this.picker.find(".datepicker-months td").html(a)},setRange:function(b){b&&b.length?this.range=a.map(b,function(a){return a.valueOf()}):delete this.range,this.fill()},getClassNames:function(b){var c=[],d=this.viewDate.getUTCFullYear(),e=this.viewDate.getUTCMonth(),f=this.date.valueOf(),g=new Date;return b.getUTCFullYear()<d||b.getUTCFullYear()==d&&b.getUTCMonth()<e?c.push("old"):(b.getUTCFullYear()>d||b.getUTCFullYear()==d&&b.getUTCMonth()>e)&&c.push("new"),this.o.todayHighlight&&b.getUTCFullYear()==g.getFullYear()&&b.getUTCMonth()==g.getMonth()&&b.getUTCDate()==g.getDate()&&c.push("today"),f&&b.valueOf()==f&&c.push("active"),(b.valueOf()<this.o.startDate||b.valueOf()>this.o.endDate||-1!==a.inArray(b.getUTCDay(),this.o.daysOfWeekDisabled))&&c.push("disabled"),this.range&&(b>this.range[0]&&b<this.range[this.range.length-1]&&c.push("range"),-1!=a.inArray(b.valueOf(),this.range)&&c.push("selected")),c},fill:function(){var c,d=new Date(this.viewDate),e=d.getUTCFullYear(),f=d.getUTCMonth(),g=this.o.startDate!==-1/0?this.o.startDate.getUTCFullYear():-1/0,h=this.o.startDate!==-1/0?this.o.startDate.getUTCMonth():-1/0,i=1/0!==this.o.endDate?this.o.endDate.getUTCFullYear():1/0,j=1/0!==this.o.endDate?this.o.endDate.getUTCMonth():1/0;this.date&&this.date.valueOf(),this.picker.find(".datepicker-days thead th.datepicker-switch").text(k[this.o.language].months[f]+" "+e),this.picker.find("tfoot th.today").text(k[this.o.language].today).toggle(this.o.todayBtn!==!1),this.picker.find("tfoot th.clear").text(k[this.o.language].clear).toggle(this.o.clearBtn!==!1),this.updateNavArrows(),this.fillMonths();var m=b(e,f-1,28,0,0,0,0),n=l.getDaysInMonth(m.getUTCFullYear(),m.getUTCMonth());m.setUTCDate(n),m.setUTCDate(n-(m.getUTCDay()-this.o.weekStart+7)%7);var o=new Date(m);o.setUTCDate(o.getUTCDate()+42),o=o.valueOf();for(var p,q=[];m.valueOf()<o;){if(m.getUTCDay()==this.o.weekStart&&(q.push("<tr>"),this.o.calendarWeeks)){var r=new Date(+m+864e5*((this.o.weekStart-m.getUTCDay()-7)%7)),s=new Date(+r+864e5*((11-r.getUTCDay())%7)),t=new Date(+(t=b(s.getUTCFullYear(),0,1))+864e5*((11-t.getUTCDay())%7)),u=(s-t)/864e5/7+1;q.push('<td class="cw">'+u+"</td>")}p=this.getClassNames(m),p.push("day");var v=this.o.beforeShowDay(m);void 0===v?v={}:"boolean"==typeof v?v={enabled:v}:"string"==typeof v&&(v={classes:v}),v.enabled===!1&&p.push("disabled"),v.classes&&(p=p.concat(v.classes.split(/\s+/))),v.tooltip&&(c=v.tooltip),p=a.unique(p),q.push('<td class="'+p.join(" ")+'"'+(c?' title="'+c+'"':"")+">"+m.getUTCDate()+"</td>"),m.getUTCDay()==this.o.weekEnd&&q.push("</tr>"),m.setUTCDate(m.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(q.join(""));var w=this.date&&this.date.getUTCFullYear(),x=this.picker.find(".datepicker-months").find("th:eq(1)").text(e).end().find("span").removeClass("active");w&&w==e&&x.eq(this.date.getUTCMonth()).addClass("active"),(g>e||e>i)&&x.addClass("disabled"),e==g&&x.slice(0,h).addClass("disabled"),e==i&&x.slice(j+1).addClass("disabled"),q="",e=10*parseInt(e/10,10);var y=this.picker.find(".datepicker-years").find("th:eq(1)").text(e+"-"+(e+9)).end().find("td");e-=1;for(var z=-1;11>z;z++)q+='<span class="year'+(-1==z?" old":10==z?" new":"")+(w==e?" active":"")+(g>e||e>i?" disabled":"")+'">'+e+"</span>",e+=1;y.html(q)},updateNavArrows:function(){if(this._allow_update){var a=new Date(this.viewDate),b=a.getUTCFullYear(),c=a.getUTCMonth();switch(this.viewMode){case 0:this.o.startDate!==-1/0&&b<=this.o.startDate.getUTCFullYear()&&c<=this.o.startDate.getUTCMonth()?this.picker.find(".prev").css({visibility:"hidden"}):this.picker.find(".prev").css({visibility:"visible"}),1/0!==this.o.endDate&&b>=this.o.endDate.getUTCFullYear()&&c>=this.o.endDate.getUTCMonth()?this.picker.find(".next").css({visibility:"hidden"}):this.picker.find(".next").css({visibility:"visible"});break;case 1:case 2:this.o.startDate!==-1/0&&b<=this.o.startDate.getUTCFullYear()?this.picker.find(".prev").css({visibility:"hidden"}):this.picker.find(".prev").css({visibility:"visible"}),1/0!==this.o.endDate&&b>=this.o.endDate.getUTCFullYear()?this.picker.find(".next").css({visibility:"hidden"}):this.picker.find(".next").css({visibility:"visible"})}}},click:function(c){c.preventDefault();var d=a(c.target).closest("span, td, th");if(1==d.length)switch(d[0].nodeName.toLowerCase()){case"th":switch(d[0].className){case"datepicker-switch":this.showMode(1);break;case"prev":case"next":var e=l.modes[this.viewMode].navStep*("prev"==d[0].className?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveMonth(this.viewDate,e);break;case 1:case 2:this.viewDate=this.moveYear(this.viewDate,e)}this.fill();break;case"today":var f=new Date;f=b(f.getFullYear(),f.getMonth(),f.getDate(),0,0,0),this.showMode(-2);var g="linked"==this.o.todayBtn?null:"view";this._setDate(f,g);break;case"clear":var h;this.isInput?h=this.element:this.component&&(h=this.element.find("input")),h&&h.val("").change(),this._trigger("changeDate"),this.update(),this.o.autoclose&&this.hide()}break;case"span":if(!d.is(".disabled")){if(this.viewDate.setUTCDate(1),d.is(".month")){var i=1,j=d.parent().find("span").index(d),k=this.viewDate.getUTCFullYear();this.viewDate.setUTCMonth(j),this._trigger("changeMonth",this.viewDate),1===this.o.minViewMode&&this._setDate(b(k,j,i,0,0,0,0))}else{var k=parseInt(d.text(),10)||0,i=1,j=0;this.viewDate.setUTCFullYear(k),this._trigger("changeYear",this.viewDate),2===this.o.minViewMode&&this._setDate(b(k,j,i,0,0,0,0))}this.showMode(-1),this.fill()}break;case"td":if(d.is(".day")&&!d.is(".disabled")){var i=parseInt(d.text(),10)||1,k=this.viewDate.getUTCFullYear(),j=this.viewDate.getUTCMonth();d.is(".old")?0===j?(j=11,k-=1):j-=1:d.is(".new")&&(11==j?(j=0,k+=1):j+=1),this._setDate(b(k,j,i,0,0,0,0))}}},_setDate:function(a,b){b&&"date"!=b||(this.date=new Date(a)),b&&"view"!=b||(this.viewDate=new Date(a)),this.fill(),this.setValue(),this._trigger("changeDate");var c;this.isInput?c=this.element:this.component&&(c=this.element.find("input")),c&&(c.change(),!this.o.autoclose||b&&"date"!=b||this.hide())},moveMonth:function(a,b){if(!b)return a;var c,d,e=new Date(a.valueOf()),f=e.getUTCDate(),g=e.getUTCMonth(),h=Math.abs(b);if(b=b>0?1:-1,1==h)d=-1==b?function(){return e.getUTCMonth()==g}:function(){return e.getUTCMonth()!=c},c=g+b,e.setUTCMonth(c),(0>c||c>11)&&(c=(c+12)%12);else{for(var i=0;h>i;i++)e=this.moveMonth(e,b);c=e.getUTCMonth(),e.setUTCDate(f),d=function(){return c!=e.getUTCMonth()}}for(;d();)e.setUTCDate(--f),e.setUTCMonth(c);return e},moveYear:function(a,b){return this.moveMonth(a,12*b)},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(this.picker.is(":not(:visible)"))return 27==a.keyCode&&this.show(),void 0;var b,c,d,e=!1;switch(a.keyCode){case 27:this.hide(),a.preventDefault();break;case 37:case 39:if(!this.o.keyboardNavigation)break;b=37==a.keyCode?-1:1,a.ctrlKey?(c=this.moveYear(this.date,b),d=this.moveYear(this.viewDate,b)):a.shiftKey?(c=this.moveMonth(this.date,b),d=this.moveMonth(this.viewDate,b)):(c=new Date(this.date),c.setUTCDate(this.date.getUTCDate()+b),d=new Date(this.viewDate),d.setUTCDate(this.viewDate.getUTCDate()+b)),this.dateWithinRange(c)&&(this.date=c,this.viewDate=d,this.setValue(),this.update(),a.preventDefault(),e=!0);break;case 38:case 40:if(!this.o.keyboardNavigation)break;b=38==a.keyCode?-1:1,a.ctrlKey?(c=this.moveYear(this.date,b),d=this.moveYear(this.viewDate,b)):a.shiftKey?(c=this.moveMonth(this.date,b),d=this.moveMonth(this.viewDate,b)):(c=new Date(this.date),c.setUTCDate(this.date.getUTCDate()+7*b),d=new Date(this.viewDate),d.setUTCDate(this.viewDate.getUTCDate()+7*b)),this.dateWithinRange(c)&&(this.date=c,this.viewDate=d,this.setValue(),this.update(),a.preventDefault(),e=!0);break;case 13:this.hide(),a.preventDefault();break;case 9:this.hide()}if(e){this._trigger("changeDate");var f;this.isInput?f=this.element:this.component&&(f=this.element.find("input")),f&&f.change()}},showMode:function(a){a&&(this.viewMode=Math.max(this.o.minViewMode,Math.min(2,this.viewMode+a))),this.picker.find(">div").hide().filter(".datepicker-"+l.modes[this.viewMode].clsName).css("display","block"),this.updateNavArrows()}};var f=function(b,c){this.element=a(b),this.inputs=a.map(c.inputs,function(a){return a.jquery?a[0]:a}),delete c.inputs,a(this.inputs).datepicker(c).bind("changeDate",a.proxy(this.dateUpdated,this)),this.pickers=a.map(this.inputs,function(b){return a(b).data("datepicker")}),this.updateDates()};f.prototype={updateDates:function(){this.dates=a.map(this.pickers,function(a){return a.date}),this.updateRanges()},updateRanges:function(){var b=a.map(this.dates,function(a){return a.valueOf()});a.each(this.pickers,function(a,c){c.setRange(b)})},dateUpdated:function(b){var c=a(b.target).data("datepicker"),d=c.getUTCDate(),e=a.inArray(b.target,this.inputs),f=this.inputs.length;if(-1!=e){if(d<this.dates[e])for(;e>=0&&d<this.dates[e];)this.pickers[e--].setUTCDate(d);else if(d>this.dates[e])for(;f>e&&d>this.dates[e];)this.pickers[e++].setUTCDate(d);this.updateDates()}},remove:function(){a.map(this.pickers,function(a){a.remove()}),delete this.element.data().datepicker}};var g=a.fn.datepicker,h=a.fn.datepicker=function(b){var g=Array.apply(null,arguments);g.shift();var h;return this.each(function(){var j=a(this),k=j.data("datepicker"),l="object"==typeof b&&b;if(!k){var m=c(this,"date"),n=a.extend({},i,m,l),o=d(n.language),p=a.extend({},i,o,m,l);if(j.is(".input-daterange")||p.inputs){var q={inputs:p.inputs||j.find("input").toArray()};j.data("datepicker",k=new f(this,a.extend(p,q)))}else j.data("datepicker",k=new e(this,p))}return"string"==typeof b&&"function"==typeof k[b]&&(h=k[b].apply(k,g),void 0!==h)?!1:void 0}),void 0!==h?h:this},i=a.fn.datepicker.defaults={autoclose:!1,beforeShowDay:a.noop,calendarWeeks:!1,clearBtn:!1,daysOfWeekDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keyboardNavigation:!0,language:"en",minViewMode:0,rtl:!1,startDate:-1/0,startView:0,todayBtn:!1,todayHighlight:!1,weekStart:0},j=a.fn.datepicker.locale_opts=["format","rtl","weekStart"];a.fn.datepicker.Constructor=e;var k=a.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear"}},l={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(a){return 0===a%4&&0!==a%100||0===a%400
},getDaysInMonth:function(a,b){return[31,l.isLeapYear(a)?29:28,31,30,31,30,31,31,30,31,30,31][b]},validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,parseFormat:function(a){var b=a.replace(this.validParts,"\0").split("\0"),c=a.match(this.validParts);if(!b||!b.length||!c||0===c.length)throw new Error("Invalid date format.");return{separators:b,parts:c}},parseDate:function(c,d,f){if(c instanceof Date)return c;if("string"==typeof d&&(d=l.parseFormat(d)),/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(c)){var g,h,i=/([\-+]\d+)([dmwy])/,j=c.match(/([\-+]\d+)([dmwy])/g);c=new Date;for(var m=0;m<j.length;m++)switch(g=i.exec(j[m]),h=parseInt(g[1]),g[2]){case"d":c.setUTCDate(c.getUTCDate()+h);break;case"m":c=e.prototype.moveMonth.call(e.prototype,c,h);break;case"w":c.setUTCDate(c.getUTCDate()+7*h);break;case"y":c=e.prototype.moveYear.call(e.prototype,c,h)}return b(c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate(),0,0,0)}var n,o,g,j=c&&c.match(this.nonpunctuation)||[],c=new Date,p={},q=["yyyy","yy","M","MM","m","mm","d","dd"],r={yyyy:function(a,b){return a.setUTCFullYear(b)},yy:function(a,b){return a.setUTCFullYear(2e3+b)},m:function(a,b){for(b-=1;0>b;)b+=12;for(b%=12,a.setUTCMonth(b);a.getUTCMonth()!=b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};r.M=r.MM=r.mm=r.m,r.dd=r.d,c=b(c.getFullYear(),c.getMonth(),c.getDate(),0,0,0);var s=d.parts.slice();if(j.length!=s.length&&(s=a(s).filter(function(b,c){return-1!==a.inArray(c,q)}).toArray()),j.length==s.length){for(var m=0,t=s.length;t>m;m++){if(n=parseInt(j[m],10),g=s[m],isNaN(n))switch(g){case"MM":o=a(k[f].months).filter(function(){var a=this.slice(0,j[m].length),b=j[m].slice(0,a.length);return a==b}),n=a.inArray(o[0],k[f].months)+1;break;case"M":o=a(k[f].monthsShort).filter(function(){var a=this.slice(0,j[m].length),b=j[m].slice(0,a.length);return a==b}),n=a.inArray(o[0],k[f].monthsShort)+1}p[g]=n}for(var u,m=0;m<q.length;m++)u=q[m],u in p&&!isNaN(p[u])&&r[u](c,p[u])}return c},formatDate:function(b,c,d){"string"==typeof c&&(c=l.parseFormat(c));var e={d:b.getUTCDate(),D:k[d].daysShort[b.getUTCDay()],DD:k[d].days[b.getUTCDay()],m:b.getUTCMonth()+1,M:k[d].monthsShort[b.getUTCMonth()],MM:k[d].months[b.getUTCMonth()],yy:b.getUTCFullYear().toString().substring(2),yyyy:b.getUTCFullYear()};e.dd=(e.d<10?"0":"")+e.d,e.mm=(e.m<10?"0":"")+e.m;for(var b=[],f=a.extend([],c.separators),g=0,h=c.parts.length;h>=g;g++)f.length&&b.push(f.shift()),b.push(e[c.parts[g]]);return b.join("")},headTemplate:'<thead><tr><th class="prev"><i class="icon-arrow-left"/></th><th colspan="5" class="datepicker-switch"></th><th class="next"><i class="icon-arrow-right"/></th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};l.template='<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">'+l.headTemplate+"<tbody></tbody>"+l.footTemplate+"</table>"+"</div>"+'<div class="datepicker-months">'+'<table class="table-condensed">'+l.headTemplate+l.contTemplate+l.footTemplate+"</table>"+"</div>"+'<div class="datepicker-years">'+'<table class="table-condensed">'+l.headTemplate+l.contTemplate+l.footTemplate+"</table>"+"</div>"+"</div>",a.fn.datepicker.DPGlobal=l,a.fn.datepicker.noConflict=function(){return a.fn.datepicker=g,this},a(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(b){var c=a(this);c.data("datepicker")||(b.preventDefault(),h.call(c,"show"))}),a(function(){h.call(a('[data-provide="datepicker-inline"]'))})}(window.jQuery),function(a){"use strict";a.fn.bdatepicker=a.fn.datepicker.noConflict(),a.fn.datepicker||(a.fn.datepicker=a.fn.bdatepicker);var b=function(a){this.init("date",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{initPicker:function(b,c){this.options.viewformat||(this.options.viewformat=this.options.format),b.datepicker=a.fn.editableutils.tryParseJson(b.datepicker,!0),this.options.datepicker=a.extend({},c.datepicker,b.datepicker,{format:this.options.viewformat}),this.options.datepicker.language=this.options.datepicker.language||"en",this.dpg=a.fn.bdatepicker.DPGlobal,this.parsedFormat=this.dpg.parseFormat(this.options.format),this.parsedViewFormat=this.dpg.parseFormat(this.options.viewformat)},render:function(){this.$input.bdatepicker(this.options.datepicker),this.options.clear&&(this.$clear=a('<a href="#"></a>').html(this.options.clear).click(a.proxy(function(a){a.preventDefault(),a.stopPropagation(),this.clear()},this)),this.$tpl.parent().append(a('<div class="editable-clear">').append(this.$clear)))},value2html:function(a,c){var d=a?this.dpg.formatDate(a,this.parsedViewFormat,this.options.datepicker.language):"";b.superclass.value2html.call(this,d,c)},html2value:function(a){return this.parseDate(a,this.parsedViewFormat)},value2str:function(a){return a?this.dpg.formatDate(a,this.parsedFormat,this.options.datepicker.language):""},str2value:function(a){return this.parseDate(a,this.parsedFormat)},value2submit:function(a){return this.value2str(a)},value2input:function(a){this.$input.bdatepicker("update",a)},input2value:function(){return this.$input.data("datepicker").date},activate:function(){},clear:function(){this.$input.data("datepicker").date=null,this.$input.find(".active").removeClass("active"),this.options.showbuttons||this.$input.closest("form").submit()},autosubmit:function(){this.$input.on("mouseup",".day",function(b){if(!a(b.currentTarget).is(".old")&&!a(b.currentTarget).is(".new")){var c=a(this).closest("form");setTimeout(function(){c.submit()},200)}})},parseDate:function(a,b){var c,d=null;return a&&(d=this.dpg.parseDate(a,b,this.options.datepicker.language),"string"==typeof a&&(c=this.dpg.formatDate(d,b,this.options.datepicker.language),a!==c&&(d=null))),d}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<div class="editable-date well"></div>',inputclass:null,format:"yyyy-mm-dd",viewformat:null,datepicker:{weekStart:0,startView:0,minViewMode:0,autoclose:!1},clear:"&times; clear"}),a.fn.editabletypes.date=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("datefield",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.date),a.extend(b.prototype,{render:function(){this.$input=this.$tpl.find("input"),this.setClass(),this.setAttr("placeholder"),this.$tpl.bdatepicker(this.options.datepicker),this.$input.off("focus keydown"),this.$input.keyup(a.proxy(function(){this.$tpl.removeData("date"),this.$tpl.bdatepicker("update")},this))},value2input:function(a){this.$input.val(a?this.dpg.formatDate(a,this.parsedViewFormat,this.options.datepicker.language):""),this.$tpl.bdatepicker("update")},input2value:function(){return this.html2value(this.$input.val())},activate:function(){a.fn.editabletypes.text.prototype.activate.call(this)},autosubmit:function(){}}),b.defaults=a.extend({},a.fn.editabletypes.date.defaults,{tpl:'<div class="input-append date"><input type="text"/><span class="add-on"><i class="icon-th"></i></span></div>',inputclass:"input-small",datepicker:{weekStart:0,startView:0,minViewMode:0,autoclose:!0}}),a.fn.editabletypes.datefield=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("datetime",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{initPicker:function(b,c){this.options.viewformat||(this.options.viewformat=this.options.format),b.datetimepicker=a.fn.editableutils.tryParseJson(b.datetimepicker,!0),this.options.datetimepicker=a.extend({},c.datetimepicker,b.datetimepicker,{format:this.options.viewformat}),this.options.datetimepicker.language=this.options.datetimepicker.language||"en",this.dpg=a.fn.datetimepicker.DPGlobal,this.parsedFormat=this.dpg.parseFormat(this.options.format,this.options.formatType),this.parsedViewFormat=this.dpg.parseFormat(this.options.viewformat,this.options.formatType)},render:function(){this.$input.datetimepicker(this.options.datetimepicker),this.$input.on("changeMode",function(){var b=a(this).closest("form").parent();setTimeout(function(){b.triggerHandler("resize")},0)}),this.options.clear&&(this.$clear=a('<a href="#"></a>').html(this.options.clear).click(a.proxy(function(a){a.preventDefault(),a.stopPropagation(),this.clear()},this)),this.$tpl.parent().append(a('<div class="editable-clear">').append(this.$clear)))},value2html:function(a,c){var d=a?this.dpg.formatDate(this.toUTC(a),this.parsedViewFormat,this.options.datetimepicker.language,this.options.formatType):"";return c?(b.superclass.value2html.call(this,d,c),void 0):d},html2value:function(a){var b=this.parseDate(a,this.parsedViewFormat);return b?this.fromUTC(b):null},value2str:function(a){return a?this.dpg.formatDate(this.toUTC(a),this.parsedFormat,this.options.datetimepicker.language,this.options.formatType):""},str2value:function(a){var b=this.parseDate(a,this.parsedFormat);return b?this.fromUTC(b):null},value2submit:function(a){return this.value2str(a)},value2input:function(a){a&&this.$input.data("datetimepicker").setDate(a)},input2value:function(){var a=this.$input.data("datetimepicker");return a.date?a.getDate():null},activate:function(){},clear:function(){this.$input.data("datetimepicker").date=null,this.$input.find(".active").removeClass("active"),this.options.showbuttons||this.$input.closest("form").submit()},autosubmit:function(){this.$input.on("mouseup",".minute",function(){var b=a(this).closest("form");setTimeout(function(){b.submit()},200)})},toUTC:function(a){return a?new Date(a.valueOf()-6e4*a.getTimezoneOffset()):a},fromUTC:function(a){return a?new Date(a.valueOf()+6e4*a.getTimezoneOffset()):a},parseDate:function(a,b){var c,d=null;return a&&(d=this.dpg.parseDate(a,b,this.options.datetimepicker.language,this.options.formatType),"string"==typeof a&&(c=this.dpg.formatDate(d,b,this.options.datetimepicker.language,this.options.formatType),a!==c&&(d=null))),d}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<div class="editable-date well"></div>',inputclass:null,format:"yyyy-mm-dd hh:ii",formatType:"standard",viewformat:null,datetimepicker:{todayHighlight:!1,autoclose:!1},clear:"&times; clear"}),a.fn.editabletypes.datetime=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("datetimefield",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.datetime),a.extend(b.prototype,{render:function(){this.$input=this.$tpl.find("input"),this.setClass(),this.setAttr("placeholder"),this.$tpl.datetimepicker(this.options.datetimepicker),this.$input.off("focus keydown"),this.$input.keyup(a.proxy(function(){this.$tpl.removeData("date"),this.$tpl.datetimepicker("update")},this))},value2input:function(a){this.$input.val(this.value2html(a)),this.$tpl.datetimepicker("update")},input2value:function(){return this.html2value(this.$input.val())},activate:function(){a.fn.editabletypes.text.prototype.activate.call(this)},autosubmit:function(){}}),b.defaults=a.extend({},a.fn.editabletypes.datetime.defaults,{tpl:'<div class="input-append date"><input type="text"/><span class="add-on"><i class="icon-th"></i></span></div>',inputclass:"input-medium",datetimepicker:{todayHighlight:!1,autoclose:!0}}),a.fn.editabletypes.datetimefield=b}(window.jQuery),function(a){"use strict";var b=function(c){this.init("typeahead",c,b.defaults),this.options.typeahead=a.extend({},b.defaults.typeahead,{matcher:this.matcher,sorter:this.sorter,highlighter:this.highlighter,updater:this.updater},c.typeahead)};a.fn.editableutils.inherit(b,a.fn.editabletypes.list),a.extend(b.prototype,{renderList:function(){this.$input=this.$tpl.is("input")?this.$tpl:this.$tpl.find('input[type="text"]'),this.options.typeahead.source=this.sourceData,this.$input.typeahead(this.options.typeahead);var b=this.$input.data("typeahead");b.render=a.proxy(this.typeaheadRender,b),b.select=a.proxy(this.typeaheadSelect,b),b.move=a.proxy(this.typeaheadMove,b),this.renderClear(),this.setClass(),this.setAttr("placeholder")},value2htmlFinal:function(b,c){if(this.getIsObjects()){var d=a.fn.editableutils.itemsByValue(b,this.sourceData);b=d.length?d[0].text:""}a.fn.editabletypes.abstractinput.prototype.value2html.call(this,b,c)},html2value:function(a){return a?a:null},value2input:function(b){if(this.getIsObjects()){var c=a.fn.editableutils.itemsByValue(b,this.sourceData);this.$input.data("value",b).val(c.length?c[0].text:"")}else this.$input.val(b)},input2value:function(){if(this.getIsObjects()){var b=this.$input.data("value"),c=a.fn.editableutils.itemsByValue(b,this.sourceData);return c.length&&c[0].text.toLowerCase()===this.$input.val().toLowerCase()?b:null}return this.$input.val()},getIsObjects:function(){if(void 0===this.isObjects){this.isObjects=!1;for(var a=0;a<this.sourceData.length;a++)if(this.sourceData[a].value!==this.sourceData[a].text){this.isObjects=!0;break}}return this.isObjects},activate:a.fn.editabletypes.text.prototype.activate,renderClear:a.fn.editabletypes.text.prototype.renderClear,postrender:a.fn.editabletypes.text.prototype.postrender,toggleClear:a.fn.editabletypes.text.prototype.toggleClear,clear:function(){a.fn.editabletypes.text.prototype.clear.call(this),this.$input.data("value","")},matcher:function(b){return a.fn.typeahead.Constructor.prototype.matcher.call(this,b.text)},sorter:function(a){for(var b,c,d=[],e=[],f=[];b=a.shift();)c=b.text,c.toLowerCase().indexOf(this.query.toLowerCase())?~c.indexOf(this.query)?e.push(b):f.push(b):d.push(b);return d.concat(e,f)},highlighter:function(b){return a.fn.typeahead.Constructor.prototype.highlighter.call(this,b.text)},updater:function(a){return this.$element.data("value",a.value),a.text},typeaheadRender:function(b){var c=this;return b=a(b).map(function(b,d){return b=a(c.options.item).data("item",d),b.find("a").html(c.highlighter(d)),b[0]}),this.options.autoSelect&&b.first().addClass("active"),this.$menu.html(b),this},typeaheadSelect:function(){var a=this.$menu.find(".active").data("item");return(this.options.autoSelect||a)&&this.$element.val(this.updater(a)).change(),this.hide()},typeaheadMove:function(a){if(this.shown){switch(a.keyCode){case 9:case 13:case 27:if(!this.$menu.find(".active").length)return;a.preventDefault();break;case 38:a.preventDefault(),this.prev();break;case 40:a.preventDefault(),this.next()}a.stopPropagation()}}}),b.defaults=a.extend({},a.fn.editabletypes.list.defaults,{tpl:'<input type="text">',typeahead:null,clear:!0}),a.fn.editabletypes.typeahead=b}(window.jQuery);
/* ===========================================================
# bootstrap-tour - v0.9.3
# http://bootstraptour.com
# ==============================================================
# Copyright 2012-2013 Ulrich Sossou
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/

!function(a,b){var c,d;return d=b.document,c=function(){function c(c){var d;try{d=b.localStorage}catch(e){d=!1}this._options=a.extend({name:"tour",steps:[],container:"body",keyboard:!0,storage:d,debug:!1,backdrop:!1,redirect:!0,orphan:!1,duration:!1,basePath:"",template:"<div class='popover'> <div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content'></div> <div class='popover-navigation'> <div class='btn-group'> <button class='btn btn-sm btn-default' data-role='prev'>&laquo; Prev</button> <button class='btn btn-sm btn-default' data-role='next'>Next &raquo;</button> <button class='btn btn-sm btn-default' data-role='pause-resume' data-pause-text='Pause' data-resume-text='Resume'>Pause</button> </div> <button class='btn btn-sm btn-default' data-role='end'>End tour</button> </div> </div>",afterSetState:function(){},afterGetState:function(){},afterRemoveState:function(){},onStart:function(){},onEnd:function(){},onShow:function(){},onShown:function(){},onHide:function(){},onHidden:function(){},onNext:function(){},onPrev:function(){},onPause:function(){},onResume:function(){}},c),this._force=!1,this._inited=!1,this.backdrop={overlay:null,$element:null,$background:null,backgroundShown:!1,overlayElementShown:!1}}return c.prototype.addSteps=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)b=a[c],this.addStep(b);return this},c.prototype.addStep=function(a){return this._options.steps.push(a),this},c.prototype.getStep=function(b){return null!=this._options.steps[b]?a.extend({id:"step-"+b,path:"",placement:"right",title:"",content:"<p></p>",next:b===this._options.steps.length-1?-1:b+1,prev:b-1,animation:!0,container:this._options.container,backdrop:this._options.backdrop,redirect:this._options.redirect,orphan:this._options.orphan,duration:this._options.duration,template:this._options.template,onShow:this._options.onShow,onShown:this._options.onShown,onHide:this._options.onHide,onHidden:this._options.onHidden,onNext:this._options.onNext,onPrev:this._options.onPrev,onPause:this._options.onPause,onResume:this._options.onResume},this._options.steps[b]):void 0},c.prototype.init=function(a){return this._force=a,this.ended()?(this._debug("Tour ended, init prevented."),this):(this.setCurrentStep(),this._initMouseNavigation(),this._initKeyboardNavigation(),this._onResize(function(a){return function(){return a.showStep(a._current)}}(this)),null!==this._current&&this.showStep(this._current),this._inited=!0,this)},c.prototype.start=function(a){var b;return null==a&&(a=!1),this._inited||this.init(a),null===this._current&&(b=this._makePromise(null!=this._options.onStart?this._options.onStart(this):void 0),this._callOnPromiseDone(b,this.showStep,0)),this},c.prototype.next=function(){var a;return a=this.hideStep(this._current),this._callOnPromiseDone(a,this._showNextStep)},c.prototype.prev=function(){var a;return a=this.hideStep(this._current),this._callOnPromiseDone(a,this._showPrevStep)},c.prototype.goTo=function(a){var b;return b=this.hideStep(this._current),this._callOnPromiseDone(b,this.showStep,a)},c.prototype.end=function(){var c,e;return c=function(c){return function(){return a(d).off("click.tour-"+c._options.name),a(d).off("keyup.tour-"+c._options.name),a(b).off("resize.tour-"+c._options.name),c._setState("end","yes"),c._inited=!1,c._force=!1,c._clearTimer(),null!=c._options.onEnd?c._options.onEnd(c):void 0}}(this),e=this.hideStep(this._current),this._callOnPromiseDone(e,c)},c.prototype.ended=function(){return!this._force&&!!this._getState("end")},c.prototype.restart=function(){return this._removeState("current_step"),this._removeState("end"),this.start()},c.prototype.pause=function(){var a;return a=this.getStep(this._current),a&&a.duration?(this._paused=!0,this._duration-=(new Date).getTime()-this._start,b.clearTimeout(this._timer),this._debug("Paused/Stopped step "+(this._current+1)+" timer ("+this._duration+" remaining)."),null!=a.onPause?a.onPause(this,this._duration):void 0):this},c.prototype.resume=function(){var a;return a=this.getStep(this._current),a&&a.duration?(this._paused=!1,this._start=(new Date).getTime(),this._duration=this._duration||a.duration,this._timer=b.setTimeout(function(a){return function(){return a._isLast()?a.next():a.end()}}(this),this._duration),this._debug("Started step "+(this._current+1)+" timer with duration "+this._duration),null!=a.onResume&&this._duration!==a.duration?a.onResume(this,this._duration):void 0):this},c.prototype.hideStep=function(b){var c,d,e;return(e=this.getStep(b))?(this._clearTimer(),d=this._makePromise(null!=e.onHide?e.onHide(this,b):void 0),c=function(c){return function(){var d;return d=a(e.element),d.data("bs.popover")||d.data("popover")||(d=a("body")),d.popover("destroy").removeClass("tour-"+c._options.name+"-element tour-"+c._options.name+"-"+b+"-element"),e.reflex&&d.css("cursor","").off("click.tour-"+c._options.name),e.backdrop&&c._hideBackdrop(),null!=e.onHidden?e.onHidden(c):void 0}}(this),this._callOnPromiseDone(d,c),d):void 0},c.prototype.showStep=function(a){var b,c,e,f;return this.ended()?(this._debug("Tour ended, showStep prevented."),this):(f=this.getStep(a))?(e=a<this._current,b=this._makePromise(null!=f.onShow?f.onShow(this,a):void 0),c=function(b){return function(){var c,g;if(b.setCurrentStep(a),g=function(){switch({}.toString.call(f.path)){case"[object Function]":return f.path();case"[object String]":return this._options.basePath+f.path;default:return f.path}}.call(b),c=[d.location.pathname,d.location.hash].join(""),b._isRedirect(g,c))return void b._redirect(f,g);if(b._isOrphan(f)){if(!f.orphan)return b._debug("Skip the orphan step "+(b._current+1)+". Orphan option is false and the element doesn't exist or is hidden."),void(e?b._showPrevStep():b._showNextStep());b._debug("Show the orphan step "+(b._current+1)+". Orphans option is true.")}return f.backdrop&&b._showBackdrop(b._isOrphan(f)?void 0:f.element),b._scrollIntoView(f.element,function(){return b.getCurrentStep()===a?(null!=f.element&&f.backdrop&&b._showOverlayElement(f.element),b._showPopover(f,a),null!=f.onShown&&f.onShown(b),b._debug("Step "+(b._current+1)+" of "+b._options.steps.length)):void 0}),f.duration?b.resume():void 0}}(this),this._callOnPromiseDone(b,c),b):void 0},c.prototype.getCurrentStep=function(){return this._current},c.prototype.setCurrentStep=function(a){return null!=a?(this._current=a,this._setState("current_step",a)):(this._current=this._getState("current_step"),this._current=null===this._current?null:parseInt(this._current,10)),this},c.prototype._setState=function(a,b){var c,d;if(this._options.storage){d=""+this._options.name+"_"+a;try{this._options.storage.setItem(d,b)}catch(e){c=e,c.code===DOMException.QUOTA_EXCEEDED_ERR&&this.debug("LocalStorage quota exceeded. State storage failed.")}return this._options.afterSetState(d,b)}return null==this._state&&(this._state={}),this._state[a]=b},c.prototype._removeState=function(a){var b;return this._options.storage?(b=""+this._options.name+"_"+a,this._options.storage.removeItem(b),this._options.afterRemoveState(b)):null!=this._state?delete this._state[a]:void 0},c.prototype._getState=function(a){var b,c;return this._options.storage?(b=""+this._options.name+"_"+a,c=this._options.storage.getItem(b)):null!=this._state&&(c=this._state[a]),(void 0===c||"null"===c)&&(c=null),this._options.afterGetState(a,c),c},c.prototype._showNextStep=function(){var a,b,c;return c=this.getStep(this._current),b=function(a){return function(){return a.showStep(c.next)}}(this),a=this._makePromise(null!=c.onNext?c.onNext(this):void 0),this._callOnPromiseDone(a,b)},c.prototype._showPrevStep=function(){var a,b,c;return c=this.getStep(this._current),b=function(a){return function(){return a.showStep(c.prev)}}(this),a=this._makePromise(null!=c.onPrev?c.onPrev(this):void 0),this._callOnPromiseDone(a,b)},c.prototype._debug=function(a){return this._options.debug?b.console.log("Bootstrap Tour '"+this._options.name+"' | "+a):void 0},c.prototype._isRedirect=function(a,b){return null!=a&&""!==a&&("[object RegExp]"==={}.toString.call(a)&&!a.test(b)||"[object String]"==={}.toString.call(a)&&a.replace(/\?.*$/,"").replace(/\/?$/,"")!==b.replace(/\/?$/,""))},c.prototype._redirect=function(b,c){return a.isFunction(b.redirect)?b.redirect.call(this,c):b.redirect===!0?(this._debug("Redirect to "+c),d.location.href=c):void 0},c.prototype._isOrphan=function(b){return null==b.element||!a(b.element).length||a(b.element).is(":hidden")&&"http://www.w3.org/2000/svg"!==a(b.element)[0].namespaceURI},c.prototype._isLast=function(){return this._current<this._options.steps.length-1},c.prototype._showPopover=function(b,c){var d,e,f,g,h,i;return a(".tour-"+this._options.name).remove(),i=a.extend({},this._options),f=a(a.isFunction(b.template)?b.template(c,b):b.template),e=f.find(".popover-navigation"),h=this._isOrphan(b),h&&(b.element="body",b.placement="top",f=f.addClass("orphan")),d=a(b.element),f.addClass("tour-"+this._options.name+" tour-"+this._options.name+"-"+c),d.addClass("tour-"+this._options.name+"-element tour-"+this._options.name+"-"+c+"-element"),b.options&&a.extend(i,b.options),b.reflex&&!h&&d.css("cursor","pointer").on("click.tour-"+this._options.name,function(a){return function(){return a._isLast()?a.next():a.end()}}(this)),b.prev<0&&e.find("[data-role='prev']").addClass("disabled"),b.next<0&&e.find("[data-role='next']").addClass("disabled"),b.duration||e.find("[data-role='pause-resume']").remove(),b.template=f.clone().wrap("<div>").parent().html(),d.popover({placement:b.placement,trigger:"manual",title:b.title,content:b.content,html:!0,animation:b.animation,container:b.container,template:b.template,selector:b.element}).popover("show"),g=d.data("bs.popover")?d.data("bs.popover").tip():d.data("popover").tip(),g.attr("id",b.id),this._reposition(g,b),h?this._center(g):void 0},c.prototype._reposition=function(b,c){var e,f,g,h,i,j,k;if(h=b[0].offsetWidth,f=b[0].offsetHeight,k=b.offset(),i=k.left,j=k.top,e=a(d).outerHeight()-k.top-b.outerHeight(),0>e&&(k.top=k.top+e),g=a("html").outerWidth()-k.left-b.outerWidth(),0>g&&(k.left=k.left+g),k.top<0&&(k.top=0),k.left<0&&(k.left=0),b.offset(k),"bottom"===c.placement||"top"===c.placement){if(i!==k.left)return this._replaceArrow(b,2*(k.left-i),h,"left")}else if(j!==k.top)return this._replaceArrow(b,2*(k.top-j),f,"top")},c.prototype._center=function(c){return c.css("top",a(b).outerHeight()/2-c.outerHeight()/2)},c.prototype._replaceArrow=function(a,b,c,d){return a.find(".arrow").css(d,b?50*(1-b/c)+"%":"")},c.prototype._scrollIntoView=function(c,d){var e,f,g,h,i,j;return e=a(c),e.length?(f=a(b),h=e.offset().top,j=f.height(),i=Math.max(0,h-j/2),this._debug("Scroll into view. ScrollTop: "+i+". Element offset: "+h+". Window height: "+j+"."),g=0,a("body,html").stop(!0,!0).animate({scrollTop:Math.ceil(i)},function(a){return function(){return 2===++g?(d(),a._debug("Scroll into view. Animation end element offset: "+e.offset().top+". Window height: "+f.height()+".")):void 0}}(this))):d()},c.prototype._onResize=function(c,d){return a(b).on("resize.tour-"+this._options.name,function(){return clearTimeout(d),d=setTimeout(c,100)})},c.prototype._initMouseNavigation=function(){var b;return b=this,a(d).off("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='prev']:not(.disabled)").off("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='next']:not(.disabled)").off("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='end']").off("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='pause-resume']").on("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='next']:not(.disabled)",function(a){return function(b){return b.preventDefault(),a.next()}}(this)).on("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='prev']:not(.disabled)",function(a){return function(b){return b.preventDefault(),a.prev()}}(this)).on("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='end']",function(a){return function(b){return b.preventDefault(),a.end()}}(this)).on("click.tour-"+this._options.name,".popover.tour-"+this._options.name+" *[data-role='pause-resume']",function(c){var d;return c.preventDefault(),d=a(this),d.text(d.data(b._paused?"pause-text":"resume-text")),b._paused?b.resume():b.pause()})},c.prototype._initKeyboardNavigation=function(){return this._options.keyboard?a(d).on("keyup.tour-"+this._options.name,function(a){return function(b){if(b.which)switch(b.which){case 39:return b.preventDefault(),a._isLast()?a.next():a.end();case 37:if(b.preventDefault(),a._current>0)return a.prev();break;case 27:return b.preventDefault(),a.end()}}}(this)):void 0},c.prototype._makePromise=function(b){return b&&a.isFunction(b.then)?b:null},c.prototype._callOnPromiseDone=function(a,b,c){return a?a.then(function(a){return function(){return b.call(a,c)}}(this)):b.call(this,c)},c.prototype._showBackdrop=function(){return this.backdrop.backgroundShown?void 0:(this.backdrop=a("<div/>",{"class":"tour-backdrop"}),this.backdrop.backgroundShown=!0,a("body").append(this.backdrop))},c.prototype._hideBackdrop=function(){return this._hideOverlayElement(),this._hideBackground()},c.prototype._hideBackground=function(){return this.backdrop?(this.backdrop.remove(),this.backdrop.overlay=null,this.backdrop.backgroundShown=!1):void 0},c.prototype._showOverlayElement=function(b){var c,d,e;return d=a(b),d&&0!==d.length&&!this.backdrop.overlayElementShown?(this.backdrop.overlayElementShown=!0,c=a("<div/>"),e=d.offset(),e.top=e.top,e.left=e.left,c.width(d.innerWidth()).height(d.innerHeight()).addClass("tour-step-background").offset(e),d.addClass("tour-step-backdrop"),a("body").append(c),this.backdrop.$element=d,this.backdrop.$background=c):void 0},c.prototype._hideOverlayElement=function(){return this.backdrop.overlayElementShown?(this.backdrop.$element.removeClass("tour-step-backdrop"),this.backdrop.$background.remove(),this.backdrop.$element=null,this.backdrop.$background=null,this.backdrop.overlayElementShown=!1):void 0},c.prototype._clearTimer=function(){return b.clearTimeout(this._timer),this._timer=null,this._duration=null},c}(),b.Tour=c}(jQuery,window);
/* load.js
 * ---------------------------------
 *
 */


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

$(document).ready(function(){
	var notice = getParameterByName("notice");
	if(notice){
		alert(notice);
	}
});

/*
var ready = function() {
  var flash_team_id = $("#flash_team_id").val();

  var url = '/flash_teams/' + flash_team_id + '/get_json';
  $.get(url, function(data){
    drawFlashTeamFromJSON(data);
  });
};
*/

// Trick to fix a turbolink issue
//$(document).ready(ready);
//$(document).on('page:load', ready);
/* Timeline.js
 * ---------------------------------------------
 * Code that manages the workflow timeline in Foundry.
 */


var XTicks = 100,
    YTicks = 6;

var SVG_WIDTH = 4850,
    SVG_HEIGHT = 550;

var STEP_WIDTH = 25,
    HOUR_WIDTH = 100;

var TIMELINE_HOURS = 48;
var TOTAL_HOUR_PIXELS = TIMELINE_HOURS*HOUR_WIDTH;

var x = d3.scale.linear()
    .domain([0, TOTAL_HOUR_PIXELS])
    .range([0, TOTAL_HOUR_PIXELS]);

var y = d3.scale.linear() 
    .domain([17, 550])
    .range([17, 550]);

var current = undefined;
var currentUserEvents = [];
var currentUserIds = [];
var upcomingEvent; 

var overlayIsOn = false;


var timeline_svg = d3.select("#timeline-container").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("class", "chart");

//console.log("APPENDED TIMELINE TO DOM!");

//CHART CODE (http://synthesis.sbecker.net/?s=learning+d3+intro+to+svg)
//Draw x grid lines
timeline_svg.selectAll("line.x")
    .data(x.ticks(XTicks))
    .enter().append("line")
    .attr("class", "x")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 15)
    .attr("y2", SVG_HEIGHT-50)
    .style("stroke", "rgba(100, 100, 100, .5)");

var yLines = y.ticks(YTicks);
//Hack: subtract 20* to get the row heights shorter
for (i = 0; i<yLines.length; i++) {
    yLines[i] -= 3;
    yLines[i] -= (i*20);
}


//Draw y axis grid lines
timeline_svg.selectAll("line.y")
    .data(yLines) 
    .enter().append("line")
    .attr("class", "y")
    .attr("x1", 0)
    .attr("x2", SVG_WIDTH-50)
    .attr("y1", y)
    .attr("y2", y)
    .style("stroke", "#d3d1d1");

//Remove existing X-axis labels
var numMins = -30;

//Add X Axis Labels
timeline_svg.selectAll("text.timelabel")
    .data(x.ticks(XTicks)) 
    .enter().append("text")
    .attr("class", "timelabel")
    .attr("x", x)
    .attr("y", 15)
    .attr("dy", -3)
    .attr("text-anchor", "middle")
    .text(function(d) {
        numMins+= 30;
        var hours = Math.floor(numMins/60);
        var minutes = numMins%60;
        if (minutes == 0 && hours == 0) return ".     .      .    .    0:00";
        else if (minutes == 0) return hours + ":00";
        else return hours + ":" + minutes; 
    });

//Darker First X and Y line
timeline_svg.append("line")
    .attr("x1", 0)
    .attr("x2", SVG_WIDTH-50)
    .attr("y1", 15)
    .attr("y2", 15)
    .style("stroke", "#000")
    .style("stroke-width", "4")
timeline_svg.append("line")
    .attr("y1", 15)
    .attr("y2", SVG_HEIGHT-50)
    .style("stroke", "#000")
    .style("stroke-width", "4");

//Extend the timeline the necessary amount for the project
function initializeTimelineDuration() {
    var totalHours = findTotalHours();
    if (totalHours > 48) {
        TIMELINE_HOURS = totalHours;
        TOTAL_HOUR_PIXELS = TIMELINE_HOURS * HOUR_WIDTH;
        SVG_WIDTH = TIMELINE_HOURS * 100 + 50;
        XTicks = TIMELINE_HOURS * 2;
        redrawTimeline();
    }
}


var task_g = timeline_svg.selectAll(".task_g");

//Set the width of the timeline header row so add time button is all the way to the right
document.getElementById("timeline-header").style.width = SVG_WIDTH - 50 + "px";

//Turn on the overlay so a user cannot continue to draw events when focus is on a popover
function overlayOn() {
    console.log("overlay on");
    //$("#overlay").css("display", "block");
};

//Remove the overlay so a user can draw events again
function overlayOff() {
    console.log("overlay off");
    $(".task_rectangle").popover("hide");
    //$("#overlay").css("display", "none");
};

//Access a particular "event" in the JSON by its id number and return its index in the JSON array of events
function getEventJSONIndex(idNum) {
    var num_events = flashTeamsJSON["events"].length;
    for (var i = 0; i < num_events; i++) {
        if (flashTeamsJSON["events"][i].id == idNum) {
            return i;
        }
    }
};

//VCom Time expansion button trial 
function addTime() {
    calcAddHours(TIMELINE_HOURS);
    redrawTimeline();
}

//Should have updated the variables: TIMELINE_HOURS, TOTAL_HOUR_PIXELS, SVG_WIDTH, XTicks
//Redraws timeline based on those numbers
function redrawTimeline() {
    //debugger;
    //Recalculate 'x' based on added hours
    var x = d3.scale.linear()
    .domain([0, TOTAL_HOUR_PIXELS])
    .range([0, TOTAL_HOUR_PIXELS]);
    
    //Reset overlay and svg width
    document.getElementById("overlay").style.width = SVG_WIDTH + 50 + "px";
    timeline_svg.attr("width", SVG_WIDTH);
    
    //Remove all existing grid lines & background
    timeline_svg.selectAll("line").remove();
    timeline_svg.selectAll("rect.background").remove();
    
    //Redraw all x-axis grid lines
    timeline_svg.selectAll("line.x")
        .data(x.ticks(XTicks)) 
        .enter().append("line")
        .attr("class", "x")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 15)
        .attr("y2", SVG_HEIGHT-50)
        .style("stroke", "rgba(100, 100, 100, .5)");
    
    //Redraw all y-axis grid lines
    timeline_svg.selectAll("line.y")
        .data(yLines) 
        .enter().append("line")
        .attr("class", "y")
        .attr("x1", 0)
        .attr("x2", SVG_WIDTH-50)
        .attr("y1", y)
        .attr("y2", y)
        .style("stroke", "#d3d1d1");
    
    //Redraw darker first x and y grid lines
    timeline_svg.append("line")
        .attr("x1", 0)
        .attr("x2", SVG_WIDTH-50)
        .attr("y1", 15)
        .attr("y2", 15)
        .style("stroke", "#000")
        .style("stroke-width", "4");
    
    timeline_svg.append("line")
        .attr("y1", 15)
        .attr("y2", SVG_HEIGHT-50)
        .style("stroke", "#000")
        .style("stroke-width", "4");
    
    //Redraw Add Time Button
    document.getElementById("timeline-header").style.width = SVG_WIDTH - 50 + "px";
    
    //Remove existing X-axis labels
    timeline_svg.selectAll("text.timelabel").remove();
    numMins = -30;

    //Redraw X-axis labels
    timeline_svg.selectAll("text.timelabel")
        .data(x.ticks(XTicks))
        .enter().append("text")
        .attr("class", "timelabel")
        .attr("x", x)
        .attr("y", 15)
        .attr("dy", -3)
        .attr("text-anchor", "middle")
        .text(function(d) {
            numMins+= 30;
            var hours = Math.floor(numMins/60);
            var minutes = numMins%60;
            if (minutes == 0 && hours == 0) return ".     .      .    .    0:00";
            else if (minutes == 0) return hours + ":00";
            else return hours + ":" + minutes; 
        });
    
    //Add ability to draw rectangles on extended timeline
    timeline_svg.append("rect")
        .attr("class", "background")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("fill", "white")
        .attr("fill-opacity", 0)
        .on("mousedown", function() {
            var point = d3.mouse(this);
            newEvent(point);
        }); 

    //Redraw the cursor
    timeline_svg.append("line")
        .attr("y1", 15)
        .attr("y2", SVG_HEIGHT-50)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("class", "cursor")
        .style("stroke", "red")
        .style("stroke-width", "2")

    //Get the latest time and team status, update x position of cursor
    cursor = timeline_svg.select(".cursor");
    var latest_time;
    if (in_progress){
        latest_time = (new Date).getTime();
    } else {
        latest_time = loadedStatus.latest_time;
    }
    
    //Next line is commented out after disabling the ticker
    //cursor_details = positionCursor(flashTeamsJSON, latest_time);

    //move all existing events back on top of timeline
    $(timeline_svg.selectAll('g')).each(function() {
        $('.chart').append(this);
    });
}

//VCom Calculates how many hours to add when user expands timeline manually 
//Increases by 1/3 each time (130% original length)
function calcAddHours(currentHours) {
    TIMELINE_HOURS = currentHours + Math.floor(currentHours/3);
    TOTAL_HOUR_PIXELS = TIMELINE_HOURS * HOUR_WIDTH;
    SVG_WIDTH = TIMELINE_HOURS * HOUR_WIDTH + 50;
    XTicks = TIMELINE_HOURS * 2;
}
;
/* events.js
 * ---------------------------------------------
 * 
 */


var RECTANGLE_WIDTH = 100;
var RECTANGLE_HEIGHT = 70;
var HIRING_HEIGHT = 50;
var ROW_HEIGHT = 80;
var DRAGBAR_WIDTH = 8;
var event_counter = 0;

$(document).ready(function(){
    timeline_svg.append("rect")
    .attr("class", "background")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("fill", "white")
    .attr("fill-opacity", 0)
    .on("mousedown", function(){
        var point = d3.mouse(this);
        newEvent(point);
    });
});

var dragged = false;

//Called when the right dragbar of a task rectangle is dragged
var drag_right = d3.behavior.drag()
    .on("drag", rightResize)
    .on("dragend", function(d){
        var ev = getEventFromId(d.groupNum);
        drawPopover(ev, true, false);
        updateStatus(false);
    });

//Called when the left dragbar of a task rectangle is dragged
var drag_left = d3.behavior.drag()
    .on("drag", leftResize)
    .on("dragend", function(d){
        var ev = getEventFromId(d.groupNum);
        drawPopover(ev, true, false);
        updateStatus(false);
    });

//Called when task rectangles are dragged
var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragEventBlock)
    .on("dragend", function(d){
        if(dragged){
            dragged = false;
            var ev = getEventFromId(d.groupNum);
            drawPopover(ev, true, false);
            updateStatus(false);
        } else {
            // click
            eventMousedown(d.groupNum);
        }
    });

// leftResize: resize the rectangle by dragging the left handle
function leftResize(d) {
    if(isUser || in_progress) { // user page
        return;
    }

    // get event id
    var groupNum = d.groupNum;

    // get event object
    var ev = getEventFromId(groupNum);
    
    // get new left x
    var width = getWidth(ev);
    var rightX = ev.x + width;
    var newX = d3.event.x - (d3.event.x%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;
    if(newX < 0){
        newX = 0;
    }
    var newWidth = width + (ev.x - newX);
    if (newWidth < 30)
        return;
    
    // update x and draw event
    ev.x = newX;
    ev.min_x = newX;
    ev.duration = durationForWidth(newWidth);
    
    var startHr = startHrForX(newX);
    var startMin = startMinForX(newX);
    ev.startHr = startHr;
    ev.startMin = startMin;
    ev.startTime = startHr * 60 + startMin;

    drawEvent(ev, false);
}

// rightResize: resize the rectangle by dragging the right handle
function rightResize(d) {
    if(isUser || in_progress) { // user page
        return;
    }


    // get event id
    var groupNum = d.groupNum;

    // get event object
    var ev = getEventFromId(groupNum);

    var newX = d3.event.x - (d3.event.x%(STEP_WIDTH)) - (DRAGBAR_WIDTH/2);
    if(newX > SVG_WIDTH){
        newX = SVG_WIDTH;
    }
    var newWidth = newX - ev.x;
    if (newWidth < 30)
        return;

    ev.duration = durationForWidth(newWidth);

    drawEvent(ev, false);
}

function dragEventBlock(d) {
    
    if(isUser || in_progress) { // user page
        return;
    }

    dragged = true;

    // get event id
    var groupNum = d.groupNum;

    // get event object
    var ev = getEventFromId(groupNum);

    var width = getWidth(ev);

    //Horizontal dragging
    var dragX = d3.event.x - (d3.event.x%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;
    var newX = Math.max((0 - (DRAGBAR_WIDTH/2)), Math.min(SVG_WIDTH-width, dragX));
    if (d3.event.dx + d.x < 0) newX = (0 - (DRAGBAR_WIDTH/2));
    
    ev.x = newX;
    ev.min_x = newX;

    //update start time, start hour, start minute
    var startHr = startHrForX(newX);
    var startMin = startMinForX(newX);
    ev.startHr = startHr;
    ev.startMin = startMin;
    ev.startTime = startHr * 60 + startMin;

    //Vertical Dragging
    var dragY = d3.event.y - (d3.event.y%(ROW_HEIGHT)) + 5;
    var newY = Math.min(SVG_HEIGHT - ROW_HEIGHT, dragY);
    if (d3.event.dy + d.y < 20) {
        ev.y = 17;
    } else {
        ev.y = newY;
    }

    drawEvent(ev, false);
}

//VCom Calculates where to snap event block to when created
function calcSnap(mouseX, mouseY) {
    var snapX = Math.floor(mouseX - (mouseX%50) - DRAGBAR_WIDTH/2),
        snapY = Math.floor(mouseY/ROW_HEIGHT) * ROW_HEIGHT + 5;
    return [snapX, snapY];
}

// mousedown on timeline => creates new event and draws it
function newEvent(point) {
    // interactions
    if(DRAWING_HANDOFF==true || DRAWING_COLLAB==true) {
        alert("Please click on another event or the same event to cancel");
        return;
    }

    if (overlayIsOn) {
        overlayOff();
        return;
    } 

    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["events"].length; i++) {
        var idNum = flashTeamsJSON["events"][i].id;
        $(timeline_svg.selectAll("g#g_"+idNum)[0][0]).popover('hide');
    }

    if(isUser || in_progress) { // user page
        return;
    }
    
    createEvent(point);
};

function createEvent(point) {
    // get coords where event should snap to
    var snapPoint = calcSnap(point[0], point[1]);
  
    if(!checkWithinTimelineBounds(snapPoint)){ return; }

    // create event object
    var eventObj = createEventObj(snapPoint);
    
    // render event on timeline
    drawEvent(eventObj, true);

    // render event popover
    drawPopover(eventObj, true, true);

    // save
    updateStatus(false);
};

function checkWithinTimelineBounds(snapPoint) {
    return ((snapPoint[1] < 505) && (snapPoint[0] < (SVG_WIDTH-150)));
};

function getStartTime(mouseX) {
    var startHr = (mouseX-(mouseX%100))/100;
    var startMin = (mouseX%100)/25*15;
    if(startMin == 57.599999999999994) {
        startHr++;
        startMin = 0;
    } else startMin += 2.4
    var startTimeinMinutes = parseInt((startHr*60)) + parseInt(startMin);

    return {"startHr":startHr, "startMin":startMin, "startTimeinMinutes":startTimeinMinutes};
};

function getDuration(leftX, rightX) {
    var hrs = Math.floor(((rightX-leftX)/100));
    var min = (((rightX-leftX)%(Math.floor(((rightX-leftX)/100))*100))/25*15);
    var durationInMinutes = parseInt((hrs*60)) + parseInt(min);

    return {"duration":durationInMinutes, "hrs":hrs, "min":min};
};

function createEventObj(snapPoint) {
    event_counter++;
    var startTimeObj = getStartTime(snapPoint[0]);
    var newEvent = {"title":"New Event", "id":event_counter, "x": snapPoint[0], "min_x": snapPoint[0], "y": snapPoint[1], 
        "startTime": startTimeObj["startTimeinMinutes"], "duration":60, "members":[], 
        "dri":"", "notes":"", "startHr": startTimeObj["startHr"], "status":"not_started",
        "startMin": startTimeObj["startMin"], "gdrive":[], "completed_x":null, "inputs":null, "outputs":null};
      //add new event to flashTeams database
    if (flashTeamsJSON.events.length == 0){
        //createNewFolder($("#flash_team_name").val());
    }
    flashTeamsJSON.events.push(newEvent);
    return newEvent;
};

function getEventFromId(id) {
    var events = flashTeamsJSON.events;
    for(var i=0;i<events.length;i++){
        var ev = events[i];
        if(ev.id == id){
            return ev;
        }
    }
    return null;
};

//Return the width in pixels of an event
function getWidth(ev) {
    var durationInMinutes = ev.duration;
    var hrs = parseFloat(durationInMinutes)/parseFloat(60);
    var width = parseFloat(hrs)*parseFloat(RECTANGLE_WIDTH);
    var roundedWidth = Math.round(parseFloat(width)/parseFloat(STEP_WIDTH)) * STEP_WIDTH;
    return roundedWidth;
};

function durationForWidth(width) {
    var hrs = parseFloat(width)/parseFloat(RECTANGLE_WIDTH);
    return hrs*60;
};

function startHrForX(X){
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var hrs = Math.floor(parseFloat(roundedX)/parseFloat(RECTANGLE_WIDTH));
    return hrs;
};

function startMinForX(X){
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var mins = (parseFloat(roundedX) % parseFloat(RECTANGLE_WIDTH)) * 60 / parseFloat(RECTANGLE_WIDTH);
    return mins;
};


function getMemberIndexFromName(name) {
    for (var j = 0; j < flashTeamsJSON["members"].length; j++) { // go through all members
        if (flashTeamsJSON["members"][j].role == name){
            return j;
        }
    }
    return -1;
}

function drawG(eventObj, firstTime) {
    var x = eventObj["x"];
    var y = eventObj["y"];
    var groupNum = eventObj["id"];
    var y_offset = 17;

    var idx = getDataIndexFromGroupNum(groupNum);
    if(idx == null) {
        var new_data = {id: "task_g_" + groupNum, class: "task_g", groupNum: groupNum, x: x, y: y+y_offset};
        task_groups.push(new_data);
    } else {
        task_groups[idx].x = x;
        task_groups[idx].y = y+y_offset;
    }

    // add group to timeline, based on the data object
    timeline_svg.selectAll("g")
        .data(task_groups, function(d){ return d.groupNum; })
        .enter()
        .append("g")
        .attr("id", "g_" + groupNum);
}

function drawMainRect(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    var existingMainRect = task_g.selectAll("#rect_" + groupNum);
    if(existingMainRect[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "task_rectangle")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("id", function(d) {
                return "rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum;})
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", width)
            .attr("fill", "#C9C9C9")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A")
            .attr('pointer-events', 'all')
            .call(drag);
    } else {
        task_g.selectAll(".task_rectangle")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("width", width);
    }
};

function drawRightDragBar(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    var existingRightDragBar = task_g.selectAll("#rt_rect_" + groupNum);
    if(existingRightDragBar[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "rt_rect")
            .attr("x", function(d) { 
                return d.x + width; })
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "rt_rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum})
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", DRAGBAR_WIDTH)
            .attr("fill", "#00")
            .attr("fill-opacity", .6)
            .attr('pointer-events', 'all')
            .call(drag_right);
    } else {
        task_g.selectAll(".rt_rect")
            .attr("x", function(d) {return d.x + width})
            .attr("y", function(d) {return d.y});
    }
}

function drawLeftDragBar(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingLeftDragBar = task_g.selectAll("#lt_rect_" + groupNum);
    if(existingLeftDragBar[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "lt_rect")
            .attr("x", function(d) { return d.x})
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "lt_rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum})
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", DRAGBAR_WIDTH)
            .attr("fill", "#00")
            .attr("fill-opacity", .6)
            .attr('pointer-events', 'all')
            .call(drag_left);
    } else {
        task_g.selectAll(".lt_rect")
            .attr("x", function(d) {return d.x}) 
            .attr("y", function(d) {return d.y});
    }
}

function drawTitleText(eventObj, firstTime) {
    var x_offset = 10; // unique for title
    var y_offset = 14; // unique for title

    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var task_g = getTaskGFromGroupNum(groupNum);

    //shorten title to fit inside event
    var existingTitleTextDiv = document.getElementById("titleLength");
    var spn = existingTitleTextDiv.getElementsByTagName('span')[0];
    spn.innerHTML = title;
    var shortened_title = title;
    var width = (spn.offsetWidth );
    var event_width = getWidth(eventObj);
        
  while (width > event_width - 15){ 
        shortened_title = shortened_title.substring(0,shortened_title.length - 4);
        shortened_title = shortened_title + "...";
        spn.innerHTML = shortened_title;
        width = spn.offsetWidth;
  }

    title = shortened_title;
   

    var existingTitleText = task_g.selectAll("#title_text_" + groupNum);
    if(existingTitleText[0].length == 0){ // first time
        task_g.append("text")
            .text(title)
            .attr("class", "title_text")
            .attr("id", function(d) { return "title_text_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum})
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset})
            .attr("font-weight", "bold")
            .attr("font-size", "12px");
    } else {
        task_g.selectAll(".title_text")
            .text(title)
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }


}

function drawDurationText(eventObj, firstTime) {
    var x_offset = 10; // unique for duration
    var y_offset = 26; // unique for duration

    var totalMinutes = eventObj["duration"];
    var numHoursInt = Math.floor(totalMinutes/60);
    var minutesLeft = Math.round(totalMinutes%60);

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingDurationText = task_g.selectAll("#time_text_" + groupNum);
    if(existingDurationText[0].length == 0){ // first time
        task_g.append("text")
            .text(function (d) {
                if (numHoursInt == 0){
                    return minutesLeft+"min";
                }
                else
                    return numHoursInt+"hrs "+minutesLeft+"min";
            })
            .attr("class", "time_text")
            .attr("id", function(d) {return "time_text_" + groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset})
            .attr("font-size", "12px");
    } else {
        task_g.selectAll(".time_text")
            .text(function (d) {
                if (numHoursInt == 0){
                    return minutesLeft+"min"; 
                }
                else
                    return numHoursInt+"hrs "+minutesLeft+"min";
            })
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawGdriveLink(eventObj, firstTime) {
    var x_offset = 10; // unique for gdrive link
    var y_offset = 38; // unique for gdrive link

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingGdriveLink = task_g.selectAll("#gdrive_" + groupNum);
    if(existingGdriveLink[0].length == 0){ // first time
        task_g.append("text")
            .text("Upload")
            .attr("style", "cursor:pointer; text-decoration:underline; text-decoration:bold;")
            .attr("class", "gdrive_link")
            .attr("id", function(d) {return "gdrive_" + d.groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset})
            .attr("fill", "blue")
            .attr("font-size", "12px");

        // open gdrive upon click
        $("#gdrive_" + groupNum).on('click', function(ev){
            ev.stopPropagation();
            
            if (flashTeamsJSON["events"][groupNum-1].gdrive.length > 0){
                window.open(flashTeamsJSON["events"][groupNum-1].gdrive[1])
            }
            else{
                alert("The flash team must be running for you to upload a file!");
            }
        });
    } else {
         task_g.selectAll(".gdrive_link")
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawHandoffBtn(eventObj, firstTime) {
     if(isUser || in_progress){
        return;
    }

    var x_offset = getWidth(eventObj)-18; // unique for handoff btn
    var y_offset = 40; // unique for handoff btn

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingHandoffBtn = task_g.selectAll("#handoff_btn_" + groupNum);
    if(existingHandoffBtn[0].length == 0){ // first time
        task_g.append("image")
            .attr("xlink:href", "/assets/rightArrow.png")
            .attr("class", "handoff_btn")
            .attr("id", function(d) {return "handoff_btn_" + d.groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("width", 16)
            .attr("height", 16)
            .attr("x", function(d) {return d.x+x_offset})
            .attr("y", function(d) {return d.y+y_offset})
            .on("click", startWriteHandoff);

    /*$("#handoff_btn_" + groupNum).popover({
        trigger: "click",
        html: true,
        class: "interactionPopover",
        style: "font-size: 8px",
        placement: "right",
        content: "Click another event to draw a handoff. <br>Click on this event to cancel.",
        container: $("#timeline-container")
    });
    
    $("#handoff_btn_" + groupNum).popover("show");
    $("#handoff_btn_" + groupNum).popover("hide");*/
    
    } else {
        task_g.selectAll(".handoff_btn")
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawCollabBtn(eventObj, firstTime) {
    if(isUser || in_progress){ return; }

    var x_offset = getWidth(eventObj)-38; // unique for collab btn
    var y_offset = 40; // unique for collab btn

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingCollabBtn = task_g.selectAll("#collab_btn_" + groupNum);
    if(existingCollabBtn[0].length == 0){ // first time
        task_g.append("image")
            .attr("xlink:href", "/assets/doubleArrow.png")
            .attr("class", "collab_btn")
            .attr("id", function(d) {return "collab_btn_" + d.groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("width", 16)
            .attr("height", 16)
            .attr("x", function(d) {return d.x+x_offset})
            .attr("y", function(d) {return d.y+y_offset})
            .on("click", startWriteCollaboration);

    /*$("#collab_btn_" + groupNum).popover({
        trigger: "click",
        html: true,
        class: "interactionPopover",
        style: "font-size: 8px",
        placement: "right",
        content: "Click another event to draw a collaboration. <br>Click on this event to cancel.",
        container: $("#timeline-container")
    });

    $("#collab_btn_" + groupNum).popover("show");
    $("#collab_btn_" + groupNum).popover("hide");*/
    
    } else {
        task_g.selectAll(".collab_btn")
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawMemberCircles(eventObj) {
    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    //Find out if first draw or redrawing
    for (var i=0; i<members.length; i++) {
        var existingMemCircle = task_g.selectAll("#event_" + groupNum + "_eventMemCircle_" + (i+1));
        var x_offset = 16 + (i*14); //unique for each member line
        var y_offset = 60;
        var member = getMemberById(members[i]);
        var color = member.color;

        if (existingMemCircle[0].length ==0) { //First time
            var name = member.name;

            task_g.append("circle")
                .attr("class", "member_circle")
                .attr("id", function(d) {
                    return "event_" + groupNum + "_eventMemCircle_" + (i+1);
                })
                .attr("groupNum", groupNum)
                .attr("r", 6)
                .attr("cx", function(d) {
                    return d.x + x_offset;
                })
                .attr("cy", function(d) {
                    return d.y + y_offset;
                })
                .attr("fill", color);
        
        } else { //Redrawing
            existingMemCircle
                .attr("cx", function(d) {return d.x + x_offset})
                .attr("cy", function(d) {return d.y + y_offset})
                .attr("fill", color);
        }
    }
};



// TODO: might have issues with redrawing
function drawShade(eventObj, firstTime) {
    if(current_user == undefined) {return;}

    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    // draw shade on main rect of this event
    //for each event it draws the shade. 
    //in doing so it takes its array of members FOR THAT EVENT
    //for each member for that event it gets their ID
    //if they are the CURRENT member
    for (var i=0; i<members.length; i++) {
        var member_id = members[i];
        //var idx = getMemberIndexFromName(member["name"]);
        //debugger;
        if (current_user.id == member_id){
            if (currentUserIds.indexOf(groupNum) < 0){
                currentUserIds.push(groupNum);
                currentUserEvents.push(eventObj);
            }

            task_g.selectAll("#rect_" + groupNum)
                .attr("fill", color)
                .attr("fill-opacity", .4);

            break;
        }
    }

    if (currentUserEvents.length > 0){
        currentUserEvents = currentUserEvents.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});
        upcomingEvent = currentUserEvents[0].id; 
        task_g.selectAll("#rect_" + upcomingEvent)
            .attr("fill", color)
            .attr("fill-opacity", .9);  
    }
}

function drawEachHandoffForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    for (var i = 0; i < interactions.length; i++){
        var inter = interactions[i];
        var draw = false;
        if (inter["type"] == "handoff"){
            if (inter["event1"] == eventObj["id"]){
                draw = true;
                var ev1 = eventObj;
                var ev2 = flashTeamsJSON["events"][getEventJSONIndex(inter["event2"])];
            }
            else if (inter["event2"] == eventObj["id"]){
                draw = true;
                var ev1 = flashTeamsJSON["events"][getEventJSONIndex(inter["event1"])];
                var ev2 = eventObj;
            }  
            if (draw){
                //Reposition an existing handoff
                var x1 = handoffStart(ev1);
                var y1 = ev1.y + 50;
                var x2 = ev2.x + 3;
                var y2 = ev2.y + 50;
                $("#interaction_" + inter["id"])
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("d", function(d) {
                        var dx = x1 - x2,
                        dy = y1 - y2,
                        dr = Math.sqrt(dx * dx + dy * dy);
                        //For ref: http://stackoverflow.com/questions/13455510/curved-line-on-d3-force-directed-tree
                        return "M " + x1 + "," + y1 + "\n A " + dr + ", " + dr 
                        + " 0 0,0 " + x2 + "," + (y2+15); 
                    });
            }
        }
    }
}

function drawEachCollabForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    for (var i = 0; i < interactions.length; i++){
        var inter = interactions[i];
        var draw;
        if (inter["type"] == "collaboration"){
            if (inter["event1"] == eventObj["id"]){
                draw = true;
                var ev1 = eventObj;
                var ev2 = flashTeamsJSON["events"][getEventJSONIndex(inter["event2"])];
            }
            else if (inter["event2"] == eventObj["id"]){
                draw = true;
                var ev1 = flashTeamsJSON["events"][getEventJSONIndex(inter["event1"])];
                var ev2 = eventObj;
            }
            if (draw){
                /*var existingInter = timeline_svg.selectAll("#interaction_" + inter["id"]);
                if(existingInter[0].length == 0){ // first time
                    //Alexandra - I'm not convinced this ever get called? 
                    var handoffData = {"event1":inter["event1"], "event2":inter["event2"], 
                        "type":"handoff", "description":"", "id":inter["id"]};
                    drawHandoff(handoffData);
                } else {*/
                    //Reposition existing collaboration
                    var y1 = ev1.y + 17;
                    var x1 = ev1.x + 3;
                    var x2 = ev2.x + 3;
                    var y2 = ev2.y + 17;
                    var firstTaskY = 0;
                    var taskDistance = 0;
                    var overlap = eventsOverlap(ev1.x, getWidth(ev1), ev2.x, getWidth(ev2));
                    if (y1 < y2) {
                        firstTaskY = y1 + 90;
                        taskDistance = y2 - firstTaskY;
                    } else {
                        firstTaskY = y2 + 90;
                        taskDistance = y1 - firstTaskY;
                    }
                    if (x1 <= x2) var startX = x2;
                    else var startX = x1;
                    $("#interaction_" + inter["id"])
                        .attr("x", startX)
                        .attr("y", firstTaskY)
                        .attr("height", taskDistance)
                        .attr("width", overlap);
                /*}*/
            }
        }
    }

}

//Creates graphical elements from array of data (task_rectangles)
function drawEvent(eventObj) { 
    //console.log("redrawing event");
    drawG(eventObj);
    drawMainRect(eventObj);
    drawRightDragBar(eventObj);
    drawLeftDragBar(eventObj);
    drawTitleText(eventObj);
    drawDurationText(eventObj);
    drawGdriveLink(eventObj);
    drawHandoffBtn(eventObj);
    drawCollabBtn(eventObj);
    drawMemberCircles(eventObj);
    drawShade(eventObj);
    drawEachHandoffForEvent(eventObj);
    drawEachCollabForEvent(eventObj);
};


//Draw a triangular hiring event on the timeline
function drawHiringEvent() {
    drawHiringRect();
    //NOT DONE

    
}

function drawAllPopovers() {
    var events = flashTeamsJSON["events"];
    for (var i = 0; i < events.length; i++){
        var ev = events[i];
        drawPopover(ev, true, false);
    }
};


function removeAllMemberCircles(eventObj){
    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    for(var i=0;i<members.length;i++){
        task_g.selectAll("#event_" + groupNum + "_eventMemCircle_" + (i+1)).remove();
    }
};

function renderAllMemberCircles() {
    var events = flashTeamsJSON["events"];
    for (var i = 0; i < events.length; i++){
        var ev = events[i];
        drawMemberCircles(ev);
    }
};

// deprecated
//Add one of the team members to an event, includes a bar to represent it on the task rectangle
//and a pill in the popover that can be deleted, both of the specified color of the member
function addEventMember(eventId, memberIndex) {
    // get details from members array
    var memberName = flashTeamsJSON["members"][memberIndex].role;
    var memberUniq = flashTeamsJSON["members"][memberIndex].uniq;
    var memberColor = flashTeamsJSON["members"][memberIndex].color;

    // get event
    var indexOfEvent = getEventJSONIndex(eventId);

    // add member to event
    flashTeamsJSON["events"][indexOfEvent].members.push({name: memberName, uniq: memberUniq, color: memberColor});

    // render on events
    renderAllMemberCircles();
}

//Remove a team member from an event
function deleteEventMember(eventId, memberNum, memberName) {
    //Delete the line
    $("#event_" + eventId + "_eventMemLine_" + memberNum).remove();
    if (memberNum == current){
         $("#rect_" + eventId).attr("fill", "#C9C9C9")
     }

    //Update the JSON
    var indexOfJSON = getEventJSONIndex(eventId);
    for (i = 0; i < flashTeamsJSON["events"][indexOfJSON].members.length; i++) {
        if (flashTeamsJSON["events"][indexOfJSON].members[i]["name"] == memberName) {
            flashTeamsJSON["events"][indexOfJSON].members.splice(i, 1);
            //START HERE IF YOU WANT TO SHIFT UP MEMBER LINES AFTER DELETION
            break;
        }
    }
}

//shows an alert asking the user to confirm that they want to delete an event
function confirmDeleteEvent(eventId) {

    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Delete Event?";

    var indexOfJSON = getEventJSONIndex(eventId);
    var events = flashTeamsJSON["events"];
    var eventToDelete = events[indexOfJSON];

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "<b>Are you sure you want to delete " + eventToDelete["title"] + "?</b><br><font size = '2'>Deleting an event will permanently delete all its data, handoffs, and collaborations.</font>";

    var deleteButton = document.getElementById("confirmButton");
    deleteButton.innerHTML = "Delete event";
    $("#confirmButton").attr("class","btn btn-danger");

    $('#confirmAction').modal('show');
    

    //Calls deleteEvent function if user confirms the delete
    document.getElementById("confirmButton").onclick=function(){deleteEvent(eventId)};
}


// first updates the event object array and interactions array
// then, calls removeTask to remove the task from the timeline
function deleteEvent(eventId){

    $('#confirmAction').modal('hide');

	var indexOfJSON = getEventJSONIndex(eventId);
	var events = flashTeamsJSON["events"];
		
	events.splice(indexOfJSON, 1);
    //console.log("event deleted from json");
    
    //stores the ids of all of the interactions to erase
    var intersToDel = [];
    
    for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            var inter = flashTeamsJSON["interactions"][i];
            if (inter.event1 == eventId || inter.event2 == eventId) {
                intersToDel.push(inter.id);
                //console.log("# of intersToDel: " + intersToDel.length);
            }
        }
      
    for (var i = 0; i < intersToDel.length; i++) {
        // take it out of interactions array
        var intId = intersToDel[i];
        var indexOfJSON = getIntJSONIndex(intId);
        flashTeamsJSON["interactions"].splice(indexOfJSON, 1);

        // remove from timeline
    	deleteInteraction(intId);
    }

    removeTask(eventId);
    
    updateStatus(false);
}

//CODE ON HOLD
//Draw the hiring event main rect for the hiring events
/*function drawHiringRect() {
    //START HERE

    var width = RECTANGLE_HEIGHT * 2; //default 2 hours

    var existingHireRect = task_g.selectAll("#hire_rect_" + groupNum);
    if(existingMainRect[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "hire_rect")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("id", function(d) {
                return "hire_rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum;})
            .attr("height", HIRING_HEIGHT)
            .attr("width", width)
            .attr("fill", "#C9C9C9")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A")
            .attr('pointer-events', 'all')
            .call(drag);
    } else {
        task_g.selectAll(".task_rectangle")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("width", width);
    }
}*/


//This function is used to truncate the event title string since html tags cannot be attached to svg
String.prototype.trunc = String.prototype.trunc ||
      function(n){
         // return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
/* Members.js
 * ---------------------------------
 *
 */


 var memberCounter = undefined;
 var colorToChange = "#ff0000";
 var current = undefined;
 var isUser = false;
 var memberType; 

//WARNING: This has to be called once, and before any of the other colorBox functions!
function colorBox() {
    colorBox.colors = ["#00ffff","#f0ffff","#f5f5dc","#000000","#0000ff","#a52a2a","#00ffff",
    "#00008b","#008b8b","#a9a9a9","#006400","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc",
    "#8b0000","#e9967a","#9400d3","#ff00ff","#ffd700","#008000","#4b0082","#f0e68c","#add8e6",
    "#e0ffff","#90ee90","#d3d3d3","#ffb6c1","#ffffe0","#00ff00","#ff00ff","#800000","#000080",
    "#808000","#ffa500","#ffc0cb","#800080","#800080","#ff0000","#c0c0c0","#ffff00"];
    for (var i = 0; i < flashTeamsJSON.members.length; i++){
        var ind = $.inArray(flashTeamsJSON.members[i].color, colorBox.colors);
        if (ind != 0) { //if found, remove from possible colors array
            colorBox.colors.splice(ind,1);
        }
    }
}

//grabColor returns a hex code not currently used by any member
colorBox.grabColor = function() {
    var ind = Math.floor(Math.random()*colorBox.colors.length);
    var color = colorBox.colors[ind];
    colorBox.colors.splice(ind,1);
    return color;
};

//replaceColor adds a color back into possible space
colorBox.replaceColor = function(color) {
    colorBox.colors.push(color);
};

 function renderMembersRequester() {
    var members = flashTeamsJSON.members;
    renderPills(members);
    renderMemberPopovers(members);
    renderDiagram(members);
    renderAllMemberCircles();
};

function renderMembersUser() {
    var members = flashTeamsJSON.members;
    renderAllMemberCircles();
};

function setCurrentMember() {
    var uniq = getParameterByName('uniq');
    //console.log("THIS IS THE CURRENT UNIQ VALUE", uniq);
    
    if (uniq){
        $("#uniq").value = uniq;
        flash_team_members = flashTeamsJSON["members"];
        //console.log(flash_team_members[0].uniq);
        for(var i=0;i<flash_team_members.length;i++){            
            if (flash_team_members[i].uniq == uniq){
                current = flash_team_members[i].id;
                current_user = flash_team_members[i];
                isUser = true;
                memberType = flash_team_members[i].type;
            }
        }
    } else {
        current = undefined;
        isUser = false;
        memberType = "author";
    }
};


function renderPills(members) {
    $("#memberPills").html("");
    for (var i=0;i<members.length;i++){
        var member = members[i];
        var member_id = member.id;
        var member_name = member.role;
        var member_color = member.color;
        $("#memberPills").append('<li class="active pill' + member_id + '" id="mPill_' + member_id + '""><a>' + member_name 
            + '<div class="close" onclick="confirmDeleteMember(' + member_id + '); updateStatus(false);">  X</div></a></li>');

        renderMemberPillColor(member_id);
    }
};


function renderMemberPopovers(members) {
    var len = members.length;
    for (var i=0;i<len;i++){
        var member = members[i];
        var member_id = member.id;
        var member_name = member.role;
        var invitation_link = member.invitation_link;
        var member_type = member.type; 
        
        if(member_type==undefined){
	        member_type = "worker";
        }
        
        //console.log("member_id: " + member_id + " member_type: " + member_type);

        var content = '<form name="memberForm_' + member_id + '>'
        +'<div class="mForm_' + member_id + '">'
        +'<div class="input-append" > ' 
        +'<select class="category1Input" id="member' + member_id + '_category1">';

        var newColor = "'"+member.color+"'";

        var category1 = member.category1;
        var category2 = member.category2;
       
        
        // add the drop-down for two-tiered oDesk job posting categories on popover
        for (var key in oDeskCategories) {
            //console.log("category1");
            var option = document.createElement("option");
            if(key == category1){
                content += '<option value="' + key + '" selected>' + key + '</option>';
            } else {
                content += '<option value="' + key + '">' + key + '</option>';
            }
        }

        //reload or build category2 based on previously selected category 1
        content += '</select>';

        if (category1 == "--oDesk Category--" || category1 == ""){
            content += '<br><br><select class="category2Input" id="member' + member_id + '_category2" disabled="disabled">--oDesk Sub-Category--</select>';
        } else{

            content += '<br><br><select class="category2Input" id="member' + member_id + '_category2">'
            for (var j=0; j<oDeskCategories[category1].length; j++) {
                //console.log("category2");
                var key2 = oDeskCategories[category1][j];

                var option = document.createElement("option");
                if(key2 == category2){
                    content += '<option value="' + key2 + '" selected>' + key2 + '</option>';
                }
                else
                    content += '<option value="' + key2 + '">' + key2 + '</option>';
            }
            content += '</select>';
        }
        
        

        content += '<br><br><input class="skillInput" id="addSkillInput_' + member_id + '" type="text" data-provide="typeahead" placeholder="New oDesk Skill" />'
        +'<button class="btn" type="button" class="addSkillButton" id="addSkillButton_' + member_id + '" onclick="addSkill(' + member_id + ');">+</button>'
        +'</div>'
        +'<br>Skills:'  
        +'<ul class="nav nav-pills" id="skillPills_' + member_id + '">';

        var skills_len = member.skills.length;
        for(var j=0;j<skills_len;j++){
            var memberSkillNumber = j+1;
            var skillName = member.skills[j];
            content+='<li class="active" id="sPill_mem' + member_id + '_skill' + memberSkillNumber + '"><a>' + skillName 
            + '<div class="close" onclick="deleteSkill(' + member_id + ', ' + memberSkillNumber + ', &#39' + skillName + '&#39)">  X</div></a></li>';
        }

        content +='</ul>';
        
		content += 'Member Type: <select name="membertype" id="member' + member_id + '_type">';
		
		if(member_type == "worker"){
        	content += '<option value="worker" selected>Worker</option>';
        } else{
            content += '<option value="worker">Worker</option>';
        }
        
        if(member_type == "pc"){
        	content += '<option value="pc" selected>Project Coordinator</option>';
        } else{
            content += '<option value="pc">Project Coordinator </option>';
        }
        
        if(member_type == "client"){
        	content += '<option value="client" selected>Client</option>';
        } else{
            content += '<option value="client">Client</option>';
        }
                    
        content += '</select><br />';

        content += 'Member Color: <input type="text" class="full-spectrum" id="color_' + member_id + '"/>'
        +'<p><script type="text/javascript"> initializeColorPicker(' + newColor +'); </script></p>'

         +'<p><button class="btn btn-success" type="button" onclick="saveMemberInfo(' + member_id + '); updateStatus();">Save</button>      '
         +'<button class="btn btn-danger" type="button" onclick="confirmDeleteMember(' + member_id + ');">Delete</button>     '
         +'<button class="btn btn-default" type="button" onclick="confirmReplaceMember(' + member_id + '); updateStatus();">Replace</button>     '
         +'<button class="btn btn-default" type="button" onclick="hideMemberPopover(' + member_id + ');">Cancel</button><br><br>'
         
        + 'Invitation link: <a id="invitation_link_' + member_id + '" href="' + invitation_link + '" target="_blank">'
        + invitation_link
        + '</a>'
        +'</p></form>' 
        +'</div>';
        
        $("#mPill_" + member_id).popover('destroy');

        $("#mPill_" + member_id).popover({
            placement: "right",
            html: "true",
            class: "member",
            id: '"memberPopover' + member_id + '"',
            trigger: "click",
            title: '<div data-pk="' + member_id + '" class="popover-mname">' + member_name + '</div><a href="#" class="edit-mname"><i class="icon-pencil"></i></a>',
            content:  content,
            container: $("#member-container"),
            callback: function(){
               //$("#member" + member_id + "_type").val(member_type);
               $(".skillInput").each(function () {
                $(this).typeahead({source: oSkills})
            });  
           }
       });
       
        $("#mPill_" + member_id).off('click', generateMemberPillClickHandlerFunction(member_id));
        $("#mPill_" + member_id).on('click', generateMemberPillClickHandlerFunction(member_id));

        // append oDesk Skills input to popover
        $(document).ready(function() {
            pressEnterKeyToSubmit("#addSkillInput_" + member_id, "#addSkillButton_" + member_id);
        });
    }
};

function generateMemberPillClickHandlerFunction(mem_id) {
    return function() {
        memberPillClick(mem_id);
    };
}

function generateMemberCategoryChangeFunction(mem_id) {
    return function() {
        memberCategoryChange(mem_id);
    }
}

function memberPillClick(mem_id) {
    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
        var idNum = flashTeamsJSON["members"][i].id;
        if (idNum == mem_id) continue;
        $("#mPill_"+idNum).popover('hide');
    }
    $("#member" + mem_id + "_category1").off('change', generateMemberCategoryChangeFunction(mem_id));
    $("#member" + mem_id + "_category1").on('change', generateMemberCategoryChangeFunction(mem_id));
}

function memberCategoryChange(mem_id) {
    if ($("#member" + mem_id + "_category1").value === "--oDesk Category--") {
        $("#member" + mem_id + "_category2").attr("disabled", "disabled");
    } else {
        $("#member" + mem_id + "_category2").removeAttr("disabled");
        $("#member" + mem_id + "_category2").empty();

        var category1Select = document.getElementById("member" + mem_id + "_category1");
        var category1Name = category1Select.options[category1Select.selectedIndex].value;

        for (var j = 0; j < oDeskCategories[category1Name].length; j++) {
            var option = document.createElement("option");
            $("#member" + mem_id + "_category2").append("<option>" + oDeskCategories[category1Name][j] + "</option>");
        }
    }
}

function renderDiagram(members) {
    removeAllMemberNodes();
    for (var i=0;i<members.length;i++){
        var member = members[i];
        addMemberNode(member.role, member.id, "#808080");
    }
};

function newMemberObject(memberName) {
    if (memberCounter == undefined) {
        memberCounter = initializeMemberCounter();
    }
    memberCounter++;
    var color = colorBox.grabColor();
    return {"role":memberName, "id": memberCounter, "color":color, "skills":[], "category1":"", "category2":""};
};

function addMember() {
    // retrieve member role
    var member_name = $("#addMemberInput").val();
    if (member_name === "") {
        alert("Please enter a member role.");
        return;
    }

    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
        var idNum = flashTeamsJSON["members"][i].id;
        $("#mPill_"+idNum).popover('hide');
    }

    // clear input
    $("#addMemberInput").val(this.placeholder);

    // add member to json
    var members = flashTeamsJSON.members;
    var member_obj = newMemberObject(member_name);
    members.push(member_obj);

    //update event popovers to show the new member
    var events = flashTeamsJSON.events;
    for(var i=0;i<events.length;i++){
       drawPopover(events[i], true, false);
    }

   renderPills(members);
   renderMemberPopovers(members);

   updateStatus(false);

   inviteMember(member_obj.id);
};


//Adds a needed skill to a member and updates JSON
function addSkill(memberId) {
    var skillName = $("#addSkillInput_" + memberId).val();
    if (skillName == "" || oSkills.indexOf(skillName) < 0) {
        alert("Not a valid oDesk skill");
        return;
    }

    //Update JSON
    var indexOfJSON = getMemberJSONIndex(memberId);
    flashTeamsJSON["members"][indexOfJSON].skills.push(skillName);

    var memberSkillNumber = flashTeamsJSON["members"][indexOfJSON].skills.length;
    $("#skillPills_" + memberId).append('<li class="active" id="sPill_mem' + memberId + '_skill' + memberSkillNumber + '"><a>' + skillName 
        + '<div class="close" onclick="deleteSkill(' + memberId + ', ' + memberSkillNumber + ', &#39' + skillName + '&#39)">  X</div></a></li>');
    $("#addSkillInput_" + memberId).val(this.placeholder);
};

function deleteSkill(memberId, pillId, skillName) {
    //Remove skill pill
    $("#sPill_mem" + memberId + '_skill' + pillId).remove();
    //Update JSON
    var indexOfJSON = getMemberJSONIndex(memberId);
    for (var i = 0; i < flashTeamsJSON["members"][indexOfJSON].skills.length; i++) {
        if (flashTeamsJSON["members"][indexOfJSON].skills[i] == skillName) {
            flashTeamsJSON["members"][indexOfJSON].skills.splice(i, 1);
            break;
        }
    }
};


//NOTE FROM DR: I THINK WE CAN ERASE THIS B/C THERE IS ANOTHER ONE BELOW WITH SAME EXACT NAME (BUT CHECK THAT CODE IS THE SAME)
//Saves info and updates popover, no need to update JSON, done by individual item elsewhere
/*
function saveMemberInfo(popId) {
    var indexOfJSON = getMemberJSONIndex(popId);

    flashTeamsJSON["members"][indexOfJSON].category1 = document.getElementById("member" + popId + "_category1").value;
    flashTeamsJSON["members"][indexOfJSON].category2 = document.getElementById("member" + popId + "_category2").value;
    
    flashTeamsJSON["members"][indexOfJSON].type = document.getElementById("member" + popId + "_type").value;

    var newColor = $("#color_" + popId).spectrum("get").toHexString();

    updateMemberPillColor(newColor, popId);
    renderMemberPillColor(popId);

    $("#mPill_" + popId).popover("hide");
    renderAllMemberLines();
    renderMemberPopovers(flashTeamsJSON["members"]);
};
*/


//Shows an alert asking to confirm delete member role
function confirmDeleteMember(pillId) {
    var indexOfJSON = getMemberJSONIndex(pillId);
    var members = flashTeamsJSON["members"];
    var memberToDelete = members[indexOfJSON].role;

    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Remove Member?";

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "<b>Are you sure you want to remove " + memberToDelete + " from " + flashTeamsJSON["title"]+ "? </b><br><font size = '2'>" 
                + memberToDelete + " will be removed from all events on the timeline. </font>";

    var deleteButton = document.getElementById("confirmButton");
    deleteButton.innerHTML = "Remove member";
    $("#confirmButton").attr("class","btn btn-danger");

    $('#confirmAction').modal('show');

    //Calls deleteMember function if user confirms the delete
    document.getElementById("confirmButton").onclick=function(){deleteMember(pillId)};

}


//Delete team member from team list, JSON, diagram, and events
function deleteMember(pillId) {
    $('#confirmAction').modal('hide');

    // remove from members array
    var indexOfJSON = getMemberJSONIndex(pillId);
    var members = flashTeamsJSON["members"];
    var memberId = members[indexOfJSON].id;
    //console.log("deleting member " + memberId);
    //console.log("clicked #mPill_", pillId);
    $("#mPill_" + memberId).popover('destroy');

    members.splice(indexOfJSON, 1);
    renderPills(members);
    renderMemberPopovers(members);

    // remove from members array with event object
    for(var i=0; i<flashTeamsJSON["events"].length; i++){
        var ev = flashTeamsJSON["events"][i];
        var member_event_index = ev.members.indexOf(memberId);
        
        // remove member
        if(member_event_index != -1){ // found member in the event
            removeAllMemberCircles(ev);
            ev.members.splice(member_event_index,1);
            drawEvent(ev,false);
        }

        //remove dri if the member was a dri
        if (ev.dri == String(memberId)){
            ev.dri = "";
        }
    }

    // update event popovers
    drawAllPopovers();

    updateStatus(false);

};

//Calling this one
//Saves info and updates popover, no need to update JSON, done by individual item elsewhere
function saveMemberInfo(popId) {
    var indexOfJSON = getMemberJSONIndex(popId);

    flashTeamsJSON["members"][indexOfJSON].category1 = document.getElementById("member" + popId + "_category1").value;
    flashTeamsJSON["members"][indexOfJSON].category2 = document.getElementById("member" + popId + "_category2").value;
    
    flashTeamsJSON["members"][indexOfJSON].type = document.getElementById("member" + popId + "_type").value;

    var newColor = $("#color_" + popId).spectrum("get").toHexString();

    updateMemberPillColor(newColor, popId);
    renderMemberPillColor(popId);
    //updateMemberPopover(popId);

    $("#mPill_" + popId).popover("hide");
    renderAllMemberCircles();
    renderMemberPopovers(flashTeamsJSON["members"]);
};

//Close the popover on a member to "cancel" the edit
function hideMemberPopover(memberId) {
    $("#mPill_" + memberId).popover("hide");
}

function inviteMember(pillId) {
    var flash_team_id = $("#flash_team_id").val();
    var url = '/members/' + flash_team_id + '/invite';
    var indexOfJSON = getMemberJSONIndex(pillId);
    var data = {uniq: flashTeamsJSON["members"][indexOfJSON].uniq};
    $.get(url, data, function(data){
        //console.log("INVITED MEMBER, NOT RERENDERING MEMBER POPOVER");
        var members = flashTeamsJSON["members"];
        members[indexOfJSON].uniq = data["uniq"];
        members[indexOfJSON].invitation_link = data["url"];

        renderMemberPopovers(members);
        updateStatus(false);
    });
};

function reInviteMember(pillId) {
    $('#confirmAction').modal('hide');

    var flash_team_id = $("#flash_team_id").val();
    var url = '/members/' + flash_team_id + '/reInvite';
    var indexOfJSON = getMemberJSONIndex(pillId);
    var uniq;
  
    var data = {uniq: flashTeamsJSON["members"][indexOfJSON].uniq };
    $.get(url, data, function(data){
        //console.log("INVITED MEMBER, NOT RERENDERING MEMBER POPOVER");
        var members = flashTeamsJSON["members"];
        members[indexOfJSON].uniq = data["uniq"];
        members[indexOfJSON].invitation_link = data["url"];
        flashTeamsJSON["members"] = members;
        //members[indexOfJSON].category1 = "";
        //members[indexOfJSON].category2 = "";
        //members[indexOfJSON].skills = [];



        renderMemberPopovers(members);
        updateStatus();
    });
};

function confirmReplaceMember(pillId) {
    var indexOfJSON = getMemberJSONIndex(pillId);
    var members = flashTeamsJSON["members"];
    var memberToReplace = members[indexOfJSON].role;

    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Replace Member?";

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "<b>Are you sure you want to replace " + memberToReplace + "? </b><br><font size = '2'>  The current " 
                + memberToReplace + " will no longer have access to " + flashTeamsJSON["title"] + " and you will need to hire a new " + memberToReplace + ".</font>";

    var deleteButton = document.getElementById("confirmButton");
    deleteButton.innerHTML = "Replace member";

    $('#confirmAction').modal('show');

    //Calls reInviteMember function if user confirms the replace
    document.getElementById("confirmButton").onclick=function(){reInviteMember(pillId)};

}

function renderMemberPillColor(memberId) {
    var indexOfJSON = getMemberJSONIndex(memberId);
    var color = flashTeamsJSON["members"][indexOfJSON].color;

    var pillLi = document.getElementById("mPill_" + memberId);
    pillLi.childNodes[0].style.backgroundColor = color;
};

//Takes the new color, turns into hex and changes background color of a pill list item
function updateMemberPillColor(color, memberId) {
    var indexOfJSON = getMemberJSONIndex(memberId);
    flashTeamsJSON["members"][indexOfJSON].color = color;

    updateStatus(false);
};

//Necessary to save member popover information
function updateMemberPopover(idNum) {
    $("#mPill_" + idNum).data('popover').options.content = "";
};

//Draws the color picker on a member popover
function initializeColorPicker(newColor) {

    $(".full-spectrum").spectrum({
        showPaletteOnly: true,
        showPalette: true,
        color: newColor,
        palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"], 
        ["rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(100, 196, 100)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"],
        ["rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(0, 168, 0)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"],
        ["rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)",  "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ],
        change: function(color) {
            colorToChange = color.toHexString();
        }
    });
}

function initializeMemberCounter() {
    if (flashTeamsJSON["members"].length == 0) return 0; 
    else {
        var highestId = 0;
        for (i = 0; i < flashTeamsJSON["members"].length; i++) {
            if (flashTeamsJSON["members"][i].id > highestId) {
                highestId = flashTeamsJSON["members"][i].id;
            }
        }
        return highestId;
    }
}

//Find the index of a member in the JSON object "members" array by using unique id
function getMemberJSONIndex(idNum) {
    for (var i = 0; i < flashTeamsJSON["members"].length; i++) {
        if (parseInt(flashTeamsJSON["members"][i].id) == parseInt(idNum)) return i; 
    }
    return -1;
};

function getMemberById(id) {
    var idx = getMemberJSONIndex(id);
    if(idx != -1){
        return flashTeamsJSON["members"][idx];
    }
    return null;
};

function searchById (arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return i;
        }
    }
};

$(document).ready(function() {
    pressEnterKeyToSubmit("#addMemberInput", "#addMemberButton");
});

$(document).on('click', '.edit-mname', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var target = $(this).parent().find('.popover-mname')[0];
    $(target).editable({
        mode: 'inline',
        success: function(response, newValue) { //Value has changed, check clicked
            updateRoleName($(target).attr('data-pk'), newValue);

            $(target).editable('destroy');
            renderMemberPopovers(flashTeamsJSON["members"]);
        }
    });
    //Remove the editable-click attribute so no underline when you don't change the name
    $(target).removeClass("editable-click");
    $(target).editable('toggle');
});

function updateRoleName(id, newValue) {
    $.each(flashTeamsJSON['members'], function(index, value) {
        if (value['id'] == id) {
            flashTeamsJSON['members'][index]['role'] = newValue;
            updateStatus(false);
            drawAllPopovers();
            return false;
        }
    });
    $('.memberPillName').each(function() {
        if ($(this).attr('data-pk') == id) {
            $(this).html(newValue);
            return false;
        }
    });
}

//Populate the autocomplete function for the event members
//TO BE DELETED, WILL BE CHANGING TO A CHECKBOX SYSTEM
function addMemAuto() {
    var memberArray = new Array(flashTeamsJSON["members"].length);
    for (i = 0; i < flashTeamsJSON["members"].length; i++) {
        memberArray[i] = flashTeamsJSON["members"][i].role;
    }

    $(".eventMemberInput").each(function() {
        $(this).autocomplete({
            source: memberArray
        });
    })
};
/* popovers.js
 * ---------------------------------------------
 * Code that manages the popovers
 * Drawing them on first event create/drop, update events on timeline
 * when new information added including: duration, event members, etc.
 */

// Quick hack that allows popovers to take callback functions
var tmp = $.fn.popover.Constructor.prototype.show; 
$.fn.popover.Constructor.prototype.show = function () { 
    tmp.call(this); 
    if (this.options.callback) { 
        this.options.callback(); 
    } 
};

/*
 * Input(s): 
 * eventObj - event object taken from the events array within the flashTeamsJSON object
 * 
 * Output(s):
 * an object that contains all info necessary to render an 'editable' popover
 */
function editablePopoverObj(eventObj) {
    var totalMinutes = eventObj["duration"];
    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
    var outputs = eventObj["outputs"];
    if(!outputs) outputs = "";
    var numHours = Math.floor(totalMinutes/60);
    var minutesLeft = totalMinutes%60;
    var dri_id = eventObj.dri;
    
    var obj = {
        placement: "right",
        html: "true",
        class: "eventPopover",
        id: '"popover' + groupNum + '"',
        trigger: "manual",
        title: '<input type ="text" name="eventName" id="eventName_' + groupNum 
            + '" placeholder="'+title+'" >',
        content: '<div class="event-popover-table">' 
        + '<form name="eventForm_' + groupNum + '">' 
        + '<div class="event-table-wrapper">'
        + '<b>Event Start:</b> <br>' 
        + 'Hours: <input type="number" id="startHr_' + groupNum + '" placeholder="' + startHr 
            + '" min="0" style="width:35px">         ' 
        + 'Minutes: <input type="number" id="startMin_' + groupNum + '" placeholder="' + startMin 
            + '" min="0" step="15" max="45" style="width:35px"><br />'
        + '<b>Total Runtime: </b> <br />' 
        + 'Hours: <input type = "number" id="hours_' + groupNum + '" placeholder="'
            +numHours+'" min="0" style="width:35px"/>         ' 
        + 'Minutes: <input type = "number" id = "minutes_' + groupNum + '" placeholder="'+minutesLeft
            +'" style="width:35px" min="0" step="15" max="45"/> <br />'
        + '<b>Members</b><br /> <div id="event' + groupNum + 'memberList">'
            + writeEventMembers(eventObj)  +'</div>'
        + '<b>Directly-Responsible Individual</b><br><select class="driInput"' 
            +' name="driName" id="driEvent_' + groupNum + '"' 
			+ 'onchange="getDRI('+groupNum + ')">'+ writeDRIMembers(groupNum,dri_id) +'</select>'
        + '<br /><b>Notes: </br></b><textarea rows="3" id="notes_' + groupNum + '">' + notes + '</textarea>'
        + '<div><input type="text" value="' + inputs + '" placeholder="Add input" id="inputs_' + groupNum + '" /></div>'
        + '<div><input type="text" value="' + outputs + '" placeholder="Add output" id="outputs_' + groupNum + '" /></div></div>'
        + '<div class="event-table-row event-table-footer">' 

        + '<button class="btn btn-success" type="button" id="save"'
        	+' onclick="saveEventInfo(' + groupNum + '); hidePopover(' + groupNum + ')">Save</button>       '  
        + '<button type="button" class="btn btn-danger" id="delete"'
            +' onclick="confirmDeleteEvent(' + groupNum +');">Delete</button>       ' 
		+ '<a id="cancel" style="float: right; line-height: 20px; padding-top: 4px; padding-bottom: 4px; margin-top: 2px;" onclick="hidePopover(' + groupNum + ');">Cancel</a>'       
        + '</div>'
        + '</form></div>',
        container: $("#timeline-container"),
        callback: function() {
            //$("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
            $("#inputs_" + groupNum).tagsinput();
            $("#outputs_" + groupNum).tagsinput();
        }
    };

    return obj;
};


/*
 * Input(s): 
 * eventObj - event object taken from the events array within the flashTeamsJSON object
 * 
 * Output(s):
 * an object that contains all info necessary to render an 'editable' popover
 */
function readOnlyPopoverObj(ev) {
    var groupNum = ev.id;
    var hrs = Math.floor(ev.duration/60);
    var mins = ev.duration % 60;

    var content = '<b>Event Start:</b><br>'
        + ev.startHr + ':'
        + ev.startMin.toFixed(0) + '<br>'
        +'<b>Total Runtime: </b><br>' 
        + hrs + ' hrs ' + mins + ' mins<br>';

    if(ev.inputs) {
        content += '<b>Inputs:</b><br>';
        var inputs = ev.inputs.split(",");
        for(var i=0;i<inputs.length;i++){
            content += inputs[i];
            content += "<br>";
        }
    }
    
    if(ev.outputs) {
        content += '<b>Outputs:</b><br>';
        var outputs = ev.outputs.split(",");
        for(var i=0;i<outputs.length;i++){
            content += outputs[i];
            content += "<br>";
        }
    }

    var num_members = ev.members.length;
    if(num_members > 0){
        content += '<b>Members:</b><br>';
        for (var j=0;j<num_members;j++){
            var member = getMemberById(ev.members[j]);
            content += member.role;
            content += '<br>';
        }
    }

     if (ev.dri != "" && ev.dri != undefined){
        var dri_id = parseInt (ev.dri);
        var mem = null;

        for (var i = 0; i<flashTeamsJSON["members"].length; i++){
           
            if(flashTeamsJSON["members"][i].id == dri_id){
                mem = flashTeamsJSON["members"][i].role;
                break;
            }
        }

        if(mem && mem != undefined){
            content += '<b>Directly-Responsible Individual:</b><br>';
            content += mem;
            content += '<br>';
        }
    }
    
    if (ev.content != ""){
        content += '<b>Notes:</b><br>';
        content += ev.notes;
        content += '<br>';
    }

    content += '<br><form><button type="button" class="btn btn-success" id="complete_' + groupNum 
        + '" onclick="confirmCompleteTask(' + groupNum + ');">Complete</button>'
        + ' <button type="button" class="btn btn-default" id="ok"'
        +' onclick="hidePopover(' + groupNum + ');">Ok</button></form>';
    
    var obj = {
        title: ev.title,
        content: content,
        placement: "right",
        html: "true",
        class: "eventPopover",
        id: '"popover' + groupNum + '"',
        trigger: "manual",
        container: $("#timeline-container")
    };

    return obj;
}

/*
 * Draw popover on event.
 *
 * Input(s):
 * eventObj - event object taken from the events array within the flashTeamsJSON object
 * editable - boolean specifying whether to render an editable (true) or readonly (false) popover
 * show - boolean specifying whether to show the popover after rendering it
 *
 * Output(s):
 * None
 */

function drawPopover(eventObj, editable, show) {
   var groupNum = eventObj.id;
     // draw it
    var data = getPopoverDataFromGroupNum(groupNum); //SOMETHING WRONG, RETURNS UNDEFINED
    if(!data){ // popover not set yet
        if(editable){
            setPopoverOnTask(groupNum, editablePopoverObj(eventObj));
        } else {
            setPopoverOnTask(groupNum, readOnlyPopoverObj(eventObj));
        }
    } else { // update the popover's content
        var obj;
        if(editable){
            obj = editablePopoverObj(eventObj);
        } else {
            obj = readOnlyPopoverObj(eventObj);
        }
        data.options.title = obj["title"];
        data.options.content = obj["content"];
    }
    // show/hide it
    if(show){
        showPopover(groupNum);
    }
   
   // allow using return key to save and close the popover
    $(document).ready(function() {
        pressEnterKeyToSubmit("#eventMember_" + groupNum, "#addEventMember_" + groupNum);
    });
};

function updateAllPopoversToReadOnly() {
    for(var i=0;i<flashTeamsJSON.events.length;i++) {
        var ev = flashTeamsJSON.events[i];
        drawPopover(ev, false, false);
    }
};

var setPopoverOnTask = function(groupNum, obj){
    $(timeline_svg.selectAll("g#g_"+groupNum)[0][0]).popover(obj);
};

function hidePopover(popId){
    //console.log("hiding popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('hide');
    //overlayOff();
};

function showPopover(popId){
    //console.log("showing popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('show');
    //overlayOn();
};

function togglePopover(popId){
    //console.log("showing popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('toggle');
    //overlayOn();
};

function destroyPopover(popId){
    //console.log("destroying popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('destroy');
};

var getPopoverDataFromGroupNum = function(groupNum){
   //console.log($(timeline_svg.selectAll("g#g_"+groupNum)[0][0]).data);
   return $(timeline_svg.selectAll("g#g_"+groupNum)[0][0]).data('popover');
};
//Called when the user clicks save on an event popover, grabs new info from user and updates 
//both the info in the popover and the event rectangle graphics
function saveEventInfo (popId) {
    //Update title
    var newTitle = $("#eventName_" + popId).val();
    if (!newTitle == "") $("#title_text_" + popId).text(newTitle);
    else newTitle = $("#eventName_" + popId).attr("placeholder");

    //Get Start Time
    var startHour = $("#startHr_" + popId).val();    
    if (startHour == "") startHour = parseInt($("#startHr_" + popId).attr("placeholder"));
    var startMin = $("#startMin_" + popId).val();

    if (startMin == "") startMin = parseInt($("#startMin_" + popId).attr("placeholder"));
    //newX
    startHour = parseInt(startHour);
    startMin = parseInt(startMin);
    var newX = (startHour * 100) + (startMin/15*25);
    newX = newX - (newX%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;

    var eventNotes = $("#notes_" + popId).val();
    var driId = getDRI(popId);
   
    var indexOfJSON = getEventJSONIndex(popId);
    var ev = flashTeamsJSON["events"][indexOfJSON];

    removeAllMemberCircles(ev);
    //Update members of event
    flashTeamsJSON["events"][indexOfJSON].members = [];
    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
        var member = flashTeamsJSON["members"][i];
        var memberId = member.id;
        var checkbox = $("#event" + popId + "member" + i + "checkbox")[0];
        if (checkbox == undefined) continue;
        if (checkbox.checked == true) {
            ev.members.push(memberId); //Update JSON
        } 
    }

    //Update width
    var newHours = $("#hours_" + popId).val();
    var newMin = $("#minutes_" + popId).val();
    if (newHours == "") newHours = parseInt($("#hours_" + popId)[0].placeholder);
    if (newMin == "") newMin = parseInt($("#minutes_" + popId)[0].placeholder);
    newMin = Math.round(parseInt(newMin)/15) * 15;
    
    //cannot have events shorter than 30 minutes
    if (newHours == 0 && newMin == 15){
        newMin = 30;
    }
    var newWidth = (newHours * 100) + (newMin/15*25);
  
    //Update JSON
    var indexOfJSON = getEventJSONIndex(popId);
    ev.title = newTitle;
    ev.notes = eventNotes;
    ev.dri = driId;
    ev.startHr = parseInt(startHour);
    ev.startMin = Math.round(parseInt(startMin)/15) * 15;
    ev.startTime = ev.startHr*60 + ev.startMin;
    ev.duration = durationForWidth(newWidth);
    ev.x = newX;
    ev.inputs = $('#inputs_' + popId).val();
    ev.outputs = $('#outputs_' + popId).val();

    drawEvent(ev, 0);
    drawPopover(ev, true, false);
    
    updateStatus(false);
};

// Adds/updates the DRI dropdown on the event popover
function writeDRIMembers(idNum, driId){

	var indexOfJSON = getEventJSONIndex(idNum);
    var DRIString = '<option value="0">-- Choose DRI --</option>';
    var eventDRI = driId;
    
    // at some point change this to only members for that event (not all members in the flash team)
    if (flashTeamsJSON["members"].length == 0) return "No Team Members";
    for (i = 0; i<flashTeamsJSON["members"].length; i++) {
    			var memberName = flashTeamsJSON["members"][i].role;
				var memberId = flashTeamsJSON["members"][i].id;
				if (eventDRI == memberId){
					DRIString += '<option value="'+memberId+'"' + 'selected="selected">' + memberName + '</option>';
				}
				else{
					DRIString += '<option value="'+memberId+'">' + memberName + '</option>';
				}	   	           
    }
    return DRIString;
}

// returns the id of the selected DRI in the DRI dropdown menu on the event popover 
function getDRI(groupNum) {    
    var dri = document.getElementById("driEvent_" + groupNum);
    var driId;
   
    if (dri == null){
	     driId = 0;       
    }
    else{
	    var driId = dri.value;    
    }
    return driId;
}

//Adds member checkboxes onto the popover of an event, checks if a member is involved in event
function writeEventMembers(eventObj) {
    var memberString = "";
    var evMembers = eventObj.members;

    if (flashTeamsJSON["members"].length == 0) return "No Team Members";
    for (i = 0; i<flashTeamsJSON["members"].length; i++) {
        var memberSearchId = flashTeamsJSON["members"][i].id;
        var memberName = flashTeamsJSON["members"][i].role;
        var found = false;
        for (j = 0; j<evMembers.length; j++) {
            if (evMembers[j] == memberSearchId) {
                memberString += '<input type="checkbox" id="event' + eventObj["id"] + 'member' 
                    + i + 'checkbox" checked="true">' + memberName + "   <br>";
                found = true;
                break;
            }
        }
        if (!found) {
            memberString +=  '<input type="checkbox" id="event' + eventObj["id"] 
                + 'member' + i + 'checkbox">' + memberName + "   <br>"; 
        }      
    }
    return memberString;
};
/* helper.js
 * ---------------------------------
 * 
 */

//MAKE SURE THE JSON IS UPDATED IN ITS CURRENT VERSION EVERYWHERE
var flashTeamsJSON = {
    "title" : "New Flash Team",
    "id" : 1,
    "events": [],        //{"title", "id", "startTime", "duration", "notes", "members": [], "dri", "yPosition", inputs”:[], “outputs”:[]}
    "members": [],       //{"id", "role", "skills":[], "color", "category1", "category2"}
    "interactions" : [],  //{"event1", "event2", "type", "description", "id"}
    "author": "defaultAuthor",
    "original_status": "original status",
    "original_json": "original json"
};

function pressEnterKeyToSubmit(inputId, buttonId) {
	$(inputId).keydown(function(event){
		if(event.keyCode == 13){
			$(buttonId).click();
            return false;
		}
	});
}

//Find the total hours (duration) of the entire team
function findTotalHours() {
    var totalHours = 48; 
    for (i = 0; i < flashTeamsJSON["events"].length; i++) {
        var eventObj = flashTeamsJSON["events"][i];
        var eventStart = eventObj.startTime;
        var eventDuration = eventObj.duration;
        var eventEnd = eventStart + eventDuration;
        var hours = (eventEnd - (eventEnd%60))/60; 
        if (hours > totalHours) totalHours = hours;
    }
    //NOTE: the above cut off minutes past the hour, must add at least 1 extra hour to return val
    totalHours++; 
    return totalHours + 2; //THE 2 IS ARBITRARY FOR PADDING
}


//CALL IN CONSOLE TO HIDE THE CHAT BOX AND PROJECT STATUS
function hideAwareness() {
    var projCont = document.getElementById("project-status-container");
    projCont.style.display = "none";
    var chatCont = document.getElementById("chat-box-container");
    chatCont.style.display = "none";
}

function saveFlashTeam() {
	console.log("Saving flash team");
    
    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_json';
    $.ajax({
        url: url,
        type: 'post',
        data: {"flashTeamsJSON": flashTeamsJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        console.log("UPDATED FLASH TEAM JSON");
    });
}
;
(function() {
  "use strict";
  var Idle;

  Idle = {};

  Idle = (function() {
    Idle.isAway = false;

    Idle.awayTimeout = 3000;

    Idle.awayTimestamp = 0;

    Idle.awayTimer = null;

    Idle.onAway = null;

    Idle.onAwayBack = null;

    Idle.onVisible = null;

    Idle.onHidden = null;

    function Idle(options) {
      var activeMethod, activity;
      if (options) {
        this.awayTimeout = parseInt(options.awayTimeout, 10);
        this.onAway = options.onAway;
        this.onAwayBack = options.onAwayBack;
        this.onVisible = options.onVisible;
        this.onHidden = options.onHidden;
      }
      activity = this;
      activeMethod = function() {
        return activity.onActive();
      };
      window.onclick = activeMethod;
      window.onmousemove = activeMethod;
      window.onmouseenter = activeMethod;
      window.onkeydown = activeMethod;
      window.onscroll = activeMethod;
      window.onmousewheel = activeMethod;
      this.listener = (function() {
        return activity.handleVisibilityChange();
      });
    }

    Idle.prototype.onActive = function() {
      this.awayTimestamp = new Date().getTime() + this.awayTimeout;
      if (this.isAway) {
        if (this.onAwayBack) {
          this.onAwayBack();
        }
        this.start();
      }
      this.isAway = false;
      return true;
    };

    Idle.prototype.start = function() {
      var activity;
      document.addEventListener("visibilitychange", this.listener, false);
      document.addEventListener("webkitvisibilitychange", this.listener, false);
      document.addEventListener("msvisibilitychange", this.listener, false);
      this.awayTimestamp = new Date().getTime() + this.awayTimeout;
      if (this.awayTimer !== null) {
        clearTimeout(this.awayTimer);
      }
      activity = this;
      this.awayTimer = setTimeout((function() {
        return activity.checkAway();
      }), this.awayTimeout + 100);
      return this;
    };

    Idle.prototype.stop = function() {
      if (this.awayTimer !== null) {
        clearTimeout(this.awayTimer);
      }
      if (this.listener !== null) {
        document.removeEventListener("visibilitychange", this.listener);
        document.removeEventListener("webkitvisibilitychange", this.listener);
        document.removeEventListener("msvisibilitychange", this.listener);
      }
      return this;
    };

    Idle.prototype.setAwayTimeout = function(ms) {
      this.awayTimeout = parseInt(ms, 10);
      return this;
    };

    Idle.prototype.checkAway = function() {
      var activity, t;
      t = new Date().getTime();
      if (t < this.awayTimestamp) {
        this.isAway = false;
        activity = this;
        this.awayTimer = setTimeout((function() {
          return activity.checkAway();
        }), this.awayTimestamp - t + 100);
        return;
      }
      if (this.awayTimer !== null) {
        clearTimeout(this.awayTimer);
      }
      this.isAway = true;
      if (this.onAway) {
        return this.onAway();
      }
    };

    Idle.prototype.handleVisibilityChange = function() {
      if (document.hidden || document.msHidden || document.webkitHidden) {
        if (this.onHidden) {
          return this.onHidden();
        }
      } else {
        if (this.onVisible) {
          return this.onVisible();
        }
      }
    };

    return Idle;

  })();

  window.Idle = Idle;

}).call(this);
/* awareness.js
 * ---------------------------------------------
 * 
 */


var poll_interval = 5000; // 20 seconds
var poll_interval_id;
var timeline_interval = 10000; // "normal" speed timer is 30 minutes (1800000 milliseconds); fast timer is 10 seconds (10000 milliseconds)
var fire_interval = 180; // change back to 180
var numIntervals = parseFloat(timeline_interval)/parseFloat(fire_interval);
var increment = parseFloat(50)/parseFloat(numIntervals);
var curr_x_standard = 0;
var live_tasks = [];
var remaining_tasks = [];
var delayed_tasks = [];
var drawn_blue_tasks = [];
var completed_red_tasks = [];
var task_groups = [];
var loadedStatus;
var in_progress = false;
var delayed_tasks_time = [];
var dri_responded = [];
var project_status_handler;
var cursor = null;
var cursor_interval_id = null;
var cursor_interval_live = false;
var cursor_details;
var tracking_tasks_interval_id;
var user_poll = false;
var user_loaded_before_team_start = false;

var window_visibility_state = null;
var window_visibility_change = null;

$(document).ready(function(){
    addCursor();
    cursor = timeline_svg.select(".cursor");
    renderEverything(true);
});

var addCursor = function(){
    // time cursor in red
    timeline_svg.append("line")
        .attr("y1", 15)
        .attr("y2", SVG_HEIGHT-50)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("class", "cursor")
        .style("stroke", "red")
        .style("stroke-width", "2");
};

var getXCoordForTime = function(t){
    var numInt = parseInt(t / timeline_interval);
    var remainder = t % timeline_interval;
    var xCoordForRemainder = (remainder / timeline_interval) * 50;
    var xCoordForMainIntervals = 50*numInt;
    var finalX = parseFloat(xCoordForRemainder) + parseFloat(xCoordForMainIntervals);
    return {"finalX": finalX, "numInt": numInt};
};

function removeColabBtns(){
   var events = flashTeamsJSON["events"];
   for (var i = 0; i < events.length; i++){
        var eventObj = events[i];
        var groupNum = eventObj["id"];
        var task_g = getTaskGFromGroupNum(groupNum);
        task_g.selectAll(".collab_btn").attr("display","none");
    }
};

function removeHandoffBtns(){
    var events = flashTeamsJSON["events"];
   for (var i = 0; i < events.length; i++){
        var eventObj = events[i];
        var groupNum = eventObj["id"];
        var task_g = getTaskGFromGroupNum(groupNum);
        task_g.selectAll(".handoff_btn").attr("display","none");
    }

};

$("#flashTeamStartBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    bodyText.innerHTML = "Are you sure you want to begin running " + flashTeamsJSON["title"] + "?";
    
    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Start the team";
    
    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Start Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){startFlashTeam()};    
});

function startFlashTeam() {
    $('#confirmAction').modal('hide');
    // view changes
    $("#flashTeamStartBtn").attr("disabled", "disabled");
    $("#flashTeamStartBtn").css('display','none');
    $("#flashTeamEndBtn").css('display','');
    $("div#search-events-container").css('display','none');
    $("div#project-status-container").css('display','');
    $("div#chat-box-container").css('display','');
    $("#flashTeamTitle").css('display','none');
    console.log("here0");
    removeColabBtns();
    removeHandoffBtns();
    startTeam(true);
    
    //addAllFolders();
    //googleDriveLink();
}


function endTeam() {
    console.log("TEAM ENDED");
    $('#confirmAction').modal('hide');
    updateStatus(false);
    stopCursor();
    stopProjectStatus();
    stopPolling();
    stopTrackingTasks();
    $("#flashTeamEndBtn").attr("disabled", "disabled");
}

//Asks user to confirm that they want to end the team
$("#flashTeamEndBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    updateStatus();
    if ((live_tasks.length == 0) && (remaining_tasks.length == 0) && (delayed_tasks.length == 0)) {
        bodyText.innerHTML = "Are you sure you want to end " + flashTeamsJSON["title"] + "?";
    } else {
        //console.log("ENDED TEAM EARLY");
        //var progressRemaining = Math.round(100 - curr_status_width);
        bodyText.innerHTML = flashTeamsJSON["title"] + " is still in progress!  Are you sure you want to end the team?";
    }
    var confirmEndTeamBtn = document.getElementById("confirmButton");
    confirmEndTeamBtn.innerHTML = "End the team";
    $("#confirmButton").attr("class","btn btn-danger");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "End Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){endTeam()};
    

});


function stopPolling() {
    //console.log("STOPPED POLLING");
    window.clearInterval(poll_interval_id);
};

function stopTrackingTasks() {
    //console.log("STOPPED TRACKING TASKS");
    window.clearInterval(tracking_tasks_interval_id);
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var uniq = getParameterByName('uniq');
$("#uniq").value = uniq;

var chat_role;
var chat_name;

var presname; // name of user shown in the presence box
var currentStatus; //the status of the user shown in the presence box

// firstTime=true means page is reloaded
function renderEverything(firstTime) {
    colorBox();
    var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        // firstTime will also be true in the case that flashTeamEndedorStarted, so
        // we make sure that it is false (i.e. true firstTime, upon page reload for user
        // before the team starts)
        // !user_poll means a poll wasn't the one the generated this call to renderEverything
        //if(firstTime && !user_poll) // TODO: find better way to capture the case of user_poll
        if(firstTime){
            renderChatbox(); 
            renderProjectOverview(); //note: not sure if this goes here, depends on who sees the project overview (e.g., user and/or requester)
        }

        console.log("inside render everything"); 
            
        //get user name and user role for the chat
        if(data == null){
            console.log("RETURNING BEFORE LOAD"); 
            return; // status not set yet
        }

        loadedStatus = data;

        in_progress = loadedStatus.flash_team_in_progress;
        flashTeamsJSON = loadedStatus.flash_teams_json;

        if(firstTime) {
            setCurrentMember();
            initializeTimelineDuration();
            renderProjectOverview(); //note: not sure if this goes here, depends on who sees the project overview (e.g., user and/or requester)
        }


        // is this the user, and has he/she loaded the page
        // before the team started
        // is_user && firstTime && in_progress would be the case
        // where the user loads the page for the first time after
        // the team has started
        if(isUser) {
            // user loaded page before team started
            if (firstTime && !in_progress)
                user_loaded_before_team_start = true;
        }

        if(in_progress){
            colorBox();
            console.log("flash team in progress");
            $("#flashTeamStartBtn").attr("disabled", "disabled");
            $("#flashTeamStartBtn").css('display','none'); //not sure if this is necessary since it's above 
            $("#flashTeamEndBtn").css('display',''); //not sure if this is necessary since it's above 
            loadData();
            if(!isUser || memberType == "pc" || memberType == "client")
                renderMembersRequester();
            else
                renderMembersUser();
            renderMembersUser();
            //startTeam(firstTime);
        } else {
            console.log("flash team not in progress");
            
            if(flashTeamsJSON["startTime"] == undefined){
	            //console.log("NO START TIME!");
				updateOriginalStatus();
            }
            
            if(!flashTeamsJSON)
                return;
            
            // will only be run way at the beginning before any members or events are added
            // will only run in requester's page, because on members' pages, members array
            // length will be greater than zero
            if (flashTeamsJSON.events.length == 0 && flashTeamsJSON.members.length == 0){
                createNewFolder(flashTeamsJSON["title"]); // gdrive
            }
            loadData();
            
            if(!isUser || memberType == "pc" || memberType == "client") {
                renderMembersRequester();
            }
        }
    });

    if(firstTime) {
        poll_interval_id = poll();
        listenForVisibilityChange();
    }
}

function listenForVisibilityChange(){
    if (typeof document.hidden !== "undefined") {
        window_visibility_change = "visibilitychange";
        window_visibility_state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        window_visibility_change = "mozvisibilitychange";
        window_visibility_state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        window_visibility_change = "msvisibilitychange";
        window_visibility_state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        window_visibility_change = "webkitvisibilitychange";
        window_visibility_state = "webkitVisibilityState";
    }

    // Add a listener for the next time that the page becomes visible
    document.addEventListener(window_visibility_change, function() {
        var state = document[window_visibility_state];
        if(state == "visible" && in_progress){
            renderEverything(false);
        }
    }, false);
};  

// saves member object for current_user (undefined for author so we will set it to 'Author')
var current_user;

//finds user name and sets current variable to user's index in array
var renderChatbox = function(){
    var uniq_u=getParameterByName('uniq');
        
    var url2 = '/flash_teams/' + flash_team_id + '/get_user_name';
    $.ajax({
       url: url2,
       type: 'post',
       data : { "uniq" : String(uniq_u) }
    }).done(function(data){
       chat_name = data["user_name"];
       chat_role = data["user_role"];
       
       presname = chat_name;
	   currentStatus = "online ★";
	   
	   // current_user is undefined for author so just set it to 'Author' 
	   // when current_user is the author it won't have a uniq id so need to check for current_user == 'Author' instead
	   if(chat_role == 'Author'){
		   current_user = 'Author';
		   //console.log ("CURRENT USER AUTHOR: " + current_user);
		   
	   }

       if (chat_role == "" || chat_role == null){
         uniq_u2 = data["uniq"];
         
        
         flash_team_members = flashTeamsJSON["members"];
         //console.log(flash_team_members[0].uniq);
         for(var i=0;i<flash_team_members.length;i++){
            
            if (flash_team_members[i].uniq == uniq_u2){
              chat_role = flash_team_members[i].role; 
              current = i;
              current_user = flash_team_members[i];

              // here there once existed a call to boldEvents
              trackUpcomingEvent();
            }
         }
        
       }
       
       // Set our initial online status.
		setUserStatus(currentStatus);

       myDataRef.on('child_added', function(snapshot) {
                var message = snapshot.val();
                //console.log(snapshot);
                //console.log(message);
                //console.log("MESSAGE NAME: " + message["name"]);

                displayChatMessage(message.name, message.uniq, message.role, message.date, message.text);
                
                name = message.name;
            });
                   
    });
};

var flashTeamEndedorStarted = function(){
    if (loadedStatus.flash_team_in_progress == undefined){
        return false;
    }
    return in_progress != loadedStatus.flash_team_in_progress;
};

var flashTeamUpdated = function(){
    var updated_drawn_blue_tasks = loadedStatus.drawn_blue_tasks;
    var updated_completed_red_tasks = loadedStatus.completed_red_tasks;

    if (updated_drawn_blue_tasks.length != drawn_blue_tasks.length) {
        console.log("drawn_blue_tasks not same length");
        console.log(drawn_blue_tasks);
        console.log(updated_drawn_blue_tasks);
        return true;
    }
    if (updated_completed_red_tasks.length != completed_red_tasks.length) {
        console.log("completed_red_tasks not same length");
        console.log(completed_red_tasks);
        console.log(updated_completed_red_tasks);
        console.log(loadedStatus.live_tasks);
        console.log(loadedStatus.delayed_tasks);
        return true;
    }

    if(updated_drawn_blue_tasks.sort().join(',') !== drawn_blue_tasks.sort().join(',')){
        console.log("drawn_blue_tasks not same content");
        console.log(drawn_blue_tasks);
        console.log(updated_drawn_blue_tasks);
        return true;
    }

    if(updated_completed_red_tasks.sort().join(',') !== completed_red_tasks.sort().join(',')){
        console.log("completed_red_tasks not same content");
        console.log(completed_red_tasks);
        console.log(updated_completed_red_tasks);
        return true;
    }
    return false;
};

var poll = function(){
    //console.log("POLLING");
    return setInterval(function(){
        //console.log("MAKING POLL NOW...");
        var flash_team_id = $("#flash_team_id").val();
        var url = '/flash_teams/' + flash_team_id + '/get_status';
        $.ajax({
            url: url,
            type: 'get'
        }).done(function(data){
            if(data == null) return;
            loadedStatus = data;

            console.log("inside poll function");
            if(flashTeamEndedorStarted()) {
                //stopPolling();
                /*if(isUser) {
                    // to solve the case where the user already loaded the page
                    // and so already has the chatbox and has already started polling
                    user_poll = true;
                }
                renderEverything(true);
                */
                renderEverything(false);
            } else if (flashTeamUpdated()) {
                //stopPolling();
                console.log("FLASH TEAM UPDATED..CALLING renderEverything(FALSE)");
                renderEverything(false);
            } else {
                //console.log("Flash team not updated and not ended");
            }
        });
    }, poll_interval); // every 5 seconds currently
};

var recordStartTime = function(){
    flashTeamsJSON["startTime"] = (new Date).getTime();
    updateStatus(true);
};

var loadStatus = function(id){
    var loadedStatusJSON;
    var url = '/flash_teams/' + id.toString() + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        loadedStatusJSON = data;
        //console.log("loadedStatusJSON: " + loadedStatusJSON);
    });
    return JSON.parse(loadedStatusJSON);
};

var loadData = function(){
    // position cursor before getting the new task arrays
    // because once the new task arrays are updated,
    // trackLiveAndRemainingTasks is immediately going to
    // operate on them, while the current cursor here is
    // not yet where it should be in time (its behind)
    var latest_time;
    if (in_progress){
        latest_time = (new Date()).getTime();
    } else {
        latest_time = loadedStatus.latest_time; // really only useful at end
    }
   
    //Next line is commented out after disabling the ticker
   // cursor_details = positionCursor(flashTeamsJSON, latest_time);

    live_tasks = loadedStatus.live_tasks;
    remaining_tasks = loadedStatus.remaining_tasks;
    delayed_tasks = loadedStatus.delayed_tasks;
    drawn_blue_tasks = loadedStatus.drawn_blue_tasks;
    completed_red_tasks = loadedStatus.completed_red_tasks;

    load_statusBar(status_bar_timeline_interval);

    event_counter = flashTeamsJSON["events"].length;
    
    drawEvents(!in_progress);

    if(isUser){
        updateAllPopoversToReadOnly();  
    }
    drawBlueBoxes();
    drawRedBoxes();
    drawDelayedTasks();
    drawInteractions(); //START HERE, INT DEBUG
    googleDriveLink();
};

// user must call this startTeam(true, )
var startTeam = function(firstTime){
    console.log("STARTING TEAM");
    console.log("here1");
    if(!in_progress) {
        //flashTeamsJSON["original_json"] = JSON.parse(JSON.stringify(flashTeamsJSON));
        //flashTeamsJSON["original_status"] = JSON.parse(JSON.stringify(loadedStatus));
        //console.log("flashTeamsJSON['original_json']: " + flashTeamsJSON["original_json"]);
        //console.log("flashTeamsJSON['original_status']: " + flashTeamsJSON["original_status"]);
        //updateStatus();
        updateOriginalStatus();
		recordStartTime();
        addAllFolders();
        in_progress = true; // TODO: set before this?
        //added next line to disable the ticker
        updateStatus(true);
        console.log("here2");
    }

    //Next line is commented out after disabling the ticker
    //setCursorMoving();

    // page was loaded after team started
    // OR 
    // page was loaded before team started && this call to startTeam is as a result of 
    // team now starting (received through poll)
    
    var page_loaded_after_start = firstTime && in_progress;
    var page_loaded_before_start_and_now_started = user_loaded_before_team_start && in_progress;
    
    if(page_loaded_after_start || page_loaded_before_start_and_now_started){
        if(page_loaded_before_start_and_now_started)
            user_loaded_before_team_start = false;
        updateAllPopoversToReadOnly();
       
        
        //Next line is commented out after disabling the ticker
        /*project_status_handler = setProjectStatusMoving();
        trackLiveAndRemainingTasks();
        trackUpcomingEvent();*/
    }


    //Next line is commented out after disabling the ticker
    //load_statusBar(status_bar_timeline_interval);
};

var googleDriveLink = function(){
    var gFolderLink = document.getElementById("gFolder");
    gFolderLink.onclick=function(){
        console.log("is clicked");
        window.open(flashTeamsJSON.folder[1]);
    }
};

var drawEvents = function(editable){
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        console.log("DRAWING EVENT " + i + ", with editable: " + editable);
        drawEvent(ev);
        drawPopover(ev, editable, false);
    }
};

var drawBlueBox = function(ev, task_g){
    var completed_x = ev.completed_x;

    if (!completed_x){
        return null;
    }

    var groupNum = ev.id;

    var task_start = parseFloat(ev.x);
    var task_rect_curr_width = parseFloat(getWidth(ev));
    var task_end = task_start + task_rect_curr_width;
    var blue_width = task_end - completed_x;
    
    var existingBlueBox = task_g.selectAll("#early_rect_" + groupNum);
    if(existingBlueBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "early_rectangle")
            .attr("x", completed_x)
            .attr("y", function(d){ return d.y; })
            .attr("id", "early_rect_" + groupNum )
            .attr("groupNum", function(d){ return d.groupNum; })
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", blue_width)
            .attr("fill", "blue")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A");
    } else {
        existingBlueBox
            .attr("x", completed_x)
            .attr("width", blue_width);
    }

    return blue_width;
};

var drawRedBox = function(ev, task_g, use_cursor){

    var groupNum = ev.id;
    var task_start = parseFloat(ev.x);
    var task_rect_curr_width = parseFloat(getWidth(ev));
    var task_end = task_start + task_rect_curr_width;
    var completed_x = ev.completed_x;
    var red_width;
    if(!use_cursor){
        if (!completed_x){
            red_width = 1;
        } else {
            completed_x = parseFloat(completed_x);
            red_width = completed_x - task_end;
        }
    } else {
        var cursor_x = parseFloat(cursor.attr("x1"));
        red_width = cursor_x - task_end;
    }

    var existingRedBox = task_g.selectAll("#delayed_rect_" + groupNum);
    if(existingRedBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "delayed_rectangle")
            .attr("x", function(d) {return parseFloat(d.x) + task_rect_curr_width})
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "delayed_rect_" + groupNum; })
            .attr("groupNum", groupNum)
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", red_width)
            .attr("fill", "red")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A");
    } else {
        existingRedBox
            .attr("width", red_width);
    }

    return red_width;
};

var drawBlueBoxes = function(){
    for (var i=0;i<drawn_blue_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(drawn_blue_tasks[i])];
        var task_g = getTaskGFromGroupNum(drawn_blue_tasks[i]);
        drawBlueBox(ev, task_g);
    }
};

var drawRedBoxes = function(){
    for (var i=0;i<completed_red_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(completed_red_tasks[i])];
        var task_g = getTaskGFromGroupNum(completed_red_tasks[i]);
        drawRedBox(ev, task_g, false);
    }
};

var drawDelayedTasks = function(){
    var cursor_x = parseFloat(cursor.attr("x1"));
    var before_tasks = computeTasksBeforeCurrent(cursor_x);
    var tasks_after = null;
    var allRanges = [];

    for (var i=0;i<before_tasks.length;i++){
        var groupNum = parseInt(before_tasks[i]);
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var task_g = getTaskGFromGroupNum(groupNum);
        
        var completed = ev.completed_x;
        
        if (completed) continue;
        
        var id_remaining = remaining_tasks.indexOf(groupNum)
        if (id_remaining != -1) continue;

        var red_width = drawRedBox(ev, task_g, true);
        console.log(" ^^^^^^^^^^^^^^^^^^^^^^ RED_WIDTH: " + red_width);
        var idx = live_tasks.indexOf(groupNum);
        if(idx != -1) {
            console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% found task " + groupNum + " in live_tasks");
            live_tasks.splice(idx, 1);
            delayed_tasks.push(groupNum);
        } else {
            console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% not even in live_tasks");
        }

        var groupNum = ev.id;
        var task_start = parseFloat(ev.x);
        var task_rect_curr_width = parseFloat(getWidth(ev));
        var task_end = task_start + task_rect_curr_width;
        var red_end = task_end + red_width;
        var new_tasks_after = computeTasksAfterCurrent(task_end); // TODO: right-most task or left-most task?
        if(tasks_after == null || new_tasks_after.length > tasks_after.length){
            tasks_after = new_tasks_after;
        }
     
        allRanges.push([task_end, red_end]);
    }

    var tasks_tmp = MoveLiveToRemaining(live_tasks,remaining_tasks);
    live_tasks = tasks_tmp["live"];
    remaining_tasks = tasks_tmp["remaining"];


    if (tasks_after != null){
        var actual_offset = computeTotalOffset(allRanges);
        console.log("DRAWING DELAYED TASKS AFTER UPDATE");
        moveTasksRight(tasks_after, actual_offset, true);
    }
};

var sortComparator = function(a, b){
    if(a[0] < b[0]) return -1;
    if(a[0] > b[0]) return 1;
    return 0;
};

// "overlapping" algorithm
var computeTotalOffset = function(allRanges){
    var changes = [];
    for(var i=0;i<allRanges.length;i++){
        var range = allRanges[i];
        changes.push([range[0], 1]);
        changes.push([range[1], -1]);
    }

    var sorted_changes = changes.sort(sortComparator);

    var curr = 0;
    var height = 0;
    var new_ranges = [];
    for(var j=0;j<sorted_changes.length;j++){
        var r = sorted_changes[j];
        new_ranges.push([curr, r[0], height]);
        curr = r[0];
        height = height + r[1];
    }

    var totalOffset = 0;
    for(var k=0;k<new_ranges.length;k++){
        var curr_range = new_ranges[k];
        if(curr_range[2] == 0) continue;
        totalOffset = totalOffset + (curr_range[1] - curr_range[0]);
    }

    return totalOffset;
};

//Takes the JSON and time and updates the cursor position
var positionCursor = function(team, latest_time){
    //Team hasn't started, initialize cursor to 0
    if(!team["startTime"]){
        cursor.attr("x1", 0);
        cursor.attr("x2", 0);
        curr_x_standard = 0;
        return;
    }

    cursor.transition().duration(0);
    clearInterval(cursor_interval_id);
    
    var currTime = latest_time;
    var startTime = team["startTime"];
    var diff = currTime - startTime;

    var cursor_details = getXCoordForTime(diff);
    //console.log("DIFF: " + diff);
    //console.log("CURSOR_DETAILS: " + cursor_details);
    var x = parseFloat(cursor_details["finalX"]);
    //console.log("POSITIONING CURSOR AT: " + x);
    cursor.attr("x1", x);
    cursor.attr("x2", x);
    curr_x_standard = x;

    return cursor_details;
};

var startCursor = function(cursor_details){
    /*
    var x = cursor_details["finalX"];
    var numIntervals = cursor_details["numInt"] + 1;
    var target_x = 50*numIntervals;
    var dist = target_x - x;
    var t = (dist/50)*timeline_interval;
    syncCursor(t, target_x);
    */
    setCursorMoving();
};

/*var syncCursor = function(length_of_time, target_x){
    curr_x_standard = target_x;

    cursor.transition()
        .duration(length_of_time)
        .ease("linear")
        .attr("x1", curr_x_standard)
        .attr("x2", curr_x_standard)
        .each("end", function(){
            //console.log("completed sync");
            //console.log("sync cursor done. moving cursor normally now..");
            setCursorMoving();
        });
};*/

var setCursorMoving = function(){
    cursor.transition().duration(0);
    clearInterval(cursor_interval_id);

    moveCursor(timeline_interval);
    cursor_interval_id = setInterval(function() {
        moveCursor(timeline_interval);
    }, timeline_interval);
};

var moveCursor = function(length_of_time){
    var curr_x = parseFloat(cursor.attr("x1"));
    //console.log("STARTING TO MOVE CURSOR. STARTING X IS: " + curr_x);
    curr_x_standard = curr_x + parseFloat(50);
    //console.log("MOVING IT TO NEW X: " + curr_x_standard);

    cursor.transition()
        .duration(length_of_time)
        .ease("linear")
        .attr("x1", curr_x_standard)
        .attr("x2", curr_x_standard);
};

var stopCursor = function() {
    //console.log("STOPPED CURSOR");
    cursor.transition().duration(0);
    clearInterval(cursor_interval_id);
};

var computeLiveAndRemainingTasks = function(){
    //console.log("computing live and remaining tasks: " + task_groups.length);
    var curr_x = cursor.attr("x1");
    var curr_new_x = parseFloat(curr_x) + increment;

    var remaining_tasks = [];
    var live_tasks = [];
    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);

		
        if(curr_new_x >= start_x && curr_new_x <= end_x && drawn_blue_tasks.indexOf(groupNum) == -1){
        
		         //console.log("previous task does not appear to be delayed so adding task to live_task");
                   live_tasks.push(groupNum);
        
        
        } else if(curr_new_x < start_x){
            remaining_tasks.push(groupNum);
        }
    }
    
/*    var tasks_tmp = MoveLiveToRemaining(live_tasks,remaining_tasks);
    live_tasks = tasks_tmp["live"];
    remaining_tasks = tasks_tmp["remaining"];
    updateStatus(true);
  */  
    //console.log("returning from computing live and remaining tasks");
    return {"live":live_tasks, "remaining":remaining_tasks};
};


var prevTasksDelayed = function(curr_x){
     var prevTasks = computeTasksBeforeCurrent(curr_x);
     if(prevTasks.length > 0){
     	for (var i=0;i<prevTasks.length;i++){

          if(isDelayed(prevTasks[i])){
               return true;
          }
		}
     }
     else{
          return false;
     }
     return false;
}

var computeTasksAfterCurrent = function(curr_x){
    tasks_after_curr = [];
    
    // go through all tasks
    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        // get start x coordinate of task
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;
        
        // if the task's x coordinate is after the current x, it is "after," so add it
        if(curr_x <= start_x){
            tasks_after_curr.push(groupNum);
        }
    }

    return tasks_after_curr;
};

//event.x of pushed back tasks are updated after the drawDelayedTasks is called
//This functions returns the pushed back tasks as tasks before current if it is called before drawDelayedTasks is called
var computeTasksBeforeCurrent = function(curr_x){
    tasks_before_curr = [];
    
    // go through all tasks
    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        // get start x coordinate of task
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        
        // if the task's end x coordinate is before the current x, it is "before," so add it
        if(end_x <= curr_x){
            tasks_before_curr.push(groupNum);
        }
    }
    return tasks_before_curr;
};

/*
    Usage:
    var g = getTaskGFromGroupNum(groupNum);
    g.append("rect").attr()..
    g.data()
*/
var getTaskGFromGroupNum = function(groupNum){
    return timeline_svg.selectAll("g#g_"+groupNum);
};

var getDataIndexFromGroupNum = function(groupNum){
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        if(data.groupNum == groupNum){
            return i;
        }
    }
    return null;
};

// only removes task from timeline, does not update the event array
// if you need to delete an event from the timeline, should call deleteEvent
// in events.js, which in turn calls this function
var removeTask = function(groupNum){
    // destroy popover
    destroyPopover(groupNum);

    // remove from data array
    var idx = null;
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        if (data.groupNum == groupNum){
            idx = i;
            break;
        }
    }
    if(idx != null){
        task_groups.splice(idx, 1);
    }
    
    // remove from screen
    timeline_svg.selectAll("g").data(task_groups, function(d){ return d.groupNum; }).exit().remove();
};

var extendDelayedBoxes = function(){
    // go through delayed tasks and increase width of red box
    var cursor_x = parseFloat(cursor.attr("x1"));
    var diff = 0;
    for (var i=0;i<delayed_tasks.length;i++){
        var groupNum = delayed_tasks[i];
        var delayed_rect = timeline_svg.selectAll("#delayed_rect_" + groupNum);
        
        // new width is diff b/w current cursor position and starting of delayed rect
        var curr_width = parseFloat(delayed_rect.attr("width"));
        var new_width = cursor_x - parseFloat(delayed_rect.attr("x"));
        delayed_rect.attr("width", new_width);
        
        diff = new_width - curr_width;
    }
    if(diff > 0){
        moveRemainingTasksRight(diff);
    }
};

//Draws all the interactions that involve the "tasks"
//Note: if "tasks" is undefined, draws all interactions
var drawInteractions = function(tasks){
    //Find Remaining Interactions and Draw
    var remainingHandoffs = getHandoffs(tasks);
    var numHandoffs = remainingHandoffs.length;

    var remainingCollabs = getCollabs(tasks);
    var numCollabs = remainingCollabs.length;

    for (var j = 0; j < numHandoffs; j++) {
        var intId = remainingHandoffs[j].id
        $("#interaction_" + intId).popover("destroy");
        $("#interaction_" + intId).remove();
        drawHandoff(remainingHandoffs[j]);
    }

    for (var k = 0; k < numCollabs; k++) {
        var intId = remainingCollabs[k].id; 
        $("#interaction_" + intId).popover("destroy");
        $("#interaction_" + intId).remove();
        var event1 = flashTeamsJSON["events"][getEventJSONIndex(remainingCollabs[k].event1)];
        var event2 = flashTeamsJSON["events"][getEventJSONIndex(remainingCollabs[k].event2)];
        var overlap = eventsOverlap(event1.x, getWidth(event1), event2.x, getWidth(event2));
        drawCollaboration(remainingCollabs[k], overlap);
    }
};

var moveTasksRight = function(tasks, amount, from_initial){
    var len = tasks.length;
    for (var i=0;i<len;i++){
        // get the task id
        var groupNum = tasks[i];

        // get the event object
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

        // change the start x
        if (from_initial) {
            //console.log(groupNum + " | BEFORE MOVING RIGHT, MIN_X: " + parseFloat(ev.min_x));
            ev.x = parseFloat(ev.min_x) + parseFloat(amount);
            //console.log(groupNum + " | AFTER MOVING RIGHT, EV.X: " + ev.x);
        } else {
            //console.log(groupNum + " | NOT FROM INITIAL.");
            ev.x += parseFloat(amount);
        }

        // change the time corresponding to the new start x
        var startTimeObj = getStartTime(ev.x);
        ev.startTime = startTimeObj["startTime"];
        ev.startHr = startTimeObj["startHr"];
        ev.startMin = startTimeObj["startMin"];
        flashTeamsJSON["events"][getEventJSONIndex(groupNum)] = ev;

        drawEvent(ev);
        drawPopover(ev, false, false);
    }

    var tasks_with_current = tasks.slice(0);
    tasks_with_current = tasks_with_current.concat(delayed_tasks);
    drawInteractions(tasks_with_current);
  
    //updateStatus();
};

//Notes: Error exist with delay and handoff connections...how and why are those dependencies the way they are?

var moveTasksLeft = function(tasks, amount){
    console.log("MOVE TASKS LEFT FXN CALLED");
    for (var i=0;i<tasks.length;i++){
        // get the task id
        var groupNum = tasks[i];
        
        // get the event object
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        
        // change the start x
        ev.x -= parseFloat(amount);
        if (ev.x < ev.min_x)
            ev.min_x = ev.x;
        
        // change the time corresponding to the new start x
        //ev.startTime -= amount;
        var startTimeObj = getStartTime(ev.x);
        ev.startTime = startTimeObj["startTime"];
        ev.startHr = startTimeObj["startHr"];
        ev.startMin = startTimeObj["startMin"];

        drawEvent(ev);
        drawPopover(ev, false, false);
    }

    var tasks_with_current = tasks.slice(0);
    tasks_with_current = tasks_with_current.concat(delayed_tasks);
    drawInteractions(tasks_with_current);

    updateStatus(true);
};

var moveRemainingTasksRight = function(amount){
    moveTasksRight(remaining_tasks, amount, false);
};

var moveRemainingTasksLeft = function(amount){
    // console.log("THESE ARE THE REMAINING TASKS", remaining_tasks);
    lastEndTime = 0;
    for (var i=0;i<live_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(live_tasks[i])]
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        if (end_x >= lastEndTime){
            lastEndTime = end_x;
        }
    }
    to_move = [];
    for (var i=0;i<remaining_tasks.length;i++){
        var evNum = remaining_tasks[i];
        var ev = flashTeamsJSON["events"][getEventJSONIndex(evNum)]
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        if (start_x >= lastEndTime){
            to_move.push(evNum);
        }
    }
    moveTasksLeft(to_move, amount);
}

/*
TODO:
update popover when automatically shift the tasks left or right
shorten width when finish early (?)
offset of half of drag bar width when drawing red and blue boxes
*/
// not being called for user's side
// trying to fix issue of user's page not extending delayed box (and moving remaining tasks to the right)
var trackLiveAndRemainingTasks = function() {
    tracking_tasks_interval_id = setInterval(function(){
        var tasks = computeLiveAndRemainingTasks();
        var new_live_tasks = tasks["live"];
        var new_remaining_tasks = tasks["remaining"];

        // extend already delayed boxes
        extendDelayedBoxes();

        var at_least_one_task_started = false;
        var at_least_one_task_delayed = false;

        // detect any live task is now delayed or completed early
        for (var i=0;i<live_tasks.length;i++){
            var groupNum = parseInt(live_tasks[i]);
            var task_g = getTaskGFromGroupNum (groupNum);
            var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
            var completed = ev.completed_x;
            var task_rect_curr_width = parseFloat(getWidth(ev));

            // delayed
            if (new_live_tasks.indexOf(groupNum) == -1 && !completed) { // groupNum is no longer live
                console.log("PREVIOUSLY LIVE TASK NOW DELAYED!");
                drawRedBox(ev, task_g, false);

                // add to delayed_tasks list
                delayed_tasks.push(groupNum);
                
                // updateStatus is required to send the notification email when a task is delayed
                delayed_tasks_time[groupNum]=(new Date).getTime();

                at_least_one_task_delayed = true;
            }
        }
      
        

       

        var tasks_tmp = MoveLiveToRemaining(new_live_tasks,new_remaining_tasks);
        new_live_tasks = tasks_tmp["live"];
        new_remaining_tasks = tasks_tmp["remaining"];
        
        for (var j=0;j<remaining_tasks.length;j++){
            var groupNum = parseInt(remaining_tasks[j]);
            if (new_live_tasks.indexOf(groupNum) != -1) { // groupNum is now live
                at_least_one_task_started = true;
            }
        }

        live_tasks = new_live_tasks;
        remaining_tasks = new_remaining_tasks;
       
        

        if(at_least_one_task_delayed || at_least_one_task_started){
            updateStatus(true);
            if(at_least_one_task_delayed)
                at_least_one_task_delayed = false;
            if(at_least_one_task_started)
                at_least_one_task_started = false;
        }
    }, fire_interval);
};

//moves live task to remaining task if prev task is delayed
function MoveLiveToRemaining(new_live_tasks,new_remaining_tasks){
    var tmp_live_tasks = [];
    for (var i =0 ; i<new_live_tasks.length; i++){
        tmp_live_tasks.push(new_live_tasks[i]);
    }


    for (var j=0;j<tmp_live_tasks.length;j++){
       // console.log(tmp_live_tasks.length);
        var groupNum = parseInt(tmp_live_tasks[j]);
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;


        if(prevTasksDelayed(start_x)){
                  new_remaining_tasks.push(groupNum);

                 //remove task from live array
                 new_live_tasks.splice(new_live_tasks.indexOf(tmp_live_tasks[j]), 1);

        }
    }


    return {"live":new_live_tasks, "remaining":new_remaining_tasks};

}


//Search all handoffs, return those that involve only two remaining tasks
function getHandoffs(tasks) {
    var handoffs = [];
    for (var i=0; i<flashTeamsJSON["interactions"].length; i++) {
        var inter = flashTeamsJSON["interactions"][i];
        if (inter.type == "collaboration") continue;

        if(tasks == undefined){ //If tasks undefined, include ALL handoffs
            handoffs.push(inter);
        } else {
            for (var j = 0; j<tasks.length; j++) {
                var task1Id = tasks[j];
                for (var k = 0; k<tasks.length; k++) {
                    if (j == k) continue;
                    var task2Id = tasks[k];
                    if ((inter.event1 == task1Id && inter.event2 == task2Id) 
                    || (inter.event1 == task2Id && inter.event2 == task1Id)) {
                        handoffs.push(inter);
                    }
                }
            }
        }
    }

    return handoffs;
}

//Search all collaborations, return those that involve only two remaining tasks
function getCollabs(tasks) {
    var collabs = [];
    for (var i=0; i<flashTeamsJSON["interactions"].length; i++) {
        var inter = flashTeamsJSON["interactions"][i];
        if (inter.type == "handoff") continue;

        if(tasks == undefined) { //If tasks undefined, include ALL collaborations
            collabs.push(inter);
        } else {
            for (var j = 0; j<tasks.length; j++) {
                var task1Id = tasks[j];
                for (var k = 0; k<tasks.length; k++) {
                    if (j == k) {
                        continue;
                    }
                    var task2Id = tasks[k];
                    if ((inter.event1 == task1Id && inter.event2 == task2Id) 
                    || (inter.event1 == task2Id && inter.event2 == task1Id)) {
                        collabs.push(inter);
                    }
                }
            }
        }
    }
    return collabs;
}

function isDelayed(element) {
    for (var i=0; i<delayed_tasks.length;i++){
        if (delayed_tasks[i] == element){
            return true;
        }
    }
    return false;
};

function getEventIndexFromId(event_id) {
    var index = -1;
    for (var i = 0; i < flashTeamsJSON["events"].length; i++) {
        if (flashTeamsJSON["events"][i]["id"] == event_id) {
            index = i;
        }
    }
    return index;
}

//Tracks a current user's ucpcoming and current events
var trackUpcomingEvent = function(){
     if (current == undefined){
        return;
    }
    setInterval(function(){
        if(!upcomingEvent) return;
        var ev = flashTeamsJSON["events"][getEventJSONIndex(upcomingEvent)];
        var task_g = getTaskGFromGroupNum(upcomingEvent);
        if (ev.completed_x){
            //console.log("THIS IS THE START TIME", currentUserEvents[0].startTime);
            toDelete = upcomingEvent;
            //console.log("BEFORE SPLICING", currentUserEvents);
            currentUserEvents.splice(0,1);
            //console.log("AFTER SPLICING", currentUserEvents);
            //console.log("THIS IS THE START TIME", stime);
            //console.log("THIS IS THE START TIME", currentUserEvents[0].startTime);
            if (currentUserEvents.length == 0){
                $("#rect_" + toDelete).attr("fill-opacity", .4);
                upcomingEvent = undefined;
                statusText.style("color", "green");
                statusText.text("You've completed all your tasks!");
                return;
            }
            upcomingEvent = currentUserEvents[0].id;
            // console.log("AFTER SPLICING", currentUserEvents, upcomingEvent);
            $("#rect_" + toDelete).attr("fill-opacity", .4);
            $("#rect_" + upcomingEvent).attr("fill-opacity", .9);
            task_g = getTaskGFromGroupNum(upcomingEvent);
        }
        var cursor_x = cursor.attr("x1");
        var cursorHr = (cursor_x-(cursor_x%100))/100;
        var cursorMin = (cursor_x%100)/25*15;
        if(cursorMin == 57.599999999999994) {
            cursorHr++;
            cursorMin = 0;
        } else cursorMin += 2.4

        //maggie added the -2 to fix the off by 2 min bug
        var cursorTimeinMinutes = parseInt((cursorHr*60)) + parseInt(cursorMin) - 2;
        //console.log(currentUserEvents, currentUserEvents[0]);
        //console.log("THIS IS START HOUR AND MINUTES", currentUserEvents[0].startHr, currentUserEvents[0].startMin);
        currentUserEvents[0].startTime = parseInt(currentUserEvents[0].startHr)*60 + parseInt(currentUserEvents[0].startMin);
        //console.log("THIS IS THE START TIME", currentUserEvents[0].startTime);
        var cur_ev_id = currentUserEvents[0].id;
        var cur_ev_ind = getEventIndexFromId(cur_ev_id);

        var ev_start_time = parseInt(ev.startHr) * 60 + parseInt(ev.startMin);
        var displayTimeinMinutes = ev_start_time - parseInt(cursorTimeinMinutes);

        //console.log(currentUserEvents[0].startTime);
        //console.log("DISPLAY TIME", displayTimeinMinutes);
        //console.log("CURSOR TIME", cursorTimeinMinutes);
        var hours = parseInt(displayTimeinMinutes/60);
        var minutes = displayTimeinMinutes%60;
        var minutesText = minutes;
        if (minutes < 10){
            minutesText = "0" + minutes;
        }
        var overallTime = hours + ":" + minutesText;
        if (displayTimeinMinutes < 0){

            if(!isDelayed(upcomingEvent)){
                overallTime = "Your task is IN PROGRESS";
                statusText.style("color", "blue");
            }
            else{
                overallTime = "Your task is DELAYED";
                statusText.style("color", "red");
            }
        } else {
            if (cursorTimeinMinutes == 0) {
            	//dr: adding the commented d3 line below as a reminder of a potential solution to reduce height
            	//project_status_svg.attr("height", 60);
                overallTime = "Your first task will start " + overallTime + " after the team has begun";
            } else {
                if (delayed_tasks.length != 0) {
                    //if the event starts immediately after the delayed event...
                    if ((hours == 0) && (minutes <= 2)) {
                        overallTime = "A task ahead of yours has been delayed. Your next task will start as soon as the delayed task is completed";
                    } else {
                        overallTime = "A task ahead of yours has been delayed. Your next task will start " + overallTime + " after the delayed task is completed.";
                    }
                    statusText.style("color", "red");
                } else {
                    overallTime = "Your next task starts in " + overallTime;
                    statusText.style("color", "blue");
                }
            }
        }
        if (displayTimeinMinutes == 0) {
            if (cursorTimeinMinutes == 0) {
                overallTime = "Your first task will begin as soon as the team starts";  
            } else {
                overallTime = "Your next task begins NOW";
            }
            statusText.style("color", "blue");  
        }
        
        //statusText.text(overallTime);
       
    }, fire_interval);

    //console.log("EXITING TRACKUPCOMINGEVENT FUNCTION");
}


var getAllData = function(){
    var all_data = [];
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        all_data.push(data);
    }
    return all_data;
};

var getAllTasks = function(){
    var all_tasks = [];
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;
        all_tasks.push(groupNum);
    }
    return all_tasks;
};

var constructStatusObj = function(){
    var flash_team_id = $("#flash_team_id").val();
    flashTeamsJSON["id"] = flash_team_id;
    flashTeamsJSON["title"] = document.getElementById("ft-name").innerHTML;
    //flashTeamsJSON["author"] = 
   
    var localStatus = {};

    localStatus.live_tasks = live_tasks;
    localStatus.remaining_tasks = remaining_tasks;
    localStatus.delayed_tasks = delayed_tasks;
    localStatus.drawn_blue_tasks = drawn_blue_tasks;
    localStatus.completed_red_tasks = completed_red_tasks;
    localStatus.flash_teams_json = flashTeamsJSON;

    //delayed_task_time is required for sending notification emails on delay
    localStatus.delayed_tasks_time = delayed_tasks_time;
    localStatus.dri_responded = dri_responded;

    return localStatus;
};

var updateStatus = function(flash_team_in_progress){
    var localStatus = constructStatusObj();
    
    //if flashTeam hasn't been started yet, update the original status in the db
    if(flashTeamsJSON["startTime"] == undefined){
	    //console.log("NO START TIME!");    
		updateOriginalStatus();
    }

    if(flash_team_in_progress != undefined){ // could be undefined if want to call updateStatus in a place where not sure if the team is running or not
        localStatus.flash_team_in_progress = flash_team_in_progress;
    } else {

        localStatus.flash_team_in_progress = in_progress;
    }
    localStatus.latest_time = (new Date).getTime();
    var localStatusJSON = JSON.stringify(localStatus);
    //console.log("updating string: " + localStatusJSON);

    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_status';
    $.ajax({
        url: url,
        type: 'post',
        data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        //console.log("UPDATED FLASH TEAM STATUS");
    });
};

//this function updates the original status of the flash team in the database, which is 
// used for the team duplication feature (it preserves the team without saving the status 
// information once the team is run
var updateOriginalStatus = function(){
    //console.log("in updateOriginalStatus");
    var localStatus = constructStatusObj();

    localStatus.latest_time = (new Date).getTime();
    var localStatusJSON = JSON.stringify(localStatus);
    //console.log("updating string: " + localStatusJSON);

    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_original_status';
    $.ajax({
        url: url,
        type: 'post',
        data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        //console.log("UPDATED FLASH TEAM STATUS");
    });
};

var sendEmailOnCompletionOfDelayedTask = function(groupNum){
    // send "delayed task is finished" email
    if(remaining_tasks.length!=0){
        var title="test";
        var events = flashTeamsJSON["events"];
        
        for(var i=0;i<events.length;i++){
            var ev = events[i];
            if (parseInt(ev["id"]) == groupNum){
                title = ev["title"];
                break;
            }
        }

        DelayedTaskFinished_helper(remaining_tasks,title);
    }
};

var sendEmailOnEarlyCompletion = function(blue_width){
    var early_minutes=parseInt((parseFloat(blue_width+4)/50.0)*30);
    early_completion_helper(remaining_tasks,early_minutes);
};
/* interaction.js
 * ---------------------------------------------
 * Code that manages the interactions (collaborations and handoffs)
 * Drawing from scratch, drag response on (popovers.js)
 */

var DRAWING_HANDOFF = false;
var DRAWING_COLLAB = false;
var INTERACTION_TASK_ONE_IDNUM = 0;
var interaction_counter = undefined;

//For Interactions
timeline_svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 0)
    .attr("refY", 2)
    .attr("markerWidth", 5)
    .attr("markerHeight", 4)
    .attr("stroke", "gray")
    .attr("fill", "gray")
    .append("path")
        .attr("d", "M 0,0 V 4 L2,2 Z");

//Called when a user clicks a task rectangle (aka event)
//Determines if the user is trying to draw an interaction and if so, what type
function eventMousedown(task2idNum) {
    var task1idNum = INTERACTION_TASK_ONE_IDNUM;
    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["events"].length; i++) {
        var idNum = flashTeamsJSON["events"][i].id;
        if (idNum != task1idNum && idNum != task2idNum) {
            hidePopover(idNum);
        }   
    }

    if (DRAWING_HANDOFF == true) $("#handoff_btn_" + task1idNum).popover("hide");
    if (DRAWING_COLLAB == true) $("#collab_btn_" + task1idNum).popover("hide");
 
 //show modal if handoff or collaboration is NOT being drawn
    if (DRAWING_HANDOFF != true && DRAWING_COLLAB != true){
        
       var modal_body = '<p id="task-text">Task Description</p>' +
       '<p><span id="task-edit-link"></span></p>';

       var modal_footer =  '<button class="btn " id="hire-task" style="float :left " onclick="hireForm('+task2idNum+')">Hire</button>' +
       '<button class="btn " id="start-task" style="float :left " onclick="ATFunction('+task2idNum+')">Start</button>'+
       '<button class="btn " id="end-task" style="float :left " onclick="ATFunction('+task2idNum+')">End</button>' +
       '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
       '<button class="btn btn-primary" id="edit-save-task" onclick="editTaskOverview(true,'+task2idNum+')">Edit</button>' ;
     
       $('#task_modal').modal('show'); 
       $('.task-modal-footer').html(modal_footer);
       $('.task-modal-body').html(modal_body);

      showTaskOverview(task2idNum);
    }

    //Check if interaction already exists
    if (DRAWING_COLLAB == true || DRAWING_HANDOFF == true) {
        timeline_svg.on("mousemove", null);
        $(".followingLine").remove();

        //Swap if task2 starts first
        if(firstEvent(task1idNum, task2idNum) == task2idNum)  {
            var t2Id = task2idNum;
            task2idNum = task1idNum;
            task1idNum = t2Id;
        }
        
        for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            var inter = flashTeamsJSON["interactions"][i];
            if ((inter.event1 == task1idNum && inter.event2 == task2idNum) 
                || (inter.event1 == task2idNum && inter.event2 == task1idNum)) {
                alert("Sorry, this interaction already exists.");
                DRAWING_COLLAB = false;
                DRAWING_HANDOFF = false;
                return;
            }
        }
    }

    //The user has cancelled the drawing
    if (task1idNum == task2idNum) {
        DRAWING_COLLAB = false;
        DRAWING_HANDOFF = false;
    //Draw a handoff from task one to task two
    } else if (DRAWING_HANDOFF == true) {
        if (interaction_counter == undefined) {
            interaction_counter = initializeInteractionCounter();
        } 
        interaction_counter++;
        updateStatus();
        var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1idNum)];
        var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2idNum)];
        var task1X = ev1.x;
        var task1Width = getWidth(ev1);
        var task2X = ev2.x;
        
        if ((task1X + task1Width) <= task2X) {
            var handoffData = {"event1":task1idNum, "event2":task2idNum, 
                "type":"handoff", "description":"", "id":interaction_counter};
            flashTeamsJSON.interactions.push(handoffData);
            updateStatus(false);
            drawHandoff(handoffData);
            DRAWING_HANDOFF = false;
            $(".task_rectangle").popover("hide");
            //d3.event.stopPropagation();
            INTERACTION_TASK_ONE_IDNUM = 0; // back to 0
        } else {
            alert("Sorry, the second task must begin after the first task ends.");
            DRAWING_COLLAB = false;
            DRAWING_HANDOFF = false;
        }
    //Draw a collaboration link between task one and task two
    } else if (DRAWING_COLLAB == true) {
        var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1idNum)];
        var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2idNum)];
        var task1X = ev1.x;
        var task1Width = getWidth(ev1);
        var task2X = ev2.x;
        var task2Width = getWidth(ev2);

        var overlap = eventsOverlap(task1X, task1Width, task2X, task2Width);
        if (overlap > 0) {
            if (interaction_counter == undefined) {
                interaction_counter = initializeInteractionCounter();
            }
            interaction_counter++;
            updateStatus();
            var collabData = {"event1":task1idNum, "event2":task2idNum, 
                "type":"collaboration", "description":"", "id":interaction_counter};
            flashTeamsJSON.interactions.push(collabData);
            updateStatus(false);
            drawCollaboration(collabData, overlap);
            DRAWING_COLLAB = false;
            $(".task_rectangle").popover("hide");
            //d3.event.stopPropagation();
            INTERACTION_TASK_ONE_IDNUM = 0; // back to 0
        } else {
            alert("These events do not overlap, so they cannot collaborate.");
            DRAWING_COLLAB = false;
            DRAWING_HANDOFF = false;
        }
    //There is no interation being drawn
    } else {
        var data = getPopoverDataFromGroupNum(task2idNum);
        togglePopover(task2idNum);
        return;
    }
}


//Called when we find DRAWING_HANDOFF
//initializes creating a handoff b/t two events
function startWriteHandoff() {
    if(isUser) { // user page
        return;
    }

    d3.event.stopPropagation();

    INTERACTION_TASK_ONE_IDNUM = this.getAttribute('groupNum');
    DRAWING_HANDOFF = true;
    var m = d3.mouse(this);
    //console.log("x: " + m[0] + " y: " + m[1]);
    line = timeline_svg.append("line")
        .attr("class", "followingLine")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])
        .attr("stroke-width", 3)
        .attr("stroke", "gray");
    timeline_svg.on("mousemove", interMouseMove);
};

function handoffStart(firstEvent){
    var x1;
     if (drawn_blue_tasks.indexOf(firstEvent["id"]) != -1){
        x1 = firstEvent.completed_x;
    } 
    else if (completed_red_tasks.indexOf(firstEvent["id"]) != -1){
        x1 = firstEvent.completed_x;
    }
    else if(delayed_tasks.indexOf(firstEvent["id"]) != -1){
        var cursor_x = parseFloat(cursor.attr("x1"));
        var widthRect = parseFloat(getWidth(firstEvent));
        var red_width = cursor_x - (firstEvent.x + widthRect);
        x1 = firstEvent.x + widthRect + red_width;
    }
    else { 
        x1 = firstEvent.x + 3 + getWidth(firstEvent);
    }
    return x1;
}

// Draw a handoff for the first time
// Don't call this directly. Call 'drawEachHandoff' in events.js instead.
function drawHandoff(handoffData) {
    var task1Id = handoffData["event1"];
    var task2Id = handoffData["event2"];
    var handoffId = handoffData["id"];

    //Find end of task 1
    var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1Id)];
    var x1 = handoffStart(ev1);
    var y1 = ev1.y + 50;
    
    //Find beginning of task 2
    var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2Id)];
    var x2 = ev2.x + 3;
    var y2 = ev2.y + 50;

    var path = timeline_svg.selectAll("path")
       .data(flashTeamsJSON["interactions"]);

    path.enter().insert("svg:path")
       .attr("class", "link")
       .style("stroke", "#ccc");

    path = timeline_svg.append("path")
        .attr("class", "handoffLine")
        .attr("id", function () {
            return "interaction_" + handoffId;
        })
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("d", function(d) {
             var dx = x1 - x2,
                dy = y1 - y2,
                dr = Math.sqrt(dx * dx + dy * dy);
            //For ref: http://stackoverflow.com/questions/13455510/curved-line-on-d3-force-directed-tree
            return "M " + x1 + "," + y1 + "\n A " + dr + ", " + dr 
                + " 0 0,0 " + x2 + "," + (y2+15); 
        })
        .attr("stroke", "gray")
        .attr("stroke-width", 7)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)"); //FOR ARROW

    $("#interaction_" + handoffId).popover({
        class: "handoffPopover", 
        id: '"handoffPopover_' + handoffId + '"',
        html: "true",
        trigger: "click",
        title: "Handoff",
        content: 'Description of Handoff Materials: '
        +'<textarea rows="2.5" id="interactionNotes_' + handoffId + '"></textarea>'
        + '<button type="button" class="btn btn-success" id="saveHandoff' + handoffId + '"'
            +' onclick="saveHandoff(' + handoffId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + handoffId + '"'
            +' onclick="deleteInteraction(' + handoffId +');">Delete</button>',
        container: $("#timeline-container")
    });
}

//Save handoff notes and update popover
function saveHandoff(intId) {
    //Update Popover Content
    var notes = $("#interactionNotes_" + intId).val()
    $("#interaction_" + intId).data('popover').options.content = 'Description of Handoff Materials: '
        +'<textarea rows="2" id="interactionNotes_' + intId + '">' + notes + '</textarea>'
        + '<button type="button" class="btn btn-success" class="btn" id="saveHandoff' + intId + '"'
        +' onclick="saveHandoff(' + intId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + intId + '"'
        +' onclick="deleteInteraction(' + intId +');">Delete</button>';

    //Update JSON
    var indexOfJSON = getIntJSONIndex(intId);
    flashTeamsJSON["interactions"][indexOfJSON].description = notes;

    //Hide Popover
    $("#interaction_" + intId).popover("hide");
}


//Called when we click the collaboration button initializes creating 
//a collaboration b/t two events
function startWriteCollaboration(ev) {
    if(isUser) { // user page
        return;
    }
    
    d3.event.stopPropagation();

    INTERACTION_TASK_ONE_IDNUM = this.getAttribute('groupNum'); 
    DRAWING_COLLAB = true;
    var m = d3.mouse(this);
    line = timeline_svg.append("line")
        .attr("class", "followingLine")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("stroke-dasharray", (4,4));
    timeline_svg.on("mousemove", interMouseMove);
};

//Draw collaboration between two events, calculates which event 
//comes first and what the overlap is
function drawCollaboration(collabData, overlap) {
    var task1Id = collabData["event1"];
    var task2Id = collabData["event2"];
    var collabId = collabData["id"];

    var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1Id)];
    var y1 = ev1.y + 17; // padding on the top and bottom of timeline rows + height of x-axis labels

    var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2Id)];
    var x2 = ev2.x + 3;
    console.log("NEW X OF COLLAB: " + x2);
    var y2 = ev2.y + 17;

    var firstTaskY = 0;
    var taskDistance = 0;
    if (y1 < y2) {
        firstTaskY = y1 + 90;
        taskDistance = y2 - firstTaskY;
    } else {
        firstTaskY = y2 + 90;
        taskDistance = y1 - firstTaskY;
    }
    collabLine = timeline_svg.append("rect")
        .attr("class", "collaborationRect")
        .attr("id", function () {
            return "interaction_" + collabId;
        })
        .attr("x", x2)
        .attr("y", firstTaskY)
        .attr("height", taskDistance)
        .attr("width", overlap) //START HERE, FIND REAL OVERLAP
        .attr("fill", "gray")
        .attr("fill-opacity", .7);

    drawCollabPopover(collabId);
}

//Add a popover to the collaboration rect so the user can add notes and delete
function drawCollabPopover(collabId) {
    $("#interaction_" + collabId).popover({
        class: "collabPopover", 
        id: '"collabPopover_' + collabId + '"',
        html: "true",
        trigger: "click",
        title: "Collaboration",
        content: 'Description of Collaborative Work: '
        +'<textarea rows="2.5" id="collabNotes_' + collabId + '"></textarea>'
        + '<button type="button" class="btn btn-success" id="saveCollab' + collabId + '"'
            +' onclick="saveCollab(' + collabId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + collabId + '"'
            +' onclick="deleteInteraction(' + collabId +');">Delete</button>',
        container: $("#timeline-container")
    });
}

//Saves the new notes text in the collab
function saveCollab(intId) {
    //Update Popover's Content
    var notes = $("#collabNotes_" + intId).val()
    $("#interaction_" + intId).data('popover').options.content =   'Description of Collaborative Work: '
        +'<textarea rows="2.5" id="collabNotes_' + intId + '">' + notes + '</textarea>'
        + '<button type="button" class="btn btn-success" id="saveCollab' + intId + '"'
        +' onclick="saveCollab(' + intId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + intId + '"'
        +' onclick="deleteInteraction(' + intId +');">Delete</button>';

    //Update JSON
    var indexOfJSON = getIntJSONIndex(intId);
    flashTeamsJSON["interactions"][indexOfJSON].description = notes;

    //Hide Popover
    $("#interaction_" + intId).popover("hide");
}

//Deletes the interaction from the timeline and the JSON
function deleteInteraction(intId) {
    //Destroy Popover
    $("#interaction_" + intId).popover("destroy");

    //Delete from JSON
    var indexOfJSON = getIntJSONIndex(intId);
    flashTeamsJSON["interactions"].splice(indexOfJSON, 1);
    updateStatus();

    //Delete Arrow or Rectangle
    $("#interaction_" + intId).remove();
}

//Returns the event that begins first
function firstEvent(task1idNum, task2idNum) {
    var task1Rect = $("#rect_" + task1idNum)[0];
    var x1 = task1Rect.x.animVal.value + 3;
    var task2Rect = $("#rect_" + task2idNum)[0];
    var x2 = task2Rect.x.animVal.value + 3;

    if (x1 <= x2) return task1idNum;
    else return task2idNum;
}

//Calculate the overlap of two events
function eventsOverlap(task1X, task1Width, task2X, task2Width) {
    var task1End = task1X + task1Width;
    var task2End = task2X + task2Width;

    //Task2 starts after the end of Task1
    if ((task1End <= task2X) || (task2End <= task1X)) {
        return 0;
    } else {
        var overlapStart;
        if (task1X <= task2X) overlapStart = task2X;
        else overlapStart = task1X;
            var overlapEnd = 0;
        //Task 1 Ends first or they end simultaneously
        if (task1End <= task2End) overlapEnd = task1End;
        //Task 2 Ends first
        else overlapEnd = task2End;
        return overlapEnd-overlapStart;
    }
}

//Follow the mouse movements after a handoff is initialized
function interMouseMove() {
    var m = d3.mouse(this);
    line.attr("x2", m[0]-3)
        .attr("y2", m[1]-3);
}

//Retrieve index of the JSON object using its id
function getIntJSONIndex(idNum) {
    for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
        if (flashTeamsJSON["interactions"][i].id == idNum) {
            return i;
        }
    }
}

function initializeInteractionCounter() {
    if (flashTeamsJSON["interactions"].length == 0) return 0; 
    else {
        var highestId = 0;
        for (i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            if (flashTeamsJSON["interactions"][i].id > highestId) {
                highestId = flashTeamsJSON["interactions"][i].id;
            }
        }
        return highestId;
    }
}



;
/***project overview***/


function renderProjectOverview(){
		
	var project_overview = flashTeamsJSON["projectoverview"];

	showProjectOverview(); 
}

function showProjectOverview(){
	var project_overview = flashTeamsJSON["projectoverview"];
	
	if(project_overview === undefined){
		project_overview = "No project overview has been added yet.";
	}
	
	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');
		
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$('#projectOverviewEditLink').show();
		$("#projectOverviewEditLink").html('<a onclick="editProjectOverview(false)" style="font-weight: normal;">Edit</a>');
	}
	
	var projectOverviewContent = '<div id="project-overview-text"><p>' + project_overview + '</p></div>';	
	
	$('#projectOverview').html(projectOverviewContent);
	
	//modal content
	$('#po-text').html(projectOverviewContent);

	//only allow authors to edit project overview
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$("#edit-save").css('display', '');
		$("#edit-save").attr('onclick', 'editProjectOverview(true)');
		$("#edit-save").html('Edit');
	}
	else{
		$("#edit-save").css('display', 'none');
	}
}

function editProjectOverview(popover){

	var project_overview = flashTeamsJSON["projectoverview"];
	
	if(project_overview === undefined){
		project_overview = "";
	}
	
	if(popover==true){
		$('#po-edit-link').hide();
		
		var projectOverviewForm = '<form name="projectOverviewForm" id="projectOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="projectOverviewInput" rows="6" placeholder="Description of project...">'+project_overview+'</textarea>'
					+ '<a onclick="showProjectOverview()" style="font-weight: normal;">Cancel</a>'
					+'</form>';
		$('#po-text').html(projectOverviewForm);
		
		$("#edit-save").attr('onclick', 'saveProjectOverview()');
		$("#edit-save").html('Save');	
	}
	
	else{
		$('#projectOverviewEditLink').hide();
	
		var projectOverviewForm = '<form name="projectOverviewForm" id="projectOverviewForm" style="margin-bottom: 5px;">'
				+'<textarea type="text"" id="projectOverviewInput" rows="6" placeholder="Description of project...">'+project_overview+'</textarea>'
				+ '<button class="btn btn-default" type="button" onclick="showProjectOverview()">Cancel</button>'
				+ '<button class="btn btn-success" type="button" onclick="saveProjectOverview()" style="float: right;">Save</button>'
				+'</form>';
				
		$('#projectOverview').html(projectOverviewForm);
	}
			
}


function saveProjectOverview(){
	
	// retrieve project overview from form
    var project_overview_input = $("#projectOverviewInput").val();
    
    		if (project_overview_input === "") {
        		project_overview_input =  "No project overview has been added yet.";
				//alert("Please enter a project overview.");
				//return;
		}
	 
    flashTeamsJSON["projectoverview"] = project_overview_input;
    
    console.log("saved projectoverview: " + flashTeamsJSON["projectoverview"]);
    
    updateStatus();
    
    showProjectOverview();
}


/***chat****/

var firebaseURL = 'https://foundry-ft-dev.firebaseio.com/'; //should be foundry-ft for production and foundry-ft-dev for development

var myDataRef = new Firebase(firebaseURL + flash_team_id +'/chats');

var currentdate = new Date(); 

var name;


$('#messageInput').keydown(function(e){
    if (e.keyCode == 13) {
        //console.log("PRESSED RETURN KEY!");
        var text = $('#messageInput').val();
        var uniq_u=getParameterByName('uniq');
        
        if(uniq_u == undefined || uniq_u == ""){
	        uniq_u = 'Author';
        }
        
        myDataRef.push({name: chat_name, role: chat_role, uniq: uniq_u, date: currentdate.toUTCString(), text: text});
        $('#messageInput').attr("placeholder", "Type your message here...").val('').blur();
    }
});

//load all chats that were sent before page was reloaded
/*myDataRef.once('value', function(snapshot) {
    var message = snapshot.val();
    
	if(message != null){
		 displayChatMessage(message.name, message.uniq, message.role, message.date, message.text);
    
		 name = message.name;
	}
});*/

/*myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    //console.log(snapshot);
    //console.log(message);
    //console.log("MESSAGE NAME: " + message["name"]);

    displayChatMessage(message.name, message.uniq, message.role, message.date, message.text);
    
    name = message.name;
});
*/
var lastMessage=0;
var lastWriter;

function displayChatMessage(name, uniq, role, date, text) {
    
    if(name == undefined){
        return;
    }
    
    message_date = new Date(date);
    dateform = message_date.toLocaleString();
    
    // diff in milliseconds 
    var diff = Math.abs(new Date() - message_date);
    
    //diff in minutes
    //console.log("minutes ago: " + diff/(1000*60)); 
    
    //notification text   
    //notification title
    var notif_title = name+': '+ text;
    //notification body
    var notif_body = dateform;
    
    var showchatnotif = false; // true if notifications should be shown
        
    if ((current_user == 'Author' && role == 'Author') || (current_user.uniq == uniq)){
    	showchatnotif = false;
    }
    else{
	    showchatnotif = true;
    }
    
    // checks if last notification was less than 5 seconds ago
    // this is used to only create notifications for messages that were sent from the time you logged in and forward 
    // (e.g., no notifications for messages in the past)
    if (diff <= 50000 && showchatnotif == true){
        playSound("/assets/notify");
	    notifyMe(notif_title, notif_body, 'chat');
    }

	//revise condition to include OR if timestamp of last message (e.g., lastDate) was over 10 minutes ago
    if(lastWriter!=name){
        lastMessage=(lastMessage+1)%2;
        var div1 = $('<div/>',{"id":"m"+lastMessage}).text(text).prepend($('<strong/>').text(name+ ' (' + role + ')' + ': ' )).prepend('<br>').prepend($('<em/>').text(dateform));

        div1.css('padding-left','5%');
        div1.appendTo($('#messageList'));
        
    }else{
        var div1 = $('<div/>',{"id":"m"+lastMessage}).text(text);
        div1.css('padding-left','5%');
        div1.appendTo($('#messageList'));
    }
    lastWriter=name;
    lastDate = message_date;
    $('#messageList')[0].scrollTop = $('#messageList')[0].scrollHeight;
};


//*** online users
// since I can connect from multiple devices or browser tabs, we store each connection instance separately
// any time that connectionsRef's value is null (i.e. has no children) I am offline
var myConnectionsRef = new Firebase(firebaseURL + flash_team_id + '/users/'+name+'/connections');
// stores the timestamp of my last disconnect (the last time I was seen online)
var lastOnlineRef = new Firebase(firebaseURL + flash_team_id + '/users/'+name+'/lastOnline');
var connectedRef = new Firebase(firebaseURL + '.info/connected');

// Get a reference to the presence data in Firebase.
var userListRef = new Firebase(firebaseURL + flash_team_id + '/presence');

// Generate a reference to a new location for my user with push.
var myUserRef = userListRef.push();

connectedRef.on('value', function(snap) {
    if (snap.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

        // add this device to my connections list
        // this value could contain info about the device or a timestamp too
        var con = myConnectionsRef.push(true);

        // when I disconnect, remove this device
        con.onDisconnect().remove();

        // when I disconnect, update the last time I was seen online
        lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
    
		// If we lose our internet connection, we want ourselves removed from the list.
		myUserRef.onDisconnect().remove();

		// Set our initial online status.
		setUserStatus("online ★");
      
    } else {

      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
});


// A helper function to let us set our own status
function setUserStatus(status) {
	// Set our status in the list of online users.
	currentStatus = status;
	if (presname != undefined && status != undefined){
		myUserRef.set({ name: presname, status: status });
	}
}

function getMessageId(snapshot) {
    return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
}

// Update our GUI to show someone"s online status.
userListRef.on("child_added", function(snapshot) {
	var user = snapshot.val();
	
	$("<div/>")
	  .attr("id", getMessageId(snapshot))
	  .text(user.name + " is " + user.status)
	  .appendTo("#presenceDiv");
});

// Update our GUI to remove the status of a user who has left.
userListRef.on("child_removed", function(snapshot) {
	$("#presenceDiv").children("#" + getMessageId(snapshot))
	  .remove();
});

// Update our GUI to change a user"s status.
userListRef.on("child_changed", function(snapshot) {
	var user = snapshot.val();
	$("#presenceDiv").children("#" + getMessageId(snapshot))
	  .text(user.name + " is " + user.status);
});
  

// Use idle/away/back events created by idle.js to update our status information.
$(function() { 

	// when user is inactive for 60 seconds
	var awayCallback = function() {
		setUserStatus("away");
	};
	
	var awayBackCallback = function() {
		setUserStatus("online ★");
	};
	
	//when user is looking at another tab
	var hiddenCallback = function() {
		//☆ idle
		setUserStatus("idle ☆");
	};
	
	var visibleCallback = function(){
		//setUserStatus("active again");
		setUserStatus("online ★");
	};

	var idle = new Idle({
		onHidden: hiddenCallback,
		onVisible: visibleCallback,
		onAway: awayCallback,
		onAwayBack: awayBackCallback,
		awayTimeout: 60000 //away with 1 minute (e.g., 60 seconds) of inactivity
	}).start();				
});
/***chat end****/


//*************status bar begin *******//

//var status_width=302; --> negar's
/* --------------- PROJECT STATUS BAR START ------------ */
var project_status_svg = d3.select("#status-bar-container").append("svg")
.attr("width", "100%")
.attr("height", 100);

var statusText = project_status_svg.append("foreignObject")
.attr("x", 0)
.attr("y", 15)
.attr("width", "100%")
.attr("height", 100)
.append("xhtml:p")
.style("color", "blue")
.style("font-size", "18px")
.style("background-color", "#f5f5f5")
.style("width", "100%")
.text("");




var status_width=100; 
var status_height=32;
var status_x=0;
var status_y=25;
var curr_status_width=0;
var project_duration=1440000;
var status_bar_timeline_interval=1000;  //TODO back to 10 secs //start moving each second for the width of project_status_interval_width.
var num_intervals;                      //=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
var project_status_interval_width;      //=parseFloat(status_width)/parseFloat(num_intervals);
var thirty_min= 10000; //TODO normal speed timer is 1800000; fast timer is 10000
var first_move_status=1;

// var gdrive_link = project_status_svg.append("text")
//         .text("Google Drive Folder")
//         .attr("style", "cursor:pointer; text-decoration:underline; text-decoration:bold;")
//         .attr("class", "gdrive_link")
//         .attr("id", function(d) {return "folderLink";})
//         // .attr("groupNum", groupNum)
//         .attr("x", function(d) {return status_x})
//         .attr("y", function(d) {return status_y + 10})
//         .attr("font-size", "12px");

// $("#folderLink").on('click', function(){
//     window.open(flashTeamsJSON.folder[1]);
// });

/*var project_status_svg = d3.select("#status-bar-container").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", 50)


project_status_svg.append("rect")
    .attr("width", status_width)
    .attr("height", status_height)
    .attr("x",status_x)
    .attr("y",status_y)
    .style("stroke","black" )
    .attr("fill","white")

var project_status=project_status_svg.append("rect")
    .attr("width", curr_status_width)
    .attr("height", status_height)
    .attr("x",status_x)
    .attr("y",status_y)
    .attr("fill","green")
    .attr("class","project_status")

$(document).ready(function(){
  $("#flip").click(function(){
    $("#panel").slideToggle();
  });
});
*/
var moveProjectStatus = function(status_bar_timeline_interval){
    var me = $('.progress .bar');
    var perc = 100;

    var current_perc = 0;

    var progress = setInterval(function() {
        if(curr_status_width<status_width && delayed_tasks.length==0){
            curr_status_width += project_status_interval_width;

        }
        if(curr_status_width>status_width){
            curr_status_width = status_width;
        }
        me.css('width', (curr_status_width)+'%');
    },status_bar_timeline_interval);

    return progress;
};

var stopProjectStatus = function(){
    var me = $('.progress .bar');
    me.css('width', curr_status_width+'%');
    window.clearInterval(project_status_handler);
};

function init_statusBar(status_bar_timeline_interval){
    var last_group_num=-1;
    var last_end_x=0;

    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x+4;  //CHECK with Jay
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        
        /*console.log("start_x",start_x);
        console.log("width",width);
        console.log("here2");
        console.log("end_time",groupNum +" "+ parseFloat(end_x)/100);
        */
        if(last_end_x<end_x){
            last_end_x=end_x;
        }
        
    }
   // last_end_x=parseFloat(last_end_x)/50*thirty_min; //TODO change to width
   //console.log("last_end",last_end_x);
   project_duration=parseInt(last_end_x/50)*thirty_min;
   //console.log("project duration: ",project_duration);

   num_intervals=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
   project_status_interval_width=parseFloat(status_width)/parseFloat(num_intervals);
}


function load_statusBar(status_bar_timeline_interval){

    //pause if a task is delayed
    if(delayed_tasks.length != 0){

        var start_delayed_x;  //CHECK with Jay
        var width_delayed;
        var end_delayed_x;
        
        for (var i = 0; i<task_groups.length; i++){
            var data = task_groups[i];
            var groupNum = data.groupNum;
            
            
            if (groupNum == delayed_tasks[0]){

                start_delayed_x = data.x+4;  //CHECK with Jay
                var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
                width_delayed = getWidth(ev);
                end_delayed_x = parseFloat(start_delayed_x) + parseFloat(width_delayed);
                

                break;
            }
        }

        var last_group_num=-1;
        var last_end_x=0;

        for (var i=0;i<task_groups.length;i++){
            var data = task_groups[i];
            var groupNum = data.groupNum;

            var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

            var start_x = ev.x+4;  //CHECK with Jay
            var width = getWidth(ev);
            var end_x = parseFloat(start_x) + parseFloat(width);
            
            if(last_end_x<end_x){
                last_end_x=end_x;
            }
            
        }
        
        // last_end_x=parseFloat(last_end_x)/50*thirty_min; //TODO change to width
        //console.log("last_end",last_end_x);
        var cursor_x = cursor.attr("x1");
        project_duration=parseInt((last_end_x)/50)*thirty_min;
        //console.log("project duration: ",project_duration);

        num_intervals=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
        project_status_interval_width=parseFloat(status_width)/parseFloat(num_intervals);


        curr_status_width = status_width * parseFloat(end_delayed_x)/parseFloat(last_end_x);

        return;    
    }

    if (flashTeamsJSON["startTime"] == null ){
        return;
    }
    
    var currTime = (new Date).getTime();
    
    var startTime = flashTeamsJSON["startTime"];
    var diff = currTime - startTime;
    var diff_sec = diff/1000;


    var last_group_num=-1;
    var last_end_x=0;

    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x+4;  //CHECK with Jay
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        
        if(last_end_x<end_x){
            last_end_x=end_x;
        }        
    }

   // last_end_x=parseFloat(last_end_x)/50*thirty_min; //TODO change to width
   //console.log("last_end",last_end_x);
   project_duration=parseInt(last_end_x/50)*thirty_min;
   //console.log("project duration: ",project_duration);

   num_intervals=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
   project_status_interval_width=parseFloat(status_width)/parseFloat(num_intervals);

   curr_status_width = project_status_interval_width * diff_sec;
}
var status_interval_id;

var setProjectStatusMoving = function(){
    return moveProjectStatus(status_bar_timeline_interval);
};

/* --------------- PROJECT STATUS BAR END ------------ */
;
var oDeskCategories = {
	"--oDesk Category--": [],
	"Web Development": [
		"All Web Development",
		"Ecommerce",
		"UI Design",
		"Web Design",
		"Web Programming",
		"Website Project Management",
		"Website QA",
		"Other - Web Development"
	],
	"Software Development": [
		"All Software Development",
		"Application Interface Design",
		"Desktop Applications",
		"Game Development",
		"Mobile Apps",
		"Scripts & Utilities",
		"Software Plug-ins",
		"Software Project Management",
		"Software QA",
		"VOIP",
		"Other - Software Development",
	],
	"Networking & Information Systems": [
		"All Networking & Information Systems",
		"DBA - Database Administration",
		"ERP / CRM Implementation",
		"Network Administration",
		"Server Administration",
		"Other - Networking & Information Systems"
	], 
	"Writing & Translation": [
		"All Writing & Translation",
		"Blog & Article Writing",
		"Copywriting",
		"Creative Writing",
		"Technical Writing",
		"Translation",
		"Website Content",
		"Other - Writing & Translation"
	],
	"Administrative Support": [
		"All Administrative Support",
		"Data Entry",
		"Email Response Handling",
		"Personal Assistant",
		"Transcription",
		"Web Research",
		"Other - Administrative Support"
	],
	"Design & Multimedia": [
		"All Design & Multimedia",
		"3D Modeling & CAD",
		"Animation",
		"Audio Production",
		"Engineering & Technical Design",
		"Graphic Design",
		"Illustration",
		"Logo Design",
		"Presentations",
		"Print Design",
		"Video Production",
		"Voice Talent",
		"Other - Design & Multimedia"
	],
	"Customer Service": [
		"All Customer Service",
		"Customer Service & Support",
		"Order Processing",
		"Phone Support",
		"Technical Support",
		"Other - Customer Service"
	],
	"Sales & Marketing": [
		"All Sales & Marketing",
		"Advertising",
		"Business Plans & Marketing Strategy",
		"Email Marketing",
		"Market Research & Surveys",
		"PR - Public Relations",
		"SEM - Search Engine Marketing",
		"SEO - Search Engine Optimization",
		"SMM - Social Media Marketing",
		"Sales & Lead Generation",
		"Telemarketing & Telesales",
		"Other - Sales & Marketing"
	], 
	"Business Services": [
		"All Business Services",
		"Accounting",
		"Bookkeeping",
		"Business Consulting",
		"Financial Services & Planning",
		"HR / Payroll",
		"Legal",
		"Payment Processing",
		"Project Management",
		"Recruiting",
		"Statistical Analysis",
		"Other - Business Services"
	]
};

var availableMembers = [
	"3D Modeling & CAD",
	"Accounting",
	"Advertising",
	"Animation",
	"Application Interface Design",
	"Audio Production",
	"Blog & Article Writing",
	"Bookkeeping",
	"Business Consulting",
	"Business Plans & Marketing Strategy",
	"Copywriting",
	"Creative Writing",
	"Customer Service & Support",
	"Data Entry",
	"DBA - Database Administration",
	"Desktop Applications",
	"Ecommerce",
	"Email Marketing",
	"Email Response Handling",
	"Engineering & Technical Design",
	"ERP/CRM Implementation",
	"Financial Services & Planning",
	"Game Development",
	"Graphic Design",
	"HR/Payroll",
	"Illustration",
	"Legal",
	"Logo Design",
	"Market Research & Surveys",
	"Mobile Apps",
	"Network Administration",
	"Order Processing",
	"Other - Administrative Support",
	"Other - Business Services",
	"Other - Customer Service",
	"Other - Design & Multimedia",
	"Other - Networking & Information Systems",
	"Other - Sales & Marketing",
	"Other - Software Development",
	"Other - Web Development",
	"Other - Writing & Translation",
	"Payment Processing",
	"Personal Assistant",
	"Phone Support",
	"Presentations",
	"Print Design",
	"Project Management",
	"PR - Public Relations",
	"Recruiting",
	"Sales & Lead Generation",
	"Scripts & Utilities",
	"SEM - Search Engine Marketing",
	"SEO - Search Engine Optimization",
	"Server Administration",
	"SMM - Social Media Marketing",
	"Software Plug-ins",
	"Software Project Management",
	"Software QA",
	"Statistical Analysis",
	"Technical Support",
	"Technical Writing",
	"Telemarketing & Telesales",
	"Transcription",
	"Translation",
	"Video Production",
	"Voice Talent",
	"VOIP",
	"Web Design",
	"Web Programming", 
	"Web Research",
	"Website Content",
	"Website Project Management",
	"Website QA",
	"UI Design",
	"UX Research"
];

var oSkills = [
	"skill",
	"shopify",
	"astrology",
	"labview",
	"axure",
	"scripting",
	"phing",
	"business-plans",
	"google-app-engine",
	"bank-reconciliation",
	"apple-iweb",
	"spacewalk",
	"autodesk-mudbox",
	"freebsd",
	"soap",
	"informix",
	"asterisk",
	"seo",
	"sap-me",
	"security-testing",
	"siemens-nx",
	"pbwiki",
	"intersystems-cache",
	"netsuite-development",
	"character-design",
	"autodesk-maya",
	"myspace",
	"filing",
	"orcad",
	"rpg",
	"openbsd",
	"zope",
	"nursing",
	"oracle-database",
	"sage",
	"french",
	"windows-movie-maker",
	"scriptaculous",
	"german",
	"basic",
	"windev",
	"penetration-testing",
	"c",
	"mcse",
	"ansys",
	"mootools",
	"autodesk-3d-studio-max",
	"adobe-acrobat",
	"cad-design",
	"interspire",
	"cooking",
	"opengl-es",
	"baking",
	"keyboarding",
	"zk",
	"subtitling",
	"zencart",
	"stata",
	"peoplesoft",
	"oral-communication",
	"mechanical-engineering",
	"poetry",
	"loadrunner",
	"jaxb",
	"solidworks",
	"routers",
	"apple-motion",
	"multithreading",
	"computer-hardware",
	"swishmax",
	"winforms",
	"creative-writing",
	"lead-generation",
	"microsoft-office",
	"gnu",
	"link-building",
	"training",
	"https",
	"microsoft-powerpoint",
	"linq",
	"gaming",
	"real-estate",
	"maven",
	"linux-system-administration",
	"finale",
	"isa-server",
	"sqa",
	"iis",
	".net",
	"docbook",
	"jndi",
	"visual-basic",
	"grails",
	"construction",
	"typesetting",
	"online-assistant",
	"gis",
	"xoops",
	"welding",
	"cost-accounting",
	"corba",
	"disaster-recovery",
	"video-editing",
	"tutoring",
	"smo",
	"tourism",
	"ssl",
	"sphinx",
	"adobe-illustrator",
	"outsourcing",
	"google-maps-api",
	"technical-writing",
	"data-warehousing",
	"autodesk-autocad",
	"hp-ux",
	"camtasia",
	"hardware-troubleshooting",
	"ukrainian",
	"ada",
	"wan",
	"open-office",
	"windows-administration",
	"analysis",
	"mainframe",
	"grant-writing",
	"lamp-administration",
	"benefits",
	"hp-quality-center",
	"ffmpeg",
	"infusionsoft",
	"apache-mahout",
	"recommender-systems",
	"chrome-extension",
	"kentico",
	"jomsocial",
	"comet",
	"econometrics",
	"visualforce",
	"webisodes",
	"sdlx",
	"pfsense",
	"product-management",
	"apache-poi",
	"freeswitch",
	"drums",
	"translation-bulgarian-english",
	"translation-english-albanian",
	"translation-english-croatian",
	"translation-english-galician",
	"translation-english-hungarian",
	"translation-english-latin",
	"translation-english-polish",
	"translation-english-swahili",
	"translation-english-vietnamese",
	"translation-french-spanish",
	"translation-haitian-creole-english",
	"translation-japanese-english",
	"translation-maltese-english",
	"translation-serbian-english",
	"translation-telugu-english",
	"twitter-bootstrap",
	"pestel",
	"white-paper-writing",
	"eyeon-fusion",
	"lucene-search",
	"rapid-miner",
	"pattern-recognition",
	"brand-consulting",
	"toktumi",
	"actian",
	"autodesk-revit",
	"unify-team-developer",
	"corona-sdk",
	"google-sites",
	"twilio-api",
	"ocr-tesseract",
	"qhse",
	"mcda",
	"test-driven-development",
	"articulate-authoring-tool",
	"gemvision-claytrix",
	"grasshoper-virtual-phone",
	"wilcom-embroidery-digitization",
	"d-language",
	"radio-show-hosting",
	"cnc-programming",
	"aspectjs",
	"intellij-idea",
	"ahmaric",
	"chroma-key",
	"fraud-mitigation",
	"section-508-compliance",
	"caricature-drawing",
	"kerberos",
	"syncsort",
	"ablecommerce",
	"netezza",
	"itk",
	"photo-manipulation",
	"autolisp",
	"xilinx",
	"haxe",
	"opentype",
	"arduino",
	"pdf-conversion",
	"r-project",
	"selenium-webdriver",
	"mechatronics",
	"openx",
	"meego",
	"snort",
	"acrylic-painting",
	"apache-cxf",
	"applicant-tracking-systems",
	"atmel-avr",
	"b2b-marketing",
	"biography-writing",
	"broadvision-quicksilver",
	"business-models",
	"call-handling",
	"check-point",
	"comsat",
	"corel-painter",
	"defect-tracking",
	"document-conversion",
	"emc-symmetrix",
	"fashion-modeling",
	"foursquare-api",
	"google-gadgets-api",
	"central-reservation-systems",
	"idrisi",
	"internal-auditing",
	"jingle-program-production",
	"limejs",
	"magic-bullet-looks",
	"medical-illustration",
	"microsoft-excel-powerpivot",
	"microsoft-sql-ce",
	"microstock-photography",
	"mozenda-scraper",
	"ni-multisim",
	"oracle-obiee-plus",
	"ormlite",
	"policy-writing",
	"press-advertising",
	"quartz-composer",
	"remote-computer-repair",
	"salesgenie-dot-com",
	"spiral-graphics-genetica",
	"stock-management",
	"system-automation",
	"the-pixel-farm-pftrack",
	"urban-design",
	"vidvox-vdmx",
	"windev-mobile",
	"zaxwerks",
	"oracle-primavera",
	"ad-posting",
	"google-app-engine-api",
	"google-plus-api",
	"qt",
	"jboss",
	"asp.net-mvc",
	".net-framework",
	"windows-xp-administration",
	"avid-pro-tools",
	"website-prototyping",
	"microsoft-visual-c++",
	"mac-os-app-development",
	"lan-implementation",
	"microsoft-kinect-development",
	"zillow-marketing",
	"model-sheet-design",
	"zend-studio",
	"paypal-api",
	"retail-ops-management",
	"yandex-matrixnet",
	"xen-hypervisor",
	"microsoft-outlook-development",
	"corporate-law",
	"newsletter-writing",
	"adobe-pdf",
	"windows-forms-development",
	"windows-phone",
	"nfs-implementation",
	"web-os-app-development",
	"velocity-template-engine",
	"mapi",
	"olap",
	"smpp",
	"calculus",
	"rhel",
	"vtk",
	"informatica",
	"civicrm",
	"freepbx",
	"hris",
	"economics",
	"centreon",
	"cricket",
	"ekiga",
	"first-aid",
	"translation-arabic-english",
	"amazon-s3",
	"miva-merchant",
	"travel-agent",
	"voicexml",
	"vba",
	"sql",
	"xml",
	"postgresql",
	"agile",
	"sqlite",
	"xhtml",
	"zillow",
	"ruby",
	"hi5",
	"sap-2000",
	"serial-port-interfacing",
	"writing-slang-style",
	"kindle-app-development",
	"raid-administration",
	"ocx",
	"japanese",
	"chinese",
	"data-scraping",
	"photoscape",
	"science",
	"mathematics",
	"oracle-pl/sql",
	"blazeds",
	"physics",
	"direct-marketing",
	"mfc",
	"computer-networking",
	"autoit",
	"peachtree-accounting",
	"tfs",
	"italian",
	"atlas",
	"speech-writing",
	"localization",
	"mediawiki",
	"nfs",
	"telerik",
	"embedded-linux",
	"business-writing",
	"spreadsheets",
	"installshield",
	"testcomplete",
	"bookkeeping",
	"oil-painting",
	"modx",
	"arabic",
	"perforce",
	"chat-support",
	"romanian",
	"live-chat",
	"leadership",
	"insurance-consulting",
	"friendster",
	"football",
	"yahoo-search-marketing",
	"rdbms",
	"expression-engine",
	"ibm-db2",
	"ssis",
	"directshow",
	"ebooks",
	".net-compact-framework",
	"openvz",
	"windows-xp",
	"rational-rose",
	"ssh",
	"phpbb",
	"research-papers",
	"web-content-management",
	"fashion-designing",
	"presentations",
	"selenium",
	"yii-framework",
	"cocos2d",
	"swedish",
	"security",
	"crystal-reports",
	"mail-servers",
	"rendering",
	"jms",
	"intranet",
	"tax-preparation",
	"proe",
	"simulink",
	"stl",
	"script-writing",
	"film",
	"appointment-setting",
	"twitter-api",
	"test",
	"systems-programming",
	"nuendo",
	"six-sigma",
	"google-searching",
	"counseling",
	"visual-foxpro",
	"pay-per-click",
	"typography",
	"supervisory-skills",
	"linq-to-sql",
	"paint.net",
	"trac",
	"adobe-audition",
	"switches",
	"erlang",
	"jbpm",
	"calendar-management",
	"ubuntu",
	"virus-removal",
	"datastage",
	"ghostwriting",
	"editorial-writing",
	"microsoft-exchange-server",
	"network-administration",
	"fl-studio",
	"cuda",
	"paralegal",
	"squid",
	"j2ee",
	"joomla",
	"malay",
	"persian",
	"sencha",
	"ecmascript",
	"collaborative-filtering",
	"firefox-plugin",
	"microsoft-hyper-v-server",
	"vlsi",
	"varnish",
	"simpledb",
	"sqr",
	"openacs",
	"shoutcast",
	"fundraising",
	"ingress",
	"croatian",
	"cartography",
	"ab-initio",
	"kvm",
	"capistrano",
	"amqp",
	"e-publishing",
	"vbseo",
	"beos",
	"translation-catalan-english",
	"translation-english-arabic",
	"translation-english-czech",
	"translation-english-georgian",
	"translation-english-icelandic",
	"translation-english-latvian",
	"translation-english-portuguese",
	"translation-english-swedish",
	"translation-english-welsh",
	"translation-galician-english",
	"translation-hebrew-english",
	"translation-kannada-english",
	"translation-norwegian-english",
	"translation-slovak-english",
	"translation-thai-english",
	"web-os",
	"pinnacle-studio",
	"filezilla-ftp",
	"rackspace-cloudservers",
	"electronic-funds-transfer",
	"q-os",
	"distributed-computing",
	"autocad-civil3d",
	"apache-tiles",
	"inventory-management",
	"autodesk-navisworks",
	"csu/dsu",
	"prezi-presentations",
	"vugen-scripting",
	"risk-assessment",
	"microstation-v8",
	"sinatra-framwork",
	"ibm-storage",
	"winautomation-scripting",
	"investigative-reporting",
	"terrdata",
	"bio-informatics",
	"federal-acquisition-regulations",
	"artificial-intelligence",
	"madcap-flare",
	"licensing-consulting",
	"apache-shirol",
	"fuel-cms",
	"ad-paste",
	"psychometric-examinination",
	"venture-capital-consulting",
	"islamic-theology",
	"ims",
	"teamviewer",
	"ogre",
	"fontforge",
	"plumbing",
	"openvbx",
	"openlayers",
	"merise",
	"glsl",
	"sap-erp",
	"vizrt",
	"game-design",
	"multi-touch",
	"make",
	"yoga",
	"libgdx",
	"wp-ecommerce",
	"mailenable",
	"1shoppingcart",
	"demandware",
	"author-it",
	"active-listening",
	"apache-hive",
	"art-direction",
	"audio-restoration",
	"backbone-js",
	"bitrock-installbuilder",
	"bug-tracking-systems",
	"applescript",
	"creloaded",
	"cryptography",
	"driving",
	"directx",
	"vbscript",
	"selling",
	"vicidial",
	"max",
	"openvms",
	"rfid",
	"radius",
	"git",
	"skype",
	"away3d",
	"objective-j",
	"linkvana",
	"project-management",
	"palm",
	"palmos",
	"mambo",
	"asp",
	"phpnuke",
	"xul",
	"ajax",
	"scale-modeling",
	"session-description-protocol",
	"sparx-systems-enterprise-architect",
	"meego-development",
	"sap-sybase-adaptive-server-enterprise",
	"blog-commenting",
	"cakephp",
	"microsoft-navision",
	"wxwidgets",
	"sales",
	"journalism",
	"tibco",
	"apache",
	"particle-illusion",
	"microsoft-outlook",
	"rim-development",
	"dom",
	"unix",
	"red5",
	"article-writing",
	"electronics",
	"vtiger",
	"dhcp",
	"ldap",
	"games",
	"ado.net",
	"print-design",
	"audacity",
	"symfony",
	"communication-skills",
	"operations-management",
	"google-apps",
	"arcgis",
	"dsl-troubleshooting",
	"iphone-development",
	"design",
	"urdu",
	"3d-design",
	"order-entry",
	"accounting",
	"facebook-marketing",
	"3d-modeling",
	"vsam",
	"mantis",
	"data-collection",
	"computer-assembly",
	"clerical-skills",
	"oracle-siebel-crm",
	"facilitating",
	"vray",
	"node.js",
	"whm",
	"mongrel",
	"turkish",
	"msn-adcenter",
	"media-relations",
	"trixbox",
	"dcom",
	"fbml",
	"ulead-video-studio",
	"apple-xcode",
	"wix",
	"adobe-premiere",
	"business-intelligence",
	"trados",
	"mvc",
	"google-sketchup",
	"regular-expressions",
	"freemarker",
	"cairngorm",
	"cartooning",
	"microsoft-sql-server",
	"mercurial",
	"dojo",
	"apple-iwork",
	"web-design",
	"c#",
	"drafting",
	"final-cut-pro",
	"grammar",
	"adobe-fireworks",
	"sendmail",
	"gui-design",
	"database-management",
	"office-administration",
	"awt",
	"3d-animation",
	"adobe-after-effects",
	"faxing",
	"devexpress",
	"borland-c++-builder",
	"video-streaming",
	"bash",
	"quartz",
	"sony-vegas",
	"firewalls",
	"amazon-ec2",
	"supply-chain-management",
	"mastercam",
	"black-box-testing",
	"english",
	"velocity",
	"mathematica",
	"cisco-ios",
	"packaging-design",
	"mac-os-x",
	"web-sphere",
	"inbound-marketing",
	"omnigroup-omnigraffle",
	"typepad",
	"activex",
	"sibelius",
	"data-mining",
	"phonegap",
	"object-oriented-design",
	"e-pub-formatting",
	"api-development",
	"yahoo-store",
	"greenplum",
	"mocha",
	"apache-solr",
	"splunk",
	"nosql",
	"bitrix",
	"primefaces",
	"jenkins",
	"servoy",
	"lectora",
	"github",
	"slovak",
	"textpattern",
	"mpls",
	"openwrt",
	"wordfast",
	"screencasting",
	"silverstripe",
	"qooxdoo",
	"balsamiq",
	"reverse-engineering",
	"puppet",
	"linq-to-entities",
	"translation-afrikaans-english",
	"translation-croatian-english",
	"translation-english-belariusan",
	"translation-english-dutch",
	"translation-english-greek",
	"translation-english-irish",
	"translation-english-macedonian",
	"translation-english-russian",
	"translation-english-telugu",
	"translation-estonian-english",
	"translation-german-english",
	"translation-hungarian-english",
	"translation-latin-english",
	"translation-polish-english",
	"translation-spanish-english",
	"translation-ukrainian-english",
	"adobe-robohelp",
	"xbox-game-development",
	"electrical-engineering",
	"razor-template-engine",
	"3d-rigging",
	"ggplot2",
	"iso-9001",
	"crazytask",
	"comsol-multiphysics",
	"python-scipy",
	"semantic-web",
	"salary-surveys",
	"entity-framwork",
	"q-language",
	"cisco-voip",
	"international-tax-law",
	"merchant-run",
	"business-valuation",
	"ebay-motors",
	"pervasive-software",
	"sentiment-analysis",
	"survey-monkey",
	"sermon-writing",
	"kitchen-draw",
	"panoramic-stitching",
	"cakewalk-sonar",
	"ksh-korn-shell",
	"lithium-framework",
	"tealeaf",
	"vulnerability-assessment",
	"christian-theology",
	"3d-rendering",
	"orchardcms",
	"ipmi",
	"postediting",
	"squarespace",
	"screenwriting",
	"ocaml",
	"betfair",
	"artrage",
	"shiva3d",
	"clickbank",
	"directory-submission",
	"transcreation",
	"adobe-content-server",
	"apache-thrift",
	"artlantis-render",
	"autodesk-softimage",
	"data-backup",
	"blitz-basic",
	"building-regulations",
	"business-proposal-writing",
	"cavium-octeon-mips64",
	"cisco-pix",
	"conflict-resolution",
	"cover-letter-writing",
	"desktop-publishing",
	"ebook-writing",
	"business-process-modelling",
	"caricature-art",
	"chemical-engineering",
	"concept-sw-inpage",
	"corporate-finance",
	"delftship",
	"dwolla-api",
	"energy-industry-consulting",
	"font-development",
	"franchise-consulting",
	"google-reader",
	"hp-nmc",
	"image-processing",
	"interprise-suite-erp",
	"job-description-writing",
	"linkedin-api",
	"magic-tricks",
	"medical-imaging",
	"microsoft-hyper-v",
	"microsoft-sql-server-notification-services",
	"mind-mapping",
	"music-dubbing",
	"non-disclosure-agreements",
	"oracle-complex-events-processing",
	"oracle-rac",
	"performance-tuning",
	"portait-painting",
	"punch-home-design-studio-pro",
	"raphael-js",
	"ratail-sales-management",
	"sap-bsp",
	"static-html",
	"structured-cabling",
	"tekla-structures",
	"travel-writing",
	"uv-mapping",
	"wardrobe-styling",
	"workshop-facilities",
	"zoho-crm",
	"legal-advice",
	"oracle-hyperion",
	"axiom-microstation-productivity-toolkit",
	"sensable-claytrix",
	"tastypie",
	"android-app-development",
	"google-adwords-api",
	"sculpting",
	"finnish",
	"autodesk",
	"ebay-marketing",
	"infusionsoft-administration",
	"mail-server-implementation",
	"database-caching",
	"microsoft-infopath",
	"google-sites-administration",
	"webisode-production",
	"wireless-security",
	"energy-engineering",
	"gps-development",
	"adobe-digital-marketing-suite",
	"intuit-quicken",
	"guitar-composition",
	"computer-hw-installation",
	"lan-administration",
	"ms-dos-administration",
	"windows-nt-administration",
	"ibm-websphere",
	"email-technical-support",
	"logmein-rescue",
	"intranet-architecture",
	"violin-composition",
	"twitter",
	"amazon",
	"polish",
	"pbx",
	"authorize.net",
	"scorm",
	"dts",
	"raid",
	"svn",
	"blackboard",
	"e-learning",
	"logo",
	"opensips",
	"pentaho",
	"producer",
	"sap-mm",
	"acdsee",
	"email-handling",
	"mpd",
	"notary-public",
	"final-draft",
	"ap-style",
	"cobol",
	"recruiting",
	"python",
	"smarty",
	"sap-netweaver",
	"wordpress",
	"sequential-art",
	"silex-framework",
	"nav-system-implementation",
	"toon-boom-studio",
	"keynote",
	"teaching-english",
	"visual-c++",
	"oop",
	"newsletters",
	"blender",
	"eclipse",
	"rtos",
	"opengl",
	"intuit-quickbooks",
	"com",
	"statistics",
	"jd-edwards",
	"stored-procedures",
	"gwt",
	"html5",
	"photography",
	"cpanel",
	"xsd",
	"ebay",
	"social-media-marketing",
	"budgeting",
	"windows-7",
	"microcontroller",
	"singing",
	"red-hat-linux",
	"xsl",
	"customer-service",
	"centos",
	"public-speaking",
	"memcached",
	"goldmine",
	"xampp",
	"video-production",
	"copywriting",
	"on-page-optimization",
	"visual-basic.net",
	"web-services",
	"administration",
	"rhinoceros-3d",
	"adobe-flex",
	"article-spinning",
	"android-sdk",
	"software-development",
	"financial-analysis",
	"brew",
	"helpdesk-support",
	"database-administration",
	"tortoise-svn",
	"verilog",
	"algebra",
	"nhibernate",
	"logistics",
	"phpfox",
	"wordperfect",
	"interviewing",
	"avaya",
	"unrealscript",
	"protools",
	"irc",
	"robotics",
	"data-entry",
	"wicket",
	"amanda",
	"virtuoso",
	"jncia-junos",
	"iseb",
	"qscad",
	"forex-trading",
	"linux",
	"oscommerce",
	"jsp",
	"php",
	"dotnetnuke",
	"scientific-writing",
	"short-story-writing",
	"spine-dot-js",
	"multi-touch-hw-development",
	"tealeaf-cximpact",
	"sap-abap",
	"wamp",
	"express-scribe",
	"internet-applications",
	"tapestry",
	"lisp",
	"technical-analysis",
	"legal-research",
	"electronic-workbench",
	"cisco-routers",
	"load-testing",
	"robohelp",
	"tally",
	"fortran",
	"animation",
	"ospf",
	"sip",
	"odbc",
	"engineering",
	"xslt",
	"clustering",
	"advertising",
	"mcsa",
	"snmp",
	"myob",
	"microsoft-windows",
	"jboss-seam",
	"corel-draw",
	"sculpture",
	"omniture",
	"autodesk-inventor",
	"adobe-creative-suite",
	"jquery",
	"interpreting",
	"lexis-nexis",
	"microsoft-access",
	"acting",
	"danish",
	"computer-technician",
	"2d-animation",
	"google-spreadsheet",
	"dns",
	"flyer-design",
	"buddypress",
	"email-marketing",
	"american-sign-language",
	"data-analysis",
	"word-perfect",
	"westlaw",
	"crm",
	"opencv",
	"video",
	"x-cart",
	"objective-c",
	"rup",
	"microsoft-word",
	"ruby-on-rails",
	"linkedin",
	"django-framework",
	"ios-development",
	"sony-acid-pro",
	"ui-design",
	"oracle-apex",
	"medical-transcription",
	"devex",
	"event-planning",
	".net-remoting",
	"gmail",
	"cocoa-touch",
	"junit",
	"rhce",
	"cloud-computing",
	"account-management",
	"juniper",
	"jasperreports",
	"prestashop",
	"rmi",
	"network-solutions",
	"html",
	"broadcasting",
	"liferay",
	"google-adsense",
	"database-modeling",
	"skype-development",
	"fine-art",
	"android-development",
	"operating-systems",
	"archicad",
	"pear",
	"blog-writing",
	"apache-ant",
	"affiliate-marketing",
	"custom-cms",
	"x86-assembler",
	"cgi",
	"rewriting",
	"informatique",
	"social-bookmarking",
	"database-testing",
	"captcha",
	"strategic-planning",
	"apex",
	"latex",
	"sem",
	"clojure",
	"pashto",
	"boonex-dolphin",
	"odesk-api",
	"information-architecture",
	"central-desktop",
	"tableau",
	"nopcommerce",
	"datalife-engine",
	"xrumer",
	"libreoffice",
	"scalr",
	"redmine",
	"storyboarding",
	"unify",
	"crawlers",
	"knockoutjs",
	"sapphire",
	"photo-editing",
	"auctiva",
	"infographics",
	"midi",
	"evolus-pencil",
	"performance-testing",
	"haskell",
	"bpo",
	"ielts",
	"turbo-c",
	"book-cover-design",
	"microsoft-sharepoint",
	"mathcad",
	"act",
	"yahoo-messenger",
	"netbeans",
	"coaching",
	"adobe-lightroom",
	"document-review",
	"garageband",
	"article-submission",
	"spring-framework",
	"assembly-language",
	"youtube",
	"groovy",
	"sms",
	"matlab",
	"jpa",
	"cucumber",
	"sugar-crm",
	"computer-literacy",
	"payment-processing",
	"image-editing",
	"adobe-captivate",
	"voice-talent",
	"teaching",
	"ado",
	"lotus-domino",
	"xquery",
	"atlassian-jira",
	"scala",
	"hebrew",
	"jstl",
	"sas",
	"prolog",
	"pixologic-zbrush",
	"j2se",
	"shorthand",
	"adobe-flash",
	"forum-posting",
	"logo-design",
	"process-improvement",
	"samba",
	"portuguese",
	"iptables",
	"subversion",
	"music-composing",
	"infragistics",
	"aix",
	"ecommerce-consulting",
	"financial-management",
	"mql4",
	"word-processing",
	"audio-engineer",
	"revit-architecture",
	"banner",
	"boost",
	"report-writing",
	"computer-maintenance",
	"translation",
	"facebook",
	"c++",
	"blackberry",
	"compositing",
	"maxon-bodypaint-3d",
	"forum-moderation",
	"motion-graphics",
	"weblogic",
	"lemonstand",
	"calligraphy",
	"papervision3d",
	"laserpro",
	"translation-bengali-english",
	"translation-english-afrikaans",
	"translation-english-chinese",
	"translation-english-french",
	"translation-english-hindi",
	"translation-english-korean",
	"translation-english-persian",
	"translation-english-spanish",
	"translation-english-urdu",
	"translation-french-german",
	"translation-gujarati-english",
	"translation-italian-english",
	"translation-malay-english",
	"translation-russian-english",
	"translation-tamil-english",
	"translation-yiddish-english",
	"unreal-development-kit",
	"people-code",
	"edufire",
	"windows-8-metro",
	"adobe-business-catalyst",
	"supervised-learning",
	"survey-design",
	"environmental-science",
	"xara-designer",
	"testng-framework",
	"media-buying",
	"perl-mojolicious",
	"adobe-livecycle",
	"eagle-pcb",
	"startup-consulting",
	"articulate-studio",
	"pomodoro-technique",
	"simple-directmedia-layer",
	"pinterest",
	"spring-security",
	"buildium",
	"landscape-design",
	"website-baker",
	"facebook-games-development",
	"email-deliverability-consulting",
	"pmds",
	"lotus-approach",
	"circuit-design",
	"engineering-drawing",
	"catholic-theology",
	"webeeh",
	"traffic-geyser",
	"biostatistics",
	"hbase",
	"vertica",
	"mockito",
	"devops",
	"aviation",
	"essbase",
	"foursquare",
	"gearman",
	"apollo",
	"phpmyadmin",
	"autohotkey",
	"sap-basis",
	"sap-wm",
	"opensocial",
	"heroku",
	"worldspan",
	"3d-printing",
	"apache-camel",
	"apple-webobjects",
	"atlassian-greenhopper",
	"aveva-pdms",
	"bgl-simple-fund",
	"broadvision-clearvale",
	"business-intelligence-tools",
	"call-center-management",
	"chaos-group-v-ray",
	"comic-writing",
	"corel-paint-shop-pro",
	"database-cataloguing",
	"dinamica-ego",
	"trade-show-exhibition-design",
	"faac",
	"firmware-development",
	"go-programming-language",
	"home-automation",
	"ibm-spss",
	"data-recovery",
	"field-map",
	"frontend-development",
	"google-plus",
	"hvac-system-design",
	"information-builders-webfocus",
	"irs-income-tax-audits",
	"kixtart",
	"live-chat-software",
	"management-development",
	"medical-writing",
	"microsoft-kinect",
	"microsoft-sql-server-service-broker",
	"model-sheets",
	"network-planning",
	"occupational-health",
	"oracle-fusion-middleware",
	"oracle-ucm",
	"physical-fitness",
	"prado-php-framework",
	"pure-data",
	"realist-painting",
	"rhodes-framework",
	"sap-crm",
	"steinberg-wavelab",
	"sustainable-energy",
	"test-case-design",
	"ulead-cool-3d",
	"valgrind",
	"web-testing",
	"wrap-advertising",
	"backlinking",
	"audio-post-production",
	"sms-gateway",
	"windows-media-connect",
	"laser-engraving",
	"mrtg",
	"ipad-app-development",
	"drop-shipping",
	"google-sites-api",
	"seo-keyword-research",
	"windows-7-administration",
	"microsoft-dynamics-crm",
	"journalism-writing",
	"mikrotik-routeros",
	"microcontroller-design",
	"systems-development",
	"civil-law",
	"multi-touch-programming",
	"make-build-script",
	"stored-procedure-development",
	"ipad-ui-design",
	"economic-analysis",
	"radio-broadcasting",
	"autodesk-autocad-civil3d",
	"alfresco-user",
	"child-counseling",
	"adobe-premiere-pro",
	"graphics-programming",
	"kvm-switches",
	"tally-shoper",
	"bpo-it-services",
	"adobe-insight",
	"webisode-presentation",
	"music-producer",
	"junos",
	"axapta",
	"cassandra",
	"bigcommerce",
	"web-scraping",
	"n2cms",
	"cold-calling",
	"sass",
	"activecollab",
	"sketching",
	"quickfix",
	"pyqt",
	"aweber",
	"osgi",
	"avactis",
	"zoomla",
	"iclone",
	"weebly",
	"translation-armenian-english",
	"translation-danish-english",
	"translation-english-bulgarian",
	"translation-english-filipino",
	"translation-english-haitian-creole",
	"translation-english-japanese",
	"translation-english-maltese",
	"translation-english-slovak",
	"translation-english-turkish",
	"translation-finnish-english",
	"translation-german-polish",
	"translation-indonesian-english",
	"translation-lithuanian-english",
	"translation-portuguese-english",
	"translation-swahili-english",
	"translation-vietnamese-english",
	"google-analytics-api",
	"windows-azure",
	"parallels-virtual-desktop",
	"ibm-pseries",
	"geartrax",
	"good-data",
	"process-architect",
	"plc-programming",
	"google-accounts",
	"texture-artistry",
	"apahce-nutch",
	"genetic-algorithms",
	"natural-language-processing",
	"basson",
	"kaltural",
	"ethical-hacking",
	"embroidery-digitization",
	"ngcore",
	"video-ripping",
	"gemvision-matrix",
	"joomla-fabrik",
	"automated-testing",
	"rhinoservicebus",
	"appian",
	"microsoft-small-business-server",
	"real-estate-law",
	"soundtrack-pro",
	"architectural-rendering",
	"sdl-passolo",
	"smartfox-server",
	"sassie-mystery-shopping",
	"mvvm-entity-framework",
	"martial-arts",
	"underwriting",
	"senuke-x",
	"maemo",
	"papercraft",
	"logixml",
	"ektron",
	"robotframework",
	"minecraft",
	"merchandising",
	"amadeus",
	"tapi",
	"banner-design",
	"saasu",
	"quality-assurance",
	"rets",
	"interactive-voice-response",
	"jig-and-fixture-design",
	"lightworks",
	"magic-bullet-colorista",
	"medical-billing-coding",
	"microsoft-dynamics",
	"microsoft-sql-ssas",
	"ms-visual-studio-lightswitch",
	"motivational-speaking",
	"next-limit-realflow",
	"oracle-brm",
	"pcap",
	"polymer-clay-sculpting",
	"property-tax",
	"radiant-cms",
	"reputation-management",
	"sap-analysis",
	"sql-clr",
	"stress-management",
	"talend-open-studio",
	"trade-marketing",
	"corporate-tax",
	"visual-dataflex",
	"windows-template-library",
	"zennolab-zennoposter",
	"bitrix-intranet",
	"ingress-filtering",
	"google-docs-api",
	"google-gadgets",
	"tally.erp",
	"ppc-advertising",
	"java-servlets-development",
	"web-crawler",
	"youtube-marketing",
	"music-arrangement",
	"microsoft-entity-framework",
	"audio-engineering",
	"microsoft-sharepoint-administration",
	"voip-software",
	"intranet-implementation",
	"zimbra-administration",
	"nfs-administration",
	"teaching-algebra",
	"windows-app-development",
	"palm-app-development",
	"kvm-virtualization",
	"myob-administration",
	"twitter-marketing",
	"ap-style-writing",
	"print-layout-design",
	"visual-merchandising",
	"microsoft-sql-server-administration",
	"windows-8-app-development",
	"ibm-z/vm-administration",
	"press-release-writing",
	"sigmaplot",
	"google-calendar",
	"zendesk",
	"orangecrm",
	"veeam",
	"elastix",
	"filmaking",
	"psd-to-xhtml",
	"adobe-wallaby",
	"apple-ios-jailbreaking",
	"as400-cl",
	"automated-call-distribution",
	"behavioral-event-interviewing",
	"borland-silktest",
	"bas-reporting",
	"business-it-alignment",
	"cg-artwork",
	"collection-agencies",
	"continuous-integration",
	"da-vinci-resolve",
	"digital-mapping",
	"education-technology",
	"event-management",
	"financial-prospectus-writing",
	"game-testing",
	"greenline-verifix",
	"ibm-lotus-symphony",
	"installer-development",
	"issue-tracking-systems",
	"lesson-plan-writing",
	"lyrics-writing",
	"mcafee-epo",
	"meteor",
	"microsoft-office-openxml",
	"microsoft-scvmm",
	"molecule-editors",
	"news-writing-style",
	"online-help",
	"oracle-plsql",
	"organizational-development",
	"plivo",
	"presonus-studio-one",
	"quantity-surveying",
	"refinery-cms",
	"sales-promotion",
	"sap-le",
	"still-life-painting",
	"synthetic-aperture-color-finesse",
	"the-foundry-nuke",
	"unit-testing",
	"vendor-management-systems",
	"wind-power-consulting",
	"yahoo-query-language",
	"merchantrun-globallink",
	"off-page",
	"ipsec",
	"gamification",
	"google-apps-api",
	"google-reader-api",
	"retail-merchandising",
	"seo-backlinking",
	"salesforce-apex",
	"website-analytics",
	"photograph-color-correction",
	"puppet-administration",
	"google-map-maker",
	"agile-software-development",
	"microsoft-active-directory",
	"software-qa-testing",
	"rtlinux",
	"microsoft-visual-basic",
	"piano-performance",
	"netsuite-administration",
	"microsoft-small-business-server-administration",
	"teaching-physics",
	"document-object-model",
	"audio-postediting",
	"lexis-nexis-accurint",
	"linkedin-recruiting",
	"citrix-netscaler",
	"film-direction",
	"rpg-development",
	"redhat-administration",
	"off-page-optimization",
	"film-production",
	"yandex-api",
	"maple",
	"vmware",
	"bacula",
	"volusion",
	"spamassassin",
	"nlp",
	"ssi",
	"wsdl",
	"mobi",
	"taxonomy",
	"eviews",
	"opentext",
	"portlets",
	"derivatives",
	"etsy",
	"pyjamas",
	"apache-maven",
	"data-encoding",
	"business-objects",
	"medical-informatics",
	"amazon-mechanical-turk-api",
	"wowza-media-server",
	"chicago-manual-of-style",
	"mls-consulting",
	"box2d-game-engine",
	"humor-writing",
	"mcafee-saas",
	"complaint-management",
	"twig-template-engine",
	"jewish-theology",
	"system-administration",
	"propellerhead-reason",
	"satire",
	"hootsuite",
	"geology",
	"itsm",
	"netbsd",
	"rtl",
	"kerkythea",
	"weberp",
	"aspen-hysys",
	"opensuse",
	"yandex",
	"flask",
	"embroidery",
	"landesk",
	"volleyball",
	"adobe-framemaker",
	"apple-ibooks",
	"artlantis-studio",
	"autodys-accelicad",
	"batch-scripting",
	"bluebox",
	"bmr-writing",
	"business-scenario-development",
	"celemony-melodyne",
	"code-refactoring",
	"contao-cms",
	"cpu-design",
	"dietetics",
	"ebusiness-consulting",
	"language-filipino-visayan-dialect",
	"film-dubbing",
	"game-development",
	"gradle",
	"ibm-lotus-notes-traveler",
	"inno-setup",
	"islamic-banking",
	"lean-consulting",
	"load-balancing",
	"master-production-schedule",
	"menu-design",
	"microsoft-mappoint",
	"microsoft-sccm",
	"modul8",
	"network-security",
	"online-community-management",
	"oracle-java-ee",
	"oracle-soa-suite",
	"perldancer",
	"pos-terminal-development",
	"purchasing-management",
	"real-estate-appraisal",
	"rhinoscript",
	"sap-businessone",
	"realbasic",
	"erwin",
	"bluetooth",
	"vpn",
	"houdini",
	"fpga",
	"agriculture",
	"imap",
	"invoicing",
	"patents",
	"opencart",
	"pspice",
	"chemistry",
	"indexing",
	"munin",
	"gambling",
	"alfresco",
	"adobe-pagemaker",
	"delphi",
	"hibernate",
	"j2me",
	"wireless",
	"netsuite",
	"remoting",
	"sap-webdynpro",
	"serenic-navigator",
	"linux-slackware",
	"logmein-hamachi",
	"rpg-writing",
	"english-tutoring",
	"sharepoint-designer",
	"payroll-processing",
	"negotiation",
	"database-programming",
	"online-payments",
	"winrunner",
	"piano",
	"tsr",
	"rest",
	"billing",
	"painting",
	"pre-press",
	"virtuemart",
	"technical-documentation",
	"inkscape",
	"architectural-design",
	"ireport",
	"arranger",
	"windows-mobile",
	"typing",
	"richfaces",
	"russian",
	"mcp",
	"outbound-sales",
	"layout-design",
	"accounts-receivable-management",
	"visualization",
	"t-sql",
	"microsoft-great-plains",
	"adobe-indesign",
	"troubleshooting",
	"shell-scripting",
	"business-card-design",
	"requirements-analysis",
	"microsoft-project",
	"extjs",
	"cics",
	"management",
	"application-design",
	"s",
	"ms-dos",
	"iphone-sdk",
	"atl",
	"technical-support",
	"jdbc",
	"server-administration",
	"jmeter",
	"oracle-financials",
	"computer-science",
	"order-processing",
	"fax",
	"qmail",
	"exim",
	"orm",
	"microsoft-visual-studio",
	"business-analysis",
	"awk",
	"vista",
	"vhdl",
	"steinberg-cubase",
	"wpf",
	"debugging",
	"color-correction",
	"yahoo",
	"couchdb",
	"spanish",
	"oracle-application-server",
	"nagios",
	"financial-accounting",
	"copy-editing",
	"music-composition",
	"sound-forge",
	"ccnp",
	"novell-netware",
	"frontpage",
	"swt",
	"internet-research",
	"sales-management",
	"korean",
	"adobe-dreamweaver",
	"promotions",
	"unity-3d",
	"ansi-c",
	"solid-edge",
	"solaris-administration",
	"market-research",
	"erp",
	"typo3",
	"dj",
	"openvpn",
	"tcp-ip",
	"brochure-design",
	"hadoop",
	"database-design",
	"pocketpc",
	"edi",
	"thai",
	"kindle",
	"tumblr",
	"morae",
	"json",
	"machine-learning",
	"usability-testing",
	"api-documentation",
	"quick-sales-system",
	"bdd",
	"blender3d",
	"powershell",
	"octave",
	"clamav",
	"icontact",
	"cello",
	"nservicebus",
	"gaap",
	"arbitration",
	"artisteer",
	"skinning",
	"whmcs",
	"redis",
	"theology",
	"gotomypc",
	"sap-fico",
	"curation",
	"streamserve",
	"itextsharp",
	"watercolors",
	"less-framework",
	"translation-chinese-english",
	"translation-english-armenian",
	"translation-english-danish",
	"translation-english-german",
	"translation-english-indonesian",
	"translation-english-lithuanian",
	"translation-english-romanian",
	"translation-english-tamil",
	"translation-english-yiddish",
	"translation-georgian-english",
	"translation-hindi-english",
	"translation-korean-english",
	"translation-persian-english",
	"translation-slovenian-english",
	"translation-turkish-english",
	"business-development",
	"adobe-graphics-assembly-language",
	"apache-cocoon",
	"user-acceptance-testing",
	"product-development",
	"wml-script",
	"microsoft-business-intelligence-studio",
	"instructional-design",
	"microsoft-lync-server",
	"mandarian",
	"icd-coding",
	"adobe-freehand",
	"altium-desiger",
	"ab-testing",
	"dvd-mastering",
	"amazon-rds",
	"ableton-live",
	"mtek",
	"digital-scrapbooking",
	"dundas-controls",
	"ole-automation",
	"markup-languages",
	"dejavu",
	"domain-migration",
	"trademark-consulting",
	"apache-click",
	"liquid-planner",
	"curriculum-development",
	"punching",
	"bentley-microstation",
	"python-numpy",
	"f#-language",
	"vim",
	"soapui",
	"serialization",
	"codesys",
	"business-coaching",
	"sitecore",
	"dancing",
	"headhunting",
	"ad-servers",
	"apache-ofbiz",
	"artificial-neural-networks",
	"autodesk-sketchbook-pro",
	"blackberry-jde",
	"building-estimation",
	"business-process-reengineering",
	"cavium-octeon-fusion",
	"cisco-asa",
	"concrete5-cms",
	"counseling-psychology",
	"dental-technology",
	"ebay-api",
	"erdas-imagine",
	"fetchmail",
	"fraud-analysis",
	"google-swiffy",
	"human-resource-management",
	"industrial-engineering",
	"iphone-app-development",
	"juniper-routers",
	"literature-review",
	"mail-merge",
	"medical-records-research",
	"microsfot-infopath",
	"microsoft-sql-ssrs",
	"mobile-application-development",
	"navigation-systems",
	"nvidia-mental-ray",
	"oracle-enterprise-service-bus",
	"receipt-parsing",
	"portfolio-performance-modeling",
	"psd-to-mailchimp",
	"radiant-zemax",
	"requirement-management",
	"sap-business-objects",
	"stakeholder-management",
	"structural-engineering",
	"technical-editing",
	"distance-education",
	"users-guide-writing",
	"w3c-widget-api",
	"workforce-management",
	"zoho-creator",
	"testlink",
	"wilcom-embroiderystudio",
	"appian-bpm-suite",
	"mapinfo",
	"digital-access-pass",
	"google-calendar-api",
	"qnx",
	"mvvm",
	"virtual-assistant",
	"ebay-listing-writing",
	"infusionsoft-development",
	"microsoft-dynamics-erp",
	"bpo-call-center",
	"atm-implementation",
	"microcontroller-programming",
	"video-postediting",
	"criminal-law",
	"multithreaded-programming",
	"vfx-design",
	"mikrotik-routerboard",
	"blackberry-app-development",
	"win32-app-development",
	"real-estate-idx",
	"oracle-database-administration",
	"peoplesoft-development",
	"live-chat-operator",
	"toon-boom-harmony",
	"openerp-administration",
	"microsoft-windows-powershell",
	"violin-performance",
	"vxworks",
	"basecamp",
	"postscript",
	"winsock",
	"rss",
	"lightwave",
	"geometry",
	"moodle",
	"xpath",
	"aspdotnetstorefront",
	"ironpython",
	"sap-sd",
	"hotspot",
	"pylons",
	"finance",
	"scrum",
	"internet-browsing",
	"academic-writing",
	"dhtml",
	"processing",
	"xcelsius",
	"firebird",
	"facebook-api",
	"filemaker-pro",
	"computer-repair",
	"solaris",
	"adobe-photoshop",
	"driver-development",
	"internet-surveys",
	"marketing-strategy",
	"citrix",
	"customer-support",
	"mongodb",
	"dutch",
	"resume-writing",
	"moss",
	"windows-nt",
	"redhat",
	"tk",
	"document-control",
	"codewarrior",
	"adobe-air",
	"adobe-soundbooth",
	"minitab",
	"windows-phone-7-development",
	"curl",
	"microstrategy",
	"prototypejs",
	"import",
	"microsoft-publisher",
	"microsoft-internet-explorer",
	"editing",
	"saas",
	"asp-classic",
	"audio-production",
	"telemarketing",
	"bpel",
	"nginx",
	"voice-over",
	"paypal-integration",
	"maxon-cinema-4d",
	"internet-marketing",
	"xero",
	"zend-framework",
	"quarkxpress",
	"bartending",
	"pascal",
	"icefaces",
	"xml-web-services",
	"google-maps",
	"audio-editing",
	"marketing",
	"ibatis",
	"microsoft-excel",
	"javafx",
	"research",
	"jcl",
	"manual-testing",
	"etl",
	"itil",
	"swing",
	"website-development",
	"on-page",
	"sound-editing",
	"writing",
	"interior-design",
	"cvs",
	"proofreading",
	"vectorworks",
	"non-linear-editing",
	"postfix",
	"accounts-payable-management",
	"legal-transcription",
	"guitar",
	"etabs",
	"yui",
	"audio-mixing",
	"adobe-golive",
	"wcf",
	"ejb",
	"xaml",
	"poster-design",
	"receptionist-skills",
	"virtualization",
	"legal-writing",
	"fusebox",
	"win32sdk",
	"fedora",
	"transcription",
	"microsoft-visio",
	"socket-programming",
	"symbian-development",
	"functional-testing",
	"spss",
	"regression-testing",
	"logic-pro",
	"ftp",
	"customer-relations",
	"unix-shell",
	"interpersonal-skills",
	"paypal",
	"cinematography",
	"financial-modeling",
	"youtube-api",
	"hrm",
	"asp.net",
	"stenography",
	"kohana",
	"mxml",
	"property-management",
	"sybase",
	"perl",
	"java",
	"scheme",
	"hungarian",
	"prototyping",
	"socialengine",
	"actionscript-3",
	"phone-support",
	"contract-drafting",
	"weka",
	"violin",
	"catalan",
	"digital-painting",
	"abaqus",
	"five9",
	"tamil",
	"tornado",
	"lithuanian",
	"appfuse",
	"haproxy",
	"jsonp",
	"hypnosis",
	"cs-cart",
	"qcodo",
	"scrapebox",
	"cppunit",
	"poser",
	"liveperson",
	"rightscale",
	"coffeescript",
	"translation-belarusian-english",
	"translation-dutch-english",
	"translation-english-catalan",
	"translation-english-finnish",
	"translation-english-hebrew",
	"translation-english-kannada",
	"translation-english-norwegian",
	"translation-english-solvenian",
	"translation-english-ukranian",
	"translation-french-english",
	"translation-greek-english",
	"translation-irish-english",
	"translation-macedonian-english",
	"translation-romanian-english",
	"translation-swedish-english",
	"translation-welsh-english",
	"film-criticism",
	"perl-catalyst",
	"vkontake-api",
	"dmaic",
	"toon-boom",
	"computer-vision",
	"antenna-design",
	"tsm-administration",
	"pci-compliance",
	"vlookup-tables",
	"microsoft-azure",
	"e-health",
	"neuro-linguistic-programming",
	"axiom-productivity-tools",
	"dropbox-api",
	"entity-framework",
	"sql-azure",
	"information-retrieval",
	"hatian-creole",
	"imacros-scripting",
	"performing-arts",
	"appcelerator-titanium",
	"torque-game-engine",
	"erotica-writing",
	"trade2bharat",
	"apple-iworks",
	"mindtouch-wiki",
	"audodesk-architecture",
	"ibm-xseries",
	"associated-press-style",
	"scrapy-framework",
	"alternativa3d",
	"opencl",
	"fact-checking",
	"litigation",
	"logmein",
	"p-cad",
	"tropo",
	"skadate",
	"sitebuildit",
	"spree",
	"phpmydirectory",
	"2d-design",
	"album-cover-design",
	"apple-uikit-framework",
	"asynchronous-io",
	"automotive-engineering",
	"belle-nuit-subtitler",
	"brand-management",
	"business-continuity-planning",
	"cadence-platform",
	"change-management",
	"comic-art",
	"contract-documentation",
	"data-sheet-writing",
	"digital-sculpting",
	"electrical-drawing",
	"ez-publish",
	"fire-protection-engineering",
	"gamesalad-creator",
	"headus-uvlayout",
	"ibm-sametime",
	"intellicred",
	"jewelry-design",
	"statpoint-statgraphics",
	"style-guide-development",
	"test-automation",
	"triakis-vsil",
	"vaadin-framework",
	"worldbuilding",
	"wave-accounting",
	"articulate-presenter",
	"lasso",
	"sinhala",
	"augmented-reality",
	"google-adwords",
	"google-adsense-api",
	"google-spreadsheets-api",
	"ptgui",
	"vfx-animation",
	"amanda-backup",
	"iphone-ui-design",
	"microsoft-sql-server-development",
	"peoplesoft-administration",
	"pinterest-marketing",
	"jinja2",
	"object-pascal",
	"adobe-imageready",
	"biztalk-server",
	"oracle-reports",
	"coldfusion",
	"lingo",
	"graphics",
	"xml-rpc",
	"vbulletin",
	"scalable-vector-graphics",
	"javascript",
	"sap",
	"service-level-management",
	"sw-configuration-management",
	"payment-gateway-integration",
	"model-sheet-drawing",
	"software-licensing",
	"pdf",
	"email-support",
	"telephone-skills",
	"illustration",
	"windows-api",
	"dbase",
	"jee",
	"virtual-assistant-skills",
	"alpha",
	"xmpp",
	"viral-marketing",
	"wire-framing",
	"openerp",
	"gtk-programming",
	"rspec",
	"lotus-notes",
	"mono",
	"gimp",
	"vmware-esx",
	"smalltalk",
	"sound-design",
	"lighttpd",
	"scada",
	"movie-maker",
	"jsf",
	"avid",
	"sms-api-integration",
	"tagalog",
	"oltp",
	"algorithms",
	"apache-tomcat",
	"data-conversion",
	"framemaker",
	"smtp",
	"public-relations",
	"risk-management",
	"filipino",
	"industrial-design",
	"ssrs",
	"level-design",
	"machine-design",
	"mcafee-virusscan",
	"methods-engineering",
	"microsoft-onenote",
	"microsoft-virtual-server",
	"moonscript",
	"next-limit-maxwell-render",
	"oracle-application-framework",
	"organic-search",
	"play-framework",
	"presentation-design",
	"qliktech-qlikview",
	"recipe-writing",
	"sap-erp-hcm",
	"stereoscopy",
	"synopsis-writing",
	"unify-sqlbase",
	"vector-graphics",
	"website-wireframing",
	"xlinesoft-phprunner",
	"sage-peachtree-complete-accounting",
	"iso-9000",
	"plone",
	"zimbra",
	"google-places-api",
	"ibm-rational-rose",
	"m0n0wall",
	"bbpress",
	"jonas",
	"staad",
	"alibre-design",
	"google-search-api",
	"pcb-design",
	"sound-effects",
	"patent-law",
	"computer-hw-design",
	"quantitative-analysis",
	"hr-benefits",
	"ibm-ppc-programming",
	"mobile-app-development",
	"tibco-activematrix-businessworks",
	"piano-composition",
	"microsoft-sharepoint-development",
	"myspace-marketing",
	"software-debugging",
	"lexis-nexis-practice-advisor",
	"irc-server-administration",
	"firefox-plugin-development",
	"citrix-xenserver",
	"vmware-administration",
	"art-curation",
	"marriage-counseling",
	"watercolor-painting",
	"bash-shell-scripting",
	"database-adminstration",
	"unix-system-administration",
	"google-calendar-development",
	"hp-ux-administration",
	"zimbra-development",
	"link-wheel",
	"program-management",
	"hyperion",
	"qa",
	"uml",
	"css",
	"voip",
	"mysql",
	"scenario-planning",
	"t-shirt-design",
	"spm-design",
	"resin",
	"nav-system-design",
	"powerbuilder",
	"ipad",
	"11g-troubleshooting",
	"elgg",
	"microsoft-silverlight",
	"plesk",
	"xen",
	"cocoa",
	"catia",
	"google-docs",
	"embedded-systems",
	"core-java",
	"embedded-c",
	"oracle-e-business-suite",
	"article-curation",
	"hw-prototyping",
	"windows-8-administration",
	"salesforce-app-development",
	"voip-administration",
	"xen-cloud-platform",
	"operating-systems-development",
	"apache-administration",
	"openerp-development",
	"etsy-administration",
	"alfresco-development",
	"wireless-network-implementation",
	"tv-broadcasting",
	"varnish-cache",
	"adobe-premiere-elements",
	"ebook-design",
	"teaching-mathematics",
	"guitar-performance",
	"brand-licensing",
	"yahoo-merchant-solutions",
	"magento",
	"interaction-design",
	"clearquest",
	"gps",
	"oracle-forms",
	"graphic-design",
	"sports",
	"apache-struts",
	"fbjs",
	"administrative-support",
	"apple-imovie",
	"lan",
	"lua",
	"civil-engineering",
	"magazine-layout",
	"jdeveloper",
	"reporting",
	"music-engraving",
	"psd-to-html",
	"primavera",
	"servlets",
	"data-structures",
	"drawing",
	"salesforce.com",
	"r",
	"glassfish",
	"vss",
	"bgp",
	"content-writing",
	"cubecart",
	"legal-services",
	"codeigniter",
	"travel-arrangements",
	"software-testing",
	"csr",
	"snagit",
	"birt",
	"log4j",
	"sabre",
	"dbms",
	"bugzilla",
	"cognos",
	"amazon-web-services",
	"keyword-research",
	"mikrotik",
	"hp-qtp",
	"actionscript-2",
	"hindi",
	"vfx",
	"umbraco",
	"sdl-trados",
	"essay-writing",
	"facelets",
	"interbase",
	"jfc",
	"drupal",
	"css3",
	"dart",
	"sai",
	"vietnamese",
	"google-analytics",
	"information-design",
	"common-language-runtime",
	"oauth",
	"version-control",
	"pyro",
	"a2billing",
	"os/2",
	"audio-mastering",
	"mailchimp",
	"flowcharts",
	"openemm",
	"murals",
	"zabbix",
	"carbide",
	"getresponse",
	"sitescope",
	"rotoscope",
	"haml",
	"jquery-mobile",
	"limesurvey",
	"clearbooks",
	"sitefinity",
	"translation-albanian-english",
	"translation-czech-english",
	"translation-english-bengali",
	"translation-english-estonian",
	"translation-english-gujarati",
	"translation-english-italian",
	"translation-english-malay",
	"translation-english-serbian",
	"translation-english-thai",
	"translation-filipino-english",
	"translation-german-french",
	"translation-icelandic-english",
	"translation-latvian-english",
	"translation-polish-german",
	"translation-spanish-french",
	"translation-urdu-english",
	"doctrine-orm",
	"oracle-sunray",
	"data-science",
	"banking-systems",
	"ibm-tivoli",
	"d3.js",
	"cache-database",
	"data-center-operations",
	"oracle-performance-tuning",
	"concept-artistry",
	"ideablade-deveforce",
	"atlassian-confluence",
	"windows-workflow-foundation",
	"alternative-dispute-resolution",
	"google-places",
	"video-conversion",
	"eucalyptus-cloud",
	"openbravo-pos",
	"microsoft-connect"
];
// Spectrum Colorpicker v1.1.1
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        preferredFormat: false,
        className: "",
        showAlpha: false,
        theme: "sp-light",
        palette: ['fff', '000'],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var tiny = tinycolor(p[i]);
            var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
            c += (tinycolor.equals(color, p[i])) ? " sp-thumb-active" : "";

            var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
            html.push('<span title="' + tiny.toRgbString() + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = opts.palette.slice(0),
            paletteArray = $.isArray(palette[0]) ? palette : [palette],
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            chooseButton = container.find(".sp-choose"),
            isInput = boundElement.is("input"),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange;


        function applyOptions() {

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                hide("cancel");
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            });

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function palletElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(this).data("color"));
                    move();
                }
                else {
                    set($(this).data("color"));
                    updateOriginalInput(true);
                    move();
                    hide();
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, palletElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, palletElementClick);
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var colorRgb = tinycolor(color).toRgbString();
                if ($.inArray(colorRgb, selectionPalette) === -1) {
                    selectionPalette.push(colorRgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            var p = selectionPalette;
            var paletteLookup = {};
            var rgb;

            if (opts.showPalette) {

                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }

                for (i = 0; i < p.length; i++) {
                    rgb = tinycolor(p[i]).toRgbString();

                    if (!paletteLookup.hasOwnProperty(rgb)) {
                        unique.push(p[i]);
                        paletteLookup[rgb] = true;
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i);
            });

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection"));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial"));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            container.addClass(draggingClass);
            shiftMovementDirection = null;
        }

        function dragStop() {
            container.removeClass(draggingClass);
        }

        function setFromTextInput() {
            var tiny = tinycolor(textInput.val());
            if (tiny.ok) {
                set(tiny);
            }
            else {
                textInput.addClass("sp-validation-error");
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [ get() ]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("click.spectrum", hide);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            if (opts.showPalette) {
                drawPalette();
            }
            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function hide(e) {

            // Return on right click
            if (e && e.type == "click" && e.button == 2) { return; }

            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("click.spectrum", hide);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            var colorHasChanged = !tinycolor.equals(get(), colorOnShow);

            if (colorHasChanged) {
                if (clickoutFiresChange && e !== "cancel") {
                    updateOriginalInput(true);
                }
                else {
                    revert();
                }
            }

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                return;
            }

            var newColor = tinycolor(color);
            var newHsv = newColor.toHsv();

            currentHue = (newHsv.h % 360) / 360;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;

            updateUI();

            if (newColor.ok && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.format;
            }
        }

        function get(opts) {
            opts = opts || { };
            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();

            // Update the replaced elements background color (with actual selected color)
            if (rgbaSupport || realColor.alpha === 1) {
                previewElement.css("background-color", realRgb);
            }
            else {
                previewElement.css("background-color", "transparent");
                previewElement.css("filter", realColor.toFilter());
            }

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    alphaSliderInner.css("background", gradient);
                }
            }


            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(realColor.toString(format));
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = dragHeight - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight,
                Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
            );
            dragY = Math.max(
                -dragHelperHeight,
                Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
            );
            dragHelper.css({
                "top": dragY,
                "left": dragX
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": alphaX - (alphaSlideHelperWidth / 2)
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": slideY - slideHelperHeight
            });
        }

        function updateOriginalInput(fireCallback) {
            var color = get();

            if (isInput) {
                boundElement.val(color.toString(currentPreferredFormat)).change();
            }

            var hasChanged = !tinycolor.equals(color, colorOnShow);
            colorOnShow = color;

            // Update the selection palette with the current color
            addColorToSelectionPalette(color);
            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change.spectrum', [ color ]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = element.ownerDocument || document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && document.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }
        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
            var touches = e.originalEvent.touches;

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }
        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }


    function log(){/* jshint -W021 */if(window.console){if(Function.prototype.bind)log=Function.prototype.bind.call(console.log,console);else log=function(){Function.prototype.apply.call(console.log,console,arguments);};log.apply(this,arguments);}}

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {

                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var spect = spectrum(this, opts);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        var supportsColor = colorInput.type === "color" && colorInput.value != "!";

        if (!supportsColor) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };
    // TinyColor v0.9.14
    // https://github.com/bgrins/TinyColor
    // 2013-02-24, Brian Grinstead, MIT License

    (function(root) {

        var trimLeft = /^[\s,#]+/,
            trimRight = /\s+$/,
            tinyCounter = 0,
            math = Math,
            mathRound = math.round,
            mathMin = math.min,
            mathMax = math.max,
            mathRandom = math.random;

        function tinycolor (color, opts) {

            color = (color) ? color : '';
            opts = opts || { };

            // If input is already a tinycolor, return itself
            if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
               return color;
            }
            var rgb = inputToRGB(color);
            var r = rgb.r,
                g = rgb.g,
                b = rgb.b,
                a = rgb.a,
                roundA = mathRound(100*a) / 100,
                format = opts.format || rgb.format;

            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1
            // If it was supposed to be 128, this was already taken care of by `inputToRgb`
            if (r < 1) { r = mathRound(r); }
            if (g < 1) { g = mathRound(g); }
            if (b < 1) { b = mathRound(b); }

            return {
                ok: rgb.ok,
                format: format,
                _tc_id: tinyCounter++,
                alpha: a,
                toHsv: function() {
                    var hsv = rgbToHsv(r, g, b);
                    return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: a };
                },
                toHsvString: function() {
                    var hsv = rgbToHsv(r, g, b);
                    var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                    return (a == 1) ?
                      "hsv("  + h + ", " + s + "%, " + v + "%)" :
                      "hsva(" + h + ", " + s + "%, " + v + "%, "+ roundA + ")";
                },
                toHsl: function() {
                    var hsl = rgbToHsl(r, g, b);
                    return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: a };
                },
                toHslString: function() {
                    var hsl = rgbToHsl(r, g, b);
                    var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                    return (a == 1) ?
                      "hsl("  + h + ", " + s + "%, " + l + "%)" :
                      "hsla(" + h + ", " + s + "%, " + l + "%, "+ roundA + ")";
                },
                toHex: function(allow3Char) {
                    return rgbToHex(r, g, b, allow3Char);
                },
                toHexString: function(allow3Char) {
                    return '#' + rgbToHex(r, g, b, allow3Char);
                },
                toRgb: function() {
                    return { r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a };
                },
                toRgbString: function() {
                    return (a == 1) ?
                      "rgb("  + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
                      "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + roundA + ")";
                },
                toPercentageRgb: function() {
                    return { r: mathRound(bound01(r, 255) * 100) + "%", g: mathRound(bound01(g, 255) * 100) + "%", b: mathRound(bound01(b, 255) * 100) + "%", a: a };
                },
                toPercentageRgbString: function() {
                    return (a == 1) ?
                      "rgb("  + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%)" :
                      "rgba(" + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%, " + roundA + ")";
                },
                toName: function() {
                    return hexNames[rgbToHex(r, g, b, true)] || false;
                },
                toFilter: function(secondColor) {
                    var hex = rgbToHex(r, g, b);
                    var secondHex = hex;
                    var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
                    var secondAlphaHex = alphaHex;
                    var gradientType = opts && opts.gradientType ? "GradientType = 1, " : "";

                    if (secondColor) {
                        var s = tinycolor(secondColor);
                        secondHex = s.toHex();
                        secondAlphaHex = Math.round(parseFloat(s.alpha) * 255).toString(16);
                    }

                    return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr=#" + pad2(alphaHex) + hex + ",endColorstr=#" + pad2(secondAlphaHex) + secondHex + ")";
                },
                toString: function(format) {
                    format = format || this.format;
                    var formattedString = false;
                    if (format === "rgb") {
                        formattedString = this.toRgbString();
                    }
                    if (format === "prgb") {
                        formattedString = this.toPercentageRgbString();
                    }
                    if (format === "hex" || format === "hex6") {
                        formattedString = this.toHexString();
                    }
                    if (format === "hex3") {
                        formattedString = this.toHexString(true);
                    }
                    if (format === "name") {
                        formattedString = this.toName();
                    }
                    if (format === "hsl") {
                        formattedString = this.toHslString();
                    }
                    if (format === "hsv") {
                        formattedString = this.toHsvString();
                    }

                    return formattedString || this.toHexString();
                }
            };
        }

        // If input is an object, force 1 into "1.0" to handle ratios properly
        // String input requires "1.0" as input, so 1 will be treated as 1
        tinycolor.fromRatio = function(color, opts) {
            if (typeof color == "object") {
                var newColor = {};
                for (var i in color) {
                    if (color.hasOwnProperty(i)) {
                        if (i === "a") {
                            newColor[i] = color[i];
                        }
                        else {
                            newColor[i] = convertToPercentage(color[i]);
                        }
                    }
                }
                color = newColor;
            }

            return tinycolor(color, opts);
        };

        // Given a string or object, convert that input to RGB
        // Possible string inputs:
        //
        //     "red"
        //     "#f00" or "f00"
        //     "#ff0000" or "ff0000"
        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
        //
        function inputToRGB(color) {

            var rgb = { r: 0, g: 0, b: 0 };
            var a = 1;
            var ok = false;
            var format = false;

            if (typeof color == "string") {
                color = stringInputToObject(color);
            }

            if (typeof color == "object") {
                if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                    color.s = convertToPercentage(color.s);
                    color.v = convertToPercentage(color.v);
                    rgb = hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = "hsv";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                    color.s = convertToPercentage(color.s);
                    color.l = convertToPercentage(color.l);
                    rgb = hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a")) {
                    a = color.a;
                }
            }

            a = parseFloat(a);

            // Handle invalid alpha characters by setting to 1
            if (isNaN(a) || a < 0 || a > 1) {
                a = 1;
            }

            return {
                ok: ok,
                format: color.format || format,
                r: mathMin(255, mathMax(rgb.r, 0)),
                g: mathMin(255, mathMax(rgb.g, 0)),
                b: mathMin(255, mathMax(rgb.b, 0)),
                a: a
            };
        }



        // Conversion Functions
        // --------------------

        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

        // `rgbToRgb`
        // Handle bounds / percentage checking to conform to CSS color spec
        // <http://www.w3.org/TR/css3-color/>
        // *Assumes:* r, g, b in [0, 255] or [0, 1]
        // *Returns:* { r, g, b } in [0, 255]
        function rgbToRgb(r, g, b){
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }

        // `rgbToHsl`
        // Converts an RGB color value to HSL.
        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
        // *Returns:* { h, s, l } in [0,1]
        function rgbToHsl(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;

            if(max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return { h: h, s: s, l: l };
        }

        // `hslToRgb`
        // Converts an HSL color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hslToRgb(h, s, l) {
            var r, g, b;

            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);

            function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            if(s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHsv`
        // Converts an RGB color value to HSV
        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
        // *Returns:* { h, s, v } in [0,1]
        function rgbToHsv(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max === 0 ? 0 : d / max;

            if(max == min) {
                h = 0; // achromatic
            }
            else {
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h, s: s, v: v };
        }

        // `hsvToRgb`
        // Converts an HSV color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
         function hsvToRgb(h, s, v) {

            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);

            var i = math.floor(h),
                f = h - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                mod = i % 6,
                r = [v, q, p, p, t, v][mod],
                g = [t, v, v, q, p, p][mod],
                b = [p, p, t, v, v, q][mod];

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHex`
        // Converts an RGB color to hex
        // Assumes r, g, and b are contained in the set [0, 255]
        // Returns a 3 or 6 character hex
        function rgbToHex(r, g, b, allow3Char) {

            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            // Return a 3 character hex if possible
            if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        }

        // `equals`
        // Can be called with any tinycolor input
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) { return false; }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };
        tinycolor.random = function() {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };


        // Modification Functions
        // ----------------------
        // Thanks to less.js for some of the basics here
        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>


        tinycolor.desaturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s -= ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.saturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s += ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.greyscale = function(color) {
            return tinycolor.desaturate(color, 100);
        };
        tinycolor.lighten = function(color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l += ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.darken = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l -= ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.complement = function(color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return tinycolor(hsl);
        };


        // Combination Functions
        // ---------------------
        // Thanks to jQuery xColor for some of the ideas behind these
        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

        tinycolor.triad = function(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
            ];
        };
        tinycolor.tetrad = function(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
            ];
        };
        tinycolor.splitcomplement = function(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
            ];
        };
        tinycolor.analogous = function(color, results, slices) {
            results = results || 6;
            slices = slices || 30;

            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];

            for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        };
        tinycolor.monochromatic = function(color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;

            while (results--) {
                ret.push(tinycolor({ h: h, s: s, v: v}));
                v = (v + modification) % 1;
            }

            return ret;
        };

        // Readability Functions
        // ---------------------
        // <http://www.w3.org/TR/AERT#color-contrast>

        // `readability`
        // Analyze the 2 colors and returns an object with the following properties:
        //    `brightness`: difference in brightness between the two colors
        //    `color`: difference in color/hue between the two colors
        tinycolor.readability = function(color1, color2) {
            var a = tinycolor(color1).toRgb();
            var b = tinycolor(color2).toRgb();
            var brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000;
            var brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000;
            var colorDiff = (
                Math.max(a.r, b.r) - Math.min(a.r, b.r) +
                Math.max(a.g, b.g) - Math.min(a.g, b.g) +
                Math.max(a.b, b.b) - Math.min(a.b, b.b)
            );

            return {
                brightness: Math.abs(brightnessA - brightnessB),
                color: colorDiff
            };
        };

        // `readable`
        // http://www.w3.org/TR/AERT#color-contrast
        // Ensure that foreground and background color combinations provide sufficient contrast.
        // *Example*
        //    tinycolor.readable("#000", "#111") => false
        tinycolor.readable = function(color1, color2) {
            var readability = tinycolor.readability(color1, color2);
            return readability.brightness > 125 && readability.color > 500;
        };

        // `mostReadable`
        // Given a base color and a list of possible foreground or background
        // colors for that base, returns the most readable color.
        // *Example*
        //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
        tinycolor.mostReadable = function(baseColor, colorList) {
            var bestColor = null;
            var bestScore = 0;
            var bestIsReadable = false;
            for (var i=0; i < colorList.length; i++) {

                // We normalize both around the "acceptable" breaking point,
                // but rank brightness constrast higher than hue.

                var readability = tinycolor.readability(baseColor, colorList[i]);
                var readable = readability.brightness > 125 && readability.color > 500;
                var score = 3 * (readability.brightness / 125) + (readability.color / 500);

                if ((readable && ! bestIsReadable) ||
                    (readable && bestIsReadable && score > bestScore) ||
                    ((! readable) && (! bestIsReadable) && score > bestScore)) {
                    bestIsReadable = readable;
                    bestScore = score;
                    bestColor = tinycolor(colorList[i]);
                }
            }
            return bestColor;
        };


        // Big List of Colors
        // ------------------
        // <http://www.w3.org/TR/css3-color/#svg-color>
        var names = tinycolor.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };

        // Make it easy to access colors via `hexNames[hex]`
        var hexNames = tinycolor.hexNames = flip(names);


        // Utilities
        // ---------

        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
        function flip(o) {
            var flipped = { };
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }

        // Take input from [0, n] and return it as [0, 1]
        function bound01(n, max) {
            if (isOnePointZero(n)) { n = "100%"; }

            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent) {
                n = parseInt(n * max, 10) / 100;
            }

            // Handle floating point rounding errors
            if ((math.abs(n - max) < 0.000001)) {
                return 1;
            }

            // Convert into [0, 1] range if it isn't already
            return (n % max) / parseFloat(max);
        }

        // Force a number between 0 and 1
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }

        // Parse an integer into hex
        function parseHex(val) {
            return parseInt(val, 16);
        }

        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
        function isOnePointZero(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }

        // Check to see if string passed in is a percentage
        function isPercentage(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        }

        // Force a hex value to have 2 characters
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }

        // Replace a decimal with it's percentage value
        function convertToPercentage(n) {
            if (n <= 1) {
                n = (n * 100) + "%";
            }

            return n;
        }

        var matchers = (function() {

            // <http://www.w3.org/TR/css3-values/#integers>
            var CSS_INTEGER = "[-\\+]?\\d+%?";

            // <http://www.w3.org/TR/css3-values/#number-value>
            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

            // Actual matching.
            // Parentheses and commas are optional, but not required.
            // Whitespace can take the place of commas or opening paren
            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

            return {
                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        })();

        // `stringInputToObject`
        // Permissive string parsing.  Take in a number of formats, and output an object
        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
        function stringInputToObject(color) {

            color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            }
            else if (color == 'transparent') {
                return { r: 0, g: 0, b: 0, a: 0 };
            }

            // Try to match string input using regular expressions.
            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
            // Just return an object and let the conversion functions handle that.
            // This way the result will be the same whether the tinycolor is initialized with string or object.
            var match;
            if ((match = matchers.rgb.exec(color))) {
                return { r: match[1], g: match[2], b: match[3] };
            }
            if ((match = matchers.rgba.exec(color))) {
                return { r: match[1], g: match[2], b: match[3], a: match[4] };
            }
            if ((match = matchers.hsl.exec(color))) {
                return { h: match[1], s: match[2], l: match[3] };
            }
            if ((match = matchers.hsla.exec(color))) {
                return { h: match[1], s: match[2], l: match[3], a: match[4] };
            }
            if ((match = matchers.hsv.exec(color))) {
                return { h: match[1], s: match[2], v: match[3] };
            }
            if ((match = matchers.hex6.exec(color))) {
                return {
                    r: parseHex(match[1]),
                    g: parseHex(match[2]),
                    b: parseHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex3.exec(color))) {
                return {
                    r: parseHex(match[1] + '' + match[1]),
                    g: parseHex(match[2] + '' + match[2]),
                    b: parseHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }

        root.tinycolor = tinycolor;

    })(this);

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

})(window, jQuery);
$(".full-spectrum").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxPaletteSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    	console.log("i'm hidden");
    },
    change: function(color) {
        
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});
/* diagram.js
 * ---------------------------------------------
 * 
 * 
 */


var diagram_width = $("#diagram-container").width(),
    diagram_height = 200,
    diagram_margin = 20;

// var workers = {
//     "nodes": [
//         {"name": "UX Researcher", "id": 0, "color": "green"},
//         {"name": "Web Developer 1", "id": 1, "color": "blue"},
//         {"name": "Web Developer 2", "id": 2, "color": "blue"},
//         {"name": "Web Developer 3", "id": 3, "color": "blue"},
//         {"name": "UI Designer", "id": 4, "color": "red"}
//     ],
//     "links": [
//         {"source":1,"target":2,"value":1},
//         {"source":2,"target":3,"value":8},
//         {"source":3,"target":1,"value":10},
//         {"source":0,"target":2,"value":6},
//         {"source":0,"target":1,"value":6},
//         {"source":0,"target":3,"value":6},
//         {"source":0,"target":4,"value":6},
//     ]
// }

var workers = {
    "nodes": [],
    "links": []
}

var color = d3.scale.category20();

var force = d3.layout.force()
    .nodes(workers.nodes)
    .links(workers.links)
    .charge(-400)
    .linkDistance(60)
    .size([diagram_width, diagram_height])
    .on("tick", tick);

var diagram_svg = d3.select("#diagram-container").append("svg")
    .attr("width", diagram_width)
    .attr("height", diagram_height);

var node = diagram_svg.selectAll(".node"),
    link = diagram_svg.selectAll(".link");







// force.nodes(workers.nodes)
//     .links(workers.links)
//     .start();

// var link = diagram_svg.selectAll(".link")
//     .data(workers.links)
//     .enter().append("line")
//     .attr("class", "link")
//     .style("stroke-width", function(d) { return 2*Math.sqrt(d.value); });

// var node = diagram_svg.selectAll(".node")
//     .data(workers.nodes)
//     .enter().append("circle")
//     .attr("class", "node")
//     .attr("r", 10)
//     .style("fill", function(d) { return d.color; })
//     .call(force.drag);

// node.append("title")
//     .text(function(d) { return d.name; });



function start() {
    link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
    link.enter()
        .insert("line", ".node")
        .attr("class", "link");
    link.exit()
        .remove();

    node = node.data(force.nodes(), function(d) { return d.id;});
    node.style("fill", function(d) { return d.color; });
    node.enter()
        .append("circle")
        .attr("class", function(d) { return "node node-" + d.id; })
        .attr("r", 8)
        .style("fill", function(d) { return d.color; })
        .text(function(d) { return d.name; })
        .call(force.drag);
    node.exit()
        .remove();

    force.start();
}

function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}

function addMemberNode(memberTitle, memberId, memberColor) {
    var newNode = {"name" : memberTitle, "id" : memberId, "color" : memberColor};
    workers.nodes.push(newNode);
    start();
}

function updateNodeColor() {
    start();
}

function removeMemberNode(memberId) {
    workers.nodes.splice(searchById(workers.nodes, memberId), 1);
    start();
}

function removeAllMemberNodes() {
    workers.nodes = [];
    start();
}

$(window).resize(function() {
    diagram_width = $("#diagram-container").width();
    diagram_svg.attr("width", diagram_width);
    force.size([diagram_width, diagram_height])
        .start();
});

/* eventslibrary.js
* ---------------------------------------------
* Code that manages the searching and adding of events to the timeline in Foundry.
*
*/

// Reusable AJAX function, which takes 4 arguments, including: the ID of the input element (i.e. text field), the type of AJAX request (i.e. GET or POST), the 				URL for the AJAX request and the id for the container where the results will appear 

function callajaxreq(inputid, type, url, resultsid){
  
  // Setup AJAX request onclick
  var query_input = document.getElementById(inputid);

  query_input.onkeyup = function(event){
    
    var query_value = document.getElementById(inputid).value;
    var request = $.ajax({
      url: url,
      type: "GET",
      data: { params : query_value },
      dataType: "html"
    }); //end var request
   
    request.done(function( msg ) {
      $( "#" + resultsid ).html( msg );
    }); //end request.done

  }// end query_input.onkeyup

} //end callajaxreq

callajaxreq("searchEventsInput", "GET", "/flash_teams/event_search", "search-results");


/*
//Array of sample Event JSONs used for testing
var EventJSONArray= [
{
"title":"Low-fi prototype v1",
"id":1,
"startTime":null,
"duration":2.5*60,
"notes":"Use balsamiq to construct mockups",
"members":["UX Researcher", "Developer"],
"dri":"UI Designer",
"yPosition":null,
"inputs":[],
"outputs":["low-fidelity prototype v1"]
},

{
"title":"Low-fi prototype v2",
"id":2,
"startTime":null,
"duration":4*60,
"notes":"Use Axure to construct prototype",
"members":["UX Researcher", "Developer"],
"dri":"UI Designer",
"yPosition":null,
"inputs":["low-fidelity prototype v1", "first HE violation from shared document"],
"outputs":["low-fidelity prototype v2"]
},

{
"title":"Heuristic Evaluation",
"id":3,
"startTime":null,
"duration":2*60,
"notes":"Refer to Nielsen's heuristics",
"members":["UI Designer", "Developer"],
"dri":"UX Researcher",
"yPosition":null,
"inputs":["low-fidelity prototype v1"],
"outputs":["final HE report"]
}
];

//Array of sample Member JSONs used for testing
var MembersJSONArray= [
{
"id":1,
"role":"UI Designer",
"skills":["skill1", "skill2"],
"color":null,
"category1":"Web Development",
"category2":"Web Design"
},

{
"id":2,
"role":"UX Researcher 1",
"skills":["skill3", "skill4"],
"color":null,
"category1":"cat2a",
"category2":"cat2"
},

{
"id":3,
"role":"Developer",
"skills":["skill2", "skill3"],
"color":null,
"category1":"cat3a",
"category2":"cat3"
},

{
"id":4,
"role":"UI Researcher 2",
"skills":["skill1", "skill3"],
"color":null,
"category1":"cat4a",
"category2":"cat4"
}
]
*/

//DR: I have no idea what the following three lines do
/* Dialog prompt code. Prevents dialogs from automatically opening upon initialization */
//$( "#teamRolesPrompt" ).dialog({ autoOpen: false });
//$( "#teamRolesPrompt" ).dialog({ height: "auto" },{ width: "450px" });
//$( "#teamRolesPrompt" ).dialog({ modal: true }); //creates overlay between dialog and rest of the web page in order to disables interactions with other page elements

// DR: I got commented out the search button since I use live search instead
/* Called when user clicks on 'Go' button next to search bar in the 'Add Events' container in side menu and returns search results.
Currently is a dummy function that each Event JSON in EventJSONArray into an Event div and displays them as search results. */
/*
function searchEvents() {
alert($('meta[name=events_json]').attr('content'));
for (var i = 0; i < EventJSONArray.length; i++) {
var str = "<div class=\"event-block\" id=\"searchEventBlock_"+i+"\"" //assigns each Event div a unique id
str += "draggable=\"true\" ondragstart=\"dragEvent(event)\" style=\"cursor:move\">"; //makes Event div draggable
str += "<div class=\"row-fluid\">";
str += "<div class=\"span9\"><b>"+EventJSONArray[i]["title"]+"</b></div>"; //Event Title
str += "<div class=\"span3\">"+EventJSONArray[i]["duration"]/60+" hrs</div></div>"; //Event duration
str += "<b>DRI: </b>"+EventJSONArray[i]["dri"]+"<br />"; //Event DRI
str += "<b>Input: </b>"+listInputs(EventJSONArray[i])+"<br />"; //Event inputs
str += "<b>Output: </b>"+listOutputs(EventJSONArray[i])+"</div>"; //Event outputs
$("#search-results").append(str); //appends each Event div to search results container
}
}
*/

/* Called when a user drags an event over the overlay div covering the timeline svg element, allowing overlay to catch and handle the drop */
function allowDrop(ev) {
ev.preventDefault();
}

/* Called when an Event div is being dragged. */
function dragEvent(ev) {
  //console.log(ev);
ev.dataTransfer.setData('eventHash', ev.target.getAttribute('data-hash'));
ev.dataTransfer.setData("Text",ev.target.id); //saves id of dragged Event div into 'data'
document.getElementById("overlay").style.display = "block"; //turns overlay on
}

/* Called when a user drops an event in a div that allows drop, in this case, overlay. Mouse coordinates at the point of drop are detected and members belonging to the dragged event and members belonging to the existing flash-team are compared */
function drop(ev) {
ev.preventDefault();

//console.log(ev);

var targetHash = ev.dataTransfer.getData('eventHash');

//calculates mouse coordinates relative to timeline svg to draw dragged event in corresponding location
var mouseCoords = calcMouseCoords(ev);

//turn overlay off so event blocks can be drawn on timeline svg
document.getElementById("overlay").style.display = "none";  

//added createdragevent (and changed eventJSONId to eventJSONindex) here instead of compMember to test:
createDragEvent(mouseCoords[0], mouseCoords[1], targetHash);

//compares two members. Currently both are sample Member JSONs from MembersJSONArray, but should compared a team member from dragged Event and an existing team member in flash-team
//compMember(MembersJSONArray[0], MembersJSONArray[2], mouseCoords, eventJSONindex); //TO BE CHANGED
}

/* Calculates mouse coordinates relative to timeline svg so Event block can be drawn in correct spot*/
function calcMouseCoords(event) {
var timelineX = document.getElementById("timeline-container").offsetLeft;
var timelineY = document.getElementById("timeline-container").offsetTop;
var overlayX = document.getElementById("overlay").offsetLeft;
var overlayY = document.getElementById("overlay").offsetTop;

var svgX = timelineX + overlayX;
var svgY = timelineY + overlayY;

var timelineScrollX = document.getElementById("timeline-container").scrollLeft;
var timelineScrollY = document.getElementById("timeline-container").scrollTop;

var absoluteX = event.pageX+timelineScrollX;
var absoluteY = event.pageY+timelineScrollY;

var svgpointX = absoluteX - svgX;
var svgpointY = absoluteY - svgY;

var svgpoint = [svgpointX, svgpointY];
return svgpoint;
}

/* Creates event block on timeline with according pop up information*/
function createDragEvent(mouseX, mouseY, targetHash) {
   //WRITE IF CASE, IF INTERACTION DRAWING, STOP
   if(DRAWING_HANDOFF==true || DRAWING_COLLAB==true) {
       alert("Please click on another event or the same event to cancel");
       return;
   }

   event_counter++; //To generate id

    /*
var matchblock = document.getElementById("matchblock");
console.log("matchblock: " + matchblock.innerHTML);
*/

var title = document.getElementById("title-" + targetHash).innerHTML;
var duration = document.getElementById("duration-" + targetHash).innerHTML * 60;
var inputs = document.getElementById("inputs-" + targetHash).innerHTML;
var outputs = document.getElementById("outputs-" + targetHash).innerHTML;

var snapPoint = calcSnap(mouseX, mouseY);

//DRAWEVENT HAS DIFFERENT PARAMETERS NOW
//var groupNum = drawEvent(snapPoint[0], snapPoint[1], null, eventTitle, duration);
//var groupNum = drawEvents(snapPoint[0], snapPoint[1], null, eventTitle, duration);

//FILLPOPOVER NO LONGER EXISTS
//fillPopover(snapPoint[0], groupNum, eventTitle, duration);
//fillPopover(snapPoint[0], groupNum, false, eventTitle, duration);

//var crev = createEvent(snapPoint);
var crev = newEventFromLib(snapPoint, title, duration, inputs, outputs); //add DRI, members, other attributes to the arguments (and method params)

drawEvents(crev);

//editablePopoverObj(crev);

//drawPopover(crev, true, true);
};

//I added this
function newEventFromLib(snapPoint, eventTitle, duration, inputs, outputs) {
    event_counter++;
    var startTimeObj = getStartTime(snapPoint[0]);
    var newEvent = {"title": eventTitle, "id":event_counter, "x": snapPoint[0], "y": snapPoint[1], "startTime": startTimeObj["startTimeinMinutes"], "duration": duration, "members":[], "dri":"", "notes":"", "startHr": startTimeObj["startHr"], "startMin": startTimeObj["startMin"], "gdrive":[], "completed_x": null, "inputs": inputs, "outputs": outputs };
    flashTeamsJSON.events.push(newEvent);
    return newEvent;
};


//DR: I didn't touch any of the code below 

/* Compares the skills and second level category of two members. Depending on the comparison, may pop up dialog. Depending on dialog button chosen, may draw Event block onto timeline*/
function compMember(member1, member2, mouseCoords, eventJSONId) {
var promptText;
if (compMemberCats(member1, member2) || compMemberSkills(member1, member2)) { //if skills or second level category matches
promptText = "This event requires a <b>"+member1["role"]+"</b> with skills overlapping those of your existing team member, <b>"+member2["role"]+"</b>. What would you like to do?";
$( "#teamRolesPrompt" ).dialog({
buttons: [ //3 options:
{
text: "Add this event but use an existing team member",
click: function() {
$( this ).dialog( "close" );
createDragEvent(mouseCoords[0],mouseCoords[1],eventJSONId);
}
},
{
text: "Add this event and "+member1["role"]+" to my team",
click: function() {
$( this ).dialog( "close" );
addMemberFromEvent(member1);
createDragEvent(mouseCoords[0],mouseCoords[1],eventJSONId);
}
},
{
text: "Do not add this event and keep my team as is",
click: function() {
$( this ).dialog( "close" );
}
}
]
});
document.getElementById("teamRolesPrompt").innerHTML=promptText;
$( "#teamRolesPrompt" ).dialog( "open" );
} else { //else no matches, add Event block and its listed team members automatically
addMemberFromEvent(member1);
createDragEvent(mouseCoords[0],mouseCoords[1],eventJSONId);
addMemberFromEvent(member1);
}
}

/* Returns the 'inputs' of an Event JSON*/
function listInputs(event) {
var inputs="";
for (var i = 0; i < event["inputs"].length; i++) {
inputs += event["inputs"][i];
if (i < event["inputs"].length-1) {
inputs += ", ";
}
}
return inputs;
}

/* Returns the 'outputs' of an Event JSON*/
function listOutputs(event) {
var outputs="";
for (var i = 0; i < event["outputs"].length; i++) {
outputs += event["outputs"][i];
if (i < event["outputs"].length-1) {
outputs += ", ";
}
}
return outputs;
}

/* Returns the 'skills' of a Member JSON*/
function listSkills(member) {
var skills="";
for (var i = 0; i < member["skills"].length; i++) {
skills += member["skills"][i];
skills += "<br />";
}
return skills;
}

/* Compares second level category, or 'category2' of two members*/
function compMemberCats(member1, member2) {
if (member1["category2"] == member2["category2"]) {
return true;
}
return false;
}

/* Compares skills of two members*/
function compMemberSkills(member1, member2) {
for (var i = 0; i < member1["skills"].length; i++) {
for (var j=0; j < member2["skills"].length; j++) {
if (member1["skills"][i] == member2["skills"][j]) {
return true;
}
}
}
return false;
}

/* Called when a user chooses from the dialog to add a team member included in a dragged Event into the flash-team. Appends a pill under 'Team Roles' container and a popover to that pill populated with that member's data*/
function addMemberFromEvent(member) {
   memberCounter++;
var memberName = member["role"];
   
//Appends a list item pill to the memberPills ul
   $("#memberPills").append('<li class="active pill' + memberCounter + '" id="mPill_' + memberCounter + '""><a>' + memberName
       + '<div class="close" onclick="deleteMember(' + memberCounter + '); updateStatus(false);">  X</div>' + '</a></li>');

   //Clears Input
   $("#addMemberInput").val(this.placeholder);

   //Appends a popover to the pill
   $("#mPill_" + memberCounter).popover({
       placement: "right",
       html: "true",
       class: "member",
       id: '"memberPopover' + memberCounter + '"',
       trigger: "click",
       title: '<b>' + memberName + '</b>',
       content:  '<form name="memberForm_' + memberCounter + '" autocomplete="on">'
       +'<div class="mForm_' + memberCounter + '">'
           +'<div class="ui-front" class="input-append" > '
           +'<select class="category1Input" id="member' + memberCounter + '_category1"></select>'
           +'<br><br><select class="category2Input" id="member' + memberCounter + '_category2">--oDesk Sub-Category--</select>'
           +'<br><br><input class="skillInput" id="addSkillInput_' + memberCounter + '" type="text" onclick="addAuto()" placeholder="New oDesk Skill" autocomplete="on">'
           +'<button class="btn" type="button" class="addSkillButton" id="addSkillButton_' + memberCounter + '" onclick="addSkill(' + memberCounter + ');">+</button>'
           +'</div>'
           +'Skills:'  
           +'<ul class="nav nav-pills" id="skillPills_' + memberCounter + '"> </ul>'
           +'Member Color: <input type="text" class="full-spectrum" id="color_' + memberCounter + '"/>'
           +'<script type="text/javascript"> initializeColorPicker(); </script>'
           +'<p><button type="button" onclick="deleteMember(' + memberCounter + '); updateStatus(false);">Delete</button>     '
           +'<button type="button" onclick="saveMemberInfo(' + memberCounter + '); updateStatus(false);">Save</button>'
       +'</p></form>'
       +'</div>',
       container: $("#member-container")
   });

   $("#mPill_"+memberCounter).popover("show");

//Adds new member to Flash Teams JSON Object
   var newMember = {"role":memberName, "id": memberCounter, "color":"rgb(0, 168, 0)", "skills":[], "category1":"", "category2":""};
   flashTeamsJSON.members.push(newMember);
   addMemberNode(memberName, memberCounter, "#808080");

   //Adds the drop-down for two-tiered oDesk job posting categories on popover and populates member attribute values
//Preset 'category1' attribute
   for (var key in oDeskCategories) {
if (member["category1"] == key) {
$("#member" + memberCounter + "_category1").append('<option value="' + key + '" selected>' + key + '</option>');
} else {
$("#member" + memberCounter + "_category1").append('<option value="' + key + '">' + key + '</option>');
}
   }
//Presets 'category2' attribute
var category1Select = document.getElementById("member" + memberCounter + "_category1");
   var category1Name = category1Select.options[category1Select.selectedIndex].value;
   for (i = 0; i < oDeskCategories[category1Name].length; i++) {
if (oDeskCategories[category1Name][i] == member["category2"]) {
$("#member" + memberCounter + "_category2").append("<option selected>" + oDeskCategories[category1Name][i] + "</option>");
} else {
$("#member" + memberCounter + "_category2").append("<option>" + oDeskCategories[category1Name][i] + "</option>");
}
   }
//Presets 'skills' attribute and add to flashteamsJSON
   var skillName;
var indexOfJSON = getMemberJSONIndex(memberCounter);
for (j = 0; j < member["skills"].length; j++) {
skillName = member["skills"][j];
flashTeamsJSON["members"][indexOfJSON].skills.push(skillName);
$("#skillPills_" + memberCounter).append('<li class="active" id="sPill_mem' + memberCounter + '_skill' + j + '"><a>' + skillName
       + '<div class="close" onclick="deleteSkill(' + memberCounter + ', ' + j + ', &#39' + skillName + '&#39)">  X</div></a></li>');
$("#addSkillInput_" + memberCounter).val(this.placeholder);
}

   //Enables skills to be submitted by Enter key
   $(document).ready(function() {
       pressEnterKeyToSubmit("#addSkillInput_" + memberCounter, "#addSkillButton_" + memberCounter);
   });
};
/* flash_team_update.js
 * ---------------------------------
 *
 */


function updateJSONFormField() {
  $('#flash_team_json').val(JSON.stringify(flashTeamsJSON));
};

$('.edit_flash_team').submit(function(e) { 
  e.preventDefault();
  var valuesToSubmit = $(this).serialize();
  $.ajax({
    type: 'POST',
    url: $(this).attr('action'), //sumbits it to the given url of the form
    data: valuesToSubmit,
    dataType: "JSON" // you want a difference between normal and ajax-calls, and json is standard
  })
  .success(function(json){
    console.log("submit succeded");
  });
  return false; // prevents normal behaviour
});

$("#flashTeamSaveBtn").click(function() {   
  updateJSONFormField();
  $('.edit_flash_team').submit();
});
function sendEarlyCompletionEmail(uniq,minutes) {
	
	var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/early_completion_email';
    $.post(url, {uniq: uniq, minutes:minutes} ,function(data){
    	console.log("successfully sent Early Task Completion email for uniq: " + uniq);
    });
};

function sendBeforeTaskStartsEmail(minutes,email){
	
	var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/before_task_starts_email';
    $.post(url, {email: email, minutes:minutes} ,function(data){
    	console.log("successfully sent notification before task starts");
    });
};


function sendDelayedTaskFinishedEmail(minutes,uniq,title){
	
    var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/delayed_task_finished_email';
    
    $.post(url, {uniq: uniq, minutes:minutes, title: title} ,function(data){
    	console.log("successfully sent notification: delayed task is finished");
    });
};

//This function is not used anymore
function sendTaskDelayedEmail(email){
	
	var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/task_delayed_email';
    $.post(url, {email: email} ,function(data){
    	console.log("successfully sent notification: a task is delayed");
    });
};


/* called in awareness.js */
//this function is not used anymore
function delayed_notification_helper(new_remaining_tasks){
     var emails=[];
     for (var i=0;i<new_remaining_tasks.length;i++){
        var groupNum = new_remaining_tasks[i];
        for (var j = 0; j<flashTeamsJSON["events"].length; j++){
       
        eventId = flashTeamsJSON["events"][j].id;
	        if (eventId == groupNum){
	        	//alert("id == groupNum");
	            var event_tmp = flashTeamsJSON["events"][j];
	            //alert(event_tmp["members"]);
	            //TODO actual emails instead of roles
	            for( var m_i=0;m_i<event_tmp["members"].length;m_i++ ){
	            	tmp_email=event_tmp["members"][m_i];
	             	
	                if(emails.indexOf(tmp_email)==-1){
	                emails.push(tmp_email);
	                //alert("sent email to "+tmp_email);
	                sendTaskDelayedEmail(tmp_email);
	             	}
	            }
	        }
        }
    }  
};

function early_completion_helper(remaining_tasks,early_minutes){
    console.log("sending emails..");
    var uniqs_sent_already = [];
    for (var i=0;i<remaining_tasks.length;i++){
        console.log("remaining task " + i);
        var groupNum = remaining_tasks[i];
        //alert(i+" "+groupNum);
    	for (var j = 0; j<flashTeamsJSON["events"].length; j++){
            eventId = flashTeamsJSON["events"][j].id;
            console.log("event id: " + eventId);
	        if (eventId == groupNum){
	            var event_tmp = flashTeamsJSON["events"][j];
                console.log("event_tmp: " + event_tmp);
	            //TODO actual emails instead of roles
	            for(var m_i=0;m_i<event_tmp["members"].length;m_i++){
	                var memberId = parseInt(event_tmp["members"][m_i]);
                    var member = flashTeamsJSON["members"][getMemberJSONIndex(memberId)];
                    var uniq=member["uniq"];	
                                   
                    console.log("uniq: " + uniq);
	                if(uniqs_sent_already.indexOf(uniq)==-1){
	                   uniqs_sent_already.push(uniq);
	                   //alert("sent email to "+tmp_email);

                       console.log("sending early completion email..");
	                   sendEarlyCompletionEmail(uniq,early_minutes);
	                   //alert("sent email to"+tmp_email+" "+early_minutes);
	             	}
	            }
	        }
        }
    }
};
  
function DelayedTaskFinished_helper(remaining_tasks,title){
  var emails=[];
  for (var i=0;i<remaining_tasks.length;i++){
        var groupNum = remaining_tasks[i];
        //alert(i+" "+groupNum);
    	for (var j = 0; j<flashTeamsJSON["events"].length; j++){
       
        eventId = flashTeamsJSON["events"][j].id;
	        if (eventId == groupNum){
	        	
	            var event_tmp = flashTeamsJSON["events"][j];
	            
	            //TODO actual emails instead of roles
	            for( var m_i=0;m_i<event_tmp["members"].length;m_i++ ){
                        var memberId = parseInt(event_tmp["members"][m_i]);
	            	    var member = flashTeamsJSON["members"][getMemberJSONIndex(memberId)];
                    	var uniq=member["uniq"];
	             		
                        //var member_role=event_tmp["members"][m_i];
	               	  
	           
                    if(emails.indexOf(uniq)==-1){
	                	emails.push(uniq);
	                    var remaining_time= getUserNextTaskStartTime(memberId);

                        if (remaining_time != undefined){
	                       sendDelayedTaskFinishedEmail(remaining_time,uniq,title);
                           //console.log("sent delayed task finished email to"+tmp_email+" "+remaining_time);
                       }          
	             	}
	            }
	        }
        }
    }	
}  



/* get the start time of the next upcoming task of user to be notified*/
var memberId=0;
function getUserNextTaskStartTime(input_id){
   

    memberId=input_id;
    var memberName = input_id;

    currentUserEvents2 = flashTeamsJSON["events"].filter(isCurrent2);
    currentUserEvents2 = currentUserEvents2.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});
   	upcomingEvent2 = currentUserEvents2[0].id;
   
    task_g2 = getTaskGFromGroupNum(upcomingEvent2);
    console.log("???");
    console.log(currentUserEvents2);
    console.log(task_g2.data[0]);

    if (task_g2.data()[0].completed){
        toDelete = upcomingEvent2;
        currentUserEvents2.splice(0,1);
        upcomingEvent2 = currentUserEvents2[0].id;
        task_g2 = getTaskGFromGroupNum(upcomingEvent2)
    }
    
    var cursor_x = cursor.attr("x1");
    var cursorHr = (cursor_x-(cursor_x%100))/100;
    var cursorMin = (cursor_x%100)/25*15;
    if(cursorMin == 57.599999999999994) {
        cursorHr++;
        cursorMin = 0;
    } else cursorMin += 2.4
    var cursorTimeinMinutes = parseInt((cursorHr*60)) + parseInt(cursorMin);
  
   
    var displayTimeinMinutes = parseInt(currentUserEvents2[0].startHr * 60 + currentUserEvents2[0].startMin) - parseInt(cursorTimeinMinutes);
   

    var hours = parseInt(displayTimeinMinutes/60);
    var minutes = displayTimeinMinutes%60;
    if (hours==0 && minutes>1)
    	var overallTime = minutes+ " minutes";
    if (hours==1 && minutes>1)
    	var overallTime= hours + " hour "+minutes+" minutes";
    if (hours>1 && minutes>1)
    	var overallTime= hours + " hours "+minutes+" minutes";

   
    if (displayTimeinMinutes < 0){
       console.log("overallTime= "+overallTime+". Why do you want to notify the user?")
    }else{
    	return overallTime;
    } 

};       

function isCurrent2(element) {
    //var memberName = flashTeamsJSON["members"][notified_user].role;
  	return element.members.indexOf(memberId) != -1;
};
var CLIENT_ID = '527471489694-b8dd7qjjc16rn2eks7299el2l5metk8j.apps.googleusercontent.com';
var SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.install'];
folderIds = [];
// overallFolder = ["0B6l5YPiF_QFBUUNvNWxyZXJaRGM", "https://docs.google.com/a/stanford.edu/folderview?id=0B6l5YPiF_QFBUUNvNWxyZXJaRGM&usp=drivesdk"];

/**
 * Called when the client library is loaded.
 */
function handleClientLoad() {
  // gapi.load("auth:client,drive-realtime,drive-share", callback);
  checkAuth();
};

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': false},
      handleAuthResult2);
};

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult2(authResult) {
  if (authResult) {
    //console.log("Authorized!");
    // Access token has been successfully retrieved, requests can be sent to the API
  } else {
    //console.log("we need to authorize");
    // No access token could be retrieved, force the authorization flow.
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult2);
  }
};

/* File-picker javascript files*/
function onAuthApiLoad() {
  gapi.auth.authorize(
    {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
    handleAuthResult);
};

function onApiLoad(){
      gapi.load('auth', {'callback': onAuthApiLoad});
      gapi.load('picker');
};

var oauthToken;
function handleAuthResult(authResult){
  if (authResult && !authResult.error){
    oauthToken = authResult.access_token;
    createPicker();
  }
};

function createPicker(){
  var docUpload = new google.picker.DocsUploadView();
  var picker = new google.picker.PickerBuilder()
    .addView(docUpload)
    .setOAuthToken(oauthToken)
    .setDeveloperKey('AIzaSyAgrd2gp5F3KdfCH_KfN88FLR1sVEfMJfQ')
    .setCallback(pickerCallback)
    .build()
  picker.setVisible(true);
};

function pickerCallback(data){
  if (data.action == google.picker.Action.PICKED){
    alert('URL: ' + data.docs[0].url);
  }
};

function createNewFolder(eventName, JSONId){
  //console.log(eventName);
  //console.log(folderIds);
   
  //console.log("CREATING NEW FOLDER!");

  gapi.client.load('drive', 'v2', function() {
    var req;
    if (flashTeamsJSON.folder){
      req = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body':{
            "title" : eventName,
            "mimeType" : "application/vnd.google-apps.folder",
            "description" : "Shared Folder",
            "parents": [{"id": flashTeamsJSON.folder[0]}]
         }
      });
    } else {
      //console.log("Nope, this one");
      req = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body':{
            "title" : eventName,
            "mimeType" : "application/vnd.google-apps.folder",
            "description" : "Overall Shared Folder"
         }
      });
    }

    req.execute(function(resp) { 
      var folderArray = [resp.id, resp.alternateLink];
      if (!flashTeamsJSON.folder) {
        insertPermission(folderArray[0], "me", "anyone", "writer");
        flashTeamsJSON.folder = folderArray;
      } else {
        flashTeamsJSON["events"][JSONId].gdrive = folderArray;
        insertPermission(folderArray[0], "me", "anyone", "writer");
        folderIds.push(folderArray);
      }

      updateStatus(); // don't put true or false here
    });
  });
};

function addAllFolders(){
  for (var i = 0; i<flashTeamsJSON["events"].length; i++){
    createNewFolder(flashTeamsJSON["events"][i].title, i);
  }
  //console.log("isAddingFolders");
};

function createNewFile(eventName) {

    gapi.client.load('drive', 'v2', function() {

       var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body':{
            "title" : eventName + ".gdoc",
            "mimeType" : "application/vnd.google-apps.document",
            "description" : "Shared Doc"//,
            // "parents": [{"id": "0B6l5YPiF_QFBUWtPaEgyOWZmOUk"}]
         }
     });

      request.execute(function(resp) { /*console.log(resp);*/ });
   });
};

function deleteFile(fileId){
  gapi.client.load('drive', 'v2', function(){
    var request = gapi.client.drive.files.delete({
      'fileId': fileId
    });
    request.execute(function(resp) { });
  });
};

function insertPermission(fileId, value, type, role) {
  var body = {
    'value': value,
    'type': type,
    'role': role,
    'withLink': true
  };
  var request = gapi.client.drive.permissions.insert({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) { });
};
(function ($) {
  "use strict";

  var defaultOptions = {
    tagClass: function(item) {
      return 'label label-info';
    },
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    itemText: function(item) {
      return this.itemValue(item);
    },
    freeInput: true,
    maxTags: undefined,
    confirmKeys: [13],
    onTagExists: function(item, $tag) {
      $tag.hide().fadeIn();
    }
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.hide();

    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input size="' + this.inputSize + '" type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);

    this.$element.after(this.$container);

    this.build(options);
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function(item, dontPushVal) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
        return;

      // Ignore falsey values, except false
      if (item !== false && !item)
        return;

      // Throw an error when trying to add an object while the itemValue option was not set
      if (typeof item === "object" && !self.objectItems)
        throw("Can't add objects when itemValue option is not set");

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/))
        return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
        self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var items = item.split(',');
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal)
            self.pushVal();
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function(item) { return self.options.itemValue(item) === itemValue; } )[0];
      if (existing) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".tag", self.$container).filter(function() { return $(this).data("item") === existing; });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element
      var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);
      $tag.after(' ');

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !$('option[value="' + escape(itemValue) + '"]',self.$element)[0]) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal)
        self.pushVal();

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length)
        self.$container.addClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemAdded', { item: item }));
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function(item, dontPushVal) {
      var self = this;

      if (self.objectItems) {
        if (typeof item === "object")
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  self.options.itemValue(item); } )[0];
        else
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  item; } )[0];
      }

      if (item) {
        $('.tag', self.$container).filter(function() { return $(this).data('item') === item; }).remove();
        $('option', self.$element).filter(function() { return $(this).data('item') === item; }).remove();
        self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal)
        self.pushVal();

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length)
        self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved',  { item: item }));
    },

    /**
     * Removes all items
     */
    removeAll: function() {
      var self = this;

      $('.tag', self.$container).remove();
      $('option', self.$element).remove();

      while(self.itemsArray.length > 0)
        self.itemsArray.pop();

      self.pushVal();

      if (self.options.maxTags && !this.isEnabled())
        this.enable();
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function() {
      var self = this;
      $('.tag', self.$container).each(function() {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

          // Update tag's class and inner text
          $tag.attr('class', null);
          $tag.addClass('tag ' + htmlEncode(tagClass));
          $tag.contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue = htmlEncode(itemText);

          if (self.isSelect) {
            var option = $('option', self.$element).filter(function() { return $(this).data('item') === item; });
            option.attr('value', itemValue);
          }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element. 
     */
    pushVal: function() {
      var self = this,
          val = $.map(self.items(), function(item) {
            return self.options.itemValue(item).toString();
          });

      self.$element.val(val, true).trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      var typeahead = self.options.typeahead || {};

      // When itemValue is set, freeInput should always be false
      if (self.objectItems)
        self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionItemFunction(self.options, 'tagClass');

      // for backwards compatibility, self.options.source is deprecated
      if (self.options.source)
        typeahead.source = self.options.source;

      if (typeahead.source && $.fn.typeahead) {
        makeOptionFunction(typeahead, 'source');

        self.$input.typeahead({
          source: function (query, process) {
            function processItems(items) {
              var texts = [];

              for (var i = 0; i < items.length; i++) {
                var text = self.options.itemText(items[i]);
                map[text] = items[i];
                texts.push(text);
              }
              process(texts);
            }

            this.map = {};
            var map = this.map,
                data = typeahead.source(query);

            if ($.isFunction(data.success)) {
              // support for Angular promises
              data.success(processItems);
            } else {
              // support for functions and jquery promises
              $.when(data)
               .then(processItems);
            }
          },
          updater: function (text) {
            self.add(this.map[text]);
          },
          matcher: function (text) {
            return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
          },
          sorter: function (texts) {
            return texts.sort();
          },
          highlighter: function (text) {
            var regex = new RegExp( '(' + this.query + ')', 'gi' );
            return text.replace( regex, "<strong>$1</strong>" );
          }
        });
      }

      self.$container.on('click', $.proxy(function(event) {
        self.$input.focus();
      }, self));

      self.$container.on('keydown', 'input', $.proxy(function(event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev) {
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next) {
                self.remove(next.data('item'));
              }
            }
            break;

          // LEFT ARROW
          case 37:
            // Try to move the input before the previous tag
            var $prevTag = $inputWrapper.prev();
            if ($input.val().length === 0 && $prevTag[0]) {
              $prevTag.before($inputWrapper);
              $input.focus();
            }
            break;
          // RIGHT ARROW
          case 39:
            // Try to move the input after the next tag
            var $nextTag = $inputWrapper.next();
            if ($input.val().length === 0 && $nextTag[0]) {
              $nextTag.after($inputWrapper);
              $input.focus();
            }
            break;
         default:
            // When key corresponds one of the confirmKeys, add current input
            // as a new tag
            if (self.options.freeInput && $.inArray(event.which, self.options.confirmKeys) >= 0) {
              self.add($input.val());
              $input.val('');
              event.preventDefault();
            }
        }

        // Reset internal input's size
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
        self.remove($(event.target).closest('.tag').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
            self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function() {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput 
     */
    focus: function() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function() {
      var elt = this.$input[0],
          container = this.$container[0];
      while(elt && elt.parentNode !== container)
        elt = elt.parentNode;

      return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function(arg1, arg2) {
    var results = [];

    this.each(function() {
      var tagsinput = $(this).data('tagsinput');

      // Initialize a new tags input
      if (!tagsinput) {
        tagsinput = new TagsInput(this, arg1);
        $(this).data('tagsinput', tagsinput);
        results.push(tagsinput);

        if (this.tagName === 'SELECT') {
          $('option', $(this)).attr('selected', 'selected');
        }

        // Init tags from $(this).val()
        $(this).val($(this).val());
      } else {
        // Invoke function on existing tags input
        var retVal = tagsinput[arg1](arg2);
        if (retVal !== undefined)
          results.push(retVal);
      }
    });

    if ( typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;
  
  /**
   * Most options support both a string or number as well as a function as 
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function(item) { return item[propertyName]; };
    }
  }
  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function() { return value; };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');
  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function() {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
})(window.jQuery);
 var last_notification = null;

function notifyMe(notif_title, notif_body, notif_tag) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  
  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
	showNotif(notif_title, notif_body, notif_tag);
  }


  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
  
      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {
		showNotif(notif_title, notif_body, notif_tag);
                      
      }
    });
   
  }

  // At last, if the user already denied any notification, and you 
  // want to be respectful there is no need to bother him any more.
}

function showNotif(notif_title, notif_body, notif_tag){
	closeNotif(last_notification); //close any notifications that might exist from previous sessions
	
	var notification = new Notification(notif_title, {body: notif_body, tag: notif_tag});
        
    notification.addEventListener('click', closeNotif(last_notification));
    
    notification.addEventListener('close', closeNotif(last_notification));
    
    playSound("/assets/notify");
    
    last_notification = notification; 
    
}
	
function closeNotif(notif){
  if (last_notification == null)
    return;
    
  last_notification.close();
  last_notification = null;
}


//filename without extension (can be a path like "assets/notify")
function playSound(filename){   
    document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + 
    filename + '.mp3" type="audio/mpeg" /><source src="' + filename 
    + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' 
    + filename +'.mp3" /></audio>';
}
     
;
/* tour.js
 * ---------------------------------------------
 * 
 * 
 */

//A tour that walks a user through the team authoring process
var authoringTour = new Tour({
	steps: [
	{
		orphan: true, 
		title: "<b>Welcome to Foundry</b>", 
		content: "Foundry is an online platform that allows you to create "
		+"and manage teams of experts. Foundry allows you to create a team "
		+"workflow, guide the team's communication and collaboration efforts, "
		+"and monitor the team's progress.",
		backdrop: true
	}, 
	{
		element: "#member-container",
		title: "<b>Team Roles</b>",
		content: "<div class='tour-content-wrapper'>In this panel, you can add role-based "
		+"members to the team. <img src='/assets/members.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	/*{
		//ADD INFORMATION FOR THE TYPES OF WORKERS
		//E.G., PC, WORKER, CLIENT
	},*/
	{
		element: "#member-container",
		title: "<b>Customize Each Role</b>",
		html: true,
		content: "<div class='tour-content-wrapper'>Once you have added a role, you assign it to a category "
		+"and specify the necessary skills for that role " 
		+"skills based on the oDesk platform. <img src='/assets/memberForm.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Interactive Task-Based Timeline</b>",
		content: "This is the timeline. You can click to add an event "
		+"and customize it."
	},
	{
		orphan: true,
		title: "<b>Customize the Events</b>",
		content: "<div class='tour-content-wrapper'>Use the pop-up form to change the details of the events."
		+"<img src='/assets/eventForm.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Handoffs</b>",
		content: "<div class='tour-content-wrapper'>Click on the gray arrow button on an event to " 
		+"start drawing a handoff, click another event to complete the interaction. "
		+"To cancel, click on the same event."
		+"<img src='/assets/handoffs.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Collaborations</b>",
		content: "<div class='tour-content-wrapper'>Click on the black double-sided arrow button on an event to " 
		+"start drawing a collaboration between two overlapping events, "
		+" click another event to complete the interaction. "
		+"<img src='/assets/collabs.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Google Drive Integration</b>",
		content: "<div class='tour-content-wrapper'>Google Drive folders are automatically created for each "
		+"event, workers can upload their work to the folders "
		+"by clicking 'Upload' on the event."
		+"<img src='/assets/upload.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Open in Drive</b>",
		content: "<div class='tour-content-wrapper'>After clicking on 'Upload' on the event, click on the "
		+"'Open in Drive' button on the top right side of the Google " 
		+"drive page so that you can upload to the drive."
		+"<img src='/assets/openInDrive.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		element: "#search-events-container" ,
		title: "<b>Event Library</b>", 
		content: "<div class='tour-content-wrapper'>This is the event library. Here you can search over " 
		+"all previously created events by entering in keywords, inputs, "
		+"and outputs, and drag them to your timeline."
		+"<img src='/assets/eventlibrary.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		element: "#flashTeamStartBtn",
		title: "<b>Start the Team</b>",
		content: "When you are done creating your workflow and hiring team members "
		+"click here to begin the team! ",
		placement: "bottom"
	},
	{
		element: "#chat-box-container" ,
		title: "<b>Chat With the Team</b>", 
		content: "Once the team has started working, you can chat with " 
		+"all of the team members in this group chat box."
	},
	{
		orphan: true,
		title: "<b>Good luck! </b>", 
		content: "Good luck with your project and please enjoy the use of Foundry!"
	}
]});

//Initialize the tour
authoringTour.init();

$("#tourBtn").click(function(){
    authoringTour.start(true);
    authoringTour.goTo(0); //Always start tour at the first step
});


//A tour to walk the team members / experts through the use of Foundry
var expertTour = new Tour({
	steps: [
	{
		orphan: true, 
		title: "<b>Welcome to Foundry</b>", 
		content: "Here you can view your upcoming tasks, "
		+ "see where you should communicate with other members of the team "
		+ "track the progress of the project, "
		+ "and upload and download files from a shared Google Drive folder.",
		backdrop: true
	},
	{
		element: "#project-status-container",
		title: "<b>Project Status</b>", 
		content: "This panel contains information about this project including "
		+"the progress of the whole team as well as your next upcoming task. "
	},
	{
		element: "#gFolder" ,
		title: "<b>Google Drive Project Folder</b>", 
		content: "At the top is a link to the Google Drive folder " 
		+"for the entire project."
	},
	{
		element: "#chat-box-container" ,
		title: "<b>Chat With the Team</b>", 
		content: "You can use this chat feature to commmunicate with the " 
		+"members of the team as well as the project coordinator (PC)."
	},
	{
		element: "#timeline-container" ,
		title: "<b>Timeline</b>", 
		content: "This is the timeline. Here you can view the entire project's " 
		+"workflow and its current status.",
		placement: "left"
	},
	{
		orphan: true,
		title: "<b>Complete Your Events</b>", 
		content: "<div class='tour-content-wrapper'>If you are the DRI, when you have completed the work for your event, uploaded " 
		+"any relevant files, etc. you can click the event and choose 'Complete' to mark "
		+"the task as done, message the project coordinator (PC), and open the documentation questions."
		+"<img src='/assets/completeTask.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Open in Drive</b>",
		content: "<div class='tour-content-wrapper'>After clicking on 'Upload' on the event, click on the "
		+"'Open in Drive' button on the top right side of the Google " 
		+"drive page so that you can upload to the drive."
		+"<img src='/assets/openInDrive.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Delayed Events</b>", 
		content: "<div class='tour-content-wrapper'>If your work takes longer than the expected estimation, the event "
		+"will extend in red and be marked as delayed. Foundry will email you to request "
		+"a new estimated complete time so the PC can plan accordingly." 
		+"<img src='/assets/delayedTask.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Early Events</b>", 
		content: "<div class='tour-content-wrapper'>Similarly, if you complete earlier than the expected estimation, the "
		+"event will be marked in blue, downstream tasks will shift up, and "
		+"downstream workers will be notified that they can/should start early." 
		+"<img src='/assets/earlyTask.png'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{
		orphan: true,
		title: "<b>Good luck! </b>", 
		content: "Good luck with your project and please enjoy the use of Foundry!"
	}
]});


//Initialize the expert tour
expertTour.init();

$("#expertTourBtn").click(function(){
    expertTour.start(true);
    expertTour.goTo(0); //Always start the tour at the first step 
});

//TODO: PC Tour
/* //SHELL FOR THE PC TOUR
//A tour to walk the PCs through the use of Foundry
var pcTour = new Tour({
	steps: [
	{
	
	},
]});
	
//Initialize the PC tour
pcTour.init();

$("#").click(function(){
    pcTour.start(true);
    pcTour.goTo(0); //Always start the tour at the first step 
});
*/

;

function showTaskOverview(groupNum){

	var task_id = getEventJSONIndex(groupNum);
	var description = flashTeamsJSON["events"][task_id].description;
	
	if(description === undefined){
		description = "No description has been added yet.";
	}
	
	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');
		
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$('#taskOverviewEditLink').show();
		$("#taskOverviewEditLink").html('<a onclick="editTaskOverview(false,'+groupNum+')" style="font-weight: normal;">Edit</a>');
	}
	
	var taskOverviewContent = '<div id="task-description-text"><p>' + description + '</p></div>';	
	
	$('#taskOverview').html(taskOverviewContent);
	
	//modal content
	$('#task-text').html(taskOverviewContent);

	//only allow authors to edit project overview
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$("#edit-save-task").css('display', '');
		$("#edit-save-task").attr('onclick', 'editTaskOverview(true,'+groupNum+')');
		$("#edit-save-task").html('Edit');


	}
	else{
		$("#edit-save-task").css('display', 'none');
		$("#hire-task").css('display','none');
	}
}

function editTaskOverview(popover,groupNum){

	var task_id =getEventJSONIndex(groupNum);
	var description = flashTeamsJSON["events"][task_id].description;
	
	if(description === undefined){
		description = "";
	}
	
	if(popover==true){
		$('#task-edit-link').hide();
		
		var taskOverviewForm = '<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
					+'</form>';
		$('#task-text').html(taskOverviewForm);
		
		$("#edit-save-task").attr('onclick', 'saveTaskOverview('+groupNum+')');
		$("#edit-save-task").html('Save');	
	}
	
	else{
		$('#taskOverviewEditLink').hide();
	
		var taskOverviewForm = '<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
					+ '<button class="btn btn-success" type="button" onclick="saveTaskOverview('+groupNum+')" style="float: right;">Save</button>'
					+'</form>';
			
		$('#taskOverview').html(taskOverviewForm);
	}
				
}


function saveTaskOverview(groupNum){
	var task_id = getEventJSONIndex(groupNum); 
	// retrieve project overview from form
    var description_input = $("#descriptionInput").val();
    
    		if (description_input === "") {
        		description_input =  "No task description has been added yet.";
				//alert("Please enter a project overview.");
				//return;
		}
	 
    flashTeamsJSON["events"][task_id].description =description_input;
    
    console.log("saved task description: " +   flashTeamsJSON["events"][task_id].description);
    
    updateStatus();
    
    showTaskOverview(groupNum);
}
;
function hireForm(groupNum){
	var task_id =getEventJSONIndex(groupNum);

	var url = task_id +'/hire_form';
    window.open(url);        	
}
;
/* completeTask.js
 * ---------------------------------------------
 * 
 */


//Fires on "Start" button on task modal
 function startTask(groupNum) {
    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    eventObj.status = "started";

    //START HERE
    //

    updateStatus();
 }

//Alert firing on event complete buttons
function confirmCompleteTask(groupNum) { 
    //Creates the alert modal title
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Have You Completed This Task?";

    //Gets information from event using id
    var indexOfJSON = getEventJSONIndex(groupNum);
    var events = flashTeamsJSON["events"];
    var eventToComplete = events[indexOfJSON];

    //Edits the confirmAction modal from _confirm_action.html.erb
    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = completeTaskModalText(eventToComplete);

    //Code for the Task Completed Button
    var completeButton = document.getElementById("confirmButton");
    completeButton.innerHTML = "Task Completed";
    $("#confirmButton").attr("class","btn btn-success");
    if (eventToComplete.outputs != null && eventToComplete.outputs != "") {
        $("#confirmButton").prop('disabled', true); //Defaults to disabled
    }
    $('#confirmAction').modal('show');
    
    //Set change function on checkboxes, enable button if all checkboxes are checked
    $(".outputCheckbox").change(function() {
        var totalCheckboxes = $(".outputCheckbox").length;
        var checkedCheckboxes = $(".outputCheckbox:checked").length;
        if (totalCheckboxes == checkedCheckboxes) {
            $("#confirmButton").prop('disabled', false);
        } else {
            $("#confirmButton").prop('disabled', true);
        }
    });

    //Calls completeTask function if user confirms the complete
    document.getElementById("confirmButton").onclick=function(){
    	$('#confirmAction').modal('hide');
    	completeTask(groupNum);
    };
    hidePopover(groupNum); 
}

//Return text to fill complete task modal
function completeTaskModalText(eventToComplete) {
    var modalText = "<b>Outputs for " + eventToComplete["title"] + ":</b>";

    //Get outputs from eventObj
    var eventOutputs = eventToComplete.outputs;
    if (eventOutputs != null && eventOutputs != "") {
        eventOutputs = eventToComplete.outputs.split(",");
    }

    //Create Checklist of outputs
    modalText += "<form id='event_checklist_" + eventToComplete.id + "' >";
    if (eventOutputs == null || eventOutputs == "") {
        modalText += "No outputs were specified for this task.";
    } else {
        for (i=0; i<eventOutputs.length; i++) {
            modalText += "<input type='checkbox' class='outputCheckbox'>" + eventOutputs[i] + "</input><br>";
        }
    }
    
    modalText += "</form>";
    modalText+= "<br>Click 'Task Completed' to alert the PC and move on to the documentation questons."
    return modalText;
}

//Called when user confirms event completion alert
var completeTask = function(groupNum){
    //Update the status of a task
    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventToComplete = flashTeamsJSON["events"][indexOfJSON];
    eventToComplete.status = "completed";

    //TODO: Iteration Marker - if we iterate and want to put it on the task, do it here

    //Update database, must be false b/c we are not using the old ticker
    updateStatus(false);
    drawEvent(eventToComplete);

    //Message the PC that the task has been completed
    //TODO

    //Guide worker to documentation questions
    //TODO




    //------------------------------//
    //OLD TICKER VERSION CODE, TO DELETE LATER, USE TO MAKE SURE NOT MISSING CASES??
    /*
    $('#confirmAction').modal('hide');
    var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

    var cursor_x = cursor.attr("x1");
    ev.completed_x = cursor_x;

    // remove from either live or delayed tasks
    var idx = delayed_tasks.indexOf(groupNum);
    if (idx != -1) { // delayed task
        delayed_tasks.splice(idx, 1);
        completed_red_tasks.push(groupNum);
        //updateStatus(true);
        console.log("removed task from delayed and added to completed_red");
        sendEmailOnCompletionOfDelayedTask(groupNum);
    } else {
        idx = live_tasks.indexOf(groupNum);
        if (idx != -1){ // live task
            var task_g = getTaskGFromGroupNum (groupNum);
            var blue_width = drawBlueBox(ev, task_g);
            if (blue_width !== null){
                drawn_blue_tasks.push(groupNum);
                moveRemainingTasksLeft(blue_width);
                //updateStatus(true);
                sendEmailOnEarlyCompletion(blue_width);
            }
            live_tasks.splice(idx, 1);
        }
    }
    hidePopover(groupNum);

    // update db
    updateStatus(true);

    // reload status bar
    load_statusBar(status_bar_timeline_interval);*/
    //------------------------------//

};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//


// require_tree ./d3


// require ./bootstrap/bootstrap



























;
