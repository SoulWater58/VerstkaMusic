{
  const API_URL = 'http://localhost:3024/'

  let dataMusic = [];

  let playList = []

  const favoriteList = localStorage.getItem('favorite') ? JSON.parse(localStorage.getItem('favorite')) : []

  const pauseBtn = document.querySelector('.player_controller-pause')
  const stopBtn = document.querySelector('.player_controller-stop')

  const player = document.querySelector('.player')

  const catalogContainer = document.querySelector('.catalog_container')

  const prevBtn = document.querySelector('.player_controller-prev')
  const nextBtn = document.querySelector('.player_controller-next')
  const likeBtn = document.querySelector('.player_controller-like')
  const favoriteBtn = document.querySelector('.header_favorit-btn')

  const muteBtn = document.querySelector('.player_icon_mute')

  const playerVolumeInput = document.querySelector('.player_volume-input')
  const playerProgressInput = document.querySelector('.player_progress-input')

  const playerTimePassed = document.querySelector('.player_time-passed')
  const playerTimeTotal = document.querySelector('.player_time-total')

  const headerLogo = document.querySelector('.header_logo')

  const search = document.querySelector('.search')

  const trackTitle = document.querySelector('.track_title')
  const trackArtist = document.querySelector('.track_artist')

  const trackCard = document.getElementsByClassName('track')

  const audio = new Audio();

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

    let i = 0

    const id = trackActive.dataset.idTrack

    const index = favoriteList.indexOf(id)
    if (index !== -1) {
      likeBtn.classList.add('player_icon_like_active')
    }
    else {
      likeBtn.classList.remove('player_icon_like_active')
    }

    const track = playList.find((item, index) => {
      i = index
      return id === item.id
    })

    audio.src = `${API_URL}${track.mp3}`

    trackTitle.textContent = track.track
    trackArtist.textContent = track.artist

    audio.play()
    pauseBtn.classList.remove('player_icon_play')
    player.classList.add('player_active')
    player.dataset.idTrack = id

    const prevTrack = i === 0 ? playList.length - 1 : i - 1;
    const nextTrack = i + 1 === playList.length ? 0 : i + 1;
    prevBtn.dataset.idTrack = playList[prevTrack].id
    nextBtn.dataset.idTrack = playList[nextTrack].id

    likeBtn.dataset.idTrack = id

    for (let i = 0; i < trackCard.length; i++) {
      if (id === trackCard[i].dataset.idTrack) {
        trackCard[i].classList.add('track_active')
      }
      else {
        trackCard[i].classList.remove('track_active')
      }
    }
  }

  const addHandlerTrack = () => {
    for (let i = 0; i < trackCard.length; i++) {
        trackCard[i].addEventListener('click', playMusic)
    }
  }

  const createCard = (data) => {
    const card = document.createElement('a')
    card.href = '#'
    card.classList.add('catalog_item', 'track')
    if (player.dataset.idTrack === data.id) {
      card.classList.add('track_active')
      if (audio.paused) {
        card.classList.add('track_pause')
      }
    }
    card.dataset.idTrack = data.id
    card.innerHTML = `
        <div class="track_img-wrap">
            <img src="${API_URL}${data.poster}" alt="${data.artist} - ${data.track}" class="track_poster" width="180" height="180">
        </div>
        <div class="track_info track-info">
            <p class="track_title">${data.track}</p>
            <p class="track_artist">${data.artist}</p>
        </div>
    `
    return card
  }

  const renderCatalog = (dataList) => {
    playList = [...dataList]
    if (!playList.length) {
      catalogContainer.textContent = 'Ничего не найдено'
      return
    }
    catalogContainer.textContent = ''
    const listCards = dataList.map(createCard)
    catalogContainer.append(...listCards)
    addHandlerTrack()
    const catalogAddBtn = createCatalogBtn()
    checkCount(catalogAddBtn)
  }

  const checkCount = (catalogAddBtn, i = 1) => {
    if (catalogContainer.clientHeight > trackCard[0].clientHeight * 2 + 50) {
        trackCard[trackCard.length - i].style.display = 'none'
        checkCount(catalogAddBtn, i + 1)
    }
    else if (i != 1) {
      catalogContainer.append(catalogAddBtn)
    }
  }

  const updateTime = () => {
    const duration = audio.duration
    const currentTime = audio.currentTime
    const progress = (currentTime / duration) * 100
    playerProgressInput.value = progress ? progress : 0

    const minPassed = Math.floor(currentTime / 60) || '0'
    const secPassed = Math.floor(currentTime % 60) || '0'

    const minDuration = Math.floor(duration / 60) || '0'
    const secDuration = Math.floor(duration % 60) || '0'

    playerTimePassed.textContent = `${minPassed}:${secPassed < 10 ? '0' + secPassed : secPassed}`
    playerTimeTotal.textContent = `${minDuration}:${secDuration < 10 ? '0' + secDuration : secDuration}`
  }

  const createCatalogBtn = () => {
    const catalogAddBtn = document.createElement('button')
    catalogAddBtn.classList.add('catalog_btn-add')
    catalogAddBtn.innerHTML = `
      <span>Увидеть все</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
      </svg> 
    `

    catalogAddBtn.addEventListener('click', () => {
      [...trackCard].forEach((tracks) => {
        tracks.style.display = ''
        catalogAddBtn.remove()
      })
    })

    return catalogAddBtn
  }

  const addEventListener = () => {
    prevBtn.addEventListener('click', playMusic)
    nextBtn.addEventListener('click', playMusic)
    
    audio.addEventListener('ended', () => {
      nextBtn.dispatchEvent(new Event('click', {bubbles: true}))
    })
    
    audio.addEventListener('timeupdate', updateTime)
    
    playerProgressInput.addEventListener('input', () => {
      const progress = playerProgressInput.value
      audio.currentTime = (progress / 100) * audio.duration
    })

    favoriteBtn.addEventListener('click', () => {
      const data = dataMusic.filter((item) => favoriteList.includes(item.id))
      renderCatalog(data)
    })

    headerLogo.addEventListener('click', () => {
      renderCatalog(dataMusic)
    })

    likeBtn.addEventListener('click', () => {
      const index = favoriteList.indexOf(likeBtn.dataset.idTrack)
      if (index === -1) {
        favoriteList.push(likeBtn.dataset.idTrack)
        likeBtn.classList.add('player_icon_like_active')
      }
      else {
        favoriteList.splice(index, 1)
        likeBtn.classList.remove('player_icon_like_active')
      }
      localStorage.setItem('favorite', JSON.stringify(favoriteList))
    })

    playerVolumeInput.addEventListener('input', () => {
      const value = playerVolumeInput.value
      audio.volume = value / 100
    })

    muteBtn.addEventListener('click', () => {
      if (audio.volume) {
        localStorage.setItem('volume', audio.volume)
        audio.volume = 0
        muteBtn.classList.add('player_icon_mute-off')
        playerVolumeInput.value = 0
      }
      else {
        audio.volume = localStorage.getItem('volume')
        muteBtn.classList.remove('player_icon_mute-off')
        playerVolumeInput.value = audio.volume * 100
      }
    })

    pauseBtn.addEventListener('click', pausePlayer)

    stopBtn.addEventListener('click', () => {
      audio.src = ''
      player.classList.remove('player_active')
      for (let i = 0; i < trackCard.length; i++) {
          trackCard[i].classList.remove('track_active')
      }
    })

    search.addEventListener('submit', async (e) => {
      e.preventDefault()
      fetch(`${API_URL}api/music?search=${search.search.value}`).then((data) => data.json()).then(renderCatalog)
    })
  }

  const init = async () => {
    audio.volume = localStorage.getItem('volume') || 1
    playerVolumeInput.value = audio.volume * 100

    dataMusic = await fetch(`${API_URL}api/music`).then((data) => data.json())

    renderCatalog(dataMusic)

    addEventListener()
  }

  init()
}