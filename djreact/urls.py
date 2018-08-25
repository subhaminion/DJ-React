from django.conf.urls import url, include
from django.contrib import admin
from todos.views import index

urlpatterns = [
    url(r'^index/', index),
    # url(r'^celerycheck/', celerycheck),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('todos.urls')),
]
