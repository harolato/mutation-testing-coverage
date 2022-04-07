from django.urls import path

from testamp import views

app_name = 'testamp'

urlpatterns = [
    path('debug/', views.debug),
    path('ws_test/', views.ws_test)
]
