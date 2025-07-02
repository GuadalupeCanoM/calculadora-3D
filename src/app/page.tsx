"use client";

import { CalculatorForm } from "@/components/calculator-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Youtube, Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons";
import { formSchema, type FormData } from "@/lib/schema";
import { defaultFormValues } from "@/lib/defaults";
import Image from 'next/image';

export default function HomePage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center gap-4 text-center print:hidden">
          <Image
            src="/Logo.svg"
            alt="Logo de Luprintech"
            width={150}
            height={150}
            className="mx-auto mb-2 rounded-full shadow-lg border border-gray-200"
            priority
          />
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
              Calculadora de Luprintech
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Tu asistente amigable para calcular los costes de impresión 3D con precisión. Sube tu G-code para un análisis instantáneo.
            </p>
          </div>
        </header>

        <CalculatorForm form={form} />
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
        <p>&copy; 2025 Luprintech. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
