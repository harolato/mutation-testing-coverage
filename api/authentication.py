import datetime

import rest_framework.authentication
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import exceptions, permissions

from job.models import Token


class SimpleTokenAuth(rest_framework.authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            token = request.META['HTTP_X_API_KEY']
            token_object = Token.objects.filter(Q(expire_at__gt=datetime.datetime.now())).get(token=token)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid Token')
        except KeyError:
            raise exceptions.AuthenticationFailed('Invalid Token')

        return token_object.user, token_object


class SimpleTokenAuthIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        print(request.user)
        return True
