import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import admin from './firebaseAdmin.js';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  },
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// ---- DB ----
let db;

async function connectToDB() {
  const uri = !process.env.MONGODB_USERNAME
    ? 'mongodb://127.0.0.1:27017'
    : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.btuc6qi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });

  await client.connect();
  db = client.db('UON-Community-Marketplace');
}

// ---- Auth helpers ----
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
function requireAdmin(req, res, next) {
  if (req.user?.admin === true) return next();
  return res.status(403).json({ error: 'Admins only' });
}

// ===================== LISTINGS =====================
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await db.collection('listings').find().toArray();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
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
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/listings', async (req, res) => {
  try {
    const { title, price, category, description, images, userId, location, condition } = req.body;
    const result = await db.collection('listings').insertOne({
      title,
      price,
      category,
      description,
      images,
      userId,
      location,
      condition,
      createdAt: new Date(),
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

// ===================== CONTACT US EMAIL =====================
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Configure your SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noah.cook170902@gmail.com',
      pass: process.env.CONTACT_EMAIL_PASS // Use an App Password, not your main password!
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: 'noah.cook170902@gmail.com',
      subject: `Contact Us Message from ${name}`,
      text: message,
      replyTo: email
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending contact email:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// ===================== ADMIN =====================
app.post('/api/admin/set-role', requireAuth, requireAdmin, async (req, res) => {
  const { uid, admin: makeAdmin } = req.body || {};
  if (typeof uid !== 'string' || typeof makeAdmin !== 'boolean') {
    return res.status(400).json({ error: 'uid and admin (boolean) required' });
  }

  await admin.auth().setCustomUserClaims(uid, { admin: makeAdmin });
  await admin.firestore().doc(`users/${uid}`).set({ isAdmin: makeAdmin }, { merge: true });

  res.json({ ok: true });
});

// ===================== CONVERSATIONS =====================
app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await db.collection('conversations')
      .find({ participants: { $in: [userId] } })
      .sort({ updatedAt: -1 })
      .toArray();
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/conversations', async (req, res) => {
  try {
    const { userA, userB, listingId } = req.body;

    let convo = await db.collection('conversations').findOne({
      participants: { $all: [userA, userB] },
      listingId: listingId || null,
    });

    if (!convo) {
      const listingData = listingId
        ? await db.collection('listings').findOne({ _id: new ObjectId(listingId) })
        : null;

      const newConvo = {
        participants: [userA, userB],
        listingId: listingId || null,
        listing: listingData || null,
        lastMessage: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await db.collection('conversations').insertOne(newConvo);
      convo = { _id: result.insertedId, ...newConvo };
    }

    res.json(convo);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/conversations/:conversationId', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const convo = await db.collection('conversations').findOne({ _id: new ObjectId(conversationId) });
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });

    await db.collection('messages').deleteMany({ conversationId });
    await db.collection('conversations').deleteOne({ _id: new ObjectId(conversationId) });

    (convo.participants || []).forEach(uid => {
      io.to(String(uid)).emit('conversationDeleted', { conversationId });
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===================== MESSAGES =====================
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const messages = await db.collection('messages')
      .find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .toArray();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    const newMessage = {
      conversationId,
      senderId,
      text,
      createdAt: new Date(),
    };
    const result = await db.collection('messages').insertOne(newMessage);

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessage: text, updatedAt: new Date() } },
    );

    res.status(201).json({ id: result.insertedId, ...newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/messages/:messageId', async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const msg = await db.collection('messages').findOne({ _id: new ObjectId(messageId) });
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    const convo = await db.collection('conversations').findOne({ _id: new ObjectId(msg.conversationId) });
    await db.collection('messages').deleteOne({ _id: new ObjectId(messageId) });

    (convo?.participants || []).forEach(uid => {
      io.to(String(uid)).emit('messageDeleted', {
        conversationId: msg.conversationId,
        messageId,
      });
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reports', requireAuth, async (req, res) => {
  try {
    const { listingId, reportType, details } = req.body || {};
    if (typeof listingId !== 'string' || typeof reportType !== 'string') {
      return res.status(400).json({ error: 'listingId and reportType required' });
    }

    const doc = {
      listingId,
      reportType,
      details: details || '',
      reportedBy: req.user.uid,     
      createdAt: new Date(),
      status: 'open',            
    };

    const result = await db.collection('reports').insertOne(doc);
    res.json({ ok: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports', requireAuth, requireAdmin, async (req, res) => {
  try {
    const reports = await db.collection('reports')
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    res.json(reports);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===================== SOCKET.IO =====================
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ conversationId, senderId, recipientId, text }) => {
    try {
      const newMessage = {
        conversationId,
        senderId,
        text,
        createdAt: new Date(),
      };

      await db.collection('messages').insertOne(newMessage);
      await db.collection('conversations').updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: { lastMessage: text, updatedAt: new Date() } },
      );

      io.to(String(recipientId)).emit('newMessage', { ...newMessage });
      io.to(String(senderId)).emit('newMessage', { ...newMessage });
    } catch (error) {
      console.error('Socket sendMessage error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ---- Start ----
async function start() {
  await connectToDB();
  httpServer.listen(8000, () => {
    console.log('Server with Socket.io listening on port 8000');
  });
}
start();