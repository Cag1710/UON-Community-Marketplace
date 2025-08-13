import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'; // Import ObjectId here only once
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' })); // Allows larger JSON payloads for images

let db;

async function connectToDB() {
    const uri = !process.env.MONGODB_USERNAME
    ? 'mongodb://127.0.0.1:27017'
    : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.btuc6qi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    db = client.db('UON-Community-Marketplace');
}

app.get('/api/listings', async (req, res) => {
    try {
        const listings = await db.collection('listings').find().toArray();
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function start() {
    await connectToDB();

    app.listen(8000, function() {
        console.log('Server is listening on port 8000');
    })
}

app.post('/api/listings', async (req, res) => {
    try {
        console.log('POST /api/listings', req.body); 
        const { title, price, category, description, image, userId } = req.body;
        const result = await db.collection('listings').insertOne({
            title,
            price,
            category,
            description,
            image,
            userId, 
            createdAt: new Date()
        });
        res.status(201).json({ message: 'Listing created', id: result.insertedId });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/listings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.collection('listings').deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await db.collection('listings').findOne({ _id: new ObjectId(id) });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

start();