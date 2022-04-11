from django.urls import path
from rest_framework.routers import SimpleRouter

from github_api import views
from github_api.views import GetBranchList

app_name = 'github_api'

urlpatterns = [
    path('repositories/', views.GHRepoViewSet.as_view()),
    path('user/', views.GHUserViewSet.as_view()),
    path('project_branches/<int:project_id>/', GetBranchList.as_view())
]
