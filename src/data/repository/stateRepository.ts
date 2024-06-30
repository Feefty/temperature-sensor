import { dataSource } from "../data-source";
import { State } from "../entity/sensor.state.entity";
import {IsNull, Not} from "typeorm";

export class StateRepository {
    private static instance: StateRepository;

    private constructor() {}

    static getInstance(): StateRepository {
        if (!StateRepository.instance) {
            StateRepository.instance = new StateRepository();
        }
        return StateRepository.instance;
    }

    async getState() {
        return dataSource.manager.getRepository(State).findOne({where:{id: Not(IsNull())}});
    }
}

const stateRepository = StateRepository.getInstance();
export default stateRepository;
