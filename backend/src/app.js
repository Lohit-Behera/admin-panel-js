import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// import routes
import baseRouter from "./routes/baseRoutes.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoute.js";
import blogRouter from "./routes/blogRoutes.js";
import bannerRouter from "./routes/bannerRoutes.js";
import collaborationRouter from "./routes/collaborationRoutes.js";

app.use("/api/v1/base", baseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/banners", bannerRouter);
app.use("/api/v1/collaborations", collaborationRouter);

export { app };
