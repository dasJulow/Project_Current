


const currentChannelName = localStorage.getItem('channelName');




const affiliateLinksUl = document.getElementById('affiliate-links');

const videoDescriptions = JSON.parse(localStorage.getItem('description_fetched'));


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
        link.classList.add('your-link');

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
              storage.get(currentChannelName, function(result) {
                const links = result[currentChannelName] || [];
                if (!links.includes(event.target.href)) {
                  links.push(event.target.href);
                  storage.set({ [currentChannelName]: links }, function() {
                    console.log('Link saved to storage');
                    localStorage.removeItem('description_fetched');

                  });
                } else {
                  console.log('Link already exists in storage');
                }
              });
            });
          }
        }
      });
    }
  });
}



//btn done
 btnFinished = document.getElementById('btn_finished');
btnFinished.addEventListener('click', () => {
  window.close();
});







