import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/users.js";
import recipeRouter from "./routes/recipes.js";
import authRouter from "./routes/authentification.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: __dirname+"/../.env"});
// console.log(process.env)


// const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));
const app = express();
const PORT = process.env.PORT || 3000;

// connexion à la base de données
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

app.use("/api/users", userRouter);

app.use("/api/recipes", recipeRouter);

app.use("/api/auth", authRouter);

// Doc swagger
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
