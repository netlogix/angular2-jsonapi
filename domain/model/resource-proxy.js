"use strict";
var Rx_1 = require("rxjs/Rx");
var _1 = require("../../");
var ResourceProxy = (function () {
    function ResourceProxy() {
        this._relationshipLoadedSubject = {};
        this.registerTypeName();
        this._type.registerAccessesors(this);
        this.payload = this._type.getPayloadTemplate();
    }
    Object.defineProperty(ResourceProxy.prototype, "$type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceProxy.prototype, "$identity", {
        get: function () {
            return {
                id: this._payload.id,
                type: this._payload.type
            };
        },
        enumerable: true,
        configurable: true
    });
    ResourceProxy.prototype.toString = function () {
        return '[[' + this.$identity.type + '][' + this.$identity.id + ']]';
    };
    Object.defineProperty(ResourceProxy.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        set: function (payload) {
            var _this = this;
            this._payload = payload;
            this.registerEventEmitters();
            this._payload.propertyChanged.subscribe(function (propertyName) {
                _this.emitRelationshipLoaded(propertyName);
            });
        },
        enumerable: true,
        configurable: true
    });
    ResourceProxy.prototype.offsetExists = function (propertyName) {
        return !!this._type.getPropertyDefinition(propertyName);
    };
    ResourceProxy.prototype.offsetGet = function (propertyName) {
        var property = this._type.getPropertyDefinition(propertyName);
        switch (property.type) {
            case _1.Property.ATTRIBUTE_TYPE:
                return this.offsetGetForAttribute(property.name);
            case _1.Property.SINGLE_RELATIONSHIP_TYPE:
                return this.offsetGetForSingleRelationship(property.name);
            case _1.Property.COLLECTION_RELATIONSHIP_TYPE:
                return this.offsetGetForCollectionRelationship(property.name);
        }
    };
    ResourceProxy.prototype.offsetGetLoaded = function (propertyName) {
        var _this = this;
        return new Promise(function (resolve) {
            try {
                resolve(_this.offsetGet(propertyName));
            }
            catch (e) {
                var subscription_1 = _this.loadRelationship(propertyName).subscribe(function () {
                    subscription_1.unsubscribe();
                    resolve(_this.offsetGet(propertyName));
                });
            }
        });
    };
    ResourceProxy.prototype.offsetGetAsync = function (propertyName) {
        return this.getRelationshipLoadedSubject(propertyName).asObservable();
    };
    ResourceProxy.prototype.offsetSet = function (propertyName, value) {
        var property = this._type.getPropertyDefinition(propertyName);
        switch (property.type) {
            case _1.Property.ATTRIBUTE_TYPE:
                this.offsetSetForAttribute(property.name, value);
                break;
            case _1.Property.SINGLE_RELATIONSHIP_TYPE:
                this.offsetSetForSingleRelationship(property.name, value);
                this.emitRelationshipLoaded(property.name);
                break;
            case _1.Property.COLLECTION_RELATIONSHIP_TYPE:
                this.offsetSetForCollectionelationship(property.name, value);
                this.emitRelationshipLoaded(property.name);
                break;
        }
    };
    ResourceProxy.prototype.loadRelationship = function (propertyName) {
        var _this = this;
        var property = this._type.getPropertyDefinition(propertyName);
        switch (property.type) {
            case _1.Property.COLLECTION_RELATIONSHIP_TYPE:
                if (!this._payload['relationships'][property.name].hasOwnProperty('data')) {
                    this._payload['relationships'][property.name].data = [];
                }
                break;
            case _1.Property.SINGLE_RELATIONSHIP_TYPE:
                if (!this._payload['relationships'][property.name].hasOwnProperty('data')) {
                    this._payload['relationships'][property.name].data = null;
                }
                break;
        }
        return this._type.consumerBackend.fetchContentFromUri(this._payload['relationships'][property.name]['links']['related']).map(function (results) {
            switch (property.type) {
                case _1.Property.COLLECTION_RELATIONSHIP_TYPE:
                    _this._payload['relationships'][property.name]['data'] = [];
                    results.forEach(function (option) {
                        _this._payload['relationships'][property.name]['data'].push(option.$identity);
                    });
                    break;
                case _1.Property.SINGLE_RELATIONSHIP_TYPE:
                    var result = results[0];
                    if (result) {
                        _this._payload['relationships'][property.name]['data'] = result.$identity;
                    }
                    else {
                        _this._payload['relationships'][property.name]['data'] = null;
                    }
                    break;
            }
            _this.emitRelationshipLoaded(property.name);
            return _this.offsetGet(propertyName);
        });
    };
    ResourceProxy.prototype.offsetGetForAttribute = function (propertyName) {
        return this._payload['attributes'][propertyName];
    };
    ResourceProxy.prototype.offsetGetForSingleRelationship = function (propertyName) {
        var payload = this.getRelationshipPayloadData(propertyName);
        if (payload === null) {
            return null;
        }
        return this._type.consumerBackend.getFromUnitOfWork(payload.type, payload.id);
    };
    ResourceProxy.prototype.offsetGetForCollectionRelationship = function (propertyName) {
        var _this = this;
        var results = [];
        var payloads = this.getRelationshipPayloadData(propertyName);
        (payloads || []).forEach(function (payload) {
            results.push(_this._type.consumerBackend.getFromUnitOfWork(payload.type, payload.id));
        });
        return results;
    };
    ResourceProxy.prototype.getRelationshipPayloadData = function (propertyName) {
        if (!this._payload.relationships) {
            throw ["The object has no relationships: ", this].join(' ');
        }
        if (!this._payload.relationships.hasOwnProperty(propertyName)) {
            throw ["The object has no relationship named '", propertyName, "': ", this].join(' ');
        }
        if (!this._payload.relationships[propertyName].hasOwnProperty('data')) {
            throw ["The object has an unitialized relationship named '", propertyName, "': ", this].join(' ');
        }
        return this._payload.relationships[propertyName]['data'];
    };
    ResourceProxy.prototype.offsetSetForAttribute = function (propertyName, value) {
        this._payload['attributes'][propertyName] = value;
    };
    ResourceProxy.prototype.offsetSetForSingleRelationship = function (propertyName, value) {
        var identity = value ? value.$identity : null;
        if (!this._payload['relationships'][propertyName]) {
            this._payload['relationships'][propertyName] = { data: identity };
        }
        else {
            this._payload['relationships'][propertyName]['data'] = identity;
        }
    };
    ResourceProxy.prototype.offsetSetForCollectionelationship = function (propertyName, value) {
        if (!this._payload['relationships'][propertyName]) {
            this._payload['relationships'][propertyName] = { data: [] };
        }
        else {
            this._payload['relationships'][propertyName]['data'] = [];
        }
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var object = value_1[_i];
            this._payload['relationships'][propertyName]['data'].push(object.$identity);
        }
    };
    ResourceProxy.prototype.registerTypeName = function () {
        this._type = this.constructor['_type'];
        if (!this._type) {
            throw 'This object is not registered as jsonapi resource: ' + this.constructor;
        }
    };
    ResourceProxy.prototype.registerEventEmitters = function () {
        for (var propertyName in this._type.getProperties()) {
            var property = this._type.getPropertyDefinition(propertyName);
            switch (property.type) {
                case _1.Property.SINGLE_RELATIONSHIP_TYPE:
                case _1.Property.COLLECTION_RELATIONSHIP_TYPE:
                    this._relationshipLoadedSubject[property.name] = new Rx_1.ReplaySubject(1);
                    try {
                        this.offsetGet(propertyName);
                        this.emitRelationshipLoaded(propertyName);
                    }
                    catch (e) {
                    }
                    break;
            }
        }
    };
    ResourceProxy.prototype.emitRelationshipLoaded = function (propertyName) {
        this.getRelationshipLoadedSubject(this._type.getPropertyDefinition(propertyName).name).next(this.offsetGet(propertyName));
    };
    ResourceProxy.prototype.getRelationshipLoadedSubject = function (propertyName) {
        return this._relationshipLoadedSubject[propertyName];
    };
    return ResourceProxy;
}());
ResourceProxy._typeName = 'netlogix/resource';
ResourceProxy._properties = {};
exports.ResourceProxy = ResourceProxy;
//# sourceMappingURL=resource-proxy.js.map