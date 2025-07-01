
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Zap,
  Save,
} from "lucide-react";
import { TooltipProvider } from "./ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
  jobName: z.string().optional().default(""),
  currency: z.string().min(1, 'La moneda es obligatoria.').default('EUR'),
  printingTimeHours: z.coerce.number().min(0).default(0),
  printingTimeMinutes: z.coerce.number().min(0).default(0),
  filamentWeight: z.coerce.number().min(0).default(0),
  filamentType: z.string().optional().default(""),
  spoolPrice: z.coerce.number().min(0).default(20),
  spoolWeight: z.coerce.number().min(1, "El peso de la bobina debe ser mayor que 0").default(1000),
  powerConsumptionWatts: z.coerce.number().min(0).default(0),
  energyCostKwh: z.coerce.number().min(0).default(0),
  prepTime: z.coerce.number().min(0).default(0),
  prepCostPerHour: z.coerce.number().min(0).default(30),
  postProcessingTimeHours: z.coerce.number().min(0).default(0),
  postProcessingTimeMinutes: z.coerce.number().min(0).default(0),
  postProcessingCostPerHour: z.coerce.number().min(0).default(30),
  includeMachineCosts: z.boolean().default(false),
  printerCost: z.coerce.number().min(0).default(0),
  investmentReturnYears: z.coerce.number().min(0).default(0),
  repairCost: z.coerce.number().min(0).default(0),
  otherCosts: z.array(z.object({
    name: z.string().min(1, 'El nombre del artículo no puede estar vacío.').default(''),
    price: z.coerce.number().min(0).default(0),
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

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('savedProject');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // To be safe, merge with defaults in case saved data is from an older version
        const defaultValues = formSchema.parse({});
        form.reset({ ...defaultValues, ...parsedData });
        toast({ title: 'Proyecto cargado', description: 'Se ha cargado tu proyecto guardado.' });
      }
    } catch (error) {
      console.error("Failed to load project from localStorage", error);
      toast({ variant: "destructive", title: 'Error al cargar', description: 'No se pudo cargar el proyecto guardado.' });
    }
  }, [form, toast]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "otherCosts",
  });

  const watchedValues = form.watch();
  
  const {
    printingTimeHours, printingTimeMinutes,
    filamentWeight, spoolWeight, spoolPrice,
    powerConsumptionWatts, energyCostKwh,
    prepTime, prepCostPerHour, postProcessingTimeHours, postProcessingTimeMinutes, postProcessingCostPerHour,
    includeMachineCosts, repairCost, otherCosts,
    profitPercentage, vatPercentage,
  } = watchedValues;

  const totalPrintingTimeHours = (printingTimeHours || 0) + ((printingTimeMinutes || 0) / 60);
  const electricityCost = totalPrintingTimeHours > 0 && powerConsumptionWatts > 0 && energyCostKwh > 0
    ? (powerConsumptionWatts / 1000) * totalPrintingTimeHours * energyCostKwh
    : 0;
  const filamentCost = spoolWeight > 0 ? (filamentWeight / spoolWeight) * spoolPrice : 0;
  const prepCost = (prepTime / 60) * prepCostPerHour;
  const totalPostProcessingTimeHours = (postProcessingTimeHours || 0) + ((postProcessingTimeMinutes || 0) / 60);
  const postProcessingCost = totalPostProcessingTimeHours * postProcessingCostPerHour;
  const laborCost = prepCost + postProcessingCost;
  const currentMachineCost = includeMachineCosts ? repairCost : 0;
  const otherCostsTotal = otherCosts.reduce((acc, cost) => acc + (cost.price || 0), 0);
  const subTotal = filamentCost + electricityCost + laborCost + currentMachineCost + otherCostsTotal;
  const profitAmount = subTotal * (profitPercentage / 100);
  const priceBeforeVat = subTotal + profitAmount;
  const vatAmount = priceBeforeVat * (vatPercentage / 100);
  const finalPrice = priceBeforeVat + vatAmount;

  const calculations = {
    filamentCost, electricityCost, laborCost, currentMachineCost, otherCostsTotal, subTotal,
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
      const totalMinutes = Math.round(result.data.printingTimeSeconds / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      form.setValue('printingTimeHours', hours);
      form.setValue('printingTimeMinutes', minutes);
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
      window.location.reload();
    }
  };

  const handleShare = async () => {
    let summaryText = `
    Trabajo de Impresión 3D: ${watchedValues.jobName || 'Sin título'}
    ---
    Coste de Filamento: ${formatCurrency(calculations.filamentCost)}
    Coste de Electricidad: ${formatCurrency(calculations.electricityCost)}
    Coste de Mano de Obra: ${formatCurrency(calculations.laborCost)}
    `;

    if(watchedValues.includeMachineCosts) {
      summaryText += `\nCoste de Máquina: ${formatCurrency(calculations.currentMachineCost)}`;
    }

    summaryText += `
    Otros Costes: ${formatCurrency(calculations.otherCostsTotal)}
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
          title: 'Resumen de Coste de Impresión 3D',
          text: summaryText.trim(),
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

  const handleSaveProject = () => {
    try {
      const data = form.getValues();
      localStorage.setItem('savedProject', JSON.stringify(data));
      toast({ title: 'Proyecto guardado', description: 'Tu configuración ha sido guardada en este navegador.' });
    } catch (error) {
      console.error("Failed to save project to localStorage", error);
      toast({ variant: "destructive", title: 'Error al guardar', description: 'No se pudo guardar el proyecto.' });
    }
  };


  return (
    <TooltipProvider>
    <Form {...form}>
      <form className="space-y-4">
        <Accordion 
          type="multiple" 
          className="w-full space-y-4"
          defaultValue={['job-details', 'filament-costs', 'electricity-costs', 'labor-costs', 'final-price']}
        >
          <Card>
            <AccordionItem value="job-details" className="border-b-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="text-left">
                  <CardTitle className="font-headline text-2xl flex items-center gap-2"><FileText className="text-primary"/> Detalles del Trabajo</CardTitle>
                  <CardDescription>Comienza definiendo tu trabajo y subiendo tu G-code para un análisis automático.</CardDescription>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="space-y-4">
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
                    <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2"><Clock size={16}/> Tiempo de Impresión</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="printingTimeHours"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" placeholder="Horas" className="pr-8" {...field} />
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm pointer-events-none">h</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="printingTimeMinutes"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" placeholder="Minutos" className="pr-8" {...field} />
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm pointer-events-none">m</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField control={form.control} name="filamentWeight" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Weight size={16}/> Peso del Filamento (gramos)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="filament-costs" className="border-b-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="text-left">
                  <CardTitle className="font-headline text-2xl flex items-center gap-2"><Palette className="text-primary"/> Costes de Filamento</CardTitle>
                  <CardDescription>Proporciona detalles sobre la bobina de filamento para calcular los costes de material.</CardDescription>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="filamentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Filamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PLA">PLA</SelectItem>
                            <SelectItem value="PETG">PETG</SelectItem>
                            <SelectItem value="ASA">ASA</SelectItem>
                            <SelectItem value="ABS">ABS</SelectItem>
                            <SelectItem value="OTROS">OTROS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="spoolPrice" render={({ field }) => (
                      <FormItem><FormLabel>Precio de la Bobina</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="spoolWeight" render={({ field }) => (
                      <FormItem><FormLabel>Peso de la Bobina (gramos)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between font-medium text-lg">
                    <span>Coste total de filamento:</span>
                    <span className="text-primary">{formatCurrency(calculations.filamentCost)}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="electricity-costs" className="border-b-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="text-left">
                  <CardTitle className="font-headline text-2xl flex items-center gap-2"><Zap className="text-primary"/> Electricidad</CardTitle>
                  <CardDescription>Calcula el coste de la electricidad consumida durante la impresión.</CardDescription>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="powerConsumptionWatts" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consumo de energía (vatios)</FormLabel>
                        <FormControl><Input type="number" placeholder="Ej: 150" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="energyCostKwh" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Coste de energía por kWh</FormLabel>
                          <FormControl><Input type="number" placeholder="Ej: 0.15" {...field} /></FormControl>
                          <FormDescription>El coste en la moneda seleccionada.</FormDescription>
                          <FormMessage/>
                      </FormItem>
                  )} />
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between font-medium text-lg">
                    <span>Coste total de electricidad:</span>
                    <span className="text-primary">{formatCurrency(calculations.electricityCost)}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="labor-costs" className="border-b-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="text-left">
                  <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wrench className="text-primary"/> Mano de Obra, Máquina y Otros</CardTitle>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Costes de Mano de Obra</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="prepTime" render={({ field }) => (<FormItem><FormLabel>Tiempo de Preparación (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="prepCostPerHour" render={({ field }) => (<FormItem><FormLabel>Coste de Preparación/hr</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                        
                        <div className="space-y-2">
                          <FormLabel>Tiempo de Post-procesamiento</FormLabel>
                          <div className="flex items-center gap-2">
                              <FormField
                                  control={form.control}
                                  name="postProcessingTimeHours"
                                  render={({ field }) => (
                                      <FormItem className="w-full">
                                          <FormControl>
                                              <div className="relative">
                                                  <Input type="number" placeholder="Horas" className="pr-8" {...field} />
                                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm pointer-events-none">h</span>
                                              </div>
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="postProcessingTimeMinutes"
                                  render={({ field }) => (
                                      <FormItem className="w-full">
                                          <FormControl>
                                              <div className="relative">
                                                  <Input type="number" placeholder="Minutos" className="pr-8" {...field} />
                                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm pointer-events-none">m</span>
                                              </div>
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                          </div>
                        </div>

                        <FormField control={form.control} name="postProcessingCostPerHour" render={({ field }) => (<FormItem><FormLabel>Coste de Post-procesamiento/hr</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                    </div>
                    <Separator className="my-6" />
                    <div className="flex justify-between font-medium text-lg">
                        <span>Coste total de mano de obra:</span>
                        <span className="text-primary">{formatCurrency(calculations.laborCost)}</span>
                    </div>
                  </div>
                  <Separator/>
                  <div>
                      <h3 className="font-semibold mb-2">Máquina y Mantenimiento</h3>
                      <FormField control={form.control} name="includeMachineCosts" render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                  <FormLabel>¿Incluir Costes de Máquina?</FormLabel>
                                  <FormDescription>Activa para añadir costes de amortización y reparación.</FormDescription>
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                      )} />
                      {watchedValues.includeMachineCosts && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <FormField control={form.control} name="printerCost" render={({ field }) => (
                                <FormItem><FormLabel>Coste de la impresora</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="investmentReturnYears" render={({ field }) => (
                                <FormItem><FormLabel>Retorno de la inversión (años)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                            )} />
                             <FormField control={form.control} name="repairCost" render={({ field }) => (
                                <FormItem><FormLabel>Coste de reparación</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormDescription>Coste fijo por trabajo.</FormDescription></FormItem>
                            )} />
                          </div>
                      )}
                    <Separator className="my-6" />
                    <div className="flex justify-between font-medium text-lg">
                        <span>Coste total de máquina y mantenimiento:</span>
                        <span className="text-primary">{formatCurrency(calculations.currentMachineCost)}</span>
                    </div>
                  </div>
                  <Separator/>
                  <div>
                    <h3 className="font-semibold mb-2">Otros Costes</h3>
                      {fields.map((field, index) => (
                          <div key={field.id} className="flex items-end gap-2 mb-2">
                          <FormField control={form.control} name={`otherCosts.${index}.name`} render={({ field }) => (<FormItem className="flex-grow"><FormLabel className={index > 0 ? 'sr-only' : ''}>Nombre del Artículo</FormLabel><FormControl><Input placeholder="Ej: Tornillos, Imanes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name={`otherCosts.${index}.price`} render={({ field }) => (<FormItem><FormLabel className={index > 0 ? 'sr-only' : ''}>Precio</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 size={16} /></Button>
                          </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: 0 })} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Añadir Línea de Coste</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        
          <Card>
            <AccordionItem value="final-price" className="border-b-0">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="text-left">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><DollarSign className="text-primary"/> Precio Final</CardTitle>
                    <CardDescription>Establece tu margen de beneficio e impuestos para calcular el precio final.</CardDescription>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="profitPercentage" render={({ field }) => (<FormItem><FormLabel>Porcentaje de Beneficio (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="vatPercentage" render={({ field }) => (<FormItem><FormLabel>IVA (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  </div>
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
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <Button type="button" onClick={handleSaveProject} variant="secondary" className="w-full sm:w-auto"><Save className="mr-2 h-4 w-4"/> Guardar Proyecto</Button>
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
