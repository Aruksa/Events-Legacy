import express from "express";
import cors from "cors";
import sequelize from "./models/index";
import userRoutes from "./routes/userRoute";
import eventRoutes from "./routes/eventRoute";
import genreRouters from "./routes/genreRoute";
import loginorNot from "./routes/authRoute";
import attendyRouters from "./routes/attendyRoute";
import createEventIndex from "./elasticSearchSetup";
import { log } from "console";
import { getAllEventsFromElastic } from "./controllers/elasticShowAll";

const app = express();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", loginorNot);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/genres", genreRouters);
app.use("/api/elastic", getAllEventsFromElastic);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected and User table created");
  // Elastic indexing
  createEventIndex()
    .then(() => {
      console.log("Elastic message below");
    })
    .catch((e: any) => {
      console.log(e);
    });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
