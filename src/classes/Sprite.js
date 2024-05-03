export class Sprite {
    constructor(x, y, SPEED, image) {
        this.x = x;
        this.y = y;
        this.SPEED = SPEED;
        this.image = image;
        this.velocity = this.SPEED;
    }
}
