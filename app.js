// Initialize Firebase
var config = {
    apiKey: "AIzaSyAhVRx0U2JX1UQ4lFZPX0-Ln8lziQN3GBc",
    authDomain: "train-scheduler-52a2b.firebaseapp.com",
    databaseURL: "https://train-scheduler-52a2b.firebaseio.com",
    projectId: "train-scheduler-52a2b",
    storageBucket: "train-scheduler-52a2b.appspot.com",
    messagingSenderId: "803363727779"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrain = "hh:mm";
var frequency = 0;

// Capture button click
$("#add-train").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    // Code for storing and retrieving train schedules
    // Provide initial data to Firebase database

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    if (trainName !== "" && destination !== "" && firstTrain !== "" && frequency !== "") {
        database.ref().push( {
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        });
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");
    } else {
        alert("Please do not leave any fields blank.");
    };

    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrain);
    // console.log(frequency);

});

// Firebase watcher and initial loader
database.ref().on("child_added", function(snapshot) {
    
    // Define-Log everything coming out of snapshot
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrain = snapshot.val().firstTrain;
    frequency = parseInt(snapshot.val().frequency);

    // add table divs
    var trainSchedule = $("#trainSchedule");
    var newRow = $("<tr>");
    newRow.attr("style", "font-family:'Special Elite', cursive; font-size: 22px");
    var trainNameCell = $("<td>");
    var destinationCell = $("<td>");
    var frequencyCell = $("<td>");
    var nextArrivalCell = $("<td>");
    var minutesAwayCell = $("<td>");

    // fill table divs with data from Firebase database
    trainNameCell.text(trainName);
    destinationCell.text(destination);
    frequencyCell.text(frequency);

    // calculate nextArrival and minutesAway
    // nextArrival = firstTrainTime + snapshot.val().frequency * totalTrains
    var now = moment();

    var firstTrainTime = moment(firstTrain, "hh:mm A");
    var elapsedTime = now.diff(moment(firstTrainTime), "m");
    
    if (elapsedTime > 0) {
        var totalTrains = Math.floor(elapsedTime / frequency);
        var nextTrainNumber = Math.ceil(elapsedTime / frequency);
    } else {
        var totalTrains = 0;
        var nextTrainNumber = 0;
    }

    var nextArrival = moment(firstTrainTime).add(frequency * nextTrainNumber, "m");
    var minutesAway = Math.floor(parseInt(moment(nextArrival).diff(now, "m"))) + 1;
    
    // fill table divs with nextArrival and minutesAway data
    nextArrivalCell.text(nextArrival.format("hh:mm A"));
    minutesAwayCell.text(minutesAway);

    console.log(snapshot.val());
    console.log("Train Name: " + trainName);
    console.log("Destination: " + destination);
    console.log("The first train left at: " + firstTrainTime.format("hh:mm A"));
    console.log("Frequency: " + frequency);
    console.log("Time Since First Train: " + elapsedTime);
    console.log("The time is " + now.format("hh:mm A"));
    console.log("Next Arrival: " + nextArrival.format("hh:mm A"));
    console.log("Minutes Away: " + minutesAway);
    console.log("There have been " + totalTrains + " trains");
    console.log("There will be " + nextTrainNumber + " trains");

    // add new rows to Train Schedule Table
    newRow.append(trainNameCell);
    newRow.append(destinationCell);
    newRow.append(frequencyCell);
    newRow.append(nextArrivalCell);
    newRow.append(minutesAwayCell);

    trainSchedule = $("#trainSchedule");
    trainSchedule.append(newRow);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors Handled: " + errorObject.code);
});