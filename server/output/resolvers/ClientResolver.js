"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientResolver = void 0;
var tslib_1 = require("tslib");
var type_graphql_1 = require("type-graphql");
var Client_1 = require("../entities/Client");
var ClientResolver = /** @class */ (function () {
    function ClientResolver() {
    }
    ClientResolver.prototype.connect = function (name) {
        var client = new Client_1.Client();
        // client.id = name;
        client.name = name;
        return client.save();
    };
    tslib_1.__decorate([
        type_graphql_1.Mutation(function () { return Client_1.Client; }),
        tslib_1.__param(0, type_graphql_1.Arg("name")),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", void 0)
    ], ClientResolver.prototype, "connect", null);
    ClientResolver = tslib_1.__decorate([
        type_graphql_1.Resolver()
    ], ClientResolver);
    return ClientResolver;
}());
exports.ClientResolver = ClientResolver;
//# sourceMappingURL=ClientResolver.js.map