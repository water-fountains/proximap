/**
 * Since throw is not an expression in typescript you cannot do thing like ... || throw
 * Hence this function
 * @author Tegonal
 * @license AGPL
 */
export function illegalState(msg: string, ...optionalParams: any[]): never {
  console.error(msg, ...optionalParams);
  throw new Error('IllegalState detected: ' + msg + optionalParams.join(' '));
}
