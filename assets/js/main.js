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

fetch('../../public/jobs.json').then(function (response) {
    return response.json();
}).then(function (data) {
    var jobsList = [];
    data.map(function (job) {
        var jobItem = "<li class='list__item fetched'>";
        jobItem += "<div class='card'>";
        jobItem += "<h3 class='card__title'>" + job.title + "</h3>";
        jobItem += "<div class='card__meta'><span class='date--start'>" + job.start + "</span>";
        jobItem += "<span class='date--end'>" + job.end + "</span></div>";
        jobItem += "<div class='card__description'><div class='company'>";
        jobItem += job.url ? "<a href='" + job.url + "' class='company__name'>" + job.company + "</a>, " : "<span class='company__name'>" + job.company + "</span>, ";
        jobItem += "<span class='company__location'>" + job.location + "</span></div>" + job.description;
        jobItem += "</div></div></li>";
        jobsList.push(jobItem);
        console.log(job);
    });
    document.querySelector('#jobs ol.list').innerHTML = jobsList.join("");
});

/*
<li class="list__item">
    <div class="card">
        <h3 class="card__title">D&eacute;veloppeur Web</h3>
        <div class="card__meta">
            <span class="date--start">janv. 2015</span><span class="date--end">En poste</span>
        </div>
        <div class="card__description">
            <div class="company">
                <a href="https://www.ibakus.com" class="company__name">Ibakus Europe SA</a>, <span class="company__location">Strassen</span>
            </div>
        </div>
    </div>
</li>
*/
