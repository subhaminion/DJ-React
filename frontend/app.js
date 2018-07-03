$( document ).ready(function() {
	
	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/",
		  contentType: "application/json;",
		  success: function(data) {
		  	data.objects.forEach(function(item){
		  		if (item.subtask != '') {
		  			$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"<ul></ul></li>");
		  			item.subtask.forEach(function(index) {
						subtaskFetchurl =  "http://127.0.0.1:8000" + index;

		  				$.ajax({
							  type: 'GET',
							  url: subtaskFetchurl,
							  contentType: "application/json;",
							  dataType: 'json',
							  success: function(data) {
							  		$(".task_id" + item.id + " ul").append(" <li class='dir'>" + data.title + "</li>");
							  },
						});	  				
		  			});
		  		}
		  	});
		  },
		  error: function(data) {
			successmessage = 'Error';
		  },
	});
});


function getsubtask(taskId) {
	fetchurl = "http://127.0.0.1:8000/api/todo/"+ taskId +"/";
	var lol = [];
	$.ajax({
		  type: 'GET',
		  url: fetchurl,
		  contentType: "application/json;",
		  dataType: 'json',
		  success: function(data) {
		  		data.subtask.forEach(function(item){
		  			subtaskFetchurl = "http://127.0.0.1:8000" + item;
			  		$.ajax({
						  type: 'GET',
						  url: subtaskFetchurl,
						  contentType: "application/json;",
						  dataType: 'json',
						  success: function(data) {
						  		lol.push(data);
						  },
					});
			  	});
		  },
	});
	return lol;
}


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
   $('.dir').click(function(e) {
		e.stopPropagation();
		$(this).children().slideToggle();
	});
});