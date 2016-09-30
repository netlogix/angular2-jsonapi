"use strict";
var _1 = require("../../");
var LoadMorePaginator = (function () {
    function LoadMorePaginator(firstPage, consumerBackend) {
        var _this = this;
        this.firstPage = firstPage;
        this.consumerBackend = consumerBackend;
        this._data = [];
        this.paginator = new _1.Paginator(firstPage, consumerBackend);
        this.paginator.resultPage$.subscribe(function (resultPage) {
            _this._data = _this._data.concat(resultPage.data);
        });
    }
    LoadMorePaginator.prototype.more = function () {
        if (this.hasMore) {
            this.paginator.next();
        }
        return this._data;
    };
    Object.defineProperty(LoadMorePaginator.prototype, "hasMore", {
        get: function () {
            return this.paginator.hasNext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadMorePaginator.prototype, "data", {
        get: function () {
            return this._data.slice();
        },
        enumerable: true,
        configurable: true
    });
    return LoadMorePaginator;
}());
exports.LoadMorePaginator = LoadMorePaginator;
//# sourceMappingURL=load-more-paginator.js.map