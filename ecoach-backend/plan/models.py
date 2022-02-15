from django.core.validators import int_list_validator
from django.db import models
from account.models import User


# Create your models here.
class plan(models.Model):
    objects = models.Manager()

    user = models.OneToOneField(User, blank=True, null=True, on_delete=models.SET_NULL)
    ex_plan = models.CharField('视频选择序列', validators=[int_list_validator], default=[], max_length=100)

    class Meta:
        db_table = "plan"
        verbose_name = "计划推荐"
        verbose_name_plural = verbose_name
