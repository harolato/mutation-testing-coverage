from rest_framework.routers import SimpleRouter

from api import views

app_name = 'api'

router = SimpleRouter()

router.register('jobs', views.JobViewSet)
router.register('files', views.FileViewSet)
router.register('mutations', views.MutationViewSet)
router.register('projects', views.ProjectViewSet)

urlpatterns = router.urls
