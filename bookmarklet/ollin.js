/* 키티가 시킨건 아닌데 시작한 프로젝트 */
/* 2017.01.20 ~ 22*/

(function() {
    //  "use strict";

    var doc = document,
        html = doc.getElementsByTagName("html")[0],
        body = doc.getElementsByTagName("BODY")[0];

    var getCssProperty = function(elmId, property) {
        var elem = elmId ? elmId : doc.getElementById(elmId);
        var prop = window.getComputedStyle(elem, null).getPropertyValue(property);
        return parseInt(prop);
    };

    function addEvent(el, type, handler) {
        if (el.attachEvent) el.attachEvent('on' + type, handler);
        else el.addEventListener(type, handler);
    }

    function removeEvent(el, type, handler) {
        if (el.detachEvent) el.detachEvent('on' + type, handler);
        else el.removeEventListener(type, handler);
    }

    if (typeof console === "undefined" || typeof console.log === "undefined") {
        var console = window.console || {log:function(){}};
    }

    var clickX = 0,
        clickY = 0,
        beforeX = 0,
        beforeY = 0,
        elemOffsetX = 0,
        elemOffsetY = 0;

    var doclang = doc.documentElement.lang;
    var extension_name = "Images overlap with Kitty";
    if (doclang === "ko" || doclang === "ko-KR") {
        extension_name = "이미지는 키티가 겹쳐줄거야";
    };


    var ollin = {
        handle: {
            file: function(e) {
                var canvas = doc.getElementById("dk_overlay_img");
                var layer = doc.getElementById("dk_overlay_img_layer");
                if (e.target.files && e.target.files[0]) {
                    var fr = new FileReader();
                    fr.onload = function(e) {
                        var img = new Image();
                        canvas.src = fr.result;

                        img.onload = function() {
                            var iwidth = img.naturalWidth || img.width;
                            var iheight = img.naturalHeight || img.height;

                            canvas.width = iwidth;
                            canvas.height = iheight;
                            layer.style.width = iwidth;
                            layer.style.height = iheight;
                            layer.style.left = 0;
                            layer.style.top = "30px";
                        }
                        img.src = fr.result;
                    };
                    fr.readAsDataURL(e.target.files[0]);
                }

                var btn_elem = doc.getElementById("dk_overlay_btn");
                if (btn_elem.disabled == true) {
                    doc.getElementById("dk_overlay_img_layer").style.display = "block";
                    btn_elem.childNodes[1].innerHTML = "on";
                    btn_elem.childNodes[0].className = "on";
                    btn_elem.disabled = false;
                    doc.getElementById("dk_overlay_scale").disabled = false;
                    doc.getElementById("dk_overlay_opacity").disabled = false;
                }
            },
            opacity: function(e) {
                doc.getElementById("dk_overlay_img_layer").style.opacity = this.value;
                doc.getElementById("dk_overlay_opacity_text").innerText = this.value;
            },
            scale: function(e) {
                doc.getElementById("dk_overlay_img_layer").style.transform = "scale(" + this.value + ", " + this.value + ")";
                doc.getElementById("dk_overlay_scale_text").innerText = "x" + this.value;
            },
            layer: function(e) {
                var overlay_elem = doc.getElementById("dk_overlay_img_layer");
                var btn_elem = doc.getElementById("dk_overlay_btn");
                if (overlay_elem.style.display == "block") {
                    overlay_elem.style.display = "none";
                    btn_elem.childNodes[0].className = "off";
                    btn_elem.childNodes[1].innerHTML = "off";
                } else {
                    overlay_elem.style.display = "block";
                    btn_elem.childNodes[1].innerHTML = "on";
                    btn_elem.childNodes[0].className = "on";
                }
            }
        },
        markup: {
            css: function() {
                var link = document.createElement("link");
                link.href = "https://rawgit.com/bearholmes/ollin/master/bookmarklet/ollin.css";
                link.type = "text/css";
                link.rel = "stylesheet";
                link.media = "all";
                doc.getElementsByTagName("head")[0].appendChild(link);
            },
            overlay: function() {
                var div = doc.createElement("div"),
                    img = doc.createElement("img");
                div.id = "dk_overlay_img_layer";
                div.style.display = "none";
                img.id = "dk_overlay_img";
                img.src = "";
                img.alt = "";
                div.draggable = "true";
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

                var o_icon = doc.createElement("i"),
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
            move: function(event) {
                event.preventDefault();
                // Set variable to true on mousedown

                var click = event || window.event;
                if (click.which == 1) {
                    moving = true;
                }
                var target = event.target;
                // Positions cursor in center of element when being dragged, as oposed to the top left
                var width = target.offsetWidth / 2;
                var height = target.offsetHeight / 2;
                // Element follows mouse cursor
                addEvent(target, 'mousemove', function(e) {
                    // Only run if variable is true (this is destroyed on mouseup)
                    if (moving === true) {
                        var layer = document.getElementById("dk_overlay_img_layer");
                        // Postion element, minus half width/height as above
                        var x = e.clientX - width;
                        var y = e.clientY - height;
                        // Set style
                        layer.style.left = x + "px";
                        layer.style.top = y + "px";
                        layer.style.cursor = "move";
                    };
                });
            },
            end: function(event) {
                // Destroy drag on mouse up
                moving = false;
                event.target.removeEventListener('mousemove', false);
                var layer = document.getElementById("dk_overlay_img_layer");
                layer.style.cursor = "pointer";
            },
            key: function(e, elem) {
                //drag key event - code by 멀린
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
            }
        },
        init: function() {
            ollin.markup.css();
            ollin.markup.overlay();
            ollin.markup.control();

            var moving = false;

            var layer = doc.getElementById("dk_overlay_img_layer");
            addEvent(body, "keydown", function(e) {
                ollin.drag.key(e, layer);
            });

            addEvent(doc.getElementById("dk_overlay_img_layer"), "mousedown", ollin.drag.move);
            addEvent(doc.getElementById("dk_overlay_img_layer"), "mouseup", ollin.drag.end);
            doc.getElementById("dk_overlay_img").ondragstart = function() {
                return false;
            };

            addEvent(doc.getElementById("dk_overlay_btn"), "click", ollin.handle.layer);
            addEvent(doc.getElementById("dk_overlay_opacity"), "change", ollin.handle.opacity);
            addEvent(doc.getElementById("dk_overlay_scale"), "change", ollin.handle.scale);
            addEvent(doc.getElementById("dk_overlay_files"), "change", ollin.handle.file);
        }
    }
    ollin.init();
})();
