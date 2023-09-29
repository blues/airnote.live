describe('Airnote application', () => {
	it('should render the landing page welcoming users and directing them to set up an Airnote if they have not already', () => {
		cy.visit('/');
		// check title is visible
		cy.get('[data-cy="page-title"]').should('contain', 'Welcome to Airnote!');
		// check settings link is hidden (b/c Airnote creds not setup)
		cy.get('[data-cy="settings-link"]').should('not.exist');
		// check dashboard link is hidden (b/c Airnote creds not setup)
		cy.get('[data-cy="dashboard-link"]').should('not.exist');
		// check setup airnote button present
		cy.get('[data-cy="setup-airnote-btn"]')
			.should('have.attr', 'href')
			.and('include', 'https://start.airnote.live');
		// check buy airnote button present
		cy.get('[data-cy="buy-airnote-btn"]')
			.should('have.attr', 'href')
			.and('include', 'https://shop.blues.io/products/airnote');
		// check footer notecard link visible
		cy.get('[data-cy="notecard-link"]')
			.should('have.attr', 'href')
			.and('include', 'https://blues.io/products');
		// check footer blues wireless link visible
		cy.get('[data-cy="blues-link"]').should('have.attr', 'href').and('include', 'https://blues.io');
		// check footer safecast link visible
		cy.get('[data-cy="safecast-link"]')
			.should('have.attr', 'href')
			.and('include', 'https://safecast.org');
	});

	it('should navigate to the Airnote settings page and render the correct data and inputs should be disabled', () => {
		cy.setLocalStorage();
		cy.visit('/');
		// navigate to settings page
		cy.get('[data-cy="settings-link"]').click();
		// check device settings title is visible
		cy.get('[data-cy="device-settings-title"]').should('contain', 'Device Settings');
		// check device owner info title is visible
		cy.get('[data-cy="device-owner-title"]').should('contain', 'Device Owner Info');
		// check link to Airnote Notehub link is visible
		cy.get('[data-cy="notehub-link"]')
			.should('have.attr', 'href')
			.and('include', 'https://notehub.io');
		// check that inputs are disabled because PIN is not correct
		cy.get('input').should('be.disabled');
	});

	it("Redirects Notehub 'Dashboard' links to the Airnote dashboard", () => {
		// visit the settings page with no pin
		cy.visit('/dev:864475044215258?product=product%3Aorg.airnote.solar.air.v1&pin=');
		// should redirect to the dashboard
		cy.url().should('include', 'dashboard');
	});

	it('Does NOT redirect internal navigation back to the dashboard', () => {
		// visit the dashboard page with no pin
		cy.visit('/dev:864475044215258/dashboard?product=product%3Aorg.airnote.solar.air.v1&pin=');
		// navigate to settings page
		cy.get('[data-cy="settings-link"]').click();
		//should not redirect back to the dashboard
		cy.url().should('not.contain', 'dashboard');
		cy.url().should('include', 'internalNav=true');
	});

	it('should navigate to the Airnote dashboard page and render the correct data', () => {
		cy.setLocalStorage();
		cy.visit('/');
		// navigate to dashboard page
		cy.get('[data-cy="dashboard-link"]').click();
		// check dashboard title is visible
		cy.get('[data-cy="dashboard-title"]').should('be.visible');
		// check aqi speedometer is visible
		cy.get('[data-cy="aqi-speedometer"]').should('be.visible');
		// check pms are visible
		cy.get('[data-cy="measurement-pm').should('be.visible');
		// check air readings are visible
		cy.get('[data-cy="measurement-air').should('be.visible');
		// check map is visible
		cy.get('[data-cy="map"]').should('be.visible');
		// check history averages are visible
		cy.get('[data-cy="history-heading"]').should('be.visible');
		// check date range dropdown is visible and defaults to "Last 7 Days"
		cy.get('[data-cy="chart-date-selector"').should('contain', 'Last 7 Days');
		cy.get('[data-cy="chart-date-selector"').select('Last 5 Days');
		// check date range dropdown is visible and updates to "Last 5 Days"
		cy.get('[data-cy="chart-date-selector"').should('contain', 'Last 5 Days');
		// check charts
		cy.get('[data-cy="voltage-chart"]').should('be.visible');
		cy.get('[data-cy="temperature-chart"]').should('be.visible');
		cy.get('[data-cy="aqi-chart"]').should('be.visible');
		cy.get('[data-cy="humidity-chart"]').should('be.visible');
		cy.get('[data-cy="pm-chart"]').should('be.visible');
	});
});
