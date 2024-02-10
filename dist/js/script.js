// Getting data from the Vimeo API
async function waitForFetch() {
    try {
        const response = await fetch('https://api.vimeo.com/videos/824804225', {
            headers: {
            'Authorization': '{token}'
            }
        });
        const data = await response.json();
        const videoInfoContainer = document.querySelector('.promo__video-info');
        videoInfoContainer.innerHTML = `
        <h2 class='promo__video-info__name'>${data.name}</h2>
        <p class='promo__video-info__text'>Description: <span>${data.description ? data.description : 'Not specified'}</span></p>
        <p class='promo__video-info__text'>Date of upload: <span>${data.release_time ? data.release_time.split('T')[0] : 'Not specified'}</span></p>
        <p class='promo__video-info__text'>Author: <span>${data.user.name ? data.user.name : 'Not specified'}</span></p>
        `;
        const pictureUrl = data.pictures.sizes[3].link;
        return pictureUrl;
    }
    catch(error) {
        console.error('Fetching error:', error);
    }
}


// Filling the slider with information from downloaded videos
const imgContainer = document.querySelector('.img-container');
const imgArr = [];
waitForFetch().then(pictureUrl => {
    if (pictureUrl) {
        for (let i = 0; i < 8; i++) {
            const imgItem = document.createElement('img');
            imgItem.src = pictureUrl;
            imgItem.alt = 'Preview';
            imgItem.classList.add('img-container__item');
            imgContainer.appendChild(imgItem);

            imgArr.push(imgItem);
        }
        $('.promo__img-slider').slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 2,
            variableWidth: true,
            prevArrow: ('.btn_prev'),
            nextArrow: ('.btn_next'),
            draggable: false
        })
    }
}).then(() => {
    DOMLoaded();
});

// A function with a code that is called when the video is finished downloading
const DOMLoaded = () => {

    // Filling popups with downloaded videos
    const playerArr = [];
    const playersContainer = document.querySelector('.players-container'); 

    for (let i = 0; i < 8; i++) {
        const playerItem = document.createElement('div');
        playerItem.classList.add('players-container__item');
        playersContainer.appendChild(playerItem);

        const options = {
            id: '824804225',
            fullscreen: false,
            autoplay: false,
            loop: false
        };

        const player = new Vimeo.Player(playerItem, options);
        playerArr.push(player);
    }

    // Create a slider with video players
    const playerSlider = $('.popup__player');
    playerSlider.slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
        dots: true,
        dotsClass: 'popup__dots',
    })

// Entering popup and Exiting popup

    // Open the popup and launch the relevant video
    const popup = document.querySelector('.popup');
    imgArr.forEach((img, index) => {
        img.addEventListener('click', () => {
            playerSlider.slick('slickGoTo', index);
            popup.classList.add('popup_show');
            playerArr[index].play();
        })
    })

    // Closing popup with button, and pause the video
    const closeBtn = document.querySelector('.popup__close-btn');
    const closePopup = () => {
        if (popup.classList.contains('popup_show')) {
            popup.classList.remove('popup_show');
            playerArr.forEach(player => {
                player.pause();
            })
        }
    }
    closeBtn.addEventListener('click', closePopup);

    // Pause the video, if we choose another slide
    let prevSlide = 0;
    playerSlider.on('afterChange', function(event, slick, currentSlide){
        if (prevSlide !== currentSlide) {
            playerArr[prevSlide].pause();
        }
        prevSlide = currentSlide;
    });

}