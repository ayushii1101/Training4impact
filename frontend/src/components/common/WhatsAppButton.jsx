import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/links';

export default function WhatsAppButton({ message, label = 'Chat on WhatsApp', variant = 'cyan', className = '', size = 'md' }) {
  const href = getWhatsAppUrl(message);
  const sizeClasses =
    size === 'sm'
      ? 'px-4 py-2 text-xs'
      : size === 'lg'
        ? 'px-6 py-3.5 text-sm'
        : 'px-5 py-3 text-sm';

  const variantClasses = {
    cyan: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border border-green-600 text-green-700 bg-white hover:bg-green-50',
    dark: 'bg-navy-900 text-white hover:bg-navy-800',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      <MessageCircle aria-hidden="true" className="h-4 w-4" />
      {label}
    </a>
  );
}