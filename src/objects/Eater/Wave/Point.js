import { bezier } from "../../../lib/bezier-easing/index.js";

class Point {
  constructor({ state, canvas, ctx, index, radius, angle, Eater, curProb }) {
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
    this.cur = undefined;
    this.setCur(curProb);
    this.angle = this.degreeToRadian(angle);
    this.pos = {
      x: this.Eater.pos.x + this.distance * Math.cos(this.angle),
      y: this.Eater.pos.y + this.distance * Math.sin(this.angle),
    };
    this.animator = this.getAnimator(800);
  }

  update() {
    const aniEnd = this.animator();

    this.cur += this.speed.cur;
    this.distance = this.radius + Math.sin(this.cur) * this.amplitude;
    this.pos.x = this.Eater.pos.x + this.distance * Math.cos(this.angle);
    this.pos.y = this.Eater.pos.y + this.distance * Math.sin(this.angle);

    if (aniEnd) {
      this.animator = null;
      this.Eater.destroyWave();
    }
  }

  resize(beforeSize) {}

  setCur(prob) {
    if (prob > 0.5) {
      this.cur =
        this.index % 2 ? Math.random() * Math.PI : Math.random() * -Math.PI;
    } else {
      this.cur =
        this.index % 2 ? Math.random() * -Math.PI : Math.random() * Math.PI;
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
