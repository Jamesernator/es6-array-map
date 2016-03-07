// Generated by CoffeeScript 1.10.0
(function() {
  "use strict";
  var ArrayMap, iterEach, iterJoin, iterMap;

  iterMap = function*(iterable, func) {

    /* This applies a function to each item in an iterable */
    var done, iterator, ref, value;
    iterator = iterable[Symbol.iterator]();
    while (true) {
      ref = iterator.next(), done = ref.done, value = ref.value;
      if (done) {
        return value;
      }
      (yield func(value));
    }
  };

  iterEach = function(iterable, func) {

    /* Calls a given function on each value of the iterable */
    var done, iterator, ref, value;
    iterator = iterable[Symbol.iterator]();
    while (true) {
      ref = iterator.next(), done = ref.done, value = ref.value;
      if (done) {
        return value;
      }
      func(value);
    }
  };

  iterJoin = function*(iterable, generatorFunc) {

    /* This yields all values from the generator function
        applied to each of the values in iterable,
        e.g.
        gen = ->
            yield from join [[1,2], [3,4]], (sublist) ->
                yield from sublist
    
        Array.from(gen) # [1,2,3,4]
     */
    var done, iterator, ref, value;
    iterator = iterable[Symbol.iterator]();
    while (true) {
      ref = iterator.next(), done = ref.done, value = ref.value;
      if (done) {
        return value;
      }
      (yield* generatorFunc(value));
    }
  };

  ArrayMap = (function() {
    function ArrayMap() {
      this.size = 0;
      this.subMaps = null;
      this.value = void 0;
      this.hasValue = false;
    }

    ArrayMap.prototype.clear = function() {

      /* Removes everything from the arrayMap */
      this.size = 0;
      this.subMaps = null;
      this.value = void 0;
      return this.hasValue = false;
    };

    ArrayMap.prototype["delete"] = function(arrayKey) {

      /* Removes a given arrayKey from the arrayMap, if it existed
          return true, else return false
       */
      var newSize, previousSize, result;
      if (arrayKey.length === 0) {
        if (this.hasValue) {
          this.size -= 1;
        }
        this.value = void 0;
        this.hasValue = false;
        return true;
      } else if (this.subMaps == null) {
        return false;
      } else if (!this.subMaps.has(arrayKey[0])) {
        return false;
      } else {
        previousSize = this.subMaps.get(arrayKey[0]).size;
        result = this.subMaps.get(arrayKey[0])["delete"](arrayKey.slice(1));
        newSize = this.subMaps.get(arrayKey[0]).size;
        this.size += newSize - previousSize;
        if (this.subMaps.get(arrayKey[0]).size === 0) {
          this.subMaps["delete"](arrayKey[0]);
        }
        if (this.subMaps.size === 0) {
          this.subMaps = null;
        }
        return result;
      }
    };

    ArrayMap.prototype.entries = function*() {

      /* Returns an iterator of entries in the arrayMap */
      if (this.hasValue) {
        (yield [[], this.value]);
      }
      if (this.subMaps != null) {
        return (yield* iterJoin(this.subMaps, (function(_this) {
          return function*(arg) {
            var key, subEntries, subMap;
            key = arg[0], subMap = arg[1];
            subEntries = _this.subMaps.get(key).entries();
            return (yield* iterMap(subEntries, function(arg1) {
              var subKey, value;
              subKey = arg1[0], value = arg1[1];
              return [[key].concat(subKey), value];
            }));
          };
        })(this)));
      }
    };

    ArrayMap.prototype.forEach = function(callback, thisArg) {

      /* Calls the callback (bound to thisArg), on each value, key pair
          of the ArrayMap
       */
      var _callback;
      _callback = callback.bind(thisArg);
      return iterEach(this.entries(), (function(_this) {
        return function(arg) {
          var key, value;
          key = arg[0], value = arg[1];
          return _callback(value, key, _this);
        };
      })(this));
    };

    ArrayMap.prototype.get = function(arrayKey) {

      /* Returns the value associated with a given arrayKey
          returns undefined if we don't have such a value
       */
      if (arrayKey.length === 0) {
        return this.value;
      } else if (this.subMaps == null) {
        return void 0;
      } else if (!this.subMaps.has(arrayKey[0])) {
        return void 0;
      } else {
        return this.subMaps.get(arrayKey[0]).get(arrayKey.slice(1));
      }
    };

    ArrayMap.prototype.has = function(arrayKey) {

      /* Returns true if there is a value associated with arrayKey,
          false otherwise
       */
      if (arrayKey.length === 0) {
        return this.hasValue;
      } else if (this.subMaps == null) {
        return false;
      } else if (!this.subMaps.has(arrayKey[0])) {
        return false;
      } else {
        return this.subMaps.get(arrayKey[0]).has(arrayKey.slice(1));
      }
    };

    ArrayMap.prototype.keys = function*() {

      /* Returns an iterator of keys of the arrayMap */
      return (yield* iterMap(this.entries(), function(arg) {
        var _, key;
        key = arg[0], _ = arg[1];
        return key;
      }));
    };

    ArrayMap.prototype.set = function(arrayKey, value) {

      /* Associates in the map the given arrayKey with the given value */
      var newSize, previousSize;
      if (arrayKey.length === 0) {
        if (!this.hasValue) {
          this.size += 1;
        }
        this.value = value;
        this.hasValue = true;
      } else {
        if (this.subMaps == null) {
          this.subMaps = new Map();
        }
        if (!this.subMaps.has(arrayKey[0])) {
          this.subMaps.set(arrayKey[0], new ArrayMap());
        }
        previousSize = this.subMaps.get(arrayKey[0]).size;
        this.subMaps.get(arrayKey[0]).set(arrayKey.slice(1), value);
        newSize = this.subMaps.get(arrayKey[0]).size;
        this.size += newSize - previousSize;
      }
      return this;
    };

    ArrayMap.prototype.values = function*() {

      /* Returns an iterator of values of the arrayMap */
      return (yield* iterMap(this.entries(), function(arg) {
        var _, value;
        _ = arg[0], value = arg[1];
        return value;
      }));
    };

    ArrayMap.prototype[Symbol.iterator] = function() {

      /* Returns an iterator of [key, value] pairs */
      return this.entries();
    };

    return ArrayMap;

  })();

  module.exports = ArrayMap;

}).call(this);
