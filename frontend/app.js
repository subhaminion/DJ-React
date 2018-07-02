$( document ).ready(function() {
	// $('.dir').click(function(e) {
	// 	e.stopPropagation();
	// 	$(this).children().slideToggle();
	// });
	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/",
		  contentType: "application/json;",
		  success: function(data) {
		  	data.objects.forEach(function(item){
		  		if (item.subtask != '') {
		  			$(".toAppend").append("<li class='dir'>"+ item.title +"</li>");
		  		}
		  	});
		  },
		  error: function(data) {
			successmessage = 'Error';
		  },
	});
});

function addNewTodo(data) {
	$.ajax({
		  type: 'POST',
		  url: "http://127.0.0.1:8000/api/todo/",
		  data: JSON.stringify(data),
		  contentType: "application/json;",
		  success: function(data) {
		  		$("#toAppend").append()
		  },
		  error: function(data) {
			successmessage = 'Error';
		  },
	});
}

$("#todo_add").on('keyup', function (e) {
	if (e.keyCode == 13) {
		data = {
			"title": $('#todo_add').val()
		};
		addNewTodo(data)
	}
});

// function generateSubtask(argument) {
// 	$(argument).children("li").remove();
// 	$(argument).append('<li class="dir">lol</li>');
// }


$(document).on('click','.dir', function(){
    $('.dir').on('click', function () {
    	$(this).children("ul").empty();
    	$(this).append("<ul> <li class='dir'>lab1 </li> <li class='dir'>lab1 </li> <li class='dir'>lab1 </li> </ul>")
        $('ul', this).slideDown();
    });
    $('.dir li').click(function(e) {
        e.stopPropagation();
    });
});