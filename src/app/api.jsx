import axios from 'axios';
import { useAdminAuthStore } from './admin/store/useAdminAuthStore';
import i18n from '@/i18n'; // Import i18n to get the current language

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: إضافة التوكن واللغة لكل طلب
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Pass the current frontend language to the backend
      const lang = i18n.language || 'ar';
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: التعامل مع انتهاء التوكن
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // لو الرد 401 (غير مصرح) واحنا لسه ما حاولناش نعيد الطلب
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        // 1. مسح كل البيانات المتعلقة بالجلسة فوراً
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('auth-storage'); // تنظيف ستور المستخدم العادي
        localStorage.removeItem('admin-auth-storage'); // تنظيف ستور الأدمن

        // 2. استدعاء Logout من الـ Stores مباشرة لتصفير الحالة (State)
        useAdminAuthStore.getState().forceAdminLogout?.();

        // 3. تحديد المسار بناءً على مكان المستخدم الحالي
        const currentPath = window.location.pathname;
        const isAdminPath = currentPath.startsWith('/admin');
        const loginPath = isAdminPath ? '/admin/login' : '/login';

        // 4. التوجيه لصفحة الدخول فقط لو المستخدم مش فيها حالياً
        // ومنع الـ Loop لو الـ API بتاع /me رجع 401
        if (!currentPath.includes('/login')) {
          window.location.href = loginPath;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;