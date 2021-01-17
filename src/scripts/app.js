var app = function(){
  function init(){
    menuDropdown()
  }

  function menuDropdown(){
    function findContainer(el){
      while(true){
        el = el.parentNode;
        if(el == null){
          console.warn('toggleDrop(): could not find container', e.target)
          return
        }
        if(typeof el.dataset == 'undefined'){
          console.log("no dataset");
          continue;
        }
        if(typeof el.dataset.hassub == 'undefined'){
          console.log("no hasSub");
          continue
        }
        if(el.dataset.hassub == 'true'){
          break;
        }
      }
      return el;
    }
    function findLableAndUL(el){
      var ul, lable;
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if(child.tagName == 'UL'){
          ul = child;
        }else if(child.classList.contains('menuLable')){
          lable = child
        }
      }
      return {ul, lable}
    }
    function drop(e){
      var el = findContainer(e.target);
      
      el.classList.add('open');

      els = findLableAndUL(el);
      if(els.ul.clientWidth < els.lable.clientWidth){
        els.ul.style.minWidth = els.lable.clientWidth + "px";
      }else if(els.ul.clientWidth != els.lable.clientWidth){
        els.lable.style.minWidth = els.ul.clientWidth-10 + "px";
      }
    }
    function hide(e){
      var el = findContainer(e.target);
      
      el.classList.remove('open');

      els = findLableAndUL(el);
      if(els.lable.style.minWidth != ''){
        els.lable.style.minWidth = '';
      }
    }
    function toggle(e){
      var el = findContainer(e.target);
      
      el.classList.toggle('open');

      els = findLableAndUL(el);
      if(el.classList.contains('open')){
        if(els.ul.clientWidth < els.lable.clientWidth){
          els.ul.style.minWidth = els.lable.clientWidth + "px";
        }else if(els.ul.clientWidth != els.lable.clientWidth){
          els.lable.style.minWidth = els.ul.clientWidth-10 + "px";
        }
      }else if(els.lable.style.minWidth != ''){
        els.lable.style.minWidth = '';
      }
    }


    var dropBtns = document.getElementById('menu').getElementsByClassName('sub');
    for (let i = 0; i < dropBtns.length; i++) {
      const btn = dropBtns[i];
      btn.addEventListener("mouseover", drop);
      btn.addEventListener("mouseout", hide);
    }
    dropBtns = document.getElementById('menu').getElementsByClassName('submenu');
    for (let i = 0; i < dropBtns.length; i++) {
      const btn = dropBtns[i];
      btn.addEventListener("mouseover", drop);
      btn.addEventListener("mouseout", hide);
    }
  }

  init();
}

window.addEventListener('load', app);