from django.conf.urls import url, include
from tastypie.api import Api
from todos.api import (
	TodoResource, UserResource
)

api = Api(api_name='v1')
api.register(UserResource(), canonical=True)
api.register(TodoResource(), canonical=True)

urlpatterns = [
    url(r'^', include(api.urls)),
]
