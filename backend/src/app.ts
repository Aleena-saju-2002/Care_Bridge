import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import errorMiddleware from "./middleware/error.middleware";
import adminRoutes from "./routes/admin.routes";
import hospitalRoutes from "./routes/hospital.routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "CareBridge API is running",
  });
});
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use(errorMiddleware);



export default app;

