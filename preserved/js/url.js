
const hashHandler = function(hashArray){
    if(hashArray[0] === 'work'){
      //work
      if(hashArray[1] !== undefined){
          loadWork(hashArray);
      } else {
          window.location.hash = '#!'
      }
    } else if (hashArray[0] === 'page'){
      if(hashArray[1] !== undefined){
          loadPage(hashArray);
      } else {
          window.location.hash = '#!'
      }
      //about
    } else if (hashArray.length === 0){
      //go home
        reset(true);
    } else {
        window.location.hash = '#!'
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
