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
    <!-- <script src="googlesignin.js"></script> -->
    
    </head>
<body>
    
    <div id = "chaticon2" class = "chatbuttonicon"><img src = "chat.png" id = "chaticonimg" alt = "chat icon" width = 50 height = 50></div>
    <div id = "leadicon" class = "chatbuttonicon"><img src = "bell.png" id = "belliconimg" alt = "chat icon" width = 50 height = 50></div>
    <div id="mydiv2" class = "mydiv2">
      <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
      <div class="mydivheader"><a>Service Hours Leaderboard</a> (Drag to Move)</div>
        <table class = "Container" id = "leaderboardContainer"></table>
        
    </div>
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
                  var name = encodeURIComponent(localStorage.getItem("nameemail"));
                  var chatboxValue = encodeURIComponent(chatbox.value);

                    var newValue = chatboxValue

                  // Create the data string with newlines encoded as %0A
                  var data = `username=${curChat}%0A${name} %0A${newValue}`;
                  xhr.send(data);
                      chatbox.value = "";
                  
                    
                    

              
                  // Clear chatbox after sending
                  displaychat();
                  document.getElementById("chatContainer").scrollTop = document.getElementById("chatContainer").scrollHeight;

                
                  
                var curChat3 = localStorage.getItem("curchat");
                 curChat3 = curChat3.replace("Chat","").trim()
                //alert(curChat3 + " " + message);
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
                      //alert(curChat2);
                      
                      
                  name = encodeURIComponent("Youth4GoodBot");
                  chatboxValue = encodeURIComponent(response);

                  // Create the data string with newlines encoded as %0A
                  data = `username=${curChat2}%0A${name} %0A${chatboxValue}`;
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
        <button class = "tutoronly dropbtn" id = "chatbut3" onclick = "switchtoadmin()">Switch To Admin</button>
    </div>
    <div id="siteheader">
        <div id="Logoname" >YOUTH4GOOD</div>
        <div id = "siteheader-content">
            <span id = "overview" onclick="transitionToPage('index.php')" class = "currentpage">Overview</span>
            <span id = "Tutoring" onclick="transitionToPage('tutor.html')" >Tutoring</span>
            <span><button class="dropbtn" id="logout-btn" style="display:none;">Logout</button></span>
        </div>

    </div>


    <div id = "TITLE">
        <h1>Youth 4 Good</h1>
         <!-- <button onclick="notifyMe('skbidi')">Notify me!</button> -->
        <!-- <button id="notificationBtn" onclick="Notifaction()"><img src = "bell.png" alt = "notification" width = "35px" height = "35px"></button> -->
        <div class="line-1"></div>
        <div id = "titledescription">
            <h2>Our mission is to develop leadership skills and Good citizenship practices in youngsters through community service.</h2>
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
        <button class = "dropbtn" id = "closeevent" onclick="sidebar()">Info</button>

        <button id = "editevent" class = "adminonly" onclick="editevent()">Edit</button>
    </div>


    <div id = "s2s" class = "sidetoside">
        <img src = "wechatimg206.jpg" id = "wechatimg" alt = "wechatimg">
        <div id = "TITLE2">
            <h2>About Us</h2>
            <!-- <button id="notificationBtn" onclick="Notifaction()"><img src = "bell.png" alt = "notification" width = "35px" height = "35px"></button> -->
            <div class="line-2"></div>
            <div id = "titledescription">
                <h2>Our mission is to develop leadership skills and Good citizenship practices in youngsters through community service.</h2>
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





   
   

      <div id="g_id_onload"
           data-client_id="290007138-eqbhtac1mc1d2jcltpusk98mn08b24cn.apps.googleusercontent.com"
           data-login_uri="https://6c687947-1472-48d1-99a5-efdfba0302d9-00-1kx1aivdn85r2.spock.replit.dev"
           data-auto_prompt="false">
      </div>



   
    
    <!-- <footer>
        <p>Make your own website
        <br><a href = "https://youtu.be/chOvyuyZe9M">https://youtu.be/chOvyuyZe9M</a></p>
        <br>
        <p>Do not email me<br>
        <a href="mailto:maxhzhang119@gmail.com">maxhzhang119@gmail.com</a></p>
      </footer> -->

    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
    function handleCredentialResponse(response) {
      const jwt = response.credential;
        const base64Url = jwt.split('.')[1]; // Extract payload from JWT
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const userInfo = JSON.parse(jsonPayload);

      // Decode the JWT and extract user information
      decodeAndLogJWT(jwt);

      // Store the JWT token in localStorage to persist login status
      localStorage.setItem('google_jwt_token', jwt);
        location.reload();
        
  
    }

    function decodeAndLogJWT(jwt) {
      // Decode the JWT using atob
      const base64Url = jwt.split('.')[1]; // Extract payload from JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userInfo = JSON.parse(jsonPayload);

      // Log the user information
      console.log('User info:', userInfo);

      // Store the user's name in localStorage
      localStorage.setItem("name", userInfo.name);
      localStorage.setItem("nameemail",userInfo.email);


        // Send user data to the Node.js server
        fetch('https://6c687947-1472-48d1-99a5-efdfba0302d9-00-1kx1aivdn85r2.spock.replit.dev:3000/store-user', {  // Adjust URL if Node.js server is running on a different location
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userInfo.name,
                email: userInfo.email,
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      // Access the user's information like username, email, etc.
      console.log('Username:', userInfo.name); // Typically, this is the Google account's display name
      console.log('Email:', userInfo.email);

    }

    window.onload = function() {
      // Check if the user is already logged in by checking localStorage
      const jwtToken = localStorage.getItem('google_jwt_token');

      if (jwtToken) {
        // JWT token exists, decode and log the user information
        decodeAndLogJWT(jwtToken);
          console.log("USER IS ALREADY LOGGED IN");
            document.getElementById('logout-btn').style.display = 'block';
      } else {
        // User is not logged in, so show the Google Sign-In button and prompt
        google.accounts.id.initialize({
          client_id: "290007138-eqbhtac1mc1d2jcltpusk98mn08b24cn.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
          document.querySelector(".g_id_signin"), 
          { theme: "outline", size: "large" }  // Customize the button's appearance
        );

        google.accounts.id.prompt(); // Prompt users to sign in
          
      }
    };
        document.getElementById('logout-btn').addEventListener('click', function() {
          // Clear JWT token from localStorage
          localStorage.removeItem('google_jwt_token');
          localStorage.removeItem('name');
        

          // Optionally, refresh the page or redirect to another page
          location.reload(); // This will reload the page and reset the login state
        });
    </script>
    <script     src="script.js"></script>
    
</body>
</html>