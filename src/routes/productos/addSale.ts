import { Router, type Request, type Response } from "express";
import { prisma } from "../../db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Debe enviar 'productId' y 'quantity' válidos.",
    });
  }

  try {
    const producto = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    const total = producto.price * quantity;

    await prisma.sale.create({
      data: {
        productId: Number(productId),
        quantity,
        totalPrice: total,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Compra registrada exitosamente.",
      data: { productId, quantity, totalPrice: total },
    });
  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar la venta.",
    });
  }
});

export default router;
