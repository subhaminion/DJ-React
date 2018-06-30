from django.conf.urls import url, include
from todos.api import TodoResource

entry_resource = TodoResource()

urlpatterns = [
    url(r'^api/', include(entry_resource.urls)),
]
