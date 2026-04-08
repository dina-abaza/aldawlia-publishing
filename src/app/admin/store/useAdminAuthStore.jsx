import { create } from 'zustand';
import api from '@/app/api';

export const useAdminAuthStore = create((set) => {
    // Initial state check for localStorage
    const getInitialAdmin = () => {
        if (typeof window === 'undefined') return null;
        try {
            const userData = localStorage.getItem('adminUser');
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    };

    return {
        admin: getInitialAdmin(),
        loading: false,

        // تسجيل دخول الأدمن
        adminLogin: async (email, password) => {
            set({ loading: true });
            try {
                const res = await api.post('/auth/login', { email, password });
                const { token, user, role } = res.data.data;

                // Determine the admin data (prefer user object if exists, else role)
                const adminData = user || { role: role || 'admin' };

                if (adminData.role !== 'admin') {
                    set({ loading: false });
                    return { success: false, message: "صلاحيات غير كافية - هذا الحساب ليس أدمن" };
                }

                localStorage.setItem('jwtToken', token);
                localStorage.setItem('adminUser', JSON.stringify(adminData));
                set({ admin: adminData, loading: false });
                return { success: true };
            } catch (error) {
                set({ admin: null, loading: false });
                return { success: false, message: error.response?.data?.message || "فشل تسجيل الدخول" };
            }
        },
        forceAdminLogout: () => {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('adminUser');
            set({ admin: null, loading: false });
        },
        // تسجيل خروج الأدمن
        adminLogout: async () => {
            try {
                await api.post('/auth/logout');
            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('adminUser');
                set({ admin: null });
                window.location.href = '/admin/login';
            }
        }
    };
});
