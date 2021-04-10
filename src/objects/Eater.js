import { bezier } from "../lib/bezier-easing/index.js";

class Eater {
  constructor({ state, canvas, ctx, Player }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.size = 0;
    this.pos = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
    this.Player = Player;
    this.isColliding = false;
    this.eaterState = 0;
    this.eaterAnimator = null;
    this.color = {
      r: 255,
      g: 99,
      b: 71,
      a: 0,
    };
  }

  update() {
    if (this.state.gameState === 1) {
      this.draw();
      this.checkCollide();

      if (this.eaterState === 0 && !this.eaterAnimator) {
        this.eaterAnimator = this.getEaterAnimate(this.canvas.width / 60, 550, [
          0.22,
          0.68,
          0,
          1,
        ]);

        this.Player.canMove = false;
      } else if (this.eaterState === 0 && this.eaterAnimator) {
        const aniEnd = this.eaterAnimator();

        if (aniEnd) {
          this.eaterState = 1;
          this.eaterAnimator = null;
          this.Player.canMove = true;
        }
      }
    } else if (this.state.gameState === 2) {
      // initialize variables
      this.size = 0;
      this.eaterState = 0;
      this.opacity = 0;
    }
  }

  resize(beforeSize) {
    this.pos = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };

    this.size *= this.canvas.width / beforeSize.width;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    this.ctx.fill();
    this.ctx.closePath();
  }

  checkCollide() {
    const calcDist = () => {
      return Math.sqrt(
        (this.pos.x - (this.Player.pos.x + this.Player.size / 2)) ** 2 +
          (this.pos.y - (this.Player.pos.y + this.Player.size / 2)) ** 2
      );
    };

    const calcPlayerRadius = () => {
      return (Math.sqrt(2) * this.Player.size) / 2;
    };

    const offset = 3;

    if (calcDist() + offset < this.size + calcPlayerRadius()) {
      if (!this.isColliding) {
        this.state.stateChanging = true;
      }
    } else {
      this.isColliding = false;
    }
  }

  getEaterAnimate(toSize, duration = 1000, easing = [0, 0, 1, 1]) {
    const startTime = new Date().getTime();

    const animate = () => {
      const curTime = new Date().getTime();
      const timeRate = (curTime - startTime) / duration;

      if (timeRate < 1) {
        const bezierEasing = bezier(...easing);
        this.size = toSize * bezierEasing(timeRate);
        this.color.a = 0.5 + 0.5 * bezierEasing(timeRate);

        return false;
      } else {
        return true;
      }
    };

    return animate;
  }
}

export default Eater;
