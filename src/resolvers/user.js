import getUserId from "../../utils/get-userId.js"

const User = {
    posts: {
        fragement: `fragement userId on User { id }`,
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    },
    email: {
        fragment: `fragment userId on User { id }`,
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)
            
            if(userId && userId === parent.id) {
                return parent.email
            }
    
            return null
        }
    } 
}

export default User