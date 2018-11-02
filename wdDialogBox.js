/**
 * 对话框组件
 * @author yanxiaosong
 */

/*================================================================================================*//*

 ## 功能说明

 ### $Dialog.notify
 * param1: string > 显示字符串
 * param2: duration > ms
 * param3: icon > 图标 1、√  2、× 3、★
 *
 ### $Dialog.alert
 * param1: string > 显示字符串
 * param2: callback > 点击确认后的回调

 ### $Dialog.confirm
 * param1: string > 显示字符串
 * param2: callback > 点击确认后的回调
 * param3: errCallback > 点击取消后的回调


 ### $Dialog.registerModal
 * param :
 > [ xxModal:{ } ]
 #### xxModal
 ```
 $Dialog.registerModal({
     submitModal:{
         target:'#submitModal',
         transMtd:'Z-modal_show'
     }
 });
 ```
 #### $Dailog.xxModal( 'show'| 'hide' )


 *//*==============================================================================================*/


/*===============================================================================================*//*

 ### 更新日志

 * 2016-6-11    调整了notify的参数 (string,icon,duration) => (string,duration,icon)
 * 2016-5-5     完善功能说明
 * 2016-4-20    将CSS和HTML合并进入JS中，消除对HTML、CSS的引用依赖

 *//*==============================================================================================*/

/**
 * 对话框组件 默认的全局导出名称是 $Dialog
 * <script src="../..//js/utils/wdDialogBox.js" type="text/javascript" charset="utf-8"></script>
 * @module DialogBox
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            './wdUtils.js'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./wdUtils.js')
        );
    } else {
        root.$Dialog = factory(
            root.$wd
        );
    }
})(/**/this, function ($wd) {
    // 添加CSS
    function appendGlobalStyle(){
        var styleElem = document.createElement('style');
        styleElem.type = "text/css";

        styleElem.innerHTML =
        "    /*"+
        "     * 对话框"+
        "     * alert confirm notify"+
        "     */"+
        "    /* 遮罩层  > $Dialog.alert : dimmer > $Dialog.confirm : dimmer */"+
        "    .maskLayer{ position: fixed; background: rgba(0,0,0,0.5); z-index: 500; top: 112px; left: 0; width: 100%; height: 600px;}"+
        "    .wdDimmer{position: fixed; background: rgba(0,0,0,0.5); z-index: 999; top: 0px; left: 0; width: 100%; height: 100%;}"+
        "    .dialogDimmer {position: fixed;top: 0;right: 0;bottom: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.6);z-index: 1400;opacity: 0;}"+
        "    .dialogDimmer.active {opacity: 1; -webkit-transition-duration: opacity 300ms; transition-duration: opacity 300ms;}"+
        "    .dialogDimmer.out {opacity: 0;-webkit-transition-duration: opacity 300ms; transition-duration: opacity 300ms;}"+
        "    /* Dialog : common init style */"+
        "    .dialog.notify *,"+
        "    .dialog.confirm *{"+
        "        padding: 0;"+
        "        margin: 0;"+
        "        border: 0;"+
        "        -webkit-box-sizing: border-box;"+
        "        -moz-box-sizing: border-box;"+
        "        -ms-box-sizing: border-box;"+
        "        box-sizing: border-box;"+
        "    }"+
        "    /* Dialog - Notify */"+
        "    .dialog.notify {"+
        "        width: 100%;position: fixed;top: 45%;left: 0;z-index: 1200;padding: 0 10px;-webkit-box-sizing: border-box;box-sizing: border-box;margin: 10px 0; text-align: center;"+
        "        opacity: 0;-webkit-transform: translate3d(0, 0, 0) scale(1);transform: translate3d(0, 0, 0) scale(1);-webkit-transition-property: -webkit-transform, opacity;transition-property: transform, opacity;"+
        "    }"+
        "    .dialog.notify.active {opacity: 1; -webkit-transition: opacity 300ms; transition: opacity 300ms;}"+
        "    .dialog.notify.out {opacity: 0;-webkit-transition: opacity 300ms; transition: opacity 300ms;}"+
        "    .dialog .notify-cnt { background-color: rgba(0,0,0,.6);line-height: 40px;height: 40px;color: #fff;font-size: 16px;text-align: center;border-radius:5px;max-width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; padding: 0 10px; display: inline-block;}"+
        "    /* Dialog - Confirm&Alert */"+
        "    .dialog.confirm {border-radius: 6px;width: 270px;-webkit-background-clip: padding-box;background-clip: padding-box;outline: 0;pointer-events: auto;background-color: rgba(253,253,253,.95);position: fixed; z-index: 1500; top: 50%; left: 50%; margin-left: -135px; display: initial;}"+
        "    .dialog.confirm .confirm-tip {min-height: 71px;border-top-left-radius: 6px;border-top-right-radius: 6px;padding: 18px;font-size: 16px;display: -webkit-box;display: box;-webkit-box-pack: center;-webkit-box-align: center; -webkit-box-orient: vertical;    word-break: break-word;max-height: 80vh;overflow-y: scroll;}"+
        "    .dialog.confirm .confirm-tip div {width: 100%;}"+
        "    .dialog.confirm .confirm-tip h4 {margin-bottom: 4px;font-size: 16px;width: 100%;text-align: center; font-weight:normal;}"+
        "    .dialog.confirm .confirm-ft {border-bottom-left-radius: 6px;border-bottom-right-radius: 6px; overflow: hidden; display: -webkit-box; width: 100%;-webkit-box-sizing: border-box; box-sizing: border-box;}"+
        "    .dialog.confirm .confirm-ft button{height: 42px;line-height: 42px;background: transparent;text-align: center;font-size: 16px;border-right: 1px #c8c7cc solid;width: 100%;border-top: 1px solid #c8c7cc;display: block;-webkit-box-flex: 1;}"+
        "    .dialog.confirm .confirm-ft button:last-child{ border-right: 0;}"+
        "    .dialog.confirm .confirm-ft .selected{color: #00a5e0;}";
        document.querySelector('head').appendChild(styleElem);
    }
    appendGlobalStyle();

    // 屏幕高度
    var $ScreenHeight = document.documentElement.clientHeight || screen.height;

    // HTML 模板
    var htmlTemplate = {
        createElemByHtml: function(str) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = str;
            if (tempDiv.childElementCount <= 0) {
                return null;
            } else if (tempDiv.childElementCount == 1) {
                return tempDiv.children[0];
            }
            return tempDiv.children;
        },
        getNotifyElem: function() {
            var htmlStr =
            '<div class="dialog notify">'+
                '<div class="notify-cnt"><i class="iconfont icon-duihaoxi"></i><span>提示信息</span></div>'+
            '</div>';
            return this.createElemByHtml(htmlStr);
        },
        getAlertElem: function() {
            var htmlStr =
            '<div class="dialog confirm">'+
                '<div class="confirm-tip">'+
                    '<div><h4>提示信息</h4></div>'+
                '</div>'+
                '<div class="confirm-ft">'+
                    '<button type="button" data-name="confirm" data-role="button" id="dialogButton1" class="selected">确认</button>'+
                '</div>'+
            '</div>';
            return this.createElemByHtml(htmlStr);
        },
        getConfirmElem: function() {
            var htmlStr =
            '<div class="dialog confirm">'+
                '<div class="confirm-tip">'+
                    '<div><h4>提示信息</h4></div>'+
                '</div>'+
                '<div class="confirm-ft">'+
                    '<button type="button" data-name="cancel" data-role="button" id="dialogButton0">取消</button>'+
                    '<button type="button" data-name="confirm" data-role="button" id="dialogButton1" class="selected">确认</button>'+
                '</div>'+
            '</div>';
            return this.createElemByHtml(htmlStr);
        },
        getDimmerElem: function() {
            var htmlStr =
            '<div class="wdDimmer"></div>';
            return this.createElemByHtml(htmlStr);
        }
    };

    // 遮罩层
    var dimmerMng = {
        dimmer: [],
        show: function() {
            var index = this.dimmer.push(htmlTemplate.getDimmerElem());
            this.dimmer[index-1].onclick = function(e) {
                e.preventDefault();
                return false;
            };
            document.body.appendChild(this.dimmer[index - 1]);
        },
        hide: function() {
            var elem = this.dimmer.pop();
            elem && elem.parentNode.removeChild(elem);
        }
    };

    var notifyMng = {
        // 配置信息
        top: '45%',
        duration: 2000,
        /**
         * 通知对话框
         * <button class="btn btn-success btn-sm" onclick="$Dialog.notify('我是一个通知！~\(≧▽≦)/~')">点击试下</button>
         *
         * @param {string|object} opt 提示字符串
         * @param {string} opt.content 提示字符串
         * @param {string} opt.pos 位置 center|bottom|top
         * @param {number=} [duration=2000] 持续时间 默认2000ms
         * @param {number=} icon deprecated 提示左侧图标 需要引用字体文件
         * @memberof module:DialogBox
         * @alias module:DialogBox.notify
         * @type {function}
         */
        show: function(opt, duration, icon) {
            // 显示元素
            var alertElem = htmlTemplate.getNotifyElem();
            var pos = "center";
            if($wd.isString(opt)){
                alertElem.querySelector('span').innerHTML = opt;
            }else if($wd.isObject(opt)){
                if(opt.pos){
                    this.top = {
                        "center":"50%",
                        "bottom":"85%",
                        "top":"15%"
                    }[opt.pos] ? {
                        "center":"50%",
                        "bottom":"85%",
                        "top":"15%"
                    }[opt.pos] : opt.pos;
                }
                alertElem.querySelector('span').innerHTML = opt.content || "通知...";
            }

            alertElem.querySelector('i').className = "iconfont icon-duihaoxi";
            alertElem.style.display = "block";
            alertElem.style.top = this.top;
            // 显示位置
            var seat = this.findSeat();
            alertElem.style.marginTop = (50 * seat) + 'px';
            // 持续时间
            var durationTime = duration ? duration : this.duration;
            // 设置左侧图标
            if (typeof icon != 'undefined') {
                switch (icon) {
                    case 1:
                    case 'success':
                    case 'right':
                    case true:
                        alertElem.querySelector('i').className = "iconfont icon-duihaoxi";
                        break;
                    case 2:
                    case 'fail':
                    case 'error':
                    case false:
                    case 'cuo':
                    case 'cha':
                        alertElem.querySelector('i').className = "iconfont icon-error";
                        break;
                    case 3:
                    case 'star':
                        alertElem.querySelector('i').className = "iconfont icon-shoucang";
                        break;
                    default:
                        alertElem.querySelector('i').className = "";
                        break;
                }
            } else {
                alertElem.querySelector('i').className = "";
            }
            document.body.appendChild(alertElem);
            setTimeout(function() {
                alertElem.className = "dialog notify active";
            }, 100);

            var elemToOut = alertElem;
            var obj = this;
            setTimeout(function() {
                elemToOut.className = "dialog notify out";
                obj.leaveSeat(seat);
                setTimeout(function() {
                    elemToOut.parentNode.removeChild(elemToOut);
                }, 300);
            }, durationTime);
        },
        // 位置调整
        seatList: function() {
            return [0, 0, 0, 0, 0];
        }(),
        findSeat: function() {
            var largestGap = this.seatList[0] || 0,
                largestGapIndex = 0;
            if (this.seatList.length < 0) return null;
            for (var i = 0; i < this.seatList.length; i++) {
                if (this.seatList[i] < largestGap) {
                    largestGap = this.seatList[i];
                    largestGapIndex = i;
                }
            }
            this.seatList[largestGapIndex]++;
            return largestGapIndex;
        },
        leaveSeat: function(num) {
            this.seatList[num]--;
        }
    };

    /**
     * 警告对话框
     * <button class="btn btn-success btn-sm" onclick="$Dialog.alert('我是一个警告对话框！~\(≧▽≦)/~')">点击试下</button>
     * @param {string|{tip,confirm}} str 提示信息，字符串类型为提示文本，对象类型如下
     * @param {string|{tip,confirm}} str.tip 提示文本
     * @param {string|{tip,confirm}} str.confirm 确认按钮文本
     * @param {function=} callback 点击确认后的回调函数
     * @memberof module:DialogBox
     */
    function alert(str, callback) {
        var alertElem = htmlTemplate.getAlertElem();
        if(typeof str =="string"){
            alertElem.querySelector('h4').innerHTML = str;
        }
        if(typeof str =="object"){
            alertElem.querySelector('h4').innerHTML = str.tip;
            alertElem.querySelector('[data-name="confirm"]').innerHTML = str.confirm;
        }

        alertElem.style.display = "block";
        dimmerMng.show();
        document.body.appendChild(alertElem);

        var mtop = alertElem.offsetHeight / 2;
        alertElem.style.marginTop = -mtop + "px";

        alertElem.querySelector('.selected').onclick = function() {
            // 确认
            callback && callback();
            dimmerMng.hide();
            alertElem.parentNode.removeChild(alertElem);
        }
    }

    /**
     * 确认对话框
     * <button class="btn btn-success btn-sm" onclick="$Dialog.confirm('我是一个确认对话框！~\(≧▽≦)/~')">点击试下</button>
     * @param {string|{tip,confirm,cancel}} str 提示信息，字符串类型为提示文本，对象类型如下
     * @param {string|{tip,confirm,cancel}} str.tip 提示文本
     * @param {string|{tip,confirm,confirm}} str.confirm 确认按钮文本
     * @param {string|{tip,confirm,cancel}} str.cancel 取消按钮文本
     * @param {function=} confirmCallback 点击确认后回调函数
     * @param {function=} cancelCallback 点击取消后回调函数
     * @memberof module:DialogBox
     */
    function confirm(str, confirmCallback, cancelCallback) {
        var alertElem = htmlTemplate.getConfirmElem();
        alertElem.querySelector('h4').innerHTML = str;
        if(typeof str =="string"){
            alertElem.querySelector('h4').innerHTML = str;
        }
        if(typeof str =="object"){
            alertElem.querySelector('h4').innerHTML = str.tip;
            alertElem.querySelector('[data-name="confirm"]').innerHTML = str.confirm?str.confirm:"确认";
            alertElem.querySelector('[data-name="cancel"]').innerHTML = str.cancel?str.cancel:"取消";
        }
        alertElem.style.display = "block";
        dimmerMng.show();
        document.body.appendChild(alertElem);

        var mtop = alertElem.offsetHeight / 2;
        alertElem.style.marginTop = -mtop + "px";

        alertElem.querySelector('#dialogButton0').onclick = function() {
            // 取消
            cancelCallback && cancelCallback();
            dimmerMng.hide();
            alertElem.parentNode.removeChild(alertElem);
        };

        alertElem.querySelector('#dialogButton1').onclick = function() {
            // 确认
            confirmCallback && confirmCallback();
            dimmerMng.hide();
            alertElem.parentNode.removeChild(alertElem);
        }
    }

    /**
     * 模态框 管理
     */
    var ModalBox = {
        transformMap:[],
        pushTrans:function(data){
            this.transformMap.push(data);
        },
        getTrans:function(target){
            for (var i = 0; i < this.transformMap.length; i++) {
            	var trans  = this.transformMap[i];
            	if(trans.target = target){
            	    return trans.transMtd;
            	}
            }
            return null;
        },
        setTrans:function(target,transMtd){
            if(this.getTrans(target))return;
            this.pushTrans({
                target:target,
                transMtd:transMtd
            });
        },
        /**
         * 注册模态框
         * @param {Object} config 模态框注册配置
         * @param {Object} config.object 单个模态框的配置，对象名称为生成的方法名称
         * @param {Element|String} config.object.target 目标模态框元素或者元素选择器字符串
         * @param {String=} config.object.transMtd 转化操作的class名称
         * @memberof module:DialogBox
         * @example
         * 
         * $Dialog.registerModal({
         *     submitSuccess:{
         *         target:'#submitSuccessModal',
         *         transMtd:'Z-modal_show'
         *     },
         *     submitFail:{
         *         target:'#submitFailModal',
         *         transMtd:'Z-modal_show'
         *     }
         * });
         * $Dialog.submitSuccess('show',{tip:"提交成功！"});
         * $Dialog.submitSuccess('hide');
         *
         */
        registerModal:function(config){
            var options = [];
            if ( isArray(config) ) {
                options = config;
            }else if( $wd.isObject(config) ){
                for (var an in config) {
                    if(!config.hasOwnProperty(an))continue;
                    config[an].name = an;
                	options.push(config[an]);
                }
            }
            var me = this;
            options.forEach(function(opt){
                var name = opt.name;
                var target = opt.target;
                $Dialog[name] = function(method,data){
                    // 绑定显示&隐藏方法
                    me.transformMap.push(opt);
                    if(method=='hide'){
                        me.hideModal(target,data);
                    }else{
                        me.showModal(target,data);
                    }
                    // 绑定取消按钮
                    $wd(target).find('[data-modal="hide"]').forEach(function(elem){
                        var targetSave = target;
                        elem.onclick = function(){
                            me.hideModal(targetSave);
                        }
                    });
                }
            });
        },
        showModal:function(target,data){
            var transMtd = this.getTrans(target);
            if($wd.isString(transMtd)){
                $wd(target).addClass(transMtd);
                this.setTrans(target,transMtd);
            }else{
                $wd(target).show();
            }
            if(data){
                $wd(target).render({
                    data:data,
                    attrName:"data-name",
                    reset:true
                })
            }
            $wd(target).setStyle("");
            // 位置调整
            var srcWidth = document.body.offsetWidth;
            var srcHeight = $ScreenHeight;
            /**
             * 临时使用jquery height width
             */
            var width = $(target).width();
            var height = $(target).height();
            $wd(target)[0].style.left = (srcWidth/2-width/2) + 'px';
            $wd(target)[0].style.top = (srcHeight/2-height/2) + 'px';

            dimmerMng.show();
        },
        hideModal:function(target){
            var isHide = false;
            dimmerMng.hide();
            var transMtd = this.getTrans(target);
            if($wd.isString(transMtd)){
                $wd(target).removeClass(transMtd);
                return;
            }
            this.transformMap.forEach(function(data){
                if(isHide)return;
                if(target == data.target){
                    $wd(target).removeClass(data.transMtd);
                    isHide = true;
                }
            });
            if(isHide)return;
            $wd(target).hide();
        }
    };

    window.$Dialog = {
        alert: alert,
        notify: function (str, duration, icon) {
            notifyMng.show.apply(notifyMng, arguments);
        },
        confirm: confirm,
        registerModal: function (config) {
            ModalBox.registerModal.apply(ModalBox, arguments);
        }
    };

    return $Dialog;

});
