import Frame from "./objects/Frame.js";
import Player from "./objects/Player.js";

class App {
  constructor($target) {
    this.$target = $target;
    this.renderCanvas.bind(this)();
    this.FPS = 60;

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.Player = new Player({ $target, canvas: this.canvas, ctx: this.ctx });
    this.Frame = new Frame({
      $target,
      canvas: this.canvas,
      ctx: this.ctx,
      Player: this.Player,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.Frame.update();
    this.Player.update();

    requestAnimationFrame(this.update.bind(this));
  }

  resize() {
    const canvasRect = this.canvas.getBoundingClientRect();

    this.canvas.width = canvasRect.width;
    this.canvas.height = canvasRect.height;

    if (this.Frame) this.Frame.resize();
    if (this.Player) this.Player.resize();
  }

  renderCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "game-screen";

    this.ctx = this.canvas.getContext("2d");

    this.$target.appendChild(this.canvas);
  }
}

export default App;
