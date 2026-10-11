import cors from 'cors';
import express from 'express';
import { connectDatabase } from './config/database.js';
import activitiesRouter from './routes/activities.js';
import leaderboardRouter from './routes/leaderboard.js';
import teamsRouter from './routes/teams.js';
import usersRouter from './routes/users.js';
import workoutsRouter from './routes/workouts.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();
const port = Number(process.env.PORT ?? 8000);
export const apiBaseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-api' });
});

app.use('/api/users/', usersRouter);
app.use('/api/teams/', teamsRouter);
app.use('/api/activities/', activitiesRouter);
app.use('/api/leaderboard/', leaderboardRouter);
app.use('/api/workouts/', workoutsRouter);

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${apiBaseUrl}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});