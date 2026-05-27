import { Router } from 'express';
import * as taskControllers from '../controllers/taskController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/', authenticate, taskControllers.getTasks);
router.get(
  '/progress/:objectId',
  authenticate,
  taskControllers.getObjectProgress,
);
router.get('/:id', authenticate, taskControllers.getTaskById);
router.post('/', authenticate, taskControllers.createTask);
router.patch('/:id', authenticate, taskControllers.updateTask);
router.delete('/:id', authenticate, taskControllers.deleteTask);

export default router;
