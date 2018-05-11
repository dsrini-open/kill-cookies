
function getHost(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function getDomain(url){
	let host = getHost(url)
			,arrHost = host.split('.')
			,arrDom = arrHost;

	if(arrHost.length >= 2)
		arrDom = arrHost.splice(arrHost.length - 2);

	return arrDom.join('.');
}

async function clickHandler(e){
	var cookieDomain, cookies, cookieName, removing, skipEvent = true, showChildren;

	var tabs = await browser.tabs.query({currentWindow: true, active: true})
		,url = tabs.pop().url;

	 if(e.target.id == 'killAllCookies' ){
		 removeAllCookies();
	} else if(e.target.id == 'killCurrent') {
		cookies = await getCookies(url);

		for (cookie of cookies){
			removeCookie(cookie, url);
		}

	} else if(e.target.id == 'killAllButIgnored') {
		var ignoreSitesArr = _options.ignoreSite.split(','), siteMatch;

		if(ignoreSitesArr.length > 0) {
			cookies = await getAllCookies();

			for (cookie of cookies){

				siteMatch = ignoreSitesArr.find(function(eachIgnoreSite) {
	    			return cookie.domain.indexOf(eachIgnoreSite) > -1;
	    		});

				if(!siteMatch) {
					removeCookie(cookie);
				}
			}
		} else
			removeAllCookies();

	} else if(e.target.id == 'killAllButCurrent') {
		cookies = await getAllCookies();

		for (cookie of cookies){
			if(url.indexOf(cookie.domain) == -1) {
				removeCookie(cookie);
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
		if(url.indexOf(cookieDomain) > 0 && isChild) {
			removeCookie({name: cookieName}, url);
		} else {
			cookies = await getCookies(undefined, cookieDomain);

			// For parent webpage click remove all cookies else only specific cookie
			for (cookie of cookies) {
				if(isChild && cookieName == cookie.name || !isChild) {
					removeCookie(cookie);
				}
			}

		}

	}

	if(skipEvent) {
		e.preventDefault();
		window.close();
	}
}
