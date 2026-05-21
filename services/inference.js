// export function detectIntent(message) {
//   const msg = message.toLowerCase();

//   if (msg.includes("hi") || msg.includes("hello")) return "greeting";
//   if (msg.includes("thank")) return "thanks";
//   if (msg.includes("exercise") || msg.includes("workout")) return "fitness";
//   if (msg.includes("diet") || msg.includes("food")) return "nutrition";
//   if (msg.includes("water")) return "hydration";
//   if (msg.includes("sleep")) return "sleep";

//   return "ai"; 
// }

export function detectIntent(message) {
  const msg = message.toLowerCase();

  const intents = {
    greeting: ["hi", "hello", "hey"],
    thanks: ["thanks", "thank you"],
    smalltalk: ["how are you", "what's up", "how is it going"],

    fitness: ["exercise", "workout", "gym", "fitness", "training"],
    nutrition: ["diet", "food", "nutrition", "meal", "eat"],
    hydration: ["water", "hydration", "drink water", "water intake"],
    sleep: ["sleep", "rest", "tired", "insomnia"]
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => msg.includes(keyword))) {
      return intent;
    }
  }

  return "ai";
}