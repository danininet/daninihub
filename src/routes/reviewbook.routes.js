const express = require('express');
const {
  submitReview,
  getModerationQueue
} = require('../services/reviewbook.service');

const router = express.Router();

router.get('/moderation-queue', (req, res) => {
  res.json({
    queue: getModerationQueue(),
    moderation: 'AI_ASSISTED_HUMAN_REVIEW'
  });
});

router.post('/submit', (req, res) => {
  const payload = submitReview(req.body);

  res.status(201).json({
    status: 'submitted',
    payload
  });
});

module.exports = router;
