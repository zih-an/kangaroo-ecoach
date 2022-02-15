from django.core.validators import int_list_validator
from django.db import models

# Create your models here.
class report(models.Model):
    objects = models.Manager()
    exe_intensity=models.IntegerField('运动强度',blank=True)
    completion=models.FloatField('完成度',blank=True)
    action_list=models.CharField('动作标准度序列',validators=[int_list_validator], default=[],max_length=100)
    coor_list=models.CharField('协调性序列',validators=[int_list_validator], default=[],max_length=100)
    heart_list=models.CharField('心率序列',validators=[int_list_validator], default=[],max_length=100)
    cal_list=models.CharField('卡路里序列',validators=[int_list_validator], default=[],max_length=100)
    perfect_a_path=models.CharField('高分动作存储路径',max_length=500,null=True)


    class Meta:
        db_table="report"
        verbose_name = "报告"
        verbose_name_plural = verbose_name

    @classmethod
    def add(cls,exe_intensity,completion,action_list,coor_list,heart_list,cal_list,perfect_a_path=''):
        return cls.objects.create(
            exe_intensity=exe_intensity,
            completion=completion,
            action_list=action_list,
            coor_list=coor_list,
            heart_list=heart_list,
            cal_list=cal_list,
            perfect_a_path=perfect_a_path
        )



