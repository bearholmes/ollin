/*jshint browser: true */
/*global chrome */
/* 키티가 시킨건 아닌데 시작한 프로젝트 */
/* 2017.01.20 ~ 22*/

(function() {
    var manifest = chrome.runtime.getManifest();
    var extension_name = manifest.name;

    var doc = document,
        html = doc.getElementsByTagName("html")[0],
        body = doc.getElementsByTagName("BODY")[0];
    var $ = function() {
        return doc.getElementById(arguments[0]);
    };

    var getCssProperty = function(elmId, property) {
        var elem = elmId ? elmId : doc.getElementById(elmId);
        var pro = window.getComputedStyle(elem, null).getPropertyValue(property);
        return parseInt(pro);
    };
    //초기값 설정
    var clickX = 0,
        clickY = 0,
        beforeX = 0,
        beforeY = 0,
        elemOffsetX = 0,
        elemOffsetY = 0;

    var ollin = {
        handle: {
            file: function(e) {
                var canvas = $("dk_overlay_img");
                if (e.target.files && e.target.files[0]) {
                    var FR = new FileReader();
                    FR.onload = function(e) {
                        var img = new Image();
                        img.src = e.target.result;
                        canvas.src = e.target.result;
                        canvas.width = img.width;
                        canvas.height = img.height;
                    };
                    FR.readAsDataURL(e.target.files[0]);
                }

                var btn_elem = $("dk_overlay_btn");
                if (btn_elem.disabled == true) {
                    $("dk_overlay_img_layer").style.display = 'block';
                    btn_elem.childNodes[1].innerHTML = 'on';
                    btn_elem.childNodes[0].className = "on";
                    btn_elem.disabled = false;
                    $("dk_overlay_scale").disabled = false;
                    $("dk_overlay_opacity").disabled = false;
                }
            },
            opacity: function(e) {
                $("dk_overlay_img_layer").style.opacity = this.value;
                $("dk_overlay_opacity_text").innerText = this.value;
            },
            scale: function(e) {
                $("dk_overlay_img_layer").style.transform = "scale(" + this.value + ", " + this.value + ")";
                $("dk_overlay_scale_text").innerText = "x" + this.value;
            },
            layer: function(e) {
                var overlay_elem = $("dk_overlay_img_layer"),
                    btn_elem = $("dk_overlay_btn");
                if (overlay_elem.style.display == 'block') {
                    overlay_elem.style.display = 'none';
                    btn_elem.childNodes[0].className = "off";
                    btn_elem.childNodes[1].innerHTML = 'off';
                } else {
                    overlay_elem.style.display = 'block';
                    btn_elem.childNodes[1].innerHTML = 'on';
                    btn_elem.childNodes[0].className = "on";
                }
            }
        },
        markup: {
            overlay: function() {
                var div = doc.createElement("div"),
                    img = doc.createElement("img");
                div.id = "dk_overlay_img_layer";
                div.style.display = 'none';
                img.id = "dk_overlay_img";
                img.src = "";
                img.alt = "";
                div.appendChild(img);
                html.appendChild(div);
            },
            control: function() {
                var div = doc.createElement("div"),
                    tit = doc.createElement("span");
                div.id = "dk_overlay_controller_toolbar";
                tit.className = "tit";
                tit.innerText = extension_name;
                div.appendChild(tit);

                var sw = doc.createElement("button"),
                    sw_icon = doc.createElement("i"),
                    sw_txt = doc.createElement("span");
                sw.id = "dk_overlay_btn";
                sw.className = "sw";
                sw.disabled = true;
                sw_icon.className = "off";
                sw.appendChild(sw_icon);
                sw_txt.innerText = "off";
                sw.appendChild(sw_txt);
                div.appendChild(sw);

                var file = doc.createElement("input");
                file.id = "dk_overlay_files";
                file.setAttribute("type", "file");
                div.appendChild(file);

                var sub = doc.createElement("div");
                sub.className = "tools";

                var s_icon = doc.createElement("i"),
                    scale = doc.createElement("input"),
                    s_txt = doc.createElement("span");
                s_icon.className = "mag";
                s_icon.title = "비율";
                scale.id = "dk_overlay_scale";
                scale.setAttribute("type", "range");
                scale.max = 3;
                scale.min = 0.5;
                scale.step = 0.5;
                scale.value = 1;
                scale.disabled = true;
                s_txt.id = "dk_overlay_scale_text";
                s_txt.innerText = "x1";
                sub.appendChild(s_icon);
                sub.appendChild(scale);
                sub.appendChild(s_txt);

                var o_icon = doc.createElement("i"),
                    opacity = doc.createElement("input"),
                    o_txt = doc.createElement("span");
                o_icon.className = "opacity";
                o_icon.title = "투명도";
                opacity.id = "dk_overlay_opacity";
                opacity.setAttribute("type", "range");
                opacity.max = 1;
                opacity.min = 0;
                opacity.step = 0.05;
                opacity.value = 0.5;
                opacity.disabled = true;
                o_txt.id = "dk_overlay_opacity_text";
                o_txt.innerText = "0.5";
                sub.appendChild(o_icon);
                sub.appendChild(opacity);
                sub.appendChild(o_txt);

                div.appendChild(sub);

                body.style.setProperty("transform", "translateY(30px)", "important");
                html.appendChild(div);
            }
        },
        drag: {
            //drag event - code by 멀린
            click: function(e, elem) {
                clickX = e.clientX;
                clickY = e.clientY;

                elemOffsetX = getCssProperty(elem, 'left'),
                elemOffsetY = getCssProperty(elem, 'top');
                return false;
            },
            move: function(e, elem) {
                var moveX = e.clientX,
                    moveY = e.clientY,
                    resultX = moveX - clickX,
                    resultY = moveY - clickY;
                //console.log('clickX :'+ clickX + ',' + 'clickY :' + clickY);
                //console.log('moveX :'+ moveX + ',' + 'moveY :' + moveY);

                if (!(beforeX == resultX && beforeY == resultY) && !(moveX == 0 && moveY == 0)) {
                    //console.log('resultX :'+ resultX + ',' + 'resultY :' + resultY);
                    //console.log('elemOffsetX :'+ elemOffsetX + ',' + 'elemOffsetY :' + elemOffsetY);

                    var left = (resultX + elemOffsetX),
                        top = (resultY + elemOffsetY);

                    elem.style.left = left + 'px';
                    elem.style.top = top + 'px';

                    beforeX = resultX;
                    beforeY = resultY;
                    // console.log('left :'+ left + ',' + 'top :' + top);
                }
                return false;
            },
            key: function(e, elem) {
                elemOffsetX = getCssProperty(elem, 'left'),
                elemOffsetY = getCssProperty(elem, 'top');

                switch (e.keyCode) {
                    //left
                    case 37:
                        console.log('left');

                        if (!e.shiftKey) elem.style.left = (elemOffsetX - 1) + 'px';
                        else if (e.shiftKey) elem.style.left = (elemOffsetX - 10) + 'px';
                        e.preventDefault();
                        break;
                        //up
                    case 38:
                        console.log('up');

                        if (!e.shiftKey) elem.style.top = (elemOffsetY - 1) + 'px';
                        else if (e.shiftKey) elem.style.top = (elemOffsetY - 10) + 'px';
                        e.preventDefault();
                        break;
                        //right
                    case 39:
                        console.log('right');

                        if (!e.shiftKey) elem.style.left = (elemOffsetX + 1) + 'px';
                        else if (e.shiftKey) elem.style.left = (elemOffsetX + 10) + 'px';
                        e.preventDefault();
                        break;
                        //down
                    case 40:
                        console.log('down');

                        if (!e.shiftKey) elem.style.top = (elemOffsetY + 1) + 'px';
                        else if (e.shiftKey) elem.style.top = (elemOffsetY + 10) + 'px';
                        else if (e.ctrlKey) elem.style.top = (elemOffsetY + 50) + 'px';
                        e.preventDefault();
                        break;
                }
            },
            init: function() {
                function Drag(elem) {
                    this.elem = null;
                    Drag.prototype.init(elem);
                    Drag.prototype.initEvent();
                }

                Drag.prototype.init = function(elem) {
                    this.elem = doc.getElementById(elem);
                };

                Drag.prototype.initEvent = function() {
                    var that = this;

                    this.elem.addEventListener("mousedown", function(e) {
                        ollin.drag.click(e, that.elem);
                        return false;
                    }, false);

                    this.elem.addEventListener("drag", function(e) {
                        ollin.drag.move(e, that.elem);
                        return false;
                    }, false);

                    doc.body.addEventListener('keydown', function(e) {
                        ollin.drag.key(e, that.elem);
                    });
                };
                return Drag;
            }
        },
        init: function() {
            ollin.markup.overlay();
            ollin.markup.control();

            ollin.drag.init()('dk_overlay_img_layer');

            $("dk_overlay_btn").addEventListener('click', ollin.handle.layer);
            $("dk_overlay_opacity").addEventListener('change', ollin.handle.opacity);
            $("dk_overlay_scale").addEventListener('change', ollin.handle.scale);
            $("dk_overlay_files").addEventListener('change', ollin.handle.file);
        }
    }
    ollin.init();
})();
