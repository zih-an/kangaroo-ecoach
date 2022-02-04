from django.db import models
from django.core.validators import int_list_validator
# Create your models here.
class standardV(models.Model):
    objects = models.Manager()

    sv_path=models.URLField('存储路径',max_length=500)
    sketch_sv_path=models.URLField('缩略图存储路径',max_length=500)
    title=models.CharField('视频标题',max_length=255)
    introduction=models.TextField('视频简介',max_length=1023,blank=True)
    skeleton_pic=models.CharField('骨架图存储路径',max_length=500)
    A_intensity=models.IntegerField('难度系数',blank=True)
    action_tag=models.CharField(validators=[int_list_validator], default=[0,0,0,0,0,0,0,0,0],max_length=100)

    def __str__(self):
        return self.title

    class Meta:
        db_table="standardV"
        verbose_name = "标准视频"
        verbose_name_plural = verbose_name

    @classmethod
    def add(cls, sv_path, sketch_sv_path, title, introduction, skeleton_pic, A_intensity, action_tag):
        return cls.objects.create(
            sv_path=sv_path,
            sketch_sv_path=sketch_sv_path,
            title=title,
            introduction=introduction,
            skeleton_pic=skeleton_pic,
            A_intensity=A_intensity,
            action_tag=action_tag
        )