/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */

odoo.define('pos_product_detail.pos_product_detail', function(require){
"use strict";
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var QWeb = core.qweb;
    var touchduration = 500;
    var pos_model = require('point_of_sale.models');
    var SuperProductScreen = screens.ProductScreenWidget.prototype;

    pos_model.load_fields('product.product',['lst_price','standard_price','volume','weight','categ_id']);

    pos_model.load_models({
        model:  'product.fields',
        fields: [],
        loaded: function(self, fields){
            self.db.field_load_check = {};
            self.db.field_data_by_id = {};
            fields.forEach(function(field){
                self.db.field_data_by_id[field.id] = field;
                self.db.field_load_check[field.field_name] = self.config.product_details_data.includes(field.id);
            });
        },
    });

    screens.ProductScreenWidget.include({
        events : _.extend({}, SuperProductScreen.events, {
            'click .pad_tg': 'toggle_pads',
        }),
        toggle_pads:function(){  
            var self = this;
            self.$('.pad_tg').parent().siblings('div').slideToggle();
        }
    });

    screens.OrderWidget.include({
        init: function(parent, options) {
            var self = this;
            this.mouse_down = false;
            this.mouse_down = false;
            this.moved = false;
            this.right_arrangement = false;
            this.timer;
            this._super(parent,options);
            this.line_mousedown_handler = function(event){
                self.line_mousedown(this.orderline, event);
            };
            this.line_mouseup_handler = function(event){                
                self.line_mouseup(this.orderline, event);
            };
            this.line_mousemove_handler = function(event){                
                self.line_mousemove(this.orderline, event);
            };
        },
        touchstart: function(product, x, y) {
            var self = this;
            this.timer = setTimeout(function(){
                if(!self.moved){
                    var inner_html = self.gui.screen_instances.products.product_list_widget.generate_html(product);
                    $('.product-screen').prepend(inner_html);
                    $('#info_tooltip').css("top", (y-50) + 'px');
                    $('#info_tooltip').css("left", (x-3) + 'px');
                    $('#info_tooltip').css("border-top-left-radius", "7%");
                    $(".cross_img_bottom").hide();
                    $('#info_tooltip').slideDown(100);
                    $(".close_button").on("click", function(){
                        $('#info_tooltip').remove();
                    });
                    return;
                }
                else
                    return;
            }, touchduration);
        },
        touchend: function() {
            if (this.timer)
                clearTimeout(this.timer);
        },
        line_mousedown: function(line, event){
            var self = this;
            if(event.which == 1){
                $('#info_tooltip').remove();
                self.moved = false;
                self.mouse_down = true;
                self.touchstart(line.product, event.pageX, event.pageY);
            }
        },
        line_mouseup: function(line, event){
            var self = this;
            self.mouse_down = false;
            self.moved = false;
            self.touchend();
        },
        line_mousemove: function(line, event){
            var self = this;
            if(self.mouse_down)
                self.moved = true;
        },
        render_orderline: function(orderline){
            var self = this;
            var el_node = this._super(orderline);
            el_node.addEventListener('mousedown',this.line_mousedown_handler);
            el_node.addEventListener('mouseup',this.line_mouseup_handler);
            el_node.addEventListener('mousemove',this.line_mousemove_handler);
            return el_node;
        },
    });

    screens.ProductListWidget.include({
        init: function(parent, options) {
            var self = this;
            this._super(parent, options);
            this.mouse_down = false;
            this.moved = false;
            this.right_arrangement = false;
            this.timer;
            this.mousedown_product_handler = function(e){
                if(e.which == 1){
                    $('#info_tooltip').remove();
                    self.right_arrangement = false;
                    self.moved = false;
                    self.mouse_down = true;
                    self.touchstart(this.dataset.productId, e.pageX, e.pageY);
                }
            };
            this.mouseup_product_handler = function(){
                self.mouse_down = false;
                self.moved = false;
                self.touchend();
            };
            this.mousemove_product_handler = function(){
                if(self.mouse_down)
                    self.moved = true;
            };
        },
        adjust_position: function(left, top, adjustment){
            var left_position = parseInt(left, 10);
            var top_position = parseInt(top, 10);
            switch(adjustment){
                case "right":
                    $('#info_tooltip').css("border-radius", "");
                    $('#info_tooltip').css("left", left_position + 10 - $('#info_tooltip').outerWidth(true) + 'px');
                    $('#info_tooltip').css("border-top-right-radius", "7%");
                    self.right_arrangement = true;
                    break;
                case "bottom":
                    $('#info_tooltip').css("border-radius", "");
                    $('#info_tooltip').css("top", top_position - 15 - $('#info_tooltip').outerHeight(true) + 'px');
                    if(self.right_arrangement)
                        $('#info_tooltip').css("border-bottom-right-radius", "7%");
                    else
                        $('#info_tooltip').css("border-bottom-left-radius", "7%");
                    break;
            }
        },
        touchstart: function(product_id, x, y) {
            var self = this;
            this.timer = setTimeout(function(){
                if(!self.moved){
                    this.right_arrangement = false;
                    var product = self.pos.db.get_product_by_id(parseInt(product_id));
                    var inner_html = self.generate_html(product);
                    var max_x = $(".product-list").width();
                    var max_y = $(window).height();
                    $('.product-list-container').prepend(inner_html);

                    // Setting default location
                    $('#info_tooltip').css("top", (y-145) + 'px');
                    $('#info_tooltip').css("left", (x-442) + 'px');
                    $('#info_tooltip').css("border-top-left-radius", "7%");
                    $(".cross_img_top").css("left","-2px").show();
                    $(".cross_img_bottom").css("margin-left","-92%").hide();


                    //Right adjustment
                    var top_right_corner_position = (x-442) + $('#info_tooltip').outerWidth(true);
                    if(top_right_corner_position > max_x){
                        self.adjust_position($('#info_tooltip').css("left"), $('#info_tooltip').css("top"), "right");
                        $(".cross_img_top").css("left","92%").show();
                        $(".cross_img_bottom").css("margin-left","92%").hide();
                    }

                    //Bottom adjustment
                    var bottom_left_corner_position = (y-145) + $('#info_tooltip').outerHeight(true);
                    if(bottom_left_corner_position > (max_y - 145)){
                        self.adjust_position($('#info_tooltip').css("left"), $('#info_tooltip').css("top"), "bottom");
                        $(".cross_img_top").hide();
                        $(".cross_img_bottom").show();
                    }
                    $('#info_tooltip').slideDown(100);
                    $(".close_button").on("click", function(){
                        $('#info_tooltip').remove();
                    });
                    return;
                }
                else
                    return;
            }, touchduration);
        },
        generate_html: function(product){
            var self = this;
            var product_details_html = QWeb.render('ProductDetails', {
                widget: self,
                product: product,
                field_load_check: self.pos.db.field_load_check,
            });
            return product_details_html;
        },
        touchend: function() {
            if (this.timer)
                clearTimeout(this.timer);
        },
        renderElement: function() {
            var el_str  = QWeb.render(this.template, {widget: this});
            var el_node = document.createElement('div');
                el_node.innerHTML = el_str;
                el_node = el_node.childNodes[1];
            if(this.el && this.el.parentNode)
                this.el.parentNode.replaceChild(el_node,this.el);
            this.el = el_node;
            var list_container = el_node.querySelector('.product-list');
            for(var i = 0, len = this.product_list.length; i < len; i++){
                var product_node = this.render_product(this.product_list[i]);
                product_node.addEventListener('click',this.click_product_handler);
                product_node.addEventListener('mousedown',this.mousedown_product_handler);
                product_node.addEventListener('mouseup',this.mouseup_product_handler);
                product_node.addEventListener('mousemove',this.mousemove_product_handler);
                list_container.appendChild(product_node);
            }
            $(".product-list-scroller").scroll(function(event){
                $('#info_tooltip').remove();
            });
            self.max_x = $(".product-list").width();
            self.max_y = $(".product-list").height();
        },
    });
});