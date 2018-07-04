from __future__ import unicode_literals
from __future__ import absolute_import
from django.http import HttpResponse
from django.template import loader


def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render({}, request))
