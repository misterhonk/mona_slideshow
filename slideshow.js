/*
*       This is a fork of Mark Lees "A Better Simple Slideshow"
*       https://codepen.io/leemark/pen/mwoHj
 */

var makeBSS = function (el, options) {
    var $slideshows = document.querySelectorAll(el), // a collection of all of the slideshow

        currentInterval = 0,
        $slideshow = {},
        Slideshow = {
            init: function (el, options) {


                this.counter = 0; // to keep track of current slide
                this.el = el; // current slideshow container
                this.timerStatus = el.querySelectorAll('.bss-timer');
                this.startInterval = Date.now(),
                this.$items = el.querySelectorAll('figure'); // a collection of all of the slides, caching for performance
                this.numItems = this.$items.length; // total number of slides


                options = options || {}; // if options object not passed in, then set to empty object
                options.auto = options.auto || false; // if options.auto object not passed in, then set to false
                this.opts = {
                    auto: (typeof options.auto === "undefined") ? false : options.auto,
                    speed: (typeof options.auto.speed === "undefined") ? 1500 : options.auto.speed,
                    pauseOnHover: (typeof options.auto.pauseOnHover === "undefined") ? false : options.auto.pauseOnHover,
                    fullScreen: (typeof options.fullScreen === "undefined") ? false : options.fullScreen,
                    swipe: (typeof options.swipe === "undefined") ? false : options.swipe
                };

                this.$items[0].classList.add('bss-show'); // add show class to first figure
                this.timerStatus[0].classList.add('is--playing');
                this.setAnimationDuration('.bss-timer--status','3s');

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
                startInterval = Date.now();

                console.log("scc: " + startInterval + ",ccc: " + currentInterval);

                var frames = window.setInterval(function() {
                    currentInterval = Date.now();

                        width =  (currentInterval - startInterval) / opts.auto.speed;

                        document.querySelector('.bss-timer--status').style.width = width * 100 + "%";

                },10);
                // increment or decrement this.counter depending on whether i === 1 or i === -1
                /*
                if (i > 0) {
                    this.counter = (this.counter + 1 === this.numItems) ? 0 : this.counter + 1;
                } else {
                    this.counter = (this.counter - 1 < 0) ? this.numItems - 1 : this.counter - 1;
                }
                */

                /* Randomize Next Image */
                currentCounter = this.counter;
                this.counter = Math.floor(Math.random()*this.numItems);

                if (this.counter == currentCounter) {
                    this.counter = Math.floor(Math.random()*this.numItems);
                }

                this.timerStatus[0].classList.remove('is--playing');

                // remove .show from whichever element currently has it
                // http://stackoverflow.com/a/16053538/2006057
                [].forEach.call(this.$items, function (el) {
                    el.classList.remove('bss-show');
                });

                // add .show to the one item that's supposed to have it
                this.$items[this.counter].classList.add('bss-show');

                void this.timerStatus[0].offsetWidth;
                this.timerStatus[0].classList.add('is--playing');

                speed = opts.auto.speed;
            },
            setAnimationDuration: function (el,duration) {
/*
                document.querySelector(el).style.webkitAnimationDuration = duration;
                document.querySelector(el).style.mozAnimationDuration = duration;
                document.querySelector(el).style.msAnimationDuration = duration;
                document.querySelector(el).style.animationDuration = duration;
*/
            },
            addEventListeners: function (el) {
                var that = this;
                el.querySelector('.bss-next').addEventListener('click', function () {
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
                var that = this,
                    interval = window.setInterval(function () {
                        that.showCurrent(1); // increment & show

                        window.clearInterval(frame);
                        console.log("frames cleared" + frame);
                           }, opts.auto.speed);


                    document.querySelector('.bss-play-pause').addEventListener('click', function () {
                    if (document.querySelector('.bss-slides').classList.contains('is--paused')) {
                        document.querySelector('.bss-slides').classList.remove('is--paused');
                        console.log("speed: " + speed);
                        interval = window.setInterval(function () {
                            that.showCurrent(1); // increment & show
                        }, speed);
                        startInterval = Date.now();
                        setSpeed = false;
                    } else {
                        currentInterval = Date.now() - startInterval;
                        console.log("cc: " + currentInterval + "/" + opts.auto.speed);
                        document.querySelector('.bss-slides').classList.add('is--paused');
                        interval = clearInterval(interval);

                    }
                }, false);



                el.querySelector('.bss-10min').addEventListener('click', function () {
                    opts.auto.speed = 1000 * 6 * 10;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','60s');

                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-5min').addEventListener('click',function () {
                    opts.auto.speed = 1000 * 6 * 5;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','30s');

                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-2min').addEventListener('click',function () {
                    opts.auto.speed = 1000 * 6 * 2;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','12s');

                  interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-1min').addEventListener('click',function () {
                    opts.auto.speed = 1000 * 6;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','6s');

                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-30sec').addEventListener('click',function () {

                    opts.auto.speed = 1000 * 3;
                    console.log('speed: ' + opts.auto.speed);

                    that.setAnimationDuration('.bss-timer--status','3s');

                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);


                if (pauseOnHover) {
                    el.addEventListener('mouseover', function () {

                        interval = clearInterval(interval);

                    }, false);
                    el.addEventListener('mouseout', function () {
                        interval = window.setInterval(function () {
                            that.showCurrent(1); // increment & show
                        }, speed);
                    }, false);
                } // end pauseonhover

            },
            addFullScreen: function (el) {
                var that = this,
                    fsControl = document.createElement("span");

                fsControl.classList.add('bss-fullscreen');
                document.querySelector('.bss-controls').appendChild(fsControl);
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
        speed: 3000,
        pauseOnHover: false
    },
    fullScreen: true,
    swipe: true
};
makeBSS('.demo1', opts);