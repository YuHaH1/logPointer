import { type IDefaultOptions, type IUserOptions, type TDomLoggerTargetKey } from '../type/index'
import { createHistoryEvent } from '../utils'
declare const VERSION: string
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
            jsErrorLogger: false,
            SDKVersion: VERSION,
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
    private installErrorListerner(jsErrorTargetKet?: string, promiseErrorTargetKet?: string) {
        window.addEventListener('error', (e) => {
            this.reportTracker({
                event: 'js_error',
                targetKey: jsErrorTargetKet || 'JSerror',
                errorInfo: {
                    message: e.message,
                    lineno: e.lineno,
                    scriptURI: e.filename,
                    type: e.type
                }
            })
        })
        window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber) {
            console.error(`Error: ${errorMessage} at ${scriptURI}:${lineNumber}:${columnNumber}`);
        };
        window.addEventListener('unhandledrejection', (e) => {
            e.promise.catch(err => {
                this.reportTracker({
                    event: 'promise_unhandledrejectio',
                    targetKey: promiseErrorTargetKet || 'unhandledrejection',
                    errorInfo: {
                        type: e.reason
                    }
                })
            })
        })
    }
    public installDomLogger<T>(el: HTMLElement, event: Array<keyof HTMLElementEventMap>, targetKey: TDomLoggerTargetKey, payload: T): void {
        event.forEach(eventKey => {
            el.addEventListener(eventKey, () => {
                if (typeof targetKey === 'string') {
                    this.reportTracker({
                        event: eventKey,
                        targetKey: targetKey,
                        payload
                    })
                } else {
                    this.reportTracker({
                        event: eventKey,
                        targetKey: targetKey[eventKey],
                        payload
                    })
                }

            })
        })

    }
    private installLogger() {
        this.options.historyLogger && this.instanllListerner(['pushState', 'replaceState', 'popState'], this.options.historyTargetK || 'historyLogger')
        this.options.hashLogger && this.instanllListerner(['hashchange'], this.options.hashTargetKet || 'hashLogger')
        this.options.jsErrorLogger && this.installErrorListerner()
    }
    private reportTracker<T>(payload: T): void {
        // string blob  不支持json payload
        const params = Object.assign(this.options, payload, { time: new Date().getTime() })
        let blob = new Blob([JSON.stringify(params)], { type: 'application/x-www-form-urlencoded' })
        navigator.sendBeacon(this.options.requestUrl, blob)
    }
}

export default PointsLogger