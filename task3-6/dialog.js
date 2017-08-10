//utils
var log = console.log.bind(console)

function e(sel) {
    return document.querySelector(sel)
}

function es(sel) {
    return document.querySelectorAll(sel)
}

// Dialog component -- easy to extend and config
function Dialog(sel) {
    this.el = null
    this.sel = sel
    this.width = 500
    this.height = 250
    this.state = 'show'
    this.ok = null
    this.cancel = null
    return this
}
Dialog.prototype.init = function(w, h) {
    this.el = e(this.sel)
    this.setWidth()
    this.setHeight()

    // log(this.width, this.height)

    this._bindEvent()
    return this
}
Dialog.prototype.setWidth = function(w) {
    this.width = w
    this.el.style.width = this.width + 'px'
}
Dialog.prototype.setHeight = function(h) {
    this.height = h
    this.el.style.height = this.height + 'px'
}

//bind default event for ok and cancel button
Dialog.prototype._bindEvent = function() {
    this.ok = e('.btn-ok')
    this.cancel = e('.btn-cancel')
    var btns = [this.ok, this.cancel]
    var self = this
    btns.map(function(v, k) {
        v.addEventListener('click', function() {
            self.hide()
            e('.toggle-dialog').innerHTML = '显示浮出层'
        }, false)
    })
    return this
}

Dialog.prototype.cancel = function(callback) {
    if (!this.cancel) return
    this.cancel.addEventListener('click', function() {
        callback()
    }, false)
    return this
}

Dialog.prototype.ok = function(callback) {
    if (!this.ok) return
    this.ok.addEventListener('click', function() {
        callback()
    }, false)
    return this
}

Dialog.prototype.shadow = function(shadowSelector) {
    this.shadow = e(shadowSelector)
    return this
}

Dialog.prototype.titleBgcolor = function(color) {
    var title = e('.d-title')
    title.style.backgroundColor = color
    title.style.color = 'black'
    return this
}

Dialog.prototype.show = function() {
    this.el.style.display = 'block'
    this.shadow.style.display = 'block'
    this.state = 'show'
    return this
}

Dialog.prototype.hide = function() {
    this.el.style.display = 'none'
    this.shadow.style.display = 'none'
    this.state = 'hidden'
    return this
}

var d = new Dialog('.dialog')
d.init(500, 250).titleBgcolor('#aaaaaa').shadow('.shadow')