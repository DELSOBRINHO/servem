from rest_framework.decorators import api_view
from rest_framework.response import Response
from supabase import create_client
from django.conf import settings

# Criar conexão com o Supabase
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

@api_view(['GET'])
def get_users(request):
    data = supabase.table("users").select("*").execute()
    return Response(data.data)

@api_view(['GET'])
def get_church_programs(request):
    data = supabase.table("church_programs").select("*").execute()
    return Response(data.data)

@api_view(['GET'])
def get_event_volunteers(request):
    data = supabase.table("event_volunteers").select("*").execute()
    return Response(data.data)

@api_view(['GET'])
def get_notifications(request):
    data = supabase.table("notifications").select("*").execute()
    return Response(data.data)

@api_view(['GET'])
def get_analytics(request):
    data = supabase.table("analytics").select("*").execute()
    return Response(data.data)
