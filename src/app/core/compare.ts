/**
 * @author Tegonal GmbH
 * @license AGPL
 */
export function compareI18n(a: string, b: string): number {
  return new Intl.Collator([], { numeric: true }).compare(a, b);
}

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
export function compareBoolean(a: boolean, b: boolean, whenEqual: () => number) {
  if (a && !b) {
    return -1;
  } else if (!a && b) {
    return 1;
  } else {
    return whenEqual();
  }
}
