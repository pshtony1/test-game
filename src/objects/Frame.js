import { bezier } from "../lib/bezier-easing/index.js";

class Frame {
  constructor({ state, canvas, ctx, Player }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Player = Player;

    this.thickness = 6;
    this.resizeThickness();

    this.frameRect = {
      x: Math.floor(this.canvas.width / 4 - this.thickness / 2),
      y: Math.floor(this.canvas.height / 4 - this.thickness / 2),
      width: this.canvas.width / 2,
      height: this.canvas.height / 2,
    };

    this.frameAnimator = null;

    window.addEventListener("keydown", (e) => {
      if (
        e.keyCode === 32 &&
        !this.state.stateChanging &&
        this.state.gameState !== 1
      ) {
        this.state.stateChanging = true;
      }
    });
  }

  update() {
    if (this.state.gameState === 0) {
      this.drawMainFrame();
      if (!this.state.stateChanging) {
        this.checkCollide();
      } else if (!this.frameAnimator) {
        this.frameAnimator = this.getFrameAnimate(
          {
            toWidth: "65%",
            toHeight: "65%",
          },
          600,
          [0.22, 0.68, 0, 1],
          {
            x: this.canvas.width / 2 - this.Player.size / 2,
            y: this.frameRect.y + (this.frameRect.height * 4) / 5,
          }
        );
      } else if (this.frameAnimator) {
        const isAniEnd = this.frameAnimator();

        if (isAniEnd) {
          this.state.stateChanging = false;
          this.frameAnimator = null;
          this.state.gameState = 1;
        }
      }
    } else if (this.state.gameState === 1) {
      this.drawMainFrame();
      this.checkCollide();

      // // Test Pattern
      // if (parseFloat(this.state.gameTime) > 3) {
      //   if (!this.frameAnimator) {
      //     this.frameAnimator = this.getFrameAnimate(
      //       {
      //         toWidth: "90%",
      //         toHeight: "20%",
      //       },
      //       2000,
      //       [0.22, 0.68, 0, 1]
      //     );
      //   } else if (this.frameAnimator) {
      //     const isAniEnd = this.frameAnimator();

      //     if (isAniEnd) {
      //       this.frameAnimator = this.getFrameAnimate(
      //         {
      //           toWidth: "20%",
      //           toHeight: "90%",
      //         },
      //         2000,
      //         [0.22, 0.68, 0, 1]
      //       );
      //     }
      //   }
      // }
    } else if (this.state.gameState === 2) {
      this.drawMainFrame();
      if (!this.state.stateChanging) {
        this.checkCollide();
      } else if (!this.frameAnimator) {
        this.frameAnimator = this.getFrameAnimate(
          {
            toWidth: "50%",
            toHeight: "50%",
          },
          600,
          [0.22, 0.68, 0, 1],
          {
            x: this.canvas.width / 2 - this.Player.size / 2,
            y: this.canvas.height / 2 - this.Player.size / 2,
          }
        );
      } else if (this.frameAnimator) {
        const isAniEnd = this.frameAnimator();

        if (isAniEnd) {
          this.state.stateChanging = false;
          this.frameAnimator = null;
          this.state.gameStarted = false;
          this.state.gameState = 0;
        }
      }
    }
  }

  resize(beforeSize) {
    this.resizeThickness();

    this.frameRect.width *= this.canvas.width / beforeSize.width;
    this.frameRect.height *= this.canvas.height / beforeSize.height;
    this.frameRect.x =
      (this.canvas.width - this.frameRect.width) / 2 - this.thickness / 2;
    this.frameRect.y =
      (this.canvas.height - this.frameRect.height) / 2 - this.thickness / 2;
  }

  drawMainFrame() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#f1f1f1";
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

  resizeThickness() {
    const relu = (x) => {
      return x >= 0 ? x : 0;
    };

    const resizedThickness = relu(this.canvas.width - 500) / 50 + 4;
    this.thickness = resizedThickness >= 5 ? 6 : 4;
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

  getFrameAnimate(
    { toWidth, toHeight },
    duration = 1000,
    easing = [0, 0, 1, 1],
    initPlayerPos = null
  ) {
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

    const startTime = new Date().getTime();

    const startPoint = {
      x: this.frameRect.x,
      y: this.frameRect.y,
      width: this.frameRect.width,
      height: this.frameRect.height,
    };

    const endPoint = {
      x: (this.canvas.width - toWidth) / 2 - this.thickness / 2,
      y: (this.canvas.height - toHeight) / 2 - this.thickness / 2,
      width: toWidth,
      height: toHeight,
    };

    const bezierEasing = bezier(...easing);

    const animate = () => {
      const curTime = new Date().getTime();
      const timeRate = (curTime - startTime) / duration;

      if (timeRate < 1) {
        this.frameRect.x =
          endPoint.x > startPoint.x
            ? Math.abs(endPoint.x - startPoint.x) * bezierEasing(timeRate) +
              startPoint.x
            : startPoint.x -
              Math.abs(endPoint.x - startPoint.x) * bezierEasing(timeRate);

        this.frameRect.y =
          endPoint.y > startPoint.y
            ? Math.abs(endPoint.y - startPoint.y) * bezierEasing(timeRate) +
              startPoint.y
            : startPoint.y -
              Math.abs(endPoint.y - startPoint.y) * bezierEasing(timeRate);

        this.frameRect.width =
          endPoint.width > startPoint.width
            ? Math.abs(endPoint.width - startPoint.width) *
                bezierEasing(timeRate) +
              startPoint.width
            : startPoint.width -
              Math.abs(endPoint.width - startPoint.width) *
                bezierEasing(timeRate);

        this.frameRect.height =
          endPoint.height > startPoint.height
            ? Math.abs(endPoint.height - startPoint.height) *
                bezierEasing(timeRate) +
              startPoint.height
            : startPoint.height -
              Math.abs(endPoint.height - startPoint.height) *
                bezierEasing(timeRate);

        return false;
      } else {
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
