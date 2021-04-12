import Frame from "./objects/Frame.js";
import Player from "./objects/Player.js";
import Text from "./objects/Text.js";
import ColorboxManager from "./objects/Colorbox/ColorboxManager.js";
import Eater from "./objects/Eater.js";
import Timer from "./utils/Timer.js";
import EnemyManager from "./objects/Enemy/EnemyManager.js";
import EffectManager from "./objects/Effect/EffectManager.js";

class App {
  constructor($target) {
    this.$target = $target;
    this.renderCanvas.call(this);
    this.FPS = 60;
    this.state = {
      gameState: 0,
      stateChanging: false,
      gameStarted: false,
      bestTime: (0).toFixed(2),
      gameTime: (0).toFixed(2),
    };
    this.beforeSize = {
      width: this.canvas.width,
      height: this.canvas.height,
    };

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.EffectManager = new EffectManager({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
    });
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
    this.ColorboxManager = new ColorboxManager({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Frame: this.Frame,
      Player: this.Player,
      Text: this.Text,
      EffectManager: this.EffectManager,
    });
    this.Eater = new Eater({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Player: this.Player,
      Text: this.Text,
      Frame: this.Frame,
    });
    this.Timer = new Timer({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
    });
    this.EnemyManager = new EnemyManager({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      Eater: this.Eater,
      Player: this.Player,
      EffectManager: this.EffectManager,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.Frame.update();
    if (!this.state.stateChanging) {
      this.ColorboxManager.update();
      this.Player.update();
      this.Eater.update();
      this.EnemyManager.update();
    }
    this.EffectManager.update();
    this.Text.update();
    this.Timer.update();

    requestAnimationFrame(this.update.bind(this));
  }

  resize() {
    const canvasRect = this.canvas.getBoundingClientRect();

    this.canvas.width = canvasRect.width;
    this.canvas.height = canvasRect.height;

    if (this.Frame) this.Frame.resize(Object.assign({}, this.beforeSize));
    if (this.Player) this.Player.resize(Object.assign({}, this.beforeSize));
    if (this.Text) this.Text.resize(Object.assign({}, this.beforeSize));
    if (this.ColorboxManager)
      this.ColorboxManager.resize(Object.assign({}, this.beforeSize));
    if (this.Eater) this.Eater.resize(Object.assign({}, this.beforeSize));
    if (this.EnemyManager)
      this.EnemyManager.resize(Object.assign({}, this.beforeSize));
    if (this.EffectManager)
      this.EffectManager.resize(Object.assign({}, this.beforeSize));

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
