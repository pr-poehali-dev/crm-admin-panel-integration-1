
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Проверяем аутентификацию
    const checkAuth = async () => {
      try {
        // В реальном приложении здесь будет вызов к API для проверки токена
        // const user = await api.auth.me();

        // Имитация проверки токена
        const token = localStorage.getItem('token');
        
        // Проверяем наличие токена в localStorage
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Если токен недействителен или истек срок действия
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Показываем загрузку, пока проверяем аутентификацию
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Если не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если аутентифицирован, показываем защищенное содержимое
  return <>{children}</>;
};

export default AuthGuard;
