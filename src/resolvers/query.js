import getUserId from "../../utils/get-userId.js"

const Query = {
    users(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
        const opArgs ={
            first,
            skip,
            after,
            orderBy
        }

        if( query) {
            opArgs.where = {
                OR: [
                    {
                        name_contains: query
                    }
                ]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    posts(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
        const opArgs = {
            first,
            skip,
            after,
            orderBy,
            where: {
                published: true
            }
        }

        if(query) {
            opArgs.where.OR = [
                {
                    title_contains: query
                },
                {
                    body_contains: query
                }
            ]
        }

        return prisma.query.posts(opArgs, info)
    },
    comments(parent, { first, skip, after, orderBy }, { prisma }, info) {
        const opArgs = {
            first,
            skip,
            after,
            orderBy
        }

        return prisma.query.comments(opArgs, info)
    },
    myPosts(parent, { query, first, skip, after, orderBy }, { prisma, request }, info) {
        const userId = getUserId(request)

        const opArgs = {
            first,
            skip,
            after,
            orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if(query) {
            opArgs.where.OR = [
                {
                    title_contains: query
                },
                {
                    body_contains: query
                }
            ]
        }

        return prisma.query.posts(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {id: userId}
        }, info)
    },
    async post(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts({
            where: {
                id,
                OR:[
                    {
                        published: true
                    },
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        }, info)

        if(posts.length === 0) {
            throw new Error('Post not Found')
        }

        return posts[0]
    }
}

export default Query