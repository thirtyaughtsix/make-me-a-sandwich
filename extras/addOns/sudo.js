// ###getXhr
// While getting a new XMLHttpRequest is standardized now, we are still going 
// to provide this syntactic sugar to allow the setting of global headers (will
// be set on each request) as well as the onload, onerrer, and onloadend callbacks
// to be set with one call.
// Does not have a default for params.url all others are:
//   {
//     verb: 'GET',
//     responseType: 'text',
//     url: mandatory,
//     params: optional,
//     onload: _.noop,
//     onerrer: optional,
//     onloadend: optional,
//     user: optional,
//     password: optional
//   }
// If the verb is 'GET' and params is truthy it will be appended to the url as a 
// queryString (after being serialized if a hash -- assumed to be a string if not).
// This method does not call send() so do that once you have the xhr back, remember
// to set any pertinant MIME types if sending data via setRequestHeader (unless its 
// already in the sudo.xhrHeaders).
//
// `param` {object} attributes for the XHR
// `returns` {object} the xhr object
sudo.getXhr = function getXhr(params) {
  var xhr =  new XMLHttpRequest(), keys = Object.keys(sudo.xhrHeaders),
    len = keys.length, i;
  params.verb || (params.verb = 'GET');
  // check if we need a QS
  if(params.verb === 'GET' && params.params) {
    // assumed to be an object literal
    if(typeof params.params !== 'string') params.params = Object.serialize(params.params);
    params.url += ('?' + params.params);
  }
  xhr.open(params.verb, params.url, true, params.user, params.password);
  xhr.responseType = params.responseType || 'text';
  // so that some common use-case request headers can be set automagically, for blob, 
  // document, buffer and others handle manually after getting the xhr back.
  if(xhr.responseType === 'text') {
    // could be json or plain string TODO expand this to a hash lookup for other types later
    if(params.contentType && params.contentType === 'json') {
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');
      // TODO does this work as expected?
    } else {
      xhr.setRequestHeader('Accept', 'text/plain');
      xhr.setRequestHeader('Content-Type', 'text/plain');
    }
  }
  // set any custom headers
  if(len) for(i = 0; i < len; i++) xhr.setRequestHeader(keys[i], sudo.xhrHeaders[keys[i]]);
  xhr.onload = params.onload || sudo.noop;
  if(params.onerror) xhr.onerror = params.onerror;
  if(params.onloadend) xhr.onloadend = params.onloadend;
  return xhr;
};
// ###xhrHeaders
// Any 'global' headers that should go out with every XHR request 
sudo.xhrHeaders = {};