from rest_framework.routers import DefaultRouter

from .views import EstoqueViewSet


router = DefaultRouter()

router.register(r'estoque', EstoqueViewSet)

urlpatterns = router.urls