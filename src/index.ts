const copyComputedStyles = (source: HTMLElement, target: HTMLElement): CSSStyleDeclaration => {
  const computedStyles: CSSStyleDeclaration = window.getComputedStyle(source);

  for (const computedStyle of Array.from(computedStyles)) {
    target.style[computedStyle as any] = computedStyles.getPropertyValue(computedStyle);
  }
  return computedStyles;
};
const getInputValue = (inputElement: HTMLInputElement, usePlaceholder: boolean): string => {
  return inputElement.value || (usePlaceholder ? inputElement.placeholder : '');
};
const getValue = (element: HTMLElement, usePlaceholder:boolean): string => {
  return element.tagName === 'INPUT' ? getInputValue(element as HTMLInputElement, usePlaceholder) : element.innerHTML;
};
export const isEllipsis = (sourceElement: HTMLElement, usePlaceholder:boolean = true): number => {

    try {
        const copiedElement: HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
        const holderElement: HTMLSpanElement = document.createElement('SPAN') as HTMLSpanElement;
        const computedStyles: CSSStyleDeclaration = copyComputedStyles(sourceElement, copiedElement);
        const innerHtml: string = getValue(sourceElement, usePlaceholder);

        copiedElement.style.width = `${sourceElement.offsetWidth}px`;
        copiedElement.style.minWidth = `${sourceElement.offsetWidth}px`;
        copiedElement.style.height = `${sourceElement.offsetHeight}px`;
        copiedElement.style.minHeight = `${sourceElement.offsetHeight}px`;
        copiedElement.style.boxSizing = 'border-box';
        copiedElement.style.position = 'fixed';
        copiedElement.style.top = `${sourceElement.offsetHeight * -1}px`;

        copiedElement.appendChild(holderElement);
        document.body.appendChild(copiedElement);

        const scrollWidth =
            copiedElement.scrollWidth -
            parseInt(computedStyles.getPropertyValue('padding-left'), 10) -
            parseInt(computedStyles.getPropertyValue('padding-right'), 10);
        holderElement.innerHTML = innerHtml;

        const result: number =
            computedStyles.getPropertyValue('white-space') === 'nowrap' &&
            computedStyles.getPropertyValue('overflow') === 'hidden' &&
            computedStyles.getPropertyValue('text-overflow') === 'ellipsis' &&
            holderElement.offsetWidth >= scrollWidth
                ? holderElement.offsetWidth - scrollWidth + 1
                : 0;
        // @ts-ignore
        document.body.removeChild(copiedElement);
        return result;
    }
    catch {
        return 0;
    }
};
