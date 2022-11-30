const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require("dotenv").config()


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_KEY_DB}:${process.env.USER_PASS_DB}@cluster0.c8jqolf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userClaction = client.db('resell_product').collection("users");
        const productClaction = client.db('resell_product').collection("products");
        const catagoryClaction = client.db('resell_product').collection("catagory");
        const commintsClaction = client.db('resell_product').collection("commints");
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userClaction.insertOne(user);
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await userClaction.findOne(query);
            res.send(result);
        })
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productClaction.insertOne(product);
            res.send(result)
        })
        app.get('/myproduct', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await productClaction.find(query).toArray();
            res.send(result);
        })
        app.get('/allproduct/:id/:tast', async (req, res) => {
            const id = req.params.id;
            const catagory = req.params.tast;
            console.log(id,catagory)

            const query = {catagory: id}
            const result = await productClaction.find(query).toArray();
            res.send({result,catagory});
        })
        app.put('/advatige/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    advatige: true
                }
            }
            const result = await productClaction.updateOne(query, updateDoc, option);
            res.send(result)

        })
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productClaction.deleteOne(query);
            res.send(result)
        })
        app.get('/advatige',async(req, res)=>{
            const query = {
                advatige:true,
                avialabol:true,
            };
            const result = await productClaction.find(query).toArray();
            res.send(result)
        })
        app.get('/catagory',async(req, res)=>{
            const query = {};
            const result = await catagoryClaction.find(query).toArray();
            res.send(result)
        })
        app.get('/commints',async(req, res)=>{
            const query = {};
            const result = await commintsClaction.find(query).toArray();
            res.send(result)
        })
    }
    finally {

    }

}
run().catch(console.log)


app.get('/', async (req, res) => {
    res.send("resell server is runing")
})
app.listen(port, () => console.log(`resell rerver runing port: ${port}`))