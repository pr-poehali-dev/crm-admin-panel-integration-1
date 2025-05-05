import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockApi, Order } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  ArrowUp, 
  ArrowDown,
  Trash,
  Edit
} from "lucide-react";
import { formatCurrency, formatDate, getOrderStatusStyles } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  useEffect(() => {
    // Имитация загрузки данных с API
    const fetchOrders = async () => {
      try {
        // В реальном приложении здесь будет вызов к API
        // const response = await api.orders.getAll();
        // setOrders(response.data);
        
        // Используем мок-данные для демонстрации
        setTimeout(() => {
          // Создаем больше заказов для демонстрации сортировки и фильтрации
          const mockOrders = Array(15).fill(0).map((_, i) => {
            const baseOrder = mockApi.orders.getLatest()[i % 5];
            return {
              ...baseOrder,
              id: 1000 + i,
              total: Math.round(Math.random() * 50000) + 1000,
              status: ['pending', 'processing', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as Order['status'],
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              paymentMethod: ['cash', 'card', 'bank_transfer'][Math.floor(Math.random() * 3)] as 'cash' | 'card' | 'bank_transfer'
            };
          });
          
          setOrders(mockOrders);
          setFilteredOrders(mockOrders);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading orders:", error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Фильтрация и сортировка заказов
  useEffect(() => {
    let result = [...orders];
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        order => 
          order.customerName.toLowerCase().includes(query) || 
          order.id.toString().includes(query)
      );
    }
    
    // Фильтрация по статусу
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Сортировка
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "customerName":
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredOrders(result);
  }, [orders, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Если уже сортируем по этому полю, меняем направление сортировки
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Если сортируем по новому полю, устанавливаем его и направление по умолчанию
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete === null) return;
    
    try {
      // Здесь будет логика удаления заказа
      // await api.orders.delete(orderToDelete);
      
      // Имитация удаления
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // После успешного удаления обновляем список заказов
      setOrders(orders.filter(order => order.id !== orderToDelete));
      
      toast({
        title: "Заказ удален",
        description: `Заказ #${orderToDelete} был успешно удален из системы`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заказ",
        variant: "destructive",
      });
    } finally {
      setOrderToDelete(null);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Управление заказами</h1>
          <Link to="/orders/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить заказ
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Список заказов</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Поиск заказов..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Фильтры</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Статус</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                        Все статусы
                        {statusFilter === null && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                        Ожидает
                        {statusFilter === "pending" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("processing")}>
                        В обработке
                        {statusFilter === "processing" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                        Завершен
                        {statusFilter === "completed" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                        Отменен
                        {statusFilter === "cancelled" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Сортировка по дате</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setSortField("date"); setSortDirection("desc"); }}>
                      Сначала новые
                      {sortField === "date" && sortDirection === "desc" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortField("date"); setSortDirection("asc"); }}>
                      Сначала старые
                      {sortField === "date" && sortDirection === "asc" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      № заказа
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("customerName")}>
                    <div className="flex items-center">
                      Клиент
                      {getSortIcon("customerName")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                    <div className="flex items-center">
                      Сумма
                      {getSortIcon("total")}
                    </div>
                  </TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Дата
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Не найдено заказов, соответствующих критериям поиска
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const statusStyle = getOrderStatusStyles(order.status);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}> 
                            {statusStyle.label}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/orders/edit/${order.id}`}> 
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog open={orderToDelete === order.id} onOpenChange={(open) => !open && setOrderToDelete(null)}>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setOrderToDelete(order.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удаление заказа</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить заказ #{order.id}?
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteOrder}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;