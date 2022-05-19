# -*- coding: utf-8 -*-
#################################################################################
#
#   Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>)
#   See LICENSE file for full copyright and licensing details.
#   License URL : <https://store.webkul.com/license.html/>
#
#################################################################################

from odoo import api, fields, models, _
from odoo.exceptions import Warning
import logging
_logger = logging.getLogger(__name__)

class PosConfig(models.Model):
    _inherit = 'pos.config'
    product_details_data = fields.Many2many("product.fields", "pods_config_product_settings_relation", "pos_config_id", "product_setings_id", string="POS Product Detail", compute='_get_config_settings')

    @api.multi
    def _get_config_settings(self):
        IrDefault = self.env['ir.default'].sudo()
        product_details_data = IrDefault.get('res.config.settings', "product_details_data")
        for obj in self:
            obj.product_details_data = product_details_data

    @api.model
    def demo_default_product_details_data(self):
        product_details_data_ids = self.product_details_data.search([]).ids
        #--Dumping config objects--#
        res_config_objs=self.env['res.config.settings'].create({
            'product_details_data':[(6,0,product_details_data_ids)]
        })
        res_config_objs.execute()

class ProductFields(models.Model):
    _name = 'product.fields'
    _rec_name = 'field_string'

    field_name = fields.Char("Field Name")
    field_string = fields.Char("Field Label")
    field_type = fields.Char("Field Type")

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    product_details_data = fields.Many2many("product.fields", "product_details_settings_relation", "product_details_settings_id", "product_fields_id", string="POS Product Detail")

    @api.multi
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        IrDefault = self.env['ir.default'].sudo()
        IrDefault.set('res.config.settings', "product_details_data", self.product_details_data and self.product_details_data.ids or False)

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        IrDefault = self.env['ir.default'].sudo()
        product_details_data = IrDefault.get('res.config.settings', "product_details_data")
        res.update(
            product_details_data = product_details_data or False,
        )
        return res