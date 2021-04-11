class Timer {
  constructor({ state, canvas, ctx, Text }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameTimer = {
      timerObject: null,
      countStarted: false,
    };
    this.Text = Text;
  }

  update() {
    if (this.state.gameState === 1 && this.state.gameStarted) {
      this.startGameTimer();
      this.manageBestTime();
    } else if (this.state.gameState === 2 && !this.state.stateChanging) {
      this.gameTimer = {
        timerObject: null,
        countStarted: false,
      };
    }
  }

  startGameTimer() {
    if (!this.gameTimer.timerObject) {
      this.gameTimer.timerObject = this.getGameTimer();
    } else {
      this.state.gameTime = this.gameTimer.timerObject();
    }
  }

  getGameTimer() {
    const startedTime = new Date();
    this.gameTimer.countStarted = true;

    const timer = () => {
      const currentTime = new Date();
      const elapsed = currentTime - startedTime;

      return (elapsed / 1000).toFixed(2);
    };

    return timer;
  }

  manageBestTime() {
    if (parseFloat(this.state.gameTime) > parseFloat(this.state.bestTime)) {
      this.state.bestTime = this.state.gameTime;
    }
  }
}

export default Timer;
