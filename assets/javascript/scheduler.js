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

var now = "";
var minutesAway = 0;
var lastTrain = "";
var nextTrain = "";

function calcNextArrival() {
    now = moment();
    lastTrain = (now.diff(firstTrainTime, "minutes", true)) % frequency;
    nextTrain = lastTrain + frequency;
}

function displaySchedule() {

    database.ref().on("child_added", function (snapshot) {

        $("#train-schedule").append(`
            <tr>
                <td>${snapshot.val().trainName}</th>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>${snapshot.val().nextTrain}</td>
                <td>${snapshot.val().minutesAway}</td>
            </tr>
        `)

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
}

function processTrainInfo() {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();


    if (!moment(firstTrainTime, "HH:mm").isValid()) {
        console.log("First Train Time must be 24hr time");
    } else if (frequency < 0) {
        console.log("Frequency must be a number greater than 0")
    } else {
        var train = {
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        }

        database.ref().push(train);

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train-time").val("");
        $("#frequency").val("");

        calcNextArrival();

        minutesAway = nextTrain.diff(now, "minutes");

        displaySchedule();
    }
}

$("#train-submit").on("click", processTrainInfo);