import json
import datetime
from django.utils import timezone
from tastypie import fields
from tastypie.constants import ALL
from tastypie.exceptions import BadRequest
from tastypie.serializers import Serializer
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from .models import Todo


class RequestSerializer(Serializer):
    def from_json(self, content):
        try:
            return json.loads(content)
        except ValueError as e:
            raise BadRequest(u"Incorrect JSON format: Reason: \"{}\"".format(e.message))


class TodoResource(ModelResource):
    subtask = fields.ToManyField(
        "self", 'subtask',
        null=True
    )

    class Meta:
        serializer = RequestSerializer(formats=['json'])
        queryset = Todo.objects.all()
        resource_name = 'todo'
        authorization = Authorization()
        filtering = {
            'title': ['icontains'],
            'due_date': ALL
        }
        always_return_data = True

    def obj_create(self, bundle, request=None, **kwargs):
        if bundle.data.get('parent_task'):
            parent_task_id = bundle.data.get('parent_task')
            parent_task = Todo.objects.get(id=parent_task_id)
            return super(TodoResource, self).obj_create(bundle, request=request, parent_task=parent_task)
        return super(TodoResource, self).obj_create(bundle, request=request, **kwargs)
