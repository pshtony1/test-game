import Frame from "./objects/Frame.js";
import Player from "./objects/Player.js";
import Text from "./objects/Text.js";
import Colorboxes from "./objects/Colorbox/Colorboxes.js";
import Eater from "./objects/Eater.js";

class App {
  constructor($target) {
    this.$target = $target;
    this.renderCanvas.call(this);
    this.FPS = 60;
    this.state = {
      gameState: 0,
      stateChanging: false,
    };
    this.beforeSize = {
      width: this.canvas.width,
      height: this.canvas.height,
    };

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.Player = new Player({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
    });
    this.Frame = new Frame({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Player: this.Player,
    });
    this.Text = new Text({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Frame: this.Frame,
    });
    this.Colorboxes = new Colorboxes({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Frame: this.Frame,
      Player: this.Player,
      Text: this.Text,
    });
    this.Eater = new Eater({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Player: this.Player,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.Frame.update();
    if (!this.state.stateChanging) {
      this.Colorboxes.update();
      this.Player.update();
      this.Eater.update();
    }
    this.Text.update();

    requestAnimationFrame(this.update.bind(this));
  }

  resize() {
    const canvasRect = this.canvas.getBoundingClientRect();

    this.canvas.width = canvasRect.width;
    this.canvas.height = canvasRect.height;

    if (this.Frame) this.Frame.resize(Object.assign(this.beforeSize));
    if (this.Player) this.Player.resize(Object.assign(this.beforeSize));
    if (this.Text) this.Text.resize(Object.assign(this.beforeSize));
    if (this.Colorboxes) this.Colorboxes.resize(Object.assign(this.beforeSize));
    if (this.Eater) this.Eater.resize(Object.assign(this.beforeSize));

    this.beforeSize.width = this.canvas.width;
    this.beforeSize.height = this.canvas.height;
  }

  renderCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "game-screen";

    this.ctx = this.canvas.getContext("2d");

    this.$target.appendChild(this.canvas);
  }
}

export default App;
