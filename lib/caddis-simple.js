'use strict';

var caddis = require('caddis'),
    request = require('request'),
    Q = require('q');

var simple = {};
simple.listen = function (port) {
    if (!port) port = 9999;
    return new CaddisClient(Q.nbind(caddis.listen, caddis), port, 'http://localhost:9999');
}

var CaddisClient = function (caddisPromiseFn, port, url) {
    var self = this;
    this.caddisPromise = caddisPromiseFn(port, function () { self.server = this; });
    this.url = url;
    this.port = port;
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

CaddisClient.prototype.stop = function (callback) {
    if (callback) {
        this.server.close(callback);
    } else {
        this.server.close();
    }
}

CaddisClient.prototype.when = function (method, path, obj) {
    var self = this;
    return self.caddisPromise.then(Q.nfcall(request.post, {
        url: self.url + '/api',
        body: JSON.stringify({
            method: method,
            uri: path,
            response: obj
        })
    }));
}

module.exports = simple;
