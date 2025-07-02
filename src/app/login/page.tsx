'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Github, Youtube, Instagram, Loader2 } from 'lucide-react';
import { GoogleIcon, TikTokIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // If auth is done and we have a user, go to the main page.
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);
  
  const handleLogin = async () => {
    setIsLoggingIn(true);
    await login();
    // No need to set isLoggingIn back to false, as the component will unmount/redirect.
  };

  // While checking auth, show a spinner.
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is logged in, it means we are about to redirect. Show a spinner.
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  // If auth is done and there's no user, show the login page.
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background p-4 sm:p-8">
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="mb-4 mt-8">
            <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary sm:text-6xl">
              Calculadora 3D
            </h1>
            <p className="font-headline text-2xl text-muted-foreground">
              by Luprintech
            </p>
          </div>
          <p className="mx-auto mt-4 max-w-sm text-lg text-muted-foreground">
            Calcula al instante el precio de tus impresiones 3D con precisión.
          </p>
          <div className="mt-8">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full rounded-2xl shadow-md transition-all hover:shadow-lg"
              size="lg"
            >
              <GoogleIcon className="mr-3 h-6 w-6" />
              {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
            </Button>
          </div>
        </div>
      </div>
      <footer className="w-full py-6 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
            <a href="https://github.com/GuadalupeCanoM" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Guadalupe Cano" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
            <a href="https://www.youtube.com/@Luprintech" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube de Luprintech" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></a>
            <a href="https://www.instagram.com/luprintech/" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram de Luprintech" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="https://www.tiktok.com/@luprintech" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok de Luprintech" className="text-muted-foreground hover:text-primary transition-colors"><TikTokIcon className="h-5 w-5" /></a>
        </div>
        <p className="mb-2">¿Tienes dudas? Escríbeme a <a href="mailto:info@luprintech.com" className="text-primary hover:underline">info@luprintech.com</a></p>
        <p>&copy; {currentYear} Luprintech. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
