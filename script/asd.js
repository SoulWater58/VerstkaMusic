const dataMusic = [
    {
      id: '1',
      artist: 'The weeknd',
      track: 'Save your tears',
      poster: 'image/photo1.jpg',
      mp3: 'audio/The Weeknd - Save Your Tears.mp3',
    },
    {
      id: '2',
      artist: 'Imagine Dragons',
      track: 'Follow You',
      poster: 'image/photo2.jpg',
      mp3: 'audio/Imagine Dragons - Follow You.mp3',
    },
    {
      id: '3',
      artist: 'Tove Lo',
      track: 'How Long',
      poster: 'image/photo3.jpg',
      mp3: 'audio/Tove Lo - How Long.mp3',
    },
    {
      id: '4',
      artist: 'Tom Odell',
      track: 'Another Love',
      poster: 'image/photo4.jpg',
      mp3: 'audio/Tom Odell - Another Love.mp3',
    },
    {
      id: '5',
      artist: 'Lana Del Rey',
      track: 'Born To Die',
      poster: 'image/photo5.jpg',
      mp3: 'audio/Lana Del Rey - Born To Die.mp3',
    },
    {
      id: '6',
      artist: 'Adele',
      track: 'Hello',
      poster: 'image/photo6.jpg',
      mp3: 'audio/Adele - Hello.mp3',
    },
    {
      id: '7',
      artist: 'Tom Odell',
      track: "Can't Pretend",
      poster: 'image/photo7.jpg',
      mp3: "audio/Tom Odell - Can't Pretend.mp3",
    },
    {
      id: '8',
      artist: 'Lana Del Rey',
      track: 'Young And Beautiful',
      poster: 'image/photo8.jpg',
      mp3: 'audio/Lana Del Rey - Young And Beautiful.mp3',
    },
    {
      id: '9',
      artist: 'Adele',
      track: 'Someone Like You',
      poster: 'image/photo9.jpg',
      mp3: 'audio/Adele - Someone Like You.mp3',
    },
    {
      id: '10',
      artist: 'Imagine Dragons',
      track: 'Natural',
      poster: 'image/photo10.jpg',
      mp3: 'audio/Imagine Dragons - Natural.mp3',
    },
    {
      id: '11',
      artist: 'Drake',
      track: 'Laugh Now Cry Later',
      poster: 'image/photo11.jpg',
      mp3: 'audio/Drake - Laugh Now Cry Later.mp3',
    },
    {
      id: '12',
      artist: 'Madonna',
      track: 'Frozen',
      poster: 'image/photo12.jpg',
      mp3: 'audio/Madonna - Frozen.mp3',
    },
  ];

const pauseBtn = document.querySelector('.player_controller-pause')
const stopBtn = document.querySelector('.player_controller-stop')
const player = document.querySelector('.player')
const catalogContainer = document.querySelector('.catalog_container')
const prevBtn = document.querySelector('.player_controller-prev')
const nextBtn = document.querySelector('.player_controller-next')
const likeBtn = document.querySelector('.player_controller-like')
const muteBtn = document.querySelector('.player_controller-mute')
const trackCard = document.getElementsByClassName('track')
const audio = new Audio();

const catalogAddBtn = document.createElement('button')
catalogAddBtn.classList.add('catalog_btn-add')
catalogAddBtn.innerHTML = `
    <span>Увидеть все</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
    </svg> 
`

const pausePlayer = () => {
    const trackActive = document.querySelector('.track_active')
    if (audio.paused) {
        audio.play()
        pauseBtn.classList.remove('player_icon_play')
        trackActive.classList.remove('track_pause')
    }
    else {
        audio.pause()
        pauseBtn.classList.add('player_icon_play')
        trackActive.classList.add('track_pause')
    }
}

const playMusic = e => {
    e.preventDefault()
    const trackActive = e.currentTarget

    if (trackActive.classList.contains('track_active')) {
        pausePlayer()
        return
    }

    const id = trackActive.dataset.idTrack
    const track = dataMusic.find((item, index) => {
      i = index
      return id === item.id
    }).mp3

    let i = 0

    audio.src = track
    audio.play()
    pauseBtn.classList.remove('player_icon_play')
    player.classList.add('player_active')

    // const prevTrack = i === 0 ? dataMusic.length - 1 : i - 1;
    // const nextTrack = i + 1 === dataMusic.length ? 0 : i + 1;
    // prevBtn.dataset.idTrack = dataMusic[prevTrack].id
    // nextBtn.dataset.idTrack = dataMusic[nextTrack].id

    for (let i = 0; i < trackCard.length; i++) {
        trackCard[i].classList.remove('track_active')
    }

    trackActive.classList.add('track_active')
}

const addHandlerTrack = () => {
    for (let i = 0; i < trackCard.length; i++) {
        trackCard[i].addEventListener('click', playMusic)
    }
}

pauseBtn.addEventListener('click', pausePlayer)

stopBtn.addEventListener('click', () => {
    audio.src = null
    player.classList.remove('player_active')
    for (let i = 0; i < trackCard.length; i++) {
        trackCard[i].classList.remove('track_active')
    }
})

const createCard = (data) => {
    const card = document.createElement('a')
    card.href = '#'
    card.classList.add('catalog_item', 'track')
    card.dataset.idTrack = data.id
    card.innerHTML = `
        <div class="track_img-wrap">
            <img src="${data.poster}" alt="${data.artist} - ${data.track}" class="track_poster" width="180" height="180">
        </div>
        <div class="track_info track-info">
            <p class="track_title">${data.track}</p>
            <p class="track_artist">${data.artist}</p>
        </div>
    `
    return card
}

const renderCatalog = (dataList) => {
    catalogContainer.textContent = ''
    const listCards = dataList.map(createCard)
    catalogContainer.append(...listCards)
    addHandlerTrack()
}

const checkCount = (i = 1) => {
    trackCard[0]
    if (catalogContainer.clientHeight > trackCard[0].clientHeight * 3) {
        trackCard[trackCard.length - i].style.display = 'none'
        checkCount(i + 1)
    }
    else if (i != 1) {
      catalogContainer.append(catalogAddBtn)
    }
}

const init = () => {
    renderCatalog(dataMusic)
    checkCount()

    catalogAddBtn.addEventListener('click', () => {
      [...trackCard].forEach((tracks) => {
        tracks.style.display = ''
        catalogAddBtn.remove()
      })
    })
    prevBtn.addEventListener('click', playMusic)

    nextBtn.addEventListener('click', playMusic)
}

init()