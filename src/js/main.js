"use strict";

function relativeTime(start, end, lang = 'fr') {

    if (end === null) {
        end = new Date();
    } else {
        end = new Date(Date.parse(end + 'T00:00:00'));
    }
    start = new Date(Date.parse(start + 'T00:00:00'));

    const labelYear = lang === 'fr' ? 'an' : 'year';
    const labelMonth = lang === 'fr' ? 'mois' : 'month';
    const labelAnd = lang === 'fr' ? 'et' : 'and';

    const yearInMs = 1000 * 60 * 60 * 24 * 365;
    const monthInMs = 1000 * 60 * 60 * 24 * 30;

    let distance  = end.getTime() - start.getTime();
    let years = Math.floor(distance / yearInMs);
    let months = Math.floor(distance / monthInMs);

    let string = '';

    if (years > 0) {
        string += years + ' ' + labelYear + (years > 1 ? 's' : '');

        let delta = Math.floor(distance % yearInMs);
        months = Math.round(delta / monthInMs);

        if (months > 0) {
            string += ' ' + labelAnd + ' ' + months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
        }
    } else {
        string += months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
    }

    return string;
}


document.addEventListener('DOMContentLoaded', () => {
    let emailLink = document.getElementById('send-email');
    const emailName = "aihcreihc.egna";
    const emailTLD = "moc.liamg";
    const emailSubject = document.querySelector("html").getAttribute('lang') === "fr" ? "Votre profil m'intéresse" : "I'm interested in your profile";

    let email = emailName.split("").reverse().join("") + "@";
    email += emailTLD.split("").reverse().join("");

    emailLink.setAttribute("href", "mailto:" + email
        + "?subject=" + encodeURIComponent(emailSubject)
    );
    emailLink.innerHTML = email;

    const lang = document.querySelector('html').getAttribute('lang');

    document.querySelectorAll('.relative-time').forEach(function(el, idx) {
        const start = el.getAttribute('data-start');
        const end = el.getAttribute('data-end');
        const relative = relativeTime(start, end, lang);
        el.innerHTML = relative;
    });
});