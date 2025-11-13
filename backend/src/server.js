import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import notificationRoutes from "./routes/notificationRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";



// ✅ Node <18 fallback
const fetchFn = global.fetch || (await import("node-fetch")).default;


2


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
const ORS_API_KEY = process.env.ORS_API_KEY;

// ✅ Kết nối MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => res.send("🚍 FUTABUS backend is running!"));

app.use("/api/drivers", driverRoutes);
app.use("/api/otp", otpRoutes);

// ✅ Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/booking", bookingRoutes); // alias để tránh lỗi 404 từ FE

app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/vehicles", vehicleRoutes);




app.use("/api/notifications", notificationRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin/reports", reportRoutes);




// ✅ HTTP + Socket
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ===========================================================
// 🔹 Hàm lấy tuyến thật từ OpenRouteService

async function getRealRoute(start, end) {
  try { 
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
    const res = await fetchFn(url);
    const data = await res.json();

    if (!data.features || !data.features[0]) {
      console.error("❌ ORS error:", data);
      return [];
    }

    const coords = data.features[0].geometry.coordinates; // [lng, lat]
    return coords.map(([lng, lat]) => ({ lat, lng }));
  } catch (err) {
    console.error("❌ Failed to fetch route:", err.message);
    return [];
  }
}

// ===========================================================
// 🔸 Demo tuyến FUTA
// ===========================================================
const routes = [
  {
    plateNumber: "51B-12345",
    from: "Bến xe Miền Tây",
    to: "Bến xe Cần Thơ",
    start: { lat: 10.762622, lng: 106.660172 },
    end: { lat: 10.045162, lng: 105.7469 },
  },
  {
    plateNumber: "51B-67890",
    from: "Bến xe Miền Đông",
    to: "Bến xe Vũng Tàu",
    start: { lat: 10.801758, lng: 106.712081 },
    end: { lat: 10.345997, lng: 107.084259 },
  },
  {
    plateNumber: "65B-43210",
    from: "Bến xe Cần Thơ",
    to: "Bến xe Châu Đốc",
    start: { lat: 10.045162, lng: 105.7469 },
    end: { lat: 10.688771, lng: 105.118012 },
  },
];

let routeData = [];

// ===========================================================
// 🔹 Lấy đường thật khi server khởi động
// ===========================================================
(async () => {
  console.log("📡 Fetching real routes from OpenRouteService...");
  routeData = await Promise.all(
    routes.map(async (r) => {
      const path = await getRealRoute(r.start, r.end);
      console.log(
        `✅ ${r.plateNumber}: ${r.from} → ${r.to} (${path.length} points)`
      );
      return { ...r, path };
    })
  );

  console.log(`🚍 Loaded ${routeData.length} route(s) successfully`);
})();

// ===========================================================
// 🔹 Socket.io connections
// ===========================================================
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Gửi danh sách tuyến khi client connect
  socket.emit(
    "routeList",
    routeData.map(({ plateNumber, from, to, path }) => ({
      plateNumber,
      from,
      to,
      path,
    }))
  );

  socket.on("disconnect", () =>
    console.log("🔴 Client disconnected:", socket.id)
  );
});

// ===========================================================
// 🔹 Mô phỏng xe di chuyển realtime
// ===========================================================
const positions = {}; // index vị trí hiện tại của từng xe

const startEmitting = () => {
  if (routeData.length === 0) {
    console.log("⚠️ Waiting for routeData to be loaded...");
    setTimeout(startEmitting, 3000);
    return;
  }

  console.log("🚗 Starting realtime simulation...");
  setInterval(() => {
    routeData.forEach((bus) => {
      const total = bus.path?.length || 0;
      if (total === 0) return;

      if (!positions[bus.plateNumber]) positions[bus.plateNumber] = 0;
      const i = positions[bus.plateNumber];
      const point = bus.path[i];

      if (!point) return;

      io.emit("busLocation", {
        plateNumber: bus.plateNumber,
        currentLat: point.lat,
        currentLng: point.lng,
        from: bus.from,
        to: bus.to,
        speed: (Math.random() * 40 + 20).toFixed(1),
      });

      positions[bus.plateNumber] = (i + 1) % total;
    });
  }, 2000);
};

setTimeout(startEmitting, 5000); // đợi 5s cho ORS load xong

// ===========================================================
// 🔹 Server start
// ===========================================================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`🚀 FUTABUS server running on port ${PORT}`)
);
