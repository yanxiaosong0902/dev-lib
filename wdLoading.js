/**
 * 加载状态组件
 * @author yanxiaosong
 */

/*================================================================================================*//*

### 功能

#### $Loading.coverShow
#### $Loading.coverHide
param1: string | 显示字符串
> 可以多次调用，参数使用不同的字符串会构成纵向提示列表， hide方法如果传入相同的字符串，会优先隐藏提示为此字符串的文本。（这个功能不完善，需要所有的show、hide字符串一一对应且无重复才能正确运作）
> 时间过长默认会有随机的超时提醒，10秒后会自动消失

#### $Loading.pageShow
#### $Loading.pageHide
param1: string | 显示字符串

#### $Loading.insetShow
#### $Loading.insetHide
param1: container | 插入的容器元素，没有的话则会放置在Body末尾

#### $Loading.moonShow
#### $Loading.moonHide
param1: container | 相对容器元素居中遮罩显示
> 会相对容器进行居中显示
> 转圈圈

 *//*==============================================================================================*/


/*================================================================================================*//*

 ### 更新日志
  * 2016-8-31   对外开放coverLoading配置项
  * 2016-5-5    完善功能说明
  * 2016-5-2    重写组件CSS加载方式
  * 2016-5-1    重写html模板加载方式，两种模板获取途径：1、JS  LoadTemplate.resource => []   2、HTML  querySelector => Element
  
 *//*==============================================================================================*/
/**
 * 加载动画组件 默认的全局导出名称是 $Loading
 * @module Loading
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.$Loading = factory();
    }
})(this, function () {

    /**
     * 读取模板
     */
    function LoadTemplate(mark) {
        var template = LoadTemplate.useSelector?document.querySelector('#templateContainer [data-template="' + mark + '"]')
                || document.querySelector('#templateContainer [template="' + mark + '"]')
                || document.querySelector('[data-template="' + mark + '"]')
                || document.querySelector('[template="' + mark + '"]') : null;
        return template ? function () {
            return template.children[0]&&template.children[0].cloneNode(true);
        }():function () {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = LoadTemplate.resource && LoadTemplate.resource[mark];
            return tempDiv.children[0];
        }();
    }
    LoadTemplate.useSelector = false;
    LoadTemplate.resource = {
        coverLoading:
            "<div id=\"coverLoading\" class=\"coverLoading\" style=\"display: none;\">"+
            "    <div class=\"page-loading\">"+
            "        <div class=\"page-loading-logo\">"+
            "            <div class=\"page-loading-anim\"></div>"+
            "        </div>"+
            "        <div class=\"page-loading-text\">加载中，请稍候...</div>"+
            "    </div>"+
            "</div>",
        pageLoading:
            "<div id=\"basePageLoading\" class=\"basePage\">"+
            "    <div class=\"page-loading\">"+
            "        <div class=\"page-loading-logo\">"+
            "            <div class=\"page-loading-anim\"></div>"+
            "        </div>"+
            "        <div class=\"page-loading-text\">加载中，请稍候...</div>"+
            "    </div>"+
            "</div>",
        insetLoading:
            "<div id=\"insetLoadingBox\" class=\"load-more loading-more\" style=\"display:none;\"><span class=\"loading-ring\"></span>努力加载中...</div>",
        dimmer:
            "<div id=\"coverLoading-cover\" class=\"coverLoadingDimmer\" style=\"display: none;\"></div>"
    };
    window.LoadTemplate = LoadTemplate;

    // 添加需要的CSS
    !function (){
        var styleElem = document.createElement('style');
        styleElem.type = "text/css";
        styleElem.innerHTML =
            '    /* 基础Loading图标&动画 */'+
            '    .page-loading {position: absolute;left: 0;top: 0;right: 0;bottom: 0;display: inline-block;background-color: #fff;z-index: 6111;text-align: center;}'+
            '    .page-loading-text {color: #AAA;font: 400 16px/30px normal;white-space: pre;}'+
            '    .page-loading-logo,.page-loading-anim {margin-top: 60%;height: 70px;width: 70px;display: inline-block;background: url(static/loading-logo-wd.png) 0 0 no-repeat;background-size: 70px 140px}'+
            ''+
            '    .page-loading-anim {margin: 0;-webkit-animation: loading-anim 2s linear infinite;background-position: 0 -70px}'+
            '    @-webkit-keyframes loading-anim {'+
            '        0% {-webkit-transform: rotate(0)}'+
            '        50% {-webkit-transform: rotate(180deg)}'+
            '        100% {-webkit-transform: rotate(360deg)}'+
            '    }'+
            '    /* 覆盖型loading */'+
            '    .coverLoading .page-loading{ background-color:initial;}'+
            '    .coverLoading {width: 100%;height: 100%;position: fixed;top:0;z-index: 6110;border-radius: 0;opacity: 0;-webkit-transform: translate3d(0, 0, 0) scale(1);transform: translate3d(0, 0, 0) scale(1);-webkit-transition-property: -webkit-transform, opacity;transition-property: transform, opacity;}'+
            '    .coverLoading.active {opacity: 1;-webkit-transition-duration: 300ms;transition-duration: 300ms;-webkit-transform: translate3d(0, 0, 0) scale(1);transform: translate3d(0, 0, 0) scale(1);}'+
            '    .coverLoading.out {opacity: 0;z-index: 6109;-webkit-transition-duration: 300ms;transition-duration: 300ms;-webkit-transform: translate3d(0, 0, 0) scale(1);transform: translate3d(0, 0, 0) scale(1);}'+
            '    .coverLoadingDimmer {position: fixed;top: 0;right: 0;bottom: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.6);z-index: 6100;opacity: 0;}'+
            '    .coverLoadingDimmer.active {opacity: 1; -webkit-transition:opacity 300ms; transition:opacity 300ms;}'+
            '    .coverLoadingDimmer.out {opacity: 0;-webkit-transition:opacity 300ms; transition:opacity 300ms;}'+
            ''+
            '    /* 公用 - 加载更多按钮 */'+
            '    .load-more{ display:block; height:70px; line-height:70px; text-align:center; font-size:14px; overflow:hidden; border:1px solid #ccc; background:#fff;}'+
            '    .load-more:after{ content:"v"; display:inline-block; width:21px; color:rgba(0,0,0,0); vertical-align:top; background:url(data:image/gif;base64,R0lGODlhFgAOAKIHAPHx8erq6t/f39jY2OTk5NPT08zMzP///yH5BAEAAAcALAAAAAAWAA4AAANFaHbc/k2pAmsrUg0LhwTSxjGeAhygIozC1wTSWhFS8MAKAdGKvdcOnEFnafUYQhnHaACkDMpRKSMaNaYGivWByW4rilECADs=) no-repeat 100% 50%; -webkit-background-size:11px 7px; background-size:11px 7px;}'+
            '    .load-more .loading-ring{ display:none;}'+
            '    .loading-more:after{ content:"\\52aa\\529b\\52a0\\8f7d\\4e2d\\ff0c\\8bf7\\7b49\\5f85"; display:inline-block; text-indent:15px; width:auto; font-size:14px; line-height:70px; color:#999; vertical-align:top; background:none;}'+
            '    a.load-more, a.load-more:visited{ color:#457fe3;}'+
            '    /* 公用 - 载入动画 */'+
            '    .loading-ring{ display:block; position:absolute; width:48px; height:48px; left:50%; top:50%; margin:-24px 0 0 -24px;background:url(data:image/png;base64,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) no-repeat 0 0; -webkit-background-size:100% 100%; background-size:100% 100%;}'+
            '    .loading-small{ display:block; position:relative; padding-left:20px; min-width:16px; min-height:16px;}'+
            '    .loading-small, .loading-more:before{ background:url(data:image/gif;base64,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) no-repeat 3px 50%; -webkit-background-size:10px 10px; background-size:10px 10px;}'+
            '    .loading-more:before{ content:"z"; display:inline-block; position:absolute; width:16px; height:16px; top:50%; left:50%; margin:-8px 0 0 -63px; vertical-align:top; color:rgba(0,0,0,0);}'+
            '    .loading-small .loading-ring, .loading-more .loading-ring{ display:block; position:absolute; width:16px; height:16px; left:0; top:50%; margin:-8px 0 0 0; background:url(data:image/gif;base64,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) no-repeat 0 0; -webkit-background-size:contain; background-size:contain;}'+
            '    .loading-more{ position:relative; font:0/100px Arial; color:rgba(0,0,0,0); border-color:transparent; text-align:center; text-indent:30px;}'+
            '    .loading-more .loading-ring{ display:inline-block; position:absolute; left:50%; vertical-align:top; margin-left:-63px;}'+
            '    @-webkit-keyframes loaing-animation{'+
            '        0%{ -webkit-transform:rotate(0deg);}'+
            '        100%{ -webkit-transform:rotate(360deg);}'+
            '    }'+
            '    @keyframes loaing-animation{'+
            '        0%{ transform:rotate(0deg);}'+
            '        100%{ transform:rotate(360deg);}'+
            '    }';
        document.querySelector('head').appendChild(styleElem);
    }();

    // 屏幕高度
    var $ScreenHeight = document.documentElement.clientHeight || screen.height;

    /**
     * 努力加载中显示 > 嵌入到其他元素中
     * 覆盖页面的Loading显示
     * <p>
     *      <br/>示例：
     *      <div><img width="200" src="../img/wdLoadingInset.png"/></div>
     * </p>
     * @param {Element} placeElem 目标容器
     * @memberof module:Loading
     * @example $Loading.insetShow(container);
     */
    function insetShow(placeElem) {
        if (!(placeElem && placeElem.appendChild)) return;
        if (placeElem.querySelector('#insetLoadingBox')) return;
        var loadingElem = LoadTemplate('insetLoading');
        loadingElem.style.display = '';
        placeElem.appendChild(loadingElem);
    }
    /**
     * 努力加载中隐藏
     * @param {Element} placeElem 目标容器
     * @memberof module:Loading
     * @example $Loading.insetShow(container);
     */
    function insetHide(placeElem) {
        if (!(placeElem && placeElem.appendChild)) return;
        var loadingElem = placeElem.querySelector('#insetLoadingBox');
        if (loadingElem) loadingElem.parentElement.removeChild(loadingElem);
    }

    /**
     * 页面替换型加载中显示
     * <p>
     *      <br/>示例：
     *      <div><img width="200" src="../img/wdLoadingPage.png"/></div>
     * </p>
     * @memberof module:Loading
     * @example $Loading.pageShow();
     */
    function pageShow() {
        var baseLoadingPage = document.querySelector('#basePageLoading');
        // 不存在Loading页面 > 初始化
        if (!baseLoadingPage) {
            baseLoadingPage = LoadTemplate('pageLoading');
            document.body.appendChild(baseLoadingPage);
        }
        // 隐藏现有视图
        if (document.querySelector('.viewport')) {
            document.querySelector('.viewport').style.display = "none";
        }
        // 高度重置
        baseLoadingPage.querySelector('.page-loading-logo').style.marginTop = ($ScreenHeight / 2 - 100) + 'px';
        baseLoadingPage.style.display = '';
    }
    /**
     * 页面替换型加载中隐藏
     * @memberof module:Loading
     * @example $Loading.pageHide();
     */
    function pageHide() {
        var baseLoadingPage = document.querySelector('#basePageLoading');
        baseLoadingPage.style.display = 'none';

        // 显示现有视图
        if (document.querySelector('.viewport')) {
            document.querySelector('.viewport').style.display = "";
        }
    }


    var CoverLoading = {
        // 配置信息
        showCount: 0,
        showState:false,
        textQueue: [],
        maxTime: 16000,
        minTime: 250,
        randomTips: {
            normal: ['加载中，请稍候...', '正在努力加载中...', '稍等片刻，加载中...'],
            hurry: ['网速较慢，请耐心等待...'],
            soLong: ['也许等待的时间可以喝杯茶了...'],
            die: ['可能网络异常，不等了，在下先撤了']
        },
        loadingQuene: [
            /*{
            	startTime:null,
            	tipText:null,
            	curTipText:null,
            },*/
        ],
        intervalHandle: null,
        textElem: null,
        // 视觉展示时间控制
        visualStartTime: null,
        getVisualShowTime: function() {
            if (this.visualStartTime) {
                return new Date().getTime() - this.visualStartTime;
            }
            return 0;
        },
        // 载入视图元素
        loadingElem: null,
        dimmerElem: null,
        scheduler:null,
        /**
         * 覆盖页面的Loading显示
         * <p>
         *      <br/>示例：
         *      <div><img width="200" src="../img/wdLoadingCover.png"/></div>
         * </p>
         * @param {String} tipText 提示文本
         * @param {number|boolean} dynamic 提示文本
         * @memberof module:Loading
         * @example $Loading.coverShow('购物车加载中');
         */
        coverShow: function(tipText,dynamic) {
            // 第一次 > 初始化
            if (this.loadingElem == null || this.dimmerElem == null) {
                this.loadingElem = LoadTemplate('coverLoading');
                document.body.appendChild(this.loadingElem);
                this.dimmerElem = LoadTemplate('dimmer');
                document.body.appendChild(this.dimmerElem);
            }
            // 基础元素
            var loadingElem = this.loadingElem;
            var dimmerElem = this.dimmerElem;
            this.textElem = loadingElem.querySelector('.page-loading-text');
            // 高度重置
            loadingElem.querySelector('.page-loading-logo').style.marginTop = ($ScreenHeight / 2 - 100) + 'px';
            // 使用定时器管理 Loading整体状态
            var obj = this;
            if(obj.scheduler==null){
                obj.scheduler = setInterval(function () {
                    // 控制显示隐藏
                    if(obj.showCount>=1){
                        // 时间记录
                        if(!obj.visualStartTime)obj.visualStartTime = new Date();
                        if(new Date() - obj.visualStartTime >= 250){
                            // 进行显示操作
                            loadingElem.style.display = "";
                            dimmerElem.style.display = "";
                            setTimeout(function() {
                                // 动画显示
                                obj.showState = true;
                                loadingElem.className = 'coverLoading active';
                                dimmerElem.className = 'coverLoadingDimmer active';
                            }, 10);
                            document.body.style.height = "100%";
                            document.body.style.overflow = "hidden";
                        }
                    }else{
                        // 重置时间记录
                        obj.visualStartTime = null;
                        // 进行隐藏操作
                        loadingElem.className = 'coverLoading out';
                        dimmerElem.className = 'coverLoadingDimmer out';
                        setTimeout(function() {
                            obj.showState = false;
                            loadingElem.style.display = "none";
                            dimmerElem.style.display = "none";
                        }, 310);
                        document.body.style.height = "";
                        document.body.style.overflow = "";
                    }
                    // 提示文本动态调整
                    obj.refreshLoadingQueue();
                },500);
            }
            // 计数器加一
            this.showCount++;
            var loadingInfo = {
                startTime: new Date().getTime(),
                tipText: tipText ? tipText : null,
                curTipText: tipText ? tipText : this.getRandomTip(1),
                dynamic : dynamic
            };
            this.loadingQuene.push(loadingInfo);
            this.refreshLoadingQueue();
        },
        /**
         * 覆盖页面的Loading隐藏
         * @param {String=} tipText 提示文本，如果hide方法也获得了相同的提示字符串则会隐藏在列表中（多次触发coverLoading）对应字符串的提示
         * @memberof module:Loading
         * @example $Loading.coverHide('购物车加载中');
         */
        coverHide: function(tipText) {
            // 计数器减一
            if(this.showCount>0)this.showCount--;
            // 移除一个载入信息
            var isRemove = false;
            var emptyIndex = 0;
            if (tipText) {
                for (var i = 0; i < this.loadingQuene.length; i++) {
                    if (tipText == this.loadingQuene[i].tipText) {
                        this.loadingQuene.splice(i, 1);
                        isRemove = true;
                    }
                    if(tipText===""){
                        emptyIndex = i;
                    }
                }
            }
            if (!isRemove) {
                this.loadingQuene.splice(emptyIndex, 1);
            }
        },
        getRandomTip: function(type) {
            switch (type) {
                case 1:
                    return this.randomTips.normal[parseInt(Math.random() * this.randomTips.normal.length)];
                    break;
                case 2:
                    return this.randomTips.hurry[parseInt(Math.random() * this.randomTips.hurry.length)];
                    break;
                case 3:
                    return this.randomTips.soLong[parseInt(Math.random() * this.randomTips.soLong.length)];
                    break;
                case 4:
                    return this.randomTips.die[parseInt(Math.random() * this.randomTips.die.length)];
                    break;
                default:
                    break;
            }
        },
        refreshLoadingQueue: function() {
            this.textQueue.length = 0;
            if (this.loadingQuene <= 0) return;
            for (var i = 0; i < this.loadingQuene.length; i++) {
                var loadingInfo = this.loadingQuene[i];
                if(loadingInfo.dynamic){
                    if (new Date().getTime() - loadingInfo.startTime > 3000 + loadingInfo.dynamic) {
                        loadingInfo.curTipText = this.getRandomTip(2);
                    }
                    if (new Date().getTime() - loadingInfo.startTime > 8000 + loadingInfo.dynamic) {
                        loadingInfo.curTipText = this.getRandomTip(3);
                    }
                    if (new Date().getTime() - loadingInfo.startTime > this.maxTime - 2000 + loadingInfo.dynamic) {
                        loadingInfo.curTipText = this.getRandomTip(4);
                    }
                    if (new Date().getTime() - loadingInfo.startTime > this.maxTime + loadingInfo.dynamic) {
                        this.coverHide(loadingInfo.tipText);
                    }
                }
                this.textQueue.push(loadingInfo.curTipText);
            }
            var start = this.textQueue.length - 3 > 0 ? this.textQueue.length - 4 : 0;
            this.textElem.innerHTML = this.textQueue.slice(start, this.textQueue.length).join('\n');
        }
    };

    /**
     * moon loading
     */
    var moonLoadingManager = {
        htmlTemplate: "<div class=\"moon\" style=\"display: none;\"></div>",
        styleTemplate: ".moon {" +
            "        position: absolute;" +
            "        left: 45%;" +
            "        top: 35%;" +
            "        width: 150px;" +
            "        height: 150px;" +
            "        border-radius: 200px;" +
            "        animation: wind 1.0s linear infinite;" +
            "        animation-delay: 0.1s;" +
            "        -moz-animation: wind 1.0s linear infinite;" +
            "        -moz-animation-delay: 0.1s;" +
            "        -webkit-animation: wind 1.0s linear infinite;" +
            "        -webkit-animation-delay: 0.1s;" +
            "        z-index: 99999;" +
            "    }" +
            "    .moon {" +
            "        box-shadow: inset -10px 0 2px rgba(200, 200, 240, 0.7);" +
            "    }" +
            "    @keyframes wind {" +
            "        0% {" +
            "            transform: rotate(0deg);" +
            "        }" +
            "        100% {" +
            "            transform: rotate(360deg);" +
            "        }" +
            "    }" +
            "    @-moz-keyframes wind {" +
            "        0% {" +
            "            -moz-transform: rotate(0deg);" +
            "        }" +
            "        100% {" +
            "            -moz-transform: rotate(360deg);" +
            "        }" +
            "    }" +
            "    @-webkit-keyframes wind {" +
            "        0% {" +
            "            -webkit-transform: rotate(0deg);" +
            "        }" +
            "        100% {" +
            "            -webkit-transform: rotate(360deg);" +
            "        }" +
            "}",
        crtStyleElem:function(){
            var elem = document.createElement('style');
            elem.type = "text/css";
            elem.innerHTML = this.styleTemplate;
            return elem;
        },
        crtHtmlElem:function(){
            var elem = document.createElement('div');
            elem.type = "text/css";
            elem.innerHTML = this.htmlTemplate;
            return elem.removeChild(elem.firstElementChild);
        },
        styleElem:null,
        htmlElem:null,
        /**
         * 转圈圈Loading显示
         * @param {Element=} containerElem 目标容器，没有目标容器则默认为body
         * @memberof module:Loading
         * @alias module:Loading.moonShow
         */
        show: function(containerElem) {
            if( ! (this.styleElem && this.styleElem.parentNode) ){
                this.styleElem = this.crtStyleElem();
                document.body.appendChild(this.styleElem);
            }
            if( ! (this.htmlElem && this.htmlElem.parentNode) ){
                this.htmlElem = this.crtHtmlElem();
                document.body.appendChild(this.htmlElem);
            }
            this.htmlElem.style.left = "45%";
            var me = this;
            if( containerElem ){
                me.htmlElem.style.visibility = "hidden";
                setTimeout(function(){
                    me.htmlElem.style.left = (me.htmlElem.offsetLeft + containerElem.offsetLeft/2) + 'px';
                    me.htmlElem.style.visibility = "initial";
                },10); 
            }
            this.htmlElem.style.display = "initial";
        },
        /**
         * 转圈圈Loading隐藏
         * @memberof module:Loading
         * @alias module:Loading.moonHide
         */
        hide: function() {
            this.htmlElem && (this.htmlElem.style.display = "none");
        }
    };
    window.$Loading = {
        start: pageShow,
        end: pageHide,
        pageShow: pageShow,
        pageHide: pageHide,
        insetShow: insetShow,
        insetHide: insetHide,
        coverLoading: CoverLoading, //对外开放loading配置项
        coverShow: function () {
            CoverLoading.coverShow.apply(CoverLoading,arguments);
        },
        coverHide: function () {
            CoverLoading.coverHide.apply(CoverLoading,arguments);
        },
        moonShow:function(){
            moonLoadingManager.show.apply(moonLoadingManager, arguments);
        },
        moonHide:function(){
            moonLoadingManager.hide.apply(moonLoadingManager, arguments);
        }
    };
    // 对外操作方法
    return $Loading;
});