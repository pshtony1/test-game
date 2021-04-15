import { bezier } from "../../../lib/bezier-easing/index.js";

class Point {
  constructor({ state, canvas, ctx, index, radius, angle, Eater }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Eater = Eater;
    this.index = index;
    this.radius = radius;
    this.distance = radius;
    this.speed = {
      cur: 0.3,
      max: 0.3,
      min: 0.1,
    };
    this.amplitude = this.Eater.size / 10;
    this.amplitudeFactor = Math.random() * 0.6 + 0.7;
    this.cur = undefined;
    this.angle = this.degreeToRadian(angle);
    this.pos = {
      x: this.Eater.pos.x + this.distance * Math.cos(this.angle),
      y: this.Eater.pos.y + this.distance * Math.sin(this.angle),
    };
    this.resizeFactor = undefined;
    this.updateResizeFactor({ width: 600 });

    this.animator = this.getAnimator(800);
  }

  update() {
    const aniEnd = this.animator();

    this.cur += this.speed.cur * this.resizeFactor;
    this.distance =
      this.radius + Math.sin(this.cur) * this.amplitude * this.amplitudeFactor;
    this.pos.x = this.Eater.pos.x + this.distance * Math.cos(this.angle);
    this.pos.y = this.Eater.pos.y + this.distance * Math.sin(this.angle);

    if (aniEnd) {
      this.animator = null;
      this.Eater.destroyWave();
    }
  }

  resize(beforeSize) {
    this.amplitude = this.Eater.size / 10;
    this.updateResizeFactor(beforeSize);
  }

  updateResizeFactor(beforeSize) {
    this.resizeFactor = this.canvas.width / beforeSize.width;
  }

  setCurAndAmplitude(isConcave, isClosePosition = false) {
    if (isConcave) {
      this.cur = isClosePosition ? -Math.PI / 2 : Math.random() * -Math.PI;
    } else {
      this.cur = isClosePosition ? Math.PI / 2 : Math.random() * Math.PI;
    }

    if (isClosePosition) {
      if (isConcave) {
        this.amplitudeFactor = 4.5;
      } else {
        this.amplitudeFactor = 2.8;
      }
    }
  }

  degreeToRadian(degree) {
    return (degree * Math.PI) / 180;
  }

  getAnimator(duration = 1000, easing = [0, 0, 1, 1]) {
    const startAmplitude = this.amplitude;
    const startTime = new Date();
    const bezierEasing = bezier(...easing);

    const animator = () => {
      const curTime = new Date();
      const timeRate = (curTime - startTime) / duration;

      if (timeRate < 1) {
        this.speed.cur =
          bezierEasing(1 - timeRate) * (this.speed.max - this.speed.min) +
          this.speed.min;
        this.amplitude = bezierEasing(1 - timeRate) * startAmplitude;

        return false;
      } else {
        return true;
      }
    };

    return animator;
  }
}

export default Point;
