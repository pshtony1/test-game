class Frame {
  constructor({ $target, canvas, ctx, Player }) {
    this.$target = $target;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Player = Player;

    this.state = 0;
    this.stateChanging = false;
    this.thickness = 4;
    this.frameRect = {
      x: Math.floor(this.canvas.width / 4 - this.thickness / 2),
      y: Math.floor(this.canvas.height / 4 - this.thickness / 2),
      width: this.canvas.width / 2,
      height: this.canvas.height / 2,
    };

    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 32 && !this.stateChanging) {
        this.stateChanging = true;
      }
    });
  }

  update() {
    if (this.state === 0) {
      this.drawMainFrame();
      if (!this.stateChanging) {
        this.checkCollide();
      } else {
        const animate = this.getFrameAnimate(
          {
            toWidth: "80%",
            toHeight: "50%",
          },
          {
            x: this.canvas.width / 2 - this.Player.size / 2,
            y: this.canvas.height / 2 - this.Player.size / 2 + 100,
          }
        );

        const isAniEnd = animate();

        if (isAniEnd) {
          this.stateChanging = false;
          this.state = 1;
        }
      }
    } else if (this.state === 1) {
      this.drawMainFrame();
      this.checkCollide();
    }
  }

  resize(beforeSize) {
    this.frameRect.width *= this.canvas.width / beforeSize.width;
    this.frameRect.height *= this.canvas.height / beforeSize.height;
    this.frameRect.x =
      (this.canvas.width - this.frameRect.width) / 2 - this.thickness / 2;
    this.frameRect.y =
      (this.canvas.height - this.frameRect.height) / 2 - this.thickness / 2;
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

  getFrameAnimate({ toWidth, toHeight }, initPlayerPos = null) {
    if (typeof toWidth === "string") {
      toWidth =
        (this.canvas.width * parseInt(toWidth.slice(0, toWidth.length - 1))) /
        100;
    }

    if (typeof toHeight === "string") {
      toHeight =
        (this.canvas.height *
          parseInt(toHeight.slice(0, toHeight.length - 1))) /
        100;
    }

    const endPoint = {
      x: (this.canvas.width - toWidth) / 2 - this.thickness / 2,
      y: (this.canvas.height - toHeight) / 2 - this.thickness / 2,
      width: toWidth,
      height: toHeight,
    };
    const speed = 8;

    const animate = () => {
      if (Math.abs(endPoint.x - this.frameRect.x) >= 1) {
        this.frameRect.x += (endPoint.x - this.frameRect.x) / speed;
        this.frameRect.width += (endPoint.width - this.frameRect.width) / speed;
        this.frameRect.y += (endPoint.y - this.frameRect.y) / speed;
        this.frameRect.height +=
          (endPoint.height - this.frameRect.height) / speed;
        return false;
      } else {
        this.frameRect.x = endPoint.x;
        this.frameRect.width = endPoint.width;
        this.frameRect.y = endPoint.y;
        this.frameRect.height = endPoint.height;

        if (initPlayerPos) {
          this.Player.pos = {
            x: initPlayerPos.x,
            y: initPlayerPos.y,
          };
        }

        return true;
      }
    };

    return animate;
  }
}

export default Frame;
