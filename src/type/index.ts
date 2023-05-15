const enum ELogger {
    version = '1.0.0'
}
interface IDefaultOptions {
    requestUrl: string,
    id?: string,
    hashLogger: boolean,
    jsErrorLogger: boolean,
    historyLogger: boolean,
    SDKVersion: string,
    payload: Record<string, any>
}
interface IUserOptions extends Partial<IDefaultOptions> {
    requestUrl: string,
    jsErrorTargetKet?: string,
    promiseErrorTargetKet?: string,
    hashTargetKet?: string
    historyTargetK?: string
}

type TDomLoggerTargetKey = {
    [K in keyof HTMLElementEventMap as string]: string
} | string;



export { IDefaultOptions, ELogger, IUserOptions, TDomLoggerTargetKey }