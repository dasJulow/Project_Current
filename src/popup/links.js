import { channelName } from "./popup";
console.log(channelName);

document.addEventListener("DOMContentLoaded", function(event) {
  const heading = document.getElementById('aff_links');
  if(heading !=null){heading.innerText += ` for ${channelName}`;}
  console.log("javascript connected!")
  

});

const affiliateLinksUl = document.getElementById('affiliate-links');

// Get the video descriptions from the URL parameter and parse it back into an array
const urlParams = new URLSearchParams(window.location.search);
const videoDescriptions = JSON.parse(decodeURIComponent(urlParams.get('videoDescriptions')));

// Declare and initialize the storage variable
const storage = chrome.storage.sync;

// Loop through the video descriptions and create li elements with links
if (videoDescriptions != null) {
  videoDescriptions.forEach(description => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = description.description.match(urlRegex);

    if (matches) {
      // Remove duplicate matches
      const uniqueMatches = [...new Set(matches)];

      uniqueMatches.forEach(match => {
        const link = document.createElement('a');
        link.textContent = match;
        link.href = match;

        if (match.startsWith('http') || match.startsWith('https')) {
          // Check if the link already exists in the affiliateLinksUl list
          const existingLinks = affiliateLinksUl.querySelectorAll('a[href="' + match + '"]');

          if (existingLinks.length === 0) {
            const li = document.createElement('li');
            li.appendChild(link);
            affiliateLinksUl.appendChild(li);
            li.classList.add('style');
            link.addEventListener('click', function(event) {
              event.preventDefault();
              // Assuming 'currentChannelName' is already declared in the file
              const links = result[channelName] || [];
              if (!links.includes(event.target.href)) {
                links.push(event.target.href);
                storage.set({ [channelName]: links }, function() {
                  console.log('Link saved to storage');
                });
              } else {
                console.log('Link already exists in storage');
              }
            });
            
          }
        }
      });
    }
  });
}









