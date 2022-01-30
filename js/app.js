(function ($) {
    "use strict";
    AOS.init({offset: 0, duration: 800});

    $("#open-invitation").click(function() {
        $("#splash").addClass('closed');
        $(".content").addClass('active');
        $("body").removeClass('no-scroll');
        toggleAudio();
    });

    $('.audio-btn').click(function() {
        toggleAudio();
    })

    function toggleAudio() {
        var audio = $('#audio')[0];
        if (audio.paused) {
            audio.play();
            $('#audio-icon').html('<svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5.889 16H2C1.73478 16 1.48043 15.8946 1.29289 15.7071C1.10536 15.5196 1 15.2652 1 15V8.99999C1 8.73477 1.10536 8.48042 1.29289 8.29288C1.48043 8.10535 1.73478 7.99999 2 7.99999H5.889L11.183 3.66799C11.2563 3.60794 11.3451 3.56993 11.4391 3.55838C11.5331 3.54684 11.6284 3.56224 11.714 3.60279C11.7996 3.64334 11.872 3.70737 11.9226 3.78742C11.9732 3.86748 12.0001 3.96027 12 4.05499V19.945C12.0001 20.0397 11.9732 20.1325 11.9226 20.2126C11.872 20.2926 11.7996 20.3566 11.714 20.3972C11.6284 20.4377 11.5331 20.4531 11.4391 20.4416C11.3451 20.4301 11.2563 20.392 11.183 20.332L5.89 16H5.889ZM20.414 12L23.95 15.536L22.536 16.95L19 13.414L15.464 16.95L14.05 15.536L17.586 12L14.05 8.46399L15.464 7.04999L19 10.586L22.536 7.04999L23.95 8.46399L20.414 12Z" fill="#07082F"/> </svg> ');
        } else {
            audio.pause();
            audio.currentTime = 0
            $('#audio-icon').html('<svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.889 16H5C4.73478 16 4.48043 15.8946 4.29289 15.7071C4.10536 15.5196 4 15.2652 4 15V8.99999C4 8.73477 4.10536 8.48042 4.29289 8.29288C4.48043 8.10535 4.73478 7.99999 5 7.99999H8.889L14.183 3.66799C14.2563 3.60794 14.3451 3.56993 14.4391 3.55838C14.5331 3.54684 14.6284 3.56224 14.714 3.60279C14.7996 3.64334 14.872 3.70737 14.9226 3.78742C14.9732 3.86748 15.0001 3.96027 15 4.05499V19.945C15.0001 20.0397 14.9732 20.1325 14.9226 20.2126C14.872 20.2926 14.7996 20.3566 14.714 20.3972C14.6284 20.4377 14.5331 20.4531 14.4391 20.4416C14.3451 20.4301 14.2563 20.392 14.183 20.332L8.89 16H8.889ZM18.863 16.591L17.441 15.169C17.9265 14.7957 18.3196 14.3157 18.5899 13.7662C18.8602 13.2167 19.0006 12.6124 19 12C19 10.57 18.25 9.31499 17.12 8.60799L18.559 7.16899C19.3165 7.72618 19.9321 8.45384 20.3562 9.29311C20.7802 10.1324 21.0008 11.0597 21 12C21 13.842 20.17 15.49 18.863 16.591Z" fill="#07082F"/> </svg> ')
        }
    }

})(window.jQuery);

// Start Maps
var located = "Lokasi";
var address = "Dsn Dawung, RT 03 RW 04, Ds Mojomalang, Kec Parengan, Kab Tuban";
var lat = -7.107918;
var lng = 111.884146;
var myLatlng = new google.maps.LatLng(lat, lng);
var myOptions = {
    zoom: 19,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
}
var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

var contentString = `<b><h2>${name}</h2><b/><div>${address}</div>`

var infowindow = new google.maps.InfoWindow({
    content: contentString,
});
var marker = new google.maps.Marker({
    position: myLatlng,
    map,
    title: located,
});

infowindow.open({
    anchor: marker,
    map,
    shouldFocus: false,
});

marker.addListener("click", () => {
    infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
    });
});

function generateRoute () {
    $('#desc-route').html('');
    if(!("geolocation" in navigator)) {
        alert('Browser tidak support untuk mengambil lokasi, mohon update browser anda')
        return
    }
    //Dapatkan lat lng lokasi
    navigator.geolocation.getCurrentPosition(pos => {
        var originLat = Number(pos.coords.latitude);
        var originLng = Number(pos.coords.longitude);
        var service = new google.maps.DirectionsService()
        var directionsDisplay = new google.maps.DirectionsRenderer()
        directionsDisplay.setMap(map)

        var request = {
            origin: { lat: originLat, lng: originLng },
            destination: { lat: lat, lng: lng},
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }
        service.route(request,function(result, status) {
            if(status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result)
                var point = result.routes[0].legs[0]
                var teks = point.duration.text
                var hari = teks.replace('days', 'hari')
                var jam = hari.replace('hours', 'jam')
                var menit = jam.replace('mins', 'menit')
                var description = menit + ' (' + point.distance.text + ')'
                $('#desc-route').html(`<div class="alert-main text-center p-3 mb-3">Estimasi perjalanan ${description}</div>`);
            }
        })
    }, err => {
        //Jika tidak mendapatkan lat lng lokasi
        if(err.message == "User denied Geolocation") {
            alert('Mohon izinkan aplikasi untuk mengakses lokasi anda dengan melakukan klik Allow / Izinkan di pengaturan situs')
        }
    })
}

// End Maps

var timer;
var date = $('.countdown').attr('data-date');
if(typeof date != 'undefined') {
    var t = date.split(/[- :]/);
    var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    var compareDate = new Date(d);
    compareDate.setDate(compareDate.getDate());
    timer = setInterval(function () {
        timeBetweenDates(compareDate);
    }, 1000);
    function timeBetweenDates(toDate) {
        var dateEntered = toDate;
        var now = new Date();
        var difference = dateEntered.getTime() - now.getTime();
        if (difference <= 0) {
            clearInterval(timer);
        } else {
            var seconds = Math.floor(difference / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);

            hours %= 24;
            minutes %= 60;
            seconds %= 60;

            $(".days").text(days);
            $(".hours").text(hours);
            $(".minutes").text(minutes);
            $(".seconds").text(seconds);
        }
    }
}

$('.bri-copy').click(function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('.bri').text()).select();
    document.execCommand("copy");
    $temp.remove();
    toastr.options.positionClass = 'toast-bottom-center';
    toastr.success('Berhasil di copy!')
})

$('.dana-copy').click(function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('.dana').text()).select();
    document.execCommand("copy");
    $temp.remove();
    toastr.options.positionClass = 'toast-bottom-center';
    toastr.success('Berhasil di copy!')
})

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
var receivedName = getUrlVars()['name'];
var receivedAddress = getUrlVars()['address'];

if(typeof receivedName != 'undefined' && typeof receivedAddress != 'undefined') {
    $('.received').text(unescape(receivedName));
    $('.address').text(unescape(receivedAddress));
}

$(".scroll-down").click(function() {
    $("html,body").animate({
        scrollTop: $('#content').offset().top
    }, 100);
});