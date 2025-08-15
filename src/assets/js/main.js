"use strict";

function relativeTime(start, end) {
  var lang = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'fr';

  console.log({start, end})

  if (end === null) {
    end = new Date();
  } else {
    end = new Date(Date.parse(end + 'T00:00:00'));
  }

  start = new Date(Date.parse(start + 'T00:00:00'));

  console.log('parse', {start, end})


  var labelYear = lang === 'fr' ? 'an' : 'year';
  var labelMonth = lang === 'fr' ? 'mois' : 'month';
  var labelAnd = lang === 'fr' ? 'et' : 'and';
  var yearInMs = 1000 * 60 * 60 * 24 * 365;
  var monthInMs = 1000 * 60 * 60 * 24 * 30;
  var distance = end.getTime() - start.getTime();
  var years = Math.floor(distance / yearInMs);
  var months = Math.floor(distance / monthInMs);
  var string = '';

  if (years > 0) {
    string += years + ' ' + labelYear + (years > 1 ? 's' : '');
    var delta = Math.floor(distance % yearInMs);
    months = Math.round(delta / monthInMs);

    if (months > 0) {
      string += ' ' + labelAnd + ' ' + months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
    }
  } else {
    string += months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
  }

  return string;
}

document.addEventListener('DOMContentLoaded', function () {
  var emailLink = document.getElementById('send-email');
  var emailName = "sboj+aihcreihc.egna";
  var emailTLD = "moc.liamg";
  var emailSubject = document.querySelector("html").getAttribute('lang') === "fr" ? "Votre profil m'intéresse" : "I'm interested in your profile";
  var email = emailName.split("").reverse().join("") + "@";
  email += emailTLD.split("").reverse().join("");
  emailLink.setAttribute("href", "mailto:" + email + "?subject=" + encodeURIComponent(emailSubject));
  emailLink.innerHTML = email;
  var lang = document.querySelector('html').getAttribute('lang');
  document.querySelectorAll('.relative-time').forEach(function (el, idx) {
    var start = el.getAttribute('data-start');
    var end = el.getAttribute('data-end');
    var relative = relativeTime(start, end, lang);
    el.innerHTML = relative;
  });
});