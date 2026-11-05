'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  FolderKanban,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  Loader2,
} from 'lucide-react';

interface AdminShellProps {
  authenticated: boolean;
  children: React.ReactNode;
}

export function AdminShell({ authenticated, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Contraseña incorrecta.');
      } else {
        router.refresh();
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-obsidian text-alabaster flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-arch-grid-dark bg-grid-64 opacity-35 pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-[#F6F5F1] text-obsidian border border-white/20 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <img
              src="/brand/logo-black.png"
              alt="RADECO Logo"
              className="h-24 w-auto mx-auto object-contain"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.22em]">
              <Lock className="w-3 h-3 text-copper" />
              <span>Acceso Privado · Administración RADECO</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-obsidian">
              Panel de Gestión de Obras
            </h1>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/70 mb-2"
              >
                Contraseña de Administrador
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduzca su clave de acceso..."
                className="w-full px-4 py-3.5 bg-white border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Iniciar sesión segura</span>
            </button>
          </form>

          <div className="pt-4 border-t border-obsidian/10 space-y-2 text-center">
            <p className="font-mono text-[11px] text-obsidian/55">
              Clave inicial configurada: <code className="font-bold text-obsidian">Radeco2026!</code>
            </p>
            <Link
              href="/"
              className="inline-block font-mono text-[11px] uppercase tracking-wider text-copper hover:underline"
            >
              ← Volver al sitio web público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-obsidian flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-obsidian text-alabaster border-b border-white/10 py-3.5 px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-alabaster p-1 flex items-center justify-center">
                <img
                  src="/brand/emblem-black.png"
                  alt="RADECO"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold tracking-[0.2em] text-sm text-white block leading-none">
                  RADECO ADMIN
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-copper">
                  Gestión de Obras y Presupuestos
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/15">
              <Link
                href="/admin"
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors ${
                  pathname === '/admin'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Resumen</span>
              </Link>
              <Link
                href="/admin/obras"
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors ${
                  pathname === '/admin/obras'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Obras</span>
              </Link>
              <Link
                href="/admin/obras/nueva"
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ${
                  pathname === '/admin/obras/nueva'
                    ? 'bg-copper text-white font-semibold'
                    : 'text-copper hover:bg-white/5'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Obra</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-white/20 text-xs font-mono uppercase tracking-wider text-alabaster hover:bg-white/10"
            >
              <span>Web Pública</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-wider text-alabaster"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-10">
        {children}
      </div>
    </div>
  );
}

