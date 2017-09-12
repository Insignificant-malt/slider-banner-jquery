;(function(window){
    function Banner(config){
        this.init(config);
    }
    Banner.prototype = {
        constructor: Banner,
        init: function(config){
            this.boxId = config.boxId;
            this.arrId = config.arrId;
            this.leftId = config.leftId;
            this.rightId = config.rightId;
            this.splider = config.splider;
            this.active = config.active;
            this.banner(this.boxId,this.arrId,this.leftId,this.rightId,this.active,this.splider);
        },
        banner:function(boxId,arrId,leftId,rightId,active,splider){
            var timer = null;
            var pic = 0;//记录当前显示的图片的索引
            var square = 0;//记录当前亮起的按钮的索引
            var flag = true;
            var box = $(boxId);
            var screen = $(boxId + ">:first");
            var ul = $(boxId + ">:first>:first");
            var ulLis = ul.children();
            var ol = $(boxId + ">:first>:last");
            var arr = $(arrId);
            var left = $(leftId);
            var right = $(rightId);
            var imgWidth = screen.width();

            //动态生成结构
            //生成ol中的按钮
            ulLis.each(function(){
                ol.append("<li></li>");
            })
            var olLis = ol.children();
            ol.children().eq(0).addClass(active);

            //克隆第一张图
            var firstImg = $(boxId + ">:first>:first>:first").clone(true);
            ul.append(firstImg);

            //鼠标经过按钮  按钮排他 移动ul到相应位置
            olLis.mouseenter(function () {
                olLis.removeClass(active);
                $(this).addClass(active);
                //ul.animate({"left":-imgWidth*$(this).index()+"px"},500,function(){flag=true});

                //非jquery动画
                var ox = boxId.split("#")
                var bannerSliter = document.getElementById(ox[1]);
                var bannerSliterUl = bannerSliter.children[0].children[0];
                console.log(-imgWidth*$(this).index());
                animate(bannerSliterUl, -imgWidth*$(this).index());
                pic = square = $(this).index();
            });

            //点击箭头
            box.mouseenter(function () {
                arr.css({display:"block"});
                clearInterval(timer);
            });
            box.mouseleave(function () {
                arr.css({display:"none"});
                timer = setInterval(playNext, splider);
            });

            //点击右箭头 移动ul到相应位置
            right.click(function () {
                if(flag){
                    flag = false;
                    //如果是最后一张 就应该 瞬间跳回开始 然后让ul从真的第一张渐渐地移动到第二张
                    if (pic === ulLis.length) {//最后一张图片的索引
                        ul.css({"left":"0px"})
                        pic = 0;//pic也要归零
                    }
                    pic++;//计算接下来要显示的图片的索引
                    //目标 和pic有关 和图片宽度有关 而且是负数

                    ul.stop().animate({"left": "-=" +imgWidth + "px" }, 500, function () {
                        flag = true
                    });
                    //按钮也要跟着跑
                    if (square < olLis.length - 1) {
                        square++;
                    } else {
                        square = 0;
                    }
                    olLis.removeClass(active);
                    olLis.eq(square).addClass(active);
                }
            });

            left.click(function () {
                if(flag){
                    flag = false;
                    //如果是第一张 就应该 瞬间跳回最后 然后让ul从假的第一张渐渐地移动到真的最后一张
                    if (pic === 0) {
                        ul.css({"left":-(ulLis.length) * imgWidth+"px"});
                        pic = ulLis.length - 1;//pic要变到最后
                    }
                    pic--;//计算接下来要显示的图片的索引
                    //目标 和pic有关 和图片宽度有关 而且是负数
                    ul.stop().animate({"left": "+=" +imgWidth + "px"}, 500, function () {
                        flag = true
                    });
                    //按钮也要跟着跑
                    if (square > 0) {
                        square--;//计算出接下来要亮起的按钮的索引
                    } else {
                        square = olLis.length - 1;
                    }
                    olLis.removeClass(active);
                    olLis.eq(square).addClass(active);
                }
            });

            //添加自动滚动
            timer = setInterval(playNext, splider);
            function playNext() {
                right.click();
            }
        }
    }

    function animate(obj, target) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var leader = obj.offsetLeft;
            var step = (target - leader) / 10
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            leader = leader + step;
            obj.style.left = leader + "px";
            if (leader === target) {
                clearInterval(obj.timer);
            }
        }, 15)
    }

    window.Banner = Banner;
})(window)
