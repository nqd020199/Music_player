const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Music player'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playToggle = $('.btn-toggle-play');
const player = $('.app')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList =  $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Muốn em là',
            singer: 'KimNaNa',
            path: './assets/music/song02.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Hẹn ước hư vô',
            singer: 'KimNaNa',
            path: './assets/music/song01.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'KimNaNa',
            path: './assets/music/song03.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Chạy về khóc với anh',
            singer: 'KimNaNa',
            path: './assets/music/song04.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Ánh năng của anh',
            singer: 'KimNaNa',
            path: './assets/music/song05.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Nơi này có anh',
            singer: 'KimNaNa',
            path: './assets/music/song06.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Cơn mưa ngang qua',
            singer: 'KimNaNa',
            path: './assets/music/song07.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Thanh xuân',
            singer: 'KimNaNa',
            path: './assets/music/song08.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Lỡ duyên',
            singer: 'KimNaNa',
            path: './assets/music/song09.mp3',
            image: './assets/images/na_small.jpg'
        },
        {
            name: 'Summertime',
            singer: 'KimNaNa',
            path: './assets/music/song10.mp3',
            image: './assets/images/na_small.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb">
                    <img src="${song.image}" alt="avatar">
                </div>
                <div class="content">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Sự kiện CD run around
        cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xu li CD
        document.onscroll = function() {
            const scrollTop = window.scrollX || document.documentElement.scrollTop            
            const newCdWidth = cdWidth - scrollTop

            cd.style.height = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xu li play music
        playToggle.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //Bắt sự kiện audio play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Bắt sự kiện audio pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //Bắt sự kiện cập nhật thời gian bài hát
        audio.ontimeupdate = function () {
            if (audio.duration) {
              const progressPercent = Math.floor(
                (audio.currentTime / audio.duration) * 100
              );
              progress.value = progressPercent;
            }
          };
        //Bắt sự kiện tua bài hát
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        //Bắt sự kiện next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong();
        }

        //Bắt sự kiện next bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong();
        }

        // Bắt sự kiện random bài hát
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',  _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Bắt sự kiện audio onended 
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // Bắt sự kiện repeat song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',  _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Bắt sự kiện click song
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')

            if (songNode || optionNode){
                //Xử lí khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render()
                    audio.play()
                }

                //Xử lí khi click vào option
                if (optionNode) {

                }

            }
        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });

        }, 500)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    start: function() {
        //Gán cấu hình từ config vào app
        this.loadConfig()
        //định nghĩa các thuộc tính
        this.defineProperties()

        // xử lí các sự kiện
        this.handleEvent()

        //Load bài hát lên UI
        this.loadCurrentSong()

        this.render()
   
        randomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)

    }
}
app.start()
