"use strict";
var rxjs_1 = require('rxjs');
var _1 = require("../../");
var Paginator = (function () {
    function Paginator(firstPage, consumerBackend) {
        var _this = this;
        this.firstPage = firstPage;
        this.consumerBackend = consumerBackend;
        this._loading = 0;
        this._error = false;
        this.loadingChange = new rxjs_1.Subject();
        this.subject = new rxjs_1.ReplaySubject(1);
        this.resultPage$.subscribe(function (resultPage) {
            _this.resultPage = resultPage;
        });
        this.next();
    }
    Object.defineProperty(Paginator.prototype, "resultPage$", {
        get: function () {
            return this.subject.asObservable().share();
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
    Object.defineProperty(Paginator.prototype, "loading", {
        get: function () {
            return !!this._loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "error", {
        get: function () {
            return !!this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "loading$", {
        get: function () {
            return this.loadingChange.asObservable();
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
        if (this.loading || this.error) {
            return;
        }
        this.changeLoading(1);
        var nextLink = this.firstPage;
        if (this.hasLink('next')) {
            nextLink = this.resultPage.links['next'];
        }
        this.consumerBackend.fetchFromUri(new _1.Uri(nextLink)).subscribe(function (resultPage) {
            _this.subject.next(resultPage);
            _this.changeLoading(-1);
        }, function () {
            _this._error = true;
            _this.subject.next([]);
            _this.changeLoading(-1);
        });
    };
    Paginator.prototype.changeLoading = function (direction) {
        var loading = this.loading;
        this._loading += direction;
        if (loading !== this.loading) {
            this.loadingChange.next(this.loading);
        }
    };
    Paginator.prototype.hasLink = function (linkName) {
        return !!this.resultPage && !!this.resultPage.links && !!this.resultPage.links[linkName];
    };
    return Paginator;
}());
exports.Paginator = Paginator;
//# sourceMappingURL=paginator.js.map