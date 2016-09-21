var Trello = function (key, token) {
  var self = this;
  self.key = key;
  self.token = token;
  self.host = 'https://api.trello.com/1';


  var _authedUser = function(args) {
    args.key = self.key;
    args.token = self.token;
    return args;
  };

  var _parseQuery = function(uri, args) {
    if(uri.indexOf('?') > -1) {
      var ref = _querystring.parse(uri.split('?')[1]);
      for(var key in ref) {
        var value = ref[key];
        args[key] = value;
      }
    }
    return args;
  };

  var _stringifyPrimitive = function(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  };

  var _querystring = {
    stringify: function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }

      if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(_stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(_stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(_stringifyPrimitive(obj[k]));
          }
        }).join(sep);

      }

      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    },

    parse: function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};

      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }

      var regexp = /\+/g;
      qs = qs.split(sep);

      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }

      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }

      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }

      return obj;
    }
  };

  var get = function() {
    Array.prototype.unshift.call(arguments, "GET");
    return request.apply(this, arguments);
  };

  var post = function() {
    Array.prototype.unshift.call(arguments, 'POST');
    return request.apply(this, arguments);
  };

  var put = function() {
    Array.prototype.unshift.call(arguments, 'PUT');
    return request.apply(this, arguments);
  };

  var del = function() {
    Array.prototype.unshift.call(arguments, 'DELETE');
    return request.apply(this, arguments);
  };

  var request = function(method, uri, argsOrCallback, callback) {
    var args;

    if(arguments.length === 3) {
      callback = argsOrCallback;
      args = {};
    } else {
      args = argsOrCallback || {};
    }

    callback = callback || function(err, data) {
      return data;
    };

    var url = self.host + (uri[0] === '/' ? '' : '/') + uri;
    var options = {
      method: method,
      muteHttpExceptions: true
    };    

    if (method === 'GET') {
      url += '?' + _querystring.stringify(_authedUser(_parseQuery(uri, args)));
    } else {

      options.payload = _authedUser(_parseQuery(uri, args));
      
      if(args.attachment) {
        if(typeof args.attachment === 'string') {
          options.payload.url = args.attachment;
        } else {
          options.payload.file = args.attachment;
        }
      }
    }
    
    var data = UrlFetchApp.fetch(url, options);
    var content = data.getContentText();
    
    if(data.getResponseCode() === 200) {
      return callback(false, JSON.parse(content));
    } else {
      return callback(true, content);
    }

  };

  if (!key || !token) {
    throw new Error("Application API key & token is required");
  } else {
    return {
      get: get,
      post: post,
      put: put,
      del: del
    };
  }
}
