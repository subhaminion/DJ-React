from tastypie.resources import ModelResource
from .models import Todo


class TodoResource(ModelResource):
    class Meta:
        queryset = Todo.objects.all()
        resource_name = 'todo'
