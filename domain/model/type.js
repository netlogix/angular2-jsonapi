"use strict";
var core_1 = require("@angular/core");
var _1 = require("../../");
var Type = (function () {
    function Type(typeName, resourceProxy, properties, uri) {
        if (properties === void 0) { properties = {}; }
        if (uri === void 0) { uri = null; }
        this._typeName = typeName;
        this._resourceProxy = resourceProxy;
        this._properties = properties;
        this._properties = JSON.parse(JSON.stringify(properties));
        resourceProxy._type = this;
        if (uri) {
            this.setUri(uri);
        }
    }
    Type.prototype.setUri = function (uri) {
        this._uri = uri;
    };
    Type.prototype.getUri = function () {
        return this._uri ? this._uri.clone() : null;
    };
    Type.prototype.getTypeName = function () {
        return this._typeName;
    };
    Type.prototype.getResourceProxy = function () {
        return this._resourceProxy;
    };
    Type.prototype.createNewObject = function (consumerBackend, initializeEmptyRelationships) {
        if (initializeEmptyRelationships === void 0) { initializeEmptyRelationships = false; }
        var payload = this.getPayloadTemplate();
        var resource = (new this._resourceProxy());
        var relationships = payload.relationships;
        if (!initializeEmptyRelationships) {
            for (var propertyName in relationships) {
                delete relationships[propertyName].data;
            }
        }
        resource.payload = payload;
        return resource;
    };
    Type.prototype.getPropertyDefinition = function (propertyName) {
        if (this._properties[propertyName]) {
            return this._properties[propertyName];
        }
        else {
            return _1.Property.undefined(propertyName);
        }
    };
    Type.prototype.getProperties = function () {
        return this._properties;
    };
    Type.prototype.registerAccessesors = function (object) {
        for (var propertyName in this._properties) {
            this.registerAccessesorsForProperty(object, propertyName);
        }
    };
    Type.prototype.getPayloadTemplate = function () {
        var payload = {
            type: this.getTypeName(),
            attributes: {},
            relationships: {},
            links: {},
            meta: {}
        };
        var propertyChanged = new core_1.EventEmitter();
        Object.defineProperty(payload, 'propertyChanged', {
            value: propertyChanged,
            enumerable: false,
            writable: false
        });
        for (var propertyName in this.getProperties()) {
            var property = this.getPropertyDefinition(propertyName);
            switch (property.type) {
                case _1.Property.ATTRIBUTE_TYPE:
                    payload.attributes[property.name] = null;
                    break;
                case _1.Property.SINGLE_RELATIONSHIP_TYPE:
                    payload.relationships[property.name] = {
                        data: null
                    };
                    break;
                case _1.Property.COLLECTION_RELATIONSHIP_TYPE:
                    payload.relationships[property.name] = {
                        data: []
                    };
                    break;
            }
        }
        return payload;
    };
    Type.prototype.registerAccessesorsForProperty = function (object, propertyName) {
        var property = this._properties[propertyName];
        Object.defineProperty(object, propertyName, {
            get: function () {
                return object.offsetGet(propertyName);
            },
            set: function (value) {
                return object.offsetSet(propertyName, value);
            }
        });
        if (property.type === _1.Property.SINGLE_RELATIONSHIP_TYPE || property.type === _1.Property.COLLECTION_RELATIONSHIP_TYPE) {
            Object.defineProperty(object, propertyName + 'Loaded', {
                get: function () {
                    return object.offsetGetLoaded(propertyName);
                }
            });
            Object.defineProperty(object, propertyName + 'Async', {
                get: function () {
                    return object.offsetGetAsync(propertyName);
                }
            });
        }
    };
    return Type;
}());
exports.Type = Type;
//# sourceMappingURL=type.js.map