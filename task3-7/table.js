//utils
var log = console.log.bind(console)

function e(sel) {
    return document.querySelector(sel)
}

function es(sel) {
    return document.querySelectorAll(sel)
}

function addClass(el, className) {
    el.className += ' ' + className
}

function removeClass(el, className) {
    var classes = el.className.split(' ')
    var delIndex = null
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] == className) {
            delIndex = i
        }
    }
    classes.splice(delIndex, 1)
}

var data = [
    ['姓名', '语文', '数学', '英语', '总分'],
    ['小明', '80', '90', '70', '240'],
    ['小红', '90', '60', '90', '240'],
    ['小亮', '60', '100', '70', '230'],
    ['小李', '50', '70', '90', '210'],
    ['小王', '50', '70', '60', '180'],
    ['小张', '90', '90', '80', '260'],
]

var SortedTable = function(config) {
    var keys = Object.keys(config)
    var len = keys.length
    for (var i = 0; i < len; i++) {
        this[keys[i]] = config[keys[i]]
    }
    return this
}
SortedTable.prototype.init = function() {
    this.el = e(this.className)
    this.el.style.textAlign = 'center'

    this.createTable()

    this.fillHeader()
    this.fillData()
    this._bindEvent()
    return this
}
SortedTable.prototype.createTable = function() {
    var tbody = '<tbody><tr><td></td>'

    // create header
    for (var j = 1; j < this.cols; j++) {
        tbody += '<td><div class="up-triangle"></div>' +
            '<div class="down-triangle"></div></td>'
    }
    tbody += '</tr>'

    //create content
    for (var i = 1; i < this.rows; i++) {
        tbody += '<tr>'
        for (var j = 0; j < this.cols; j++) {
            tbody += '<td></td>'
        }
        tbody += '</tr>'
    }
    tbody += '</tbody>'
    var table = e(this.className + ' table')

    table.innerHTML = tbody
}
SortedTable.prototype.fillHeader = function() {
    var tr = e(this.className + ' table tr')
    tr && addClass(tr, 't-header')
    var tds = tr && tr.querySelectorAll('td')
    var tdLen = tds.length
    for (var j = 0; j < tdLen; j++) {
        tds[j].innerHTML += this.data[0][j]
    }
}
SortedTable.prototype.fillData = function() {
    var trs = es(this.className + ' table tr')
    var len = trs.length
    for (var i = 1; i < len; i++) {
        var tds = trs[i].querySelectorAll('td')
        var tdLen = tds.length
        for (var j = 0; j < tdLen; j++) {
            tds[j].innerText = this.data[i][j]
        }
    }
    return this
}
SortedTable.prototype._bindEvent = function() {
    var ups = es('.up-triangle')
    var downs = es('.down-triangle')
    var self = this
    for (var i = 0; i < ups.length; i++) {
        (function() {
            var upCallback = (function(i) {
                return function(event) {
                    self.sortAsc(i + 1)
                }
            })(i)
            var downCallback = (function(i) {
                return function(event) {
                    self.sortDesc(i + 1)
                }
            })(i)
            ups[i].addEventListener('click', upCallback, false)
            downs[i].addEventListener('click', downCallback, false)
        })(i)
    }
}
SortedTable.prototype.sort = function(col, asc) {
    if (col == 0) return

    function callback(col) {

        //return a sort function
        return function(a, b) {
            var x = a[col] || 0
            var y = b[col] || 0
            return x - y
        }
    }
    var dataToSort = data.slice(1) || []
    dataToSort.sort(callback(col));
    // for (var i = 0; i < dataToSort.length; i++) {
    //     log(dataToSort[i][col])
    // };
    !asc && dataToSort.reverse()

    data[0] && dataToSort.unshift(data[0])
    this.data = dataToSort
    this.fillData()
}
SortedTable.prototype.sortAsc = function(col) {
    this.sort(col, true)
}
SortedTable.prototype.sortDesc = function(col) {
    this.sort(col, false)
}