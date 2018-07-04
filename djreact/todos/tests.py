from django.test import TestCase
from todos.models import Todo


class TodoModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Todo.objects.create(title='first todo')

    def test_title_content(self):
        todo = Todo.objects.get(id=1)
        expected_object_name = todo.title
        self.assertEquals(expected_object_name, 'first todo')
