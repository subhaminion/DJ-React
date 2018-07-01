from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields
from .models import Todo


class TodoResource(ModelResource):
    subtask = fields.ToManyField(
        "todos.api.SubtakResource", 'subtask',
        related_name='subtask', full=True,
        null=True, blank=True
    )

    class Meta:
        queryset = Todo.objects.all()
        resource_name = 'todo'
        authorization = Authorization()


class SubtakResource(ModelResource):
    parent = fields.ForeignKey(
        "todo.api.TodoResource", 'parent',
        use_in='detail', null=True, blank=True
    )

    class Meta:
        queryset = Todo.objects.all()
