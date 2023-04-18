  // Retrieve all keys in chrome.storage
  chrome.storage.sync.get(null, function(items) {
      // Keep track of keys that have already been processed
      var processedKeys = {};
      const ignoredKeys = ['perform_redirect', 'redirected_list', 'last_url', 'MyLink'];
    
      // Loop through each key
      for (var key in items) {
        // Check if this key has already been processed
        if (processedKeys.hasOwnProperty(key) || ignoredKeys.includes(key)) {
          continue;
        }

        if(!items[key].length){
          continue;
        }
    
        // Add this key to the list of processed keys
        processedKeys[key] = true;
    
        // Create a new section for this key
        var section = document.createElement('section');
        section.classList.add('section_class');
    
        // Create a new unordered list for this key
        var ul = document.createElement('ul');
        ul.classList.add('channel_saved');
    
        // Create a new list item for each link in this key
        for (var i = 0; i < items[key].length; i++) {
          var li = document.createElement('li');
          li.classList.add('li_saved');
          var a = document.createElement('a');
          a.classList.add('a_saved');  
          a.href = items[key][i];
          a.innerText = items[key][i];
    
          a.addEventListener('click', function(event){
            event.preventDefault();
          });
    
          li.appendChild(a);
          ul.appendChild(li);
  
        // Add event listener to the li element
        li.addEventListener('click', function() {
          if (this.getAttribute('data-checked') === 'true') {
            this.setAttribute('data-checked', 'false');
            this.style.backgroundColor = 'whitesmoke';
          } else {
            this.setAttribute('data-checked', 'true');
            this.style.backgroundColor = 'red';
          }
        });
  
        // Set the initial value of the data-checked attribute to false
        li.setAttribute('data-checked', 'false');
      }
  
      // Set the title of the section to the key
      var h2 = document.createElement('h2');
      h2.classList.add('title_saved');
      var h2Text = document.createTextNode(key);
      h2.appendChild(h2Text);
  
      // Append the h2 element to the section
      section.appendChild(h2);
  
      // Append the unordered list to the section
      section.appendChild(ul);
  
      // Append the section to the div with class "div1"
      document.querySelector('.div1').appendChild(section);
    }
  });


 // Delete links button
document.getElementById('btn_delete_links').addEventListener('click', deleteLinks);

function deleteLinks() {
  // Get all the list items with class 'li_saved'
  const listItems = document.querySelectorAll('.li_saved');

  // Initialize an empty array to store links to delete
  const linksToDelete = [];

  // Loop through the list items
  listItems.forEach((item, index) => {
    if (item.getAttribute('data-checked') === 'true') {
      const link = item.querySelector('.a_saved').href;

      // Add the link to the linksToDelete array
      linksToDelete.push(link);

      // Remove the list item from the UI
      item.remove();
    }
  });

  // Remove links from chrome.storage.sync
  chrome.storage.sync.get(null, (items) => {
    for (const key in items) {
      if (Array.isArray(items[key])) { // Check if items[key] is an array
        items[key] = items[key].filter((link) => !linksToDelete.includes(link));
      }
    }

    // Update the chrome.storage.sync with the new list of links
    chrome.storage.sync.set(items, () => {
      console.log('Links removed from chrome.storage.sync');
    });
  });
}


  

  





  




  