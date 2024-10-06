import { Injectable } from "@nestjs/common";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import uniqid from 'uniqid';
import { contracts_extraServices } from "./contracts-extraServices";
import { Contract_Ety } from "../entities/contract.entity";
import { User_HiringData_I, User_I } from "@tesis-project/dev-globals/dist/modules/user/interfaces";
import { Meta_Contratist_I, MetaRole_I, Profile_I } from "@tesis-project/dev-globals/dist/modules/profile/interfaces";

@Injectable()
export class ContractsHelpersService {

    stylesContract: any = {
        principal: {
            fontSize: 14,
            bold: true,
            alignment: 'right',
            margin: [0, 0, 0, 10],

        },
        subTitle: {
            fontSize: 12,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10]
        },
        sign_document: {
            fontSize: 25,
            alignment: 'center',
            margin: [0, 0, 0, -10],
            font: 'tuesday'
        },
        thirdTitle: {
            fontSize: 9,
            bold: true,
            alignment: 'left',
            margin: [0, 0, 0, 13]
        },
        text: {
            fontSize: 8,
            alignment: 'left',
            margin: [0, 0, 0, 25],
            lineHeight: '1'
        },
        textTable: {
            fontSize: 8,
            alignment: 'left',
            margin: [0, 5, 0, 0.5],
            lineHeight: '1'
        },
        list: {
            fontSize: 7,
            alignment: 'left',
            margin: [0, 0, 0, 7]
        },
        smallTagText: {
            fontSize: 7,
            margin: [0, 0, 0, 5]
        },
        bold: {
            bold: true
        },
        colorRed: {
            color: 'red'
        }
    };

    watermark: { text: 'Melodify App', color: 'blue', opacity: 0.125, bold: true, italics: false };

    _TempoHandler = new TempoHandler();

    constructor(
        private readonly _contracts_extraServices: contracts_extraServices
    ) {

    }

    line() {
        //Usually one would use a canvas to draw the line
        //{canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }],margin: [ 0, 10, 0, 0 ]},
        //For some reason, that's not working and the layout just breaks
        return {
            table: {
                headerRows: 1,
                widths: ['100%'],
                body: [
                    [''],
                    ['']
                ]
            },
            layout: 'headerLineOnly'
        }
    }


    async getModel(contract: Contract_Ety, contratist_id: string = null): Promise<_Response_I> {

        let _Response: _Response_I;

        let numberContractId: string = uniqid('mld-', '-' + new TempoHandler().date_now());

        const vacant = contract.vacant;

        let setting_services = await this._contracts_extraServices.setting_services(
            vacant.transport_service,
            vacant.housing_service,
            vacant.vacant_costs,
        );

        const modeling_transport = setting_services.modeling_transport;
        const modeling_housing = setting_services.modeling_housing;
        const modeling_practices = setting_services.modeling_practices;

        const modeling_payment = await this._contracts_extraServices.set_paymentDetail(contract.details.payment_info);

        const user_contratist = contract.contratist.user as User_I;
        const user_contractor = contract.contractor.user as User_I;

        const hiring_data_contractor = user_contractor.hiring_data as User_HiringData_I;

        const profile_contratist = user_contratist.profile as Profile_I;

        const meta_contratist = (profile_contratist.meta as MetaRole_I).meta_contratist as Meta_Contratist_I;

        const personal_contractor = hiring_data_contractor.personal;

        const eventData = await this._contracts_extraServices.set_eventData(vacant);

        const vacant_payment = await this._contracts_extraServices.set_vacantPayment(vacant);

        const contratist_sign = await this._contracts_extraServices.set_userSign(contract.contratist);
        const contractor_sign = await this._contracts_extraServices.set_userSign(contract.contractor);

        const set_contratistData = () => {
            return {
                contratistName: `${user_contratist.name || ''} ${user_contratist.last_name || ''}`,
                institueName: meta_contratist.institutes_companies.name || '',
                rif: meta_contratist.institutes_companies.rif_nif || '',
                direction: meta_contratist.institutes_companies.direction
            }
        }
        const set_contractorData = () => {
            return {
                artistName: (personal_contractor.social_reason) ? personal_contractor.social_reason : `${user_contractor.name || ''} ${user_contractor.last_name || ''}`,
                rif: personal_contractor.rif,
                direction: {
                    addres: personal_contractor.address,
                    city: personal_contractor.city,
                    state: personal_contractor.state
                }
            }
        }

        let content = [
            // {
            //     alignment: 'justify',
            //     margin: [0, 0, 0, 5],
            //     columns: [
            //         // {
            //         //     image: images.logoWam,
            //         //     width: 100
            //         // },
            //         {
            //             text: [
            //                 // "Melodify App"
            //             ],
            //             style: 'text',
            //             alignment: 'right',
            //         },
            //         {
            //             width: 'auto',
            //             alignment: 'right',
            //             qr: numberContractId, fit: 72.5
            //         }

            //     ]
            // },
            {
                text: 'MELODIFY APP | CONTRATO DE TRABAJO',
                style: 'principal',
                alignment: 'left',
                margin: [0, 0, 0, 5]
            },
            this.line(),
            {
                text: [
                    { text: '1 - ACUERDO:', color: 'red' }, ` Acuerdo realizado el día ${this._TempoHandler.date_short(contract.created_at)} por y entre`,
                ],
                style: 'thirdTitle',
                margin: [0, 10, 0, 5]
            },
            {
                alignment: 'justify',
                margin: [0, 0, 0, 10],
                columns: [
                    {
                        width: '45%',

                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    {
                                        text: [
                                            `${user_contratist.name || ''} ${user_contratist.last_name || ''}`
                                        ],
                                        style: 'textTable',
                                        bold: true
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            set_contratistData().institueName,
                                        ],
                                        style: 'textTable',
                                        bold: true
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            `RIF o NIF: ${set_contratistData().rif}`,
                                        ],
                                        style: 'textTable',
                                        color: 'grey'
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            `${set_contratistData().direction.address}, ${set_contratistData().direction.city}`,
                                        ],
                                        style: 'textTable',
                                        color: 'grey'
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            `${set_contratistData().direction.state}`,
                                        ],
                                        style: 'textTable',
                                        color: 'grey'
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            'En lo sucesivo ', { text: '“EMPLEADOR/A” ', bold: true }
                                        ],
                                        style: 'textTable',
                                        alignment: 'center'

                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i, node) {
                                return 'black';
                            },
                            vLineColor: function (i, node) {
                                return 'black';
                            },
                            hLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return null;
                                }
                                return { dash: { length: 3, space: 2 } };
                            },
                            vLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.widths.length) {
                                    return null;
                                }
                                return { dash: { length: 5 } };
                            },

                        }
                    },
                    {
                        width: '10%',
                        qr: numberContractId, fit: 70, alignment: 'center', margin: [0, 25]
                    },
                    {
                        width: '45%',

                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    {
                                        text: [
                                            set_contractorData().artistName
                                        ],
                                        style: 'textTable',
                                        bold: true
                                    }
                                ],

                                [
                                    {
                                        text: [
                                            `Cédula o RIF: ${set_contractorData().rif}`
                                        ],
                                        style: 'textTable',
                                        color: 'grey'
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            `${set_contractorData().direction.addres}, ${set_contractorData().direction.city}`
                                        ],
                                        style: 'textTable',
                                        color: 'grey'
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            set_contractorData().direction.state
                                        ],
                                        style: 'textTable',
                                        color: 'grey'
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            'En lo sucesivo ', { text: '“ARTISTA” ', bold: true }
                                        ],
                                        style: 'textTable',
                                        alignment: 'center'

                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i, node) {
                                return 'black';
                            },
                            vLineColor: function (i, node) {
                                return 'black';
                            },
                            hLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return null;
                                }
                                return { dash: { length: 3, space: 2 } };
                            },
                            vLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.widths.length) {
                                    return null;
                                }
                                return { dash: { length: 5 } };
                            },

                        }
                    },

                ],

            },
            {
                text: [
                    { text: '2 - OBJETO:', color: 'red' },
                    ' El EMPLEADOR le contrata al ARTISTA a prestar servicios en:',
                ],
                style: 'thirdTitle',
                margin: [0, 0, 0, 5]
            },
            {
                alignment: 'justify',
                margin: [10, 0, 0, 15],
                columns: [
                    {
                        width: '42.5%',

                        table: {
                            widths: ['*'],
                            body: [
                                ...eventData

                            ]
                        },
                        layout: {

                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                            },
                            hLineColor: function (i, node) {
                                return 'black';
                            },
                            vLineColor: function (i, node) {
                                return 'black';
                            },
                            hLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return null;
                                }
                                return { dash: { length: 3, space: 2 } };
                            },
                            vLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.widths.length) {
                                    return null;
                                }
                                return { dash: { length: 5 } };
                            },

                        }
                    },

                ]
            },
            {
                text: [
                    { text: '3 - CONTRAPRESTACION: ', color: 'red', bold: true, style: "thirdTitle" },
                    'El EMPLEADOR acuerda pagar al ARTISTA: ',
                    { text: vacant_payment, bold: true, decoration: 'underline' },
                    { text: ' por la relación contractual realizada.', bold: true },
                ],
                style: 'text',
                bold: false,
                margin: [0, -7.5, 0, 5]
            },
            {
                text: [
                    { text: '3-1 Pagos extras - viajes, estadía, costos viáticos: ', color: 'red', bold: true },
                    'El EMPLEADOR acuerda con el ARTISTA',

                ],
                style: 'thirdTitle',
                bold: false,
                margin: [10, 0, 0, 0]
            },
            {
                alignment: 'justify',
                margin: [15, 5, 0, 0],
                table: {
                    widths: modeling_transport.widths,
                    body: [
                        modeling_transport.body
                    ]

                },
                layout: 'noBorders'


            },
            {
                alignment: 'justify',
                margin: [15, 5, 0, 0],
                table: {
                    widths: modeling_housing.widths,
                    body: [
                        modeling_housing.body
                    ]

                },
                layout: 'noBorders'


            },
            {
                alignment: 'justify',
                margin: [15, 5, 0, 0],
                table: {
                    widths: modeling_practices.widths,
                    body: [
                        modeling_practices.body
                    ]

                },
                layout: 'noBorders'
            },
            {
                text: [
                    { text: '3-2 Forma de pago: ', color: 'red', bold: true },
                    'El pago de lo acordado se realizará en los próximos días de concluida la relación contractual entre las partes.',

                ],
                style: 'thirdTitle',
                bold: false,
                margin: [10, 10, 0, 5]
            },
            {
                text: [
                    { text: '3-3 Detalle para el pago: ', color: 'red', bold: true }
                ],
                style: 'thirdTitle',
                bold: false,
                margin: [10, 10, 0, 5]
            },
            {
                alignment: 'justify',
                margin: [15, 5, 0, 5],
                pageBreak: 'after',
                columns: [
                    {
                        width: '42.5%',
                        table: {
                            widths: ['*'],
                            body: [
                                ...modeling_payment
                            ]
                        },
                        layout: {

                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 0;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 0 : 0;
                            },
                            hLineColor: function (i, node) {
                                return 'black';
                            },
                            vLineColor: function (i, node) {
                                return 'black';
                            },
                            hLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return null;
                                }
                                return { dash: { length: 3, space: 2 } };
                            },
                            vLineStyle: function (i, node) {
                                if (i === 0 || i === node.table.widths.length) {
                                    return null;
                                }
                                return { dash: { length: 5 } };
                            },
                        }
                    },

                ]
            },
            {
                alignment: 'justify',
                margin: [0, 5, 0, 0],
                layout: 'noBorders',
                table: {
                    widths: ['auto', 'auto'],
                    heights: 5,
                    body: [
                        [
                            {
                                text: [
                                    'X',
                                ],
                                style: 'textTable',
                                bold: true,
                                margin: [10, 5, 5, 10],
                                fillColor: '#ebebeb',
                                lineHeight: 0.1


                            },
                            {
                                text: [
                                    'Este Acuerdo abarca el entendimiento completo entre las partes con respecto a los derechos y obligaciones aquí contemplados, y reemplaza todos los entendimientos anteriores, escritos u orales, con respecto a los mismos.',
                                ],
                                style: 'text',
                                margin: [2.5, 2.5, 0, 2.5],
                                lineHeight: 1
                            },
                        ]
                    ]
                }
            },
            {
                alignment: 'justify',
                margin: [0, 5, 0, 0],
                layout: 'noBorders',
                table: {
                    widths: ['auto', 'auto'],
                    heights: 5,
                    body: [
                        [
                            {
                                text: [
                                    'X',
                                ],
                                style: 'textTable',
                                bold: true,
                                margin: [10, 5, 5, 10],
                                fillColor: '#ebebeb',
                                lineHeight: 0.1


                            },
                            {
                                text: [
                                    'Este Acuerdo no puede ser alterado ni modificado, y es Intransferible.'
                                ],
                                style: 'text',
                                margin: [2.5, 5, 0, 5],
                                lineHeight: 1
                            },
                        ]
                    ]
                }
            },

            {
                alignment: 'justify',
                margin: [0, 5, 0, 0],
                layout: 'noBorders',
                table: {
                    widths: ['auto', 'auto'],
                    heights: 5,
                    body: [
                        [
                            {
                                text: [
                                    'X',
                                ],
                                style: 'textTable',
                                bold: true,
                                margin: [10, 5, 5, 10],
                                fillColor: '#ebebeb',
                                lineHeight: 0.1


                            },
                            {
                                text: [
                                    'Es parte de este Acuerdo el ',
                                    {
                                        text: 'Anexo "Términos y Condiciones – Clausulas de contratación”.',
                                        bold: true
                                    }
                                ],
                                style: 'text',
                                margin: [2.5, 5, 0, 5],
                                lineHeight: 1
                            },
                        ]
                    ]
                }
            },
            {
                alignment: 'justify',
                margin: [0, 15, 0, 15],
                table: {
                    widths: ['auto'],
                    body: [
                        [
                            {
                                text: [
                                    {
                                        text: 'LA OFERTA PRESENTADA EN ESTE CONTRATO TIENE UNA VALIDEZ DE 15 DÍAS PARA SU FIRMA.\n',
                                        bold: true,
                                        style: 'thirdTitle',
                                        alignment: 'center'
                                    },
                                    // 'SI EL CONTRATO NO ES FIRMADO POR EL ARTISTA Y DEVUELTO AL CONTRATISTA DENTRO DE LOS 10 DÍAS ', 'POSTERIORES A LA FECHA DE EMISIÓN, SERA REVOCADO'

                                ],
                                style: 'thirdTitle',
                                lineHeight: 1,
                                bold: false,
                                alignment: 'center',
                                margin: [0, 5, 0, 5],
                            },
                        ]
                    ]
                }
            },
            {
                text: 'El presente Acuerdo con sus Términos y condiciones – Cláusulas de contratación queda aceptado con las siguientes firmas',
                style: 'text',
                bold: true,
            },
            {
                alignment: 'justify',
                margin: [0, -5, 0, -5],
                columns: [
                    {
                        layout: 'noBorders',
                        width: '*',
                        alignment: 'top',
                        table: {
                            widths: [200],
                            body: [
                                // [
                                //     {
                                //         text: [
                                //             {
                                //                 text: `${user_contratist.name} ${user_contratist.last_name}`,
                                //                 alignment: 'center',
                                //                 style: 'sign_document'
                                //                 // color: 'white',
                                //             },
                                //             '\n',
                                //             {
                                //                 text: this._TempoHandler.date_short(contract.contratist.signed_at as any),
                                //                 style: 'smallTagText',
                                //                 alignment: 'center',
                                //                 // color: 'white'
                                //             }
                                //         ]
                                //     },
                                // ],
                                [
                                    ...contratist_sign
                                ],
                                [
                                    this.line()
                                ],
                                [
                                    {
                                        text: `${user_contratist.name} ${user_contratist.last_name}`,
                                        alignment: 'center',
                                        style: 'text',
                                    },
                                ],
                            ]
                        }
                    },
                    {
                        layout: 'noBorders',
                        width: '*',
                        margin: [50, 0, 0, 0],
                        alignment: 'top',
                        table: {
                            widths: [200],
                            body: [
                                // [
                                //     {
                                //         text: [
                                //             {
                                //                 text: '--sg_art--',
                                //                 alignment: 'center',
                                //                 style: 'sign_document',
                                //                 color: 'white',
                                //             },
                                //             '\n',
                                //             {
                                //                 text: '{{- signed_at_artist -}}',
                                //                 alignment: 'center',
                                //                 style: 'smallTagText',
                                //                 color: 'white'
                                //             }
                                //         ]
                                //     },
                                // ],
                                [...contractor_sign],
                                [
                                    this.line()
                                ],
                                [
                                    {
                                        text: `${user_contractor.name} ${user_contractor.last_name}`,
                                        alignment: 'center',
                                        style: 'text',
                                    },
                                ],
                            ]
                        }
                    },


                ]
            },

            {
                text: 'Términos y condiciones – Cláusulas de contratación',
                style: 'subTitle',
                bold: true,
                alignment: 'center'
            },
            {
                text: [
                    {
                        text: '1. RECONOCIMIENTO:',
                        bold: true,
                        style: 'thirdTitle'
                    },
                    `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi quis quos quod voluptates, et iste optio aliquid nulla. Modi deserunt esse dignissimos iusto ipsum fuga dolore aperiam aliquam excepturi est.Modi veritatis optio, tenetur dolor necessitatibus omnis amet architecto quasi porro et expedita sint cum? Labore illum nesciunt autem eius, facilis beatae? Ut consequuntur corporis obcaecati, error dicta fugit maiores.Recusandae, sed rerum? Dignissimos non veritatis a rem excepturi blanditiis possimus totam obcaecati incidunt officiis tempora veniam inventore ipsum qui, aperiam sequi harum. Nisi ratione unde quam mollitia, doloremque corrupti.Quod quidem nobis tempore fugiat adipisci consequuntur, vero labore architecto incidunt cumque non eaque nostrum laudantium ut molestias, hic inventore maiores. Iusto doloribus quaerat asperiores aliquam cupiditate nesciunt quas quo.Quis temporibus, qui numquam debitis dolores repudiandae nam necessitatibus esse assumenda. Sit dolores aliquid iusto eos, porro error, deleniti maiores qui fugit animi molestiae ab exercitationem. Atque hic culpa ipsam?Facilis nobis accusantium natus commodi, veritatis blanditiis iusto asperiores voluptatem ex, porro dolore vitae, repudiandae dolor alias nostrum sit id consequuntur odit ducimus! Minus, necessitatibus aliquid animi reprehenderit quos esse!Voluptas eveniet omnis atque vero nesciunt aut aspernatur qui doloremque fuga assumenda eius obcaecati unde magnam eum repellendus voluptatibus dolor pariatur molestias nulla repudiandae esse eligendi, tenetur dolorum nisi. Iusto.Error, illo ex. Laudantium quis quisquam facilis necessitatibus, soluta minus aliquid harum nam in ratione quod atque sint porro eveniet, vero aspernatur consequatur! Sapiente, eaque odit! Aliquam dicta illo ex? Blanditiis mollitia, sequi tempora quibusdam ducimus laborum? Doloremque ut quia adipisci suscipit delectus quibusdam dolor numquam magni corporis esse fugiat, et nihil at ad rem quisquam unde recusandae minima voluptatem?Nostrum quo necessitatibus voluptates perferendis officiis minima fuga maiores reprehenderit blanditiis, ducimus dolores nesciunt inventore repellendus debitis, reiciendis eaque iure architecto numquam veniam. Odit adipisci atque unde odio! Nostrum, harum.`
                ],
                bold: false,
                style: 'text'
            },
            {
                text: [
                    {
                        text: '2. DERECHOS DE AUTOR y OTROS DERECHOS EXCLUSIVOS: ',
                        bold: true,
                        style: 'thirdTitle'
                    },
                    `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi quis quos quod voluptates, et iste optio aliquid nulla. Modi deserunt esse dignissimos iusto ipsum fuga dolore aperiam aliquam excepturi est.Modi veritatis optio, tenetur dolor necessitatibus omnis amet architecto quasi porro et expedita sint cum? Labore illum nesciunt autem eius, facilis beatae? Ut consequuntur corporis obcaecati, error dicta fugit maiores.Recusandae, sed rerum? Dignissimos non veritatis a rem excepturi blanditiis possimus totam obcaecati incidunt officiis tempora veniam inventore ipsum qui, aperiam sequi harum. Nisi ratione unde quam mollitia, doloremque corrupti.Quod quidem nobis tempore fugiat adipisci consequuntur, vero labore architecto incidunt cumque non eaque nostrum laudantium ut molestias, hic inventore maiores. Iusto doloribus quaerat asperiores aliquam cupiditate nesciunt quas quo.Quis temporibus, qui numquam debitis dolores repudiandae nam necessitatibus esse assumenda. Sit dolores aliquid iusto eos, porro error, deleniti maiores qui fugit animi molestiae ab exercitationem. Atque hic culpa ipsam?Facilis nobis accusantium natus commodi, veritatis blanditiis iusto asperiores voluptatem ex, porro dolore vitae, repudiandae dolor alias nostrum sit id consequuntur odit ducimus! Minus, necessitatibus aliquid animi reprehenderit quos esse!Voluptas eveniet omnis atque vero nesciunt aut aspernatur qui doloremque fuga assumenda eius obcaecati unde magnam eum repellendus voluptatibus dolor pariatur molestias nulla repudiandae esse eligendi, tenetur dolorum nisi. Iusto.Error, illo ex. Laudantium quis quisquam facilis necessitatibus, soluta minus aliquid harum nam in ratione quod atque sint porro eveniet, vero aspernatur consequatur! Sapiente, eaque odit! Aliquam dicta illo ex? Blanditiis mollitia, sequi tempora quibusdam ducimus laborum? Doloremque ut quia adipisci suscipit delectus quibusdam dolor numquam magni corporis esse fugiat, et nihil at ad rem quisquam unde recusandae minima voluptatem?Nostrum quo necessitatibus voluptates perferendis officiis minima fuga maiores reprehenderit blanditiis, ducimus dolores nesciunt inventore repellendus debitis, reiciendis eaque iure architecto numquam veniam. Odit adipisci atque unde odio! Nostrum, harum.`
                ],
                bold: false,
                style: 'text'
            },
            {
                text: [
                    {
                        text: 'CONFIDENCIALIDAD: ',
                        bold: true,
                        style: 'thirdTitle'
                    },
                    'Queda prohibida toda reproducción, presentación, difusión y comentarios del contenido y acuerdo de este contrato, fuera de las partes, que no sea sus responsables y/o asesores legales.'
                ],
                bold: false,
                style: 'text'
            },
            {
                text: [
                    {
                        text: 'INCUMPLIMIENTO: ',
                        bold: true,
                        style: 'thirdTitle'
                    },
                    'El incumpliendo por cualquiera de las partes de alguno de lo expuesto en este contrato, es motivo de disolución de este acuerdo.'
                ],
                bold: false,
                style: 'text'
            },
            {
                text: [
                    {
                        text: 'REPROGRAMACIÓN y CANCELACIÓN: ',
                        bold: true,
                        style: 'thirdTitle'
                    },
                    'En caso de cancelación por caso fortuito, se deberá buscar una alternativa de fechas por ambas partes. De no ser posible cada parte asumirá los riesgos sin tener nada más que reclamar a la otra parte.'
                ],
                bold: false,
                style: 'text'
            },
            {
                text: [
                    {
                        text: 'ANEXO ESPECIAL - CONDICIONES ESPECÍFICAS: ',
                        bold: true,
                        style: 'thirdTitle'
                    },
                    {
                        text: personal_contractor.specific_conditions || 'No hay condiciones especiales',
                        bold: false,
                        style: 'text'
                    },
                ],
                bold: false,
                style: 'text'
            }
        ];

        let data_signs = null
        let fullContent = content;
        // let fullContent: any = await this.set_data_contractFields(content, datosContrato, contratist_id).then((r: any) => {

        //     data_signs = r.data_signs;
        //     return r.model;

        // });

        let model: any = {

            contract_id: numberContractId,
            modelContract: {
                content: fullContent,
                styles: this.stylesContract,
                defaultStyle: {
                    columnGap: 20,
                },
                watermark: { text: 'Prevista de contrato', color: 'blue', opacity: 0.1, bold: true, italics: false }
            },
            data_signs: data_signs

        }

        _Response = {
            ok: true,
            statusCode: 200,
            data: {
                model: model
            },
            message: 'Modelo de contrato generado'
        }

        return _Response;

    }

}