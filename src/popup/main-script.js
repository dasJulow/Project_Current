import { firebaseApp } from './firebase_config'
import {
    getAuth,
    onAuthStateChanged
} from 'firebase/auth';
// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);

console.log("popup main!")

onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('logged in!');
        console.log("current")
        console.log(user)
    } else {
        console.log('No user');
    }
});

document.querySelector('#sign_out').addEventListener('click', () => {
    auth.signOut();
    window.location.replace('./popup.html');
});





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
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
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
  // function to handle the form submit event
  async function handleSubmit(event) {
    event.preventDefault();
    const channelName = document.querySelector('#channel-name').value;
    const messageDiv = document.getElementById('message');


    //trying to save channelName input value
    localStorage.setItem('channelName',channelName)

  
    const channelId = await searchChannels(channelName); 
  
    if (channelId) { 
  
      const videoDescriptions = await getVideoDescriptions(channelId, 2); 
  
      if (videoDescriptions.length > 0) { 
  
        // Construct the URL with the videoDescriptions array as a parameter
        const url = `select_links.html?videoDescriptions=${encodeURIComponent(JSON.stringify(videoDescriptions))}`;
  
        // Redirect to select_links.html 
        const selectLinksWindow = window.open(url, '_blank');
        
      } else { 
  
        messageDiv.innerHTML = 'No video descriptions found.'; 
  
      } 
  
    } else { 
  
      messageDiv.innerHTML = 'No channel found.'; 
  
    } 
  }
  
  



// add event listener for form submit
  document.getElementById('search-button')?.addEventListener('click', handleSubmit);

  document.querySelector('#my_saved_links').addEventListener('click', () =>{
    window.open('saved_links.html', '_blank')
  });

