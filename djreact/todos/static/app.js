var base_url = "http://127.0.0.1:8000";

function getshitdone(argument) {
	console.log($(argument).text());
	if ($(argument).text() === 'Completed'){
		data = JSON.stringify({'completed': false})
	}else {
		data = JSON.stringify({'completed': true})
	}


	task_id = $(argument).attr('task_id');
	taskupdateurl = base_url + "/api/todo/" + task_id + "/";
	$.ajax({
		  type: 'PATCH',
		  url: taskupdateurl,
		  contentType: "application/json;",
		  dataType: 'json',
		  data: data,
		  success: function(data) {
		  	console.log(data);
		  		var btntext = data.completed ? "Completed" : "Pending";
		  		$(argument).text(btntext);
		  },
	});
}

function deleteThis(argument) {
	d = new Date();
	date = d.toLocaleString();
	task_id = $(argument).attr('task_id');
	deleteurl = base_url + "/api/todo/" + task_id + "/";
	if ($(argument).text() === 'Delete') {
		data  = JSON.stringify({'delete_time': date});
	}else{
		data = JSON.stringify({'delete_time': null});
	}
	$.ajax({
		  type: 'PATCH',
		  url: deleteurl,
		  contentType: "application/json;",
		  data: data,
		  dataType: 'json',
		  success: function(data) {
		  		if ($(argument).text() === 'Delete') {
					$(argument).text('Undelete');
				}else{
					$(argument).text('Delete');
				}
		  },
	});
}

$( document ).ready(function() {
	
	$.ajax({
		  type: 'GET',
		  url: base_url + "/api/todo/",
		  contentType: "application/json;",
		  success: function(data) {
		  	data.objects.forEach(function(item){
		  		if (item.subtask != '' && !item.sub_task) {
		  			var btntext = item.completed ? "Completed" : "Pending";
		  			var deletebtntext = item.delete_time ? "Undelete" : "Delete";
		  			$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>"+deletebtntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  			item.subtask.forEach(function(index) {
						subtaskFetchurl =  base_url + index;

		  				$.ajax({
							  type: 'GET',
							  url: subtaskFetchurl,
							  contentType: "application/json;",
							  dataType: 'json',
							  success: function(data) {
							  		var btntext = item.completed ? "Completed" : "Pending";
							  		$(".task_id" + item.id + " ul").append("<li class='dir'>" + data.title + "("+ data.due_date +")<button task_id='"+data.id+"' onclick='getshitdone(this)'>"+btntext+"</button></li>");
							  },
						});	  				
		  			});
		  		} else if(!item.sub_task && item.subtask == '') {
		  			var btntext = item.completed ? "Completed" : "Pending";
		  			var deletebtntext = item.delete_time ? "Undelete" : "Delete";
		  			$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>"+deletebtntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
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
		  url: base_url + "/api/todo/",
		  data: JSON.stringify(data),
		  contentType: "application/json;",
		  success: function(data) {
		  		var deletebtntext = data.delete_time ? "Undelete" : "Delete";
		  		$(".toAppend").append("<li class='dir task_id"+data.id+"'' task_id='"+data.id+"'>"+ data.title +"("+ data.due_date +")<button task_id='"+data.id+"' onclick='getshitdone(this)'>Done</button><button task_id='"+data.id+"' onclick='deleteThis(this)'>"+deletebtntext+"</button><br><input type='text' placeholder='Add subtask' parent_task='"+data.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  },
		  error: function(data) {
			successmessage = 'Error';
		  },
	});
}


$("#todo_add").on('keyup', function (e) {
	if (e.keyCode == 13) {
		if($('#todo_add').val() === '' || $('.date').val() === ''){
			alert('Please enter Title and Date');
			$(this).focus();
		}
		data = {
			"title": $('#todo_add').val(),
			"due_date": $('.date').val().split("-").reverse().join("-")
		};
		addNewTodo(data)
	}
});

$(document).on('keyup', '.addsubtask', function (e) {
	if (e.keyCode == 13) {
		if($(this).val() === '' || $(this).next('input').val() === ''){
			alert('Please enter Title and Date');
			$(this).focus();
		}
		data = {
			"title": $(this).val(),
			"sub_task": true,
			"parent_task": $(this).attr('parent_task'),
			"due_date": $(this).next('input').val()
		};
		parent_tas_id = $(this).attr('parent_task');
		
		$.ajax({
			  type: 'POST',
			  url: base_url + "/api/todo/",
			  data: JSON.stringify(data),
			  contentType: "application/json;",
			  success: function(data) {
			  		$(".task_id" + parent_tas_id + " ul").append(" <li class='dir'>" + data.title + "("+ data.due_date +")<button task_id='"+data.id+"' onclick='getshitdone(this)'>Done</button></li>");
			  },
			  error: function (data) {
			  		alert('Subtask date can not be higher than parent task!!!');
			  }
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
			  url: base_url + "/api/todo/?title__icontains=" + query,
			  contentType: "application/json;",
			  success: function(data) {
			  	$('.toAppend li').remove();
			  	data.objects.forEach(function(item){
			  		console.log(item.title);
			  		var btntext = item.completed ? "Completed" : "Pending";
			  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>Delete</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
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
		  url: base_url + "/api/todo/?due_date__day=" + dd,
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>Delete</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });

$(document).on('click','#filterWeek', function(e){
	$.ajax({
		  type: 'GET',
		  url: base_url + "/api/todo/?due_date__gte=True",
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>Delete</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });


$(document).on('click','#filterNextweek', function(e){


	var nextMonday = new Date();
	nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
	date = nextMonday.getFullYear() + '-' + nextMonday.getMonth() + '-' + nextMonday.getDate()
	dateplus7 = nextMonday.getFullYear() + '-' + nextMonday.getMonth() + '-' + (nextMonday.getDate() + 7)
	console.log(date);


	$.ajax({
		  type: 'GET',
		  url: base_url + "/api/todo/?due_date__gte="+date+"&due_date__lt="+dateplus7+"",
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>Delete</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
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
		  url: base_url + "/api/todo/?due_date__lt="+ today +"",
		  contentType: "application/json;",
		  success: function(data) {
		  	console.log(data);
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		console.log(item.title);
		  		var btntext = item.completed ? "Completed" : "Pending";
		  		$(".toAppend").append("<li class='dir task_id"+item.id+"'' task_id='"+item.id+"'>"+ item.title +"("+ item.due_date +")<button task_id='"+item.id+"' onclick='getshitdone(this)'>"+btntext+"</button><button task_id='"+item.id+"' onclick='deleteThis(this)'>Delete</button><br><input type='text' placeholder='Add subtask' parent_task='"+item.id+"' name='subtask' class='addsubtask'><input type='date' class='date'><ul></ul></li>");
		  	});
		  },
	});
 });


// $(document).on('ready', function(e){
// 	$('input[type="date"]').change(function(){
// 	   alert(this.value.split("-").reverse().join("-")); 
// 	});
//  });