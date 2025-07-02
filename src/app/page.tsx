"use client";

import { CalculatorForm, formSchema, type FormData } from "@/components/calculator-form";
import { SavedProjectsDialog } from "@/components/saved-projects-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderOpen, Github, Youtube, Instagram, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function HomePageContent() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({}),
  });
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center gap-4 text-center print:hidden sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
              Calculadora de Luprintech
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Tu asistente amigable para calcular los costes de impresión 3D con precisión. Sube tu G-code para un análisis instantáneo.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                 <Avatar>
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                  <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button onClick={logout} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" /> Salir
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="flex justify-center mb-8 print:hidden">
            <SavedProjectsDialog form={form}>
               <Button variant="outline">
                   <FolderOpen className="mr-2 h-4 w-4" /> Proyectos Guardados
               </Button>
            </SavedProjectsDialog>
        </div>

        <CalculatorForm form={form} />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground print:hidden">
        <p>Powered by Guadalupe Cano.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://github.com/GuadalupeCanoM" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Guadalupe Cano" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://www.youtube.com/@Luprintech" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube de Luprintech" className="text-muted-foreground hover:text-primary transition-colors">
            <Youtube className="h-5 w-5" />
          </a>
          <a href="https://www.instagram.com/luprintech/" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram de Luprintech" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="https://www.tiktok.com/@luprintech" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok de Luprintech" className="text-muted-foreground hover:text-primary transition-colors">
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
            >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.94-2.2-4.42-1.8-6.83.39-2.4 1.8-4.54 3.69-6.02.85-.67 1.78-1.25 2.76-1.74.04-1.57.02-3.14.01-4.71.13-1.09.43-2.16.92-3.12C8.86.93 10.63.15 12.525.02Z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
