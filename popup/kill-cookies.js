var _options, _fpIsolateVal;

function displayCookies(cookies, pageCookies) {

	const sortProp = 'custDomain';
    var cookieList = document.getElementById('list-cookies');
    var cookiesGroup = {};
    var cookieCustDomArr, matchCkDom;
    var pageCookiesDomArr = pageCookies.map(each => each.domain);

    // generate current domain
    var currDomArr = pageCookies[0] ? pageCookies[0].domain.split('.') : [];
    if(currDomArr.length > 2){
    	currDomArr.splice(0, currDomArr.length - 2);
	}
    var currDom = currDomArr.join('.');

    // Show kill all related with current page
	if(pageCookies.length > 0) {
		if(_options.showKillAllBCur)
			replaceIdWithMessage("killAllButCurrent", currDom);
		if(_options.showKillCur)
			replaceIdWithMessage("killCurrent", currDom);

    	// current domain cookies
    	if(!_options.showTopDom) {

    		let div = document.createElement('div');
    		let content = document.createTextNode(currDom);
	        div.appendChild(content);
	        cookieList.appendChild(div);

	    	for (cookie of pageCookies) {
		        let subDiv = document.createElement('div');
		        subDiv.classList.add('button');
		        subDiv.classList.add('child-button');
		        let subContent = document.createTextNode(cookie.name);
		        subDiv.appendChild(subContent);

		        cookieList.appendChild(subDiv);
	    	}

	        div = document.createElement('div');
	        div.classList.add('panel-section-separator');
	        cookieList.appendChild(div);
    	}

	}

	/**
	 * NOTE: For now the show all cookies option is disbaled,
	 * as there is no way to delete the cookies for all pages without the url.
	 */
	// Loop through all cookies if the option enabled.
    if (cookies.length > 0 && _options.showAllCok) {

    	// Create custom domain for last two parts of domain addresses
    	for (cookie of cookies) {

    		matchCkDom = pageCookiesDomArr.find(function(eachDomain) {
    			return cookie.domain.indexOf(eachDomain) > -1;
    		});

    		// ignore current page cookies
    		if(matchCkDom)
    			continue;

    		cookieCustDomArr = cookie.domain.split('.');
    		if(cookieCustDomArr.length > 2){
        		cookieCustDomArr.splice(0, cookieCustDomArr.length - 2);
    		}
    		cookie.custDomain = cookieCustDomArr.join('.');
    	}

    	// sort by domain names
    	cookies.sort(function(a,b) {
    		return a[sortProp] < b[sortProp] ? -1 : a[sortProp] > b[sortProp] ? 1 : 0;
    	});

    	// group cookies by domain
    	for (cookie of cookies) {
    		// ignore if custDomain not found
    		if(!cookie.custDomain)
    			continue;
    		if(!cookiesGroup[cookie.custDomain])
    			cookiesGroup[cookie.custDomain] = [];
    		cookiesGroup[cookie.custDomain].push(cookie.name);
    	}

    	// List cookies with inline for cookie names
    	for (group in cookiesGroup) {
	        let div = document.createElement('div');
	        div.classList.add('button');

	        if(!_options.showTopDom)
	        	div.classList.add('unfold');

	        let content = document.createTextNode(group);
	        div.appendChild(content);

	        if(!_options.showTopDom) {
		        for(subGroup of cookiesGroup[group]) {
		        	let subDiv = document.createElement('div');
		        	subDiv.classList.add('button');
		        	subDiv.classList.add('child-button');
		        	subDiv.classList.add('hidden');
		            let subContent = document.createTextNode(subGroup);
		            subDiv.appendChild(subContent);
			        div.appendChild(subDiv);
		        }
	        }

	        cookieList.appendChild(div);
    	}

    } else if(cookies.length == 0){
      let p = document.createElement("p");
      let content = document.createTextNode(browser.i18n.getMessage("emptyCookies"));
      let parent = cookieList.parentNode;

      p.appendChild(content);
      parent.appendChild(p);
    }

    document.addEventListener("click", clickHandler);
}

async function loadPageCookies(){
	var _config = await getStorage()
			,fpIsolate = await browser.privacy.websites.firstPartyIsolate.get({});

	_fpIsolateVal = fpIsolate.value;

	var _cookies = await getAllCookies()
			,_tab = await browser.tabs.query({currentWindow: true, active: true})
			,_url = _tab.pop().url
			,_pageCookies = await getCookies(_url);

	_options = _config;

	displayCookies(_cookies, _pageCookies);
}

loadPageCookies();
