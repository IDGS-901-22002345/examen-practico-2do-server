import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string" || q.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Debe proporcionar un término de búsqueda válido en 'q'.",
    });
  }

  try {
    const productos = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
          { brand: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        price: true,
        discountPercentage: true,
        rating: true,
        thumbnail: true,
        category: true,
        brand: true,
      },
    });

    return res.status(200).json({
      status: "success",
      query: q,
      total: productos.length,
      items: productos,
    });
  } catch (error) {
    console.error("❌ Error al buscar productos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al realizar la búsqueda.",
    });
  }
});

export default router;
