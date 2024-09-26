async function chatbotMessage(message, curchat) {
  const OPENAI_API_KEY = process.env.OPENAI; // Replace with your API key

  console.log("Starting chatbotMessage with message:", message, "and curchat:", curchat);


    try {
      const response = await fetch("data.json");
      if (!response.ok) {
        throw new Error("Network response was not ok while fetching data.json");
      }

      const data = await response.json();
      console.log("data.json content:", data);
      
        const chatResponse = await fetch(`${curchat}.txt`);
        if (!chatResponse.ok) {
          throw new Error(`Network response was not ok while fetching ${curchat}.txt`);
        }
      

      const chatData = await chatResponse.text();
      console.log(`${curchat}.txt content:`, chatData);
     
      const now = new Date();
      const timezone = 'America/Los_Angeles';
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

      const GPT4Message = [
        {
          role: "system",
          content: `Here is all of the Event Calendar Data: ${JSON.stringify(data)}. Ignore all data with no title. 
          Ignore this one if empty, but it contains information relative to the event chatroom you are in. Also, use this information before the other data to answer questions if the data exists: ${chatData}. 
          If you are prompted, the current date is ${eformattedDate} and the time is ${formattedTime}. Your answer should be in one line and one line only. And linebreaks will break the code.`,
        },
        {
          role: "user",
          content: message,
        },
      ];

      console.log("Sending GPT-4 request with message:", GPT4Message);

      const GPT4Response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: GPT4Message
        })
      });

      if (!GPT4Response.ok) {
        throw new Error("Network response was not ok from GPT-4 API");
      }

      const GPT4Data = await GPT4Response.json();
      console.log("GPT-4 API response:", GPT4Data);

      if (!GPT4Data.choices || !GPT4Data.choices[0].message.content) {
        throw new Error("Invalid response format from GPT-4");
      }

      return GPT4Data.choices[0].message.content;
    } catch (error) {
      console.error("Error in fetching data or calling GPT-4:", error);
      return "There was an error processing your request.";
    }
  
}



export { chatbotMessage };
