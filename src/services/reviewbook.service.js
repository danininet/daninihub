const moderationQueue = [];

function validateReviewEntry(entry = {}) {
  if (!entry.publicName || !entry.content) {
    const error = new Error('Review requires publicName and content.');
    error.status = 422;
    throw error;
  }
}

function submitReview(entry = {}) {
  validateReviewEntry(entry);

  const payload = {
    id: `review_${Date.now()}_${moderationQueue.length + 1}`,
    timestamp: new Date().toISOString(),
    publicName: entry.publicName,
    content: entry.content,
    moderation: {
      state: 'VALIDATION_REQUIRED',
      aiLayer: 'blocked_until_connected',
      humanReview: 'required',
      publication: 'blocked',
      rules: [
        'No fake guarantees',
        'No hate speech',
        'No illegal claims',
        'No impersonation',
        'No fabricated success metrics'
      ]
    }
  };

  moderationQueue.push(payload);

  return payload;
}

function getModerationQueue() {
  return moderationQueue;
}

module.exports = {
  submitReview,
  getModerationQueue
};
