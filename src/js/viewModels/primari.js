define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojselectcombobox'],
    function(accUtils, ko, Bootstrap, ArrayDataProvider) {
        function PrimariViewModel() {
            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            this.connected = () => {
            accUtils.announce('Dashboard page loaded.', 'assertive');
            document.title = "Primari";
            // Implement further logic if needed
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            this.disconnected = () => {
            // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            this.transitionCompleted = () => {
            // Implement if needed
            };


            self.primari = ko.observableArray();
            self.dataprovider = new ArrayDataProvider(self.primari, { keyAttributes: 'nume'});

            /*
             * Localitati (drop-down handler)...
             */
            self.localitateSchimba = function(event, data) {
                if (event.detail.value) {
                    $.getJSON(['json', self.judet(), self.localitate(), 'p.json'].join('/'))
                           .done(function(data) {
                               self.primari([]);
                               setTimeout(function() {
                                    self.primari(data);
                                    $("#masonryLayout").ojMasonryLayout('refresh');
                               }, 100);
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
        return PrimariViewModel;
    }
);
