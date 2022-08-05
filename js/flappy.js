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
        pair.getX() + movement >= checkMid && pair.getX() < checkMid;
      if (hasCrossedMid) pointCount();
    });
  };
}

function Bird(verticalPosition) {
  let flying = false;
  this.element = newElement("img", "bird");
  this.element.src = "imgs/bird.png";

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  window.onkeydown = (e) => (flying = true);
  window.onkeyup = (e) => (flying = false);

  this.animation = () => {
    const newY = this.getY() + (flying ? 8 : -5);
    const maxHeight = verticalPosition - this.element.clientHeight;

    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maxHeight) {
      this.setY(maxHeight);
    } else {
      this.setY(newY);
    }
  };
  this.setY(verticalPosition / 2);
}

function Progress() {
  this.element = newElement("span", "progress");
  this.pointUpdate = (points) => {
    this.element.innerHTML = points;
  };
  this.pointUpdate(0);
}

function FPgame() {
  let points = 0;

  const area = document.querySelector("[js-flappy]");
  const height = area.clientHeight;
  const width = area.clientWidth;

  const progress = new Progress();
  const barriers = new Barriers(height, width, 200, 400, () =>
    progress.pointUpdate(++points)
  );
  const bird = new Bird(height);

  area.appendChild(progress.element);
  area.appendChild(bird.element);
  barriers.pairs.forEach((pair) => area.appendChild(pair.element));

  this.start = () => {
    const timer = setInterval(() => {
      barriers.animation();
      bird.animation();
    }, 20);
  };
}

new FPgame().start();
