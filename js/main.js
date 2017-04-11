document.addEventListener('DOMContentLoaded', function() {
	replaceSendEmailLink();
});

var replaceSendEmailLink = function() {
	var emailLink = document.querySelector("#send-mail"),
		emailName = "ange.chierchia",
		emailTLD = "gmail.com",
		emailSubject = "Votre profil m'intéresse";

	emailLink.setAttribute("href", "mailto:" + emailName + "@" + emailTLD + "?subject=" + encodeURIComponent(emailSubject));
	emailLink.innerHTML = emailName + "@" + emailTLD;
}