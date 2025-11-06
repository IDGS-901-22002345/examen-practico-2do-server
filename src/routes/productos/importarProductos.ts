import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/importarProductos", async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../../utils/products2ddoExamen.json");

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const productos = data.products;

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: "No hay productos en el JSON" });
    }

    const operaciones: any[] = [];

    for (const p of productos) {
      if (!p.title || !p.price || !p.dimensions || !p.meta) {
        throw new Error(
          `Datos incompletos en producto: ${p.title || "sin título"}`
        );
      }

      operaciones.push(
        prisma.dimensions.create({
          data: {
            width: p.dimensions?.width ?? 0,
            height: p.dimensions?.height ?? 0,
            depth: p.dimensions?.depth ?? 0,
          },
        })
      );

      operaciones.push(
        prisma.meta.create({
          data: {
            createdAt: p.meta?.createdAt
              ? new Date(p.meta.createdAt)
              : new Date(),
            updatedAt: p.meta?.updatedAt
              ? new Date(p.meta.updatedAt)
              : new Date(),
            barcode: p.meta?.barcode ?? null,
            qrCode: p.meta?.qrCode ?? null,
          },
        })
      );
    }

    const resultados = await prisma.$transaction(operaciones);

    const productosOps: any[] = [];
    let index = 0;

    for (const p of productos) {
      const dimensiones = resultados[index++];
      const meta = resultados[index++];

      const producto = prisma.product.create({
        data: {
          title: p.title,
          description: p.description ?? "",
          category: p.category ?? "Sin categoría",
          price: p.price,
          discountPercentage: p.discountPercentage ?? 0,
          rating: p.rating ?? 0,
          stock: p.stock ?? 0,
          brand: p.brand ?? null,
          sku: p.sku ?? `SKU-${Math.random().toString(36).substring(2, 8)}`,
          weight: p.weight ?? 0,
          warrantyInformation: p.warrantyInformation ?? "",
          shippingInformation: p.shippingInformation ?? "",
          availabilityStatus: p.availabilityStatus ?? "available",
          returnPolicy: p.returnPolicy ?? "",
          minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
          thumbnail: p.thumbnail ?? "",
          dimensionsId: dimensiones.id,
          metaId: meta.id,
          images: p.images?.length
            ? { createMany: { data: p.images.map((url: string) => ({ url })) } }
            : undefined,
          tags: p.tags?.length
            ? { createMany: { data: p.tags.map((t: string) => ({ name: t })) } }
            : undefined,
          reviews: p.reviews?.length
            ? {
                createMany: {
                  data: p.reviews.map((r: any) => ({
                    rating: r.rating ?? 0,
                    comment: r.comment ?? "",
                    date: r.date ? new Date(r.date) : new Date(),
                    reviewerName: r.reviewerName ?? "Anónimo",
                    reviewerEmail: r.reviewerEmail ?? "sin-correo@example.com",
                  })),
                },
              }
            : undefined,
        },
      });

      productosOps.push(producto);
    }

    await prisma.$transaction(productosOps);

    res.status(201).json({
      status: "success",
      message: "✅ Productos importados correctamente",
      total: productos.length,
    });
  } catch (error: any) {
    console.error("❌ Error al importar productos:", error.message);
    res.status(500).json({
      error: "Se canceló la importación. No se guardaron datos.",
      detalle: error.message,
    });
  }
});

export default router;
