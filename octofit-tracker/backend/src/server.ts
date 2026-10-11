import cors from 'cors';
import express from 'express';
import './config/database.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-api' });
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
});