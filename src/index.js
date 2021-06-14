import { GraphQLServer, PubSub } from "graphql-yoga"
import db from "./db.js"
import prisma from "./prisma.js"
import { resolvers, fragmentReplacements } from "./resolvers/index.js"

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start({ port: process.env.PORT }, () => {
    console.log(`The server is up at ${process.env.PORT}`)
})
