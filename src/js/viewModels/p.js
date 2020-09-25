define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojselectcombobox'],
    function(accUtils, ko, Bootstrap, ArrayDataProvider) {
        function PrimarViewModel() {
            /*
             * Data
             */
            self.primari             = ko.observableArray();
            self.primariDataProvider = new ArrayDataProvider(self.primari, { keyAttributes: 'nume' });

            /*
             * Localitati (drop-down handler)...
             */
            self.localitateSchimba = function(event, data) {
              if ((event.detail.value && !event.detail.previousValue)
                || (event.detail.value && event.detail.previousValue && event.detail.value != event.detail.previousValue)) {
                    $.getJSON(['json', self.judet(), self.localitate(), 'p.json'].join('/'))
                       .done(function(data) {
                           self.primari([]);
                           setTimeout(function() {
                                self.primari(data);
                                $("#masonryLayout").ojMasonryLayout('refresh');
                           }, 100);

                           // Stocheaza judet / localitate in URL...
                           self.schimbaParametriiInURL();
                       })
                       .fail(function() {
                           self.primari([]);
                       });
                }
            };
        }

        /*
        * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
        * return a constructor for the ViewModel so that the ViewModel is constructed
        * each time the view is displayed.
        */
        return PrimarViewModel;
    }
);
