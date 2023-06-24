import * as dotenv from "dotenv";
import express from "express";
import { questsRouter } from "./api/quests/quests.router";
import { usersRouter } from "./api/users/users.router";

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
app.use(express.json());
app.use("/api/quests", questsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
