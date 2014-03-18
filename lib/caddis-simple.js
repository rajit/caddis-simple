var caddis = require('caddis'),
    request = require('request'),
    Q = require('q');

var simple = {};
simple.listen = function (port) {
    if (!port) port = 9999;
    return new CaddisClient(Q.nfcall(caddis.start, port), 'http://localhost:9999');
}

var CaddisClient = function (caddisPromise, url) {
    this.caddisPromise = caddisPromise;
    this.url = url;
}

CaddisClient.prototype.GET = function (path, ret) {
    return this.when('GET', path, ret);
}

CaddisClient.prototype.POST = function (path, post, ret) {
    return this.when('POST', path, ret, post);
}

CaddisClient.prototype.PUT = function (path, put, ret) {
    return this.when('PUT', path, ret, put);
}

CaddisClient.prototype.DELETE = function (path, obj) {
    return this.when('DELETE', path, obj);
}

CaddisClient.prototype.when = function (method, path, obj) {
    var self = this;
    return self.caddisPromise.nfcall(request.post, {
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        url: self.url + '/api',
        body: JSON.stringify({
            method: method,
            uri: path,
            response: obj
        })
    });
}

module.exports = simple;
