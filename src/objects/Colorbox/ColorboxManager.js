import Colorbox from "./Colorbox.js";

class ColorboxManager {
  constructor({ state, canvas, ctx, Frame, Player, Text, EffectManager }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Frame = Frame;
    this.Player = Player;
    this.Text = Text;
    this.EffectManager = EffectManager;
    this.boxes = [
      new Colorbox({
        color: {
          r: 228,
          g: 106,
          b: 114,
          a: 1,
        },
        radius: this.Player.size * 0.65,
        ctx,
        Player,
        Text,
        EffectManager,
      }),
      new Colorbox({
        color: {
          r: 249,
          g: 190,
          b: 124,
          a: 1,
        },
        radius: this.Player.size * 0.65,
        ctx,
        Player,
        Text,
        EffectManager,
      }),
      new Colorbox({
        color: {
          r: 48,
          g: 147,
          b: 151,
          a: 1,
        },
        radius: this.Player.size * 0.65,
        ctx,
        Player,
        Text,
        EffectManager,
      }),
      new Colorbox({
        color: {
          r: 100,
          g: 136,
          b: 234,
          a: 1,
        },
        radius: this.Player.size * 0.65,
        ctx,
        Player,
        Text,
        EffectManager,
      }),
      new Colorbox({
        color: {
          r: 102,
          g: 51,
          b: 153,
          a: 1,
        },
        radius: this.Player.size * 0.65,
        ctx,
        Player,
        Text,
        EffectManager,
      }),
    ];
    this.shuffleBoxes();
    this.updateBoxPos();
  }

  update() {
    if (this.state.gameState === 0 && !this.state.stateChanging) {
      for (let box of this.boxes) {
        box.update();
      }
    }
  }

  resize(beforeSize) {
    this.updateBoxPos();

    for (let box of this.boxes) {
      box.resize();
    }
  }

  updateBoxPos() {
    const boxSize = this.boxes[0].radius * 2;
    const gap =
      (this.Frame.frameRect.width - boxSize * this.boxes.length) /
      (this.boxes.length + 1);

    // sort boxes' position: space-evenly
    for (let i = 0; i < this.boxes.length; i++) {
      this.boxes[i].setPos({
        x: this.Frame.frameRect.x - boxSize / 2 + (gap + boxSize) * (i + 1),
        y:
          this.Frame.frameRect.y +
          this.Frame.frameRect.height -
          this.Frame.frameRect.height / 6,
      });
    }
  }

  shuffleBoxes() {
    const shuffle = (array) => {
      let currentIndex = array.length,
        temporaryValue,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    this.boxes = shuffle(this.boxes);
  }
}

export default ColorboxManager;
