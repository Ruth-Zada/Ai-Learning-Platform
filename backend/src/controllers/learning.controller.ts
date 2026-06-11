import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { generateAIResponse } from '../services/ai.service';

// 1. רישום משתמש חדש (או שליפה אם קיים)
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: 'שם וטלפון הם שדות חובה' });
      return;
    }

    // אם המשתמש קיים — מחזיר אותו. אם לא — יוצר חדש
    const user = await prisma.user.upsert({
      where: { phone },
      update: { name },
      create: { name, phone }
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'שגיאה ברישום המשתמש' });
  }
};

// 2. שליפת קטגוריות (עם יצירה אוטומטית אם ריק)
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    let categories = await prisma.category.findMany({
      include: { subCategories: true }
    });

    if (categories.length === 0) {
      await prisma.category.create({
        data: {
          name: 'מדעים',
          subCategories: {
            create: [
              { name: 'אסטרופיזיקה' },
              { name: 'מכניקת הקוונטים' }
            ]
          }
        }
      });
      await prisma.category.create({
        data: {
          name: 'פיתוח תוכנה',
          subCategories: {
            create: [
              { name: 'Node.js Backend' },
              { name: 'React Frontend' }
            ]
          }
        }
      });

      categories = await prisma.category.findMany({
        include: { subCategories: true }
      });
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליפת קטגוריות' });
  }
};

// 3. יצירת שיעור מותאם אישית — מחובר ל-OpenAI
export const generateLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, categoryId, subCategoryId, prompt } = req.body;

    if (!userId || !categoryId || !subCategoryId || !prompt) {
      res.status(400).json({ error: 'כל השדות הם חובה עבור יצירת שיעור' });
      return;
    }

    // קריאה ל-AI Service (OpenAI או MOCK אוטומטית)
    const log = await generateAIResponse(
      Number(userId),
      Number(categoryId),
      Number(subCategoryId),
      prompt
    );

    res.json(log);
  } catch (error: any) {
    console.error('Generate lesson error:', error);
    res.status(500).json({ error: 'שגיאה בייצור השיעור' });
  }
};

// 4. שליפת היסטוריית משתמש
export const getUserHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const history = await prisma.promptLog.findMany({
      where: { userId: Number(userId) },
      include: { category: true, subCategory: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליפת ההיסטוריה' });
  }
};

// 5. דשבורד מנהל
export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        prompts: {
          include: { category: true, subCategory: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליפת נתוני מנהל' });
  }
};