import express from "express";
import dotenv from "dotenv";
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
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import labRoutes from './routes/labRoutes.js';
import doctorRoutes from "./routes/doctorRoutes.js";
import inventoryRoutes from './routes/inventoryRoutes.js';
import wardRoutes from './routes/wardRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import reportRoutes from './routes/reportRoutes.js';


 




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
dotenv.config();
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
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/lab', labRoutes);
app.use("/api/doctors", doctorRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/wards', wardRoutes);
 app.use('/api/staff', staffRoutes);
 app.use('/api/reports', reportRoutes);



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