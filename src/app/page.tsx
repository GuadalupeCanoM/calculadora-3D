"use client";

import { CalculatorForm } from "@/components/calculator-form";
import { SavedProjectsDialog } from "@/components/saved-projects-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderOpen, Github, Youtube, Instagram, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TikTokIcon } from "@/components/icons";
import { formSchema, type FormData } from "@/lib/schema";
import { defaultFormValues } from "@/lib/defaults";

function HomePageContent() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
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
            <TikTokIcon className="h-5 w-5" />
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
