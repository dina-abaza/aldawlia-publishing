import axios from 'axios';
import { useAdminAuthStore } from './admin/store/useAdminAuthStore';

// 1. حطي رابط الـ ngrok اللي معاكي هنا مباشرة (Base URL)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    // 2. السطر ده هو "كلمة السر" عشان ngrok يبعت البيانات للمتصفح من غير تحذير
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: إضافة التوكن لكل طلب
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: التعامل مع انتهاء التوكن
// Response Interceptor: التعامل مع انتهاء التوكن
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        useAdminAuthStore.getState().forceAdminLogout();
        // 1. امسحي التوكن والبيانات فوراً عشان الـ Zustand يحس بالتغيير
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('auth-storage'); // احتياطي لو بتستخدمي ستور تاني

        // 2. شوفي إنتي في صفحة أدمن ولا مستخدم عادي ووديه المكان الصح
        const isAdminPath = window.location.pathname.startsWith('/admin');
        const loginPath = isAdminPath ? '/admin/login' : '/login';

        // لو إنتي أصلاً مش في صفحة اللوجن، اطل
        // بي منه يخرج
        if (!window.location.pathname.includes(loginPath)) {
          window.location.href = loginPath;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;