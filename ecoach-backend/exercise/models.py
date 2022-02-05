from django.core.validators import int_list_validator
from django.db import models
from account.models import User
from report.models import report
from datetime import datetime

# Create your models here.
class ex_record(models.Model):
    objects = models.Manager()
    record_id = models.IntegerField('运动记录id', primary_key=True)
    user = models.ForeignKey(User, related_name='record', on_delete=models.SET_NULL, blank=True, null=True)
    start_time = models.DateTimeField(verbose_name="运动结束时间", default=datetime.now())
    report = models.OneToOneField(report, blank=True, null=True, on_delete=models.SET_NULL)
    v_chosen = models.CharField('视频选择序列', validators=[int_list_validator], default=[], max_length=100)
    A_length = models.IntegerField('运动时长')
    finished=models.BooleanField("是否完成", default=False)
    poster_path = models.CharField('海报地址', max_length=500, null=True, blank=True)

    class Meta:
        db_table = "ex_record"
        verbose_name = "运动记录"
        verbose_name_plural = verbose_name
        ordering = ['-start_time']
