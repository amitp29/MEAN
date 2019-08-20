const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors')
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connection_string = require('./db/dbconfig');
const blogSchema = require('./db/schema');

// Connect to Mongo DB || START
const mongoose = require('mongoose');
// useNewUrlParser - The underlying MongoDB driver has deprecated their current connection string parser. 
        // Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser.
        // You should set useNewUrlParser: true unless that prevents you from connecting. 
        // Note that if you specify useNewUrlParser: true, you must specify a port in your connection string, like mongodb://localhost:27017/dbname. 
        // The new url parser does not support connection strings that do not have a port, like mongodb://localhost/dbname.
mongoose.connect(connection_string, { useNewUrlParser: true, config: {autoIndex: false }});
// Get the default connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on('connected', () =>  console.log("Mongoose default connection is open to ", connection_string));
// db.on('error', console.error.bind(console, 'MongoDB connection error:')); //doosra tareeka
db.on('error', (err)=> console.log("Mongoose default connection has occured "+err+" error"));
db.on('disconnected', ()=> console.log("Mongoose default connection is disconnected"));

process.on('SIGINT', function(){
    db.close(function(){
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0)
    });
});

// Connect to Mongo DB || END

// To use our schema definition, we need to convert our blogSchema into a Model we can work with. To do so,
const blogModel = mongoose.model('Blog', blogSchema); // blogModel is a sub-model of mongoose.model aur db mei "blogs" naam se collection banega kaise?
        // 'Blog' ko small caps kiya aur plural kar diya... automatic!

// Instances of Models are documents. Documents have many of their own built-in instance methods. 
// Once you've created a schema you can use it to create models. 
// The model represents a collection of documents in the database that you can search, 
    // while the model's instances represent individual documents that you can save and retrieve.

app.use(logger('dev'));
// app.use(json());
// app.use(urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));



// CORS ka substitute
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     // res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });

/*
// You can use a Model to create new documents using `new`:
let blog1 = {
    title:  "blogTitle",
    author: "blogAuthor",
    email: "blogger@anymail.com",
    body:   "Hi This is a blog",
    hidden: false,
    meta: {
        votes: 20,
        likes:  2,
        dislikes: 4
    }
}



let newBlog = new blogModel(blog1);
// this async function returns a promise.. aage handle kiya hai then/catch se..
async function addBlog1() {
    let result = await newBlog.save();
    return result;
}
// You also use a model to create queries:
// const userFromDb = await UserModel.findOne({ name: 'Foo' }).exec();
*/

// CORS..
app.use(cors());

// body-parser snippet || STARTS
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// body-parser snippet || ENDS

// C'R'UD -  Retrieve One - Method 1 -> http://localhost:3000/getBlogs?id=122
app.get('/getBlogs', (req, res) => {
    console.log(JSON.stringify(req.params)+'.........req');
    console.log(JSON.stringify(req.query)+'.........req');
    console.log(JSON.stringify(req.query.id)+'.........req.query.id');
    // res.json(req.body);
    res.send('Hello from getBlogs express server!!');
    
});

// C'R'UD -  Retrieve One - Method 2 -> http://localhost:3000/getBlogs/122
app.get('/getBlogs/:id', (req, res) => {
    console.log(JSON.stringify(req.params)+'.........req');
    console.log(JSON.stringify(req.query)+'.........req');
    // res.json(req.body);
    res.send('Hello from getBlogById express server!!');

});

// C'R'UD 
// get all Blogs || BEST
app.get('/getAllBlogs', async (req, res) => {
    console.log(req);
    result = await blogModel.find();
    res.send(result);   
});

// C'R'UD 
// URL - http://localhost:3000/getBlogsByEmail?email=blogger@anymail.com
app.get('/getBlogsByEmail', (req, res) => {
    console.log(req.query.email);
    getBlogsByEmail(req.query.email)
    .then(finalResult => {
        console.log("getBlogsByEmail..."+finalResult);  
        if(Object.keys(finalResult).length > 0) {
            res.send(finalResult);
        } 
        else if(Object.keys(finalResult).length === 0){
            res.send("No data found for the id");  
        }         
    })
    .catch(error=>{
        console.log("Error.."+error);   
        res.send(error)   
    });
    // res.send('Hello from getBlogs express server!!');
});

// C'R'UD 
// URl - http://localhost:3000/getBlogById/blogger@anymail.com
app.get('/getBlogById/:id', (req, res) => {
    getBlogById(req.params.id)
    .then(finalResult => {
        if(Object.keys(finalResult).length > 0) {
            res.send(finalResult);   
        } 
        else if(Object.keys(finalResult).length === 0){
            res.send("No data found for the id");   
        }           
    })
    .catch(error=>{
        console.log("Error.."+error);   
        res.send(error);   
    });

});

// CRU'D'
// http://localhost:3000/deleteBlogById?id=5d564aeab99b4b2338d13bbf
app.delete('/deleteBlogById', (req, res) => {
    deleteBlogById(req.query.id)
    .then(finalResult => {
        console.log("deleteBlogById..."+finalResult);  
        console.log("Blog Deleted..."+JSON.stringify(finalResult));      
        if(finalResult === null){
            res.send("Cannot delete blog ID-"+req.query.id+". Blog NOT FOUND!");
        }
        else if(finalResult !== null){
            res.send("Blog Deleted "+req.query.id);
        }
    })
    .catch(error=>{
        console.log("Error.."+error);   
        res.send("Cannot Delete Blog! "+error)   
    });
});

// 'C'RUD
// http://localhost:3000/addBlog
app.post('/addBlog', (req, res) => {
    addBlogPOST(req.body)
        .then(finalResult => {
            console.log("Blog Added"+finalResult);  
            console.log("Blog Added..."+JSON.stringify(finalResult));      
            res.send("Blog Added!");
        })
        .catch(error=>{
            console.log("Error.."+error);    
            res.send("Cannot Add Blog. Please Check your request! \n"+error);
        });
    
    //res.send('Hello from express server!!'); // doesn't get printed with error Cannot set headers after they are sent to the client
    /* 
        Doosra tareekaa...
        
        var blog1 = new blogModel({
            title:  req.body.title,
            author: req.body.author,
            email: req.body.email,
            body:  req.body.body,
            hidden: req.body.hidden,
            meta: {
                votes: req.body.meta.votes,
                likes:  req.body.meta.likes,
                dislikes: req.body.meta.dislikes
            }
        })
        blog1.save((err, result) => {
            if(!err) {
                res.send(result)
            }
            else {
                console.log("Error "+JSON.stringify(err, undefined, 2))
            }
        })

    */
});


// CR'U'D -  Update
// http://localhost:3000/updateBlogById/5d564aeab99b4b2338d13bbf
app.put('/updateBlogById/:id', (req, res) => {
    updateBlogById(req.params.id, req.body)
        .then(finalResult => {
            console.log("Blog Updated..."+JSON.stringify(finalResult));      
            res.send("Blog Updated!");
        })
        .catch(error=>{
            console.log("Error.."+error);   
            res.send("Cannot Update Blog. Please Check your request!");
        });
    
});

app.get('/*',(req, res) => {
    res.send("Please Check your request")
});

app.listen( 3000, ()=> {
    console.log("Server started at port 3000");
    
});

// functions start

    
// this async function returns a promise.. aage handle kiya hai then/catch se..

async function getBlogsByEmail(requestEmail) {
    // let newBlog = new blogModel(requestBody);
    let result = await blogModel.find({ email: requestEmail });

    return result;
}

async function getBlogById(id) {
    let result = await blogModel.find({ _id: id });
    return result;
}

async function addBlogPOST(requestBody) {
    let newBlog = new blogModel(requestBody);
    let result = await newBlog.save();
    return result;
}


async function deleteBlogById(id) {
    let result = await blogModel.findOneAndDelete({ _id: id });
    return result;
}

async function updateBlogById(id, requestBody) {
    let result = await blogModel.updateOne({ _id: id }, requestBody);
    return result;
}
