# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################
{
  "name"                 :  "POS Product Detail",
  "summary"              :  """The module allows you to see the details of the product on the POS session screen. The user can click and hold on the product image to view the details.""",
  "category"             :  "Point of Sale",
  "version"              :  "1.0",
  "sequence"             :  1,
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "website"              :  "https://store.webkul.com/Odoo-POS-Product-Detail.html",
  "description"          :  """Odoo POS Product Detail
POS product details popup
Product details in hover box
POS product information
Click to see details
POS about product
POS Product specifications
POS click and hold button""",
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=pos_product_detail&custom_url=/pos/auto",
  "depends"              :  ['point_of_sale'],
  "data"                 :  [
                             'security/ir.model.access.csv',
                             'views/template.xml',
                             'data/product_detail.xml',
                             'views/res_config_view.xml',
                            ],
  "demo"                 :  ['data/pos_product_detail_demo.xml'],
  "qweb"                 :  ['static/src/xml/pos_product_detail.xml'],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  39,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}