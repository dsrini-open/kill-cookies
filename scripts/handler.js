function onRemoveCookie(cookie){
	console.log(`Removed: ${JSON.stringify(cookie)}`);
}

function onErrorRemovingCookie(error){
	console.log(`Error removing cookie: ${error}`);
}

/**
 * Function returns url for a cookie based on domain and path
 * @param cookie
 * @returns
 */
function getCookieUrl(cookie){
	var cookieUrl = cookie.secure ? 'https://' : 'http://';
	cookieUrl += cookie.domain + cookie.path;
	return cookieUrl;
}

async function clickHandler(e){
	var cookieDomain, cookies, cookieName, cookieUrl, removing, skipEvent = true, showChildren;

	var tabs = await browser.tabs.query({currentWindow: true, active: true})
		,url = tabs.pop().url;
	
	 if(e.target.id == 'killAllCookies' ){
		 browser.browsingData.removeCookies({}).then(onRemoveCookie, onErrorRemovingCookie);
	} else if(e.target.id == 'killCurrent') {
		cookies = await browser.cookies.getAll({url: url});
		
		for (cookie of cookies){
			removing = browser.cookies.remove({name: cookie.name, url: url});
			removing.then(onRemoveCookie, onErrorRemovingCookie);
		}
		
	} else if(e.target.id == 'killAllButIgnored') {
		var ignoreSitesArr = _options.ignoreSite.split(','), siteMatch;
		
		if(ignoreSitesArr.length > 0) {
			cookies = await browser.cookies.getAll({});
			
			for (cookie of cookies){
				
				siteMatch = ignoreSitesArr.find(function(eachIgnoreSite) {
	    			return cookie.domain.indexOf(eachIgnoreSite) > -1;
	    		});
				
				if(!siteMatch) {
					cookieUrl = getCookieUrl(cookie);
					removing = browser.cookies.remove({name: cookie.name, url: cookieUrl});
					removing.then(onRemoveCookie, onErrorRemovingCookie);
				}
			}
		} else
			browser.browsingData.removeCookies({}).then(onRemoveCookie, onErrorRemovingCookie);
		
	} else if(e.target.id == 'killAllButCurrent') {
		cookies = await browser.cookies.getAll({});
		
		for (cookie of cookies){
			if(url.indexOf(cookie.domain) == -1) {
				cookieUrl = getCookieUrl(cookie);
				removing = browser.cookies.remove({name: cookie.name, url: cookieUrl});
				removing.then(onRemoveCookie, onErrorRemovingCookie);
			}
		}
		
	} else if(e.target.classList.contains('button') 
			&& (e.target.classList.contains('unfold') || e.target.classList.contains('fold')) 
			&& e.layerX <= 15) {

		// Hide or show the drop-downs
		showChildren = e.target.classList.contains('unfold');

		if(showChildren){
			e.target.classList.remove('unfold');
			e.target.classList.add('fold');
		} else {
			e.target.classList.remove('fold');
			e.target.classList.add('unfold');
		}
		
		for(var element of e.target.children){
			if(showChildren)
				element.classList.remove('hidden');
			else
				element.classList.add('hidden');
		}
		
		skipEvent = false;
		
	} else if(e.target.classList.contains('button')){
		
		var isChild = e.target.classList.contains('child-button');
	
		cookieDomain = isChild
							? e.target.parentElement.childNodes[0].textContent.toString().trim()
							: e.target.childNodes[0].textContent.toString().trim();
		if(isChild)
			cookieName = e.target.textContent;
		
		// For current page only remove specific cookie
		if(url.indexOf(cookieDomain) > 0 && isChild){
			removing = browser.cookies.remove({name: cookieName, url: url});
			removing.then(onRemoveCookie, onErrorRemovingCookie);
		} else {
			cookies = await browser.cookies.getAll({domain: cookieDomain});
			
			// For parent webpage click remove all cookies else only specific cookie
			for (cookie of cookies){
				cookieUrl = getCookieUrl(cookie);
				
				if(isChild && cookieName == cookie.name || !isChild){
					removing = browser.cookies.remove({name: cookie.name, url: cookieUrl});
					removing.then(onRemoveCookie, onErrorRemovingCookie);
				} 
			}
			
		}
		
	}
	
	if(skipEvent) {
		e.preventDefault();
		window.close();
	}
}

// PREVIOUS version of click handler will only retrieve two / four functions
/* 
async function clickHandler(e){
	var cookieDomain, cookieName, cookies, removing;
	
	var tabs = await browser.tabs.query({currentWindow: true, active: true})
		,url = tabs.pop().url;
	
	if(e.target.id == 'killAllCookies' ){
		browser.browsingData.removeCookies({}).then(onRemoveCookie, onErrorRemovingCookie);
	} else if(e.target.id == 'killCurrent') {
		cookies = await browser.cookies.getAll({domain: cookieDomain});
		
		for (cookie of cookies){
			removing = browser.cookies.remove({name: cookie.name, url: url});
			removing.then(onRemoveCookie, onErrorRemovingCookie);
		}
		
	} else if(e.target.classList.contains('button')){
		
		cookieDomain = e.target.parentElement.firstChild.textContent;
		cookieName = e.target.textContent;
		
		cookies = await browser.cookies.getAll({domain: cookieDomain});
		
		removing = browser.cookies.remove({name: cookieName, url: url});
		removing.then(onRemoveCookie, onErrorRemovingCookie);
	}
	
	e.preventDefault();
	window.close();
}
*/