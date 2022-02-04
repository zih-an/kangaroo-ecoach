from django.contrib import admin
from django.urls import path,include
from exercise import views
urlpatterns = [
    path('<str:email>', views.query),
    path('<str:email>/<int:year>/<int:month>/<int:day>', views.detail_query),
]
