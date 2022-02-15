from datetime import datetime

from django.db import models
from django.utils.timezone import now
import hashlib
from django.core.validators import int_list_validator


# 加密函数
def hash_password(password):
    if isinstance(password, str):
        password = password.encode('utf-8')
    # 使用大写的十六进制MD5加密
    return hashlib.md5(password).hexdigest().upper()


# Create your models here.
class User(models.Model):
    objects = models.Manager()

    email = models.CharField(max_length=50, unique=True, verbose_name='email', primary_key=True, default='')
    password = models.CharField(max_length=255, null=False, default='')
    nickname = models.CharField('昵称', max_length=100, null=True)
    sex = models.CharField('性别', max_length=3, null=True)
    birth_date = models.DateField('出生日期', null=True)
    weight = models.FloatField('体重', null=True)
    height = models.FloatField('身高', null=True)
    status = models.BooleanField(default=False, db_index=True)
    img_path = models.CharField('头像', max_length=500, blank=True, null=True)
    create_time = models.DateTimeField('创建时间', auto_now_add=True, null=True)
    refind_token = models.CharField('找回密码令牌', max_length=255, null=True)
    prefer_list = models.CharField(validators=[int_list_validator], default=[0, 0, 0, 0, 0, 0, 0, 0, 0], max_length=100,
                                   null=True)

    # is_chest=models.BooleanField('偏好胸部训练',default=False)
    # is_back = models.BooleanField('偏好背部训练', default=False)
    # is_shoulder = models.BooleanField('偏好肩部训练', default=False)
    # is_arms = models.BooleanField('偏好手臂训练', default=False)
    # is_abdomen = models.BooleanField('偏好腹部训练', default=False)
    # is_waist = models.BooleanField('偏好腰部训练', default=False)
    # is_hip= models.BooleanField('偏好臀部训练', default=False)
    # is_leg= models.BooleanField('偏好腿部训练', default=False)
    # is_endurance = models.BooleanField('偏好全身耐力训练', default=False)
    def __str__(self):
        return self.email

    class Meta:
        db_table = "user"
        verbose_name = "用户"
        verbose_name_plural = verbose_name

    @classmethod
    def add(cls, email, password):
        return cls.objects.create(
            email=email,
            password=hash_password(password),
            status=True
        )

    @classmethod
    def get_user(cls, email, password):
        try:
            user = cls.objects.get(email=email, password=hash_password(password))
            return user
        except:
            return None

    def update_password(self, old_password, new_password):
        hash_old_password = hash_password(old_password)
        if hash_old_password != self.password:
            return False
        hash_new_password = hash_password(new_password)
        self.password = hash_new_password
        self.save()
        return True

    # 用户状态更新
    def update_status(self):
        self.status = not self.status
        self.save()
        return True


# 邮箱验证
class EmailVerifyRecord(models.Model):
    # 验证码
    objects = models.Manager()

    code = models.CharField(max_length=20, verbose_name="验证码")
    email = models.EmailField(max_length=50, verbose_name="邮箱")
    # 包含注册验证和找回验证
    send_type = models.CharField(verbose_name="验证码类型", max_length=10,
                                 choices=(("register", "注册"), ("forget", "找回密码")))
    send_time = models.DateTimeField(verbose_name="发送时间", default=datetime.now())

    class Meta:
        db_table = "EmailVerify"
        verbose_name = "邮箱验证码"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return '{0}({1})'.format(self.code, self.email)
