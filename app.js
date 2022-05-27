

const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);

const nameSong = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playSong = $(".btn-toggle-play");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const PLAYER_STOGARE_KEY = "music"

const app = {
  songs: [
    {
      name: "Biet Tim Dau",
      singer: "Tuan Hung",
      path: "bietTimDau.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Anh van o day",
      singer: "Tuan Hung",
      path: "anhvanoday.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "holo.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/c/7/3/a/c73a217d51ad14a25e52af9b472ee484.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "home.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "spark.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "summer.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Hao Khi Viet Nam",
      singer: "Tuan Hung",
      path: "haokhivn.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Chi Khi Nam Nhi",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "chikhinamnhi.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/c/7/3/a/c73a217d51ad14a25e52af9b472ee484.jpg"
    },
    {
      name: "Hac Giay",
      singer: "Raftaar x Brobha V",
      path: "hacgiay.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Nu Cuoi 18 20",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "nucuoi1820.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Chanh Long Thuong Co",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "chanhlongthuongco.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
  ],
  currentIndex: 0,
  isPlay: false,
  isUpdateTime: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STOGARE_KEY)) || {},
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STOGARE_KEY, JSON.stringify(this.config));
  },
  render() {
    const template = this.songs.map((song, index) => {
      return `
      <div class="song ${this.currentIndex === index ? "active" : " "}" data-index=${index}>
        <div class="thumb" style="background-image: url(${song.image})">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>
  `;
    });
    $(".playlist").innerHTML = template.join("");
  },
  handleEvent() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([{ transform: `rotate(360deg)` }],
      {
        duration: 10000,
        iterations: Infinity
      })

    if (!_this.isPlay) {
      cdThumbAnimate.pause();
    }

    document.addEventListener("scroll", debounce(function () {
      const scrollScreen = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = Math.floor(cdWidth - scrollScreen) > 0 ? Math.floor(cdWidth - scrollScreen) : 0;
      const opacityCd = newCdWidth / cdWidth;

      cd.style.width = `${newCdWidth}px`;
      cd.style.opacity = opacityCd;
    }, 10))

    playSong.onclick = function () {
      if (!_this.isPlay) {
        audio.play();
      }
      else {
        audio.pause();
      }
    }

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active");
      randomBtn.classList.toggle("active", _this.isRandom);
      _this.setConfig("isRepeat", _this.isRepeat);
    }

    audio.onplay = () => {
      $(".player").classList.add("playing");
      _this.isPlay = true;
      cdThumbAnimate.play();
    }

    audio.onpause = () => {
      $(".player").classList.remove("playing");
      _this.isPlay = false;
      cdThumbAnimate.pause();
    }
    progress.onchange = function () {
      const progressPecent = progress.value;
      const durationTimeAudio = audio.duration;

      if (durationTimeAudio) {
        const currentTimeAudio = Math.round((progressPecent / 100) * durationTimeAudio);
        audio.currentTime = currentTimeAudio;
      }
    }

    audio.ontimeupdate = () => {
      if (_this.isUpdateTime) {
        return;
      }
      const currentTimeAudio = audio.currentTime;
      const durationTimeAudio = audio.duration;

      if (durationTimeAudio) {
        const progressPecent = Math.round((currentTimeAudio / durationTimeAudio) * 100);
        $(".progress").value = progressPecent;
      }
    }
    // handle error lag progress
    progress.onmousedown = () => {
      _this.isUpdateTime = true;
    }
    progress.onmouseup = () => {
      _this.isUpdateTime = false;
    }


    // next song
    nextSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else if (_this.isRepeat) {
        _this.loadCurrentSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      progress.value = 0;
      setTimeout(function () {
        _this.activeSong();
        _this.scrollSreenToActiveSong();
      }, 300)
    }


    //prev song
    prevSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else if (_this.isRepeat) {
        _this.loadCurrentSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      progress.value = 0;
      setTimeout(function () {
        _this.activeSong();
        _this.scrollSreenToActiveSong();
      }, 300)

    }
    // handle audio anded

    audio.onended = function () {
      if (_this.isRepeat) {
        _this.loadCurrentSong();
      }
      else if (_this.isRandom) {
        _this.playRandomSong()
      }
      else {
        _this.currentIndex++;
        _this.loadCurrentSong();
      }
      _this.activeSong();
      _this.scrollSreenToActiveSong();
      progress.value = 0;
      audio.play();
    }


    randomBtn.onclick = (e) => {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
      _this.setConfig("isRandom", _this.isRandom);
    }
    $(".playlist").onclick = function (e) {
      songNotActive = e.target.closest(".song:not(.active)");

      if (songNotActive || e.target.closest(".option")) {
        if (songNotActive) {
          const id = Number(songNotActive.dataset.index);
          _this.currentIndex = id;
          _this.loadCurrentSong();
          _this.activeSong();
          audio.play();
          progress.value = 0;
        }
      }
    }
  },
  handleClickSong(e) {
    console.log("aaaa");
    if (!e.target.closest(".option")) {
    }
  },
  activeSong() {
    const playLists = [...$$(".song")];
    playLists.forEach(playList => {
      if (playList.closest(".active")) {
        playList.classList.remove("active");
      }
    });
    playLists[this.currentIndex].classList.add("active");
  },

  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },

  loadCurrentSong() {
    audio.src = `./Files/${this.currentSong.path}`;
    nameSong.textContent = this.currentSong.name;
    cdThumb.style = `background-image : url(${this.currentSong.image})`;
    this.setConfig("id", this.currentIndex);
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.currentIndex = this.config.id
    // case 2
    // Object.assgin(this, this.config);
    if (this.isRandom) {
      randomBtn.classList.add("active");
    }
    if (this.isRepeat) {
      repeatBtn.classList.add("active");
    }
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  scrollSreenToActiveSong() {
    const songActive = $(".song.active");
    // const clientHeight = document.documentElement.clientHeight;
    const { top, height } = songActive.getBoundingClientRect();
    window.scroll({
      top: songActive.offsetTop,
      behavior: "smooth",
    });
  },
  playRandomSong() {
    let indexRandom
    do {
      indexRandom = Math.floor(Math.random() * this.songs.length);
    }
    while (indexRandom === this.currentIndex)
    this.currentIndex = indexRandom;
    console.log(this.currentIndex);
    this.loadCurrentSong();
  },

  start() {
    //load config
    this.loadConfig();
    //define method for object
    this.defineProperties();
    // render UI ()
    this.render();
    // danlde events  ( DOM Event)
    this.handleEvent();
    // render first song in user interface
    this.loadCurrentSong();

  }
}
app.start();


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};