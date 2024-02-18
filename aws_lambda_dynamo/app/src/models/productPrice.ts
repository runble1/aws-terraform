// models/productPrice.ts
import { z } from "zod";

export const ProductPriceSchema = z.object({
  ProductID: z.string(),
  CheckDate: z.string(),
  Price: z.number(),
  PreviousPrice: z.number(),
  PriceChange: z.number(),
  Title: z.string(),
  URL: z.string(),
});

export type ProductPrice = z.infer<typeof ProductPriceSchema>;
