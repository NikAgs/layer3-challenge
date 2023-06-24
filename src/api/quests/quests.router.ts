import express, { Request, Response } from "express";
import { queryQuests } from "../../db/postgres";
export const questsRouter = express.Router();

questsRouter.get("/popular", async (req: Request, res: Response) => {
  try {
    const popularQuests = await queryQuests(
      `SELECT quests.name FROM
        quest_completions INNER JOIN quests
        ON quest_completions.quest_id=quests.id
        GROUP BY quests.name
        ORDER BY COUNT(quests.name) DESC
        FETCH FIRST 10 ROWS WITH TIES;`
    );

    res.status(200).send(popularQuests);
  } catch (e) {
    res
      .status(500)
      .send({ error: "There was a problem getting popular quests" });
  }
});

questsRouter.get("/mostPaid", async (req: Request, res: Response) => {
  try {
    const mostPaid = await queryQuests(
      `SELECT quests.name FROM
        quest_completions INNER JOIN quests
        ON quest_completions.quest_id=quests.id
        GROUP BY quests.name
        ORDER BY SUM(quests.eth_reward) DESC
        FETCH FIRST 10 ROWS WITH TIES`
    );

    res.status(200).send(mostPaid);
  } catch (e) {
    res
      .status(500)
      .send({ error: "There was a problem getting most paid quests" });
  }
});
