/**
 * Created by shenwudi on 2017/10/13.
 */
//utils
var log = console.log.bind(console)

var e = function(sel) {
    return document.querySelector(sel)
}

var es = function(sel) {
    return document.querySelectorAll(sel)
}
var toggleStatus = function(elem) {
    if (elem.classList.contains('hide')) {
        show(elem)
    } else if (elem.classList.contains('show')) {
        hide(elem)
    }
}
var show = function(elem) {
    elem.classList.remove('hide')
    elem.classList.add('show')
}
var hide = function(elem) {
    elem.classList.remove('show')
    elem.classList.add('hide')
}

//music player
var MusicPlayer = function () {
    this.musicItem = e('#music-list')
    this.playBtn = e('.play-button')
    this.volumeSetting = e('.volume-setting')
    this.volume = e('.volume')
    this.audio = new Audio()
    this.song = playlist[0]
    this.playing = false
    this.selected = false
}

MusicPlayer.prototype.init = function () {
    this.loadPlaylist()
    this.playlistItems = es('#music-list li')
    this.playingIndex = 0
    this.bindEvents()
}
MusicPlayer.prototype.loadPlaylist = function () {
    //load data
    this.musicItem.innerHTML = playlist.map((item, index) => {
        return `<li data-index=${index}>
                    <span class="star">
                        <i class="fa fa-star-o"></i>
                    </span>
                    <span class="song-title" data-index=${index}>
                            ${item.title}
                            </span>
                    <span class="singer" data-index=${index}>
                            ${item.artist}
                            </span>
                    <span class="song-share">
                                    <i class="fa fa-share-square-o"></i>
                                </span>
                    <span class="song-del">
                                    <i class="fa fa-times"></i>
                    </span>
                </li>`
    }).join('')
}
MusicPlayer.prototype.bindEvents = function () {
    //event binding
    this.musicItem.addEventListener('click', function(event) {
        this.selected = true
        var target = event.target
        if (target.dataset.index) {
            this.play(Number(target.dataset.index))
        }
    }.bind(this))

    this.audio.addEventListener('timeupdate', function(event) {
        var time = this.song.length - this.audio.currentTime
        var sec = Math.floor(time % 60)
        var min = Math.floor(time / 60)
        sec = sec < 10 ? '0' + sec : sec
        e('.left-time').innerHTML = `-${min}:${sec}`
        var percent = Math.floor(this.audio.currentTime / this.song.length * 100) + '%'
        e('.played').style.width = percent
        e('.circle').style.left = percent
    }.bind(this))
    e('.search-btn').addEventListener('click', function(event) {
        var keyword = e('.search-box').value
        this.search(keyword)
    }.bind(this))
    e('.clear-all').addEventListener('click', function(event) {
        var res = confirm("你确定清除所有歌曲吗？")
        res == true && this.clearAll()
    }.bind(this))
    e('.fast-backward').addEventListener('click',function (event) {
        if(!this.selected){
            alert('请点击歌曲播放！')
            return
        }
        this.before(this.playingIndex)
    }.bind(this))
    e('.fast-forward').addEventListener('click',function (event) {
        if(!this.selected){
            alert('请点击歌曲播放！')
            return
        }
        this.next(this.playingIndex)
    }.bind(this))

    this.playBtn.addEventListener('click', function(event) {
        if(!this.selected){
            alert('请点击歌曲播放！')
            return
        }
        this.changeState()
        this.changeIcon()
    }.bind(this))
    this.volumeSetting.addEventListener('click', function(event) {
        toggleStatus(this.volume)
    }.bind(this))
    this.volume.addEventListener('click', function(event) {
        this.setVolume(event)
    }.bind(this))
}
MusicPlayer.prototype.changeTitleAndPicture = function () {
    var o =this.song
    e('.cover img').src = o.picture
    e('.artist-name').innerHTML = o.artist
    e('.song').innerHTML = o.title
    document.title = o.title
}
//core
MusicPlayer.prototype.play = function(index) {
    log(this.playlistItems[this.playingIndex],this.playingIndex)
    if (this.playlistItems[this.playingIndex].classList.contains('active')) {
        this.playlistItems[this.playingIndex].classList.remove('active')
    }
    this.playingIndex = index
    this.song = playlist[index]
    this.changeTitleAndPicture()

    this.audio.src = this.song.url
    this.audio.play()
    this.playing = true
    this.changeIcon()
    this.playlistItems[this.playingIndex].classList.add('active')
    this.audio.addEventListener('ended', function(event) {
        this.next(this.playingIndex + 1)
    })
}

MusicPlayer.prototype.setVolume = function(event) {

    //获取元素左上角相对于视口的矩形
    const rect = this.volumeSetting.getBoundingClientRect()

    //必须获取真实宽度
    var w = document.defaultView.getComputedStyle(this.volume).width

    var vol = (event.clientX - rect.left) / parseInt(w)
    if(vol < 0){
        vol = 0
    }
    else if(vol > 1){
        vol = 1
    }
    this.volume.style.width = vol * 100 + '%'
    this.audio.volume = vol
    toggleStatus(this.volume)
}

MusicPlayer.prototype.before = function(index) {
    if(this.playingIndex == 0){
        alert('没有前一首了！')
        return
    }
    this.play(index-1)
}

MusicPlayer.prototype.next = function(index) {
    if(this.playingIndex == playlist.length-1){
        this.playingIndex = 0
    }
    this.play(index+1)
}

MusicPlayer.prototype.clearAll = function() {
    this.musicItem.innerHTML = ''
}

MusicPlayer.prototype.changeIcon = function() {
    if (this.playing) {
        this.playBtn.innerHTML = '<i class="fa fa-pause"></i>'
    } else {
        this.playBtn.innerHTML = '<i class="fa fa-play"></i>'
    }
}
MusicPlayer.prototype.changeState = function() {
    if (this.playing) {
        this.audio.pause()
    } else {
        this.audio.play()
    }
    this.playing = !this.playing
}
MusicPlayer.prototype.search = function(name) {
    var arr = playlist.map(function(v, k) {
        if (v.title.includes(name)) {
            return index
        }
    });
    !arr[0] && alert('没找到所要查找的歌曲')
    this.play(arr[0] || 0)
}
MusicPlayer.prototype.active = function() {
    if (target.tagName.toLowerCase() == 'span') {
        target.parentNode.style.color = 'white'
    }
    if (target.tagName.toLowerCase() == 'li') {
        target.style.color = 'white'
    }
}

MusicPlayer.prototype.setPlayMode = function(mode) {
    if (mode == 'circle') {

    } else if (mode == 'single') {

    } else if (mode == 'random') {

    }
}