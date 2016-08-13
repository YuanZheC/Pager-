
;(function($, window, document){
	function Pager($ele,options) {
		var defaults = {
			pageIndex: 0,		// 页码索引
			start: 0,			// 起始值
			limit: 6,			// 限制值
			totalCount: 30, 	// 总记录数
			maxButtonCount: 7,  // 中间按钮总数
			prevText: '上一页',	// 上一页文字 自定义
			nextText: '下一页',	// 下一页文字 自定义
			midBtn: true,		// 是否显示中间按钮
			FirstEnd: true,		// 是否显示首页尾页按钮
			go: true,			// 是否显示 GO 按钮
			callback: function(start){console.log(start);return false;}	// 回调 --- 目前返回 start
		};
		this.$ele = $ele;
		this.options = $.extend(defaults, options || {});
		this.init();
	}

	Pager.prototype = {
		constructor: Pager,
		init: function(){
			this.renderHtml();
			this.bindEvent();
			this.options.go?this.bindGo():'';
		},
		// 渲染页面
		renderHtml: function(){
			var options = this.options;
			// 总页数
			options.totalPages = Math.ceil(options.totalCount / options.limit);
			var html = [];
			// 页码索引 > 0 的情况
			if(options.pageIndex > 0) {
				// 插入首页
				options.FirstEnd?(html.push('<a page="0" href="javascript:;" class="flip">首页</a>')):'';
				// 插入上一页
				html.push('<a page="' + (options.pageIndex - 1) + '" href="javascript:;" class="flip">' + options.prevText + '</a>');
			}else{
				// 插入首页
				options.FirstEnd?(html.push('<span class="flip noPage">首页</span>')):'';
				// 插入上一页
				html.push('<span class="flip noPage">' + options.prevText + '</span>');
			}

			// 临时中间页码 当页码数量大于显示的最大按钮数时使用
			var tempStartIndex = options.pageIndex - Math.floor(options.maxButtonCount / 2) + 1;
			// 计算终止页码
			var endIndex = Math.min(options.totalPages,Math.max(0,tempStartIndex) + options.maxButtonCount) - 1;
			var startIndex = Math.max(0,endIndex - options.maxButtonCount + 1);
			
			// 渲染中间页码
			if(this.options.midBtn){
				// 第一页
				if(startIndex > 0) {
					html.push("<a href='javascript:;' page='0'>1</a>");
	                if(startIndex>1) html.push("<span>...</span>");
	                // html.push("<span>...</span>");
				}
				// 中间页
				for(var i = startIndex; i <= endIndex; i++){
					if(options.pageIndex == i){
						html.push('<span class="curPage">' + (i + 1) + '</span>');
					}else{
						html.push('<a page="' + i + '" href="javascript:;">' + (i + 1) + '</a>');
					}
				}
				// 最后一页
				if(endIndex < options.totalPages - 1){
					endIndex<options.totalPages-2?html.push("<span>...</span> "):'';
					//html.push("<span>...</span> ")
	                html.push("<a href='javascript:;' page='" + (options.totalPages - 1) + "'>" + options.totalPages + "</a> ");
				}
			}
			
			// 下一页 -- 尾页
			if(options.pageIndex < options.totalPages - 1){
				html.push('<a page="' + (options.pageIndex + 1) + '" href="javascript:;" class="flip">' + options.nextText + '</a>');
				// 尾页
				options.FirstEnd?(html.push('<a page="' + (options.totalPages - 1) + '" href="javascript:;" class="flip">尾页</a>')):'';
			}else{
				html.push('<span class="flip noPage">' + options.nextText + '</span>');
				// 尾页
				options.FirstEnd?(html.push('<span class="flip noPage">尾页</span>')):'';
			}

			// go 按钮
			if(options.go){
				html.push('<span class="page-text">跳转到第</span><input class="page-ipt" value="'+(this.options.pageIndex+1)+'" id="page_value" type="text"><span class="page-text">页</span><button href="javascript:;" class="j-page-go page-go">GO</button><span class="page-text">共有'+options.totalPages+'页</span>');
			}

			// 渲染按钮
			this.$ele.html(html.join(""));
		},
		// 中间按钮点击事件
		bindEvent: function(){
			var that = this;
			that.$ele.on("click","a",function(){
				that.options.pageIndex = parseInt($(this).attr("page"),10);// 设置按钮索引
				that.renderHtml();// 重新渲染页面
				that.options.callback(that.options.pageIndex * that.options.limit);
				// 这个可以用来 设置输入框
				// that.options.onPageChanged && that.options.onPageChange(that.options.pageIndex);
			});
		},
		// go按钮点击事件
		bindGo: function(){
			var that = this;
			var goValue;
			// go 按钮
			that.$ele.on("click",".j-page-go",function(){
				goValue = +that.$ele.find("#page_value").val();
				if(goValue > 0 && goValue <= that.options.totalPages){
					that.options.pageIndex = goValue-1;
					that.renderHtml();// 重新渲染页面
					that.options.callback(that.options.pageIndex * that.options.limit);
				}else{
					alert("请输入正确的页码");
				}
			});
		},
		// 拿到索引 -- 扩展
		getPageIndex: function(){
			return this.options.pageIndex;
		},
		// 设置索引 -- 扩展
		setPageIndex: function(pageIndex){
			this.options.pageIndex = pageIndex;
			this.renderHtml();
		}
	};
	// 实例化
	$.fn.pager = function(options) {
		return new Pager(this,options);
	};
})(jQuery,window,document);