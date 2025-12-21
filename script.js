let leftBody = document.getElementById('leftBody');
let submitBtn = document.getElementById('submitBtn');
let container = document.getElementById('container');
let subInput = document.getElementById('subInput');
let rightQuesInput = document.getElementById('rightQuesInput');
let responseName = document.getElementById('responseName');
let comment = document.getElementById('comment');
let responseSubmitBtn = document.getElementById('responseSubmitBtn');
let rightTemplate = document.getElementById('rightTemplate');
let firstRight = document.getElementById('firstRight');
let secondRight = document.getElementById('secondRight');
let leftBodyTemplate = document.getElementById('leftBodyTemplate');
let responseBlock = document.getElementById('responseBlock');

let existingData = JSON.parse(localStorage.getItem("questionsBlock")) || {};

let favouriteCount = Math.max(...Object.values(existingData).map(q => q.favourite || 0), 0);

let buttons = document.getElementById('buttons');
let upwardCount = document.getElementById('upwardCount')
let downwardCount = document.getElementById('downwardCount');

let thumbup = document.getElementById('thumbup');
let thumbdown = document.getElementById('thumbdown');
let star = document.getElementById('star');

let cloneResponseName = document.getElementById('cloneResponseName');
let cloneComment = document.getElementById('cloneComment');

let clickedDiv;

let responseContainer = document.getElementById('response');
let responseID = null;
let clonedDiv;
let clickedSubject = null;
let clickedQuestion = null;

let count = localStorage.getItem('lastID') ? parseInt(localStorage.getItem('lastID')) : 1;

fetch("data.json")
  .then(response => response.json())  
  .then(data => {
    console.log("JSON data:", data);
  })
  .catch(error => console.error("Error reading JSON:", error));


document.addEventListener("DOMContentLoaded", loadExistingQuestions);

container.addEventListener('click', (e) => {
if (e.target.id === 'subInput') {
  if (!subInput.dataset.listenerAdded) {
    subInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        const enteredSubject = subInput.value.trim().toLowerCase();

        if (enteredSubject === "") {
          alert("Subject field is required!");
        } else {
          fetch("data.json")
            .then(response => response.json())
            .then(data => {
            
              const match = data.find(item => item.subject.toLowerCase() === enteredSubject);

              if (match) {
                console.log("Matched subject:", match.subject);
                rightQuesInput.focus();  
              } else {
                alert("Enter a valid subject");
                subInput.value = "";
              }
            })
            .catch(error => {
              console.error("Error reading JSON:", error);
              alert("Could not load data.json.");
            });
        }
      }
    });

    subInput.dataset.listenerAdded = "true";
  }
}

    if (e.target.id == 'submitBtn') { 
        if (subInput.value.trim() === "" || rightQuesInput.value.trim() === "") {
            alert("Both Subject and Question fields are required!");
            return;
        }
        const enteredQuestion = rightQuesInput.value.trim().toLowerCase();

        fetch("data.json")
            .then(response => response.json())
            .then(data => {

              const match = data.find(item => item.question.toLowerCase() === enteredQuestion);
              console.log(match);

              if (match) {
                console.log("Matched subject:", match.question);
                //rightQuesInput.focus();  // Allow user to proceed
                let templateDiv = document.getElementById('leftBodyTemplate');
                let newEntryDiv = templateDiv.cloneNode(true);
                newEntryDiv.style.display = "block"; 
                newEntryDiv.id = count;

                let leftp1 = newEntryDiv.querySelector(".subject");
                let leftp2 = newEntryDiv.querySelector(".question");

                leftp1.innerText = subInput.value;
                leftp2.innerText = rightQuesInput.value;

                leftBody.appendChild(newEntryDiv);

                createLocalStorage(subInput.value, rightQuesInput.value);

                subInput.value = "";
                rightQuesInput.value = "";
              } else {
                alert("Enter a valid question");

              }
            })
            .catch(error => {
              console.error("Error reading JSON:", error);
              alert("Could not load data.json.");
            });
    }

    if(e.target.id =='quesForm'){
        firstRight.style.display = 'block';
        secondRight.style.display = 'none';
    }

    let clickedDiv = e.target.closest(".height");
    if (clickedDiv && leftBody.contains(clickedDiv)) {
    clickedSubject = clickedDiv.querySelector(".subject").textContent.trim();
    clickedQuestion = clickedDiv.querySelector(".question").textContent.trim();

    responseID = clickedDiv.id; // e.g., "1"
    clonedDiv = clickedDiv.cloneNode(true);
    clonedDiv.id = "cloned" + clickedDiv.id;
    rightTemplate.innerHTML = "";
    rightTemplate.appendChild(clonedDiv);
    firstRight.style.display = 'none';
    secondRight.style.display = 'block';

    let clonedHeadingFav = clonedDiv.querySelector("#headingFav");
    if (clonedHeadingFav) {
        clonedHeadingFav.style.display = "none";
    }

    let cloneStar = clonedDiv.querySelector("#star");
    if (cloneStar) {
        cloneStar.style.display = "none";
    }

    // Extract subject and question text from the clonedDiv
    let subject = clonedDiv.querySelector(".subject")?.textContent.trim();
    let question = clonedDiv.querySelector(".question")?.textContent.trim();

    // Fetch the data and find a match
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            // console.log("Fetched data:", data);
            let matchedItem = data.find(item => {
            return (
                item.subject.trim().toLowerCase() === subject.trim().toLowerCase() &&
                item.question.trim().toLowerCase() === question.trim().toLowerCase()
            );
        });
        console.log("Matched item:", matchedItem); // Log the matched item

            // console.log
            if (matchedItem) {
                responseID = matchedItem.ID;
                console.log("Matched ID:", responseID); // Log the matched ID
                loadResponses(responseID); // Load using matched ID
            } else {
                console.log("No matching subject and question found.");
                // Optionally clear rightTemplate or show "No responses"
            }
        })
        .catch(error => {
            console.error("Error fetching data.json:", error);
        });
}


    if (e.target.id === 'responseName') {
        if (!responseName.dataset.listenerAdded) {
            responseName.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (responseName.value.trim() === "") {
                        alert("Name field is required!");
                    } else {
                        comment.focus();
                    }
                }
            });
            responseName.dataset.listenerAdded = "true";
        }
    }

    if (e.target.id === 'responseSubmitBtn') {
        if (responseName.value.trim() === "" || comment.value.trim() === "") {
            alert("Both Name and Comment fields are required!");
            return;
        }
        console.log("button clicked");
        console.log(responseID);

        if (clickedSubject && clickedQuestion) {
    const matchedKey = Object.keys(existingData).find(key => {
        const item = existingData[key];
        return (
            item.subject.trim().toLowerCase() === clickedSubject.trim().toLowerCase() &&
            item.question.trim().toLowerCase() === clickedQuestion.trim().toLowerCase()
        );
    });

    if (matchedKey) {
        console.log("Matched Entry ID:", matchedKey);
        const matchedEntry = existingData[matchedKey];
        const responseCount = Object.keys(matchedEntry.responses).length;
        const responseKey = responseCount;

        matchedEntry.responses[responseKey] = {
            name: responseName.value.trim(),
            comment: comment.value.trim(),
            upwardCount: 0,
            downwardCount: 0
        };

        localStorage.setItem("questionsBlock", JSON.stringify(existingData));

        const newResponse = responseContainer.cloneNode(true);
        newResponse.style.display = "block";
        newResponse.id = responseKey;

        const responsep1 = newResponse.querySelector("#cloneResponseName");
        const responsep2 = newResponse.querySelector("#cloneComment");
        responsep1.innerText = responseName.value.trim();
        responsep1.style.color = "blue";
        responsep1.style.fontSize = "1.5rem";
        responsep2.innerText = comment.value.trim();
        responseBlock.appendChild(newResponse);

        responseName.value = "";
        comment.value = "";
        } else {
            console.warn("No matching subject/question found in localStorage.");
        }
    }
    }
    
    if (e.target.id === 'resolveBtn') {

        let clickedDiv = document.getElementById(responseID); //1
        console.log(responseID);
        console.log(clickedDiv);

        document.getElementById("firstRight").style.display = "block";
        document.getElementById("secondRight").style.display = "none";
    
        if (existingData[responseID]) {
            delete existingData[responseID]; 
        }
    
        if (clickedDiv) {
            clickedDiv.remove();
        }
    
        localStorage.setItem("questionsBlock", JSON.stringify(existingData));
    }

    if (e.target.id === "star") {
        
        let clickedDiv = e.target.closest(".height");
        if (!clickedDiv) return;

        let questionID = clickedDiv.id;

        if (existingData[questionID]) {
            if (existingData[questionID].favourite === 0) {
                favouriteCount++;
                existingData[questionID].favourite = favouriteCount;
            } else {
                existingData[questionID].favourite = 0;
            }
            
            localStorage.setItem("questionsBlock", JSON.stringify(existingData));
        }
        e.target.classList.toggle("star-highlight", existingData[questionID].favourite !== 0);

        sortQuestionsByFavCount();
    }
});

function loadResponses(questionID) {
    responseBlock.innerHTML = "";
    const responseDiv = document.getElementById("response");

    fetch("data.json")
        .then(response => response.json())
        .then(fileData => {
            const fileQuestion = fileData.find(item => item.ID == questionID);
            const localRaw = JSON.parse(localStorage.getItem("questionsBlock")) || {};
            const localQuestion = localRaw[questionID];

            const allResponses = [];

            // Step 1: Add file data responses
            if (fileQuestion && fileQuestion.responses) {
                Object.entries(fileQuestion.responses).forEach(([key, res]) => {
                    allResponses.push({ id: "file_" + key, ...res });
                });
            }

            // Step 2: Add local storage responses (without overwriting)
            if (localQuestion && localQuestion.responses) {
                Object.entries(localQuestion.responses).forEach(([key, res]) => {
                    allResponses.push({ id: "local_" + key, ...res });
                });
            }

            // Step 3: Render responses
            if (allResponses.length === 0) {
                responseBlock.innerHTML = "<p>No responses available.</p>";
                return;
            }

            allResponses.forEach((response) => {
                const newResponse = responseDiv.cloneNode(true);
                newResponse.style.display = "block";
                newResponse.id = response.id;

                const responsep1 = newResponse.querySelector("#cloneResponseName");
                const responsep2 = newResponse.querySelector("#cloneComment");
                const upvoteSpan = newResponse.querySelector("#upwardCount");
                const downvoteSpan = newResponse.querySelector("#downwardCount");

                responsep1.innerText = response.name;
                responsep1.style.color = "blue";
                // responsep1.style.backgroundColor = "skyblue";
                responsep1.style.fontSize = "1.5rem";

                responsep2.innerText = response.comment;
                if (upvoteSpan) upvoteSpan.innerText = response.upwardCount || 0;
                if (downvoteSpan) downvoteSpan.innerText = response.downwardCount || 0;

                responseBlock.appendChild(newResponse);
            });
        })
        .catch(error => {
            console.error("Failed to load responses:", error);
            responseBlock.innerHTML = "<p>Error loading responses.</p>";
        });
}


function createLocalStorage(d1, d2) {

    let timestamp = Date.now(); // Store creation time
    let newEntry = {
        ID: count,
        subject: d1,
        question: d2,
        responses : {},
        favourite: 0,
        creationTime: timestamp 
    };

    existingData[count] = newEntry;
    localStorage.setItem('questionsBlock', JSON.stringify(existingData));
    count++;
    localStorage.setItem('lastID', count);
}

function loadExistingQuestions() {
    Object.values(existingData).forEach(entry => {
        let templateDiv = document.getElementById('leftBodyTemplate');
        let newEntryDiv = templateDiv.cloneNode(true);
        newEntryDiv.style.display = "block"; 
        newEntryDiv.id = entry.ID; 

        let leftp1 = newEntryDiv.querySelector(".subject");
        let leftp2 = newEntryDiv.querySelector(".question");
        let star = newEntryDiv.querySelector("#star");
        let timeSpan = newEntryDiv.querySelector(".creation-time");

          if (entry.favourite === 1) {
            star.classList.add("star-highlight");
        } else {
            star.classList.remove("star-highlight");
        }

        leftp1.innerText = entry.subject;
        leftp2.innerText = entry.question;
        timeSpan.innerText = getTimeAgo(entry.creationTime); 

        leftBody.appendChild(newEntryDiv);
        
        sortQuestionsByFavCount();
    });
    setInterval(updateCreationTimes, 60000);
}

document.getElementById('searchInput').addEventListener('input', () => {
    let searchValue = document.getElementById('searchInput').value.trim().toLowerCase();

    let filteredData = Object.values(existingData).filter(entry =>
        entry.subject.trim().toLowerCase().includes(searchValue) ||
        entry.question.trim().toLowerCase().includes(searchValue)
    );

    leftBody.innerHTML = "";

    if (filteredData.length === 0) {
        let noMatchDiv = document.createElement("div");
        noMatchDiv.innerText = "No match found";
        noMatchDiv.style.textAlign = "center";
        noMatchDiv.style.color = "red";
        noMatchDiv.style.fontSize = "2rem";
        noMatchDiv.style.paddingTop = "10px";
        leftBody.appendChild(noMatchDiv);
    } else {
        filteredData.forEach(entry => {
            let newEntryDiv = leftBodyTemplate.cloneNode(true);
            newEntryDiv.style.display = "block";
            newEntryDiv.id = entry.ID;

            let leftp1 = newEntryDiv.querySelector(".subject");
            let leftp2 = newEntryDiv.querySelector(".question");
            let star = newEntryDiv.querySelector("#star");

            // Trim and highlight subject
            let trimmedSubject = entry.subject.trim();
            let highlightedSubject = trimmedSubject.replace(
                new RegExp(`(${searchValue})`, 'gi'),
                '<span class="highlight">$1</span>'
            );

            // Trim and highlight question
            let trimmedQuestion = entry.question.trim();
            let highlightedQuestion = trimmedQuestion.replace(
                new RegExp(`(${searchValue})`, 'gi'),
                '<span class="highlight">$1</span>'
            );

            leftp1.innerHTML = highlightedSubject;
            leftp2.innerHTML = highlightedQuestion;

            if (star) {
                if (entry.favourite > 0) {
                    star.classList.add("star-highlight");
                } else {
                    star.classList.remove("star-highlight");
                }
            }

            leftBody.appendChild(newEntryDiv);
            sortQuestionsByFavCount();
            updateCreationTimes();
        });
    }
});


function sortQuestionsByFavCount() {
    console.log("Sorting favorites...");

    let sortedEntries = Object.entries(existingData);
   // console.log(sortedEntries);

    sortedEntries.sort((a, b) => {
        let favA = a[1].favourite || 0;
        let favB = b[1].favourite || 0;

        // Sorting logic:
        // 1. If one is a favorite and the other is not, keep favorites first
        if (favA === 0 && favB > 0) return 1;  // Move non-favorites down
        if (favA > 0 && favB === 0) return -1; // Move favorites up

        // 2. Among favorites, sort by fav count in ascending order
        if (favA > 0 && favB > 0) return favA - favB;

        // 3. Among non-favorites, sort by original order (ID)
        return a[0] - b[0];
    });

    existingData = Object.fromEntries(sortedEntries);

    localStorage.setItem("questionsBlock", JSON.stringify(existingData));

    updateUI(sortedEntries);
}

function updateUI(sortedEntries) {
    let leftBody = document.getElementById("leftBody");

    sortedEntries.forEach(([id, entry]) => {
        let questionDiv = document.getElementById(id);
        if (questionDiv) {
            let star = questionDiv.querySelector("#star");

            // Restore star highlight class based on favourite status
            if (entry.favourite > 0) {
                star.classList.add("star-highlight");
            } else {
                star.classList.remove("star-highlight");
            }

            leftBody.appendChild(questionDiv);
        }
    });
}

function getTimeAgo(timestamp) {
    let now = Date.now();
    let diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    let diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    let diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour ago`;
    let diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day ago`;
}

function updateCreationTimes() {
    document.querySelectorAll(".height").forEach(entryDiv => {
        let entryID = entryDiv.id;
        let timeSpan = entryDiv.querySelector(".creation-time");

        if (existingData[entryID]) {
            let formattedTime = getTimeAgo(existingData[entryID].creationTime);
            timeSpan.innerText = formattedTime;
        }
    });
}
