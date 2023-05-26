import { Configuration, OpenAIApi } from 'openai';
import OPENAI_API_KEY from '../open_ai';

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("game-canvas");

  const ctx = canvasEl.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1839, 800);

  ctx.font = "48px arial"
  ctx.fillStyle = "white"
  // ctx.textAlign = "center"
  ctx.fillText("SharkGPT", 800, 100)
});



// const configuration = new Configuration({
//     apiKey: OPENAI_API_KEY
// })

// delete configuration.baseOptions.headers['User-Agent'];

// const openai = new OpenAIApi(configuration)

// const judge = "Elon Musk";
// const category = "climate change";
// const pitch = "to solve climate change, I would create an artificial meat company";

// const GPT35TurboMessage = [
//   { role: "system", content: `Pretend that you are ${judge} and you are deciding between two startups to invest in` },
//   {
//     role: "system",
//     content: `The pitches from both startups will be in the ${category} space`,
//   },
//   {
//     role: "system",
//     content: `The first pitch is this: ${pitch} . Please wait for the second pitch and then decide which one you like better`,
//   },
//   { role: "user", content: question },
// ];

// let GPT35Turbo = async (message) => {
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: message,
//     });
  
//     return response.data.choices[0].message.content;
// };

// console.log("### I'm GPT-3.5-TURBO. ####", await GPT35Turbo(GPT35TurboMessage));

// console.log(baseCompletion);

// const basePromptOutput = baseCompletion.data.choices.pop();

// console.log(basePromptOutput);

