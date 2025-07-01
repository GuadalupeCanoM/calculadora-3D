"use client";

import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { handleAnalyzeGcode } from "@/app/actions";
import { PrintSummary } from "@/components/print-summary";
import {
  UploadCloud,
  Loader2,
  Trash2,
  PlusCircle,
  Printer,
  Share2,
  FileText,
  Clock,
  Weight,
  Palette,
  DollarSign,
  Wrench,
  Package,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
  jobName: z.string().optional(),
  currency: z.string().min(1, 'La moneda es obligatoria.').default('EUR'),
  printingTime: z.coerce.number().min(0).default(0),
  filamentWeight: z.coerce.number().min(0).default(0),
  filamentType: z.string().optional(),
  spoolPrice: z.coerce.number().min(0).default(50),
  spoolWeight: z.coerce.number().min(1, "El peso de la bobina debe ser mayor que 0").default(1000),
  prepTime: z.coerce.number().min(0).default(0),
  prepCostPerHour: z.coerce.number().min(0).default(30),
  postProcessingTime: z.coerce.number().min(0).default(0),
  postProcessingCostPerHour: z.coerce.number().min(0).default(30),
  includeMaintenance: z.boolean().default(false),
  maintenanceCost: z.coerce.number().min(0).default(5),
  otherCosts: z.array(z.object({
    name: z.string().min(1, 'El nombre del artículo no puede estar vacío.'),
    price: z.coerce.number().min(0),
  })).default([]),
  profitPercentage: z.coerce.number().min(0).default(20),
  vatPercentage: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof formSchema>;

export function CalculatorForm() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({}),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "otherCosts",
  });

  const watchedValues = form.watch();
  
  const {
    filamentWeight, spoolWeight, spoolPrice,
    prepTime, prepCostPerHour, postProcessingTime, postProcessingCostPerHour,
    includeMaintenance, maintenanceCost, otherCosts,
    profitPercentage, vatPercentage,
  } = watchedValues;

  const filamentCost = spoolWeight > 0 ? (filamentWeight / spoolWeight) * spoolPrice : 0;
  const prepCost = (prepTime / 60) * prepCostPerHour;
  const postProcessingCost = (postProcessingTime / 60) * postProcessingCostPerHour;
  const laborCost = prepCost + postProcessingCost;
  const currentMaintenanceCost = includeMaintenance ? maintenanceCost : 0;
  const otherCostsTotal = otherCosts.reduce((acc, cost) => acc + (cost.price || 0), 0);
  const subTotal = filamentCost + laborCost + currentMaintenanceCost + otherCostsTotal;
  const profitAmount = subTotal * (profitPercentage / 100);
  const priceBeforeVat = subTotal + profitAmount;
  const vatAmount = priceBeforeVat * (vatPercentage / 100);
  const finalPrice = priceBeforeVat + vatAmount;

  const calculations = {
    filamentCost, laborCost, otherCostsTotal, subTotal,
    profitAmount, priceBeforeVat, vatAmount, finalPrice,
  };


  const handleGcodeAnalyze = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('gcodeFile', file);

    const result = await handleAnalyzeGcode(formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Análisis Fallido",
        description: result.error,
      });
    } else if (result.data) {
      form.setValue('printingTime', Math.round(result.data.printingTimeSeconds / 60));
      form.setValue('filamentWeight', parseFloat(result.data.filamentWeightGrams.toFixed(2)));
      toast({
        title: "Análisis Completado",
        description: "El tiempo de impresión y el peso del filamento han sido actualizados.",
      });
    }
    setIsAnalyzing(false);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: watchedValues.currency || 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printHtml = printContent.innerHTML;
      document.body.innerHTML = printHtml;
      window.print();
      document.body.innerHTML = originalContents;
      // We need to re-attach our react app
      window.location.reload();
    }
  };

  const handleShare = async () => {
    const summaryText = `
    Trabajo de Impresión 3D: ${watchedValues.jobName || 'Sin título'}
    ---
    Costo de Filamento: ${formatCurrency(calculations.filamentCost)}
    Costo de Mano de Obra: ${formatCurrency(calculations.laborCost)}
    Otros Costos: ${formatCurrency(calculations.otherCostsTotal + (watchedValues.includeMaintenance ? watchedValues.maintenanceCost : 0))}
    ---
    Sub-total: ${formatCurrency(calculations.subTotal)}
    Beneficio (${watchedValues.profitPercentage}%): ${formatCurrency(calculations.profitAmount)}
    IVA (${watchedValues.vatPercentage}%): ${formatCurrency(calculations.vatAmount)}
    ---
    Precio Final: ${formatCurrency(calculations.finalPrice)}
    `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resumen de Costo de Impresión 3D',
          text: summaryText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        await navigator.clipboard.writeText(summaryText.trim());
        toast({ title: 'Error al compartir, resumen copiado al portapapeles.' });
      }
    } else {
      await navigator.clipboard.writeText(summaryText.trim());
      toast({ title: 'Resumen copiado al portapapeles.' });
    }
  };


  return (
    <TooltipProvider>
    <Form {...form}>
      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><FileText className="text-primary"/> Detalles del Trabajo</CardTitle>
            <CardDescription>Comienza definiendo tu trabajo y subiendo tu G-code para un análisis automático.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="jobName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Trabajo</FormLabel>
                  <FormControl><Input placeholder="Ej: Benchy, Litofanía, etc." {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="GBP">Libra (£)</SelectItem>
                        <SelectItem value="JPY">Yen (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormLabel>Análisis de G-code</FormLabel>
              <div className="mt-2">
                <input type="file" ref={fileInputRef} onChange={handleGcodeAnalyze} accept=".gcode" className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                  {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isAnalyzing ? 'Analizando...' : 'Subir G-code'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">Sube tu archivo G-code para rellenar automáticamente el tiempo de impresión y el peso del filamento.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="printingTime" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Clock size={16}/> Tiempo de Impresión (minutos)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="filamentWeight" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Weight size={16}/> Peso del Filamento (gramos)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="font-headline text-2xl flex items-center gap-2"><Palette className="text-primary"/> Costos de Filamento</CardTitle>
            <CardDescription>Proporciona detalles sobre la bobina de filamento para calcular los costos de material.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="filamentType" render={({ field }) => (
                <FormItem><FormLabel>Tipo de Filamento</FormLabel><FormControl><Input placeholder="Ej: PLA, PETG, ABS" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="spoolPrice" render={({ field }) => (
                <FormItem><FormLabel>Precio de la Bobina</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="spoolWeight" render={({ field }) => (
                <FormItem><FormLabel>Peso de la Bobina (gramos)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
            )} />
          </CardContent>
        </Card>

        <Accordion type="multiple" className="w-full space-y-4">
            <Card>
                <AccordionItem value="labor" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wrench className="text-primary"/> Mano de Obra, Mantenimiento y Otros Costos</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                    <div className="space-y-6">
                        <div>
                        <h3 className="font-semibold mb-2">Costos de Mano de Obra</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="prepTime" render={({ field }) => (<FormItem><FormLabel>Tiempo de Preparación (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="prepCostPerHour" render={({ field }) => (<FormItem><FormLabel>Costo de Preparación/hr</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="postProcessingTime" render={({ field }) => (<FormItem><FormLabel>Tiempo de Post-procesamiento (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="postProcessingCostPerHour" render={({ field }) => (<FormItem><FormLabel>Costo de Post-procesamiento/hr</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                        </div>
                        </div>

                        <Separator/>
                        
                        <div>
                            <h3 className="font-semibold mb-2">Máquina y Mantenimiento</h3>
                            <FormField control={form.control} name="includeMaintenance" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>¿Incluir Costos de Mantenimiento?</FormLabel>
                                        <FormDescription>Activa para añadir costos opcionales de la máquina.</FormDescription>
                                    </div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                            {watchedValues.includeMaintenance && (
                                <FormField control={form.control} name="maintenanceCost" render={({ field }) => (
                                <FormItem className="mt-4"><FormLabel>Costo de Mantenimiento</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                            )}
                        </div>

                        <Separator/>
                        <div>
                        <h3 className="font-semibold mb-2">Otros Costos</h3>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2 mb-2">
                                <FormField control={form.control} name={`otherCosts.${index}.name`} render={({ field }) => (<FormItem className="flex-grow"><FormLabel className={index > 0 ? 'sr-only' : ''}>Nombre del Artículo</FormLabel><FormControl><Input placeholder="Ej: Tornillos, Imanes" {...field} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name={`otherCosts.${index}.price`} render={({ field }) => (<FormItem><FormLabel className={index > 0 ? 'sr-only' : ''}>Precio</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 size={16} /></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: 0 })} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Añadir Línea de Costo</Button>
                        </div>
                    </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><DollarSign className="text-primary"/> Precio Final</CardTitle>
                <CardDescription>Establece tu margen de beneficio e impuestos para calcular el precio final.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="profitPercentage" render={({ field }) => (<FormItem><FormLabel>Porcentaje de Beneficio (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="vatPercentage" render={({ field }) => (<FormItem><FormLabel>IVA (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 rounded-b-lg">
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm"><span>Sub-total</span><span>{formatCurrency(calculations.subTotal)}</span></div>
                    <div className="flex justify-between text-sm"><span>Beneficio</span><span>{formatCurrency(calculations.profitAmount)}</span></div>
                    <div className="flex justify-between text-sm"><span>IVA</span><span>{formatCurrency(calculations.vatAmount)}</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-2xl font-bold text-primary">
                        <span className="font-headline">Precio Final</span>
                        <span>{formatCurrency(calculations.finalPrice)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" onClick={handleShare} variant="outline" className="w-full sm:w-auto"><Share2 className="mr-2 h-4 w-4"/> Compartir</Button>
            <Button type="button" onClick={handlePrint} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"><Printer className="mr-2 h-4 w-4"/> Imprimir Resumen</Button>
        </div>

        <div className="hidden">
            <PrintSummary ref={printRef} form={form} calculations={calculations} />
        </div>
      </form>
    </Form>
    </TooltipProvider>
  );
}
