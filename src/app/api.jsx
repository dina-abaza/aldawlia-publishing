import axios from 'axios';

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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // لو الأدمن → يروح لصفحة لوجن الأدمن
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;