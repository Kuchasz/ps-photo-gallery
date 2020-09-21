"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
var tslib_1 = require("tslib");
var type_graphql_1 = require("type-graphql");
var typeorm_1 = require("typeorm");
var Client_1 = require("./Client");
var Like = /** @class */ (function (_super) {
    tslib_1.__extends(Like, _super);
    function Like() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        type_graphql_1.Field(),
        typeorm_1.PrimaryColumn(),
        tslib_1.__metadata("design:type", String)
    ], Like.prototype, "imageId", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ nullable: false }),
        tslib_1.__metadata("design:type", Number)
    ], Like.prototype, "clientId", void 0);
    tslib_1.__decorate([
        typeorm_1.ManyToOne(function (type) { return Client_1.Client; }),
        tslib_1.__metadata("design:type", Client_1.Client)
    ], Like.prototype, "client", void 0);
    tslib_1.__decorate([
        type_graphql_1.Field(),
        typeorm_1.PrimaryColumn(),
        tslib_1.__metadata("design:type", String)
    ], Like.prototype, "galleryId", void 0);
    Like = tslib_1.__decorate([
        type_graphql_1.ObjectType(),
        typeorm_1.Entity()
    ], Like);
    return Like;
}(typeorm_1.BaseEntity));
exports.Like = Like;
//# sourceMappingURL=like.js.map