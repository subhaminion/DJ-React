from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields
from .models import Todo


class TodoResource(ModelResource):
    subtask = fields.ToManyField(
        "self", 'subtask',
    )

    class Meta:
        queryset = Todo.objects.all()
        resource_name = 'todo'
        authorization = Authorization()
        filtering = {
            'title': ['icontains']
        }
