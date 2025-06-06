import { useState, useEffect } from "react");
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderFormValues, mockApi, api } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrderForm from "@/components/orders/OrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

import type { OrderFormValues } from "@/components/orders/OrderForm";

const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // В реальном приложении здесь будет вызов к API
        // const orderData = await api.orders.getById(Number(id));
        
        // Имитация загрузки данных заказа
a        await new Promise(resolve => setTimeout(resolve, 1000));
        const orders = mockApi.orders.getLatest();
        let orderData = orders.find(o => o.id === Number(id)) || null;
        
        if (!orderData) {
          toast({
            title: "Ошибка",
            description: "Заказ не найден",
            variant: "destructive",
          });
          navigate("/orders");
          return;
        }
        
        // Добавляем демо-данные для полей, которых нет в моках
        orderData = {
          ...orderData,
          shippingAddress: "ул. Примерная, д. 123, кв. 45, г. Москва",
          billingAddress: "ул. Примерная, д. 123, кв. 45, г. Москва",
          notes: "Доставка в рабочее время с 10:00 до 18:00",
          paymentMethod: "card",
          orderItems: [
            {
              id: 1,
              name: "Товар 1",
              quantity: 2,
              price: orderData.total * 0.4
            },
            {
              id: 2,
              name: "Товар 2",
              quantity: 1,
              price: orderData.total * 0.6
            }
          ]
        };
        
        setOrder(orderData);
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description: error instanceof Error ? error.message : "Не удалось загрузить данные заказа",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, navigate, toast]);

  const handleSubmit = async (values: OrderFormValues) => {
    setIsSaving(true);
    try {
      // В реальном приложении здесь будет вызов к API
      // await api.orders.update(Number(id), values);
      
      // Имитация обновления заказа
a      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Успешно",
        description: "Данные заказа успешно обновлены",
      });
      
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: error instanceof Error ? error.message : "Не удалось обновить данные заказа",
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
              onClick={() => navigate("/orders")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Редактирование заказа #{id}
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Данные заказа</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              order && <OrderForm order={order} onSubmit={handleSubmit} isLoading={isSaving} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditOrder;