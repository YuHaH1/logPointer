import { type IDefaultOptions, type IUserOptions, ELogger } from '../type/index'
import { createHistoryEvent } from '../utils'

class PointsLogger {
    options: IUserOptions
    constructor(options: IUserOptions) {
        this.options = Object.assign(this.initOptions(), options)
        this.installLogger()

    }
    private initOptions(): IDefaultOptions {
        // rewrite  pushState replaceState
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <IDefaultOptions>{
            historyLogger: false,
            hashLogger: false,
            domLogger: false,
            jsErrorLogger: false,
            SDKVersion: ELogger.version,
            payload: {}
        }
    }
    private instanllListerner<T>(types: Array<string>, targetKey: string, payload?: T): void {
        // targetKey为后端协商的标识
        types.forEach(type => {
            window.addEventListener(type, () => {
                console.log('listener called')
                this.reportTracker({
                    event: type,
                    targetKey,
                    payload
                })
            })
        })
    }
    // 提供给用户
    public sendLogger<T>(payload: T) {
        this.reportTracker(payload)
    }
    private setUserId<T extends IDefaultOptions['id']>(id: T) {
        this.options.id = id
    }
    private errorListerner() {
        window.addEventListener('error', (e) => {
            console.log('jserror');
            this.reportTracker({
                event: 'js_error',
                targetKey: 'JSerror',
                message: e.message
            })
        })
        window.addEventListener('unhandledrejection', (e) => {
            console.log('promiseerror');
            e.promise.catch(err => {
                this.reportTracker({
                    event: 'promise_error',
                    targetKey: 'unhandledrejection',
                    message: err
                })
            })

        })
    }
    private installLogger() {
        // 
        this.options.historyLogger && this.instanllListerner(['pushState', 'replaceState', 'popState'], 'historyLogger',)
        this.options.hashLogger && this.instanllListerner(['hashchange'], 'hashLogger')
        this.options.jsErrorLogger && this.errorListerner()
    }
    private reportTracker<T>(payload: T): void {
        // string blob  不支持json payload
        const params = Object.assign(this.options, payload, { time: new Date().getTime() })
        let blob = new Blob([JSON.stringify(params)], { type: 'application/x-www-form-urlencoded' })
        navigator.sendBeacon(this.options.requestUrl, blob)
    }
}

export default PointsLogger