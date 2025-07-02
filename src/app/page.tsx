"use client";

import React, { useState } from 'react';
import { CalculatorForm } from "@/components/calculator-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Youtube, Instagram, LogOut, Save, FolderOpen, Loader2, FilePlus } from "lucide-react";
import { TikTokIcon } from "@/components/icons";
import { formSchema, type FormData } from "@/lib/schema";
import { defaultFormValues } from "@/lib/defaults";
import Image from 'next/image';
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { saveProject } from '@/app/actions';
import { SavedProjectsDialog } from '@/components/saved-projects-dialog';

function HomePageContent() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });
  const { user, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const handleSaveProject = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Debes iniciar sesión para guardar." });
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Faltan campos obligatorios",
        description: "Por favor, completa todos los campos marcados con *.",
      });
      return;
    }

    setIsSaving(true);
    const formData = form.getValues();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dataToSave } = formData;
    
    // CRITICAL FIX: Ensure the data is a plain JSON object before sending to the server action.
    // This prevents non-serializable data from react-hook-form from causing issues.
    const cleanData = JSON.parse(JSON.stringify(dataToSave));

    try {
      const result = await saveProject(user.uid, cleanData);

      if (result.error) {
        toast({ variant: "destructive", title: "Error al guardar", description: result.error });
      } else {
        toast({ title: "¡Proyecto guardado con éxito!" });
        // After saving, reset to a new project form
        form.reset(defaultFormValues);
      }
    } catch (err) {
      console.error("Unexpected error saving project:", err);
      toast({ variant: "destructive", title: "Ha ocurrido un error inesperado." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewProject = () => {
    form.reset(defaultFormValues);
    toast({ title: "Nuevo proyecto", description: "El formulario ha sido limpiado." });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center gap-4 text-center print:hidden sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo.svg"
              alt="Logo de Luprintech"
              width={80}
              height={80}
              className="rounded-full shadow-lg border border-gray-200"
              priority
            />
            <div className="text-left">
              <h1 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl">
                Calculadora 3D
              </h1>
               <p className="text-sm text-muted-foreground">
                Bienvenido, {user?.displayName || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SavedProjectsDialog form={form}>
              <Button variant="outline" size="sm"><FolderOpen className="mr-2 h-4 w-4"/> Proyectos</Button>
            </SavedProjectsDialog>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
            </Button>
            {user?.photoURL && (
              <Avatar>
                <AvatarImage src={user.photoURL} alt={user.displayName || 'Avatar de usuario'} />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>

        <CalculatorForm form={form} />

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end w-full print:hidden">
            <Button onClick={handleNewProject} variant="outline" size="default" className="w-full sm:w-auto">
                <FilePlus className="mr-2 h-4 w-4" /> Nuevo Proyecto
            </Button>
            <Button onClick={handleSaveProject} disabled={isSaving} size="default" className="w-full sm:w-auto">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Guardando...' : 'Guardar Proyecto'}
            </Button>
        </div>
      </div>
      
      <footer className="w-full py-6 text-center text-sm text-muted-foreground print:hidden mt-12">
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://github.com/GuadalupeCanoM"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Guadalupe Cano"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.youtube.com/@Luprintech"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Canal de YouTube de Luprintech"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Youtube className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/luprintech/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil de Instagram de Luprintech"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.tiktok.com/@luprintech"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil de TikTok de Luprintech"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>

        <p className="mb-2">
          ¿Tienes dudas? Escríbeme a{' '}
          <a
            href="mailto:info@luprintech.com"
            className="text-primary hover:underline"
          >
            info@luprintech.com
          </a>
        </p>
        <p>&copy; {currentYear} Guadalupe Cano. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
