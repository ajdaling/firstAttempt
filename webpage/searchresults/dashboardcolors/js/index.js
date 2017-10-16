"use strict";
ko.bindingHandlers.sparkline = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        value = value();
        console.log(value);
        if (value) {
            var setMuteClass = false;
            if (!value.length) {
                setMuteClass = true;
                value = [1, 1];
            }
            var w = $(element).width(), h = $(element).height(), padding = 1;
            h = h - (padding * 2);
            //w = w - (padding * 2);
            var yWind = d3.scale.linear().domain([d3.min(value), d3.max(value)]).range([0, h]), x = d3.scale.linear().domain([0, value.length - 1]).range([0, w]);
            var vis = d3.select(element)
                .html("")
                .append("svg:svg")
                .attr("width", w + (padding * 2))
                .attr("height", h + (padding * 2));
            var g = vis.append("svg:g")
                .attr("transform", "translate(0, " + h + ")");
            var lineWind = d3.svg.line()
                .x(function (d, i) { return x(i); })
                .y(function (d) { return -1 * yWind(d); });
            if (setMuteClass == true) {
                g.append("svg:path").attr("d", lineWind(value)).attr("class", "muted");
            }
            else {
                g.append("svg:path").attr("d", lineWind(value));
            }
        }
    }
};
var elmah;
(function (elmah) {
    var log = (function () {
        function log() {
            var _this = this;
            this.Id = ko.observable(1);
            this.Name = ko.observable('Elmah.io');
            this.Color = ko.observable('Orange');
            this.Access = ko.observable('Administrator');
            this.DailyDigestEmail = ko.observable(false);
            this.NewErrorEmail = ko.observable(false);
            this.editing = ko.observable(false);
            this.css = ko.computed(function () { return _this.editing() ? 'flipped' : ''; });
            this.colorStyle = ko.computed(function () { return _this.Color().toLowerCase() + '-bg'; });
            this.sparklinedata = ko.observableArray([0, 1, 2, 5, 4, 2, 0, 1, 0, 0, 0, 0, 2, 3, 5, 8, 4, 4, 3, 1, 1, 0, 0, 0]);
        }
        return log;
    }());
    elmah.log = log;
    var dashboard = (function () {
        function dashboard() {
            var _this = this;
            this.logs = ko.observableArray();
            this.selectColor = function (n, t) {
                n.Color($(t.target).attr("class").replace("-bg", "").replace("-", ""));
            };
            this.editLog = function (obj) {
                _this.logs().forEach(function (obj) { obj.editing(false); });
                obj.editing(true);
            };
            this.saveLog = function (obj) {
                obj.editing(false);
            };
            this.logs.push(new elmah.log());
            this.logs.push(new elmah.log());
            this.logs.push(new elmah.log());
            this.logs()[0].Color('green');
            this.logs()[1].Color('lightgreen');
            this.logs()[2].Color('lime');
            this.logs()[1].Name('Codepen.io');
            this.logs()[2].Name('Google.dk');
        }
        return dashboard;
    }());
    elmah.dashboard = dashboard;
})(elmah || (elmah = {}));
var vm = new elmah.dashboard();
ko.applyBindings(vm);
$(function () {
    $('[data-toggle="popover"]').popover();
});
$(".user-switch").tooltip();
$(".user-switch").on('click', function () {
    $(this).toggleClass("selected");
});
// run demo if in searchresult preview
function demo() {
    setTimeout(function () {
        $(".log-box").eq(2).addClass('flipped');
    }, 1000);
}
$(document).ready(function () {
    if (document.location.pathname.indexOf('fullcpgrid') > -1) {
        demo();
    }
});