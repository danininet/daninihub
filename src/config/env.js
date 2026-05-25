function envSnapshot() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    openai: Boolean(process.env.OPENAI_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    brevo: Boolean(process.env.BREVO_API_KEY),
    database: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  };
}

module.exports = {
  envSnapshot
};
