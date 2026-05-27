import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getUsersController,
  approveUserController,
  revokeUserController,
  setRoleController,
  deleteUserController,
} from '../controllers/user.js';

const router = Router();

router.get('/', authenticate, getUsersController);
router.post('/set-role', authenticate, setRoleController);
router.post('/approve', authenticate, approveUserController);
router.post('/revoke', authenticate, revokeUserController);
router.delete('/', authenticate, deleteUserController);

export default router;
