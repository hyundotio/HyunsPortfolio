//Clean up constants
const transitionStr = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
//Clean up constants

//Operational Functions
const disableScroll = function() {
    document.ontouchmove = function(e) {
        e.preventDefault();
    }
}

const enableScroll = function() {
    document.ontouchmove = function(e) {
        return true;
    }
}
//Operational Functions
const workUnbinder = function() {
    $('.work-video').unbind('click');
    $('.back-to-top').unbind('click');
    $('.gallery-image').unbind('click');
    $('.exit-gallery').unbind('click');
    $('.gallery-caption-button').unbind('click');
    $(window).unbind('scroll');
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
        disableScroll();
        const $this = $(this);
        const bgStr = 'url("' + $this.attr('src') + '")';
        const $gallery = $('.gallery');
        if($this.hasClass('light-img')){
          $gallery.addClass('light');
        } else {
          $gallery.removeClass('light');
        }
        $('body').addClass('gallery-fullscreen');
        $('.gallery-bg-img').css('background-image', bgStr);
        $('.gallery-caption-content').text($this.attr('data-caption'));
        $gallery.addClass('active');
        setTimeout(function() {
            $gallery.addClass('grace');
        }, 30)
    });

    $('.exit-gallery').bind('click', function(e) {
        e.preventDefault();
        enableScroll();
        const $gallery = $('.gallery');
        if ($gallery.hasClass('grace')) {
            $('body').removeClass('gallery-fullscreen');
            $gallery.removeClass('grace');
            setTimeout(function() {
                $gallery.removeClass('active caption-enabled');
            }, 520)
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
          const thisTopPos = $this.offset().top + 48;
          const scrollPos = $(window).scrollTop() + $(window).height();
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

//Work Handlers
const closeWork = function() {
    const $workPageContainer = $('.work-page-container');
    const $mainSplash = $('.main-splash');
    if (!$workPageContainer.hasClass('grace-kill') && $workPageContainer.attr('data-work') !== undefined) {
        //console.log('closing work');
        $('.work-scroller').removeClass('active');
        $('.mobile-menu').removeClass('active');
        $('.menu-filter').removeClass('active');
        $('.main-nav-list').removeClass('mobile-active');
        workUnbinder();
        $('body').removeClass('work-mode');
        $workPageContainer.removeAttr('data-work').addClass('grace-kill');
        $mainSplash.addClass('grace-kill');
        setTimeout(function() {
            $workPageContainer.find('.work-content-container').empty();
            $('.work-splash').removeClass('active ready grace-kill');
            $workPageContainer.removeClass('active grace-kill');
            $mainSplash.removeClass('grace-kill');
        }, 520);
    }
}

const reset = function(override) {
    const $menuPages = $('.menu-pages');
    const $mainNav = $('.main-nav');
    const $activeFinishedMenuPage = $menuPages.find('.active-finished');
    if ($menuPages.find('.active').length > 0) {
        if ($activeFinishedMenuPage.length !== 0 && ($activeFinishedMenuPage.hasClass('active-finished'))) {
            $('.mobile-menu').removeClass('active');
            $('.main-nav-list').removeClass('mobile-active');
            $mainNav.find('.active').removeClass('active');
            enableScroll();
            $('body').removeClass('fullscreen');
            $mainNav.removeClass('shadow');
            $activeFinishedMenuPage.addClass('grace-kill').removeClass('active-finished');
            pageHandler($activeFinishedMenuPage);
            setTimeout(function() {
                $activeFinishedMenuPage.removeClass('active grace-kill');
            }, 1020);
            //console.log('killing');
        }
    }
    if (override && ($('.grace-active').length === 0)){
        closeWork();
    }
}

const loadWork = function($targetEl) {
    const $body = $('body');
    const $mainNav = $('.main-nav');
    const $workSplash = $('.work-splash');
    const $workPageContainer = $('.work-page-container');
    const $loaderBar = $('.loader-bar');
    const $loaderPercentageNumber = $('.loader-percentage-number');
    const $menuWorkPage = $('.menu-work-page');
    if (!$menuWorkPage.hasClass('grace-kill')) {
        if ($targetEl.attr('data-work') === $('.work-page-container').attr('data-work')) {
            const $menuPages = $('.menu-pages');
            if ($menuPages.find('.active').length > 0) {
                if ($menuPages.find('.active-finished').length !== 0 && ($menuPages.find('.active-finished').hasClass('active-finished'))) {
                    $mainNav.find('.active').removeClass('active');
                    enableScroll();
                    $body.removeClass('fullscreen');
                    $menuPages.find('.active-finished').addClass('grace-kill').removeClass('active-finished');
                    setTimeout(function() {
                        $mainNav.removeClass('shadow');
                        $menuPages.find('.active').removeClass('active grace-kill');
                    }, 1020);
                    //console.log('killing');
                }
            }
        } else {
            $workPageContainer.find('.work-content-container').empty();
            $loaderBar.css('width', '0');
            $loaderPercentageNumber.text('0');
            $('.work-scroller').removeClass('active');
            enableScroll();
            $body.removeClass('fullscreen').addClass('loading-work');
            const htmlUrl = './projects/' + $targetEl.attr('data-work') + '/html.html';
            const imgUrl = './projects/' + $targetEl.attr('data-work') + '/bg.jpg';
            $workPageContainer.removeClass('active');
            $workSplash.removeClass('ready').addClass('active');
            $('.work-splash-title').find('span').text($targetEl.attr('data-title'));
            $menuWorkPage.addClass('grace-kill');
            $mainNav.find('.active').removeClass('active');
            const loadBar = function(total, progress) {
                //console.log(total);
                //console.log(progress);
                const percentage = Math.ceil((progress / total) * 100);
                $loaderBar.css('width', (String(percentage) + '%'));
                $loaderPercentageNumber.text(String(percentage));
                if (!isNaN(percentage) && total === progress) {
                    $workPageContainer.addClass('active').attr('data-work', $targetEl.attr('data-work'));
                    $('.work-splash-bg').css('background-image', 'url("' + imgUrl + '")');
                    $workSplash.addClass('ready');
                    setTimeout(function() {
                        $mainNav.removeClass('shadow');
                        $body.removeClass('loading-work').addClass('work-mode');
                        $loaderBar.css('width', '0');
                        $loaderPercentageNumber.text('0');
                    }, 520);
                }
            }
            setTimeout(function() {
                $menuWorkPage.removeClass('grace-kill active active-finished');
                let loaderCount = 0;
                workUnbinder();
                $('.work-content-container').load(htmlUrl, function() {
                    workBinder();
                    //console.log('loaded');
                    const $this = $(this);
                    const assetCount = $this.find('img').length + 1;
                    //console.log(assetCount);
                    $this.find('img').each(function() {
                        const img = new Image();
                        $(img).on('load', function() {
                            //console.log('img loaded');
                            loaderCount += 1;
                            loadBar(assetCount, loaderCount);
                        }).attr('src', $(this).attr('src'));
                    })
                    const bgImg = new Image();
                    $(bgImg).on('load', function() {
                        loaderCount += 1;
                        loadBar(assetCount, loaderCount);
                    }).attr('src', imgUrl)
                })
            }, 1200);
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
    if(window.event) { // IE
        keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera
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

//Load work
$('.work-page-link').bind('click', function(e) {
    e.preventDefault();
    loadWork($(this));
})
//Load work

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
$('.menu-page-link').bind('click', function(e) {
    e.preventDefault();
    const $menuPages = $('.menu-pages');
    const $mainNav = $('.main-nav');
    const $body = $('body');
    const $this = $(this);
    const nextPage = $this.attr('data-page');
    $('.menu-filter').removeClass('active');
    $('.mobile-menu').removeClass('active');
    $('.main-nav-list').removeClass('mobile-active');
    const $page = $('.' + nextPage);
    if ($menuPages.find('.active').length > 0) {
        if ($menuPages.find('.active-finished').length !== 0 && ($page.hasClass('active-finished'))) {
            $mainNav.find('.active').removeClass('active');
            enableScroll();
            $body.removeClass('fullscreen');
            $mainNav.removeClass('shadow');
            $page.addClass('grace-kill').removeClass('active-finished');
            pageHandler($page);
            setTimeout(function() {
                $page.removeClass('active grace-kill');
            }, 1020);
            //console.log('killing');
        }
        if ($menuPages.find('.active-finished').length !== 0 && (!$page.hasClass('active-finished')) && $menuPages.find('.grace-transition').length === 0) {
            //console.log('transitioning');
            $mainNav.find('.active').removeClass('active');
            $this.addClass('active');
            const $prevPage = $menuPages.find('.active-finished');
            $prevPage.addClass('grace-transition');
            pageHandler($prevPage);
            setTimeout(function() {
                $prevPage.removeClass('active active-finished grace-transition');
                $page.addClass('active');
                pageHandler($page);
                setTimeout(function() {
                    $page.addClass('grace-active');
                    setTimeout(function() {
                        $page.removeClass('grace-active').addClass('active-finished');
                    }, 1020);
                }, 50);
            }, 520);
        }
    } else {
        if ($menuPages.find('.active-finished').length === 0) {
            disableScroll();
            $body.addClass('fullscreen');
            $mainNav.addClass('shadow');
            $this.addClass('active');
            //console.log('opening');
            $page.addClass('active');
            setTimeout(function(){
              pageHandler($page);
              $page.addClass('grace-active');
              setTimeout(function() {
                  $page.removeClass('grace-active').addClass('active-finished');
              }, 1020);
            },50);

        }
    }
})
//Homepage menu handler

//Mobile view work
$('.mobile-view-work').bind('click',function(e){
  e.preventDefault();
  $('.menu-page-link').each(function(){
    const $this = $(this);
    if($this.attr('data-page') === 'menu-work-page'){
      $this.click();
    }
  })
})
//Mobile view work

//Homepage
$('.reset').bind('click', function(e) {
    e.preventDefault();
    reset();
})
$('.reset-home').bind('click', function(e) {
    e.preventDefault();
    reset(true);
})
//Homepage

//Mobile menu handlers
$('.menu-filter').bind('click', function() {
    $('.mobile-menu').removeClass('active');
    $('.main-nav-list').removeClass('mobile-active');
    $('.menu-filter').removeClass('active');
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
            $('body').removeAttr('style');
            setTimeout(function() {
                firstLoad();
            }, 520);
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