import "reflect-metadata";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { Like } from "./entities/like";
import { Client } from "./entities/Client";
import { buildSchema } from "type-graphql";
import { LikeResolver } from "./resolvers/LikeResolver";
import { ClientResolver } from "./resolvers/ClientResolver";

(async () => {
    await createConnection({
        type: "sqlite",
        database: "database.sqlite",
        synchronize: true,
        logging: true,
        // dropSchema: true,
        entities: [Like, Client],
        migrations: ["migrations/**/*.ts"],
        subscribers: ["subscribers/**/*.ts"]
    });

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [LikeResolver, ClientResolver],
            emitSchemaFile: true
        })
    });

    const app = express();
    server.applyMiddleware({
        app,
        cors: {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
            allowedHeaders: ["Content-Type", "Origin", "Accept"]
        }
    });

    app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
})();
