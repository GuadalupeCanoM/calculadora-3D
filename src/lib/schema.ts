import * as z from "zod";

export const formSchema = z.object({
  id: z.string().optional(),
  jobName: z.string().optional().default(""),
  projectImage: z.string().optional().default(""),
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
});

export type FormData = z.infer<typeof formSchema>;