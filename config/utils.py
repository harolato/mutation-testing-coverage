from django.db import models
from django.http import JsonResponse


class Timestampable(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


def json_response_exception():
    def decorate(func):
        def applicator(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except AppException as e:
                return_data = {'status': False, 'error': e.__str__(), 'data': e.exception_data}
                return JsonResponse(data=return_data, status=400)

        return applicator

    return decorate


class AppException(Exception):
    def __init__(self, message='', exception_data=None):
        if exception_data is None:
            exception_data = []
        self.message = message
        self.exception_data = exception_data
        super().__init__()

    def __str__(self):
        return self.message
