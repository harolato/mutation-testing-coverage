from django.contrib import admin

# Register your models here.
from job.models import Job, File, Mutation


class FileInline(admin.StackedInline):
    show_change_link = True
    model = File


class JobAdmin(admin.ModelAdmin):
    exclude = ()
    inlines = [FileInline]


class MutationInline(admin.StackedInline):
    model = Mutation


class FileAdmin(admin.ModelAdmin):
    list_display = ('path', 'hash', 'mutations')
    inlines = [MutationInline]


class MutationAdmin(admin.ModelAdmin):
    list_display = ('sequence_number', 'description', 'start_line', 'end_line', 'mutated_source_code', 'result', 'file')


admin.site.register(Job, JobAdmin)
admin.site.register(File, FileAdmin)
# admin.site.register(Mutation, MutationAdmin)
