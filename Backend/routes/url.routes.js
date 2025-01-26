import express from 'express';
import { handleRedirect ,handleShortenURL, handleGetAnalytics, handleUserAnalytics} from '../controllers/url.controller.js';
import { qrcode } from '../services/qrCode.js';

const router = express.Router();

router.post('/shorten',handleShortenURL);

router.get('/:nanoId',handleRedirect);

router.get('/analytics/:nanoId',handleGetAnalytics)

router.get('/user/status',handleUserAnalytics);

// Endpoint to generate QR code
router.post('/generate-qr', qrcode);

export default router;