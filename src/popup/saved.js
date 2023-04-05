// Retrieve all keys in chrome.storage
chrome.storage.sync.get(null, function(items) {
  // Keep track of keys that have already been processed
  var processedKeys = {};

  // Loop through each key
  for (var key in items) {
    // Check if this key has already been processed
    if (processedKeys.hasOwnProperty(key)) {
      continue;
    }

    // Add this key to the list of processed keys
    processedKeys[key] = true;

    // Create a new unordered list for this key
    var ul = document.createElement('ul');

    // Create a new list item for each link in this key
    for (var i = 0; i < items[key].length; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = items[key][i];
      a.innerText = items[key][i];
      li.appendChild(a);
      ul.appendChild(li);
    }

    // Set the title of the unordered list to the key
    var title = document.createElement('h2');
    title.innerText = key;
    document.body.appendChild(title);

    // Append the unordered list to the body of the page
    document.body.appendChild(ul);
  }
});

  