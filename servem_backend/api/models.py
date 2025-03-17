from django.db import models
import uuid

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=[('líder', 'Líder'), ('voluntário', 'Voluntário')])

class ChurchProgram(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    day_of_week = models.CharField(max_length=20)
    start_time = models.TimeField()
    duration = models.DurationField()
    leader = models.ForeignKey(User, on_delete=models.CASCADE)

class EventVolunteer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(ChurchProgram, on_delete=models.CASCADE)
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pendente', 'Pendente'), ('aceito', 'Aceito'), ('recusado', 'Recusado')], default='pendente')
    notified_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Analytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(ChurchProgram, on_delete=models.CASCADE)
    volunteer_count = models.IntegerField(default=0)
    engagement_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)