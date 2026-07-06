describe('Airnote Product Version Configurations', () => {
  describe('Legacy Airnote (non-v3)', () => {
    it('should display legacy Airnote-specific display options on settings page', () => {
      cy.setLocalStorage();
      cy.visit('/');
      cy.get('[data-cy="settings-link"]').click();

      // Check that PM2.5 is a display option (legacy default)
      cy.get('select[name="displayValue"]').should('exist');
      cy.get('select[name="displayValue"] option[value="pm2.5"]').should(
        'contain',
        'PM2.5 (default)'
      );

      // Check that legacy PM options are present
      cy.get('select[name="displayValue"] option[value="pm1.0"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="pm10.0"]').should(
        'exist'
      );

      // Verify v3-specific AQI default is NOT present
      cy.get('select[name="displayValue"] option').should(
        'not.contain',
        'AQI (default)'
      );

      // Check that common options are present
      cy.get('select[name="displayValue"] option[value="tempc"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="tempf"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="humid"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="press"]').should(
        'exist'
      );
    });

    it('should have correct productUID in URL for legacy Airnote', () => {
      cy.setLocalStorage();
      cy.visit('/');
      cy.get('[data-cy="settings-link"]').click();

      // Check URL contains correct legacy product UID (either v1 variant)
      cy.url().should('satisfy', (url: string) => {
        // cy.url() may return the colon encoded (%3A) or decoded (:) depending on
        // the browser; normalize before checking.
        const decoded = decodeURIComponent(url);
        return (
          decoded.includes('product:org.airnote.solar.v1') ||
          decoded.includes('product:org.airnote.solar.air.v1')
        );
      });
    });
  });

  describe('Airnote V3', () => {
    it('should display v3 Airnote-specific display options on settings page', () => {
      // Use v3 device setup
      cy.setLocalStorageV3();
      cy.visit('/');
      cy.get('[data-cy="settings-link"]').click();

      // Check that AQI is the default option for v3
      cy.get('select[name="displayValue"]').should('exist');
      cy.get('select[name="displayValue"] option[value="aqi"]').should(
        'contain',
        'AQI (default)'
      );

      // Check that v3 PM options are present (but not as default)
      cy.get('select[name="displayValue"] option[value="pm2.5"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="pm1.0"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="pm10.0"]').should(
        'exist'
      );

      // Verify legacy PM2.5 default is NOT present
      cy.get('select[name="displayValue"] option').should(
        'not.contain',
        'PM2.5 (default)'
      );

      // Check that common options are present
      cy.get('select[name="displayValue"] option[value="tempc"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="tempf"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="humid"]').should(
        'exist'
      );
      cy.get('select[name="displayValue"] option[value="press"]').should(
        'exist'
      );
    });

    it('should have correct productUID in URL for v3 Airnote', () => {
      cy.setLocalStorageV3();
      cy.visit('/');
      cy.get('[data-cy="settings-link"]').click();

      // cy.url() may return the colon encoded (%3A) or decoded (:) depending on
      // the browser; normalize before checking.
      cy.url().should((url: string) => {
        expect(decodeURIComponent(url)).to.include(
          'product:com.blues.airnote.v3'
        );
      });
    });
  });
});
