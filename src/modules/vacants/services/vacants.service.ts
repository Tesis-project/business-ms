

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Vacant_Ety } from '../entities/vacant.entity';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { EntityManager } from '@mikro-orm/core';
import { ExceptionsHandler } from '../../../core/helpers';
import { Create_Vacant_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto/Create-vacant.dto';
import { Vacant_Repository } from '../entities/vacant.repository.service';
import { RpcException } from '@nestjs/microservices';

import { Search_Vacant_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto';
import { Vacants_Enum } from '@tesis-project/dev-globals/dist/modules/business/vacants/interfaces';

import { Create_Media_Dto } from '@tesis-project/dev-globals/dist/modules/media/dto';
import { Media_I, Media_Reference_Enum, Media_Type_Enum } from '@tesis-project/dev-globals/dist/modules/media/interfaces';

import * as uuid from 'uuid';
import { MediaService_GW } from '../../gateways/media';
import { Artist_Enum } from '@tesis-project/dev-globals/dist/modules/profile/interfaces';
import { UserService_GW } from '../../gateways/user/user-GW.service';
import { User_I } from '@tesis-project/dev-globals/dist/modules/user/interfaces';

@Injectable()
export class VacantsService {

    service: string = "VacantsService";

    private readonly logger = new Logger(this.service);
    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _Vacant_Repository: Vacant_Repository,
        private readonly _MediaService_GW: MediaService_GW,
        private readonly _UserService_GW: UserService_GW,
        private readonly em: EntityManager,
    ) {

    }

    async set_vacant_pic(vacant_id: string, file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Media_I>> {

        let _Response: _Response_I<Media_I>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.VACANT_PIC,
            type: Media_Type_Enum.IMAGE,
            reference_id: vacant_id
        };

        _Response = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);

        return _Response;

    }

    async create_vacant(file: Express.Multer.File, createVacantDto: Create_Vacant_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Ety>> {

        let _Response: _Response_I<Vacant_Ety>;

        try {

            const f_em = this.em.fork();

            const vacant_id: string = uuid.v4();

            let aux_vacant: Partial<Vacant_Ety> = {
                ...createVacantDto,
                _id: vacant_id,
                owner: user_auth.user
            }

            if (file) {

                const media_pic: _Response_I<Media_I> = await this.set_vacant_pic(vacant_id, file, user_auth);
                if (media_pic.statusCode === 201) {

                    aux_vacant = {
                        ...aux_vacant,
                        vacant_pic: {
                            _id: media_pic.data._id
                        }
                    };

                }

            }

            let new_vacant = await this._Vacant_Repository.create_Vacant({
                save: aux_vacant,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                message: 'Vacant created successfully',
                ok: true,
                statusCode: 201,
                data: new_vacant,
            };

        } catch (error) {

            this.logger.error(`[Create vacant] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.create_vacant`);

        }

        return _Response;

    }

    async delete_one(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Ety>> {

        let _Response: _Response_I<Vacant_Ety>;

        try {

            const f_em = this.em.fork();

            const vacant = await this._Vacant_Repository.findOne({
                _id,
                owner: user_auth.user
            });

            if (!vacant) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Vacante no encontrado'
                }
                throw new RpcException(_Response)
            }

            await this._Vacant_Repository.delete_Vacant({
                find: vacant,
                _em: f_em
            })

            f_em.flush();

            _Response = {
                message: 'Vacant deleted successfully',
                ok: true,
                statusCode: 200,
                data: null
            };

        } catch (error) {

            this.logger.error(`[Delete vacant] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.delete_one`);

        }

        return _Response;

    }



    async get_one_vacant(_id: string): Promise<_Response_I<Vacant_Ety>> {

        let _Response: _Response_I<Vacant_Ety>;

        try {

            let vacant = await this._Vacant_Repository.findOne({
                _id
            },
                {
                    populate: [
                        'postulations'
                    ],
                    refresh: true
                },

            );

            if (!vacant) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Vacante no encontrado'
                }
                throw new RpcException(_Response)
            }

            const user = await this._UserService_GW.get_user(vacant.owner);

            if (vacant.vacant_pic?._id) {
                const vacant_pic = await this._MediaService_GW.get_mediaMeta(vacant.vacant_pic?._id);
                if (vacant_pic.data) {
                    vacant.vacant_pic = {
                        ...vacant_pic.data
                    }
                }
            }

            vacant = {
                ...vacant,
                owner: {
                    ...user.data
                } as User_I
            }

            vacant.postulations = vacant.postulations.map(r => r);

            if(vacant.postulations && vacant.postulations.length > 0){

                   for (const [i, element] of vacant.postulations.entries()) {
                    const user_postulant = await this._UserService_GW.get_user(element.user_postulate);
                    vacant.postulations[i] = {
                        ...element,
                        user_postulate: {
                            ...user_postulant.data
                        } as User_I
                    }
                }

            }

            _Response = {
                message: 'Vacant found successfully',
                ok: true,
                statusCode: 200,
                data: {
                    ...vacant,
                },
            };

        } catch (error) {

            this.logger.error(`[Get one vacant] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_one_vacant`);

        }

        return _Response;

    }

    async get_all_own(user_auth: Auth_User_I_Dto): Promise<_Response_I<Vacant_Ety[]>> {

        let _Response: _Response_I<Vacant_Ety[]>;

        try {

            const f_em = this.em.fork();

            const vacant = await this._Vacant_Repository.findAll({
                where: {
                    owner: user_auth.user,
                }
            })

            if (!vacant) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.OK,
                    message: 'Vacantes no encontradas'
                }
                throw new RpcException(_Response)
            }

            _Response = {
                message: 'Vacants found successfully',
                ok: true,
                statusCode: 200,
                data: vacant,
            };

        } catch (error) {

            this.logger.error(`[Get all own vacant] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_all_own`);

        }

        return _Response;

    }



    async get_all_public(Search_Vacant_Dto: Search_Vacant_Dto): Promise<_Response_I<Vacant_Ety[]>> {

        let _Response: _Response_I<Vacant_Ety[]>;

        const { type } = Search_Vacant_Dto;

        try {

            const f_em = this.em.fork();

            let vacant = await this._Vacant_Repository.findAll({
                where: {
                    status: Vacants_Enum.OPEN,
                },
                populate: [
                    'postulations'
                ]
            })

            if (type != Artist_Enum.ALL) {
                vacant = vacant.filter(v => v.role_type.includes(type));
            }

            for (const [i, element] of vacant.entries()) {

                if (element.vacant_pic?._id) {
                    const vacant_pic = await this._MediaService_GW.get_mediaMeta(element.vacant_pic?._id);
                    if (vacant_pic.data) {
                        element.vacant_pic = {
                            ...vacant_pic.data
                        }
                    }
                }

            }

            if (!vacant || vacant.length === 0) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.OK,
                    message: 'Vacantes no encontradas'
                }
                throw new RpcException(_Response)
            }

            _Response = {
                message: 'Vacants found successfully',
                ok: true,
                statusCode: 200,
                data: vacant,
            };

        } catch (error) {

            this.logger.error(`[Get all public vacant] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_all_public`);

        }

        return _Response;

    }

}
