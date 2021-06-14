import Query from "./query.js"
import Mutation from "./mutation.js"
import Subscription from "./subscription.js"
import User from "./user.js"
import Post from "./post.js"
import Comment from "./comments.js"
import { extractFragmentReplacements } from "prisma-binding"

export const resolvers = {
    Query,
    Mutation, 
    Subscription,
    User,
    Post,
    Comment
}

export const fragmentReplacements = extractFragmentReplacements(resolvers)