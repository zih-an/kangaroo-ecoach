from django.test import TestCase
from account.email_send import send_code_email
# Create your tests here.
email="786333546@qq.com"
res_email = send_code_email(email)