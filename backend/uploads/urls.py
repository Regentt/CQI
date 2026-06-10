from django.urls import path
from .views import UploadListView, UploadDetailView

urlpatterns = [
    path('',          UploadListView.as_view(),   name='upload-list'),
    path('<uuid:pk>/', UploadDetailView.as_view(), name='upload-detail'),
]

