import json
import datetime
from django.contrib.auth.models import User
from tastypie import fields
from tastypie.constants import ALL
from tastypie.exceptions import BadRequest
from tastypie.resources import ModelResource
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import BasicAuthentication
from .models import Todo


class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = "user"
        excludes = ["email", "password", "is_active", "is_staff", "is_superuser"]
        allowed_methods = ["get"]
        authorization = DjangoAuthorization()
        authentication = BasicAuthentication()


class TodoResource(ModelResource):
    subtask = fields.ToManyField(
        "self", 'subtask',
        null=True
    )

    class Meta:
        queryset = Todo.objects.all()
        resource_name = 'todo'
        authorization = DjangoAuthorization()
        authentication = BasicAuthentication()
        filtering = {
            'title': ['icontains'],
            'due_date': ALL
        }
        always_return_data = True

    def obj_create(self, bundle, request=None, **kwargs):
        if bundle.data.get('parent_task'):
            parent_task_id = bundle.data.get('parent_task')
            parent_task = Todo.objects.get(id=parent_task_id)
            subtask_duedate = datetime.datetime.strptime(bundle.data.get('due_date').encode(), "%Y-%m-%d").date()

            if subtask_duedate > parent_task.due_date:
                raise BadRequest('true')
            return super(TodoResource, self).obj_create(bundle, request=request, parent_task=parent_task)
        return super(TodoResource, self).obj_create(bundle, request=request, **kwargs)

    def apply_filters(self, request, applicable_filters):
        if applicable_filters.get('due_date__gte'):
            thisWeek = datetime.datetime.utcnow().isocalendar()[1]
            return Todo.objects.filter(due_date__week=thisWeek)  
        return self.get_object_list(request).filter(**applicable_filters)
