'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var emailLink = document.getElementById('send-email');
    var emailName = "aihcreihc.egna";
    var emailTLD = "moc.liamg";
    var emailSubject = "Votre profil m'intéresse";

    var email = emailName.split("").reverse().join("") + "@";
    email += emailTLD.split("").reverse().join("");

    emailLink.setAttribute("href", "mailto:" + email + "?subject=" + encodeURIComponent(emailSubject));
    emailLink.innerHTML = email;
});
