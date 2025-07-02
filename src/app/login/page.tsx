'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Github, Youtube, Instagram } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.332,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.94-2.2-4.42-1.8-6.83.39-2.4 1.8-4.54 3.69-6.02.85-.67 1.78-1.25 2.76-1.74.04-1.57.02-3.14.01-4.71.13-1.09.43-2.16.92-3.12C8.86.93 10.63.15 12.525.02Z" />
    </svg>
);

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background p-4 sm:p-8">
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="w-full max-w-md text-center animate-fade-in">
          <Image
            src="https://placehold.co/200x200.png"
            alt="Ilustración de una impresora 3D"
            width={150}
            height={150}
            className="mx-auto mb-6"
            data-ai-hint="3d printer illustration"
            priority
          />
          <div className="mb-4">
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
              onClick={login}
              disabled={loading}
              className="w-full rounded-2xl shadow-md transition-all hover:shadow-lg"
              size="lg"
            >
              <GoogleIcon className="mr-3 h-6 w-6" />
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
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
        {year && <p>&copy; {year} Luprintech. Todos los derechos reservados.</p>}
      </footer>
    </main>
  );
}
