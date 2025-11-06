import type { Express } from "express";
import { env } from "./env";
import express from "express";
import cors from "cors";

import importar from "./routes/productos/importarProductos";

import getSales from "./routes/productos/getSales";
import addSale from "./routes/productos/addSale";
import listId from "./routes/productos/listId";
import searchProductos from "./routes/productos/searchProductos";

export const app: Express = express();

app.use(cors());
app.use(express.json({}));

app.get("/api", (_req, res) => {
  res.json({ message: "API funcionando" });
});

app.use("/api/productos", importar);
app.use("/api/productos/search", searchProductos);
app.use("/api/productos", listId);
app.use("/api/sales", getSales);
app.use("/api/sales", addSale);

app.use((_req, res, _next) => {
  res.status(404).json({
    data: null,
    statusCode: 404,
    error: {
      status: 404,
      name: "NotFoundError",
      message: "Not Found",
      details: {},
    },
  });
});

app.listen(env.PORT, () => {
  console.log(`Examen-practico-2do-Server API started on port ${env.PORT}`);
});
