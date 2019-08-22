//Operational Functions
const enableBodyScroll = function() {
    document.ontouchmove = function(e) {
        return true;
    }
}

const disableBodyScroll = function() {
    document.ontouchmove = function(e) {
        e.preventDefault();
    }
}

$.fn.isInViewport = function() {
  const $this = $(this);
  const $window = $(window);
  const elementTop = $this.offset().top;
  const elementBottom = elementTop + $this.outerHeight();
  const viewportTop = $window.scrollTop();
  const viewportBottom = viewportTop + $window.height();
  return elementBottom > viewportTop && elementTop < viewportBottom;
};

//Operational Functions
const workUnbinder = function() {
    $('.work-video').unbind('click');
    $('.back-to-top').unbind('click');
    $('.gallery-image').unbind('click');
    $('.exit-gallery').unbind('click');
    $('.gallery-caption-button').unbind('click');
    $(window).unbind('scroll');
}

const getScrollPos = function($el){
    const scrollPos = $el.offset().top - $(document).scrollTop();
    return scrollPos;
}

const workBinder = function() {
    //Work video
    $('.work-video').bind('click', function() {
        $('html,body').animate({
            scrollTop: $(this).offset().top
        }, 500);
    })
    //Work video

    //Work back to top
    $('.back-to-top').bind('click', function(e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 1000);
    })
    //Work back to top
    //Fullscreen gallery handlers
    $('.gallery-image').bind('click', function(e) {
        e.preventDefault();
        disableBodyScroll();
        const $body = $('body');
        const $this = $(this);
        const bgStr = 'url("' + $this.attr('src') + '")';
        const $gallery = $('.gallery');
        const $visibleElement = findVisibleWorkElement();
        if($visibleElement){
          $body.attr('data-scrollpos',getScrollPos($visibleElement)).addClass('scroll-lock');
          $visibleElement.addClass('scroll-reference');
        }
        $this.addClass('active-gallery-img');
        if($this.hasClass('light-img')){
          $gallery.addClass('light');
        } else {
          $gallery.removeClass('light');
        }
        $('.gallery-bg-img').css('background-image', bgStr);
        $('.gallery-caption-content').text($this.attr('alt'));
        $gallery.addClass('active');
        setTimeout(function() {
            $gallery.addClass('grace');
            setTimeout(function(){
              enableBodyScroll();
              $body.addClass('scroll-fixed-lock gallery-fullscreen');
            }, 520);
        }, 30)
    });

    $('.exit-gallery').bind('click', function(e) {
        e.preventDefault();
        const $body = $('body');
        if($body.hasClass('gallery-fullscreen')){
          $body.removeClass('scroll-fixed-lock scroll-lock gallery-fullscreen');
          const $gallery = $('.gallery');
          const $activeGalleryImg = $('.active-gallery-img');

          const $scrollReference = $('.scroll-reference');
          let scrollPos;
          if($scrollReference.length > 0){
            scrollPos = $scrollReference.offset().top - parseFloat($body.attr('data-scrollpos'));
            //console.log(scrollPos);
            $scrollReference.removeClass('scroll-reference');
            $body.removeAttr('data-scrollpos');
          }
          if ($gallery.hasClass('grace')) {
              if(scrollPos){
                $(document).scrollTop(scrollPos);
              }
              $gallery.removeClass('grace');
              setTimeout(function() {
                  $activeGalleryImg.removeClass('active-gallery-img');
                  $gallery.removeClass('active caption-enabled');
              }, 520)
          }
        }
    });

    $('.gallery-caption-close').bind('click', function(e) {
        e.preventDefault();
        $('.gallery').removeClass('caption-enabled');
    })

    $('.gallery-caption-button').bind('click', function(e) {
        e.preventDefault();
        const $gallery = $('.gallery');
        if ($gallery.hasClass('caption-enabled')) {
            $gallery.removeClass('caption-enabled');
        } else {
            $gallery.addClass('caption-enabled');
        }
    })
    //Fullscreen gallery handlers

    //scroll workBinder
    const unhideElements = function(){
      if($('body').hasClass('work-mode')){
        $('.scroll-hidden').each( function(e){
          const $this = $(this);
          const $window = $(window);
          const thisTopPos = $this.offset().top + 48;
          const scrollPos = $window.scrollTop() + $window.height();
             if(scrollPos > thisTopPos){
                $this.removeClass('scroll-hidden');
             }
         });
      }
    }
    $(window).bind('scroll',function(){
        unhideElements();
        scrollToggler();
    })
    //scroll binder
}

//Hash Location Syncer
const hashSync = function(openingLoc) {
    if(openingLoc !== window.location.hash){
      hashCreator();
    }
}
//Hash Location Syncer

//Work Handlers
const closeWork = function() {
    const $workPageContainer = $('.work-page-container');
    const $mainSplash = $('.main-splash');
    if (!$workPageContainer.hasClass('grace-kill') && $workPageContainer.attr('data-work') !== undefined) {
        //console.log('closing work');
        navHandler('home-page');
        const openingLoc = window.location.hash;
        $('.work-scroller').removeClass('active');
        mobileMenuKiller();
        workUnbinder();
        $('body').removeClass('work-mode loading-work');
        $workPageContainer.removeAttr('data-work').addClass('grace-kill');
        $mainSplash.addClass('grace-kill');
        setTimeout(function() {
            $workPageContainer.find('.work-content-container').empty();
            $('.work-splash').removeClass('active ready grace-kill');
            $workPageContainer.removeClass('active grace-kill active-finished');
            $mainSplash.removeClass('grace-kill');
            hashSync(openingLoc);
        }, 520);
    }
}

const reset = function(override) {
    if(!$('body').hasClass('init')) {
      //console.log('resetting');
      const $menuPages = $('.menu-pages');
      const $activeFinishedMenuPage = $menuPages.find('.active-finished');
      if ($menuPages.find('.active').length > 0) {
          if ($activeFinishedMenuPage.length !== 0 && ($activeFinishedMenuPage.hasClass('active-finished'))) {
              mobileMenuKiller();
              pageKiller($activeFinishedMenuPage);
              navHandler('home-page');
          }
      }
      if (override && ($('.grace-active').length === 0)){
          closeWork();
      }
    }
}

const loadWork = function(hashLoc) {
    const $body = $('body');
    const $workSplash = $('.work-splash');
    const $workPageContainer = $('.work-page-container');
    const $loaderBar = $('.loader-bar');
    const $loaderPercentageNumber = $('.loader-percentage-number');
    const $menuWorkPage = $('.menu-pages').find('.active');
    if (!$menuWorkPage.hasClass('grace-kill')) {
        if (hashLoc[1] === $('.work-page-container').attr('data-work')) {
            const $menuPages = $('.menu-pages');
            if ($menuPages.find('.active').length > 0) {
                if ($menuPages.find('.active-finished').length !== 0 && ($menuPages.find('.active-finished').hasClass('active-finished'))) {
                    //console.log('opening work from page');
                    const openingLoc = window.location.hash;
                    const $scrollReference = $('.scroll-reference');
                    navHandler(null);
                    $body.removeClass('fullscreen scroll-lock scroll-fixed-lock');
                    if($scrollReference.length > 0){
                      $(document).scrollTop($scrollReference.offset().top - parseFloat($body.attr('data-scrollpos')));
                      $scrollReference.removeClass('scroll-reference');
                      $body.removeAttr('data-scrollpos');
                    }
                    $menuPages.find('.active-finished').addClass('grace-kill').removeClass('active-finished');
                    setTimeout(function() {
                        $menuPages.find('.active').removeClass('active grace-kill');
                        hashSync(openingLoc);
                    }, 520);
                }
            }
        } else {
            //console.log('opening work');
            $workPageContainer.find('.work-content-container').empty();
            $loaderBar.css('width', '0');
            $loaderPercentageNumber.text('0');
            $('.work-scroller').removeClass('active');
            $body.removeClass('fullscreen gallery-fullscreen').addClass('loading-work');
            $('.gallery').removeClass('active grace');
            const htmlUrl = './projects/' + hashLoc[1] + '/html.html';
            const imgUrl = './projects/' + hashLoc[1] + '/bg.jpg';
            $workPageContainer.removeClass('active');
            $workSplash.removeClass('ready').addClass('active');
            let workTitle = '';
            $('.work-list').find('a').each(function(){
              const $this = $(this);
              if($this.attr('data-work') == hashLoc[1]){
                workTitle = $this.attr('data-title');
              }
            })
            $('.work-splash-title').find('span').text(workTitle);
            $menuWorkPage.addClass('grace-kill');
            const loadBar = function(total, progress) {
                const openingLoc = window.location.hash;
                const percentage = Math.ceil((progress / total) * 100);
                $loaderBar.css('width', (String(percentage) + '%'));
                $loaderPercentageNumber.text(String(percentage));
                if (!isNaN(percentage) && total === progress) {
                    $('.reset-toggler').attr('href',('#!/'+hashLoc.join('/')));
                    $workPageContainer.addClass('active').attr('data-work', hashLoc[1]);
                    $('.work-splash-bg').css('background-image', 'url("' + imgUrl + '")');
                    $workSplash.addClass('ready');
                    setTimeout(function() {
                        navHandler(null);
                        $workPageContainer.addClass('active-finished');
                        $body.removeClass('loading-work scroll-lock scroll-fixed-lock').addClass('work-mode').removeAttr('data-scrollpos');
                        $loaderBar.css('width', '0');
                        $loaderPercentageNumber.text('0');
                        hashSync(openingLoc);
                    }, 520);
                }
            }
            setTimeout(function() {
                $menuWorkPage.removeClass('grace-kill active active-finished');
                let loaderCount = 0;
                workUnbinder();
                $('.work-content-container').load(htmlUrl, function(response, status, xhr) {
                    if(status == 'error'){
                      $body.removeClass('loading-work');
                      $workSplash.removeClass('active');
                      window.location.hash ='#!'
                    } else {
                      workBinder();
                      const $this = $(this);
                      const assetCount = $this.find('img').length + 1;
                      $this.find('img').each(function() {
                          const img = new Image();
                          $(img).on('load', function() {
                              loaderCount += 1;
                              loadBar(assetCount, loaderCount);
                          }).attr('src', $(this).attr('src'));
                      })
                      const bgImg = new Image();
                      $(bgImg).on('load', function() {
                          loaderCount += 1;
                          loadBar(assetCount, loaderCount);
                      }).attr('src', imgUrl)
                    }
                })
            }, 520);
        }
    }
}
//Work Handlers

//Easter Egg
const bgaudio = new Audio();
$(document).on("keypress", function (e) {
    e.preventDefault();
    const $body = $('body');
    let keynum;
    if(window.event) {
        keynum = e.keyCode;
    } else if(e.which){
        keynum = e.which;
    }
    if(String.fromCharCode(keynum) == 'p' || String.fromCharCode(keynum) == 'P'){
        if ($('.active').length === 0) {
            if ($body.hasClass('peace')) {
                $body.removeClass('peace').removeAttr('style');
                bgaudio.pause();
                bgaudio.currentTime = 0;
            } else {
                $body.addClass('peace');
                bgaudio.loop = true;
                bgaudio.src = './assets/bg.mp3';
                const promise = bgaudio.play();
                if (promise !== undefined) {
                    promise.then(_ => {}).catch(error => {});
                }
            }
        }
    }
});
//Easter Egg

//Back to Top//
const scrollToggler = function(){
  const $body = $('body');
  if($body.hasClass('work-mode')){
    const $workScroller = $('.work-scroller');
    const bScroll = Math.ceil($(window).scrollTop());
    const bHeight = Math.ceil($body.height());
    if (bScroll > 100 && bScroll < (bHeight-100))  {
        $workScroller.addClass('active');
    } else {
        $workScroller.removeClass('active');
    }
  }
}
//Back to Top//

//Nav handlers
const navHandler = function(navData){
  const $mainNav = $('.main-nav');
  const $mainNavList = $('.main-nav-list');
  $mainNavList.find('.active').removeClass('active');
  if(navData !== null){
    $mainNavList.find('a').each(function(){
      const $this = $(this);
      const pageClass = $this.attr('data-pageClass');
      if(pageClass == navData){
        if(pageClass == 'home-page'){
          $mainNav.removeClass('shadow');
        } else {
          $this.addClass('active');
          $mainNav.addClass('shadow');
        }
      }
    })
  } else {
    $mainNav.removeClass('shadow');
  }
}
//Nav handlers

//page handler
const pageHandler = function($el){
  if($el.hasClass('menu-about')){
    if($el.hasClass('active')){
      TiltAnimation.init();
    }
    if($el.hasClass('grace-kill') || $el.hasClass('grace-transition')){
      TiltAnimation.kill();
    }
  }
}
//page handler
//Homepage menu handler

const pageKiller = function($page){
  const openingLoc = window.location.hash;
  const $body = $('body');
  const $scrollReference = $('.scroll-reference');
  $body.removeClass('fullscreen loading-work scroll-lock scroll-fixed-lock');
  if($scrollReference.length > 0){
      const scrollPos = $scrollReference.offset().top - parseFloat($body.attr('data-scrollpos'));
      $scrollReference.removeClass('scroll-reference');
      $body.removeAttr('data-scrollpos');
      $(document).scrollTop(scrollPos);
  }
  $page.addClass('grace-kill').removeClass('active-finished');
  pageHandler($page);
  setTimeout(function() {
      $page.removeClass('active grace-kill');
      hashSync(openingLoc);
  }, 520);
}
const loadPage = function(hashLoc){
  const $menuPages = $('.menu-pages');
  const $body = $('body');
  mobileMenuKiller();
  const $page = $('.' + hashLoc[1]);
  const openingLoc = window.location.hash;
  if($page.length > 0){
    if ($menuPages.find('.active').length > 0) {
        if ($menuPages.find('.active-finished').length !== 0 && ($page.hasClass('active-finished'))) {
          //console.log('kill page');
          pageKiller($page);
        }
        if ($menuPages.find('.active-finished').length !== 0 && (!$page.hasClass('active-finished')) && $menuPages.find('.grace-transition').length === 0) {
          //console.log('transition');
          const $prevPage = $menuPages.find('.active-finished');
          $prevPage.addClass('grace-transition');
          navHandler(hashLoc[1]);
          pageHandler($prevPage);
          setTimeout(function() {
              $prevPage.removeClass('active active-finished grace-transition');
              $page.addClass('active');
              pageHandler($page);
              setTimeout(function() {
                  $page.addClass('grace-active');
                  setTimeout(function() {
                      $page.removeClass('grace-active').addClass('active-finished');
                      hashSync(openingLoc);
                  }, 520);
              }, 50);
          }, 520);
        }
    } else {
        if ($menuPages.find('.active-finished').length === 0) {
            //console.log('open page');
            disableBodyScroll();
            const $visibleElement = findVisibleWorkElement();
            if($visibleElement){
              $body.attr('data-scrollpos',getScrollPos($visibleElement));
              $visibleElement.addClass('scroll-reference');
            }
            $body.addClass('fullscreen scroll-lock').removeClass('gallery-fullscreen');
            $('.gallery').removeClass('active grace');
            navHandler(hashLoc[1]);
            $page.addClass('active');
            setTimeout(function(){
              pageHandler($page);
              $page.addClass('grace-active');
              setTimeout(function() {
                  enableBodyScroll();
                  $body.addClass('scroll-fixed-lock');
                  $page.removeClass('grace-active').addClass('active-finished');
                  hashSync(openingLoc);
              }, 520);
            },50);
        }
    }
  } else {
    window.location.hash ='#!'
  }
}

const findVisibleWorkElement = function(){
    let $result;
    if($('.work-page-container').hasClass('active-finished')){
        const $workContentContainer = $('.work-content-container');
        $workContentContainer.children().each(function(){
            const $this = $(this);
            if($this.isInViewport()){
                $result = $this;
            }
        });
        if(!$result){
            $result = $workContentContainer;
        }
    }
    //console.log($result);
    return $result;
}

const mobileMenuKiller = function(){
  $('.mobile-menu').removeClass('active');
  $('.main-nav-list').removeClass('mobile-active');
  $('.menu-filter').removeClass('active');
}

//Mobile menu handlers
$('.menu-filter').bind('click', function() {
    mobileMenuKiller();
})

$('.mobile-menu').bind('click', function() {
    const $mainNavList = $('.main-nav-list');
    const $menuFilter = $('.menu-filter');
    const $this = $(this);
    if ($this.hasClass('active')) {
        $this.removeClass('active');
        $mainNavList.removeClass('mobile-active');
        $menuFilter.removeClass('active');
    } else {
        $this.addClass('active');
        $mainNavList.addClass('mobile-active');
        $menuFilter.addClass('active');
    }
})
//Mobile menu handlers

//Init
const firstLoad = function() {
    $('body').removeAttr('style').removeClass('init');
    setTimeout(function() {
        $('.homepage-content').removeClass('op-hidden');
    }, 1);
    setTimeout(function() {
        $('.sunset-footer-container').removeClass('op-hidden');
        $('.td-bg').removeClass('op-hidden');
    }, 200);
    setTimeout(function() {
        $('.homepage-footer').removeClass('op-hidden');
        $('.main-nav').removeClass('op-hidden');
    }, 500);
}

const initLoadGraceCheck = function() {
    const $img = $('img');
    const imgs = $img.length;
    let loadProgress = 0;
    const checkLoad = function() {
        if (loadProgress === imgs) {
            firstLoad();
        }
    }
    $img.each(function() {
        const tempImg = new Image();
        $(tempImg).on('load', function() {
            loadProgress += 1;
            checkLoad();
        })
        tempImg.src = $(this).attr('src');
    })
}

$(window).on('load', function() {
    initLoadGraceCheck();
})
//Init
