var tasks = {};

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

// This adds an event listener "click" to the <p> tag in the list-group <ul>> element
$(".list-group").on("click", "p", function() {      

    // this is establishing the inner text as the variable text using jquery "$" and "text()"
    var text = $(this)
    .text()
    .trim();
    
    var textInput = $("<textarea>")
   // this dynamically makes a text area element with the class "form-control" and gives it a value of text, then replacing it with textInput
    .addClass("form-control")
    .val(text);
    $(this).replaceWith(textInput);

    textInput.trigger("focus");
});


$(".list-group").on("blur", "textarea", function() {

// get the textarea's current value/text
var text = $(this)
.val()
.trim();


// get the parent ul's id attribute
var status = $(this)
.closest(".list-group")
.attr("id")
.replace("list-", "");

// get the task's position in the list of other li elements
var index = $(this)
.closest(".list-group-item")
.index();        

// this updates the task
tasks[status][index].text = text;
saveTasks();

// tasks is an object
// tasks[status] returns an array (toDO)
// tasks[status][index] returns the object at the given index in the array
// task[status][index].text returns the text property of the object at the given index

// recreate the p element dynamically after it was turned into a textarea
var taskP = $("<p")
.addClass("m-1")
.text(text);

//replace textarea with p element
$(this).replaceWith(taskP);
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

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();
