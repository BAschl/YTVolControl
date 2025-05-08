
var script = document.createElement('script');
script.type = 'text/javascript';
script.id = 'volume_script';
script.textContent = `
    
var anotherFSPlayerSomehow; var ytPlayerApi;
var volumeAnnotation;
var scrollTop;
var disableScrollEventListener = (evt) => {
    headerBackgroundObserver.observe(document.getElementById('background'), { attributes: true });
    if (!anotherFSPlayerSomehow.style.top != '') {
        scrollTop = document.documentElement.scrollTop;
        anotherFSPlayerSomehow.style.top = (-scrollTop) + 'px';
    }
    document.body.classList.add("stop-scrolling");
};

var enableScrollEventListener = (evt) => {
    headerBackgroundObserver.disconnect();
    anotherFSPlayerSomehow.style.top = '';
    document.body.classList.remove("stop-scrolling");
    scrollTo(0, scrollTop);
};

var headerBackgroundObserver = new MutationObserver((mutations) => {
    mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
            if (mutation.attributeName == 'style') {
                if (mutation.target.style.opacity == 0) {
                    mutation.target.style.opacity = 1;
                }
            }
        }
    });
});

var fullScreenChangeListener = () => {
    anotherFSPlayerSomehow.style.top = '';
    scrollTo(0, 0);
}
var currentVolumeAnnotationFadeoutIndex = 0;


//volume control
var volumeScrollEventListener = (evt) => {
    vol = ytPlayerApi.getVolume();
    vol -= Math.sign(evt.deltaY) * (evt.shiftKey ? 1 : 5);
    vol = Math.min(100, Math.max(0, vol));
    ytPlayerApi.setVolume(vol);
    volumeAnnotation.textContent = vol + '%';
    volumeAnnotation.style.transition = 'opacity 0s'
    volumeAnnotation.style.opacity = 1;
    var index = ++currentVolumeAnnotationFadeoutIndex;
    setTimeout(() => {
        if (index == currentVolumeAnnotationFadeoutIndex) {
            volumeAnnotation.style.transition = 'opacity 0.5s'
            volumeAnnotation.style.opacity = 0;
        }
    }, 400);
}

//disable scrolling fullscreen player
var fullScreenScrollObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
            if (mutation.attributeName == 'scrolling')
                anotherFSPlayerSomehow.removeAttribute('scrolling');
        }
    });
});


console.log('yt scroll volume init done');
function setListeners() {



    //youtubes own player class which can be used to control the player
    ytPlayerApi = document.getElementById('movie_player');

    //the html elements for volume control (and disabling scrolling for the small player)
    var fullscreenplayer = document.getElementById('full-bleed-container');
    var smolplayer = document.getElementById('player');

    //full screen player html element for disabling scrolling
    anotherFSPlayerSomehow = document.getElementsByTagName('ytd-app')[0];

    if (ytPlayerApi && fullscreenplayer && smolplayer && anotherFSPlayerSomehow) {


        if (document.getElementsByClassName('innerVolControlDisplay').length == 0) {
            var volumeOuterAnnotation = document.createElement('div');
            volumeOuterAnnotation.classList.add('outerVolControlDisplay');
            
            volumeAnnotation = document.createElement('div');
            volumeAnnotation.classList.add('innerVolControlDisplay');
            volumeOuterAnnotation.appendChild(volumeAnnotation);

            ytPlayerApi.appendChild(volumeOuterAnnotation);
            
        }


        document.removeEventListener("fullscreenchange", fullScreenChangeListener);
        document.addEventListener("fullscreenchange", fullScreenChangeListener, false);

        ytPlayerApi.onmouseenter = disableScrollEventListener;
        ytPlayerApi.onmouseleave = enableScrollEventListener;
        ytPlayerApi.onwheel = volumeScrollEventListener;

        if (fullScreenScrollObserver) fullScreenScrollObserver.disconnect();
        fullScreenScrollObserver.observe(anotherFSPlayerSomehow, { attributes: true });

    }

    setTimeout(setListeners, 1000);
}

setListeners();

`;
document.body.append(script);
