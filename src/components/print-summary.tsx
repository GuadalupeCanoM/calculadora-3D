"use client";

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PrintSummaryProps {
  form: UseFormReturn<any>;
  calculations: {
    filamentCost: number;
    laborCost: number;
    otherCostsTotal: number;
    subTotal: number;
    profitAmount: number;
    priceBeforeVat: number;
    vatAmount: number;
    finalPrice: number;
  };
}

export const PrintSummary = React.forwardRef<HTMLDivElement, PrintSummaryProps>(
  ({ form, calculations }, ref) => {
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
      <div ref={ref} className="p-8 font-body text-black bg-white">
        <div className="text-center mb-4">
          <h1 className="font-headline text-3xl font-bold text-primary">Calculadora de Luprintech</h1>
          <p className="text-lg">Resumen de Precio</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trabajo: {values.jobName || 'N/A'}</CardTitle>
            <CardDescription>Generado el {generatedDate}</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader><CardTitle>Desglose de Costos</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="flex justify-between"><span>Costo de Filamento</span> <strong>{formatCurrency(calculations.filamentCost)}</strong></div>
              <div className="flex justify-between"><span>Costo de Mano de Obra</span> <strong>{formatCurrency(calculations.laborCost)}</strong></div>
              {values.includeMaintenance && <div className="flex justify-between"><span>Costo de Mantenimiento</span> <strong>{formatCurrency(values.maintenanceCost || 0)}</strong></div>}
              <div className="flex justify-between"><span>Otros Costos</span> <strong>{formatCurrency(calculations.otherCostsTotal)}</strong></div>
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
      </div>
    );
  }
);

PrintSummary.displayName = 'PrintSummary';
