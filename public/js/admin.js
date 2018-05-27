$(function () {
    $(".delete").on("click", function (event) {
        var $target = $(event.target);
        var id = $target.data("id");
        var $tr = $(".item-id-" + id);
        $.ajax({
            type: "DELETE",
            url: "/admin/movie/list?id=" + id,
        }).done(function (results) {
            if (results.success === 1) {
                if ($tr.length > 0)  $tr.remove();
            }
        });
    });
    $("#douban").blur(function () {
        var id = $(this).val();
        if (id) {
            $.ajax({
                url: "http://api.douban.com/v2/movie/subject/" + id,
                cache: true,
                dataType: "jsonp",
                crossDomain: true,
                jsonp: "callback"
            }).done(function (film) {
                $("#input-title").val(film.title);
                $("#input-director").val(film.directors[0].name);
                $("#input-country").val(film.countries[0]);
                $("#input-poster").val(film.images.large);
                $("#input-year").val(film.year);
                $("#input-summary").val(film.summary);
            });
        }
    });
});
