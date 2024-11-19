const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Route to assign a role to a user
router.post('/assign-role', async (req, res) => {
  const { uid, role } = req.body;

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

module.exports = router;
