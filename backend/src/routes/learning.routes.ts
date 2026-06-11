import { Router } from 'express';
import { 
  registerUser, 
  getCategories, 
  getUserHistory, 
  getAdminDashboard,
  generateLesson
} from '../controllers/learning.controller';

// שימוש בראוטר הרשמי של Express
const router = Router();

// נתיבי המערכת
router.post('/users/register', registerUser);
router.get('/categories', getCategories);
router.get('/users/:userId/history', getUserHistory);
router.get('/admin/dashboard', getAdminDashboard);

// נתיב יצירת השיעור מה-AI
router.post('/learning/prompt', generateLesson);

export default router;