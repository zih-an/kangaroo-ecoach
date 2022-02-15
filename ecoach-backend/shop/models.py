from django.core.validators import int_list_validator
from django.db import models

# Create your models here.
class shop(models.Model):
    objects=models.Manager()
    name=models.CharField('商品名字',max_length=100)
    price=models.FloatField('商品价格',null=True)
    commodity_path = models.URLField('商品路径', max_length=500)
    pic_path = models.URLField('缩略图路径', max_length=500)
    introduction = models.TextField('商品简介', max_length=1023, blank=True)


    class Meta:
        db_table = "shop"
        verbose_name = "商店"
        verbose_name_plural = verbose_name
