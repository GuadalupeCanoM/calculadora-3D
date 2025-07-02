"use client";

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Youtube, Instagram } from 'lucide-react';
import { TikTokIcon } from './icons';

interface PrintSummaryProps {
  form: UseFormReturn<any>;
  calculations: {
    filamentCost: number;
    electricityCost: number;
    laborCost: number;
    currentMachineCost: number;
    otherCostsTotal: number;
    subTotal: number;
    profitAmount: number;
    priceBeforeVat: number;
    vatAmount: number;
    finalPrice: number;
  };
}

export const PrintSummary = ({ form, calculations }: PrintSummaryProps) => {
    const values = form.getValues();

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: values.currency || 'EUR',
      }).format(amount);
    };
    
    const [generatedDate, setGeneratedDate] = React.useState('');
    React.useEffect(() => {
        setGeneratedDate(new Date().toLocaleDateString('es-ES'));
    }, []);

    return (
      <div className="p-8 font-body text-black bg-white">
        <header className="flex items-center justify-between mb-8 border-b pb-4">
            <h1 className="font-headline text-3xl font-bold text-primary">Calculadora de Luprintech</h1>
            <Image src="/Logo.svg" alt="Logo de Luprintech" width={80} height={80} className="rounded-full" />
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trabajo: {values.jobName || 'N/A'}</CardTitle>
            <CardDescription>Generado el {generatedDate}</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader><CardTitle>Desglose de Costes</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="flex justify-between"><span>Coste de Filamento</span> <strong>{formatCurrency(calculations.filamentCost)}</strong></div>
              <div className="flex justify-between"><span>Coste de Electricidad</span> <strong>{formatCurrency(calculations.electricityCost)}</strong></div>
              <div className="flex justify-between"><span>Coste de Mano de Obra</span> <strong>{formatCurrency(calculations.laborCost)}</strong></div>
              {values.includeMachineCosts && <div className="flex justify-between"><span>Coste de Máquina y Mantenimiento</span> <strong>{formatCurrency(calculations.currentMachineCost)}</strong></div>}
              <div className="flex justify-between"><span>Otros Costes</span> <strong>{formatCurrency(calculations.otherCostsTotal)}</strong></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Sub-total</span> <strong>{formatCurrency(calculations.subTotal)}</strong></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Precio Final</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="flex justify-between"><span>Sub-total</span> <strong>{formatCurrency(calculations.subTotal)}</strong></div>
              <div className="flex justify-between"><span>Margen de Beneficio ({values.profitPercentage}%)</span> <strong>{formatCurrency(calculations.profitAmount)}</strong></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Precio Antes de IVA</span> <strong>{formatCurrency(calculations.priceBeforeVat)}</strong></div>
              <div className="flex justify-between"><span>IVA ({values.vatPercentage}%)</span> <strong>{formatCurrency(calculations.vatAmount)}</strong></div>
              <Separator className="my-4" />
              <div className="flex justify-between text-2xl font-bold text-primary"><span>Precio Final</span> <strong>{formatCurrency(calculations.finalPrice)}</strong></div>
            </CardContent>
          </Card>
        </div>
         <footer className="mt-12 pt-6 border-t text-center text-gray-800">
          <p className="font-semibold text-lg mb-2">@luprintech</p>
          <div className="flex justify-center gap-4 text-gray-600">
              <a href="https://github.com/GuadalupeCanoM" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Guadalupe Cano" className="hover:text-primary transition-colors">
                  <Github className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@Luprintech" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube de Luprintech" className="hover:text-primary transition-colors">
                  <Youtube className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/luprintech/" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram de Luprintech" className="hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@luprintech" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok de Luprintech" className="hover:text-primary transition-colors">
                  <TikTokIcon className="h-6 w-6" />
              </a>
          </div>
        </footer>
      </div>
    );
  };

PrintSummary.displayName = 'PrintSummary';
