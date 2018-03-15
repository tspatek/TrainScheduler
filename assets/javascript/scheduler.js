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

function processTrainInfo() {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();

    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    }

    console.log(database.ref().push(newTrain));

    $("#train-name").val(" ");
    $("#destination").val(" ");
    $("#first-train-time").val(" ");
    $("#frequency").val(" ");

    console.log("got here");
}





$("#train-submit").on("click", processTrainInfo);