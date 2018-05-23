import time

from django.db import models
from DjangoUeditor.models import UEditorField


# 用户
class User(models.Model):

    uid = models.AutoField(primary_key=True)
    # 背景图片
    banner = models.CharField(max_length=512, null=True)
    # 作者头像
    avatar = models.ImageField(upload_to='avatar/%Y/%m/%d')
    # 作者名字
    name = models.CharField(max_length=128)
    # 生日
    birthday = models.CharField(max_length=20,null=True)
    # 性别
    sex = models.CharField(max_length=10,null=True)
    # 学校
    school = models.CharField(max_length=20,null=True)
    # 简介
    intro = models.TextField(blank=True, null=True)
    # 喜欢的人数
    like_counts = models.IntegerField(default=0)
    # 作者关注的人数
    follow_counts = models.IntegerField(default=0)

    email = models.CharField(max_length=100, blank=True, null=True)
    # 账号
    account_num = models.CharField(max_length=50,default=12)
    # 密码
    password = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'users'

    @classmethod
    def get_by_email(cls, email):
        return cls.objects.filter(email=email).first()

    @classmethod
    def get_by_account_num(cls, account_num):
        return cls.objects.filter(account_num=account_num).first()

# 攻略
class Raider(models.Model):

    rid = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=200,null=True)
    # 标题
    title = models.CharField(max_length=256)
    # 攻略内容
    content = UEditorField(width=1500, height=500, toolbars="full", imagePath="/static/images/%(basename)s_%(datetime)s.%(extname)", filePath="/static/files/%(basename)s_%(datetime)s.%(extname)",
             settings={},command=None,blank=True)
    # 创建时间
    created_at = models.DateTimeField(auto_now_add=True)
    # 攻略描述
    description = models.TextField(blank=True, null=True)
    # 观看次数
    play_counts = models.IntegerField(null=True)
    # 喜欢的人数
    like_counts = models.IntegerField(null=True)
    # 小图
    thumbnail = models.ImageField(upload_to='cover/%Y/%m/%d')
    # 国家
    country = models.CharField(max_length=20,default='other')
    # 地区
    province = models.CharField(max_length=20,default='other')
    # 城市
    city = models.CharField(max_length=20,default='other')
    class Meta:
        db_table = 'raiders'

    @classmethod
    def get_raider_by_rid(cls, rid):
        return cls.objects.filter(rid=rid).first()


# 用户和攻略之间的收藏关系表
class Collection(models.Model):
    cid = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=200)
    rid = models.CharField(max_length=200)

    class Meta:
        db_table = 'collection'


# 用户和用户之间的关注关系表
class Attention(models.Model):
    aid = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=200)
    other_uid = models.CharField(max_length=200)

    class Meta:
        db_table = 'attention'


# 用户和评论之间的点赞关系表
class Praise(models.Model):
    praise_id = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=200)
    comment_id = models.CharField(max_length=200)

    class Meta:
        db_table = 'praise'


# 用户和回复之间的点赞关系表
class PraiseReply(models.Model):
    praise_reply_id = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=200)
    reply_id = models.CharField(max_length=200)

    class Meta:
        db_table = 'praise_reply'


# 评论
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    # 评论者id
    from_uid = models.CharField(max_length=200)
    # 评论类型
    comment_type = models.CharField(max_length=20, default='comment')
    # 攻略id
    rid = models.CharField(max_length=200)
    # 创建时间
    created_at = models.DateTimeField(auto_now_add=True)
    # 评论内容
    content = models.TextField(blank=True, null=True)
    # 喜欢的人数
    like_counts = models.IntegerField(default='0')

    class Meta:
        db_table = 'comments'



# 回复
class Reply(models.Model):
    # 回复id
    reply_id = models.AutoField(primary_key=True)
    # 评论id
    comment_id = models.CharField(max_length=200)
    # 内容
    content = models.TextField(blank=True,null=True)
    # 创建时间
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    # 回复用户id
    from_uid = models.CharField(max_length=200)
    # 回复类型
    reply_type = models.CharField(max_length=20,default='comment')
    # 父回复id
    p_reply_id = models.CharField(max_length=200)
    # 目标用户id
    to_uid = models.CharField(max_length=200)

    class Meta:
        db_table = 'reply'


# 邮箱验证码
class Code(models.Model):
    code_id = models.BigAutoField(primary_key=True)
    email = models.CharField(max_length=200, blank=True, null=True)
    code = models.CharField(max_length=20)
    created_at = models.CharField(max_length=50,default=time.time())

