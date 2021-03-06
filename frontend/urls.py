from django.urls import path, re_path
from .views import index, UserLogin, UserLogout, file_view, error_view

urlpatterns = [
    path('file/', file_view, name="file"),
    path('login/', UserLogin.as_view(), name="login"),
    path('logout/', UserLogout.as_view(), name="logout"),
    path('error/', error_view, name="logout"),
    re_path(r'.*', index, name="home"),
]
