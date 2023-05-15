/**
 *
 * @param type {History}
 */
declare const createHistoryEvent: <T extends keyof History>(type: T) => (this: any) => any;
export { createHistoryEvent };
