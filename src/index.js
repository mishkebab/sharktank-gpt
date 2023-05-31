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

  // text
  ctx.font = "48px arial"
  ctx.fillStyle = "white"
  // ctx.textAlign = "center"
  ctx.fillText("SharkGPT Screen 1", 650, 100)
  // ctx.fillText(gpt_response, 800, 300)

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

  const form = document.getElementById("user-pitch")
  form.style.display = "block"
  let submitTimeout;
  let remainingTime = 5;

  // let formTimeout = setTimeout(function() {
  //     const pitch1 = document.getElementById("pitch").value
  //     form.style.display = "none"
  //     renderScreen3(pitch1);
  // }, remainingTime * 1000);

  function updateCanvas() {
    
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1839, 800);
    
    ctx.font = "48px arial"
    ctx.fillStyle = "white"
    // ctx.textAlign = "center"
    ctx.fillText(`${category}`, 650, 100)


    ctx.font = "24px arial"
    ctx.fillStyle = "white"
    ctx.fillText("Remaining Time: " + remainingTime + " seconds", 1000, 400);

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
  ctx.fillText("Your Pitch:", 650, 100)

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
  
  let count = 0;

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
        content: `The second pitch is this: ${pitch} . Now please decide which pitch you liked better.`,
      }];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: GPT35TurboMessage,
    });
  
    const gpt_response = response.data.choices[0].message.content;
    return gpt_response;
  };

  let elon;
  let beyonce;
  
  async function allFiveJudges() {
    elon = await GPT_response("Elon Musk", "to solve climate change, I would create an artificial meat company");
    beyonce = await GPT_response("Beyonce", "to solve climate change, I would create an artificial meat company");
  }
  

  allFiveJudges()
    .then(() => {
      console.log("hello")
      console.log(elon)
      console.log("hello")
      console.log(beyonce)
  })
  // gpt_response = ("### I'm GPT-3.5-TURBO. ####", await GPT35Turbo(GPT35TurboMessage));

  // console.log(gpt_response)
  
//   console.log(judge)
//   console.log(category)
//   console.log(pitch)
}
  
renderScreen1();







