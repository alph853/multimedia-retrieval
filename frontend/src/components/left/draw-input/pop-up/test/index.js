const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
const airplane = document.getElementById("airplane")

let img = new Image()
img.src = airplane.src

airplane.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "airplane")
})

canvas.addEventListener("dragover", (e) => {
  e.preventDefault() // Necessary to allow a drop
})

canvas.addEventListener("drop", (e) => {
  e.preventDefault()
  const x = e.offsetX
  const y = e.offsetY
  ctx.drawImage(img, x - img.width / 2, y - img.height / 2)
})
