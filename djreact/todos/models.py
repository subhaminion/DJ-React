from __future__ import unicode_literals
from django.db import models

# today = datetime.now().date()
# http://127.0.0.1:8000/api/todo/?due_date__day=16 == today
# http://127.0.0.1:8000/api/todo/?due_date__gte=2018-07-12&due_date__lt=2018-07-19 == next week
# http://127.0.0.1:8000/api/todo/?due_date__lt=2018-07-02 == overdue


class Todo(models.Model):
    title = models.CharField(max_length=250)
    creation_date = models.DateField(auto_now=True)
    due_date = models.DateField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    sub_task = models.BooleanField(default=False)
    parent_task = models.ForeignKey(
        'self', related_name='subtask', blank=True, null=True)
    delete_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
