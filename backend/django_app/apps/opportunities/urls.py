from django.urls import path
import apps.opportunities.views as views

urlpatterns = [
    path("connection_test/", views.DummyView.as_view(), name="connection_test"),
]
