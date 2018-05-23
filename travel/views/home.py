from django.db.models import Q
from django.forms import forms
from django.http import JsonResponse
from django.shortcuts import render, redirect

from DjangoUeditor.forms import UEditorField
from django.urls import reverse
from dss.Serializer import serializer

from my_travel.api import verify_login, keep_login
from travel.models import Raider, User


class TestUEditorForm(forms.Form):
        Description=UEditorField("描述",initial="内容",width=1000, height=500)

# 主页
def home(request):
    account_num = keep_login(request)
    if account_num:
        user = User.get_by_account_num(account_num)
    return render(request, 'travel/home.html',locals())

# 初始时主页请求获取攻略
def new_raider(request):
    def add_extra(raider):
        from_user = User.objects.filter(uid=raider.uid).first()
        # comment_like_num = Praise.objects.filter(comment_id=comment.comment_id).all()
        setattr(raider,'from_uname',from_user.name)
        return raider

    hot_all_raiders = list(map(add_extra, list(reversed(Raider.objects.all().order_by('-like_counts')[0:8]))))
    new_all_raiders = list(map(add_extra, list(reversed(Raider.objects.all().order_by('-created_at')[0:8]))))
    new_all_raiders = serializer(new_all_raiders, datetime_format='string')
    hot_all_raiders = serializer(hot_all_raiders, datetime_format='string')
    data={
        'new_all_raiders':new_all_raiders,
        'hot_all_raiders':hot_all_raiders,
          }
    return JsonResponse(data)

# 主页点击分类时获取攻略
def get_raiders(request):
    def add_extra(raider):
        from_user = User.objects.filter(uid=raider.uid).first()
        # comment_like_num = Praise.objects.filter(comment_id=comment.comment_id).all()
        setattr(raider,'from_uname',from_user.name)
        return raider

    country = request.GET.get('country')
    raiders_type =request.GET.get('raiders_type')
    print(raiders_type)
    if country == 'china':
        raiders = list(map(add_extra, list(Raider.objects.filter(country ='中国').order_by(raiders_type)[0:8])))
    else:
        raiders = list(map(add_extra, list(reversed(Raider.objects.filter(~Q(country ='中国')).order_by(raiders_type)[0:8]))))
    raiders = serializer(raiders, datetime_format='string')

    return JsonResponse({'raiders':raiders})


# 初始all_raiders页面时请求获取攻略
def raider_list(request):
    def add_extra(raider):
        from_user = User.objects.filter(uid=raider.uid).first()
        # comment_like_num = Praise.objects.filter(comment_id=comment.comment_id).all()
        setattr(raider,'from_uname',from_user.name)
        if from_user.avatar:
            setattr(raider, 'from_uavatar', from_user.avatar)
        return raider

    hot_all_raiders = list(map(add_extra, list(reversed(Raider.objects.all().order_by('-like_counts')))))
    hot_all_raiders = serializer(hot_all_raiders, datetime_format='string')
    data={
        'hot_all_raiders':hot_all_raiders,
          }
    return JsonResponse(data)

# all_raiders页面点击分类时获取攻略
def raider_type_list(request):
    def add_extra(raider):
        from_user = User.objects.filter(uid=raider.uid).first()
        # comment_like_num = Praise.objects.filter(comment_id=comment.comment_id).all()
        setattr(raider,'from_uname',from_user.name)
        if from_user.avatar:
            setattr(raider, 'from_uavatar', from_user.avatar)
        return raider

    country = request.GET.get('country')
    raiders_type =request.GET.get('raiders_type')
    if country == '全部攻略':
        raiders = list(map(add_extra, list(Raider.objects.all().order_by(raiders_type))))
    else:
        raiders = list(map(add_extra, list(Raider.objects.filter(country =country).order_by(raiders_type))))
    raiders = serializer(raiders, datetime_format='string')

    return JsonResponse({'raiders':raiders})

# 所有攻略页面
def all_raiders(request):
    return render(request,'travel/all_raider.html')

# 编辑攻略页面
@verify_login
def edit(request):
    if request.method == 'GET':
        form = TestUEditorForm()
        return render(request, 'travel/edit.html',{'form':form})
    if request.method == 'POST':
        f=TestUEditorForm(request.POST)
        if f.is_valid():
            title = request.POST.get('title')
            introduction = request.POST.get('introduction')
            country = request.POST.get('country')
            province = request.POST.get('province')
            city =request.POST.get('city')
            info = f.cleaned_data['Description']
            icon = request.FILES.get('icon')
            if not icon:
                icon = 'cover/no_thumbnail.jpeg'
            raider = Raider()
            raider.uid = request.user.uid
            raider.title = title
            raider.description = introduction
            raider.content = info
            raider.thumbnail = icon
            raider.country =country
            raider.city = city
            raider.province =province
            raider.save()
        return redirect(reverse('travel:home'))

# 攻略详情页面
def raider(request):
    account_num = keep_login(request)
    user = User.get_by_account_num(account_num)
    rid = request.GET.get('rid','')
    raider = Raider.get_raider_by_rid(rid)
    raider_user = User.objects.filter(uid=raider.uid).first()
    return render(request, 'travel/raider.html', locals())




