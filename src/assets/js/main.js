"use strict";

function relativeTime(start, end) {
  var lang = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'fr';

  if (end === null) {
    end = new Date();
  } else {
    end = new Date(Date.parse(end + 'T00:00:00'));
  }

  start = new Date(Date.parse(start + 'T00:00:00'));

  var labelYear = lang === 'fr' ? 'an' : 'year';
  var labelMonth = lang === 'fr' ? 'mois' : 'month';
  var labelAnd = lang === 'fr' ? 'et' : 'and';
  // Calendar months, inclusive of the starting month (June -> December = 7 months).
  var total = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() >= start.getDate()) total += 1;
  var years = Math.floor(total / 12);
  var months = total % 12;
  var string = '';

  if (years > 0) {
    string += years + ' ' + labelYear + (years > 1 ? 's' : '');
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
