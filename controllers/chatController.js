// import { detectIntent } from "../services/inference.js";
// import { getTip, saveUnknown } from "../models/knowledgeModel.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const handleChat = async (req, res) => {
//   try {
//     const message = req.body.message;

//     if (!message) {
//       return res.status(400).json({ error: "Message required" });
//     }

//     const intent = detectIntent(message);

//     // Rule-based responses
//     if (intent === "greeting") {
//       return res.json({ reply: "Hello! 😊 How can I help you today?" });
//     }

//     if (intent === "thanks") {
//       return res.json({ reply: "You're welcome! Stay healthy 💪" });
//     }

//     // Database-based responses
//     if (["fitness", "nutrition", "hydration", "sleep"].includes(intent)) {
//       const tip = await getTip(intent);

//       if (tip) {
//         return res.json({ reply: tip });
//       }
//     }

//     // AI fallback (Gemini)
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//     const model = genAI.getGenerativeModel({
//       model: "models/gemini-2.5-flash",
//     });

//     const prompt = `
// You are a HEALTH & WELLNESS chatbot.

// RULES:
// - Only answer health, fitness, nutrition, and wellness questions
// - Do NOT give medical diagnosis
// - Keep answers simple and safe

// User: ${message}
// `;

//     const result = await model.generateContent(prompt);
//     const reply = await result.response.text();

//     // Save unknown questions (learning)
//     await saveUnknown(message);

//     res.json({ reply });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

import { detectIntent } from "../services/inference.js";
import {
  getTip,
  saveUnknown,
  getLearnedResponse,
  saveLearnedResponse
} from "../models/knowledgeModel.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini setup (only once)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
});

//Random responses

const greetings = [
  "Hello! 😊 How can I help you today?",
  "Hi there 👋 Ready to improve your health?",
  "Hey! 💪 What health advice do you need?"
];

const thanksReplies = [
  "You're welcome 💚",
  "Happy to help 😊",
  "Stay healthy and take care 💪"
];

const smallTalkReplies = [
  "I'm doing great 😊 Thanks for asking!",
  "Feeling healthy and ready to help 💪",
  "Doing well! How about you?"
];

function getRandomResponse(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


export const handleChat = async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message required"
      });
    }

    const intent = detectIntent(message);

    //Rule based response

    if (intent === "greeting") {
      return res.json({
        reply: getRandomResponse(greetings)
      });
    }

    if (intent === "thanks") {
      return res.json({
        reply: getRandomResponse(thanksReplies)
      });
    }

    if (intent === "smalltalk") {
      return res.json({
        reply: getRandomResponse(smallTalkReplies)
      });
    }

    //Databse knowledge base

    if (["fitness", "nutrition", "hydration", "sleep"].includes(intent)) {
      const tip = await getTip(intent);

      if (tip) {
        return res.json({ reply: tip });
      }
    }

    //Learned reponse

    const learnedReply = await getLearnedResponse(message);

    if (learnedReply) {
      return res.json({
        reply: learnedReply
      });
    }

    //Gemini ai fallback

    let reply;

    try {
      const prompt = `
You are a HEALTH & WELLNESS chatbot.

RULES:
- Only answer health, fitness, nutrition, and wellness questions
- Do NOT provide medical diagnosis
- Keep answers simple, friendly, and safe
- Reply in short paragraphs

User: ${message}
`;

      const result = await model.generateContent(prompt);
      reply = await result.response.text();

    } catch (error) {
      console.error("Gemini Error:", error);

      return res.json({
        reply: "I'm currently busy 🤖 Please try again in a moment."
      });
    }

    //Learning system

    if (!learnedReply) {
      await saveUnknown(message);
      await saveLearnedResponse(message, reply);
    }

    return res.json({ reply });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error"
    });
  }
};