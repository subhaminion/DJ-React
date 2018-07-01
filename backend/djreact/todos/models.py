from __future__ import unicode_literals
from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField()
    creation_date = models.DateField(auto_now=True)
    due_date = models.DateField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    parent_task = models.ForeignKey('self', related_name='subtask', blank=True, null=True)

    def __str__(self):
        return self.title
