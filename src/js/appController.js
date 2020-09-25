/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
        'ojs/ojoffcanvas', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils) {
     function ControllerViewModel() {

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
        { path: '',    redirect: 'p' },
        { path: 'p',   detail: { label: 'Primar',                       iconClass: 'oj-ux-ico-contact' } },
        { path: 'cl',  detail: { label: 'Consiliu Local',               iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'pcj', detail: { label: 'Președinte Consiliu Județean', iconClass: 'oj-ux-ico-contact' } },
        { path: 'cj',  detail: { label: 'Consiliu Județean',            iconClass: 'oj-ux-ico-contact-group' } }
      ];

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(router);

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

      // Drawer
      // Close offcanvas on medium and larger screens
      this.mdScreen.subscribe(() => {OffcanvasUtils.close(this.drawerParams);});
      this.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        this.navDrawerOn = true;
        return OffcanvasUtils.toggle(this.drawerParams);
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("Candidaţi - Administrație Publică Locală - 27 Septembrie 2020");
      document.title = this.appName();
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      this.footerLinks = [
        {name: 'Candidati - BIROUL ELECTORAL CENTRAL', linkId: 'candidati', linkTarget:'https://locale2020.bec.ro/candidati/'}
      ];

      /*
       *
       */
      // Init
      self.judet      = ko.observable();
      self.localitate = ko.observable();
      self.judete     = ko.observableArray()
      self.localitati = ko.observableArray()

      // Obtine judete...
      $.getJSON('json/judete.json')
            .done(function(data) {
                // Judete...
                self.judete(
                    $.map(data, function(item) {
                        return { "label": item.nume, "value": item.cod };
                    })
                );
            });

      /*
       * Judete (drop-down handler)...
       */
      self.judetCuLocalitatiSchimba = function(event, data) {
          if ((event.detail.value && !event.detail.previousValue)
            || (event.detail.value && event.detail.previousValue && event.detail.value != event.detail.previousValue)) {
              $.getJSON(['json', self.judet(), 'localitati.json'].join('/'))
                  .done(function(data) {
                      self.localitati(
                          $.map(data, function(localitate) {
                              return { "label": localitate, "value": localitate };
                          })
                      );
                  })
                  .fail(function() {
                      self.localitate('');
                      self.localitati([]);
                  });
          }
      };

      /*
       * Stocheaza noi parametrii in URL
       */
      self.schimbaParametriiInURL = function() {
          if (self.judet() && self.localitate()) {
             var queryParams = new URLSearchParams();
             queryParams.set('judet',      self.judet());
             queryParams.set('localitate', self.localitate());
             window.history.replaceState({}, '', '?' + queryParams);
          }
      }
    }

    /*
     * Parametri?
     */
    setTimeout(function() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('judet'))      { self.judet     (params.get('judet')); }
      if (params.has('localitate')) { self.localitate(params.get('localitate')); }
    }, 1000);

    /*
     * ViewModel...
     */
    return new ControllerViewModel();
  }
);
