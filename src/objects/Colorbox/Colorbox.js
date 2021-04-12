class Colorbox {
  constructor({ color, radius, ctx, Player, Text, EffectManager }) {
    this.color = color;
    this.radius = radius;
    this.pos = { x: undefined, y: undefined };
    this.ctx = ctx;
    this.Player = Player;
    this.Text = Text;
    this.EffectManager = EffectManager;
    this.isColliding = false;
  }

  update() {
    this.drawBox();
    this.checkCollide();
  }

  resize() {
    this.radius = this.Player.size * 0.65;
  }

  drawBox() {
    this.ctx.beginPath();
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  setPos({ x, y }) {
    this.pos.x = x;
    this.pos.y = y;
  }

  checkCollide() {
    const calcDist = () => {
      return Math.sqrt(
        (this.pos.x - (this.Player.pos.x + this.Player.size / 2)) ** 2 +
          (this.pos.y - (this.Player.pos.y + this.Player.size / 2)) ** 2
      );
    };

    const calcPlayerRadius = () => {
      return (Math.sqrt(2) * this.Player.size) / 2;
    };

    const offset = 3;

    if (calcDist() + offset < this.radius + calcPlayerRadius()) {
      if (!this.isColliding) {
        this.isColliding = true;

        const beforeColor = Object.assign({}, this.Player.color);

        this.Player.color = Object.assign({}, this.color);
        this.Text.subTitleFont.color = Object.assign({}, this.color);
        this.color = beforeColor;
        this.EffectManager.createEffect({
          x: this.pos.x,
          y: this.pos.y,
          color: Object.assign({}, this.color),
          size: this.radius,
          spreadSpeed: 3,
          lifeTime: 1000,
          thickness: 6,
        });
        this.EffectManager.createEffect({
          x: this.pos.x,
          y: this.pos.y,
          color: Object.assign({}, this.color),
          size: this.radius,
          spreadSpeed: 1.5,
          lifeTime: 700,
          thickness: 3,
        });
      }
    } else {
      this.isColliding = false;
    }
  }
}

export default Colorbox;
