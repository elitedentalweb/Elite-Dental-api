import { Router } from 'express';
import * as objectControllers from '../controllers/objectController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/', authenticate, objectControllers.getObjects);
router.get('/:id', authenticate, objectControllers.getObjectById);
router.post('/', authenticate, objectControllers.createObject);
router.patch('/:id', authenticate, objectControllers.updateObject);
router.patch(
  '/:id/progress',
  authenticate,
  objectControllers.updateManualProgress,
);
router.delete('/:id', authenticate, objectControllers.deleteObject);

export default router;
