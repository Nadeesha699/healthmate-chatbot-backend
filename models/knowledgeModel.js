// import { db } from "../config/db.js";

// export async function getTip(category) {
//   const [rows] = await db.execute(
//     "SELECT tip FROM health_tips WHERE category = ? LIMIT 1",
//     [category]
//   );

//   return rows.length ? rows[0].tip : null;
// }

// export async function saveUnknown(question) {
//   await db.execute(
//     "INSERT INTO learning (question) VALUES (?)",
//     [question]
//   );
// }

import { db } from "../config/db.js";


export async function getTip(category) {
  const [rows] = await db.execute(
    "SELECT tip FROM health_tips WHERE category = ? LIMIT 1",
    [category]
  );

  return rows.length ? rows[0].tip : null;
}

export async function saveUnknown(question) {
  await db.execute(
    "INSERT INTO learning_questions (question) VALUES (?)",
    [question]
  );
}

export async function saveLearnedResponse(question, answer) {
  await db.execute(
    "INSERT INTO learned_responses (question, answer) VALUES (?, ?)",
    [question, answer]
  );
}


export async function getLearnedResponse(question) {
  const [rows] = await db.execute(
    "SELECT answer FROM learned_responses WHERE question = ? LIMIT 1",
    [question]
  );

  return rows.length ? rows[0].answer : null;
}