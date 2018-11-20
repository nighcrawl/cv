'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var emailLink = document.getElementById('send-email');
    var emailName = "boj+aihcreihc.egna";
    var emailTLD = "moc.liamg";
    var emailSubject = document.querySelector("html").getAttribute('lang') === "fr" ? "Votre profil m'intéresse" : "I'm interested in your profile";

    var email = emailName.split("").reverse().join("") + "@";
    email += emailTLD.split("").reverse().join("");

    emailLink.setAttribute("href", "mailto:" + email + "?subject=" + encodeURIComponent(emailSubject));
    emailLink.innerHTML = email;
});
