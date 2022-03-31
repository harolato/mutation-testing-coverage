import copy
import json
import os
import re
from typing import Union

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


def get_file_source_language(url):
    json_file = open(os.path.dirname(__file__) + '/../storage/monaco_languages.json')
    data = json.load(json_file)
    json_file.close()
    extension = re.search(r"^.*(\..*)$", url)
    if extension:
        url_extension = extension.group(1)
        for file_type in data:
            for file_extension in file_type['extensions']:
                if file_extension == url_extension:
                    return file_type
    return data[0]


def display_source_code(source_code: Union[str, bytes], file_path: str):
    if type(source_code) is bytes:
        source_code = str(source_code, 'utf-8')
    return {
        'source': source_code,
        'file_type': get_file_source_language(file_path),
        'total_lines': source_code.count('\n')
    }
