"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPriceSchema = void 0;
// models/productPrice.ts
const zod_1 = require("zod");
exports.ProductPriceSchema = zod_1.z.object({
    ProductID: zod_1.z.string(),
    CheckDate: zod_1.z.string(),
    Price: zod_1.z.number(),
    PreviousPrice: zod_1.z.number(),
    PriceChange: zod_1.z.number(),
    Title: zod_1.z.string(),
    URL: zod_1.z.string(),
});
