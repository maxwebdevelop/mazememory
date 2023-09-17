// Initialize Firebase and setup the real-time listener...
// (Assuming you have Firebase initialized and startNameCountListener is set up)

// Create a reference to the "players" collection.
const db = firebase.firestore();
const playersRef = db.collection("players");

// Function to handle changes in the count and redirect if needed.
function handleCountChange(count) {
    const peopleJoinedElement = document.getElementById("peopleJoined");
    peopleJoinedElement.innerHTML = `${count}/10`;

    if (count >= 10) {
        window.location.href = "game.html";
    }
}

// Function to start the real-time listener.
function startNameCountListener() {
    playersRef.onSnapshot((querySnapshot) => {
        const count = querySnapshot.size;
        console.log(count);
        handleCountChange(count);
    }, (error) => {
        console.error("Error in real-time listener: ", error);
    });
}

window.onload = () => {
    startNameCountListener();
};
