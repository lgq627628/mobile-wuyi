// JavaScript Document
function $(id) {
    return document.getElementById(id);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

function load(){
    var start = +new Date();
    var wel = $('welcome');
    var home = $('home');
    var arr = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg'];
    var loaded = false;
    var welcomed = false;
    wel.addEventListener('webkitTransitionEnd',end)
    var timer = setInterval(function(){
        if(+new Date() - start >= 5000){
            welcomed = true;
        }
        if(loaded && welcomed){
            clearInterval(timer);
            wel.style.opacity = 0;
        }
    },1000)
    function end(){
        removeClass(wel, 'show');
        addClass(home, 'show');
        tab();
    }
    for (var i = 0; i < arr.length; i++) {
        var oImg = new Image();
        oImg.src = 'img/' + arr[i];
        oImg.onload = function(){
            loaded = true;
        }
    };
}

function tab(){
    var tab = $('tab');
    var oUl = $('picList');
    var nav = tab.getElementsByTagName('nav')[0].children;
    var iNow = 0;
    var iX = 0;
    var iW = document.documentElement.clientWidth;
    var timer = 0;
    var iStartTouchX = 0;
    var iStartX = 0;  
    auto();
    if(!window.oscore){
       score(); 
       window.oscore = true;
    }
    function auto(){
        timer = setInterval(function(){
            iNow++;
            iNow = iNow%nav.length;
            lunbo();
        },2000);
    }
    tab.addEventListener('touchstart',start);
    tab.addEventListener('touchmove',move);
    tab.addEventListener('touchend',end);
    function start(ev){
        ev = ev.changedTouches[0];
        iStartTouchX = ev.pageX;
        iStartX = iX;
        clearInterval(timer);
    }
    function move(ev){
        oUl.style.transition="none";
        ev = ev.changedTouches[0];
        var iDis = ev.pageX - iStartTouchX;
        iX = iStartX + iDis;
        oUl.style.webkitTransform = oUl.style.transform = "translateX("+ iX +"px)";
    }
    function end(){
        iNow = Math.abs(iX/iW);
        iNow = Math.round(iNow);
        if(iNow<0){
            iNow = 0;
        }
        if(iNow>nav.length-1){
            iNow = nav.length - 1;
        }
        lunbo();
        auto();
    }
    function lunbo(){
        iX = -iNow*iW;
        oUl.style.transition="0.5s";
        oUl.style.webkitTransform = oUl.style.transform = "translateX("+ iX +"px)";
        for (var i = 0; i < nav.length; i++) {
            removeClass(nav[i],"active");
        };
        addClass(nav[iNow],"active");
    }
}

function score(){
    var score = $('score');
    var oLi = score.getElementsByTagName("li");
    var arr = ["好失望","没有想象的那么好","一般吧","良好","棒极了"];
    for (var i = 0; i < oLi.length; i++) {
        pLi(oLi[i]);
    };
    function pLi(li){
        var nav = li.getElementsByTagName("nav")[0].children;
        var oInput = li.getElementsByTagName("input")[0];
        for (var i = 0; i < nav.length; i++) {
            nav[i].index = i;
            nav[i].addEventListener('touchstart',function(){
                for (var i = 0; i < nav.length; i++) {
                    if(i<=this.index){
                        addClass(nav[i],'active');
                    }else{
                        removeClass(nav[i],'active');
                    }
                };
                oInput.value = arr[this.index];
            })
        };
    }
    if(!window.ohome){
       home(); 
       window.ohome = true;
    }
}

function info(dom,msg){
    dom.innerHTML = msg;
    dom.style.webkitTransform = "scale(1)";
    dom.style.opacity = 1;
    setTimeout(function(){
        dom.style.webkitTransform = "scale(0)";
        dom.style.opacity = 0;
    },1000)
}

function home(){
    var home = $('home');
    var oInfo = home.getElementsByClassName("info")[0];
    var btn = home.getElementsByClassName("btn")[0];
    btn.addEventListener('touchend',end);
    function end(){
        var bool1 = haveScore();
        var bool2 = haveTag();
        if(bool1){
            if(bool2){
                addClass(btn,'submit');
                homeOut();
            }else{
                info(oInfo,"请添加标签");
            }
        }else{
            info(oInfo,"请给景区评分");
        }
    }
    function haveScore(){
        var score = $("score");
        var oInput = score.getElementsByTagName("input");
        for (var i = 0; i < oInput.length; i++) {
            if(oInput[i].value == 0){
                return false;
            }
        };
        return true;
    }
    function haveTag(){
        var tags = $("tags");
        var oInput = tags.getElementsByTagName("input");
        for (var i = 0; i < oInput.length; i++) {
            oInput[i].index = i;
            if(oInput[i].checked){
                return true;
            }
        };
        return false;
    }
}

function homeOut(){
    var mask = $("mask");
    var home = $("home");
    var news = $("news");
    addClass(mask, 'show');
    addClass(news, 'show');
    if(!window.ofnNews){
        fnNews();
        window.ofnNews = true;
    }
    //display从none变成block的过程中transition是没有效果的
    setTimeout(function(){
        mask.style.opacity = 1;
        home.style.filter = home.style.webkitFilter = "blur(5px)";
    },14)
    setTimeout(function(){
        mask.style.opacity = 0;
        home.style.filter = home.style.webkitFilter = "blur(0px)";
        removeClass(mask,"show");
        removeClass(home, 'show');
        news.style.opacity = 1;
    },2000)
}

function fnNews(){
    var news = $("news");
    var oInfo = news.getElementsByClassName("info")[0];
    var oInput = news.getElementsByTagName("input");
    oInput[0].onchange = function(){
        //console.log(this.files);
        if(this.files[0].type.split("/")[0] == "video"){
            newsOut();
            //提交给后端
            this.value = "";
        }else{
            info(oInfo,"请上传视频");
        }
    }
    oInput[1].onchange = function(){
        //console.log(this.files);
        if(this.files[0].type.split("/")[0] == "image"){
            newsOut();
            //提交给后端
            this.value = "";
        }else{
            info(oInfo,"请上传图片");
        }
    }
}
function newsOut(){
    var news = $("news");
    var form = $("form");
    addClass(form,"show");
    removeClass(news,"show");
    if(!window.oformIn){
        formIn();
        window.oformIn = true;
    }
    formIn();
}
function formIn(){
    var oForm = $("form");
    var over = $("over");
    var oInfo = oForm.getElementsByClassName("info")[0];
    var formTag = $("formTag").getElementsByTagName("label");
    var formBtn = oForm.getElementsByClassName("btn")[0];
    var bool = false;
    for (var i = 0; i < formTag.length; i++) {
        formTag[i].addEventListener("touchend",function(){
            bool = true;
            addClass(formBtn,"submit");
        })
    };
    formBtn.addEventListener("touchend",function(){
        if(bool){
            for (var i = 0; i < formTag.length; i++) {
                formTag[i].getElementsByTagName("input")[0].checked = false;
            }
            bool =false;
            addClass(over,"show");
            removeClass(formBtn,"submit");
            removeClass(oForm,"show");
            fnOver();
        }else{
            info(oInfo,"请给上传内容添加标签");
        }
    })
}

function fnOver(){
    var over = $("over");
    var home = $("home");
    var overBtn = over.getElementsByClassName("btn")[0];
    overBtn.addEventListener("touchend",function(){
        removeClass(over,"show");
        addClass(home,"show");
    })
}