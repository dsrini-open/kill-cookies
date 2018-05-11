async function getStorage() {
  var _storage = await browser.storage.local.get();
	if(typeof _storage.showTopDom !== 'boolean') {
		_storage = {
			'showTopDom': false,
			'showAllCok': true,
			'ignoreSite': '',
			'showKillCur' : true,
			'showKillAllBCur': true,
		};
	}
  return _storage;
}

async function setStorage(_storage) {
  await browser.storage.local.set(_storage);
}
