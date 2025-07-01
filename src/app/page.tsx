"use client";

import { CalculatorForm, formSchema, type FormData } from "@/components/calculator-form";
import { SavedProjectsDialog } from "@/components/saved-projects-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderOpen } from "lucide-react";

export default function Home() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({}),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
           <div className="flex w-full items-center justify-center relative">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
                Calculadora de Luprintech
              </h1>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:block">
                <SavedProjectsDialog form={form}>
                   <Button variant="outline">
                       <FolderOpen className="mr-2 h-4 w-4" /> Cargar Proyecto
                   </Button>
                </SavedProjectsDialog>
              </div>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Tu asistente amigable para calcular los costes de impresión 3D con precisión. Sube tu G-code para un análisis instantáneo.
          </p>
          <div className="sm:hidden">
            <SavedProjectsDialog form={form}>
               <Button variant="outline">
                   <FolderOpen className="mr-2 h-4 w-4" /> Cargar Proyecto
               </Button>
            </SavedProjectsDialog>
          </div>
        </header>
        <CalculatorForm form={form} />
      </div>
    </main>
  );
}
