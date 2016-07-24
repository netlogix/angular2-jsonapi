"use strict";
var _1 = require("../../");
var ResourceProxyRepository = (function () {
    function ResourceProxyRepository(_consumerBackend) {
        this._consumerBackend = _consumerBackend;
        this.resource = _1.ResourceProxy;
    }
    ResourceProxyRepository.prototype.findAll = function (filter, include) {
        return this._consumerBackend.findByTypeAndFilter(this.resource._typeName, filter, include);
    };
    ResourceProxyRepository.prototype.findOne = function (filter, include) {
        var _this = this;
        return this.findAll(filter, include).map(function (values) {
            if (values.length) {
                return values[0];
            }
            throw 'The object of type "' + _this.resource._typeName + '" does not exist.';
        });
    };
    ResourceProxyRepository.prototype.findByIdentifier = function (identifier, include) {
        return this.findOne({ __identity: identifier }, include);
    };
    return ResourceProxyRepository;
}());
exports.ResourceProxyRepository = ResourceProxyRepository;
//# sourceMappingURL=resource-proxy-repository.js.map