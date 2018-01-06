document.addEventListener('DOMContentLoaded', function() {
	replaceSendEmailLink();
});

var replaceSendEmailLink = function() {
	var emailLink = document.querySelector("#send-mail"),
		emailName = "aihcreihc.egna",
		emailTLD = "moc.liamg",
		emailSubject = "Votre profil m'intéresse";

	emailLink.setAttribute("href", "mailto:" + emailName.split("").reverse().join("") + "@" + emailTLD.split("").reverse().join("") + "?subject=" + encodeURIComponent(emailSubject));
	emailLink.innerHTML = emailName + "@" + emailTLD;
};
