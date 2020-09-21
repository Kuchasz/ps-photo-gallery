"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var tslib_1 = require("tslib");
var type_graphql_1 = require("type-graphql");
var typeorm_1 = require("typeorm");
var Client = /** @class */ (function (_super) {
    tslib_1.__extends(Client, _super);
    function Client() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        type_graphql_1.Field(function (type) { return type_graphql_1.Int; }),
        typeorm_1.PrimaryGeneratedColumn(),
        tslib_1.__metadata("design:type", Number)
    ], Client.prototype, "id", void 0);
    tslib_1.__decorate([
        type_graphql_1.Field(),
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Client.prototype, "name", void 0);
    Client = tslib_1.__decorate([
        type_graphql_1.ObjectType(),
        typeorm_1.Entity()
    ], Client);
    return Client;
}(typeorm_1.BaseEntity));
exports.Client = Client;
//# sourceMappingURL=Client.js.map