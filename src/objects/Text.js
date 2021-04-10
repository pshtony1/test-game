class Text {
  constructor({ state, canvas, ctx, Frame }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.titleFont = {
      size: 30,
      maxSize: 30,
      name: "Comic Sans MS",
      color: "white",
    };
    this.subTitleFont = {
      size: 20,
      maxSize: 20,
      name: "Comic Sans MS",
      color: "rgba(255, 255, 255, 0.6)",
    };
    this.BestTimeFont = {
      size: 20,
      maxSize: 20,
      name: "Comic Sans MS",
      color: "#ffcc00",
    };
    this.Frame = Frame;
    this.isResized = false;

    this.initFontSize();
  }

  update() {
    this.drawText();
  }

  resize(beforeSize, isEvent = true) {
    this.titleFont.size *= this.canvas.width / beforeSize.width;
    this.subTitleFont.size *= this.canvas.width / beforeSize.width;
    this.BestTimeFont.size *= this.canvas.width / beforeSize.width;

    if (this.titleFont.size > this.titleFont.maxSize) {
      this.titleFont.size = this.titleFont.maxSize;
    }

    if (this.subTitleFont.size > this.subTitleFont.maxSize) {
      this.subTitleFont.size = this.subTitleFont.maxSize;
    }

    if (this.BestTimeFont.size > this.BestTimeFont.maxSize) {
      this.BestTimeFont.size = this.BestTimeFont.maxSize;
    }

    if (isEvent) this.isResized = true;
  }

  initFontSize() {
    this.resize({ width: 600 }, false);
  }

  drawText() {
    if (this.state.gameState === 0 && !this.state.stateChanging) {
      this.drawTitle();
      this.drawSubTitle();
    }
    this.drawBestTime();
  }

  drawTitle() {
    this.ctx.font = `${this.titleFont.size}px ${this.titleFont.name}`;
    this.ctx.fillStyle = this.titleFont.color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Avoid Blobs!",
      this.canvas.width / 2,
      this.Frame.frameRect.y / 2 + this.titleFont.size / 3
    );
  }

  drawSubTitle() {
    this.ctx.font = `${this.subTitleFont.size}px ${this.subTitleFont.name}`;
    this.ctx.fillStyle = this.subTitleFont.color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Press Space to start.",
      this.canvas.width / 2,
      this.Frame.frameRect.y / 2 +
        this.subTitleFont.size / 3 +
        this.Frame.frameRect.y / 4.5
    );
  }

  drawBestTime() {
    this.ctx.font = `${this.BestTimeFont.size}px ${this.BestTimeFont.name}`;
    this.ctx.fillStyle = this.BestTimeFont.color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Best Time: 99.99",
      this.canvas.width / 2,
      this.Frame.frameRect.y + this.Frame.frameRect.height / 8
    );
  }
}

export default Text;
