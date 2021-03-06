/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { serviceNowConnector } from '../objects/case';

import { TOASTER } from '../screens/configure_cases';

import { goToEditExternalConnection } from '../tasks/all_cases';
import {
  addServiceNowConnector,
  openAddNewConnectorOption,
  selectLastConnectorCreated,
} from '../tasks/configure_cases';
import { loginAndWaitForPageWithoutDateRange } from '../tasks/login';

import { CASES } from '../urls/navigation';

// FLAKY: https://github.com/elastic/kibana/issues/65278
describe.skip('Cases connectors', () => {
  before(() => {
    cy.server();
    cy.route('POST', '**/api/actions/action').as('createConnector');
    cy.route('POST', '**/api/cases/configure').as('saveConnector');
  });

  it('Configures a new connector', () => {
    loginAndWaitForPageWithoutDateRange(CASES);
    goToEditExternalConnection();
    openAddNewConnectorOption();
    addServiceNowConnector(serviceNowConnector);

    cy.wait('@createConnector').its('status').should('eql', 200);
    cy.get(TOASTER).should('have.text', "Created 'New connector'");

    selectLastConnectorCreated();

    cy.wait('@saveConnector', { timeout: 10000 }).its('status').should('eql', 200);
    cy.get(TOASTER).should('have.text', 'Saved external connection settings');
  });
});
