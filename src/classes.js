class BaseCSSClassSelector {
  cssSelectorArray = [];

  cssSelectorString = '';

  selectorOrder = {
    element: 0,
    id: 1,
    class: 2,
    attribute: 3,
    'pseudo-class': 4,
    'pseudo-element': 5,
  };

  constructor(cssSelectorArray, cssSelectorString) {
    this.cssSelectorArray = cssSelectorArray;
    this.cssSelectorString = cssSelectorString;
  }

  checkOrder(existingSelector, selectorToAdd) {
    if (this.cssSelectorArray.length > 0) {
      if (
        this.selectorOrder[existingSelector] > this.selectorOrder[selectorToAdd]
      ) {
        throw new Error(
          'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
        );
      }
    }
  }

  checkRepeating(selectorToAdd) {
    if (
      selectorToAdd === 'class' ||
      selectorToAdd === 'pseudo-class' ||
      selectorToAdd === 'attribute'
    ) {
      return;
    }
    if (this.cssSelectorArray.includes(selectorToAdd)) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector'
      );
    }
  }

  addSelector(selectorToAdd) {
    this.checkRepeating(selectorToAdd);
    this.checkOrder(
      this.cssSelectorArray[this.cssSelectorArray.length - 1],
      selectorToAdd
    );
    this.cssSelectorArray.push(selectorToAdd);
  }

  element(value) {
    this.addSelector('element');
    this.cssSelectorString += value;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  id(value) {
    this.addSelector('id');
    this.cssSelectorString += `#${value}`;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  class(value) {
    this.addSelector('class');
    this.cssSelectorString += `.${value}`;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  attr(value) {
    this.addSelector('attribute');
    this.cssSelectorString += `[${value}]`;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  pseudoClass(value) {
    this.addSelector('pseudo-class');
    this.cssSelectorString += `:${value}`;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  pseudoElement(value) {
    this.addSelector('pseudo-element');
    this.cssSelectorString += `::${value}`;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  combine(selector1, combinator, selector2) {
    this.cssSelectorString = `${selector1.cssSelectorString} ${combinator} ${selector2.cssSelectorString}`;
    return new BaseCSSClassSelector(
      this.cssSelectorArray,
      this.cssSelectorString
    );
  }

  stringify() {
    const res = this.cssSelectorString;
    this.cssSelectorString = '';
    return res;
  }
}
module.exports = BaseCSSClassSelector;
