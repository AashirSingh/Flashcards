const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bookings-2bd51.firebaseio.com',
});
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // To parse JSON request bodies
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/assign-role', async (req, res) => {
    const { uid, role } = req.body; // Get uid and role from request body
 
    if (!uid || !role) {
      return res.status(400).send('Missing uid or role');
    }
 
    try {
      await admin.auth().setCustomUserClaims(uid, { role });
      res.status(200).send(`Successfully assigned role ${role} to user ${uid}`);
    } catch (error) {
      console.error('Error assigning role:', error);
      res.status(500).send('Error assigning role');
    }
  });
