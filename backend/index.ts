import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './api/admin.js';
import userRoutes from './api/user.js';
import predictionRoutes from './api/predictions.js';
import promoRoutes from './api/promo.js';
import checkoutRoutes from './api/checkout.js';
import webhookRoutes from './api/webhooks.js';

dotenv.config();

// CRITICAL SECRET VALIDATION (SECRET CASE RULE)
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('FATAL: CRITICAL SECRETS MISSING', missing);
    process.exit(1); // Crash app as per security rules
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
