class Frame {
  constructor({ $target, canvas, ctx, Player }) {
    this.$target = $target;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Player = Player;

    this.thickness = 4;
    this.frameRect = {
      x: Math.floor(this.canvas.width / 4 - this.thickness / 2),
      y: Math.floor(this.canvas.height / 4 - this.thickness / 2),
      width: this.canvas.width / 2,
      height: this.canvas.height / 2,
    };
  }

  update(type = "main") {
    if (type === "main") {
      this.drawMainFrame();
      this.checkCollide();
    }
  }

  resize() {
    this.frameRect = {
      x: this.canvas.width / 4 - this.thickness / 2,
      y: this.canvas.height / 4 - this.thickness / 2,
      width: this.canvas.width / 2,
      height: this.canvas.height / 2,
    };
  }

  drawMainFrame() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = this.thickness;

    this.ctx.strokeRect(
      this.frameRect.x,
      this.frameRect.y,
      this.frameRect.width,
      this.frameRect.height
    );

    this.ctx.stroke();
    this.ctx.closePath();
  }

  checkCollide() {
    if (
      this.Player.pos.x + this.Player.size >
      this.frameRect.x + this.frameRect.width - this.thickness / 2
    ) {
      this.Player.pos.x =
        this.frameRect.x +
        this.frameRect.width -
        this.Player.size -
        this.thickness / 2;
      this.Player.speed.h = 0;
    }

    if (this.Player.pos.x < this.frameRect.x + this.thickness / 2) {
      this.Player.pos.x = this.frameRect.x + this.thickness / 2;
      this.Player.speed.h = 0;
    }

    if (
      this.Player.pos.y + this.Player.size >
      this.frameRect.y + this.frameRect.height - this.thickness / 2
    ) {
      this.Player.pos.y =
        this.frameRect.y +
        this.frameRect.height -
        this.Player.size -
        this.thickness / 2;
      this.Player.speed.v = 0;
    }

    if (this.Player.pos.y < this.frameRect.y + this.thickness / 2) {
      this.Player.pos.y = this.frameRect.y + this.thickness / 2;
      this.Player.speed.v = 0;
    }
  }
}

export default Frame;
