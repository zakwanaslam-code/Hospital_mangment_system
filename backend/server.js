import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import dns from "dns";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { initSocket } from "./sockets/socketHandler.js";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";


dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB();

const app = express();
const httpServer = createServer(app);

// ================= Socket.io =================
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================= Security =================
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(compression());

// ================= Body Parser =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

// ================= Logger =================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ================= Rate Limiter =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use("/api", limiter);

// ================= Static Files =================
app.use("/uploads", express.static("uploads"));

// ================= Routes =================
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);

// ================= Error Handler =================
app.use(notFound);
app.use(errorHandler);

// ================= Server =================
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});