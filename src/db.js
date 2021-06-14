const users = [
    {
        id: '1',
        name: 'Aditya Dash',
        email: 'adityadash300@gmail.com',
        age: 22
    },
    {
        id: '2',
        name: 'Mike',
        email: 'andrewmead@gmail.com',
    },
    {
        id: '3',
        name: 'Sarah',
        email: 'sarahgirl@hotmail.com',
        age: 25
    }
]

const posts = [
    {
        id: '10',
        title: 'Coffee Shop',
        body: 'yesterday i met a girl in the coffee shop',
        published: true,
        author: '1'
    },
    {
        id: '11',
        title: 'Cat Owner',
        body: '',
        published: false,
        author: '1'
    },
    {
        id: '12',
        title: 'Sassy youth',
        body: 'Youth inspired by modern pop culture',
        published: false,
        author: '2'
    }
]

const comments = [
    {
        id: '21',
        text: 'Good one mate',
        author: '1',
        post: '10'
    },
    {
        id: '22',
        text: 'Keep it up',
        author: '2',
        post: '10'
    },
    {
        id: '23',
        text: 'Nice work',
        author: '1',
        post: '12'
    },
    {
        id: '24',
        text: 'needs work',
        author: '3',
        post: '11'
    }
]

const db = {
    users,
    posts,
    comments
}

export default db