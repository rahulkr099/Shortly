import express from 'express';
import { handleRedirect ,handleGenerateNewShortURL, handleGetAnalytics} from '../controllers/url.controller';

const router = express.Router();

router.post('/shorten',handleGenerateNewShortURL);

router.get('/:nanoId',handleRedirect);

router.get('/:nanoId/analytics',handleGetAnalytics)

export default router;