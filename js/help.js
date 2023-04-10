
//----------------------------------
//
//	Данный файл содержит необходимые для плеера функции, которые к нему не относятся
//
//----------------------------------

// Функция меняет положение ползунка
function updateSlider(slideElemFull, slideElem){
    let elem = document.getElementById(slideElem);
    let fullElem = document.getElementById(slideElemFull);
    currentPerc = (elem.value / elem.max) * 100;
    fullElem.style.width = currentPerc + "%";
}

// Функция отвечает на переработку количества секунд в таймкод
function secsToTime(time){
            var h = Math.floor(time / (60 * 60)),
                dm = time % (60 * 60),
                m = Math.floor(dm / 60),
                ds = dm % 60,
                s = Math.ceil(ds);
            if (s === 60) {
                s = 0;
                m = m + 1;
            }
            if (s < 10) {
                s = '0' + s;
            }
            if (m === 60) {
                m = 0;
                h = h + 1;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (h === 0) {
                fulltime = m + ':' + s;
            } else {
                fulltime = h + ':' + m + ':' + s;
            }
            return fulltime;
        }

// Функция плавной анимации
function smth(need, cur, smooth){
    return need + (cur - need) * smooth;
}