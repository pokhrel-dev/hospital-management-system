from rest_framework import generics, viewsets, status # Added status
from rest_framework.response import Response # Recommended for custom create
from django.contrib.auth.models import User # CRITICAL MISSING IMPORT
from .models import Doctor, Appointment, Patient
from .serializers import DoctorSerializer, AppointmentSerializer, PatientSerializer
from rest_framework.permissions import AllowAny

# ... [Keep your Doctor and Appointment views as they are] ...

# This ViewSet handles the dynamic Registration logic
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def create(self, request, *args, **kwargs):
        # 1. Capture data from the Maryland-based frontend
        name = request.data.get('name')
        password = request.data.get('password')

        if not name or not password:
            return Response({"error": "Name and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Create the actual Django User for login
        # This allows the /api/token/ endpoint to find this user later
        if not User.objects.filter(username=name).exists():
            User.objects.create_user(username=name, password=password)
        
        # 3. Create the Patient record in RDS
        return super().create(request, *args, **kwargs)

    def get_permissions(self):
        # Allow anyone to register, but protect the patient list
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()