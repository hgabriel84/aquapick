var score;
var cardsmatched;
var crono;
var page = $('.page');
var pagenameWelcome = 'welcome';
var pagenameGame = 'game';
var pagenameThanks = 'thanks';
var uiWelcomeContent = $('#welcome_content');
var uiThanksContent = $('#thanks_content');
var uiWrapper = $('#wrapper');
var uiCardsWrapper = $('#cards_wrapper');
var uiPairs = $('#nr_pairs');
var uiPlay = $('#bt_play');
var uiIntro = $('#game_intro');
var uiCards = $('#cards');
var uiRank1 = $('.rank_1');
var uiRank2 = $('.rank_2');
var uiRank3 = $('.rank_3');
var uiScore = $('#gameScore');
var uiConfig = $('#config');
var uiModal = $('#modal');
var uiModalConfig = $('#modal_config');
var uiConfigPassword = $('#config_password');
var uiConfigInner = $('#config_inner');
var uiConfigHighscores = $('#config_highscores');
var uiSeconds = $('#seconds');
var inForm = $('#in_form');
var inFormPassword = $('#in_form_password');
var inFormPairs = $('#in_form_pairs');
var inPassword = $('#in_password');
var inNrPairs = $("#in_nr_pairs");
var inName = $('#in_name');
var inClinic = $('#in_clinic');
var inAddress = $('#in_address');
var inEmail = $('#in_email');
var inPhone = $('#in_phone');
var inSave = $('#save');
var btSetNrPairs = $('#bt_pairs');
var btExportCSV = $('#bt_export_csv');
var btReset = $('#bt_reset');
var btPassword = $('#bt_password');
var btClose = $('#bt_close');

//create deck array
var matchingGame = {};

$(function() {
  init();
  show(pagenameWelcome);
});

//initialise game
function init() {

  //set localStorage
  if (!localStorage.highscores) {
    localStorage.highscores = JSON.stringify([]);
  }
  if (!localStorage.contacts) {
    localStorage.contacts = JSON.stringify([]);
  }
  if (!localStorage.pairs) {
    localStorage.pairs = 10;
  }

  // init global variables
  playGame = false;
  uiCardsWrapper.hide();
  uiPairs.html(localStorage.pairs);

  // show highscores
  if(localStorage.highscores) {
    // rankings will only show the 3 best scores
    var cnt = 3;
    var topScoresConfig = "<br/>";
    var highscores = JSON.parse(localStorage["highscores"]);

    $.each(highscores, function(key, value) {
      var timeText = getFriendlyTime(value.time);
      var rank = (key + 1) + " " + value.name + " " + timeText;
      if (cnt > 0) {
        if(key == 0) {
          uiRank1.html(rank);
        } else if (key == 1) {
          uiRank2.html(rank);
        } else if (key == 2) {
          uiRank3.html(rank);
        }
      }
      topScoresConfig += rank + "<br/>";
      --cnt;
    });
    uiConfigHighscores.html(topScoresConfig);
  }

  //set number of pairs needed to win game
  btSetNrPairs.click(function(e) {
    inFormPairs.submit();
    var nr = inNrPairs.serialize();
    nr = nr.substring(nr.indexOf('=') + 1);
    localStorage.pairs = nr;
  });

  //export contacts to csv file
  btExportCSV.click(function(e) {
    if (localStorage.contacts) {
      JSONToCSVConvertor(localStorage.contacts, "contactos", true);
    }
  });

  // delete data
  btReset.click(function(e) {
    localStorage.highscores = JSON.stringify([]);
    localStorage.contacts = JSON.stringify([]);
    localStorage.pairs = 10;
  });

  // close config modal, refresh page to reflect changes
  btClose.click(function(e) {
    e.preventDefault();
    location.reload();
  });

  // navigate from welcome to play game
  uiWelcomeContent.click(function() {
    show(pagenameGame);
  });

  // navigate from thanks to welcome
  uiThanksContent.click(function() {
    show(pagenameWelcome);
  });

  // modal init
  uiModal.modal({
    backdrop: 'static',
    keyboard: false
  });
  uiModal.modal('hide');

  // save user data
  inSave.click(function(e) {
    e.preventDefault();
    save();
  });

  // start game
  uiPlay.click(function(e) {
    e.preventDefault();
    uiIntro.hide();
    startGame();
  });

  // show config modal
  uiConfig.click(function(e) {
    e.preventDefault();
    uiModalConfig.modal('show');
    uiConfigPassword.show();
    uiConfigInner.hide();
  });

  // validate password and show config interface
  btPassword.click(function(e) {
    e.preventDefault();
    inFormPassword.submit();
    var password = inPassword.val();
    if(password == "aquapick") {
      uiConfigInner.show();
      uiConfigPassword.hide();
    }
    inPassword.val("");
  });

  // prevent submit of form
  inForm.submit(function(event) {
    event.preventDefault();
  });
  inFormPassword.submit(function(event) {
    event.preventDefault();
  });
  inFormPairs.submit(function(event) {
    event.preventDefault();
  });
}

//start game and create cards from deck array
function startGame() {
  matchingGame.deck = ['pair01', 'pair01', 'pair02', 'pair02', 'pair03', 'pair03', 'pair04', 'pair04', 'pair05', 'pair05', 'pair06', 'pair06', 'pair07', 'pair07', 'pair08', 'pair08', 'pair09', 'pair09', 'pair10', 'pair10', ];
  uiCardsWrapper.show();
  uiCards.html("<div class='card'><div class='face front'></div><div class='face back'></div></div>");
  score = new Date().getTime();
  cardsmatched = 0;
  crono = 0;

  if (playGame == false) {
    // set global variable
    playGame = true;

    // set cards container height
    uiCards.css({
      "height": (uiWrapper.height() - 60)
    });

    // shuffle cards and show them
    matchingGame.deck.sort(shuffle);
    for (var i = 0; i < 19; i++) {
      $(".card:first-child").clone().appendTo("#cards");
    }

    // default values, they'll be override
    var cardWidth = 150;
    var cardHeight = 150;

    // portrait mode
    if(uiCards.height() > uiCards.width()) {
      cardWidth = (uiCards.width() - 100) / 5;
      cardHeight = cardWidth;
      var vpad = 0; //(uiCards.height() - (4 * cardWidth)) / 5;
      var hpad = 0;
    } else {
      // landscape mode
      cardHeight = uiCards.height() / 4;
      cardWidth = cardHeight;
      var hpad = 0; //((uiCards.width() - 100) - (5 * cardWidth)) / 6;
      var vpad = 0;
    }

    // initialize each card's position
    uiCards.children().each(function(index) {
      // align the cards to be 4x5 ourselves.
      $(this).css({
        "width": cardWidth,
        "height": cardHeight,
        "left": (cardWidth + hpad) * (index % 5) + hpad,
        "top": (cardHeight + vpad) * Math.floor(index / 5) + vpad
      });

      // get a pattern from the shuffled deck
      var pattern = matchingGame.deck.pop();
      // visually apply the pattern on the card's back side.
      $(this).find(".back").addClass(pattern);
      // embed the pattern data into the DOM element.
      $(this).attr("data-pattern", pattern);
      // listen the click event on each card DIV element.
      $(this).click(selectCard);
    });
  };
  timer();
}

// shuffle cards
function shuffle() {
  return 0.5 - Math.random();
}

// onclick function add flip class and then check to see if cards are the same
function selectCard() {
  // we do nothing if there are already two cards flipped.
  if ($(".card-flipped").size() > 1) {
    return;
  }
  $(this).addClass("card-flipped");
  // check the pattern of both flipped card 0.7s later.
  if ($(".card-flipped").size() == 2) {
    setTimeout(checkPattern, 700);
  }
}

// if pattern is same remove cards otherwise flip back
function checkPattern() {
  if (isMatchPattern()) {
    $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
    if (document.webkitTransitionEnd) {
      $(".card-removed").bind("webkitTransitionEnd", removeTookCards);
    } else {
      removeTookCards();
    }
  } else {
    $(".card-flipped").removeClass("card-flipped");
  }
}

// put 2 flipped cards in an array then check the image to see if it's the same.
function isMatchPattern() {
  var cards = $(".card-flipped");
  var pattern = $(cards[0]).data("pattern");
  var anotherPattern = $(cards[1]).data("pattern");
  return (pattern == anotherPattern);
}

// check to see if all cardmatched variable is less than N pairs if so remove card only otherwise remove card and end game
function removeTookCards() {
  if (++cardsmatched < localStorage.pairs) {
    $(".card-removed").remove();
  } else {
    // game over, no more cards to flip
    $(".card-removed").remove();
    score = new Date().getTime() - score;
    uiScore.html(getFriendlyTime(score));
    playGame = false;
    uiCardsWrapper.hide();
    uiModal.modal('show');
  }
}

// gets millis in friendly format (ss dd)
function getFriendlyTime(time) {
  var secs = Math.floor((time) / 1000);
  var decs = time.toString().substring(time.toString().length - 3, time.toString().length - 1);
  return secs + "s" + decs;
}

function timer() {
    if (playGame) {
      scoreTimeout = setTimeout(function() {
        uiSeconds.html(++crono);   
        timer();
      }, 1000);
    };
};

// save user data in cookie with json. if top10 it'll go to highscores
function save() {
  inForm.submit();
  if (inForm.valid()) {
    //input user data
    var name = inName.val();
    name = name.substring(name.indexOf('=') + 1);
    var clinic = inClinic.val();
    clinic  = clinic .substring(clinic .indexOf('=') + 1);
    var address = inAddress.val();
    address = address.substring(address.indexOf('=') + 1);
    var phone = inPhone.val();
    phone = phone.substring(phone.indexOf('=') + 1);
    var email = inEmail.val();
    email = email.substring(email.indexOf('=') + 1);
    var time = score;

    //save current score
    var currentScore = new Object();
    currentScore.name = name;
    currentScore.time = time;

    //save user data
    var contact = new Object();
    contact.name = name;
    contact.clinic = clinic;
    contact.address = address;
    contact.phone = phone;
    contact.email = email;
    contact.score = getFriendlyTime(time);
    contact.time = time;

    //check if is highscore and save it
    var highscores = JSON.parse(localStorage["highscores"]);
    var contacts = JSON.parse(localStorage["contacts"]);
    
    highscores.push(currentScore);
    contacts.push(contact);

    highscores.sort(function(a, b) {
      return parseFloat(a.time) - parseFloat(b.time);
    });
    contacts.sort(function(a, b) {
      return parseFloat(a.time) - parseFloat(b.time);
    });

    // has 6 highscores, time to let go the worst score
    if(highscores.length > 5) {
      highscores.pop();
      contacts.pop();
    }

    // rankings will only show the 3 best scores
    var cnt = 3;
    var topScoresConfig = "<br/>";

    $.each(highscores, function(key, value) {
      var timeText = getFriendlyTime(value.time);
      var rank = (key + 1) + " " + value.name + " " + timeText;
      if (cnt > 0) {
        if(key == 0) {
          uiRank1.html(rank);
        } else if (key == 1) {
          uiRank2.html(rank);
        } else if (key == 2) {
          uiRank3.html(rank);
        }
      }
      topScoresConfig += rank + "<br/>";
      --cnt;
    });
    uiConfigHighscores.html(topScoresConfig);

    // save highscores in localstorage
    localStorage["highscores"] = JSON.stringify(highscores);

    // save contacts in localstorage
    localStorage["contacts"] = JSON.stringify(contacts);

    //clear input data
    inName.val("");
    inClinic.val("");
    inAddress.val("");
    inPhone.val("");
    inEmail.val("");

    uiModal.modal('hide');
    uiIntro.show();
    show(pagenameThanks);
  }
}

inForm.validate({
  rules: {
    in_name: {
      required: true
    },
    in_clinic: {
      required: true
    },
    in_address: {
      required: true
    },
    in_email: {
      required: true
    },
    in_phone: {
      required: true
    },
  },
  messages: {
    in_name: "Insira nome",
    in_clinic: "Insira clínica",
    in_address: "Insira localidade",
    in_email: "Insira email",
    in_phone: "Insira contacto telefónico",
  },
  highlight: function(element) {
    $(element).closest('.form-group').addClass('has-error');
  },
  unhighlight: function(element) {
    $(element).closest('.form-group').removeClass('has-error');
  },
  errorElement: 'span',
  errorClass: 'help-block',
  errorPlacement: function(error, element) {
    if (element.parent('.input-group').length) {
      error.insertAfter(element.parent());
    } else {
      error.insertAfter(element);
    }
  }
});

function show(id) {
  page.hide();
  $('#' + id).show();
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  var CSV = '';

  CSV += ReportTitle + '\r\n\n';

  if (ShowLabel) {
    var row = "";
    for (var index in arrData[0]) {
      row += index + ',';
    }
    row = row.slice(0, -1);
    CSV += row + '\r\n';
  }

  for (var i = 0; i < arrData.length; i++) {
    var row = "";
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }
    row.slice(0, row.length - 1);
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert("Invalid data");
    return;
  }

  var fileName = ReportTitle;
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
  window.location.href = uri;
}