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
        { path: '', redirect: 'primari' },
        { path: 'primari', detail: { label: 'Primari', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
        { path: 'pcj', detail: { label: 'Presedinti CJ', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } }
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
      this.appName = ko.observable("Alegerea Autorităților Administrației Publice Locale - 27 Septembrie 2020");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      this.footerLinks = [
        {name: 'Candidati - BIROUL ELECTORAL CENTRAL', linkId: 'candidati', linkTarget:'https://locale2020.bec.ro/candidati/'}
      ];

      /*
       *
       */
       // Parseaza valorile din URL (optionale)...
       var params      = new URLSearchParams(window.location.search);
       self.judet      = params.has('judet')      ? ko.observable(         params.get('judet')      ) : ko.observable();
       self.localitate = params.has('localitate') ? ko.observable(         params.get('localitate') ) : ko.observable();

       // Judete / Localitati per judet
       self.judete       = ko.observableArray()
       self.localitati   = ko.observableArray()

       $.getJSON('json/judete.json')
           .done(function(data) {
                // Judete...
                self.judete(
                    $.map(data, function(item) {
                        return { "label": item.nume, "value": item.cod };
                    })
                );
                console.log(self.judete());
           })
          .fail(function() {
              self.localitate('');
               self.localitati([]);
               self.primari   ([]);
           });

       /*
        * Judete (drop-down handler)...
        */
       self.judetCuLocalitatiSchimba = function(event, data) {
           if (event.detail.value) {
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
     }



     return new ControllerViewModel();
  }
);
