

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { EntityManager } from '@mikro-orm/core';
import { ExceptionsHandler } from '../../../core/helpers';
import { Vacant_Repository } from '../entities/vacant.repository.service';
import { RpcException } from '@nestjs/microservices';

import { Vacant_Postulations_Repository } from '../entities/postulations.repository.service';

import { Create_Postulation_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto';
import { Vacant_Postulations_Ety } from '../entities/postulations.entity';
import { VacantsService } from './vacants.service';

import { Evaluate_Postulation_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto/Evaluate-postulation.dto';
import { UserService_GW } from '../../gateways/user/user-GW.service';

@Injectable()
export class VacantsPostulationsService {

    service: string = "VacantsPostulationsService";

    private readonly logger = new Logger(this.service);
    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _Vacant_Repository: Vacant_Repository,
        private readonly _VacantsService: VacantsService,
             private readonly _UserService_GW: UserService_GW,
        private readonly _Vacant_Postulations_Repository: Vacant_Postulations_Repository,
        private readonly em: EntityManager,
    ) {

    }

    async validate_notExistsPostulation(vacant_id: string, user_auth: Auth_User_I_Dto): Promise<boolean> {

        let aux_valid: boolean = false;

        try {

            const postulation = await this._Vacant_Postulations_Repository.findOne({
                vacant: {
                    _id: vacant_id
                },
                user_postulate: user_auth.user
            },
                    {
                    populate: [
                        'vacant'
                    ]
                }
            );

            if (postulation) {
                aux_valid = true;
            }

        } catch (error) {

            this.logger.error(`[Validate postulation] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.validate_notExistsPostulation`);

        }

        return aux_valid;

    }


    async create_postulation(vacant_id: string, Create_Postulation_Dto: Create_Postulation_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Postulations_Ety>> {

        let _Response: _Response_I<Vacant_Postulations_Ety>;

        try {

            const f_em = this.em.fork();

            const postulation_exists = await this.validate_notExistsPostulation(vacant_id, user_auth);
            if(postulation_exists) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Postulación ya existe'
                }
                throw new RpcException(_Response);
            }

            const { data: vacant } = await this._VacantsService.get_one_vacant(vacant_id);

            const new_postulation = await this._Vacant_Postulations_Repository.create_VacantPostulation({
                save: {
                    ...Create_Postulation_Dto,
                    user_postulate: user_auth.user,
                    vacant: vacant._id as any
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Vacant postulation created successfully',
                ok: true,
                statusCode: 201,
                data: new_postulation,
            };

        } catch (error) {

            this.logger.error(`[Create vacant postulation] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.create_postulation`);

        }

        return _Response;

    }

    async evaluate_postulation(_id: string, Evaluate_Postulation_Dto: Evaluate_Postulation_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Postulations_Ety>> {

        let _Response: _Response_I<Vacant_Postulations_Ety>;

        const {
            owner_comment,
            status
        } = Evaluate_Postulation_Dto;

        try {

            const f_em = this.em.fork();
            const user: string = user_auth.user;

            let postulation = await this._Vacant_Postulations_Repository.findOne({
                _id,
                vacant: {
                    owner: user
                }
            },
                {
                    populate: [
                        'vacant'
                    ]
                }
            );

            if(!postulation) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Postulación no encontrada'
                }
                throw new RpcException(_Response);
            }

            postulation = await this._Vacant_Postulations_Repository.update_VacantPostulation({
                find: postulation,
                update: {
                    owner_comment: owner_comment || '',
                    status
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Postulation evaluated successfully',
                ok: true,
                statusCode: 200,
                data: postulation,
            };

        } catch (error) {

            this.logger.error(`[Evaluate postulation] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.evaluate_postulation`);

        }

        return _Response;

    }

    async delete_one(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Postulations_Ety>> {

        let _Response: _Response_I<Vacant_Postulations_Ety>;

        try {

            const f_em = this.em.fork();
            const user: string = user_auth.user;

            const postulation = await this._Vacant_Postulations_Repository.findOne({
                _id,
                $or: [
                    {
                        user_postulate: user,
                    },
                    {
                        vacant: {
                            owner: user
                        }
                    }
                ]
            },
                {
                    populate: [
                        'vacant'
                    ]
                }
            );

            if (!postulation) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Postulación no encontrado'
                }
                throw new RpcException(_Response)
            }

            await this._Vacant_Postulations_Repository.delete_VacantPostulation({
                find: postulation,
                _em: f_em
            })

            f_em.flush();

            _Response = {
                message: 'Postulation deleted successfully',
                ok: true,
                statusCode: 200,
                data: null
            };

        } catch (error) {

            this.logger.error(`[Delete Postulation] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.delete_one`);

        }

        return _Response;

    }

    async get_byVacants(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Postulations_Ety[]>> {

        let _Response: _Response_I<Vacant_Postulations_Ety[]>;

        try {

            const f_em = this.em.fork();
            const user: string = user_auth.user;

            const postulations = await this._Vacant_Postulations_Repository.findAll({
                where: {
                    vacant: {
                        _id: _id,
                    },
                    $or: [
                        {
                            user_postulate: user,
                        },
                        {
                            vacant: {
                                owner: user
                            }
                        }
                    ]
                },
                populate: [
                    'vacant'
                ]
            },
            );

            if (!postulations || postulations.length === 0) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.OK,
                    message: 'Postulaciones no encontradas'
                }
                throw new RpcException(_Response)
            }

            // for  of object) {

            // }

            //   const user_postulant = await this._UserService_GW.get_user(vacant.owner);

            _Response = {
                message: 'Postulaciones found successfully',
                ok: true,
                statusCode: 200,
                data: postulations,
            };

        } catch (error) {

            this.logger.error(`[Get all postulations vacant] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_byVacants`);

        }

        return _Response;

    }



}
