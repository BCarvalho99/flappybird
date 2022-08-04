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
