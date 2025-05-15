import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();

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

    db = client.db('community-marketplace-db')
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

start();
