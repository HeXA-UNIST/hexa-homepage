function shadow(int){
  return "0px "+int/5+"px "+int/3+"px #555"; //shadow equation. accurate to the material design standards (approximately)
}

function update(){
  var list = document.getElementsByClassName("card"); //loop through all HTML elements with the class card. 
  //var list = document.getElementsByTagName("card"); 
  //uncomment line above if you want to use <card> instead of <div class='card'>
  var len = list.length;
  for(i=0;i<len;i++){
    list[i].style.display="inline-block";
    if(!list[i].hasAttribute("no-transition"))
    	list[i].style.transition=".15s box-shadow";
    if(!list[i].hasAttribute("no-material-border"))
    	list[i].style.borderBottom="1px solid #AAA";
    if(!list[i].hasAttribute("no-padding"))
      list[i].style.padding="0px";
    doDepth(list[i]); //looping through all of the elements
  }
}

function setDepth(int,obj,type){
  if(int==null)
    return
  obj.style.boxShadow = shadow(int); //using shadow equation to set css style
  if(type==="hover")
  	obj.setAttribute("z",obj.getAttribute("z-hover")); //for when click and hover interfere with eachother
}

function doDepth(i){
  function ga(x) {return i.getAttribute(x);} //easier to call method alias
  
  //getting attributes
  var zh = ga("z-default") || null;
  var zhc = ga("z-click") || null;
  var zhh = ga("z-hover") || null;
  setDepth(zh,i);
  //events of release (mouse leave, mouse up, etc)
  i.onmouseup   = function(){ setDepth(ga("z"),i)};
  i.onmouseout  = function(){ setDepth(zh,i)};
  
  //events of activate (mouse enter, mouse down, etc)
  i.onmousedown = function(){ setDepth(zhc,i)};
  i.onmouseover = function(){setDepth(zhh,i,"hover")};
}

update(); //initial update
