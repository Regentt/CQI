from django.urls import path
from .views import RegisterView, LoginView, MeView, RefreshView

urlpatterns = [
    path('register/',    RegisterView.as_view(),        name='user-register'),
    path('login/',       LoginView.as_view(),            name='user-login'),
    path('refresh/',     RefreshView.as_view(),          name='user-refresh'),
    path('me/',          MeView.as_view(),               name='user-me'),
]