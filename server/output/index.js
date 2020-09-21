"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("reflect-metadata");
var express = require("express");
var apollo_server_express_1 = require("apollo-server-express");
var typeorm_1 = require("typeorm");
var like_1 = require("./entities/like");
var Client_1 = require("./entities/Client");
var type_graphql_1 = require("type-graphql");
var LikeResolver_1 = require("./resolvers/LikeResolver");
var ClientResolver_1 = require("./resolvers/ClientResolver");
process.env.PLAYGROUND_URL = "/";
(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var server, _a, app;
    var _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, typeorm_1.createConnection({
                    type: "sqlite",
                    database: "database.sqlite",
                    synchronize: true,
                    logging: true,
                    // dropSchema: true,
                    entities: [like_1.Like, Client_1.Client],
                    migrations: ["migrations/**/*.ts"],
                    subscribers: ["subscribers/**/*.ts"]
                })];
            case 1:
                _c.sent();
                _a = apollo_server_express_1.ApolloServer.bind;
                _b = {};
                return [4 /*yield*/, type_graphql_1.buildSchema({
                        resolvers: [LikeResolver_1.LikeResolver, ClientResolver_1.ClientResolver],
                        emitSchemaFile: true
                    })];
            case 2:
                server = new (_a.apply(apollo_server_express_1.ApolloServer, [void 0, (_b.schema = _c.sent(),
                        _b.playground = true,
                        _b.introspection = true,
                        _b)]))();
                app = express();
                server.applyMiddleware({
                    app: app,
                    path: "/",
                    cors: {
                        origin: "*",
                        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                        preflightContinue: false,
                        optionsSuccessStatus: 204,
                        credentials: true,
                        allowedHeaders: ["Content-Type", "Origin", "Accept"]
                    }
                });
                app.listen({ port: 4000 }, function () { return console.log("\uD83D\uDE80 Server ready at http://localhost:4000" + server.graphqlPath); });
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map