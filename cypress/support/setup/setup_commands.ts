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

export const setLocalStorageV3 = () => {
  cy.window().then((win) => {
    win.localStorage.setItem(
      'device',
      JSON.stringify({
        deviceUID: 'dev:868531060199234',
        pin: '1234',
        productUID: 'product:com.blues.airnote.v3'
      })
    );
  });
};
