const express = require('express');
const router = express.Router();
import { listChannels, openChannel, closeChannel } from '../controllers/channelsController'

router.get('/list', listChannels);
router.post('/open', openChannel);
router.post('/close', closeChannel);

export default router;

