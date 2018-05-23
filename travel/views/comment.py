from django.core.paginator import Paginator
from django.http import JsonResponse
from my_travel.api import verify_login, ajax_verify_login
from travel.models import Comment, User, Reply, Praise, PraiseReply
from dss.Serializer import serializer

# 添加评论
@ajax_verify_login
def add_comment(request):
    comment_type = request.POST.get('comment_type')
    rid = request.POST.get('rid')
    content = request.POST.get('content')
    from_uid = request.user.uid
    if comment_type == None:
        comment = Comment()
        comment.from_uid = from_uid
        comment.rid = rid
        comment.content = content
        comment.save()
        return JsonResponse({'result':'success'})


# 获取评论
def get_comment(request):
    def add_extra(comment):
        from_user = User.objects.filter(uid=comment.from_uid).first()
        replys = Reply.objects.filter(comment_id=comment.comment_id).all()
        comment_like_num = Praise.objects.filter(comment_id=comment.comment_id).all()
        setattr(comment,'from_uname',from_user.name)
        setattr(comment, 'from_uid', from_user.uid)
        setattr(comment, 'reply_num', len(replys))
        setattr(comment, 'comment_like_num', len(comment_like_num))
        if from_user.avatar:
            setattr(comment, 'from_avatar', from_user.avatar)
        return comment

    rid =request.GET.get('rid')
    page = request.GET.get('page')
    # 给comments添加新字段
    comments = Comment.objects.filter(rid=rid).all()
    comments = list(map(add_extra, comments))
    # 分页
    paginator = Paginator(comments,8)
    comments = paginator.page(page)

    comments = serializer(comments, datetime_format='string')
    return JsonResponse({'comments':comments})

# 删除评论
def del_comment(request):
    comment_id = request.GET.get('comment_id','')
    comment = Comment.objects.filter(comment_id=comment_id)
    replys = Reply.objects.filter(comment_id=comment_id)
    replys.delete()
    comment.delete()
    return JsonResponse({'result':'success'})

# 点赞评论,取消点赞
def like_comment(request):
    comment_id = request.POST.get('comment_id')
    login_user_id = request.POST.get('login_user_id')
    praise1 = Praise.objects.filter(comment_id=comment_id,uid=login_user_id)
    if praise1:
        praise1.delete()
        return JsonResponse({'result':'error'})
    praise = Praise()
    praise.comment_id = comment_id
    praise.uid = login_user_id
    praise.save()
    return JsonResponse({'result':'success'})


# 增加回复
@ajax_verify_login
def add_reply(request):
    comment_id = request.POST.get('comment_id')
    comment_from_uid = request.POST.get('comment_from_uid')
    reply_content = request.POST.get('content')
    from_uid = request.user.uid
    reply = Reply()
    reply.comment_id = comment_id
    reply.content = reply_content
    reply.from_uid = from_uid
    reply.to_uid = comment_from_uid
    reply.save()
    return JsonResponse({'result':'success'})

# 获取回复
def get_reply(request):
    def add_extra(reply):
        from_user = User.objects.filter(uid=reply.from_uid).first()
        to_user = User.objects.filter(uid=reply.to_uid).first()
        reply_like_num = PraiseReply.objects.filter(reply_id=reply.reply_id).all()
        setattr(reply,'from_uname',from_user.name)
        setattr(reply, 'to_uname', to_user.name)
        setattr(reply, 'reply_like_num', len(reply_like_num))
        if from_user.avatar:
            setattr(reply, 'from_avatar', from_user.avatar)
        return reply

    comment_id = request.GET.get('comment_id')
    replys = Reply.objects.filter(comment_id=comment_id).all()
    replys = list(map(add_extra, replys))
    replys = serializer(replys, datetime_format='string')
    return JsonResponse({'replys':replys})


# 删除回复
def del_reply(request):
    reply_id = request.GET.get('reply_id','')
    replys = Reply.objects.filter(reply_id=reply_id)
    replys.delete()
    return JsonResponse({'result':'success'})


# 点赞回复，取消点赞
def like_reply(request):
    reply_id = request.POST.get('reply_id')
    login_user_id = request.POST.get('login_user_id')
    praise1 = PraiseReply.objects.filter(reply_id=reply_id, uid=login_user_id)
    if praise1:
        praise1.delete()
        return JsonResponse({'result': 'error'})
    praisereply = PraiseReply()
    praisereply.reply_id = reply_id
    praisereply.uid = login_user_id
    praisereply.save()
    return JsonResponse({'result': 'success'})