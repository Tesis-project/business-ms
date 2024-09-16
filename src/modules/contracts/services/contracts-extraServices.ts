
import { Injectable } from "@nestjs/common";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { Currency_Enum } from "@tesis-project/dev-globals/dist/core/interfaces";
import { Vacant_Budget_Costs_I, Vacant_Housing_Enum, Vacant_Housing_I, Vacant_I, Vacant_Transport_Enum, Vacant_Transport_I } from "@tesis-project/dev-globals/dist/modules/business/vacants/interfaces";
import { Artist_Enum } from "@tesis-project/dev-globals/dist/modules/profile/interfaces";
import { Banks_Enum, Payment_Account_I, Payment_Type_Enum, User_I } from "@tesis-project/dev-globals/dist/modules/user/interfaces";
import { Vacant_Ety } from '../../vacants/entities/vacant.entity';
import { Contract_Sign_I } from "@tesis-project/dev-globals/dist/modules/business/contracts/interfaces";


@Injectable()
export class contracts_extraServices {

    _TempoHandler = new TempoHandler();


    constructor(
    ) {

    }

         eliminarAcentos(texto: string) {
  const acentos = {
    'á': 'a',
    'é': 'e',
    'í': 'i',
    'ó': 'o',
    'ú': 'u',
    'Á': 'A',
    'É': 'E',
    'Í': 'I',
    'Ó': 'O',
    'Ú': 'U',
    'ñ': 'n',
    'Ñ': 'N'
  };

  return texto.split('').map(letra => acentos[letra] || letra).join('');
}

    TransformVacantsHelpers_P = (text: string = ''): string => {

        if (text === '') return '-';

        // Services
        if (text === Vacant_Transport_Enum.LAND) return "Terrestre";
        if (text === Vacant_Transport_Enum.AIR) return "Aereo";

        if (text === Vacant_Housing_Enum.APARTMENT) return "Apartamento";
        if (text === Vacant_Housing_Enum.HOTEL) return "Hotel";
        if (text === Vacant_Housing_Enum.HOUSE) return "Casa";
        if (text === Vacant_Housing_Enum.ROOM) return "Habitación";
        if (text === Vacant_Housing_Enum.SHARED) return "Compartido";

        if (text === Payment_Type_Enum.BANK_ACCOUNT) return "Cuenta Bancaria";
        if (text === Payment_Type_Enum.MOBILE_PAYMENT) return "Pago Móvil";

        if (text === Currency_Enum.USD) return "USD";
        if (text === Currency_Enum.BS) return "Bs";


        return text;

    }


    transformBankName_P = (type: Banks_Enum): string => {

        switch (type) {
            case Banks_Enum.BC_BICENTENARIO:
                return "Banco Bicentenario";
            case Banks_Enum.BC_BANESCO:
                return "Banco Banesco";
            case Banks_Enum.BC_TESORO:
                return "Banco Tesoro";
            case Banks_Enum.BC_PROVINCIAL:
                return "Banco Provincial";
            case Banks_Enum.BC_MERCANTIL:
                return "Banco Mercantil";
            case Banks_Enum.BC_VENEZUELA:
                return "Banco de Venezuela";
            default:
                return '';
        }

    }

    transformType_Artists_P = (type: Artist_Enum): string => {

        switch (type) {
            case Artist_Enum.SINGER:
                return "Cantante";
            case Artist_Enum.INSTRUMENTIST:
                return "Instrumentista";
            case Artist_Enum.ORQUESTA_DIRECTOR:
                return "Director de orquesta";
            case Artist_Enum.SCENE_DIRECTOR:
                return "Director de escena";
            default:
                return "Artista";
        }

    }


    set_eventData = (vacant: Vacant_Ety) => {
        // return
        let modeling = [
            [
                {
                    text: [
                        { text: 'Titulo', color: 'grey' }, `: ${vacant.title}`
                    ],
                    style: 'textTable',
                    bold: true
                },
            ],
        ]

        if (vacant.role_type && vacant.role_type.length > 0) {

            let aux_text: string = '';

            for (const [i, element] of vacant.role_type.entries()) {

                const role = this.transformType_Artists_P(element as any)
                aux_text += (i > 0 ? ', ' : '') + role;

            }

            modeling.push([
                {
                    text: [
                        { text: 'Rol(es)', color: 'grey' }, `: ${aux_text}`
                    ],
                    style: 'textTable',
                    bold: true
                }
            ]);

        }

        if (vacant.operation.start_at === vacant.operation.end_at) {

            modeling.push(
                [
                    {
                        text: [
                            { text: 'Fecha', color: 'grey' }, `: ${this._TempoHandler.date_short(vacant.operation.start_at as any)}`
                        ],
                        style: 'textTable',
                        bold: true
                    }
                ],
            )

        } else {

            modeling.push(
                [
                    {
                        text: [
                            { text: 'A partir de', color: 'grey' }, `: ${this._TempoHandler.date_short(vacant.operation.start_at as any)}`
                        ],
                        style: 'textTable',
                        bold: true
                    }
                ],
                [
                    {
                        text: [
                            { text: 'Hasta', color: 'grey' }, `: ${this._TempoHandler.date_short(vacant.operation.end_at as any)}`
                        ],
                        style: 'textTable',
                        bold: true
                    }
                ],
            )

        }

        return modeling;

    }

    set_userSign(user: Contract_Sign_I) {

        let modeling = [];

        if (user.signed === false) {

            modeling = [
                [
                    {
                        text: [
                            {
                                text: '--sg_art--',
                                alignment: 'center',
                                style: 'sign_document',
                                color: 'white',
                            },
                            '\n',
                            {
                                text: '{{- signed_at_artist -}}',
                                alignment: 'center',
                                style: 'smallTagText',
                                color: 'white'
                            }
                        ]
                    },
                ],
            ];

        } else {

            const aux_user = user.user as User_I;

            modeling = [
                [
                    {
                        text: [
                            {
                                text: this.eliminarAcentos(aux_user.name) + ' ' + this.eliminarAcentos(aux_user.last_name),
                                alignment: 'center',
                                style: 'sign_document',
                            },
                            '\n',
                            {
                                text: this._TempoHandler.date_short(user.signed_at as any),
                                alignment: 'center',
                                style: 'smallTagText',
                            }
                        ]
                    },
                ],
            ]

        }

        return modeling;

    }

    set_vacantPayment = (vacant: Vacant_Ety) => {

        let aux_pay: string = String(vacant.vacant_payment.total) + this.TransformVacantsHelpers_P(vacant.vacant_payment.currency);
        return aux_pay;

    }

    addFeature(type: string, contain: string) {

        if (type == 'text') {

            return {
                text: [
                    `${contain}`,
                ],
                style: 'textTable',
                bold: true
            }

        }
        if (type == 'textBox') {

            return {
                text: [
                    contain,
                ],
                style: 'textTable',
                bold: true,
                margin: [5, 5, 5, 0],
                fillColor: '#ebebeb',
            }

        }

    }

    set_paymentDetail(payment_info: Payment_Account_I) {

        let modeling_payment = [
            [
                {
                    text: [
                        { text: 'Tipo de pago', color: 'grey' }, `: ${this.TransformVacantsHelpers_P(payment_info.type)}`
                    ],
                    style: 'textTable',
                    bold: true
                },
            ],
            [
                {
                    text: [
                        { text: 'Titular de la Cuenta', color: 'grey' }, `: ${payment_info.titular}`
                    ],
                    style: 'textTable',
                    bold: true
                },
            ],
            [
                {
                    text: [
                        { text: 'Banco', color: 'grey' }, `: ${this.transformBankName_P(payment_info.bank_name)}`
                    ],
                    style: 'textTable',
                    bold: true
                }
            ],
            [
                {
                    text: [
                        { text: 'Cédula', color: 'grey' }, `: ${payment_info.person_id}`
                    ],
                    style: 'textTable',
                    bold: true
                }
            ],

        ];

        if (payment_info.type === Payment_Type_Enum.BANK_ACCOUNT) {

            modeling_payment.push(
                [
                    {
                        text: [
                            { text: 'Número de Cuenta', color: 'grey' }, `: ${payment_info.number}`
                        ],
                        style: 'textTable',
                        bold: true
                    }
                ],
            )

        }

        if (payment_info.type === Payment_Type_Enum.MOBILE_PAYMENT) {

            modeling_payment.push(
                [
                    {
                        text: [
                            { text: 'Número de Teléfono', color: 'grey' }, `: ${payment_info.phone}`
                        ],
                        style: 'textTable',
                        bold: true
                    }
                ],
            )
        }

        return modeling_payment;

    }

    setting_services(services_transport: Vacant_Transport_I, services_housing: Vacant_Housing_I, services_costs: Vacant_Budget_Costs_I) {

        let modeling_transport = {
            widths: [],
            body: []
        }
        let modeling_housing = {
            widths: [],
            body: []
        }
        let modeling_practices = {
            widths: [],
            body: []
        }

        if (services_housing) {
            let aux_body = [];
            let aux_widths = [];

            aux_body.push(
                this.addFeature('text', 'Hospedaje:')
            );
            aux_widths.push('auto');

            if (services_housing.enable == true) {

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', 'Si')
                );

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('text', 'Tipo:')
                );
                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', this.TransformVacantsHelpers_P(services_housing.type))
                );

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('text', 'Descripción:')
                );
                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', services_housing.desc)
                );

            } else {
                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', 'N/A')
                );
            }

            modeling_housing = {
                body: aux_body,
                widths: aux_widths
            }

        }

        if (services_costs) {
            let aux_body = [];
            let aux_widths = [];

            aux_body.push(
                this.addFeature('text', 'Costos viáticos:')
            );
            aux_widths.push('auto');

            if (services_costs.enable == true) {

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', 'Si')
                );

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('text', 'Descripción:')
                );
                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', services_costs.desc)
                );

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('text', 'Total:')
                );
                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', String(services_costs.total) + ' ' + this.TransformVacantsHelpers_P(services_costs.currency))
                );

            } else {

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', 'N/A')
                );

            }

            modeling_practices = {
                body: aux_body,
                widths: aux_widths
            }

        }
        if (services_transport) {
            let aux_body = [];
            let aux_widths = [];

            aux_body.push(
                this.addFeature('text', 'Transporte:')
            );
            aux_widths.push('auto');

            if (services_transport.enable == true) {

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', 'Si')
                );

                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('text', 'Tipo:')
                );
                aux_widths.push('auto');
                aux_body.push(
                    this.addFeature('textBox', this.TransformVacantsHelpers_P(services_transport.type))
                );


                if (services_transport.desc != '') {

                    aux_widths.push('auto');
                    aux_body.push(
                        this.addFeature('text', 'Descripción:')
                    );

                    aux_widths.push('auto');
                    aux_body.push(
                        this.addFeature('textBox', services_transport.desc)
                    );

                }

            } else {
                aux_widths.push('auto');
                aux_body.push(
                    {
                        text: [
                            'N/A',
                        ],
                        style: 'textTable',
                        bold: true,
                        margin: [5, 5, 5, 0],
                        fillColor: '#ebebeb',
                    }
                );
            }

            modeling_transport = {
                body: aux_body,
                widths: aux_widths
            }

        }

        return {
            modeling_transport,
            modeling_housing,
            modeling_practices
        }

    }

}