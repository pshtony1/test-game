import { bezier } from "../lib/bezier-easing/index.js";

class Eater {
  constructor({ state, canvas, ctx, Player, Text, Frame }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.size = 0;
    this.gScale = 1.5;
    this.pos = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
    this.Player = Player;
    this.Text = Text;
    this.Frame = Frame;
    this.isColliding = false;
    this.eaterState = 0;
    this.eaterAnimator = null;
    this.eaterColorAnimator = null;
    this.color = {
      r: 255,
      g: 99,
      b: 71,
      a: 0,
    };
    this.resizeFactor = undefined;
    this.updateResizeFactor({ width: 600 });
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
          this.state.gameStarted = true;
        }
      } else if (this.eaterState === 1) {
        this.gravitate();

        if (this.eaterColorAnimator) {
          const aniEnd = this.eaterColorAnimator();

          if (aniEnd) {
            this.eaterColorAnimator = null;
          }
        }
      }
    } else if (this.state.gameState === 2) {
      // initialize variables
      this.size = 0;
      this.eaterState = 0;
      this.opacity = 0;
      this.color = {
        r: 255,
        g: 99,
        b: 71,
        a: 0,
      };
    }
  }

  resize(beforeSize) {
    this.pos = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };

    this.size *= this.canvas.width / beforeSize.width;
    this.updateResizeFactor(beforeSize);
  }

  updateResizeFactor(beforeSize) {
    this.resizeFactor = this.canvas.width / beforeSize.width;
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
        this.state.gameState = 2;
        this.Frame.frameAnimator = null;
      }
    } else {
      this.isColliding = false;
    }
  }

  getEaterAnimate(toSize, duration = 1000, easing = [0, 0, 1, 1]) {
    const startTime = new Date().getTime();
    const bezierEasing = bezier(...easing);

    const animate = () => {
      const curTime = new Date().getTime();
      const timeRate = (curTime - startTime) / duration;

      if (timeRate < 1) {
        this.size = toSize * bezierEasing(timeRate);
        this.color.a = 0.5 + 0.5 * bezierEasing(timeRate);

        return false;
      } else {
        return true;
      }
    };

    return animate;
  }

  getEaterColorAnimate(toColor, duration = 1000, easing = [0, 0, 1, 1]) {
    const startTime = new Date().getTime();
    const bezierEasing = bezier(...easing);

    const animate = () => {
      const curTime = new Date().getTime();
      const timeRate = (curTime - startTime) / duration;

      if (timeRate < 1) {
        this.color.r =
          toColor.r > this.color.r
            ? Math.abs(toColor.r - this.color.r) * bezierEasing(timeRate) +
              this.color.r
            : this.color.r -
              Math.abs(toColor.r - this.color.r) * bezierEasing(timeRate);
        this.color.g =
          toColor.g > this.color.g
            ? Math.abs(toColor.g - this.color.g) * bezierEasing(timeRate) +
              this.color.g
            : this.color.g -
              Math.abs(toColor.g - this.color.g) * bezierEasing(timeRate);
        this.color.b =
          toColor.b > this.color.b
            ? Math.abs(toColor.b - this.color.b) * bezierEasing(timeRate) +
              this.color.b
            : this.color.b -
              Math.abs(toColor.b - this.color.b) * bezierEasing(timeRate);

        return false;
      } else {
        return true;
      }
    };

    return animate;
  }

  gravitate() {
    const maxGScale = 2;
    const minGScale = 0.8;

    let gX = this.pos.x - (this.Player.pos.x + this.Player.size / 2);
    let gY = this.pos.y - (this.Player.pos.y + this.Player.size / 2);
    const dist = Math.sqrt(gX ** 2 + gY ** 2);
    const maxDist =
      Math.sqrt(
        this.Frame.frameRect.width ** 2 + this.Frame.frameRect.height ** 2
      ) / 2;

    this.gScale =
      ((maxDist - dist) / maxDist) * (maxGScale - minGScale) + minGScale;
    this.gScale *= this.resizeFactor;

    gX /= dist;
    gX *= this.gScale;

    gY /= dist;
    gY *= this.gScale;

    this.Player.pos.x += gX;
    this.Player.pos.y += gY;
  }

  changeColor(colorObj) {
    this.eaterColorAnimator = this.getEaterColorAnimate(colorObj, 1000, [
      0.22,
      0.68,
      0,
      1,
    ]);
  }
}

export default Eater;
