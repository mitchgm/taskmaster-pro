var tasks = {};

// $() selects an element on the page by class or id, as well as creates an element that can later be appended to the page

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// enable draggable/sortable feature on list-group elements
$(".card .list-group").sortable({
    // enable dragging across lists
    connectWith: $(".card .list-group"),
    scroll: false,
    tolerance: "pointer",
    helper: "clone",
    activate: function(event, ui) {
      console.log(ui);
    },
    deactivate: function(event, ui) {
      console.log(ui);
    },
    over: function(event) {
      console.log(event);
    },
    out: function(event) {
      console.log(event);
    },
    update: function() {
      var tempArr = [];
  
      // loop over current set of children in sortable list
      $(this)
        .children()
        .each(function() {
          // save values in temp array
          tempArr.push({
            text: $(this)
              .find("p")
              .text()
              .trim(),
            date: $(this)
              .find("span")
              .text()
              .trim()
          });
        });
  
      // trim down list's ID to match object property
      var arrName = $(this)
        .attr("id")
        .replace("list-", "");
  
      // update array on tasks object and save
      tasks[arrName] = tempArr;
      saveTasks();
    },
    stop: function(event) {
      $(this).removeClass("dropover");
    }
  });
  
  // trash icon can be dropped onto
  $("#trash").droppable({
    accept: ".card .list-group-item",
    tolerance: "touch",
    drop: function(event, ui) {
      // remove dragged element from the dom
      ui.draggable.remove();
  
    },
    over: function(event, ui) {
      console.log(ui);
    },
    out: function(event, ui) {
      console.log(ui);
    }
  });
  
  
  // modal was triggered
  $("#task-form-modal").on("show.bs.modal", function() {
    // clear values
    $("#modalTaskDescription, #modalDueDate").val("");
  });
  
  // modal is fully visible
  $("#task-form-modal").on("shown.bs.modal", function() {
    // highlight textarea
    $("#modalTaskDescription").trigger("focus");
  });
  
  // save button in modal was clicked
  $("#task-form-modal .btn-primary").click(function() {
    // get form values
    var taskText = $("#modalTaskDescription").val();
    var taskDate = $("#modalDueDate").val();
  
    if (taskText && taskDate) {
      createTask(taskText, taskDate, "toDo");
  
      // close modal
      $("#task-form-modal").modal("hide");
  
      // save in tasks array
      tasks.toDo.push({
        text: taskText,
        date: taskDate
      });
  
      saveTasks();
    }
  });
  
  // task text was clicked
  $(".list-group").on("click", "p", function() {
    // get current text of p element
    var text = $(this)
      .text()
      .trim();
  
    // replace p element with a new textarea
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);
  
    // auto focus new element
    textInput.trigger("focus");
  });
  
  // editable field was un-focused
  $(".list-group").on("blur", "textarea", function() {
    // get current value of textarea
    var text = $(this).val();
  
    // get status type and position in the list
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");
    var index = $(this)
      .closest(".list-group-item")
      .index();
  
    // update task in array and re-save to localstorage
    tasks[status][index].text = text;
    saveTasks();
  
    // recreate p element
    var taskP = $("<p>")
      .addClass("m-1")
      .text(text);
  
    // replace textarea with new content
    $(this).replaceWith(taskP);
  });
  
  // due date was clicked
  $(".list-group").on("click", "span", function() {
    // get current text
    var date = $(this)
      .text()
      .trim();
  
    // create new input element
    var dateInput = $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .val(date);
    $(this).replaceWith(dateInput);
  
    // automatically bring up the calendar
    dateInput.trigger("focus");
  });
  
  // value of due date was changed
  $(".list-group").on("change", "input[type='text']", function() {
    var date = $(this).val();
  
    // get status type and position in the list
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");
    var index = $(this)
      .closest(".list-group-item")
      .index();
  
    // update task in array and re-save to localstorage
    tasks[status][index].date = date;
    saveTasks();
  
    // recreate span and insert in place of input element
    var taskSpan = $("<span>")
      .addClass("badge badge-primary badge-pill")
      .text(date);
      $(this).replaceWith(taskSpan);
  });
  
  // remove all tasks
  $("#remove-tasks").on("click", function() {
    for (var key in tasks) {
      tasks[key].length = 0;
      $("#list-" + key).empty();
    }
    console.log(tasks);
    saveTasks();
  });
  
  // load tasks for the first time
  loadTasks();
  
















// // This adds an event listener "click" to the <p> tag in the list-group <ul>> element
// $(".list-group").on("click", "p", function() {      

//     // this is establishing the inner text as the variable text using jquery "$" and "text()"
//     var text = $(this)
//     .text()
//     .trim();
    
//     var textInput = $("<textarea>")
//    // this dynamically makes a text area element with the class "form-control" and gives it a value of text, then replacing it with textInput
//     .addClass("form-control")
//     .val(text);
//     $(this).replaceWith(textInput);

//     textInput.trigger("focus");
// });


// $(".card .list-group").sortable({
//     connectWith: $(".card .list-group"),
//     scroll: false,
//     tolerance: "pointer",
//     helper: "clone",
//     // activate and deactivate events trigger once for all connected lists as soon as dragging starts and stops
//     activate: function(event) {
//       console.log("activate", this);
//     },
//     deactivate: function(event) {
//       console.log("deactivate", this);
//     },
//     // over and out events trigger when a dragged item enters or leaves a connected list
//     over: function(event) {
//       console.log("over", event.target);
//     },
//     out: function(event) {
//       console.log("out", event.target);
//     },
//     // the update event triggers when the contents of a list have changed
//     update: function(event) {
//       console.log($(this).children());
//     }
// })

// $(".list-group").on("blur", "textarea", function() {

// // get the textarea's current value/text
// var text = $(this)
// .val()
// .trim();


// // get the parent ul's id attribute
// var status = $(this)
// .closest(".list-group")
// .attr("id")
// .replace("list-", "");

// // get the task's position in the list of other li elements
// var index = $(this)
// .closest(".list-group-item")
// .index();        

// // this updates the task
// tasks[status][index].text = text;
// saveTasks();

// // tasks is an object
// // tasks[status] returns an array (toDO)
// // tasks[status][index] returns the object at the given index in the array
// // task[status][index].text returns the text property of the object at the given index

// // recreate the p element dynamically after it was turned into a textarea
// var taskP = $("<p")
// .addClass("m-1")
// .text(text);

// //replace textarea with p element
// $(this).replaceWith(taskP);
// });


// // due date was clicked
// $(".list-group").on("click", "span", function() {
//   // get current text
//   var date = $(this)
//     .text()
//     .trim();

//   // create new input element
//   var dateInput = $("<input>")
//     .attr("type", "text")
//     .addClass("form-control")
//     .val(date);

//   // swap out elements
//   $(this).replaceWith(dateInput);

//   // automatically focus on new element
//   dateInput.trigger("focus");
// });

// // value of due date was changed 
// $(".list-group").on("blur", "input[type='text']", function() {
//     // get current text
//     var date = $(this)
//       .val()
//       .trim();
  
//     // get the parent ul's id attribute
//     var status = $(this)
//       .closest(".list-group")
//       .attr("id")
//       .replace("list-", "");
  
//     // get the task's position in the list of other li elements
//     var index = $(this)
//       .closest(".list-group-item")
//       .index();
  
//     // update task in array and re-save to localstorage
//     tasks[status][index].date = date;
//     saveTasks();
  
//     // recreate span element with bootstrap classes
//     var taskSpan = $("<span>")
//       .addClass("badge badge-primary badge-pill")
//       .text(date);
  
//     // replace input with span element
//     $(this).replaceWith(taskSpan);
//   });

//   // loop over current set of children in sortable list
// $(this).children().each(function() {
//     var text = $(this)
//       .find("p")
//       .text()
//       .trim();
  
//     var date = $(this)
//       .find("span")
//       .text()
//       .trim();
  
//     console.log(text, date);
//   });



// // modal was triggered
// $("#task-form-modal").on("show.bs.modal", function() {
//   // clear values
//   $("#modalTaskDescription, #modalDueDate").val("");
// });

// // modal is fully visible
// $("#task-form-modal").on("shown.bs.modal", function() {
//   // highlight textarea
//   $("#modalTaskDescription").trigger("focus");
// });

// // save button in modal was clicked
// $("#task-form-modal .btn-primary").click(function() {
//   // get form values
//   var taskText = $("#modalTaskDescription").val();
//   var taskDate = $("#modalDueDate").val();

//   if (taskText && taskDate) {
//     createTask(taskText, taskDate, "toDo");

//     // close modal
//     $("#task-form-modal").modal("hide");

//     // save in tasks array
//     tasks.toDo.push({
//       text: taskText,
//       date: taskDate
//     });

//     saveTasks();
//   }
// });

// // remove all tasks
// $("#remove-tasks").on("click", function() {
//   for (var key in tasks) {
//     tasks[key].length = 0;
//     $("#list-" + key).empty();
//   }
//   saveTasks();
// });

// // load tasks for the first time
// loadTasks();
