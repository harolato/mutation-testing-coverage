from django.urls import path
from .views import index, UserLogin, UserLogout

urlpatterns = [
    path('', index, name="home"),
    path('login/', UserLogin.as_view(), name="login"),
    path('logout/', UserLogout.as_view(), name="logout"),
]
