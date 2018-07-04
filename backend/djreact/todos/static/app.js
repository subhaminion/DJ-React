function getshitdone(argument) {
	if ($(argument).text() === 'Done'){
		data = JSON.stringify({'completed': true})
	}else {
		data = JSON.stringify({'completed': false})
	}


	task_id = $(argument).attr('task_id');
	taskupdateurl = "http://127.0.0.1:8000/api/todo/" + task_id + "/";
	$.ajax({
		  type: 'PATCH',
		  url: taskupdateurl,
		  contentType: "application/json;",
		  dataType: 'json',
		  data: data,
		  success: function(data) {
		  		var btntext = data.completed ? "Completed" : "Pending";
		  		console.log($(argument).text());
		  		$(argument).text(btntext);
		  },
	});
}

$( document ).ready(function() {
	
	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/",
		  contentType: "application/json;",
		  success: function(data) {
		  	data.objects.forEach(function(item){
		  		if (item.subtask != '' && !item.sub_task) {
		  			var btntext = item.completed ? "Completed" : "Pending";
		  			$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  			item.subtask.forEach(function(index) {
						subtaskFetchurl =  "http://127.0.0.1:8000" + index;

		  				$.ajax({
							  type: 'GET',
							  url: subtaskFetchurl,
							  contentType: "application/json;",
							  dataType: 'json',
							  success: function(data) {
							  		$(".task_id" + item.id + " ul").append("<li class='dir'>" + data.title + "("+ data.due_date +")<button task_id='"+data.id+"' onclick='getshitdone(this)'>Done</button></li>");
							  },
						});	  				
		  			});
		  		} else if(!item.sub_task && item.subtask == '') {
		  			var btntext = item.completed ? "Completed" : "Pending";
		  			$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
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
		  		$(".toAppend").append("<li class='dir task_id"+data.id+"'' task_id='"+data.id+"'>"+ data.title +"("+ data.due_date +")<button task_id='"+data.id+"' onclick='getshitdone(this)'>Done</button><br><input type='text' placeholder='Add subtask' parent_task='"+data.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  },
		  error: function(data) {
			successmessage = 'Error';
		  },
	});
}


$("#todo_add").on('keyup', function (e) {
	if (e.keyCode == 13) {
		lol = $('.date').val().split("-").reverse().join("-");
		alert(lol);
		data = {
			"title": $('#todo_add').val(),
			"due_date": $('.date').val().split("-").reverse().join("-")
		};
		addNewTodo(data)
	}
});

$(document).on('keyup', '.addsubtask', function (e) {
	if (e.keyCode == 13) {
		data = {
			"title": $(this).val(),
			"sub_task": true,
			"parent_task": $(this).attr('parent_task'),
			"due_date": $(this).next('input').val()
		};
		parent_tas_id = $(this).attr('parent_task');
		
		$.ajax({
			  type: 'POST',
			  url: "http://127.0.0.1:8000/api/todo/",
			  data: JSON.stringify(data),
			  contentType: "application/json;",
			  success: function(data) {
			  		$(".task_id" + parent_tas_id + " ul").append(" <li class='dir'>" + data.title + "("+ data.due_date +")<button task_id='"+data.id+"' onclick='getshitdone(this)'>Done</button></li>");
			  },
		});
	}
});

// function generateSubtask(argument) {
// 	$(argument).children("li").remove();
// 	$(argument).append('<li class="dir">lol</li>');
// }


$(document).on('keyup','#search', function(e){
	if (e.keyCode == 13) {
	  	query = $('#search').val();
	  	$.ajax({
			  type: 'GET',
			  url: "http://127.0.0.1:8000/api/todo/?title__icontains=" + query,
			  contentType: "application/json;",
			  success: function(data) {
			  	$('.toAppend li').remove();
			  	data.objects.forEach(function(item){
			  		console.log(item.title);
			  		var btntext = item.completed ? "Completed" : "Pending";
			  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
			  	});
			  },
		});
	}
 });

$(document).on('click','#filterToday', function(e){
	var today = new Date();
	var dd = today.getDate();

	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/?due_date__day=" + dd,
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });

$(document).on('click','#filterWeek', function(e){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd;
	dd = dd + 7
	oneweekextra = yyyy + '-' + mm + '-' + dd;



	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/?due_date__gte="+ today +"&due_date__lt=" + oneweekextra,
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });


$(document).on('click','#filterNextweek', function(e){


	var nextMonday = new Date();
	nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
	date = nextMonday.getFullYear() + '-' + nextMonday.getMonth() + '-' + nextMonday.getDate()
	dateplus7 = nextMonday.getFullYear() + '-' + nextMonday.getMonth() + '-' + (nextMonday.getDate() + 7)



	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/?due_date__gte="+date+"&due_date__lt="+dateplus7+"",
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });


$(document).on('click','#filterOverdue', function(e){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd;

	$.ajax({
		  type: 'GET',
		  url: "http://127.0.0.1:8000/api/todo/?due_date__lt="+ today +"",
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });


// $(document).on('ready', function(e){
// 	$('input[type="date"]').change(function(){
// 	   alert(this.value.split("-").reverse().join("-")); 
// 	});
//  });