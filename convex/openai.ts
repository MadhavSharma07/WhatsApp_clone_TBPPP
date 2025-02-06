// import Gemini from "@google/generative-ai";
// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import { api } from "./_generated/api";

// const apiKey = process.env.GEMINI_API_KEY;
// const gemini = new Gemini(apiKey);

// export const chat = action({
//   args: {
//     messageBody: v.string(),
//     conversation: v.id("conversations"),
//   },
//   handler: async (ctx, args) => {
//     const res = await gemini.chat.completions.create({
//       model: "gemini-1.5-flash", // Check the available models in the Gemini API documentation
//       messages: [
//         {
//           role: "system",
//           content: "You are a terse bot in a group chat responding to questions with 1-sentence answers",
//         },
//         {
//           role: "user",
//           content: args.messageBody,
//         },
//       ],
//     });

//     const messageContent = res.choices[0].message.content;

//     await ctx.runMutation(api.messages.sendChatGPTMessage, {
//       content: messageContent ?? "I'm sorry, I don't have a response for that",
//       conversation: args.conversation,
//       messageType: "text",
//     });
//   },
// });

// export const dall_e = action({
//   args: {
//     conversation: v.id("conversations"),
//     messageBody: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const res = await gemini.images.generate({
//       model: "dall-e-3", // Check the available models in the Gemini API documentation
//       prompt: args.messageBody,
//       n: 1,
//       size: "1024x1024",
//     });

//     const imageUrl = res.data[0].url;
//     await ctx.runMutation(api.messages.sendChatGPTMessage, {
//       content: imageUrl ?? "/poopenai.png",
//       conversation: args.conversation,
//       messageType: "image",
//     });
//   },
// });