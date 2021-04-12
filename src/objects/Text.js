import { bezier } from "../lib/bezier-easing/index.js";

class Text {
  constructor({ state, canvas, ctx, Frame }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.titleFont = {
      size: 30,
      maxSize: 30,
      name: "Comic Sans MS",
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
    };
    this.subTitleFont = {
      size: 20,
      maxSize: 20,
      name: "Comic Sans MS",
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 0.6,
      },
    };
    this.BestTimeFont = {
      size: 20,
      maxSize: 20,
      name: "Comic Sans MS",
      color: {
        r: 255,
        g: 204,
        b: 0,
        a: 1,
      },
    };
    this.gameTimeFont = {
      size: 26,
      maxSize: 26,
      name: "Comic Sans MS",
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
    };
    this.Frame = Frame;
    this.initFontSize();
  }

  update() {
    this.drawText();
  }

  resize(beforeSize) {
    this.titleFont.size *= this.canvas.width / beforeSize.width;
    this.subTitleFont.size *= this.canvas.width / beforeSize.width;
    this.BestTimeFont.size *= this.canvas.width / beforeSize.width;
    this.gameTimeFont.size *= this.canvas.width / beforeSize.width;

    if (this.titleFont.size > this.titleFont.maxSize) {
      this.titleFont.size = this.titleFont.maxSize;
    }

    if (this.subTitleFont.size > this.subTitleFont.maxSize) {
      this.subTitleFont.size = this.subTitleFont.maxSize;
    }

    if (this.BestTimeFont.size > this.BestTimeFont.maxSize) {
      this.BestTimeFont.size = this.BestTimeFont.maxSize;
    }

    if (this.gameTimeFont.size > this.gameTimeFont.maxSize) {
      this.gameTimeFont.size = this.gameTimeFont.maxSize;
    }
  }

  initFontSize() {
    this.resize({ width: 600 }, false);
  }

  drawText() {
    if (this.state.gameState === 0 && !this.state.stateChanging) {
      this.drawTitle();
      this.drawSubTitle();
      this.BestTimeFont.color.a = 1;
    } else if (this.state.gameStarted && !this.state.stateChanging) {
      this.drawGameTime();

      this.BestTimeFont.color.a = 0.5;
      if (parseFloat(this.state.gameTime) >= parseFloat(this.state.bestTime)) {
        this.BestTimeFont.color.a = 1;
      }
    }

    this.drawBestTime();
  }

  drawTitle() {
    this.ctx.font = `${this.titleFont.size}px ${this.titleFont.name}`;
    this.ctx.fillStyle = `rgba(${this.titleFont.color.r}, ${this.titleFont.color.g}, ${this.titleFont.color.b}, ${this.titleFont.color.a})`;

    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Avoid Blobs!",
      this.canvas.width / 2,
      this.Frame.frameRect.y / 2 + this.titleFont.size / 3
    );
  }

  drawSubTitle() {
    this.ctx.font = `${this.subTitleFont.size}px ${this.subTitleFont.name}`;
    this.ctx.fillStyle = `rgba(${this.subTitleFont.color.r}, ${this.subTitleFont.color.g}, ${this.subTitleFont.color.b}, ${this.subTitleFont.color.a})`;

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
    this.ctx.fillStyle = `rgba(${this.BestTimeFont.color.r}, ${this.BestTimeFont.color.g}, ${this.BestTimeFont.color.b}, ${this.BestTimeFont.color.a})`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `Best Time: ${this.state.bestTime}`,
      this.canvas.width / 2,
      this.Frame.frameRect.y + this.Frame.frameRect.height / 8
    );
  }

  drawGameTime() {
    this.ctx.font = `${this.gameTimeFont.size}px ${this.gameTimeFont.name}`;
    this.ctx.fillStyle = `rgba(${this.gameTimeFont.color.r}, ${this.gameTimeFont.color.g}, ${this.gameTimeFont.color.b}, ${this.gameTimeFont.color.a})`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `${this.state.gameTime}`,
      this.canvas.width / 2,
      this.Frame.frameRect.y +
        this.Frame.frameRect.height / 7 +
        this.gameTimeFont.size
    );
  }
}

export default Text;
