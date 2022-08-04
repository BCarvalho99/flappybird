function newElement(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");

  const border = newElement("div", "border");
  const body = newElement("div", "body");
  this.element.appendChild(reverse ? body : border);
  this.element.appendChild(reverse ? border : body);

  this.setHeight = (ductHeight) => (body.style.height = `${ductHeight}px`);
}

function BarrierPair(height, voidspace, x) {
  this.element = newElement("div", "barrier-pair");

  this.upper = new Barrier(true);
  this.bottom = new Barrier(false);

  this.element.appendChild(this.upper.element);
  this.element.appendChild(this.bottom.element);

  this.randomSpace = () => {
    const sizeUpper = Math.random() * (height - voidspace);
    const sizeBottom = height - voidspace - sizeUpper;
    this.upper.setHeight(sizeUpper);
    this.bottom.setHeight(sizeBottom);
  };

  this.getX = () => parseInt(this.element.style.left.split("px")[0]);
  this.setX = (x) => (this.element.style.left = `${x}px`);
  this.getWidth = () => this.element.clientWidth;

  this.randomSpace();
  this.setX(x);
}

function Barriers(height, width, mid, barrierspace, pointCount) {
  this.pairs = [
    new BarrierPair(height, mid, width),
    new BarrierPair(height, mid, width + barrierspace),
    new BarrierPair(height, mid, width + barrierspace * 2),
    new BarrierPair(height, mid, width + barrierspace * 3),
  ];

  const movement = 2;
  this.animation = () => {
    this.pairs.forEach((pair) => {
      pair.setX(pair.getX() - movement);

      if (pair.getX() < -pair.getWidth()) {
        pair.setX(pair.getX() + barrierspace * this.pairs.length);
        pair.randomSpace();
      }

      const checkMid = width / 2;
      const hasCrossedMid =
        pair.getX() + movement >= checkMid && pair.getX() < mid;
      if (hasCrossedMid) pointCount();
    });
  };
}

const barriers = new Barriers(700, 1200, 200, 400);
const area = document.querySelector("[js-flappy]");
barriers.pairs.forEach((pair) => {
  area.appendChild(pair.element);
});
setInterval(() => {
  barriers.animation();
}, 20);
