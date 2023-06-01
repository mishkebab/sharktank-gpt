export function renderScreen1(canvasEl, ctx, renderScreen2, renderScreen3, renderScreen4) {
    // clear previous screen 
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  
    // background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1839, 800);
  
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
      renderScreen2(category, renderScreen3, renderScreen4);
    })
  
    document.getElementById("enterprise").addEventListener("click", function() {
      const category = document.getElementById("enterprise").id
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.style.display = "none"
      }
      renderScreen2(category, renderScreen3, renderScreen4);
    })
  }