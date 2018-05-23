from django.conf.urls import url

from travel.views.comment import *
from travel.views.home import *
from travel.views.user import *

urlpatterns = [
    # 用户
    url(r'^login$', login, name='login'),           #登录
    url(r'^logout$', logout, name='logout'),            #退出
    url(r'^user/home/page$', user_home_page, name='user_home_page'),   #用户个人主页
    url(r'^userset$', userset, name='userset'),         #保存用户资料
    url(r'^user/revise/save$', user_revise_save, name='user_revise_save'),      #保存用户安全更改
    url(r'^revise/send/email$', revise_userinfo_send_email, name='revise_userinfo_send_email'),     #更改绑定邮箱发送验证码
    url(r'^verify/email$', verify_email, name='verify_email'),      #验证email验证码
    url(r'^get/session/email$', get_session_email, name='get_session_email'),       #验证保持
    url(r'^submit/avatar$', submit_avatar, name='submit_avatar'),   #上传头像
    url(r'^do_register$', do_register, name='do_register'),     #注册
    url(r'^send_email$', send_email, name='send_email'),        #发送邮件
    # 主页
    url(r'^home$', home, name='home'),      #主页
    url(r'^new/raider$', new_raider, name='new_raider'),        #主页获取攻略
    url(r'^edit$', edit, name='edit'),      #编辑页面
    url(r'^raider$', raider, name='raider'),    #攻略详情页面
    url(r'^get/raiders$', get_raiders, name='get_raiders'),     #点击分类获取相对应攻略
    url(r'^all/raiders$', all_raiders, name='all_raiders'),     #all_raiders页面
    url(r'^raider/list$', raider_list, name='raider_list'),     #all_raiders页面初始分类获取
    url(r'^raider/type/list$', raider_type_list, name='raider_type_list'), #all_raiders页面点击分类获取
    # 评论
    url(r'^add_comment$', add_comment, name='add_comment'),     #添加评论
    url(r'^get_comment$', get_comment, name='get_comment'),     #获取评论
    url(r'^del_comment$', del_comment, name='del_comment'),     #删除评论
    url(r'^like_comment$', like_comment, name='like_comment'),  #评论的点赞
    url(r'^add_reply$', add_reply, name='add_reply'),           #添加回复
    url(r'^get_reply$', get_reply, name='get_reply'),           #获取回复
    url(r'^del_reply$', del_reply, name='del_reply'),           #删除回复
    url(r'^like_reply$', like_reply, name='like_reply'),        #点赞回复
    # ４０４
    url(r'^not/find/$', not_find, name='not_find'),             #４０４


]
