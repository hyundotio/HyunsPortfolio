
const hashHandler = function(hashArray){
  const $body = $('body');
  if(hashArray.length === 0) {
    if(window.location.hash === ''){
        window.location.hash = '#!';
    } else {
        reset(true);
    }
  } else {
    let invalidUrl = true;
    for (let i = 0; i < hashArray.length; i++){
      if(hashArray[i] === 'work' || hashArray[i] === 'page'){
        if(hashArray[i] === 'work'){
          if(hashArray[i+1] !== undefined) {
              invalidUrl = false;
              loadWork(hashArray,([i+1]));
          }
        }
        if(hashArray[i] === 'page'){
          if(hashArray[i+1] !== undefined){
              invalidUrl = false;
              loadPage(hashArray,(i+1));
          }
        }
      }
    }
    if(invalidUrl){
        window.location.hash = '#!';
    }
  }
}

const hashCreator = function(firstTime){
  let locHash = location.hash.split('/');
  let cleanedHash = [];
  for (let i = 0; i < locHash.length; i++){
    if(locHash[i] !== '' && locHash[i] !== '#!'){
      cleanedHash.push(locHash[i]);
    }
  }
  hashHandler(cleanedHash);
}

$('a').each(function(){
  $(this).bind('click',function(e){
    if($('.grace-kill').length > 0 ||  $('.grace-active').length > 0 || $('.grace-transition').length > 0){
        e.preventDefault();
    }
  })
})

window.addEventListener('hashchange',function(e){
    if($('.grace-kill').length > 0 ||  $('.grace-active').length > 0 || $('.grace-transition').length > 0){
      e.preventDefault();
    } else {
      hashCreator();
    }
},false);
hashCreator(true);
