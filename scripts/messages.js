/**
 * Function replaces __MSG_***__ meta tags in html page
 * @returns
 */
function replaceMsgsHtmlPage() {
	var objects = document.querySelectorAll('.message');
	for (var j = 0; j < objects.length; j++) {
		var obj = objects[j];

		var valStrH = obj.innerHTML.toString();
		var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
			return v1 ? browser.i18n.getMessage(v1) : "";
		});

		if (valNewH != valStrH) {
			obj.innerHTML = valNewH;
		}
	}
}

/**
 * Function replaces html messages with parameterized message using I18 
 * @param elementId div id
 * @param defaultValue default value to replace with
 * @returns
 */
function replaceIdWithMessage(elementId, defaultValue){
	var _element = document.getElementById(elementId);
	var valStrH = _element.innerHTML.toString();
	var message = browser.i18n.getMessage(elementId, defaultValue);
	valStrH = valStrH.replace('__MSG___', message);
	_element.innerHTML = valStrH;
	_element.removeAttribute("hidden");
}

replaceMsgsHtmlPage();

