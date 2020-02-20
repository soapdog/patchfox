import { c as createCommonjsModule } from './common/_commonjsHelpers-6a48b99e.js';

var abortCb = function abortCb(cb, abort, onAbort) {
  cb(abort);
  onAbort && onAbort(abort === true ? null: abort);
  return
};

var values = function values (array, onAbort) {
  if(!array)
    return function (abort, cb) {
      if(abort) return abortCb(cb, abort, onAbort)
      return cb(true)
    }
  if(!Array.isArray(array))
    array = Object.keys(array).map(function (k) {
      return array[k]
    });
  var i = 0;
  return function (abort, cb) {
    if(abort)
      return abortCb(cb, abort, onAbort)
    if(i >= array.length)
      cb(true);
    else
      cb(null, array[i++]);
  }
};

var keys = function (object) {
  return values(Object.keys(object))
};

var once = function once (value, onAbort) {
  return function (abort, cb) {
    if(abort)
      return abortCb(cb, abort, onAbort)
    if(value != null) {
      var _value = value; value = null;
      cb(null, _value);
    } else
      cb(true);
  }
};

var count = function count (max) {
  var i = 0; max = max || Infinity;
  return function (end, cb) {
    if(end) return cb && cb(end)
    if(i > max)
      return cb(true)
    cb(null, i++);
  }
};

var infinite = function infinite (generate) {
  generate = generate || Math.random;
  return function (end, cb) {
    if(end) return cb && cb(end)
    return cb(null, generate())
  }
};

//a stream that ends immediately.
var empty = function empty () {
  return function (abort, cb) {
    cb(true);
  }
};

//a stream that errors immediately.
var error = function error (err) {
  return function (abort, cb) {
    cb(err);
  }
};

var sources = {
  keys: keys,
  once: once,
  values: values,
  count: count,
  infinite: infinite,
  empty: empty,
  error: error
};

var drain = function drain (op, done) {
  var read, abort;

  function sink (_read) {
    read = _read;
    if(abort) return sink.abort()
    //this function is much simpler to write if you
    //just use recursion, but by using a while loop
    //we do not blow the stack if the stream happens to be sync.
    ;(function next() {
        var loop = true, cbed = false;
        while(loop) {
          cbed = false;
          read(null, function (end, data) {
            cbed = true;
            if(end = end || abort) {
              loop = false;
              if(done) done(end === true ? null : end);
              else if(end && end !== true)
                throw end
            }
            else if(op && false === op(data) || abort) {
              loop = false;
              read(abort || true, done || function () {});
            }
            else if(!loop){
              next();
            }
          });
          if(!cbed) {
            loop = false;
            return
          }
        }
      })();
  }

  sink.abort = function (err, cb) {
    if('function' == typeof err)
      cb = err, err = true;
    abort = err || true;
    if(read) return read(abort, cb || function () {})
  };

  return sink
};

var onEnd = function onEnd (done) {
  return drain(null, done)
};

var log = function log (done) {
  return drain(function (data) {
    console.log(data);
  }, done)
};

var prop = function prop (key) {
  return key && (
    'string' == typeof key
    ? function (data) { return data[key] }
    : 'object' === typeof key && 'function' === typeof key.exec //regexp
    ? function (data) { var v = key.exec(data); return v && v[0] }
    : key
  )
};

function id (e) { return e }



var find = function find (test, cb) {
  var ended = false;
  if(!cb)
    cb = test, test = id;
  else
    test = prop(test) || id;

  return drain(function (data) {
    if(test(data)) {
      ended = true;
      cb(null, data);
    return false
    }
  }, function (err) {
    if(ended) return //already called back
    cb(err === true ? null : err, null);
  })
};

var reduce = function reduce (reducer, acc, cb ) {
  if(!cb) cb = acc, acc = null;
  var sink = drain(function (data) {
    acc = reducer(acc, data);
  }, function (err) {
    cb(err, acc);
  });
  if (arguments.length === 2)
    return function (source) {
      source(null, function (end, data) {
        //if ended immediately, and no initial...
        if(end) return cb(end === true ? null : end)
        acc = data; sink(source);
      });
    }
  else
    return sink
};

var collect = function collect (cb) {
  return reduce(function (arr, item) {
    arr.push(item);
    return arr
  }, [], cb)
};

var concat = function concat (cb) {
  return reduce(function (a, b) {
    return a + b
  }, '', cb)
};

var sinks = {
  drain: drain,
  onEnd: onEnd,
  log: log,
  find: find,
  reduce: reduce,
  collect: collect,
  concat: concat
};

function id$1 (e) { return e }


var map = function map (mapper) {
  if(!mapper) return id$1
  mapper = prop(mapper);
  return function (read) {
    return function (abort, cb) {
      read(abort, function (end, data) {
        try {
        data = !end ? mapper(data) : null;
        } catch (err) {
          return read(err, function () {
            return cb(err)
          })
        }
        cb(end, data);
      });
    }
  }
};

function id$2 (e) { return e }


var asyncMap = function asyncMap (map) {
  if(!map) return id$2
  map = prop(map);
  var busy = false, abortCb, aborted;
  return function (read) {
    return function next (abort, cb) {
      if(aborted) return cb(aborted)
      if(abort) {
        aborted = abort;
        if(!busy) read(abort, function (err) {
          //incase the source has already ended normally,
          //we should pass our own error.
          cb(abort);
        });
        else read(abort, function (err) {
          //if we are still busy, wait for the mapper to complete.
          if(busy) abortCb = cb;
          else cb(abort);
        });
      }
      else
        read(null, function (end, data) {
          if(end) cb(end);
          else if(aborted) cb(aborted);
          else {
            busy = true;
            map(data, function (err, data) {
              busy = false;
              if(aborted) {
                cb(aborted);
                abortCb && abortCb(aborted);
              }
              else if(err) next (err, cb);
              else cb(null, data);
            });
          }
        });
    }
  }
};

function id$3 (e) { return e }

var tester = function tester (test) {
  return (
    'object' === typeof test && 'function' === typeof test.test //regexp
    ? function (data) { return test.test(data) }
    : prop (test) || id$3
  )
};

var filter = function filter (test) {
  //regexp
  test = tester(test);
  return function (read) {
    return function next (end, cb) {
      var sync, loop = true;
      while(loop) {
        loop = false;
        sync = true;
        read(end, function (end, data) {
          if(!end && !test(data))
            return sync ? loop = true : next(end, cb)
          cb(end, data);
        });
        sync = false;
      }
    }
  }
};

var filterNot = function filterNot (test) {
  test = tester(test);
  return filter(function (data) { return !test(data) })
};

//a pass through stream that doesn't change the value.
var through = function through (op, onEnd) {
  var a = false;

  function once (abort) {
    if(a || !onEnd) return
    a = true;
    onEnd(abort === true ? null : abort);
  }

  return function (read) {
    return function (end, cb) {
      if(end) once(end);
      return read(end, function (end, data) {
        if(!end) op && op(data);
        else once(end);
        cb(end, data);
      })
    }
  }
};

//read a number of items and then stop.
var take = function take (test, opts) {
  opts = opts || {};
  var last = opts.last || false; // whether the first item for which !test(item) should still pass
  var ended = false;
  if('number' === typeof test) {
    last = true;
    var n = test; test = function () {
      return --n
    };
  }

  return function (read) {

    function terminate (cb) {
      read(true, function (err) {
        last = false; cb(err || true);
      });
    }

    return function (end, cb) {
      if(ended && !end) last ? terminate(cb) : cb(ended);
      else if(ended = end) read(ended, cb);
      else
        read(null, function (end, data) {
          if(ended = ended || end) {
            //last ? terminate(cb) :
            cb(ended);
          }
          else if(!test(data)) {
            ended = true;
            last ? cb(null, data) : terminate(cb);
          }
          else
            cb(null, data);
        });
    }
  }
};

function id$4 (e) { return e }



//drop items you have already seen.
var unique = function unique (field, invert) {
  field = prop(field) || id$4;
  var seen = {};
  return filter(function (data) {
    var key = field(data);
    if(seen[key]) return !!invert //false, by default
    else seen[key] = true;
    return !invert //true by default
  })
};

//passes an item through when you see it for the second time.
var nonUnique = function nonUnique (field) {
  return unique(field, true)
};

//convert a stream of arrays or streams into just a stream.
var flatten = function flatten () {
  return function (read) {
    var _read;
    return function (abort, cb) {
      if (abort) { //abort the current stream, and then stream of streams.
        _read ? _read(abort, function(err) {
          read(err || abort, cb);
        }) : read(abort, cb);
      }
      else if(_read) nextChunk();
      else nextStream();

      function nextChunk () {
        _read(null, function (err, data) {
          if (err === true) nextStream();
          else if (err) {
            read(true, function(abortErr) {
              // TODO: what do we do with the abortErr?
              cb(err);
            });
          }
          else cb(null, data);
        });
      }
      function nextStream () {
        _read = null;
        read(null, function (end, stream) {
          if(end)
            return cb(end)
          if(Array.isArray(stream) || stream && 'object' === typeof stream)
            stream = values(stream);
          else if('function' != typeof stream)
            stream = once(stream);
          _read = stream;
          nextChunk();
        });
      }
    }
  }
};

var throughs = {
  map: map,
  asyncMap: asyncMap,
  filter: filter,
  filterNot: filterNot,
  through: through,
  take: take,
  unique: unique,
  nonUnique: nonUnique,
  flatten: flatten
};

var pull = function pull (a) {
  var length = arguments.length;
  if (typeof a === 'function' && a.length === 1) {
    var args = new Array(length);
    for(var i = 0; i < length; i++)
      args[i] = arguments[i];
    return function (read) {
      if (args == null) {
        throw new TypeError("partial sink should only be called once!")
      }

      // Grab the reference after the check, because it's always an array now
      // (engines like that kind of consistency).
      var ref = args;
      args = null;

      // Prioritize common case of small number of pulls.
      switch (length) {
      case 1: return pull(read, ref[0])
      case 2: return pull(read, ref[0], ref[1])
      case 3: return pull(read, ref[0], ref[1], ref[2])
      case 4: return pull(read, ref[0], ref[1], ref[2], ref[3])
      default:
        ref.unshift(read);
        return pull.apply(null, ref)
      }
    }
  }

  var read = a;

  if (read && typeof read.source === 'function') {
    read = read.source;
  }

  for (var i = 1; i < length; i++) {
    var s = arguments[i];
    if (typeof s === 'function') {
      read = s(read);
    } else if (s && typeof s === 'object') {
      s.sink(read);
      read = s.source;
    }
  }

  return read
};

var pullStream = createCommonjsModule(function (module, exports) {





exports = module.exports = pull;

exports.pull = exports;

for(var k in sources)
  exports[k] = sources[k];

for(var k in throughs)
  exports[k] = throughs[k];

for(var k in sinks)
  exports[k] = sinks[k];
});
var pullStream_1 = pullStream.pull;

export default pullStream;
export { pullStream_1 as pull };
