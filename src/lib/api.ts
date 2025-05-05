
import { toast } from "@/hooks/use-toast";

// API базовый URL для всех запросов
const API_BASE_URL = 'https://api.example.com';

// Интерфейсы для типов данных
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: number;
  createdAt: string;
}

export interface DashboardStats {
  newUsers: number;
  newOrders: number;
  sales: number;
  activeSessions: number;
  usersTrend: { value: number; isPositive: boolean };
  ordersTrend: { value: number; isPositive: boolean };
  salesTrend: { value: number; isPositive: boolean };
  sessionsTrend: { value: number; isPositive: boolean };
}

// Опции для fetchApi
interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

// Базовая функция для выполнения запросов к API
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Формирование URL с параметрами
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });
    
    // Проверка на 401 (неавторизованный доступ)
    if (response.status === 401) {
      // Перенаправление на страницу входа
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Необходима авторизация');
    }
    
    // Проверка статуса ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Произошла ошибка при запросе к API');
    }
    
    return await response.json();
  } catch (error) {
    // Уведомление пользователя об ошибке
    toast({
      title: "Ошибка",
      description: error instanceof Error ? error.message : "Ошибка соединения с сервером",
      variant: "destructive",
    });
    
    throw error;
  }
}

// API функции для получения данных
export const api = {
  // Аутентификация
  auth: {
    login: async (email: string, password: string) => {
      return fetchApi<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    register: async (userData: Omit<User, 'id' | 'createdAt'>) => {
      return fetchApi<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    me: async () => {
      return fetchApi<User>('/auth/me');
    },
  },
  
  // Пользователи
  users: {
    getAll: async (page = 1, limit = 10) => {
      return fetchApi<{ data: User[]; total: number }>('/users', {
        params: { page: page.toString(), limit: limit.toString() },
      });
    },
    getById: async (id: number) => {
      return fetchApi<User>(`/users/${id}`);
    },
    create: async (userData: Omit<User, 'id' | 'createdAt'>) => {
      return fetchApi<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    update: async (id: number, userData: Partial<User>) => {
      return fetchApi<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },
    delete: async (id: number) => {
      return fetchApi<{ success: boolean }>(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Заказы
  orders: {
    getAll: async (page = 1, limit = 10) => {
      return fetchApi<{ data: Order[]; total: number }>('/orders', {
        params: { page: page.toString(), limit: limit.toString() },
      });
    },
    getById: async (id: number) => {
      return fetchApi<Order>(`/orders/${id}`);
    },
    create: async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
      return fetchApi<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    update: async (id: number, orderData: Partial<Order>) => {
      return fetchApi<Order>(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
      });
    },
    delete: async (id: number) => {
      return fetchApi<{ success: boolean }>(`/orders/${id}`, {
        method: 'DELETE',
      });
    },
    updateStatus: async (id: number, status: Order['status']) => {
      return fetchApi<Order>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },
  
  // Статистика для дашборда
  dashboard: {
    getStats: async () => {
      return fetchApi<DashboardStats>('/dashboard/stats');
    },
  },
};

// Мок-данные для разработки (будут использоваться, пока API не готов)
export const mockApi = {
  users: {
    getLatest: (): User[] => [
      { id: 1, name: 'Анна Иванова', email: 'anna@example.com', role: 'admin', createdAt: '2025-05-01' },
      { id: 2, name: 'Иван Петров', email: 'ivan@example.com', role: 'manager', createdAt: '2025-05-02' },
      { id: 3, name: 'Мария Сидорова', email: 'maria@example.com', role: 'user', createdAt: '2025-05-03' },
      { id: 4, name: 'Алексей Смирнов', email: 'alexey@example.com', role: 'user', createdAt: '2025-05-04' },
      { id: 5, name: 'Ольга Козлова', email: 'olga@example.com', role: 'manager', createdAt: '2025-05-05' },
    ],
  },
  
  orders: {
    getLatest: (): Order[] => [
      { id: 1001, customerId: 3, customerName: 'Мария Сидорова', total: 15600, status: 'completed', items: 3, createdAt: '2025-05-05' },
      { id: 1002, customerId: 4, customerName: 'Алексей Смирнов', total: 8750, status: 'processing', items: 2, createdAt: '2025-05-05' },
      { id: 1003, customerId: 5, customerName: 'Ольга Козлова', total: 23900, status: 'completed', items: 5, createdAt: '2025-05-04' },
      { id: 1004, customerId: 2, customerName: 'Иван Петров', total: 4500, status: 'processing', items: 1, createdAt: '2025-05-04' },
      { id: 1005, customerId: 3, customerName: 'Мария Сидорова', total: 12800, status: 'pending', items: 2, createdAt: '2025-05-03' },
    ],
  },
  
  dashboard: {
    getStats: (): DashboardStats => ({
      newUsers: 234,
      newOrders: 156,
      sales: 1320500,
      activeSessions: 4325,
      usersTrend: { value: 12, isPositive: true },
      ordersTrend: { value: 8, isPositive: true },
      salesTrend: { value: 5, isPositive: true },
      sessionsTrend: { value: 2, isPositive: false },
    }),
  },
};
