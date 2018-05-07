/*
*       This is a fork of Mark Lees "A Better Simple Slideshow"
*       https://codepen.io/leemark/pen/mwoHj
 */

var makeBSS = function (el, options) {
    var $slideshows = document.querySelectorAll(el), // a collection of all of the slideshow
        startInterval = Date.now(),
        currentInterval = 0,
        $slideshow = {},
        Slideshow = {
            init: function (el, options) {
                this.counter = 0; // to keep track of current slide
                this.el = el; // current slideshow container
                this.timerStatus = el.querySelectorAll('.bss-timer');
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
                document.querySelector('.bss-timer--status').style.webkitAnimationDuration = "30s";
                document.querySelector('.bss-timer--status').style.mozAnimationDuration = "30s";
                document.querySelector('.bss-timer--status').style.msAnimationDuration = "30s";
                document.querySelector('.bss-timer--status').style.animationDuration = "30s";

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

               // console.log(this.numItems + ', ' + this.counter )

                this.timerStatus[0].classList.remove('is--playing');

                // remove .show from whichever element currently has it
                // http://stackoverflow.com/a/16053538/2006057
                [].forEach.call(this.$items, function (el) {
                    el.classList.remove('bss-show');
                });
                this.currentInterval = 0;


                // add .show to the one item that's supposed to have it
                this.$items[this.counter].classList.add('bss-show');


                void this.timerStatus[0].offsetWidth;
                this.timerStatus[0].classList.add('is--playing');


                startInterval = Date.now();


            },
            setAnimationDuration: function (el,duration) {
                document.querySelector(el).style.webkitAnimationDuration = duration;
                document.querySelector(el).style.mozAnimationDuration = duration;
                document.querySelector(el).style.msAnimationDuration = duration;
                document.querySelector(el).style.animationDuration = duration;
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
                    }, opts.auto.speed);


                    document.querySelector('.bss-play-pause').addEventListener('click', function () {
                    if (document.querySelector('.bss-slides').classList.contains('is--paused')) {
                        console.log("Who");
                        document.querySelector('.bss-slides').classList.remove('is--paused');
                        interval = window.setInterval(function () {
                            that.showCurrent(1); // increment & show
                        }, speed);
                    } else {
                        document.querySelector('.bss-slides').classList.add('is--paused');
                        console.log("What");
                        interval = clearInterval(interval);
                    }
                }, false);



                el.querySelector('.bss-10min').addEventListener('click', function () {
                    opts.auto.speed = 1000 * 60 * 10;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','600s');
                    /*
                    document.querySelector('.bss-timer--status').style.webkitAnimationDuration = "600s";
                    document.querySelector('.bss-timer--status').style.mozAnimationDuration = "600s";
                    document.querySelector('.bss-timer--status').style.msAnimationDuration = "600s";
                    document.querySelector('.bss-timer--status').style.animationDuration = "600s";
                    */
                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-5min').addEventListener('click',function () {
                    opts.auto.speed = 1000 * 60 * 5;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','300s');
                    /*
                    document.querySelector('.bss-timer--status').style.webkitAnimationDuration = "300s";
                    document.querySelector('.bss-timer--status').style.mozAnimationDuration = "300s";
                    document.querySelector('.bss-timer--status').style.msAnimationDuration = "300s";
                    document.querySelector('.bss-timer--status').style.animationDuration = "300s";
*/
                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-2min').addEventListener('click',function () {
                    opts.auto.speed = 1000 * 60 * 2;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','120s');
                    /*
                    document.querySelector('.bss-timer--status').style.webkitAnimationDuration = "120s";
                    document.querySelector('.bss-timer--status').style.mozAnimationDuration = "120s";
                    document.querySelector('.bss-timer--status').style.msAnimationDuration = "120s";
                    document.querySelector('.bss-timer--status').style.animationDuration = "120s";
*/
                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-1min').addEventListener('click',function () {
                    opts.auto.speed = 1000 * 60;
                    console.log('speed: ' + opts.auto.speed);
                    that.setAnimationDuration('.bss-timer--status','60s');
                    /*
                    document.querySelector('.bss-timer--status').style.webkitAnimationDuration = "60s";
                    document.querySelector('.bss-timer--status').style.mozAnimationDuration = "60s";
                    document.querySelector('.bss-timer--status').style.msAnimationDuration = "60s";
                    document.querySelector('.bss-timer--status').style.animationDuration = "60s";
*/
                    interval = clearInterval(interval);
                    window.setInterval(function () {
                        that.showCurrent(1); // increment & show
                    }, opts.auto.speed);
                }, false);
                el.querySelector('.bss-30sec').addEventListener('click',function () {

                    opts.auto.speed = 1000 * 30;
                    console.log('speed: ' + opts.auto.speed);

                    that.setAnimationDuration('.bss-timer--status','30s');
                    /*
                    document.querySelector('.bss-timer--status').style.webkitAnimationDuration = "30s";
                    document.querySelector('.bss-timer--status').style.mozAnimationDuration = "30s";
                    document.querySelector('.bss-timer--status').style.msAnimationDuration = "30s";
                    document.querySelector('.bss-timer--status').style.animationDuration = "30s";
*/
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
        speed: 30000,
        pauseOnHover: false
    },
    fullScreen: true,
    swipe: true
};
makeBSS('.demo1', opts);