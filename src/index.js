import { Configuration, OpenAIApi } from 'openai';
import OPENAI_API_KEY from '../open_ai';
import { update } from 'immutable';

const canvasEl = document.getElementById("game-canvas");
const ctx = canvasEl.getContext("2d");

function renderScreen1() {
  // clear previous screen 
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

  // background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1839, 800);

  // function drawSharks() {
  //   const sharks = document.getElementsByClassName("shark");
  //   for (let i = 0; i < sharks.length; i++) {
  //     const shark = sharks[i];
  //     const rect = shark.getBoundingClientRect();
  //     ctx.drawImage(shark, rect.left, rect.top, rect.width, rect.height);
  //   }
  // }  

  // drawSharks();

  const elements = document.getElementsByClassName("page1")
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.style.display = "block"
  }

  document.getElementById("consumer").addEventListener("click", function() {
    const category = document.getElementById("consumer").id
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.display = "none"
    }
    renderScreen2(category);
  })

  document.getElementById("enterprise").addEventListener("click", function() {
    const category = document.getElementById("enterprise").id
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.display = "none"
    }
    renderScreen2(category);
  })
}

function renderScreen2(category) {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

  const elements = document.getElementsByClassName("page2")
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    console.log(element)
    element.style.display = "block"
  }
  const spanElement = document.getElementById("span-category")
  spanElement.textContent = category;

  const form = document.getElementById("user-pitch")
  form.style.display = "block"
  let submitTimeout;
  let remainingTime = 60;

  function updateCanvas() {
    
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1839, 800);

    ctx.font = "24px arial"
    ctx.fillStyle = "white"
    ctx.fillText("Remaining Time: " + remainingTime + " seconds", 1300, 400);

  }
  updateCanvas();
  var intervalId = setInterval(function() {
    // Update the countdown variable
    remainingTime--;
  
    // Check if the countdown variable has become negative
    if (remainingTime < 0) {
      clearInterval(intervalId); // Stop the interval
      const pitch1 = document.getElementById("pitch").value
      form.style.display = "none"
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.style.display = "none"
      }
      renderScreen3(pitch1);
    } else {
      updateCanvas();
      console.log("Countdown:", remainingTime);
    }
  }, 1000);

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    // clearTimeout(formTimeout);
    clearInterval(intervalId);
    const pitch1 = document.getElementById("pitch").value
    form.style.display = "none"
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.display = "none"
    }
    renderScreen3(pitch1, category);
  });

  // document.getElementById("continue1").addEventListener("click", function() {
    //   renderScreen3();
    // })
}

function renderScreen3(pitch, category) {
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

  function playMusic() {
    musicPlayer.play();
  }

  function pauseMusic() {
    musicPlayer.pause();
  }

  document.getElementById("playButton").addEventListener("click", playMusic)
  document.getElementById("pauseButton").addEventListener("click", pauseMusic)

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
    ctx.font = "20px Arial"
    ctx.fillStyle = "white"
    ctx.fillText("The sharks are debating...", 1100, 300)

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

  // allFiveJudges()
  //   .then(() => {
  //     renderScreen4(elon, elon_score, beyonce, beyonce_score, warren, warren_score, mark, mark_score, serena, serena_score, pitch)
  // })

}

function renderScreen4(elon, elon_score, beyonce, beyonce_score, warren, warren_score, mark, mark_score, serena, serena_score, pitch) {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1839, 800);

  const elements = document.getElementsByClassName("page4")
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.style.display = "block"
  }

  const elon_image = new Image();
  elon_image.src = "./assets/screen4/elon-musk-png-image.png"

  elon_image.onload = function() {
    ctx.drawImage(elon_image, 100, 50, 250, 250)
  }
  
  const beyonce_image = new Image();
  beyonce_image.src = "./assets/screen4/beyonce-png-image.png"

  beyonce_image.onload = function() {
    ctx.drawImage(beyonce_image, 400, 50, 250, 250)
  }

  const warren_image = new Image();
  warren_image.src = "./assets/screen4/warren-png-image.png"

  warren_image.onload = function() {
    ctx.drawImage(warren_image, 750, 50, 230, 230)
  }

  const mark_image = new Image();
  mark_image.src = "./assets/screen4/mark-cuban-png.png"

  mark_image.onload = function() {
    ctx.drawImage(mark_image, 1100, 50, 300, 230)
  }

  const serena_image = new Image();
  serena_image.src = "./assets/screen4/serena-williams-png.png"

  serena_image.onload = function() {
    ctx.drawImage(serena_image, 1400, 0, 300, 370)
  }

  const textElon = document.getElementById("elon-answer")
  textElon.placeholder = `@elonmusk: ${elon}`
  if (elon_score === "1") {
    textElon.style.borderColor = "red"
  } else {
    textElon.style.borderColor = "green"
  }

  const textBeyonce = document.getElementById("beyonce-answer")
  textBeyonce.placeholder = `@beyonce: ${beyonce}`
  if (beyonce_score === "1") {
    textBeyonce.style.borderColor = "red"
  } else {
    textBeyonce.style.borderColor = "green"
  }

  const textWarren = document.getElementById("warren-answer")
  textWarren.placeholder = `@warrenbuffett: ${warren}`
  if (warren_score === "1") {
    textWarren.style.borderColor = "red"
  } else {
    textWarren.style.borderColor = "green"
  }

  const textMark = document.getElementById("mark-answer")
  textMark.placeholder = `@markcuban: ${mark}`
  if (mark_score === "1") {
    textMark.style.borderColor = "red"
  } else {
    textMark.style.borderColor = "green"
  }

  const textSerena = document.getElementById("serena-answer")
  textSerena.placeholder = `@serenawilliams: ${serena}`
  if (serena_score === "1") {
    textSerena.style.borderColor = "red"
  } else {
    textSerena.style.borderColor = "green"
  }

}
  
// renderScreen1();
// renderScreen4("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "1", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "2");
renderScreen3("sdfsd","sdfsd");






