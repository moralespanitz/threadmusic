from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import CustomUser

class UserAuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('token_obtain_pair')
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.token_obtain_pair_data = {
            'username': 'testuser',
            'password': 'testpassword'
        }

    def test_user_login(self):
        response = self.client.post(self.login_url, self.token_obtain_pair_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_invalid_credentials(self):
        invalid_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)