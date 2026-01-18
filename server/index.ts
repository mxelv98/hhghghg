import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js'; // Optional if not pure client-side

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes); // Auth is now handled by Supabase on Frontend
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);   // We might keep this for custom profile logic if needed

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
