
//----------------------------------
//
//	СКРИПТОВАЯ ЧАСТЬ ПЛЕЕРА
//
//----------------------------------

// УСТАНОВКА ПЕРЕМЕННЫХ

let vidSource = document.getElementById("video-source"); // Само видео

let isTimelineChange = false; // Определяет, тянет ли пользователь ползунок таймланйа, нужен для работы с таймлайном
let statusOpacity = 1; // Прозрачность окошка статуса
let moveSum = 0; // Количество секунд, перемотанных подряд
let moveActive = 7; // Активность, когда перемотка суммируется (>0)
let activeMouse = 2; // Активность мыши
let isLookedTimeline = false; // Наведён ли курсор на таймлайн

// ФУНКЦИИ ДЛЯ РАБОТЫ С ВИДЕО

// Функция переключает статус видео (Запуск / Пауза)
function videoToggle() {

	let isPaused = vidSource.paused;
	let playBtn = document.getElementById("player-play");

	if (isPaused == true) {
		vidSource.play();
		playBtn.src = "icons/pause.svg";
		pushVideoStatus("play", "Запуск");
	}

	else {
		vidSource.pause();
		playBtn.src = "icons/play.svg";
		pushVideoStatus("pause", "Пауза");
	}

}

// Функция открывает/закрывает ползунок громкости
function videoVolumeToggle() {

	let volumeSlide = document.getElementById("player-volume-slider"); // Слайдер
	let isShowed = (volumeSlide.style.width == "0px"); // Скрыт ли ползунок или нет

	if (isShowed == true) {
		volumeSlide.style.width = "200px";
	}
	else {
		volumeSlide.style.width = "0px";
	}

}

// Функция проверяет время видео и его длительность, после чего обновляет таймер
function videoUpdateTimer(){

	let currentVideoTime = secsToTime(parseInt(vidSource.currentTime)); // Текущее время видео
	let fullVideoTime = secsToTime(parseInt(vidSource.duration)); // Длительность видео

	let timeCode = currentVideoTime+'<span style="opacity: 0.4;">/'+fullVideoTime+'</span>';
	document.getElementById("player-timer").innerHTML = timeCode;

}

// Функция меняет громкость ползунком
function videoChangeVolume(isDrag){

	let currentVolume = document.getElementById("video-volume").value * 0.01; // Изменённая громкость

	updateSlider("player-volume-slider-current", "video-volume"); // Если громкость изменилась, ползунок обновляется
	if (vidSource.volume != currentVolume){
		vidSource.volume = currentVolume;
	}

	if (isDrag == true) {pushVideoStatus("volume", "Громкость " + document.getElementById("video-volume").value + "%");}

}

// Функция открывает/закрывает панель
function toggleControlPanel(isOpened){

	if (isOpened == false) {
		document.getElementById("player-panel").classList.add("opened");
		document.getElementById("player-timeline").classList.add("opened");

	} else {
		document.getElementById("player-panel").classList.remove("opened");
		document.getElementById("player-timeline").classList.remove("opened");
	}

}

// Функция переключает полноэкранный режим
function videoFullScreen(){
	isFull = document.fullscreen;

	if (isFull == false) {
		document.getElementById("player").requestFullscreen();
		document.getElementById("player-overlay").style.zoom = 1.4;
		pushVideoStatus("fullscreen", "Полный экран");
	}

	else {
		document.exitFullscreen();
		document.getElementById("player-overlay").style.zoom = 1;
		pushVideoStatus("fullscreen", "Оконный режим");}
}

// Функция обновляет таймлайн
function videoUpdateTimeline(){

	if (isTimelineChange == false) {
		let currentVideoTime = vidSource.currentTime; // Текущее время видео
		let fullVideoTime = vidSource.duration; // Длительность видео

		// Устанавливает параметры для слайдера
		document.getElementById("video-timeline").value = currentVideoTime;
		document.getElementById("video-timeline").max = fullVideoTime;
	}

	// Обновляет полоску слайдера
	updateSlider("player-timeline-slider-current", "video-timeline");
}

// Функция перемещения таймлайна
function timelineDrag(isDrag, ev){
	isTimelineChange = isDrag;
	isLookedTimeline = isDrag;

	if (vidSource.currentTime != document.getElementById("video-timeline").value){
		moveMouseTimecode(ev); // Двигает таймкод к мыши, перенося информацию о мыши как EV
	}

	if (isDrag == false) {
		vidSource.currentTime = document.getElementById("video-timeline").value; // Меняет таймкод видео
		updateSlider("player-timeline-slider-current", "video-timeline");
		pushVideoStatus("forward", "Перемотка");
	}

	lookTimeline(isDrag);
}

// Функция смены скорости воспроизведения
function videoChangeSpeed(){
	thisSpeed = parseFloat(document.getElementById("video-speed").value) + 0.25; // Новая скорость
	if (vidSource.playbackRate != thisSpeed) {pushVideoStatus("speed", "Скорость x"+thisSpeed);} // Если скорость изменена, то появляется статус

	vidSource.playbackRate = thisSpeed;
	updateSlider("player-speed-current", "video-speed");
	document.getElementById("video-speed-value").innerText = vidSource.playbackRate+"x";
}

// Фнукция обновления статуса
function videoStatusUpdate(){

	if (statusOpacity > 0) {
		statusOpacity -= 0.04;
	} // Понижает прозрачность окошка статуса
	document.getElementById("video-status").style.opacity = statusOpacity;

}

// Функция показа статуса видео
function pushVideoStatus(img, msg){

	document.getElementById("status-icon").src = "icons/"+img+".svg"; // Обновление иконки
	document.getElementById("status-text").innerText = msg; // Обновление текста
	statusOpacity = 1.25; // Показ статуса

}

// Функция показа настройки видео
function showVideoOpt(type){

	// Показать/скрыть окно [SPEED]
	isType = (type == "speed" && document.getElementById("video-opt-speed").style.width == "0px");
	//console.log(isType);
		document.getElementById("video-opt-speed").style.width = (250 * isType)+"px";
		document.getElementById("video-opt-speed").style.opacity = 1 * isType;

	// Показать/скрыть окно [INFO]
	isType = (type == "info" && document.getElementById("video-opt-info").style.width == "0px");
	//console.log(isType);
		document.getElementById("video-opt-info").style.width = (250 * isType)+"px";
		document.getElementById("video-opt-info").style.opacity = 1 * isType;
}

// Функция перемотки видео на X секунд
function moveVideoTime(val){
	moveActive = 5; // Обновляет перемотку
	moveSum += val; // Прибавляет перемотку
	if (moveSum > 0) {isPlus = "+";} else {isPlus = "";} // Ставит плюс, если число положительное

	vidSource.currentTime += val;
	pushVideoStatus("forward", isPlus+moveSum+" сек"); // Показывает статус
}

// Обновление таймера перемотки
function moveActiveUpdate(){
	moveActive -= 1;
		if (moveActive < 0) {moveSum = 0;}
}

// Функция перемещает элемент таймкода к мыши
function moveMouseTimecode(event){

	if (isLookedTimeline == true) { // Наведен ли курсор на таймлайн (оптимизация)
		x = event.offsetX; // Ставим координату X мыши

		timeline = document.getElementById("video-timeline");
		w = document.getElementById("player").getBoundingClientRect().width; // Смотрим ширину плеера
		x = (timeline.value / timeline.max) * 100; // Вымеряем процент ползунка
		//console.log((timeline.value / timeline.max));

		document.getElementById("player-mouse-timecode").innerText = secsToTime(parseInt(timeline.value)); // Пишем таймкод

		cord = document.getElementById("player-mouse-panel").style.left;
		document.getElementById("player-mouse-panel").style.left = x+"%"; // Передвигаем панель к мыши

	}
}

function updateActiveMouse(isReset){
	if (isReset == false) {activeMouse -= 1;}
	if (isReset == true) {activeMouse = 5;}

	toggleControlPanel(activeMouse > 0);
}

// Показывает панель таймкода, когда пользователь навёлся на таймлайн
function lookTimeline(isLooked){
	isLookedTimeline = isLooked;
	document.getElementById("player-mouse-panel").style.transform = "scale(" + (isLooked * 1.1) + ")";
}

function videoUpdateMini(){
	document.getElementById("player-mouse-frame").currentTime = parseInt(document.getElementById("video-timeline").value); // Меняем момент видео
}