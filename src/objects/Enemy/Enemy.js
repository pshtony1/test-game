class Enemy {
  constructor({ state, canvas, ctx, data, Eater, Player }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.pos = data.pos;
    this.color = data.color;
    this.size = data.size;
    this.speed = data.speed;
    this.Eater = Eater;
    this.Player = Player;
    this.resizeFactor = undefined;
    this.updateResizeFactor({ width: 600 });
    this.sizeUpdater = this.getSizeUpdater();
  }

  update() {
    this.draw();
    this.movement();
    this.sizeUpdater();
    this.checkCollide();
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
    this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    this.ctx.fill();
    this.ctx.closePath();
  }

  movement() {
    let dirX = this.Eater.pos.x - this.pos.x;
    let dirY = this.Eater.pos.y - this.pos.y;
    const dist = Math.sqrt(dirX ** 2 + dirY ** 2);

    dirX /= dist;
    dirY /= dist;

    this.pos.x += dirX * this.speed * this.resizeFactor;
    this.pos.y += dirY * this.speed * this.resizeFactor;
  }

  getDistanceBetweenEater() {
    const distX = this.Eater.pos.x - this.pos.x;
    const distY = this.Eater.pos.y - this.pos.y;

    return Math.sqrt(distX ** 2 + distY ** 2) - this.Eater.size + 3;
  }

  getSizeUpdater() {
    const bornSize = this.size;
    const bornDist = this.getDistanceBetweenEater();

    const sizeUpdater = () => {
      const curDist = this.getDistanceBetweenEater();
      let sizeFactor = curDist / bornDist;
      this.size = bornSize * sizeFactor;
    };

    return sizeUpdater;
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
      }
    } else {
      this.isColliding = false;
    }
  }
}

export default Enemy;
