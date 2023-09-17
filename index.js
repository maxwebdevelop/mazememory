let playerName;

function startGame() {
    playerName = document.getElementById('playerName').value;
    const loadingElement = document.getElementById('loading');

    if (playerName) {
        if (containsInappropriateWords(playerName)) {
            alert("Please choose a different name without inappropriate words.");
            return;
        }
        // Check for duplicates before saving the name.
        checkForDuplicates(playerName)
            .then((duplicateExists) => {
                if (duplicateExists) {
                    alert("This name is already in use. Please choose a different name.");
                    loadingElement.style.display = "none";
                } else {
                    loadingElement.style.display = "block";
                    saveNameToFirebase(playerName)
                        .then(() => {
                            checkNameCount()
                                .then(count => {
                                    if (count < 10) {
                                        window.location.href = "stillWaiting.html";
                                    } else {
                                        window.location.href = "game.html";
                                    }
                                    // Hide loading and other elements.
                                    loadingElement.style.display = "none";
                                    document.getElementById('EnterName').hidden = true;
                                    document.getElementById('gameWelcome').hidden = true;
                                })
                                .catch(error => {
                                    console.error("Error checking name count: ", error);
                                    loadingElement.style.display = 'none';
                                    alert("An error occurred while checking the name count. Please try again later.");
                                });
                        })
                        .catch((error) => {
                            console.error("Error saving name to Firebase: ", error);
                            loadingElement.style.display = 'none';
                            alert("An error occurred while saving your name. Please try again later.");
                        });
                }
            })
            .catch((error) => {
                console.error("Error checking for duplicates: ", error);
                loadingElement.style.display = 'none';
                alert("An error occurred while checking for duplicates. Please try again later.");
            });
    } else {
        alert("Please enter your name!");
    }
}

const inappropriateWords = ["fuck", "pigfucker", "ass", "shit", "shit ass", "butt", "buttface", "idiot", "assbag", "assbite", "assface", "jerk", "asswipe"];

function containsInappropriateWords(name) {
    const lowerCaseName = name.toLowerCase();
    for (const word of inappropriateWords) {
        if (lowerCaseName.includes(word.toLowerCase())) {
            return true;
        }
    }
    return false;
}

function checkNameCount() {
    const db = firebase.firestore();
    return db.collection("players").get()
        .then((querySnapshot) => {
            return querySnapshot.size;
        })
        .catch((error) => {
            console.error("Error getting document count: ", error);
            throw error;
        });
}

function checkForDuplicates(name) {
    const db = firebase.firestore();
    return db.collection("players")
        .where("name", "==", name)
        .get()
        .then((querySnapshot) => {
            return !querySnapshot.empty;
        })
        .catch((error) => {
            console.error("Error checking for duplicates: ", error);
            throw error;
        });
}

function saveNameToFirebase(name) {
    const db = firebase.firestore();
    return db.collection("players").add({
        name: name,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        throw error;
    });
}
