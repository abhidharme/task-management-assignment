import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { getTasks, getTaskById, createTask, updateTask, deleteTask, completeTask } from '../controllers/taskController';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById); // New route for fetching task by ID
router.post('/', roleMiddleware(['admin', 'manager']), createTask);
router.put('/:id', roleMiddleware(['admin', 'manager', 'user']), updateTask);
router.delete('/:id', roleMiddleware(['admin', 'manager']), deleteTask);
router.post('/:id/complete', roleMiddleware(['user']), completeTask);

export default router;