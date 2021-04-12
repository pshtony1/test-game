import Effect from "./Effect.js";

class EffectManager {
  constructor({ state, canvas, ctx }) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
    this.effects = [];
  }

  update() {
    if (this.state.stateChanging) {
      this.effects = [];
    } else {
      for (let i = this.effects.length - 1; i >= 0; i--) {
        const effect = this.effects[i];

        effect.update();

        if (!effect.effectUpdater) {
          this.destroyEffect(i);
        }
      }
    }
  }

  resize(beforeSize) {
    for (const effect of this.effects) {
      effect.resize(beforeSize);
    }
  }

  createEffect({ x, y, color, size, spreadSpeed, lifeTime, thickness }) {
    if (!color) {
      color = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
        a: 1,
      };
    }

    if (!size) {
      size = 0;
    }

    if (!spreadSpeed) {
      spreadSpeed = Math.random() * 8 + 4;
    }

    if (!lifeTime) {
      lifeTime = Math.floor(Math.random() * 500 + 1000);
    }

    if (!thickness) {
      thickness = Math.floor(Math.random() * 2 + 8);
    }

    const newEffect = new Effect({
      state: this.state,
      canvas: this.canvas,
      ctx: this.ctx,
      data: {
        pos: {
          x,
          y,
        },
        color,
        size,
        spreadSpeed,
        lifeTime,
        thickness,
      },
      easing: [0.22, 0.68, 0, 1],
    });

    this.effects.push(newEffect);
  }

  destroyEffect(index) {
    this.effects.splice(index, 1);
  }
}

export default EffectManager;
