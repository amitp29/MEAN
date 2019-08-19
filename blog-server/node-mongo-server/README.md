# Checkout the code

## Install node_modules
~ npm i

## START MONGODB SERVER
~ mongod.exe --dbpath=<PATH To \db>
~ mongod.exe --dbpath=D:\Amit\Learning\mongodb-data\db  //Filhaal
~ db.createUser( { user: "amit", pwd: passwordPrompt(), roles: [ { role: "clusterAdmin", db: "admin" },{ role: "readAnyDatabase", db: "admin" }, "readWrite"] } )

## START SERVER
~ npm run dev // or node app.js

# Sample Request Body to adddBlog
URL - http://localhost:3000/addBlog
{
	"title":  "a Blog",
	"author": "John Doe",
	"email": "john.doe@abcmail.com",
	"body":  "This is a Blog by John Doe!!",
	"hidden": false,
	"meta": {
	    "votes": 20,
	    "likes":  2,
	    "dislikes": 9
	}
}