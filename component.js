// 获取要操作的元素
var video = document.getElementById("video");
var videoControls = document.getElementById("videoControls");
var videoContainer = document.getElementById("videoContainer");
var controls = document.getElementById("video_controls");
var playBtn = document.getElementById("playBtn");
var progressWrap = document.getElementById("progressWrap");
var playProgress = document.getElementById("playProgress");
var canvas = document.getElementById("canvas");
var progressFlag;

// 创建我们的操作对象，我们的所有操作都在这个对象上。
var videoPlayer = {
    init: function(){
        var that = this;
        videoPlayer.operateControls();
    },
    operateControls: function(){
        bindEvent(playBtn, "click", play);
        bindEvent(canvas, "click", play);
        bindEvent(progressWrap, "mousedown", videoSeek);
    }
}

videoPlayer.init();

// 原生的JavaScript事件绑定函数
function bindEvent(ele, eventName, func){
    if(window.addEventListener){ //标准事件模型
        ele.addEventListener(eventName, func);
    }
    else{ //IE8以下的IE事件模型
        ele.attachEvent('on' + eventName, func);
    }
}

// 控制video的播放
function play(){
    if ( video.paused || video.ended ){              
        if ( video.ended ){ 
            video.currentTime = 0;
            } 
        video.play();
        playBtn.innerHTML = "暂停"; 
        progressFlag = setInterval(getProgress, 60);
    } 
    else{ 
        video.pause(); 
        playBtn.innerHTML = "播放";
        clearInterval(progressFlag);
    } 
}
// video的播放条
function getProgress(){
    var allTime = getTime(video.duration);
    var nowTime = getTime(video.currentTime);
    var percent = video.currentTime / video.duration;
    playProgress.style.width = percent * (progressWrap.offsetWidth) - 2 + "px";
    showProgress.innerHTML = nowTime + '/' + allTime ;
}

function getTime(data){
        var m=Math.floor(data/60);
        var s=Math.floor(data%60);
        m=m>=10?m:'0'+m;
        s=s>=10?s:'0'+s;
        return m+':'+s;//allTime.toString();
}
// 鼠标在播放条上点击时进行捕获并进行处理
function videoSeek(e){
    // if(video.paused || video.ended){
    //     play();
    //     enhanceVideoSeek(e);
    // }
    // else{
    //     enhanceVideoSeek(e);
    // }
    document.addEventListener('mousemove', moveHandler, true);
    document.addEventListener('mouseup', upHandler, true);
    event.stopPropagation(); 
    event.preventDefault(); 
    enhanceVideoSeek(e);

}
 // * @param {*} elementTopDrag 接收mousedown事件的元素或其某些包含元素
 // * @param {*} event mousedown事件对象
function enhanceVideoSeek(e){
    clearInterval(progressFlag);
    var percent = e.pageX / progressWrap.offsetWidth;
    playProgress.style.width = percent * (progressWrap.offsetWidth) - 2 + "px";
    video.currentTime = percent * video.duration;
    progressFlag = setInterval(getProgress, 60);
}

function moveHandler(e){
    var scroll = getScrollOffsets();
        var left = e.clientX + scroll.x - deltaX;
        var top = e.clientY + scroll.y - deltaY;
        if(left<0){
            left = 0;
        }else if(left>e.clientX  - elementTopDrag.offsetWidth){
            left = e.clientX  - elementTopDrag.offsetWidth;
        }
        if(top<0){
            top=0;
        }else if(top>e.clientY  - origY){
            top = e.clientY  - origY;
        }
        elementTopDrag.style.left = left + 'px';
        elementTopDrag.style.top = top + 'px';
        e.stopPropagation(); 
        document.documentElement.style.overflow = 'hidden';
}

function upHandler(e){
        if(!e){
            e =window.event;
        }
        //DOM事件模型
        document.removeEventListener('mouseup', upHandler, true);
        document.removeEventListener('mousemove', moveHandler, true);
        e.stopPropagation();      //取消事件传播  标准模式
        document.documentElement.style.overflow = 'auto';
}