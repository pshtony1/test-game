import { bezier } from "../lib/bezier-easing/index.js";

class Text {
  constructor({ state, canvas, ctx, Frame, Player }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Frame = Frame;
    this.Player = Player;
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
      colorAnimator: null,
      entered: false,
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
      colorAnimator: null,
      entered: false,
    };
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
    } else if (this.state.gameStarted && !this.state.stateChanging) {
      this.checkGameTimeCollision();
      this.drawGameTime();

      if (!this.BestTimeFont.colorAnimator) {
        if (
          parseFloat(this.state.gameTime) >= parseFloat(this.state.bestTime)
        ) {
          this.BestTimeFont.color.a = 1;
        } else {
          this.BestTimeFont.color.a = 0.5;
        }
      }
    } else if (this.state.gameState === 2 && this.state.stateChanging) {
      this.BestTimeFont.colorAnimator = null;
      this.BestTimeFont.entered = false;
      this.BestTimeFont.color.a = 1;
      this.gameTimeFont.colorAnimator = null;
      this.gameTimeFont.entered = false;
      this.gameTimeFont.color.a = 1;
    }

    this.checkBestTimeCollision();
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

  checkBestTimeCollision() {
    this.ctx.font = `${this.BestTimeFont.size}px ${this.BestTimeFont.name}`;
    const bestTimeWidth = this.ctx.measureText(
      `Best Time: ${this.state.bestTime}`
    ).width;

    const bestTimePos = {
      x: this.canvas.width / 2 - bestTimeWidth / 2,
      y:
        this.Frame.frameRect.y +
        this.Frame.frameRect.height / 8 -
        this.BestTimeFont.size,
    };

    if (
      bestTimePos.x < this.Player.pos.x + this.Player.size &&
      this.Player.pos.x < bestTimePos.x + bestTimeWidth &&
      bestTimePos.y < this.Player.pos.y + this.Player.size &&
      this.Player.pos.y < bestTimePos.y + this.BestTimeFont.size
    ) {
      if (!this.BestTimeFont.entered) {
        this.BestTimeFont.colorAnimator = this.getColorFadeAnimator(
          this.BestTimeFont,
          this.BestTimeFont.color.a * 0.3,
          550
        );
        this.BestTimeFont.entered = true;
      } else if (this.BestTimeFont.colorAnimator) {
        const aniEnd = this.BestTimeFont.colorAnimator();

        if (aniEnd) {
          this.BestTimeFont.colorAnimator = null;
        }
      }
    } else {
      if (this.BestTimeFont.entered) {
        this.BestTimeFont.colorAnimator = this.getColorFadeAnimator(
          this.BestTimeFont,
          this.state.gameState === 1 &&
            parseFloat(this.state.gameTime) < parseFloat(this.state.bestTime)
            ? 0.5
            : 1,
          550
        );
        this.BestTimeFont.entered = false;
      } else if (this.BestTimeFont.colorAnimator) {
        const aniEnd = this.BestTimeFont.colorAnimator();

        if (aniEnd) {
          this.BestTimeFont.colorAnimator = null;
        }
      }
    }
  }

  checkGameTimeCollision() {
    this.ctx.font = `${this.gameTimeFont.size}px ${this.gameTimeFont.name}`;
    const gameTimeWidth = this.ctx.measureText(`${this.state.gameTime}`).width;

    const gameTimePos = {
      x: this.canvas.width / 2 - gameTimeWidth / 2,
      y: this.Frame.frameRect.y + this.Frame.frameRect.height / 7,
    };

    if (
      gameTimePos.x < this.Player.pos.x + this.Player.size &&
      this.Player.pos.x < gameTimePos.x + gameTimeWidth &&
      gameTimePos.y < this.Player.pos.y + this.Player.size &&
      this.Player.pos.y < gameTimePos.y + this.gameTimeFont.size
    ) {
      if (!this.gameTimeFont.entered) {
        this.gameTimeFont.colorAnimator = this.getColorFadeAnimator(
          this.gameTimeFont,
          this.gameTimeFont.color.a * 0.3,
          550
        );
        this.gameTimeFont.entered = true;
      } else if (this.gameTimeFont.colorAnimator) {
        const aniEnd = this.gameTimeFont.colorAnimator();

        if (aniEnd) {
          this.gameTimeFont.colorAnimator = null;
        }
      }
    } else {
      if (this.gameTimeFont.entered) {
        this.gameTimeFont.colorAnimator = this.getColorFadeAnimator(
          this.gameTimeFont,
          1,
          550
        );
        this.gameTimeFont.entered = false;
      } else if (this.gameTimeFont.colorAnimator) {
        const aniEnd = this.gameTimeFont.colorAnimator();

        if (aniEnd) {
          this.gameTimeFont.colorAnimator = null;
        }
      }
    }
  }

  getColorFadeAnimator(
    fontObj,
    toOpacity,
    duration = 1000,
    easing = [0, 0, 1, 1]
  ) {
    const startTime = new Date();
    const bezierEasing = bezier(...easing);

    const animator = () => {
      const curTime = new Date();
      const timeRate = (curTime - startTime) / duration;

      if (timeRate < 1) {
        fontObj.color.a =
          toOpacity > fontObj.color.a
            ? Math.abs(toOpacity - fontObj.color.a) * bezierEasing(timeRate) +
              fontObj.color.a
            : fontObj.color.a -
              Math.abs(toOpacity - fontObj.color.a) * bezierEasing(timeRate);

        return false;
      } else {
        return true;
      }
    };

    return animator;
  }
}

export default Text;
