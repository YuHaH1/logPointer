# 包含
传入选项options
~~~ typescript
 requestUrl: string;
 id?: string;
 hashLogger: boolean;
 jsErrorLogger: boolean;
 historyLogger: boolean;
 SDKVersion: string;
 payload: Record<string, any>;
~~~
 const logger = new PointsLogger({
    hashLogger:true
    historyLogger: true,
    jsErrorLogger: true,
    requestUrl:xxxxx
})
installDomLogger->对某个DOM注册监听上报事件
logger.installDomLogger<T>(document.getElementsByClassName('test')[0], ['click'], { click: 'click-test' },payload:T);
jsErrorLogger: true 会自动进行错误上报因此，初始化的时候给requestUrl
historyLogger: true自动监听history模式路由的页面的跳转    
hashLogger:true 自动监听hash模式路由的页面的跳转 