from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.exceptions import BadRequest
from tastypie.serializers import Serializer
from tastypie.constants import ALL
from tastypie import fields
from .models import Todo
import json


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
