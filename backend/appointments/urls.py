from django.urls import path, include
from rest_framework.routers import DefaultRouter
# ADD AppointmentDetailView to your imports
from .views import PatientViewSet, AppointmentListCreateView, AppointmentDetailView 

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient') # Added basename for clarity

urlpatterns = [
    # Router handles: /patients/ and /patients/{id}/
    path('', include(router.urls)), 
    
    # Static paths
    path('book/', AppointmentListCreateView.as_view(), name='book-appointment'),
    path('book/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]