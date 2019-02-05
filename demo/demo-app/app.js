/**
 * @license
 * Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * The following script will handle API console routing when using the c
 * onsole as a standalone application.
 *
 * It uses native JavaScript APIs so it can be used outside Polymer scope.
 *
 * @author Pawel Psztyc <pawel.psztyc@mulesoft.com>
 */
(function() {
  'use strict';
  // API Console namespace.
  const apiconsole = {};
  // Namespace for standalone application.
  apiconsole.app = {};
  /**
   * Initialize event listeners for console's path and page properties
   * and observers router data change.
   */
  apiconsole.app.init = function() {
    apiconsole.app.observeRouteEvents();
    apiconsole.app.observeConsoleControls();
  };
  /**
   * Adds event listeres to elements that are related to the routing:
   * app-location, app-route and api-console.
   */
  apiconsole.app.observeRouteEvents = function() {
    const apic = document.querySelector('api-console');
    const location = document.querySelector('app-location');
    apic.addEventListener('api-navigation-selection-changed', apiconsole.app._selectionChanged);
    apic.addEventListener('page-changed', apiconsole.app._pageChanged);
    location.addEventListener('route-changed', apiconsole.app._routeChanged);
  };
  // Event handler for the selection change.
  apiconsole.app._selectionChanged = function(e) {
    if (e.detail.passive === true) {
      return;
    }
    apiconsole.app.selectionChanged(e.detail.selected, e.detail.type, e.target.page);
  };
  // Called when path changed from the api-console.
  apiconsole.app.selectionChanged = function(selected, type, page) {
    if (!selected || !type) {
      return;
    }
    page = page || 'docs';
    let location = document.querySelector('app-location');
    let newPath = [page, type, encodeURIComponent(selected)].join('/');
    if (newPath !== location.path) {
      location.set('path', newPath);
    }
  };
  // Event handler for the page change.
  apiconsole.app._pageChanged = function(e) {
    apiconsole.app.selectionChanged(e.target.selectedShape, e.target.selectedShapeType, e.detail.value);
    apiconsole.app.pageChanged(e.detail.value);
  };
  // Called when page change.
  apiconsole.app.pageChanged = function(page) {
    let apiConsole = document.querySelector('api-console');
    if (apiConsole.page !== page) {
      apiConsole.page = page;
    }
  };
  // Event handler for the route change.
  apiconsole.app._routeChanged = function(e) {
    apiconsole.app.routeChanged(e.detail.value);
  };
  // Updates api console path if different than curent URL
  apiconsole.app.routeChanged = function(route) {
    let locationPath = route.path;
    if (!locationPath || locationPath === '/') {
      document.querySelector('app-location').set('path', '/docs');
      return;
    }
    if (locationPath[0] === '/') {
      locationPath = locationPath.substr(1);
    }
    let _route = locationPath.split('/');
    let page = _route[0];
    let type = _route[1];
    let selected = _route[2];
    if (selected) {
      selected = decodeURIComponent(selected);
    }
    let apic = document.querySelector('api-console');
    if (apic.page !== page) {
      apic.page = page;
    }
    if (apic.selectedShapeType !== type) {
      apic.selectedShapeType = type;
    }
    if (apic.selectedShape !== selected) {
      apic.selectedShape = selected;
    }
  };
  /**
   * Reads page name and the path from location path.
   *
   * @param {String} locationPath Current path read from path change event or
   * read fomr the `app-location` element.
   * @return {Object}
   */
  apiconsole.app._readPagePath = function(locationPath) {
    let parsedPath = locationPath.replace(/\-/g, '.');
    if (parsedPath[0] === '/') {
      parsedPath = parsedPath.substr(1);
    }
    let _route = parsedPath.split('/');
    let page = _route[0];
    let path = _route[1];
    return {
      page: page,
      path: path
    };
  };

  apiconsole.app.observeConsoleControls = function() {
    let toggles = document.querySelectorAll(
      '[data-action]');
    for (let i = 0, len = toggles.length; i < len; i++) {
      toggles[i].addEventListener('checked-changed',
        apiconsole.app.consoleControlsChanged);
    }

    let clickAction = document.querySelectorAll('[data-click-action]');
    for (let i = 0, len = clickAction.length; i < len; i++) {
      clickAction[i].addEventListener('click',
        apiconsole.app.consoleControlsChanged);
    }
  };

  apiconsole.app.consoleControlsChanged = function(e) {
    let action = e.target.dataset.action || e.target.dataset.clickAction;
    switch (action) {
      case 'noTryIt':
      case 'narrow':
      case 'noAttribution':
      case 'manualNavigation':
      case 'navigationOpened':
      case 'noExtensionBanner':
      case 'inlineMethods':
        let apiConsole = document.querySelector('api-console');
        apiConsole[action] = e.detail.value;
        break;
    }
    document.getElementById('demoMenu').opened = false;
  };

  // Notifys user when something went wrong...
  apiconsole.app.notifyInitError = function(message) {
    window.alert('Cannot initialize API console. ' + message);
  };
  if (window.WebComponents && window.WebComponents.ready) {
    apiconsole.app.init();
  } else {
    window.addEventListener('WebComponentsReady', apiconsole.app.init);
  }
})();
