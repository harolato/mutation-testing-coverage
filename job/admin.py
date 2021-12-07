from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from job.models import Job, File, Mutation, Project, Token, Profile, ProjectMembership


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


class ProjectMembershipInline(admin.TabularInline):
    model = ProjectMembership


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'git_repo_owner', 'git_repo_name', 'get_owner')
    inlines = [JobsInline, TokensInline, ProjectMembershipInline]


class MutationAdmin(admin.ModelAdmin):
    list_display = ('sequence_number', 'description', 'start_line', 'end_line', 'mutated_source_code', 'result', 'file')


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('access_token',)


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False


class CustomUserAdmin(UserAdmin):
    save_on_top = True
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'last_login')
    inlines = [ProfileInline]


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(File, FileAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Profile, ProfileAdmin)
