const express = require('express');
const router = express.Router();
const { getCourseContent } = require('./firebaseConfig');

// Route to get course content by courseId
router.get('/course/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseContent = await getCourseContent(courseId);
    res.status(200).json(courseContent);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to retrieve course content' });
  }
});

module.exports = router;