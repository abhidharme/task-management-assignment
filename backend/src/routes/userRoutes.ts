import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { getUsers, updateUserRole } from '../controllers/userController';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);

export default router;