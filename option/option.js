function save_options() {
	let showTopDom = document.getElementById('option-showTopDom').checked;
	let showAllCok = document.getElementById('option-showAllCok').checked;
	let ignoreSite = document.getElementById('option-ignoreSite').value;
	let showKillCur = document.getElementById('option-showKillCur').checked;
	let showKillAllBCur = document.getElementById('option-showKillAllBCur').checked;
	browser.storage.local.set({
		'showTopDom': showTopDom,
		'showAllCok': showAllCok,
		'ignoreSite': ignoreSite,
		'showKillCur': showKillCur,
		'showKillAllBCur': showKillAllBCur
	});
}

function onError(error) {
	console.log(`Error: ${error}`);
}

function onGot(_config) {
	console.log(JSON.stringify(_config));
	document.getElementById('option-showTopDom').checked = !(!_config.showTopDom);
	document.getElementById('option-showAllCok').checked = !(!_config.showAllCok);
	document.getElementById('option-ignoreSite').value = _config.ignoreSite;
	document.getElementById('option-showKillCur').checked = !(!_config.showKillCur);
	document.getElementById('option-showKillAllBCur').checked = !(!_config.showKillAllBCur);
}

function restore_options() {
	document.getElementById('option-showTopDom').addEventListener('change', save_options);
	document.getElementById('option-showAllCok').addEventListener('change', save_options);
	document.getElementById('option-ignoreSite').addEventListener('change', save_options);
	document.getElementById('option-showKillCur').addEventListener('change', save_options);
	document.getElementById('option-showKillAllBCur').addEventListener('change', save_options);
	var gettingItem = browser.storage.local.get({
		'showTopDom': false,
		'showAllCok': true,
		'ignoreSite': '',
		'showKillCur' : true,
		'showKillAllBCur': true,
	});
	gettingItem.then(onGot, onError);
}

document.addEventListener('DOMContentLoaded', restore_options);
