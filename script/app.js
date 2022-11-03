const pauseBtn = document.querySelector('.player_controller-pause')
const stopBtn = document.querySelector('.player_controller-stop')
const player = document.querySelector('.player')
const trackCard = document.getElementsByClassName('track')
const audio = new Audio();

console.log(stopBtn)

const playMusic = e => {
    const trackActive = e.currentTarget
    audio.src = trackActive.dataset.track
    audio.play()
    pauseBtn.classList.remove('player_icon_play')
    player.classList.add('player_active')
    for (let i = 0; i < trackCard.length; i++) {
        trackCard[i].classList.remove('track_active')
    }
    trackActive.classList.add('track_active')
}

for (let i = 0; i < trackCard.length; i++) {
    trackCard[i].addEventListener('click', playMusic)
}

pauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play()
        pauseBtn.classList.remove('player_icon_play')
    }
    else {
        audio.pause()
        pauseBtn.classList.add('player_icon_play')
    }
})

stopBtn.addEventListener('click', () => {
    audio.src = null
    player.classList.remove('player_active')
    for (let i = 0; i < trackCard.length; i++) {
        trackCard[i].classList.remove('track_active')
    }
})