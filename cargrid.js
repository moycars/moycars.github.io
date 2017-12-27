$(function() { 

  $("#jsGrid").jsGrid({
      height: "auto",
      width: "100%",
      
      sorting: true,
      paging: true,
      pageSize: 10,
      autoload: true,
      filtering: true,

      noDataContent: "No results found :(",

      controller: {
        loadData: function(filter) {
          var data = $.Deferred();
          $.ajax({
             type: "GET",
             contentType: "application/json",
             url: "https://spreadsheets.google.com/feeds/list/1VrltdRRpuRIC71fr_KaT6tm4rXQXsfSxLRXQezbHTG4/default/public/values?alt=json",
             dataType: "json"
             }).done(function(response){
                var cars = [];
                var modelCars = response["feed"]["entry"];
                $.each(modelCars, function(c, car) {
                  var newCar = {};
                  newCar["ModelNumber"] = car["gsx$modelnumber"]["$t"];
                  newCar["ModelName"] = car["gsx$modelname"]["$t"];
                  newCar["Variation"] = car["gsx$variation"]["$t"];
                  newCar["AskingPrice"] = car["gsx$askingprice"]["$t"];
                  cars.push(newCar);
                })
                cars = $.grep(cars, function (item) {
                    return (!filter.ModelNumber || item.ModelNumber.toLowerCase().indexOf(filter.ModelNumber.toLowerCase()) >= 0) 
                      && (!filter.ModelName || item.ModelName.toLowerCase().indexOf(filter.ModelName.toLowerCase()) >= 0) 
                      && (!filter.Variation || item.Variation.toLowerCase().indexOf(filter.Variation.toLowerCase()) >= 0);
                });
                cars = cars.sort(function(a, b){
                  aAsNumber = parseInt(a.ModelNumber.split('-')[1]);
                  bAsNumber = parseInt(b.ModelNumber.split('-')[1]);
                  return aAsNumber == bAsNumber ? 0 : +(aAsNumber > bAsNumber) || -1;
                });
                data.resolve(cars);
           });
           return data.promise();
         }
      },

      fields: [
          { name: "ModelNumber", title: "Model", type: "text", width: 30,
            sorter: function(a, b){
                  aAsNumber = parseInt(a.split('-')[1]);
                  bAsNumber = parseInt(b.split('-')[1]);
                  return aAsNumber == bAsNumber ? 0 : +(aAsNumber > bAsNumber) || -1;
                }
          },
          { name: "ModelName", title: "Model Name", type: "text", width: 100 },
          { name: "Variation", type: "text", width: 100 },
          { name: "AskingPrice", title: "Asking Price (AUD)", type: "number", align: "right", filtering: false, width: 40 },
          { type: "control", editButton: false, deleteButton: false, width: 20 }
      ]
  });

})