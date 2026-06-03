from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

from rest_framework.routers import DefaultRouter

from usuarios.views import UsuarioViewSet
from unidades.views import UnidadeViewSet
from produtos.views import ProdutoViewSet
from estoque.views import EstoqueViewSet
from pedidos.views import PedidoViewSet
from fidelidade.views import FidelidadeViewSet
from usuarios.views import UsuarioViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

def home(request):

    return HttpResponse("""

    <!DOCTYPE html>

    <html lang="pt-br">

    <head>

        <meta charset="UTF-8">

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Raízes do Nordeste</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <style>

            body {
                background: linear-gradient(to right, #ffecd2, #fcb69f);
                min-height: 100vh;
            }

            .hero {
                padding: 80px 20px;
                text-align: center;
            }

            .hero h1 {
                font-size: 4rem;
                font-weight: bold;
                color: #8B4513;
            }

            .hero p {
                font-size: 1.3rem;
                color: #5c4033;
            }

            .card-custom {
                border-radius: 20px;
                transition: 0.3s;
            }

            .card-custom:hover {
                transform: scale(1.03);
            }

            .footer {
                margin-top: 50px;
                text-align: center;
                color: #6c757d;
            }

        </style>

    </head>

    <body>

        <div class="container">

            <div class="hero">

                <h1>🌵 Raízes do Nordeste</h1>

                <p>
                    Sistema ERP/API para gestão de pedidos,
                    estoque, fidelidade e unidades.
                </p>

            </div>

            <div class="row g-4">

                <div class="col-md-4">

                    <div class="card shadow card-custom">

                        <div class="card-body text-center">

                            <h3>⚙️ Admin</h3>

                            <p>Painel administrativo do sistema</p>

                            <a href="/admin/" class="btn btn-dark">
                                Acessar
                            </a>

                        </div>

                    </div>

                </div>

                <div class="col-md-4">

                    <div class="card shadow card-custom">

                        <div class="card-body text-center">

                            <h3>📘 Swagger</h3>

                            <p>Documentação interativa da API</p>

                            <a href="/api/docs/" class="btn btn-primary">
                                Abrir
                            </a>

                        </div>

                    </div>

                </div>

                <div class="col-md-4">

                    <div class="card shadow card-custom">

                        <div class="card-body text-center">

                            <h3>🚀 API REST</h3>

                            <p>Endpoints do sistema</p>

                            <a href="/api/" class="btn btn-success">
                                Ver API
                            </a>

                        </div>

                    </div>

                </div>

            </div>

            <div class="footer">

                <hr>

                <p>
                    Projeto acadêmico • Django REST Framework • PostgreSQL
                </p>

            </div>

        </div>

    </body>

    </html>

    """)


router = DefaultRouter()

router.register(r'usuarios', UsuarioViewSet)
router.register(r'unidades', UnidadeViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'estoque', EstoqueViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'fidelidade', FidelidadeViewSet)


urlpatterns = [

    path('', home),

    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),

    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path(
        'api/schema/',
        SpectacularAPIView.as_view(),
        name='schema'
    ),

    path(
        'api/docs/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui'
    ),
]