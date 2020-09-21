"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeResolver = void 0;
var tslib_1 = require("tslib");
var type_graphql_1 = require("type-graphql");
var like_1 = require("../entities/like");
var LikeResolver = /** @class */ (function () {
    function LikeResolver() {
    }
    LikeResolver.prototype.likeImage = function (imageId, clientId, galleryId) {
        var like = new like_1.Like();
        like.imageId = imageId;
        like.clientId = clientId;
        like.galleryId = galleryId;
        return like.save();
    };
    LikeResolver.prototype.likes = function (galleryId) {
        return like_1.Like.find({ galleryId: galleryId });
    };
    tslib_1.__decorate([
        type_graphql_1.Mutation(function () { return like_1.Like; }),
        tslib_1.__param(0, type_graphql_1.Arg("imageId")), tslib_1.__param(1, type_graphql_1.Arg("clientId", function () { return type_graphql_1.Int; })), tslib_1.__param(2, type_graphql_1.Arg("galleryId")),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number, String]),
        tslib_1.__metadata("design:returntype", void 0)
    ], LikeResolver.prototype, "likeImage", null);
    tslib_1.__decorate([
        type_graphql_1.Query(function () { return [like_1.Like]; }),
        tslib_1.__param(0, type_graphql_1.Arg("galleryId")),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", void 0)
    ], LikeResolver.prototype, "likes", null);
    LikeResolver = tslib_1.__decorate([
        type_graphql_1.Resolver()
    ], LikeResolver);
    return LikeResolver;
}());
exports.LikeResolver = LikeResolver;
//# sourceMappingURL=LikeResolver.js.map