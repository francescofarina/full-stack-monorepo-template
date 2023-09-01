from django.urls import path
import apps.opportunities.views as views

urlpatterns = [
    path("connection_test/", views.get_dummy_stuff, name="connection_test"),
]
