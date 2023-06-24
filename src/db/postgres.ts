import { Pool } from "pg";
import pg from "pg";

// Used to parse shortened date strings from Postgres
pg.types.setTypeParser(pg.types.builtins.DATE, (d) => d);

// We use a shared connection pool for all Postgres queries
const pool = new Pool();

export const queryQuests = async (query: string) => {
  const sqlRes = await pool.query(query);

  let quests: string[] = [];
  sqlRes.rows.forEach((row) => {
    quests.push(row.name);
  });

  return quests;
};

export const queryUserTotals = async (query: string) => {
  const sqlRes = await pool.query(query);

  const rewarded: number = parseFloat(sqlRes.rows[0].sum);
  const date: string = sqlRes.rows[0].max;

  return { rewarded, date };
};
