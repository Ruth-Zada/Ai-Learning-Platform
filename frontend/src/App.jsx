import React, { useState, useEffect } from 'react';
import { BookOpen, UserPlus, History, ShieldAlert, Sparkles, Send, GraduationCap } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  // משתני המערכת
  const [activeTab, setActiveTab] = useState('learn'); // learn | register | history | admin
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminData, setAdminData] = useState([]);
  
  // משתני טפסים
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [promptText, setPromptText] = useState('');
  const [userHistory, setUserHistory] = useState([]);
  
  // משתני מצב טעינה ותשובות
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [message, setMessage] = useState('');

  // 1. שליפת קטגוריות בטעינת האפליקציה
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) {
            setSelectedCat(data[0].id);
            // בחירה אוטומטית של תת הקטגוריה הראשונה אם קיימת
            if (data[0].subCategories && data[0].subCategories.length > 0) {
              setSelectedSub(data[0].subCategories[0].id);
            }
          }
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  }, []);

  // 2. רישום משתמש חדש
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regPhone) return;
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, phone: regPhone })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data);
        setMessage(`משתמש ${data.name} נרשם וחובר בהצלחה!`);
        setActiveTab('learn');
        setUserHistory([]);
      } else {
        setMessage(data.error || 'שגיאה ברישום');
      }
    } catch (err) {
      setMessage('שגיאת תקשורת עם השרת');
    }
  };

  // 3. שליחת בקשת למידה ל-AI
  const handleGenerateLesson = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage('אנא הירשם או התחבר תחילה בלשונית רישום משתמש!');
      return;
    }
    if (!selectedCat || !selectedSub || !promptText) {
      setMessage('נא למלא את כל השדות');
      return;
    }

    setLoading(true);
    setAiResponse('');
    try {
      const res = await fetch(`${API_URL}/learning/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          categoryId: Number(selectedCat),
          subCategoryId: Number(selectedSub),
          prompt: promptText
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiResponse(data.response);
        fetchHistory(currentUser.id);
      } else {
        setMessage(data.error || 'שגיאה בייצור השיעור');
      }
    } catch (err) {
      setMessage('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  // 4. שליפת היסטוריית למידה אישית
  const fetchHistory = (userId) => {
    fetch(`${API_URL}/users/${userId}/history`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUserHistory(data);
      })
      .catch(err => console.error(err));
  };

  // 5. שליפת נתוני אדמין
  const fetchAdminDashboard = () => {
    fetch(`${API_URL}/admin/dashboard`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAdminData(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (activeTab === 'history' && currentUser) {
      fetchHistory(currentUser.id);
    } else if (activeTab === 'admin') {
      fetchAdminDashboard();
    }
  }, [activeTab]);

  // מציאת אובייקט הקטגוריה הנוכחי בצורה הגנתית
  const currentCategoryObj = Array.isArray(categories) 
    ? categories.find(c => Number(c.id) === Number(selectedCat))
    : null;
    
  const subCategories = currentCategoryObj && Array.isArray(currentCategoryObj.subCategories) 
    ? currentCategoryObj.subCategories 
    : [];

  return (
    <div style={{ direction: 'rtl' }} className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <GraduationCap size={36} />
          <h1 className="text-2xl font-bold tracking-wide">AI Learning Platform</h1>
        </div>
        {currentUser && (
          <div className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
            שלום, <span className="font-bold">{currentUser.name}</span> (ID: {currentUser.id})
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          <button onClick={() => setActiveTab('learn')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${activeTab === 'learn' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Sparkles size={18} /> מרכז למידה AI
          </button>
          <button onClick={() => setActiveTab('register')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <UserPlus size={18} /> רישום משתמש
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <History size={18} /> היסטוריה אישית
          </button>
          <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${activeTab === 'admin' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ShieldAlert size={18} /> פאנל מנהל (Admin)
          </button>
        </div>

        {/* Global Messages */}
        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="font-bold hover:text-blue-900">✕</button>
          </div>
        )}

        {/* Main Content */}
        <main className="mt-6">
          
          {/* TAB: LEARN */}
          {activeTab === 'learn' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-1">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700"><BookOpen size={20}/> התחלת שיעור חדש</h2>
                <form onSubmit={handleGenerateLesson} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">קטגוריה</label>
                    <select 
                      value={selectedCat} 
                      onChange={(e) => { 
                        setSelectedCat(e.target.value); 
                        const cat = categories.find(c => Number(c.id) === Number(e.target.value));
                        setSelectedSub(cat && cat.subCategories && cat.subCategories.length > 0 ? cat.subCategories[0].id : ''); 
                      }} 
                      className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">בחר קטגוריה</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">תת קטגוריה</label>
                    <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" disabled={!selectedCat}>
                      <option value="">בחר תת קטגוריה</option>
                      {subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">מה תרצה ללמוד היום? (Prompt)</label>
                    <textarea rows="4" value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder='לדוגמה: "למד אותי על חורים שחורים במרחב ונפחם"' className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-bold shadow-md hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2">
                    {loading ? 'ה-AI מייצר שיעור...' : <><Send size={18}/> ייצר שיעור מותאם אישית</>}
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 min-h-[400px] flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-gray-700 pb-2 border-b">תוכן השיעור המופק</h2>
                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                    <p className="font-medium animate-pulse">השירות כותב ומארגן את המידע עבורך...</p>
                  </div>
                )}
                {!loading && !aiResponse && (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8">
                    <Sparkles size={48} className="text-gray-300 mb-3" />
                    <p>הגדר קטגוריה ושלח בקשה כדי לראות את כוח ה-AI מחולל שיעור ברמה אקדמית.</p>
                  </div>
                )}
                {!loading && aiResponse && (
                  <div className="bg-gradient-to-br from-indigo-50/40 to-blue-50/20 p-5 rounded-xl border border-indigo-100/70 whitespace-pre-line leading-relaxed text-gray-800 font-medium shadow-inner">
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: REGISTER */}
          {activeTab === 'register' && (
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">רישום משתמש חדש</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">שם מלא</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="ישראל ישראלי" className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">מספר טלפון</label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="0501234567" className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">
                  בצע רישום והתחבר
                </button>
              </form>
            </div>
          )}

          {/* TAB: HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">היסטוריית הלמידה האישית שלך</h2>
              {!currentUser ? (
                <p className="text-gray-500 text-center py-6">נא להירשם או להתחבר על מנת לצפות בהיסטוריה שלך.</p>
              ) : userHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-6">טרם יצרת שיעורים. זה הזמן להתחיל ללמוד במרכז הלמידה!</p>
              ) : (
                <div className="space-y-4">
                  {userHistory.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:border-blue-400 bg-gray-50/50 transition">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">
                          {item.category?.name} / {item.subCategory?.name}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('he-IL')}</span>
                      </div>
                      <p className="font-bold text-gray-700 mb-2">שאילתה: <span className="font-normal text-gray-600">"{item.prompt}"</span></p>
                      <div className="p-3 bg-white border rounded text-sm text-gray-600 whitespace-pre-line max-h-40 overflow-y-auto">
                        {item.response}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADMIN */}
          {activeTab === 'admin' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-red-600">פאנל מנהל מערכת (כלל המשתמשים וההיסטוריה)</h2>
              {adminData.length === 0 ? (
                <p className="text-gray-500 text-center py-6">אין משתמשים רשומים במערכת כרגע.</p>
              ) : (
                <div className="space-y-6">
                  {adminData.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                          <p className="text-xs text-gray-500">טלפון: {user.phone} | מזהה משתמש: {user.id}</p>
                        </div>
                        <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                          סה"כ שיעורים: {user.prompts?.length || 0}
                        </span>
                      </div>
                      <div className="p-4 bg-white max-h-64 overflow-y-auto space-y-3">
                        {!user.prompts || user.prompts.length === 0 ? (
                          <p className="text-sm text-gray-400 italic">המשתמש עדיין לא הפיק שיעורים במערכת.</p>
                        ) : (
                          user.prompts.map((p) => (
                            <div key={p.id} className="text-xs border-r-4 border-indigo-500 pr-3 py-1 bg-gray-50/50">
                              <p className="font-bold text-gray-700">נושא: {p.category?.name} - {p.subCategory?.name} | <span className="text-gray-400 font-normal">{new Date(p.createdAt).toLocaleDateString()}</span></p>
                              <p className="text-gray-600 italic mt-0.5">Prompt: "{p.prompt}"</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;