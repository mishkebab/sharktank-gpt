export function renderScreen2(category, renderScreen3, renderScreen4) {
    const canvasEl = document.getElementById("game-canvas");
    const ctx = canvasEl.getContext("2d");

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  
    const elements = document.getElementsByClassName("page2")
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.display = "block"
    }
    const spanElement = document.getElementById("span-category")
    spanElement.textContent = category;
  
    const form = document.getElementById("user-pitch")
    form.style.display = "block"
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
        renderScreen3(pitch1, category, renderScreen4);
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
      renderScreen3(pitch1, category, renderScreen4);
    });
  
    // document.getElementById("continue1").addEventListener("click", function() {
      //   renderScreen3();
      // })
  }