import Enemy from "./Enemy.js";

class EnemyManager {
  constructor({ state, canvas, ctx, Eater, Player }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Eater = Eater;
    this.Player = Player;
    this.enemies = [];
    this.startCreating = false;
    this.resizeFactor = undefined;
    this.updateResizeFactor({ width: 600 });
  }

  update() {
    if (this.state.gameState === 1 && this.state.gameStarted) {
      console.log(this.enemies);
      if (!this.startCreating) {
        this.startCreating = true;
        this.createEnemy();
      }

      for (const enemy of this.enemies) {
        enemy.update();
      }

      this.checkDestroy();
    } else if (this.state.gameState === 2) {
      this.enemies = [];
      this.startCreating = false;
    }
  }

  resize(beforeSize) {
    for (const enemy of this.enemies) {
      enemy.resize(beforeSize);
    }
    this.updateResizeFactor(beforeSize);
  }

  updateResizeFactor(beforeSize) {
    this.resizeFactor = this.canvas.width / beforeSize.width;
  }

  createEnemy() {
    const getRandomColor = () => {
      while (true) {
        const randomColor = {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255),
          a: 1,
        };
        const relativeLuminance =
          0.2126 * randomColor.r +
          0.7152 * randomColor.g +
          0.0772 * randomColor.b;

        if (relativeLuminance > 120) return randomColor;
      }
    };

    if (this.state.gameState !== 1 || !this.state.gameStarted) return;

    const dirs = ["up", "right", "down", "left"];
    const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
    const randomSize = Math.floor(
      Math.random() * (this.canvas.width / 6 - this.canvas.width / 5) +
        this.canvas.width / 5
    );
    const randomColor = getRandomColor();

    let randomPos = {
      x: undefined,
      y: undefined,
    };
    const randomSpeed = Math.random() * 2 + 4;

    if (randomDir === "up") {
      randomPos.x = Math.random() * this.canvas.width;
      randomPos.y = -randomSize;
    } else if (randomDir === "right") {
      randomPos.x = this.canvas.width + randomSize;
      randomPos.y = Math.random() * this.canvas.height;
    } else if (randomDir === "down") {
      randomPos.x = Math.random() * this.canvas.width;
      randomPos.y = this.canvas.height + randomSize;
    } else if (randomDir === "left") {
      randomPos.x = -randomSize;
      randomPos.y = Math.random() * this.canvas.height;
    }

    const newEnemy = new Enemy({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      data: {
        pos: randomPos,
        color: randomColor,
        size: randomSize,
        speed: randomSpeed,
      },
      Eater: this.Eater,
      Player: this.Player,
    });

    this.enemies.push(newEnemy);

    const createTimeGap = 500 - this.state.gameTime * 3;

    setTimeout(this.createEnemy.bind(this), createTimeGap);
  }

  checkDestroy() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].size < 1) {
        this.Eater.changeColor(this.enemies[i].color);
        this.Eater.size += 0.5 * this.resizeFactor;
        this.enemies.splice(i, 1);
      }
    }
  }
}

export default EnemyManager;
