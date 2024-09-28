import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Create_PlanningContract_Dto } from '@tesis-project/dev-globals/dist/modules/business/contracts/dto/Create-PlanningContract.dto';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Update_DetailsContract_Dto } from '@tesis-project/dev-globals/dist/modules/business/contracts/dto/Update-DetailsContract.dto';
import { UserService_GW } from '../../gateways/user/user-GW.service';
import { MediaService_GW } from '../../gateways/media';
import { EntityManager } from '@mikro-orm/core';
import { ExceptionsHandler } from '../../../core/helpers';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { Vacant_Postulations_Ety } from '../../vacants/entities/postulations.entity';
import { RpcException } from '@nestjs/microservices';
import { Contract_Repository } from '../entities/contracts.repository.service';
import * as uuid from 'uuid';
import { Contract_Details_Status_Payment_Enum, Contract_DetailType_Enum, Contract_Status_Enum } from '@tesis-project/dev-globals/dist/modules/business/contracts/interfaces';
import { TempoHandler } from '@tesis-project/dev-globals/dist/core/classes';
import { User_I } from '@tesis-project/dev-globals/dist/modules/user/interfaces';
import { Contract_Ety } from '../entities/contract.entity';
import { Vacant_Ety } from '../../vacants/entities/vacant.entity';
import { ContractsHelpersService } from './contracts.helpers';

@Injectable()
export class ContractsService {

    service: string = "ContractsService";
    private readonly logger = new Logger(this.service);
    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _MediaService_GW: MediaService_GW,
        private readonly _UserService_GW: UserService_GW,
        private readonly _Contracts_Repository: Contract_Repository,
        private readonly _ContractsHelpersService: ContractsHelpersService,
        private readonly em: EntityManager,
    ) {

    }

    async create(body: Create_PlanningContract_Dto, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I<Contract_Ety>;

        const { postulation_id } = body;

        try {

            const f_em = this.em.fork();
            const postulation_repository = f_em.getRepository(Vacant_Postulations_Ety);

            const postulation = await postulation_repository.findOne(
                {
                    _id: postulation_id,
                    vacant: {
                        owner: user_auth.user
                    }
                },
                {
                    populate: [
                        'vacant',
                        'vacant.contract'
                    ]
                }
            );

            if (!postulation) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Postulación de no encontrada'
                }
                throw new RpcException(_Response)
            }

            const vacant: Vacant_Ety = postulation.vacant;

            if (vacant.contract != null) {

                _Response = {
                    ok: true,
                    data: vacant.contract,
                    statusCode: HttpStatus.OK,
                    message: 'La vacante ya tiene un contrato creado',

                }
                throw new RpcException(_Response)

            }

            const contract_id: string = uuid.v4();

            const aux_contract: Partial<Contract_Ety> = {
                _id: contract_id,
                vacant: vacant,
                details: null,
                status: Contract_Status_Enum.PLANNING,
                contratist: {
                    user: user_auth.user,
                    signed: true,
                    signed_at: new TempoHandler().date_now() as any
                },
                contractor: {
                    user: postulation.user_postulate,
                    signed: false,
                    signed_at: null
                }
            }

            const new_contract = await this._Contracts_Repository.create_contract({
                save: aux_contract,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Vacant created successfully',
                ok: true,
                statusCode: 201,
                data: new_contract,
            };

        } catch (error) {

            this.logger.error(`[Create contract] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.create`);

        }

        return _Response;

    }

    async update_details(_id: string, body: Update_DetailsContract_Dto, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I<Contract_Ety>;

        const {
            type,
            payment_account
        } = body;

        try {

            const f_em = this.em.fork();
           let contract = await this._Contracts_Repository.findOne({
                _id,
                 contratist: {
                    user: user_auth.user
                }

            },
                {
                    populate: [
                        'vacant',
                    ],
                },
            );

                if (!contract) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Contrato no encontrado'
                }
                throw new RpcException(_Response)
            }

            if (contract.contratist.user !== user_auth.user) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Usuario no contratista'
                }
                throw new RpcException(_Response)
            }

            if (type === Contract_DetailType_Enum.PAYMENT_INFO) {

                const { data: aux_bankInfo } = await this._UserService_GW.get_bankInfo(payment_account);
                aux_bankInfo && (contract.details = {
                    payment_info: { ...aux_bankInfo },
                    status_payment: Contract_Details_Status_Payment_Enum.PENDING,
                    payment_at: null,
                })

            }

            if (type === Contract_DetailType_Enum.SET_PAYMENT) {
                contract.details = {
                    ...contract.details,
                    status_payment: Contract_Details_Status_Payment_Enum.PAID,
                    payment_at: new TempoHandler().date_now() as any
                }
            }

            const updated_contract = await this._Contracts_Repository.update_contract({
                find: {
                    _id: _id
                },
                update: {
                    ...contract
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Contract details updated successfully',
                ok: true,
                statusCode: 200,
                data: updated_contract,
            };

        } catch (error) {

            this.logger.error(`[Update details contract] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.update_details`);

        }

        return _Response;

    }

    async accept(_id: string, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I<Contract_Ety>;

        try {

            const f_em = this.em.fork();

            let contract = await this._Contracts_Repository.findOne({
                _id,
                contractor: {
                    user: user_auth.user
                }
            },
            );

            if (contract.contractor.user !== user_auth.user) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Usuario no contractor'
                }
                throw new RpcException(_Response)
            }

            const updated_contract = await this._Contracts_Repository.update_contract({
                find: {
                    _id: _id
                },
                update: {
                    ...contract,
                    contractor: {
                        ...contract.contractor,
                        signed: true,
                        signed_at: new TempoHandler().date_now() as any
                    },
                    status: Contract_Status_Enum.IN_PROGRESS
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Contract has been accepted successfully',
                ok: true,
                statusCode: 200,
                data: updated_contract,
            };

        } catch (error) {

            this.logger.error(`[Accepted contract] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.accept`);

        }

        return _Response;

    }

    async send_proposal(_id: string, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I<Contract_Ety>;

        try {

            const f_em = this.em.fork();
            let contract = await this._Contracts_Repository.findOne({
                _id,
                contratist: {
                    user: user_auth.user
                }
            },
            );

            if (!contract) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Contrato no encontrado'
                }
                throw new RpcException(_Response)
            }

            if (contract.status != Contract_Status_Enum.PLANNING) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Contrato fuera de planificación'
                }
                throw new RpcException(_Response)
            }

            contract = {
                ...contract,
                status: Contract_Status_Enum.SINGS_PENDING
            }

            const updated_contract = await this._Contracts_Repository.update_contract({
                find: {
                    _id: _id
                },
                update: {
                    ...contract
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Proposal sent successfully',
                ok: true,
                statusCode: 200,
                data: null
            };

        } catch (error) {

            this.logger.error(`[Proposal sent] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.send_proposal`);

        }

        return _Response;

    }

    async get_one(_id: string, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I<Contract_Ety>;

        try {

            let contract = await this._Contracts_Repository.findOne({
                _id,
                $or: [
                    {
                        contratist: {
                            user: user_auth.user
                        }
                    },
                    {
                        contractor: {
                            user: user_auth.user
                        }
                    }
                ],
            },
                {
                    populate: [
                        'vacant',
                    ],
                },
            );

            if (!contract) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Contrato no encontrado'
                }
                throw new RpcException(_Response)
            }

            const contractor = await this._UserService_GW.get_user(contract.contractor.user as string);

            const contratist = await this._UserService_GW.get_user(contract.contratist.user as string);

            contract = {
                ...contract,
                contractor: {
                    ...contract.contractor,
                    user: {
                        ...contractor.data
                    } as User_I
                },
                contratist: {
                    ...contract.contratist,
                    user: {
                        ...contratist.data
                    } as User_I
                },
            }

            _Response = {
                message: 'Contract found successfully',
                ok: true,
                statusCode: 200,
                data: {
                    ...contract,
                },
            };

        } catch (error) {

            this.logger.error(`[Get one contract] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_one`);

        }

        return _Response;

    }

    async get_all(user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I<Contract_Ety[]>;

        try {

            let contracts = await this._Contracts_Repository.findAll({
                where: {
                    $or: [
                        {
                            contratist: {
                                user: user_auth.user
                            }
                        },
                        {
                            contractor: {
                                user: user_auth.user
                            }
                        }
                    ],
                },
                populate: [
                    'vacant',
                ],
            },
            );

            if (!contracts || contracts.length === 0) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.OK,
                    message: 'Contratos no encontrados'
                }
                throw new RpcException(_Response)
            }

            for (const [i, item] of contracts.entries()) {

                const contractor = await this._UserService_GW.get_user(item.contractor.user as string);
                const contratist = await this._UserService_GW.get_user(item.contratist.user as string);

                contracts[i] = {
                    ...item,
                    contractor: {
                        ...item.contractor,
                        user: {
                            ...contractor.data
                        } as User_I
                    },
                    contratist: {
                        ...item.contratist,
                        user: {
                            ...contratist.data
                        } as User_I
                    },

                }

            }

            _Response = {
                message: 'Contracts found successfully',
                ok: true,
                statusCode: 200,
                data: contracts
            }

        } catch (error) {

            this.logger.error(`[Get all contract] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_all`);

        }

        return _Response;

    }

    async generate_doc(_id: string, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I;

           try {

            const contract = await this.get_one(_id, user_auth);

            const model = await this._ContractsHelpersService.getModel(contract.data);

            _Response = {
                message: 'Contract model successfully',
                ok: true,
                statusCode: 200,
                data: model.data
            };

        } catch (error) {

            this.logger.error(`[Generate document contract] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.generate_doc`);

        }

        return _Response;

    }

}
