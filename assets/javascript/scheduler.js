var config = {
    apiKey: "AIzaSyDBC28FikfwnBp3DH8JY2zWLgkmG9GpRq4",
    authDomain: "train-scheduler-76099.firebaseapp.com",
    databaseURL: "https://train-scheduler-76099.firebaseio.com",
    projectId: "train-scheduler-76099",
    storageBucket: "train-scheduler-76099.appspot.com",
    messagingSenderId: "665838281193"
};
firebase.initializeApp(config);
var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var minutesAway = 0;
var lastTrainMinutesAgo = 0;
var nextTrain = "";

function persistTrainInfo() {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = parseInt($("#frequency").val().trim());

    if (!moment(firstTrainTime, "HH:mm").isValid()) {
        console.log("First Train Time must be 24hr time");
    } else if (frequency < 0) {
        console.log("Frequency must be a number greater than 0")
    } else {
        calcNextArrival();

        var train = {
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            nextTrain: nextTrain,
            minutesAway: minutesAway
        }

        database.ref().push(train);

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train-time").val("");
        $("#frequency").val("");
    }
}

function calcNextArrival() {
    firstTrainTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");

    lastTrainMinutesAgo = (moment().diff(firstTrainTime, "minutes")) % frequency;
    minutesAway = frequency - lastTrainMinutesAgo;
    nextTrain = moment().add(minutesAway, "minutes");

    firstTrainTime = moment(firstTrainTime).format("HH:mm");
    nextTrain = moment(nextTrain).format("HH:mm");
}

function displaySchedule(childSnapshot, prevChildKey) {

    $("#train-schedule").append(`
        <tr>
            <td>${childSnapshot.val().trainName}</td>
            <td>${childSnapshot.val().destination}</td>
            <td>${childSnapshot.val().frequency}</td>
            <td>${childSnapshot.val().nextTrain}</td>
            <td>${childSnapshot.val().minutesAway}</td>
        </tr>
    `)
}

$("#train-submit").on("click", persistTrainInfo);

database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    displaySchedule(childSnapshot, prevChildKey);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

