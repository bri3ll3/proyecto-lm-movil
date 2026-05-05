window.addEventListener('load', function () {
  var articles   = document.querySelectorAll('article');
  var chinchetas = document.querySelectorAll('.chincheta');

  chinchetas[0].classList.add('chincheta1');

  chinchetas[0].addEventListener('animationend', function () {
    articles[0].classList.add('article1');

    articles[0].addEventListener('animationend', function () {
      chinchetas[1].classList.add('chincheta2');

      chinchetas[1].addEventListener('animationend', function () {
        chinchetas[2].classList.add('chincheta3');

        chinchetas[2].addEventListener('animationend', function () {
          articles[2].classList.add('article3');
        }, false);
      }, false);
    }, false);
  }, false);
}, false);