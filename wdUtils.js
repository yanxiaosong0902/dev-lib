/**
 *
 *
 *
 * @file 打杂       ┬—┬ノ('-'ノ)
 * @author yangxiaosong
 * @version 0.5.1
 */


/*================================================================================================*//*

 ### 功能说明
 `自己用的工具包`
 > 越来越大，越来越沉
 > ━━∑(￣□￣*|||━━


 > 完善isWhat 提供一个promise模式 ： isWhat(value).isFunction(callback).isString(callback)...;


 *//*==============================================================================================*/

/*===============================================================================================*//*

 ### 更新日志
 * 2016-8-30    新的功能：parseUrl 额外返回 hashQuery 的字符串
 * 2016-8-29    问题修复：数据dataBuilder匹配后依然触发自动渲染的BUG
 * 2016-6-13    一些改动：完善文档说明、添加一些示例
 * 2016-6-13    功能调整：移除getCss、getImage两个方法
 * 2016-6-5     新的功能：扩充objExtract功能，复杂滴很 +_+  "supplier.address.province=>province , proList=>productList , contact.phoneNumber " 可以写作数组形式
 * 2016-6-4     功能完善：增加setObjAttr, 示例 setObjAttr(obj,"supplier.address.province","河南省") 如果对应路径不存在则自动创建
 * 2016-6-3     功能完善：调整getObjAttr，支持 getObjAttr(obj,"supplier.address.province")
 * 2016-6-1     新的功能：增加 promise 模式的实现 $wd.promise
 * 2016-5-26    新的功能：isWhat扩展promise模式调用模式 isWhat(params).isString(callback).isObject(callback,barrier).isElement(callback)
 * 2016-5-26    功能完善：isWhat增加第三个参数 single ，提供匹配成功一次后退出的功能
 * 2016-5-20    问题修复：find[..,true] 时无法正确检查匹配自身，hasChild,has只能匹配最后一个元素
 * 2016-5-15    新的功能：getScript getCss.. 加载JS等资源并执行
 * 2016-5-9     新的功能：objExtract
 * 2016-5-9     新的功能：checkEmpty
 * 2016-5-8     新的功能：$wd.render
 * 2016-5-8     新的功能：Array.prototype.hasValue   Object.hasValue
 * 2016-5-7     功能完善：parseURL 只能加 origin 字段
 * 2016-5-7     新的功能：objCover 用于将一个对象的有属性依次覆盖到另一个对象 cover&combine
 * 2016-5-7     新的功能：Object,Array原型附加新方法hasValue，param1:value param2:degree ，搜索深度默认没有上限，0为基础等级
 * 2016-5-6     新的功能：getFormData createElemByTemplate
 * 2016-5-6     新的功能：$wd.has 升级，param2==true => 附加匹配自身
 * 2016-5-6     新的功能：Object原型添加forEachIn
 * 2016-5-5     新的功能：添加类型检查，从独立组件迁移而来  > 三c⌒っﾟДﾟ)っ
 * 2016-5-5     新的功能：(～￣▽￣)～ isWhat
 * 2016-5-4     新的功能：$wd.remove，用于从父节点移除元素自身
 * 2016-5-3     兼容处理：Array原型forEach，这个其实早就应该处理了...
 * 2016-4-30    功能完善：修复jsonP回调bug（ [name]()<= onLoad; )
 * 2016-4-29    新的功能：ajax，支持：json jsonP html get post
 * 2016-4-28    其他修改：调整顶部注释说明
 * 2016-4-21    重构代码：调整了一下代码结构，没有任何影响 (¯﹃¯)
 * 2016-4-20    开始记录更新日志

 *//*==============================================================================================*/

(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.$wd = factory();
    }
})(this, function () {

    //=========================================================
    //  类型检查
    //=========================================================
    function isType(type) {
        return function (obj) {
            return {}.toString.call(obj) === "[object " + type + "]";
        }
    }
    /**
     * 类型检查 Undefined
     * @function
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isUndefined = isType("Undefined");
    /**
     * 类型检查 Object
     * @function
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isObject = isType("Object");
    /**
     * 类型检查 Number
     * @function
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isNumber = isType("Number");
    /**
     * 类型检查 Array
     * @function
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isArray = Array.isArray || isType("Array");
    /**
     * 类型检查 Function
     * @function
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isFunction = isType("Function");
    /**
     * 类型检查 String 验证 字符串字面量 和 new String()
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isString = function (obj) {
        return isType("String")(obj) || obj instanceof String;
    };
    /**
     * 类型检查 Element
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isElement = function (obj) {
        return /^\[object HTML\w*Element]$/.test({}.toString.call(obj));
    };
    /**
     * 类型检查 HTMLCollection NodeList
     * @param  {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isElementArray = function (obj) {
        return {}.toString.call(obj) == '[object HTMLCollection]' || {}.toString.call(obj) == '[object NodeList]';
    };
    /**
     * 类型检查 TableElement {thead|tbody|tr|td|th...}
     * @param {*} obj 检查目标
     * @global
     * @returns {boolean}
     * */
    var isTableElement = function (obj) {
        return /^\[object HTMLTable\w*Element]$/.test({}.toString.call(obj));
    };

    //=========================================================
    //  类型检查扩展
    //=========================================================
    /**
     * 多类型检查
     * 支持传入链式操作
     * @param variable 变量
     * @param {(object|Array)} options  [ function isString(){} , ... ] , { isString : function(){} , ... }
     * @param single 检查<strong>成功一次</strong>后退出
     * @returns {{}}
     * @global
     * @example
     *
     * isWhat(document.createElement('div')).isTypes(['string','element','array'],function () {
     *     console.log("str | elem |  array ");
     * }).isObject(function () {
     *     console.log("obj");
     * }).isString(function () {
     *     console.log("str2");
     * }).isEqual("peter",function () {
     *     console.log("peterE1");
     * },1).isEqual("peter",function () {
     *     console.log("peterE2");
     * });
     * // => str | elem |  array
     *
     */
    var isWhat = function (variable, options, single) {
        // 类型检查名称
        var typeMap = {
            'isFunction': isFunction,   // function 是关键字，不能用啦
            'array': isArray, 'isArray': isArray,
            'object': isObject, 'isObject': isObject,
            'undefined': isUndefined, 'isUndefined': isUndefined,
            'string': isString, 'isString': isString,
            'number': isNumber, 'isNumber': isNumber,
            'element': isElement, 'isElement': isElement,
            'elementArray': isElementArray, 'isElementArray': isElementArray,
            'tableElement': isTableElement, 'isTableElement': isTableElement,
            'isEqual':null, // 自定义检查
            "isTypes":null   // 自定义检查
        };
        // ---1-->--2-->--3-->---
        // options : [ function isString(){} , ... ]
        single = single ?  1 : options && options.length;
        void(isArray(options) && Array.prototype.forEach.call(options, function (callback) {
            void(callback.name && typeMap[callback.name] && typeMap[callback.name](variable) && !function () {
                void(single-- && single >= 0 && callback());
            }());
        }));
        // options : { isString : function(){} , ... }
        void(isObject(options) && Object.forEachIn.call(options, function (callback, type) {
            void(type && typeMap[type] && typeMap[type](variable) && !function () {
                void(single-- && single >= 0 && callback());
            }());
        }));
        // ---1-->--{}.A()-->--{}.B()-->---
        var next = {};
        for (var an in typeMap) {
            if (!typeMap.hasOwnProperty(an))continue;
            /**
             * @param {string} type
             * @param {...*} 之后的为可变参数
             */
            next[an] = function (type) {
                // 参数形式
                // 比较值cmpValue 成功回掉callback
                // 比较值cmpValue 成功回掉callback 成功后终结标记barrier
                // 成功回掉cmpValue 成功后终结标记callback
                return function (cmpData, callback, barrier) {
                    // params : callback
                    if(arguments.length===1)callback = cmpData;
                    // params : callback barrier
                    if(arguments.length===2 && !isFunction(callback)){
                        barrier = callback;
                        callback = cmpData;
                    }
                    // isEqual处理
                    if(type==="isEqual") {
                        (variable==cmpData) && callback();
                    }
                    // isType处理
                    else if(type==="isTypes"){
                        // 检查类型数组中有对应值则返回
                        isArray(cmpData)&&cmpData.slice(0).forEach(function (typeName) {
                            if( typeMap[typeName] && typeMap[typeName](variable)){
                                callback();
                                cmpData.splice(0,cmpData.length);
                            }
                        });
                    }
                    // 普通类型检查处理
                    else if( typeMap[type](variable) && callback ) {
                        callback();
                    }
                    // 成功一次后终结处理
                    if (barrier) {
                        for (var an in next) {
                            if (!next.hasOwnProperty(an))continue;
                            next[an] = function () {
                                return next;
                            };
                        }
                    }
                    return next;
                };
            }(an);
        }
        return next;
    };

    //=========================================================
    //  兼容性处理
    //=========================================================
    // console
    console.log || (console.log = new Function());
    console.warn || (console.warn = console.log);
    console.error || (console.error = console.log);
    console.group || (console.group = console.log);
    console.groupEnd || (console.groupEnd = console.log);
    // Array.prototype.forEach
    isUndefined(Array.prototype.forEach) && (Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) callback(this[i], i, this);
    });
    /**
     * 遍历对象所有键值 Object.forEach
     * @param callback
     */
    Object.forEachIn = function (callback) {
        for (var an in this) {
            if (!this.hasOwnProperty(an))continue;
            callback(this[an], an, this);
        }
    };

    //=========================================================
    //  Console优化
    //=========================================================
    /**
     * 五颜六色的Console ~\(≧▽≦)/~
     * <div><img width="1000" src="../img/richLogExample.png"/></div>
     * @param {{title,detail}} options  - 标题和描述
     * @param {...*} [args]     - args及之后的传入参数会被console.log依次输出
     * @memberof $wd
     * @example
     *
     * $wd.richLog(
     *    { title:'日志标题' , detail:'日志详情描述' } ,
     *    param2 ,
     *    param3 ,
     *    ...
     * )
     *
     */
    function richLog(options,args) {
        var pathParts;
        try {
            this.error = "just".a.error;
        }
        catch(e) {
            e.stack || (e.stack = {});
            var stackLines = e.stack.split('\n');
            var callerIndex;
            // 找到上级函数在调用栈中的行数
            for(var i in stackLines){
                if(!stackLines.hasOwnProperty(i))continue;
                if(!stackLines[i].match(/http[s]?:\/\//)) continue;
                callerIndex = Number(i) + 1;
                break;
            }
            // 提取调用栈信息
            stackLines[callerIndex] || (stackLines[callerIndex]="");
            pathParts = stackLines[callerIndex].match(/(http[s]?:\/\/.+\/)([^\/]+\.(?:js|html))[^:]*(:[^)]+)/);
            void(pathParts || (pathParts = [stackLines[callerIndex]]));
        }
        // 日志按组输出
        options = options || {};
        console.group( options.title ||'日志输出 '+(new Date()).toLocaleString());
        options.detail && console.log('%c'+ options.detail,
            "background-image:-webkit-gradient(linear, left top, right top," +
            "color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #4ff), color-stop(1, #22f) );" +
            "color:transparent; -webkit-background-clip: text;font-size:1.1em;");
        console.log("%c调用函数"+(arguments.callee.caller ? arguments.callee.caller.name : "")+"："+pathParts[0],"color:green");
        [].forEach.call(arguments,function (data,index) {
            index > 0 && console.log(data);
        });
        console.groupEnd();
    }

    //=========================================================
    //  URL解析
    //=========================================================
    /**
     * 解析URL 返回 解析数据对象
     * @param {string} url 需要解析的URL
     * @returns {{source: *, query: (*|Document.search|string), origin: *, params, protocol: string, host: (*|string|string), port: (*|string|Function), file: *, hash: string, path: (string|void|*|XML), relative: *, segments: Array}}
     * @memberof $wd
     */
    function parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            query: a.search,
            origin: a.origin,
            params: function () {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&');
                if(seg==false)return {};
                seg.forEach(function (e, index, arr) {
                    arr[index] = {
                        name: e.split('=')[0],
                        value: decodeURI(e.split('=')[1])
                    };
                });
                seg.forEach(function (e) {
                    var name = e.name;
                    var obj = [];
                    if (typeof ret[name] === 'undefined') {
                        seg.forEach(function (e) {
                            if (e.name === name)obj.push(e.value);
                        });
                        if (obj.length === 1) ret[name] = obj[0];
                        else ret[name] = obj;
                    }
                });
                return ret;
            }(),
            hashQuery:function () {
                return (a.hash.match(/(?=\?).*/)&&a.hash.match(/(?=\?).*/)[0]) || "";
            }(),
            hashParams:function () {
                if(!/.*\?/.test(a.hash))return {};
                var ret = {},
                    seg = a.hash.replace(/.*\?/g, '').split('&');
                seg.forEach(function (e, index, arr) {
                    arr[index] = {
                        name: e.split('=')[0],
                        value: decodeURIComponent(e.split('=')[1])
                    };
                });
                seg.forEach(function (e) {
                    var name = e.name;
                    var obj = [];
                    if (typeof ret[name] === 'undefined') {
                        seg.forEach(function (e) {
                            if (e.name === name)obj.push(e.value);
                        });
                        if (obj.length === 1) ret[name] = obj[0];
                        else ret[name] = obj;
                    }
                });
                return ret;
            }(),
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['',''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['',''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    }

    //=========================================================
    // 数组操作
    //=========================================================
    /**
     * 查找是否存在相同数值 遍历检查数组或对象所有的值
     * @param {*} value 查询值
     * @param {number} degree 查询深度
     * @memberof Array.
     */
    Array.hasValue = Object.hasValue = function (value, degree) {
        var isMatch = false, searchDegree = degree >= 0 ? degree : -1 >>> 1;
        ( (isObject(this) && Object.forEachIn) || (isArray(this) && [].forEach) ).call(this, function (data) {
            if (data == value)return isMatch = true;
            if (isMatch || searchDegree < 1)return;
            if (isArray(data))if (Array.hasValue.call(data, value, searchDegree - 1))return isMatch = true;
            if (isObject(data))if (Object.hasValue.call(data, value, searchDegree - 1))return isMatch = true;
        });
        return isMatch;
    };
    function hasValue(obj,value,degree) {
        return Array.hasValue.call(obj,value,degree);
    }
    /**
     * 数组遍历
     * @param array 数组
     * @param callback 回调函数 value,index,array
     * @memberof $wd
     */
    function forEach(array, callback) {
        [].forEach.call(array, callback);
    }
    /**
     * 检查数组内是否有目标数据项 简单遍历检查
     * @param array 数组
     * @param targetData 匹配数值
     * @returns {boolean}
     * @memberof $wd
     */
    function arrayHas(array, targetData) {
        var isMatch = false;
        [].forEach.call(array, function (data) {
            isMatch = (targetData == data);
        });
        return isMatch;
    }
    /**
     * 移除数组内与目标数据相同项 会修改原数组
     * @param array 数组
     * @param targetData 目标数据
     * @returns {*}
     * @memberof $wd
     */
    function arrayRemove(array, targetData) {
        var newArray = [];
        [].forEach.call(array, function (data) {
            if(data!==targetData)newArray.push(data);
        });
        [].splice.apply(array,[0,array.length].concat(newArray));
        return array;
    }
    //=========================================================
    // 链式调用 Promise
    // $wd.promise( function(next){ next(data) }).then( function(next,data){ next() })
    // 如果使用 .then.then.sync() 会同步开始调用过程
    //=========================================================
    /**
     * 链式调用&Promise
     * @param callback {function} 回调函数
     * @returns {{then: then, sync: sync}} 返回链式调用结构
     * @memberof $wd
     * @example
     *
     * $wd.promise(function (next) {
     *    console.log('1');
     *    next();
     * })
     * .then(function (next) {
     *    console.log('2');
     *    next();
     * })
     * .then(function (next) {
     *    console.log('3');
     *    next();
     * }).sync();
     * console.log("start");
     *
     * // => 1 2 3 start
     * // 去掉 .sync()
     * // => start 1 2 3
     *
     */
    function promise(callback) {
        var start = false, queue = [], next = function () {
            (queue.shift() || function () {
            }).apply(this, [next].concat([].slice.call(arguments, 0)));
        };
        setTimeout(function () {
            !start && callback(next);
        }, 1);
        return {
            then: function (callback) {
                queue.push(callback);
                return this;
            },
            sync: function () {
                start = true;
                callback(next);
            }
        };
    }

    //=========================================================
    //  Element  Query & Show & Hide
    //=========================================================
    /**
     * 显示目标元素 在style属性中附加display:none
     * @param {Element} elem 需要显示的元素
     * @memberof $wd
     */
    function showElem(elem) {
        if (!elem) return;
        var attrStr = elem.getAttribute('style');
        if (attrStr == null) return;
        // 删除掉 style 中的 display:none
        elem.setAttribute('style', attrStr.replace(/display *: *none;* */g, ""));
    }
    /**
     * 隐藏目标元素
     * @param {Element} elem 需要隐藏的元素
     * @memberof $wd
     */
    function hideElem(elem) {
        if (!elem) return;
        var attrStr = elem.getAttribute('style');
        if (attrStr == null) {
            elem.setAttribute('style', 'display: none;');
            return;
        }
        if (/display *: *none;* */.test(attrStr)) {
            return;
        }
        elem.setAttribute('style', /; *$/.test(attrStr) ? attrStr + 'display: none;' : attrStr + ';display: none;');
    }

    //=========================================================
    //  Element Query
    //=========================================================
    /**
     * 选择器
     * @param selector
     * @namespace $wd
     * @global
     * @returns {Array}
     */
    var $wd = function (selector) {
        /**
         * @namespace selectElementsList
         * @extends Array
         */
        var selectElementsList = [];
        // 字符串  > 选择器模式
        if (selector instanceof String || typeof selector === "string")
            selectElementsList = [].slice.call(document.querySelectorAll(selector));
        // HTML Element
        if (isElement(selector))
            selectElementsList.push(selector);
        // HTML Element Array
        if (isElementArray(selector))
            selectElementsList = [].slice.call(selector);

        /**
         * 设置样式
         * @param cssStr
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.setStyle = function (cssStr) {
            this.forEach(function (elem) {
                elem.style.cssText = cssStr;
            });
            return this;
        };
        /**
         * 修改元素内的HTML
         * <pre>
         *     //有XSS问题 ╮(╯-╰)╭
         *     $wd('.title').html('<img src="http://i1.hdslb.com/icon/5d599bbb5276c1e92e261aceb8f75331.gif" onerror="alert("请检查网络连接，图片不见了(；′⌒`)")">');
         * </pre>
         * @param option {(string|Element|function)} 可以为字符串（htmlStr）、元素、返回值为这三种类型的元素
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.html = function (option) {
            this.forEach(function (elem) {
                // 清空原有内容
                elem.innerHTML = "";
                isWhat(option).isString(function () {
                    elem.innerHTML = option;
                }).isElement(function () {
                    elem.appendChild(option);
                }).isFunction(function () {
                    var result = option();
                    isWhat(result).isTypes(['string','element'],function () {
                        $wd(elem).html(result);
                    });
                });
            });
            return this;
        };
        /**
         * 移除元素 无参数移除自身，有参数移除参数匹配对象
         * @param {undefined|string} options  undefined:移除选择器内元素内参数选中的元素于父节点 string:移除选择器选中元素于父节点
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.remove = function (options) {
            this.forEach(function (elem) {
                if (isUndefined(options))
                    elem.parentNode && elem.parentNode.removeChild(elem);
                if (isString(options) || isElement(options))
                    $wd(elem).find(options).remove();
            });
            return this;
        };
        /**
         * 添加Class
         * @param classStr
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.addClass = function (classStr) {
            this.forEach(function (elem) {
                if (!new RegExp('\\b' + classStr + '\\b').test(elem.className)) {
                    var classList = elem.className.split(' ');
                    classList.push(classStr);
                    elem.className = classList.join(' ');
                    // 整理className
                    elem.className = elem.className.replace(/^ +/, '').replace(/ {2,}/g, ' ');
                }
            });
            return this;
        };
        /**
         * 移除Class
         * @param {string} classStr class名称
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.removeClass = function (classStr) {
            this.forEach(function (elem) {
                if (new RegExp('\\b' + classStr + '\\b').test(elem.className)) {
                    // 移除class
                    elem.className = elem.className.replace(new RegExp('\\b' + classStr + '\\b'), '');
                    // 整理className
                    elem.className = elem.className.replace(/^ +/, '').replace(/ {2,}/g, ' ');
                }
            });
            return this;
        };
        /**
         * 选择器容器内元素遍历
         * @param {function} callback 回调函数
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.forEach = function (callback) {
            [].forEach.call(this, callback);
            return this;
        };
        /**
         * 选择器容器内查找
         * @param {string} cssStr 匹配规则字符串
         * @param {boolean=} [selfMatch=false] 是否匹配自身
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.find = function (cssStr, selfMatch) {
            var tempElements = [0];
            this.forEach(function (elem) {
                // 检查自身是否符合条件
                selfMatch && function () {
                    var match = false;
                    if (elem.parentNode) {
                        match = $wd(elem.parentNode).find(cssStr).has(elem);
                    } else {
                        // 对于没有父节点的元素，构造一个父节点加入其中之后对父节点进行查找
                        var curParentElem = document.createElement('div');
                        curParentElem.appendChild(elem);
                        match = $wd(curParentElem).find(cssStr).has(elem);
                        $wd(curParentElem).remove();
                    }
                    match && tempElements.push(elem);
                }();
                forEach(elem.querySelectorAll(cssStr), function (elem) {
                    var has = false;
                    forEach(tempElements, function (stockElem) {
                        has = stockElem === elem;
                    });
                    !has && tempElements.push(elem);
                });
            });
            this.splice(0, this.length);
            tempElements.splice(1, 0, this.length);
            this.splice.apply(this, tempElements);
            return this;
        };
        /**
         * 特性操作 Attr
         * @param {string} options attr名称
         * @param {string=} value  如果value参数，则会对选择器容器内第一个元素的对应attr进行赋值
         * @returns {selectElementsList|string} 如果不包含第二个参数返回对应attr值，包含第二个参数则返回改变对应attr值之后的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.attr = function (options, value) {
            if (isString(options) && isString(value)){
                this[0].setAttribute(options, value);
                return this;
            }
            if (isString(options) && isUndefined(value))
                return this[0] && this[0].getAttribute(options);
        };
        /**
         * 隐藏元素
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.hide = function () {
            this.forEach(function (elem) {
                hideElem(elem);
            });
            return this;
        };
        /**
         * 显示元素
         * @returns {selectElementsList} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.show = function () {
            this.forEach(function (elem) {
                showElem(elem);
            });
            return this;
        };
        /**
         * 检查当前容器内的元素列表中是否有目标元素
         * @param {element} targetElem 目标元素
         * @returns {boolean}
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.has = function (targetElem) {
            var isMatch = false;
            this.forEach(function (elem) {
                if (targetElem == elem)isMatch = true;
            });
            return isMatch;
        };
        /**
         * 检查当前容器的元素的子节点是否有目标元素
         * @param {element} targetElem 目标元素
         * @returns {boolean}
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.hasChild = function (targetElem) {
            var isMatch = false;
            this.forEach(function (elem) {
                forEach(elem.children, function (elem) {
                    if (targetElem == elem)isMatch = true;
                });
            });
            return isMatch;
        };
        /**
         * 获取表单元素的Value
         * @param {(number|string)=} value 如果有这个参数，则以此作为表单元素的新值
         * @returns {selectElementsList}
         * @memberof selectElementsList
         * @this selectElementsList
         */
        selectElementsList.value = function (value) {
            // 如果元素为空直接返回
            if (this.length <= 0)return null;
            // radio pattern | 设置value时，如果没有对应的radio返回null | 没有选中任何radio返回null
            var isRadio = true, radioValue = null, singleName = null, isSelect = false;
            // select pattern | 设置value时，如果没有对应的option返回null
            var selectValue = null, checkedEnd = false, isSelectMatch = false;
            this.forEach(function (elem, index) {
                if (checkedEnd)return;
                if (index === 0)singleName = elem.name;
                if (index >= 0 && elem.name !== singleName) {
                    console.warn("Warning:尝试获取value的RadioList存在不同的Name");
                }
                // Radio设置对应值
                if (elem.type === 'radio') {
                    if (value === null) {
                        elem.checked = false;
                        return;
                    }
                    if (!isUndefined(value) && elem.value == value) {
                        elem.checked = true;
                    }
                    if (elem.checked == true) {
                        radioValue = elem.value;
                    }
                } else {
                    isRadio = false;
                }
                // Select处理
                if (elem.tagName === "SELECT" && !isUndefined(value)) {
                    isSelect = checkedEnd = true;
                    $wd(elem).find('option').forEach(function (elem) {
                        if (elem.value == value)isSelectMatch = true;
                    });
                    if (isSelectMatch)elem.value = value;
                    selectValue = elem.value;
                }
            });
            if (isSelect && isSelectMatch)return selectValue;
            if (isSelect && !isSelectMatch)return null;
            if (isRadio)return radioValue;
            if (!isUndefined(value))
                this[0].value = value;
            return this[0].value;
        };
        /**
         * 获取表单数据 data-formName标记的值为名称
         * @returns {{}}
         * @memberof selectElementsList
         * @this selectElementsList.
         */
        selectElementsList.getFormData = function () {
            var formData = {};
            this.find('[data-formName]', true).forEach(function (elem) {
                var dataName = elem.getAttribute('data-formName');
                if (elem.tagName == "INPUT" || elem.tagName == "SELECT" || elem.tagName == "TEXTAREA" || elem.tagName == "RADIO") {
                    formData[dataName] = $wd(elem).value();
                }
            });
            return formData;
        };
        /**
         * 数据渲染
         * @param {object} config                               - 基础配置对象
         * @param {(object)=} config.data                       - 数据
         * @param {string=} [config.attrName="data-global"]     - 关联属性名称
         * @param {array=} config.dataBuilder                   - 数据构造器数组
         * @param {object=} config.dataOperator                 - 数据事件绑定对象
         * @param {*=} [config.params=null]                     - 附加参数，会作为构造器函数调用时的第三个参数
         * @param {object=} [config.reset=true]                 - 无匹配元素置空
         * @returns {*} 返回当前可操作的元素列表
         * @memberof selectElementsList
         * @this selectElementsList
         * @example $wd('div').render({data:{supplierName:123123}}).render({data:{warehouseName:123123}});
         */
        selectElementsList.render = function (config) {
            var options = {
                // 列表数据
                data: [],
                // 数据构造 | data-name | [  { dataName:[string],setMethod:[function|string] },   function name(){}  ]
                dataBuilder: [],
                dataOperator:{},
                // 渲染目标
                attrName: 'data-global',
                // 附加参数
                params: null,
                autoMatch:true,
                // 无匹配元素置空
                reset: false
            };
            $wd.objCover(options, config);
            var data = options.data;
            // 遍历容器中所有的元素
            this.forEach(function (elem) {
                // 构造内容构建方法
                var buildElem = function (elem) {
                    var isMatch = false;
                    var dataName = $wd(elem).attr(options.attrName);
                    // 检查dataBuilder []  模式匹配
                    options.dataBuilder.forEach(function (builder) {
                        // 函数模式 function name (){}
                        if (isFunction(builder)) {
                            if (builder.name !== dataName)return;
                            builder(data,elem,options.params);
                            isMatch = true;
                            return;
                        }
                        // Object模式 {dataName:"",setMethod:Function,getMethod:Function}
                        if (builder.dataName !== dataName)return;
                        if (isUndefined(builder.setMethod))return;
                        // 存在构造方法 setMethod
                        // 1、字符串 > 尝试进行执行
                        // 2、函数 > 执行并分析返回值，如果返回值为字符串或元素则进行构造
                        if (isString(builder.setMethod)) {
                            elem.textContent = builder.setMethod;
                            isMatch = true;
                        } else if (isFunction(builder.setMethod)) {
                            // 构造对应ListItem的ListControlStruct
                            builder(data,elem,options.params);
                            isMatch = true;
                        } else {
                            console.error("Error:匹配的dataBuilder执行异常.");
                        }
                    });
                    return isMatch;
                };
                // 构造事件绑定方法
                var bindEvent = function (elem) {
                    var isMatch = false;
                    (isArray(options.dataOperator) ? options.dataOperator : function (dataOperator) {
                        // dataOperator {object} => {array}
                        var result = [];
                        for (var dataName in dataOperator) {
                            if (!dataOperator.hasOwnProperty(dataName))continue;
                            var operateInfo = dataOperator[dataName];
                            // -->--[->-]-->--
                            if (isFunction(operateInfo)) {
                                operateInfo = {
                                    listener: dataName===operateInfo.name? 'click':operateInfo.name,
                                    callback: operateInfo
                                }
                            }
                            // 将对象属性名作为标记为元素特性值
                            if (isObject(operateInfo)) operateInfo.dataName = dataName;
                            else console.log("Error : dataOperator中有成员不是函数或者对象！");
                            result.push(operateInfo);
                        }
                        return result;
                    }(options.dataOperator)).forEach(function (operateInfo) {
                        // dataOperator {array}
                        if (isFunction(operateInfo)) {
                            operateInfo = {
                                dataName: operateInfo.name,
                                callback: operateInfo
                            };
                        }
                        operateInfo.listener || (operateInfo.listener = "click");
                        console.log($wd(elem).attr(options.attrName));
                        if (!isUndefined(operateInfo.dataName) && operateInfo.dataName !== $wd(elem).attr(options.attrName))return;
                        // 绑定事件
                        isFunction(operateInfo.callback) && elem.addEventListener(operateInfo.listener, function () {
                            operateInfo.callback.call(data, elem, options.params);
                        });
                        isMatch = true;
                    });
                    return isMatch;
                };
                // 开始实际渲染过程
                $wd(elem).find('[' + options.attrName + ']', true).forEach(function (elem) {
                    var dataName = $wd(elem).attr(options.attrName);
                    // 数据匹配
                    var isMatch =
                        // 检查 dataBuilder []  模式匹配
                        buildElem(elem) ||
                        // 检查 autoMatch 使用{object}data中的对应data-name的值填充
                        function () {
                            if (options.autoMatch && !isMatch) {
                                for (var an in data) {
                                    if (!data.hasOwnProperty(an))continue;
                                    if (dataName === an) {
                                        isMatch = true;
                                        if (elem.tagName === "INPUT" || elem.tagName === "SELECT") {
                                            $wd(elem).value(data[an]);
                                            continue;
                                        }
                                        if (elem.tagName === "IMG") {
                                            elem.src = data[an];
                                            continue;
                                        }
                                        if (elem.tagName === "A") {
                                            elem.href = data[an];
                                            continue;
                                        }
                                        if ($wd(elem).attr("parseHTML") == 'true') {
                                            $wd(elem).html(data[an]);
                                            continue;
                                        }
                                        elem.textContent = data[an];
                                    }
                                }
                            }
                            return isMatch;
                        }();
                    // 事件绑定
                    // 检查 dataOperator {} 模式匹配
                    bindEvent(elem);
                    // 没有匹配的进行重置 options.reset==true
                    if (options.reset && !isMatch) {
                        /**
                         * @todo 有空完善这个内容重置代码 (╯‵□′)╯ •••*～●
                         */
                        $wd(elem).value(null);
                        isMatch = true;
                    }
                    // 没有任何匹配进行警告
                    if (!isMatch) {
                        richLog({
                            title: '发现一个无匹配项 [' + dataName + ']',
                            detail: 'Warning:一个元素 [data-name="' + dataName + '"] 没有匹配到对应数据 > (°∀°)ﾉ'
                        }, elem, data);
                    }
                });
            });
            return this;
        };
        return selectElementsList;
    };
    /**
     * 单个元素选择器
     * 类似querySelector
     * @param selector 选择器
     * @returns {element} 返回符合传入选择器规则的元素，如果为数组则返回第一个元素
     * @global
     */
    var $wds = function (selector) {
        // Fake Facade <(￣︶￣)>
        var targetElements = [];
        // 字符串  > 选择器模式
        if (isString(selector))
            targetElements = [].slice.call(document.querySelectorAll(selector));
        // HTML Element
        if (isElement(selector))
            targetElements.push(selector);
        // HTML Element Array
        if (isElementArray(selector))
            targetElements = [].slice.call(selector);
        if (targetElements.length >= 1)return targetElements[0];
    };

    //=========================================================
    // 节点操作
    //=========================================================
    /**
     * 节点后插入
     * @param {Element} targetElement
     * @param {Element} newElement
     * @memberof $wd
     */
    function insertAfter(targetElement, newElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }
    /**
     * 节点（表格元素）后插入
     * @param {Element} targetElement 目标元素
     * @param {Element} targetElement.parentElement 父元素节点
     * @param {Element} newElement
     * @returns {*}
     * @memberof $wd
     */
    function insertAfterTable(targetElement, newElement) {
        if (isTableElement(targetElement)) {
            var maxDegree = 10;
            var posElem = null;
            while (isTableElement(targetElement) && targetElement.parentElement) {
                posElem = targetElement;
                targetElement = targetElement.parentElement;
                if (maxDegree++ > 10)break;
            }
            if (isElement(targetElement)) {
                insertAfter(posElem, newElement);
                return newElement;
            }
        }
        return null;
    }
    /**
     * 简单AJAX
     * @param config
     */
    $wd.ajax = function ajax(config) {
        // 默认配置
        var options = {
            type: 'GET',
            url: '',
            data: null,
            traditional: false,
            dataType: 'json',
            jsonp: 'callback',
            cache: true,
            success: function () {},
            error: function () {},
            uploading: function (percent) {
                console.log(percent);
            },
            headers:{
                Accept:"application/json, text/plain, */*"
            }
        };
        $wd.objCover(options, config);
        var xhr = new XMLHttpRequest();
        // jsonp计数器
        isUndefined(ajax.jsonpCounter) && (ajax.jsonpCounter=100);
        // 上传状态
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(xhr.responseText);
                } else {
                    errCallback(xhr.responseText);
                }
            }
        };
        // 上传进度
        /**
         * @param {{loaded,total}} evt
         */
        xhr.upload.onprogress = function (evt) {
            var loaded = evt.loaded;
            var total = evt.total;
            var percent = Math.floor(100 * loaded / total);
            options.uploading && options.uploading(percent);
        };

        if (options.dataType.toLocaleLowerCase() == 'jsonp') {
            var jsonpCallbackName = 'jsonp' + ajax.jsonpCounter++;
            window[jsonpCallbackName] = function (data) {
                callback(data);
            };
            var pageScript = document.createElement('script');
            pageScript.type = 'text/javascript';
            pageScript.src = createQueryUrl(true);

            document.head.appendChild(pageScript);
            pageScript.onload = function () {
                //window[jsonpCallbackName]();
                delete window[jsonpCallbackName];
            };
            pageScript.onerror = function () {
                errCallback('jsonp加载失败');
            };
        } else {
            // 启动请求
            switch (options.type.toUpperCase()) {
                case 'GET':
                    doGet();
                    break;
                case 'POST':
                    doPost();
                    break;
                default:
                    break;
            }
        }

        function createQueryUrl(jsonp) {
            if(jsonp){
                return (createQueryUrl() + '&' + options.jsonp + '=' + jsonpCallbackName).replace(/\?$/,"");
            }
            return (options.url + '?' + serialDataToQuery(options.data)).replace(/\?$/,"");
        }

        function callback(resourceData) {
            var dataPreProcessing = {
                'json': function () {
                    try {
                        return JSON.parse(resourceData);
                    } catch (e) {
                        console.log("Error:不合法的JSON字符串:" + resourceData);
                    }
                },
                'jsonp': function () {
                    return resourceData;
                },
                'html': function () {
                    return resourceData;
                }
            };
            var dataType = options.dataType.toLocaleLowerCase();
            options.success && options.success(dataPreProcessing[dataType] && dataPreProcessing[dataType]());
        }

        function errCallback(msg) {
            options.error && options.error(msg);
        }

        function serialDataToQuery(data) {
            if (isObject(data)) {
                var queryList = [];
                for (var an in data) {
                    if(!data.hasOwnProperty(an))continue;
                    queryList.push(an + '=' + data[an]);
                }
                return queryList.join('&');
            }
            console.error("暂时只支持对象作为数据！");
        }

        function doGet() {
            xhr.open("GET", createQueryUrl());
            for(var name in options.headers){
                if(!options.headers.hasOwnProperty(name))continue;
                xhr.setRequestHeader(name, options.headers[name]);
            }
            // 直接发送数据
            xhr.send(options.data);
        }

        function doPost() {
            xhr.open("post", options.url);
            // 直接发送数据
            xhr.send(serialDataToQuery(options.data));
        }

    };
    //=========================================================
    //  Element Template Create
    //=========================================================
    /**
     * 使用HTML str创建单个节点
     * @param htmlString  创建HTML使用的字符串 HTML str
     * @returns {Node|NodeList} 返回构造好的单个节点 或者 节点数组
     * @memberof $wd
     */
    function createElementByHtml(htmlString) {
        var map = {
            "td": [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            "th": [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            "tr": [2, "<table><thead>", "</thead></table>"],
            "option": [1, "<select multiple='multiple'>", "</select>"],
            "optgroup": [1, "<select multiple='multiple'>", "</select>"],
            "legend": [1, "<fieldset>", "</fieldset>"],
            "thead": [1, "<table>", "</table>"],
            "tbody": [1, "<table>", "</table>"],
            "tfoot": [1, "<table>", "</table>"],
            "colgroup": [1, "<table>", "</table>"],
            "caption": [1, "<table>", "</table>"],
            "col": [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            "link": [3, "<div></div><div>", "</div>"]
        };
        if (!htmlString) return null;

        var tagName = htmlString.match(/<(\w+)/) && htmlString.match(/<(\w+)/)[1] ?
            htmlString.match(/<(\w+)/)[1] : 0;

        var mapEntry = map[tagName] ? map[tagName] : null;
        if (!mapEntry) mapEntry = [0, "", ""];

        var div = document.createElement("div");

        div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];

        while (mapEntry[0]--) div = div.lastChild;

        if (div.childNodes && div.childNodes.length == 1)
            return div.childNodes[0];
        return div.childNodes;
    }

    /**
     * 使用模板str生成元素
     * @param template {string|Element|function} 模板 可以为字符串（data-template="xxx") 或者 元素 Element.clone
     * @param data {object=}
     * @returns {Element}
     * @memberof $wd
     */
    function createElemByTemplate(template, data) {
        // 创建 模板副本元素
        var duplicateElem = null;
        // template [element]
        if (isElement(template)) {
            duplicateElem = template.cloneNode(true);
        }
        // template [string]
        if (isString(template)) {
            // 测试是否为HTML
            if (template.match(/^<(\w+)[\S\s]*\/?>(?:<\/\1>|)$/)) {
                duplicateElem = $wd.createElementByHtml(template);
                return duplicateElem;
            }
            // 搜索模板
            var templateElem = document.querySelector('#templateContainer [data-template="' + template + '"]') ||
                document.querySelector('#templateContainer [template="' + template + '"]') ||
                document.querySelector('[data-template="' + template + '"]') ||
                document.querySelector('[template="' + template + '"]');
            duplicateElem = templateElem ?
                templateElem.cloneNode(true) :
                null;
            duplicateElem && duplicateElem.removeAttribute('template');
        }
        // template [function]
        if (isFunction(template)) {
            duplicateElem = template();
        }
        return duplicateElem;
    }

    //=========================================================
    // 表单相关
    //=========================================================
    /**
     * 获取表单数据
     * 元素需设置 属性 data-formName
     * @param container Element: 表单的根节点，会在这个节点下查找表单元素
     * @returns {object} data-formName 的属性值作为 变量属性名
     * @memberof $wd
     */
    function getFormData(container) {
        var formData = {};
        $wd(container).find('[data-formName]').forEach(function (elem) {
            var dataName = elem.getAttribute('data-formName');
            if (elem.tagName == "INPUT" || elem.tagName == "SELECT" || elem.tagName == "TEXTAREA" || elem.tagName == "RADIO") {
                formData[dataName] = $wd(elem).value();
            }
        });
        return formData;
    }
    /**
     * 检查为空的数据项
     * @param {object|array}  obj 检查目标,对象 对象数组
     * @param callback 检查到空值触发回调 参数 value name
     * @param {(array|string)=} exception 例外的属性名称列表
     * @returns {boolean} 如果有空值返回false
     * @memberof $wd
     * @example
     *
     * // 示例
     * var obj = {a:1,b:'',c:''};
     * console.log( $wd.checkEmpty(obj, function (name) {
     *     console.log(name);
     * }) );
     * // => b,false
     * console.log( $wd.checkEmpty(obj, function (name) {
     *     console.log(name);
     * }),'b');
     * // => c,false
     * console.log( $wd.checkEmpty(obj, function (name) {
     *     console.log(name);
     * }),'b,c');
     * // => true
     *
     */
    function checkEmpty(obj, callback, exception) {
        var originObj = obj, ignoreList = [];
        if (isObject(obj)) {
            originObj = [];
            originObj.push(obj);
        }
        exception && (ignoreList = isArray(exception) ? exception : exception.split(','));
        var isMatch = false;
        originObj.forEach(function (data) {
            Object.forEachIn.call(data, function (value, name) {
                if (arrayHas(ignoreList, name) || isMatch)return;
                if (value == '' && value !== 0 && value !== false) {
                    callback(name, data);
                    isMatch = true;
                }
            });
        });
        return !isMatch;
    }

    //=========================================================
    // Object Operate
    //=========================================================
    /**
     * 对象复制
     * 其中的成员如果为对象{object}，则也进行复制操作
     * @param {object} obj 目标对象
     * @returns {object} 返回复制的对象
     * @memberof $wd
     */
    function objClone(obj) {
        var newObj = {};
        for (var an in obj) {
            if (!obj.hasOwnProperty(an))continue;
            newObj[an] = isObject(obj[an]) ? objClone(obj[an]) : obj[an];
        }
        return newObj;
    }
    /**
     * 提取object对应路径的属性
     * @param data {object} 提取目标
     * @param path {string}提取路径 'a.b.c'
     * @returns {*} 如果找对对应路径的属性则返回属性值，找不到则返回undefined
     * @memberof $wd
     * @example
     *      // 示例
     *      var obj = {
     *         a: {
     *             ao: {
     *                aoo:100
     *             }
     *         }
     *      };
     *      $wd.getObjAttr(obj, 'a.ao');            // => {aoo:100}
     *      $wd.getObjAttr(obj, 'a.ao.aoo');        // => 100
     *      $wd.getObjAttr(obj, 'a.an.aoo');        // => undefined
     *
     */
    function getObjAttr(data, path) {
        var result = data;
        if (!path)return result;
        try {
            path.split('.').forEach(function (name) {
                result = result[name];
            });
        } catch (e) {
            return;
        }
        return result;
    }
    /**
     * 设置object对应路径的属性
     * 如果中间路径不存在则自动创建
     * @param {object} data  设置目标
     * @param {string} path  设置路径 'a.b.c'
     * @param {*} value 设置的新值
     * @returns {*} 如果找对对应路径的属性则返回属性值
     * @memberof $wd
     * @example
     *
     *    $wd.setObjAttr({
     *       a: {a1:998},
     *       b: 2,
     *       c: {
     *           c1: 3
     *       }
     *    }, 'a.aa.aaa', 998);
     *
     *    // => { a:{aa:{aaa:998},a1:998},b:2...}
     */
    function setObjAttr(data, path ,value) {
        var result = data;
        if (!path)return result;
        try {
            path.split('.').forEach(function (name,index) {
                if(index==path.split('.').length-1){
                    result[name] = value;
                    return
                }
                if (!isObject(result[name]) && !isElement(result[name] && !isArray(result[name])))result[name] = {};
                result = result[name];
            });
        } catch (e) {
            return;
        }
        return data;
    }


    /**
     * 对象属性覆盖
     * @param {object} obj1 被覆盖对象 会被修改
     * @param {object} obj2 覆盖对象
     * @param {function=} process 处理每个覆盖属性的回调 可选参数 会使用函数返回值作为新值
     * @returns {object} 被覆盖处理后的对象
     * @memberof $wd
     * @example
     *
     *      // 示例
     *      var obj1 = {a:1,b:2},obj2={a:3,c:4};
     *      $wd.objCover(obj1,obj2);
     *      // => {a:3,b:2,c:4}
     *      // obj1 = {a:3,b:2,c:4}
     *
     */
    function objCover(obj1, obj2 ,process) {
        for (var an in obj2) {
            if (!obj2.hasOwnProperty(an))continue;
            obj1[an] = isFunction(process)? process(obj2[an],an,obj1[an]): obj2[an];
        }
        return obj1;
    }

    /**
     * 比较两个对象是否相等
     * 默认进行==比较 ""==false==[]
     * @param obj1 对象1
     * @param obj2 对象2
     * @returns {boolean}
     */
    function objEqual(obj1,obj2) {
        if (obj1 === obj2)
            return true;
        if(!isObject(obj1)||!isObject(obj2))
            return false;
        for (var an in obj2) {
            if (!obj2.hasOwnProperty(an))continue;
            if(obj2[an]==obj1[an])continue;
            return false;
        }
        return true;
    }

    /**
     * 对象属性提取
     * 现在主要用于构造提交的表单数据
     * @param {object} obj 被提取属性的目标对象 可以为对象的数组  [obj , ...]
     * @param {(array|string)} options 提取规则   数组 : [option , ...]  option: 'oldName=>newName' | 'oldName=newName' | 'oldName'   字符串 : 'oldName=>newName,oldName2=>newName2'
     * @returns {object|Array.<object>} 使用提取属性构造的新对象或数组
     * @memberof $wd
     * @example
     *
     *      // 从对象中抽取数据
     *      var obj = {red:255,name:'peter'};
     *      $wd.objExtract(obj,["red=>colorRed","name=>lastName"]);     // => { colorRed:255,lastName:'peter' }
     *      $wd.objExtract(obj,"red=>colorRed,name"]);                  // => { colorRed:255,name:'peter' }
     *
     *      // 从对象数组中抽取数据
     *      var arr = [obj,obj];
     *      $wd.objExtract(obj,["red=>colorRed","lastName"]);           // => [{ colorRed:255,lastName:'peter' },{ colorRed:255,name:'peter' }]
     *
     *      // 自动生成路径
     *      $wd.objExtract({
     *             a: 1,
     *             b: { b1: 2 },
     *             c: 3
     *          },
     *          "a,b.b1=>bb1,c=>z.x.c.v.b.n.m"
     *      );
     *      // 结果如下 =>
     *      //      {
     *      //         a: 1,
     *      //         bb1: 2,
     *      //         z:{x:{c:{v:{b:{n:{m:3}}}}}}
     *      //      }
     *
     */
    function objExtract(obj, options) {
        // 提取 对应名称的属性
        var result = [], temp, originObj = obj, originOpt = options;
        isUndefined(options) && (originOpt = []);
        // 支持 使用逗号分隔的字符串生成配置数组 "oldName=>newName , oldName=>newName"
        isString(options) && ((temp = options) && (originOpt = options.split(',')));
        // 支持 从数组提取对象数组 obj [{a:1},{a:2}]  => [{b:1},{b:2}]
        !isArray(obj) && ((temp = originObj) && (originObj = []) && originObj.push(temp));
        originObj.forEach(function (unit) {
            temp = {};
            originOpt.forEach(function (name) {
                // var resolveReg = /([\.\w]+)=[>]?([\.\w]+)/;
                var resolveReg = /([^=>,]+)=[>]?([^=>,]+)/;     // 支持中文
                if (resolveReg.test(name)) {
                    // 支持 'oldName=>newName' 'oldName=newName'
                    var originName = resolveReg.exec(name)[1];
                    var replaceName = resolveReg.exec(name)[2];
                    !isUndefined(getObjAttr(unit,originName)) && (setObjAttr(temp,replaceName,getObjAttr(unit,originName)));
                } else {
                    // 支持 'name'
                    !isUndefined(getObjAttr(unit,name)) && (setObjAttr(temp,name,getObjAttr(unit,name)));
                }
            });
            result.push(temp);
        });
        if (!isArray(obj))return result[0];
        return result;
    }

    //=========================================================
    //  异步加载资源
    //=========================================================
    /**
     * 获取JS
     * @param {string} src JS路径
     * @param {function} callback 获取成功后回调
     * @returns {boolean} 返回true表示页面上没有这个JS开始进行加载，返回false表示已经存在这个JS文件不进行加载
     * @memberof $wd
     */
    function getScript(src, callback) {
        // 页面脚本
        if (src) {
            var curScripts = document.querySelectorAll('script');
            for (var i = 0; i < curScripts.length; i++) {
                if (curScripts[i].getAttribute('src') == src) {
                    callback('exist');
                    return false;
                }
            }
            var pageScript = document.createElement('script');
            pageScript.type = 'text/javascript';
            pageScript.src = src;
            document.head.appendChild(pageScript);
            pageScript.onload = function () {
                console.log("JS加载成功:[" + this.getAttribute('src') + "]");
                callback(true);
            };
            pageScript.onerror = function () {
                console.log("有个路径为:[" + this.getAttribute('src') + "]的文件没有加载成功！咋办呢/(ㄒoㄒ)/~~");
                callback('error');
            };
        }
    }

    //=========================================================
    //  时间
    //=========================================================
    // 时间格式化
    isUndefined(Array.prototype.format) && (Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    });
    /**
     * 时间间隔
     * @param targetDate
     * @param cmpDate
     * @returns {{gapSeconds: Number, gapMinutes: Number, gapHours: Number, gapDate: Number}}
     */
    function getDateInterval(targetDate,cmpDate) {
        var gap = (targetDate - (cmpDate?cmpDate:new Date()))/1000;
        return {
            gapSeconds:parseInt(gap%60),
            gapMinutes:parseInt(gap/(60))%60,
            gapHours:parseInt(gap/(60*60))%24,
            gapDate:parseInt(gap/(60*60*24))
        }
    }
    $wd.getDateInterval = getDateInterval;

    //=========================================================
    //  对外提供的功能
    //=========================================================
    // $wd
    $wd.objClone = objClone;
    $wd.getObjAttr = getObjAttr;
    $wd.createElementByHtml = createElementByHtml;
    $wd.castElemByTemplate = createElemByTemplate;
    $wd.createElemByTemplate = createElemByTemplate;
    $wd.parseURL = parseURL;
    $wd.showElem = showElem;
    $wd.hideElem = hideElem;
    $wd.forEach = forEach;
    $wd.arrayHas = arrayHas;
    $wd.arrayRemove = arrayRemove;
    $wd.getFormData = getFormData;
    $wd.insertAfter = insertAfter;
    $wd.insertAfterTable = insertAfterTable;
    $wd.setObjAttr = setObjAttr;
    $wd.objCover = objCover;
    $wd.objEqual = objEqual;
    $wd.objExtract = objExtract;
    $wd.checkEmpty = checkEmpty;
    $wd.getScript = getScript;
    $wd.promise = promise;
    $wd.richLog = richLog;

    // global
    window.$wd = $wd;
    window.$wds = $wds;
    window.richLog = richLog;
    window.isArray = isArray;
    window.isNumber = isNumber;
    window.isObject = isObject;
    window.isString = isString;
    window.isElement = isElement;
    window.isFunction = isFunction;
    window.isUndefined = isUndefined;
    window.isElementArray = isElementArray;
    window.isTableElement = isTableElement;
    window.isWhat = isWhat;

    // export
    $wd.$wd = $wd;
    $wd.$wds = $wds;
    $wd.richLog = richLog;
    $wd.isArray = isArray;
    $wd.isNumber = isNumber;
    $wd.isObject = isObject;
    $wd.isString = isString;
    $wd.isElement = isElement;
    $wd.isFunction = isFunction;
    $wd.isUndefined = isUndefined;
    $wd.isElementArray = isElementArray;
    $wd.isTableElement = isTableElement;
    $wd.isWhat = isWhat;
    $wd.hasValue = hasValue;

    return $wd;
});