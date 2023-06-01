export function renderScreen4(elon, elon_score, beyonce, beyonce_score, warren, warren_score, mark, mark_score, serena, serena_score, pitch) {
    const canvasEl = document.getElementById("game-canvas");
    const ctx = canvasEl.getContext("2d");
    
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
      ctx.drawImage(warren_image, 800, 50, 230, 230)
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

    const congrats = document.getElementById("congrats-heading");
    const sorry = document.getElementById("sorry-heading");


    if ((parseInt(elon_score) + parseInt(beyonce_score) + parseInt(warren_score) + parseInt(mark_score) + parseInt(serena_score)) >= 8) {
        console.log(congrats)
        congrats.style.display = "block"
    } else {
        sorry.style.display = "block"
    }
  
  }