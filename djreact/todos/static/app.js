var base_url = "http://127.0.0.1:8000";

function getshitdone(argument) {

	if ($(argument).is(":checked")){
		data = JSON.stringify({'completed': true})
	}else {
		data = JSON.stringify({'completed': false})
	}

	task_id = $(argument).attr('task_id');
	taskupdateurl = base_url + "/api/v1/todo/" + task_id + "/";
	$.ajax({
		  type: 'PATCH',
		  url: taskupdateurl,
		  contentType: "application/json;",
		  dataType: 'json',
		  data: data,
		  success: function(data) {
		  	console.log(data);
		  },
	});
}

function deleteThis(argument) {
	d = new Date();
	date = d.toLocaleString();
	task_id = $(argument).attr('task_id');
	deleteurl = base_url + "/api/v1/todo/" + task_id + "/";
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

function addSubtask(argument) {
	var title = prompt("Task Name", "Get a Haircut");
    var date = prompt("Due Date", "YYYY-mm-dd");
    if (title != null && date != null) {
        data = {
			"title": title,
			"sub_task": true,
			"parent_task": $(argument).attr('parent_task'),
			"due_date": date
		};
		parent_tas_id = $(argument).attr('parent_task');
		$.ajax({
			  type: 'POST',
			  url: base_url + "/api/v1/todo/",
			  data: JSON.stringify(data),
			  contentType: "application/json;",
			  success: function(data) {
			  		var subtaskwithcomplete = "<div class='checkbox'> <label><input type='checkbox' task_id='"+data.id+"' onclick='getshitdone(this)' checked/>" + data.title + "("+ data.due_date +")</label> </div>";
			  		var subtaskwithoutcomplete = "<div class='checkbox'> <label><input type='checkbox' task_id='"+data.id+"' onclick='getshitdone(this)' />" + data.title + "("+ data.due_date +")</label> </div>";
			  		var toAppend = data.completed ? subtaskwithcomplete : subtaskwithoutcomplete;
			  		$(".task_id" + parent_tas_id + " ul").append(toAppend);
			  },
			  error: function (data) {
			  		alert('Subtask date can not be higher than parent task!!!');
			  }
		});
    }
}

$( document ).ready(function() {
	
	$.ajax({
		  type: 'GET',
		  url: base_url + "/api/v1/todo/",
		  contentType: "application/json;",
		  success: function(data) {
		  	data.objects.forEach(function(item){
		  		if (item.subtask != '' && !item.sub_task) {
		  			var deletebtntext = item.delete_time ? "Undelete" : "Delete";
		  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title + " ("+item.due_date+")</label><a href='#' parent_task="+ item.id +" onclick='addSubtask(this)'> <span class='glyphicon glyphicon-plus-sign'></span> </a><button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
					var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title + "("+item.due_date+")</label><a href='#' parent_task="+ item.id +" onclick='addSubtask(this)'> <span class='glyphicon glyphicon-plus-sign'></span> </a><button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
		  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
		  			$(".toAppend").append(toAppend);
		  			item.subtask.forEach(function(index) {
						subtaskFetchurl =  base_url + index;
		  				$.ajax({
							  type: 'GET',
							  url: subtaskFetchurl,
							  contentType: "application/json;",
							  dataType: 'json',
							  success: function(data) {
							  		var subtaskwithcomplete = "<div class='checkbox'> <label><input type='checkbox' task_id='"+data.id+"' onclick='getshitdone(this)' checked/>" + data.title + " ("+ data.due_date +")</label> </div>";
							  		var subtaskwithoutcomplete = "<div class='checkbox'> <label><input type='checkbox' task_id='"+data.id+"' onclick='getshitdone(this)' />" + data.title + " ("+ data.due_date +")</label> </div>";
							  		var toAppend = data.completed ? subtaskwithcomplete : subtaskwithoutcomplete;
							  		$(".task_id" + item.id + " ul").append(toAppend);
							  },
						});	  				
		  			});
		  		} else if(!item.sub_task && item.subtask == '') {
		  			var deletebtntext = item.delete_time ? "Undelete" : "Delete";
		  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title +" ("+item.due_date+") </label><a href='#' parent_task="+ item.id +" onclick='addSubtask(this)'> <span class='glyphicon glyphicon-plus-sign'></span> </a><button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
					var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +" ("+item.due_date+") </label><a href='#' parent_task="+ item.id +" onclick='addSubtask(this)'> <span class='glyphicon glyphicon-plus-sign'></span> </a><button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
		  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
		  			$(".toAppend").append(toAppend);
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
		  url: base_url + "/api/v1/todo/",
		  data: JSON.stringify(data),
		  contentType: "application/json;",
		  success: function(item) {
		  		var deletebtntext = item.delete_time ? "Undelete" : "Delete";
	  			var toAppend = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +" ("+item.due_date+")</label><a href='#' parent_task="+ item.id +" onclick='addSubtask(this)'> <span class='glyphicon glyphicon-plus-sign'></span> </a><button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
	  			$(".toAppend").append(toAppend);
		  },
		  error: function(data) {
			successmessage = 'Error';
		  },
	});
}


$(".add-todo").on('keyup', function (e) {
	if (e.keyCode == 13) {
		if($('#todo_add_title').val() === '' || $('.date').val() === ''){
			alert('Please enter Title and Date');
			$(this).focus();
		}
		data = {
			"title": $('#todo_add_title').val(),
			"due_date": $('.date').val().split("-").reverse().join("-")
		};
		addNewTodo(data)
	}
});


$(document).on('keyup', '#search', function(e){
	if (e.keyCode == 13) {
	  	query = $('#search').val();
	  	$.ajax({
			  type: 'GET',
			  url: base_url + "/api/v1/todo/?title__icontains=" + query,
			  contentType: "application/json;",
			  success: function(data) {
			  	$('.toAppend li').remove();
			  	data.objects.forEach(function(item){
			  		var deletebtntext = item.delete_time ? "Undelete" : "Delete";
		  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
					var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
		  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
		  			$(".toAppend").append(toAppend);

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
		  url: base_url + "/api/v1/todo/?due_date__day=" + dd,
		  contentType: "application/json;",
		  success: function(data) {
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		var deletebtntext = item.delete_time ? "Undelete" : "Delete";
	  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
				var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
	  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
	  			$(".toAppend").append(toAppend);
		  	});
		  },
	});
 });

$(document).on('click','#filterWeek', function(e){
	$.ajax({
		  type: 'GET',
		  url: base_url + "/api/v1/todo/?due_date=True",
		  contentType: "application/json;",
		  success: function(data) {
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		var deletebtntext = item.delete_time ? "Undelete" : "Delete";
	  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
				var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
	  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
	  			$(".toAppend").append(toAppend);
		  	});
		  },
	});
 });


$(document).on('click','#filterNextweek', function(e){
	$.ajax({
		  type: 'GET',
		  url: base_url + "/api/v1/todo/?due_date__gte=True",
		  contentType: "application/json;",
		  success: function(data) {
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		var deletebtntext = item.delete_time ? "Undelete" : "Delete";
	  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
				var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
	  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
	  			$(".toAppend").append(toAppend);
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
		  url: base_url + "/api/v1/todo/?due_date__lt="+ today +"",
		  contentType: "application/json;",
		  success: function(data) {
		  	$('.toAppend li').remove();
		  	data.objects.forEach(function(item){
		  		var deletebtntext = item.delete_time ? "Undelete" : "Delete";
	  			var appendwithcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' checked />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
				var appendwithoutcomplete = "<li class='ui-state-default task_id"+item.id+"' task_id='"+item.id+"'> <div class='checkbox'> <label><input type='checkbox' task_id='"+item.id+"' onclick='getshitdone(this)' />"+ item.title +"</label> <button task_id='"+item.id+"' onclick='deleteThis(this)' class='btn btn-danger btn-xs'>"+deletebtntext+"</button> </div> <ul> </ul> </li>";
	  			var toAppend = item.completed ? appendwithcomplete : appendwithoutcomplete;
	  			$(".toAppend").append(toAppend);
		  	});
		  },
	});
 });
