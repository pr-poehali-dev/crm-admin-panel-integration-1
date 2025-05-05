import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockApi, User } from "@/lib/api";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, Trash, Search, Filter } from "lucide-react";
import { formatDate } from "@/lib/helpers";
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

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    // Имитация загрузки данных с API
    const fetchUsers = async () => {
      try {
        // В реальном приложении здесь будет вызов к API
        // const response = await api.users.getAll();
        // setUsers(response.data);
        
        // Используем мок-данные для демонстрации
        setTimeout(() => {
          const mockUsers = mockApi.users.getLatest();
          // Добавляем дополнительные поля для демонстрации
          const usersWithExtendedFields = mockUsers.map(user => ({
            ...user,
            isActive: Math.random() > 0.2, // 20% неактивных пользователей
            department: ['sales', 'marketing', 'support', 'development', 'hr'][Math.floor(Math.random() * 5)],
          }));
          
          setUsers(usersWithExtendedFields);
          setFilteredUsers(usersWithExtendedFields);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Фильтрация пользователей
  useEffect(() => {
    let result = users;
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по роли
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);

  const handleDelete = async (userId: number) => {
    try {
      // Здесь будет логика удаления пользователя
      // await api.users.delete(userId);
      
      // Имитация удаления
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // После успешного удаления обновляем список пользователей
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Пользователь удален",
        description: "Пользователь был успешно удален из системы",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      });
    }
  };

  const getDepartmentBadge = (department?: string) => {
    if (!department) return null;
    
    const colors: Record<string, string> = {
      sales: "bg-green-100 text-green-800",
      marketing: "bg-purple-100 text-purple-800",
      support: "bg-blue-100 text-blue-800",
      development: "bg-yellow-100 text-yellow-800",
      hr: "bg-pink-100 text-pink-800",
    };
    
    const labels: Record<string, string> = {
      sales: "Продажи",
      marketing: "Маркетинг",
      support: "Поддержка",
      development: "Разработка",
      hr: "HR",
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[department] || "bg-gray-100 text-gray-800"}`}> 
        {labels[department] || department} 
      </span> 
    );
  };

  return (
    
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Управление пользователями</h1>
          <Link to="/users/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> 
              Добавить пользователя 
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Список пользователей</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Поиск пользователей..." 
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
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Роль</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                        Все роли 
                        {roleFilter === null && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                        Администратор 
                        {roleFilter === "admin" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("manager")}>
                        Менеджер 
                        {roleFilter === "manager" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("user")}>
                        Пользователь 
                        {roleFilter === "user" && <Badge className="ml-auto" variant="outline">✓</Badge>}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Отдел</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Не найдено пользователей, соответствующих критериям поиска 
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {user.avatarUrl ? (
                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                            ) : (
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'manager' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}> 
                          {user.role} 
                        </span>
                      </TableCell>
                      <TableCell>
                        {getDepartmentBadge(user.department)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}> 
                          {user.isActive ? "Активен" : "Неактивен"} 
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/users/edit/${user.id}`}> 
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;