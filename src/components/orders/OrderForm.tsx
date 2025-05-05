
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order, mockApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/helpers";
import { Loader2, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const orderItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Название товара обязательно"),
  quantity: z.coerce.number().positive("Количество должно быть положительным"),
  price: z.coerce.number().positive("Цена должна быть положительной"),
});

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Имя клиента должно содержать не менее 2 символов"),
  customerId: z.coerce.number().int().positive("ID клиента должен быть положительным числом"),
  total: z.coerce.number().positive("Сумма должна быть положительным числом"),
  status: z.enum(["pending", "processing", "completed", "cancelled"], {
    required_error: "Выберите статус заказа",
  }),
  items: z.array(orderItemSchema).min(1, "Добавьте хотя бы один товар"),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "bank_transfer"], {
    required_error: "Выберите метод оплаты",
  }).default("card"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
type OrderItem = z.infer<typeof orderItemSchema>;

interface OrderFormProps {
  order?: Order;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isLoading: boolean;
}

const OrderForm = ({ order, onSubmit, isLoading }: OrderFormProps) => {
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerId: 0,
      total: 0,
      status: "pending",
      items: [{ name: "", quantity: 1, price: 0 }],
      shippingAddress: "",
      billingAddress: "",
      notes: "",
      paymentMethod: "card",
    },
  });

  const { fields, append, remove } = form.control._formValues.items || [];
  
  // Расчет итоговой суммы заказа
  const calculateTotal = () => {
    const items = form.getValues().items || [];
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  // Обновление итоговой суммы
  const updateTotal = () => {
    const total = calculateTotal();
    form.setValue("total", total);
  };

  // Загрузка списка клиентов
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // В реальном приложении здесь будет вызов к API
        // const response = await api.customers.getAll();
        // setCustomers(response.data);
        
        // Имитируем загрузку данных
        setCustomers([
          { id: 1, name: "Анна Иванова" },
          { id: 2, name: "Иван Петров" },
          { id: 3, name: "Мария Сидорова" },
          { id: 4, name: "Алексей Смирнов" },
          { id: 5, name: "Ольга Козлова" },
        ]);
      } catch (error) {
        console.error("Error loading customers:", error);
      }
    };
    
    fetchCustomers();
  }, []);

  // Если передан заказ, заполняем форму его данными
  useEffect(() => {
    if (order) {
      // Преобразуем существующие items из числа в массив элементов
      const orderItems = Array.isArray(order.orderItems) 
        ? order.orderItems 
        : Array(order.items || 1).fill(0).map((_, i) => ({
            id: i + 1,
            name: `Товар ${i + 1}`,
            quantity: 1,
            price: order.total / (order.items || 1)
          }));
      
      form.reset({
        customerName: order.customerName,
        customerId: order.customerId,
        total: order.total,
        status: order.status,
        items: orderItems,
        shippingAddress: order.shippingAddress || "",
        billingAddress: order.billingAddress || "",
        notes: order.notes || "",
        paymentMethod: order.paymentMethod || "card",
      });
    }
  }, [order, form]);

  // Обработчик изменения полей товаров
  const handleItemChange = () => {
    updateTotal();
  };

  // Добавление нового товара
  const addItem = () => {
    append({ name: "", quantity: 1, price: 0 });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя клиента</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Петров" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Клиент</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                      // Устанавливаем имя клиента при выборе из списка
                      const selectedCustomer = customers.find(c => c.id === parseInt(value));
                      if (selectedCustomer) {
                        form.setValue("customerName", selectedCustomer.name);
                      }
                    }}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите клиента" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="processing">В обработке</SelectItem>
                      <SelectItem value="completed">Завершен</SelectItem>
                      <SelectItem value="cancelled">Отменен</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Метод оплаты</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите метод оплаты" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Наличные</SelectItem>
                      <SelectItem value="card">Карта</SelectItem>
                      <SelectItem value="bank_transfer">Банковский перевод</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес доставки</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Введите адрес доставки" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес для выставления счета</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Введите адрес для выставления счета" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Товары</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.getValues().items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Товар</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Название товара"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleItemChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Кол-во</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="1"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value) || 1);
                                handleItemChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Цена</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                                handleItemChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2 flex items-center justify-end">
                      {index > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            remove(index);
                            handleItemChange();
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      ) : <div className="w-9 h-9"></div>}
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить товар
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>Итого:</div>
                <div className="font-medium text-xl">
                  {formatCurrency(form.watch("total"))}
                </div>
              </CardFooter>
            </Card>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечания к заказу</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация о заказе"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-end gap-4">
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              order ? "Обновить заказ" : "Создать заказ"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderForm;
