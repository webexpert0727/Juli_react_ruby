
  // function startChange() {
  //     var startTime = start.value();

  //     if (startTime) {
  //         startTime = new Date(startTime);

  //         end.max(startTime);

  //         startTime.setMinutes(startTime.getMinutes() + this.options.interval);

  //         end.min(startTime);
  //         end.value(startTime);
  //     }
  // }
  
 function initTimepicker(){
  setTimeout(function(){
      // //init start timepicker
      // start = $("#start").kendoTimePicker({
      //     change: startChange
      // }).data("kendoTimePicker");

      // //init end timepicker
      // end = $("#end").kendoTimePicker().data("kendoTimePicker");

      // //define min/max range
      // start.min("8:00 AM");
      // start.max("6:00 PM");

      // //define min/max range
      // end.min("8:00 AM");
      // end.max("7:30 AM");

   $("#start").datepicker({
            dateFormat: "MM dd, yy",
            minDate: 0,
            onSelect: function (date) {
                var dt2 = $('#end');
                var startDate = $(this).datepicker('getDate');
                var minDate = $(this).datepicker('getDate');
                dt2.datepicker('setDate', minDate);
                startDate.setDate(startDate.getDate() + 30);
                //sets dt2 maxDate to the last day of 30 days window
                dt2.datepicker('option', 'maxDate', startDate);
                dt2.datepicker('option', 'minDate', minDate);
                $(this).datepicker('option', 'minDate', minDate);
            }
        });
        $('#end').datepicker({
            dateFormat: "MM dd, yy"
        });
        $('.scheduled_starttime, .scheduled_endtime').timepicker();
  },500);
}
