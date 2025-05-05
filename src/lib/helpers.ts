
/**
 * Форматирует число как денежную сумму в рублях
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирует дату в удобочитаемый формат
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Возвращает стили статуса заказа
 */
export function getOrderStatusStyles(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'completed':
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Завершен' };
    case 'processing':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'В обработке' };
    case 'pending':
      return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Ожидает' };
    case 'cancelled':
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Отменен' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  }
}
