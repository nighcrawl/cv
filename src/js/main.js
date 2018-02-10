document.addEventListener('DOMContentLoaded', () => {
    let emailLink = document.getElementById('send-email');
    const emailName = "aihcreihc.egna";
    const emailTLD = "moc.liamg";
    const emailSubject = "Votre profil m'intéresse";

    let email = emailName.split("").reverse().join("")+ "@";
    email += emailTLD.split("").reverse().join("");

    emailLink.setAttribute("href", "mailto:" + email
        + "?subject=" + encodeURIComponent(emailSubject)
    );
    emailLink.innerHTML = email;
});
