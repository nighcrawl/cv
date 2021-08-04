'use strict';

function relativeTime(start, end, lang = 'fr') {
    if (typeof(end) === undefined) {
        end = new Date();
    } else {
        end = new Date(Date.parse(end));
    }
    start = new Date(Date.parse(start));

    var labelYear = lang === 'fr' ? 'an' : 'year';
    var labelMonth = lang === 'fr' ? 'mois' : 'month';
    var labelAnd = lang === 'fr' ? 'et' : 'and';

    var distance  = end.getTime() - start.getTime();
    var years = Math.floor(distance % (24 * 60 * 60 * 1000 * 365));
    var months = Math.floor(distance % (24 * 60 * 60 * 1000 * 365/12));

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
    var emailName = "boj+aihcreihc.egna";
    var emailTLD = "moc.liamg";
    var emailSubject = document.querySelector("html").getAttribute('lang') === "fr" ? "Votre profil m'intéresse" : "I'm interested in your profile";

    var email = emailName.split("").reverse().join("") + "@";
    email += emailTLD.split("").reverse().join("");

    emailLink.setAttribute("href", "mailto:" + email + "?subject=" + encodeURIComponent(emailSubject));
    emailLink.innerHTML = email;

    var lang = document.querySelector('html').getAttribute('lang');

    document.querySelectorAll('.relative-time').forEach(function(el, idx) {
        var start = el.getAttribute('data-start') + 'T00:00:00';
        var end = el.getAttribute('data-end') + 'T00:00:00';
        var relative = relativeTime(start, end, lang);
        console.log({lang, start, end, relative});

        el.innerHTML = relative;
    });
});