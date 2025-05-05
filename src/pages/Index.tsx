
import { Users, ShoppingCart, DollarSign, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { mockApi, DashboardStats, User, Order } from "@/lib/api";
import { formatCurrency, formatDate, getOrderStatusStyles } from "@/lib/helpers";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Имитация загрузки данных с API
    const fetchData = async () => {
      try {
        // В реальном приложении здесь будут вызовы к API
        // const stats = await api.dashboard.getStats();
        // const users = await api.users.getAll(1, 5);
        // const orders = await api.orders.getAll(1, 5);
        
        // Используем мок-данные для демонстрации
        setTimeout(() => {
          setStats(mockApi.dashboard.getStats());
          setLatestUsers(mockApi.users.getLatest());
          setLatestOrders(mockApi.orders.getLatest());
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Панель администратора</h1>
          <Button>Добавить задачу</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard 
                title="Новые пользователи" 
                value={stats?.newUsers || 0} 
                icon={<Users className="h-4 w-4" />} 
                trend={stats?.usersTrend}
              />
              <StatCard 
                title="Новые заказы" 
                value={stats?.newOrders || 0} 
                icon={<ShoppingCart className="h-4 w-4" />} 
                trend={stats?.ordersTrend}
              />
              <StatCard 
                title="Продажи" 
                value={formatCurrency(stats?.sales || 0)} 
                icon={<DollarSign className="h-4 w-4" />} 
                trend={stats?.salesTrend}
              />
              <StatCard 
                title="Активные сессии" 
                value={stats?.activeSessions || 0} 
                icon={<Activity className="h-4 w-4" />} 
                trend={stats?.sessionsTrend}
              />
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Последние пользователи</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {latestUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4">
                      <Avatar>
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                        ) : (
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {latestOrders.map((order) => {
                    const statusStyle = getOrderStatusStyles(order.status);
                    return (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Заказ #{order.id}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
