import time
from django.http import HttpResponse
from random import Random
from django.core.mail import send_mail
from my_travel.settings import DEFAULT_FROM_EMAIL



from travel.models import Code

#生成随机字符串
def random_str(randomlength=6):
    str=''
    chars='abcdefghijklmnopqrstuvwxyz1234567890'
    length=len(chars)-1
    random=Random()
    for i in range(randomlength):
        str+=chars[random.randint(0,length)]
    return str

# 发送邮件
def send_register_email(aims_email,code):
    b=[]
    b.append(aims_email)
    send_mail('爱旅行验证码',code,DEFAULT_FROM_EMAIL,b,fail_silently=False)
    return "ok"

# 验证输入的验证码
def verify(email, code):
    cm = Code.objects.filter(email=email, code=code).first()
    if not cm:
        return '0'
    old_time = cm.created_at
    if float(time.time()) - float(old_time) > 60:
        return '1'
    return '2'
