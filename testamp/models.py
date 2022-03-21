import uuid

from django.db import models

from config.utils import Timestampable
from job.models import Job


def zip_file_path(_, file_name: str):
    tmp_file_name_uuid = uuid.uuid4()
    tmp_file_name = f"{tmp_file_name_uuid}.zip"
    if file_name.find('.json') > -1:
        tmp_file_name = f"{tmp_file_name_uuid}.json"
    return f"testamp_zipfiles/{tmp_file_name}"


class TestAmpZipFile(Timestampable):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    file = models.FileField(upload_to=zip_file_path)


class TestSuite(Timestampable):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    test_amp_zip_file = models.ForeignKey(TestAmpZipFile, on_delete=models.CASCADE)


class TestCase(Timestampable):
    test_suite = models.ForeignKey(TestSuite, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=255)
    test_reference_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    start_line = models.PositiveIntegerField(
        default=0,
        help_text='Start line of original test method. Used for replacing old test with new')
    end_line = models.IntegerField(
        default=0,
        help_text='End line of original test method. Used for replacing old test with new'
    )
    new_coverage = models.JSONField(default=list)
    original_test = models.JSONField(default=dict)
