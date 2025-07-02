import * as z from "zod";

export const formSchema = z.object({
  id: z.string().optional(),
  
  // == Required Fields ==
  jobName: z.string().min(1, 'El nombre del trabajo es obligatorio.').default(""),
  
  printingTimeHours: z.coerce.number().min(0).default(0),
  printingTimeMinutes: z.coerce.number().min(0).default(0),
  
  filamentWeight: z.coerce.number({ invalid_type_error: 'Debe ser un número' }).min(0.01, 'El peso del filamento es obligatorio.').default(0),
  filamentType: z.string().min(1, 'El tipo de filamento es obligatorio.').default(''),
  spoolPrice: z.coerce.number({ invalid_type_error: 'Debe ser un número' }).min(0.01, 'El precio de la bobina es obligatorio.').default(0),
  spoolWeight: z.coerce.number({ invalid_type_error: 'Debe ser un número' }).min(1, 'El peso de la bobina es obligatorio.').default(1000),

  // == Optional Fields ==
  projectImage: z.string().optional().default(""),
  currency: z.string().min(1, 'La moneda es obligatoria.').default('EUR'),
  powerConsumptionWatts: z.coerce.number().min(0).default(0),
  energyCostKwh: z.coerce.number().min(0).default(0),
  prepTime: z.coerce.number().min(0).default(0),
  prepCostPerHour: z.coerce.number().min(0).default(30),
  postProcessingTimeInMinutes: z.coerce.number().min(0).default(0),
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
})
.refine(data => data.printingTimeHours > 0 || data.printingTimeMinutes > 0, {
  message: "El tiempo total de impresión es obligatorio.",
  path: ["printingTimeHours"],
});

export type FormData = z.infer<typeof formSchema>;