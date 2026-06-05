export class TemperatureSensor {
    id;
    value;
    state;
    created_at;
    constructor(id, value, state, created_at) {
        this.id = id;
        this.value = value;
        this.state = state;
        this.created_at = created_at;
    }
}
