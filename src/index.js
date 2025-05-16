import express from 'express';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Démarrage du serveur
app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
