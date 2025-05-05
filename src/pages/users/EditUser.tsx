
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, mockApi, api } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserForm from "@/components/users/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // В реальном приложении здесь будет вызов к API
        // const userData = await api.users.getById(Number(id));
        
        // Имитация загрузки данных пользователя
        await new Promise(resolve => setTimeout(resolve, 1000));
        const users = mockApi.users.getLatest();
        const userData = users.find(u => u.id === Number(id)) || null;
        
        if (!userData) {
          toast({
            title: "Ошибка",
            description: "Пользователь не найден",
            variant: "destructive",
          });
          navigate("/users");
          return;
        }
        
        setUser(userData);
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description: error instanceof Error ? error.message : "Не удалось загрузить данные пользователя",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, toast]);

  const handleSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      // В реальном приложении здесь будет вызов к API
      // await api.users.update(Number(id), values);
      
      // Имитация обновления пользователя
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Успешно",
        description: "Данные пользователя успешно обновлены",
      });
      
      navigate("/users");
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: error instanceof Error ? error.message : "Не удалось обновить данные пользователя",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
              Редактирование пользователя
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Данные пользователя</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              user && <UserForm user={user} onSubmit={handleSubmit} isLoading={isSaving} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;
