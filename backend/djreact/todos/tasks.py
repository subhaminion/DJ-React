from __future__ import absolute_import
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from todos.models import Todo
from django.utils import timezone

logger = get_task_logger(__name__)


@periodic_task(
    run_every=(crontab(minute='*/1')),
    name="delete_old_todos",
    ignore_result=True
)
def delete_old_todos():
    todos = Todo.objects.all()

    for todo in todos:
        if todo.delete_time is not None:
            if todo.delete_time < timezone.now():
                logger.info(" Brace yourself " + todo.title + "is getting deleted")
                todo.delete()
    return "Deleted Todos at {}".format(timezone.now())