const moderationQueue = [];

function submitReview(entry) {
  const payload = {
    id: `review_${Date.now()}`,
    timestamp: new Date().toISOString(),
    publicName: entry.publicName,
    content: entry.content,
    aiModeration: {
      status: 'PENDING',
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
