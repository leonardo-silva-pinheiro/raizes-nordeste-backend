from rest_framework.routers import DefaultRouter

from .views import UnidadeViewSet


router = DefaultRouter()

router.register(r'unidades', UnidadeViewSet)

urlpatterns = router.urls