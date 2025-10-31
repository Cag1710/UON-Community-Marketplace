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
<<<<<<< Updated upstream
    try {
        const listings = await db.collection('listings').find().toArray();
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
=======
  try {
    const includeSold = req.query.includeSold === '1' || req.query.includeSold === 'true';
    const query = includeSold ? {} : { sold: { $ne: true } }; // returns docs missing 'sold' or sold=false

    const listings = await db.collection('listings')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
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
      sold: false,
      soldAt: null,
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

app.patch('/api/listings/:id/sell', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await db.collection('listings').findOne({ _id: new ObjectId(id) });
    if (!listing) return res.status(404).json({ error: 'Not found' });

    if (String(listing.userId) !== String(req.user.uid)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (listing.sold === true) return res.json(listing);

    const update = {
      $set: {
        sold: true,
        soldAt: new Date(),
      },
    };

    await db.collection('listings').updateOne({ _id: new ObjectId(id) }, update);

    const updated = await db.collection('listings').findOne({ _id: new ObjectId(id) });
    return res.json(updated);
  } catch (e) {
    console.error('Error marking sold:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/public', async (req, res) => {
  try {
    const ids = String(req.query.ids || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 100);

    if (ids.length === 0) return res.json({});

    const snaps = await Promise.all(
      ids.map(id => admin.firestore().doc(`users/${id}`).get())
    );

    const result = {};
    snaps.forEach((snap, i) => {
      if (snap.exists) {
        const { username, email } = snap.data();
        result[ids[i]] = {
          username: username || null,
          email: email || null,
        };
      }
    });

    res.json(result);
  } catch (e) {
    console.error('Error fetching public users:', e);
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

/* Delete conversation + its messages, emit to both participants */
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


app.get('/api/username-available', async (req, res) => {
  try {
    const u = String(req.query.u || '').trim().toLowerCase();
    if (!u) return res.status(400).json({ error: 'missing u' });

    const snap = await admin
      .firestore()
      .collection('users')
      .where('usernameLower', '==', u)
      .limit(1)
      .get();

    const available = snap.empty;
    res.json({ available });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed' });
  }
});

/* ===================== MESSAGES ===================== */
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
      createdAt: new Date()
    };
    const result = await db.collection('messages').insertOne(newMessage);

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessage: text, updatedAt: new Date() } }
    );

    res.status(201).json({ id: result.insertedId, ...newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Unsend (delete) a single message + emit to both users */
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
        messageId
      });
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/ban-user', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { uid, banned } = req.body || {};
    if (typeof uid !== 'string' || typeof banned !== 'boolean') {
      return res.status(400).json({ error: 'uid (string) and banned (boolean) required' });
    }

    try {
      await admin.auth().updateUser(uid, { disabled: banned });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.warn(`User ${uid} not found in Auth. Updating Firestore only.`);
      } else {
        console.error('Firebase Auth update failed:', err);
        return res.status(500).json({ error: err.message || 'Auth update failed' });
      }
    }

    await admin.firestore().doc(`users/${uid}`).set({ banned }, { merge: true });

    return res.json({ ok: true, message: banned ? 'User banned' : 'User unbanned' });
  } catch (err) {
    console.error('Ban/unban error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/api/admin/listings/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('listings').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ ok: true, message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/reports/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('reports').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ ok: true, message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reports', requireAuth, async (req, res) => {
  try {
    const { listingId, reportType, details, targetType, targetId } = req.body || {};

    if (typeof reportType !== 'string') {
      return res.status(400).json({ error: 'reportType required' });
    }

    const doc = {
      reportType,
      details: details || '',
      reportedBy: req.user.uid,
      createdAt: new Date(),
      status: 'open',
      targetType: targetType || 'listing', 
    };

    if (doc.targetType === 'listing') {
      const normalizedListingId = listingId || (targetType === 'listing' ? targetId : null);
      if (typeof normalizedListingId !== 'string') {
        return res.status(400).json({ error: 'listingId and/or targetId required for listing reports' });
      }

      let listingOwnerId = null;
      try {
        const listingDoc = await db.collection('listings')
          .findOne({ _id: new ObjectId(normalizedListingId) });
        listingOwnerId = listingDoc?.userId || null;
      } catch {}

      doc.targetId = normalizedListingId; 
      doc.listingId = normalizedListingId; 
      doc.listingOwnerId = listingOwnerId; 
    }
    else if (doc.targetType === 'user') {
      if (typeof targetId !== 'string') {
        return res.status(400).json({ error: 'targetId (user uid) required for user reports' });
      }
      doc.targetId = targetId;       
      doc.reportedUserId = targetId; 
    }
    else {
      return res.status(400).json({ error: 'Unsupported targetType' });
    }

    const result = await db.collection('reports').insertOne(doc);
    res.json({ ok: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { targetType } = req.query;      
    const query = targetType ? { targetType } : {};
    const reports = await db.collection('reports')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    res.json(reports);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/reports/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('reports').deleteOne({ _id: new ObjectId(id) });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/reports/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['open', 'reviewing', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const id = req.params.id;
    const result = await db.collection('reports').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Report not found' });

    res.json({ ok: true });
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
>>>>>>> Stashed changes
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
