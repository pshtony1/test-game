import Point from "./Point.js";

class Wave {
  constructor({ state, canvas, ctx, totalPoints, Eater, color, enemyPos }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.totalPoints = totalPoints;
    this.Eater = Eater;
    this.color = color;
    this.enemyPos = enemyPos;
    this.points = [];

    this.createPoints();
  }

  update() {
    for (const point of this.points) {
      point.update();
    }

    this.draw();
  }

  resize(beforeSize) {
    for (const point of this.points) {
      point.resize(beforeSize);
    }
  }

  draw() {
    this.ctx.beginPath();

    this.ctx.moveTo(
      (this.points[this.totalPoints - 1].pos.x + this.points[0].pos.x) / 2,
      (this.points[this.totalPoints - 1].pos.y + this.points[0].pos.y) / 2
    );

    for (let i = 0; i < this.totalPoints; i++) {
      const controllX = this.points[i].pos.x;
      const controllY = this.points[i].pos.y;
      const nextIdx = i === this.totalPoints - 1 ? 0 : i + 1;
      const toX = (this.points[i].pos.x + this.points[nextIdx].pos.x) / 2;
      const toY = (this.points[i].pos.y + this.points[nextIdx].pos.y) / 2;

      this.ctx.quadraticCurveTo(controllX, controllY, toX, toY);
    }

    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    this.ctx.fill();

    this.ctx.closePath();
  }

  createPoints() {
    const getDistance = (point) => {
      return Math.sqrt(
        (this.enemyPos.x - point.pos.x) ** 2 +
          (this.enemyPos.y - point.pos.y) ** 2
      );
    };

    let closePointIdx = undefined;
    let closeDist = Infinity;

    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point({
        state: this.state,
        canvas: this.canvas,
        ctx: this.ctx,
        index: i,
        radius: this.Eater.size,
        angle: i * (360 / this.totalPoints),
        Eater: this.Eater,
      });

      this.points.push(point);

      const dist = getDistance(point);
      if (dist < closeDist) {
        closePointIdx = i;
        closeDist = dist;
      }
    }

    for (let i = 0; i < this.totalPoints; i++) {
      if (i % 2 === closePointIdx % 2) {
        if (i === closePointIdx) {
          this.points[i].setCurAndAmplitude(true, true);
        } else {
          this.points[i].setCurAndAmplitude(true);
        }
      } else {
        if (
          (closePointIdx !== this.totalPoints - 1 && i === closePointIdx + 1) ||
          (closePointIdx !== 0 && i === closePointIdx - 1)
        ) {
          this.points[i].setCurAndAmplitude(false, true);
        } else if (
          (closePointIdx === this.totalPoints - 1 && i === 0) ||
          (closePointIdx === 0 && i === this.totalPoints - 1)
        ) {
          this.points[i].setCurAndAmplitude(false, true);
        } else {
          this.points[i].setCurAndAmplitude(false);
        }
      }
    }
  }
}

export default Wave;
