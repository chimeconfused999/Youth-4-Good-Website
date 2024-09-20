


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Youth4Good Overview</title>
    <link href="style.css" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="module" src="firebase.js"></script>
    <script type="module" src="chatgpt.js"></script>
    <script src="googlesignin.js"></script>
    
    </head>
<body>
    <div id = "chaticon2" class = "chatbuttonicon"><img src = "chat.png" id = "chaticonimg" alt = "chat icon" width = 50 height = 50></div>
    <div id="mydiv" class = "mydiv">
      <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
      <div id="mydivheader"><a id = "chatTitle">HI</a> (Drag to Move)</div>
        <div class = "Container" id = "chatContainer"></div>
          <div id = "chat"><form id = "chatform" onsubmit="return false">
          <input type="text" id="chatbox" name="name" placeholder ="Enter your message:">
          </form>
        <button id = "chatbut2" onclick = "switchtogeneral()">Switch To General</button></div>
        <script type = "module">
              import { chatbotMessage } from './chatgpt.js';

              // Example usage

              async function sendMessage() {
                 
                  const message = document.getElementById('chatbox').value.trim();
                  
                  if(message.includes("@gpt")){

                  var chatbox = document.getElementById("chatbox");

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "chat.php", true);
                  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                  // Disable the input field before sending the request
                  chatbox.disabled = true;

                  xhr.onreadystatechange = function() {
                      if (xhr.readyState === 4 && xhr.status === 200) {
                          // Re-enable the input field after the response is received
                          chatbox.disabled = false;

                      }
                  };

                  var curChat = encodeURIComponent(localStorage.getItem("curchat"));
                  var name = encodeURIComponent(localStorage.getItem("name"));
                  var chatboxValue = encodeURIComponent(chatbox.value);

                  // Create the data string with newlines encoded as %0A
                  var data = `username=${curChat}%0A${name} %0A${chatboxValue}`;
                  xhr.send(data);

              
                  // Clear chatbox after sending
                  displaychat();
                  document.getElementById("chatContainer").scrollTop = document.getElementById("chatContainer").scrollHeight;

                
                  
                var curChat3 = localStorage.getItem("curchat");
                 curChat3 = curChat3.replace("Chat","").trim()
                alert(curChat3 + " " + message);
                const response = await chatbotMessage(message, curChat3);
                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "chat.php", true);
                  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                  // Disable the input field before sending the request
                  chatbox.disabled = true;

                  xhr.onreadystatechange = function() {
                      if (xhr.readyState === 4 && xhr.status === 200) {
                          // Re-enable the input field after the response is received
                          chatbox.disabled = false;

                      }
                  };

                  var curChat2 = encodeURIComponent(localStorage.getItem("curchat"));
                      alert(curChat2);
                      
                      
                  name = encodeURIComponent("Youth4GoodBot");
                  chatboxValue = encodeURIComponent(response);

                  // Create the data string with newlines encoded as %0A
                  data = `username=${curChat2}%0A${name} %0A${chatboxValue}` + " To Call me, type @gpt and the message you want to ask me.";
                  xhr.send(data);

                  // Cl2ear chatbox after sending
                  chatbox.value = "";
                  displaychat();
                      document.getElementById("chatContainer").scrollTop = document.getElementById("chatContainer").scrollHeight;
              }
              }
              window.addEventListener("keypress", function(event) {
                // If the user presses the "Enter" key on the keyboard
                if (event.key === "Enter") {
                  event.preventDefault();

                  sendMessage()
                }
              });





          </script>
    </div>
    <div id="siteheader">
        <div id="Logoname" >YOUTH4GOOD</div>
        <div id = "siteheader-content">
            <span id = "overview" onclick="transitionToPage('index.html')" class = "currentpage">Overview</span>
        </div>
    </div>


    <div id = "TITLE">
        <h1>Youth 4 Good</h1>
        <!-- <button id="notificationBtn" onclick="Notifaction()"><img src = "bell.png" alt = "notification" width = "35px" height = "35px"></button> -->
        <div class="line-1"></div>
        <div id = "titledescription">
            <h2>Our mission is to develop leadership skills and good citizenship practices in youngsters through community service.</h2>
        </div>
    </div>

    <div id = "contentcalendar">
        
        <div class="calendar-container">
            <div class="calendar-header">
                <h2>Event Calendar</h2>
                <button id="createeventbutton" class="dropbtn adminonly" onclick="createEvent1()">Create Event</button>
                <div id="myDropdown" class="dropdown-content">
                  <span id = "crev">CREATE AN EVENT</span>
                  <span> <div class="event-form">
                      <input type="text" id="eventTitle" placeholder="Event Title" />
                      <input type="date" id="eventDate" />
                  </div></span>
                  <span><div class="event-form">
                        <input type="text" id="eventLocation" placeholder="Event Location" />
                         <input type="time" id="eventStart"/>-<input type = "time" id="eventEnd" >
                    </div></span>
                  <span id = "lastform"><div  class="event-form">
                          <input type="text" id="eventDescription" placeholder="Event Description" />
                      <button id = "addev" onclick="addEvent()">Add Event</button>
                      </div></span>

                </div>
                <h3 id="month"></h3>
                <span>
                    <button id="prevMonth" onclick="changeMonth(-1)"> &lt; </button>
                    <button id="nextMonth" onclick="changeMonth(1)"> &gt; </button>
                    <button onclick="callGoogleSignIn()" value="Google Sign In" id="googleSignIn">Google</button>
                    <button onclick="logOut()" value="Google Sign Out" id="googleSignOut">Log Out</button>
                </span>
            </div>
            <div class="calendar-grid" id="calendarGrid">
            </div>
        </div>
    </div>

    <div id="eventDetailsPanel2" class="event-details-panel2">
       <h1 class = "joined">Joined: </h1>
        <h2 id = "joinedppl"></h2>



    </div>
    <div id = "editDetails" class = "event-details-panel2">
        <form id="eventForm" oninput = "checkif()" onclick = "checkif()" >
            <label for="1eventTitle">Event Title:</label>
            <br>
            <input class = "sidebarform"  type="text" id="1eventTitle" name="1eventTitle" ><br><br>

            <label for="1eventDate">Event Date:</label>
            <br>
            <input class = "sidebarform"   type="date" id="1eventDate" name="1eventDate" ><br><br>

            <label for="1eventStart">Event Duration (hours):</label>
            <br>
            
            <input type="time" id="1eventStart"/>-<input type = "time" id="1eventEnd" >
            <br>

            <label for="1eventPlace">Event Place:</label>
            <br>
            <input class = "sidebarform"   type="text" id="1eventPlace" name="1eventPlace" ><br><br>

            <label for="1eventDescription">Event Description:</label>
            <br>
            <textarea class = "sidebarform"  id="1eventDescription" name="1eventDescription" ></textarea><br><br>

            <button type="submit" id = "submit-btn123" class = "sidebarbtn">Delete Event</button>
        </form>
    </div>
    <div id="eventDetailsPanel" class="event-details-panel">
        <h1 id="eventTitleDisplay">Event Title</h1>
        <h2 id="eventDateDisplay">Event Date</h2>
        <h2 id="eventPlaceDisplay">Event Place</h2>
        <h2 id="eventLocationDisplay">Event Duration</h2>
        <h2 id="eventDescriptionDisplay">Event Description</h2>

        <l>Members: </l><l id = "mcount">0</l><br>
        <button class = "eventDetPanBTN" id = "changechat" onclick = "changetochat()">Change Chat</button>
        <button class = "eventDetPanBTN" id = "joinbutton" onclick = "joinEvent()">Join</button>
        <button class = "adminonly" id = "closeevent" onclick="sidebar()">Info</button>

        <button id = "editevent" class = "adminonly" onclick="editevent()">Edit</button>
    </div>


    <div id = "s2s" class = "sidetoside">
        <img src = "wechatimg206.jpg" id = "wechatimg" alt = "wechatimg">
        <div id = "TITLE2">
            <h2>About Us</h2>
            <!-- <button id="notificationBtn" onclick="Notifaction()"><img src = "bell.png" alt = "notification" width = "35px" height = "35px"></button> -->
            <div class="line-2"></div>
            <div id = "titledescription">
                <h2>Our mission is to develop leadership skills and good citizenship practices in youngsters through community service.</h2>
            </div>
        </div>
    </div>
    <div id = "TITLE3">
        <h2>Leadership 2024-2025</h2>
        <!-- <button id="notificationBtn" onclick="Notifaction()"><img src = "bell.png" alt = "notification" width = "35px" height = "35px"></button> -->
        <div class="line-1"></div>
        <div id = "titledescription">
            <h3>Meet our dedicated team at Youth4Good, empowering the next generation of students</h3>
        </div>
    </div>
    <footer>
        <p>Make your own website
        <br><a href = "https://youtu.be/chOvyuyZe9M">https://youtu.be/chOvyuyZe9M</a></p>
        <br>
        <p>Do not email me<br>
        <a href="mailto:maxhzhang119@gmail.com">maxhzhang119@gmail.com</a></p>
      </footer>
    <script     src="script.js"></script>
    
</body>
</html>