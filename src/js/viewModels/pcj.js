define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojselectcombobox'],
function(accUtils, ko, Bootstrap, ArrayDataProvider) {
   function PresedinteConsiliuJudeteanViewModel() {
     /*
      * Data
      */
      self.presedintiConsiliuJudetean             = ko.observableArray();
      self.presedintiConsiliuJudeteanDataProvider = new ArrayDataProvider(self.presedintiConsiliuJudetean, { keyAttributes: 'nume' });

      /*
       * Localitati (drop-down handler)...
       */
      self.judetFaraLocalitatiSchimba = function(event, data) {
        if ((event.detail.value && !event.detail.previousValue)
          || (event.detail.value && event.detail.previousValue && event.detail.value != event.detail.previousValue)) {
          $.getJSON(['json', self.judet(), 'pcj.json'].join('/'))
            .done(function(data) {
              self.presedintiConsiliuJudetean([]);
              setTimeout(function() {
                self.presedintiConsiliuJudetean(data);
                $("#masonryLayout").ojMasonryLayout('refresh');
              }, 100);

              // Stocheaza judet / localitate in URL...
              self.schimbaParametriiInURL();
            })
            .fail(function() {
              self.presedintiConsiliuJudetean([]);
            });
        }
      }
   }

   /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
    return PresedinteConsiliuJudeteanViewModel;
  }
);
