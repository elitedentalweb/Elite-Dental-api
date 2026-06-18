import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { createInviteController } from '../controllers/inviteController.js';

const router = Router();

router.post('/', authenticate, createInviteController);

export default router;
