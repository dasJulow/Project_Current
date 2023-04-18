let isDragging = false; // initialize dragging flag

chrome.windows.onFocusChanged.addListener(function(windowId) {
	if (windowId === -1) {
	  return;
	}
	chrome.windows.get(windowId, function(window) {
	  isDragging = window && window.type === 'normal' && window.state === 'fullscreen';
	});
  });
  

var currentTab_ = "";
chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	if (isDragging) {
		return;
	  }
	
	chrome.storage.local.set({'last_url': details.url});

	getCurrentTab().then(function(data) {
		currentTab_ = data;
		var shouldRedirect = false;
	});
	chrome.storage.local.get(null, function(result) {
        console.log("Storage sync is working!!!")
		var perform_redirect = result.perform_redirect == null ? false : result.perform_redirect;
		var last_url = result.last_url;
		var redirected_list = result.redirected_list == null ? [] : result.redirected_list;
		delete result["last_url"];
		delete result["lasturl"];
		delete result["perform_redirect"];
		delete result["redirected_list"];
		const links = Object.values(result).flat();
		const matchingLinks = links.filter(link => {
			var url_ = link.split("/");
			
			if (last_url.indexOf(url_[2]) > -1  && (redirected_list.length == 0 || (currentTab_.length > 0 &&redirected_list.find(x=>x.tabid == currentTab_[0].id) == null))) {
				console.log(`The match is: ${link}`);
				chrome.storage.local.set({'perform_redirect': true});
				setCurrentTab(redirected_list,new URL(details.url).origin,false);
				shouldRedirect = true;
				chrome.tabs.update({url: link});
				return true;
			} else {
				console.log('Sorry, not match founds');
				return false;
			}
		});
		if (matchingLinks.length > 0) {
			const randomMatchingLink = matchingLinks[Math.floor(Math.random() * matchingLinks.length)];
			const allMatchingLinks = links.filter(link => link === randomMatchingLink);
			const randomLink = allMatchingLinks[Math.floor(Math.random() * allMatchingLinks.length)];
			//chrome.tabs.update(details.tabId, { url: randomLink });
		}
	});
});
chrome.webNavigation.onCompleted.addListener(function(details) {
    console.log("Extension is running!");
	
    chrome.storage.local.get(null, function(result) {
        console.log("Storage sync is working!!!")
		var perform_redirect = result.perform_redirect == null ? false : result.perform_redirect;
		var last_url = result.last_url;
		var redirected_list = result.redirected_list == null ? [] : result.redirected_list;
		delete result["last_url"];
		delete result["lasturl"];
		delete result["perform_redirect"];
		delete result["redirected_list"];
		const links = Object.values(result).flat();
		const matchingLinks = links.filter(link => {
			var url_ = link.split("/");
			if((redirected_list.length > 0 && redirected_list.find(x=>x.tabid == currentTab_[0].id) != null && !redirected_list.find(x=>x.tabid == currentTab_[0].id).redirected)){
				console.log("Redirecting");
				setCurrentTab(redirected_list,new URL(redirected_list.find(x=>x.tabid == currentTab_[0].id).url).origin,true);
				chrome.tabs.update({url: new URL(redirected_list.find(x=>x.tabid == currentTab_[0].id).url).origin});
				return true;
			}
		});
    });
});
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let tab = await chrome.tabs.query(queryOptions);
  return tab;
}
function setCurrentTab(addedList,url,redi){
	if(currentTab_.length > 0 && addedList.length > 0){
		removeById(addedList,currentTab_[0].id);
	}
	if(currentTab_.length > 0){
		addedList.push({"tabid":currentTab_[0].id,"url":url,"redirected":redi});
		chrome.storage.local.set({'redirected_list': addedList});
	}
}
function checkRedirection(addedList,url){
	if(currentTab_.length > 0 ){
		var validated_tab = addedList.find(x=>x.tabid == currentTab_[0].id);
		if(validated_tab != null && validated_tab.url.indexOf(url) > -1 && !validated_tab.redirected){
			return true;
		}
	}
	return false
}
const removeById = (arr, id) => {
	
   const requiredIndex = arr.findIndex(x=>x.tabid == id);
   return !!arr.splice(requiredIndex, 1);
};