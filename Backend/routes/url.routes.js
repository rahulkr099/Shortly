import express from 'express';
import { handleRedirect ,handleShortenURL, handleGetAnalytics, handleUserAnalytics} from '../controllers/url.controller.js';
import { qrcode } from '../services/qrCode.js';
import {auth} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/shorten',auth,handleShortenURL);

router.get('/:nanoId',handleRedirect);

router.get('/analytics/:nanoId',auth,handleGetAnalytics)

router.get('/user/status',auth,handleUserAnalytics);

// Endpoint to generate QR code
router.post('/generate-qr',auth, qrcode);

export default router;