(function ($) {
    "use strict";
    AOS.init({offset: 0, duration: 800});

    $("#open-invitation").click(function() {
        $("#splash").addClass('closed');
        $(".content").addClass('active');
        $("body").removeClass('no-scroll');
    })

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