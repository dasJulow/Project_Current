chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.storage.sync.get(null, function(result) {
      console.log("Storage sync is working!!!")
      const links = Object.values(result).flat();
      const matchingLinks = links.filter(link => {
        if (tab.url.startsWith(link)) {
          console.log(`The match is: ${link}`);
          return true;
        } else {
          console.log('Sorry, no match found')
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
