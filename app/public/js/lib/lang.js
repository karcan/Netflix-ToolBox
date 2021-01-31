var lang = {
  	durationName : {
  		TR : "Zamanlı Film Adı",
  		EN : "Duration Movie Name"
  	},
    opacity : {
      TR : "Görünürlük",
      EN : "Opacity"
    },
    durationSecond : {
      TR : "Süresi (saniye)",
      EN : "Duration (second)"
    },
    fontSize : {
      TR : "Yazı Boyutu",
      EN : "Font Size"
    },
    small : {
      TR : "Küçük",
      EN : "Small"
    },
    normal : {
      TR : "Normal",
      EN : "Normal"
    },
    medium : {
      TR : "Orta",
      EN : "Medium"
    },
    large : {
      TR : "Büyük",
      EN : "Large"
    },
    movieName : {
      TR : "Film Adı",
      EN : "Movie Name"
    },
    seasonEpisodeName : {
      TR : 'Sezon & Bölüm Adı',
      EN : 'Season & Ep. Name'
    },
    miniMovieName : {
      TR : "Küçük Film Adı",
      EN : "Mini Movie Name"
    },
    textPosition : {
      TR : "Yazı Konumu",
      EN : "Text Position"
    },
    topRight : {
      TR : "Sağ Üst",
      EN : "Top - Right"
    },
    topLeft : {
      TR : "Sol Üst",
      EN : "Top - Left"
    },
    bottomRight : {
      TR : "Sağ Alt",
      EN : "Bottom - Right"
    },
    bottomLeft : {
      TR : "Sol Alt",
      EN : "Bottom - Left"
    },
    fixedVolume : {
      TR : "Sabit Ses",
      EN : "Fixed Volume"
    },
    volumeLevel : {
      TR : "Ses Seviyesi",
      EN : "Volume Level"
    },
    skips : {
      TR : "Atlamalar",
      EN : "Skips"
    },
    skipRecap : {
      TR : "Özetleri Otomatik Geç",
      EN : "Skip Recaps Auto. (review)"
    },
    skipCredit : {
      TR : "Introları Otomatik Geç",
      EN : "Skip Credits Auto. (intro)"
    },
    jumpTo : {
      TR : "Atla (Zaman ve Bölümler Arası)",
      EN : "Jump To Manuelly (Time & Between Ep.)"
    },
    ifYouLike : {
  	  TR : "Eğer beğendiysen, neden bağış yapmayasın ki ? :) ",
      EN : "If you like it, why not donate ? :)"
    },
    visiOnPatreon : {
  	  TR : "Mevcut ve geliştirme aşamasında olan uygulamalarımızdan haberdar olmak için patreon'u ziyaret et.\n\nGeri bildirimleriniz geliştirme ve benim için çok değerli.",
      EN : "Be sure to visit patreon for current and in progress developments.\n\nYour feedback is very important to development and me."
    },
    hotKeys : {
  	  TR : "Kısayol Tuşları",
      EN : "HotKeys"
    },
    save : {
  	  TR : "Kaydet",
      EN : "Save"
    },
    donate : {
  	  TR : "Teşekkür Et ( Bağış )",
      EN : "Give Thanks ( Donate )"
    },
    saveAlert : {
      TR : "Ayarlar kaydedildi ( Netflix sayfasını yenilemeniz gerekmektedir )",
      EN : "Settings saved ( You need to refresh the Netflix page )"
    }
  };

$('.language span').on('click',function(e){
    var self = $(this);
  	var selectedLang = $(this)[0].id;

    if(! $(self).hasClass('active')){
      $('.language span').toggleClass("active");
    }


    // language changer for lang elements
    $.each($('lang'), function(k,v){
      var self = v;
      var ln = $(v).attr('ln');

      if(!lang[ln]){
        console.log("Language : \"" + ln + "\" not found");
        $(self)[0].innerText = "{lang=" + ln + "}";
      }else{
        $(self)[0].innerText = lang[ln][selectedLang];
      }


    });

    // language changer for lang class (select/option etc.)
    $.each($('.lang'), function(k,v){
      var self = v;
      var ln = $(v).attr('ln');

      if(!lang[ln]){
        console.log("Language : \"" + ln + "\" not found");
      }else{
        $(self)[0].innerText = lang[ln][selectedLang];
      }
    });

  });


$(document).ready(function() {
  var ln = window.navigator.userLanguage || window.navigator.language;
  if(ln=="tr-TR" || ln=="tr"){
    $('.language span#TR')[0].click();
  }
});