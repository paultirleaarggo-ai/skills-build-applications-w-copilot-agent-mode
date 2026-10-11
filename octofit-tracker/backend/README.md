# OctoFit Tracker API

The TypeScript and Express API listens on port `8000` and connects to the
`octofit_db` MongoDB database. Set `MONGODB_URI` to override the default
`mongodb://localhost:27017/octofit_db` connection.

Run `npm run dev --prefix octofit-tracker/backend` for development,
`npm run build --prefix octofit-tracker/backend` to compile, and
`npm start --prefix octofit-tracker/backend` to run the compiled API.
Run `npm run seed --prefix octofit-tracker/backend` to add or update the
repeatable sample users, teams, activities, leaderboard entries, and workouts.
The seed script preserves unrelated records already in the database.

The API base URL is `http://localhost:8000` locally. In Codespaces, it uses
`https://${CODESPACE_NAME}-8000.app.github.dev`.

All resources support collection `GET` and `POST` routes and item `GET`,
`PATCH`, and `DELETE` routes:

| Resource | Collection endpoint | Model |
| --- | --- | --- |
| Users | `/api/users/` | User profiles |
| Teams | `/api/teams/` | Teams and member references |
| Activities | `/api/activities/` | User activity logs |
| Leaderboard | `/api/leaderboard/` | User point totals |
| Workouts | `/api/workouts/` | Workout suggestions |

Requests use JSON bodies. Model validation errors return `400`, duplicate
unique values return `409`, missing records return `404`, and unexpected
server errors return `500`.
