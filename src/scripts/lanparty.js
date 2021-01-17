var lanparty = function(){
  function init(){
    addTargetBlank()
  }

  function addTargetBlank(){
    var links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      var url = link.getAttribute('href');
      url = url.split('/')
      if(url[1] == '' && url[0][url[0].length-1] == ':'){
        link.setAttribute('target', '_black');
      }

      var content = link.innerText.split(' ');
      switch(content[0]){
        case 'download':
          switch(content[1]){
            case '(steam)':
              link.setAttribute('target', '_black');
              break;
            case undefined:
            case 'win':
            case 'mac':
            case 'linux':
              link.setAttribute('download', '');
              break;
          }
          break;
        case 'homepage':
          link.setAttribute('target', '_black');
      }
    }
  }

  init();
}

window.addEventListener('load', lanparty);