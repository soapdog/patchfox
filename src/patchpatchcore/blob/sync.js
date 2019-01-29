const nest = require("depnest");

exports.gives = nest("blob.sync.url");

exports.create = function () {
    return nest("blob.sync.url", function (id) {
        return `http://localhost:8989/blobs/get/${id}`;
    });
};
