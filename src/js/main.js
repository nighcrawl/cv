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
});
