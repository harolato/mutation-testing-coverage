from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import User

from job.models import Job, File, Mutation, Project, Token, Profile


class FileInline(admin.StackedInline):
    show_change_link = True
    model = File


class JobAdmin(admin.ModelAdmin):
    exclude = ()
    inlines = [FileInline]


class MutationInline(admin.StackedInline):
    model = Mutation


class FileAdmin(admin.ModelAdmin):
    list_display = ('path', 'hash')
    inlines = [MutationInline]


class TokensInline(admin.StackedInline):
    show_change_link = True
    model = Token


class JobsInline(admin.StackedInline):
    show_change_link = True
    model = Job


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'git_repo_owner', 'git_repo_name')
    inlines = [JobsInline, TokensInline]


class MutationAdmin(admin.ModelAdmin):
    list_display = ('sequence_number', 'description', 'start_line', 'end_line', 'mutated_source_code', 'result', 'file')


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('access_token', )


admin.site.register(Job, JobAdmin)
admin.site.register(File, FileAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Profile, ProfileAdmin)
