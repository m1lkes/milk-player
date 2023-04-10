﻿<?php

	$video_id = $_GET["id"];

?>

<!DOCTYPE HTML>
<html>

	<head>
		<title> FinePlayer </title>

		<style type="text/css">

			body{
				width: 100%;
				height: 100%;
				padding: 0;
				margin: 0;
				background: #222;

				display: flex;
				justify-content: center;
				align-items: center;
			}

		</style>

		<link rel="stylesheet" href="style.css">
		<link rel="stylesheet" href="fonts/connect.css">
	</head>

	<body>

			<!-- КОД ПЛЕЕРА -->
			<div class="player-window" id="player">

				<!-- ЭКРАН ПЛЕЕРА -->
				<!-- onmouseenter="toggleControlPanel(true)" onmouseleave="toggleControlPanel(false)" -->
				<div class="player-overlay" onmousemove="updateActiveMouse(true)" id="player-overlay">

					<!-- ОПЦИЯ ВИДЕО [СКОРОСТЬ] -->
					<div class="player-opt-window" id="video-opt-speed" style="width: 0px; opacity: 0;">
						<div class="player-opt-title"> Скорость видео 
							<span class="player-opt-value" id="video-speed-value"> 1x </span>
						 </div>

						 <!-- <div class="player-opt-btn"> Обычная (1х) </div> -->

						 <div class="player-panel-slider-window" style="width: 90%;">
							<div class="player-panel-slider-full">
								<div class="player-panel-slider-current" id="player-speed-current"></div>
							</div>

							<input type="range" id="video-speed" class="player-panel-slider"
								min="0" max="1.75" step="0.25" value="0.75" onchange="videoChangeSpeed()">
						</div>
					</div>

					<!-- ОПЦИЯ ВИДЕО [ИНФОРМАЦИЯ] -->
					<div class="player-opt-window" id="video-opt-info" style="width: 0px; opacity: 0;">
						<div class="player-opt-title"> Управление
						 </div>

						 <div class="player-opt-btn">
						 	<span class="player-opt-value">[Пробел]</span>
						 	Запуск / Пауза
						 </div>

						 <div class="player-opt-btn">
						 	<span class="player-opt-value">➡</span>
						 	Перемотка +5 секунд
						 </div>

						 <div class="player-opt-btn">
						 	<span class="player-opt-value">⬅</span>
						 	Перемотка -5 секунд
						 </div>

						 <div class="player-opt-btn">
						 	<span class="player-opt-value">⬆</span>
						 	Громкость +5%
						 </div>

						 <div class="player-opt-btn">
						 	<span class="player-opt-value">⬇</span>
						 	Громкость -5%
						 </div>

					</div>

					<!-- ОКНО СТАТУСА -->
					<div class="player-status-window" id="video-status">
						<img class="player-status-icon" src="icons/play.svg" id="status-icon">
						<div class="player-status-text" id="status-text"> Загрузка... </div>
					</div>


					<div class="player-space">
						<div class="player-click-zone" onclick="videoToggle()"></div>
					</div>

				<!-- КАДР НАД ТАЙМЛАЙНОМ -->

					<div class="player-mouse-panel" id="player-mouse-panel">
						<div class="player-mouse-timecode" id="player-mouse-timecode"> 00:00 </div>
						<video class="player-mouse-frame" id="player-mouse-frame">
							<source id="mini-video" src="/upload/videos/video<?=$video_id;?>.mp4">
						</video>
					</div>

				<!-- ОСНОВНОЙ ТАЙМЛАЙН -->

				<div class="player-timeline" id="player-timeline">
					<div class="player-panel-slider-window" style="width: 100%;">
							<div class="player-panel-slider-full">
								<div class="player-panel-slider-current" id="player-timeline-slider-current"></div>
							</div>

							<input type="range" id="video-timeline" class="player-panel-slider"
								min="0" max="100" step="0.1" value="0"
							onmousedown="timelineDrag(true, event)" onmouseup="timelineDrag(false, event)" onmousemove="moveMouseTimecode(event)">

						</div>
				</div>

				<!-- ПАНЕЛЬ УПРАВЛЕНИЯ -->
					<div class="player-panel" id="player-panel">

						<img src="icons/play.svg" class="player-panel-icon" id="player-play" onclick="videoToggle()">

							<div class="player-panel-timer" id="player-timer"> 00:00<span style="opacity: 0.6;">/00:00</span> </div>

						<img src="icons/volume.svg" class="player-panel-icon"
						onclick="videoVolumeToggle()">

						<div class="player-panel-slider-window" id="player-volume-slider" style="width: 0px;">
							<div class="player-panel-slider-full">
								<div class="player-panel-slider-current" id="player-volume-slider-current"></div>
							</div>

							<input type="range" id="video-volume" class="player-panel-slider" min="0" max="100" step="5" value="100"
							onchange="videoChangeVolume(true)">
						</div>

						<div class="player-space"></div>

						<img src="icons/info.svg" class="player-panel-icon" onclick="showVideoOpt('info')">
						<img src="icons/speed.svg" class="player-panel-icon" onclick="showVideoOpt('speed')">
						<img src="icons/fullscreen.svg" class="player-panel-icon" onclick="videoFullScreen()">

					</div>

				</div>


				<!-- ИСТОЧНИК ВИДЕО -->
				<video width="100%" height="100%" id="video-source">
					<source id="orig-video" src="/upload/videos/video<?=$video_id;?>.mp4">
				</video>


			</div>


<!-- ЗАГРУЗКА НЕОБХОДИМЫХ СКРИПТОВ -->

<script src="js/main.js"> </script>
<script src="js/help.js"> </script>

<!-- ЗАПУСКАЕМ СКРИПТЫ -->

<script>

	// КОГДА ЗАГРУЖАЕТСЯ ДОКУМЕНТ:
	window.onload = function () {

		//document.getElementById("player-mouse-frame").src = vidSource.src;

		// Моментальное обновление статусов
		//videoChangeVolume();

		// Цикл команд повторяется каждые 0.5 сек
		setInterval(function () {

			updateActiveMouse(false);

		}, 500);

		// Цикл команд повторяется каждые 0.1 сек
		setInterval(function () {

			videoUpdateTimer(); // Обновление таймера
			videoUpdateMini(); // Обновление мини-плеера для таймлайна

		}, 200);

		// Цикл команд повторяется каждые 0.25 сек
		setInterval(function () {

			moveActiveUpdate(); // Обновляет сумму перемотки
			videoChangeVolume(false); // Обновление слайдера громкости
			videoChangeSpeed(); // Обновление сладера скорости
			videoUpdateTimeline(); // Обновление слайдера таймлайна

		}, 100);

		// Цикл команд повторяется каждые 0.025 сек
		setInterval(function () {

			videoStatusUpdate();

		}, 25);

		//-------------------------------
		//	БИНДЫ КЛАВИШ НА ФУНКЦИИ
		//-------------------------------

		// К документу добавляется событие, где при НАЖАТИИ (keydown)
		// клавиши запускается функция с перменной k (клавиша),
		// где k.keycode - код клавиши

		// БИНД ЛЕВОЙ СТРЕЛКИ
		document.addEventListener('keydown', function(k){
			if (k.key == "ArrowLeft" && k.repeat == false){ // Проверка клавиши
				moveVideoTime(-5); // Перематывает видео на 5 секунд назад
			}});

		// БИНД ПРАВОЙ СТРЕЛКИ
		document.addEventListener('keydown', function(k){
			if (k.key == "ArrowRight" && k.repeat == false){ // Проверка клавиши
				moveVideoTime(5); // Перематывает видео на 5 секунд вперед
			}});

		// БИНД ПРОБЕЛА
		document.addEventListener('keydown', function(k){
			if (k.key == " " && k.repeat == false){ // Проверка клавиши
				videoToggle(); // Включает видео
			}});

		// БИНД ВЕРХНЕЙ СТРЕЛКИ
		document.addEventListener('keydown', function(k){
			if (k.key == "ArrowUp"){ // Проверка клавиши
				if (vidSource.volume < 1) // Лимит громкости ниже 100%
					{document.getElementById("video-volume").value = (parseFloat(vidSource.volume) + 0.05) * 100;} // Увеличение громкости
				videoChangeVolume(true); // Обновляет ползунок громкости и показывает статус
			}});

		// БИНД НИЖНЕЙ СТРЕЛКИ
		document.addEventListener('keydown', function(k){
			if (k.key == "ArrowDown"){ // Проверка клавиши
				if (vidSource.volume > 0) // Лимит громкости выше 0%
					{document.getElementById("video-volume").value = (parseFloat(vidSource.volume) - 0.05) * 100;} // Понижение громкости
				videoChangeVolume(true); // Обновляет ползунок громкости и показывает статус
			}});

		//document.getElementById("mini-video").src = document.getElementById("orig-video").src;

		//-------------------------------
		//	ПРИВЯЗКА УПРАВЛЕНИЯ МЫШИ
		//-------------------------------

	}
</script>

	</body>

</html>