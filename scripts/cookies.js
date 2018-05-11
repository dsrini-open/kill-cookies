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

function getAllCookies() {
  let jsonObj = {};
  if(_fpIsolateVal) {
    jsonObj.firstPartyDomain = null;
  }
  return browser.cookies.getAll(jsonObj);
}

async function getCookies(url, domain, fpIsolate = false) {
  let cookies = [], tmpCookies, jsonObj = {};
  if(url) jsonObj.url = url;
  if(domain) jsonObj.domain = domain;

  if(!fpIsolate) {
    tmpCookies = await getCookies(url, domain, true);
    cookies = cookies.concat(tmpCookies);
  }

  jsonObj.firstPartyDomain = fpIsolate
                              ? url ? getDomain(url) : domain
                              : "";

  try{
    tmpCookies = await browser.cookies.getAll(jsonObj);
  } catch (error) {
    tmpCookies = [];
  }
  cookies = cookies.concat(tmpCookies);

  return cookies;
}

function removeCookie(cookie, url) {
  url = url || getCookieUrl(cookie);
  let jsonObj = { name: cookie.name, url: url };
  if(_fpIsolateVal) {
    if(cookie.firstPartyDomain === undefined)
      jsonObj.firstPartyDomain = getDomain(url);
    else
      jsonObj.firstPartyDomain = cookie.firstPartyDomain;
  }
  let removing = browser.cookies.remove(jsonObj);
  removing.then(onRemoveCookie, onErrorRemovingCookie);
}

function removeAllCookies() {
  browser.browsingData.removeCookies({}).then(onRemoveCookie, onErrorRemovingCookie);
}
