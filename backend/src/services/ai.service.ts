import OpenAI from 'openai';
import { prisma } from '../config/db';

/**
 * Generates a structured academic lesson using OpenAI API.
 * Follows strict modular requirements and maintains professional educational standards.
 */
export const generateAIResponse = async (
  userId: number,
  categoryId: number,
  subCategoryId: number,
  prompt: string
) => {
  const systemInstruction = `
    אתה מורה אקדמי מומחה. תפקידך לייצר שיעורים מובנים ומעמיקים המותאמים למשתמשים.
    דרישות מבנה:
    1. פתיחה: מבוא קצר וסקירה כללית של הנושא.
    2. גוף השיעור: פירוט עקרונות ליבה, מנגנונים ומאפיינים (שימוש בבולטים וכותרות).
    3. דוגמאות: הבאת דוגמאות מעשיות להמחשת החומר.
    4. סיכום: סיכום אינטגרטיבי ללמידה.
    
    סגנון: אקדמי, מעשיר, ברור ומעודד למידה. השתמש ב-Markdown מלא.
  `;

  let responseText: string;

  try {
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `הנושא לשיעור הוא: ${prompt}` }
        ],
        temperature: 0.5, // ערך נמוך יותר לדיוק אקדמי
        max_tokens: 2000,
      });
      responseText = completion.choices[0]?.message?.content || getMockResponse(prompt);
    } else {
      responseText = getMockResponse(prompt);
    }
  } catch (error) {
    console.error('[ai.service] Error generating AI response:', error);
    responseText = getMockResponse(prompt);
  }

  // שמירה ל-Database
  try {
    return await prisma.promptLog.create({
      data: {
        userId,
        categoryId,
        subCategoryId,
        prompt,
        response: responseText
      }
    });
  } catch (dbError) {
    console.error('[ai.service] Database insertion error:', dbError);
    throw new Error('Failed to save prompt log to database.');
  }
};

const getMockResponse = (prompt: string): string => {
  return `### שיעור מותאם אישית: ${prompt}\n\n**מבוא:** המערכת פועלת במצב הגנה (Fallback), אך עקרונות הלמידה נשמרים.\n\n1. **עקרונות מרכזיים:** הגדרת נושא, ניתוח ויישום.\n2. **העמקה:** ניתוח המנגנונים הפנימיים של המושג.\n3. **סיכום:** הבנה אינטגרטיבית של הנושא.\n\nבהצלחה בלימוד!`;
};