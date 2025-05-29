import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
<<<<<<< Updated upstream
=======
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
>>>>>>> Stashed changes

const app = express();

app.use(cors());
app.use(express.json());

let db;

async function connectToDB() {
    const uri = 'mongodb://127.0.0.1:27017';

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

<<<<<<< Updated upstream
    db = client.db('community-marketplace-db')
=======
    db = client.db('UON-Community-Marketplace');

   /* db = client.db('full-stack-react-db'); */
>>>>>>> Stashed changes
}

async function start() {
    await connectToDB();

    app.listen(8000, function() {
        console.log('Server is listening on port 8000');
    })
}

app.get('/', (req, res) => {
    res.send('Community Marketplace API is running!');
});

app.get('/api/listings', async (req, res) => {
    try {
        const listings = await db.collection('listings').find().toArray();
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

<<<<<<< Updated upstream
=======
async function start() {
    await connectToDB();

    app.listen(8000, function() {
        console.log('Server is listening on port 8000');
    })
}

app.post('/api/listings', async (req, res) => {
    try {
        console.log('Received request to create listing:', req.body);
        const { title, price, category, description } = req.body;
        const result = await db.collection('listings').insertOne({
            title,
            price,
            category,
            description,
            createdAt: new Date()
        });
        res.status(201).json({ message: 'Listing created', id: result.insertedId });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

>>>>>>> Stashed changes
start();
