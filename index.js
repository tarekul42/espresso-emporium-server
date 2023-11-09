const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxobuiv.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://xespressoEmporium:xiShzUX6YolH7gUj@cluster0.jxobuiv.mongodb.net/?retryWrites=true&w=majority`;

// middlewere
app.use(cors())
app.use(express.json())



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

    const espressoEmporiumCoffees = client.db('espressoEmporium').collection('coffees');

    app.get('/coffees', async(req, res) =>{
      const cursor = espressoEmporiumCoffees.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffees/:id', async(req, res) =>{
      const id = req.params.id;
      const quries = {_id : new ObjectId(id)};
      const result = await espressoEmporiumCoffees.findOne(quries);
      res.send(result)
    })

    app.post('/coffees', async(req, res) =>{
        const newCoffee = req.body;
        const result = await espressoEmporiumCoffees.insertOne(newCoffee);
        res.send(result)
    })

    app.put('/coffees/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert : true };
      const updatedCoffee = req.body;
      const data = {
        $set:{
          name: updatedCoffee.name,
          chef: updatedCoffee.chef, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          category: updatedCoffee.category, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
        }
      };
      const result = await espressoEmporiumCoffees.updateOne(filter, data, options);
      res.send(result)
    })

    app.delete('/coffees/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await espressoEmporiumCoffees.deleteOne(query);
      res.send(result)
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


app.get('/', (req, res) =>{
    res.send('Espresso Emporium server is running')
})

app.listen(port, ()=>{
    console.log(`Espresso Emporium Server is Runnig on port: ${port}`);
})