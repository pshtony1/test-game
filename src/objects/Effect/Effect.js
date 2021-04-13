import { bezier } from "../../lib/bezier-easing/index.js";

class Effect {
  constructor({ state, canvas, ctx, data, easing }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.pos = data.pos;
    this.color = data.color;
    this.size = data.size;
    this.spreadSpeed = data.spreadSpeed;
    this.lifeTime = data.lifeTime;
    this.thickness = data.thickness;
    this.resizeFactor = undefined;
    this.updateResizeFactor({ width: 600 });
    this.effectUpdater = this.getEffectUpdater(easing);
  }

  update() {
    this.draw();

    if (this.effectUpdater) {
      const aniEnd = this.effectUpdater();

      if (aniEnd) {
        this.effectUpdater = null;
      }
    }
  }

  resize(beforeSize) {
    this.pos.x *= this.canvas.width / beforeSize.width;
    this.pos.y *= this.canvas.height / beforeSize.height;
    this.size *= this.canvas.width / beforeSize.width;
    this.updateResizeFactor(beforeSize);
  }

  updateResizeFactor(beforeSize) {
    this.resizeFactor = this.canvas.width / beforeSize.width;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    this.ctx.lineWidth = this.thickness;
    this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  getEffectUpdater(easing = [0, 0, 1, 1]) {
    const bezierEasing = bezier(...easing);
    const startTime = new Date();
    const startSpeed = this.spreadSpeed;
    const startThickness = this.thickness;

    const updater = () => {
      const curTime = new Date();
      const timeRate = (curTime - startTime) / this.lifeTime;
      const bezierRate = bezierEasing(timeRate);

      if (timeRate < 1) {
        this.size += this.spreadSpeed;
        this.spreadSpeed = startSpeed * this.resizeFactor * (1 - bezierRate);
        this.thickness = startThickness * this.resizeFactor * (1 - bezierRate);
        this.color.a = 1 - bezierRate;

        if (this.thickness < 4) this.thickness = 4;

        return false;
      } else {
        return true;
      }
    };

    return updater;
  }
}

export default Effect;
