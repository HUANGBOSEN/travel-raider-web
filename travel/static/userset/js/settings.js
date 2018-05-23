$(".field").on("click",function(){

    var _this = $(this),
        currentFieldUl = _this.find("ul");

    // currentFieldUl.addClass("dn");
    if($(".province").data("value") == 830000 && ($(this).hasClass("city") || $(this).hasClass("area"))){
        return false;
    }

    if(currentFieldUl.hasClass("dn")){

        $('.field>ul').addClass("dn");
        currentFieldUl.removeClass("dn");
        _this.addClass("spread")
    }else{
        currentFieldUl.addClass("dn");
        _this.removeClass("spread")
    }


});


$(".field").on("click","li",function(){

    var _this = $(this),
        _list =  _this.parents("ul"),
        _field =  _this.parents(".field"),
        value = _this.data("value"),
        type = _field.data("type");
    _this.parents("ul").find("li").removeClass("select");
    _this.addClass("select");
    _this.parents("ul").addClass("dn");
    $(".spread").removeClass("spread");
    _field.data("value",value).addClass("color333");
    _field.find("em").text(_this.text());

    return false;
});



