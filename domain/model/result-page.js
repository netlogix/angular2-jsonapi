"use strict";
var ResultPage = (function () {
    function ResultPage(data, links) {
        if (data === void 0) { data = []; }
        if (links === void 0) { links = {}; }
        this.data = data;
        this.links = links;
        if (!links) {
            this.links = {};
        }
    }
    return ResultPage;
}());
exports.ResultPage = ResultPage;
//# sourceMappingURL=result-page.js.map