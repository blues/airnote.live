export const setLocalStorage = () => {
	cy.window().then((win) => {
		win.localStorage.setItem(
			'device',
			JSON.stringify({
				deviceUID: 'dev:864475044215258',
				pin: '1234',
				productUID: 'product:org.airnote.solar.v1'
			})
		);
	});
};
