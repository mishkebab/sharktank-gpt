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

  function drawSharks() {
    const sharks = document.getElementsByClassName("shark");
    for (let i = 0; i < sharks.length; i++) {
      const shark = sharks[i];
      const rect = shark.getBoundingClientRect();
      ctx.drawImage(shark, rect.left, rect.top, rect.width, rect.height);
    }
  }  

  drawSharks();

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

  ctx.font = "48px arial"
  ctx.fillStyle = "white"
  ctx.fillText("Your Pitch:", 500, 100)

  // text
  const textBox = {
    text: pitch,
    fontSize: 24,
    fontFamily: "Arial",
    x: 400,
    y: 150,
    maxWidth: 600,
    lineHeight: 30,
  };

  function wrapText(text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
  
    for (var i = 0; i < words.length; i++) {
      var testLine = line + words[i] + " ";
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
  
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
  
    ctx.fillText(line, x, y);
  }

  function drawTextBox() {
    ctx.font = `${textBox.fontSize}px ${textBox.fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white"; // Set text color
    wrapText(textBox.text, textBox.x, textBox.y, textBox.maxWidth, textBox.lineHeight);
  }

  drawTextBox();
  
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY
  })
  
  delete configuration.baseOptions.headers['User-Agent'];
  
  const openai = new OpenAIApi(configuration)
  
  let GPT_response = async (judge, auto_pitch) => {
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

  let GPT_score = async (judge, auto_pitch, tweet) => {
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
        content: `The second pitch is this: ${pitch} . Here was the response you already generated: ${tweet}. Based on this pre-written response, if you liked the first pitch the best, only print the number 1. If it was the second pitch, only print the number 2. Don't print any other text, just the number indicating your choice.`,
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
  
  async function allFiveJudges() {
    ctx.font = "20px Arial"
    ctx.fillStyle = "white"
    ctx.fillText("The sharks are debating...", 1100, 300)

    elon = await GPT_response("Elon Musk", "sustainable footwear made from premium natural materials, designed for everyday wear");
    console.log(elon)
    elon_score = await GPT_score("Elon Musk", "sustainable footwear made from premium natural materials, designed for everyday wear", elon) 
    console.log(elon_score)
    beyonce = await GPT_response("Beyonce", "sustainable footwear made from premium natural materials, designed for everyday wear");
    console.log(beyonce)
    beyonce_score = await GPT_score("Beyonce", "sustainable footwear made from premium natural materials, designed for everyday wear", beyonce)  
    console.log(beyonce_score)
  }  

  allFiveJudges()
    .then(() => {
      renderScreen4(elon, elon_score, beyonce, beyonce_score, pitch)
  })

}

function renderScreen4(elon, elon_score, beyonce, beyonce_score, pitch) {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1839, 800);

  ctx.font = "48px arial"
  ctx.fillStyle = "white"
  ctx.fillText("Results:", 650, 100)

  const elements = document.getElementsByClassName("page4")
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.style.display = "block"
  }

  const elon_image = new Image();
  elon_image.src = "./assets/screen4/elon-musk-png-image.png"

  elon_image.onload = function() {
    ctx.drawImage(elon_image, 100, 100, 250, 250)
  }
  
  const beyonce_image = new Image();
  beyonce_image.src = "./assets/screen4/beyonce-png-image.png"

  beyonce_image.onload = function() {
    ctx.drawImage(beyonce_image, 400, 100, 250, 250)
  }

  const textElon = document.getElementById("elon-answer")
  textElon.placeholder = elon
  if (elon_score === "1") {
    textElon.style.borderColor = "red"
  } else {
    textElon.style.borderColor = "green"
  }

  const textBeyonce = document.getElementById("beyonce-answer")
  textBeyonce.placeholder = beyonce
  if (beyonce_score === "1") {
    textBeyonce.style.borderColor = "red"
  } else {
    textBeyonce.style.borderColor = "green"
  }


  // console.log(elon)
  // console.log(beyonce)
}
  
renderScreen1();
// renderScreen4("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "1", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "2");







