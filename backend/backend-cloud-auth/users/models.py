from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # TODO: Remove if is unnecessary
    company=models.CharField(max_length=100, null=False, blank=False,editable=True)