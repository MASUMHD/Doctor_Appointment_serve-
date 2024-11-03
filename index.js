const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB Atlas


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zi8pxok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const doctorUsersCollection = client.db("Doc_House").collection("users");


    // add users
    app.post('/users', async (req, res) => {
        const newUsers = req.body;
        console.log('adding new user', newUsers);
        const result = await doctorUsersCollection.insertOne(newUsers);
        res.send(result)
    })

    // get / show users
    app.get('/users', async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      const result = await doctorUsersCollection.find(query).toArray();
      res.send(result);
    });

    // delete users
    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await doctorUsersCollection.deleteOne(query);
        res.send(result);
    })


    // Update user role
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const { role } = req.body; 

      try {
        const query = { _id: new ObjectId(id) };
        const update = { $set: { role: role } }; 
        const result = await doctorUsersCollection.updateOne(query, update);

        if (result.modifiedCount === 1) {
          res.send({ message: "User role updated successfully." });
        } else {
          res.status(404).send({ message: "User not found or role is the same." });
        }
      } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).send({ message: "Failed to update the role. Please try again." });
      }
    });




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Doctor House is running.....')
})

app.listen(port, () => {
    console.log(`Doctor server is running on ${port}`)
})