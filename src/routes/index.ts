import { Router } from 'express';
import authRouter from './auth.js';
import objectRouter from './objects.js';
import taskRouter from './task.js';
import userRouter from './user.js';
import inviteRouter from './invite.js';
const router = Router();

router.use('/auth', authRouter);
router.use('/objects', objectRouter);
router.use('/tasks', taskRouter);
router.use('/users', userRouter);
router.use('/invites', inviteRouter);

export default router;
