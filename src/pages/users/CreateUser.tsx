
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserForm from "@/components/users/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь будет вызов к API
      // await api.users.create(values);
      
      // Имитация создания пользователя
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Успешно",
        description: "Пользователь успешно создан",
      });
      
      navigate("/users");
    } catch (error) {
      toast({
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Не удалось создать пользователя",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/users")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Создание пользователя
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Данные пользователя</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
