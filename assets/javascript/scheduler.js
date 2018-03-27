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

function addNewTrain() {
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

    nextTrain = moment(nextTrain).format("HH:mm");
    firstTrainTime = moment(firstTrainTime).format("HH:mm");
}

function displaySchedule(snapshot) {
    $("#train-schedule").empty();

    snapshot.forEach(function (childSnapshot) {
        $("#train-schedule").append(`
            <tr>
                <td>${childSnapshot.val().trainName}</td>
                <td>${childSnapshot.val().destination}</td>
                <td>${childSnapshot.val().frequency}</td>
                <td>${childSnapshot.val().nextTrain}</td>
                <td>${childSnapshot.val().minutesAway}</td>
            </tr>
        `)
    })
}

function updateTime() {
    database.ref().once("value", function (snapshot) {
        console.log(snapshot);

        snapshot.forEach(function (childSnapshot) {
            trainName = childSnapshot.val().trainName;
            destination = childSnapshot.val().destination;
            firstTrainTime = childSnapshot.val().firstTrainTime;
            frequency = childSnapshot.val().frequency;
            nextTrain = childSnapshot.val().nextTrain;
            minutesAway = childSnapshot.val().minutesAway;
            var key = childSnapshot.key;

            calcNextArrival();

            database.ref(key).update({
                nextTrain: nextTrain,
                minutesAway: minutesAway
            });
        })
    });
}

$("#train-submit").on("click", addNewTrain);

database.ref().on("value", function (snapshot) {
    displaySchedule(snapshot);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// setInterval(updateTime, 60000);
$(window).on("load", updateTime);



