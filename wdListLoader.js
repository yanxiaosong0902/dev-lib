/**
 * 页面分页加载组件
 * @author yanxiaosong
 */

/*==============================================================================================*//*

 ### 功能说明
 用于需要分页加载的列表结构
 class > ListLoader
 param:config
 {
     template: 模板配置项
     [string]: HTML生成||模板ID匹配
     [Element]:cloneNode生成
     [function]:call>return
     generator: 模板配置项，同template，存在generator则优先使用generator  
 }
 * 所有函数参数，会自动获得ListLoader作为Context(this）

 *//*=============================================================================================*/

/*==============================================================================================*//*

 ### 更新日志

 * 2016-7-29    添加onFirstLoading 回调
 * 2016-7-26    添加activateScroll、deactivateScroll 方法
 * 2016-6-17    initList 不会修改默认参数  resetList 会重置参数与页数
 * 2016-6-10    调整....
 * 2016-5-20    调整....
 * 2016-5-5     完善功能说明

 *//*=============================================================================================*/

/**
 * 分页加载组件
 * @module ListLoader
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            './wdUtils.js',
            './wdLoading.js',
            './wdDialogBox.js'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./wdUtils.js'),
            require('./wdLoading.js'),
            require('./wdDialogBox.js')
        );
    } else {
        root.ListLoader = factory(
            root.$wd,
            root.$Loading,
            root.$Dialog
        );
    }
})(/**/this, function ($wd,$Loading,$Dialog) {

    /**
     * 参数说明 & 默认参数
     * @memberof module:ListLoader
     * @type object
     */
    var defaultOptions = {
        // 页面大小
        pageSize:5,
        // 当前页面编号
        curPage:1,
        // 基础参数
        queryParams:{},
        // 数据提取方法
        extractListData:null,
        // 列表容器Elem
        container:null,
        // 是否滚动加载
        pattern:1,  // 1：滚动加载模式 | 2： 分页模式
        //----------------------------------
        //  视图状态转化配置 & 默认
        //----------------------------------
        // 空列表状态 > 显示 this[ListLoader]
        showEmpty:showEmpty,
        // 空列表状态 > 隐藏（取消）this[ListLoader]
        hideEmpty:hideEmpty,
        // 加载中状态
        showLoading:function(){
            $Loading.insetShow(this.container);
        },
        // 加载中结束
        hideLoading:function(){
            $Loading.insetHide(this.container);
        },
        // 列表结束状态 > 显示 this[ListLoader]
        showEnd:showEnd,
        // 列表结束状态 > 隐藏
        hideEnd:hideEnd,
        // 滚动容器 > 用于滚动加载模式
        scrollContainer:document.documentElement,
        // 异常处理
        dpException:function(err){
            //console.warn(err);
        },
        // 单次加载后回调
        onOnceLoad: function(data) {
            data.forEach(function(itemData) {
                console.log(itemData);
            });
        },
        // 是否立即开始加载
        startLoad:true,
        initList:null,                      // 默认不自动加载  | Object > { .参数列表. }
        // 默认接口交换参数名称
        paramNames:{
            pageSize:"pageSize",       // 页面大小
            pageNum:"currentPage"           // 页面编号
        },
        // 默认接口交换数据路径
        dataNames:{
            data:"",           // 数据
            totalRow:"",      // 总数量
            totalPage:"pageCount"
        },
        // AJAX接口
        getData:null
    };

    //=========================================================
    //  默认的状态展示函数
    //=========================================================
    /**@this module:ListLoader# */
    function showEmpty() {
        if($wd(this.container).find('.__default_emptyTip__').length>=1)return;
        isTableElement(this.container)?
            this.container.appendChild($wd.createElementByHtml("<tr class='__default_emptyTip__' style='line-height: 2em;padding: 10px 10px;font-size: medium;text-align: center;background:#fff'>" +
                "<td colspan='9999' style='text-align: center'>一点内容都没有 (¯﹃¯)</td>" +
                "</tr>")):
            this.container.appendChild($wd.createElementByHtml("<div class='__default_emptyTip__' style='line-height: 2em;padding: 10px 10px;font-size: medium;text-align: center;background:#fff'>一点内容都没有 (¯﹃¯)</div>"));
    }
    /**@this module:ListLoader# */
    function hideEmpty() {
        $wd(this.container).find('.__default_emptyTip__').remove();
    }
    /**@this module:ListLoader# */
    function showEnd() {
        if($wd(this.container).find('#__default_endTip__').length>=1)return;
        isTableElement(this.container)?
            this.container.appendChild($wd.createElementByHtml("<tr id='__default_endTip__' style='width: 100%;text-align: center;padding: 10px 10px;font-size: medium;'>没有更多内容了 (¯﹃¯)</tr>")):
            this.container.appendChild($wd.createElementByHtml("<div id='__default_endTip__' style='width: 100%;text-align: center;padding: 10px 10px;font-size: 14px;'>" +
                "<td colspan='9999' style='text-align: center'>没有更多内容了...</td>" +
                "</div>"));
    }
    /**@this module:ListLoader# */
    function hideEnd() {
        $wd(this.container).find('#__default_endTip__').remove();
    }

    //=========================================================
    //  具体功能
    //=========================================================
    /**
     * 列表加载构造器
     * @param {Object} config                                               - 基础配置对象
     * @param {(string|function)} config.getData                            - 数据接口
     * @param {element=} [config.container=null]                            - 列表容器元素
     * @param {element=} [config.scrollContainer=document.documentElement]  - 滚动加载容器
     * @param {number=} config.pattern                                      - 加载模式 1：滚动加载模式  2： 分页模式
     * @param {number=} [config.pageSize=10]                                - 页面大小
     * @param {function=} config.onOnceLoad                                 - 加载数据回调
     * @param {boolean=} [config.startLoad=true]                            - 是否立即开始加载
     * @param {function=} config.showLoading                                - 加载中状态显示函数
     * @param {function=} config.hideLoading                                - 加载中状态消除函数
     * @constructor
     * @alias module:ListLoader
     * @example
     *
     *  // 列表加载
     *  var pageListLoader  = new ListLoader({
     *      container:reg.proStockList,
     *      getData: 'stockList',
     *      pattern: 2,
     *      pageSize: 10,
     *      onOnceLoad: function(listData) {
     *          reg.proStockList.innerHTML = "";
     *          pageList.nit(listData);
     *      },
     *      startLoad:false,
     *      showLoading:function () {
     *          $Loading.moonShow(reg.selectList);
     *      },
     *      hideLoading:function () {
     *          $Loading.moonHide(reg.selectList);
     *      }
     *  });
     *
     */
    var ListLoader = function (config){
        //----------------------------------
        //  参数检查&预处理
        //----------------------------------
        // 参数合并
        var me = this;
        this.options = $wd.objClone(defaultOptions);
        this.options = $wd.objCover(this.options,config);

        // 数据路径
        this.options.dataNames = $wd.objClone(defaultOptions.dataNames);
        this.options.dataNames = $wd.objCover(this.options.dataNames,config.dataNames);

        // 默认列表容器
        if (this.options.container == null) {
            this.options.container = document.createElement('div');
            console.warn("Warning:ListLoader没有绑定列表容器元素,当前默认容器为游离元素!");
        }
        this.options.onOnceLoad || console.warn("Warning:没有绑定数据处理程序.");
        // Ajax数据交换
        if ($wd.isString(this.options.getData)) {
            if (window.$interface && typeof $interface[this.options.getData] == "function") {
                this.options.getData = function () {
                    var argumentName = me.options.getData;
                    return function () {
                        $interface[argumentName].apply($interface, arguments);
                    };
                }();
            }
        }
        if(typeof this.options.getData != 'function'){
            console.error("Error:invalid Ajax Exchange Method! ( ｀д′)");
            return;
        }

        // 当前页面
        this.curPage = this.options.curPage;
        // 过滤参数
        this.queryParams = this.options.queryParams;
        // 是否滚动加载
        this.pattern = this.options.pattern;
        // 获得接口返回数据中的列表数据
        this.extractListData = this.options.extractListData || function(data){
                if(!data)return null;
                var attrPath = me.options.dataNames.data;
                if(attrPath==="")return data;
                if(!$wd.isUndefined(attrPath))return $wd.getObjAttr(data,attrPath);
                return data.page.list;
            };
        // 当前状态标记
        this.curFlag = null;
        // 是否在加载中
        this.isLoading = false;
        this.firstLoad = false;
        this.onFirstLoad = null;
        // 是否加载完毕
        this.isFull = false;
        // 列表容器
        this.container = this.options.container;
        // Ajax interface method name
        this.getData = this.options.getData;
        // 异常处理
        this.dpException = this.options.dpException;
        // 列表渲染
        this.onOnceLoad = this.options.onOnceLoad;
        // 监听页面滚动事件 > 到底部加载下一页
        this.scrollContainer = this.options.scrollContainer;
        this.scrollFunction = function(){
            var maxScrollHeight = me.scrollContainer.scrollHeight;
            var screenHeight  = document.documentElement.clientHeight || screen.height;
            if( me.scrollContainer.style.overflow == "auto"
                || me.scrollContainer.style.overflow == "scroll"
                || me.scrollContainer.style.overflowY == "auto"
                || me.scrollContainer.style.overflowY == "scroll"){
                screenHeight = me.scrollContainer.offsetHeight;
            }
            var curScrollTop = me.scrollContainer.scrollTop || me.scrollContainer.pageYOffset || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(curScrollTop + screenHeight >=  maxScrollHeight-30){
                //console.log('Arrive bottom →_→');
                me.loadList();
            }
        };
        // 滚动加载模式
        this.scrollEvent = {
            status:0
        };
        // 空列表
        this.showEmpty = this.options.showEmpty;
        this.hideEmpty = this.options.hideEmpty;
        // 列表加载中
        this.showLoading = this.options.showLoading;
        this.hideLoading = this.options.hideLoading;
        // 加载完成
        this.showEnd = this.options.showEnd;
        this.hideEnd = this.options.hideEnd;
        // 列表更新监听
        this.listenerList = [];
        // 是否进行自动加载
        this.options.startLoad && this.initList(this.options.initList);
    };
    ListLoader.prototype = {
        /**
         * 初始化列表
         * @param {object=} param 接口查询参数
         * @param {number=} pageNum 页面编号
         * @memberof module:ListLoader#
         * @description 初始化列表方法 会合并传入参数和现有参数
         * @example
         *
         * ListLoader#.queryParams    // {type:1}
         * ListLoader#.initList({key:2});
         * ListLoader#.queryParams    // {type:1,key:2}
         *
         */
        initList:function (param, pageNum) {
            // 如果是分页加载模式则清空当前列表
            // this.pattern == 1 && (this.container.innerHTML = "");
            // 重置搜索标记
            if($wd.isObject(param)){
                $wd.objCover(this.queryParams,param);
            }
            if(this.pattern == 1){
                this.activateScroll();
            }
            // 重置页面编号
            if( !$wd.isUndefined(pageNum) ){
                this.curPage = pageNum;
            }else{
                this.curPage = 1;
            }
            // 重置当前列表标记
            this.curFlag = new Date().getTime();
            this.firstLoad = true;
            // 加载标记
            this.isFull = false;
            this.isLoading = false;
            // 初次加载
            this.resetState();
            this.loadList();
        },
        /**
         * 重置列表方法 会清空现有的接口参数
         * @param {object} queryParam 接口参数
         * @param {number=} pageNum 页面编号
         * @memberof module:ListLoader#
         * @example
         *
         * ListLoader#.queryParams    // {type:1}
         * ListLoader#.resetList({key:2});
         * ListLoader#.queryParams    // {key:2}
         *
         */
        resetList:function(queryParam,pageNum){
            // 重置页面编号
            if( $wd.isUndefined(pageNum) ){
                this.curPage = 1;
            }else{
                this.curPage = pageNum;
            }
            if($wd.isObject(queryParam))this.queryParams = queryParam;
            else this.queryParams = {};
            this.initList();
        },
        /**
         * 加载更多
         * @memberof module:ListLoader#
         */
        loadList:function(){
            // 加载完毕或者加载中则 return
            if(this.isFull){
                this.showEnd();
                return;
            }
            if(this.isLoading)return;
            // 加载标记
            this.isLoading = true;
            var curPrcFlag = this.curFlag;
            // 设置页面编号 和 页面项数量参数
            this.queryParams[this.options.paramNames.pageSize] = this.options.pageSize;
            this.queryParams[this.options.paramNames.pageNum] = this.curPage;
            // 加载动画
            var me = this;
            // 加载数据
            this.showLoading();
            this.getData(this.queryParams, function(data, msg) {
                // 初次加载回调
                if(me.firstLoad==true){
                    me.onFirstLoad && me.onFirstLoad(data);
                    me.firstLoad = false;
                }
                // 隐藏加载动画
                me.hideLoading();
                // 提取列表数据
                try {
                    if (me.totalRow) {
                        me.totalRow = $wd.getObjAttr(data, me.options.dataNames.totalRow);
                        me.totalRow = +me.totalRow;
                        me.totalPage = +me.totalRow / (+me.options.pageSize);
                    } else {
                        me.totalPage = $wd.getObjAttr(data, me.options.dataNames.totalPage);
                        me.totalRow = me.totalPage * me.pageSize;
                    }
                } catch (e) {
                    if(e.name == "TypeError"){
                        console.error('Error: 数据和页面数量处理异常 ( ｀д′) :'+e);
                        $Dialog.notify("getData 处理异常! ( ｀д′)");
                    }else{
                        console.error(e);
                    }
                }
                if(me.totalRow){
                    me.totalRow = $wd.getObjAttr(data,me.options.dataNames.totalRow);
                    me.totalRow = +me.totalRow;
                    me.totalPage =  +me.totalRow/(+me.options.pageSize);
                }else{
                    me.totalPage =  $wd.getObjAttr(data,me.options.dataNames.totalPage);
                    me.totalRow = me.totalPage*me.pageSize;
                }
                data = me.extractListData(data);
                // 列表为空处理
                if(data.length<=0 && me.curPage==1){
                    me.onOnceLoad(data,msg);
                    me.sendUpdateEvent({
                        totalRow:0,
                        totalPage:0 ,
                        curPage:0
                    });
                    me.showEmpty(me.container);
                    return;
                }
                // 标记加载状态
                me.isLoading = false;
                // 判断是否为失效加载
                if(curPrcFlag!=me.curFlag)return;
                // 如果加载的页面还有数据，则页面标记+1 > 返回TRUE
                if(data && data.length>=0){
                    me.onOnceLoad(data,msg);
                    me.sendUpdateEvent({
                        totalRow:me.totalRow,
                        totalPage:Math.ceil(+me.totalPage) ,
                        curPage:me.curPage
                    });
                    me.curPage++;
                    // 加载完毕
                    if(data.length<me.options.pageSize){
                        me.isFull = true;
                        return;
                    }
                    // 处理预加载
                    // me.preloadData();
                    return;
                }
                // 数据异常
                me.dpException();
            },function(err){
                me.hideLoading();
                me.dpException(err);
                return true;
            });
        },
        /**
         * 数据预加载
         * @memberof module:ListLoader#
         */
        preloadData:function(){
            void (this.preloadData);
            if(options.preload){
                var tempNum = this.queryParams[options.paramNames.pageNum];
                var me = this;
                for (var i=0;i<options.preload;i++) {
                    !function () {
                        var increment = i;
                        setTimeout(function () {
                            me.queryParams[options.paramNames.pageNum] = me.curPage + increment;
                            me.getData(me.queryParams);
                        }, increment * 100);
                    }();
                }
                this.queryParams[options.paramNames.pageNum] = tempNum;
            }
        },
        /**
         * 跳转到指定页面
         * @param {number} pageNum 页面编号
         * @memberof module:ListLoader#
         */
        skipPage:function(pageNum){
            this.initList(this.queryParams,pageNum);
        },
        /**
         * 发送列表数据更新事件
         * @param {*} eventData 更新事件数据
         * @memberof module:ListLoader#
         */
        sendUpdateEvent:function(eventData){
            this.listenerList.forEach(function(callback){
                callback(eventData);
            });
        },
        /**
         * 添加列表更新监听器
         * @param {function} callback 监听回调函数
         * @memberof module:ListLoader#
         */
        addUpdateListener:function(callback){
            if($wd.isFunction(callback)){
                this.listenerList.push(callback);
            }else{
                console.error("Error:添加列表更新监听失败检查参数 →_→ [ " +callback +" ]");
            }
        },
        /**
         * 重置列表状态提示 加载中、空、到底了
         * @memberof module:ListLoader#
         */
        resetState:function(){
            this.hideLoading();
            this.hideEmpty(this.container);
            this.hideEnd.call(this);
        },
        /**
         * 激活滚动事件监听
         * @memberof module:ListLoader#
         */
        activateScroll:function(scrollContainer){
            this.deactivateScroll();
            if($wd.isElement(scrollContainer)){
                this.scrollContainer = scrollContainer;
            }
            if(this.scrollEvent.status==1)return;
            if(this.scrollContainer == document.body
                || this.scrollContainer == document.documentElement
                || this.scrollContainer == window){
                this.scrollContainer = document.documentElement;
                window.addEventListener('scroll',this.scrollFunction);
                this.scrollEvent.status = 1;
            }else if( isElement(this.scrollContainer) ){
                this.scrollContainer.addEventListener('scroll',this.scrollFunction);
                this.scrollEvent.handle = this.scrollFunction;
                this.scrollEvent.status = 1;
            }else{
                console.error("scroll container illegal!");
            }
        },
        /**
         * 无效化滚动事件监听
         * @memberof module:ListLoader#
         */
        deactivateScroll:function () {
            if(this.scrollEvent.status==0)return;
            this.scrollEvent.status = 0;
            window.removeEventListener('scroll',this.scrollFunction);
        }
    };

    // 对外操作方法
    this.ListLoader = ListLoader;
    return ListLoader;

});