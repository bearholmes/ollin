/*jshint browser: true */
/*global chrome */
/* 키티가 시킨건 아닌데 시작한 프로젝트 */
/* 2017.01.20 ~ 22*/

(function() {
    "use strict";
    var manifest = chrome.runtime.getManifest(),
        extension_name = manifest.name;

    var doc = document,
        html = doc.getElementsByTagName("html")[0],
        body = doc.getElementsByTagName("BODY")[0];

    var getCssProperty = function(elmId, property) {
        let elem = elmId ? elmId : doc.getElementById(elmId);
        let prop = window.getComputedStyle(elem, null).getPropertyValue(property);
        return parseInt(prop);
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
                var canvas = doc.getElementById("dk_overlay_img");
                if (e.target.files && e.target.files[0]) {
                    let fr = new FileReader();
                    fr.onload = function(e) {
                        var img = new Image();
                        img.src = e.target.result;
                        img.onload = function() {
                            canvas.src = e.target.result;
                            canvas.width = img.naturalWidth || img.width;
                            canvas.height = img.naturalHeight || img.height;
                        }
                    };
                    fr.readAsDataURL(e.target.files[0]);
                }

                let btn_elem = doc.getElementById("dk_overlay_btn");
                if (btn_elem.disabled == true) {
                    doc.getElementById("dk_overlay_img_layer").style.display = "block";
                    btn_elem.childNodes[0].className = "on";
                    //btn_elem.childNodes[1].innerHTML = "on";
                    btn_elem.disabled = false;
                    doc.getElementById("dk_overlay_scale").disabled = false;
                    doc.getElementById("dk_overlay_opacity").disabled = false;
                }
            },
            opacity: function(e) {
                console.log('opacity',this.value);
                doc.getElementById("dk_overlay_img_layer").style.opacity = this.value;
                doc.getElementById("dk_overlay_opacity_text").innerText = this.value;
            },
            scale: function(e) {
                console.log('scale',this.value);
                doc.getElementById("dk_overlay_img_layer").style.transform = "scale(" + this.value + ", " + this.value + ")";
                doc.getElementById("dk_overlay_scale_text").innerText = "x" + this.value;

                var img_width = getCssProperty(doc.getElementById("dk_overlay_img"), "width");
                var img_height = getCssProperty(doc.getElementById("dk_overlay_img"), "height");
                
                if (this.value === "0.5") {
                    doc.getElementById("dk_overlay_img_layer").style.top = ((img_height * (parseFloat(this.value * 0.5))) * -1) + 30 + 'px';
                    doc.getElementById("dk_overlay_img_layer").style.left = (img_width * (parseFloat(this.value * 0.5)))* -1 + 'px';
                } else {
                    doc.getElementById("dk_overlay_img_layer").style.top = ((img_height * (1 - parseFloat(this.value))) * -0.5) + 30 + "px";
                    doc.getElementById("dk_overlay_img_layer").style.left = (img_width * (1 - parseFloat(this.value))) * -0.5 + "px";
                }
            },
            layer: function(e) {
                let overlay_elem = doc.getElementById("dk_overlay_img_layer");
                let btn_elem = doc.getElementById("dk_overlay_btn");
                if (overlay_elem.style.display == "block") {
                    overlay_elem.style.display = "none";
                    btn_elem.childNodes[0].className = "off";
                    //btn_elem.childNodes[1].innerHTML = "off";
                    console.log('off')
                } else {
                    overlay_elem.style.display = "block";
                    btn_elem.childNodes[0].className = "on";
                    //btn_elem.childNodes[1].innerHTML = "on";
                    console.log('on')
                }
            }
        },
        markup: {
            overlay: function() {
                let div = doc.createElement("div"),
                    img = doc.createElement("img");
                div.id = "dk_overlay_img_layer";
                div.style.display = "none";
                img.id = "dk_overlay_img";
                img.src = "";
                img.alt = "";
                img.draggable = true;
                div.appendChild(img);
                html.appendChild(div);
            },
            control: function() {
                let div = doc.createElement("div"),
                    tit = doc.createElement("span");
                div.id = "dk_overlay_controller_toolbar";
                tit.className = "tit";
                tit.innerText = extension_name;

                let sw = doc.createElement("button"),
                    sw_icon = doc.createElement("i");
                    //sw_txt = doc.createElement("span");
                sw.id = "dk_overlay_btn";
                sw.className = "sw";
                sw.disabled = true;
                sw_icon.className = "off";
                sw.appendChild(sw_icon);
                //sw_txt.innerText = "off";
                //sw.appendChild(sw_txt);
                div.appendChild(sw);
                div.appendChild(tit);

                let file = doc.createElement("input");
                file.id = "dk_overlay_files";
                file.setAttribute("type", "file");
                div.appendChild(file);

                let sub = doc.createElement("div");
                sub.className = "tools";

                let s_icon = doc.createElement("i"),
                    scale = doc.createElement("input"),
                    s_txt = doc.createElement("span");
                s_icon.className = "mag";
                s_icon.title = "ratio";
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

                let o_icon = doc.createElement("i"),
                    opacity = doc.createElement("input"),
                    o_txt = doc.createElement("span");
                o_icon.className = "opacity";
                o_icon.title = "opacity";
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

                elemOffsetX = getCssProperty(elem, "left");
                elemOffsetY = getCssProperty(elem, "top");
                return false;
            },
            move: function(e, elem) {
                var moveX = e.clientX,
                    moveY = e.clientY,
                    resultX = moveX - clickX,
                    resultY = moveY - clickY;
                //console.log("clickX :"+ clickX + "," + "clickY :" + clickY);
                //console.log("moveX :"+ moveX + "," + "moveY :" + moveY);

                if (!(beforeX == resultX && beforeY == resultY) && !(moveX == 0 && moveY == 0)) {
                    //console.log("resultX :"+ resultX + "," + "resultY :" + resultY);
                    //console.log("elemOffsetX :"+ elemOffsetX + "," + "elemOffsetY :" + elemOffsetY);

                    var left = (resultX + elemOffsetX),
                        top = (resultY + elemOffsetY);

                    elem.style.left = left + "px";
                    elem.style.top = top + "px";

                    beforeX = resultX;
                    beforeY = resultY;
                    // console.log("left :"+ left + "," + "top :" + top);
                }
                return false;
            },
            key: function(e, elem) {
                elemOffsetX = getCssProperty(elem, "left");
                elemOffsetY = getCssProperty(elem, "top");

                switch (e.keyCode) {
                    //left
                    case 37:
                        if (!e.shiftKey) {
                            console.log("left");
                            elem.style.left = (elemOffsetX - 1) + "px";
                        } else if (e.shiftKey) {
                            console.log("shift + left");
                            elem.style.left = (elemOffsetX - 10) + "px";
                        }
                        e.preventDefault();
                        break;
                        //up
                    case 38:
                        if (!e.shiftKey) {
                            console.log("up");
                            elem.style.top = (elemOffsetY - 1) + "px";
                        } else if (e.shiftKey) {
                            console.log("shift + up");
                            elem.style.top = (elemOffsetY - 10) + "px";
                        }
                        e.preventDefault();
                        break;
                        //right
                    case 39:
                        if (!e.shiftKey) {
                            console.log("right");
                            elem.style.left = (elemOffsetX + 1) + "px";
                        } else if (e.shiftKey) {
                            console.log("shift + right");
                            elem.style.left = (elemOffsetX + 10) + "px";
                        }
                        e.preventDefault();
                        break;
                        //down
                    case 40:
                        if (!e.shiftKey) {
                            console.log("down");
                            elem.style.top = (elemOffsetY + 1) + "px";
                        } else if (e.shiftKey) {
                            console.log("shift + down");
                            elem.style.top = (elemOffsetY + 10) + "px";
                        }
                        e.preventDefault();
                        break;
                }
            },
            init: function() {
                function Drag(elem) {
                    Drag.prototype.init(elem);
                    Drag.prototype.initEvent();
                }

                Drag.prototype.init = function(elem) {
                    this.elem = doc.getElementById(elem);
                };

                Drag.prototype.initEvent = function() {
                    let that = this;

                    this.elem.addEventListener("mousedown", function(e) {
                        ollin.drag.click(e, that.elem);
                        return false;
                    }, false);

                    this.elem.addEventListener("drag", function(e) {
                        ollin.drag.move(e, that.elem);
                        return false;
                    }, false);

                    body.addEventListener("keydown", function(e) {
                        ollin.drag.key(e, that.elem);
                    });
                };
                return Drag;
            }
        },
        init: function() {
            ollin.markup.overlay();
            ollin.markup.control();

            ollin.drag.init()("dk_overlay_img_layer");

            doc.getElementById("dk_overlay_btn").addEventListener("click", ollin.handle.layer);
            doc.getElementById("dk_overlay_opacity").addEventListener("change", ollin.handle.opacity);
            doc.getElementById("dk_overlay_scale").addEventListener("change", ollin.handle.scale);
            doc.getElementById("dk_overlay_files").addEventListener("change", ollin.handle.file);
        }
    }
    ollin.init();
})();
