let events = []
var calendarGrid;
var monthElement;//what is going on
var currentMonths;
var year ;
let currentMonthIndex;
let currentMonth2;
let currentDay;
let currentYear;
let eventdet = true;
let editbar = true;
let infobar = true;
let chatbar = true;

// localStorage.removeItem("Tutor1")
// localStorage.removeItem("Tutor2")

let leadbar = true;
var elmnt = document.getElementById("mydiv");
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
// main.js


// Call the function and handle its response

function convertTo12Hour(time24) {
  let [hours, minutes] = time24.split(':');
  let period = 'AM';

  hours = parseInt(hours, 10);

  if (hours >= 12) {
    period = 'PM';
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }
    return `${hours}:${minutes} ${period}`;
  }
let notifiedEvents = {}; // Keeps track of notified events

function checkifEventComing() {
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
    })
    .then(data => {
      const now = new Date();

      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles', // Adjust to your timezone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const formatterTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      });

      const eformattedDate = formatter.format(now);
      const formattedTime = formatterTime.format(now);

      // Format date to YYYY-MM-DD
      const [emonth, eday, eyear] = eformattedDate.split('/');
      const [currentHours, currentMinutes] = formattedTime.split(':').map(Number);
      const formattedDate = `${eyear}-${emonth}-${eday}`;

      data.forEach(event => {
        if(event.data == formattedDate){
          const [eventStartHours, eventStartMinutes] = event.duration.slice(0, 5).split(':').map(Number);
          const timeDifference = (60 * (eventStartHours - currentHours)) + (eventStartMinutes - currentMinutes);

          // Ensure notifiedEvents has a state for this event
          if (!notifiedEvents[event.title]) {
            notifiedEvents[event.title] = { notified10: false, notified5: false };
          }

          // Notify exactly 10 minutes before

          if (timeDifference === 10 && !notifiedEvents[event.title].notified10) {
            notifyMe(`${event.title} is starting in 10 minutes!`);
            notifiedEvents[event.title].notified10 = true;


          }

          // Notify exactly 5 minutes before
          if (timeDifference === 5 && !notifiedEvents[event.title].notified5) {
            notifyMe(`${event.title} is starting in 5 minutes!`);
            notifiedEvents[event.title].notified5 = true;
          }

          // Clear notifications for past events
          if (timeDifference < 0) {
            delete notifiedEvents[event.title];
          }
        }
        });

      })
      .catch(error => {
        console.error('There was a problem with fetching the text file:', error);
      });

}


setInterval(() => checkifEventComing(), 60000);

document.addEventListener('DOMContentLoaded', function() {
  preloadImages(startAfterPreload);
});
checkifEventComing()

function notifyMe(str) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    const notification = new Notification(str);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification(str);
      }
    });
  }
}

function startAfterPreload(){

  //checkName();
  checkOwnership();

  if (window.location.pathname === '/' || window.location.pathname.includes('index.php')){

    calendar();
    addExistingEvents();
  }


  if(localStorage.getItem("curchat") == null){
    localStorage.setItem("curchat","general")
  }
  if (localStorage.getItem("curchat") == "general" && document.getElementById("generalbut")) {
      document.getElementById("generalbut").style.display = "none";
  }
  else if (document.getElementById("generalbut")){
      document.getElementById("generalbut").style.display = "block";
  }

  setTimeout(function() {
    document.querySelector('body').style.opacity = 1;
  }, 50);


  const textElements = document.querySelectorAll('body *');
  textElements.forEach(element => {
    if (element.textContent.trim()) { 

      element.classList.add('bounce-in');
    }
  });


  setTimeout(function() {
    textElements.forEach(element => {
      element.classList.remove('bounce-in');
    });
  }, 1000); 

  const storedName = localStorage.getItem("name");
  fetch('members.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {

    if(!data.includes(storedName) && storedName != null){
      alert(storedName + " is not a member, adding now")
        $.ajax({
        type: "POST",
        url: "members.php",
        contentType: "application/json",
        data: JSON.stringify(storedName),
        success: function(response) {
          console.log("Data sent successfully:", response);
        },
        error: function(error) {
          console.error("Error sending data:", error);
        }
      });
    }

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  const storedEmail = localStorage.getItem("nameemail");

  fetch('email.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {

    if(!data.includes(storedEmail) && storedEmail != null){
      alert(storedEmail + " adding now")
        $.ajax({
        type: "POST",
        url: "email.php",
        contentType: "application/json",
        data: JSON.stringify(storedEmail),
        success: function(response) {
          console.log("Data sent successfully:", response);
        },
        error: function(error) {
          console.error("Error sending data:", error);
        }
      });
    }

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

window.transitionToPage = function(href, id) {
  document.querySelector('body').style.opacity = 0
  setTimeout(function() { 
      window.location.href = href;
  }, 300)
}

// Function to preload images
function preloadImages(callback) {
  var imageUrls = [
          "Croppedbackground1.png",
  ]
  // if (document.title == "index"){
  //     var imageUrls = [
  //         "Croppedbackground1.png"
  //     ]
  // }

  var loadedImagesCount = 0;
  var totalImages = imageUrls.length;

  function loadImage(url) {
    if (!url) {
      loadedImagesCount++;
      if (loadedImagesCount === totalImages-1) {
        callback();
      }
      return;
    }

    var img = new Image();
    img.src = url;

    img.onload = function() {

      loadedImagesCount++;
      if (loadedImagesCount === totalImages) {
        callback();
      }
    };

    img.onerror = function() {
      console.error("Error loading image: " + url);
      loadedImagesCount++;
      if (loadedImagesCount === totalImages) {
        callback();
      }
    };
  }

  imageUrls.forEach(function(url) {
    loadImage(url);
  });
}

function createEvent1() {  
  document.getElementById("myDropdown").classList.toggle("show");
}

function addExistingEvents(){
  //adding events
  fetch('data.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
  })
  .then(data => {     

    for (i = 0; i < data.length; i++) {
      addEvent2(data[i].title, data[i].data, data[i].place, data[i].duration, data[i].description); 

    }
  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}


function checkOwnership(){
  fetch('owners.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {
    if (data.includes(localStorage.getItem("nameemail"))) {
        // Use querySelectorAll to select all elements with the 'adminonly' class
        var elements = document.querySelectorAll('.adminonly');

        // Loop through the NodeList using forEach
        elements.forEach(function(element) {
            // Example alert to show the element's id
            //alert(element.id);
            // Replace 'adminonly' with 'dropbtn' while keeping other classes intact
            element.classList.replace('adminonly', 'dropbtn');
        });
      var elements2 = document.querySelectorAll('.tutoronly');
      elements2.forEach(function(element2) {
          
          element2.classList.replace('tutoronly', 'tutors');
      });
    }
    else{
      var elements = document.querySelectorAll('.adminonly');

      // Loop through the NodeList using forEach
      elements.forEach(function(element) {
          // Example alert to show the element's id
          //alert(element.id);
          // Replace 'adminonly' with 'dropbtn' while keeping other classes intact
          element.style.display = "none";
      });
    }


  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

}

function calendar(){
    calendarGrid = document.getElementById('calendarGrid');
    monthElement = document.getElementById('month');

    currentMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   year = 2024;
    var currentMonth = new Date()
    currentMonthIndex = currentMonth.getMonth();

    currentDay = currentMonth.getDate();
    currentMonth2 = currentMonth.getMonth()+1;
    currentYear = currentMonth.getFullYear();
      fetch('data.json')
       .then(response => response.json())
       .then(data => {
         for (i=0; i<data.length; i++){
           l=data[i].data.split("-");
           if(l[0]<currentYear || l[0] == currentYear && l[1]<currentMonth2 || l[0] == currentYear && l[1] < currentMonth2 ){
             //funny thing
             var filename = encodeURIComponent(data[i].title) + ".txt";

             if (filename) {
                 $.ajax({
                     url: 'delete_file.php',
                     type: 'POST',
                     data: { filename: filename },
                     dataType: 'json',
                     success: function(response) {
                         $('#responseMessage').text(response.message);
                     },
                     error: function() {
                         $('#responseMessage').text('An error occurred while deleting the file.');
                     }
                 });
             }
           } 
         }

       })
       .catch(error => {
         console.error('Error fetching or parsing JSON:', error);
    });

  if(window.location.pathname === '/' || window.location.pathname.includes('index.php')){
    createCalendar();
  }

}

function createCalendar() {
    calendarGrid.innerHTML = '';
    monthElement.textContent = currentMonths[currentMonthIndex] + " " + year;

    const daysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('calendar-day');
      const eventDate = `${year}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      dayDiv.innerHTML = `<span>${currentMonths[currentMonthIndex]} ${day}, ${year}</span><br>`;
      dayDiv.setAttribute('data-date', eventDate);
      calendarGrid.appendChild(dayDiv);

      if ((year > currentYear) || 
          (year === currentYear && currentMonthIndex+1 > currentMonth2) || 
          (year === currentYear && currentMonthIndex+1 === currentMonth2 && day >= currentDay)) {
          //avaliablebutton(dayDiv, currentMonthIndex+1, day, year);
      }
      if (year == currentYear && currentMonthIndex+1 == currentMonth2 && day == currentDay) {
        dayDiv.style.backgroundColor = "lightblue";
      }

  }
}

function avaliablebutton(dayDiv, currentMonthIndex, day,year){

  if (localStorage.getItem(`day-btn-${day}-${currentMonthIndex}-${year}`) == "Unavaliable"){
    const unavaliableButton = document.createElement('button');
    unavaliableButton.innerHTML = 'Unavaliable';
    unavaliableButton.classList.add('avbut');
    unavaliableButton.addEventListener('click', function() {
      unavaliableButton.remove();
      localStorage.setItem(`day-btn-${day}-${currentMonthIndex}-${year}`,"Avaliable");
      avaliablebutton(dayDiv, currentMonthIndex, day,year);
      dayDiv.style.backgroundColor = '#fff';
    });
    dayDiv.appendChild(unavaliableButton);
    dayDiv.style.backgroundColor = 'lightblue';
  }
  else{
    const dayButton = document.createElement('button');
    localStorage.setItem(`day-btn-${day}-${currentMonthIndex}-${year}`,"Avaliable");
    dayButton.innerHTML = 'Avaliable';
    dayButton.classList.add('avbut');
    dayButton.id = `day-btn-${day}-${currentMonthIndex}-${year}`; // Give each button a unique ID if needed
    dayButton.addEventListener('click', function() {
      localStorage.setItem(`day-btn-${day}-${currentMonthIndex}-${year}`,"Unavaliable");
      console.log(`Button for ${currentMonths[currentMonthIndex]} ${day}, ${year} clicked!`);
      dayButton.remove();
      const unavaliableButton = document.createElement('button');
      unavaliableButton.innerHTML = 'Unavaliable';
      unavaliableButton.classList.add('avbut');
      unavaliableButton.addEventListener('click', function() {
        unavaliableButton.remove();
        localStorage.setItem(`day-btn-${day}-${currentMonthIndex}-${year}`,"Avaliable");
        avaliablebutton(dayDiv, currentMonthIndex, day,year);
        dayDiv.style.backgroundColor = '#fff';
      });
      dayDiv.appendChild(unavaliableButton);
      dayDiv.style.backgroundColor = 'lightblue';
    });
    dayDiv.appendChild(dayButton);
  }

}

function switchtogeneral(){
  localStorage.setItem("curchat","general")
  displaychat()
  document.getElementById("chatTitle").innerHTML = localStorage.getItem("curchat");
  document.getElementById("chatbut2").style.display = "none";
}
//json testing
function send(){
  data = {
    title: document.getElementById("eventTitle").value,
    data: document.getElementById("eventDate").value,
    place: document.getElementById("eventLocation").value,
    duration: document.getElementById("eventStart").value + "-" + document.getElementById("eventEnd").value,
    description: document.getElementById("eventDescription").value,
    name: localStorage.getItem("nameemail")
  }
      $.ajax({
        type: "POST",
        url: "calendar.php",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(response) {
          console.log("Data sent successfully:", response);
        },
        error: function(error) {
          console.error("Error sending data:", error);
        }
      });
}


// // Check if the current day has an event and add "Join" button
// const eventForDay = events.find(event => event.data === eventDate);

// if (eventForDay) {
//   alert("hi");
//   // Ensure the "Join" button stays on the event day
//   addJoinButtonAndEvent(dayDiv, eventForDay);
// }


function addJoinButtonAndEvent(dayDiv, eventForDay) {


  // Create the Join button
  const joinbtn = document.createElement('button');
  joinbtn.id = "joinbtn";
  joinbtn.innerHTML = 'Join';


  //   joinbtn.addEventListener('click', function() {

  // // Increment the member count when the join button is clicked
  // eventForDay.membersJoined += 1;
  // UpdateMemberCount(dayDiv, eventForDay);
  // });
  dayDiv.appendChild(joinbtn);

// Add the event title to the calendar day
const eventElement = document.createElement('div');
eventElement.classList.add('event');
eventElement.textContent = eventForDay.title;
dayDiv.appendChild(eventElement);

}
function joinEvent() {
  const title = document.getElementById("eventTitleDisplay").textContent.trim();
  const safeTitle = encodeURIComponent(title);  // Sanitizing the title
  var data = {
    title: document.getElementById("eventTitleDisplay").innerHTML,
    email: localStorage.getItem("nameemail")
  };
  if(document.getElementById("joinbutton").innerHTML.trim() == "Join"){
    console.log("Sending data:", data); // Log the data to check its values
    if(document.getElementById('eventTitleDisplay').innerHTML.trim() == title){
      document.getElementById("joinbutton").innerHTML = "Joined";
      document.getElementById("joinbutton").style.backgroundColor = "lightblue";

        document.getElementById("mcount").textContent = parseInt(document.getElementById("mcount").textContent) + 1;

    }
    $.ajax({
        type: "POST",
        url: "attendance.php",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Data sent successfully:", response);
        },
        error: function(error) {
            console.error("Error sending data:", error);
        }
    });
  } else {
    if(confirm("Are you sure you want to leave this event?")){
      
      document.getElementById("joinbutton").innerHTML = "Join";
      document.getElementById("mcount").textContent = parseInt(document.getElementById("mcount").textContent) - 1;
      document.getElementById("joinbutton").style.backgroundColor = "#52abff";
    $.ajax({
        type: "POST",
        url: "leave.php",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Data sent successfully:", response);
        },
        error: function(error) {
            console.error("Error sending data:", error);
        }
    });
    }
  }

}


// // Update member count in real-time
// function updateMemberCount(dayDiv, eventForDay) {

//   fetch('data.json')
//   .then(response => response.json())
//   .then(data => {
//     // Step 2: Modify the part of the JSON object you want
//     data.members = data.members +1;  // Example change

//     // Step 3: Convert back to JSON
//     const updatedJsonData = JSON.stringify(data, null, 2);  // Pretty print for readability

//     // Output the updated JSON in the console (or send it back to a server)
//     console.log(updatedJsonData);

//     // Optional: You can use the updated data in the app or send it to a server for saving
//   })
//   .catch(error => {
//     console.error('Error fetching or parsing JSON:', error);
//   });
//   const memberCountDiv = dayDiv.querySelector('.member-count');
//   if (memberCountDiv) {
//     memberCountDiv.innerHTML = `Members Joined: ${eventForDay.membersJoined}`;
// }
// }

function changeMonth(direction) {
    currentMonthIndex += direction;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11;
        year = year - 1;
    } else if (currentMonthIndex > 11) {
        currentMonthIndex = 0;  
        year = year + 1
    }
  createCalendar();
  fetch('data.json')
  .then(response => {
      // Check if the response is successful
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
  })
  .then(data => {       
    for (i = 0; i < data.length;i++){
      addEvent2(data[i].title,data[i].data,data[i].place,data[i].duration,data[i].description); 
    }
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
}

// Function to display JSON data in the HTML
document.body.addEventListener('click', function (event) {
  // Check if the clicked element is not the button or any element inside the dropdown content
  if (!event.target.closest('.dropbtn') && !event.target.closest('.dropdown-content')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if (document.getElementById("eventDetailsPanel")){
    if (!event.target.closest('.event-details-panel') && document.getElementById("eventDetailsPanel").classList.contains("show-panel") && eventdet == false && infobar == true && editbar == true && !event.target.closest('.event') && chatbar == true && leadbar == true){

      eventdet = true;
      if(window.location.pathname === '/' || window.location.pathname.includes('index.php')){
        closeEventDetails();
      }

    }
  }

  if (!event.target.closest('.event-details-panel2') && infobar == false && !event.target.closest('.joinedpple')){
    infobar = true;
    if(window.location.pathname === '/' || window.location.pathname.includes('index.php')){
      closeEventDetails2();
    }
  }
  if (!event.target.closest('.event-details-panel2') && editbar == false){
    editbar = true;
    if(window.location.pathname === '/' || window.location.pathname.includes('index.php')){
      closeeditdet();
    }
  }
  if (!event.target.closest('.mydiv') && !event.target.closest('.chatbuttonicon') && chatbar == false){
    chatbar = true;
    closechatbar();
  }
  if (!event.target.closest('.mydiv2') && !event.target.closest('.chatbuttonicon') && leadbar == false){
    leadbar = true;
    closeleadbar();
  }

});

function addEvent2(title, eventDate, place, duration, description) {
  if(title != "" && eventDate != "" && place != "" && duration != "-" && description != null){
  const now = new Date();

  // Format the current date and time
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', // You might want to replace 'UTC' with your desired timezone.
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formatterTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
  });

  const eformattedDate = formatter.format(now);
  const formattedTime = formatterTime.format(now);

  // Format date to YYYY-MM-DD
  const [emonth, eday, eyear] = eformattedDate.split('/');
  const formattedDate = `${eyear}-${emonth}-${eday}`;

  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json(); // Parse the JSON data
    })
    .then(data => {       
      for (let event of data) {
        if (event.title === title) {
          // Extract start and end hours and minutes from the event duration
          const [eventStartHours, eventStartMinutes] = event.duration.slice(0, 5).split(':').map(Number);
          const [eventEndHours, eventEndMinutes] = event.duration.slice(6).split(':').map(Number);

          // Extract the current time hours and minutes
          const [currentHours, currentMinutes] = formattedTime.split(':').map(Number);

          // Parse the event and current dates for comparison
          const eventDate = new Date(event.data);       // Convert event data (string) to Date object
          const todayDate = new Date(formattedDate);    // Convert current date (string) to Date object

          // Check if the event is before today
          const isBeforeToday = eventDate < todayDate;

          // Check if the event is today and has already ended
          const isSameDay = eventDate.getTime() === todayDate.getTime(); // Ensure same day
          const isEventEndedToday = (
            currentHours > eventEndHours || 
            (currentHours === eventEndHours && currentMinutes >= eventEndMinutes)
          );

          // If the event is before today or has ended today, calculate the total
          if (isBeforeToday || (isSameDay && isEventEndedToday)) {
            calculatetotal(event.title, eventEndHours, eventEndMinutes);
          }
        }
      }

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  // Parse the input eventDate and check if it's in the past
  const [year, month, day] = eventDate.split('-').map(Number);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
  const currentDay = now.getDate();

  let red = false;

  // Check if the event is in the past
  if (year < currentYear || 
      (year === currentYear && month < currentMonth) || 
      (year === currentYear && month === currentMonth && day < currentDay)) {
    red = true;
  }

  // If the title or date is empty, exit
  if (!title.trim() || !eventDate) {
    console.log("Please enter both the event title and date.");
    return;
  }

  const payPiv = document.querySelector(`.calendar-day[data-date='${eventDate}']`);

  if (payPiv) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');
    eventElement.textContent = title;

    // Apply red background if event is in the past
    if (red) {
      eventElement.style.backgroundColor = "orangered";
      eventElement.style.color = "black";
    }

    eventElement.addEventListener('click', function () {
      showEventDetails(title, eventDate, place, duration, description);
    });

    eventElement.classList.add("eventElement");
    payPiv.appendChild(eventElement);
  } else {
    console.log("Invalid date selected.");
  }
  }
}

function addEvent() {

    send()
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;

    const eventplace = document.getElementById('eventLocation').value;
    const eventDuration = document.getElementById('eventStart').value + "-" + document.getElementById('eventEnd').value;
    const eventDescription = document.getElementById('eventDescription').value;
    var year = parseInt(eventDate.split('-')[0],10);
    var month = parseInt(eventDate.split('-')[1],10);
    var day = parseInt(eventDate.split('-')[2],10);
    let red = false;
   // Initialize the `red` variable

  // Check if the year is before the current year
  if (year < currentYear) {
      red = true;
  }
  // If the year is the same, check the month
  else if (year === currentYear && month < currentMonth2) {
      red = true;
  }
  // If the year and month are the same, check the day
  else if (year === currentYear && month === currentMonth2 && day < currentDay) {
      red = true;
  }


    const dayDiv = document.querySelector(`.calendar-day[data-date='${eventDate}']`);

    if (dayDiv) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = eventTitle;
        if (red){

          eventElement.style.backgroundColor = "orangered";
          eventElement.style.color = "black";
        }
        eventElement.addEventListener('click', function () {

        showEventDetails(eventTitle, eventDate, eventplace, eventDuration, eventDescription);
      });
        dayDiv.appendChild(eventElement);

    } else {
       console.log("Invalid date selected.");
    }

    document.getElementById('eventTitle').value = "";
    document.getElementById('eventDate').value = "";
}

// function checkEventTimes() {
//   const now = new Date();

//   // Loop through all the events and check if any are within 30, 10, or 5 minutes
//   events.forEach(event => {
//     const eventTime = new Date(event.data);  // Assuming event.data is the event date and time in a parseable format

//     const timeDifference = (eventTime - now) / 60000;  // Time difference in minutes

//     if (timeDifference <= 30 && timeDifference > 29.5) {
//       showNotification(`Event "${event.title}" is starting in 30 minutes!`);
//     } else if (timeDifference <= 10 && timeDifference > 9.5) {
//       showNotification(`Event "${event.title}" is starting in 10 minutes!`);
//     } else if (timeDifference <= 5 && timeDifference > 4.5) {
//       showNotification(`Event "${event.title}" is starting in 5 minutes!`);
//     }
//   });
// }

// // Function to show the notification
// function showNotification(message) {
//   if (Notification.permission === 'granted') {
//     new Notification(message);
//   }
// }

function showEventDetails(title, date, place, euration, description) {
  const [year2, month2, day2] = date.split('-').map(Number);
  const [starttime,endtime] = euration.split("-");
  newstarttime = convertTo12Hour(starttime)
  newendtime = convertTo12Hour(endtime)
  duration = newstarttime + "-" + newendtime;



  textLines = []
  document.getElementById('eventTitleDisplay').textContent = title;
  document.getElementById('eventDateDisplay').textContent = date;
  document.getElementById('eventPlaceDisplay').textContent = place;
  document.getElementById('eventLocationDisplay').textContent = duration;
  document.getElementById('eventDescriptionDisplay').textContent = description;
  const timezone = 'America/Los_Angeles'; // Example: Pacific Time (US & Canada)

  // Get the current date and time
  const now = new Date();

  // Format the date and time in the specified timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formatterTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
  });

  // Get the formatted date in MM/DD/YYYY format
  const eformattedDate = formatter.format(now);
  const formattedTime = formatterTime.format(now);

  // Rearrange the formattedDate to be in YYYY-MM-DD format
  const [month, day, year] = eformattedDate.split('/');
  const formattedDate = `${year}-${month}-${day}`;

  console.log(formattedDate); // Output: 2024-09-13, 22:14:49
  fetch('data.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
  })
  .then(data => {       

    for (let i = 0; i < data.length; i++) {
      if(data[i].title == title){
        const event = data[i];

        // Extract event hours and minutes, converting to numbers for comparison
        const eventHours = parseInt(event.duration.slice(0, 2), 10);
        const eventMinutes = parseInt(event.duration.slice(3, 5), 10);
        const eventEndHours = parseInt(event.duration.slice(6, 8))
        const eventEndMinutes = parseInt(event.duration.slice(9, 11), 10)

        // Extract current hours and minutes, converting to numbers for comparison
        const currentHours = parseInt(formattedTime.slice(0, 2), 10);
        const currentMinutes = parseInt(formattedTime.slice(3, 5), 10);
        //alert(eventMinutes)

        // Ensure the event date is the same as today's date
        const isSameDay = event.data === formattedDate;

        // Check if the event has started by comparing hours and minutes
        const isEventStarted = (
            (eventHours < currentHours) || // If the event started in a previous hour
            (eventHours === currentHours && eventMinutes <= currentMinutes) // If it's the same hour, check minutes
        );
        const isEventEnded = (
          (eventEndHours < currentHours) || // if event ended hour ago
            (eventEndHours === currentHours && eventEndMinutes <= currentMinutes) // If it's the same hour, check minutes
        )
        //alert(currentHours, currentMinutes, eventEndMinutes, eventEndHours)

        // If both conditions are met, update the button text
        if (isSameDay && isEventStarted && !isEventEnded) {
            document.getElementById("joinbutton").textContent = "ATTENDANCE STARTED";
            document.getElementById("joinbutton").style.backgroundColor = "green";
            break; // Exit loop as soon as attendance starts for any even
        } 
      }
    }



  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });



  if (document.getElementById('changechat')){
    document.getElementById('changechat').innerHTML = title + " Chat";
  }
  let eventDate = date;
  const panel = document.getElementById('eventDetailsPanel');
  const eventYear = eventDate.split('-')[0];
  const eventMonth = parseInt(eventDate.split('-')[1],10);
  const eventDay = parseInt(eventDate.split('-')[2],10);
  let joinButton = document.getElementById('joinbutton');
  //add eventDay == currentDay later;

  if (year2 > currentYear || 
       (year2 === currentYear && month2 > currentMonth2) || 
       (year2 === currentYear && month2 === currentMonth2 && day2 >= currentDay)) {

    if (joinButton) {
      textLines = []
        joinButton.style.display = 'block';
      document.getElementById("changechat").style.display = "block";
      document.getElementById("changechat").style.display = "block";
      const title = document.getElementById("eventTitleDisplay").textContent.trim();
      const safeTitle = encodeURIComponent(title)+".txt";  // Sanitizing the title
      //alert(safeTitle)

      fetch(safeTitle)

      .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Parse the JSON data
      })
      .then(data => {       
        const textLines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const userName = localStorage.getItem("nameemail");
        //alert(textLines.includes(userName))

        // Get the user's name from local storage
        if(document.getElementById('eventTitleDisplay').innerHTML == title){
          document.getElementById("mcount").textContent = textLines.length/3;
        }

        // Check if the user's name is in the list of names for this event

        if (textLines.includes(userName) && document.getElementById("eventTitleDisplay").innerHTML.trim() == title ) {

          // If the name is already in the list, show the user they have already joined
          document.getElementById("joinbutton").innerHTML = "Joined";
          document.getElementById("joinbutton").style.backgroundColor = "lightblue"
        } else{
          document.getElementById("joinbutton").innerHTML = "Join";
          document.getElementById("joinbutton").style.backgroundColor = "#52abff";
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }
  } else {

    if (joinButton) {
      document.getElementById("closeevent").style.display = "none";
      document.getElementById("changechat").style.display = "none";
      joinButton.style.display = "none";
    }
  }

  panel.classList.add('show-panel');
  setTimeout(function(){eventdet=false},450);
}

function closeEventDetails() {
  const panel = document.getElementById('eventDetailsPanel');
  panel.classList.remove('show-panel');
}
function editevent(){
  //open edit tnhing
  if (document.getElementById('editDetails').classList.contains("show-panel2")){
    closeeditdet();
    editbar = true;
  }
  else{
    showeditdet();
    setTimeout(function(){editbar=false},450);
  }

}
function closeeditdet(){
  document.getElementById('editDetails').classList.remove("show-panel2");
}
function showeditdet(){
  document.getElementById('editDetails').classList.add("show-panel2");
}

function sidebar() {
  const eventDetailsPanel = document.getElementById('eventDetailsPanel2');

  if (eventDetailsPanel.classList.contains("show-panel2")) {
    closeEventDetails2();
    infobar = true;
  } else {
    showEventDetails2();
    const container = document.getElementById("joinedppl");
    container.innerHTML = '';  // Clear the content

    const eventTitle = document.getElementById("eventTitleDisplay").textContent;
    const safeTitle = encodeURIComponent(eventTitle);

    fetch(safeTitle + '.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        const textLines = data.split('\n');
        let isOwner = false;
        let isOfficer = false;

        for (let i = 2; i < textLines.length; i += 3) {
          const role = textLines[i - 2].toLowerCase();
          const arrivalStatus = textLines[i - 1].trim();
          const name = textLines[i];

          // Check if the current user is an owner or officer
          if (role === "owner" && name === localStorage.getItem("nameemail")) {
            isOwner = true;
            isOfficer = true;
          } else if (role === "officer" && name === localStorage.getItem("nameemail")) {
            isOfficer = true;
          }

          // Create name and role element
          const nameElement = document.createElement('span');
          nameElement.id = name;
          nameElement.textContent = `${name} (${role.charAt(0).toUpperCase() + role.slice(1)})`;  // Display role next to name

          // Append name element
          container.appendChild(nameElement);
          container.appendChild(document.createElement('br'));

          // Add the role input form immediately after the name
          

          // Create arrival button based on the user's arrival status
          const button = document.createElement('button');
          button.className = "button100";

          if (arrivalStatus === "not arrived") {
            button.textContent = "Here";
            button.onclick = function() {
              markArrival(name, eventTitle);
            };
          } else if (!arrivalStatus.includes("minutes")) {
            button.textContent = "Arrived at " + convertTo12Hour(arrivalStatus);
          } else {
            button.textContent = "Finished";
          }
          
          // Append the button after the role form
          if (isOwner || isOfficer) {
            addRoleForm(name, container, isOwner, eventTitle);
            container.appendChild(button);
          }
          container.appendChild(document.createElement('br'));
        }
      })
      .catch(error => {
        console.error('There was a problem with fetching the text file:', error);
      });

    setTimeout(() => { infobar = false }, 450);
  }
}

function markArrival(name, eventTitle) {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const data = {
    buttonId: name,
    buttonkid: formattedTime,
    filePat: eventTitle
  };

  $.ajax({
    type: 'POST',
    url: 'mark.php',
    data: data,
    success: function(response) {
      $('#responseMessage').text(response);
      
    },
    error: function(xhr, status, error) {
      $('#responseMessage').text('An error occurred: ' + error);
    }
  });
  sidebar()
  sidebar()

   // Refresh the sidebar
}

function addRoleForm(name, container, isOwner, eventTitle) {
  const form = document.createElement('form');
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.type = 'text';
  input.width = "150px";
  input.className = "input100";
  input.style.color = 'black';  // Text color
  input.placeholder = isOwner ? "Officer or Owner gives permissions" : "Enter new role";

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();  // Prevent form submission
      if (!isOwner && (input.value.toLowerCase() === "owner" || input.value.toLowerCase() === "officer")) {
        alert("You don't have permission to do this!");
      } else {
        const data = {
          buttonId: name,
          buttonkid: input.value,
          filePat: eventTitle
        };

        $.ajax({
          type: 'POST',
          url: 'assignrole.php',
          data: data,
          success: function(response) {
            $('#responseMessage').text(response);
            sidebar()
            sidebar()
          },
          error: function(xhr, status, error) {
            $('#responseMessage').text('An error occurred: ' + error);
          }
        });
      }
    }
  });

  label.textContent = "Give Role: ";
  form.appendChild(label);
  form.appendChild(input);
  container.appendChild(form);
}






function showEventDetails2(){
  const panel = document.getElementById('eventDetailsPanel2');
  panel.classList.add('show-panel2');

}
function closeEventDetails2() {
  const panel = document.getElementById('eventDetailsPanel2');
  panel.classList.remove('show-panel2');
}

function changetochat(){
  localStorage.setItem("curchat", document.getElementById('changechat').innerHTML)
  eventdet = true;
  closeEventDetails();
  document.getElementById("chatbut2").style.display = "block";
  document.getElementById("chatTitle").innerHTML = localStorage.getItem("curchat");
  document.getElementById("mydiv").style.display = "block";
  document.getElementById("mydiv").classList.add("myDi");

  setTimeout(function(){document.getElementById("mydiv").classList.remove("myDi");document.getElementById("mydiv").style.opacity = 1;chatbar = false;},500)
  displaychat()
}




function chatsend() {
    var chatbox = document.getElementById("chatbox");

    if (!chatbox.value.includes("@gpt") && chatbox.value.trim() !== "" && chatbox.value.trim().length <= 1500) {
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

        const curChat = encodeURIComponent(localStorage.getItem("curchat"));
        const name = encodeURIComponent(localStorage.getItem("nameemail"));
        const chatboxValue = encodeURIComponent(chatbox.value);

        // Create the data string with newlines encoded as %0A
        const data = `username=${curChat}%0A${name} %0A${chatboxValue}`;
        xhr.send(data);

        // Clear chatbox after sending
        chatbox.value = "";
        displaychat();
        document.getElementById("chatContainer").scrollTop = document.getElementById("chatContainer").scrollHeight;
    } else if (chatbox.value.trim().length > 1500) {
        chatbox.value = "Message too long";
    }
}
function displaylb() {
  if (document.getElementById("leaderboardContainer")) {
    var textLines = [];

    // Fetch the leaderboard, email, and members files in parallel
    Promise.all([
      fetch('leaderboard.txt').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      }),
      fetch('email.json').then(response => response.json()),
      fetch('members.json').then(response => response.json())
    ])
    .then(([leaderboardData, emails, members]) => {
      // Create an email-to-name mapping
      const emailToNameMap = emails.reduce((map, email, index) => {
        map[email] = members[index];
        return map;
      }, {});

      // Split the leaderboard data by newlines
      textLines = leaderboardData.split('\n');

      var chat = [];

      // Loop through the lines, assuming even index is a name (email) and odd index is the score
      for (let i = 0; i < textLines.length; i += 2) {
        let email = textLines[i].trim();
        let score = textLines[i + 1] ? parseInt(textLines[i + 1].trim(), 10) : 0; // Convert score to integer

        // Get the name from the email-to-name map, or use the email if no match is found
        let name = email;

        // Only add if the name (or email) exists
        if (name) {
          chat.push({ name: name, score: score });
        }
      }

      // Sort the chat array by score in descending order
      chat.sort(function(a, b) {
        return b.score - a.score;
      });

      // Clear the existing leaderboard content
      document.getElementById("leaderboardContainer").innerHTML = "";

      // Display each player's name and score
      chat.forEach(function(player) {
        var row = document.createElement('tr');

        // Name cell
        var nameCell = document.createElement('td');
        nameCell.className = "namestuf";
        nameCell.innerHTML = emailToNameMap[player.name.trim()] + ":&nbsp;";

        // Highlight the current user's name (assuming you store their email in localStorage)
        if (player.name.trim() === localStorage.getItem("nameemail")) {
          nameCell.style.color = "lightgreen";
          nameCell.style.fontWeight = "bold";
        } else {
          nameCell.style.color = "black";
        }
        row.appendChild(nameCell);

        // Score cell
        var coinsCell = document.createElement('td');
        coinsCell.className = "textstuf";
        coinsCell.innerHTML = (player.score / 60).toString().slice(0, 6) + " hours";
        row.appendChild(coinsCell);

        // Append the row to the leaderboard container
        document.getElementById("leaderboardContainer").appendChild(row);
      });
    })
    .catch(error => {
      console.error('There was a problem with fetching the text files:', error);
    });
  }
}




displaylb()
setInterval(displaylb,60000)
function converttoname(email, callback) {
  Promise.all([
    fetch('email.json').then(response => response.json()),
    fetch('members.json').then(response => response.json())
  ])
  .then(([emails, members]) => {
    const emailIndex = emails.indexOf(email);
    if (emailIndex !== -1 && emailIndex < members.length) {
      const memberName = members[emailIndex];
      callback(memberName); // Call the callback function with the result
    } else {
      console.error('Email not found or index out of bounds');
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

// Example usage:



function displaychat() {
  if (document.getElementById("chatbox")) {
    let textLines = [];
    fetch('chat.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        textLines = data.split('\n');
        const chat = [];

        // Preload the email to name mapping before processing the chat
        Promise.all([
          fetch('email.json').then(res => res.json()),
          fetch('members.json').then(res => res.json())
        ])
        .then(([emails, members]) => {
          // Create a mapping between email and member names
          const emailToNameMap = emails.reduce((map, email, index) => {
            map[email] = members[index];
            return map;
          }, {});

          for (let i = 2; i < textLines.length; i += 3) {
            if (textLines[i - 2] === localStorage.getItem("curchat")) {
              chat.push({ name: textLines[i - 1], score: textLines[i] });
            }
          }

          document.getElementById("chatContainer").innerHTML = "";
          chat.forEach(function (player) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.className = "namestuf";

            const email = player.name.trim();
            const memberName = emailToNameMap[email] || email;

            if (email === localStorage.getItem("nameemail")) {
              nameCell.style.color = "lightgreen";
              nameCell.style.fontWeight = "bold";
            } else {
              nameCell.style.color = "black";
            }

            nameCell.innerHTML = memberName + ":\xa0";
            row.appendChild(nameCell);

            const coinsCell = document.createElement('td');
            coinsCell.className = "textstuf";
            coinsCell.innerHTML = player.score;
            row.appendChild(coinsCell);

            document.getElementById("chatContainer").appendChild(row);
          });
        })
        .catch(error => {
          console.error('There was a problem with fetching email or member data:', error);
        });
      })
      .catch(error => {
        console.error('There was a problem with fetching the text file:', error);
      });
  }
}



// Execute a function when the user presses a key on the keyboard
window.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    chatsend()
  }
});

//just do like 5 seconds, it doesnt matter too much anyways
displaychat();

setInterval(displaychat,6000);
//editing stuff
$('#eventForm').on('submit', function(e) {

    e.preventDefault(); // Prevent form submission from redirecting


    var formData = {
        eventTitle: document.getElementById("eventTitleDisplay").innerHTML,

        newEventTitle: $('#1eventTitle').val(),
        eventDate: $('#1eventDate').val(),
        eventDuration: $('#1eventStart').val() + "-" + $("#1eventEnd").val(),       
        eventPlace: $('#1eventPlace').val(),
        eventDescription: $('#1eventDescription').val()
    };

  $.ajax({
      type: 'POST',
      url: 'updateJson.php',
      data: JSON.stringify(formData),  // Convert formData object to JSON
      contentType: 'application/json', // Make sure the content type is JSON
      success: function(response) {
        location.reload();
          console.log(response);  // Inspect response
      },
      error: function(xhr, status, error) {
          alert('An error occurred: ' + error);
      }
  });


});
window.addEventListener('scroll', function() {
  const siteHeader = document.getElementById('siteheader');
  if (window.scrollY > 50) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

function checkif(){


  if($('#1eventTitle').val() != ""||
$('#1eventDate').val() != ""|| $('#1eventStart').val() != ""||$('#1eventEnd').val() != "" ||$('#1eventPlace').val()!=""|| $('#1eventDescription').val()!=""){
    document.getElementById("submit-btn123").textContent = "Update Event";
  } else{
    document.getElementById("submit-btn123").textContent = "Delete Event";
  }
}
document.addEventListener('mousemove', (e) => {
  createTrail(e.pageX, e.pageY-85);
});
function randomValueInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function createTrail(x, y) {
  const trail = document.createElement('div');
  trail.classList.add('trail');
  trail.style.backgroundColor =  `rgba(${randomValueInRange(150, 200)}, ${randomValueInRange(200, 255)}, ${randomValueInRange(240, 255)}, 0.8)`;
  document.body.appendChild(trail);

  // Position the trail at the mouse coordinates
  trail.style.left = `${x-5}px`;  // Offset horizontally
  trail.style.top = `${y}px`;   // Offset vertically

  // Remove the trail after animation completes
  setTimeout(() => {
      trail.remove();
  }, 800);  // Matches the animation duration
}
function calculatetotal(file, endhr, endmin) {
 

  if(file != ""){
  const safetitle = encodeURIComponent(file) + ".txt";

  fetch(safetitle)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Use .text() for plain text files
    })
    .then(data => {
      const textLines = data.split('\n'); //   Split the text into lines

      for (let i = 2; i < textLines.length; i += 3) {

        if (textLines[i] === localStorage.getItem("nameemail")) {
          const start = textLines[i - 1];
          const starthr = parseInt(start.slice(0, 2), 10);
          const startmin = parseInt(start.slice(3, 5), 10);

          // Fix the condition check
          if (!start.includes("minutes") && start !== "not arrived") {
            // Get the current service minutes from localStorage, default to 0 if not set
            const currentMinutes = parseInt(localStorage.getItem("serviceminutes") || "0", 10);

            // Update service minutes
            localStorage.setItem("serviceminutes", parseInt(currentMinutes) + (60 * (endhr - starthr)) + (endmin - startmin));

            

            const data = {
              buttonId: localStorage.getItem("nameemail"),
              buttonkid: (60 * (endhr - starthr)) + (endmin - startmin).toString() + "minutes",
              filePat: file
            };

            // AJAX request to update the .txt file
            $.ajax({
              type: 'POST',
              url: 'mark.php', // PHP file to process the request
              data: data, // Send the data object
              success: function(response) {
                // Display success message or error from the PHP response
                $('#responseMessage').text(response);
              },
              error: function(xhr, status, error) {
                // Display error if the request fails
                $('#responseMessage').text('An error occurred: ' + error);
              }
            });
          }
          leaderboardupdate();

          // Track service hours here
        }
      }
    })
    .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
    });
}
}


const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function() {


  if ((new Error()).stack.includes('<anonymous>:1')) {
      console.log("XMLHttpRequest send called from console, returning false.");
      return false;
  }
  return originalSend.apply(this, arguments);
};
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {

    if ((new Error()).stack.includes('<anonymous>:1')) {
        console.log("Something was modified via console, returning false.");
      return new Promise((resolve, reject) => {

        resolve(); 
      });
    }
    originalSetItem.call(localStorage, key, value);
};

const originalAjax = $.ajax;

// Override the $.ajax method
$.ajax = function() {
  // Create an Error object to capture the stack trace
  const stackTrace = (new Error()).stack;

  // Log the stack trace for debugging purposes
  console.log("Stack trace from $.ajax:", stackTrace);

  // Check if the stack trace contains specific information
  if (stackTrace.includes('<anonymous>:1')) {
    console.log("$.ajax called from console, modifying behavior.");

    return new Promise((resolve, reject) => {

      resolve(); 
    });
  }

  return originalAjax.apply(this, arguments);
};

function leaderboardupdate() {

  const name = localStorage.getItem("nameemail");
  const serviceMinutes = localStorage.getItem("serviceminutes");

  // Add a log to check if the data is correct
  console.log("Sending Data:", { name, serviceMinutes });

  if (!name || !serviceMinutes) {
    console.error("Invalid name or service minutes");
    return;
  }

  const data = {
    username: localStorage.getItem("nameemail").trim(),
    serviceminutes: localStorage.getItem("serviceminutes").trim()
  }

  $.ajax({
    type: "POST",
    url: "leaderboard.php",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(response) {
      console.log("Data sent successfully:", response);
    },
    error: function(error) {
      console.error("Error sending data:", error);
    }
  });
}

leaderboardupdate()



dragElement(document.getElementById("mydiv"));
dragElement(document.getElementById("mydiv2"));

function dragElement(elmnt) {
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // Get the initial mouse cursor position
  pos3 = e.clientX;
  pos4 = e.clientY;
  // Get the initial element position
  pos1 = elmnt.offsetLeft;
  pos2 = elmnt.offsetTop;
  document.onmouseup = closeDragElement;
  // Call a function whenever the cursor moves
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // Calculate the new cursor position
  var deltaX = e.clientX - pos3;
  var deltaY = e.clientY - pos4;
  // Set the element's new position
  elmnt.style.left = (pos1 + deltaX) + "px";
  elmnt.style.top = (pos2 + deltaY-80) + "px";
}

function closeDragElement() {
  // Stop moving when mouse button is released
  document.onmouseup = null;
  document.onmousemove = null;
}
}

document.getElementById("chaticon2").onclick = function() {

  if (document.getElementById("mydiv").style.display == "block"){
    document.getElementById("mydiv").classList.add("cDi");
    setTimeout(function(){document.getElementById("mydiv").classList.remove("cDi");document.getElementById("mydiv").style.display = "none";    chatbar = true;},450)
  }
  else{

    if (localStorage.getItem("curchat") == "general" && document.getElementById("chatbut2")) {
      document.getElementById("chatbut2").style.display = "none";
    }
    else if (document.getElementById("chatbut2")){
      document.getElementById("chatbut2").style.display = "block";
    }
    document.getElementById("mydiv").style.display = "block";
    document.getElementById("chatTitle").innerHTML = localStorage.getItem("curchat");
    document.getElementById("mydiv").classList.add("myDi");
    setTimeout(function(){document.getElementById("mydiv").classList.remove("myDi");document.getElementById("mydiv").style.opacity = 1; chatbar = false;},500)
    displaychat()
  }

}

function closechatbar(){
  document.getElementById("mydiv").classList.add("cDi");
  setTimeout(function(){document.getElementById("mydiv").classList.remove("cDi");document.getElementById("mydiv").style.display = "none";     chatbar = true;},450)
}

document.getElementById("leadicon").onclick = function() {

  if (document.getElementById("mydiv2").style.display == "block"){
    document.getElementById("mydiv2").classList.add("cDi");
    setTimeout(function(){document.getElementById("mydiv2").classList.remove("cDi");document.getElementById("mydiv2").style.display = "none";    leadbar = true;},450)
  }
  else{


    document.getElementById("mydiv2").style.display = "block";

    document.getElementById("mydiv2").classList.add("myDi");
    setTimeout(function(){document.getElementById("mydiv2").classList.remove("myDi");document.getElementById("mydiv2").style.opacity = 1; leadbar = false;},500)
  }

}
function closeleadbar(){
  document.getElementById("mydiv2").classList.add("cDi");
  setTimeout(function(){document.getElementById("mydiv2").classList.remove("cDi");document.getElementById("mydiv2").style.display = "none";     leadbar = true;},450)
}
// function startSSE() {
//   const source = new EventSource("sse.php");

//   source.onmessage = function(event) {
//       console.log("Update from server:", event.data);
//       displaychat();  // Update the chat when the server sends an update
//   };

//   source.addEventListener('close', function(event) {
//       console.log("Server closed the connection:", event.data);
//       // Automatically reconnect after 1 second
//       setTimeout(startSSE, 1000);
//   });
// }

// // Start the SSE connection
// startSSE();

function displayratings(){
  document.getElementById("ourtutors").innerHTML = ""
  fetch('tutors.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
      textLines = data.split('\n');
      for (let i = 2; i < textLines.length; i += 3){
        const displaydiv = document.getElementById("ourtutors");
         // Clear previous content
        
        const tutor = textLines[i-2];
        const reviews = textLines[i-1];
        const rating = textLines[i];
        const tutordiv = document.createElement("div");
        tutordiv.id = tutor
        const img = document.createElement("img");
        img.src = "bell.png"
        img.width = "500"
        img.height = "500"
        img.id = "belliconimg"
        img.alt = "chat icon"
        const br = document.createElement("br")
        const star1 = document.createElement("button")
        star1.onclick = function() {
          rate(1, tutor);
        };

        star1.innerHTML = "⭐"
        star1.className = ".stars"
        const star2 = document.createElement("button")
        star2.onclick = function() {
          rate(2, tutor);
        };

        star2.innerHTML = "⭐"
        star2.className = ".stars"
        const star3 = document.createElement("button")
        star3.onclick = function() {
          rate(3, tutor);
        };


        star3.innerHTML = "⭐"
        star3.className = ".stars"
        const star4 = document.createElement("button")
        star4.onclick = function() {
          rate(4, tutor);
        };

        star4.innerHTML = "⭐"
        star4.className = ".stars"
        const star5 = document.createElement("button")
        star5.onclick = function() {
          rate(5, tutor);
        };
        star5.innerHTML = "⭐"
        star5.className = ".stars"
        const ratingh2 = document.createElement("h2")
        ratingh2.innerHTML = "Rating: " + (rating/reviews).toString().slice(0,4)+ " Stars"
        const reviewh3 = document.createElement("h3")
        reviewh3.innerHTML = reviews + " Total Reviews"
        
        //replace with tutors later
        displaydiv.appendChild(tutordiv)
        displaydiv.appendChild(br)
        tutordiv.appendChild(img)
        tutordiv.appendChild(star1)
        tutordiv.appendChild(star2)
        tutordiv.appendChild(star3)
        tutordiv.appendChild(star4)
        tutordiv.appendChild(star5)
        displaydiv.appendChild(br)
        tutordiv.appendChild(ratingh2)
        displaydiv.appendChild(br)
        tutordiv.appendChild(reviewh3)
        // alert(localStorage.getItem(`${tutor}`))
        // if(localStorage.getItem(`${tutor}`) == true) {
        //   alert("hi")
        //   stars = document.querySelectorAll(".star")
        //   stars.forEach(star=>{
        //     star.display = "none";
        //   })
        //     //document.getElementById(tutorId).innerHTML = "already rated"

        // }
        

       
      
      }

     })
    .catch(error => {
        console.error('There was a problem with fetching the text file:', error);
    });
}
function rate(newrating, tutorId) {
  // Fetch the tutor data from the text file
  fetch('tutors.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      const textLines = data.split('\n');

      // Loop through the text lines to find the tutor by ID
      for (let i = 2; i < textLines.length; i += 3) {
        const tutor = textLines[i - 2];
        if (tutor.trim() == tutorId.trim()) {
          const reviews = textLines[i - 1];
          const rating = textLines[i];

          // Check if the tutor has already been rated by the user
          if (localStorage.getItem(`${tutor}`)!="rated") {
            
            

            // Mark the tutor as rated in localStorage
            localStorage.setItem(`${tutor}`, "rated");

            // Prepare the updated data to send
            const data = {
              tutor: tutor,
              reviews: (parseInt(reviews) + 1).toString(),
              rating: (parseInt(rating) + parseInt(newrating)).toString()
            };

            // Send the updated rating and reviews to the server
            $.ajax({
              type: "POST",
              url: "tutors.php",
              contentType: "application/json",
              data: JSON.stringify(data),
              success: function(response) {
                console.log("Data sent successfully:", response);
                displayratings()
              },
              error: function(error) {
                console.error("Error sending data:", error);
              }
            });
            
          } else {
            
            // The tutor has already been rated
            console.log("Tutor already rated:", localStorage.getItem(`${tutor}`));
          }
        }
      }
    })
    .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
    });
  
}
displayratings()




// Function to send an email using SendGrid API
function sendEmail(recipient, subject, text) {
  fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: recipient }]
        }
      ],
      from: { email: 'your-email@example.com' }, // Replace with your verified SendGrid sender email
      subject: subject,
      content: [
        {
          type: 'text/plain',
          value: text
        }
      ]
    })
  })
  .then(response => {
    if (response.ok) {
      console.log(`Email sent successfully to ${recipient}`);
    } else {
      console.error(`Failed to send email to ${recipient}`);
    }
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });

}
function switchtoadmin(){
  localStorage.setItem("curchat","admin")
  document.getElementById("chatTitle").innerHTML = localStorage.getItem("curchat");
  document.getElementById("chatbut2").style.display = "block";
  displaychat()
}