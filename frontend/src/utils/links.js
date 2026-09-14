import { siteContent } from '../data/siteContent';

export const getWhatsAppUrl = (message = siteContent.whatsappDefaultMessage) =>
  `https://wa.me/${siteContent.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const scrollToSection = (sectionId) => {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};