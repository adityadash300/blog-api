import bcrypt from "bcryptjs"
import getUserId from "../../utils/get-userId.js"
import generateToken from "../../utils/generate-token.js"
import hashPassword from "../../utils/hash-password.js"

const Mutation = {
    async signup(parent, { data }, { prisma }, info) {
        const password = await hashPassword(data.password)

        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, { data }, { prisma }, info) {
        const user = await prisma.query.user({
            where: { email: data.email }
        })

        if(!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(data.password, user.password)

        if(!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request)

        if(typeof data.password === 'string') {
            data.password = await hashPassword(data.password)
        }

        return prisma.mutation.updateUser({
            where: { id: userId },
            data
        }, info) 
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({ 
            where: { id: userId } 
        }, info)
    },
    createPost(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.createPost({ 
            data: {
                ...data,
                author: {
                    connect: {
                        id: userId 
                    }
                }
            }
        }, info)
    },
    async updatePost(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        })

        const isPublished = await prisma.exists.Post({
            id,
            published: true
        })

        if(isPublished && !data.published) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: { id }
                }
            })
        }

        if(!postExists) {
            throw new Error('Unable to update post')
        }

        return prisma.mutation.updatePost({ 
            where: { id },
            data
        }, info)
    },
    async deletePost(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        })

        if(!postExists) {
            throw new Error('Unable to delete post')
        }

        return prisma.mutation.deletePost({ 
            where: { id }
        }, info)
    },
    async createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request)
        const postPublished = await prisma.exists.Post({
            published: true,
            author: {
                id: userId
            }
        })

        if(!postPublished) {
            throw new Error('Unable to find post')
        }

        return prisma.mutation.createComment({ 
            data: {
                ...data,
                author: {
                    connect: { id: userId }
                },
                post: {
                    connect: { id: data.post }
                }
            }
        }, info)
    },
    async updateComment(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }
        })

        if(!commentExists) {
            throw new Error('Unable to delete comment')
        }


        return prisma.mutation.updateComment({
            where: { id },
            data
        }, info)
    },
    async deleteComment(parent, { id }, {  prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }
        })

        const postId = await prisma.query.comment({
            where: {
                id
            }
        }, `{ post { id } }`)

        const postExists = await prisma.exists.Post({
            id: postId,
            author: {
                id: userId
            }
        })

        if(!commentExists && !postExists) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({
            where: { id }
        }, info)
    }
}

export default Mutation