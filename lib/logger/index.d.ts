import { type IUserOptions, type TDomLoggerTargetKey } from '../type/index';
declare class PointsLogger {
    options: IUserOptions;
    constructor(options: IUserOptions);
    private initOptions;
    private instanllListerner;
    sendLogger<T>(payload: T): void;
    private setUserId;
    private installErrorListerner;
    installDomLogger<T>(el: HTMLElement, event: Array<keyof HTMLElementEventMap>, targetKey: TDomLoggerTargetKey, payload: T): void;
    private installLogger;
    private reportTracker;
}
export default PointsLogger;
