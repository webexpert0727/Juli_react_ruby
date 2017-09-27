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

function initTimepicker() {
  setTimeout(function() {
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

    $('#start').datepicker({
      dateFormat: 'MM dd, yy',
      minDate: 0,
      onSelect: function(date) {
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
      dateFormat: 'MM dd, yy'
    });
    $('.scheduled_starttime, .scheduled_endtime').timepicker();
  }, 500);
}

var selectedWeek;
var currentWeek;
$(document).ready(function() {
  //Initialize the datePicker(I have taken format as mm-dd-yyyy, you can     //have your owh)
  $('#weeklyDatePicker').datetimepicker({
    format: 'MM/DD/YYYY'
  });
  $('#prev').click(function() {
    selectedWeek--;
    updateDate(moment().week(selectedWeek));
  });
  $('#next').click(function() {
    if (selectedWeek + 1 > currentWeek) {
      alert("Can't select future week");
      return;
    }
    selectedWeek++;
    updateDate(moment().week(selectedWeek));
  });
  //Get the value of Start and End of Week
  $('#weeklyDatePicker').on('dp.change', function(e) {
    updateDate($('#weeklyDatePicker').val());
  });

  updateDate(moment());
});

function updateDate(p_value) {
  var firstDate = moment(p_value, 'MM-DD-YYYY')
    .day(0)
    .format('MM-DD-YYYY');
  var lastDate = moment(p_value, 'MM-DD-YYYY')
    .day(6)
    .format('MM-DD-YYYY');
  $('#weeklyDatePicker').val(firstDate + ' - ' + lastDate);
  $('#weeklyDatePicker').trigger('change');
  if (selectedWeek) selectedWeek = moment(firstDate).week();
  else {
    selectedWeek = moment(firstDate).week();
    currentWeek = selectedWeek;
  }
}
