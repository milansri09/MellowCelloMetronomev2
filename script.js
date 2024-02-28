var sound1 = new Howl({
  src: "Beat1.55.wav"
})

var Emphasizedsound1 = new Howl ({
  src: "EmphasizedBeat1.wav"
})

var beatPlace = 1;
var beatSpeed = 70;
var beatStart = false;
var minBeats = 10;
var maxBeats = 300;
var beatNumber = 4;
var emphasizedColor = "red";
var unemphasizedColor = "lightblue";
var currentMode = "Manual";
var previousClick = undefined;
var numberClicksFromFirst = 0;
var clickList = [];
var skipList = [];

var emphasizedBeats = {
    1: Emphasizedsound1
}

var emphasizedBeatColor = {
    1: "red"
}

function trianglePlay() {
    if (currentMode == "Tapped") {
        if (numberClicksFromFirst == 0) {
            previousClick = new Date();
            numberClicksFromFirst++;
        }
        else {
            numberClicksFromFirst++;
            var now = new Date();
            var milliseconds = now.getTime() - previousClick.getTime();
            var numberMinutes = milliseconds / 1000 / 60;
            var bpm = numberClicksFromFirst / numberMinutes;

            clickList.push(numberMinutes);
            if (clickList.length > 16) {
                clickList.shift();
            }
            var clickListAverage = 0;
            clickList.map((x) => {
                clickListAverage += x;
                return x;
            })
            clickListAverage /= clickList.length;

            var new_bpm = Math.round(1 / clickListAverage);

            if (new_bpm < 10) {
                new_bpm = 10;
            }
            else if (new_bpm > 300) {
                new_bpm = 300;
            }

            previousClick = new Date();

            document.getElementById("tempo").value = new_bpm;
            document.getElementById("slide").value = new_bpm;
            beatSpeed = new_bpm;
        }
    }
    else {
        beatStart = !beatStart;
        beatPlace = 1;
    }

    updateIndicatorBoxes();
}
document.getElementById("click").addEventListener("click", trianglePlay)

function tempoClick(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log("success");
}
document.getElementById("tempo").addEventListener("click", tempoClick);

var lastPlayed = new Date(); 

function TriPlaySound() {
  if(beatStart == false) return;
  var now = new Date();
    if (now.getTime() - lastPlayed.getTime() >= (60 / beatSpeed) * 1000) {
        if (skipList.includes(beatPlace.toString())) {
            if (emphasizedBeatColor[beatPlace]) {
                document.getElementById("triangle").style.borderBottomColor = emphasizedColor;
            }
            else {
                document.getElementById("triangle").style.borderBottomColor = unemphasizedColor;
            }

            setTimeout(function () {
                document.getElementById("triangle").style.borderBottomColor = "";
            }, 400 - beatSpeed)

            updateIndicatorBoxes();
        }

        else {
            if (emphasizedBeats[beatPlace]) {
                emphasizedBeats[beatPlace].play();
            }
            else {
                sound1.play();
            }

            updateIndicatorBoxes();

            if (emphasizedBeatColor[beatPlace]) {
                document.getElementById("triangle").style.borderBottomColor = emphasizedColor;
            }
            else {
                document.getElementById("triangle").style.borderBottomColor = unemphasizedColor;
            }

            setTimeout(function () {
                document.getElementById("triangle").style.borderBottomColor = "";
            }, 400 - beatSpeed)
        }

      beatPlace++;
      lastPlayed = now;
      if (beatPlace > beatNumber) {
          beatPlace = 1;
      }
  }
}
setInterval(function() {
  TriPlaySound();
}, 10)

function beatNumberChange() {
    beatNumber = Math.abs(parseInt(document.getElementById("numberBeats").value));
    if (beatNumber < 1) {
        beatNumber = 1;
    }
    else if (beatNumber > 200) {
        beatNumber = 200;
    }

    var final_html = "";
    for (var i = 1; i - 1 < beatNumber; i++) {
        final_html += `<option value = "${i}">Beat ${i}</option>`
    }
    document.getElementById("numberBeatSelector").innerHTML = final_html;

    document.getElementById("numberBeats").value = beatNumber;

    updateIndicatorBoxes();
}
document.getElementById("numberBeats").addEventListener("change", beatNumberChange);

function tempoChange() {
    beatSpeed = Math.abs(parseInt(document.getElementById("tempo").value));
    if (beatSpeed < minBeats) {
        beatSpeed = minBeats;
    }
    else if (beatSpeed > maxBeats) {
        beatSpeed = maxBeats;
    }
    document.getElementById("tempo").value = beatSpeed;
    document.getElementById("slide").value = beatSpeed;
}
document.getElementById("tempo").addEventListener("change", tempoChange);

function sliderTempo() {
    beatSpeed = document.getElementById("slide").value;
    document.getElementById("tempo").value = beatSpeed;
}
document.getElementById("slide").addEventListener("mousemove", sliderTempo);
document.getElementById("slide").addEventListener("change", sliderTempo);

function emphasizedColorPick() {
    var oldEmphasizedColor = emphasizedColor;
    emphasizedColor = document.getElementById("emphasizedColor").value;
    var keys = Object.keys(emphasizedBeatColor);
    for (var i = 0; i < keys; i++) {
        var value = emphasizedBeatColor[keys[i]];
        if (value == oldEmphasizedColor) {
            emphasizedBeatColor[keys[i]] = emphasizedColor;
        }
    }

    updateIndicatorBoxes();
}
document.getElementById("emphasizedColor").addEventListener("change", emphasizedColorPick);

function unemphasizedColorPick() {
    unemphasizedColor = document.getElementById("unemphasizedColor").value;

    updateIndicatorBoxes();
}
document.getElementById("unemphasizedColor").addEventListener("change", unemphasizedColorPick);

function pickEmphasis() {
    var currentBeatNumber = document.getElementById("numberBeatSelector").value;
    var checkboxValue = document.getElementById("isEmphasized").checked;

    if (checkboxValue == true) {
        emphasizedBeatColor[currentBeatNumber] = emphasizedColor;
        emphasizedBeats[currentBeatNumber] = Emphasizedsound1;
    }
    else {
        emphasizedBeatColor[currentBeatNumber] = undefined
        emphasizedBeats[currentBeatNumber] = undefined;
    }

    updateIndicatorBoxes();
}
document.getElementById("isEmphasized").addEventListener("change", pickEmphasis);

function skip() {
    var currentBeatNumber = document.getElementById("numberBeatSelector").value;
    var checkboxValue = document.getElementById("isSkipped").checked;

    if (checkboxValue == true) {
        skipList.push(currentBeatNumber);
    }

    else {
        skipList = skipList.filter(x => x != currentBeatNumber);
    }

    updateIndicatorBoxes();
}
document.getElementById("isSkipped").addEventListener("change", skip);

function emphasisCheckbox() {
    var currentBeatNumber = document.getElementById("numberBeatSelector").value;

    if (emphasizedBeats[currentBeatNumber] != undefined) {
        document.getElementById("isEmphasized").checked = true;
    }
    else {
        document.getElementById("isEmphasized").checked = false;
    }

    if (skipList.includes(currentBeatNumber)) {
        document.getElementById("isSkipped").checked = true;
    }
    else {
        document.getElementById("isSkipped").checked = false;
    }

    updateIndicatorBoxes();
}
document.getElementById("numberBeatSelector").addEventListener("change", emphasisCheckbox);

function updateIndicatorBoxes() {
    var final_html = "";

    for (var i = 0; i < beatNumber; i++) {
        var isEmphasized = emphasizedBeats[i + 1] != undefined;
        var isPlayed = beatStart && beatPlace == (i + 1);
        var isSkipped = skipList.includes((i + 1).toString());
        final_html += `<div class="indicatorBox" style="background-color: ${isEmphasized ? emphasizedColor : unemphasizedColor}; ${isPlayed ? "border: 2px solid white" : ""}">
            ${isSkipped ? "<span class='indicatorX'>&#x2715;</span>" : ""}</div>`
    }

    document.getElementById("allIndicators").innerHTML = final_html;
}

function manualButtonTapped() {
    currentMode = "Manual";
    document.getElementById("manualMode").style.backgroundColor = "orange";
    document.getElementById("tappedMode").style.backgroundColor = "white";
}
document.getElementById("manualMode").addEventListener("click", manualButtonTapped);

function tappedButtonTapped() {
    currentMode = "Tapped";
    clickList = [];
    numberClicksFromFirst = 0;
    document.getElementById("tappedMode").style.backgroundColor = "orange";
    document.getElementById("manualMode").style.backgroundColor = "white";
}
document.getElementById("tappedMode").addEventListener("click", tappedButtonTapped);

updateIndicatorBoxes();