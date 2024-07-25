require('dotenv').config()
const express  = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3002

const githubData = 
    {
        "login": "Pujadebnath",
        "id": 145159173,
        "node_id": "U_kgDOCKb0BQ",
        "avatar_url": "https://avatars.githubusercontent.com/u/145159173?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Pujadebnath",
        "html_url": "https://github.com/Pujadebnath",
        "followers_url": "https://api.github.com/users/Pujadebnath/followers",
        "following_url": "https://api.github.com/users/Pujadebnath/following{/other_user}",
        "gists_url": "https://api.github.com/users/Pujadebnath/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Pujadebnath/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Pujadebnath/subscriptions",
        "organizations_url": "https://api.github.com/users/Pujadebnath/orgs",
        "repos_url": "https://api.github.com/users/Pujadebnath/repos",
        "events_url": "https://api.github.com/users/Pujadebnath/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Pujadebnath/received_events",
        "type": "User",
        "site_admin": false,
        "name": null,
        "company": null,
        "blog": "",
        "location": null,
        "email": null,
        "hireable": null,
        "bio": null,
        "twitter_username": null,
        "public_repos": 0,
        "public_gists": 0,
        "followers": 0,
        "following": 0,
        "created_at": "2023-09-15T19:27:02Z",
        "updated_at": "2023-09-15T19:27:02Z"
      }

app.use(cors())
app.get("/",(req,res) =>{
    res.send("what the hell brooo")
})

app.get("/login",(req,res)=>{
    res.send("<h1>loggin in broo</h1>")
    
})
app.get("/github",(req,res) =>{
    res.json(githubData)
})
app.get("/api/jokes",(req,res) =>{
    const jokes = [
        {
            id:"1",
            title:"First joke",
            content:"first one content"
        },
        {
            id:"2",
            title:"second joke",
            content:"second one content"
        },
        {
            id:"3",
            title:"third joke",
            content:"third one content"
        },
    ]
    res.send(jokes)
})
app.listen(process.env.PORT,() =>{
    console.log(`app is listenning on ${port}`)
})