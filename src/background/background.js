chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.storage.sync.get(null, function(result) {
      console.log("Storage sync is working!!!")
      const links = Object.values(result).flat();
      
      const regex = /www(.*?)\.com/;
      const matchingLinks = links.filter(link => {
        if (regex.test(tab.url) && tab.url.includes(link)) {
          console.log(`The match is: ${link}`);
          return true;
        } else {
          
          return false;
        }
      });
      
      if (matchingLinks.length > 0) {
        console.log('2nd if statement');
        const randomMatchingLink = matchingLinks[Math.floor(Math.random() * matchingLinks.length)];
        const allMatchingLinks = links.filter(link => link === randomMatchingLink);
        const randomLink = allMatchingLinks[Math.floor(Math.random() * allMatchingLinks.length)];
        chrome.tabs.update(tabId, { url: randomLink });
        console.log('redirected my friend')
      }
    });
  }
});


