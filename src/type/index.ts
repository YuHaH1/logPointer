const enum ELogger {
    version = '1.0.0'
}
interface IDefaultOptions {
    requestUrl: string,
    id?: string,
    domLogger: boolean,
    hashLogger: boolean,
    jsErrorLogger: boolean,
    historyLogger: boolean,
    SDKVersion: string,
    payload: Record<string, any>
}
interface IUserOptions extends Partial<IDefaultOptions> {
    requestUrl: string,
}

export { IDefaultOptions, ELogger, IUserOptions }