
console.log("popup main!")



const API_KEY = 'AIzaSyAzUeU1l9kfi_cmo02t1BRM8waNw8xMQcE';




// function to search for a YouTube channel by name
async function searchChannels(channelName) {
  
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${API_KEY}`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.items.length > 0) {
      const channelId = data.items[0].id.channelId;
      
      return channelId;
    } else {
      window.alert("No channel found")
      
      return null;
    }
  } catch (error) {
    console.error(error);
    
  }
 
}

// function to fetch video descriptions for a given channel and number of videos
async function getVideoDescriptions(channelId, numberOfVideos) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${numberOfVideos}&order=date&type=video&key=${API_KEY}`;
  
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      const videoIds = data.items.map(item => item.id.videoId);
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${API_KEY}`;
      const videosResponse = await fetch(videosUrl);
      const videosData = await videosResponse.json();
      const descriptions = videosData.items.map(item => {
        return {
          description: item.snippet.description,
          videoId: item.id,
          title: item.snippet.title
        };
      });
      
      return descriptions;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  //function to handle setting local storage and callback
function setLocalStorage(key, value, callback) {
  localStorage.setItem(key, JSON.stringify(value));
  if (callback) {
    callback();
  }
}

  // function to handle the form submit event
  async function handleSubmit(event) {
    event.preventDefault();
    channelName = document.querySelector('#channel-name').value;
     messageDiv = document.getElementById('message');
    localStorage.setItem('channelName', channelName);
  
  
    const channelId = await searchChannels(channelName); 
  
    if (channelId) { 
      const videoDescriptions = await getVideoDescriptions(channelId, 6); 
  
      if (videoDescriptions.length > 0) {
        // Save the videoDescriptions in local storage and open the new window in the callback function
        setLocalStorage('description_fetched', videoDescriptions, () => {
          // Redirect to select_links.html
          window.open('select_links.html', '_blank');
          
        });
      } else { 
        alert("nothing in the description"); 
      } 
    } else { 
      alert("no channel found") 
    } 
  }
  
  
  



// add event listener for form submit
  document.getElementById('search-button')?.addEventListener('click', handleSubmit);

  document.getElementById("my_saved_links")?.addEventListener("click", openNewPage);

  function openNewPage() {
    const startTime = performance.now(); // Get the current time in milliseconds
    window.open("saved_links.html", "_blank");
    const endTime = performance.now(); // Get the current time again
    const timeTaken = endTime - startTime; // Calculate the time taken in milliseconds
    console.log(`Page opened in ${timeTaken} milliseconds.`); // Log the time taken
  }
  


  // own link btn
  document.getElementById('URL-button').addEventListener('click', ownlink);
  
  function ownlink() {
    const inputField = document.getElementById('own-link');
    const link = inputField.value;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    if (urlRegex.test(link)) {
      chrome.storage.sync.set({ MyLinks: [link] }, function() {
        console.log('Link saved to storage');
      });
    } else {
      alert('Not a valid link');
    }
  }
  
  
  



  






  



