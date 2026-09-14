import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/api/payments/webhook', express.raw({ type: '*/*' }));
app.use(express.json());

app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Training4Impact backend is running',
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body',
    });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`Training4Impact backend running on port ${PORT}`);
});