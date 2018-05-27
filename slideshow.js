/*
*       This is a fork of Mark Lees "A Better Simple Slideshow"
*       https://codepen.io/leemark/pen/mwoHj
*
*       I added some Timing Functions, a Progress Bar and a random Shuffle Mode;
 */

var makeBSS = function (el, options) {
    var $slideshows = document.querySelectorAll(el), // a collection of all of the slideshow
        $slideshow = {},
        Slideshow = {
            init: function (el, options) {
                this.el = el; // current slideshow container
                this.timerStatus = el.querySelectorAll('.bss-timer');
                this.progressBar = el.querySelector('.bss-timer--status');
                this.$items = el.querySelectorAll('figure'); // a collection of all of the slides, caching for performance
                this.$timeButtons = el.querySelectorAll('.bss-time'); // a collection of all of the slides, caching for performance
                this.numItems = this.$items.length; // total number of slides
                this.width = 0;
                this.count = 0;
                this.counter = 0;

                options = options || {}; // if options object not passed in, then set to empty object
                options.auto = options.auto || false; // if options.auto object not passed in, then set to false
                this.opts = {
                    auto: (typeof options.auto === "undefined") ? false : options.auto,
                    speed: (typeof options.auto.speed === "undefined") ? 1500 : options.auto.speed,
                    pauseOnHover: (typeof options.auto.pauseOnHover === "undefined") ? false : options.auto.pauseOnHover,
                    orderMode: (typeof options.auto.orderMode === "undefined") ? 'random' : options.auto.orderMode,
                    fullScreen: (typeof options.fullScreen === "undefined") ? false : options.fullScreen,
                    swipe: (typeof options.swipe === "undefined") ? false : options.swipe
                };

                this.$items[0].classList.add('bss-show'); // add show class to first figure
                this.timerStatus[0].classList.add('is--playing');

                //this.injectControls(el);
                this.addEventListeners(el);
                if (this.opts.auto) {
                    this.autoCycle(this.el, this.opts.speed, this.opts.pauseOnHover);
                }
                if (this.opts.fullScreen) {
                    this.addFullScreen(this.el);
                }
                if (this.opts.swipe) {
                    this.addSwipe(this.el);
                }


            },
            showCurrent: function (i) {

                if (this.opts.orderMode == 'linear') {
                    // increment or decrement this.counter depending on whether i === 1 or i === -1

                    if (i > 0) {
                        this.counter = (this.counter + 1 === this.numItems) ? 0 : this.counter + 1;
                    } else {
                        this.counter = (this.counter - 1 < 0) ? this.numItems - 1 : this.counter - 1;
                    }

                } else if (this.opts.orderMode == 'random') {
                    /* Randomize Next Image */
                    currentCounter = this.counter;
                    this.counter = Math.floor(Math.random()*this.numItems);

                    if (this.counter == currentCounter) {
                        this.counter = Math.floor(Math.random()*this.numItems);
                    }
                }


                this.timerStatus[0].classList.remove('is--playing');

                // remove .show from whichever element currently has it
                // http://stackoverflow.com/a/16053538/2006057
                [].forEach.call(this.$items, function (el) {
                    el.classList.remove('bss-show');
                });

                this.progressBar.style.transition = 'none';
                this.progressBar.style.width = 0;

                // add .show to the one item that's supposed to have it
                this.$items[this.counter].classList.add('bss-show');

                void this.timerStatus[0].offsetWidth;
                this.timerStatus[0].classList.add('is--playing');
            },
            setBSSInterval: function() {
                var that = this,
                    count = 0,
                    width = 0;

                interval = window.setInterval(function () {

                    if ( that.count != 0) {
                        count = that.count;
                     }
                    if (that.width != 0) {
                        width = that.width;
                    }
                    if (that.width == 0 && that.count == 0) {
                        width = 0;
                        count = 0;
                    }
                    count += 1;
                    width += 100 / (opts.auto.speed / 100) ;
                    that.progressBar.style.transition = 'width 100ms linear';
                    that.progressBar.style.width = width + "%";
                    if (count > opts.auto.speed/100 ) {
                        width = 0;
                        count = 0;
                        that.showCurrent(1); // increment & show
                        that.progressBar.style.transition = 'none';
                        that.progressBar.style.width = width + "%";
                    }
                    that.width = width;
                    that.count = count;
                }, 100);
            },

            addEventListeners: function (el) {
                var that = this;
                el.querySelector('.bss-next').addEventListener('click', function () {
                    that.count = 0;
                    that.width = 0;

                    that.showCurrent(1); // increment & show
                }, false);

                /*
                el.querySelector('.bss-prev').addEventListener('click', function () {
                    that.showCurrent(-1); // decrement & show
                }, false);
                */
                el.onkeydown = function (e) {
                    e = e || window.event;
                    if (e.keyCode === 37) {
                        that.showCurrent(-1); // decrement & show
                    } else if (e.keyCode === 39) {
                        that.showCurrent(1); // increment & show
                    }
                };
            },
            autoCycle: function (el, speed, pauseOnHover) {
                var that = this;

                    that.setBSSInterval();

                    document.querySelector('.bss-play-pause').addEventListener('click', function () {

                    if (el.classList.contains('is--paused')) {
                        el.classList.remove('is--paused');
                        that.setBSSInterval();
                    } else {
                        el.classList.add('is--paused');
                        interval = clearInterval(interval);
                    }
                }, false);


                /* setup all time buttons with data durations (1000ms * x Seconds) */
                [].forEach.call(this.$timeButtons, function (el) {


                    el.addEventListener('click',function() {
                        opts.auto.speed = el.dataset.duration;
                        interval = clearInterval(interval);

                        for (var i = 0; i < that.$timeButtons.length; i++) {
                            that.$timeButtons[i].classList.remove('is--active')
                        }

                        el.classList.add('is--active');
                        that.setBSSInterval();
                    },false)

                });

                if (pauseOnHover) {
                    el.addEventListener('mouseover', function () {
                        interval = clearInterval(interval);
                    }, false);

                    el.addEventListener('mouseout', function () {
                        that.setBSSInterval();
                    }, false);
                } // end pauseonhover

            },
            addFullScreen: function (el) {
                var that = this;


                el.querySelector('.bss-fullscreen').addEventListener('click', function () {
                    that.toggleFullScreen(el);
                }, false);
            },
            addSwipe: function (el) {
                var that = this,
                    ht = new Hammer(el);
                ht.on('swiperight', function (e) {
                    that.showCurrent(-1); // decrement & show
                });
                ht.on('swipeleft', function (e) {
                    that.showCurrent(1); // increment & show
                });
            },
            toggleFullScreen: function (el) {
                // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
                if (!document.fullscreenElement &&    // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement &&
                    !document.msFullscreenElement) {  // current working methods
                    if (document.documentElement.requestFullscreen) {
                        el.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        el.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        el.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            } // end toggleFullScreen

        }; // end Slideshow object

    // make instances of Slideshow as needed
    [].forEach.call($slideshows, function (el) {
        $slideshow = Object.create(Slideshow);
        $slideshow.init(el, options);
    });
};
var opts = {
    auto: {
        speed: 10000,
        pauseOnHover: false
    },
    orderMode: 'random',
    fullScreen: true,
    swipe: true
};
makeBSS('.demo1', opts);
