import express, { Request, Response } from "express";
import { queryUserTotals } from "../../db/postgres";
import axios from "axios";

export const usersRouter = express.Router();

const SUPPORTED_CURRENCIES = ["ETH", "USD"];

usersRouter.get("/:id/totalRewarded", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const currency: string = req.query.currency as string;

  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    res.status(400).send({ error: "Unsupported currency" });
    return;
  }

  try {
    const userTotals = await queryUserTotals(
      `SELECT SUM(quests.eth_reward)${
        currency == "USD" ? ",MAX(quest_completions.completed_at)::date" : ""
      } FROM quest_completions
      INNER JOIN quests ON quest_completions.quest_id=quests.id
      INNER JOIN users ON quest_completions.user_id=users.id
      WHERE users.id=${id}`
    );

    if (!userTotals.rewarded) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    try {
      let rewarded =
        currency == "USD"
          ? await convertETHtoUSD(userTotals.rewarded, userTotals.date)
          : userTotals.rewarded;

      res.status(200).send({ [currency]: rewarded });
    } catch (e) {
      res.status(500).send({
        error:
          "There was a problem converting ETH to USD. Try getting ETH total instead.",
      });
    }
  } catch (e) {
    res.status(500).send({ error: "There was a problem getting user totals" });
  }
});

const convertETHtoUSD = async (eth: number, date: string) => {
  const dateObj = new Date(date);
  const days = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  // We need to format the date to coingecko's specification (DD-MM-YYYY)
  const query = `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${days}-${month}-${year}`;
  const response = await axios.get(query);
  const price = response.data.market_data.current_price.usd as number;

  return eth * price;
};
