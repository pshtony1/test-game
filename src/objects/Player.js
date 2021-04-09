class Player {
  constructor({ $target, canvas, ctx }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.size = 20;
    this.pos = {
      x: this.canvas.width / 2 - this.size / 2,
      y: this.canvas.height / 2 - this.size / 2,
    };
    this.speed = {
      h: 0,
      v: 0,
    };
    this.speedLimit = {
      lower: 0,
      upper: 3,
    };
    this.color = "red";

    this.setKey();
  }

  update() {
    this.drawPlayer();
    this.movement();
  }

  resize() {
    this.pos = {
      x: this.canvas.width / 2 - this.size / 2,
      y: this.canvas.height / 2 - this.size / 2,
    };
  }

  movement() {
    let checkDigonal = 0;
    const accelFactor = 0.5;

    // Calculate Horizontal Speed
    if (
      (this.key.left && !this.key.right) ||
      (!this.key.left && this.key.right)
    ) {
      checkDigonal += 1;
      if (this.key.left) {
        if (-this.speedLimit.upper < this.speed.h) {
          this.speed.h -= accelFactor;
        } else {
          this.speed.h = -this.speedLimit.upper;
        }
      } else {
        if (this.speed.h < this.speedLimit.upper) {
          this.speed.h += accelFactor;
        } else {
          this.speed.h = this.speedLimit.upper;
        }
      }
    } else {
      const offset = 0.1;

      if (Math.abs(this.speed.h) <= this.speedLimit.lower + offset) {
        this.speed.h = this.speedLimit.lower;
      } else {
        if (this.speed.h < this.speedLimit.lower) {
          this.speed.h += accelFactor * 2;
        } else if (this.speed.h > this.speedLimit.lower) {
          this.speed.h -= accelFactor * 2;
        }
      }
    }

    // Calculate Vertical Speed
    if ((this.key.up && !this.key.down) || (!this.key.up && this.key.down)) {
      checkDigonal += 1;
      if (this.key.up) {
        if (-this.speedLimit.upper < this.speed.v) {
          this.speed.v -= accelFactor;
        } else {
          this.speed.v = -this.speedLimit.upper;
        }
      } else {
        if (this.speed.v < this.speedLimit.upper) {
          this.speed.v += accelFactor;
        } else {
          this.speed.v = this.speedLimit.upper;
        }
      }
    } else {
      const offset = 0.2;

      if (Math.abs(this.speed.v) <= this.speedLimit.lower + offset) {
        this.speed.v = this.speedLimit.lower;
      } else {
        if (this.speed.v < this.speedLimit.lower) {
          this.speed.v += accelFactor * 2;
        } else if (this.speed.v > this.speedLimit.lower) {
          this.speed.v -= accelFactor * 2;
        }
      }
    }

    // Update Player Position based on speed
    // When Player Moving Digonaly
    if (checkDigonal === 2) {
      const slowFactor = 0.8; // Bigger than 1 / sqrt(2)

      this.pos.x += ((this.speed.h * 4) / 3) * slowFactor;
      this.pos.y += ((this.speed.v * 4) / 3) * slowFactor;
    } else {
      this.pos.x += (this.speed.h * 4) / 3;
      this.pos.y += (this.speed.v * 4) / 3;
    }
  }

  setKey() {
    const keyDownHandler = (e) => {
      const key = e.keyCode;

      if (key === 87 || key === 38) {
        this.key.up = true;
      } else if (key === 68 || key === 39) {
        this.key.right = true;
      } else if (key === 83 || key === 40) {
        this.key.down = true;
      } else if (key === 65 || key === 37) {
        this.key.left = true;
      }
    };

    const keyUpHandler = (e) => {
      const key = e.keyCode;

      if (key === 87 || key === 38) {
        this.key.up = false;
      } else if (key === 68 || key === 39) {
        this.key.right = false;
      } else if (key === 83 || key === 40) {
        this.key.down = false;
      } else if (key === 65 || key === 37) {
        this.key.left = false;
      }
    };

    this.key = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
  }

  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.rect(this.pos.x, this.pos.y, this.size, this.size);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export default Player;
