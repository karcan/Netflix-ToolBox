let ntb_ui;

ntb_ui = {
  init : ()=>{
    $(document).ready(function(){
      $('#ver').text("V" + chrome.runtime.getManifest().version);
    })
    
    chrome.storage.sync.get(function(result) {
      // stroage'da option yok ise oluşturalım.
      if(!result.options)
        chrome.storage.sync.set({options : ntb_ui.arrayToObject(ntb_ui.defaultOption)});

      ntb_ui.syncOptions();
      $('#save').click(ntb_ui.setOptions);
    });
  },
  lang : (window.navigator.userLanguage || window.navigator.language).toUpperCase(),
  defaultOption : {
    "duration/isActive" : true,
    "duration/opacity" : 1,
    "duration/second" : 5,
    "duration/fontSize" : "nm",
    "duration/showMovieName" : true,
    "duration/showSeasonEpisodeName" : true ,

    "mini/isActive" : false,
    "mini/opacity" : 1,
    "mini/textPosition" : "topRight",
    "mini/fontSize" : "nm",
    "mini/showMovieName" : true,
    "mini/showSeasonEpisodeName" : true,

    "volume/isActive" : false,
    "volume/level" : 1,

    "skip/isActive" : false,
    "skip/credit" : true,
    "skip/recap" : true
  },
  // storage'da ki ayarlara göre form değerlerini otomatik ayarlar.
  syncOptions : ()=>{
    ntb_ui.getOptions().then(data=>{
      for(var [key,value] of Object.entries(data)){
        let el = $('form[name="settings"]').find("[name='" + key + "']");

        if($(el).attr("type") == "checkbox")
          $(el).prop("checked", value);
        else
          $(el).val(value).trigger("change");
      }
    });
  },
  getOptions : async ()=>{
    let obj={};
    return new Promise((resolve, reject) => {
      try {
          chrome.storage.sync.get(function (value) {
            if(typeof value.options == "object"){
              for(var [key,value] of Object.entries(value.options)){
                for(var [key1,value1] of Object.entries(value)){
                    obj[key + "/" + key1] = value1;
                }
              }
              resolve(obj);
            }
          })
      }
      catch (ex) {
          reject(ex);
      }
    });

  },
  setOptions : ()=>{
    chrome.storage.sync.set({options : ntb_ui.formToObject($('form[name="settings"] input,select'))}),alert(lang["saveAlert"][ntb_ui.lang]);
  },
  // verilen formu yarı object'e dönüştürür.
  formToObject : (form)=>{
    let a = [];
  
    $(form).map((k,v)=>{
        if($(v).prop('name')){
            if($(v).is("[type='checkbox']")){
                a[$(v).attr("name")] = $(v).prop("checked");
            }else{
                a[$(v).attr("name")] = $(v).val();
            }
        }
    });

    return ntb_ui.arrayToObject(a);
  },
  // form'dan dönüşen arrayObject'i Object'e dönüştürür.
  arrayToObject : (array)=>{
    let result={};
    for (var [key,value] of Object.entries(array)){
      let obj = key.split('/');
      for(var item in obj){
          if(parseInt(item) + 1 == obj.length)
              result[obj[item - 1]][obj[item]] = value;
          else{
              if(!result.hasOwnProperty(obj[item]))
                  result[obj[item]] = {}
          }
      }
    }
    return result;
  }
}

ntb_ui.init();


$(document).ready(function() {

  const $valueSpan = $('.valueSpan');
  const $value = $('#slider11');
  $valueSpan.html($value.val());
  $value.on('input change', () => {

    $valueSpan.html($value.val());
  });
});


$(document).ready(function() {

  const $valueSpan = $('.miniOpacityValue');
  const $value = $('#miniOpacitySlider');
  $valueSpan.html(($value.val() * 100).toString() + " %");
  $value.on('input change', () => {

    $valueSpan.html(($value.val() * 100).toString() + " %");
  });
});


$(document).ready(function() {

  const $valueSpan = $('.durationOpacityValue');
  const $value = $('#durationOpacitySlider');
  $valueSpan.html(($value.val() * 100).toString() + " %");
  $value.on('input change', () => {

    $valueSpan.html(($value.val() * 100).toString() + " %");
  });
});

$(document).ready(function() {

  const $valueSpan = $('.volumeValue');
  const $value = $('#volumeSlider');
  $valueSpan.html(parseInt(($value.val() * 100)).toString() + " %");
  $value.on('input change', () => {

    $valueSpan.html(parseInt(($value.val() * 100)).toString() + " %");
  });
});



$('.language span').on('click',function(e){
    var self = $(this);
    var selectedLang = $(this)[0].id;
    ntb_ui.lang = selectedLang;

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
    $('.language span#'+ ln.toUpperCase())[0].click();
});
