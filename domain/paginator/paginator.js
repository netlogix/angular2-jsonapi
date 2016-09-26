"use strict";
var jsonapi_1 = require("@netlogix/jsonapi");
var rxjs_1 = require('rxjs');
var Paginator = (function () {
    function Paginator(firstPage, consumerBackend) {
        var _this = this;
        this.firstPage = firstPage;
        this.consumerBackend = consumerBackend;
        this.subject = new rxjs_1.ReplaySubject(1);
        this.resultPage$.subscribe(function (resultPage) {
            _this.resultPage = resultPage;
        });
        this.next();
    }
    Object.defineProperty(Paginator.prototype, "resultPage$", {
        get: function () {
            return this.subject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "data", {
        get: function () {
            if (this.hasLink('next')) {
                return this.resultPage.data;
            }
            else {
                return [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "hasNext", {
        get: function () {
            return this.hasLink('next');
        },
        enumerable: true,
        configurable: true
    });
    Paginator.prototype.next = function () {
        var _this = this;
        var nextLink = this.firstPage;
        if (this.hasLink('next')) {
            nextLink = this.resultPage.links['next'];
        }
        this.consumerBackend.fetchFromUri(new jsonapi_1.Uri(nextLink)).subscribe(function (resultPage) {
            _this.subject.next(resultPage);
        });
    };
    Paginator.prototype.hasLink = function (linkName) {
        return !!this.resultPage && !!this.resultPage.links && !!this.resultPage.links[linkName];
    };
    return Paginator;
}());
exports.Paginator = Paginator;
//# sourceMappingURL=paginator.js.map