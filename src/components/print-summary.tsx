"use client";

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Logo } from './icons';

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
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: values.currency || 'USD',
      }).format(amount);
    };
    
    const [generatedDate, setGeneratedDate] = React.useState('');
    React.useEffect(() => {
        setGeneratedDate(new Date().toLocaleDateString());
    }, []);

    return (
      <div ref={ref} className="p-8 font-body text-black bg-white">
        <div className="flex items-center gap-4 mb-4">
          <Logo className="h-12 w-12 text-primary" />
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary">3D Print Price Pal</h1>
            <p className="text-lg">Price Summary</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job: {values.jobName || 'N/A'}</CardTitle>
            <CardDescription>Generated on {generatedDate}</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="flex justify-between"><span>Filament Cost</span> <strong>{formatCurrency(calculations.filamentCost)}</strong></div>
              <div className="flex justify-between"><span>Labor Cost</span> <strong>{formatCurrency(calculations.laborCost)}</strong></div>
              {values.includeMaintenance && <div className="flex justify-between"><span>Maintenance Cost</span> <strong>{formatCurrency(values.maintenanceCost || 0)}</strong></div>}
              <div className="flex justify-between"><span>Other Costs</span> <strong>{formatCurrency(calculations.otherCostsTotal)}</strong></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Sub-total</span> <strong>{formatCurrency(calculations.subTotal)}</strong></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Final Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="flex justify-between"><span>Sub-total</span> <strong>{formatCurrency(calculations.subTotal)}</strong></div>
              <div className="flex justify-between"><span>Profit Margin ({values.profitPercentage}%)</span> <strong>{formatCurrency(calculations.profitAmount)}</strong></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Price Before VAT</span> <strong>{formatCurrency(calculations.priceBeforeVat)}</strong></div>
              <div className="flex justify-between"><span>VAT ({values.vatPercentage}%)</span> <strong>{formatCurrency(calculations.vatAmount)}</strong></div>
              <Separator className="my-4" />
              <div className="flex justify-between text-2xl font-bold text-primary"><span>Final Price</span> <strong>{formatCurrency(calculations.finalPrice)}</strong></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);

PrintSummary.displayName = 'PrintSummary';
