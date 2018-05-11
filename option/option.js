async function save_options() {
	let showTopDom = document.getElementById('option-showTopDom').checked;
	let showAllCok = document.getElementById('option-showAllCok').checked;
	let ignoreSite = document.getElementById('option-ignoreSite').value;
	let showKillCur = document.getElementById('option-showKillCur').checked;
	let showKillAllBCur = document.getElementById('option-showKillAllBCur').checked;
	await setStorage({
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
	document.getElementById('option-showTopDom').checked = !(!_config.showTopDom);
	document.getElementById('option-showAllCok').checked = !(!_config.showAllCok);
	document.getElementById('option-ignoreSite').value = _config.ignoreSite;
	document.getElementById('option-showKillCur').checked = !(!_config.showKillCur);
	document.getElementById('option-showKillAllBCur').checked = !(!_config.showKillAllBCur);
}

async function restore_options() {
	document.getElementById('option-showTopDom').addEventListener('change', save_options);
	document.getElementById('option-showAllCok').addEventListener('change', save_options);
	document.getElementById('option-ignoreSite').addEventListener('change', save_options);
	document.getElementById('option-showKillCur').addEventListener('change', save_options);
	document.getElementById('option-showKillAllBCur').addEventListener('change', save_options);
	var _config = await getStorage();
	onGot(_config);
}

document.addEventListener('DOMContentLoaded', restore_options);
