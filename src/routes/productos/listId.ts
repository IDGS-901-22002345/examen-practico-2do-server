import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido. Debe ser un número.",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        dimensions: true,
        meta: true,
        images: true,
        tags: true,
        reviews: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      data: existingProduct,
    });
  } catch (error) {
    console.error("Error al buscar el producto:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al buscar el producto",
    });
  }
});

export default router;
