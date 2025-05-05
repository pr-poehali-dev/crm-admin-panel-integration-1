
import { Users, ShoppingCart, DollarSign, Activity } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Панель администратора</h1>
          <Button>Добавить задачу</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Новые пользователи" 
            value="234" 
            icon={<Users className="h-4 w-4" />} 
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard 
            title="Новые заказы" 
            value="156" 
            icon={<ShoppingCart className="h-4 w-4" />} 
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard 
            title="Продажи" 
            value="₽1,320,500" 
            icon={<DollarSign className="h-4 w-4" />} 
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard 
            title="Активные сессии" 
            value="4,325" 
            icon={<Activity className="h-4 w-4" />} 
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Последние пользователи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium">Пользователь #{i}</p>
                      <p className="text-sm text-gray-500">user{i}@example.com</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Заказ #{1000 + i}</p>
                      <p className="text-sm text-gray-500">5 мая 2025</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${i % 2 === 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {i % 2 === 0 ? "Завершен" : "В обработке"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
