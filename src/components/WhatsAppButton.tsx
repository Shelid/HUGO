'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppButton({
  phoneNumber = '34600000000',
  defaultMessage = 'Hola, me gustaría solicitar un presupuesto para una obra.',
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const cleanNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    phoneNumber ||
    '34600000000'
  ).replace(/[^\d]/g, '');

  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp para solicitar presupuesto"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-obsidian text-alabaster border border-white/15 px-4 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-copper transition-all duration-300"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <MessageCircle className="w-4 h-4 text-alabaster group-hover:text-copper transition-colors" />
      <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em]">
        WhatsApp Directo
      </span>
    </a>
  );
}

