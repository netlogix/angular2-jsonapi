"use strict";
var http_1 = require('@angular/http');
var Rx_1 = require("rxjs/Rx");
var _1 = require("../");
var ConsumerBackend = (function () {
    function ConsumerBackend(http, requestOptions) {
        this.http = http;
        this.requestOptions = requestOptions;
        this.contentType = 'application/vnd.api+json';
        this.headers = {};
        this.types = {};
        this.typeObservables = {};
        this.unitOfWork = {};
    }
    ConsumerBackend.prototype.addType = function (type) {
        type.consumerBackend = this;
        this.types[type.getTypeName()] = type;
    };
    ConsumerBackend.prototype.registerEndpointsByEndpointDiscovery = function (endpointDiscovery) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.requestJson(endpointDiscovery).subscribe(function (result) {
                for (var _i = 0, _a = result['links']; _i < _a.length; _i++) {
                    var link = _a[_i];
                    if (!(link instanceof Object) || !link.meta) {
                        continue;
                    }
                    if (!link.meta.type || link.meta.type !== 'resourceUri') {
                        continue;
                    }
                    if (!link.meta.resourceType) {
                        continue;
                    }
                    if (!link.href) {
                        continue;
                    }
                    _this.registerEndpoint(link.meta.resourceType, link.href);
                }
                resolve();
            });
        });
    };
    ConsumerBackend.prototype.registerEndpoint = function (typeName, href) {
        var type = this.types[typeName];
        if (!type || type.getUri()) {
            return;
        }
        var typeObservable = this.getType(typeName);
        type.setUri(new _1.Uri(href));
        typeObservable.next(type);
        typeObservable.complete();
    };
    ConsumerBackend.prototype.closeEndpointDiscovery = function () {
        for (var typeName in this.types) {
            var type = this.types[typeName];
            if (!type.getUri()) {
                var typeObservable = this.getType(typeName);
                type.setUri(new _1.Uri('#'));
                typeObservable.next(type);
                typeObservable.complete();
            }
        }
    };
    ConsumerBackend.prototype.fetchFromUri = function (queryUri) {
        var _this = this;
        return this.requestJson(queryUri).map(function (jsonResult) {
            _this.addJsonResultToCache(jsonResult);
            var result = [];
            if (!jsonResult.data) {
            }
            else if (!!jsonResult.data.type && !!jsonResult.data.id) {
                result = [_this.getFromUnitOfWork(jsonResult.data.type, jsonResult.data.id)];
            }
            else {
                for (var _i = 0, _a = jsonResult['data']; _i < _a.length; _i++) {
                    var resourceDefinition = _a[_i];
                    var resource = _this.getFromUnitOfWork(resourceDefinition.type, resourceDefinition.id);
                    if (resource) {
                        result.push(resource);
                    }
                }
            }
            return new _1.ResultPage(result, jsonResult.links);
        });
    };
    ConsumerBackend.prototype.fetchContentFromUri = function (queryUri) {
        return this.fetchFromUri(queryUri).map(function (resultPage) {
            return resultPage.data;
        });
    };
    ConsumerBackend.prototype.findResultPageByTypeAndFilter = function (typeName, filter, include) {
        var _this = this;
        return this.getType(typeName).map(function (type) {
            var queryUri = type.getUri();
            var queryArguments = queryUri.getArguments();
            queryArguments['filter'] = queryArguments['filter'] || {};
            for (var key in (filter || {})) {
                queryArguments['filter'][key] = filter[key];
            }
            if (queryArguments['filter'] == {}) {
                delete queryArguments['filter'];
            }
            queryArguments['include'] = (include || []).join(',');
            if (!queryArguments['include']) {
                delete queryArguments['include'];
            }
            queryUri.setArguments(queryArguments);
            return _this.fetchFromUri(queryUri);
        }).flatMap(function (value) { return value; });
    };
    ConsumerBackend.prototype.findByTypeAndFilter = function (typeName, filter, include) {
        return this.findResultPageByTypeAndFilter(typeName, filter, include).map(function (resultPage) {
            return resultPage.data;
        });
    };
    ConsumerBackend.prototype.getFromUnitOfWork = function (type, id) {
        var cacheIdentifier = this.calculateCacheIdentifier(type, id);
        return this.unitOfWork[cacheIdentifier];
    };
    ConsumerBackend.prototype.add = function (resource) {
        var targetUri = resource.$type.getUri().toString();
        return this.addToUri(resource, targetUri);
    };
    ConsumerBackend.prototype.addToUri = function (resource, targetUri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var postBody = JSON.stringify({ data: resource.payload });
            _this.http.post(targetUri, postBody, _this.getRequestOptions('post')).subscribe(function (response) {
                resolve(response);
            }, function (response) {
                reject(response);
            });
        });
    };
    ConsumerBackend.prototype.create = function (type, id, defaultValue, initializeEmptyRelationships) {
        if (defaultValue === void 0) { defaultValue = {}; }
        if (initializeEmptyRelationships === void 0) { initializeEmptyRelationships = true; }
        this.addJsonResultToCache({ data: { type: type, id: id } }, initializeEmptyRelationships);
        var result = this.getFromUnitOfWork(type, id);
        for (var propertyName in defaultValue) {
            result.offsetSet(propertyName, defaultValue[propertyName]);
        }
        return result;
    };
    ConsumerBackend.prototype.getResourceType = function (typeName) {
        return this.getType(typeName).asObservable();
    };
    ConsumerBackend.prototype.getType = function (typeName) {
        if (!this.typeObservables[typeName]) {
            this.typeObservables[typeName] = new Rx_1.ReplaySubject(1);
        }
        return this.typeObservables[typeName];
    };
    ConsumerBackend.prototype.requestJson = function (uri) {
        var uriString = uri.toString();
        var requestOptions = this.getRequestOptions('get', uriString);
        return this.http.get(uriString, requestOptions).map(function (result) {
            var body = result.text();
            return JSON.parse(body);
        });
    };
    ConsumerBackend.prototype.addJsonResultToCache = function (result, initializeEmptyRelationships) {
        var _this = this;
        if (initializeEmptyRelationships === void 0) { initializeEmptyRelationships = false; }
        var postProcessing = [];
        for (var _i = 0, _a = ['data', 'included']; _i < _a.length; _i++) {
            var slotName = _a[_i];
            if (!result[slotName]) {
                continue;
            }
            var slotContent = [];
            if (result[slotName].hasOwnProperty('id') && result[slotName].hasOwnProperty('type')) {
                slotContent = [result[slotName]];
            }
            else {
                slotContent = result[slotName];
            }
            var _loop_1 = function(resourceDefinition) {
                var typeName = resourceDefinition.type;
                var id = resourceDefinition.id;
                this_1.getType(typeName).subscribe(function (type) {
                    var resource = _this.getFromUnitOfWork(typeName, id);
                    if (!resource) {
                        resource = type.createNewObject(_this, initializeEmptyRelationships);
                        var cacheIdentifier = _this.calculateCacheIdentifier(typeName, id);
                        _this.unitOfWork[cacheIdentifier] = resource;
                        resource.payload.id = id;
                    }
                    postProcessing = postProcessing.concat(_this.assignResourceDefinitionToPayload(resource.payload, resourceDefinition, type));
                });
            };
            var this_1 = this;
            for (var _b = 0, slotContent_1 = slotContent; _b < slotContent_1.length; _b++) {
                var resourceDefinition = slotContent_1[_b];
                _loop_1(resourceDefinition);
            }
        }
        postProcessing.forEach(function (callable) {
            callable();
        });
    };
    ConsumerBackend.prototype.assignResourceDefinitionToPayload = function (payload, resourceDefinition, type) {
        var postProcessing = [];
        if (resourceDefinition.hasOwnProperty('links')) {
            payload.links = Object.assign(payload.links, resourceDefinition.links);
        }
        if (resourceDefinition.hasOwnProperty('meta')) {
            payload.meta = Object.assign(payload.meta, resourceDefinition.meta);
        }
        var _loop_2 = function(propertyName) {
            var property = type.getPropertyDefinition(propertyName);
            if (property.type === _1.Property.ATTRIBUTE_TYPE) {
                if (!resourceDefinition.hasOwnProperty('attributes')) {
                    return "continue";
                }
                if (!resourceDefinition.attributes.hasOwnProperty(property.name)) {
                    return "continue";
                }
                payload.attributes[property.name] = resourceDefinition.attributes[property.name];
            }
            else {
                if (!resourceDefinition.hasOwnProperty('relationships')) {
                    return "continue";
                }
                if (!resourceDefinition.relationships.hasOwnProperty(property.name)) {
                    return "continue";
                }
                if (!payload.relationships.hasOwnProperty(property.name)) {
                    payload.relationships[property.name] = {};
                }
                if (resourceDefinition.relationships[property.name].hasOwnProperty('links')) {
                    if (!payload.relationships[property.name].hasOwnProperty('links')) {
                        payload.relationships[property.name]['links'] = {};
                        for (var linkName in resourceDefinition.relationships[property.name].links) {
                            payload.relationships[property.name].links[linkName] = resourceDefinition.relationships[property.name].links[linkName];
                        }
                    }
                }
                if (resourceDefinition.relationships[property.name].hasOwnProperty('data')) {
                    payload.relationships[property.name]['data'] = resourceDefinition.relationships[property.name]['data'];
                    postProcessing.push(function () {
                        payload.propertyChanged.emit(property.name);
                    });
                }
            }
        };
        for (var propertyName in type.getProperties()) {
            _loop_2(propertyName);
        }
        return postProcessing;
    };
    ConsumerBackend.prototype.calculateCacheIdentifier = function (type, id) {
        return type + "\n" + id;
    };
    ConsumerBackend.prototype.getRequestOptions = function (method, requestUri) {
        var requestOptions = this.requestOptions.merge({
            headers: new http_1.Headers(this.requestOptions.headers.toJSON())
        });
        switch (method.toLocaleLowerCase()) {
            case 'post':
                requestOptions.headers.set('Content-Type', this.contentType);
            case 'get':
                requestOptions.headers.set('Accept', this.contentType);
                break;
        }
        if (requestUri) {
            for (var uriPattern in this.headers) {
                var headersForUriPattern = this.headers[uriPattern];
                for (var key in headersForUriPattern) {
                    var value = headersForUriPattern[key];
                    requestOptions.headers.set(key, value);
                }
            }
        }
        return requestOptions;
    };
    return ConsumerBackend;
}());
exports.ConsumerBackend = ConsumerBackend;
//# sourceMappingURL=consumer-backend.js.map