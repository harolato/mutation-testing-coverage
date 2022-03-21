from django.contrib import admin

# Register your models here.
from testamp.models import TestAmpZipFile


class ZipFileAdmin(admin.ModelAdmin):
    list_display = ('job', 'file')


admin.site.register(TestAmpZipFile, ZipFileAdmin)
