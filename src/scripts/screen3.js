import { Configuration, OpenAIApi } from 'openai';
import OPENAI_API_KEY from '../../open_ai';
import { update } from 'immutable';

export function renderScreen3(pitch, category, renderScreen4) {
    const canvasEl = document.getElementById("game-canvas");
    const ctx = canvasEl.getContext("2d");

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    
    // background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1839, 800);
    
    const elements = document.getElementsByClassName("page3")
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      console.log(element)
      element.style.display = "block"
    }
    
    const musicPlayer = document.getElementById('musicPlayer');
    let playButton = document.getElementById("playButton")
    
    function playMusic() {
      musicPlayer.play();
    }
  
    // playMusic();
  
    let pageMusic = document.addEventListener("mousemove", playMusic);
    
    function pauseMusic() {
      musicPlayer.pause();
    }
  
    playButton.addEventListener("click", function() {
      pauseMusic;
      pageMusic.remove();
      console.log(pageMusic)
    })
    // text
    const submittedPitch = document.getElementById("submitted-pitch")
    submittedPitch.placeholder = pitch;
    // submittedPitch.style.borderColor = "red"
    // submittedPitch.style.borderColor = "green"
    
    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY
    })
    
    delete configuration.baseOptions.headers['User-Agent'];
    
    const openai = new OpenAIApi(configuration)
  
    let auto_pitch;
  
    if (category === "consumer") {
      auto_pitch = "sustainable footwear made from premium natural materials, designed for everyday wear";
    } else {
      auto_pitch = "enterprise thingy";
    }
    
    let GPT_response = async (judge) => {
      console.log(auto_pitch)
      const GPT35TurboMessage = [
        { role: "system", content: `Pretend that you are ${judge} and you are deciding between two startups to invest in` },
        {
          role: "system",
          content: `The pitches from both startups will be in the ${category} space`,
        },
        {
          role: "system",
          content: `The first pitch is this: ${auto_pitch} . Please wait for the second pitch and then decide which one you like better`,
        },
        {
          role: "system",
          content: `The second pitch is this: ${pitch} . Now please decide which pitch you liked better and write a summary of your decision as a tweet.`,
        }];
  
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: GPT35TurboMessage,
      });
    
      const gpt_response = response.data.choices[0].message.content;
      return gpt_response;
    };
  
    let GPT_score = async (judge, tweet) => {
      const GPT35TurboMessage = [
        { role: "system", content: `Pretend that you are ${judge} and you are deciding between two startups to invest in` },
        {
          role: "system",
          content: `The pitches from both startups will be in the ${category} space`,
        },
        {
          role: "system",
          content: `The first pitch is this: ${auto_pitch}. The second pitch is this: ${pitch} . Here is your response: ${tweet}. Based on this pre-written response, if you decided to invest in the first pitch, only print the number 1. If you decided to invest in the second pitch, only print the number 2. Don't print any other text, just the number indicating your choice.`,
        }];
  
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: GPT35TurboMessage,
      });
    
      const gpt_response = response.data.choices[0].message.content;
      return gpt_response;
    };
  
    let elon;
    let elon_score;
    let beyonce;
    let beyonce_score;
    let warren;
    let warren_score;
    let mark;
    let mark_score;
    let serena;
    let serena_score;
    
    async function allFiveJudges() {
      elon = await GPT_response("Elon Musk");
      elon_score = await GPT_score("Elon Musk", elon) 
      beyonce = await GPT_response("Beyonce");
      beyonce_score = await GPT_score("Beyonce", beyonce)  
      warren = await GPT_response("Warren Buffett");
      warren_score = await GPT_score("Warren Buffett", warren)  
      mark = await GPT_response("Mark Cuban")
      mark_score = await GPT_score("Mark Cuban", mark)
      serena = await GPT_response("Serena Williams")
      serena_score = await GPT_score("Serena Williams", serena)
    }  
  
    allFiveJudges()
      .then(() => {
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              element.style.display = "none"
            }
        renderScreen4(elon, elon_score, beyonce, beyonce_score, warren, warren_score, mark, mark_score, serena, serena_score, pitch)
    })
  
  }