
import {
  Home,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const DashboardSidebar = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <div className="p-4">
          <h2 className="text-xl font-bold text-sidebar-foreground">CRM Система</h2>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Главная">
              <Link to="/">
                <Home />
                <span>Главная</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Пользователи">
              <Link to="/users">
                <Users />
                <span>Пользователи</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Заказы">
              <Link to="/orders">
                <ShoppingCart />
                <span>Заказы</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Сообщения">
              <Link to="/messages">
                <MessageSquare />
                <span>Сообщения</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Аналитика">
              <Link to="/analytics">
                <BarChart3 />
                <span>Аналитика</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Настройки">
              <Link to="/settings">
                <Settings />
                <span>Настройки</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
