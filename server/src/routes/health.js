/* global process */
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

export default router;
