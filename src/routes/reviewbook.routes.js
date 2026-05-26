const express = require('express');
const {
  submitReview,
  getModerationQueue
} = require('../services/reviewbook.service');
const { ok, validationError } = require('../core/response.contract');

const router = express.Router();

router.get('/moderation-queue', (req, res) => {
  return res.json(ok({
    queue: getModerationQueue(),
    moderation: 'HUMAN_REVIEW_REQUIRED'
  }));
});

router.post('/submit', (req, res) => {
  try {
    const payload = submitReview(req.body);

    return res.status(201).json(ok({
      review: payload,
      publication: 'blocked_until_validation'
    }));
  } catch (error) {
    return res.status(error.status || 500).json(
      validationError(error.message)
    );
  }
});

module.exports = router;
