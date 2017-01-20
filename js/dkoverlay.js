/*jshint browser: true */
/*global chrome */
/*
키티가 시킨건 아닌데 프로젝트
*/


(function(){
    var doc = document,
      html = doc.getElementsByTagName("html")[0];
    var $ = function(){
      return doc.getElementById(arguments[0]);
    };

	

	function handleFiles(e) {
		var canvas  = $("merlinimg");
		//var context = canvas.getContext("2d");

		
    	if ( e.target.files && e.target.files[0] ) {
        var FR= new FileReader();
	        FR.onload = function(e) {
	           var img = new Image();
	           //img.onload = function() {
	           //  context.drawImage(img, 0, 0);
	           //};
	           img.src = e.target.result;
	           canvas.src = e.target.result;
	           canvas.width = img.width;      // set canvas size big enough for the image
			   canvas.height = img.height;
	        };       
        FR.readAsDataURL( e.target.files[0] );

    }
	}

    var overlayDiv = doc.createElement("div");
    overlayDiv.innerHTML = '<div id="overlay_merlin"><img id="merlinimg" src=""></canvas>';
    html.appendChild(overlayDiv);

    var overlayControler = doc.createElement("div");
    overlayControler.innerHTML = '<div id="dk_overlay_controller_toolbar"><input type="file" id="dk_overlay_files"></div>'
	doc.getElementsByTagName("BODY")[0].style.setProperty("transform", "translateY(30px)", "important");

	html.appendChild(overlayControler);
	
$("dk_overlay_files").addEventListener('change', handleFiles);

  function DragImg(){

	  var clickX = 0,
	  clickY = 0,
	  beforeX = 0,
	  beforeY = 0,
	  elemOffsetX = 0,
	  elemOffsetY = 0;

	  var getCssProperty = function (elmId, property){
	  var elem = elmId? elmId : document.getElementById(elmId);
	  var pro = window.getComputedStyle(elem,null).getPropertyValue(property);
	  return parseInt(pro);
	  };


	  var clickDrag = function(e , elem){
		  clickX = e.clientX;
		  clickY = e.clientY;

		  elemOffsetX = getCssProperty(elem,'left'),
		  elemOffsetY = getCssProperty(elem,'top');
		  return false;
	  };

	  var moveDrag = function(e , elem){

	  var moveX = e.clientX,
	  moveY = e.clientY,
	  resultX = moveX - clickX,
	  resultY = moveY - clickY;

	  console.log('clickX :'+ clickX + ',' + 'clickY :' + clickY);
	  console.log('moveX :'+ moveX + ',' + 'moveY :' + moveY);


	  if( !(beforeX == resultX && beforeY == resultY) && !(moveX == 0 && moveY ==0) ){
	  console.log('resultX :'+ resultX + ',' + 'resultY :' + resultY);
	  console.log('elemOffsetX :'+ elemOffsetX + ',' + 'elemOffsetY :' + elemOffsetY);

	  var left = (resultX + elemOffsetX),
	  top = (resultY + elemOffsetY);

	  elem.style.left = left+'px';
	  elem.style.top = top+'px';

	  beforeX = resultX;
	  beforeY = resultY;

	  // console.log('left :'+ left + ',' + 'top :' + top);
	  }
	  return false;
	  };

	  var keyMove = function(e , elem){
	  //console.log('left');
	  elemOffsetX = getCssProperty(elem,'left'),
	  elemOffsetY = getCssProperty(elem,'top');

	  switch(e.keyCode){
	  //left
	  case 37:
	  console.log('left');

	  if(!e.shiftKey) elem.style.left = (elemOffsetX - 1)+'px';
	  else if(e.shiftKey) elem.style.left = (elemOffsetX - 10)+'px';

	  e.preventDefault();
	  break;
	  //up
	  case 38:
	  console.log('up');

	  if(!e.shiftKey) elem.style.top = (elemOffsetY - 1)+'px';
	  else if(e.shiftKey) elem.style.top = (elemOffsetY - 10)+'px';
	  e.preventDefault();
	  break;
	  //right
	  case 39:
	  console.log('right');

	  if(!e.shiftKey) elem.style.left = (elemOffsetX + 1)+'px';
	  else if(e.shiftKey) elem.style.left = (elemOffsetX + 10)+'px';
	  e.preventDefault();
	  break;
	  //down
	  case 40:
	  console.log('down');

	  if(!e.shiftKey) elem.style.top = (elemOffsetY + 1)+'px';
	  else if(e.shiftKey) elem.style.top = (elemOffsetY + 10)+'px';
	  e.preventDefault();
	  break;
	  }

  };
  //////////////////////

  function Drag(elem){
	  this.elem = null;

	  Drag.prototype.init(elem);
	  Drag.prototype.initEvent();
	  }

	  Drag.prototype.moveDrag = moveDrag;
	  Drag.prototype.clickDrag = clickDrag;
	  Drag.prototype.keyMove = keyMove;

	  Drag.prototype.init = function(elem){
	  	this.elem = document.getElementById(elem);

	  };

	  Drag.prototype.initEvent = function(){

	  var that = this;

	  this.elem.addEventListener("mousedown", function(e){
	  that.clickDrag(e , that.elem);
	  return false;
	  }, false);


	  this.elem.addEventListener("drag", function(e){
	  that.moveDrag(e , that.elem);
	  return false;
	  }, false);

	  document.body.addEventListener('keydown', function(e) {
	  that.keyMove(e , that.elem);
	  });

	  };
	  Drag.prototype.calcOffset = function(){};

	  /////////////////
	  //var drag = new Drag('overlay_merlin');

	  return Drag;
  }


  var dragimg1 = new (DragImg())('overlay_merlin');
 })();
