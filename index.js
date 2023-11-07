const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmkgsu4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allBlogsCollection = client.db('BlogBloomDB').collection('allBlogs');
    const commentCollection = client.db('BlogBloomDB').collection('comments');
    const wishlistCollection = client.db('BlogBloomDB').collection('wishlist');

    // all blogs 
    app.post("/allblogs", async (req, res) => {
        const blog = req.body;
        console.log("blog", blog)
        const result = await allBlogsCollection.insertOne(blog);
        console.log(result);
        res.send(result);
      })



    app.get('/allblogs', async(req, res) => {
        const cursor = allBlogsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/recentblogs', async(req, res) => {
        const cursor = allBlogsCollection.find().limit(6).sort({ date: -1 });
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/details/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await allBlogsCollection.findOne(query);
        res.send(result);
    })

    // comments 

    app.get('/comments', async(req, res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email) {
            query = {email: req.query.email}
        }
        const result = await commentCollection.find(query).toArray();
        res.send(result)
    })


    app.post('/comments', async(req, res) => {
        const comment = req.body;
        console.log(comment);
        const result = await commentCollection.insertOne(comment);
        res.send(result);
    })

    //wishlist
    app.get('/wishlist', async(req, res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email) {
            query = {email: req.query.email}
        }
        const result = await wishlistCollection.find(query).toArray();
        res.send(result)
    })

    app.post('/wishlist', async(req, res) => {
        const wishlist = req.body;
        console.log(wishlist);
        const result = await wishlistCollection.insertOne(wishlist);
        res.send(result);
    });

    app.delete('/wishlist/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await wishlistCollection.deleteOne(query);
        res.send(result); 
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('its running man')
})

app.listen(port, () => {
    console.log(`man it is running on port ${port}`)
})
