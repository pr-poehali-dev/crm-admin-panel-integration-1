
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order } from "@/lib/api";
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
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Имя клиента должно содержать не менее 2 символов"),
  customerId: z.coerce.number().int().positive("ID клиента должен быть положительным числом"),
  total: z.coerce.number().positive("Сумма должна быть положительным числом"),
  status: z.enum(["pending", "processing", "completed", "cancelled"], {
    required_error: "Выберите статус заказа",
  }),
  items: z.coerce.number().int().positive("Количество товаров должно быть положительным числом"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  order?: Order;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isLoading: boolean;
}

const OrderForm = ({ order, onSubmit, isLoading }: OrderFormProps) => {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerId: 0,
      total: 0,
      status: "pending",
      items: 0,
    },
  });

  // Если передан заказ, заполняем форму его данными
  useEffect(() => {
    if (order) {
      form.reset({
        customerName: order.customerName,
        customerId: order.customerId,
        total: order.total,
        status: order.status,
        items: order.items,
      });
    }
  }, [order, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormLabel>ID клиента</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сумма</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
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
          name="items"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Количество товаров</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            order ? "Обновить заказ" : "Создать заказ"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;
