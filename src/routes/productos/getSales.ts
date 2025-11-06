import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            brand: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      total: sales.length,
      data: sales,
    });
  } catch (error) {
    console.error("❌ Error al obtener las ventas:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las ventas.",
    });
  }
});

export default router;
