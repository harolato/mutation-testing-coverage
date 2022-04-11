from django.urls import path
from rest_framework.routers import SimpleRouter

from api import views
from api.views import SubmitAmpTestView, NotificationConsumerView, SubmitAmpTestPRView

app_name = 'api'

router = SimpleRouter()

router.register('jobs', views.JobViewSet)
router.register('files', views.FileViewSet)
router.register('mutations', views.MutationViewSet)
router.register('projects', views.ProjectViewSet)
router.register('test_amp', views.TestAmpViewSet)


urlpatterns: list = router.urls

urlpatterns.append(path('submit_amp_test/', SubmitAmpTestView.as_view()))

urlpatterns.append(path('submit_amp_test_pullrequest/', SubmitAmpTestPRView.as_view()))
urlpatterns.append(path('notifications/', NotificationConsumerView.as_view()))
urlpatterns.append(path('user/', views.UserViewSet.as_view()))
urlpatterns.append(path('testamplification/', views.SubmitTestAmpView.as_view()))
urlpatterns.append(path('profile/', views.ProfileViewSet.as_view()))
urlpatterns.append(path('submit_github_issue/<int:mutant_id>/', views.SubmitGHIssueViewSet.as_view()))
