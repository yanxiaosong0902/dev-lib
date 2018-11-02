/**
 * 接口代理模块
 * @author yanxiaosong
 */

/*===============================================================================================*//*

### 接口组件

####　必须配置项
路径可以是相对路径也可以是绝对路径，按书写方式区分
* pathname  : 路径

####　可选功能配置项
可选的配置项，如果没有配置会使用默认值
* origin    ：域名，默认为空。如果一个接口存在origin配置，则会和 pathname进行拼接作为具体路径。
* type      : 获取方式，默认GET
* dataType  : 数据类型，默认 json，可选 json、jsonp
* params    : 接收参数，{} [] "" ， 如果没有接口调用时没有对应参数，会使用这里配置的默认配置进行补充
* loading   : loading过渡动画的提示文本
>      { query: TYPE }
>      TYPE => Function    | 函数     ：执行函数并把函数返回值作为参数值
>      TYPE => String      | 字符串   ：如果是通过验证的JS代码则作为JS执行
* validTime : 有效时间，单位为秒，可以为浮点数。存储方式优先使用localStorage（可以保证有效期内一直有效）,如果localStorage不可用则使用临时的数组结构进行替代（只在一个页面打开期间生效）。localStorage中过期的数据只有再次触发后发现过期才会自动删除。
* jsonp     : jsonp回调函数名称，默认 jsonpCallback,如果存在jsonp参数的话，会自动使用跨域模式
* loading   : {string|boolean} 默认没有加载动画，如果传入字符串则会显示对应字符串的加载动画，加载完毕自动消失
####　描述配置项
* name      : 描述接口名称，参考使用
* returns   : 接口成功状态返回数据的参考格式，只是针对数据部分。例如: 返回数据:{ success:true,data:{} } => returns : {} （为data对象）


#### 推荐配置方式
尾部有这样一行代码：
window.$Interface = new InterfaceProxy(window.interfaceOptRes);
创建一个接口配置的JS文件，然后写好 一个全局的interfaceOptRes对象
这样的配置方式虽然存在作用域污染之类的问题，但是相对也更方便，更灵活些（像是gulp.grunt用.js多好 →_→)，毕竟一个页面基本上就只需要一个接口配置文件，如果对接口列表进行按功能拆封之类的处理，进行Object再包装就是了。


#### 实例化接口对象的使用方式
#####　配置示例
     // 根据入库单ID查询入库单详情
    "inDetail": {
        name: "入库单明细",
        pathname: "/saas.wms/enterStock/inDetail",
        origin: __origin__,
        dataType: "jsonp",
        jsonp: 'jsonpCallback',
        params: { // 参数  | 可选，可以进行默认参数，参数构造配置等
            id: null     					// 入库单id
        },
        returns: {
            "in": {}
        }
    },

#####　使用示例
```js
    orderId = 入库单ID ;
    // 示例1
    $Interface.inDetail( orderId,function(data){
        // 成功回调 data为接口成功后返回的数据

    },function(msg){
        // 失败回调 msg为接口失败后返回的错误信息

    });
    // 示例2
    $Interface.inDetail( {
        id:orderId
    },function(data){
    // 成功回调 data为接口成功后返回的数据

    },function(msg){
    // 失败回调 msg为接口失败后返回的错误信息

    });
```
接口的调用方法的参数是不固定的，第一个函数参数会被作为成功回调，第二个函数参数会被作为失败回调，如果第一个取得的参数为object则作为接口请求的param基础，没有值的参数项则使用接口配置中的params中的默认项进行补充。
如果第一个取得参数不是object，则开始相对params列表进行依次填充。
如果包含函数名则优先使用函数名称区分成功与失败回调函数
失败：fail|error|errorCallback|errCallback
成功：success|callback
 /*===============================================================================================*//*

    orderId = 入库单ID ;
    // 示例1
    $Interface.inDetail( orderId,function(data){
    // 成功回调 data为接口成功后返回的数据

    },function(msg){
    // 失败回调 msg为接口失败后返回的错误信息

    });
    // 示例2
    $Interface.inDetail( {
    id:orderId
    },function(data){
    // 成功回调 data为接口成功后返回的数据

    },function(msg){
    // 失败回调 msg为接口失败后返回的错误信息

    });

/*===============================================================================================*//*

 ### 更新日志
 * 2016-8-19    优化缓存控制流程
 * 2016-7-20    功能调整：适配xxj新格式，特殊登录处理
 * 2016-7-3     功能调整：移除dove的一些登录支持，对新的返回数据格式进行适配
 * 2016-6-13    调整参数获取的方式，现在开始尝试分析传入回调函数名称以鉴别成功与失败回调
 * 2016-6-2     移除掉Interface
 * 2016-5-30    移除掉renameMap功能
 * 2016-5-29    调整未处理错误提示为 "服务器异常"
 * 2016-5-26    增加错误console日志
 * 2016-5-16    加载动画
 * 2016-5-11    通过iFrame代理提供对跨域get、post的支持
 * 2016-4-30    移除对jquery的最后依赖>(ajax)，如果存在jquery或zepto则优先使用，如果不存在则使用$wd.ajax
 * 2016-4-20    新功能：加入了新的数据预处理，数据重命名，支持根据特定标记位置，进行数据重命名，NEW FIELD : renameMap:{'list:[{catalogName}]':'catalogName',},  [改动：getSearchPath、beautify ]
 * 2016-4-19    写了更新日志

 *//*==============================================================================================*/

/**
 * 扩展元素组件
 * @module InterfaceProxy
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            './wdUtils.js',
            './wdDialogBox.js',
            './md5.js',
            './sha1.js',
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./wdUtils.js'),
            require('./wdDialogBox.js'),
            require('./md5.js'),
            require('./sha1.js')
        );
    } else {
        root.InterfaceProxy = factory(
            root.$wd,
            root.$Dialog,
            root.md5,
            root.sha1
        );
    }
})(/**/this, function ($wd,$Dialog,md5,Hashes) {
    //=========================================================
    //  参数说明 & 默认参数
    //=========================================================
    var defaultOptions = {
        //----------------------------------
        // 接口操作对象生成配置
        //----------------------------------
        // 接口配置json
        interfaceConfig:{},
        // 是否生成自动的全局变量 $interface
        globalVar:'$interface',
        //----------------------------------
        //  接口数据默认配置
        //----------------------------------
        // 默认域名
        origin:null,
        // 默认jsonp回调函数名称
        jsonp:"jsonpCallback"
    };

    /**
     * 接口配置项
     * @typedef {Object} unitInfo
     * @property {string} pathname                  - 接口路径,路径可以是相对路径也可以是绝对路径，按书写方式区分
     * @property {string} [origin=""]               - 接口域名,如果一个接口存在origin配置，则会和pathname进行拼接作为具体路径。
     * @property {string} [type="GET"]              - 操作方法 GET|POST
     * @property {string} [dataType="json"]         - 数据类型 json|jsonp
     * @property {string} [jsonp="jsonpCallback]    - jsonp回调函数名
     * @property {number} [validTime=0]             - 有效时间，单位为秒，可以为浮点数
     * @property {*} [params=null]                  - 接口查询参数，{} [] "" ， 如果没有接口调用时没有对应参数，会使用这里配置的默认配置进行补充
     * @property {string} [name=""]                 - 描述接口名称，参考使用
     * @property {*} [returns=null]                 - 接口成功状态返回数据的参考格式，只是针对数据部分。例如: 返回数据:{ success:true,data:{} } => returns : {} （为data对象）
     * @example
     * // 对象模式
     * {
     *      "getWareHouseList": {
     *           name: "全部仓库",
     *           pathname: "/wms/warehouse/getAll",
     *           origin: __origin__,
     *           dataType: "jsonp",
     *           jsonp: 'jsonpCallback',
     *           validTime: 30,   // 仓库列表信息有效期设置为 30s
     *           params: {type:null},
     *           returns: {
     *               "wareHouseList": [
     *                   {
     *                       "id": "8a958a0254600a1b0154600f67560000",
     *                       "no": "ZZ001",													//仓库编号
     *                       "name": "郑州一号仓1111"//仓库名称
     *                   }
     *               ]
     *           }
     *      }
     *      // ...
     * }
     * // 数组模式
     * [
     *      {
     *           // 生成方法名称在这里标记
     *           method:"getWareHouseList",
     *           name: "全部仓库",
     *           pathname: "/wms/warehouse/getAll",
     *           origin: __origin__,
     *           dataType: "jsonp",
     *           jsonp: 'jsonpCallback',
     *           validTime: 30,   // 仓库列表信息有效期设置为 30s
     *           params: {type:null},
     *           returns: {
     *               "wareHouseList": [
     *                   {
     *                       "id": "8a958a0254600a1b0154600f67560000",
     *                       "no": "ZZ001",													//仓库编号
     *                       "name": "郑州一号仓1111"//仓库名称
     *                   }
     *               ]
     *           }
     *      }
     *      // ...
     * ]
     *
     */

    /**
     * 接口管理器
     * <p>
     *      new InterfaceProxy(interfaceConfig，additionalOptions) 来生成接口操作对象(return)
     *      <br/>示例：
     *      <div><img width="200" src="../img/interfaceInstance.png"/><img width="210" src="../img/interfaceInstance2.png"/></div>
     *      会自动生成一个全局变量 $interface 内容如上图，如果使用第二个参数进行配置的话，会生成对象名称的全局对象，如果配置为false的话会不生成全局对象。
     *
     * </p>
     * @param {unitInfo[]} interfaceConfig 接口描述配置信息
     * @param {object=} additionalOptions 接口基础配置信息
     * @param {object} [additionalOptions.globalVar="$interface"] 全局接口变量名 决定是否生成自动的全局变量 $interface
     * @param {object} [additionalOptions.origin=null] 默认域名
     * @param {object} [additionalOptions.jsonp="jsonpCallback"] 默认jsonp回调函数名称
     * @param {object} [additionalOptions.errCallback=null] 默认失败回调函数
     * @constructor
     * @alias module:InterfaceProxy
     */
    function InterfaceProxy(interfaceConfig, additionalOptions) {
        // 基础配置信息
        this.options = $wd.objClone(defaultOptions);
        this.options = $wd.objCover(this.options,additionalOptions);
        this.promiseMark = "promiseMark"+ new Date();
        // 接口配置JSON
        this.options.interfaceConfig = interfaceConfig;
        // 缓存结构
        var me = this;
        this.repository = function() {
            if ("localStorage" in window) {
                try {
                    var ls = window.localStorage;
                    if(ls){
                        return {
                            push: function(params) {
                                // 保存新的数据
                                ls[me.generateDataMark(params.key)] = JSON.stringify({
                                    timeStamp:params.key.timeStamp,
                                    validTime:params.key.interfaceInfo.validTime,
                                    responseData:params.data
                                });
                            },
                            get: function(fromInfo) {
                                this.clean();
                                return JSON.parse(ls.getItem(me.generateDataMark(fromInfo))||'null');
                            },
                            remove: function(fromInfo) {
                                return ls.removeItem(me.generateDataMark(fromInfo));
                            },
                            // 清理过期缓存
                            clean:function () {
                                // 清除过期缓存
                                for(var i = 0;i<ls.length;i++){
                                    // 42db81629a 3582822d6b b6b83bbe1d 2378e6aeeb
                                    if(/\w{40}/.test(ls.key(i))){
                                        var storeData = JSON.parse(ls.getItem(ls.key(i))||'null');
                                        if(storeData){
                                            if ((new Date().getTime() - storeData.timeStamp) / 1000 > storeData.validTime) {
                                                ls.removeItem(ls.key(i));
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    }
                } catch (e) {
                    // 弃用LocalStorage
                    console.log("Info:LocalStorage不可用，使用Object缓存接口数据");
                }
            }
            return {
                dataStore: {},
                push: function(params) {
                    this.dataStore[me.generateDataMark(params.key)] = {
                        timeStamp: params.key.timeStamp,
                        responseData: params.data
                    };
                },
                get: function(fromInfo) {
                    return this.dataStore[me.generateDataMark(fromInfo)] || null;
                },
                remove: function(fromInfo) {
                    return delete this.dataStore[me.generateDataMark(fromInfo)];
                }
            };
        }();
        // 初始化接口
        return this.init();
    }
    InterfaceProxy.prototype = /**@lends module:InterfaceProxy# */{
        /**
         * 初始化
         * @this module:InterfaceProxy
         * @ignore
         */
        init: function() {
            // 变量交换
            var urlRes = this.options.interfaceConfig;
            // 提供 $Interface.[name] 操作方法 | 将 构造的getData在调用时的this指向getData[pn]本体
            var $InterfaceEx = {};
            for (var pn in urlRes) {
                if(!urlRes.hasOwnProperty(pn))continue;
                /**
                 * @typedef {function} interfaceMethod      - 自动生成的接口操作方法
                 * @property {unitInfo} interfaceInfo       - 接口信息，来源接口配置
                 * @property {unitInfo} info                - 接口信息，来源接口配置
                 * @property {string} url                   - 接口URL
                 * @example
                 * $interface.deleteWareHouse("WH3WE3W3345234ER23",function(data){
                 *      // 数据获取成功回调
                 *      console.log(data);
                 * },function(msg){
                 *      // 数据获取失败回调
                 *      console.log(msg);
                 * })
                 * // 默认第一个回调函数为成功，第二个为失败
                 * // 如果传入函数有名称(success、error)，则优先以函数名为准
                 *
                 */
                $InterfaceEx[pn] = function (pn) {
                    var me = this;
                    return function () {
                        return me.getData(pn).apply($InterfaceEx[pn], arguments);
                    }
                }.call(this,pn);
                $InterfaceEx[pn].interfaceInfo = urlRes[pn];
                $InterfaceEx[pn].info = urlRes[pn];
                $InterfaceEx[pn].url = $InterfaceEx[pn].interfaceInfo.url || $InterfaceEx[pn].interfaceInfo.origin + $InterfaceEx[pn].interfaceInfo.pathname;
            }
            // 对外提供接口全局操作方法
            this.options.globalVar && (window[this.options.globalVar] = $InterfaceEx);
            this.interface = $InterfaceEx;
            return $InterfaceEx;
        },
        /**
         * 根据名称&ID获取URL字符串
         * @this module:InterfaceProxy
         * @param urlName
         * @returns {*}
         * @ignore
         */
        loadUrlString: function(urlName) {



            // 变量交换
            var urlRes = this.options.interfaceConfig;
            var baseOrigin = this.options.origin;
            if (urlName) {
                var urlData = urlRes[urlName];
                if (urlData) {
                    if (urlData.origin) {
                        if (!urlData.origin.match(/\/$/) && !urlData.pathname.match(/^\//)) {
                            return urlData.origin + '/' + urlData.pathname;
                        }
                        return urlData.origin + urlData.pathname;
                    } else if (baseOrigin) return baseOrigin + urlData.pathname;
                    else return urlData.pathname;
                }
            }
            return null;
        },
        //
        /**
         * 生成接口数据交换操作函数
         * @this module:InterfaceProxy
         * @param urlName
         * @returns {Function}
         * @ignore
         */
        getData: function(urlName) {

            // 变量交换
            var obj = this;
            var paramFormat = function() {
                return obj.paramFormat.apply(obj, arguments);
            };
            var loadUrlString = function() {
                return obj.loadUrlString.apply(obj, arguments);
            };
            var getAlreadyObtain = function() {
                return obj.getAlreadyObtain.apply(obj, arguments);
            };
            var AjaxGetFailProcess = function() {
                return obj.AjaxGetFailProcess.apply(obj, arguments);
            };
            var AjaxGetSuccessProcess = function() {
                return obj.AjaxGetSuccessProcess.apply(obj, arguments);
            };

            /**
             * 构造接口调用函数
             * @param {*=} params        - 查询参数
             * @param {*=} callback      - 成功回调
             * @param {*=} errCallback   - 失败回调
             * @param {*=} promise       - 同步标记
             * @returns {*}
             */
            var interfaceMethod = function(params, callback, errCallback ,promise) {
                /*----------------------------------------------------
                                    支持参数传入格式
                    > callback
                    > callback,errCallback
                    > params,callback,errCallback
                    > [pArg1,pArg2..],callback,errCallback
                    > 依照Res配置默认构造方法填充未传入参数值
                 ----------------------------------------------------*/

                var defaultParams = this.interfaceInfo.params;
                if(this.interfaceInfo.login && !sessionStorage.getItem('secret')){
                    router.go({path:"/user/login",query:{back:true}});
                    return;
                }
                var captureParams = {};
                var captureCallback = null;
                var captureErrCallback = null;
                var promiseThen = false;

                // 默认参数值 由接口配置生成
                for (var pn in defaultParams) {
                    if(!defaultParams.hasOwnProperty(pn))continue;
                    captureParams[pn] = function (method) {
                        var tempParam = method;
                        if ($wd.isString(method)) {
                            try {
                                eval('tempParam =' + method);
                            } catch (e) {
                                tempParam = method;
                            }
                        }
                        if ($wd.isFunction(method))tempParam = method();
                        return tempParam;
                    }(defaultParams[pn]);
                }

                // 分析函数传入参数列表，提取 params,callback,errCallback
                var multiParamPattern = true;
                var multiParamNum = 0;
                [].forEach.call(arguments, function (param) {
                    // Promise标记
                    if(param==obj.promiseMark){
                        promiseThen = 1;
                        return;
                    }
                    // 提取成功与失败回调函数
                    if($wd.isFunction(param)){
                        if(/fail|error|errorCallback|errCallback/.test(param.name)){
                            captureErrCallback = param;
                            return;
                        }
                        if(/success|callback/.test(param.name)){
                            captureCallback = param;
                            return;
                        }
                        if(!captureCallback ){
                            captureCallback = param;
                            return;
                        }
                        if(!captureErrCallback ){
                            captureErrCallback = param;
                            return;
                        }
                    }
                    // 提取参数列表  单独 {} 配置
                    if ( $wd.isObject(param) ) {
                        $wd.objCover(captureParams,param);
                        multiParamPattern = false;
                    }
                    // 提取数组参数
                    // if ( $wd.isArray(param) ) {
                    //     captureParams = param;
                    //     multiParamPattern = false;
                    // }
                    // 多参数配置
                    if (multiParamPattern && !$wd.isFunction(param)) {
                        var attrNum = 0;
                        for (var an in defaultParams) {
                            if(!defaultParams.hasOwnProperty(an))continue;
                            if (attrNum++ == multiParamNum) {
                                captureParams[an] = param;
                                multiParamNum++;
                                break;
                            }
                        }
                    }
                });
                /**
                 * 默认失败回调
                 * 1. 如果没有配置通用回调和专用回调，则使用默认回调
                 * 2. 如果配置了通用回调，没有专用回调，则使用通用回调
                 * 3. 如果配置了通用回调和专用回调，则先调用专用回调，专用回调返回true则继续调用通用回调
                 * 4. 如果配置了通用回调和专用回调，则先调用专用回调，专用回调返回false，则过程结束
                 */
                if(!captureErrCallback){
                    captureErrCallback = obj.options.errCallback || function (msg) {
                        $Dialog.notify(msg);
                    }
                }else if(captureErrCallback && obj.options.errCallback){
                    captureErrCallback = (function (spCallback,baseCallback) {
                        return function () {
                            spCallback.apply(this,arguments)&&baseCallback.apply(this,arguments);
                        };
                    })(captureErrCallback,obj.options.errCallback);
                }

                // 基本参数处理
                var url = loadUrlString(urlName);
                captureParams = paramFormat(captureParams);
                var me = this;

                // 封装异步链式调用对象
                if(!promiseThen){
                    var agent = {};
                    var interfaceList = obj.interface;
                    var queue = [];
                    var appendObserver = function (target) {
                        if(!$wd.isArray(target.observers))target.observers = [];
                        target.observers.push(function name() {
                            $wd.arrayRemove(target.observers,name);
                            (queue.shift() || function () {})(this);
                        });
                    };
                    appendObserver(this);
                    agent = $wd.objCover(agent,interfaceList,function (method) {
                        return function () {
                            var argumentStock = [].slice.call(arguments,0);
                            argumentStock.push(obj.promiseMark);
                            appendObserver(method);
                            queue.push(function () {
                                method.apply(this,argumentStock);
                            });
                            return agent;
                        };
                    });
                    /**
                     * TODO 扩充promise实现
                     */
                    agent.then = function () {

                    };
                }

                // 异步请求加载中动画开始
                if (this.interfaceInfo.loading) {
                    window.$Loading && window.$Loading.coverShow($wd.isString(this.interfaceInfo.loading)?this.interfaceInfo.loading:null);
                }
                // 请求响应统一处理
                var onResponse = function (type,data) {
                    // 异步请求加载中动画结束
                    if (me.interfaceInfo.loading) {
                        window.$Loading && window.$Loading.coverHide($wd.isString(me.interfaceInfo.loading)?me.interfaceInfo.loading:null);
                    }
                    var resMap = {
                        "success":function (data) {
                            AjaxGetSuccessProcess({
                                data : data.data,
                                status : data.status,
                                fromInfo:fromInfo,
                                callback : captureCallback,
                                errCallback : captureErrCallback
                            });
                        },
                        "localSuccess":function (data) {
                            AjaxGetSuccessProcess({
                                data : data.data,
                                status : data.status,
                                fromInfo:fromInfo,
                                callback : captureCallback,
                                errCallback : captureErrCallback,
                                isLocalObtain : true
                            });
                        },
                        "error":function (data) {
                            var errText = "";
                            var errorType = data.errorType;
                            var status = data.status.status;
                            // 处理同域重定向跨域问题
                            if(status==0){
                                console.log(errorType);
                            }
                            if(errorType == "error" && status=="404"){
                                errText = "404 服务器找不到啦 (；′⌒`)"

                            }else if(errorType == "parsererror"){
                                // json解析失败，尝试作为HTML解析
                                if(data.status.response){
                                    $Dialog.alert(data.status.response);
                                    errText = "返回数据格式异常！";
                                }else{
                                    errText = "账户未登录！";
                                    if(!window.IntefaceProxy.loginTipState){
                                        window.IntefaceProxy.loginTipState = true;
                                        $Dialog.confirm("账户未登录，无法进行数据同步，\n是否要跳转到登录页面？",function () {
                                            var loginUrl = "http://m.littlebear.me/#!/user/login";
                                            location.href = encodeURI(loginUrl + "?service=" + location.href);
                                        });
                                    }
                                }
                            }else{
                                //errText = JSON.stringify(status)+'  \n'+errorType+'  \n'+describe;
                                errText = "服务器异常！";
                            }
                            AjaxGetFailProcess({
                                err : errText,
                                callback : captureCallback,
                                errCallback : captureErrCallback,
                                fromInfo : fromInfo
                            });
                        }
                    };
                    resMap[type] && resMap[type](data);
                    // promise observers
                    $wd.isArray(me.observers) && me.observers.forEach(function (callback) {
                        callback();
                    });
                };

                // 构造AJAX配置参数
                var _params = captureParams;
                var _pathParams = this.interfaceInfo.pathParams;
                var _type = $wd.isUndefined(this.interfaceInfo.type) ? 'get' : this.interfaceInfo.type;
                var _dataType = $wd.isUndefined(this.interfaceInfo.dataType) ? 'json' : this.interfaceInfo.dataType;
                var _jsonpCallBack = null;
                if (!$wd.isUndefined(this.interfaceInfo.jsonp)) {
                    _jsonpCallBack = this.interfaceInfo.jsonp;
                } else if (!$wd.isUndefined(this.interfaceInfo.dataType) && this.interfaceInfo.dataType.toLowerCase() == 'jsonp') {
                    _jsonpCallBack = obj.options.jsonp;
                }

                // 构造数据标记
                var fromInfo = {
                    interfaceInfo: this.interfaceInfo,
                    params: _params,
                    timeStamp: new Date().getTime()
                };

                // 尝试搜索本地数据
                var hasBeenFound = false;
                if (this.interfaceInfo.validTime) {
                    var localData = getAlreadyObtain(fromInfo);
                    if (localData) {
                        // 匹配到本地数据 异步返回数据 保证异步执行顺序
                        setTimeout(function () {
                            onResponse('localSuccess',{
                                data : localData,
                                status : status
                            });
                        },1);
                        hasBeenFound = true;
                    }
                }
                // ajax 获取数据
                if(!hasBeenFound){

                    // url path重构 pathParams
                    if(_pathParams){
                        for(var an in _pathParams){
                            if(!_pathParams.hasOwnProperty(an))continue;
                            var pathParamValue = $wd.getObjAttr(_params,an);
                            url = url + (/\/$/.test(url)?'':'/')+pathParamValue;
                            delete _params[an];
                        }
                    }

                    //参数表单字符串形式
                    if(this.interfaceInfo.paramsType){
                        if(this.interfaceInfo.paramsType == "JSON.stringfy"){
                            _params.selectedItemList = JSON.stringify(_params.selectedItemList);
                        }
                    }

                    // ajax配置
                    var ajaxOptions = {
                        type: _type,
                        url: url,
                        data: _params,
                        traditional: true,
                        // contentType: "application/json; charset=utf-8",
                        // contentType: "application/x-www-form-urlencoded",
                        dataType: _dataType,
                        jsonp: _jsonpCallBack,
                        // 请求头设置
                        beforeSend: function(request) {
                            var secret = sessionStorage.getItem('secret')?sessionStorage.getItem('secret'):"";
                            var key = sessionStorage.getItem('key')?sessionStorage.getItem('key'):"";
                            var timeStamp = (new Date()).valueOf()+'';
                            var timeWord = Hashes.hex_hmac(secret,timeStamp).toString().toUpperCase();
                            var authorParams = {
                                key:key,
                                timeStamp:timeStamp,
                                timeWord:timeWord
                            };
                            var authorStr = JSON.stringify(authorParams);
                            request.setRequestHeader("Authorization", authorStr);
                        },
                        // 跨域处理
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        // cache: true,
                        success: function(data, status) {
                            onResponse('success',{
                                data:data,
                                status:status
                            });
                        },
                        error: function(status,errorType,describe) {
                            onResponse('error',{
                                status:status,
                                errorType:errorType,
                                describe:describe
                            });
                        }
                    };
                    // AJAX 代理跨域模式 iFrame
                    // noinspection JSUnresolvedVariable
                    if(window.__crossOriginSrc__){
                        if(_type.toLocaleLowerCase()=='post')ajaxOptions.data = JSON.stringify(_params);
                        if( ((_type.toLocaleLowerCase()=='post'|| _dataType=="json") )
                            && $wd.parseURL(url).origin!=location.origin){
                            console.log("-------侦测到无法完成的跨域POST请求["+this.interfaceInfo.name+"]--尝试使用代理跨域模式");
                            //noinspection JSUnresolvedFunction,JSUnresolvedVariable
                            AjaxAgency({
                                crossOriginSrc:window.__crossOriginSrc__,
                                ajaxOptions:ajaxOptions
                            });
                            return;
                        }
                    }
                    // AJAX 普通模式
                    ($.ajax||$wd.ajax)(ajaxOptions);
                }
                return agent;
            };
            return  $wd.isFunction(interfaceMethod) && interfaceMethod;
        },
        /**
         * 过滤&转换参数
         * @param params
         * @returns {*}
         * @this module:InterfaceProxy
         * @ignore
         */
        paramFormat: function(params) {
            var result = {};
            if ($wd.isArray(params)) {
                return params;
            }
            if ($wd.isObject(params)) {
                for (var n in params) {
                    if(!params.hasOwnProperty(n))continue;
                    if (params[n] === null || params[n]==='') {
                        continue;
                    }
                    result[n] = params[n];
                }
                return result;
            }
            return null;
        },
        /**
         * Ajax数据预处理
         * 200+>接收数据处理:成功
         * @param options
         * @param {} options.data
         * @param {} options.data.returnCode
         * @param {} options.data.returnMsg
         * @this module:InterfaceProxy
         * @ignore
         */
        AjaxGetSuccessProcess: function(options) {
            // 基础配置
            var opt = {
                data : null,
                status : null,
                callback : null,
                errCallback : null,
                fromInfo:null,
                isLocalObtain : false
            };
            opt = $wd.objCover(opt,options);

            // 配置项转化
            var data = opt.data;
            var status =  opt.status;
            var callback =  opt.callback;
            var errCallback =  opt.errCallback;
            var fromInfo =  opt.fromInfo;
            var isLocalObtain =  opt.isLocalObtain;

            // 数据缓存处理
            var callbackEx = null,
                me = this;
            if (callback) {
                callbackEx = function(extractData) {
                    // 数据暂存
                    !isLocalObtain && fromInfo.interfaceInfo.validTime ? me.pushAlreadyObtain(fromInfo, data) : 0;
                    callback.apply(null, arguments);
                };
            }

            /*----------------------------------------------------
              接口返回值类型（200）
                    > 空 : 视为成功
                    > {result:success,...}
                        | {success:true,...}
                        | { data:?,.. } | { msg:?,..}
                                判断后进行成功或失败回调
                    > "{result:..}" |...    : 字符串返回，解析成json进行判断回调
                    > [{result:}]   |...    : 数组返回，提取内部对象进行判断回调
                    > data | msg | page ... : 统一整理后当做回调成功数据进行判断回调
             ----------------------------------------------------*/

            // 当返回数据为空 > 直接当做成功
            if (!data) {
                callbackEx && callbackEx(null);
                return;
            }

            // returnCode & returnMsg 处理
            if(typeof data.returnCode !='undefined'){
                if(data.returnCode==1){
                    callbackEx && callbackEx(data.data,data.returnMsg);
                    return;
                }
                var returnCodeMap = {
                    '-2': "没有权限访问",
                    '-1': "登录状态(session)失效",
                    '0': "失败",
                    '1': "成功",
                    '2': "数据格式不正确",
                    '3': "参数格式不正确",
                    '4': "核销数量达到上限",
                    '5': "核销数量达到上限，不能领取"
                };
                if(typeof data.returnMsg != "undefined" ){
                    errCallback && errCallback(data.returnMsg,data.returnCode);
                    return;
                }else{
                    if(returnCodeMap[data.returnCode])
                    errCallback && errCallback(returnCodeMap[data.returnCode],data.returnCode);
                    return;
                }
            }

            // 当返回数据包含 result:success > 提取返回数据
            if ((typeof data.result != 'undefined' && data.result == 'success') || (typeof data.success != 'undefined' && (data.success == true || data.success == 'true'))) {
                if (typeof data.data != 'undefined') {
                    // 包含data为字符串> 转换成json对象
                    if ($wd.isString(data.data)) {
                        eval("data.data = " + data.data);
                    }
                    // 包含 data & msg
                    if (data.msg || data.message) {
                        callbackEx && callbackEx(data.data, data.msg||data.message, status);
                        return;
                    }
                    // 包含 data
                    callbackEx && callbackEx(data.data, status);
                    return;
                } else {
                    // 包含 [data]
                    for (var n in data) {
                        if(!data.hasOwnProperty(n))continue;
                        if (n != 'result' && n != 'msg') {
                            callbackEx && callbackEx(data[n], status);
                            return;
                        }
                    }
                }
                callbackEx && callbackEx(null);
                return;
            }
            // 当返回数据不包含result > 视为成功   
            if (typeof data.result === 'undefined' && typeof data.success === 'undefined') {
                callbackEx && callbackEx(data);
                return;
            }

            // 其他情况 > 视为失败
            if (errCallback) {
                // AJAX 失败
                if (data.msg||data.message) {
                    errCallback(data.msg||data.message);
                } else {
                    errCallback('暂无错误信息（msg）');
                }
            }
        },
        /**
         * 200X>接收数据处理:失败
         * @param options
         * @this module:InterfaceProxy
         * @ignore
         */
        AjaxGetFailProcess: function(options) {
            // 基础配置
            var opt = {
                err : null,
                callback : null,
                errCallback : null,
                fromInfo : null
            };
            opt = $wd.objCover(opt,options);
            // 错误日志输出
            console.log(opt.fromInfo);
            console.log(opt.err);
            // AJAX 失败
            opt.errCallback && opt.errCallback(opt.err);
        },
        // 接口数据保存&预加载
        alreadyObtainEx: [
            /*-------------------------------
             已经获取的具有保存必要性的数据
                "name":{
                    "key":"fromInfo",
                    "data":"data",
                }
             ------------------------------*/
        ],
        /**
         * 生成数据标记
         * @param fromInfo
         * @returns {string}
         * @this module:InterfaceProxy
         * @ignore
         */
        generateDataMark: function(fromInfo) {
            var dataMark = "",an;
            for (an in fromInfo.interfaceInfo) {
                if(!fromInfo.interfaceInfo.hasOwnProperty(an))continue;
                dataMark += an;
                dataMark += fromInfo.interfaceInfo[an];
            }
            for (an in fromInfo.params) {
                if(! fromInfo.params.hasOwnProperty(an))continue;
                if (an == 'timeStamp' || an == '_') {
                    continue;
                }
                dataMark += an;
                dataMark += fromInfo.params[an];
            }
            dataMark = Hashes.hex_hmac(dataMark,'888');
            return dataMark;
        },
        /**
         * 保存数据
         * @param fromInfo
         * @param data
         * @this module:InterfaceProxy
         * @ignore
         */
        pushAlreadyObtain: function(fromInfo, data) {
            this.repository.push({
                "key": fromInfo,
                "data": data
            });
        },
        // 获得数据
        /**
         * 获得数据
         * @param fromInfo
         * @returns {*}
         * @this module:InterfaceProxy
         * @ignore
         */
        getAlreadyObtain: function(fromInfo) {
            var data = this.repository.get(fromInfo);
            if (data) {
                if ((new Date().getTime() - data.timeStamp) / 1000 > fromInfo.interfaceInfo.validTime) {
                    this.repository.remove(fromInfo);
                    return false;
                }
                return data.responseData;
            }
            return null;
        }
    };

    // 实例化一个强大的接口管理器 ~(～￣▽￣)～
    /** @namespace window.interfaceOptRes */
    if (!$wd.isUndefined(window.interfaceOptRes)) {
        window.$Interface = new InterfaceProxy(window.interfaceOptRes);
    }

    window.IntefaceProxy = InterfaceProxy;
    window.InterfaceProxy = InterfaceProxy;

    return InterfaceProxy;
});

