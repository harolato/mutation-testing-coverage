from django.urls import path, re_path
from .views import index, UserLogin, UserLogout

urlpatterns = [
    path('login/', UserLogin.as_view(), name="login"),
    path('logout/', UserLogout.as_view(), name="logout"),
    re_path(r'.*', index, name="home"),
]
